import { useEffect, useState } from 'react';

type TagInputProps = {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
};

const TagInput = ({ value, onChange, placeholder }: TagInputProps) => {
  const [input, setInput] = useState('');

  useEffect(() => {
    setInput(value.join(', '));
  }, [value]);

  const handleBlur = () => {
    const tokens = input
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length)
      .filter((t, idx, arr) => arr.indexOf(t) === idx);
    onChange(tokens);
  };

  return (
    <input
      className="input"
      value={input}
      placeholder={placeholder ?? 'comma,separated,tags'}
      onChange={(e) => setInput(e.target.value)}
      onBlur={handleBlur}
    />
  );
};

export default TagInput;
