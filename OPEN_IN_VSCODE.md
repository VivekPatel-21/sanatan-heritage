# Open Sanatan Heritage in VS Code

1. Extract this ZIP.
2. In VS Code, choose File > Open Folder and select the extracted sanatan-heritage folder.
3. Use Node.js 24.15 or newer within the 24.x series (or another version supported by package.json).
4. Open Terminal > New Terminal, then run:

```sh
npm ci
npm run build
npm run serve
```

Open the local URL printed in the terminal. Edit source files in `src/`, not the generated `dist/` directory. Run the build again after changes.

This is the approved Eleventy/Nunjucks website from this chat, including the full Ambaji video homepage, responsive video files, shared header, illustrations, fonts, scripts, tests and project documents. It is not a Next.js project.

The main homepage source is `src/index.njk`. Homepage styling and behavior are in `src/assets/css/home-museum.css` and `src/assets/js/home-museum.js`. The shared header is `src/_includes/header.njk`.

The archive is a source export, not a Git clone. Existing handoff documents contain historical details; the source and EXPORT_INFO.json identify this exact version. Private reference books and original conversation exports are not included. Available decision notes remain in `conversation/`.
