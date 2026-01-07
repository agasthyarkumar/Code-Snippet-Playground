import { useEffect, useMemo, useState } from 'react';
import { nanoid } from 'nanoid';
import { DuplicateConflicts, Snippet } from '../types';
import {
  buildSnippet,
  checkDuplicate,
  detectLanguage,
  formatKeyTerms,
  normalizeCode,
  updateSnippet,
} from '../utils/normalize';

export type SavePayload = {
  id?: string;
  name: string;
  description?: string;
  code: string;
  keyTermsRaw?: string;
  language?: string;
};

type SaveResult = {
  snippet?: Snippet;
  conflicts?: DuplicateConflicts;
  trimmedWarning?: boolean;
  wasNew?: boolean;
};

const STORAGE_KEY = 'code-snippet-playground:v1';
const LEGACY_KEYS = ['ai-snippet-manager:v1'];

const seedSnippets = (): Snippet[] => {
  const starter = [
    {
      id: nanoid(),
      name: 'React useDebounce Hook',
      description: 'Lightweight debounce for inputs',
      code: `import { useEffect, useState } from 'react';

export function useDebounce(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}`,
      keyTerms: ['react', 'hooks', 'debounce'],
      language: 'JavaScript',
    },
    {
      id: nanoid(),
      name: 'SQL Upsert Template',
      description: 'Basic Postgres upsert statement',
      code: `INSERT INTO table_name (id, value)
VALUES ($1, $2)
ON CONFLICT (id) DO UPDATE
SET value = EXCLUDED.value;`,
      keyTerms: ['postgres', 'sql', 'upsert'],
      language: 'SQL',
    },
  ];

  return starter.map((base) => buildSnippet(base));
};

export const useSnippets = () => {
  const [snippets, setSnippets] = useState<Snippet[]>(() => {
    // Try new key first
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Migrate from any legacy keys if found
      for (const k of LEGACY_KEYS) {
        const legacy = localStorage.getItem(k);
        if (legacy) {
          raw = legacy;
          try {
            localStorage.setItem(STORAGE_KEY, legacy);
            localStorage.removeItem(k);
          } catch (e) {
            // non-fatal; continue with parsed legacy data in memory
          }
          break;
        }
      }
    }

    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Snippet[];
        return parsed;
      } catch (err) {
        console.error('Failed to parse saved snippets', err);
      }
    }
    return seedSnippets();
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
  }, [snippets]);

  const search = (term: string, language?: string) => {
    const t = term.toLowerCase();
    return snippets.filter((s) => {
      const matchesTerm =
        !term ||
        s.name.toLowerCase().includes(t) ||
        (s.description ?? '').toLowerCase().includes(t) ||
        s.keyTerms.some((kt) => kt.toLowerCase().includes(t));
      const matchesLang = !language || s.language === language;
      return matchesTerm && matchesLang;
    });
  };

  const save = (payload: SavePayload): SaveResult => {
    const nameTrimmed = payload.name.trim();
    const codeNormalized = normalizeCode(payload.code);
    const hadTrimWarning = nameTrimmed !== payload.name || codeNormalized !== payload.code.trim();

    if (!nameTrimmed || !codeNormalized) {
      throw new Error('Name and snippet code are required');
    }

    const language = payload.language || detectLanguage(codeNormalized);
    const keyTerms = formatKeyTerms(payload.keyTermsRaw ?? '');

    const base = {
      id: payload.id ?? nanoid(),
      name: nameTrimmed,
      description: payload.description?.trim() || undefined,
      code: codeNormalized,
      keyTerms,
      language,
    };

    const existing = payload.id ? snippets.find((s) => s.id === payload.id) : null;
    if (payload.id && !existing) {
      throw new Error('Snippet not found for update');
    }

    const candidate = payload.id ? updateSnippet(existing as Snippet, base) : buildSnippet(base);

    const conflicts = checkDuplicate(snippets, {
      id: payload.id,
      name: candidate.name,
      normalizedHash: candidate.normalizedHash,
    });

    if (conflicts.byName || conflicts.byContent) {
      return { conflicts, trimmedWarning: hadTrimWarning };
    }

    setSnippets((prev) => {
      if (payload.id) {
        return prev.map((s) => (s.id === payload.id ? candidate : s));
      }
      return [candidate, ...prev];
    });

    return { snippet: candidate, trimmedWarning: hadTrimWarning, wasNew: !payload.id };
  };

  const forceSave = (payload: SavePayload): SaveResult => {
    const result = save({ ...payload, name: payload.name.trim(), code: payload.code.trim() });
    if (result.conflicts) {
      // Conflicts resolved by user decision, push anyway
      const nameTrimmed = payload.name.trim();
      const codeNormalized = normalizeCode(payload.code);
      const language = payload.language || detectLanguage(codeNormalized);
      const keyTerms = formatKeyTerms(payload.keyTermsRaw ?? '');
      const base = {
        id: payload.id ?? nanoid(),
        name: nameTrimmed,
        description: payload.description?.trim() || undefined,
        code: codeNormalized,
        keyTerms,
        language,
      };
      const existing = payload.id ? snippets.find((s) => s.id === payload.id) : null;
      const candidate = payload.id ? updateSnippet(existing as Snippet, base) : buildSnippet(base);

      setSnippets((prev) => {
        if (payload.id) {
          return prev.map((s) => (s.id === payload.id ? candidate : s));
        }
        return [candidate, ...prev];
      });

      return { snippet: candidate, wasNew: !payload.id };
    }
    return result;
  };

  const remove = (id: string) => {
    setSnippets((prev) => prev.filter((s) => s.id !== id));
  };

  const allLanguages = useMemo(() => {
    const langs = snippets
      .map((s) => s.language)
      .filter((l): l is string => Boolean(l))
      .filter((l, idx, arr) => arr.indexOf(l) === idx);
    return langs;
  }, [snippets]);

  return { snippets, search, save, remove, allLanguages, forceSave };
};
