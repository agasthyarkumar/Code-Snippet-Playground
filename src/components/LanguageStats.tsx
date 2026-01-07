import { useMemo } from 'react';
import { Snippet } from '../types';

type Props = {
  snippets: Snippet[];
  selected?: string;
  onSelect: (lang: string | '') => void;
};

const LanguageStats = ({ snippets, selected, onSelect }: Props) => {
  const stats = useMemo(() => {
    const map = new Map<string, { count: number; terms: Set<string> }>();
    for (const s of snippets) {
      if (!s.language) continue;
      if (!map.has(s.language)) map.set(s.language, { count: 0, terms: new Set() });
      const entry = map.get(s.language)!;
      entry.count += 1;
      for (const t of s.keyTerms) entry.terms.add(t);
    }
    // Convert to sorted array by count desc, then name asc
    return Array.from(map.entries())
      .map(([language, { count, terms }]) => ({ language, count, terms: Array.from(terms).sort() }))
      .sort((a, b) => (b.count - a.count) || a.language.localeCompare(b.language));
  }, [snippets]);

  if (stats.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
      {stats.map(({ language, count, terms }) => {
        const tooltip = terms.length ? `${terms.join(', ')}` : 'No key terms';
        const isActive = selected === language;
        return (
          <button
            key={language}
            type="button"
              className={`flex items-center justify-between rounded-lg border border-black bg-white px-3 py-2 text-left transition hover:-translate-y-0.5 dark:bg-black dark:text-white dark:border-white ${isActive ? 'ring-2 ring-black dark:ring-white' : ''}`.trim()}
            onClick={() => onSelect(isActive ? '' : language)}
            aria-pressed={isActive}
            title={`${language}: ${count} snippet${count !== 1 ? 's' : ''}`}
            data-tooltip={tooltip}
          >
              <div className="text-sm font-semibold">{language}</div>
              <div className="flex items-center gap-2 text-xs text-black/70 dark:text-white/70">
                <span className="rounded-full border border-black px-2 py-0.5 text-[11px] font-semibold text-black dark:border-white dark:text-white">{count}</span>
              <span>snippets</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default LanguageStats;
