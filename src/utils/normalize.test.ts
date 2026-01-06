import { describe, expect, it } from 'vitest';
import { checkDuplicate, hashNormalizedCode, normalizeCode } from './normalize';

describe('normalizeCode', () => {
  it('trims leading/trailing whitespace and trailing spaces per line', () => {
    const code = '\n  const x = 1;   \n\n';
    expect(normalizeCode(code)).toBe('const x = 1;');
  });

  it('returns empty string for whitespace-only code', () => {
    expect(normalizeCode('   ')).toBe('');
  });
});

describe('hashNormalizedCode', () => {
  it('produces deterministic hash', () => {
    const first = hashNormalizedCode('console.log(1);');
    const second = hashNormalizedCode('console.log(1);');
    expect(first).toBe(second);
  });
});

describe('checkDuplicate', () => {
  const snippets = [
    {
      id: '1',
      name: 'Alpha',
      description: '',
      code: 'a',
      keyTerms: [],
      language: 'js',
      normalizedHash: 'hash-a',
      createdAt: '',
      updatedAt: '',
    },
  ];

  it('flags duplicate by name', () => {
    const result = checkDuplicate(snippets, { name: 'alpha', normalizedHash: 'x' });
    expect(result.byName?.id).toBe('1');
  });

  it('flags duplicate by content', () => {
    const result = checkDuplicate(snippets, { name: 'Beta', normalizedHash: 'hash-a' });
    expect(result.byContent?.id).toBe('1');
  });
});
