import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import Swal from 'sweetalert2';
import AdminLayout from '../../components/adminPanel/AdminLayout';
import { FaUserShield, FaPlusCircle, FaTrash, FaCheckCircle, FaTimesCircle, FaEye, FaEyeSlash, FaLock, FaEnvelope, FaShieldAlt } from 'react-icons/fa';

const emptyForm = { email: '', password: '', role: 'admin', isActive: true };

const ManageAdmins = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [revealedPasswords, setRevealedPasswords] = useState({});
    const [currentUser, setCurrentUser] = useState(null);

    // Decode logged in user information from JWT token to check role
    const getLoggedInAdmin = () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) return null;
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error('Failed to parse admin token:', e);
            return null;
        }
    };

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/admin/accounts');
            setAdmins(data.data || []);
        } catch (err) {
            console.error('Failed to fetch admins:', err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to retrieve admin accounts list.',
                background: 'linear-gradient(135deg, #151d30, #0a0e1a)',
                color: '#fff',
                confirmButtonColor: '#00D4FF'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setCurrentUser(getLoggedInAdmin());
        fetchAdmins();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (!form.email) {
                Swal.fire('Validation Error', 'Email is required', 'error');
                return;
            }

            const payload = {
                email: form.email.trim().toLowerCase(),
                role: form.role,
                isActive: form.isActive
            };

            // If creating or explicitly setting a new password
            if (form.password) {
                payload.password = form.password;
            }

            if (editingId) {
                await api.put(`/admin/accounts/${editingId}`, payload);
                Swal.fire({
                    toast: true, position: 'top-end', icon: 'success',
                    title: 'Updated!', text: 'Admin details updated successfully',
                    showConfirmButton: false, timer: 3000, timerProgressBar: true,
                    background: 'linear-gradient(135deg, #00D4FF, #0099FF)', color: '#fff', iconColor: '#fff'
                });
            } else {
                if (!form.password) {
                    Swal.fire('Error', 'Password is required for new accounts', 'error');
                    return;
                }
                await api.post('/admin/accounts', payload);
                Swal.fire({
                    toast: true, position: 'top-end', icon: 'success',
                    title: 'Added!', text: 'New admin account added successfully',
                    showConfirmButton: false, timer: 3000, timerProgressBar: true,
                    background: 'linear-gradient(135deg, #00FFD4, #0099FF)', color: '#fff', iconColor: '#fff'
                });
            }
            
            // If the updated user is editing themselves, their token/profile might need refresh.
            // Clear passwords reveal map as encryption key remains stable but state should reset
            setRevealedPasswords({});
            setForm(emptyForm);
            setEditingId(null);
            fetchAdmins();
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Operation Failed',
                text: err.response?.data?.message || 'Failed to save admin credentials',
                background: 'linear-gradient(135deg, #151d30, #0a0e1a)',
                color: '#fff',
                confirmButtonColor: '#ff4d4d'
            });
        }
    };

    const handleEdit = (admin) => {
        setEditingId(admin._id);
        setForm({
            email: admin.email || '',
            password: '', // blank by default for edit
            role: admin.role || 'admin',
            isActive: admin.isActive !== false
        });
    };

    const handleDelete = async (adminId) => {
        const result = await Swal.fire({
            title: 'Delete Admin Account?',
            text: "This admin will immediately lose dashboard and system access!",
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
                await api.delete(`/admin/accounts/${adminId}`);
                Swal.fire({
                    toast: true, position: 'top-end', icon: 'success',
                    title: 'Deleted!', text: 'Admin removed successfully',
                    showConfirmButton: false, timer: 3000, timerProgressBar: true,
                    background: 'linear-gradient(135deg, #FF6B6B, #FF9FF3)', color: '#fff', iconColor: '#fff'
                });
                fetchAdmins();
            } catch (err) {
                Swal.fire({
                    toast: true, position: 'top-end', icon: 'error',
                    title: 'Error', text: err.response?.data?.message || 'Failed to delete admin',
                    showConfirmButton: false, timer: 3000, timerProgressBar: true,
                    background: 'linear-gradient(135deg, #FF6B6B, #FF9FF3)', color: '#fff', iconColor: '#fff'
                });
            }
        }
    };

    const togglePasswordVisibility = async (adminId) => {
        // Toggle off if already revealed
        if (revealedPasswords[adminId]) {
            const updated = { ...revealedPasswords };
            delete updated[adminId];
            setRevealedPasswords(updated);
            return;
        }

        try {
            const { data } = await api.get(`/admin/accounts/${adminId}/password`);
            setRevealedPasswords({
                ...revealedPasswords,
                [adminId]: data.data.password
            });
        } catch (err) {
            console.error('Failed to reveal password:', err);
            Swal.fire({
                icon: 'info',
                title: 'Password Reveal',
                text: err.response?.data?.message || 'This password is not viewable (legacy account). Please reset it first to enable viewing.',
                background: 'linear-gradient(135deg, #151d30, #0a0e1a)',
                color: '#fff',
                confirmButtonColor: '#00FFD4'
            });
        }
    };

    const isSuperAdmin = currentUser?.role === 'superadmin';

    const inputStyle = {
        padding: '12px 16px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(10, 14, 26, 0.8)',
        color: '#fff',
        outline: 'none',
        fontSize: '14px',
        transition: 'all 0.3s ease',
        boxSizing: 'border-box',
        width: '100%'
    };

    const labelStyle = {
        fontSize: '12px',
        color: 'rgba(255, 255, 255, 0.6)',
        fontWeight: 600,
        marginBottom: '6px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    };

    return (
        <AdminLayout>
            <div style={{ width: '100%', minHeight: '85vh', padding: '20px 40px 60px 40px', boxSizing: 'border-box' }}>
                
                {/* Header Banner */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '18px',
                            background: 'linear-gradient(135deg, rgba(0, 255, 212, 0.15), rgba(0, 153, 255, 0.15))',
                            border: '1px solid rgba(0, 255, 212, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px',
                            color: '#00FFD4',
                            boxShadow: '0 0 20px rgba(0, 255, 212, 0.1)'
                        }}>
                            <FaUserShield />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '28px', color: '#fff', margin: 0, fontWeight: 900, letterSpacing: '-0.5px' }}>
                                Admin Credentials Setup
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.5)', margin: '5px 0 0 0', fontSize: '14px' }}>
                                Configure authorization, create secure admin profiles, and manage system roles.
                            </p>
                        </div>
                    </div>
                    {isSuperAdmin && (
                        <div style={{
                            background: 'rgba(255, 184, 0, 0.1)',
                            border: '1px solid rgba(255, 184, 0, 0.3)',
                            borderRadius: '12px',
                            padding: '10px 20px',
                            color: '#FFB800',
                            fontWeight: 700,
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <FaShieldAlt /> Super Admin Privileges Active
                        </div>
                    )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px', width: '100%' }}>
                    
                    {/* Setup Form Card */}
                    <div style={{
                        background: 'rgba(15, 22, 42, 0.55)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '24px',
                        padding: '32px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                        width: '100%',
                        boxSizing: 'border-box'
                    }}>
                        <h3 style={{ color: '#fff', margin: '0 0 24px 0', fontSize: '18px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ color: '#00D4FF' }}>●</span> {editingId ? 'Edit Admin Account Details' : 'Create New Admin Credentials'}
                        </h3>
                        
                        <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', alignItems: 'end' }}>
                            
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={labelStyle}>
                                    <FaEnvelope style={{ marginRight: '6px', color: '#00D4FF' }} /> Email Address *
                                </label>
                                <input 
                                    type="email"
                                    required 
                                    value={form.email} 
                                    onChange={e => setForm({...form, email: e.target.value})} 
                                    placeholder="e.g. administrator@loginsports.in" 
                                    style={inputStyle} 
                                    onFocus={e => {
                                        e.target.style.borderColor = '#00D4FF';
                                        e.target.style.boxShadow = '0 0 15px rgba(0, 212, 255, 0.15)';
                                    }}
                                    onBlur={e => {
                                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={labelStyle}>
                                    <FaLock style={{ marginRight: '6px', color: '#00D4FF' }} /> {editingId ? 'New Password (Leave blank to keep)' : 'Password *'}
                                </label>
                                <input 
                                    type="password" 
                                    required={!editingId} 
                                    value={form.password} 
                                    onChange={e => setForm({...form, password: e.target.value})} 
                                    placeholder={editingId ? "••••••••" : "Enter secure password"} 
                                    style={inputStyle} 
                                    onFocus={e => {
                                        e.target.style.borderColor = '#00D4FF';
                                        e.target.style.boxShadow = '0 0 15px rgba(0, 212, 255, 0.15)';
                                    }}
                                    onBlur={e => {
                                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={labelStyle}>System Role</label>
                                <select 
                                    required 
                                    value={form.role} 
                                    onChange={e => setForm({...form, role: e.target.value})} 
                                    style={{...inputStyle, cursor: 'pointer'}}
                                >
                                    <option value="admin">Admin</option>
                                    <option value="superadmin">Super Admin</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={labelStyle}>Status</label>
                                <select 
                                    required 
                                    value={form.isActive} 
                                    onChange={e => setForm({...form, isActive: e.target.value === 'true'})} 
                                    style={{...inputStyle, cursor: 'pointer'}}
                                >
                                    <option value="true">Active (Access Allowed)</option>
                                    <option value="false">Suspended (Access Blocked)</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" style={{
                                    flex: 1,
                                    padding: '13px 24px',
                                    background: 'linear-gradient(135deg, #00FFD4, #0099FF)',
                                    color: '#000',
                                    fontWeight: 800,
                                    border: 'none',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 15px rgba(0, 255, 212, 0.25)',
                                    fontSize: '14px'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 255, 212, 0.4)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 255, 212, 0.25)';
                                }}
                                >
                                    {editingId ? 'Save Updates' : 'Create Account'}
                                </button>
                                {editingId && (
                                    <button 
                                        type="button" 
                                        onClick={() => { setEditingId(null); setForm(emptyForm); }} 
                                        style={{
                                            padding: '13px 20px',
                                            background: 'rgba(255,255,255,0.05)',
                                            color: '#fff',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Admins Credentials List Card */}
                    <div style={{
                        background: 'rgba(10, 15, 30, 0.45)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '24px',
                        padding: '32px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                        width: '100%',
                        boxSizing: 'border-box',
                        overflow: 'hidden'
                    }}>
                        <h3 style={{ color: '#fff', margin: '0 0 24px 0', fontSize: '18px', fontWeight: 800 }}>
                            Registered Administrator Accounts
                        </h3>

                        {loading ? (
                            <div style={{ padding: '40px 0', textAlign: 'center', color: '#00FFD4', fontSize: '16px' }}>
                                <div style={{
                                    display: 'inline-block',
                                    width: '30px',
                                    height: '30px',
                                    border: '3px solid rgba(0, 255, 212, 0.3)',
                                    borderTopColor: '#00FFD4',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite',
                                    marginBottom: '10px'
                                }}></div>
                                <p style={{ margin: 0 }}>Fetching credentials from LSA mainframe...</p>
                                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                                    <thead>
                                        <tr style={{ background: 'rgba(5, 7, 15, 0.8)', borderBottom: '2px solid rgba(255, 255, 255, 0.08)' }}>
                                            <th style={{ padding: '18px 24px', color: '#00FFD4', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Admin Email</th>
                                            <th style={{ padding: '18px 24px', color: '#00FFD4', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Password</th>
                                            <th style={{ padding: '18px 24px', color: '#00FFD4', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Role</th>
                                            <th style={{ padding: '18px 24px', color: '#00FFD4', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Status</th>
                                            <th style={{ padding: '18px 24px', color: '#00FFD4', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {admins.map(admin => {
                                            const isSelf = currentUser && currentUser.adminDbId === admin._id;
                                            const isPasswordRevealed = revealedPasswords[admin._id];
                                            
                                            return (
                                                <tr key={admin._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                    <td style={{ padding: '18px 24px', fontWeight: 700, color: '#fff' }}>
                                                        {admin.email} {isSelf && <span style={{ fontSize: '11px', color: '#00D4FF', background: 'rgba(0,212,255,0.15)', padding: '2px 8px', borderRadius: '8px', marginLeft: '8px', fontWeight: 600 }}>YOU</span>}
                                                    </td>
                                                    <td style={{ padding: '18px 24px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <code style={{
                                                                fontFamily: 'monospace',
                                                                color: isPasswordRevealed ? '#00FFD4' : 'rgba(255,255,255,0.4)',
                                                                fontSize: isPasswordRevealed ? '14px' : '16px',
                                                                letterSpacing: isPasswordRevealed ? 'normal' : '2px',
                                                                background: isPasswordRevealed ? 'rgba(0, 255, 212, 0.08)' : 'transparent',
                                                                padding: isPasswordRevealed ? '4px 10px' : '0',
                                                                borderRadius: '6px',
                                                                border: isPasswordRevealed ? '1px dashed rgba(0, 255, 212, 0.3)' : 'none',
                                                            }}>
                                                                {isPasswordRevealed ? revealedPasswords[admin._id] : '••••••••'}
                                                            </code>
                                                            {isSuperAdmin && (
                                                                <button
                                                                    onClick={() => togglePasswordVisibility(admin._id)}
                                                                    style={{
                                                                        background: 'none',
                                                                        border: 'none',
                                                                        color: isPasswordRevealed ? '#00FFD4' : 'rgba(255,255,255,0.4)',
                                                                        cursor: 'pointer',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        padding: '6px',
                                                                        borderRadius: '50%',
                                                                        transition: 'all 0.2s ease',
                                                                    }}
                                                                    onMouseEnter={e => e.currentTarget.style.color = '#00FFD4'}
                                                                    onMouseLeave={e => { if(!isPasswordRevealed) e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
                                                                    title={isPasswordRevealed ? 'Hide password' : 'Show password'}
                                                                >
                                                                    {isPasswordRevealed ? <FaEyeSlash /> : <FaEye />}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '18px 24px' }}>
                                                        <span style={{
                                                            padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 800, textTransform: 'uppercase',
                                                            background: admin.role === 'superadmin' ? 'rgba(255,184,0,0.15)' : 'rgba(0,212,255,0.15)',
                                                            color: admin.role === 'superadmin' ? '#FFB800' : '#00D4FF',
                                                            border: admin.role === 'superadmin' ? '1px solid rgba(255,184,0,0.2)' : '1px solid rgba(0,212,255,0.2)',
                                                        }}>
                                                            {admin.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '18px 24px' }}>
                                                        {admin.isActive !== false ? (
                                                            <span style={{ color: '#4ECDC4', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600 }}>
                                                                <FaCheckCircle /> Active
                                                            </span>
                                                        ) : (
                                                            <span style={{ color: '#FF6B6B', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600 }}>
                                                                <FaTimesCircle /> Suspended
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td style={{ padding: '18px 24px', textAlign: 'right' }}>
                                                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                                            <button 
                                                                onClick={() => handleEdit(admin)} 
                                                                style={{
                                                                    padding: '7px 16px',
                                                                    background: 'transparent',
                                                                    color: '#00D4FF',
                                                                    border: '1px solid rgba(0,212,255,0.3)',
                                                                    borderRadius: '8px',
                                                                    cursor: 'pointer',
                                                                    fontWeight: 600,
                                                                    fontSize: '13px',
                                                                    transition: 'all 0.2s'
                                                                }}
                                                                onMouseEnter={e => { e.currentTarget.style.background = '#00D4FF'; e.currentTarget.style.color = '#000'; }}
                                                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#00D4FF'; }}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDelete(admin._id)} 
                                                                disabled={isSelf}
                                                                style={{
                                                                    padding: '7px 16px',
                                                                    background: 'transparent',
                                                                    color: isSelf ? 'rgba(255,255,255,0.2)' : '#FF6B6B',
                                                                    border: isSelf ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(255,107,107,0.3)',
                                                                    borderRadius: '8px',
                                                                    cursor: isSelf ? 'not-allowed' : 'pointer',
                                                                    fontWeight: 600,
                                                                    fontSize: '13px',
                                                                    transition: 'all 0.2s'
                                                                }}
                                                                onMouseEnter={e => {
                                                                    if (!isSelf) {
                                                                        e.currentTarget.style.background = '#FF6B6B';
                                                                        e.currentTarget.style.color = '#000';
                                                                    }
                                                                }}
                                                                onMouseLeave={e => {
                                                                    if (!isSelf) {
                                                                        e.currentTarget.style.background = 'transparent';
                                                                        e.currentTarget.style.color = '#FF6B6B';
                                                                    }
                                                                }}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ManageAdmins;
