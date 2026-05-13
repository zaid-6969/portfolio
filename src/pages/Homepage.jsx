import { useState } from "react";

const projects = [
  {
    id: 1,
    title: "Aether Engine",
    description: "High-performance rendering core for decentralized spatial computing environments.",
    tags: ["Rust", "WASM"],
    status: "active",
    date: "Mar 2024",
    category: "Infrastructure",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80",
    accent: "#00f5d4",
  },
  {
    id: 2,
    title: "Null Sector",
    description: "Privacy-first identity layer utilizing zero-knowledge proofs for cross-chain auth.",
    tags: ["ZKP", "Solidity"],
    status: "archived",
    date: "Jan 2024",
    category: "Infrastructure",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80",
    accent: "#f72585",
  },
  {
    id: 3,
    title: "Synapse UI",
    description: "A generative design system that adapts interface density to neural load patterns.",
    tags: ["TypeScript", "React"],
    status: "active",
    date: "Dec 2023",
    category: "Design",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80",
    accent: "#7209b7",
  },
  {
    id: 4,
    title: "Core Nexus",
    description: "Distributed ledger infrastructure optimized for high-throughput byzantine consensus.",
    tags: ["Go", "gRPC"],
    status: "active",
    date: "Nov 2023",
    category: "Infrastructure",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80",
    accent: "#4cc9f0",
  },
  {
    id: 5,
    title: "Hyper Logic",
    description: "Custom hardware-level acceleration for recursive neural sequence modeling.",
    tags: ["C++", "CUDA"],
    status: "archived",
    date: "Oct 2023",
    category: "Research",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&q=80",
    accent: "#f77f00",
  },
  {
    id: 6,
    title: "Velocis Edge",
    description: "Latency-optimized content delivery protocol for real-time decentralized media.",
    tags: ["Zig", "SRP"],
    status: "active",
    date: "Sep 2023",
    category: "Infrastructure",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    accent: "#06d6a0",
  },
];

