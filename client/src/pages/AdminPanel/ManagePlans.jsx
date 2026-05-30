import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import Swal from 'sweetalert2';
import AdminLayout from '../../components/adminPanel/AdminLayout';

const emptyForm = {
    planName: '',
    type: 'monthly',
    serviceType: 'swimming',
    basePrice: '',
    durationInDays: '',
    stockType: 'rental',
    stockCount: '',
    isActive: true,
};

const SERVICE_LABEL = { swimming: '🏊 Swimming', badminton: '🏸 Badminton', general: '⚡ General' };

const ManagePlans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ ...emptyForm, type: 'monthly' });
    const [editingId, setEditingId] = useState(null);
    const [filterService, setFilterService] = useState('all');
    const [activeTab, setActiveTab] = useState('membership'); // 'membership' | 'stock'

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/membership/plans');
            setPlans(data.data || []);
        } catch (err) {
            console.error('Failed to fetch plans:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPlans(); }, []);

    // Filter plans lists
    const membershipList = plans.filter(p => p.type !== 'stock');
    const stockList = plans.filter(p => p.type === 'stock');

    const filteredMembershipPlans = filterService === 'all'
        ? membershipList
        : membershipList.filter(p => (p.serviceType || 'swimming') === filterService);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            let payload;
            if (activeTab === 'stock') {
                payload = {
                    planName: form.planName,
                    type: 'stock',
                    serviceType: 'swimming',
                    basePrice: Number(form.basePrice),
                    stockType: form.stockType,
                    stockCount: Number(form.stockCount) || 0,
                    isActive: form.isActive,
                };
            } else {
                payload = {
                    planName: form.planName,
                    type: form.type,
                    serviceType: form.serviceType,
                    basePrice: Number(form.basePrice),
                    durationInDays: form.durationInDays ? Number(form.durationInDays) : undefined,
                    isActive: form.isActive,
                };
            }

            if (editingId) {
                await api.patch(`/admin/membership/plans/${editingId}`, payload);
                Swal.fire({
                    toast: true, position: 'top-end', icon: 'success',
                    title: 'Updated!', text: 'Plan updated successfully',
                    showConfirmButton: false, timer: 2500, timerProgressBar: true,
                    background: 'linear-gradient(135deg, #4ECDC4, #54A0FF)', color: '#fff', iconColor: '#fff'
                });
            } else {
                await api.post('/admin/membership/plans', payload);
                Swal.fire({
                    toast: true, position: 'top-end', icon: 'success',
                    title: 'Added!', text: 'New plan/stock added',
                    showConfirmButton: false, timer: 2500, timerProgressBar: true,
                    background: 'linear-gradient(135deg, #4ECDC4, #54A0FF)', color: '#fff', iconColor: '#fff'
                });
            }
            setForm({ ...emptyForm, type: activeTab === 'stock' ? 'stock' : 'monthly' });
            setEditingId(null);
            fetchPlans();
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'Failed to save', 'error');
        }
    };

    // Quick toggle isActive directly from the list row
    const handleToggleActive = async (plan) => {
        try {
            await api.patch(`/admin/membership/plans/${plan._id}`, { isActive: !plan.isActive });
            Swal.fire({
                toast: true, position: 'top-end', icon: 'success',
                title: !plan.isActive ? '✅ Plan Activated' : '🚫 Plan Deactivated',
                text: !plan.isActive
                    ? 'This plan is now visible on the online membership page.'
                    : 'This plan is now hidden from the online membership page.',
                showConfirmButton: false, timer: 3000, timerProgressBar: true,
                background: !plan.isActive ? 'linear-gradient(135deg, #4ECDC4, #54A0FF)' : 'linear-gradient(135deg, #FF6B6B, #FF9FF3)',
                color: '#fff', iconColor: '#fff'
            });
            fetchPlans();
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'Failed to toggle', 'error');
        }
    };

    const handleEdit = (plan) => {
        setEditingId(plan._id);
        if (plan.type === 'stock') {
            setActiveTab('stock');
            setForm({
                planName: plan.planName || '',
                type: 'stock',
                serviceType: 'swimming',
                basePrice: plan.basePrice || '',
                durationInDays: '',
                stockType: plan.stockType || 'rental',
                stockCount: plan.stockCount !== undefined ? plan.stockCount : '',
                isActive: plan.isActive !== false,
            });
        } else {
            setActiveTab('membership');
            setForm({
                planName: plan.planName || '',
                type: plan.type || 'monthly',
                serviceType: plan.serviceType || 'swimming',
                basePrice: plan.basePrice || '',
                durationInDays: plan.durationInDays || '',
                stockType: 'rental',
                stockCount: '',
                isActive: plan.isActive !== false,
            });
        }
    };

    const handleDelete = async (planId) => {
        const result = await Swal.fire({
            title: 'Delete Plan/Stock?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#FF6B6B',
            cancelButtonColor: '#667eea',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            background: 'linear-gradient(135deg, #1a1f3a, #0f1629)',
            color: '#fff'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/admin/membership/plans/${planId}`);
                Swal.fire({
                    toast: true, position: 'top-end', icon: 'success',
                    title: 'Deleted!', text: 'Plan/Stock deleted successfully',
                    showConfirmButton: false, timer: 3000, timerProgressBar: true,
                    background: 'linear-gradient(135deg, #4ECDC4, #54A0FF)', color: '#fff', iconColor: '#fff'
                });
                fetchPlans();
            } catch (err) {
                Swal.fire({
                    toast: true, position: 'top-end', icon: 'error',
                    title: 'Error', text: err.response?.data?.message || 'Failed to delete',
                    showConfirmButton: false, timer: 3000, timerProgressBar: true,
                    background: 'linear-gradient(135deg, #FF6B6B, #FF9FF3)', color: '#fff', iconColor: '#fff'
                });
            }
        }
    };

    const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #444', background: '#111', color: '#fff' };

    // Reusable isActive toggle widget for the form
    const ActiveToggle = () => (
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}>
            <div
                onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
                style={{
                    width: 44, height: 24, borderRadius: 12,
                    background: form.isActive ? '#00FFD4' : '#444',
                    position: 'relative', transition: 'background 0.2s', flexShrink: 0,
                    cursor: 'pointer',
                }}
            >
                <div style={{
                    position: 'absolute', top: 3, left: form.isActive ? 23 : 3,
                    width: 18, height: 18, borderRadius: '50%', background: '#fff',
                    transition: 'left 0.2s',
                }} />
            </div>
            <span style={{ color: form.isActive ? '#00FFD4' : 'rgba(255,255,255,0.45)', fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap' }}>
                {form.isActive ? '✅ Active (Visible Online)' : '🚫 Inactive (Hidden Online)'}
            </span>
        </label>
    );

    return (
        <AdminLayout>
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 40px 60px 40px' }}>
                <h2 style={{ fontSize: '24px', color: '#00FFD4', marginBottom: '8px' }}>Manage Plans &amp; Inventory</h2>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginBottom: 20 }}>
                    💡 Plans marked <strong style={{ color: '#00FFD4' }}>Active</strong> appear on the public online membership page. Inactive plans are hidden.
                </p>

                {/* Tab Selectors */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                    <button type="button" onClick={() => { setActiveTab('membership'); setEditingId(null); setForm({ ...emptyForm, type: 'monthly' }); }}
                        style={{
                            padding: '10px 20px', borderRadius: '5px', border: 'none', fontWeight: 'bold', cursor: 'pointer',
                            background: activeTab === 'membership' ? '#00FFD4' : 'transparent',
                            color: activeTab === 'membership' ? '#000' : 'rgba(255,255,255,0.6)',
                            transition: 'all 0.2s'
                        }}>
                        📋 Membership Plans
                    </button>
                    <button type="button" onClick={() => { setActiveTab('stock'); setEditingId(null); setForm({ ...emptyForm, type: 'stock' }); }}
                        style={{
                            padding: '10px 20px', borderRadius: '5px', border: 'none', fontWeight: 'bold', cursor: 'pointer',
                            background: activeTab === 'stock' ? '#00FFD4' : 'transparent',
                            color: activeTab === 'stock' ? '#000' : 'rgba(255,255,255,0.6)',
                            transition: 'all 0.2s'
                        }}>
                        📦 Stock &amp; Inventory
                    </button>
                </div>

                {/* Forms Section */}
                {activeTab === 'membership' ? (
                    <form onSubmit={handleSave} style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '30px', alignItems: 'flex-end' }}>
                        <input required value={form.planName} onChange={e => setForm({ ...form, planName: e.target.value })} placeholder="Plan Name (e.g. 1 Month)" style={{ ...inputStyle, flex: 1, minWidth: 150 }} />
                        <select required value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputStyle}>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                            <option value="summer">Summer</option>
                            <option value="family">Family</option>
                            <option value="public">Public Batch</option>
                        </select>
                        <select required value={form.serviceType} onChange={e => setForm({ ...form, serviceType: e.target.value })} style={{ ...inputStyle, minWidth: 120 }}>
                            <option value="swimming">🏊 Swimming</option>
                            <option value="badminton">🏸 Badminton</option>
                        </select>
                        <input required type="number" min="0" value={form.basePrice} onChange={e => setForm({ ...form, basePrice: e.target.value })} placeholder="Price (₹)" style={{ ...inputStyle, width: '100px' }} />
                        <input type="number" min="1" value={form.durationInDays} onChange={e => setForm({ ...form, durationInDays: e.target.value })} placeholder="Days" style={{ ...inputStyle, width: '80px' }} />
                        <ActiveToggle />
                        <button type="submit" style={{ padding: '10px 20px', background: '#00FFD4', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                            {editingId ? 'Update Plan' : 'Add Plan'}
                        </button>
                        {editingId && (
                            <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} style={{ padding: '10px 20px', background: '#444', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Cancel</button>
                        )}
                    </form>
                ) : (
                    <form onSubmit={handleSave} style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '30px', alignItems: 'flex-end' }}>
                        <input required value={form.planName} onChange={e => setForm({ ...form, planName: e.target.value })} placeholder="Stock Item Name (e.g. Cap)" style={{ ...inputStyle, flex: 1, minWidth: 150 }} />
                        <select required value={form.stockType} onChange={e => setForm({ ...form, stockType: e.target.value })} style={inputStyle}>
                            <option value="rental">🔑 Rental Stock</option>
                            <option value="buying">🛍️ Buying Stock</option>
                        </select>
                        <input required type="number" min="0" value={form.basePrice} onChange={e => setForm({ ...form, basePrice: e.target.value })} placeholder="Price (₹)" style={{ ...inputStyle, width: '110px' }} />
                        <input required type="number" min="0" value={form.stockCount} onChange={e => setForm({ ...form, stockCount: e.target.value })} placeholder="Stock Count" style={{ ...inputStyle, width: '120px' }} />
                        <button type="submit" style={{ padding: '10px 20px', background: '#00FFD4', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                            {editingId ? 'Update Stock' : 'Add Stock'}
                        </button>
                        {editingId && (
                            <button type="button" onClick={() => { setEditingId(null); setForm({ ...emptyForm, type: 'stock' }); }} style={{ padding: '10px 20px', background: '#444', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Cancel</button>
                        )}
                    </form>
                )}

                {/* Lists Section */}
                {loading ? <p style={{ color: '#fff' }}>Loading lists...</p> : (
                    activeTab === 'membership' ? (
                        <>
                            {/* Service Filter Tabs */}
                            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                                {['all', 'swimming', 'badminton'].map(svc => (
                                    <button key={svc} onClick={() => setFilterService(svc)}
                                        style={{
                                            padding: '6px 16px', borderRadius: 20, border: '1px solid',
                                            borderColor: filterService === svc ? (svc === 'swimming' ? '#00D4FF' : svc === 'badminton' ? '#FFB800' : '#00FFD4') : 'rgba(255,255,255,0.15)',
                                            background: filterService === svc ? (svc === 'swimming' ? 'rgba(0,212,255,0.15)' : svc === 'badminton' ? 'rgba(255,184,0,0.15)' : 'rgba(0,255,212,0.12)') : 'transparent',
                                            color: filterService === svc ? (svc === 'swimming' ? '#00D4FF' : svc === 'badminton' ? '#FFB800' : '#00FFD4') : 'rgba(255,255,255,0.6)',
                                            cursor: 'pointer', fontWeight: 700, fontSize: 13, transition: 'all 0.2s',
                                        }}>
                                        {svc === 'all' ? '📋 All' : SERVICE_LABEL[svc]}
                                    </button>
                                ))}
                                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, alignSelf: 'center', marginLeft: 8 }}>
                                    {filteredMembershipPlans.length} plan{filteredMembershipPlans.length !== 1 ? 's' : ''}
                                </span>
                            </div>

                            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(0,0,0,0.5)', textAlign: 'left' }}>
                                        <th style={{ padding: '15px' }}>Plan Name</th>
                                        <th style={{ padding: '15px' }}>Sport</th>
                                        <th style={{ padding: '15px' }}>Type</th>
                                        <th style={{ padding: '15px' }}>Price (₹)</th>
                                        <th style={{ padding: '15px' }}>Days</th>
                                        <th style={{ padding: '15px' }}>Status</th>
                                        <th style={{ padding: '15px' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredMembershipPlans.map(p => (
                                        <tr key={p._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', opacity: p.isActive === false ? 0.55 : 1 }}>
                                            <td style={{ padding: '15px' }}>{p.planName}</td>
                                            <td style={{ padding: '15px' }}>
                                                <span style={{
                                                    padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700,
                                                    background: (p.serviceType || 'swimming') === 'swimming' ? 'rgba(0,212,255,0.15)' : 'rgba(255,184,0,0.15)',
                                                    color: (p.serviceType || 'swimming') === 'swimming' ? '#00D4FF' : '#FFB800',
                                                }}>
                                                    {SERVICE_LABEL[p.serviceType || 'swimming'] || p.serviceType}
                                                </span>
                                            </td>
                                            <td style={{ padding: '15px', textTransform: 'capitalize' }}>{p.type}</td>
                                            <td style={{ padding: '15px' }}>{p.basePrice}</td>
                                            <td style={{ padding: '15px' }}>{p.durationInDays || '-'}</td>
                                            <td style={{ padding: '15px' }}>
                                                <button
                                                    onClick={() => handleToggleActive(p)}
                                                    title={p.isActive === false ? 'Click to activate (show online)' : 'Click to deactivate (hide online)'}
                                                    style={{
                                                        padding: '4px 12px', borderRadius: 20, border: '1px solid',
                                                        borderColor: p.isActive === false ? '#ef4444' : '#00FFD4',
                                                        background: p.isActive === false ? 'rgba(239,68,68,0.1)' : 'rgba(0,255,212,0.1)',
                                                        color: p.isActive === false ? '#ef4444' : '#00FFD4',
                                                        fontWeight: 700, fontSize: 11, cursor: 'pointer', whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {p.isActive === false ? '🚫 Inactive' : '✅ Active'}
                                                </button>
                                            </td>
                                            <td style={{ padding: '15px', display: 'flex', gap: '10px' }}>
                                                <button onClick={() => handleEdit(p)} style={{ padding: '5px 15px', background: 'transparent', color: '#3b82f6', border: '1px solid #3b82f6', borderRadius: '5px', cursor: 'pointer' }}>Edit</button>
                                                <button onClick={() => handleDelete(p._id)} style={{ padding: '5px 15px', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredMembershipPlans.length === 0 && (
                                        <tr>
                                            <td colSpan={7} style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>No membership plans found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                            <thead>
                                <tr style={{ background: 'rgba(0,0,0,0.5)', textAlign: 'left' }}>
                                    <th style={{ padding: '15px' }}>Stock Name</th>
                                    <th style={{ padding: '15px' }}>Type</th>
                                    <th style={{ padding: '15px' }}>Price (₹)</th>
                                    <th style={{ padding: '15px' }}>Count (Available)</th>
                                    <th style={{ padding: '15px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stockList.map(p => (
                                    <tr key={p._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                        <td style={{ padding: '15px' }}>{p.planName}</td>
                                        <td style={{ padding: '15px' }}>
                                            <span style={{
                                                padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700,
                                                background: p.stockType === 'rental' ? 'rgba(0, 212, 255, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                                color: p.stockType === 'rental' ? '#00D4FF' : '#10b981',
                                            }}>
                                                {p.stockType === 'rental' ? '🔑 Rental' : '🛍️ Buying'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px' }}>₹{p.basePrice}</td>
                                        <td style={{ padding: '15px' }}>
                                            <span style={{
                                                fontWeight: 'bold',
                                                color: p.stockCount <= 0 ? '#ef4444' : p.stockCount <= 3 ? '#fbbf24' : '#10b981'
                                            }}>
                                                {p.stockCount <= 0 ? 'Out of Stock' : `${p.stockCount} left`}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px', display: 'flex', gap: '10px' }}>
                                            <button onClick={() => handleEdit(p)} style={{ padding: '5px 15px', background: 'transparent', color: '#3b82f6', border: '1px solid #3b82f6', borderRadius: '5px', cursor: 'pointer' }}>Edit</button>
                                            <button onClick={() => handleDelete(p._id)} style={{ padding: '5px 15px', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {stockList.length === 0 && (
                                    <tr>
                                        <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>No stock items configured.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )
                )}
            </div>
        </AdminLayout>
    );
};

export default ManagePlans;
