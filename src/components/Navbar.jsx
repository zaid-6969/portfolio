import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { useState, useEffect } from "react";
import { RiLayoutMasonryLine, RiShieldUserLine, RiLogoutBoxLine, RiMenuLine, RiCloseLine } from "react-icons/ri";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useSelector((s) => s.auth);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: scrolled ? "rgba(8,13,26,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      transition: "all 0.3s ease",
      padding: "0 24px",
    }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 70 }}>
        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, var(--accent), #a78bfa)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 20px var(--accent-glow)",
          }}>
            <RiLayoutMasonryLine size={18} color="#fff" />
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.2rem", color: "var(--text-primary)" }}>
            Portfolio<span style={{ color: "var(--accent)" }}>CMS</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }} className="nav-desktop">
          {token ? (
            <>
              <Link to="/admin/dashboard" style={{
                padding: "8px 16px", borderRadius: 8, textDecoration: "none",
                color: isAdmin ? "var(--accent-light)" : "var(--text-secondary)",
                fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.9rem",
                background: isAdmin ? "rgba(99,102,241,0.1)" : "transparent",
                transition: "all 0.2s",
              }}>
                Dashboard
              </Link>
              <button onClick={handleLogout} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 16px", borderRadius: 8, cursor: "pointer",
                background: "rgba(239,68,68,0.08)", color: "var(--danger)",
                border: "1px solid rgba(239,68,68,0.2)", fontFamily: "var(--font-display)",
                fontWeight: 600, fontSize: "0.9rem", transition: "all 0.2s",
              }}>
                <RiLogoutBoxLine size={16} /> Logout
              </button>
            </>
          ) : (
            <Link to="/admin/login" style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "10px 20px", borderRadius: 8, textDecoration: "none",
              background: "var(--accent)", color: "#fff",
              fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.9rem",
              transition: "all 0.2s", boxShadow: "0 4px 16px var(--accent-glow)",
            }}>
              <RiShieldUserLine size={16} /> Admin
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer", padding: 8, display: "none" }}
          className="nav-mobile-btn"
        >
          {menuOpen ? <RiCloseLine size={24} /> : <RiMenuLine size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: "var(--bg-secondary)", borderTop: "1px solid var(--border)",
          padding: "16px 24px", display: "flex", flexDirection: "column", gap: 12,
        }} className="nav-mobile-menu">
          {token ? (
            <>
              <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)} style={{ color: "var(--text-primary)", textDecoration: "none", fontFamily: "var(--font-display)", fontWeight: 600, padding: "8px 0" }}>Dashboard</Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} style={{ background: "none", border: "none", color: "var(--danger)", fontFamily: "var(--font-display)", fontWeight: 600, textAlign: "left", cursor: "pointer", padding: "8px 0" }}>Logout</button>
            </>
          ) : (
            <Link to="/admin/login" onClick={() => setMenuOpen(false)} style={{ color: "var(--accent-light)", textDecoration: "none", fontFamily: "var(--font-display)", fontWeight: 600, padding: "8px 0" }}>Admin Login</Link>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;