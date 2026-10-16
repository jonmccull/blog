#!/usr/bin/env node
// The consumer check. Vendored next to a project's copy of the kit and run from the project root
// by its CI: `node <kit dir>/check-kit.mjs`. Offline, Node only, no dependencies. Exit 1 on any failure:
//   1. every vendored file is byte for byte the kit file kit.lock.json names (nobody patched the copy),
//   2. the pin doc names the same kit commit as kit.lock.json (the human record and the lock agree),
//   3. the kit's fonts link appears in the project's source,
//   4. every var(--x) the project uses without a fallback is declared somewhere (a removed token fails here).
// Being behind the kit is not checked here; the kit repo's consumers workflow opens an update PR for that.
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const kitDir = dirname(fileURLToPath(import.meta.url));
const root = process.cwd();
const rel = (p) => relative(root, p) || '.';
const lock = JSON.parse(readFileSync(join(kitDir, 'kit.lock.json'), 'utf8'));
const failures = [];
const short = lock.commit.slice(0, 7);

for (const [name, { from, sha256 }] of Object.entries(lock.files)) {
  let got;
  try { got = createHash('sha256').update(readFileSync(join(kitDir, name))).digest('hex'); }
  catch { failures.push(`${rel(join(kitDir, name))}: missing`); continue; }
  if (got !== sha256) failures.push(`${rel(join(kitDir, name))}: differs from the kit's ${from} at ${short}. Never edit the copy: change the kit, then update.`);
}

const pinDoc = readFileSync(join(kitDir, lock.pinDoc), 'utf8');
if (!pinDoc.includes(short)) failures.push(`${rel(join(kitDir, lock.pinDoc))}: does not name kit commit ${short}, which kit.lock.json pins`);

const SKIP = new Set(['node_modules', '.git', '.next', '.astro', '.vercel', '.wrangler', 'dist', 'build', 'out', 'coverage', 'screenshots']);
const EXT = new Set(['.css', '.scss', '.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.astro', '.html', '.svelte', '.vue', '.mdx']);
const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p);
    else if (EXT.has(extname(name)) && s.size < 2_000_000 && p !== fileURLToPath(import.meta.url)) files.push(p);
  }
})(root);

const declared = new Set();
const uses = [];
let fontsSeen = !lock.fontsHref;
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  if (!fontsSeen && (src.includes(lock.fontsHref) || src.includes(lock.fontsHref.replaceAll('&', '&amp;')))) fontsSeen = true;
  // declarations: `--x:` in CSS, `'--x':` in a style object, setProperty('--x', …) in script
  for (const m of src.matchAll(/(?:^|[\s;{('"`])(--[\w-]+)['"`]?\s*:/g)) declared.add(m[1]);
  for (const m of src.matchAll(/setProperty\(\s*['"`](--[\w-]+)['"`]/g)) declared.add(m[1]);
  // comments blanked, newlines kept, so prose such as "use var(--token)" is not a use
  const code = src.replace(/\/\*[\s\S]*?\*\/|(^|\s)\/\/[^\n]*/g, (c) => c.replace(/[^\n]/g, ' '));
  for (const m of code.matchAll(/var\(\s*(--[\w-]+)\s*([,)$]?)/g)) {
    if (m[2] !== ')') continue; // a fallback, or a name built at run time
    uses.push({ name: m[1], file: f, line: code.slice(0, m.index).split('\n').length });
  }
}
if (!fontsSeen) failures.push(`the kit's fonts link is not in the project's source: ${lock.fontsHref}`);

const undeclared = uses.filter((u) => !declared.has(u.name));
for (const name of [...new Set(undeclared.map((u) => u.name))]) {
  const where = undeclared.filter((u) => u.name === name).slice(0, 3).map((u) => `${rel(u.file)}:${u.line}`).join(', ');
  failures.push(`var(${name}) is used but declared nowhere, by the kit or the project: ${where}`);
}

console.log(`foundations-kit ${short} (tokens v${lock.tokensVersion}): ${Object.keys(lock.files).length} vendored files, ${files.length} source files, ${uses.length} var() uses`);
if (failures.length) {
  console.error('FAIL:\n  ' + failures.join('\n  '));
  process.exit(1);
}
console.log('ok: the copy matches the kit, and every token used is declared');
