# glob-match-core

Glob to RegExp compiler and matcher: star, question, doublestar,
classes. Zero runtime dependencies, Node >= 22.

Part of the LOFRANO TECNOLOGIA open-source lab. MIT.

```js
import { match } from './src/glob.mjs';
match('**/*.js', 'src/app.js'); // true
```

```sh
npm test          # 4 tests, node:test, no dependencies
npm run demo
```

Dots are ordinary characters. MIT — see `LICENSE`.
[Versão em português](README.pt-BR.md).
