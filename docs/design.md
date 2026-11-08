# Design — glob-match-core

Single left-to-right pass emitting regex source: `*` → `[^/]*`,
`?` → `[^/]`, `**` → `.*`, `**/` → `(?:.*/)?` so zero directories
match. Everything else is literal except validated classes.

Oracle: star/quest slash discipline, recursive doublestar with and
without leading dirs, classes/negation/ranges, metachar escaping, and
rejection of unclosed/empty classes. Dotfiles follow the ordinary-char
rule, documented as a deviation from shell glob.
