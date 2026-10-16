/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      // Foundations kit tokens (app/styles/foundations/tokens.css). Values switch with data-theme.
      colors: {
        ground: 'var(--ground)',
        surface: 'var(--surface)',
        ink: 'var(--ink)',
        'ink-secondary': 'var(--ink-secondary)',
        'ink-muted': 'var(--ink-muted)',
        hairline: 'var(--hairline)',
        underline: 'var(--underline)',
        lime: 'var(--lime)',
        'lime-glow': 'var(--lime-glow)',
        'on-lime': 'var(--on-lime)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      // Prose reads the kit tokens, which switch with data-theme, so there is no invert variant.
      // Size and line height come from the kit's `body` class on the prose container, and headings
      // carry their own kit class (app/components/mdx.tsx), so the plugin's values are dropped (null).
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--ink-secondary)',
            '--tw-prose-headings': 'var(--ink)',
            '--tw-prose-lead': 'var(--ink-secondary)',
            '--tw-prose-links': 'var(--ink)',
            '--tw-prose-bold': 'var(--ink)',
            '--tw-prose-counters': 'var(--ink-muted)',
            '--tw-prose-bullets': 'var(--ink-muted)',
            '--tw-prose-hr': 'var(--hairline)',
            '--tw-prose-quotes': 'var(--ink)',
            '--tw-prose-quote-borders': 'var(--hairline)',
            '--tw-prose-captions': 'var(--ink-muted)',
            '--tw-prose-kbd': 'var(--ink)',
            '--tw-prose-code': 'var(--ink)',
            '--tw-prose-pre-code': 'var(--ink)',
            '--tw-prose-pre-bg': 'var(--surface)',
            '--tw-prose-th-borders': 'var(--hairline)',
            '--tw-prose-td-borders': 'var(--hairline)',
            fontSize: null,
            lineHeight: null,
            strong: { fontWeight: '500' },
            a: { fontWeight: null },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            // Inline code: the kit's `code` style, in ink, nothing behind it.
            code: { fontWeight: null, fontSize: null },
            pre: { borderRadius: null },
            'thead th': { fontWeight: '500' },
            blockquote: { fontWeight: null, fontStyle: null, borderInlineStartWidth: null },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
