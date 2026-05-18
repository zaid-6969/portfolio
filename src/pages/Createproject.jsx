import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveDraft, clearDraft } from "../store/slices/draftslice";
import { setSelectedProject } from "../store/slices/projectsSlice";
import { resetDesignConfig, loadDesignConfig } from "../store/slices/designSlice";
import Navbar from "../components/Navbar";
import {
  RiArrowLeftLine, RiArrowRightLine, RiAddLine, RiCloseLine,
  RiImageAddLine, RiEdit2Line,
} from "react-icons/ri";

const Field = ({ label, hint, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ color: "var(--text-secondary)", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</label>
    {children}
    {hint && <span style={{ color: "var(--text-muted)", fontSize: "0.74rem" }}>{hint}</span>}
  </div>
);

const ChipInput = ({ label, hint, items, onAdd, onRemove, placeholder, color }) => {
  const [val, setVal] = useState("");
  const add = () => { const t = val.trim(); if (t && !items.includes(t)) { onAdd(t); setVal(""); } };
  return (
    <Field label={label} hint={hint}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "10px 12px", background: "var(--bg-input)", border: "1px solid var(--border)", borderRadius: 10, minHeight: 46, alignItems: "center", cursor: "text" }}
        onClick={e => e.currentTarget.querySelector("input")?.focus()}>
        {items.map((item, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 99, fontSize: "0.78rem", fontWeight: 600, background: `${color}18`, color, border: `1px solid ${color}30`, whiteSpace: "nowrap" }}>
            {item}
            <button type="button" onClick={() => onRemove(i)} style={{ background: "none", border: "none", cursor: "pointer", color, display: "flex", padding: 0, lineHeight: 1 }}>
              <RiCloseLine size={13} />
            </button>
          </span>
        ))}
        <div style={{ display: "flex", flex: 1, minWidth: 100, alignItems: "center", gap: 4 }}>
          <input value={val} onChange={e => setVal(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
            placeholder={items.length ? "" : placeholder}
            style={{ flex: 1, border: "none", background: "transparent", outline: "none", color: "var(--text-primary)", fontSize: "0.875rem", padding: "2px 0", minWidth: 80 }} />
          <button type="button" onClick={add} style={{ width: 22, height: 22, borderRadius: 6, background: color, border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <RiAddLine size={14} />
          </button>
        </div>
      </div>
    </Field>
  );
};

const CreateProject = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector(s => s.auth);
  const { selectedProject } = useSelector(s => s.projects);
  const draft = useSelector(s => s.draft);
  const isEditing = draft.isEditing || !!selectedProject;

  // local state — File can't live in Redux
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(draft.imagePreview || null);
  const [form, setForm] = useState({
    projectName: draft.projectName || "",
    description: draft.description || "",
    githubLink: draft.githubLink || "",
    deploymentLink: draft.deploymentLink || "",
  });
  const [languages, setLanguages] = useState(draft.languages || []);
  const [tags, setTags] = useState(draft.tags || []);

  useEffect(() => { if (!token) navigate("/admin/login"); }, [token, navigate]);

  // Pre-fill from selectedProject (edit mode)
  useEffect(() => {
    if (selectedProject && !draft.isEditing) {
      setForm({
        projectName: selectedProject.projectName || "",
        description: selectedProject.description || "",
        githubLink: selectedProject.githubLink || "",
        deploymentLink: selectedProject.deploymentLink || "",
      });
      setLanguages(selectedProject.languages || []);
      setTags(selectedProject.tags || []);
      setImagePreview(selectedProject.image || null);
      if (selectedProject.designConfig) dispatch(loadDesignConfig(selectedProject.designConfig));
      else dispatch(resetDesignConfig());
    }
  }, [selectedProject]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleNext = e => {
    e.preventDefault();
    if (!form.projectName.trim()) return;
    // Save everything to Redux draft
    dispatch(saveDraft({
      ...form,
      languages,
      tags,
      imagePreview,
      isEditing,
      editId: selectedProject?._id || draft.editId || null,
    }));
    // Pass imageFile via sessionStorage key (can't serialize File)
    if (imageFile) {
      window.__draftImageFile = imageFile;
    }
    navigate("/admin/customize");
  };

  const handleCancel = () => {
    dispatch(clearDraft());
    dispatch(setSelectedProject(null));
    dispatch(resetDesignConfig());
    navigate("/admin/dashboard");
  };

  const inputStyle = { width: "100%", padding: "12px 14px", fontSize: "0.92rem", borderRadius: 10 };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Navbar />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px 64px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 36 }}>
          <button onClick={handleCancel} style={{ width: 36, height: 36, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", cursor: "pointer", flexShrink: 0 }}>
            <RiArrowLeftLine size={17} />
          </button>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
              {isEditing
                ? <RiEdit2Line size={20} style={{ color: "var(--warning)" }} />
                : <RiAddLine size={20} style={{ color: "var(--accent)" }} />}
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 800, margin: 0 }}>
                {isEditing ? "Edit Project" : "New Project"}
              </h1>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: 0 }}>
              Step 1 of 2 — Fill in your project details
            </p>
          </div>

          {/* Step indicator */}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 28, height: 28, borderRadius: 99, background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700 }}>1</div>
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--accent)", fontFamily: "var(--font-display)" }}>Details</span>
            </div>
            <div style={{ width: 32, height: 2, background: "var(--border)", borderRadius: 2 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 28, height: 28, borderRadius: 99, background: "var(--border)", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700 }}>2</div>
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>Customize</span>
            </div>
          </div>
        </div>

        {/* Form card */}
        <form onSubmit={handleNext}>
          <div className="card" style={{ padding: 32, display: "flex", flexDirection: "column", gap: 24 }}>

            <Field label="Project Name">
              <input name="projectName" value={form.projectName} onChange={handleChange}
                placeholder="My Awesome Project" required style={inputStyle} autoFocus />
            </Field>

            <Field label="Description">
              <textarea name="description" value={form.description} onChange={handleChange}
                placeholder="What does this project do? What problem does it solve?"
                style={{ ...inputStyle, height: 110, resize: "vertical" }} />
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }} className="two-col">
              <Field label="GitHub Link">
                <input name="githubLink" value={form.githubLink} onChange={handleChange}
                  placeholder="https://github.com/..." style={inputStyle} />
              </Field>
              <Field label="Live Demo URL">
                <input name="deploymentLink" value={form.deploymentLink} onChange={handleChange}
                  placeholder="https://myapp.vercel.app" style={inputStyle} />
              </Field>
            </div>

            <ChipInput label="Technologies" hint="Type and press Enter or click + to add"
              items={languages} onAdd={t => setLanguages([...languages, t])}
              onRemove={i => setLanguages(languages.filter((_, idx) => idx !== i))}
              placeholder="React, Node.js..." color="var(--accent)" />

            <ChipInput label="Tags" hint="Type and press Enter or click + to add"
              items={tags} onAdd={t => setTags([...tags, t])}
              onRemove={i => setTags(tags.filter((_, idx) => idx !== i))}
              placeholder="FullStack, API..." color="var(--success)" />

            {/* Image upload */}
            <Field label="Project Image">
              <label style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                padding: imagePreview ? 0 : "28px 16px",
                border: "2px dashed var(--border)", borderRadius: 12, cursor: "pointer",
                overflow: "hidden", background: "var(--bg-input)", transition: "border-color 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
              >
                {imagePreview ? (
                  <div style={{ width: "100%", position: "relative" }}>
                    <img src={imagePreview} alt="preview" style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }} />
                    <div style={{ position: "absolute", bottom: 10, right: 10 }}>
                      <span style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: "0.78rem", fontWeight: 600, backdropFilter: "blur(4px)" }}>
                        Click to change
                      </span>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <RiImageAddLine size={24} style={{ color: "var(--accent)" }} />
                    </div>
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem", fontWeight: 500 }}>Click to upload image</span>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>PNG, JPG up to 10MB</span>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
              </label>
            </Field>
          </div>

          {/* Footer actions */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, gap: 12 }}>
            <button type="button" onClick={handleCancel} style={{
              padding: "12px 24px", borderRadius: 10, background: "transparent",
              color: "var(--text-muted)", border: "1px solid var(--border)",
              fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer",
            }}>
              Cancel
            </button>
            <button type="submit" style={{
              padding: "12px 28px", borderRadius: 10,
              background: "var(--accent)", color: "#fff", border: "none",
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9rem",
              cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
              boxShadow: "0 4px 16px var(--accent-glow)",
            }}>
              Next — Customize <RiArrowRightLine size={17} />
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default CreateProject;