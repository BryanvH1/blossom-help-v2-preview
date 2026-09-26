/* Desktop / Phone content tabs.
   Material already links tabs by label across the site and remembers the
   choice (content.tabs.link). This only picks the starting tab: Phone on a
   phone-sized screen, Desktop otherwise — and only until the reader chooses
   for themselves, which Material then remembers. */
(function () {
  var KEY = "__tabs";                         // Material's own storage key
  var PHONE = window.matchMedia("(max-width: 44.9375em)").matches;
  var want = PHONE ? "Phone" : "Desktop";
  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) {}
  if (stored) return;                         // reader already chose
  try { localStorage.setItem(KEY, JSON.stringify({ "device": want })); } catch (e) {}
  // Material reads the key on load; select the tab now for this first paint.
  document.querySelectorAll(".tabbed-set[data-tabs] > input").forEach(function (input) {
    var label = document.querySelector('label[for="' + input.id + '"]');
    if (label && label.textContent.trim() === want) input.checked = true;
  });
})();
