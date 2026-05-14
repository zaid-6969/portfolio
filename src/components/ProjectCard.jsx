import { Link } from "react-router-dom";
import { RiGithubLine, RiExternalLinkLine, RiArrowRightLine } from "react-icons/ri";

const ProjectCard = ({ project, index = 0 }) => {
  return (
    <div
      className="card"
      style={{
        overflow: "hidden",
        display: "flex", flexDirection: "column",
        animation: `fadeIn 0.5s ease ${index * 0.1}s both`,
        cursor: "pointer",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", overflow: "hidden", height: 220 }}>
        <img
          src={project.image}
          alt={project.projectName}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
          onMouseEnter={e => e.target.style.transform = "scale(1.06)"}
          onMouseLeave={e => e.target.style.transform = "scale(1)"}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(8,13,26,0.85) 0%, transparent 60%)",
        }} />
        {/* Tags overlay */}
        <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {project.tags?.slice(0,2).map((tag, i) => (
            <span key={i} className="badge" style={{ background: "rgba(8,13,26,0.8)", backdropFilter: "blur(8px)", color: "var(--accent-light)", border: "1px solid var(--border)" }}>
              {tag}
            </span>
          ))}
        </div>
        {/* Quick links overlay */}
        <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 8 }}>
          {project.githubLink && (
            <a href={project.githubLink} target="_blank" rel="noreferrer"
              onClick={e => e.stopPropagation()}
              style={{ width: 34, height: 34, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(8,13,26,0.8)", backdropFilter: "blur(8px)", color: "var(--text-primary)", border: "1px solid var(--border)", transition: "all 0.2s", textDecoration: "none" }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(8,13,26,0.8)"; e.currentTarget.style.borderColor = "var(--border)"; }}
            >
              <RiGithubLine size={16} />
            </a>
          )}
          {project.deploymentLink && (
            <a href={project.deploymentLink} target="_blank" rel="noreferrer"
              onClick={e => e.stopPropagation()}
              style={{ width: 34, height: 34, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(8,13,26,0.8)", backdropFilter: "blur(8px)", color: "var(--text-primary)", border: "1px solid var(--border)", transition: "all 0.2s", textDecoration: "none" }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--success)"; e.currentTarget.style.borderColor = "var(--success)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(8,13,26,0.8)"; e.currentTarget.style.borderColor = "var(--border)"; }}
            >
              <RiExternalLinkLine size={16} />
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
          {project.projectName}
        </h2>

        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {project.description}
        </p>

        {/* Languages */}
        {project.languages?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {project.languages.slice(0,4).map((lang, i) => (
              <span key={i} className="tag-pill">{lang.trim()}</span>
            ))}
          </div>
        )}

        {/* View Button */}
        <div style={{ marginTop: "auto", paddingTop: 8 }}>
          <Link
            to={`/project/${project._id}`}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "10px 18px", borderRadius: 8, textDecoration: "none",
              background: "rgba(99,102,241,0.1)", color: "var(--accent-light)",
              border: "1px solid rgba(99,102,241,0.2)",
              fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.875rem",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "var(--accent)";
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.borderColor = "var(--accent)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(99,102,241,0.1)";
              e.currentTarget.style.color = "var(--accent-light)";
              e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)";
            }}
          >
            View Details <RiArrowRightLine size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;