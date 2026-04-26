import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import Swal from 'sweetalert2';
import AdminLayout from '../../components/adminPanel/AdminLayout';
import { FaSwimmingPool, FaTableTennis } from 'react-icons/fa';

const emptyForm = { planName: '', type: 'monthly', serviceType: 'swimming', basePrice: '', durationInDays: '' };

const SERVICE_LABEL = { swimming: '🏊 Swimming', badminton: '🏸 Badminton', general: '⚡ General' };

const ManagePlans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [filterService, setFilterService] = useState('all');

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/membership/plans'); // Gets all plans
            setPlans(data.data || []);
        } catch (err) {
            console.error('Failed to fetch plans:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPlans(); }, []);

    const filteredPlans = filterService === 'all'
        ? plans
        : plans.filter(p => (p.serviceType || 'swimming') === filterService);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                planName: form.planName,
                type: form.type,
                serviceType: form.serviceType,
                basePrice: Number(form.basePrice),
                durationInDays: form.durationInDays ? Number(form.durationInDays) : undefined
            };

            if (editingId) {
                await api.patch(`/admin/membership/plans/${editingId}`, payload);
                Swal.fire('Updated!', 'Plan updated successfully', 'success');
            } else {
                await api.post('/admin/membership/plans', payload);
                Swal.fire('Added!', 'New plan added', 'success');
            }
            setForm(emptyForm);
            setEditingId(null);
            fetchPlans();
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'Failed to save', 'error');
        }
    };

    const handleEdit = (plan) => {
        setEditingId(plan._id);
        setForm({
            planName: plan.planName || '',
            type: plan.type || 'monthly',
            serviceType: plan.serviceType || 'swimming',
            basePrice: plan.basePrice || '',
            durationInDays: plan.durationInDays || ''
        });
    };

    const handleDelete = async (planId) => {
        const result = await Swal.fire({
            title: 'Delete Plan?',
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
                    title: 'Deleted!', text: 'Plan deleted successfully',
                    showConfirmButton: false, timer: 3000, timerProgressBar: true,
                    background: 'linear-gradient(135deg, #4ECDC4, #54A0FF)', color: '#fff', iconColor: '#fff'
                });
                fetchPlans();
            } catch (err) {
                Swal.fire({
                    toast: true, position: 'top-end', icon: 'error',
                    title: 'Error', text: err.response?.data?.message || 'Failed to delete plan',
                    showConfirmButton: false, timer: 3000, timerProgressBar: true,
                    background: 'linear-gradient(135deg, #FF6B6B, #FF9FF3)', color: '#fff', iconColor: '#fff'
                });
            }
        }
    };

    const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #444', background: '#111', color: '#fff' };

    return (
        <AdminLayout>
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 40px 60px 40px' }}>
                <h2 style={{ fontSize: '24px', color: '#00FFD4' }}>Manage Plans</h2>
                
                {/* Add/Edit Form */}
                <form onSubmit={handleSave} style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '30px', alignItems: 'flex-end' }}>
                    <input required value={form.planName} onChange={e => setForm({...form, planName: e.target.value})} placeholder="Plan Name (e.g. 1 Month)" style={{ ...inputStyle, flex: 1, minWidth: 150 }} />
                    <select required value={form.type} onChange={e => setForm({...form, type: e.target.value})} style={inputStyle}>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                        <option value="summer">Summer</option>
                        <option value="family">Family</option>
                        <option value="public">Public Batch</option>
                    </select>
                    <select required value={form.serviceType} onChange={e => setForm({...form, serviceType: e.target.value})} style={{ ...inputStyle, minWidth: 120 }}>
                        <option value="swimming">🏊 Swimming</option>
                        <option value="badminton">🏸 Badminton</option>
                    </select>
                    <input required type="number" value={form.basePrice} onChange={e => setForm({...form, basePrice: e.target.value})} placeholder="Price (₹)" style={{ ...inputStyle, width: '100px' }} />
                    <input type="number" value={form.durationInDays} onChange={e => setForm({...form, durationInDays: e.target.value})} placeholder="Days" style={{ ...inputStyle, width: '80px' }} />
                    
                    <button type="submit" style={{ padding: '10px 20px', background: '#00FFD4', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        {editingId ? 'Update Plan' : 'Add Plan'}
                    </button>
                    {editingId && (
                        <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} style={{ padding: '10px 20px', background: '#444', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Cancel</button>
                    )}
                </form>

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
                        {filteredPlans.length} plan{filteredPlans.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {/* Plan List */}
                {loading ? <p>Loading lists...</p> : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                        <thead>
                            <tr style={{ background: 'rgba(0,0,0,0.5)', textAlign: 'left' }}>
                                <th style={{ padding: '15px' }}>Plan Name</th>
                                <th style={{ padding: '15px' }}>Sport</th>
                                <th style={{ padding: '15px' }}>Type</th>
                                <th style={{ padding: '15px' }}>Price (₹)</th>
                                <th style={{ padding: '15px' }}>Days</th>
                                <th style={{ padding: '15px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPlans.map(p => (
                                <tr key={p._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
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
                                    <td style={{ padding: '15px', display: 'flex', gap: '10px' }}>
                                        <button onClick={() => handleEdit(p)} style={{ padding: '5px 15px', background: 'transparent', color: '#3b82f6', border: '1px solid #3b82f6', borderRadius: '5px', cursor: 'pointer' }}>Edit</button>
                                        <button onClick={() => handleDelete(p._id)} style={{ padding: '5px 15px', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </AdminLayout>
    );
};

export default ManagePlans;
