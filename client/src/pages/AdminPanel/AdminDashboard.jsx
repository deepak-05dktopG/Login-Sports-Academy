/**
 * What it is: Admin panel page (Dashboard screen).
 * Non-tech note: This is the admin home page with shortcuts to admin tools.
 */

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAdminAuthenticated, getLoggedInAdmin } from "../../utils/adminAuth";
import AdminLayout from "../../components/adminPanel/AdminLayout";
import api from "../../api/api";
import Swal from "sweetalert2";
import {
  FaArrowRight,
  FaBookmark,
  FaClipboard,
  FaComments,
  FaFileAlt,
  FaQrcode,
  FaUsers,
  FaWhatsapp,
  FaUserShield,
} from "react-icons/fa";
import { formatHHmmTo12Hour } from "../../utils/dateTime";

// Admin dashboard — landing page after login, shows navigation cards for all admin features
const AdminDashboard = () => {
  const navigate = useNavigate();
  const currentAdmin = getLoggedInAdmin();
  const superAdmin = currentAdmin?.role === 'superadmin';

  useEffect(
  // Redirect to login page if admin session token is missing or expired
  () => {
    if (!isAdminAuthenticated()) {
      navigate("/admin");
    }
  }, [navigate]);

  const [isPoolFull, setIsPoolFull] = useState(false);
  const [poolFullTiming, setPoolFullTiming] = useState("");
  const [savingPoolStatus, setSavingPoolStatus] = useState(false);

  useEffect(() => {
    const fetchPoolStatus = async () => {
      try {
        const { data } = await api.get('/settings/pool_full_status');
        if (data.success && data.value) {
          setIsPoolFull(data.value.isFull || false);
          setPoolFullTiming(data.value.timing || "");
        }
      } catch (err) {
        console.error("Failed to load pool full status", err);
      }
    };
    fetchPoolStatus();
  }, []);

  const savePoolStatus = async () => {
    setSavingPoolStatus(true);
    try {
      await api.post('/admin/settings/pool_full_status', {
        value: {
          isFull: isPoolFull,
          timing: poolFullTiming
        }
      });
      Swal.fire({
        title: 'Saved!',
        text: 'Pool status updated successfully',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to update pool status', 'error');
    } finally {
      setSavingPoolStatus(false);
    }
  };

  const dashboardCards = [
    {
      title: "Offline Membership",
      description: "Register cash payments and print ID cards",
      icon: <FaUsers />,
      path: "/admin/offline-membership",
      color: "#0099FF",
      count: "",
    },
    {
      title: "Members",
      description: "View members, expiry, and QR codes",
      icon: <FaUsers />,
      path: "/admin/members",
      color: "#00FFD4",
      count: "",
    },
    {
      title: "Attendance Scan",
      description: "Scan member QR to record check-in",
      icon: <FaQrcode />,
      path: "/admin/attendance/scan",
      color: "#00FFD4",
      count: "",
    },
    {
      title: "Attendance Records",
      description: "Filter, download, and manage history",
      icon: <FaQrcode />,
      path: "/admin/attendance",
      color: "#0099FF",
      count: "",
    },
    // {
    //   title: "Lesson Plans",
    //   description: "Manage yearly plans and learning levels",
    //   icon: <FaBookmark />,
    //   path: "/admin/lesson-plans",
    //   color: "#00FFD4",
    //   count: "",
    // },
    {
      title: "Members Feedback",
      description: "View and manage customer feedback",
      icon: <FaComments />,
      path: "/admin/feedback",
      color: "#FF6B9D",
      count: "",
    },
    {
      title: "Weekly Worksheets",
      description: "Track progress and assignments",
      icon: <FaClipboard />,
      path: "/admin/worksheets",
      color: "#9664FF",
      count: "",
    },
    {
      title: "Daily Tracker",
      description: "Track all daily entries, expenses, and download records",
      icon: <FaClipboard />,
      path: "/admin/daily-tracker",
      color: "#00BFFF",
      count: "",
    },
    {
      title: "Posts & Updates",
      description: "Create and manage announcements",
      icon: <FaFileAlt />,
      path: "/admin/posts",
      color: "#FFB6C1",
      count: "",
    },
    {
      title: "WhatsApp Status",
      description: "Manage WhatsApp connection and notification logs",
      icon: <FaWhatsapp />,
      path: "/admin/whatsapp-status",
      color: "#25D366",
      count: "",
    },
    // Only super admins see the Admin Setup card
    ...(superAdmin ? [{
      title: "Admin Setup",
      description: "Manage admin login credentials and roles",
      icon: <FaUserShield />,
      path: "/admin/manage-admins",
      color: "#FFB800",
      count: "",
    }] : []),
  ];

  return (
    <AdminLayout>
        
        <div style={{ padding: "0 40px 60px 40px", maxWidth: "1400px", margin: "0 auto" }}>
          
          {/* Welcome Section */}
          <div style={{ marginBottom: "50px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div style={{ width: "80px", height: "80px", borderRadius: "20px", background: "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(255,184,0,0.2))", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.1)" }}>
                <img src="/assets/Logo.png" alt="Logo" style={{ width: "50px", filter: "drop-shadow(0 0 10px rgba(0,212,255,0.5))" }} />
              </div>
              <div>
                <h1
                  style={{
                    color: "#fff",
                    fontSize: "clamp(2rem, 4vw, 2.8rem)",
                    fontWeight: 900,
                    margin: 0,
                    letterSpacing: "-1px"
                  }}
                >
                  Command <span style={{ color: "#00D4FF" }}>Center</span>
                </h1>
                <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "1.1rem", margin: "5px 0 0 0" }}>
                  Login Sports Academy Management Dashboard
                </p>
              </div>
            </div>

            {/* POOL FULL STATUS CONTROLLER */}
            <div style={{
              background: "rgba(15, 23, 42, 0.6)",
              border: isPoolFull ? "1.5px solid #ef4444" : "1.5px solid rgba(255,255,255,0.1)",
              borderRadius: "16px",
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              maxWidth: "400px",
              width: "100%",
              boxSizing: "border-box",
              boxShadow: isPoolFull ? "0 0 20px rgba(239, 68, 68, 0.15)" : "none",
              transition: "all 0.3s ease",
              backdropFilter: "blur(4px)"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", color: "#fff", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", margin: 0 }}>
                  <input 
                    type="checkbox" 
                    checked={isPoolFull} 
                    onChange={(e) => setIsPoolFull(e.target.checked)} 
                    style={{ 
                      width: "18px", 
                      height: "18px", 
                      accentColor: "#ef4444", 
                      cursor: "pointer" 
                    }} 
                  />
                  <span>🏊 Swim Pool is FULL</span>
                </label>
                
                {isPoolFull && (
                  <span style={{ fontSize: "10px", fontWeight: 900, color: "#fff", background: "#ef4444", padding: "2px 8px", borderRadius: "99px", textTransform: "uppercase" }}>
                    FULL
                  </span>
                )}
              </div>

              {isPoolFull && (
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    value={poolFullTiming}
                    onChange={(e) => setPoolFullTiming(e.target.value)}
                    placeholder="Timing, e.g. 4 PM - 6 PM, or Until 5 PM"
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid rgba(255,255,255,0.2)",
                      background: "rgba(10, 15, 30, 0.8)",
                      color: "#fff",
                      fontSize: "0.9rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              )}

              <button
                onClick={savePoolStatus}
                disabled={savingPoolStatus}
                style={{
                  width: "100%",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  background: isPoolFull ? "#ef4444" : "#00D4FF",
                  color: isPoolFull ? "#fff" : "#000",
                  transition: "all 0.2s"
                }}
              >
                {savingPoolStatus ? "Saving..." : "Save Pool Status"}
              </button>
            </div>
          </div>

        {/* Stats Section */}
        {/* <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              style={{
                background: "rgba(15, 25, 50, 0.7)",
                border: `1px solid ${stat.color}`,
                borderRadius: "12px",
                padding: "25px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = `0 10px 30px rgba(${hexToRgb(stat.color)}, 0.3)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
                <div
                  style={{
                    fontSize: "2rem",
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </div>
                <div>
                  <p style={{ color: "rgba(255, 255, 255, 0.6)", margin: 0, fontSize: "0.9rem" }}>
                    {stat.label}
                  </p>
                  <h2 style={{ color: stat.color, margin: "5px 0 0 0", fontSize: "2rem", fontWeight: 900 }}>
                    {stat.value}
                  </h2>
                </div>
              </div>
            </div>
          ))}
        </div> */}

          {/* Main Dashboard Cards (Bento Grid) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "24px",
            }}
          >
            {dashboardCards.map(
            (card, index) => {
              return (
                <Link
                  key={index}
                  to={card.path}
                  style={{
                    textDecoration: "none",
                    background: "rgba(10, 14, 26, 0.6)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    borderTop: `1px solid rgba(255, 255, 255, 0.1)`,
                    borderRadius: "24px",
                    padding: "32px",
                    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                  onMouseEnter={
                  e => {
                    e.currentTarget.style.transform = "translateY(-5px) scale(1.02)";
                    e.currentTarget.style.background = "rgba(15, 20, 35, 0.8)";
                    e.currentTarget.style.borderColor = `rgba(${hexToRgb(card.color)}, 0.4)`;
                    e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(${hexToRgb(card.color)}, 0.15)`;
                  }}
                  onMouseLeave={
                  e => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.background = "rgba(10, 14, 26, 0.6)";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.05)";
                    e.currentTarget.style.borderTopColor = "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Subtle Gradient Spot inside card */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: "150px",
                      height: "150px",
                      background: `radial-gradient(circle, ${card.color}15 0%, transparent 70%)`,
                      borderRadius: "50%",
                      transform: "translate(30%, -30%)",
                      pointerEvents: "none"
                    }}
                  />
                  
                  <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" }}>
                    <div
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "16px",
                        background: `rgba(${hexToRgb(card.color)}, 0.1)`,
                        border: `1px solid rgba(${hexToRgb(card.color)}, 0.2)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem",
                        color: card.color,
                        marginBottom: "24px",
                      }}
                    >
                      {card.icon}
                    </div>

                    <h3
                      style={{
                        color: "#fff",
                        fontSize: "1.3rem",
                        fontWeight: 700,
                        marginBottom: "12px",
                        letterSpacing: "-0.5px"
                      }}
                    >
                      {card.title}
                    </h3>

                    <p
                      style={{
                        color: "rgba(255, 255, 255, 0.5)",
                        marginBottom: "24px",
                        lineHeight: "1.6",
                        fontSize: "0.95rem",
                        flex: 1
                      }}
                    >
                      {card.description}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "auto",
                        borderTop: "1px solid rgba(255,255,255,0.05)",
                        paddingTop: "16px"
                      }}
                    >
                      <span
                        style={{
                          color: "rgba(255,255,255,0.8)",
                          fontWeight: 600,
                          fontSize: "0.9rem",
                        }}
                      >
                        Manage <FaArrowRight style={{ marginLeft: "8px", color: card.color, fontSize: "0.8rem" }} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

        {/* Recent Activity Section */}
        {/* <div style={{ marginTop: "50px" }}>
          <h2 style={{ color: "#00FFD4", marginBottom: "20px", fontSize: "1.8rem" }}>Recent Activity</h2>
          <div
            style={{
              background: "rgba(15, 25, 50, 0.7)",
              border: "1px solid rgba(0, 255, 212, 0.3)",
              borderRadius: "12px",
              padding: "30px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {[
                { text: "New feedback received from Raj Kumar", time: "2 hours ago", color: "#FF6B9D" },
                { text: "Lesson plan updated for Intermediate level", time: "5 hours ago", color: "#00FFD4" },
                { text: "New post published: Achievement Recognition", time: "1 day ago", color: "#FFB6C1" },
                { text: "Weekly worksheet completed by 12 students", time: "2 days ago", color: "#9664FF" },
              ].map((activity, index) => (
                <div
                  key={index}
                  style={{
                    padding: "15px",
                    background: "rgba(0, 255, 212, 0.05)",
                    borderLeft: `3px solid ${activity.color}`,
                    borderRadius: "8px",
                  }}
                >
                  <p style={{ color: "rgba(255, 255, 255, 0.9)", margin: 0, marginBottom: "5px" }}>
                    {activity.text}
                  </p>
                  <span style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "0.85rem" }}>
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div> */}
      </div>
    </AdminLayout>
  );
};

// Convert hex color code to RGB string for use in rgba() box-shadow on dashboard cards
const hexToRgb = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "0, 0, 0";
};

export default AdminDashboard;
