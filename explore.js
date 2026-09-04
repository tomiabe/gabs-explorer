(function () {
  "use strict";

  var places = window.GABS_PLACES || [];
  var state = { query: "", category: "all", area: "all", intent: "", sorted: false, saved: loadSaved() };
  var moments = ["Date night", "Slow morning", "Family day", "Culture", "Outdoor escape", "Night out", "Local food"];
  var grid = document.getElementById("explore-place-grid");
  var summary = document.getElementById("explore-summary");
  var savedGrid = document.getElementById("saved-grid");
  var savedEmpty = document.getElementById("saved-empty");
  var savedCount = document.getElementById("saved-count");
  var toast = document.getElementById("toast");
  var toastTimer;

  function loadSaved() {
    try { return new Set(JSON.parse(localStorage.getItem("gaborone-explorer-saved") || "[]")); } catch (error) { return new Set(); }
  }

  function persistSaved() { localStorage.setItem("gaborone-explorer-saved", JSON.stringify(Array.from(state.saved))); }

  function escapeHtml(value) {
    return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;");
  }

  function iconForCategory(category) {
    return { "Eat and drink": "fork-knife", Outdoors: "leaf", Culture: "buildings", Shopping: "shopping-bag-open" }[category] || "map-pin";
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { toast.classList.remove("is-visible"); }, 2600);
  }

  function matches(place) {
    var text = [place.name, place.category, place.type, place.area, place.fit, place.description].concat(place.tags, place.intents).join(" ").toLowerCase();
    return (!state.query || text.indexOf(state.query.toLowerCase()) !== -1) &&
      (state.category === "all" || place.category === state.category) &&
      (state.area === "all" || place.area === state.area) &&
      (!state.intent || place.intents.indexOf(state.intent) !== -1);
  }

  function cardMarkup(place) {
    var saved = state.saved.has(place.id);
    return "<article class=\"place-card\">" +
      "<div class=\"place-image\"><img src=\"" + escapeHtml(place.image) + "\" alt=\"" + escapeHtml(place.name) + " in " + escapeHtml(place.area) + "\" loading=\"lazy\" />" +
      "<span class=\"place-type\"><i class=\"ph ph-" + iconForCategory(place.category) + "\" aria-hidden=\"true\"></i> " + escapeHtml(place.type) + "</span>" +
      "<button class=\"save-button" + (saved ? " is-saved" : "") + "\" type=\"button\" data-save=\"" + escapeHtml(place.id) + "\" aria-label=\"" + (saved ? "Remove " : "Save ") + escapeHtml(place.name) + "\" aria-pressed=\"" + saved + "\"><i class=\"ph ph-bookmark-simple" + (saved ? "-fill" : "") + "\" aria-hidden=\"true\"></i></button></div>" +
      "<div class=\"place-body\"><div class=\"place-heading-row\"><h3>" + escapeHtml(place.name) + "</h3></div><p class=\"place-location\"><i class=\"ph ph-map-pin\" aria-hidden=\"true\"></i> " + escapeHtml(place.area) + "</p><p class=\"place-description\">" + escapeHtml(place.description) + "</p><div class=\"place-tags\">" + place.tags.map(function (tag) { return "<span class=\"place-tag\">" + escapeHtml(tag) + "</span>"; }).join("") + "</div><div class=\"place-action\"><span class=\"place-fit\">" + escapeHtml(place.fit) + "</span><a class=\"place-link\" href=\"place.html?place=" + encodeURIComponent(place.id) + "\">View place <i class=\"ph ph-arrow-up-right\" aria-hidden=\"true\"></i></a></div></div></article>";
  }

  function bindSaveButtons(scope) {
    scope.querySelectorAll("[data-save]").forEach(function (button) {
      button.addEventListener("click", function () {
        var id = button.getAttribute("data-save");
        if (state.saved.has(id)) { state.saved.delete(id); showToast("Removed from your saved places."); } else { state.saved.add(id); showToast("Saved for later."); }
        persistSaved(); render();
      });
    });
  }

  function renderMoments() {
    var holder = document.getElementById("moment-chips");
    holder.innerHTML = moments.map(function (moment) { return "<button class=\"moment-chip" + (state.intent === moment ? " is-active" : "") + "\" type=\"button\" data-moment=\"" + escapeHtml(moment) + "\">" + escapeHtml(moment) + "</button>"; }).join("");
    holder.querySelectorAll("[data-moment]").forEach(function (button) {
      button.addEventListener("click", function () { state.intent = state.intent === button.getAttribute("data-moment") ? "" : button.getAttribute("data-moment"); render(); });
    });
  }

  function render() {
    var result = places.filter(matches);
    if (state.sorted) result = result.slice().reverse();
    summary.textContent = "Showing " + result.length + " place" + (result.length === 1 ? "" : "s") + (state.intent ? " for " + state.intent.toLowerCase() : "");
    grid.innerHTML = result.length ? result.map(cardMarkup).join("") : "<div class=\"empty-results\"><i class=\"ph ph-magnifying-glass\" aria-hidden=\"true\"></i><p>No places match that yet. Try a different mood or area.</p></div>";
    savedCount.textContent = state.saved.size;
    savedCount.hidden = state.saved.size === 0;
    var savedPlaces = places.filter(function (place) { return state.saved.has(place.id); });
    savedEmpty.hidden = savedPlaces.length > 0;
    savedGrid.hidden = savedPlaces.length === 0;
    savedGrid.innerHTML = savedPlaces.map(cardMarkup).join("");
    bindSaveButtons(grid); bindSaveButtons(savedGrid); renderMoments();
  }

  document.getElementById("explore-query").addEventListener("input", function (event) { state.query = event.target.value.trim(); render(); });
  document.getElementById("explore-category").addEventListener("change", function (event) { state.category = event.target.value; render(); });
  document.getElementById("explore-area").addEventListener("change", function (event) { state.area = event.target.value; render(); });
  document.getElementById("explore-sort").addEventListener("click", function (event) { state.sorted = !state.sorted; event.currentTarget.setAttribute("aria-pressed", String(state.sorted)); event.currentTarget.innerHTML = state.sorted ? "<i class=\"ph ph-arrows-down-up\" aria-hidden=\"true\"></i> Fresh perspective" : "<i class=\"ph ph-arrows-down-up\" aria-hidden=\"true\"></i> Curated order"; render(); });
  document.getElementById("explore-reset").addEventListener("click", function () { state.query = ""; state.category = "all"; state.area = "all"; state.intent = ""; document.getElementById("explore-query").value = ""; document.getElementById("explore-category").value = "all"; document.getElementById("explore-area").value = "all"; render(); });

  var menuToggle = document.querySelector(".menu-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  menuToggle.addEventListener("click", function () { var open = menuToggle.getAttribute("aria-expanded") === "true"; menuToggle.setAttribute("aria-expanded", String(!open)); menuToggle.innerHTML = open ? "<i class=\"ph ph-list\" aria-hidden=\"true\"></i>" : "<i class=\"ph ph-x\" aria-hidden=\"true\"></i>"; mobileNav.hidden = open; });
  mobileNav.querySelectorAll("a").forEach(function (link) { link.addEventListener("click", function () { menuToggle.setAttribute("aria-expanded", "false"); menuToggle.innerHTML = "<i class=\"ph ph-list\" aria-hidden=\"true\"></i>"; mobileNav.hidden = true; }); });
  document.querySelector(".mobile-nav-close").addEventListener("click", function () { menuToggle.setAttribute("aria-expanded", "false"); menuToggle.innerHTML = "<i class=\"ph ph-list\" aria-hidden=\"true\"></i>"; mobileNav.hidden = true; menuToggle.focus(); });
  render();
})();
