import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import useProducts from '../hooks/useProducts';
import useOrders from '../hooks/useOrders';
import Loader from '../components/Loader';
import ProductCard from '../components/ProductCard';
import { createProduct, deleteProduct } from '../api/productApi';
import { updateOrderStatus } from '../api/orderApi';
import { getUsers } from '../api/userApi';
import SEO from '../components/SEO';

const initialForm = {
  title: '',
  price: '',
  description: '',
  category: '',
  image: '',
  rating: { rate: '', count: '' },
};

const STATUS_OPTIONS = ['pending', 'ordered', 'shipped', 'delivered'];

function StatCard({ title, value, icon, color }) {
  return (
    <div className="rounded-xl p-6" style={{ background: '#1a1a2e', border: '1px solid #2a2a3e' }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-300">{title}</span>
        <span className="text-2xl" aria-hidden="true">{icon}</span>
      </div>
      <p className="text-3xl font-bold" style={{ color }}>{value}</p>
    </div>
  );
}

function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: users, isLoading: usersLoading } = useQuery({ queryKey: ['users'], queryFn: getUsers });
  const queryClient = useQueryClient();

  const [form, setForm] = useState(initialForm);

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });

  const createMutation = useMutation({
    mutationFn: (product) => createProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setForm(initialForm);
      setActiveTab('products');
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  });

  const handleRemove = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    deleteMutation.mutate(id);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'rate' || name === 'count') {
      setForm((prev) => ({ ...prev, rating: { ...prev.rating, [name]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const product = {
      ...form,
      price: parseFloat(form.price),
      rating: {
        rate: parseFloat(form.rating.rate),
        count: parseInt(form.rating.count, 10),
      },
    };
    createMutation.mutate(product);
  };

  if (productsLoading || ordersLoading || usersLoading) {
    return <Loader />;
  }

  const totalRevenue = (orders || []).reduce((sum, o) => sum + (o.total || 0), 0);

  // Chart data — aggregate orders by date
  const salesByDate = (orders || []).reduce((acc, order) => {
    const date = order.date || 'Unknown';
    const existing = acc.find((d) => d.date === date);
    if (existing) {
      existing.sales += order.total || 0;
      existing.orders += 1;
    } else {
      acc.push({ date, sales: order.total || 0, orders: 1 });
    }
    return acc;
  }, []);

  const sidebarItems = [
    { key: 'overview', label: '📊 Overview', icon: '📊' },
    { key: 'analysis', label: '📈 Analysis', icon: '📈' },
    { key: 'products', label: '📦 Manage Products', icon: '📦' },
    { key: 'create', label: '➕ Add Product', icon: '➕' },
    { key: 'orders', label: '🚚 Manage Orders', icon: '🚚' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen" style={{ background: '#0d0d1a', color: '#fff' }} role="main">
      <SEO title="Admin Dashboard - Manage Products & Orders" description="Admin dashboard to manage products, orders, users, and view analytics." />
      {/* Sidebar — top bar on mobile, icon-only on tablet, full on desktop */}
      <nav className="flex flex-row md:flex-col md:w-16 lg:w-[220px] border-b md:border-b-0 md:border-r p-2 md:p-4 gap-1 overflow-x-auto md:overflow-x-visible" style={{ borderColor: '#2a2a3e', background: '#111128' }} aria-label="Dashboard navigation">
        <h3 className="hidden lg:block text-lg font-bold mb-4 px-2" style={{ color: '#ff6600' }}>🔐 Admin Panel</h3>
        <h3 className="hidden md:block lg:hidden text-lg font-bold mb-2 text-center" style={{ color: '#ff6600' }} aria-hidden="true">🔐</h3>
        {sidebarItems.map((item) => (
          <button
            key={item.key}
            className={`px-3 py-3 min-h-[48px] min-w-[48px] rounded-lg transition-all text-sm font-medium whitespace-nowrap md:text-center lg:text-left ${activeTab === item.key ? 'text-white' : 'text-gray-300 hover:text-white'}`}
            style={activeTab === item.key ? { background: '#ff6600' } : { background: 'transparent' }}
            onClick={() => setActiveTab(item.key)}
            aria-current={activeTab === item.key ? 'page' : undefined}
          >
            <span className="lg:hidden text-xl" aria-hidden="true">{item.icon}</span>
            <span className="hidden lg:inline">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">🔐</span>
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-gray-300 text-sm">Welcome back, <strong>Admin User</strong></p>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard title="Total Orders" value={(orders || []).length} icon="📋" color="#ff6600" />
              <StatCard title="Total Products" value={(products || []).length} icon="📦" color="#ff6600" />
              <StatCard title="Total Users" value={(users || []).length} icon="👥" color="#ff6600" />
              <StatCard title="Total Revenue" value={`₹${totalRevenue.toFixed(2)}`} icon="💰" color="#ff6600" />
            </div>

            {/* Admin Controls */}
            <div className="rounded-xl p-6 mb-8" style={{ background: '#1a1a2e', border: '1px solid #2a2a3e' }}>
              <h3 className="text-lg font-bold italic mb-4" style={{ color: '#ff6600' }}>Administrative Controls</h3>
              <div className="flex gap-3 flex-wrap">
                <button className="btn rounded-full px-6" style={{ background: '#ff6600', color: '#fff', border: 'none' }} onClick={() => setActiveTab('create')}>
                  + Add Product
                </button>
                <button className="btn rounded-full px-6" style={{ background: '#2a2a3e', color: '#fff', border: '1px solid #3a3a4e' }} onClick={() => setActiveTab('products')}>
                  📦 Manage Products
                </button>
                <button className="btn rounded-full px-6" style={{ background: '#2a2a3e', color: '#fff', border: '1px solid #3a3a4e' }} onClick={() => setActiveTab('orders')}>
                  🚚 Manage Orders
                </button>
                <button className="btn rounded-full px-6" style={{ background: '#2a2a3e', color: '#fff', border: '1px solid #3a3a4e' }} onClick={() => setActiveTab('analysis')}>
                  👥 Users Directory
                </button>
              </div>
            </div>

            {/* Recent Orders Preview */}
            {(orders || []).length > 0 && (
              <div className="rounded-xl p-6" style={{ background: '#1a1a2e', border: '1px solid #2a2a3e' }}>
                <h3 className="text-lg font-bold mb-4" style={{ color: '#ff6600' }}>Recent Orders</h3>
                <div className="overflow-x-auto">
                  <table className="table w-full text-sm">
                    <thead>
                      <tr className="text-gray-300 border-b" style={{ borderColor: '#2a2a3e' }}>
                        <th className="py-2 text-left" scope="col">Order ID</th>
                        <th className="py-2 text-left" scope="col">Customer</th>
                        <th className="py-2 text-left" scope="col">Items</th>
                        <th className="py-2 text-left" scope="col">Total</th>
                        <th className="py-2 text-left" scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(orders || []).slice(-5).reverse().map((order) => (
                        <tr key={order.id} className="border-b" style={{ borderColor: '#2a2a3e' }}>
                          <td className="py-3">#{order.id}</td>
                          <td className="py-3">{order.customerName || 'Unknown'}</td>
                          <td className="py-3">{order.items?.length || 0} items</td>
                          <td className="py-3" style={{ color: '#ff6600' }}>₹{(order.total || 0).toFixed(2)}</td>
                          <td className="py-3">
                            <span className="badge badge-sm" style={{
                              background: order.status === 'delivered' ? '#22c55e' : order.status === 'shipped' ? '#3b82f6' : order.status === 'ordered' ? '#f59e0b' : '#ef4444',
                              color: '#fff', border: 'none'
                            }}>
                              {order.status || 'pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* ANALYSIS TAB */}
        {activeTab === 'analysis' && (
          <>
            <h2 className="text-2xl font-bold mb-6">📈 Sales Analysis</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="rounded-xl p-6" style={{ background: '#1a1a2e', border: '1px solid #2a2a3e' }}>
                <h3 className="text-md font-semibold mb-4 text-gray-300">Revenue Over Time</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={salesByDate.length ? salesByDate : [{ date: 'No Data', sales: 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                    <XAxis dataKey="date" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} />
                    <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #3a3a4e', color: '#fff' }} />
                    <Bar dataKey="sales" fill="#ff6600" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-xl p-6" style={{ background: '#1a1a2e', border: '1px solid #2a2a3e' }}>
                <h3 className="text-md font-semibold mb-4 text-gray-300">Orders Trend</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={salesByDate.length ? salesByDate : [{ date: 'No Data', orders: 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                    <XAxis dataKey="date" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} />
                    <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #3a3a4e', color: '#fff' }} />
                    <Line type="monotone" dataKey="orders" stroke="#ff6600" strokeWidth={2} dot={{ fill: '#ff6600' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard title="Total Orders" value={(orders || []).length} icon="📋" color="#ff6600" />
              <StatCard title="Pending" value={(orders || []).filter((o) => o.status === 'pending').length} icon="⏳" color="#ef4444" />
              <StatCard title="Shipped" value={(orders || []).filter((o) => o.status === 'shipped').length} icon="🚚" color="#3b82f6" />
              <StatCard title="Delivered" value={(orders || []).filter((o) => o.status === 'delivered').length} icon="✅" color="#22c55e" />
            </div>

            {/* Users Directory */}
            <div className="rounded-xl p-6" style={{ background: '#1a1a2e', border: '1px solid #2a2a3e' }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#ff6600' }}>👥 Users Directory</h3>
              <div className="overflow-x-auto">
                <table className="table w-full text-sm">
                  <thead>
                    <tr className="text-gray-300 border-b" style={{ borderColor: '#2a2a3e' }}>
                      <th className="py-2 text-left" scope="col">ID</th>
                      <th className="py-2 text-left" scope="col">Name</th>
                      <th className="py-2 text-left" scope="col">Email</th>
                      <th className="py-2 text-left" scope="col">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(users || []).map((user) => (
                      <tr key={user.id} className="border-b" style={{ borderColor: '#2a2a3e' }}>
                        <td className="py-3">#{user.id}</td>
                        <td className="py-3">{user.name}</td>
                        <td className="py-3 text-gray-300">{user.email}</td>
                        <td className="py-3">
                          <span className="badge badge-sm" style={{ background: user.role === 'admin' ? '#ff6600' : '#3b82f6', color: '#fff', border: 'none' }}>
                            {user.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* MANAGE PRODUCTS TAB */}
        {activeTab === 'products' && (
          <>
            <h2 className="text-2xl font-bold mb-4">📦 All Products</h2>
            <button
              type="button"
              className="cursor-pointer font-semibold mb-4 inline-block bg-transparent border-none" style={{ color: '#ef4444' }}
              onClick={() => { if (window.confirm('Delete all products?')) products?.forEach((p) => deleteMutation.mutate(p.id)); }}
            >
              Delete All
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {products?.map((product) => (
                <div className="indicator w-full" key={product.id}>
                  <span
                    className="indicator-item badge px-2 rounded-lg border border-white cursor-pointer" style={{ background: '#ff6600', color: '#fff', border: 'none' }}
                    onClick={(e) => handleRemove(e, product.id)}
                  >
                    Remove
                  </span>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* CREATE PRODUCT TAB */}
        {activeTab === 'create' && (
          <>
            <h2 className="text-2xl font-bold mb-6">➕ Create New Product</h2>
            <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
              <div className="rounded-xl p-6" style={{ background: '#1a1a2e', border: '1px solid #2a2a3e' }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#ff6600' }}>Product Details</h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="font-semibold text-sm w-32 text-gray-300">Image URL</label>
                    <input type="url" name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="input input-bordered w-full" style={{ background: '#0d0d1a', borderColor: '#2a2a3e', color: '#fff' }} required />
                  </div>

                  <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Product Name" className="input input-bordered w-full" style={{ background: '#0d0d1a', borderColor: '#2a2a3e', color: '#fff' }} required />

                  <div className="flex gap-4">
                    <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Product Price" className="input input-bordered w-full" style={{ background: '#0d0d1a', borderColor: '#2a2a3e', color: '#fff' }} step="0.01" required />
                    <input type="number" name="rate" value={form.rating.rate} onChange={handleChange} placeholder="Rating (0-5)" className="input input-bordered w-full" style={{ background: '#0d0d1a', borderColor: '#2a2a3e', color: '#fff' }} step="0.1" min="0" max="5" />
                  </div>

                  <textarea name="description" value={form.description} onChange={handleChange} placeholder="Product Description" className="textarea textarea-bordered w-full" style={{ background: '#0d0d1a', borderColor: '#2a2a3e', color: '#fff' }} rows={3} required />

                  <select name="category" value={form.category} onChange={handleChange} className="select select-bordered w-full" style={{ background: '#0d0d1a', borderColor: '#2a2a3e', color: '#fff' }} required>
                    <option value="" disabled>Select Category</option>
                    <option value="men's clothing">Men&apos;s Clothing</option>
                    <option value="women's clothing">Women&apos;s Clothing</option>
                    <option value="jewelery">Jewelery</option>
                    <option value="electronics">Electronics</option>
                  </select>

                  <input type="number" name="count" value={form.rating.count} onChange={handleChange} placeholder="Stock Count" className="input input-bordered w-full" style={{ background: '#0d0d1a', borderColor: '#2a2a3e', color: '#fff' }} />
                </div>
              </div>

              <button type="submit" className="btn btn-block rounded-lg font-bold" style={{ background: '#ff6600', color: '#fff', border: 'none' }} disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Product'}
              </button>
            </form>
          </>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <>
            <h2 className="text-2xl font-bold mb-6">🚚 Manage Orders</h2>

            {(orders || []).length === 0 ? (
              <div className="rounded-xl p-10 text-center" style={{ background: '#1a1a2e', border: '1px solid #2a2a3e' }}>
                <p className="text-gray-300 text-lg">No orders yet. Orders will appear here after customers complete checkout.</p>
              </div>
            ) : (
              <div className="rounded-xl p-6" style={{ background: '#1a1a2e', border: '1px solid #2a2a3e' }}>
                <div className="overflow-x-auto">
                  <table className="table w-full text-sm">
                    <thead>
                      <tr className="text-gray-300 border-b" style={{ borderColor: '#2a2a3e' }}>
                        <th className="py-3 text-left" scope="col">Order ID</th>
                        <th className="py-3 text-left" scope="col">Customer</th>
                        <th className="py-3 text-left" scope="col">Products</th>
                        <th className="py-3 text-left" scope="col">Total</th>
                        <th className="py-3 text-left" scope="col">Date</th>
                        <th className="py-3 text-right" scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(orders || []).slice().reverse().map((order) => (
                        <tr key={order.id} className="border-b" style={{ borderColor: '#2a2a3e' }}>
                          <td className="py-4 font-semibold">#{order.id}</td>
                          <td className="py-4">
                            <div>{order.customerName}</div>
                            <div className="text-xs text-gray-400">{order.address}, {order.city}</div>
                          </td>
                          <td className="py-4">
                            <div className="flex flex-col gap-1">
                              {order.items?.map((item, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <img src={item.image} alt="" loading="lazy" className="w-8 h-8 object-contain rounded" style={{ background: '#fff' }} />
                                  <span className="text-xs text-gray-300 truncate max-w-[150px]">{item.title}</span>
                                  <span className="text-xs text-gray-400">x{item.quantity || 1}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="py-4 font-bold" style={{ color: '#ff6600' }}>₹{(order.total || 0).toFixed(2)}</td>
                          <td className="py-4 text-gray-300 text-xs">{order.date}</td>
                          <td className="py-4 text-right">
                            <select
                              value={order.status || 'pending'}
                              onChange={(e) => statusMutation.mutate({ id: order.id, status: e.target.value })}
                              className="select select-sm select-bordered"
                              aria-label={`Order #${order.id} status`}
                              style={{
                                background: order.status === 'delivered' ? '#22c55e' : order.status === 'shipped' ? '#3b82f6' : order.status === 'ordered' ? '#f59e0b' : '#ef4444',
                                color: '#fff', border: 'none', fontWeight: 'bold', fontSize: '12px'
                              }}
                            >
                              {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s} style={{ background: '#1a1a2e', color: '#fff' }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;