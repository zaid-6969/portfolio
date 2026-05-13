import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      const { data } = await API.post("/auth/login", formData);

      localStorage.setItem("token", data.token);

      navigate("/admin/dashboard");
    } catch (error) {
      console.log(error);
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-950">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-10 rounded-2xl w-full max-w-md"
      >
        <h1 className="text-3xl text-white font-bold mb-8 text-center">
          Admin Login
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          onChange={handleChange}
          className="w-full p-4 rounded-lg mb-4"
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          onChange={handleChange}
          className="w-full p-4 rounded-lg mb-4"
        />

        <button className="w-full bg-blue-600 text-white py-4 rounded-lg">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;