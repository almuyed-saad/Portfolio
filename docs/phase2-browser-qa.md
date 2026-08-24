# Phase 2 Browser QA Findings

Date: 2026-08-24
Preview: local Phase 2 portfolio branch served on port 4173

## Desktop load

- Page title loaded as `Almuyed Saad — Mathematics & AI`.
- Skip link is present and exposed as an interactive element.
- Primary navigation, hero CTAs, project filters, project links, Load More, email CTA, and footer navigation are exposed as interactive elements.
- Hero displays `11 Projects`.
- Project section loads the new Aura Chat, SAAD & CO Bank, AI Study Hub, and Inkwell entries with supplied screenshots.
- The first viewport shows the three-column project layout at the browser's desktop width.
- No browser-visible runtime error or broken local image was observed in the page extraction.

## Live filter interaction

- Clicking the Live filter was accepted by the browser.
- The project section remained populated with live projects, and the Load More control remained available because more than six live projects exist.
- The browser output continued to expose the filter buttons and project links after the interaction.

## Notes

- Browser screenshots include annotated interactive-element outlines from the browser harness; these are not part of the portfolio UI.
- Additional mobile-width and keyboard-specific checks remain to be completed.

## Additional filter QA

- Clicking `In Progress` reduced the project section to the single Discord GamingBot card, with no Live Demo link shown because its data has no live URL.
- Clicking `All` restored the first six cards and the `Load More` control.
- The browser-extracted content confirmed that the new project screenshots and descriptions remain intact after both filter changes.

## Mobile and reduced-motion QA

A headless Chromium render at 390×844 completed successfully. The mobile hero layout rendered without horizontal overflow in the captured viewport, the hamburger navigation replaced the desktop links, and the project images and accessibility attributes were present in the generated DOM.

A second headless Chromium render with reduced-motion preference confirmed that the particle canvas receives `style="display: none;"`. The CSS reduced-motion rules are also present to remove entrance transforms and shorten non-essential transitions.

## Keyboard interaction QA

The mobile menu state machine was exercised in the browser. Opening the menu changed `aria-expanded` to `true`, changed `aria-hidden` to `false`, and added the `open` class. Dispatching Escape restored `aria-expanded="false"`, `aria-hidden="true"`, and removed the `open` class. Focus advancement with Tab continued to expose the page controls, including the project filters.

## Image fallback QA

A project image error event was simulated in the browser. The image was hidden and its wrapper received the `project-cover-fallback` class, confirming that the styled fallback state works without collapsing the card.
