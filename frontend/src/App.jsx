import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Footer from "./components/Footer/Footer";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";

import AOS from "aos";
import "aos/dist/aos.css";
import TemperaturePage from "./components/Pages/TemperaturePage";
import HumidityPage from "./components/Pages/HumidityPage";
import AirQualityPage from "./components/Pages/AirQualityPage";
import About from "./components/About/About";

const App = () => {
  // ✅ Initialize auth state from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("authToken");
  });

  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
        <Navbar />
        <Routes>
          {/* Ensure Hero page is only accessible after login */}
          <Route path="/" element={isAuthenticated ? <Hero /> : <Navigate to="/login" />} />
          
          {/* Auth Pages */}
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route path="/temperature" element={<PrivateRoute element={<TemperaturePage />} />} />
          <Route path="/humidity" element={<PrivateRoute element={<HumidityPage />} />} />
          <Route path="/air-quality" element={<PrivateRoute element={<AirQualityPage />} />} />

          {/* Public Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<div>Contact Page</div>} />

          {/* 404 Page */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