const navItems = [
  {
    label: "Overview",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "Projects",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M3 7h18M3 12h18M3 17h18" />
      </svg>
    ),
  },
  {
    label: "Analytics",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" d="M4 20V14M9 20V8M14 20v-6M19 20V4" />
      </svg>
    ),
  },
  {
    label: "Settings",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

const filters = ["All States", "Infrastructure", "Design", "Research"];

function ProjectCard({ project }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-xl overflow-hidden bg-[#0d0f16] cursor-pointer transition-all duration-300"
      style={{
        border: `1px solid ${hovered ? project.accent + "44" : "rgba(255,255,255,0.06)"}`,
        boxShadow: hovered ? `0 0 28px ${project.accent}18` : "none",
      }}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: hovered ? "scale(1.06)" : "scale(1)", opacity: 0.75 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f16] via-[#0d0f1655] to-transparent" />

        {/* Status */}
        <div className="absolute top-3 right-3">
          <span
            className="text-[9px] font-mono tracking-widest uppercase px-2.5 py-1 rounded"
            style={{
              color: project.status === "active" ? "#00f5d4" : "#6b7280",
              background:
                project.status === "active"
                  ? "rgba(0,245,212,0.12)"
                  : "rgba(107,114,128,0.12)",
              border: `1px solid ${
                project.status === "active"
                  ? "rgba(0,245,212,0.28)"
                  : "rgba(107,114,128,0.22)"
              }`,
            }}
          >
            {project.status}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-white mb-1.5 tracking-wide">
          {project.title}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-gray-400"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer row */}
        <div
          className="flex items-center justify-between pt-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="flex items-center gap-1.5">
            <svg
              className="w-3 h-3 text-gray-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            <span className="text-[10px] font-mono text-gray-600">{project.date}</span>
          </div>

          <button
            className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
            style={{
              border: `1px solid ${hovered ? project.accent + "55" : "rgba(255,255,255,0.1)"}`,
              background: hovered ? project.accent + "18" : "transparent",
            }}
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke={hovered ? project.accent : "#6b7280"}
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ active, setActive }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile header */}
      <div
        className="md:hidden flex items-center justify-between px-5 py-3.5"
        style={{ background: "#0b0d13", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <span className="text-xs font-mono font-bold tracking-widest text-cyan-400">
          NEURON_CORE
        </span>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav dropdown */}
      {mobileOpen && (
        <div
          className="md:hidden px-4 pb-4"
          style={{ background: "#0b0d13", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          {navItems.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => { setActive(label); setMobileOpen(false); }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-xs font-mono tracking-wider mt-1 transition-all"
              style={{
                color: active === label ? "#00f5d4" : "#6b7280",
                background: active === label ? "rgba(0,245,212,0.08)" : "transparent",
                border: active === label ? "1px solid rgba(0,245,212,0.18)" : "1px solid transparent",
              }}
            >
              {icon} {label}
            </button>
          ))}
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col w-52 shrink-0 min-h-screen pt-7 px-3"
        style={{ background: "#0b0d13", borderRight: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="px-3 mb-9">
          <span className="text-xs font-mono font-bold tracking-widest text-cyan-400">
            NEURON_CORE
          </span>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => setActive(label)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono tracking-wider transition-all text-left"
              style={{
                color: active === label ? "#00f5d4" : "#6b7280",
                background: active === label ? "rgba(0,245,212,0.08)" : "transparent",
                border: active === label ? "1px solid rgba(0,245,212,0.18)" : "1px solid transparent",
              }}
            >
              {icon} {label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default function Homepage() {
  const [activeNav, setActiveNav] = useState("Projects");
  const [activeFilter, setActiveFilter] = useState("All States");
  const [search, setSearch] = useState("");

  const filtered = projects.filter((p) => {
    const matchCat =
      activeFilter === "All States" || p.category === activeFilter;
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div
      className="flex flex-col md:flex-row min-h-screen text-white"
      style={{ background: "#080a10", fontFamily: "'Inter', sans-serif" }}
    >
      <Sidebar active={activeNav} setActive={setActiveNav} />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Desktop top nav */}
        <header
          className="hidden md:flex items-center justify-between px-8 py-4 sticky top-0 z-10 backdrop-blur-md"
          style={{
            background: "rgba(8,10,16,0.85)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div className="flex items-center gap-2 text-xs font-mono">
            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M3 12h18M12 5l7 7-7 7" />
            </svg>
            <span className="text-gray-600">ARCHIVE</span>
            <span className="text-gray-700 mx-0.5">/</span>
            <span className="text-gray-400">PROJECTS</span>
          </div>

          <div className="flex items-center gap-3">
            <button className="text-xs font-mono text-gray-500 hover:text-gray-300 transition-colors tracking-wider">
              Documentation
            </button>
            <button
              className="text-xs font-mono px-4 py-1.5 rounded-lg tracking-wider transition-all hover:bg-cyan-400/10"
              style={{ border: "1px solid rgba(0,245,212,0.35)", color: "#00f5d4" }}
            >
              Contact
            </button>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 px-4 md:px-8 py-7 md:py-10">
          {/* Page heading */}
          <div className="mb-7 md:mb-9">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2.5 tracking-tight">
              Project Archive
            </h1>
            <p className="text-sm text-gray-500 max-w-lg leading-relaxed">
              A comprehensive repository of our computational experiments, architectural
              prototypes, and engineering breakthroughs. Exploring the boundaries of neural
              interfaces and decentralized cores.
            </p>
          </div>

          {/* Filters + Search */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-7 md:mb-9">
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className="flex items-center gap-1.5 text-xs font-mono px-3.5 py-1.5 rounded-lg tracking-wide whitespace-nowrap transition-all"
                  style={{
                    color: activeFilter === f ? "#00f5d4" : "#6b7280",
                    background:
                      activeFilter === f ? "rgba(0,245,212,0.08)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${
                      activeFilter === f
                        ? "rgba(0,245,212,0.28)"
                        : "rgba(255,255,255,0.07)"
                    }`,
                  }}
                >
                  {f === "Infrastructure" && (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" d="M3 12h18M12 5l7 7-7 7" />
                    </svg>
                  )}
                  {f}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative sm:ml-auto">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search archive..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-52 pl-9 pr-4 py-1.5 rounded-lg text-xs font-mono text-gray-400 placeholder-gray-600 outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(0,245,212,0.3)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(255,255,255,0.08)")
                }
              />
            </div>
          </div>

          {/* Cards grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
              {filtered.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-28 text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4 text-gray-600"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <p className="text-sm font-mono text-gray-600 tracking-widest">NO RESULTS FOUND</p>
              <p className="text-xs text-gray-700 mt-1">Try a different search or filter</p>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer
          className="px-4 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <span className="text-[10px] font-mono text-gray-700 tracking-widest">
            NEURON_CORE © 2024
          </span>
          <span className="text-[10px] font-mono text-gray-700">
            {filtered.length} / {projects.length} PROJECTS
          </span>
        </footer>
      </div>
    </div>
  );
}