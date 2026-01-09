import React from 'react';
import { useAppContext } from '../contexts/AppContext';

/**
 * Example component demonstrating how to use the AppContext
 * in any child component without prop drilling.
 */
const ExampleContextUsage = () => {
  const { snippets, theme, startCreate, toggleTheme } = useAppContext();

  return (
    <div className="panel">
      <h3 className="text-lg font-semibold mb-2">Context Usage Example</h3>
      <p className="text-sm mb-4">
        This component demonstrates accessing app state via useContext
      </p>
      
      <div className="space-y-2 text-sm">
        <div>Total Snippets: {snippets.length}</div>
        <div>Current Theme: {theme}</div>
        
        <div className="flex gap-2 mt-4">
          <button 
            className="btn-ghost text-xs"
            onClick={startCreate}
            type="button"
          >
            Create Snippet
          </button>
          <button 
            className="btn-ghost text-xs"
            onClick={toggleTheme}
            type="button"
          >
            Toggle Theme
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExampleContextUsage;
