import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegisterInfo((prevInfo) => ({
      ...prevInfo,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, phone, location, password, confirmPassword, agreedToTerms } = registerInfo;

    if (!name || !email || !phone || !location || !password || !confirmPassword) {
      return setError("All fields are required.");
    }

    if (name.length < 3) {
      return setError("Name must be at least 3 characters long.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setError("Please enter a valid email address.");
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      return setError("Phone number must be between 10-15 digits.");
    }

    if (location.length < 2) {
      return setError("Location must be at least 2 characters long.");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters long.");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    if (!agreedToTerms) {
      return setError("You must agree to the terms and conditions.");
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          location,
          password,
          confirmPassword
        }),
      });
      

      const result = await response.json();
      if (result.success) {
        navigate("/login");
      } else {
        if (result.errors && result.errors.length > 0) {
          setError(result.errors[0]);
        } else {
          setError(result.message || "Registration failed.");
        }
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="container px-4 mx-auto">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }} className="max-w-lg mx-auto bg-white dark:bg-gray-900 shadow-lg p-8 rounded-lg">
        <div className="text-center mb-6">
          <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="text-3xl md:text-4xl font-extrabold">
            IoT Project Registration
          </motion.h2>
        </div>

        {error && <p className="text-red-500 font-bold text-center">{error}</p>}

        <form onSubmit={handleRegister}>
          {["name", "email", "phone", "location"].map((field, index) => (
            <motion.div key={index} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }} className="mb-4">
              <label className="block mb-2 font-extrabold capitalize">
                {field === "name" ? "Full Name" : field.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                className="w-full p-4 text-lg font-extrabold bg-white dark:bg-gray-800 shadow border-2 border-gray-700 rounded focus:ring-2 focus:ring-indigo-600 transition-all"
                type={field === "email" ? "email" : "text"}
                name={field}
                pattern={field === "phone" ? "[0-9]{10,15}" : undefined}
                minLength={field === "name" ? 3 : field === "location" ? 2 : undefined}
                placeholder={field === "phone" ? "Enter 10-15 digit number" : `Enter your ${field}`}
                value={registerInfo[field]}
                onChange={handleChange}
                required
              />
            </motion.div>
          ))}

          {["password", "confirmPassword"].map((field, index) => (
            <motion.div key={index} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }} className="mb-4">
              <label className="block mb-2 font-extrabold">{field === "confirmPassword" ? "Confirm Password" : "Password"}</label>
              <input
                className="w-full p-4 text-lg font-extrabold bg-white dark:bg-gray-800 shadow border-2 border-gray-700 rounded focus:ring-2 focus:ring-indigo-600 transition-all"
                type="password"
                name={field}
                placeholder={field === "confirmPassword" ? "Confirm your password" : "Enter your password"}
                value={registerInfo[field]}
                onChange={handleChange}
              />
            </motion.div>
          ))}

          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }} className="flex items-center mb-6">
            <input type="checkbox" name="agreedToTerms" checked={registerInfo.agreedToTerms} onChange={handleChange} className="mr-2" />
            <span className="font-extrabold text-gray-700 dark:text-gray-300">
              I agree to the <a href="#" className="text-indigo-600 hover:underline">terms & conditions</a>
            </span>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full py-4 text-lg font-extrabold text-white bg-indigo-800 hover:bg-indigo-900 shadow-lg rounded transition-all duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </motion.button>

          <p className="text-center font-extrabold mt-4">
            Already have an account? <a className="text-red-500 hover:underline" href="/login">Sign in</a>
          </p>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Signup;