import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">
        Portfolio CMS
      </Link>

      <Link
        to="/admin/login"
        className="bg-blue-600 px-4 py-2 rounded-lg"
      >
        Admin Login
      </Link>
    </div>
  );
};

export default Navbar;