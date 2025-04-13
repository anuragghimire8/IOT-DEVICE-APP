import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const About = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const apiKey = "3cb76b1fc8e1de8a0f3d8739aaed3de5";
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${apiKey}&units=metric`
        );
        setWeatherData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching weather data:", err);
        setError("Failed to load weather data. Please try again later.");
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-blue-900 mb-4">
            Smart Football Playability System
          </h1>
          <p className="text-lg text-blue-700">
            Real-time weather intelligence powered by OpenWeatherMap API.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="bg-white shadow-xl rounded-xl p-8 mb-12"
        >
          <h2 className="text-3xl font-semibold text-blue-800 mb-6 text-center">
            Current Weather in London
          </h2>

          {loading ? (
            <p className="text-blue-600 text-center text-lg">Loading weather data...</p>
          ) : error ? (
            <p className="text-red-500 text-center text-lg">{error}</p>
          ) : weatherData ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-sm text-gray-500">Temperature</p>
                <p className="text-xl font-medium">{weatherData.main.temp}°C</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Humidity</p>
                <p className="text-xl font-medium">{weatherData.main.humidity}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Weather</p>
                <p className="text-xl font-medium capitalize">
                  {weatherData.weather[0].description}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Wind Speed</p>
                <p className="text-xl font-medium">{weatherData.wind.speed} m/s</p>
              </div>
            </div>
          ) : (
            <p className="text-blue-600 text-center text-lg">No data available.</p>
          )}

          {weatherData && (
            <p className="mt-6 text-sm text-gray-500 text-center">
              Last updated: {formatDate(weatherData.dt)}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="bg-white p-8 rounded-xl shadow-xl"
        >
          <h2 className="text-3xl font-semibold text-blue-800 mb-4">
            About Our Mission
          </h2>
          <p className="text-lg text-gray-700 mb-4">
            Our IoT-powered solution monitors environmental conditions like temperature,
            humidity, and air quality to ensure optimal and safe conditions for
            football matches.
          </p>
          <p className="text-lg text-gray-700">
            By delivering real-time alerts and analytics, we help teams, players,
            and event managers make data-informed decisions to maximize safety
            and performance on the field.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
