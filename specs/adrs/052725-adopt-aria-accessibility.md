# ADR 052725: Adopt ARIA & Comprehensive Accessibility Practices

*Status*: **Completed**  
*Date*: 2025-05-26  
*Decision Makers*: Mehdi Aziz 
*Informed*: All project contributors  

---

## Context and Problem Statement
Our web application must be usable by the broadest possible audience, including people who rely on assistive technologies (screen readers, voice control, switch devices), keyboard-only navigation, or alternative colour schemes. Current Lighthouse audits flagged several accessibility issues, and **WCAG 2.2** introduces additional criteria we do not yet meet. Leaving these gaps unaddressed risks excluding users and lowering SEO and overall quality. Therefore we made a deliberate, traceable decision to embed **WAI-ARIA** semantics and related accessibility techniques throughout the codebase, beginning with the **home page**.

## Decision
We will perform a **Comprehensive Accessibility Overhaul** across the entire site—establishing a unified accessibility standard (ARIA + WCAG 2.2 Level AA) and refactoring every HTML page to comply.

### Consequences
**Positive**  
- Meets WCAG 2.2 Level AA; lowers legal risk and increases inclusivity  
- Consistent code patterns (landmarks, semantic HTML, ARIA roles) improve maintenance and onboarding  
- Enhances SEO and perceived quality  

**Negative**  
- Requires an initial audit and refactor effort across ~20 HTML files  
- Contributors must learn accessibility testing workflows and ARIA patterns  

### Confirmation
- **Automated**: Lighthouse ≥ 95 Accessibility, axe-core CI job with zero critical issues  
- **Manual**: NVDA + Chrome, VoiceOver + Safari, keyboard-only walkthrough  
- **Process**: PR checklist item “Accessibility OK” enforced  

## Implementation Notes
### Key practices to implement
- Add HTML5 landmark elements (`<header>`, `<nav>`, `<main>`, `<footer>`)  
- Provide a **Skip to main content** link on every page  
- Ensure logical heading hierarchy (`<h1>` … `<h6>`)  
- Prefer native elements; where custom widgets exist, apply appropriate `role` and `aria-*` attributes with full keyboard support  
- Maintain visible focus indicators on all interactive controls  
- Guarantee colour-contrast ratio ≥ 4.5:1 (for text) and ≥ 3:1 (for UI components)  
- Supply descriptive `alt` text for images and `aria-label` / `aria-labelledby` for icon-only buttons  
- Provide form labels, link error messages via `aria-describedby`, and use live regions for dynamic feedback  
- Persist user theme preference (dark/light) and ensure both themes pass contrast checks  

### Road-map
1. **Audit & refactor `index.html`** (completed → PR #XX)  
2. Replicate pattern across remaining pages (`recipes.html`, `gallery.html`, …)  
3. Add axe-core GitHub Action to CI  
4. Conduct a 30-minute team workshop on NVDA / VoiceOver testing  
5. Re-audit after each sprint; update this ADR if scope changes  

