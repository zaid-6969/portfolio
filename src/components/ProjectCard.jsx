import { Link } from "react-router-dom";

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-all duration-300">

      <img
        src={project.image}
        alt="project"
        className="w-full h-56 object-cover"
      />

      <div className="p-5">

        <h2 className="text-2xl text-white font-bold">
          {project.projectName}
        </h2>

        <p className="text-slate-400 mt-3 line-clamp-3">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          {project.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-slate-800 text-white px-3 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link
          to={`/project/${project._id}`}
          className="inline-block mt-5 bg-blue-600 text-white px-5 py-3 rounded-lg"
        >
          View Project
        </Link>

      </div>
    </div>
  );
};

export default ProjectCard;