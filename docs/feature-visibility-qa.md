# Live Feature Visibility QA

Live URL checked: https://almuyed-saad.github.io/Portfolio/

The deployed page loaded with the expected Phase 5 controls in the browser after JavaScript ran:

- Four `Case Study` buttons were visible for Aura Chat, SAAD & CO Bank, AI Study Hub, and SAAD AI — Math Engine.
- `Featured` appeared as a project filter.
- `Copy Email` appeared in the contact section.
- The page showed 11 Projects and 10 Live Projects.
- The live project cards used the optimized `.webp` images.
- The browser page title was `Almuyed Saad — Mathematics, AI & Software Engineering`.

The live source hash matched the local main branch for `index.html` and `script.js` during comparison. Therefore the features are deployed; they are not visible in the initial viewport because project controls and contact actions are lower on the page, and the case-study buttons are inside project cards after scrolling to the Projects section.

After scrolling to the live Projects section, the browser visibly showed the `Featured` filter and the first featured cards with `Case Study` buttons. The feature controls are not in the initial hero viewport; they appear in the Projects section roughly one to two scrolls below the top.
