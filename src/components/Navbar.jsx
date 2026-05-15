import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { toggleTheme } from "../store/slices/themeSlice";
import { useState, useEffect } from "react";
import {
  RiLayoutMasonryLine, RiShieldUserLine, RiLogoutBoxLine,
  RiMenuLine, RiCloseLine, RiSunLine, RiMoonLine,
} from "react-icons/ri";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useSelector((s) => s.auth);
  const { mode } = useSelector((s) => s.theme);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [iconKey, setIconKey] = useState(0); // for re-triggering animation

  const isDark = mode === "dark";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
    setIconKey(k => k + 1); // re-trigger pop animation
  };

  const isAdmin = location.pathname.startsWith("/admin");

  const navBg = scrolled
    ? `var(--navbar-bg)`
    : "transparent";

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: navBg,
      backdropFilter: scrolled ? "blur(20px)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      transition: "background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease",
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
            flexShrink: 0,
          }}>
            <RiLayoutMasonryLine size={18} color="#fff" />
          </div>
          <span style={{
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.2rem",
            color: "var(--text-primary)",
          }}>
            Portfolio<span style={{ color: "var(--accent)" }}>CMS</span>
          </span>
        </Link>

        {/* Desktop right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }} className="nav-desktop">

          {/* Theme Toggle */}
          <button
            onClick={handleToggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            style={{
              width: 40, height: 40, borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              cursor: "pointer",
              position: "relative", overflow: "hidden",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
          >
            <span key={iconKey} className="animate-theme-pop" style={{ display: "flex" }}>
              {isDark ? <RiSunLine size={18} /> : <RiMoonLine size={18} />}
            </span>
          </button>

          {/* Auth */}
          {token ? (
            <>
              <Link to="/admin/dashboard" style={{
                padding: "8px 16px", borderRadius: 8, textDecoration: "none",
                color: isAdmin ? "var(--accent-light)" : "var(--text-secondary)",
                fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.9rem",
                background: isAdmin ? "rgba(99,102,241,0.1)" : "transparent",
                border: "1px solid", borderColor: isAdmin ? "rgba(99,102,241,0.2)" : "transparent",
              }}>
                Dashboard
              </Link>
              <button onClick={handleLogout} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 16px", borderRadius: 8, cursor: "pointer",
                background: "rgba(239,68,68,0.08)", color: "var(--danger)",
                border: "1px solid rgba(239,68,68,0.2)",
                fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.9rem",
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
              boxShadow: "0 4px 16px var(--accent-glow)",
            }}>
              <RiShieldUserLine size={16} /> Admin
            </Link>
          )}
        </div>

        {/* Mobile right side */}
        <div style={{ display: "none", alignItems: "center", gap: 8 }} className="nav-mobile-right">
          {/* Theme toggle on mobile too */}
          <button
            onClick={handleToggleTheme}
            style={{
              width: 38, height: 38, borderRadius: 9,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)", cursor: "pointer",
            }}
          >
            <span key={`m-${iconKey}`} className="animate-theme-pop" style={{ display: "flex" }}>
              {isDark ? <RiSunLine size={17} /> : <RiMoonLine size={17} />}
            </span>
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer", padding: 6, display: "flex" }}
          >
            {menuOpen ? <RiCloseLine size={24} /> : <RiMenuLine size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          background: "var(--bg-card)",
          borderTop: "1px solid var(--border)",
          padding: "16px 24px",
          display: "flex", flexDirection: "column", gap: 4,
          animation: "fadeIn 0.2s ease",
        }} className="nav-mobile-menu">
          {token ? (
            <>
              <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)} style={{
                padding: "10px 12px", borderRadius: 8, color: "var(--text-primary)",
                textDecoration: "none", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.95rem",
              }}>
                Dashboard
              </Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} style={{
                padding: "10px 12px", borderRadius: 8, background: "none", border: "none",
                color: "var(--danger)", fontFamily: "var(--font-display)", fontWeight: 600,
                textAlign: "left", cursor: "pointer", fontSize: "0.95rem",
              }}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/admin/login" onClick={() => setMenuOpen(false)} style={{
              padding: "10px 12px", borderRadius: 8, color: "var(--accent-light)",
              textDecoration: "none", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.95rem",
            }}>
              Admin Login
            </Link>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-right { display: flex !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;