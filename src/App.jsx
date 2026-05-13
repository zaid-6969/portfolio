import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ProjectDetails from "./pages/ProjectDetails";
import AdminLogin from "./pages/AdminLogin"
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/project/:id" element={<ProjectDetails />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;