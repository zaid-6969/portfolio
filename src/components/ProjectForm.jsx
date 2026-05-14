import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProject, updateProject } from "../store/slices/projectsSlice";
import { setSelectedProject } from "../store/slices/projectsSlice";
import { loadDesignConfig } from "../store/slices/designSlice";
import toast from "react-hot-toast";
import { RiUpload2Line, RiSendPlaneLine, RiEdit2Line, RiCloseLine, RiImageAddLine } from "react-icons/ri";

const Field = ({ label, children, hint }) => (
  <div>
    <label style={{ display: "block", marginBottom: 6, color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 500 }}>{label}</label>
    {children}
    {hint && <p style={{ marginTop: 4, color: "var(--text-muted)", fontSize: "0.75rem" }}>{hint}</p>}
  </div>
);

const ProjectForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { loading, selectedProject } = useSelector(s => s.projects);
  const { config: designConfig } = useSelector(s => s.design);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    projectName: "", description: "", githubLink: "", deploymentLink: "", languages: "", tags: "",
  });

  const isEditing = !!selectedProject;

  useEffect(() => {
    if (selectedProject) {
      setFormData({
        projectName: selectedProject.projectName || "",
        description: selectedProject.description || "",
        githubLink: selectedProject.githubLink || "",
        deploymentLink: selectedProject.deploymentLink || "",
        languages: selectedProject.languages?.join(", ") || "",
        tags: selectedProject.tags?.join(", ") || "",
      });
      if (selectedProject.image) setImagePreview(selectedProject.image);
      if (selectedProject.designConfig) dispatch(loadDesignConfig(selectedProject.designConfig));
    }
  }, [selectedProject, dispatch]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    dispatch(setSelectedProject(null));
    setFormData({ projectName: "", description: "", githubLink: "", deploymentLink: "", languages: "", tags: "" });
    setImage(null); setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      if (k === "languages" || k === "tags") data.append(k, JSON.stringify(v.split(",").map(s => s.trim()).filter(Boolean)));
      else data.append(k, v);
    });
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
        setFormData({ projectName: "", description: "", githubLink: "", deploymentLink: "", languages: "", tags: "" });
        setImage(null); setImagePreview(null);
        onSuccess?.();
      } else toast.error(result.payload || "Creation failed");
    }
  };

  const inputStyle = { width: "100%", padding: "11px 14px", fontSize: "0.9rem", borderRadius: 10 };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {isEditing ? <RiEdit2Line size={20} style={{ color: "var(--warning)" }} /> : <RiSendPlaneLine size={20} style={{ color: "var(--accent)" }} />}
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.3rem", margin: 0 }}>
            {isEditing ? "Edit Project" : "New Project"}
          </h2>
        </div>
        {isEditing && (
          <button type="button" onClick={handleCancel}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border)", cursor: "pointer", fontSize: "0.85rem" }}>
            <RiCloseLine size={16} /> Cancel
          </button>
        )}
      </div>

      <Field label="Project Name">
        <input name="projectName" placeholder="My Awesome Project" value={formData.projectName} onChange={handleChange} required style={inputStyle} />
      </Field>

      <Field label="Description">
        <textarea name="description" placeholder="Describe what this project does, the problem it solves..." value={formData.description} onChange={handleChange} style={{ ...inputStyle, height: 100, resize: "vertical" }} />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="GitHub Link">
          <input name="githubLink" placeholder="https://github.com/..." value={formData.githubLink} onChange={handleChange} style={inputStyle} />
        </Field>
        <Field label="Live Demo URL">
          <input name="deploymentLink" placeholder="https://myapp.vercel.app" value={formData.deploymentLink} onChange={handleChange} style={inputStyle} />
        </Field>
      </div>

      <Field label="Technologies" hint="Comma separated: React, Node.js, MongoDB">
        <input name="languages" placeholder="React, Node.js, Express, MongoDB" value={formData.languages} onChange={handleChange} style={inputStyle} />
      </Field>

      <Field label="Tags" hint="Comma separated: FullStack, MERN, API">
        <input name="tags" placeholder="FullStack, MERN, REST API" value={formData.tags} onChange={handleChange} style={inputStyle} />
      </Field>

      {/* Image upload */}
      <Field label="Project Image">
        <label style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          padding: imagePreview ? 0 : "24px 16px",
          border: "2px dashed var(--border)", borderRadius: 12, cursor: "pointer",
          transition: "border-color 0.2s", overflow: "hidden",
          background: "rgba(255,255,255,0.02)",
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
        >
          {imagePreview ? (
            <img src={imagePreview} alt="preview" style={{ width: "100%", height: 180, objectFit: "cover" }} />
          ) : (
            <>
              <RiImageAddLine size={32} style={{ color: "var(--text-muted)" }} />
              <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Click to upload image</span>
              <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>PNG, JPG up to 10MB</span>
            </>
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
        </label>
      </Field>

      <button type="submit" disabled={loading}
        className="btn-primary"
        style={{
          padding: "14px", fontSize: "0.95rem",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          opacity: loading ? 0.7 : 1,
          background: isEditing ? "var(--warning)" : "var(--accent)",
        }}>
        {loading ? (
          <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> {isEditing ? "Updating..." : "Creating..."}</>
        ) : isEditing ? <><RiEdit2Line size={16} /> Update Project</> : <><RiSendPlaneLine size={16} /> Create Project</>}
      </button>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  );
};

export default ProjectForm;