/**
 * What it is: Admin panel navigation bar.
 * Non-tech note: This is the menu inside the admin area.
 */

import { Link, useLocation, useNavigate } from 'react-router-dom'
import { clearAdminToken } from '../../utils/adminAuth'
import { FaRocket, FaSignOutAlt } from 'react-icons/fa'

// Admin panel top navigation bar with Dashboard, Offline Membership links and Logout
const AdminNavbar = () => {
	const location = useLocation()
	const navigate = useNavigate()

	// Clears admin session token and redirects to the public homepage
	const handleLogout = () => {
		clearAdminToken()
		navigate('/', { replace: true })
	};

	const isDashboard = location.pathname === '/admin/dashboard'
	const isOfflineMembership = location.pathname === '/admin/offline-membership'
	const isManagePlans = location.pathname === '/admin/manage-plans'

	// Returns style object for admin nav links with active state highlighting
	const linkStyle = active => {
		return ({
			display: 'flex',
			alignItems: 'center',
			gap: '8px',
			padding: '10px 18px',
			background: active ? 'rgba(0, 255, 212, 0.15)' : 'transparent',
			color: active ? '#00FFD4' : 'rgba(255, 255, 255, 0.7)',
			border: active ? '1px solid #00FFD4' : '1px solid transparent',
			borderRadius: '8px',
			textDecoration: 'none',
			fontWeight: 500,
			fontSize: '0.9rem',
			transition: 'all 0.3s ease'
		});
	};

	return (
		<nav
			className="admin-navbar-modern"
			style={{
				position: 'sticky',
				top: '20px',
				zIndex: 1000,
				display: 'flex',
				justifyContent: 'center',
				padding: '0 20px',
				marginBottom: '40px',
			}}
		>
			<div
				className="admin-navbar__inner"
				style={{
					background: 'rgba(10, 14, 26, 0.75)',
					backdropFilter: 'blur(20px)',
					WebkitBackdropFilter: 'blur(20px)',
					border: '1px solid rgba(255, 255, 255, 0.1)',
					borderRadius: '20px',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					width: '100%',
					maxWidth: '1400px',
					padding: '12px 25px',
					boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
					gap: '16px',
				}}
			>
				{/* Logo/Name (redirect to client homepage) */}
				<Link
					to="/"
					className="admin-navbar__brand"
					style={{
						textDecoration: 'none',
						display: 'flex',
						alignItems: 'center',
						gap: '12px',
					}}
				>
					<img
						src="/assets/Logo.png"
						alt="Login Sports Academy Logo"
						style={{ height: '40px', width: 'auto', filter: 'drop-shadow(0 0 8px rgba(0, 255, 212, 0.3))' }}
					/>
					<h1
						style={{
							margin: 0,
							fontSize: 'clamp(1.05rem, 3.2vw, 1.5rem)',
							fontWeight: 700,
							background: 'linear-gradient(135deg, #00FFD4 0%, #0099FF 100%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
						}}
					>
						Login Sports Academy Admin
					</h1>
				</Link>

				<div className="admin-navbar__links" style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
					<Link to="/admin/dashboard" style={linkStyle(isDashboard)}>
						<FaRocket /> Dashboard
					</Link>

					<Link to="/admin/manage-plans" style={linkStyle(isManagePlans)}>
						<FaRocket /> Manage Plans
					</Link>

					<Link to="/admin/offline-membership" style={linkStyle(isOfflineMembership)}>
						<FaRocket /> Offline Membership
					</Link>

					<button
						onClick={handleLogout}
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: '8px',
							padding: '10px 18px',
							background: 'rgba(255, 75, 75, 0.1)',
							color: '#ff4b4b',
							border: '1px solid rgba(255, 75, 75, 0.2)',
							borderRadius: '8px',
							cursor: 'pointer',
							fontWeight: 600,
							fontSize: '0.9rem',
							transition: 'all 0.3s ease',
						}}
						onMouseEnter={e => {
							e.currentTarget.style.background = 'rgba(255, 75, 75, 0.2)';
							e.currentTarget.style.transform = 'translateY(-2px)';
						}}
						onMouseLeave={e => {
							e.currentTarget.style.background = 'rgba(255, 75, 75, 0.1)';
							e.currentTarget.style.transform = 'translateY(0)';
						}}
					>
						<FaSignOutAlt /> Logout
					</button>
				</div>
			</div>
		</nav>
	)
};

export default AdminNavbar
