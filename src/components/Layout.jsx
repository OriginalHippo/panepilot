import { supabase } from '../supabaseClient';

export default function Layout({ user, onLogout, children }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (onLogout) onLogout();
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="flex justify-between items-center px-8 py-4 border-b border-red-200">
        <div className="text-2xl font-bold text-red-700">PanePilot</div>
        <nav>
          <a href="/dashboard" className="mx-2 text-red-600 hover:underline">Dashboard</a>
          <a href="/customers" className="mx-2 text-red-600 hover:underline">Customers</a>
          <a href="/jobs" className="mx-2 text-red-600 hover:underline">Jobs</a>
          <a href="/invoices" className="mx-2 text-red-600 hover:underline">Invoices</a>
          {user && (
            <button
              className="ml-6 text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-50"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </nav>
      </header>
      <main className="max-w-4xl mx-auto py-6 px-4">{children}</main>
    </div>
  );
}
