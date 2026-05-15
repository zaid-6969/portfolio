import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProject, updateProject, setSelectedProject } from "../store/slices/projectsSlice";
import { loadDesignConfig } from "../store/slices/designSlice";
import toast from "react-hot-toast";
import {
  RiSendPlaneLine, RiEdit2Line, RiCloseLine, RiImageAddLine,
  RiAddLine, RiDeleteBin6Line,
} from "react-icons/ri";

const Field = ({ label, children, hint }) => (
  <div>
    <label style={{ display: "block", marginBottom: 6, color: "var(--text-secondary)", fontSize: "0.82rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>
    {children}
    {hint && <p style={{ marginTop: 4, color: "var(--text-muted)", fontSize: "0.74rem" }}>{hint}</p>}
  </div>
);

// Chip input — type + Enter or click + to add
const ChipInput = ({ label, hint, items, onAdd, onRemove, placeholder, color = "var(--accent)" }) => {
  const [val, setVal] = useState("");
  const add = () => {
    const t = val.trim();
    if (t && !items.includes(t)) { onAdd(t); setVal(""); }
  };
  return (
    <Field label={label} hint={hint}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "10px 12px", background: "var(--bg-input)", border: "1px solid var(--border)", borderRadius: 10, minHeight: 44, alignItems: "center" }}>
        {items.map((item, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 99, fontSize: "0.78rem", fontWeight: 600, background: `${color}18`, color, border: `1px solid ${color}30` }}>
            {item}
            <button type="button" onClick={() => onRemove(i)} style={{ background: "none", border: "none", cursor: "pointer", color, display: "flex", padding: 0, lineHeight: 1 }}>
              <RiCloseLine size={13} />
            </button>
          </span>
        ))}
        <div style={{ display: "flex", flex: 1, minWidth: 120, alignItems: "center", gap: 4 }}>
          <input
            value={val}
            onChange={e => setVal(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
            placeholder={placeholder}
            style={{ flex: 1, border: "none", background: "transparent", outline: "none", color: "var(--text-primary)", fontSize: "0.875rem", padding: "2px 0" }}
          />
          <button type="button" onClick={add} style={{ width: 22, height: 22, borderRadius: 6, background: color, border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <RiAddLine size={14} />
          </button>
        </div>
      </div>
    </Field>
  );
};

const ProjectForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { loading, selectedProject } = useSelector(s => s.projects);
  const { config: designConfig } = useSelector(s => s.design);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [tags, setTags] = useState([]);
  const [formData, setFormData] = useState({
    projectName: "", description: "", githubLink: "", deploymentLink: "",
  });

  const isEditing = !!selectedProject;

  useEffect(() => {
    if (selectedProject) {
      setFormData({
        projectName: selectedProject.projectName || "",
        description: selectedProject.description || "",
        githubLink: selectedProject.githubLink || "",
        deploymentLink: selectedProject.deploymentLink || "",
      });
      setLanguages(selectedProject.languages || []);
      setTags(selectedProject.tags || []);
      if (selectedProject.image) setImagePreview(selectedProject.image);
      if (selectedProject.designConfig) dispatch(loadDesignConfig(selectedProject.designConfig));
    }
  }, [selectedProject, dispatch]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImage(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const handleCancel = () => {
    dispatch(setSelectedProject(null));
    setFormData({ projectName: "", description: "", githubLink: "", deploymentLink: "" });
    setLanguages([]); setTags([]);
    setImage(null); setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    data.append("languages", JSON.stringify(languages));
    data.append("tags", JSON.stringify(tags));
    data.append("designConfig", JSON.stringify(designConfig));
    if (image) data.append("image", image);

    let result;
    if (isEditing) {
      result = await dispatch(updateProject({ id: selectedProject._id, formData: data }));
      if (!result.error) { toast.success("Project updated!"); handleCancel(); onSuccess?.(); }
      else toast.error(result.payload || "Update failed");
    } else {
      result = await dispatch(createProject(data));
      if (!result.error) {
        toast.success("Project created!");
        setFormData({ projectName: "", description: "", githubLink: "", deploymentLink: "" });
        setLanguages([]); setTags([]);
        setImage(null); setImagePreview(null);
        onSuccess?.();
      } else toast.error(result.payload || "Creation failed");
    }
  };

  const inputStyle = { width: "100%", padding: "11px 14px", fontSize: "0.9rem", borderRadius: 10 };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {isEditing
            ? <RiEdit2Line size={20} style={{ color: "var(--warning)" }} />
            : <RiSendPlaneLine size={20} style={{ color: "var(--accent)" }} />}
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem", margin: 0 }}>
            {isEditing ? "Edit Project" : "New Project"}
          </h2>
        </div>
        {isEditing && (
          <button type="button" onClick={handleCancel} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border)", cursor: "pointer", fontSize: "0.82rem" }}>
            <RiCloseLine size={15} /> Cancel
          </button>
        )}
      </div>

      <Field label="Project Name">
        <input name="projectName" placeholder="My Awesome Project" value={formData.projectName} onChange={handleChange} required style={inputStyle} />
      </Field>

      <Field label="Description">
        <textarea name="description" placeholder="What does this project do? What problem does it solve?" value={formData.description} onChange={handleChange} style={{ ...inputStyle, height: 90, resize: "vertical" }} />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="GitHub Link">
          <input name="githubLink" placeholder="https://github.com/..." value={formData.githubLink} onChange={handleChange} style={inputStyle} />
        </Field>
        <Field label="Live Demo URL">
          <input name="deploymentLink" placeholder="https://myapp.vercel.app" value={formData.deploymentLink} onChange={handleChange} style={inputStyle} />
        </Field>
      </div>

      {/* Chip inputs */}
      <ChipInput
        label="Technologies"
        hint='Type a tech name and press Enter or click +'
        items={languages}
        onAdd={t => setLanguages([...languages, t])}
        onRemove={i => setLanguages(languages.filter((_, idx) => idx !== i))}
        placeholder="React, Node.js..."
        color="var(--accent)"
      />

      <ChipInput
        label="Tags"
        hint='Type a tag and press Enter or click +'
        items={tags}
        onAdd={t => setTags([...tags, t])}
        onRemove={i => setTags(tags.filter((_, idx) => idx !== i))}
        placeholder="FullStack, API..."
        color="var(--success)"
      />

      {/* Image upload */}
      <Field label="Project Image">
        <label style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          padding: imagePreview ? 0 : "20px 16px",
          border: "2px dashed var(--border)", borderRadius: 12, cursor: "pointer",
          transition: "border-color 0.2s", overflow: "hidden",
          background: "var(--bg-input)",
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
        >
          {imagePreview ? (
            <div style={{ width: "100%", position: "relative" }}>
              <img src={imagePreview} alt="preview" style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0}
              >
                <span style={{ color: "#fff", fontSize: "0.8rem", fontWeight: 600 }}>Click to change</span>
              </div>
            </div>
          ) : (
            <>
              <RiImageAddLine size={28} style={{ color: "var(--text-muted)" }} />
              <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Click to upload image</span>
              <span style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>PNG, JPG up to 10MB</span>
            </>
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
        </label>
      </Field>

      <button type="submit" disabled={loading}
        className="btn-primary"
        style={{
          padding: "13px", fontSize: "0.92rem",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          opacity: loading ? 0.7 : 1,
          background: isEditing ? "var(--warning)" : "var(--accent)",
        }}>
        {loading
          ? <><div style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />{isEditing ? "Updating..." : "Creating..."}</>
          : isEditing ? <><RiEdit2Line size={15} /> Update Project</> : <><RiSendPlaneLine size={15} /> Create Project</>
        }
      </button>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  );
};

export default ProjectForm;