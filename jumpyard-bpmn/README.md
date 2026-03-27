# JumpYard BPMN Structure

This page has been split into smaller parts so future changes can be made without editing one large HTML file.

Files:
- `jumpyard-bpmn.html`: page shell and tab layout.
- `jumpyard-bpmn/styles.css`: all styling.
- `jumpyard-bpmn/scripts/data.js`: process data, assumptions, delta cards, and API touchpoints.
- `jumpyard-bpmn/scripts/app.js`: SVG rendering, tab behavior, zoom controls, and side-panel logic.

Recommended edit path:
- Content changes: update `scripts/data.js`.
- UI behavior or SVG layout changes: update `scripts/app.js`.
- Visual changes: update `styles.css`.
