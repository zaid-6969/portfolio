import { useDispatch, useSelector } from "react-redux";
import { updateDesignConfig, resetDesignConfig, setPreviewMode } from "../store/slices/designSlice";
import {
  RiComputerLine, RiTabletLine, RiSmartphoneLine, RiRefreshLine,
  RiPaletteLine, RiTextSpacing, RiLayoutLine, RiImageLine,
  RiAlignLeft, RiAlignCenter, RiAlignRight, RiArrowUpLine,
  RiArrowDownLine,
} from "react-icons/ri";

/* ── tiny UI atoms ── */
const SectionHead = ({ title, icon }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14, paddingBottom: 8, borderBottom: "1px solid var(--border)" }}>
    <span style={{ color: "var(--accent)", display: "flex" }}>{icon}</span>
    <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)" }}>{title}</span>
  </div>
);

const ColorRow = ({ label, name, value, onChange }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
    <label style={{ color: "var(--text-secondary)", fontSize: "0.82rem" }}>{label}</label>
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <span style={{ color: "var(--text-muted)", fontSize: "0.7rem", fontFamily: "monospace" }}>{value}</span>
      <input type="color" name={name} value={value || "#000000"} onChange={onChange}
        style={{ width: 32, height: 32, padding: 2, borderRadius: 7, cursor: "pointer", border: "1px solid var(--border)", background: "transparent" }} />
    </div>
  </div>
);

const RangeRow = ({ label, name, value, onChange, min, max, unit = "px" }) => {
  const num = parseFloat(value) || 0;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <label style={{ color: "var(--text-secondary)", fontSize: "0.82rem" }}>{label}</label>
        <span style={{ color: "var(--accent-light)", fontSize: "0.76rem", fontFamily: "monospace" }}>{num}{unit}</span>
      </div>
      <input type="range" min={min} max={max} value={num}
        onChange={e => onChange({ target: { name, value: unit === "" ? e.target.value : `${e.target.value}${unit}` } })}
        style={{ width: "100%", accentColor: "var(--accent)", cursor: "pointer" }} />
    </div>
  );
};

