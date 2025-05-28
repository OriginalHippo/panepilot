import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

// Placeholder Auth component (will add full version next)
function Auth({ onAuth }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-red-700">
      <div>
        <h1 className="text-3xl font-bold mb-6">PanePilot</h1>
        <p className="mb-3">Auth component will go here.</p>
      </div>
    </div>
  );
}

// Placeholder Layout component (will add full version next)
function Layout({ user, onLogout, children }) {
  return (
    <div>
      <header className="bg-white border-b border-red-200 p-4">
        <div className="font-bold text-2xl text-red-700">PanePilot</div>
      </header>
      <main className="max-w-3xl mx-auto p-6">{children}</main>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener?.subscription.unsubscribe();
  }, []);

  if (!user) return <Auth onAuth={setUser} />;
  return (
    <Layout user={user} onLogout={() => setUser(null)}>
      <div className="text-xl text-red-700">Welcome, {user.email}!</div>
      <div>Dashboard and navigation will go here next.</div>
    </Layout>
  );
}
