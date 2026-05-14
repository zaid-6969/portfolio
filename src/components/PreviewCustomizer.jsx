import { useDispatch, useSelector } from "react-redux";
import { updateDesignConfig, resetDesignConfig, setPreviewMode } from "../store/slices/designSlice";
import { RiComputerLine, RiTabletLine, RiSmartphoneLine, RiRefreshLine, RiPaletteLine, RiTextSpacing, RiLayoutLine } from "react-icons/ri";

const Section = ({ title, icon, children }) => (
  <div style={{ marginBottom: 24 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, paddingBottom: 8, borderBottom: "1px solid var(--border)" }}>
      <span style={{ color: "var(--accent)" }}>{icon}</span>
      <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)" }}>{title}</span>
    </div>
    {children}
  </div>
);

const ColorInput = ({ label, name, value, onChange }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
    <label style={{ color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 500 }}>{label}</label>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", fontFamily: "monospace" }}>{value}</span>
      <input type="color" name={name} value={value} onChange={onChange}
        style={{ width: 36, height: 36, padding: 2, borderRadius: 8, cursor: "pointer", border: "1px solid var(--border)", background: "transparent" }} />
    </div>
  </div>
);

const RangeInput = ({ label, name, value, onChange, min, max, unit = "px" }) => {
  const numVal = parseInt(value) || 0;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <label style={{ color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 500 }}>{label}</label>
        <span style={{ color: "var(--accent-light)", fontSize: "0.8rem", fontFamily: "monospace" }}>{numVal}{unit}</span>
      </div>
      <input type="range" min={min} max={max} value={numVal}
        onChange={e => onChange({ target: { name, value: `${e.target.value}${unit}` } })}
        style={{ width: "100%", accentColor: "var(--accent)", cursor: "pointer" }} />
    </div>
  );
};

