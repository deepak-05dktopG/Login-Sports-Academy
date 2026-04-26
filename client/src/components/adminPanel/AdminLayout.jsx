/**
 * Shared layout wrapper for all admin panel pages.
 * Provides the unified dark background, ambient glows, grid pattern,
 * and the floating AdminNavbar.
 */
import AdminNavbar from './AdminNavbar'

const AdminLayout = ({ children, showNavbar = true, style = {} }) => {
    return (
        <div
            style={{
                minHeight: '100vh',
                background: '#03050A',
                fontFamily: "'Inter', sans-serif",
                position: 'relative',
                overflow: 'hidden',
                ...style,
            }}
        >
            {/* Background Ambient Glows */}
            <div style={{ position: 'fixed', top: '-10%', left: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0 }} />
            <div style={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(255,184,0,0.05) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0 }} />
            <div style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px)', backgroundSize: '50px 50px', zIndex: 0 }} />

            <div style={{ position: 'relative', zIndex: 10 }}>
                {showNavbar && <AdminNavbar />}
                {children}
            </div>
        </div>
    )
}

export default AdminLayout
