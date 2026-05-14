import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../store/slices/projectsSlice";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import Loader from "../components/Loader";
import { RiSearch2Line, RiCodeLine, RiFilter3Line, RiArrowDownLine } from "react-icons/ri";

const Home = () => {
  const dispatch = useDispatch();
  const { items: projects, loading } = useSelector((s) => s.projects);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");

  useEffect(() => { dispatch(fetchProjects()); }, [dispatch]);

  const allTags = ["All", ...new Set(projects.flatMap(p => p.tags || []))];

  const filtered = projects.filter(p => {
    const matchSearch = p.projectName?.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
    const matchTag = activeTag === "All" || p.tags?.includes(activeTag);
    return matchSearch && matchTag;
  });

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section style={{
        position: "relative", overflow: "hidden",
        padding: "100px 24px 80px",
        textAlign: "center",
      }}>
        {/* Background glow orbs */}
        <div style={{
          position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: "10%",
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", maxWidth: 800, margin: "0 auto" }}>
          <div style={{ marginBottom: 20, animation: "fadeIn 0.6s ease both" }}>
            <span className="badge" style={{ background: "rgba(99,102,241,0.1)", color: "var(--accent-light)", border: "1px solid rgba(99,102,241,0.2)", padding: "6px 16px" }}>
              <RiCodeLine style={{ marginRight: 6, verticalAlign: "middle" }} />
              Portfolio Showcase
            </span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 800, lineHeight: 1.1, marginBottom: 24,
            animation: "fadeIn 0.6s ease 0.1s both",
          }}>
            Projects Built with{" "}
            <span className="gradient-text">Passion & Precision</span>
          </h1>

          <p style={{
            color: "var(--text-secondary)", fontSize: "clamp(1rem, 2vw, 1.2rem)",
            lineHeight: 1.7, maxWidth: 600, margin: "0 auto 48px",
            animation: "fadeIn 0.6s ease 0.2s both",
          }}>
            Explore a curated collection of full-stack projects, each crafted with modern technologies and best practices.
          </p>

          {/* Scroll indicator */}
          <div style={{ animation: "float 2s ease-in-out infinite, fadeIn 0.6s ease 0.4s both" }}>
            <RiArrowDownLine size={24} style={{ color: "var(--text-muted)" }} />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px 40px" }}>
        {/* Search + Filter row */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
          <div style={{ flex: 1, minWidth: 240, position: "relative" }}>
            <RiSearch2Line style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", padding: "12px 16px 12px 42px", fontSize: "0.95rem", borderRadius: 10 }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)", fontSize: "0.85rem" }}>
            <RiFilter3Line /> <span>{filtered.length} project{filtered.length !== 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* Tag filters */}
        {allTags.length > 1 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 40 }}>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                style={{
                  padding: "6px 16px", borderRadius: 99, cursor: "pointer",
                  fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.8rem",
                  letterSpacing: "0.04em", textTransform: "uppercase",
                  border: activeTag === tag ? "1px solid var(--accent)" : "1px solid var(--border)",
                  background: activeTag === tag ? "var(--accent)" : "transparent",
                  color: activeTag === tag ? "#fff" : "var(--text-secondary)",
                  transition: "all 0.2s",
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <Loader />
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
            <RiCodeLine size={48} style={{ marginBottom: 16, opacity: 0.4 }} />
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }}>No projects found</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 24,
          }}>
            {filtered.map((project, i) => (
              <ProjectCard key={project._id} project={project} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;