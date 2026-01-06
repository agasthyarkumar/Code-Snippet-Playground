import { useEffect, useMemo, useState } from 'react';
import { DuplicateConflicts, Snippet } from '../types';
import { SavePayload } from '../hooks/useSnippets';
import CodeEditor from './CodeEditor';
import TagInput from './TagInput';

const COMMON_LANGS = ['javascript', 'typescript', 'python', 'java', 'cpp', 'rust', 'sql', 'go'];

type SnippetFormProps = {
  initial?: Snippet | null;
  languages: string[];
  duplicateConflicts?: DuplicateConflicts;
  trimWarning?: boolean;
  onSubmit: (payload: SavePayload) => void;
  onCancel: () => void;
};

const SnippetForm = ({
  initial,
  languages,
  duplicateConflicts,
  trimWarning,
  onSubmit,
  onCancel,
}: SnippetFormProps) => {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [language, setLanguage] = useState(initial?.language ?? '');
  const [code, setCode] = useState(initial?.code ?? '');
  const [keyTerms, setKeyTerms] = useState<string[]>(initial?.keyTerms ?? []);

  useEffect(() => {
    setName(initial?.name ?? '');
    setDescription(initial?.description ?? '');
    setLanguage(initial?.language ?? '');
    setCode(initial?.code ?? '');
    setKeyTerms(initial?.keyTerms ?? []);
  }, [initial]);

  const languageOptions = useMemo(() => {
    const merged = [...COMMON_LANGS, ...languages].filter((l, idx, arr) => arr.indexOf(l) === idx);
    return merged;
  }, [languages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: initial?.id,
      name,
      description,
      code,
      keyTermsRaw: keyTerms.join(','),
      language: language || undefined,
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label className="label">
          Name*
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Unique snippet name"
            required
          />
        </label>
        <label className="label">
          Language
          <input
            className="input"
            list="language-options"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            placeholder="auto-detect"
          />
          <datalist id="language-options">
            {languageOptions.map((lang) => (
              <option key={lang} value={lang} />
            ))}
          </datalist>
        </label>
        <label className="label">
          Key terms
          <TagInput value={keyTerms} onChange={setKeyTerms} placeholder="auth, api, utils" />
        </label>
      </div>

      <label className="label">
        Description
        <input
          className="input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short context for this snippet"
        />
      </label>

      <label className="label">
        Snippet*
        <CodeEditor value={code} language={language || undefined} onChange={setCode} />
      </label>

      {trimWarning && (
        <div className="alert warn">⚠️ Trailing or leading spaces detected and will be removed.</div>
      )}
      {(duplicateConflicts?.byName || duplicateConflicts?.byContent) && (
        <div className="alert warn">
          ⚠️ This snippet appears to be a duplicate. Please review before saving.
          <div className="muted" style={{ marginTop: 6 }}>
            Conflicts: {duplicateConflicts.byName ? 'name ' : ''}
            {duplicateConflicts.byContent ? 'code content' : ''}
          </div>
        </div>
      )}

      <div className="actions" style={{ justifyContent: 'flex-end' }}>
        <button type="button" className="secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="primary">
          {initial ? 'Update snippet' : 'Save snippet'}
        </button>
      </div>
    </form>
  );
};

export default SnippetForm;
