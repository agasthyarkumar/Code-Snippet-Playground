export type Snippet = {
  id: string;
  name: string;
  description?: string;
  code: string;
  keyTerms: string[];
  language?: string;
  normalizedHash: string;
  createdAt: string;
  updatedAt: string;
};

export type DuplicateConflicts = {
  byName?: Snippet;
  byContent?: Snippet;
};
