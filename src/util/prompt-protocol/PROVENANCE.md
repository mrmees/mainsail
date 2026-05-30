# Provenance — vendored Klipper Macro Prompt Protocol engine

**Source:** https://github.com/mrmees/klipper-macro-prompt-protocol
**Path:** `packages/js/src/`
**Vendored from commit:** `a338315` (branch `feat/prompt-align`, pending PR #4 merge into `main`)
**Vendored:** 2026-05-30

## Why vendored, not an npm dependency
Mainsail compiles this TS source in its own Vite pipeline, so its `build.target` (safari12)
governs the output — no external runtime dependency, no built-package/`.d.ts` concerns. The
canonical conformance fixtures (`tests/unit/prompt-protocol/fixtures.json`) keep this copy honest.

## Local modifications
1. **`.js` import extensions stripped.** Relative import `.js` extensions (NodeNext, needed by the
   upstream npm build) are removed so Mainsail's bundler resolves the `.ts` files.
2. **`reducer.ts` `as any` narrowed (lint parity).** Upstream `appendToLastContainer` used
   `(last as any).children`, which Mainsail's `@typescript-eslint/no-explicit-any` rejects. Replaced
   with an explicit narrowed union type — behavior-identical, conformance-verified. **TODO: upstream
   this to the protocol repo** so future re-syncs need no local edit.

## Update procedure
1. Re-copy `packages/js/src/*.ts` from the source commit and re-run the `.js`-strip sed.
2. Re-copy `fixtures/fixtures.json` to `tests/unit/prompt-protocol/`.
3. Bump the commit SHA above.
4. Run `npm run test:unit -- prompt-protocol` and fix any regression in Mainsail's adapter, not the engine.
