import { useEffect, useState } from "react";
import API from "../services/api";

import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";

const Home = () => {
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const { data } = await API.get("/projects");
      setProjects(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Home;