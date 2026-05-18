import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects, deleteProject, setSelectedProject } from "../store/slices/projectsSlice";
import { saveDraft, clearDraft } from "../store/slices/draftslice";
import { loadDesignConfig, resetDesignConfig } from "../store/slices/designSlice";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import {
  RiDashboardLine, RiDeleteBin6Line, RiEdit2Line, RiEyeLine,
  RiGithubLine, RiExternalLinkLine, RiCodeLine, RiLayoutMasonryLine,
  RiAddLine,
} from "react-icons/ri";

const StatCard = ({ label, value, icon, color }) => (
  <div className="card" style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
    <div style={{ width: 46, height: 46, borderRadius: 12, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", color, flexShrink: 0 }}>
      {icon}
    </div>
    <div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 800 }}>{value}</div>
      <div style={{ color: "var(--text-muted)", fontSize: "0.78rem", fontWeight: 500 }}>{label}</div>
    </div>
  </div>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: projects, loading } = useSelector(s => s.projects);
  const { token } = useSelector(s => s.auth);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { if (!token) navigate("/admin/login"); }, [token, navigate]);
  useEffect(() => { dispatch(fetchProjects()); }, [dispatch]);

  const handleNewProject = () => {
    dispatch(clearDraft());
    dispatch(setSelectedProject(null));
    dispatch(resetDesignConfig());
    navigate("/admin/create");
  };

  const handleEdit = (project) => {
    dispatch(setSelectedProject(project));
    dispatch(saveDraft({
      projectName: project.projectName || "",
      description: project.description || "",
      githubLink: project.githubLink || "",
      deploymentLink: project.deploymentLink || "",
      languages: project.languages || [],
      tags: project.tags || [],
      imagePreview: project.image || null,
      isEditing: true,
      editId: project._id,
    }));
    if (project.designConfig) dispatch(loadDesignConfig(project.designConfig));
    else dispatch(resetDesignConfig());
    navigate("/admin/create");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    setDeleteId(id);
    const result = await dispatch(deleteProject(id));
    setDeleteId(null);
    if (!result.error) toast.success("Project deleted");
    else toast.error("Failed to delete");
  };

  const allTags = [...new Set(projects.flatMap(p => p.tags || []))];
  const allLangs = [...new Set(projects.flatMap(p => p.languages || []))];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Navbar />

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 24px 64px" }}>

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <RiDashboardLine style={{ color: "var(--accent)" }} size={22} />
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 800, margin: 0 }}>Dashboard</h1>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", margin: 0 }}>Manage your portfolio projects</p>
          </div>
          <button onClick={handleNewProject} className="btn-primary"
            style={{ padding: "11px 22px", display: "flex", alignItems: "center", gap: 8, fontSize: "0.9rem", borderRadius: 10 }}>
            <RiAddLine size={18} /> New Project
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 16, marginBottom: 40 }}>
          <StatCard label="Total Projects" value={projects.length} icon={<RiLayoutMasonryLine size={21}/>} color="var(--accent)" />
          <StatCard label="Technologies" value={allLangs.length} icon={<RiCodeLine size={21}/>} color="var(--success)" />
          <StatCard label="Categories" value={allTags.length} icon={<RiDashboardLine size={21}/>} color="var(--warning)" />
        </div>

        {/* Projects grid */}
        {loading ? <Loader /> : projects.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <RiLayoutMasonryLine size={56} style={{ color: "var(--text-muted)", marginBottom: 16, opacity: 0.3 }} />
            <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)", fontSize: "1.1rem", marginBottom: 8 }}>No projects yet</p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: 24 }}>Click "New Project" to add your first one</p>
            <button onClick={handleNewProject} className="btn-primary" style={{ padding: "11px 22px", fontSize: "0.9rem", borderRadius: 10 }}>
              <RiAddLine size={16} style={{ marginRight: 6 }} /> New Project
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 22 }}>
            {projects.map((project, i) => (
              <div key={project._id} className="card" style={{ overflow: "hidden", animation: `fadeIn 0.4s ease ${i * 0.05}s both` }}>
                {/* Thumbnail */}
                <div style={{ position: "relative", height: 185, overflow: "hidden" }}>
                  <img src={project.image} alt={project.projectName}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                    onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
                    onMouseLeave={e => e.target.style.transform = "scale(1)"}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,13,26,0.75) 0%, transparent 55%)" }} />
                  {/* Tags overlay */}
                  {project.tags?.slice(0,2).map((tag, j) => (
                    <span key={j} style={{ position: "absolute", top: 10, left: j === 0 ? 10 : "auto", right: j === 1 ? 10 : "auto", padding: "3px 9px", borderRadius: 99, fontSize: "0.7rem", fontWeight: 700, background: "rgba(8,13,26,0.75)", color: "var(--accent-light)", border: "1px solid var(--border)", backdropFilter: "blur(6px)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {tag}
                    </span>
                  ))}
                </div>

                <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 700, margin: 0 }}>
                    {project.projectName}
                  </h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.55, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {project.description}
                  </p>

                  {project.languages?.length > 0 && (
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      {project.languages.slice(0,4).map((l, j) => (
                        <span key={j} className="tag-pill" style={{ fontSize: "0.72rem" }}>{String(l).trim()}</span>
                      ))}
                      {project.languages.length > 4 && <span className="tag-pill" style={{ fontSize: "0.72rem" }}>+{project.languages.length - 4}</span>}
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 7, paddingTop: 4 }}>
                    <Link to={`/project/${project._id}`}
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "8px 10px", borderRadius: 8, background: "rgba(99,102,241,0.08)", color: "var(--accent-light)", border: "1px solid rgba(99,102,241,0.18)", textDecoration: "none", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.78rem", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "var(--accent)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(99,102,241,0.08)"; e.currentTarget.style.color = "var(--accent-light)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.18)"; }}
                    >
                      <RiEyeLine size={13} /> View
                    </Link>
                    <button onClick={() => handleEdit(project)}
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "8px 10px", borderRadius: 8, background: "rgba(245,158,11,0.08)", color: "var(--warning)", border: "1px solid rgba(245,158,11,0.18)", cursor: "pointer", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.78rem", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "var(--warning)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "var(--warning)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(245,158,11,0.08)"; e.currentTarget.style.color = "var(--warning)"; e.currentTarget.style.borderColor = "rgba(245,158,11,0.18)"; }}
                    >
                      <RiEdit2Line size={13} /> Edit
                    </button>
                    <button onClick={() => handleDelete(project._id)} disabled={deleteId === project._id}
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "8px 10px", borderRadius: 8, background: "rgba(239,68,68,0.08)", color: "var(--danger)", border: "1px solid rgba(239,68,68,0.18)", cursor: "pointer", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.78rem", transition: "all 0.2s", opacity: deleteId === project._id ? 0.5 : 1 }}
                      onMouseEnter={e => { if (deleteId !== project._id) { e.currentTarget.style.background = "var(--danger)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "var(--danger)"; }}}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "var(--danger)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.18)"; }}
                    >
                      <RiDeleteBin6Line size={13} /> Delete
                    </button>
                  </div>

                  {/* External links */}
                  {(project.githubLink || project.deploymentLink) && (
                    <div style={{ display: "flex", gap: 10, paddingTop: 6, borderTop: "1px solid var(--border)" }}>
                      {project.githubLink && (
                        <a href={project.githubLink} target="_blank" rel="noreferrer"
                          style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--text-muted)", fontSize: "0.78rem", textDecoration: "none", transition: "color 0.2s" }}
                          onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"}
                          onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
                        ><RiGithubLine size={13} /> GitHub</a>
                      )}
                      {project.deploymentLink && (
                        <a href={project.deploymentLink} target="_blank" rel="noreferrer"
                          style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--text-muted)", fontSize: "0.78rem", textDecoration: "none", transition: "color 0.2s" }}
                          onMouseEnter={e => e.currentTarget.style.color = "var(--success)"}
                          onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
                        ><RiExternalLinkLine size={13} /> Live</a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;