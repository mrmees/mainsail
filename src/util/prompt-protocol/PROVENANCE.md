# Provenance — vendored Klipper Macro Prompt Protocol engine

**Source:** https://github.com/mrmees/klipper-macro-prompt-protocol
**Path:** `packages/js/src/`
**Vendored from commit:** `42b68e8` (PR #2, merged into `main` 2026-05-30)
**Vendored:** 2026-05-30

## Why vendored, not an npm dependency
Mainsail compiles this TS source in its own Vite pipeline, so its `build.target` (safari12)
governs the output — no external runtime dependency, no built-package/`.d.ts` concerns. The
canonical conformance fixtures (`tests/unit/prompt-protocol/fixtures.json`) keep this copy honest.

## Local modification
Relative import `.js` extensions (NodeNext, needed by the upstream npm build) are stripped on
vendor so Mainsail's bundler resolves the `.ts` files. This is the ONLY change from upstream.

## Update procedure
1. Re-copy `packages/js/src/*.ts` from the source commit and re-run the `.js`-strip sed.
2. Re-copy `fixtures/fixtures.json` to `tests/unit/prompt-protocol/`.
3. Bump the commit SHA above.
4. Run `npm run test:unit -- prompt-protocol` and fix any regression in Mainsail's adapter, not the engine.
