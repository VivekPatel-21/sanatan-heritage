# Interactive temple study

Original code-native geometry: src/assets/js/museum-temple.js.
CPU projection fallback: src/assets/js/museum-software.js.
Choreography and accessible controls: src/assets/js/museum-preview.js.
Scoped design: src/assets/css/museum-preview.css.

A stylized imagined temple, not a reconstruction or an identified real monument. No deity or prescribed ritual is reconstructed. The first preview's generated architectural still remains the final fallback; original prompts are in museum-preview-prompts.json.

Three views change model rotation, horizontal composition, camera distance/elevation and key-light intensity. The same geometry is projected by both renderers. GSAP coordinates poses and typography. No external model, camera tracker, remote render service or CDN is used at runtime.

The managed browser cannot create WebGL contexts. Software rendering and interactions were observed; GPU shadows/material appearance remain unverified on a real GPU-capable browser.
