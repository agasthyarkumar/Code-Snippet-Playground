import { useMemo } from 'react';
import { Snippet } from '../types';

type Props = {
  snippets: Snippet[];
  selected?: string;
  onSelect: (lang: string | '') => void;
};

const LanguageStats = ({ snippets, selected, onSelect }: Props) => {
  const stats = useMemo(() => {
    const map = new Map<string, { count: number }>();
    for (const s of snippets) {
      if (!s.language) continue;
      if (!map.has(s.language)) map.set(s.language, { count: 0 });
      const entry = map.get(s.language)!;
      entry.count += 1;
    }
    return Array.from(map.entries())
      .map(([language, { count }]) => ({ language, count }))
      .sort((a, b) => (b.count - a.count) || a.language.localeCompare(b.language));
  }, [snippets]);

  if (stats.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {stats.map(({ language, count }) => {
        const isActive = selected === language;
        const base =
          'flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-all duration-200 ease-out active:scale-95 shadow-sm';
        const activeStyle =
          'bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.18),rgba(236,72,153,0.12))] text-white border-transparent shadow-[0_16px_36px_rgba(37,99,235,0.25)]';
        const inactiveStyle =
          'bg-white text-black border-[rgba(37,99,235,0.45)] hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(37,99,235,0.18)] dark:bg-black dark:text-white dark:border-[rgba(96,165,250,0.45)]';

        return (
          <button
            key={language}
            type="button"
            className={`${base} ${isActive ? activeStyle : inactiveStyle}`}
            onClick={() => onSelect(isActive ? '' : language)}
            aria-pressed={isActive}
            title={`${language}: ${count} snippet${count !== 1 ? 's' : ''}`}
          >
            <span>{language}</span>
            <span className={`text-xs font-semibold ${isActive ? 'text-white/90' : 'text-black/70 dark:text-white/70'}`}>{count}</span>
          </button>
        );
      })}
    </div>
  );
};

export default LanguageStats;
