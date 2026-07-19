import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menu = [];

  if (user?.role === "admin") {
    menu.push(
      { name: "Dashboard", path: "/admin/dashboard" },
      { name: "Users", path: "/admin/users" },
      { name: "Stores", path: "/admin/stores" }
    );
  }

  if (user?.role === "normal_user") {
    menu.push(
      { name: "Home", path: "/" },
      { name: "Stores", path: "/stores" },
      { name: "Profile", path: "/profile" }
    );
  }

  if (user?.role === "store_owner") {
    menu.push(
      { name: "Dashboard", path: "/owner/dashboard" },
      { name: "Raters", path: "/owner/raters" },
      { name: "Profile", path: "/profile" }
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white">

        <div className="text-2xl font-bold p-6 border-b border-gray-700">
          Store Rating
        </div>

        <nav className="flex flex-col mt-4">

          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-6 py-3 hover:bg-gray-700 transition ${
                location.pathname === item.path
                  ? "bg-gray-700"
                  : ""
              }`}
            >
              {item.name}
            </Link>
          ))}

        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="bg-white shadow px-8 py-4 flex justify-between items-center">

          <div>
            <h2 className="text-xl font-semibold">
              Welcome {user?.name}
            </h2>

            <p className="text-gray-500">
              {user?.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded"
          >
            Logout
          </button>

        </header>

        <main className="p-8">
          {children}
        </main>

      </div>

    </div>
  );
};

export default DashboardLayout;