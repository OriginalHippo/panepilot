import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Auth from './components/Auth';
import Layout from './components/Layout';
import CustomerList from './components/CustomerList';
import JobList from './components/JobList';
import InvoiceList from './components/InvoiceList';

function Dashboard({ user }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-red-700 mb-4">Dashboard</h2>
      <ul className="list-disc pl-5">
        <li>Welcome, <b>{user.email}</b>!</li>
        <li>Use the navigation bar to view your Customers, Jobs, and Invoices.</li>
      </ul>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener?.subscription.unsubscribe();
  }, []);

  if (!user) return <Auth onAuth={setUser} />;

  let content;
  if (page === 'customers') content = <CustomerList user={user} />;
  else if (page === 'jobs') content = <JobList user={user} />;
  else if (page === 'invoices') content = <InvoiceList user={user} />;
  else content = <Dashboard user={user} />;

  return (
    <Layout user={user} onLogout={() => setUser(null)}>
      {/* Navigation tabs */}
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded ${page === 'dashboard' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700'}`}
          onClick={() => setPage('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`px-4 py-2 rounded ${page === 'customers' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700'}`}
          onClick={() => setPage('customers')}
        >
          Customers
        </button>
        <button
          className={`px-4 py-2 rounded ${page === 'jobs' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700'}`}
          onClick={() => setPage('jobs')}
        >
          Jobs
        </button>
        <button
          className={`px-4 py-2 rounded ${page === 'invoices' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700'}`}
          onClick={() => setPage('invoices')}
        >
          Invoices
        </button>
      </div>
      {content}
    </Layout>
  );
}
