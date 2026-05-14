import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginAdmin, clearAuthError } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { RiShieldUserLine, RiMailLine, RiLockPasswordLine, RiEyeLine, RiEyeOffLine, RiLayoutMasonryLine } from "react-icons/ri";

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((s) => s.auth);
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    if (token) navigate("/admin/dashboard");
  }, [token, navigate]);

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearAuthError()); }
  }, [error, dispatch]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginAdmin(formData));
    if (!result.error) {
      toast.success("Welcome back, Admin!");
      navigate("/admin/dashboard");
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, position: "relative", overflow: "hidden",
    }}>
      {/* Bg glow */}
      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%, -50%)", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 440, animation: "scaleIn 0.4s ease" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: "linear-gradient(135deg, var(--accent), #a78bfa)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "0 0 40px var(--accent-glow)",
            animation: "float 3s ease-in-out infinite",
          }}>
            <RiLayoutMasonryLine size={28} color="#fff" />
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 800, marginBottom: 8 }}>
            Admin Portal
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Sign in to manage your portfolio
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: 32 }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Email */}
            <div>
              <label style={{ display: "block", marginBottom: 8, color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 500 }}>Email Address</label>
              <div style={{ position: "relative" }}>
                <RiMailLine style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type="email" name="email" required
                  placeholder="admin@portfolio.com"
                  value={formData.email} onChange={handleChange}
                  style={{ width: "100%", padding: "12px 16px 12px 42px", fontSize: "0.95rem", borderRadius: 10 }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", marginBottom: 8, color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 500 }}>Password</label>
              <div style={{ position: "relative" }}>
                <RiLockPasswordLine style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type={showPass ? "text" : "password"} name="password" required
                  placeholder="••••••••"
                  value={formData.password} onChange={handleChange}
                  style={{ width: "100%", padding: "12px 42px 12px 42px", fontSize: "0.95rem", borderRadius: 10 }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex" }}>
                  {showPass ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="btn-primary"
              style={{
                padding: "14px", fontSize: "1rem",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                opacity: loading ? 0.7 : 1, marginTop: 4,
              }}
            >
              {loading ? (
                <><div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Signing in...</>
              ) : (
                <><RiShieldUserLine size={18} /> Sign In</>
              )}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 24, color: "var(--text-muted)", fontSize: "0.85rem" }}>
          Protected area — authorized personnel only
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default AdminLogin;