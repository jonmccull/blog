# Foundations kit (vendored)

These files are a pinned copy of the Foundations design kit. Do not edit them here.

|                        |                                                                                                                                     |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Source repo            | [jonmccull/foundations-kit](https://github.com/jonmccull/foundations-kit)                                                           |
| Kit commit             | `2dcbe7b`                                                                                                                           |
| Kit commit, `field.js` | `d204f47` ([foundations-kit#4](https://github.com/jonmccull/foundations-kit/pull/4)), artifact `1792156123-e5a7`, pulled 2026-10-16 |
| Artifact version       | `1792096454-5019`                                                                                                                   |
| Tokens version         | 3                                                                                                                                   |
| Pulled                 | 2026-10-15                                                                                                                          |

| File here    | Kit file                    |
| ------------ | --------------------------- |
| `tokens.css` | `tokens.css`                |
| `bundle.css` | `components/bundle.css`     |
| `field.js`   | `components/Field/field.js` |

All are byte-identical to the kit: the two stylesheets at the first commit, `field.js` at its own. The field reads its `field-*` motion tokens from `tokens.css` when they are there and has the same values built in, so the older stylesheets lack nothing it needs. The two stylesheets are imported in `app/layout.tsx` before `app/styles/base.css`; `field.js` is loaded only on home, by `app/components/HomeField.tsx`. `.prettierignore` and the ESLint ignores keep the tools off them. The fonts link in `app/layout.tsx` is the one from the kit's `fonts.html`.

Site code never retypes a token value. Colours and fonts come from `var(--token)`, or from the Tailwind names mapped in `tailwind.config.js` (`ground`, `surface`, `ink`, `ink-secondary`, `ink-muted`, `hairline`, `underline`, `lime`, `lime-glow`, `on-lime`; `font-sans`, `font-mono`).

## Updating

1. Pick a newer kit commit and read its `README.md` and `lastChange.json` for what changed.
2. Copy the two files over:
   ```sh
   cp ../foundations-kit/tokens.css app/styles/foundations/tokens.css
   cp ../foundations-kit/components/bundle.css app/styles/foundations/bundle.css
   cp ../foundations-kit/components/Field/field.js app/styles/foundations/field.js
   cmp app/styles/foundations/tokens.css ../foundations-kit/tokens.css
   cmp app/styles/foundations/bundle.css ../foundations-kit/components/bundle.css
   cmp app/styles/foundations/field.js ../foundations-kit/components/Field/field.js
   ```
3. If the kit's `fonts.html` changed, update the stylesheet link in `app/layout.tsx`.
4. If a token was added or renamed, update the Tailwind mapping in `tailwind.config.js`.
5. If `field.js` changed its `onFrame` frame or options, update `app/components/fieldPortrait.ts` and `HomeField.tsx` to match.
6. Update the table above (commit, artifact version, tokens version, date), then build and check both themes.
