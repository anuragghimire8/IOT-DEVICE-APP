import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/website/logo.png";
import { FaUserPlus, FaCaretDown, FaSignOutAlt } from "react-icons/fa";
import DarkMode from "./DarkMode";
import { handleSuccess } from "../../utils";
import { useAuth } from "../context/Authcontext";

const Menu = [
  { id: 1, name: "Home", link: "/" },
  { id: 2, name: "About", link: "/about" },
];

const DropdownLinks = [
  { name: "Temperature", link: "/temperature" },
  { name: "Humidity", link: "/humidity" },
  { name: "AirQuality", link: "/air-quality" },
  { name: "Weather", link: "/weather" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        await fetch("http://localhost:5000/auth/signout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.error("Logout request failed:", err);
      }
    }

    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    handleSuccess("Logged out successfully!");
    navigate("/login");
  };

  const getUserName = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user).name : "";
  };

  return (
    <div className="shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200">
      <div className="container py-3 sm:py-0">
        <div className="flex justify-between items-center">
          <Link to="/" className="font-bold text-2xl sm:text-3xl flex gap-2">
            <img src={Logo} alt="Logo" className="w-10" />
            FFEMS-RAMR
          </Link>

          <div className="flex justify-between items-center gap-4">
            <DarkMode />

            <ul className="hidden sm:flex items-center gap-4">
              {Menu.map((menu) => (
                <li key={menu.id}>
                  <Link
                    to={menu.link}
                    className="inline-block py-4 px-4 hover:text-primary duration-200"
                  >
                    {menu.name}
                  </Link>
                </li>
              ))}

              <li className="group relative cursor-pointer">
                <span className="flex h-[72px] items-center gap-[2px]">
                  Quick Links
                  <FaCaretDown className="transition-all duration-200 group-hover:rotate-180" />
                </span>
                <div className="absolute -left-9 z-[9999] hidden w-[150px] rounded-md bg-white p-2 text-black group-hover:block">
                  <ul className="space-y-3">
                    {DropdownLinks.map((data) => (
                      <li key={data.name}>
                        <Link
                          className="inline-block w-full rounded-md p-2 hover:bg-primary/20"
                          to={data.link}
                        >
                          {data.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </ul>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-md font-semibold text-indigo-600 dark:text-indigo-300 hidden sm:block">
                   {getUserName()}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-1.5 rounded-full duration-200 shadow-md hover:scale-105"
                >
                  Logout
                  <FaSignOutAlt className="text-lg" />
                </button>
              </div>
            ) : (
              <Link
                to="/signup"
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold px-4 py-1.5 rounded-full shadow-md duration-200 hover:scale-105"
              >
                Sign Up
                <FaUserPlus className="text-lg" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
