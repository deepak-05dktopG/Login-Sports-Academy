/**
 * What it is: Main React app component (routes/pages are wired here).
 * Non-tech note: This decides which screen shows for each website URL.
 */

import React from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { clearAdminToken } from './utils/adminAuth'

import { useScrollReveal } from './hooks/useScrollReveal'

import AppErrorBoundary from './components/AppErrorBoundary'

import Footer from './components/Footer'

import About from './pages/About'
import Contact from './pages/Contact'
import Gallery from './pages/Gallery'
import Home from './pages/Home'
import Membership from './pages/Membership'
import Service from './pages/Service'

import AdminDashboard from './pages/AdminPanel/AdminDashboard'
import AdminLogin from './pages/AdminPanel/AdminLogin'
import AttendanceRecords from './pages/AdminPanel/AttendanceRecords'
import AttendanceScan from './pages/AdminPanel/AttendanceScan'
import LessonPlans from './pages/AdminPanel/LessonPlans'
import Members from './pages/AdminPanel/Members'
import MembersFeedback from './pages/AdminPanel/MembersFeedback'
import OfflineMembership from './pages/AdminPanel/OfflineMembership'
import Posts from './pages/AdminPanel/Posts'
import WeeklyWorksheets from './pages/AdminPanel/WeeklyWorksheets'




// Logs out admin and redirects to homepage when navigating away from the QR scanner page
// Defined outside App so React sees a stable component type (preserves ref across renders).
function ScannerExitRedirect() {
  const navigate = useNavigate()
  const location = useLocation()
  const lastPathRef = React.useRef(location.pathname)

  React.useEffect(() => {
    const last = lastPathRef.current
    const current = location.pathname
    if (last === '/admin/attendance/scan' && current !== '/admin/attendance/scan') {
      clearAdminToken()
      if (current !== '/') navigate('/', { replace: true })
    }
    lastPathRef.current = current
  }, [location.pathname, navigate])

  return null
}

function App() {
  const appLocation = useLocation()

  // Enables smooth viewport-enter animations for elements using `data-reveal`.
  useScrollReveal()

  // Conditionally renders the Footer only on public pages (not admin routes)
  function FooterMaybe() {
    const location = useLocation()
    if (location.pathname.startsWith('/admin')) return null
    return <Footer />
  }

  // Scrolls to top on every page navigation
  function ScrollToTop() {
    const location = useLocation();
    React.useEffect(
    // Runs scroll-to-top when the route changes
    () => {
      window.scrollTo(0, 0);
    }, [location.pathname]);
    return null;
  }

  return (
    <div className="app">
      
      <main className="main-content">
	  <ScannerExitRedirect />
      <ScrollToTop />
        <AppErrorBoundary resetKey={appLocation.pathname}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/programs" element={<Service />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/contact" element={<Contact />} />
            {/* <Route path="/admin" element={<Admin />} /> */}

            {/* Admin Panel Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/members" element={<Members />} />
            <Route path="/admin/lesson-plans" element={<LessonPlans />} />
            <Route path="/admin/feedback" element={<MembersFeedback />} />
            <Route path="/admin/worksheets" element={<WeeklyWorksheets />} />
            <Route path="/admin/posts" element={<Posts />} />
		    <Route path="/admin/attendance" element={<AttendanceRecords />} />
		    <Route path="/admin/attendance/scan" element={<AttendanceScan />} />
		    <Route path="/admin/offline-membership" element={<OfflineMembership />} />

            {/* Fallbacks to avoid blank pages on removed/unknown routes */}
            <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppErrorBoundary>
      </main> 
	  <FooterMaybe />
    </div>
  )
}

export default App