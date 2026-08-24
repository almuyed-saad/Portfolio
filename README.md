# Almuyed Saad — Portfolio

Personal portfolio for **Almuyed Saad**, a B.Sc. Mathematics student at Shahjalal University of Science and Technology (SUST) building practical AI systems, full-stack products, and mathematical software.

**Live site:** <https://almuyed-saad.github.io/Portfolio/>

## What is included

The portfolio is a lightweight static site with a mathematics, AI, and software-engineering focus. It presents eleven projects with live demos, source links where available, project categories, Featured filtering, screenshots, accessible case-study dialogs, a CV download, contact actions, and responsive navigation.

The project showcase is data-driven. Project content is maintained in `data/projects.json`, while `script.js` renders the cards, filters, dynamic project statistics, case studies, and contact interactions.

## Run locally

No build step or package installation is required. Serve the repository root with any static web server:

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173> in a browser. Opening `index.html` directly also works for most sections, but a local server is recommended because project data is loaded with `fetch`.

## Repository structure

| Path | Purpose |
|---|---|
| `index.html` | Page structure, copy, SEO metadata, and social metadata |
| `style.css` | Visual system, responsive rules, accessibility states, and modal styling |
| `script.js` | Project loading, filtering, navigation, animations, case studies, and contact actions |
| `data/projects.json` | Project cards, links, tags, categories, featured flags, and case-study content |
| `assets/images/` | Profile, project, and favicon images |
| `assets/cv/` | Downloadable CV |
| `scripts/check-links.sh` | Deterministic checker for public demos and source links |
| `.github/workflows/pages.yml` | Automatic GitHub Pages deployment on pushes to `main` |
| `.github/workflows/check-links.yml` | Daily and manual public-link monitoring |
| `docs/` | QA and maintenance notes |

## Updating a project

Edit the appropriate object in `data/projects.json`. A project should include a title, category, description, technology tags, status, image path, GitHub URL, and live URL when available. Set `featured` to `true` only for the projects that should appear in the Featured view.

For repositories that are not publicly accessible, set `source` to `private`. The site will display `Private Source` instead of an inaccessible GitHub link. Do not publish credentials, private URLs, API keys, or personal data in the project data or screenshots.

Featured projects can include a `caseStudy` object with `problem`, `role`, `highlights`, and `result`. The Case Study button and accessible dialog are rendered automatically when that object exists.

## Deployment

The production site is published through GitHub Pages using `.github/workflows/pages.yml`. Every push to `main` triggers the workflow. The canonical URL, social preview URLs, `robots.txt`, and `sitemap.xml` are configured for the GitHub Pages project URL.

The repository’s Pages source is configured to use **GitHub Actions**. If deployment settings are reset, open the repository’s Pages settings and select GitHub Actions as the publishing source.

## Link monitoring

The `Check portfolio links` workflow runs daily at 06:00 UTC and can be started manually. It checks the live portfolio, crawler files, every project demo, and public GitHub source links. Private repositories are intentionally excluded from public link checks. See [`docs/link-monitoring.md`](docs/link-monitoring.md) for the monitoring policy.

To run the same check locally:

```bash
./scripts/check-links.sh
```

## Accessibility and motion support

The site includes keyboard focus styles, skip navigation, accessible filter state, Escape-to-close mobile navigation, accessible case-study dialogs, image fallbacks, and reduced-motion handling. When adding interactive controls, preserve keyboard reachability, visible focus, semantic labels, and the reduced-motion behavior already used by the site.

## License and contact

This repository represents the personal portfolio of Almuyed Saad. For collaboration, research, freelance, or software-engineering opportunities, use the contact details displayed on the live site.
