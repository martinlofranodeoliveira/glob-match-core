import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { compile, match, filter, GlobError } from '../src/glob.mjs';

describe('match', () => {
  it('handles stars, questions and slashes', () => {
    assert.equal(match('*.js', 'a.js'), true);
    assert.equal(match('*.js', 'a/b.js'), false);
    assert.equal(match('?.js', 'a.js'), true);
    assert.equal(match('?.js', 'ab.js'), false);
    assert.equal(match('**/*.js', 'a/b/c.js'), true);
    assert.equal(match('**/*.js', 'c.js'), true);
    assert.equal(match('src/**', 'src/a/b'), true);
  });
  it('handles classes, negation and escapes', () => {
    assert.equal(match('file.[jt]s', 'file.js'), true);
    assert.equal(match('file.[jt]s', 'file.xs'), false);
    assert.equal(match('file.[!t]s', 'file.js'), true);
    assert.equal(match('a+b', 'a+b'), true);
    assert.equal(match('[a-c]x', 'bx'), true);
  });
  it('rejects bad classes and input', () => {
    assert.throws(() => compile('a['), (e) => e.code === 'BAD_CLASS');
    assert.throws(() => compile('[]'), (e) => e.code === 'BAD_CLASS');
    assert.throws(() => compile(''), (e) => e.code === 'EMPTY');
    assert.throws(() => match('*.js', 42), (e) => e.code === 'NOT_STRING_PATH');
    assert.ok(new GlobError('X') instanceof Error);
  });
});

describe('filter', () => {
  it('preserves order and skips non-strings', () => {
    assert.deepEqual(filter('*.md', ['b.md', 'a.txt', 'a.md', 42]), ['b.md', 'a.md']);
    assert.throws(() => filter('*.md', 'nope'), (e) => e.code === 'NOT_ARRAY');
  });
});
