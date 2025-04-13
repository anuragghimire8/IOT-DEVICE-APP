import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/website/logo.png";
import { FaUserPlus, FaCaretDown, FaSignOutAlt } from "react-icons/fa";
import DarkMode from "./DarkMode";
import { handleSuccess } from "../../utils";

const Menu = [
  { id: 1, name: "Home", link: "/" },
  { id: 2, name: "About", link: "/about" },
];

const DropdownLinks = [
  { name: "Temperature", link: "/temperature" },
  { name: "Humidity", link: "/humidity" },
  { name: "AirQuality", link: "/air-quality" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check auth state on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

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

  return (
    <div className="shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200">
      <div className="container py-3 sm:py-0">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="font-bold text-2xl sm:text-3xl flex gap-2">
            <img src={Logo} alt="Logo" className="w-10" />
            FFEMS-RAMR
          </Link>

          {/* Menu Items */}
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

              {/* Dropdown */}
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
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 duration-200 text-white py-1 px-4 rounded-full flex items-center gap-2"
              >
                Logout
                <FaSignOutAlt className="text-xl" />
              </button>
            ) : (
              <Link
                to="/signup"
                className="bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 text-white py-1 px-4 rounded-full flex items-center gap-3"
              >
                Sign Up
                <FaUserPlus className="text-xl text-white drop-shadow-sm cursor-pointer" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
