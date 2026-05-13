import { useEffect, useState } from "react";

import API from "../services/api";

import ProjectForm from "../components/ProjectForm";
import Loader from "../components/Loader";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const { data } = await API.get("/projects");

      setProjects(data);

      setLoading(false);

    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const deleteProject = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete?"
      );

      if (!confirmDelete) return;

      await API.delete(`/projects/${id}`);

      fetchProjects();

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 p-8">

      {/* CREATE PROJECT */}

      <ProjectForm fetchProjects={fetchProjects} />

      {/* PROJECT LIST */}

      <div className="mt-16">

        <h1 className="text-4xl text-white font-bold mb-10">
          All Projects
        </h1>

        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {projects.map((project) => (

              <div
                key={project._id}
                className="bg-slate-900 rounded-2xl overflow-hidden"
              >
                <img
                  src={project.image}
                  alt="project"
                  className="w-full h-56 object-cover"
                />

                <div className="p-5">

                  <h2 className="text-white text-2xl font-bold">
                    {project.projectName}
                  </h2>

                  <p className="text-slate-400 mt-3 line-clamp-3">
                    {project.description}
                  </p>

                  <div className="flex gap-3 mt-5">

                    <button
                      className="bg-yellow-500 text-white px-5 py-2 rounded-lg"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteProject(project._id)
                      }
                      className="bg-red-600 text-white px-5 py-2 rounded-lg"
                    >
                      Delete
                    </button>

                  </div>

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