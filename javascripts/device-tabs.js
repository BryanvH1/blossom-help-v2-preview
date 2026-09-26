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
  window.__deviceTabs = "3";                                 /* build marker, for checking what a browser loaded */
  var PHONE = "(max-width: 44.9375em)";
  var canStore = typeof __md_get === "function" && typeof __md_set === "function";
  try { localStorage.removeItem("__tabs"); } catch (e) {}   /* key from the first build */

  function labelOf(input) {
    var label = document.querySelector('label[for="' + input.id + '"]');
    return label ? label.textContent.trim() : "";
  }

  function apply() {
    var stored = null;
    try { stored = canStore ? __md_get("__tabs") : null; } catch (e) {}
    var want = null;
    if (!(Array.isArray(stored) && stored.length)) {
      want = window.matchMedia(PHONE).matches ? "Phone" : "Desktop";
      try { if (canStore) __md_set("__tabs", [want]); } catch (e) {}
    }
    document.querySelectorAll(".tabbed-set").forEach(function (set) {
      var inputs = Array.prototype.slice.call(set.children).filter(function (el) { return el.tagName === "INPUT"; });
      var pick = null;
      if (want) pick = inputs.filter(function (i) { return labelOf(i) === want; })[0] || null;
      if (!pick) pick = inputs.filter(function (i) { return i.checked; })[0] || null;
      if (!pick) return;
      pick.checked = true;
      pick.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }

  if (typeof document$ !== "undefined" && document$ && typeof document$.subscribe === "function") {
    document$.subscribe(function () { setTimeout(apply, 0); });
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }
})();
