import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function CustomerList({ user }) {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const fetchCustomers = async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setCustomers(data);
  };

  useEffect(() => {
    fetchCustomers();
  }, [user]);

  const addCustomer = async (e) => {
    e.preventDefault();
    setError('');
    const { error } = await supabase.from('customers').insert({
      user_id: user.id,
      name,
      email,
      phone,
      address,
    });
    if (error) setError(error.message);
    else {
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
      fetchCustomers();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-red-700 mb-4">Customers</h2>
      <form onSubmit={addCustomer} className="mb-6 flex flex-col gap-2 bg-red-50 p-4 rounded">
        <input
          className="p-2 border rounded"
          value={name}
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="p-2 border rounded"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="p-2 border rounded"
          value={phone}
          placeholder="Phone"
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          className="p-2 border rounded"
          value={address}
          placeholder="Address"
          onChange={(e) => setAddress(e.target.value)}
        />
        <button className="bg-red-600 text-white rounded py-2 font-semibold">Add Customer</button>
        {error && <div className="text-red-500">{error}</div>}
      </form>
      <ul>
        {customers.map((cust) => (
          <li key={cust.id} className="mb-2 p-3 border rounded shadow flex flex-col bg-white">
            <span className="font-bold">{cust.name}</span>
            <span className="text-sm text-gray-500">{cust.email} {cust.phone}</span>
            <span className="text-sm">{cust.address}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
