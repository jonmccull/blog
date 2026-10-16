# Foundations kit (vendored)

These files are a pinned copy of the Foundations design kit. Do not edit them here.

|                  |                                                                           |
| ---------------- | ------------------------------------------------------------------------- |
| Source repo      | [jonmccull/foundations-kit](https://github.com/jonmccull/foundations-kit) |
| Kit commit       | `2dcbe7b`                                                                 |
| Artifact version | `1792096454-5019`                                                         |
| Tokens version   | 3                                                                         |
| Pulled           | 2026-10-15                                                                |

| File here    | Kit file                |
| ------------ | ----------------------- |
| `tokens.css` | `tokens.css`            |
| `bundle.css` | `components/bundle.css` |

Both are byte-identical to the kit at that commit. They are imported in `app/layout.tsx` before `app/styles/base.css`, and `.prettierignore` keeps Prettier off them. The fonts link in `app/layout.tsx` is the one from the kit's `fonts.html`.

Site code never retypes a token value. Colours and fonts come from `var(--token)`, or from the Tailwind names mapped in `tailwind.config.js` (`ground`, `surface`, `ink`, `ink-secondary`, `ink-muted`, `hairline`, `underline`, `lime`, `lime-glow`, `on-lime`; `font-sans`, `font-mono`).

## Updating

1. Pick a newer kit commit and read its `README.md` and `lastChange.json` for what changed.
2. Copy the two files over:
   ```sh
   cp ../foundations-kit/tokens.css app/styles/foundations/tokens.css
   cp ../foundations-kit/components/bundle.css app/styles/foundations/bundle.css
   cmp app/styles/foundations/tokens.css ../foundations-kit/tokens.css
   cmp app/styles/foundations/bundle.css ../foundations-kit/components/bundle.css
   ```
3. If the kit's `fonts.html` changed, update the stylesheet link in `app/layout.tsx`.
4. If a token was added or renamed, update the Tailwind mapping in `tailwind.config.js`.
5. Update the table above (commit, artifact version, tokens version, date), then build and check both themes.
