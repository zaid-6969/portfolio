import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createProject, updateProject } from "../store/slices/projectsSlice";
import { clearDraft } from "../store/slices/draftslice";
import { resetDesignConfig, updateDesignConfig, setPreviewMode } from "../store/slices/designSlice";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import {
  RiArrowLeftLine, RiSendPlaneLine, RiEdit2Line,
  RiComputerLine, RiTabletLine, RiSmartphoneLine, RiRefreshLine,
  RiPaletteLine, RiTextSpacing, RiLayoutLine, RiImageLine,
  RiAlignLeft, RiAlignRight, RiArrowUpLine, RiArrowDownLine,
  RiPriceTag3Line, RiGithubLine, RiExternalLinkLine, RiCodeLine,
} from "react-icons/ri";

/* ── control atoms ── */
const SH = ({ title, icon }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid var(--border)" }}>
    <span style={{ color: "var(--accent)", display: "flex" }}>{icon}</span>
    <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)" }}>{title}</span>
  </div>
);
const ColorRow = ({ label, name, value, onChange }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
    <label style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>{label}</label>
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <span style={{ color: "var(--text-muted)", fontSize: "0.68rem", fontFamily: "monospace" }}>{value}</span>
      <input type="color" name={name} value={value || "#000000"} onChange={onChange}
        style={{ width: 30, height: 30, padding: 2, borderRadius: 7, cursor: "pointer", border: "1px solid var(--border)", background: "transparent" }} />
    </div>
  </div>
);
const RangeRow = ({ label, name, value, onChange, min, max, unit = "px" }) => {
  const num = parseFloat(value) || 0;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <label style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>{label}</label>
        <span style={{ color: "var(--accent-light)", fontSize: "0.72rem", fontFamily: "monospace" }}>{num}{unit}</span>
      </div>
      <input type="range" min={min} max={max} value={num}
        onChange={e => onChange({ target: { name, value: unit === "" ? e.target.value : `${e.target.value}${unit}` } })}
        style={{ width: "100%", accentColor: "var(--accent)", cursor: "pointer" }} />
    </div>
  );
};
const SelectRow = ({ label, name, value, onChange, options }) => (
  <div style={{ marginBottom: 12 }}>
    <label style={{ display: "block", marginBottom: 4, color: "var(--text-secondary)", fontSize: "0.8rem" }}>{label}</label>
    <select name={name} value={value} onChange={onChange}
      style={{ width: "100%", padding: "7px 10px", borderRadius: 8, fontSize: "0.8rem" }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);
const IconToggle = ({ options, value, onChange }) => (
  <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
    {options.map(({ val, icon, label }) => (
      <button key={val} type="button" title={label} onClick={() => onChange(val)}
        style={{ flex: 1, height: 30, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", background: value === val ? "var(--accent)" : "transparent", color: value === val ? "#fff" : "var(--text-muted)", border: "1px solid", borderColor: value === val ? "var(--accent)" : "var(--border)", cursor: "pointer", transition: "all 0.15s" }}>
        {icon}
      </button>
    ))}
  </div>
);

/* ── live preview card (mirrors ProjectDetails layout) ── */
const LiveCard = ({ config, draft, previewMode }) => {
  const {
    backgroundColor, textColor, buttonColor, buttonTextColor, tagColor,
    titleFontSize, titleFontWeight, titleFontFamily,
    descFontSize, descFontFamily, descFontWeight,
    tagFontSize, borderRadius, boxShadow, border, padding,
    imageSize, imagePosition, imageHeight,
  } = config;

  const imgH = parseInt(imageHeight) || 300;
  const tc = tagColor || buttonColor;
  const isHidden = imageSize === "hidden";
  const isHoriz = imagePosition === "left" || imagePosition === "right";
  const isFull = imageSize === "full";
  const isMobile = previewMode === "mobile";
  const imgWidthMap = { full: "100%", large: "75%", medium: "52%", small: "36%" };
  const imgW = imgWidthMap[imageSize] || "100%";
  const imgBR = Math.min(parseInt(borderRadius) || 12, 16);
  const pd = parseInt(padding) || 32;

  const title = draft.projectName || "Project Name";
  const desc = draft.description || "Your project description appears here.";
  const langs = draft.languages?.length ? draft.languages : ["React", "Node.js"];
  const tags = draft.tags?.length ? draft.tags : ["FullStack"];

  const TagsRow = tags.length > 0 && (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {tags.map((t, i) => (
        <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "3px 10px", borderRadius: 99, fontSize: tagFontSize || "0.72rem", fontWeight: 700, background: `${tc}20`, color: tc, border: `1px solid ${tc}30`, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          <RiPriceTag3Line size={10} />{t}
        </span>
      ))}
    </div>
  );
  const TitleEl = <h2 style={{ fontFamily: titleFontFamily, fontSize: titleFontSize, fontWeight: titleFontWeight, color: textColor, lineHeight: 1.2, margin: 0 }}>{title}</h2>;
  const BottomContent = (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <p style={{ fontFamily: descFontFamily, fontSize: descFontSize, fontWeight: descFontWeight, color: textColor, opacity: 0.82, lineHeight: 1.6, margin: 0 }}>{desc}</p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {langs.map((l, i) => <span key={i} style={{ padding: "4px 10px", borderRadius: 7, fontSize: "0.74rem", fontWeight: 600, background: `${buttonColor}14`, color: buttonColor, border: `1px solid ${buttonColor}22` }}>{String(l)}</span>)}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {draft.githubLink && <button style={{ padding: "8px 16px", borderRadius: 7, background: buttonColor, color: buttonTextColor, border: "none", fontWeight: 700, fontSize: "0.78rem", cursor: "default", display:"flex",alignItems:"center",gap:5 }}><RiGithubLine size={13}/>GitHub</button>}
        {draft.deploymentLink && <button style={{ padding: "8px 16px", borderRadius: 7, background: "transparent", color: buttonColor, border: `1.5px solid ${buttonColor}`, fontWeight: 700, fontSize: "0.78rem", cursor: "default", display:"flex",alignItems:"center",gap:5 }}><RiExternalLinkLine size={13}/>Live Demo</button>}
        {!draft.githubLink && !draft.deploymentLink && <>
          <button style={{ padding: "8px 16px", borderRadius: 7, background: buttonColor, color: buttonTextColor, border: "none", fontWeight: 700, fontSize: "0.78rem", cursor: "default" }}>GitHub</button>
          <button style={{ padding: "8px 16px", borderRadius: 7, background: "transparent", color: buttonColor, border: `1.5px solid ${buttonColor}`, fontWeight: 700, fontSize: "0.78rem", cursor: "default" }}>Live Demo</button>
        </>}
      </div>
    </div>
  );

  const PlainImg = (w, h, br) => (
    <div style={{ width: w, height: h, borderRadius: br, overflow: "hidden", background: "linear-gradient(135deg,rgba(99,102,241,0.25),rgba(167,139,250,0.25))", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {draft.imagePreview
        ? <img src={draft.imagePreview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        : <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.7rem", fontFamily: "var(--font-display)" }}>Image</span>}
    </div>
  );

  let layout;
  if (isHidden) {
    layout = <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{TagsRow}{TitleEl}{BottomContent}</div>;
  } else if (isHoriz) {
    const col = isMobile ? "column" : (imagePosition === "left" ? "row" : "row-reverse");
    layout = (
      <div style={{ display: "flex", flexDirection: col, gap: 16, alignItems: "flex-start" }}>
        {PlainImg(isMobile ? "100%" : imgW, isMobile ? 140 : "auto", imgBR)}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 10 }}>{TagsRow}{TitleEl}{BottomContent}</div>
      </div>
    );
  } else if (isFull) {
    const HeroImg = (
      <div style={{ position: "relative", height: imgH, overflow: "hidden", margin: imagePosition === "top" ? `-${pd}px -${pd}px 0` : `0 -${pd}px -${pd}px`, width: `calc(100% + ${pd * 2}px)`, borderRadius: imagePosition === "top" ? `${parseInt(borderRadius)||12}px ${parseInt(borderRadius)||12}px 0 0` : `0 0 ${parseInt(borderRadius)||12}px ${parseInt(borderRadius)||12}px` }}>
        {draft.imagePreview
          ? <img src={draft.imagePreview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          : <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,rgba(99,102,241,0.3),rgba(167,139,250,0.3))", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-display)", fontSize: "0.8rem" }}>Project Image</span></div>}
        <div style={{ position: "absolute", inset: 0, background: imagePosition === "top" ? "linear-gradient(to top,rgba(0,0,0,0.8) 0%,rgba(0,0,0,0.1) 55%,transparent 100%)" : "linear-gradient(to bottom,rgba(0,0,0,0.8) 0%,rgba(0,0,0,0.1) 55%,transparent 100%)" }} />
        <div style={{ position: "absolute", bottom: imagePosition === "top" ? 20 : "auto", top: imagePosition === "bottom" ? 20 : "auto", left: 20, right: 20, display: "flex", flexDirection: "column", gap: 8 }}>
          {TagsRow}
          <h2 style={{ fontFamily: titleFontFamily, fontSize: titleFontSize, fontWeight: titleFontWeight, color: "#fff", lineHeight: 1.2, margin: 0, textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>{title}</h2>
        </div>
      </div>
    );
    layout = imagePosition === "top"
      ? <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>{HeroImg}{BottomContent}</div>
      : <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>{BottomContent}{HeroImg}</div>;
  } else {
    const shortW = imgWidthMap[imageSize] || "50%";
    const TopRow = (
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 14, alignItems: isMobile ? "stretch" : "center" }}>
        {PlainImg(isMobile ? "100%" : shortW, isMobile ? 120 : imgH, imgBR)}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>{TagsRow}{TitleEl}</div>
      </div>
    );
    layout = imagePosition === "top"
      ? <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{TopRow}{BottomContent}</div>
      : <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{BottomContent}{TopRow}</div>;
  }

  return (
    <div style={{ backgroundColor, color: textColor, borderRadius, boxShadow, border, padding, transition: "all 0.25s ease", overflow: "hidden" }}>
      {layout}
    </div>
  );
};

/* ══ MAIN PAGE ══ */
const CustomizePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector(s => s.auth);
  const draft = useSelector(s => s.draft);
  const { config, previewMode } = useSelector(s => s.design);
  const { loading } = useSelector(s => s.projects);

  useEffect(() => {
    if (!token) navigate("/admin/login");
    // If no draft data, send back to form
    if (!draft.projectName) navigate("/admin/create");
  }, [token, draft.projectName, navigate]);

  const set = (name, value) => dispatch(updateDesignConfig({ [name]: value }));
  const onChange = e => set(e.target.name, e.target.value);

  const previewWidths = { desktop: "100%", tablet: "680px", mobile: "375px" };

  const fontFamilies = [
    { value: "Syne, sans-serif", label: "Syne (Display)" },
    { value: "DM Sans, sans-serif", label: "DM Sans (Body)" },
    { value: "Georgia, serif", label: "Georgia (Serif)" },
    { value: "Courier New, monospace", label: "Courier (Mono)" },
    { value: "Impact, sans-serif", label: "Impact (Bold)" },
    { value: "Trebuchet MS, sans-serif", label: "Trebuchet" },
  ];
  const fontWeights = [
    { value: "300", label: "300 Light" }, { value: "400", label: "400 Regular" },
    { value: "500", label: "500 Medium" }, { value: "600", label: "600 SemiBold" },
    { value: "700", label: "700 Bold" }, { value: "800", label: "800 ExtraBold" },
  ];

  const handleSave = async () => {
    const imageFile = window.__draftImageFile || null;
    const data = new FormData();
    data.append("projectName", draft.projectName);
    data.append("description", draft.description);
    data.append("githubLink", draft.githubLink || "");
    data.append("deploymentLink", draft.deploymentLink || "");
    data.append("languages", JSON.stringify(draft.languages || []));
    data.append("tags", JSON.stringify(draft.tags || []));
    data.append("designConfig", JSON.stringify(config));
    if (imageFile) data.append("image", imageFile);

    let result;
    if (draft.isEditing && draft.editId) {
      const { updateProject } = await import("../store/slices/projectsSlice");
      result = await dispatch(updateProject({ id: draft.editId, formData: data }));
    } else {
      const { createProject } = await import("../store/slices/projectsSlice");
      result = await dispatch(createProject(data));
    }

    if (!result.error) {
      toast.success(draft.isEditing ? "Project updated!" : "Project created!");
      dispatch(clearDraft());
      dispatch(resetDesignConfig());
      window.__draftImageFile = null;
      navigate("/admin/dashboard");
    } else {
      toast.error(result.payload || "Something went wrong");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {/* Top bar */}
      <div style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-card)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => navigate("/admin/create")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", cursor: "pointer", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.82rem" }}>
            <RiArrowLeftLine size={15} /> Back to Details
          </button>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem" }}>
              {draft.projectName || "Untitled Project"}
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Step 2 of 2 — Customize appearance</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Device toggles */}
          <div style={{ display: "flex", gap: 4, padding: "4px", background: "var(--bg-primary)", borderRadius: 9, border: "1px solid var(--border)" }}>
            {[["desktop", <RiComputerLine size={15}/>], ["tablet", <RiTabletLine size={15}/>], ["mobile", <RiSmartphoneLine size={15}/>]].map(([mode, icon]) => (
              <button key={mode} type="button" onClick={() => dispatch(setPreviewMode(mode))}
                style={{ width: 30, height: 30, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", background: previewMode === mode ? "var(--accent)" : "transparent", color: previewMode === mode ? "#fff" : "var(--text-muted)", border: "none", cursor: "pointer", transition: "all 0.15s" }}>
                {icon}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => dispatch(resetDesignConfig())} style={{ width: 34, height: 34, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border)", cursor: "pointer" }} title="Reset styles">
            <RiRefreshLine size={15} />
          </button>
          <button onClick={handleSave} disabled={loading} style={{
            padding: "9px 22px", borderRadius: 9, background: "var(--accent)", color: "#fff",
            border: "none", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.875rem",
            cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 7,
            opacity: loading ? 0.7 : 1, boxShadow: "0 4px 14px var(--accent-glow)",
          }}>
            {loading
              ? <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />Saving...</>
              : draft.isEditing ? <><RiEdit2Line size={15} />Update Project</> : <><RiSendPlaneLine size={15} />Publish Project</>}
          </button>
        </div>
      </div>

      {/* Main split — controls left, preview right */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }} className="customize-body">

        {/* LEFT: controls panel */}
        <div style={{ width: 280, flexShrink: 0, borderRight: "1px solid var(--border)", overflow: "auto", padding: "20px 16px", background: "var(--bg-card)" }} className="controls-panel">

          <div style={{ marginBottom: 20 }}>
            <SH title="Colors" icon={<RiPaletteLine size={13}/>} />
            <ColorRow label="Background" name="backgroundColor" value={config.backgroundColor} onChange={onChange} />
            <ColorRow label="Text" name="textColor" value={config.textColor} onChange={onChange} />
            <ColorRow label="Button" name="buttonColor" value={config.buttonColor} onChange={onChange} />
            <ColorRow label="Button Text" name="buttonTextColor" value={config.buttonTextColor} onChange={onChange} />
            <ColorRow label="Tag Color" name="tagColor" value={config.tagColor || config.buttonColor} onChange={onChange} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <SH title="Image" icon={<RiImageLine size={13}/>} />
            <SelectRow label="Size" name="imageSize" value={config.imageSize} onChange={onChange}
              options={[{ value:"full",label:"Full Width" },{ value:"large",label:"Large (75%)" },{ value:"medium",label:"Medium (52%)" },{ value:"small",label:"Small (36%)" },{ value:"hidden",label:"Hidden" }]} />
            {config.imageSize !== "hidden" && <>
              <label style={{ display: "block", marginBottom: 6, color: "var(--text-secondary)", fontSize: "0.8rem" }}>Position</label>
              <IconToggle value={config.imagePosition} onChange={v => set("imagePosition", v)}
                options={[{ val:"top",icon:<RiArrowUpLine size={13}/>,label:"Top" },{ val:"left",icon:<RiAlignLeft size={13}/>,label:"Left" },{ val:"right",icon:<RiAlignRight size={13}/>,label:"Right" },{ val:"bottom",icon:<RiArrowDownLine size={13}/>,label:"Bottom" }]} />
              {(config.imagePosition === "top" || config.imagePosition === "bottom") && (
                <RangeRow label="Image Height" name="imageHeight" value={config.imageHeight} onChange={e => set("imageHeight", e.target.value)} min={100} max={600} unit="" />
              )}
            </>}
          </div>

          <div style={{ marginBottom: 20 }}>
            <SH title="Title" icon={<RiTextSpacing size={13}/>} />
            <SelectRow label="Font Family" name="titleFontFamily" value={config.titleFontFamily} onChange={onChange} options={fontFamilies} />
            <SelectRow label="Weight" name="titleFontWeight" value={config.titleFontWeight} onChange={onChange} options={fontWeights} />
            <RangeRow label="Size" name="titleFontSize" value={config.titleFontSize} onChange={onChange} min={16} max={60} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <SH title="Description" icon={<RiTextSpacing size={13}/>} />
            <SelectRow label="Font Family" name="descFontFamily" value={config.descFontFamily} onChange={onChange} options={fontFamilies} />
            <SelectRow label="Weight" name="descFontWeight" value={config.descFontWeight} onChange={onChange} options={fontWeights} />
            <RangeRow label="Size" name="descFontSize" value={config.descFontSize} onChange={onChange} min={11} max={24} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <SH title="Tags" icon={<RiPriceTag3Line size={13}/>} />
            <RangeRow label="Tag Font Size" name="tagFontSize" value={config.tagFontSize} onChange={onChange} min={9} max={18} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <SH title="Card Layout" icon={<RiLayoutLine size={13}/>} />
            <RangeRow label="Border Radius" name="borderRadius" value={config.borderRadius} onChange={onChange} min={0} max={48} />
            <RangeRow label="Padding" name="padding" value={config.padding} onChange={onChange} min={8} max={64} />
            <SelectRow label="Shadow" name="boxShadow" value={config.boxShadow} onChange={onChange}
              options={[{ value:"none",label:"None" },{ value:"0px 4px 16px rgba(0,0,0,0.12)",label:"Subtle" },{ value:"0px 8px 32px rgba(0,0,0,0.25)",label:"Medium" },{ value:"0px 20px 60px rgba(0,0,0,0.45)",label:"Strong" },{ value:"0 0 40px rgba(99,102,241,0.2)",label:"Glow Indigo" },{ value:"0 0 40px rgba(236,72,153,0.15)",label:"Glow Pink" }]} />
            <div style={{ marginBottom: 10 }}>
              <label style={{ display: "block", marginBottom: 4, color: "var(--text-secondary)", fontSize: "0.8rem" }}>Border</label>
              <input type="text" name="border" value={config.border} onChange={onChange}
                placeholder="1px solid rgba(255,255,255,0.08)"
                style={{ width: "100%", padding: "7px 10px", borderRadius: 8, fontSize: "0.8rem" }} />
            </div>
          </div>
        </div>

        {/* RIGHT: live preview */}
        <div style={{ flex: 1, overflow: "auto", padding: 32, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", background: "repeating-conic-gradient(var(--bg-card) 0% 25%, var(--bg-primary) 0% 50%) 0 0 / 20px 20px" }} className="preview-area">
          <div style={{ width: previewWidths[previewMode], maxWidth: "100%", transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)" }}>
            <LiveCard config={config} draft={draft} previewMode={previewMode} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 900px) {
          .customize-body { flex-direction: column !important; overflow: visible !important; }
          .controls-panel { width: 100% !important; border-right: none !important; border-bottom: 1px solid var(--border); max-height: 380px; }
          .preview-area { padding: 20px !important; }
        }
      `}</style>
    </div>
  );
};

export default CustomizePage;