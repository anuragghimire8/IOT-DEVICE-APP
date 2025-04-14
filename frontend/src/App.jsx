import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./components/context/Authcontext";

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
import WeatherPage from "./components/Pages/WeatherPage";

const App = () => {
  const { isAuthenticated } = useAuth();

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
    return isAuthenticated ? element : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
        <Navbar />
        <Routes>
          {/* Hero page is now protected */}
          <Route path="/" element={<PrivateRoute element={<Hero />} />} />

          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route path="/temperature" element={<PrivateRoute element={<TemperaturePage />} />} />
          <Route path="/humidity" element={<PrivateRoute element={<HumidityPage />} />} />
          <Route path="/air-quality" element={<PrivateRoute element={<AirQualityPage />} />} />
          <Route path="/weather" element={<PrivateRoute element={<WeatherPage />} />} />

          {/* Public Fallback */}
          <Route path="/contact" element={<div>Contact Page</div>} />
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
