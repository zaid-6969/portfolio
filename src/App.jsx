import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

import Home from "./pages/Home";
import ProjectDetails from "./pages/ProjectDetails";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import CreateProject from "./pages/CreateProject";
import CustomizePage from "./pages/CustomizePage";

function App() {
  const { mode } = useSelector((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/project/:id" element={<ProjectDetails />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/create" element={<CreateProject />} />
      <Route path="/admin/customize" element={<CustomizePage />} />
    </Routes>
  );
}

export default App;