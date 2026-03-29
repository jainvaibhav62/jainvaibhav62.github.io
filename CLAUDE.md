# Vaibhav Jain — Personal Portfolio

> Static personal portfolio website hosted on GitHub Pages at `jainvaibhav62.github.io`.

---

## Commands

This is a static site with no build system. There are no install, build, or test commands.

| Command | Description |
|---------|-------------|
| `open index.html` | Preview the site locally in a browser |
| `git push origin main` | Deploy to GitHub Pages (auto-deploys from `main`) |

---

## Architecture

```
<project-root>/
  index.html          # Single-page portfolio — all content lives here
  src/                 # Custom assets
    style.css          #   Main stylesheet (Circular font, layout, colors)
    script.js          #   Smooth scroll and AOS initialization
    img/               #   Profile photos and project thumbnails
    *.eot/woff/ttf     #   Circular font files
  css/                 # Vendor stylesheets (Fancybox, progressbar, responsive, Slick)
  js/                  # Vendor JS (jQuery 1.12.4, Isotope, Fancybox, Slick, progressbar)
    vendor/            #   jQuery and Modernizr
  fonts/               # Font Awesome 4.7.0
  img/                 # Template images (portfolio, slider, fancybox assets)
  certificate/         # PDF certificates and resume
  resume.tex           # LaTeX resume template (Awesome-CV format, not used by the site)
  .claude/             # Claude Code configuration
  memory/              # Persistent project memory for Claude
```

---

## Key Files

| File | Purpose |
|------|---------|
| `index.html` | The entire site — About, Education, Experience, Projects, Contact |
| `src/style.css` | All custom styling — colors, header, timeline, responsive tweaks |
| `src/script.js` | AOS init and smooth scroll behavior |
| `js/main.js` | Isotope grid filtering and Fancybox popup config |
| `js/progressbar.js` | Custom jQuery progress bar plugin |
| `css/responsive.css` | Media queries for tablet and mobile |

---

## Code Style

Conventions observed in the actual codebase:

- **HTML**: All content in a single `index.html` — sections use `<div class="container" id="section_name">` pattern
- **CSS**: Custom styles in `src/style.css`, vendor CSS in `css/` — never modify vendor files
- **JS**: jQuery-based, uses `$(document).ready()` in `src/script.js` and IIFE pattern `(function($) { ... })(jQuery)` in `js/main.js`
- **Animations**: AOS library via `data-aos="zoom-out-up"` and `data-aos-delay` attributes on HTML elements
- **UI Framework**: Materialize CSS classes (`chip`, `z-depth-*`, `waves-effect`, `col s12 m8`, etc.)
- **Icons**: Font Awesome 4.7 via `<i class="fa fa-*">` elements
- **Links**: External links always use `target="_blank"` and `rel="nofollow"` on company links
- **Timeline pattern**: Experience/Education items use `<li class="event z-depth-2 blue-grey lighten-4" data-date="...">` inside `<ul class="timeline">`
- **Skills/Chips pattern**: Tags use `<div class="chip blue-text text-darken-4">` with optional `<a>` wrapper for links
- **Color scheme**: Dark blue header (`#2c3e50` → `#1a1a1a` radial gradient), blue text accents (`blue-text text-darken-4`), green buttons (`#4caf50`)
- **Indentation**: 4-space indent in HTML, tab indent in CSS/JS

---

## Libraries & CDN Dependencies

| Library | Version | Source |
|---------|---------|--------|
| jQuery | 1.12.4 | Local (`js/vendor/`) |
| Materialize CSS | 0.97.7 | CDN |
| AOS (Animate On Scroll) | 2.0.4 | CDN |
| Font Awesome | 4.7.0 | Local (`fonts/`) + CDN |
| Isotope | — | Local (`js/isotope.pkgd.js`) |
| Fancybox | — | Local (`js/jquery.fancybox.pack.js`) |
| Slick Slider | — | Local (`js/slick.min.js`) |
| Google Analytics | UA | Inline script |

---

## Gotchas

- **Duplicate `id="li_icon"`** in `index.html` header social links — IDs must be unique; these should be classes
- **Two experience sections**: There are TWO copies of experience/education — one commented out (lines ~136-302) and one active (lines ~400+). The commented-out version has different company names (e.g., "Toyota Technologies" vs "TakeOff Technologies"). Always edit the ACTIVE (uncommented) section.
- **Google Analytics uses deprecated `analytics.js`** (UA-137511430-1) — Google has sunset Universal Analytics; this should be migrated to GA4
- **`resume.tex` belongs to someone else** — The LaTeX file has `Harshavardhan Srinivas` hardcoded; it's a template, not Vaibhav's actual resume
- **Mixed favicon references** — `<link rel="icon">` points to `src/img/icon.PNG` but `<link rel="shortcut icon">` points to `/img/portfolio/Capture.png`
- **No `.gitignore` entries for `.env` or `node_modules`** — The gitignore only covers OS files, not development artifacts
- **Font Awesome loaded twice** — Once from CDN (4.6.3) and once locally (4.7.0), which wastes bandwidth and may cause icon conflicts

---

## Claude Workflow

### Slash Commands

| Command | When to use |
|---------|------------|
| `/commit` | After completing a change — stages and commits |
| `/review-pr` | Before opening a PR — reviews the diff |

### Agents

| Agent | When to use |
|-------|------------|
| `code-reviewer` | After making changes, before committing |

### Memory

Claude maintains persistent memory in `memory/`. Tell Claude to "remember" facts
and it will update the appropriate file. These persist across sessions.
