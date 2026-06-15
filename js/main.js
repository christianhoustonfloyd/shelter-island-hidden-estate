/* ============================================================
   Shelter Island Hidden Estate — interactions
   Vanilla JS: nav, scroll header, reveal, gallery + lightbox, form
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Gallery photo data (filenames in /photos) ---------- */
  var PHOTOS = {
    exterior: [
      "Drone_3-1.jpg", "Drone_5-1.jpg", "png-Exterior-Drone.jpg",
      "Ext_7-1.jpg", "Ext_12-1.jpg", "Ext_13-1.jpg", "Ext_17-1.jpg",
      "Exterior-Guest-house-entrance.jpg", "Exterior2-Main-and-cottage-from-SE-darken.jpg",
      "Exterior-night-Main-house-cottage-night_.jpg", "Main-house-from-driveway.jpg",
      "Tree-Hideaway-Exterior-Grove-darken.jpg", "Main-Pool.jpg",
      "Terrace.jpg-Exterior-Terrace.jpg"
    ],
    mainhouse: [
      "Int_1-1.jpg", "Int_2-1.jpg", "Int_3-1.jpg", "Int_4-1.jpg", "Int_5-1.jpg",
      "Int_8-1.jpg", "Int_9-1.jpg", "Int_11-1.jpg", "Int_12-1.jpg", "Int_13-1.jpg",
      "Int_14-1.jpg", "Int_15-1.jpg", "Int_16-1.jpg", "Int_17-1.jpg", "Int_20-1.jpg",
      "Int_21-1.jpg", "Int_22-1.jpg", "Int_23-1.jpg", "Int_25-1.jpg", "Int_27-1.jpg",
      "Int_28-1.jpg", "Int_30-1.jpg",
      "CappyHotchkiss-7863.jpg", "CappyHotchkiss-7907.jpg",
      "CappyHotchkiss-7936.jpg", "CappyHotchkiss-7939.jpg"
    ],
    carriage: [
      "cot1.jpg", "cot2.jpg", "cot5.jpg", "cot6.jpg", "cot7.jpg", "cot8.jpg",
      "cot9.jpg", "cot10.jpg", "cot11.jpg", "cot12.jpg", "cot13.jpg",
      "cot14.jpg", "cot15.jpg", "cot16.jpg"
    ],
    events: [
      "event1.jpg", "event2.jpg", "event3.jpg", "event4.jpg",
      "e5.jpg", "e6.jpg", "e7.jpg", "e8.jpg", "e9.jpg", "e10.jpg", "e11.jpg"
    ]
  };

  var LABELS = {
    exterior: "Exterior & Grounds",
    mainhouse: "Main House",
    carriage: "Carriage House",
    events: "Special Events"
  };

  /* Flattened, ordered list used to build the grid + drive the lightbox */
  var ORDER = ["exterior", "mainhouse", "carriage", "events"];
  var ITEMS = [];
  ORDER.forEach(function (cat) {
    PHOTOS[cat].forEach(function (file) {
      ITEMS.push({ cat: cat, file: file, label: LABELS[cat] });
    });
  });

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };

  document.addEventListener("DOMContentLoaded", function () {
    initYear();
    initHeaderScroll();
    initMobileNav();
    initHero();
    initReveal();
    buildGallery();
    initFilters();
    initLightbox();
    initForm();
  });

  /* ---------- hero photo slider ---------- */
  function initHero() {
    var track = $("#heroTrack");
    var prev = $("#heroPrev");
    var next = $("#heroNext");
    if (!track || !prev || !next) return;

    var count = track.querySelectorAll(".hero-slide").length;
    var index = 0;

    var update = function () {
      track.style.transform = "translateX(-" + (index * (100 / count)) + "%)";
      prev.classList.toggle("is-hidden", index === 0);
      next.classList.toggle("is-hidden", index === count - 1);
    };

    next.addEventListener("click", function () {
      if (index < count - 1) { index++; update(); }
    });
    prev.addEventListener("click", function () {
      if (index > 0) { index--; update(); }
    });

    update();
  }

  /* ---------- footer year ---------- */
  function initYear() {
    var el = $("#footerYear");
    if (el) el.textContent = "© " + new Date().getFullYear();
  }

  /* ---------- sticky header state ---------- */
  function initHeaderScroll() {
    var header = $("#siteHeader");
    if (!header) return;
    var onScroll = function () {
      if (window.scrollY > 40) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- mobile nav ---------- */
  function initMobileNav() {
    var toggle = $("#navToggle");
    var nav = $("#primaryNav");
    var header = $("#siteHeader");
    if (!toggle || !nav) return;

    var setOpen = function (open) {
      nav.classList.toggle("is-open", open);
      toggle.classList.toggle("is-active", open);
      header.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };

    toggle.addEventListener("click", function () {
      setOpen(!nav.classList.contains("is-open"));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
  }

  /* ---------- reveal on scroll ---------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || !els.length) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { obs.observe(el); });
  }

  /* ---------- build gallery grid ---------- */
  function buildGallery() {
    var grid = $("#galleryGrid");
    if (!grid) return;
    var frag = document.createDocumentFragment();

    ITEMS.forEach(function (item, i) {
      var div = document.createElement("div");
      div.className = "gallery-item";
      div.setAttribute("data-category", item.cat);
      div.setAttribute("data-index", i);
      div.setAttribute("role", "button");
      div.setAttribute("tabindex", "0");
      div.setAttribute("aria-label", "View photo — " + item.label);

      var img = document.createElement("img");
      img.src = "photos/" + item.file;
      img.alt = item.label;
      img.loading = "lazy";
      div.appendChild(img);
      frag.appendChild(div);
    });
    grid.appendChild(frag);
  }

  /* ---------- category filters ---------- */
  function initFilters() {
    var bar = $("#galleryFilters");
    var grid = $("#galleryGrid");
    if (!bar || !grid) return;

    bar.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-btn");
      if (!btn) return;
      var filter = btn.getAttribute("data-filter");

      bar.querySelectorAll(".filter-btn").forEach(function (b) {
        b.classList.toggle("is-active", b === btn);
      });
      grid.querySelectorAll(".gallery-item").forEach(function (item) {
        var show = filter === "all" || item.getAttribute("data-category") === filter;
        item.classList.toggle("is-hidden", !show);
      });
    });
  }

  /* ---------- lightbox ---------- */
  function initLightbox() {
    var box = $("#lightbox");
    var grid = $("#galleryGrid");
    var img = $("#lbImage");
    if (!box || !grid || !img) return;

    var current = -1;

    var visibleIndices = function () {
      var out = [];
      grid.querySelectorAll(".gallery-item").forEach(function (item) {
        if (!item.classList.contains("is-hidden")) {
          out.push(parseInt(item.getAttribute("data-index"), 10));
        }
      });
      return out;
    };

    var show = function (idx) {
      var item = ITEMS[idx];
      if (!item) return;
      current = idx;
      img.src = "photos/" + item.file;
      img.alt = item.label;
    };

    var open = function (idx) {
      show(idx);
      box.classList.add("is-open");
      box.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };
    var close = function () {
      box.classList.remove("is-open");
      box.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };
    var step = function (dir) {
      var vis = visibleIndices();
      if (!vis.length) return;
      var pos = vis.indexOf(current);
      pos = (pos + dir + vis.length) % vis.length;
      show(vis[pos]);
    };

    var openFromTarget = function (target) {
      var item = target.closest(".gallery-item");
      if (!item) return;
      open(parseInt(item.getAttribute("data-index"), 10));
    };

    grid.addEventListener("click", function (e) { openFromTarget(e.target); });
    grid.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openFromTarget(e.target);
      }
    });

    $("#lbClose").addEventListener("click", close);
    $("#lbPrev").addEventListener("click", function () { step(-1); });
    $("#lbNext").addEventListener("click", function () { step(1); });
    box.addEventListener("click", function (e) {
      if (e.target === box) close();
    });
    document.addEventListener("keydown", function (e) {
      if (!box.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    });
  }

  /* ---------- inquiry form -> mailto ---------- */
  function initForm() {
    var form = $("#inquiryForm");
    var note = $("#formNote");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = val("f-name");
      var email = val("f-email");
      if (!name || !email) {
        if (note) note.textContent = "Please add your name and email so we can reply.";
        return;
      }

      var arrive = val("f-arrive");
      var depart = val("f-depart");
      var guests = val("f-guests");
      var message = val("f-message");

      var lines = [
        "Name: " + name,
        "Email: " + email,
        arrive ? "Arrival: " + arrive : null,
        depart ? "Departure: " + depart : null,
        guests ? "Guests: " + guests : null,
        "",
        message || "(no message)"
      ].filter(function (l) { return l !== null; });

      var subject = "Rental inquiry — Shelter Island Hidden Estate";
      var href = "mailto:christian.houston@gmail.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(lines.join("\n"));

      window.location.href = href;
      if (note) note.textContent = "Opening your email app… if nothing happens, write us at christian.houston@gmail.com.";
    });

    function val(id) {
      var el = document.getElementById(id);
      return el ? el.value.trim() : "";
    }
  }
})();
