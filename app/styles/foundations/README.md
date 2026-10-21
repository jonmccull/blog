# Foundations kit (vendored)

These files are a pinned copy of the Foundations design kit. Do not edit them here.

|                  |                                                                                                 |
| ---------------- | ----------------------------------------------------------------------------------------------- |
| Source repo      | [jonmccull/foundations-kit](https://github.com/jonmccull/foundations-kit)                       |
| Kit commit       | `91dd644` (merge of [foundations-kit#18](https://github.com/jonmccull/foundations-kit/pull/18)) |
| Artifact version | `1792614510-be4c`                                                                               |
| Tokens version   | 6                                                                                               |
| Pulled           | 2026-10-21                                                                                      |

| File here    | Kit file                    |
| ------------ | --------------------------- |
| `tokens.css` | `tokens.css`                |
| `bundle.css` | `components/bundle.css`     |
| `field.js`   | `components/Field/field.js` |

All three are byte-identical to the kit at that commit. `kit.lock.json` holds the same commit and a hash of each file, and CI runs `check-kit.mjs` (the kit's own check, vendored too). It fails if a file here differs from the kit, if this table and the lock disagree, or if a `var(--x)` in the site has nothing declaring it. The field reads its `field-*` motion tokens from `tokens.css` (it has the same values built in). The two stylesheets are imported in `app/layout.tsx` before `app/styles/base.css`; `field.js` is loaded only on home, by `app/components/HomeField.tsx`. `.prettierignore` and the ESLint ignores keep the tools off them. The fonts link in `app/layout.tsx` is the one from the kit's `fonts.html`.

Site code never retypes a token value. Colours and fonts come from `var(--token)`, or from the Tailwind names mapped in `tailwind.config.js` (`ground`, `surface`, `ink`, `ink-secondary`, `ink-muted`, `hairline`, `underline`, `lime`, `lime-glow`, `on-lime`; `font-sans`, `font-mono`).

## Updating

The kit repo opens a "Foundations kit update" PR (branch `kit/update`) whenever the kit changes. It copies the two stylesheets, bumps the lock and this table, and runs the check. It does not copy `field.js` yet, so in that PR, until it does:

1. Copy `field.js` by hand and confirm it matches: `cp ../foundations-kit/components/Field/field.js app/styles/foundations/field.js && cmp app/styles/foundations/field.js ../foundations-kit/components/Field/field.js`.
2. Put its entry back in `kit.lock.json` (`"from": "components/Field/field.js"` and its `sha256`), since the update rewrites the lock with the two stylesheets only.

Before merging:

1. Read the PR's list of kit commits, and the kit's `README.md` for what changed.
2. If the kit's `fonts.html` changed, update the stylesheet link in `app/layout.tsx`. The check fails until you do.
3. If a token was added or renamed, update the Tailwind mapping in `tailwind.config.js`.
4. If `field.js` changed its `onFrame` frame or options, update `app/components/fieldPortrait.ts` and `HomeField.tsx` to match.
5. Check the Vercel preview in both themes.

By hand instead: `node ../foundations-kit/scripts/vendor.mjs . app/styles/foundations README.md` from the site root, with the kit checked out at the commit you want, then step 1 and 2 above for `field.js`.
