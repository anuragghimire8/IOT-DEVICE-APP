import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import hero from "../../assets/hero.jpg";
import MessiHappy from "../../assets/messihappy.png";
import RonaldoSad from "../../assets/ronaldosad.png";

const Hero = () => {
  const [sensorData, setSensorData] = useState([]);
  const [gameStatus, setGameStatus] = useState("Loading...");
  const [userName, setUserName] = useState("");

  const determineGameStatus = (temperature, humidity, air_quality) => {
    if (temperature < 0 || temperature > 35) {
      return "Game Forfeited (Extreme Temperature)";
    } else if (humidity > 90) {
      return "Game Cancelled (High Humidity)";
    } else if (humidity > 75) {
      return "Game Postponed (Unfavorable Conditions)";
    } else if (air_quality > 100) {
      return "Game Cancelled (Poor Air Quality)";
    }
    return "Game Allowed";
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5001/sensor-data");
      setSensorData(response.data);

      if (response.data.length > 0) {
        const { temperature, humidity, air_quality } = response.data[0];
        setGameStatus(determineGameStatus(temperature, humidity, air_quality));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setGameStatus("Error fetching data");
    }
  };

  useEffect(() => {
    // Fetch user's name from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserName(parsedUser.name);
    }

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-16 sm:py-24 bg-light dark:bg-dark text-dark dark:text-light">
      <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
        {/* 👋 Animated Welcome */}
        {userName && (
          <motion.h3
            className="text-xl sm:text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            👋 Welcome back, {userName}!
          </motion.h3>
        )}

        <motion.h1
          className="text-5xl font-bold tracking-tight text-dark dark:text-light sm:text-6xl"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Your Result is Here
        </motion.h1>

        <motion.h2
          className={`mt-8 text-3xl font-bold ${
            gameStatus.includes("Allowed") ? "text-green-600" : "text-red-600"
          }`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.7, type: "spring", bounce: 0.4 }}
        >
          {gameStatus.includes("Allowed")
            ? "✅ You can play football!"
            : "❌ You cannot play football!"}
        </motion.h2>

        <motion.img
          src={gameStatus.includes("Allowed") ? MessiHappy : RonaldoSad}
          alt={gameStatus.includes("Allowed") ? "Messi Happy" : "Ronaldo Sad"}
          className="w-72 h-auto mx-auto mt-10 rounded-xl shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        />
      </div>

      {/* Table Display for Sensor Data */}
      <div className="mt-20 px-6">
        <h2 className="text-xl font-bold text-dark dark:text-light">Recent Sensor Data</h2>
        <table className="min-w-full mt-6 table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Temperature (°C)</th>
              <th className="px-4 py-2 border">Humidity (%)</th>
              <th className="px-4 py-2 border">Air Quality</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {sensorData.length > 0 ? (
              sensorData.map((data) => (
                <tr key={data._id}>
                  <td className="px-4 py-2 border">{data.temperature}</td>
                  <td className="px-4 py-2 border">{data.humidity}</td>
                  <td className="px-4 py-2 border">{data.air_quality}</td>
                  <td className="px-4 py-2 border">
                    {determineGameStatus(data.temperature, data.humidity, data.air_quality)}
                  </td>
                  <td className="px-4 py-2 border">{new Date(data.timestamp).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-2 text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Hero Image */}
      <div className="mt-20 flow-root sm:mt-24 px-6">
        <motion.div
          className="-m-2 rounded-xl bg-secondary/5 dark:bg-primary/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          whileHover={{ scale: 1.02 }}
        >
          <img
            src={hero}
            width="2432"
            height="1442"
            className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
            alt="Hero"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
