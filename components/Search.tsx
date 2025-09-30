
import React, { useState, useCallback } from 'react';
import { runSearch, SearchResult } from '../services/geminiService';
import { SearchIcon, SparklesIcon } from './icons/Icons';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SearchResult | null>(null);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const searchResult = await runSearch(query);
      setResult(searchResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-full bg-gray-900 text-white flex flex-col items-center p-4 sm:p-6">
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
        {!result && !loading && (
          <div className="text-center mt-24">
            <h1 className="text-5xl sm:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
              QOOGLE
            </h1>
            <p className="text-gray-400">Your intelligent gateway to information and entertainment.</p>
          </div>
        )}
        
        <div className={`relative w-full mt-8 ${result || loading ? '' : 'sm:mt-12'}`}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            className="w-full pl-5 pr-14 py-4 bg-gray-800 border border-gray-700 rounded-full text-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300"
            disabled={loading}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-purple-600 rounded-full hover:bg-purple-700 disabled:bg-gray-600 transition-colors"
          >
            <SearchIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="w-full mt-8">
          {loading && (
             <div className="flex flex-col items-center justify-center text-center text-gray-400">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
                <p className="mt-4">Thinking...</p>
            </div>
          )}
          {error && <p className="text-red-400 text-center">{error}</p>}
          {result && (
            <div className="bg-gray-800/50 rounded-lg p-6 animate-fade-in">
              <div className="flex items-start gap-3 mb-4">
                <SparklesIcon className="h-6 w-6 text-purple-400 flex-shrink-0 mt-1"/>
                <p className="text-lg whitespace-pre-wrap leading-relaxed">{result.text}</p>
              </div>

              {result.sources && result.sources.length > 0 && (
                <div className="mt-6 border-t border-gray-700 pt-4">
                  <h3 className="text-sm font-semibold text-gray-400 mb-3">Sources:</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.sources.map((source, index) => (
                      <a
                        key={index}
                        href={source.web.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm bg-gray-700 text-blue-300 px-3 py-1 rounded-full hover:bg-gray-600 transition-colors"
                      >
                        {new URL(source.web.uri).hostname}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;