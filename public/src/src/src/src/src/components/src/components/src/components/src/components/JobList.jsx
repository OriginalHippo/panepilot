import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function JobList({ user }) {
  const [jobs, setJobs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('scheduled');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: true });
    if (error) setError(error.message);
    else setJobs(data);
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

  useEffect(() => {
    fetchJobs();
    fetchCustomers();
    // eslint-disable-next-line
  }, [user]);

  const addJob = async (e) => {
    e.preventDefault();
    setError('');
    if (!customerId || !date) {
      setError('Customer and Date are required.');
      return;
    }
    const { error } = await supabase.from('jobs').insert({
      user_id: user.id,
      customer_id: customerId,
      date,
      status,
      notes,
    });
    if (error) setError(error.message);
    else {
      setCustomerId('');
      setDate('');
      setStatus('scheduled');
      setNotes('');
      fetchJobs();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-red-700 mb-4">Jobs</h2>
      <form onSubmit={addJob} className="mb-6 flex flex-col gap-2 bg-red-50 p-4 rounded">
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
        <input
          className="p-2 border rounded"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
        />
        <select
          className="p-2 border rounded"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="canceled">Canceled</option>
        </select>
        <input
          className="p-2 border rounded"
          value={notes}
          placeholder="Notes"
          onChange={e => setNotes(e.target.value)}
        />
        <button className="bg-red-600 text-white rounded py-2 font-semibold">Add Job</button>
        {error && <div className="text-red-500">{error}</div>}
      </form>
      <ul>
        {jobs.map(job => (
          <li key={job.id} className="mb-2 p-3 border rounded shadow bg-white">
            <span className="font-bold">
              {customers.find(c => c.id === job.customer_id)?.name || 'Unknown Customer'}
            </span>
            <span className="ml-2 text-sm text-gray-500">
              {job.date} — {job.status}
            </span>
            <div className="text-sm">{job.notes}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
