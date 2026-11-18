# Page drafts

Each file here is a planned CMS page: `<slug>.json` = `{ "title": "…", "layout": [ …rows ] }`.

- Preview it locally at `http://localhost:3000/dev/preview/<slug>` (nothing is saved to the store yet).
- After the owner approves, the layout is saved to TheCoins with the `/cms-page` command.
- The file stays here as a record of what was saved.

Sections to copy from: `lib/cms-sections.ts` (shown at `http://localhost:3000/dev/widgets`).
