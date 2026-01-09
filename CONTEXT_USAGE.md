# React Context API Implementation

This project now uses React's Context API for global state management, avoiding prop drilling and making state accessible throughout the component tree.

## Structure

### Context Provider
- **Location**: `src/contexts/AppContext.tsx`
- **Provider**: `AppProvider`
- **Hook**: `useAppContext()`

### What's Included in Context

#### State
- `snippets`: Array of all code snippets
- `filtered`: Filtered snippets based on search/language
- `allLanguages`: Available programming languages
- `searchTerm`: Current search query
- `languageFilter`: Selected language filter
- `theme`: Current theme ('light' or 'dark')
- `editing`: Snippet being edited
- `showForm`: Form visibility state
- `duplicateConflicts`: Duplicate detection conflicts
- `trimWarning`: Code trimming warning
- `error`: Error message
- `pendingPayload`: Pending save payload
- `confirmDelete`: Snippet pending deletion
- `isClosing`: Form closing animation state

#### Actions
- `setSearchTerm(term)`: Update search term
- `setLanguageFilter(lang)`: Update language filter
- `toggleTheme()`: Switch between light/dark theme
- `handleSubmit(payload)`: Submit snippet form
- `handleForceSave()`: Force save despite conflicts
- `startCreate()`: Open form for new snippet
- `startEdit(snippet)`: Open form to edit snippet
- `closeForm()`: Close the snippet form
- `onDelete(snippet)`: Request snippet deletion
- `confirmDeleteHandler()`: Confirm deletion
- `cancelDelete()`: Cancel deletion

## Usage

### 1. Wrap your app with AppProvider

```tsx
// src/main.tsx
import { AppProvider } from './contexts/AppContext';

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
);
```

### 2. Use the context in any component

```tsx
import { useAppContext } from '../contexts/AppContext';

const MyComponent = () => {
  const { snippets, theme, startCreate, toggleTheme } = useAppContext();

  return (
    <div>
      <p>Total Snippets: {snippets.length}</p>
      <p>Theme: {theme}</p>
      <button onClick={startCreate}>Create Snippet</button>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};
```

### 3. Example Component

See `src/components/ExampleContextUsage.tsx` for a complete example.

## Benefits

1. **No Prop Drilling**: Access state from any component without passing props through multiple levels
2. **Centralized State**: All app state managed in one place
3. **Type Safety**: Full TypeScript support with `AppContextType`
4. **Reusability**: Custom `useAppContext` hook for easy access
5. **Maintainability**: Easier to add new features and modify state

## Implementation Details

The context wraps the existing `useSnippets` hook and combines it with UI state management (theme, modals, forms). This keeps the snippet logic separate while providing a unified interface for components.

## Error Handling

The `useAppContext` hook will throw an error if used outside of `AppProvider`:

```
Error: useAppContext must be used within an AppProvider
```

Always ensure components using the context are descendants of `AppProvider`.
