import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../../utils";

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
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
    const { email, password } = loginInfo;

    if (!email || !password) {
      return handleError("All fields are required!");
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo),
      });

      const result = await response.json();

      if (result.success) {
        // Store the token and user data
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));

        setIsAuthenticated(true); // Update state to reflect authentication
        handleSuccess(result.message);

        setTimeout(() => {
          navigate("/"); // Redirect to Hero Page ("/") after login
        }, 1000);
      } else {
        handleError(result.message);
      }
    } catch (err) {
      handleError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container px-4 mx-auto"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-lg mx-auto bg-white dark:bg-gray-900 shadow-lg p-8 rounded-lg"
      >
        <div className="text-center mb-6">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl md:text-4xl font-extrabold"
          >
            Login
          </motion.h2>
        </div>

        <form onSubmit={handleLogin}>
          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }} className="mb-6">
            <label className="block mb-2 font-extrabold">Email</label>
            <input
              className="inline-block w-full p-4 leading-6 text-lg font-extrabold bg-white dark:bg-gray-800 shadow border-2 border-indigo-900 rounded focus:ring-2 focus:ring-indigo-600 transition-all"
              type="email"
              name="email"
              value={loginInfo.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }} className="mb-6">
            <label className="block mb-2 font-extrabold">Password</label>
            <input
              className="inline-block w-full p-4 leading-6 text-lg font-extrabold bg-white dark:bg-gray-800 shadow border-2 border-indigo-900 rounded focus:ring-2 focus:ring-indigo-600 transition-all"
              type="password"
              name="password"
              value={loginInfo.password}
              onChange={handleChange}
              placeholder="**********"
              required
            />
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`inline-block w-full py-4 px-6 mb-6 text-center text-lg leading-6 text-white font-extrabold bg-indigo-800 hover:bg-indigo-900 border-3 border-indigo-900 shadow-lg rounded transition-all ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>

          <p className="text-center font-extrabold">
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
