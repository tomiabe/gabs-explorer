(function () {
  "use strict";

  var places = window.GABS_PLACES || [];
  var heroRoutes = [
    {
      title: "A slower Saturday in Gaborone",
      stops: [
        ["10:30", "Kgale Hill", "Walk, climb, take the long view"],
        ["13:00", "Lunch nearby", "Shortlist a table that fits the mood"],
        ["17:00", "Gaborone Dam", "Stay for the light"]
      ]
    },
    {
      title: "A first day in Gabs",
      stops: [
        ["10:00", "Main Mall", "Start in the middle and get your bearings"],
        ["13:00", "Botswana Craft", "See local work and stay for lunch"],
        ["18:30", "Two Six Seven", "Let dinner take its time"]
      ]
    },
    {
      title: "A Sunday with fresh air",
      stops: [
        ["09:30", "Mokolodi", "Trade the city for a wider view"],
        ["13:00", "Bush Kitchen", "Make lunch the destination"],
        ["17:15", "Gaborone Dam", "Come back for the evening light"]
      ]
    },
    {
      title: "An after work reset",
      stops: [
        ["17:30", "Main Mall", "Meet somewhere easy to find"],
        ["19:00", "Two Six Seven", "Settle in for dinner and drinks"],
        ["Later", "Your call", "Keep the plan open if the night has more in it"]
      ]
    }
  ];

  var state = {
    filter: "all",
    query: "",
    intent: "",
    sorted: false,
    saved: loadSaved()
  };

  var placeGrid = document.getElementById("place-grid");
  var savedGrid = document.getElementById("saved-grid");
  var savedEmpty = document.getElementById("saved-empty");
  var savedCount = document.getElementById("saved-count");
  var resultsSummary = document.getElementById("results-summary");
  var clearFiltersButton = document.querySelector("[data-clear-filters]");
  var sortButton = document.getElementById("sort-button");
  var toast = document.getElementById("toast");
  var toastTimer;
  var routeIndex = 0;
  var routeTimer;
  var routeContent = document.getElementById("hero-route-content");
  var routeCard = document.querySelector(".hero-route-card");
  var routeCount = document.getElementById("route-cycle-count");

  function loadSaved() {
    try {
      return new Set(JSON.parse(localStorage.getItem("gaborone-explorer-saved") || "[]"));
    } catch (error) {
      return new Set();
    }
  }

  function saveSaved() {
    localStorage.setItem("gaborone-explorer-saved", JSON.stringify(Array.from(state.saved)));
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function iconForCategory(category) {
    var icons = {
      "Eat and drink": "fork-knife",
      Outdoors: "leaf",
      Culture: "buildings",
      Shopping: "shopping-bag-open"
    };
    return icons[category] || "map-pin";
  }

  function matchesPlace(place) {
    var haystack = [place.name, place.category, place.type, place.area, place.fit, place.description].concat(place.tags).join(" ").toLowerCase();
    var queryMatches = !state.query || haystack.indexOf(state.query.toLowerCase()) !== -1;
    var filterMatches = state.filter === "all" || place.category === state.filter;
    var intentMatches = !state.intent || place.intents.indexOf(state.intent) !== -1 || haystack.indexOf(state.intent.toLowerCase()) !== -1;
    return queryMatches && filterMatches && intentMatches;
  }

  function cardMarkup(place) {
    var saved = state.saved.has(place.id);
    return "<article class=\"place-card\">" +
      "<div class=\"place-image\">" +
        "<img src=\"" + escapeHtml(place.image) + "\" alt=\"" + escapeHtml(place.name) + " in " + escapeHtml(place.area) + "\" loading=\"lazy\" />" +
        "<span class=\"place-type\"><i class=\"ph ph-" + iconForCategory(place.category) + "\" aria-hidden=\"true\"></i> " + escapeHtml(place.type) + "</span>" +
        "<button class=\"save-button" + (saved ? " is-saved" : "") + "\" type=\"button\" data-save=\"" + escapeHtml(place.id) + "\" aria-label=\"" + (saved ? "Remove " : "Save ") + escapeHtml(place.name) + "\" aria-pressed=\"" + saved + "\"><i class=\"ph ph-bookmark-simple" + (saved ? "-fill" : "") + "\" aria-hidden=\"true\"></i></button>" +
      "</div>" +
      "<div class=\"place-body\">" +
        "<div class=\"place-heading-row\"><h3>" + escapeHtml(place.name) + "</h3></div>" +
        "<p class=\"place-location\"><i class=\"ph ph-map-pin\" aria-hidden=\"true\"></i> " + escapeHtml(place.area) + "</p>" +
        "<p class=\"place-description\">" + escapeHtml(place.description) + "</p>" +
        "<div class=\"place-tags\">" + place.tags.map(function (tag) { return "<span class=\"place-tag\">" + escapeHtml(tag) + "</span>"; }).join("") + "</div>" +
        "<div class=\"place-action\"><span class=\"place-fit\">" + escapeHtml(place.fit) + "</span><a class=\"place-link\" href=\"place.html?place=" + encodeURIComponent(place.id) + "\">View place <i class=\"ph ph-arrow-up-right\" aria-hidden=\"true\"></i></a></div>" +
      "</div>" +
    "</article>";
  }

  function filteredPlaces() {
    var result = places.filter(matchesPlace);
    if (state.sorted) {
      result = result.slice().reverse();
    }
    return result;
  }

  function renderPlaces() {
    var result = filteredPlaces();
    resultsSummary.textContent = "Showing " + result.length + " place" + (result.length === 1 ? "" : "s") + (state.intent ? " for " + state.intent.toLowerCase() : "");
    placeGrid.innerHTML = result.length ? result.map(cardMarkup).join("") : "<div class=\"empty-results\"><i class=\"ph ph-magnifying-glass\" aria-hidden=\"true\"></i><p>No places match that search yet. Try another angle.</p></div>";
    clearFiltersButton.hidden = !(state.filter !== "all" || state.query || state.intent);
    bindSaveButtons(placeGrid);
  }

  function renderSaved() {
    var savedPlaces = places.filter(function (place) { return state.saved.has(place.id); });
    savedCount.textContent = savedPlaces.length;
    savedCount.hidden = savedPlaces.length === 0;
    savedEmpty.hidden = savedPlaces.length > 0;
    savedGrid.hidden = savedPlaces.length === 0;
    savedGrid.innerHTML = savedPlaces.map(cardMarkup).join("");
    bindSaveButtons(savedGrid);
  }

  function bindSaveButtons(scope) {
    scope.querySelectorAll("[data-save]").forEach(function (button) {
      button.addEventListener("click", function () {
        var id = button.getAttribute("data-save");
        if (state.saved.has(id)) {
          state.saved.delete(id);
          showToast("Removed from your saved places.");
        } else {
          state.saved.add(id);
          showToast("Saved for later.");
        }
        saveSaved();
        renderPlaces();
        renderSaved();
      });
    });
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { toast.classList.remove("is-visible"); }, 2600);
  }

  function routeMarkup(route) {
    return "<h2>" + escapeHtml(route.title) + "</h2><div class=\"route-list\">" + route.stops.map(function (stop) {
      return "<div class=\"route-stop\"><span class=\"route-time\">" + escapeHtml(stop[0]) + "</span><span class=\"route-line\"></span><span><strong>" + escapeHtml(stop[1]) + "</strong><small>" + escapeHtml(stop[2]) + "</small></span></div>";
    }).join("") + "</div>";
  }

  function updateRoute(nextIndex, animate) {
    routeIndex = (nextIndex + heroRoutes.length) % heroRoutes.length;
    if (!routeContent || !routeCount) return;
    function paintRoute() {
      routeContent.innerHTML = routeMarkup(heroRoutes[routeIndex]);
      routeCount.textContent = (routeIndex + 1) + " / " + heroRoutes.length;
      routeContent.classList.remove("is-changing");
    }
    if (animate) {
      routeContent.classList.add("is-changing");
      window.setTimeout(paintRoute, 180);
    } else {
      paintRoute();
    }
  }

  function stopRouteCycle() {
    window.clearInterval(routeTimer);
  }

  function startRouteCycle() {
    if (!routeCard || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    stopRouteCycle();
    routeTimer = window.setInterval(function () { updateRoute(routeIndex + 1, true); }, 4600);
  }

  function setIntent(intent) {
    state.intent = intent;
    state.filter = "all";
    state.query = "";
    document.getElementById("hero-query").value = "";
    document.querySelectorAll("[data-filter]").forEach(function (button) {
      button.classList.toggle("is-active", button.getAttribute("data-filter") === "all");
    });
    renderPlaces();
    document.getElementById("explore").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.querySelectorAll("[data-intent]").forEach(function (button) {
    button.addEventListener("click", function () {
      setIntent(button.getAttribute("data-intent"));
    });
  });

  document.querySelectorAll("[data-filter]").forEach(function (button) {
    button.addEventListener("click", function () {
      state.filter = button.getAttribute("data-filter");
      state.intent = "";
      document.querySelectorAll("[data-filter]").forEach(function (item) { item.classList.toggle("is-active", item === button); });
      renderPlaces();
    });
  });

  document.getElementById("hero-search").addEventListener("submit", function (event) {
    event.preventDefault();
    state.query = document.getElementById("hero-query").value.trim();
    state.intent = "";
    state.filter = "all";
    document.querySelectorAll("[data-filter]").forEach(function (button) { button.classList.toggle("is-active", button.getAttribute("data-filter") === "all"); });
    renderPlaces();
    document.getElementById("explore").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.getElementById("hero-query").addEventListener("input", function (event) {
    state.query = event.target.value.trim();
    if (state.query.length > 1) {
      state.intent = "";
      renderPlaces();
    }
  });

  clearFiltersButton.addEventListener("click", function () {
    state.filter = "all";
    state.query = "";
    state.intent = "";
    document.getElementById("hero-query").value = "";
    document.querySelectorAll("[data-filter]").forEach(function (button) { button.classList.toggle("is-active", button.getAttribute("data-filter") === "all"); });
    renderPlaces();
  });

  sortButton.addEventListener("click", function () {
    state.sorted = !state.sorted;
    sortButton.setAttribute("aria-pressed", state.sorted);
    sortButton.innerHTML = state.sorted ? "<i class=\"ph ph-arrows-down-up\" aria-hidden=\"true\"></i> Fresh perspective" : "<i class=\"ph ph-arrows-down-up\" aria-hidden=\"true\"></i> Curated order";
    renderPlaces();
  });

  document.querySelectorAll("[data-scroll]").forEach(function (button) {
    button.addEventListener("click", function () {
      var target = document.querySelector(button.getAttribute("data-scroll"));
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  document.querySelectorAll("[data-toast]").forEach(function (button) {
    button.addEventListener("click", function () { showToast(button.getAttribute("data-toast")); });
  });

  if (routeCard && routeContent && routeCount) {
    routeCard.addEventListener("mouseenter", stopRouteCycle);
    routeCard.addEventListener("mouseleave", startRouteCycle);
    routeCard.addEventListener("focusin", stopRouteCycle);
    routeCard.addEventListener("focusout", function (event) {
      if (!routeCard.contains(event.relatedTarget)) startRouteCycle();
    });
    document.querySelector("[data-route-previous]").addEventListener("click", function () {
      stopRouteCycle();
      updateRoute(routeIndex - 1, true);
      startRouteCycle();
    });
    document.querySelector("[data-route-next]").addEventListener("click", function () {
      stopRouteCycle();
      updateRoute(routeIndex + 1, true);
      startRouteCycle();
    });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stopRouteCycle();
      else startRouteCycle();
    });
    startRouteCycle();
  }

  var menuToggle = document.querySelector(".menu-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  menuToggle.addEventListener("click", function () {
    var isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.innerHTML = isOpen ? "<i class=\"ph ph-list\" aria-hidden=\"true\"></i>" : "<i class=\"ph ph-x\" aria-hidden=\"true\"></i>";
    mobileNav.hidden = isOpen;
  });

  mobileNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.innerHTML = "<i class=\"ph ph-list\" aria-hidden=\"true\"></i>";
      mobileNav.hidden = true;
    });
  });

  document.querySelector(".mobile-nav-close").addEventListener("click", function () {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.innerHTML = "<i class=\"ph ph-list\" aria-hidden=\"true\"></i>";
    mobileNav.hidden = true;
    menuToggle.focus();
  });

  renderPlaces();
  renderSaved();
})();
