import { Snippet } from '../types';

export const normalizeCode = (code: string): string => {
  const trimmed = code.trim();
  if (!trimmed) return '';
  // Trim trailing spaces per line and collapse trailing blank lines
  const lines = trimmed
    .split('\n')
    .map((line) => line.replace(/\s+$/u, ''));
  // Remove leading/trailing empty lines after trim to avoid false positives
  while (lines.length && !lines[0].length) lines.shift();
  while (lines.length && !lines[lines.length - 1].length) lines.pop();
  return lines.join('\n');
};

export const hashNormalizedCode = (normalized: string): string => {
  // Lightweight, deterministic hash (FNV-1a 32-bit) suited for client-side duplicate checks
  let hash = 0x811c9dc5;
  for (let i = 0; i < normalized.length; i += 1) {
    hash ^= normalized.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  return hash.toString(16);
};

export const detectLanguage = (code: string): string | undefined => {
  const lower = code.toLowerCase();
  if (/^\s*#include\s+<.+?>/mu.test(code) || /std::/u.test(code)) return 'cpp';
  if (/function\s+\w+\(|=>/u.test(code) || /console\.log/u.test(code)) return 'javascript';
  if (/import\s+react/u.test(lower)) return 'javascript';
  if (/def\s+\w+\(|\bself\b/u.test(code)) return 'python';
  if (/package\s+\w+;|public\s+class/u.test(code)) return 'java';
  if (/SELECT\s+.+FROM/u.test(code)) return 'sql';
  if (/fn\s+\w+\(|let\s+mut/u.test(code)) return 'rust';
  return undefined;
};

export const formatKeyTerms = (raw: string): string[] => {
  return raw
    .split(',')
    .map((term) => term.trim())
    .filter((term) => term.length)
    .filter((term, idx, arr) => arr.indexOf(term) === idx);
};

export const buildSnippet = (partial: {
  id: string;
  name: string;
  description?: string;
  code: string;
  keyTerms: string[];
  language?: string;
}): Snippet => {
  const normalized = normalizeCode(partial.code);
  return {
    ...partial,
    normalizedHash: hashNormalizedCode(normalized),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const updateSnippet = (snippet: Snippet, updates: Partial<Snippet>): Snippet => {
  const updated = { ...snippet, ...updates, updatedAt: new Date().toISOString() };
  const normalized = normalizeCode(updated.code);
  return {
    ...updated,
    normalizedHash: hashNormalizedCode(normalized),
  };
};

export const checkDuplicate = (
  snippets: Snippet[],
  candidate: { id?: string; name: string; normalizedHash: string },
): { byName?: Snippet; byContent?: Snippet } => {
  const byName = snippets.find(
    (s) => s.name.toLowerCase() === candidate.name.toLowerCase() && s.id !== candidate.id,
  );
  const byContent = snippets.find(
    (s) => s.normalizedHash === candidate.normalizedHash && s.id !== candidate.id,
  );
  return { byName, byContent };
};
