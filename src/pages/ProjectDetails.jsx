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
    const doFetch = async () => {
      try {
        const { data } = await axios.get(
          `https://portfolio-backend-vyl5.onrender.com/api/v1/projects/${id}`
        );
        setProject(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    doFetch();
  }, [id]);

  if (loading) return <div style={{ minHeight: "100vh" }}><Navbar /><Loader fullScreen /></div>;

  if (!project) return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16 }}>
        <RiCodeLine size={52} style={{ color: "var(--text-muted)", opacity: 0.4 }} />
        <p style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 700 }}>Project Not Found</p>
        <Link to="/" style={{ color: "var(--accent-light)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
          <RiArrowLeftLine /> Back to Home
        </Link>
      </div>
    </div>
  );

  const d = project.designConfig || {};

  // Resolve all design values with safe fallbacks
  const bg = d.backgroundColor || "var(--bg-card)";
  const textColor = d.textColor || "var(--text-primary)";
  const btnColor = d.buttonColor || "#6366f1";
  const btnTextColor = d.buttonTextColor || "#ffffff";
  const tagColor = d.tagColor || btnColor;
  const borderRadius = d.borderRadius || "16px";
  const boxShadow = d.boxShadow || "var(--shadow-card)";
  const border = d.border || "1px solid var(--border)";
  const padding = d.padding || "32px";

  const titleFF = d.titleFontFamily || "var(--font-display)";
  const titleFS = d.titleFontSize || "2rem";
  const titleFW = d.titleFontWeight || "800";

  const descFF = d.descFontFamily || "var(--font-body)";
  const descFS = d.descFontSize || "1rem";
  const descFW = d.descFontWeight || "400";

  const tagFS = d.tagFontSize || "0.75rem";

  const imageSize = d.imageSize || "full";
  const imagePosition = d.imagePosition || "top";
  const imageHeight = parseInt(d.imageHeight) || 420;
  const isHidden = imageSize === "hidden";
  const imgWidthMap = { full: "100%", large: "80%", medium: "55%", small: "38%" };
  const imgWidthVal = imgWidthMap[imageSize] || "100%";
  const isHoriz = imagePosition === "left" || imagePosition === "right";

  const imgBorderRadius = parseInt(borderRadius) > 12 ? "12px" : (parseInt(borderRadius) || 8) + "px";

  /* Image block */
  const ImageBlock = !isHidden && (
    <div style={{
      flexShrink: 0,
      width: isHoriz ? imgWidthVal : "100%",
      height: isHoriz ? "auto" : imageHeight,
      minHeight: isHoriz ? 280 : "auto",
      borderRadius: imgBorderRadius,
      overflow: "hidden",
      background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(167,139,250,0.15))",
    }}>
      <img src={project.image} alt={project.projectName}
        style={{ width: "100%", height: isHoriz ? "100%" : imageHeight, objectFit: "cover", display: "block" }} />
    </div>
  );

  /* Content block */
  const ContentBlock = (
    <div style={{ flex: 1, minWidth: 0 }}>
      {/* Tags */}
      {project.tags?.length > 0 && (
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 18 }}>
          {project.tags.map((tag, i) => (
            <span key={i} style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              padding: "4px 13px", borderRadius: 99,
              fontSize: tagFS, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
              background: `${tagColor}18`, color: tagColor, border: `1px solid ${tagColor}30`,
            }}>
              <RiPriceTag3Line size={11} /> {tag}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h1 style={{
        fontFamily: titleFF, fontSize: titleFS, fontWeight: titleFW,
        color: textColor, lineHeight: 1.15, marginBottom: 18,
      }}>
        {project.projectName}
      </h1>

      {/* Description */}
      <p style={{
        fontFamily: descFF, fontSize: descFS, fontWeight: descFW,
        color: textColor, opacity: 0.85, lineHeight: 1.75, marginBottom: 24,
      }}>
        {project.description}
      </p>

      {/* Divider */}
      <div style={{ height: 1, background: `${btnColor}25`, marginBottom: 24 }} />

      {/* Technologies */}
      {project.languages?.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
            <RiCodeLine style={{ color: btnColor }} size={16} />
            <span style={{ fontFamily: titleFF, fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.07em", textTransform: "uppercase", color: textColor, opacity: 0.6 }}>
              Technologies
            </span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {project.languages.map((lang, i) => (
              <span key={i} style={{
                padding: "6px 14px", borderRadius: 8, fontSize: "0.85rem",
                fontWeight: 600, fontFamily: descFF,
                background: `${btnColor}15`, color: btnColor,
                border: `1px solid ${btnColor}25`,
              }}>
                {String(lang).trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* CTA Buttons */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {project.githubLink && (
          <a href={project.githubLink} target="_blank" rel="noreferrer" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "12px 22px", borderRadius: "8px",
            backgroundColor: btnColor, color: btnTextColor,
            textDecoration: "none", fontWeight: 700, fontSize: "0.875rem",
            fontFamily: titleFF, transition: "transform 0.2s, box-shadow 0.2s",
            boxShadow: `0 4px 14px ${btnColor}40`,
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 22px ${btnColor}55`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 4px 14px ${btnColor}40`; }}
          >
            <RiGithubLine size={17} /> View on GitHub
          </a>
        )}
        {project.deploymentLink && (
          <a href={project.deploymentLink} target="_blank" rel="noreferrer" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "12px 22px", borderRadius: "8px",
            background: "transparent", color: btnColor,
            border: `2px solid ${btnColor}`,
            textDecoration: "none", fontWeight: 700, fontSize: "0.875rem",
            fontFamily: titleFF, transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = `${btnColor}12`; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "none"; }}
          >
            <RiExternalLinkLine size={17} /> Live Demo
          </a>
        )}
      </div>
    </div>
  );

  /* Assemble layout */
  let innerLayout;
  if (isHidden) {
    innerLayout = ContentBlock;
  } else if (imagePosition === "top") {
    innerLayout = <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>{ImageBlock}{ContentBlock}</div>;
  } else if (imagePosition === "bottom") {
    innerLayout = <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>{ContentBlock}{ImageBlock}</div>;
  } else if (imagePosition === "left") {
    innerLayout = (
      <div style={{ display: "flex", flexDirection: "row", gap: 28, alignItems: "flex-start" }}
        className="detail-horiz-layout">
        {ImageBlock}{ContentBlock}
      </div>
    );
  } else {
    innerLayout = (
      <div style={{ display: "flex", flexDirection: "row-reverse", gap: 28, alignItems: "flex-start" }}
        className="detail-horiz-layout">
        {ImageBlock}{ContentBlock}
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px 0" }}>
        <Link to="/" style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          color: "var(--text-muted)", textDecoration: "none", fontSize: "0.875rem",
          fontFamily: "var(--font-display)", fontWeight: 500, transition: "color 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
        >
          <RiArrowLeftLine size={16} /> All Projects
        </Link>
      </div>

      <div style={{ maxWidth: 1100, margin: "20px auto", padding: "0 24px 64px", animation: "fadeIn 0.45s ease" }}>
        <div style={{ backgroundColor: bg, color: textColor, borderRadius, boxShadow, border, padding, overflow: "hidden" }}>
          {innerLayout}
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .detail-horiz-layout { flex-direction: column !important; }
        }
      `}</style>
    </div>
  );
};

export default ProjectDetails;