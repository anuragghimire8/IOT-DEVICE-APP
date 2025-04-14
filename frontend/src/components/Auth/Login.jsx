import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../../utils";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  const [loading, setLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginInfo.email || !loginInfo.password) {
      return handleError("All fields are required!");
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo),
      });

      const result = await response.json();

      if (result.success) {
        const user = result.user;

        localStorage.setItem("authToken", result.token);
        localStorage.setItem("user", JSON.stringify(user));
        setIsAuthenticated(true);

        // ✅ Welcome message using name
        handleSuccess(`Welcome, ${user.name}!`);

        setTimeout(() => navigate("/"), 1000);
      } else {
        handleError(result.message || "Login failed");
      }
    } catch (err) {
      handleError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="container px-4 mx-auto" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }}>
      <motion.div className="max-w-lg mx-auto bg-white dark:bg-gray-900 shadow-lg p-8 rounded-lg">
        <div className="text-center mb-6">
          <motion.h2 className="text-3xl md:text-4xl font-extrabold">
            Login
          </motion.h2>
        </div>

        <form onSubmit={handleLogin}>
          <motion.div className="mb-6">
            <label className="block mb-2 font-extrabold">Email</label>
            <input
              className="w-full p-4 bg-white dark:bg-gray-800 border-2 border-indigo-900 rounded"
              type="email"
              name="email"
              value={loginInfo.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
            />
          </motion.div>

          <motion.div className="mb-6">
            <label className="block mb-2 font-extrabold">Password</label>
            <input
              className="w-full p-4 bg-white dark:bg-gray-800 border-2 border-indigo-900 rounded"
              type="password"
              name="password"
              value={loginInfo.password}
              onChange={handleChange}
              placeholder="**********"
              required
            />
          </motion.div>

          <motion.button
            className={`w-full py-4 text-white font-bold bg-indigo-800 hover:bg-indigo-900 rounded ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>

          <p className="text-center font-extrabold mt-4">
            Don't have an account?{" "}
            <a href="/signup" className="text-red-500 hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </motion.div>
      <ToastContainer />
    </motion.div>
  );
};

export default Login;
