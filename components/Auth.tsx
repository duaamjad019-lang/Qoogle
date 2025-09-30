import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Auth: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isLoginView) {
        await login(username, password);
      } else {
        await signup(username, password);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
      setLoading(false);
    }
    // No need to set loading to false on success, as the component will unmount
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError(null);
    setUsername('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
            QOOGLE
          </h1>
          <p className="text-gray-400">Your gateway to information and entertainment.</p>
        </div>
        
        <div className="bg-gray-800/50 p-8 rounded-2xl shadow-lg border border-gray-700">
          <h2 className="text-2xl font-bold text-center mb-6">{isLoginView ? 'Sign In' : 'Create Account'}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                placeholder="e.g., cool_user"
              />
            </div>
            <div>
              <label htmlFor="password"className="block text-sm font-medium text-gray-300">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading && (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
                {loading ? 'Processing...' : (isLoginView ? 'Sign In' : 'Sign Up')}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button onClick={toggleView} className="text-sm text-purple-300 hover:text-purple-200">
              {isLoginView ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
