/* Desktop / Phone content tabs.
   Material already links tabs by label across the site and remembers the
   reader's choice (content.tabs.link), stored through its own __md_get /
   __md_set helpers as an array of labels under a site-scoped key. This only
   picks the starting tab: Phone on a phone-sized screen, Desktop otherwise,
   written through the same helpers so every later page agrees. Once the
   reader taps a tab themselves, Material overwrites it and this steps aside. */
(function () {
  var want = window.matchMedia("(max-width: 44.9375em)").matches ? "Phone" : "Desktop";
  var canStore = typeof __md_get === "function" && typeof __md_set === "function";
  try { localStorage.removeItem("__tabs"); } catch (e) {}   /* key from the first build */
  var stored = null;
  try { stored = canStore ? __md_get("__tabs") : null; } catch (e) {}
  if (Array.isArray(stored) && stored.length) return;       /* Material will apply it */
  try { if (canStore) __md_set("__tabs", [want]); } catch (e) {}
  document.querySelectorAll(".tabbed-set > input").forEach(function (input) {
    var label = document.querySelector('label[for="' + input.id + '"]');
    if (label && label.textContent.trim() === want) input.checked = true;
  });
})();
