# Shelter Island Hidden Estate — Project Guide

A marketing/booking website for **Shelter Island Hidden Estate**, a historic vacation-rental
compound (manor home + carriage house on 8 acres) in Shelter Island Heights, New York.

Built as a **static site — only HTML, CSS, and vanilla JavaScript**. No frameworks, no build
step, no dependencies except Google Fonts. The whole site is three files plus a photo folder.

## Structure

```
Shelter Island/
├── index.html          # Single-page site, all sections
├── css/styles.css      # Design system + layout + responsive
├── js/main.js          # Nav, hero slider, scroll reveal, gallery + lightbox, inquiry form
├── photos/             # 105 property images (downloaded from the old WordPress site)
├── all_image_urls.txt  # Source URLs the photos were pulled from (gitignored)
└── CLAUDE.md           # This file
```

The page is one long scroll with anchor navigation. Sections, top to bottom:
Header/nav → Hero (photo slider) → Overview (+ stat row) → Main House → Carriage House →
Grounds & Pool (banner) → Special Events → Gallery → Reserve/Inquire → Footer.

## Design system (in `css/styles.css` `:root`)

- **Fonts:** `Cormorant Garamond` (serif headings) + `Montserrat` (sans body/labels).
- **Palette:** `--cream #f7f4ef` (bg), `--white`, `--charcoal #2b2b28` (text),
  `--muted #6f6a60`, `--sage #6b7355` (accent), `--sage-dark #55603f` (hover).
- Style is "refined estate": large serif headlines, uppercase letter-spaced sans labels,
  hairline dividers, generous whitespace, subtle image hover-zoom and scroll-reveal.

## How the JavaScript works (`js/main.js`, one IIFE)

- `initHero` — hero is a 2-slide slider (`#heroTrack` translateX). Right arrow advances,
  left arrow goes back; each arrow hides at the end of its range. Slide images are set
  inline in `index.html` (`Drone_3-1.jpg`, then `Exterior2-Main-and-cottage-from-SE-darken.jpg`).
- `initHeaderScroll` — adds `.scrolled` to the header past 40px (transparent → solid cream).
- `initMobileNav` — hamburger toggle under 820px.
- `initReveal` — `IntersectionObserver` adds `.is-visible` to `.reveal` elements.
- `buildGallery` / `initFilters` / `initLightbox` — the gallery grid is generated from the
  `PHOTOS` object (filenames grouped by category: `exterior`, `mainhouse`, `carriage`,
  `events`). Filter tabs show/hide by category; clicking a thumbnail opens a lightbox with
  prev/next, arrow keys, and Esc. **To add/remove gallery photos, edit the `PHOTOS` object.**
- `initForm` — see below.

## Photo categories (filename conventions in `photos/`)

- **Exterior / Grounds:** `Drone_*`, `png-Exterior-Drone`, `Ext_*-1`, `Exterior*`,
  `Main-house-from-driveway`, `Exterior2-*`, `Tree-Hideaway-*`, `Main-Pool`, `Terrace*`
- **Main House:** `Int_*-1.jpg`, `int*.jpg`, `inte5`, `cor4`, `CappyHotchkiss-*`
- **Carriage House:** `cot1`–`cot16`
- **Events:** `event1`–`event4`, `e5`–`e11`
- **Not used in gallery:** `logo.jpg`, `sunburst1.jpg`, low-res legacy `shelter-island-*`

## Inquiry form — IMPORTANT caveat

The Reserve form currently builds a `mailto:christian.houston@gmail.com` link — it opens the
**visitor's own email app** with a prefilled draft; they must press Send. There is **no
backend**, nothing is stored, and it fails silently for visitors without a configured mail
client. To make inquiries reliably reach the inbox, switch it to a form backend
(Web3Forms / Formspree / Netlify Forms) — change is isolated to `initForm` in `js/main.js`.

Booking contact also shown on the page: Kimberly Feierstein (owner's rep), 516-972-3004.

## Run locally

```bash
python3 -m http.server 8123      # from the project root
# then open http://localhost:8123/
```

(The Claude preview MCP can't serve this folder — it's sandboxed out of `~/Desktop` — so use
the command above or your own server when verifying.)

## Deployment — GitHub Pages

Live at **https://christianhoustonfloyd.github.io/shelter-island-hidden-estate/**
Repo: **christianhoustonfloyd/shelter-island-hidden-estate** (public, branch `main`, path `/`).

All asset paths are **relative** (`css/...`, `js/...`, `photos/...`), so the site works under
the `/shelter-island-hidden-estate/` subpath — keep them relative. To publish changes:

```bash
git add -A && git commit -m "..." && git push
# Pages rebuilds automatically in ~1 minute
```

A custom domain (e.g. pointing `shelterislandhiddenestate.com` here) can be added via repo
Settings → Pages, plus a `CNAME` file in the repo root.

## Conventions

- Plain HTML/CSS/JS only — do not introduce a framework or build tooling.
- Keep asset paths relative (see Deployment).
- Copy is drawn from the original `shelterislandhiddenestate.com`; refine freely.
- End git commit messages with the `Co-Authored-By: Claude` trailer.
