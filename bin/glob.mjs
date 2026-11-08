#!/usr/bin/env node
// Demo: fixed patterns, asserts exact matches. --assert exits non-zero on mismatch.
import { match } from '../src/glob.mjs';

const CASES = [
  ['*.js', 'app.js', true],
  ['*.js', 'src/app.js', false],
  ['**/*.js', 'src/app.js', true],
  ['file.[jt]s', 'file.ts', true],
];

let failed = 0;
for (const [glob, path, expected] of CASES) {
  const got = match(glob, path);
  const pass = got === expected;
  if (!pass) failed++;
  console.log(`${pass ? 'PASS' : 'FAIL'} ${glob} vs ${path} -> ${got}`);
}
if (process.argv.includes('--assert') && failed > 0) process.exit(1);
if (failed > 0) process.exitCode = 1;
console.log(failed === 0 ? 'demo: all cases as expected' : `demo: ${failed} mismatch(es)`);