const SelectRow = ({ label, name, value, onChange, options }) => (
  <div style={{ marginBottom: 12 }}>
    <label style={{ display: "block", marginBottom: 5, color: "var(--text-secondary)", fontSize: "0.82rem" }}>{label}</label>
    <select name={name} value={value} onChange={onChange}
      style={{ width: "100%", padding: "8px 10px", borderRadius: 8, fontSize: "0.82rem" }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const IconToggle = ({ options, value, onChange }) => (
  <div style={{ display: "flex", gap: 4 }}>
    {options.map(({ val, icon, label }) => (
      <button key={val} type="button" title={label}
        onClick={() => onChange(val)}
        style={{
          flex: 1, height: 32, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center",
          background: value === val ? "var(--accent)" : "transparent",
          color: value === val ? "#fff" : "var(--text-muted)",
          border: "1px solid", borderColor: value === val ? "var(--accent)" : "var(--border)",
          cursor: "pointer", transition: "all 0.15s",
        }}>
        {icon}
      </button>
    ))}
  </div>
);

/* ─── LIVE PREVIEW CARD ─── */
const LiveCard = ({ config, formData, previewMode }) => {
  const {
    backgroundColor, textColor, buttonColor, buttonTextColor, tagColor,
    titleFontSize, titleFontWeight, titleFontFamily,
    descFontSize, descFontFamily, descFontWeight,
    tagFontSize,
    borderRadius, boxShadow, border, padding,
    imageSize, imagePosition, imageHeight,
  } = config;

  const imgH = parseInt(imageHeight) || 300;
  const hasImage = !!formData?.imagePreview;

  const title = formData?.projectName || "Project Name";
  const desc = formData?.description || "Your project description will appear here, showing how text looks with your chosen font and styling options.";
  const langs = formData?.languages?.length ? formData.languages : ["React", "Node.js", "MongoDB"];
  const tags = formData?.tags?.length ? formData.tags : ["FullStack", "MERN"];

  const isHidden = imageSize === "hidden";
  const imgWidthMap = { full: "100%", large: "80%", medium: "60%", small: "40%" };
  const imgWidth = imgWidthMap[imageSize] || "100%";

  const isHoriz = imagePosition === "left" || imagePosition === "right";

  /* image element */
  const ImageEl = !isHidden && (
    <div style={{
      flexShrink: 0,
      width: isHoriz ? imgWidth : "100%",
      minWidth: isHoriz ? 180 : "auto",
      height: isHoriz ? "auto" : imgH,
      minHeight: isHoriz ? 200 : "auto",
      borderRadius: parseInt(borderRadius) > 12 ? 12 : parseInt(borderRadius) || 8,
      overflow: "hidden",
      background: "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(167,139,250,0.25))",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative",
    }}>
      {hasImage
        ? <img src={formData.imagePreview} alt="project" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        : <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", fontFamily: "var(--font-display)" }}>Project Image</span>
      }
    </div>
  );

  /* content element */
  const ContentEl = (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {tags.map((t, i) => (
          <span key={i} style={{ padding: "3px 10px", borderRadius: 99, fontSize: tagFontSize || "0.72rem", fontWeight: 700, background: `${tagColor || buttonColor}18`, color: tagColor || buttonColor, border: `1px solid ${tagColor || buttonColor}30`, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {t}
          </span>
        ))}
      </div>
      <h2 style={{ fontFamily: titleFontFamily, fontSize: titleFontSize, fontWeight: titleFontWeight, color: textColor, marginBottom: 10, lineHeight: 1.2 }}>
        {title}
      </h2>
      <p style={{ fontFamily: descFontFamily, fontSize: descFontSize, fontWeight: descFontWeight, color: textColor, opacity: 0.82, lineHeight: 1.65, marginBottom: 16 }}>
        {desc}
      </p>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 18 }}>
        {langs.map((l, i) => (
          <span key={i} style={{ padding: "4px 12px", borderRadius: 8, fontSize: "0.75rem", fontWeight: 600, background: `${buttonColor}15`, color: buttonColor, border: `1px solid ${buttonColor}25` }}>
            {typeof l === "string" ? l : String(l)}
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button style={{ padding: "9px 18px", borderRadius: 7, background: buttonColor, color: buttonTextColor, border: "none", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}>GitHub</button>
        <button style={{ padding: "9px 18px", borderRadius: 7, background: "transparent", color: buttonColor, border: `1.5px solid ${buttonColor}`, fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}>Live Demo</button>
      </div>
    </div>
  );

  let layout;
  if (isHidden) {
    layout = ContentEl;
  } else if (imagePosition === "top") {
    layout = <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>{ImageEl}{ContentEl}</div>;
  } else if (imagePosition === "bottom") {
    layout = <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>{ContentEl}{ImageEl}</div>;
  } else if (imagePosition === "left") {
    layout = <div style={{ display: "flex", flexDirection: previewMode === "mobile" ? "column" : "row", gap: 20, alignItems: "flex-start" }}>{ImageEl}{ContentEl}</div>;
  } else {
    layout = <div style={{ display: "flex", flexDirection: previewMode === "mobile" ? "column" : "row-reverse", gap: 20, alignItems: "flex-start" }}>{ImageEl}{ContentEl}</div>;
  }

  return (
    <div style={{
      backgroundColor, color: textColor,
      borderRadius, boxShadow, border, padding,
      transition: "all 0.25s ease",
      overflow: "hidden",
    }}>
      {layout}
    </div>
  );
};

/* ─── MAIN COMPONENT ─── */
const PreviewCustomizer = ({ formData }) => {
  const dispatch = useDispatch();
  const { config, previewMode } = useSelector(s => s.design);

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
    { value: "300", label: "300 Light" },
    { value: "400", label: "400 Regular" },
    { value: "500", label: "500 Medium" },
    { value: "600", label: "600 SemiBold" },
    { value: "700", label: "700 Bold" },
    { value: "800", label: "800 ExtraBold" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid var(--border)", background: "var(--bg-card)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <RiPaletteLine style={{ color: "var(--accent)" }} size={17} />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem" }}>Live Preview</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[["desktop", <RiComputerLine size={15}/>], ["tablet", <RiTabletLine size={15}/>], ["mobile", <RiSmartphoneLine size={15}/>]].map(([mode, icon]) => (
            <button key={mode} type="button" onClick={() => dispatch(setPreviewMode(mode))}
              style={{ width: 30, height: 30, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", background: previewMode === mode ? "var(--accent)" : "transparent", color: previewMode === mode ? "#fff" : "var(--text-muted)", border: "1px solid", borderColor: previewMode === mode ? "var(--accent)" : "var(--border)", cursor: "pointer", transition: "all 0.15s" }}>
              {icon}
            </button>
          ))}
          <button type="button" onClick={() => dispatch(resetDesignConfig())}
            style={{ width: 30, height: 30, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border)", cursor: "pointer" }} title="Reset">
            <RiRefreshLine size={15} />
          </button>
        </div>
      </div>

      {/* Preview canvas */}
      <div style={{
        height: "45%", overflow: "auto", padding: 16,
        background: "repeating-conic-gradient(rgba(255,255,255,0.018) 0% 25%, transparent 0% 50%) 0 0 / 18px 18px",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        flexShrink: 0,
      }}>
        <div style={{ width: previewWidths[previewMode], transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)", maxWidth: "100%" }}>
          <LiveCard config={config} formData={formData} previewMode={previewMode} />
        </div>
      </div>

      {/* Controls panel */}
      <div style={{ flex: 1, overflow: "auto", padding: "16px 18px", background: "var(--bg-card)", borderTop: "1px solid var(--border)" }}>

        {/* COLORS */}
        <div style={{ marginBottom: 20 }}>
          <SectionHead title="Colors" icon={<RiPaletteLine size={13}/>} />
          <ColorRow label="Background" name="backgroundColor" value={config.backgroundColor} onChange={onChange} />
          <ColorRow label="Text" name="textColor" value={config.textColor} onChange={onChange} />
          <ColorRow label="Button" name="buttonColor" value={config.buttonColor} onChange={onChange} />
          <ColorRow label="Button Text" name="buttonTextColor" value={config.buttonTextColor} onChange={onChange} />
          <ColorRow label="Tag Color" name="tagColor" value={config.tagColor || config.buttonColor} onChange={onChange} />
        </div>

        {/* IMAGE */}
        <div style={{ marginBottom: 20 }}>
          <SectionHead title="Image" icon={<RiImageLine size={13}/>} />
          <SelectRow label="Image Size" name="imageSize" value={config.imageSize} onChange={onChange}
            options={[
              { value: "full", label: "Full Width" },
              { value: "large", label: "Large (80%)" },
              { value: "medium", label: "Medium (60%)" },
              { value: "small", label: "Small (40%)" },
              { value: "hidden", label: "Hidden" },
            ]} />
          {config.imageSize !== "hidden" && (
            <>
              <div style={{ marginBottom: 10 }}>
                <label style={{ display: "block", marginBottom: 6, color: "var(--text-secondary)", fontSize: "0.82rem" }}>Image Position</label>
                <IconToggle
                  value={config.imagePosition}
                  onChange={v => set("imagePosition", v)}
                  options={[
                    { val: "top", icon: <RiArrowUpLine size={14}/>, label: "Top" },
                    { val: "left", icon: <RiAlignLeft size={14}/>, label: "Left" },
                    { val: "right", icon: <RiAlignRight size={14}/>, label: "Right" },
                    { val: "bottom", icon: <RiArrowDownLine size={14}/>, label: "Bottom" },
                  ]}
                />
              </div>
              {(config.imagePosition === "top" || config.imagePosition === "bottom") && (
                <RangeRow label="Image Height" name="imageHeight" value={config.imageHeight} onChange={e => set("imageHeight", e.target.value)} min={100} max={600} unit="" />
              )}
            </>
          )}
        </div>

        {/* TITLE TYPOGRAPHY */}
        <div style={{ marginBottom: 20 }}>
          <SectionHead title="Title Typography" icon={<RiTextSpacing size={13}/>} />
          <SelectRow label="Font Family" name="titleFontFamily" value={config.titleFontFamily} onChange={onChange} options={fontFamilies} />
          <SelectRow label="Font Weight" name="titleFontWeight" value={config.titleFontWeight} onChange={onChange} options={fontWeights} />
          <RangeRow label="Font Size" name="titleFontSize" value={config.titleFontSize} onChange={onChange} min={16} max={60} unit="px" />
        </div>

        {/* DESCRIPTION TYPOGRAPHY */}
        <div style={{ marginBottom: 20 }}>
          <SectionHead title="Description Typography" icon={<RiTextSpacing size={13}/>} />
          <SelectRow label="Font Family" name="descFontFamily" value={config.descFontFamily} onChange={onChange} options={fontFamilies} />
          <SelectRow label="Font Weight" name="descFontWeight" value={config.descFontWeight} onChange={onChange} options={fontWeights} />
          <RangeRow label="Font Size" name="descFontSize" value={config.descFontSize} onChange={onChange} min={11} max={24} unit="px" />
        </div>

        {/* TAGS TYPOGRAPHY */}
        <div style={{ marginBottom: 20 }}>
          <SectionHead title="Tags" icon={<RiTextSpacing size={13}/>} />
          <RangeRow label="Tag Font Size" name="tagFontSize" value={config.tagFontSize} onChange={onChange} min={9} max={18} unit="px" />
        </div>

        {/* LAYOUT */}
        <div style={{ marginBottom: 20 }}>
          <SectionHead title="Card Layout" icon={<RiLayoutLine size={13}/>} />
          <RangeRow label="Border Radius" name="borderRadius" value={config.borderRadius} onChange={onChange} min={0} max={48} />
          <RangeRow label="Padding" name="padding" value={config.padding} onChange={onChange} min={8} max={64} />
          <SelectRow label="Box Shadow" name="boxShadow" value={config.boxShadow} onChange={onChange}
            options={[
              { value: "none", label: "None" },
              { value: "0px 4px 16px rgba(0,0,0,0.12)", label: "Subtle" },
              { value: "0px 8px 32px rgba(0,0,0,0.25)", label: "Medium" },
              { value: "0px 20px 60px rgba(0,0,0,0.45)", label: "Strong" },
              { value: "0 0 0 40px rgba(99,102,241,0.08)", label: "Glow — Indigo" },
              { value: "0 0 0 40px rgba(236,72,153,0.1)", label: "Glow — Pink" },
            ]} />
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: "block", marginBottom: 5, color: "var(--text-secondary)", fontSize: "0.82rem" }}>Border</label>
            <input type="text" name="border" value={config.border} onChange={onChange}
              placeholder="1px solid rgba(255,255,255,0.08)"
              style={{ width: "100%", padding: "8px 10px", borderRadius: 8, fontSize: "0.82rem" }} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default PreviewCustomizer;