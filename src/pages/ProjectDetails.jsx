import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProjectDetails = () => {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/v1/projects/${id}`
        );

        setProject(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-2xl font-bold">
        Loading...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="h-screen flex items-center justify-center text-2xl font-bold">
        Project Not Found
      </div>
    );
  }

  const design = project.designConfig;

  return (
    <div className="min-h-screen p-10 bg-gray-100">
      <div
        style={{
          backgroundColor: design.backgroundColor,
          color: design.textColor,
          borderRadius: design.borderRadius,
          boxShadow: design.boxShadow,
          border: design.border,
          padding: design.padding,
        }}
        className="max-w-5xl mx-auto"
      >
        <img
          src={project.image}
          alt="project"
          className="w-full h-[500px] object-cover rounded-xl"
        />

        <h1 className="text-4xl font-bold mt-6">
          {project.projectName}
        </h1>

        <p
          style={{
            fontSize: design.fontSize,
            textAlign: design.alignment,
          }}
          className="mt-5"
        >
          {project.description}
        </p>

        <div className="flex flex-wrap gap-3 mt-5">
          {project.languages.map((lang, index) => (
            <span
              key={index}
              className="bg-black text-white px-4 py-2 rounded-full"
            >
              {lang}
            </span>
          ))}
        </div>

        <div className="flex gap-5 mt-8">
          <a
            href={project.githubLink}
            target="_blank"
            rel="noreferrer"
            style={{
              backgroundColor: design.buttonColor,
              color: design.buttonTextColor,
            }}
            className="px-5 py-3 rounded-lg"
          >
            GitHub
          </a>

          <a
            href={project.deploymentLink}
            target="_blank"
            rel="noreferrer"
            className="bg-green-600 text-white px-5 py-3 rounded-lg"
          >
            Live Demo
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;