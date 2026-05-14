import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { RiGithubLine, RiExternalLinkLine, RiArrowLeftLine, RiCodeLine, RiPriceTag3Line } from "react-icons/ri";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/v1/projects/${id}`);
        setProject(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  if (loading) return <div style={{ minHeight: "100vh" }}><Navbar /><Loader fullScreen /></div>;

  if (!project) return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16 }}>
        <RiCodeLine size={56} style={{ color: "var(--text-muted)", opacity: 0.4 }} />
        <p style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 700 }}>Project Not Found</p>
        <Link to="/" style={{ color: "var(--accent-light)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
          <RiArrowLeftLine /> Back to Home
        </Link>
      </div>
    </div>
  );

  const design = project.designConfig || {};

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      
      {/* Back link */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px 0" }}>
        <Link to="/" style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          color: "var(--text-muted)", textDecoration: "none", fontSize: "0.875rem",
          fontFamily: "var(--font-display)", fontWeight: 500,
          transition: "color 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
        >
          <RiArrowLeftLine size={16} /> All Projects
        </Link>
      </div>

      {/* Project card with custom styling */}
      <div style={{ maxWidth: 1100, margin: "24px auto", padding: "0 24px 60px", animation: "fadeIn 0.5s ease" }}>
        <div style={{
          backgroundColor: design.backgroundColor || "var(--bg-card)",
          color: design.textColor || "var(--text-primary)",
          borderRadius: design.borderRadius || "16px",
          boxShadow: design.boxShadow || "var(--shadow-card)",
          border: design.border || "1px solid var(--border)",
          padding: design.padding || "32px",
          overflow: "hidden",
        }}>
          {/* Hero image */}
          <div style={{ borderRadius: parseInt(design.borderRadius || 16) > 8 ? "12px" : "6px", overflow: "hidden", marginBottom: 32 }}>
            <img
              src={project.image}
              alt={project.projectName}
              style={{ width: "100%", maxHeight: 480, objectFit: "cover", display: "block" }}
            />
          </div>

          {/* Meta tags */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            {project.tags?.map((tag, i) => (
              <span key={i} style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "4px 14px", borderRadius: 99, fontSize: "0.75rem",
                fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                background: `${design.buttonColor || "#6366f1"}18`,
                color: design.buttonColor || "#6366f1",
                border: `1px solid ${design.buttonColor || "#6366f1"}30`,
              }}>
                <RiPriceTag3Line size={11} /> {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)", lineHeight: 1.15,
            color: design.textColor || "var(--text-primary)",
            marginBottom: 20,
          }}>
            {project.projectName}
          </h1>

          {/* Description */}
          <p style={{
            fontSize: design.fontSize || "1rem",
            lineHeight: 1.75,
            color: design.textColor || "var(--text-secondary)",
            opacity: 0.85,
            marginBottom: 28,
            maxWidth: 800,
          }}>
            {project.description}
          </p>

          {/* Divider */}
          <div className="divider" style={{ marginBottom: 28 }} />

          {/* Technologies */}
          {project.languages?.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <RiCodeLine style={{ color: design.buttonColor || "var(--accent)" }} size={18} />
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.05em", textTransform: "uppercase", color: design.textColor || "var(--text-muted)" }}>
                  Technologies
                </span>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {project.languages.map((lang, i) => (
                  <span key={i} style={{
                    padding: "6px 16px", borderRadius: 8, fontSize: "0.875rem",
                    fontWeight: 600, background: `${design.buttonColor || "#6366f1"}15`,
                    color: design.buttonColor || "#6366f1",
                    border: `1px solid ${design.buttonColor || "#6366f1"}25`,
                    fontFamily: "var(--font-display)",
                  }}>
                    {lang.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {project.githubLink && (
              <a href={project.githubLink} target="_blank" rel="noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "12px 24px", borderRadius: "8px",
                  backgroundColor: design.buttonColor || "#6366f1",
                  color: design.buttonTextColor || "#fff",
                  textDecoration: "none", fontWeight: 700, fontSize: "0.9rem",
                  fontFamily: "var(--font-display)", transition: "all 0.2s",
                  boxShadow: `0 4px 16px ${design.buttonColor || "#6366f1"}35`,
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "none"}
              >
                <RiGithubLine size={18} /> View on GitHub
              </a>
            )}
            {project.deploymentLink && (
              <a href={project.deploymentLink} target="_blank" rel="noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "12px 24px", borderRadius: "8px",
                  background: "transparent",
                  color: design.buttonColor || "#6366f1",
                  border: `2px solid ${design.buttonColor || "#6366f1"}`,
                  textDecoration: "none", fontWeight: 700, fontSize: "0.9rem",
                  fontFamily: "var(--font-display)", transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.background = `${design.buttonColor || "#6366f1"}15`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.background = "transparent"; }}
              >
                <RiExternalLinkLine size={18} /> Live Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;