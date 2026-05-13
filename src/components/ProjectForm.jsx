import { useState } from "react";
import API from "../services/api";

import PreviewCustomizer from "./PreviewCustomizer";

const ProjectForm = ({ fetchProjects }) => {
  const [image, setImage] = useState(null);

  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    githubLink: "",
    deploymentLink: "",
    languages: "",
    tags: "",
  });

  const [designConfig, setDesignConfig] = useState({
    backgroundColor: "#ffffff",
    textColor: "#000000",
    fontSize: "18px",
    borderRadius: "20px",
    boxShadow: "0px 5px 20px rgba(0,0,0,0.2)",
    border: "none",
    padding: "20px",
    buttonColor: "#000000",
    buttonTextColor: "#ffffff",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("projectName", formData.projectName);
      data.append("description", formData.description);
      data.append("githubLink", formData.githubLink);
      data.append("deploymentLink", formData.deploymentLink);

      data.append(
        "languages",
        JSON.stringify(formData.languages.split(","))
      );

      data.append(
        "tags",
        JSON.stringify(formData.tags.split(","))
      );

      data.append(
        "designConfig",
        JSON.stringify(designConfig)
      );

      data.append("image", image);

      await API.post("/projects", data);

      alert("Project Created Successfully");

      fetchProjects();

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* LEFT SIDE FORM */}

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-8 rounded-2xl"
      >
        <h1 className="text-3xl text-white font-bold mb-8">
          Create Project
        </h1>

        <div className="space-y-5">

          <input
            type="text"
            name="projectName"
            placeholder="Project Name"
            onChange={handleChange}
            className="w-full p-4 rounded-lg"
          />

          <textarea
            name="description"
            placeholder="Project Description"
            onChange={handleChange}
            className="w-full p-4 rounded-lg h-40"
          />

          <input
            type="text"
            name="githubLink"
            placeholder="GitHub Link"
            onChange={handleChange}
            className="w-full p-4 rounded-lg"
          />

          <input
            type="text"
            name="deploymentLink"
            placeholder="Deployment Link"
            onChange={handleChange}
            className="w-full p-4 rounded-lg"
          />

          <input
            type="text"
            name="languages"
            placeholder="React, Node, MongoDB"
            onChange={handleChange}
            className="w-full p-4 rounded-lg"
          />

          <input
            type="text"
            name="tags"
            placeholder="FullStack, MERN"
            onChange={handleChange}
            className="w-full p-4 rounded-lg"
          />

          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full p-4 bg-white rounded-lg"
          />

          <button className="w-full bg-blue-600 text-white py-4 rounded-xl">
            Create Project
          </button>
        </div>
      </form>

      {/* RIGHT SIDE CUSTOMIZER */}

      <PreviewCustomizer
        designConfig={designConfig}
        setDesignConfig={setDesignConfig}
      />
    </div>
  );
};

export default ProjectForm;