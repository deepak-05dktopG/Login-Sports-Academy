/**
 * What it is: Admin panel page (Login screen with OTP password retrieval).
 * Non-tech note: This is the admin sign-in page with a premium forgot-password OTP verification flow.
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { isAdminAuthenticated, setAdminToken } from "../../utils/adminAuth";
import Navbar from "../../components/Navbar";
import AdminLayout from "../../components/adminPanel/AdminLayout";
import { FaLock, FaRocket, FaEnvelope, FaKey, FaArrowRight } from "react-icons/fa";

// Admin login page — authenticates admin/owner credentials via JWT before granting panel access
const AdminLogin = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const navigate = useNavigate();

  // Forgot password OTP flow states
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1 = Enter Email, 2 = Enter OTP, 3 = Show Password
  const [emailInput, setEmailInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [retrievedPassword, setRetrievedPassword] = useState("");
  const [loginToken, setLoginToken] = useState("");

  // Check for existing authorization on component mount
  useEffect(
    () => {
      if (isAdminAuthenticated()) {
        navigate("/admin/dashboard");
      }
    }, [navigate]);

  // Submit admin ID/email + password to server, store JWT token on success, show error on failure
  const handleAccessSubmit = async e => {
    e.preventDefault();
    setVerifyLoading(true);
    setError("");

    try {
      const res = await api.post("/admin/login", { identifier, password });
      const token = res?.data?.data?.token;
      if (!token) throw new Error("Login failed");
      setAdminToken(token);
      navigate("/admin/dashboard");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Login failed";
      setError(msg);
    } finally {
      setVerifyLoading(false);
    }
  };

  // Step 1: Request 6-digit OTP to registered email
  const handleRequestOtp = async e => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setOtpLoading(true);
    setForgotError("");

    try {
      await api.post("/admin/forgot-password", { email: emailInput });
      setForgotStep(2);
    } catch (err) {
      setForgotError(err?.response?.data?.message || "Failed to send verification code. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  // Step 2: Verify 6-digit OTP and retrieve password + login token
  const handleVerifyOtp = async e => {
    e.preventDefault();
    if (otpInput.length < 6) return;
    setOtpLoading(true);
    setForgotError("");

    try {
      const res = await api.post("/admin/verify-otp", { email: emailInput, otp: otpInput });
      const { password, token } = res.data.data;
      setRetrievedPassword(password);
      setLoginToken(token);
      setForgotStep(3);
    } catch (err) {
      setForgotError(err?.response?.data?.message || "Invalid or expired OTP code.");
    } finally {
      setOtpLoading(false);
    }
  };

  // Step 3: Login directly
  const handleDirectLogin = () => {
    setAdminToken(loginToken);
    navigate("/admin/dashboard");
  };

  return (
    <AdminLayout showNavbar={false} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <Navbar />
      {/* Animated Background Orbs */}
      <div
        style={{
          position: "absolute",
          width: "clamp(240px, 60vw, 400px)",
          height: "clamp(240px, 60vw, 400px)",
          background: "radial-gradient(circle, rgba(0, 255, 200, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          top: "-10%",
          right: "-5%",
          filter: "blur(60px)",
          animation: "float 8s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "clamp(280px, 70vw, 500px)",
          height: "clamp(280px, 70vw, 500px)",
          background: "radial-gradient(circle, rgba(0, 153, 255, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          bottom: "-15%",
          left: "-10%",
          filter: "blur(60px)",
          animation: "float 10s ease-in-out infinite",
        }}
      />
      {/* Grid Pattern */}
      <div
        style={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "100%",
          height: "100%",
          background: "radial-gradient(circle, rgba(0, 255, 200, 0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          animation: "moveGrid 20s linear infinite",
        }}
      />
      {/* Login Card */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          background: "rgba(15, 25, 50, 0.8)",
          border: "1px solid rgba(0, 255, 200, 0.3)",
          borderRadius: "24px",
          padding: "clamp(28px, 6vw, 50px) clamp(18px, 4.5vw, 40px)",
          maxWidth: "450px",
          width: "100%",
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
          animation: "floatCard 6s ease-in-out infinite",
        }}
      >
        {/* Logo/Icon */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "80px",
              height: "80px",
              background: "linear-gradient(135deg, rgba(0, 255, 212, 0.2), rgba(0, 153, 255, 0.2))",
              borderRadius: "50%",
              border: "2px solid rgba(0, 255, 200, 0.3)",
              marginBottom: "20px",
            }}
          >
            <FaLock style={{ fontSize: "2rem", color: "#00FFD4" }} />
          </div>

          <h1
            style={{
              margin: "0 0 10px 0",
              fontSize: "2rem",
              fontWeight: 900,
              background: "linear-gradient(135deg, #00FFD4 0%, #0099FF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
            }}
          >
            <FaRocket /> Admin Portal
          </h1>

          {/* Description */}
          <p
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              marginBottom: "30px",
              lineHeight: 1.6,
              textAlign: "center",
            }}
          >
            Secure access to Login Sports Academy administration
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleAccessSubmit}>
          <input
            type="text"
            placeholder="Admin ID or email"
            value={identifier}
            onChange={
            e => {
              return setIdentifier(e.target.value);
            }}
            disabled={verifyLoading}
            autoComplete="username"
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "12px",
              border: "2px solid rgba(0, 255, 200, 0.3)",
              background: "rgba(255, 255, 255, 0.05)",
              color: "#fff",
              boxSizing: "border-box",
              marginBottom: "14px",
              fontFamily: "Poppins, system-ui",
              fontSize: "1rem",
              transition: "all 0.3s ease",
            }}
            onFocus={
            e => {
              e.currentTarget.style.border = "2px solid #00FFD4";
              e.currentTarget.style.boxShadow = "0 0 20px rgba(0, 255, 212, 0.2)";
            }}
            onBlur={
            e => {
              e.currentTarget.style.border = "2px solid rgba(0, 255, 200, 0.3)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />

          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={
            e => {
              return setPassword(e.target.value);
            }}
            disabled={verifyLoading}
            autoComplete="current-password"
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "12px",
              border: "2px solid rgba(0, 255, 200, 0.3)",
              background: "rgba(255, 255, 255, 0.05)",
              color: "#fff",
              boxSizing: "border-box",
              marginBottom: "20px",
              fontFamily: "Poppins, system-ui",
              fontSize: "1rem",
              transition: "all 0.3s ease",
            }}
            onFocus={
            e => {
              e.currentTarget.style.border = "2px solid #00FFD4";
              e.currentTarget.style.boxShadow = "0 0 20px rgba(0, 255, 212, 0.2)";
            }}
            onBlur={
            e => {
              e.currentTarget.style.border = "2px solid rgba(0, 255, 200, 0.3)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />

          {/* Error Message */}
          {error && !verifyLoading ? (
            <div
              style={{
                background: "rgba(255, 50, 50, 0.15)",
                color: "#FF6B9D",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "20px",
                textAlign: "center",
                border: "1px solid rgba(255, 50, 50, 0.3)",
              }}
            >
              ⚠️ {error}
            </div>
          ) : null}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={verifyLoading || !identifier.trim() || !password.trim()}
            style={{
              width: "100%",
              padding: "16px",
              background:
                verifyLoading || !identifier.trim() || !password.trim()
                  ? "rgba(0, 255, 212, 0.3)"
                  : "linear-gradient(135deg, #00FFD4 0%, #0099FF 100%)",
              color:
                verifyLoading || !identifier.trim() || !password.trim() ? "rgba(0, 0, 0, 0.5)" : "#000",
              border: "none",
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "1rem",
              cursor:
                verifyLoading || !identifier.trim() || !password.trim() ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              fontFamily: "Poppins, system-ui",
            }}
            onMouseEnter={
            e => {
              if (!verifyLoading && identifier.trim() && password.trim()) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 255, 212, 0.4)";
              }
            }}
            onMouseLeave={
            e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {verifyLoading ? "Verifying..." : "Access Admin Panel"}
          </button>
        </form>

        {/* Forgot Password Action Trigger */}
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button
            type="button"
            onClick={() => {
              setShowForgot(true);
              setForgotStep(1);
              setForgotError("");
            }}
            style={{
              background: "none",
              border: "none",
              color: "#00FFD4",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: 600,
              textDecoration: "underline",
              fontFamily: "Poppins, system-ui",
              transition: "color 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.color = "#00D4FF"}
            onMouseLeave={e => e.currentTarget.style.color = "#00FFD4"}
          >
            Forgot Password? Request OTP
          </button>
        </div>

        {/* Footer Info */}
        <p
          style={{
            marginTop: "30px",
            textAlign: "center",
            color: "rgba(255, 255, 255, 0.5)",
            fontSize: "0.85rem",
          }}
        >
          🔒 Secure authentication required
        </p>
      </div>

      {/* Glassmorphic Sliding OTP Forgot Password Modal */}
      {showForgot && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(5, 8, 16, 0.9)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          boxSizing: "border-box"
        }}>
          <div style={{
            background: "rgba(15, 22, 42, 0.95)",
            border: "1px solid rgba(0, 255, 200, 0.3)",
            boxShadow: "0 20px 50px rgba(0, 255, 212, 0.25)",
            borderRadius: "24px",
            padding: "40px",
            maxWidth: "480px",
            width: "100%",
            position: "relative",
            boxSizing: "border-box",
            textAlign: "center",
            fontFamily: "Poppins, system-ui"
          }}>
            {/* Close Button */}
            <button
              onClick={() => {
                setShowForgot(false);
                setForgotStep(1);
                setOtpInput("");
                setForgotError("");
                setRetrievedPassword("");
              }}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.4)",
                fontSize: "28px",
                cursor: "pointer",
                lineHeight: 1,
                transition: "color 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.color = "#FF6B6B"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
            >
              &times;
            </button>

            {forgotStep === 1 && (
              <div>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "rgba(0, 255, 200, 0.1)",
                  border: "1px solid rgba(0, 255, 200, 0.3)",
                  color: "#00FFD4",
                  fontSize: "1.5rem",
                  marginBottom: "20px"
                }}>
                  <FaEnvelope />
                </div>
                
                <h3 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: 800, margin: "0 0 10px 0" }}>
                  Retrieve Credentials
                </h3>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.95rem", lineHeight: 1.5, marginBottom: "30px" }}>
                  Provide your registered administrator email to receive a 6-digit OTP verification code.
                </p>

                <form onSubmit={handleRequestOtp} style={{ textAlign: "left" }}>
                  <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", fontWeight: 600, display: "block", marginBottom: "8px", textTransform: "uppercase" }}>Registered Email</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. coach@loginsports.in"
                    value={emailInput}
                    onChange={e => setEmailInput(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "16px",
                      borderRadius: "12px",
                      border: "2px solid rgba(0, 255, 200, 0.3)",
                      background: "rgba(255, 255, 255, 0.05)",
                      color: "#fff",
                      fontSize: "1rem",
                      boxSizing: "border-box",
                      marginBottom: "20px",
                      outline: "none"
                    }}
                  />
                  {forgotError && (
                    <div style={{ color: "#FF6B9D", background: "rgba(255,50,50,0.12)", border: "1px solid rgba(255,50,50,0.25)", padding: "12px", borderRadius: "10px", marginBottom: "20px", fontSize: "0.9rem" }}>
                      ⚠️ {forgotError}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={otpLoading || !emailInput}
                    style={{
                      width: "100%",
                      padding: "16px",
                      background: "linear-gradient(135deg, #00FFD4, #0099FF)",
                      border: "none",
                      color: "#000",
                      fontWeight: 800,
                      fontSize: "1rem",
                      borderRadius: "12px",
                      cursor: "pointer",
                      boxShadow: "0 4px 15px rgba(0, 255, 212, 0.25)",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={e => {
                      if (!otpLoading) {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 255, 212, 0.4)";
                      }
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 255, 212, 0.25)";
                    }}
                  >
                    {otpLoading ? "Generating OTP..." : "Get OTP Verification Code"}
                  </button>
                </form>
              </div>
            )}

            {forgotStep === 2 && (
              <div>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "rgba(0, 255, 200, 0.1)",
                  border: "1px solid rgba(0, 255, 200, 0.3)",
                  color: "#00FFD4",
                  fontSize: "1.5rem",
                  marginBottom: "20px"
                }}>
                  <FaKey />
                </div>

                <h3 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: 800, margin: "0 0 10px 0" }}>
                  Verification Required
                </h3>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.95rem", lineHeight: 1.5, marginBottom: "30px" }}>
                  A security code was sent to <strong style={{ color: "#00FFD4" }}>{emailInput}</strong>.<br />
                  Please enter the 6-digit OTP below to decrypt and retrieve your password.
                </p>

                <form onSubmit={handleVerifyOtp}>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="••••••"
                    value={otpInput}
                    onChange={e => setOtpInput(e.target.value.replace(/\D/g, ""))}
                    style={{
                      width: "100%",
                      padding: "16px",
                      borderRadius: "12px",
                      border: "2px solid rgba(0, 255, 200, 0.3)",
                      background: "rgba(255, 255, 255, 0.05)",
                      color: "#00FFD4",
                      fontSize: "1.6rem",
                      fontWeight: 800,
                      letterSpacing: "8px",
                      textAlign: "center",
                      boxSizing: "border-box",
                      marginBottom: "20px",
                      outline: "none",
                      fontFamily: "monospace"
                    }}
                  />
                  {forgotError && (
                    <div style={{ color: "#FF6B9D", background: "rgba(255,50,50,0.12)", border: "1px solid rgba(255,50,50,0.25)", padding: "12px", borderRadius: "10px", marginBottom: "20px", fontSize: "0.9rem" }}>
                      ⚠️ {forgotError}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={otpLoading || otpInput.length < 6}
                    style={{
                      width: "100%",
                      padding: "16px",
                      background: "linear-gradient(135deg, #00FFD4, #0099FF)",
                      border: "none",
                      color: "#000",
                      fontWeight: 800,
                      fontSize: "1rem",
                      borderRadius: "12px",
                      cursor: "pointer",
                      boxShadow: "0 4px 15px rgba(0, 255, 212, 0.25)",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={e => {
                      if (!otpLoading && otpInput.length === 6) {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 255, 212, 0.4)";
                      }
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 255, 212, 0.25)";
                    }}
                  >
                    {otpLoading ? "Verifying Credentials..." : "Verify & Decrypt Password"}
                  </button>
                  
                  <div style={{ marginTop: "15px" }}>
                    <button
                      type="button"
                      onClick={() => setForgotStep(1)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "rgba(255,255,255,0.4)",
                        cursor: "pointer",
                        textDecoration: "underline",
                        fontSize: "0.9rem"
                      }}
                    >
                      Change Email Address
                    </button>
                  </div>
                </form>
              </div>
            )}

            {forgotStep === 3 && (
              <div>
                <div style={{
                  display: "inline-flex",
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  background: "rgba(0, 255, 212, 0.15)",
                  border: "2px solid #00FFD4",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "32px",
                  color: "#00FFD4",
                  marginBottom: "20px",
                  boxShadow: "0 0 20px rgba(0, 255, 212, 0.3)"
                }}>
                  ✓
                </div>
                
                <h3 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: 800, margin: "0 0 10px 0" }}>
                  Access Recovered
                </h3>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.95rem", lineHeight: 1.5, marginBottom: "20px" }}>
                  Your identity has been authenticated successfully. Here is your current decrypted admin password:
                </p>

                <div style={{
                  background: "rgba(0, 255, 212, 0.06)",
                  border: "1px dashed #00FFD4",
                  padding: "20px 10px",
                  borderRadius: "14px",
                  fontSize: "1.7rem",
                  fontWeight: "bold",
                  color: "#00FFD4",
                  letterSpacing: "1px",
                  marginBottom: "30px",
                  fontFamily: "monospace",
                  wordBreak: "break-all",
                  boxShadow: "inset 0 0 20px rgba(0, 255, 212, 0.05)"
                }}>
                  {retrievedPassword}
                </div>

                <button
                  onClick={handleDirectLogin}
                  style={{
                    width: "100%",
                    padding: "16px",
                    background: "linear-gradient(135deg, #00FFD4, #0099FF)",
                    border: "none",
                    color: "#000",
                    fontWeight: 800,
                    fontSize: "1.05rem",
                    borderRadius: "12px",
                    cursor: "pointer",
                    boxShadow: "0 4px 15px rgba(0, 255, 212, 0.25)",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 255, 212, 0.4)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 255, 212, 0.25)";
                  }}
                >
                  Enter Control Center Directly <FaArrowRight style={{ fontSize: "0.9rem" }} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes floatCard {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes moveGrid {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-30px);
          }
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminLogin;
