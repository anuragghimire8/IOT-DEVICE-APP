import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const About = () => {
  // State to store weather data
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch weather data for London from OpenWeatherMap API
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // Replace YOUR_API_KEY with your actual OpenWeatherMap API key
        const apiKey = "YOUR_API_KEY"; // Put your API key here
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${apiKey}&units=metric`
        );
        setWeatherData(response.data);
        setLoading(false);
      } catch (err) {
        // Log the error to the console for more details
        console.error("Error fetching weather data:", err);
        if (err.response) {
          // The server responded with a status code other than 2xx
          setError(`Error: ${err.response.status} - ${err.response.statusText}`);
        } else if (err.request) {
          // No response received from the server
          setError("Error: No response from the server.");
        } else {
          // Something went wrong while setting up the request
          setError(`Error: ${err.message}`);
        }
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Revolutionizing Football Analytics
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Bringing cutting-edge IoT technology to optimize football playability.
          </p>
        </motion.div>

        {/* Weather Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="bg-white p-8 rounded-lg shadow-lg mb-16"
        >
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Current Weather in London</h2>
          {loading ? (
            <p className="text-lg text-gray-600">Loading weather data...</p>
          ) : error ? (
            <p className="text-lg text-red-500">{error}</p>
          ) : weatherData ? (
            <div className="text-lg text-gray-700">
              <p className="mb-2">
                <strong>Temperature:</strong> {weatherData.main.temp}°C
              </p>
              <p className="mb-2">
                <strong>Humidity:</strong> {weatherData.main.humidity}%
              </p>
              <p className="mb-2">
                <strong>Weather:</strong> {weatherData.weather[0].description}
              </p>
              <p className="mb-2">
                <strong>Wind Speed:</strong> {weatherData.wind.speed} m/s
              </p>
            </div>
          ) : (
            <p className="text-lg text-gray-600">Weather data not available</p>
          )}
        </motion.div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="bg-white p-8 rounded-lg shadow-lg"
        >
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">
            About Our Project
          </h2>
          <p className="text-lg text-gray-700 mb-4">
            Our IoT device monitors real-time environmental conditions such as
            temperature, air quality, and humidity, providing insights to ensure
            the optimal conditions for football matches. We aim to enhance player
            safety and performance by making sure the environment is suitable for
            physical activity.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            With data-driven decisions, our system can automatically suggest
            whether a game should proceed based on these metrics, helping teams
            and organizers make informed choices to avoid hazardous conditions.
          </p>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12"
        >
          {/* Feature 1 */}
          <div className="bg-blue-50 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Real-Time Monitoring
            </h3>
            <p className="text-lg text-gray-600">
              Monitor the live weather conditions and environmental data in real-time to make data-driven decisions for scheduling football matches.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-blue-50 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Smart Playability Checker
            </h3>
            <p className="text-lg text-gray-600">
              Our device checks air quality, temperature, and humidity to determine if conditions are suitable for a safe football match.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-blue-50 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Data-Driven Game Decisions
            </h3>
            <p className="text-lg text-gray-600">
              Based on the collected data, the system suggests whether a match should be canceled or rescheduled to avoid unsafe conditions.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-blue-50 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Enhance Player Safety
            </h3>
            <p className="text-lg text-gray-600">
              By integrating real-time weather data, players are assured that they will always compete in the best possible conditions for their health and performance.
            </p>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mt-16"
        >
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            Try Our Demo Today!
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Experience our smart football playability checker in action. See how it can help optimize football matches and player safety.
          </p>
          <a
            href="/demo"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 transition duration-300"
          >
            Try the Demo
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
