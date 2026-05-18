import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import {
  RiGithubLine, RiExternalLinkLine, RiArrowLeftLine,
  RiCodeLine, RiPriceTag3Line,
} from "react-icons/ri";

/* ── helpers ── */
const safe = (v, fallback) => v || fallback;
const imgWidthMap = { full: "100%", large: "75%", medium: "52%", small: "36%" };

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `https://portfolio-backend-vyl5.onrender.com/api/v1/projects/${id}`
        );
        setProject(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
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

  const bg          = safe(d.backgroundColor, "var(--bg-card)");
  const textColor   = safe(d.textColor, "var(--text-primary)");
  const btnColor    = safe(d.buttonColor, "#6366f1");
  const btnTextColor= safe(d.buttonTextColor, "#ffffff");
  const tagColor    = safe(d.tagColor, btnColor);
  const borderRadius= safe(d.borderRadius, "16px");
  const boxShadow   = safe(d.boxShadow, "var(--shadow-card)");
  const border      = safe(d.border, "1px solid var(--border)");
  const padding     = safe(d.padding, "32px");
  const titleFF     = safe(d.titleFontFamily, "var(--font-display)");
  const titleFS     = safe(d.titleFontSize, "2rem");
  const titleFW     = safe(d.titleFontWeight, "800");
  const descFF      = safe(d.descFontFamily, "var(--font-body)");
  const descFS      = safe(d.descFontSize, "1rem");
  const descFW      = safe(d.descFontWeight, "400");
  const tagFS       = safe(d.tagFontSize, "0.75rem");
  const imageSize   = safe(d.imageSize, "full");
  const imagePos    = safe(d.imagePosition, "top");
  const imageHeight = parseInt(d.imageHeight) || 420;
  const isHidden    = imageSize === "hidden";
  const isHoriz     = imagePos === "left" || imagePos === "right";
  const isFull      = imageSize === "full";
  const imgBR       = Math.min(parseInt(borderRadius) || 12, 16) + "px";

  /* ── Tags row ── */
  const TagsRow = project.tags?.length > 0 && (
    <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
      {project.tags.map((tag, i) => (
        <span key={i} style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          padding: "4px 12px", borderRadius: 99,
          fontSize: tagFS, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
          background: `${tagColor}22`, color: tagColor, border: `1px solid ${tagColor}35`,
        }}>
          <RiPriceTag3Line size={11} /> {tag}
        </span>
      ))}
    </div>
  );

  /* ── Title ── */
  const TitleEl = (
    <h1 style={{
      fontFamily: titleFF, fontSize: titleFS, fontWeight: titleFW,
      color: textColor, lineHeight: 1.15, margin: 0,
    }}>
      {project.projectName}
    </h1>
  );

  /* ── Bottom content (desc + tech + buttons) ── */
  const BottomContent = (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <p style={{
        fontFamily: descFF, fontSize: descFS, fontWeight: descFW,
        color: textColor, opacity: 0.85, lineHeight: 1.75, margin: 0,
      }}>
        {project.description}
      </p>

      <div style={{ height: 1, background: `${btnColor}20` }} />

      {project.languages?.length > 0 && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
            <RiCodeLine style={{ color: btnColor }} size={15} />
            <span style={{ fontFamily: titleFF, fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase", color: textColor, opacity: 0.55 }}>
              Technologies
            </span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {project.languages.map((lang, i) => (
              <span key={i} style={{
                padding: "5px 13px", borderRadius: 8, fontSize: "0.82rem",
                fontWeight: 600, fontFamily: descFF,
                background: `${btnColor}14`, color: btnColor,
                border: `1px solid ${btnColor}22`,
              }}>
                {String(lang).trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {project.githubLink && (
          <a href={project.githubLink} target="_blank" rel="noreferrer" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "11px 22px", borderRadius: 8,
            backgroundColor: btnColor, color: btnTextColor,
            textDecoration: "none", fontWeight: 700, fontSize: "0.875rem",
            fontFamily: titleFF, transition: "transform 0.2s, box-shadow 0.2s",
            boxShadow: `0 4px 14px ${btnColor}40`,
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${btnColor}55`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = `0 4px 14px ${btnColor}40`; }}
          >
            <RiGithubLine size={17} /> View on GitHub
          </a>
        )}
        {project.deploymentLink && (
          <a href={project.deploymentLink} target="_blank" rel="noreferrer" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "11px 22px", borderRadius: 8,
            background: "transparent", color: btnColor,
            border: `2px solid ${btnColor}`,
            textDecoration: "none", fontWeight: 700, fontSize: "0.875rem",
            fontFamily: titleFF, transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = `${btnColor}12`; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = ""; }}
          >
            <RiExternalLinkLine size={17} /> Live Demo
          </a>
        )}
      </div>
    </div>
  );

  /* ══════════════════════════════════════════
     LAYOUT ASSEMBLY
     ══════════════════════════════════════════ */
  let innerLayout;

  if (isHidden) {
    /* No image — just stack title + tags + content */
    innerLayout = (
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {TagsRow}
        {TitleEl}
        {BottomContent}
      </div>
    );

  } else if (isHoriz) {
    /* LEFT or RIGHT — image column beside title+tags+content */
    const imgWidth = imgWidthMap[imageSize] || "50%";
    const ImgCol = (
      <div style={{
        flexShrink: 0,
        width: imgWidth,
        minWidth: 200,
        borderRadius: imgBR,
        overflow: "hidden",
        alignSelf: "stretch",
        minHeight: 260,
      }}>
        <img src={project.image} alt={project.projectName}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
    );
    const TextCol = (
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 18 }}>
        {TagsRow}
        {TitleEl}
        {BottomContent}
      </div>
    );
    innerLayout = (
      <div className="detail-horiz" style={{
        display: "flex",
        flexDirection: imagePos === "left" ? "row" : "row-reverse",
        gap: 28, alignItems: "flex-start",
      }}>
        {ImgCol}
        {TextCol}
      </div>
    );

  } else {
    /* TOP or BOTTOM */
    if (isFull) {
      /* ── FULL image: hero mode ──
         Image fills the top/bottom of the card.
         Title + tags overlay on the image with a gradient.
         Description + tech + buttons sit outside the image. */
      const HeroImg = (
        <div style={{
          position: "relative",
          width: "100%",
          height: imageHeight,
          overflow: "hidden",
          /* negative margin to bleed into card padding */
          margin: imagePos === "top"
            ? `calc(-1 * ${padding}) calc(-1 * ${padding}) 0`
            : `0 calc(-1 * ${padding}) calc(-1 * ${padding})`,
          width: `calc(100% + 2 * ${padding})`,
          borderRadius: imagePos === "top"
            ? `${borderRadius} ${borderRadius} 0 0`
            : `0 0 ${borderRadius} ${borderRadius}`,
        }}>
          <img src={project.image} alt={project.projectName}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          {/* gradient overlay — bottom for top-image, top for bottom-image */}
          <div style={{
            position: "absolute", inset: 0,
            background: imagePos === "top"
              ? "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)"
              : "linear-gradient(to bottom, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
          }} />
          {/* Tags + title overlaid */}
          <div style={{
            position: "absolute",
            bottom: imagePos === "top" ? 28 : "auto",
            top: imagePos === "bottom" ? 28 : "auto",
            left: 28, right: 28,
            display: "flex", flexDirection: "column", gap: 10,
          }}>
            {TagsRow}
            <h1 style={{
              fontFamily: titleFF, fontSize: titleFS, fontWeight: titleFW,
              color: "#fff", lineHeight: 1.15, margin: 0,
              textShadow: "0 2px 12px rgba(0,0,0,0.5)",
            }}>
              {project.projectName}
            </h1>
          </div>
        </div>
      );

      innerLayout = imagePos === "top"
        ? <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>{HeroImg}{BottomContent}</div>
        : <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>{BottomContent}{HeroImg}</div>;

    } else {
      /* ── Non-full image (large/medium/small) top/bottom ──
         Image sits on one side, title + tags beside it.
         Description + tech + buttons span full width below both. */
      const shortImgW = imgWidthMap[imageSize] || "50%";
      const ShortImg = (
        <div style={{
          flexShrink: 0,
          width: shortImgW,
          height: imageHeight,
          borderRadius: imgBR,
          overflow: "hidden",
          minWidth: 160,
        }}>
          <img src={project.image} alt={project.projectName}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
      );
      const HeaderBeside = (
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 }}>
          {TagsRow}
          {TitleEl}
        </div>
      );
      const TopRow = (
        <div className="detail-horiz" style={{ display: "flex", flexDirection: "row", gap: 24, alignItems: "center" }}>
          {ShortImg}
          {HeaderBeside}
        </div>
      );

      innerLayout = imagePos === "top"
        ? <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>{TopRow}{BottomContent}</div>
        : <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>{BottomContent}{TopRow}</div>;
    }
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
        <div style={{
          backgroundColor: bg, color: textColor,
          borderRadius, boxShadow, border, padding,
          overflow: "hidden",
        }}>
          {innerLayout}
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .detail-horiz { flex-direction: column !important; }
        }
      `}</style>
    </div>
  );
};

export default ProjectDetails;