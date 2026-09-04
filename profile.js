(function () {
  "use strict";

  var places = window.GABS_PLACES || [];
  var placeId = new URLSearchParams(window.location.search).get("place");
  var place = places.filter(function (item) { return item.id === placeId; })[0] || places[0];
  var root = document.getElementById("profile-root");
  var saved = loadSaved();
  var toast = document.getElementById("toast");
  var toastTimer;

  function loadSaved() { try { return new Set(JSON.parse(localStorage.getItem("gaborone-explorer-saved") || "[]")); } catch (error) { return new Set(); } }
  function persistSaved() { localStorage.setItem("gaborone-explorer-saved", JSON.stringify(Array.from(saved))); }
  function escapeHtml(value) { return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;"); }
  function showToast(message) { toast.textContent = message; toast.classList.add("is-visible"); window.clearTimeout(toastTimer); toastTimer = window.setTimeout(function () { toast.classList.remove("is-visible"); }, 2600); }
  function findPlaceByName(name) { return places.filter(function (item) { return item.name === name; })[0]; }
  function directionsUrl(query) { return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query); }

  function nearbyMarkup(name) {
    var nearby = findPlaceByName(name);
    if (!nearby) return "";
    return "<a class=\"nearby-card\" href=\"place.html?place=" + encodeURIComponent(nearby.id) + "\"><span><i class=\"ph ph-arrow-up-right\" aria-hidden=\"true\"></i></span><strong>" + escapeHtml(nearby.name) + "</strong><small>" + escapeHtml(nearby.fit) + "</small></a>";
  }

  function profileMarkup(item) {
    var profile = item.profile;
    var isSaved = saved.has(item.id);
    return "<section class=\"profile-hero\" aria-labelledby=\"profile-title\"><div class=\"container profile-hero-inner\"><a class=\"back-link back-link-light\" href=\"explore.html\"><i class=\"ph ph-arrow-left\" aria-hidden=\"true\"></i> Explore places</a><div class=\"profile-hero-content\"><h1 id=\"profile-title\">" + escapeHtml(item.name) + "</h1><p class=\"profile-type\">" + escapeHtml(item.type) + " <span>•</span> " + escapeHtml(item.area) + " <span>•</span> " + escapeHtml(item.fit) + "</p><div class=\"profile-actions\"><button class=\"profile-save\" type=\"button\" id=\"profile-save\" aria-pressed=\"" + isSaved + "\"><i class=\"ph ph-bookmark-simple" + (isSaved ? "-fill" : "") + "\" aria-hidden=\"true\"></i> " + (isSaved ? "Saved" : "Save this place") + "</button><a class=\"profile-directions\" href=\"" + directionsUrl(item.mapQuery) + "\" target=\"_blank\" rel=\"noreferrer\"><i class=\"ph ph-navigation-arrow\" aria-hidden=\"true\"></i> Directions</a></div></div></div></section>" +
      "<section class=\"container profile-layout\"><article class=\"profile-primary\"><p class=\"profile-verdict\">" + escapeHtml(profile.verdict) + "</p><div class=\"profile-facts\"><div><i class=\"ph ph-map-pin\" aria-hidden=\"true\"></i><span>Area</span><strong>" + escapeHtml(item.area) + "</strong></div><div><i class=\"ph ph-users-three\" aria-hidden=\"true\"></i><span>Good for</span><strong>" + escapeHtml(profile.bestFor) + "</strong></div><div><i class=\"ph ph-sun\" aria-hidden=\"true\"></i><span>Best time</span><strong>" + escapeHtml(profile.bestTime) + "</strong></div><div><i class=\"ph ph-currency-circle-dollar\" aria-hidden=\"true\"></i><span>Price guide</span><strong>" + escapeHtml(profile.priceGuide) + "</strong></div></div><section class=\"profile-reading\"><h2>The local read</h2><p>" + escapeHtml(profile.note) + "</p></section><section class=\"profile-reading\"><h2>Before you go</h2><p>" + escapeHtml(profile.practical) + "</p></section></article><aside class=\"profile-sidebar\"><div class=\"profile-plan\"><h2>Start here. Keep going.</h2><p>" + escapeHtml(item.name) + " is even better when it has a next stop.</p><ol><li><b>Start</b><span>" + escapeHtml(item.name) + "</span></li><li><b>Then</b><span>Choose one nearby place that suits the mood.</span></li><li><b>Finish</b><span>Leave room for something unplanned.</span></li></ol></div><a class=\"profile-update\" href=\"mailto:hello@gaboroneexplorer.com?subject=" + encodeURIComponent("Update for " + item.name) + "\"><i class=\"ph ph-pencil-simple\" aria-hidden=\"true\"></i><span><strong>Know something we should update?</strong><small>Help keep this place useful.</small></span><i class=\"ph ph-arrow-up-right\" aria-hidden=\"true\"></i></a></aside></section><section class=\"container nearby-section\"><div class=\"section-heading\"><div><h2>Keep the day moving.</h2><p>Good next stops from the same part of the city.</p></div><span class=\"section-mark\" aria-hidden=\"true\">02</span></div><div class=\"nearby-grid\">" + profile.nearby.map(nearbyMarkup).join("") + "</div></section>";
  }

  if (!place) {
    root.innerHTML = "<section class=\"container empty-profile\"><h1>That place is not in this guide yet.</h1><a class=\"text-button\" href=\"explore.html\">Explore places <i class=\"ph ph-arrow-right\" aria-hidden=\"true\"></i></a></section>";
    return;
  }

  document.title = place.name + " | Gaborone Explorer";
  root.innerHTML = profileMarkup(place);
  var hero = root.querySelector(".profile-hero");
  hero.style.backgroundImage = "url(\"" + place.image + "\")";
  var savedCount = document.getElementById("saved-count");
  savedCount.textContent = saved.size;
  savedCount.hidden = saved.size === 0;
  document.getElementById("profile-save").addEventListener("click", function (event) { var button = event.currentTarget; if (saved.has(place.id)) { saved.delete(place.id); showToast("Removed from your saved places."); } else { saved.add(place.id); showToast("Saved for later."); } persistSaved(); button.setAttribute("aria-pressed", String(saved.has(place.id))); button.innerHTML = "<i class=\"ph ph-bookmark-simple" + (saved.has(place.id) ? "-fill" : "") + "\" aria-hidden=\"true\"></i> " + (saved.has(place.id) ? "Saved" : "Save this place"); savedCount.textContent = saved.size; savedCount.hidden = saved.size === 0; });
  var menuToggle = document.querySelector(".menu-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  menuToggle.addEventListener("click", function () { var open = menuToggle.getAttribute("aria-expanded") === "true"; menuToggle.setAttribute("aria-expanded", String(!open)); menuToggle.innerHTML = open ? "<i class=\"ph ph-list\" aria-hidden=\"true\"></i>" : "<i class=\"ph ph-x\" aria-hidden=\"true\"></i>"; mobileNav.hidden = open; });
  mobileNav.querySelectorAll("a").forEach(function (link) { link.addEventListener("click", function () { menuToggle.setAttribute("aria-expanded", "false"); menuToggle.innerHTML = "<i class=\"ph ph-list\" aria-hidden=\"true\"></i>"; mobileNav.hidden = true; }); });
  document.querySelector(".mobile-nav-close").addEventListener("click", function () { menuToggle.setAttribute("aria-expanded", "false"); menuToggle.innerHTML = "<i class=\"ph ph-list\" aria-hidden=\"true\"></i>"; mobileNav.hidden = true; menuToggle.focus(); });
})();
