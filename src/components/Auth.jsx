import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Auth({ onAuth }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let result;
      if (isLogin) {
        result = await supabase.auth.signInWithPassword({ email, password });
      } else {
        result = await supabase.auth.signUp({ email, password });
      }
      if (result.error) throw result.error;
      if (onAuth) onAuth(result.data.user);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-red-300 shadow-md rounded-lg p-8 w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-red-600">{isLogin ? 'Login' : 'Sign Up'}</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <input
          type="email"
          className="mb-3 w-full p-2 border rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="mb-4 w-full p-2 border rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="bg-red-600 hover:bg-red-700 text-white w-full py-2 rounded font-semibold mb-2"
          disabled={loading}
          type="submit"
        >
          {loading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
        </button>
        <div className="text-center">
          <button
            type="button"
            className="text-red-600 hover:underline text-sm"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
          </button>
        </div>
      </form>
    </div>
  );
}
