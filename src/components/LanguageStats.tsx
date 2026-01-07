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
    <div className="stats-grid">
      {stats.map(({ language, count, terms }) => {
        const tooltip = terms.length ? `${terms.join(', ')}` : 'No key terms';
        const isActive = selected === language;
        return (
          <button
            key={language}
            type="button"
            className={`stat-card${isActive ? ' active' : ''}`}
            data-tooltip={tooltip}
            onClick={() => onSelect(isActive ? '' : language)}
            aria-pressed={isActive}
            title={`${language}: ${count} snippet${count !== 1 ? 's' : ''}`}
          >
            <div className="stat-lang">{language}</div>
            <div className="stat-meta">
              <span className="badge">{count}</span>
              <span className="muted" style={{ fontSize: 12 }}>snippets</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default LanguageStats;
