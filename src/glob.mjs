// SPDX-License-Identifier: MIT
// Glob-to-RegExp compiler: `*` (no slash), `?` (one non-slash), `**`
// (any, slashes included), `[...]` classes. Dots are ordinary chars.
// No network, no I/O.

export const MAX_PATTERN = 500;
export const MAX_PATH = 2000;

export class GlobError extends Error {
  constructor(code, detail = '') {
    super(detail ? `${code}: ${detail}` : code);
    this.name = 'GlobError';
    this.code = code;
  }
}

const REGEX_CHARS = new Set(['.', '^', '$', '+', '(', ')', '|', '{', '}', '[', ']', '\\']);

/** Compile a glob to an anchored RegExp. */
export function compile(glob) {
  if (typeof glob !== 'string') throw new GlobError('NOT_STRING');
  if (glob.length === 0) throw new GlobError('EMPTY');
  if (glob.length > MAX_PATTERN) throw new GlobError('TOO_LONG');
  let re = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*') {
      if (glob[i + 1] === '*') {
        // '**' consumes an optional following slash: '**/' matches zero+ dirs.
        if (glob[i + 2] === '/') { re += '(?:.*/)?'; i += 2; }
        else { re += '.*'; i++; }
      } else {
        re += '[^/]*';
      }
    } else if (c === '?') {
      re += '[^/]';
    } else if (c === '[') {
      const end = glob.indexOf(']', i + 1);
      if (end === -1) throw new GlobError('BAD_CLASS');
      let cls = glob.slice(i + 1, end);
      if (cls.length === 0) throw new GlobError('BAD_CLASS');
      let neg = '';
      if (cls[0] === '!' || cls[0] === '^') { neg = '^'; cls = cls.slice(1); }
      if (cls.length === 0) throw new GlobError('BAD_CLASS');
      // Ranges pass through; backslash escaped. A literal ] is unsupported.
      re += `[${neg}${cls.replace(/\\/g, '\\\\')}]`;
      i = end;
    } else if (REGEX_CHARS.has(c)) {
      re += `\\${c}`;
    } else {
      re += c;
    }
  }
  return new RegExp(`^${re}$`);
}

/** True when path matches the glob. */
export function match(glob, path) {
  if (typeof path !== 'string') throw new GlobError('NOT_STRING_PATH');
  if (path.length > MAX_PATH) throw new GlobError('PATH_TOO_LONG');
  return compile(glob).test(path);
}

/** Filter paths, preserving order. */
export function filter(glob, paths) {
  if (!Array.isArray(paths)) throw new GlobError('NOT_ARRAY');
  const re = compile(glob);
  return paths.filter((p) => typeof p === 'string' && p.length <= MAX_PATH && re.test(p));
}
