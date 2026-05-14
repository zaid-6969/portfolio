import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects, deleteProject, setSelectedProject } from "../store/slices/projectsSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import ProjectForm from "../components/ProjectForm";
import PreviewCustomizer from "../components/PreviewCustomizer";
import Loader from "../components/Loader";
import {
  RiDashboardLine, RiDeleteBin6Line, RiEdit2Line, RiEyeLine,
  RiGithubLine, RiExternalLinkLine, RiCodeLine, RiLayoutMasonryLine,
  RiAddLine, RiPaletteLine,
} from "react-icons/ri";
import { Link } from "react-router-dom";

const StatCard = ({ label, value, icon, color }) => (
  <div className="card" style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
    <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", color, flexShrink: 0 }}>
      {icon}
    </div>
    <div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 800 }}>{value}</div>
      <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 500 }}>{label}</div>
    </div>
  </div>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: projects, loading, selectedProject } = useSelector(s => s.projects);
  const { token } = useSelector(s => s.auth);
  const { config: formData } = useSelector(s => s.design);
  const [activeTab, setActiveTab] = useState("projects"); // projects | create
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { if (!token) navigate("/admin/login"); }, [token, navigate]);
  useEffect(() => { dispatch(fetchProjects()); }, [dispatch]);
  useEffect(() => { if (selectedProject) setActiveTab("create"); }, [selectedProject]);

  const handleDelete = async (id) => {
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

      {/* Dashboard content */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 24px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <RiDashboardLine style={{ color: "var(--accent)" }} size={22} />
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 800, margin: 0 }}>
                Dashboard
              </h1>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Manage your portfolio projects</p>
          </div>
          <button onClick={() => { dispatch(setSelectedProject(null)); setActiveTab("create"); }}
            className="btn-primary"
            style={{ padding: "10px 20px", display: "flex", alignItems: "center", gap: 8, fontSize: "0.9rem" }}>
            <RiAddLine size={18} /> New Project
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 40 }}>
          <StatCard label="Total Projects" value={projects.length} icon={<RiLayoutMasonryLine size={22}/>} color="var(--accent)" />
          <StatCard label="Technologies" value={allLangs.length} icon={<RiCodeLine size={22}/>} color="var(--success)" />
          <StatCard label="Categories" value={allTags.length} icon={<RiDashboardLine size={22}/>} color="var(--warning)" />
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 32, background: "var(--bg-card)", padding: 4, borderRadius: 12, width: "fit-content", border: "1px solid var(--border)" }}>
          {[["projects", <RiLayoutMasonryLine size={16}/>, "Projects"], ["create", <RiPaletteLine size={16}/>, selectedProject ? "Edit & Preview" : "Create & Preview"]].map(([tab, icon, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 18px", borderRadius: 8, border: "none",
                background: activeTab === tab ? "var(--accent)" : "transparent",
                color: activeTab === tab ? "#fff" : "var(--text-muted)",
                fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.875rem",
                cursor: "pointer", transition: "all 0.2s",
              }}>
              {icon} {label}
            </button>
          ))}
        </div>

        {/* Create/Edit Tab — Split view */}
        {activeTab === "create" && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            minHeight: "70vh",
          }}
            className="split-view"
          >
            {/* Left: Form */}
            <div className="card" style={{ padding: 28, overflow: "auto", maxHeight: "80vh" }}>
              <ProjectForm onSuccess={() => { dispatch(fetchProjects()); }} />
            </div>

            {/* Right: Live Preview */}
            <div className="card" style={{ overflow: "hidden", maxHeight: "80vh", display: "flex", flexDirection: "column" }}>
              <PreviewCustomizer formData={formData} />
            </div>

            <style>{`
              @media (max-width: 1024px) {
                .split-view { grid-template-columns: 1fr !important; }
              }
            `}</style>
          </div>
        )}

        {/* Projects list tab */}
        {activeTab === "projects" && (
          <>
            {loading ? <Loader /> : projects.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <RiLayoutMasonryLine size={56} style={{ color: "var(--text-muted)", marginBottom: 16, opacity: 0.4 }} />
                <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)", fontSize: "1.1rem", marginBottom: 8 }}>No projects yet</p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Click "New Project" to add your first one</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
                {projects.map((project, i) => (
                  <div key={project._id} className="card" style={{ overflow: "hidden", animation: `fadeIn 0.4s ease ${i * 0.06}s both` }}>
                    {/* Image */}
                    <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
                      <img src={project.image} alt={project.projectName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,13,26,0.7) 0%, transparent 60%)" }} />
                    </div>

                    <div style={{ padding: "18px 20px" }}>
                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, marginBottom: 8 }}>
                        {project.projectName}
                      </h3>
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.5, marginBottom: 14, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {project.description}
                      </p>

                      {project.languages?.length > 0 && (
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                          {project.languages.slice(0,4).map((l, j) => (
                            <span key={j} className="tag-pill">{l.trim()}</span>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <Link to={`/project/${project._id}`}
                          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 12px", borderRadius: 8, background: "rgba(99,102,241,0.1)", color: "var(--accent-light)", border: "1px solid rgba(99,102,241,0.2)", textDecoration: "none", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.8rem", transition: "all 0.2s" }}
                          onMouseEnter={e => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.color = "#fff"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "rgba(99,102,241,0.1)"; e.currentTarget.style.color = "var(--accent-light)"; }}
                        >
                          <RiEyeLine size={14} /> Preview
                        </Link>

                        <button onClick={() => { dispatch(setSelectedProject(project)); setActiveTab("create"); }}
                          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 12px", borderRadius: 8, background: "rgba(245,158,11,0.1)", color: "var(--warning)", border: "1px solid rgba(245,158,11,0.2)", cursor: "pointer", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.8rem", transition: "all 0.2s" }}
                          onMouseEnter={e => { e.currentTarget.style.background = "var(--warning)"; e.currentTarget.style.color = "#fff"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "rgba(245,158,11,0.1)"; e.currentTarget.style.color = "var(--warning)"; }}
                        >
                          <RiEdit2Line size={14} /> Edit
                        </button>

                        <button onClick={() => handleDelete(project._id)}
                          disabled={deleteId === project._id}
                          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 12px", borderRadius: 8, background: "rgba(239,68,68,0.1)", color: "var(--danger)", border: "1px solid rgba(239,68,68,0.2)", cursor: "pointer", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.8rem", transition: "all 0.2s", opacity: deleteId === project._id ? 0.6 : 1 }}
                          onMouseEnter={e => { if (deleteId !== project._id) { e.currentTarget.style.background = "var(--danger)"; e.currentTarget.style.color = "#fff"; }}}
                          onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.color = "var(--danger)"; }}
                        >
                          <RiDeleteBin6Line size={14} /> Delete
                        </button>
                      </div>

                      {/* Links */}
                      {(project.githubLink || project.deploymentLink) && (
                        <div style={{ display: "flex", gap: 8, marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
                          {project.githubLink && (
                            <a href={project.githubLink} target="_blank" rel="noreferrer"
                              style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--text-muted)", fontSize: "0.8rem", textDecoration: "none", transition: "color 0.2s" }}
                              onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"}
                              onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
                            >
                              <RiGithubLine size={14} /> GitHub
                            </a>
                          )}
                          {project.deploymentLink && (
                            <a href={project.deploymentLink} target="_blank" rel="noreferrer"
                              style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--text-muted)", fontSize: "0.8rem", textDecoration: "none", transition: "color 0.2s" }}
                              onMouseEnter={e => e.currentTarget.style.color = "var(--success)"}
                              onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
                            >
                              <RiExternalLinkLine size={14} /> Live
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;