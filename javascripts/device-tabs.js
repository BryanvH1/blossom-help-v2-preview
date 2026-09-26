/* Desktop / Phone content tabs.
   Material links tabs by label across the site and remembers the reader's
   choice (content.tabs.link), stored through its __md_get / __md_set helpers
   as an array of labels under a site-scoped key.

   This does two things after Material has mounted the page (document$):
   1. On a reader's first visit, pick the starting tab by screen width —
      Phone under 720px, Desktop otherwise — and store it the way Material
      does, so every later page agrees. Once the reader taps a tab, Material
      overwrites it and this steps aside.
   2. Fire a change event on the selected input. Material only moves the
      underline indicator on change, so a tab restored from storage otherwise
      shows the right content under the wrong underline. */
(function () {
  window.__deviceTabs = "5";                                 /* build marker, for checking what a browser loaded */
  var PHONE = "(max-width: 44.9375em)";
  var canStore = typeof __md_get === "function" && typeof __md_set === "function";
  try { localStorage.removeItem("__tabs"); } catch (e) {}   /* key from the first build */

  function labelOf(input) {
    var label = document.querySelector('label[for="' + input.id + '"]');
    return label ? label.textContent.trim() : "";
  }

  /* Material draws the underline by setting --md-indicator-x / -width on the
     set, but only once its own observers have fired, which on a fresh page
     does not happen until the reader scrolls. Until then the underline sits
     under the first tab even when another tab's content is showing. So set
     the same two properties ourselves from the checked label; Material
     overwrites them with identical values when it catches up. */
  function drawIndicator(set) {
    var input = set.querySelector(":scope > input:checked");
    var label = input && document.querySelector('label[for="' + input.id + '"]');
    if (!label) return;
    set.style.setProperty("--md-indicator-x", label.offsetLeft + "px");
    set.style.setProperty("--md-indicator-width", label.getBoundingClientRect().width + "px");
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function nudge(attempt) {
    document.querySelectorAll(".tabbed-set").forEach(drawIndicator);
    if (attempt < 5) setTimeout(function () { nudge(attempt + 1); }, 200);   /* fonts settle */
  }

  function apply() {
    var stored = null;
    try { stored = canStore ? __md_get("__tabs") : null; } catch (e) {}
    if (!(Array.isArray(stored) && stored.length)) {
      var want = window.matchMedia(PHONE).matches ? "Phone" : "Desktop";
      try { if (canStore) __md_set("__tabs", [want]); } catch (e) {}
      document.querySelectorAll(".tabbed-set").forEach(function (set) {
        Array.prototype.forEach.call(set.children, function (el) {
          if (el.tagName === "INPUT" && labelOf(el) === want) el.checked = true;
        });
      });
    }
    nudge(0);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }
})();