const SelectInput = ({ label, name, value, onChange, options }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: "block", marginBottom: 6, color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 500 }}>{label}</label>
    <select name={name} value={value} onChange={onChange}
      style={{ width: "100%", padding: "10px 12px", borderRadius: 8, fontSize: "0.875rem" }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const PreviewCustomizer = ({ formData }) => {
  const dispatch = useDispatch();
  const { config: designConfig, previewMode } = useSelector(s => s.design);

  const handleChange = (e) => {
    dispatch(updateDesignConfig({ [e.target.name]: e.target.value }));
  };

  const previewWidths = { desktop: "100%", tablet: "768px", mobile: "390px" };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 20px", borderBottom: "1px solid var(--border)",
        background: "var(--bg-card)", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <RiPaletteLine style={{ color: "var(--accent)" }} size={18} />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem" }}>Live Preview</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[["desktop", <RiComputerLine size={16}/>], ["tablet", <RiTabletLine size={16}/>], ["mobile", <RiSmartphoneLine size={16}/>]].map(([mode, icon]) => (
            <button key={mode} onClick={() => dispatch(setPreviewMode(mode))}
              style={{
                width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                background: previewMode === mode ? "var(--accent)" : "transparent",
                color: previewMode === mode ? "#fff" : "var(--text-muted)",
                border: "1px solid", borderColor: previewMode === mode ? "var(--accent)" : "var(--border)",
                cursor: "pointer", transition: "all 0.2s",
              }}>{icon}</button>
          ))}
          <button onClick={() => dispatch(resetDesignConfig())}
            style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border)", cursor: "pointer", transition: "all 0.2s" }}
            title="Reset styles">
            <RiRefreshLine size={16} />
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div style={{
        flex: 1, overflow: "auto", padding: 20,
        background: "repeating-conic-gradient(rgba(255,255,255,0.02) 0% 25%, transparent 0% 50%) 0 0 / 20px 20px",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        transition: "all 0.3s",
      }}>
        <div style={{ width: previewWidths[previewMode], transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)", maxWidth: "100%" }}>
          {/* Live Preview Card */}
          <div style={{
            backgroundColor: designConfig.backgroundColor,
            color: designConfig.textColor,
            borderRadius: designConfig.borderRadius,
            boxShadow: designConfig.boxShadow,
            border: designConfig.border,
            padding: designConfig.padding,
            fontSize: designConfig.fontSize,
            transition: "all 0.3s ease",
            overflow: "hidden",
          }}>
            {/* Mock project image */}
            <div style={{ width: "100%", height: previewMode === "mobile" ? 160 : 220, borderRadius: parseInt(designConfig.borderRadius) > 8 ? "8px" : "4px", background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(167,139,250,0.3))", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {formData?.image ? (
                <img src={URL.createObjectURL(formData.image)} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem", fontFamily: "var(--font-display)" }}>Project Image</span>
              )}
            </div>

            <h2 style={{ fontFamily: "var(--font-display)", fontSize: `calc(${designConfig.fontSize} * 1.5)`, fontWeight: 700, marginBottom: 12, color: designConfig.textColor }}>
              {formData?.projectName || "Project Name"}
            </h2>

            <p style={{ fontSize: designConfig.fontSize, lineHeight: 1.6, marginBottom: 16, opacity: 0.8, color: designConfig.textColor }}>
              {formData?.description || "Your project description will appear here. It will show how the text looks with your chosen styling."}
            </p>

            {/* Tags */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              {(formData?.languages || "React, Node.js, MongoDB").split(",").slice(0,4).map((lang, i) => (
                <span key={i} style={{ padding: "4px 12px", borderRadius: 99, fontSize: "0.75rem", fontWeight: 600, background: `${designConfig.buttonColor}20`, color: designConfig.buttonColor, border: `1px solid ${designConfig.buttonColor}30` }}>
                  {lang.trim()}
                </span>
              ))}
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button style={{ padding: "10px 20px", borderRadius: "6px", background: designConfig.buttonColor, color: designConfig.buttonTextColor, border: "none", fontWeight: 600, cursor: "pointer", fontSize: "0.875rem" }}>
                GitHub
              </button>
              <button style={{ padding: "10px 20px", borderRadius: "6px", background: "transparent", color: designConfig.buttonColor, border: `1px solid ${designConfig.buttonColor}`, fontWeight: 600, cursor: "pointer", fontSize: "0.875rem" }}>
                Live Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ height: "45%", overflow: "auto", padding: "20px", background: "var(--bg-card)", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
        <Section title="Colors" icon={<RiPaletteLine size={14}/>}>
          <ColorInput label="Background" name="backgroundColor" value={designConfig.backgroundColor} onChange={handleChange} />
          <ColorInput label="Text" name="textColor" value={designConfig.textColor} onChange={handleChange} />
          <ColorInput label="Button" name="buttonColor" value={designConfig.buttonColor} onChange={handleChange} />
          <ColorInput label="Button Text" name="buttonTextColor" value={designConfig.buttonTextColor} onChange={handleChange} />
        </Section>

        <Section title="Typography" icon={<RiTextSpacing size={14}/>}>
          <RangeInput label="Font Size" name="fontSize" value={designConfig.fontSize} onChange={handleChange} min={12} max={24} />
        </Section>

        <Section title="Layout" icon={<RiLayoutLine size={14}/>}>
          <RangeInput label="Border Radius" name="borderRadius" value={designConfig.borderRadius} onChange={handleChange} min={0} max={48} />
          <RangeInput label="Padding" name="padding" value={designConfig.padding} onChange={handleChange} min={8} max={64} />
          <SelectInput label="Box Shadow" name="boxShadow" value={designConfig.boxShadow} onChange={handleChange}
            options={[
              { value: "none", label: "None" },
              { value: "0px 4px 16px rgba(0,0,0,0.2)", label: "Subtle" },
              { value: "0px 8px 32px rgba(0,0,0,0.3)", label: "Medium" },
              { value: "0px 20px 60px rgba(0,0,0,0.5)", label: "Strong" },
              { value: "0px 0px 40px rgba(99,102,241,0.3)", label: "Glow (Indigo)" },
            ]}
          />
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", marginBottom: 6, color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 500 }}>Border</label>
            <input type="text" name="border" value={designConfig.border} onChange={handleChange}
              placeholder="1px solid rgba(255,255,255,0.1)"
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, fontSize: "0.875rem" }} />
          </div>
        </Section>
      </div>
    </div>
  );
};

export default PreviewCustomizer;