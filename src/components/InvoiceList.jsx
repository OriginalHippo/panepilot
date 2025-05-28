import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function InvoiceList({ user }) {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [jobId, setJobId] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('unpaid');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const fetchInvoices = async () => {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', user.id)
      .order('issued_at', { ascending: false });
    if (error) setError(error.message);
    else setInvoices(data);
  };

  const fetchCustomers = async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('id, name')
      .eq('user_id', user.id)
      .order('name', { ascending: true });
    if (error) setError(error.message);
    else setCustomers(data);
  };

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select('id, date')
      .eq('user_id', user.id)
      .order('date', { ascending: false });
    if (error) setError(error.message);
    else setJobs(data);
  };

  useEffect(() => {
    fetchInvoices();
    fetchCustomers();
    fetchJobs();
    // eslint-disable-next-line
  }, [user]);

  const addInvoice = async (e) => {
    e.preventDefault();
    setError('');
    if (!customerId || !amount) {
      setError('Customer and Amount are required.');
      return;
    }
    const { error } = await supabase.from('invoices').insert({
      user_id: user.id,
      customer_id: customerId,
      job_id: jobId || null,
      amount: parseFloat(amount),
      status,
      due_date: dueDate || null,
    });
    if (error) setError(error.message);
    else {
      setCustomerId('');
      setJobId('');
      setAmount('');
      setStatus('unpaid');
      setDueDate('');
      fetchInvoices();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-red-700 mb-4">Invoices</h2>
      <form onSubmit={addInvoice} className="mb-6 flex flex-col gap-2 bg-red-50 p-4 rounded">
        <select
          className="p-2 border rounded"
          value={customerId}
          onChange={e => setCustomerId(e.target.value)}
          required
        >
          <option value="">Select Customer</option>
          {customers.map(c => (
            <option value={c.id} key={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          className="p-2 border rounded"
          value={jobId}
          onChange={e => setJobId(e.target.value)}
        >
          <option value="">Assign to Job (optional)</option>
          {jobs.map(j => (
            <option value={j.id} key={j.id}>{j.date}</option>
          ))}
        </select>
        <input
          className="p-2 border rounded"
          type="number"
          value={amount}
          placeholder="Amount"
          onChange={e => setAmount(e.target.value)}
          required
        />
        <select
          className="p-2 border rounded"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="unpaid">Unpaid</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
        <input
          className="p-2 border rounded"
          type="date"
          value={dueDate}
          placeholder="Due Date"
          onChange={e => setDueDate(e.target.value)}
        />
        <button className="bg-red-600 text-white rounded py-2 font-semibold">Add Invoice</button>
        {error && <div className="text-red-500">{error}</div>}
      </form>
      <ul>
        {invoices.map(inv => (
          <li key={inv.id} className="mb-2 p-3 border rounded shadow bg-white">
            <span className="font-bold">
              {customers.find(c => c.id === inv.customer_id)?.name || 'Unknown Customer'}
            </span>
            <span className="ml-2 text-sm text-gray-500">
              £{inv.amount} — {inv.status}
            </span>
            <span className="ml-2 text-sm">{inv.due_date && `Due: ${inv.due_date}`}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
