# Contract — glob-match-core

Pure ESM in `src/glob.mjs`, zero runtime dependencies, Node >= 22.
`*` and `?` never cross `/`; dots are ordinary characters.

| Export | Result |
| --- | --- |
| `MAX_PATTERN` (500) · `MAX_PATH` (2000) | Hard bounds. |
| `compile(glob)` | Anchored `RegExp`. `**/` matches zero or more directories; trailing `**` matches everything under. |
| `match(glob, path)` | Boolean. |
| `filter(glob, paths)` | Ordered matches; non-strings skipped. |

Classes `[...]`: ranges pass through, `!`/`^` lead negates, `/` may
match inside a class if listed (unlike `*`). A literal `]` is
unsupported. Regex metacharacters outside classes are escaped.

Errors: `NOT_STRING` · `EMPTY` · `TOO_LONG` · `BAD_CLASS` ·
`NOT_STRING_PATH` · `PATH_TOO_LONG` · `NOT_ARRAY`.
