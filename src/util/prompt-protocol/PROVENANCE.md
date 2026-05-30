# Provenance — vendored Klipper Macro Prompt Protocol engine

**Source:** https://github.com/mrmees/klipper-macro-prompt-protocol
**Path:** `packages/js/src/`
**Vendored from commit:** `d6cc0d9` (`main`, after PR #3 centered-default layout + PR #4 `prompt_align` merged)
**Vendored:** 2026-05-30 (re-synced from `main` after the pre-merge `feat/prompt-align` vendor at `a338315`)

## Why vendored, not an npm dependency
Mainsail compiles this TS source in its own Vite pipeline, so its `build.target` (safari12)
governs the output — no external runtime dependency, no built-package/`.d.ts` concerns. The
canonical conformance fixtures (`tests/unit/prompt-protocol/fixtures.json`) keep this copy honest.

## Local modifications
1. **`.js` import extensions stripped.** Relative import `.js` extensions (NodeNext, needed by the
   upstream npm build) are removed so Mainsail's bundler resolves the `.ts` files.
2. **`reducer.ts` `as any` narrowed (lint parity).** Upstream `appendToLastContainer` (line ~119 on
   `main` `d6cc0d9`) still uses `(last as any).children`, which Mainsail's
   `@typescript-eslint/no-explicit-any` rejects. Replaced with an explicit narrowed container type
   (`{ type: 'row' | 'button_group'; children: (PromptInlineItem | PromptButtonItem)[]; align?: PromptAlign }`)
   — behavior-identical, conformance-verified. Confirmed NOT yet upstreamed as of `d6cc0d9`, so this
   edit must be re-applied on every re-sync. **TODO: upstream this to the protocol repo.**

## Update procedure
1. Re-copy `packages/js/src/*.ts` from the source commit and re-run the `.js`-strip sed.
2. Re-copy `fixtures/fixtures.json` to `tests/unit/prompt-protocol/`.
3. Bump the commit SHA above.
4. Run `npm run test:unit -- prompt-protocol` and fix any regression in Mainsail's adapter, not the engine.
