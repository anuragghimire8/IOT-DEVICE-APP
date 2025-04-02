import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import hero from "../../assets/hero.jpg"; // Ensure the path is correct

const Hero = () => {
  const [sensorData, setSensorData] = useState([]);
  const [gameStatus, setGameStatus] = useState("Loading...");

  // Function to determine the football game status based on temperature, humidity, and air quality
// Function to determine the football game status based on temperature, humidity, and air quality
const determineGameStatus = (temperature, humidity, air_quality) => {
  // Check for extreme temperature or high humidity
  if (temperature < 0 || temperature > 35) {
    return "Game Forfeited (Extreme Temperature)";
  } else if (humidity > 90) {
    return "Game Cancelled (High Humidity)";
  } else if (humidity > 75) {
    return "Game Postponed (Unfavorable Conditions)";
  } else if (air_quality > 100) { // Air quality condition
    return "Game Cancelled (Poor Air Quality)";
  }
  
  // If none of the conditions are met, the game is allowed
  return "Game Allowed";
};


  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/sensor-data");
      setSensorData(response.data);
  
      // If there is sensor data, calculate the game status based on the first data point
      if (response.data.length > 0) {
        const { temperature, humidity, air_quality } = response.data[0];
        console.log("Temperature:", temperature);
        console.log("Humidity:", humidity);
        console.log("Air Quality:", air_quality); // Log the air quality to check the value
  
        setGameStatus(determineGameStatus(temperature, humidity, air_quality));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setGameStatus("Error fetching data");
    }
  };
  

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="py-12 sm:py-24 bg-light dark:bg-dark text-dark dark:text-light">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Hero Section Content */}
        <motion.div
          className="mb-8 flex justify-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="relative rounded-full px-4 py-1.5 text-sm leading-6 text-secondary dark:text-primary ring-1 ring-inset ring-gray-900/10 hover:ring-gray-900/20">
            <span className="hidden md:inline">Revolutionizing Football Analytics.</span>
            <a href="#" target="_blank" className="font-semibold text-primary dark:text-secondary hover:text-secondary dark:hover:text-primary transition-colors duration-200">
              <span className="absolute inset-0"></span> Learn More <span>→</span>
            </a>
          </p>
        </motion.div>

        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold tracking-tight text-dark dark:text-light sm:text-6xl">
            Smart Football Playability Checker
          </h1>
          <p className="mt-6 text-lg leading-8 text-secondary dark:text-primary">
            Our cutting-edge IoT device monitors temperature, wind speed, and humidity to determine if conditions are optimal for a football match. Stay ahead of the game with real-time weather analysis.
          </p>

          {/* Game Status */}
          <div className="mt-10">
            <h2 className={gameStatus.includes("Allowed") ? "status-allowed" : "status-not-allowed"}>
              {gameStatus.includes("Allowed") ? "✅ You can play football!" : "❌ You cannot play football!"}
            </h2>
          </div>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <motion.a href="#" className="rounded-md bg-primary dark:bg-secondary px-3.5 py-2.5 text-sm font-semibold text-light dark:text-dark shadow-sm hover:bg-secondary dark:hover:bg-primary transition duration-300">
              Try the Demo
            </motion.a>
            <motion.a href="#" className="text-sm font-semibold leading-6 text-dark dark:text-light hover:text-secondary dark:hover:text-primary transition-colors duration-200">
              Learn More <span>→</span>
            </motion.a>
          </div>
        </motion.div>

        {/* Table Display for Sensor Data */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-dark dark:text-light">Recent Sensor Data</h2>
          <table className="min-w-full mt-6 table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Temperature (°C)</th>
                <th className="px-4 py-2 border">Humidity (%)</th>
                <th className="px-4 py-2 border">Air Quality</th> {/* Added Air Quality column */}
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
                    <td className="px-4 py-2 border">{data.air_quality}</td> {/* Display Air Quality */}
                    <td className="px-4 py-2 border">{determineGameStatus(data.temperature, data.humidity, data.air_quality)}</td>
                    <td className="px-4 py-2 border">{new Date(data.timestamp).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-2 text-center">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Image Section */}
        <div className="mt-10 flow-root sm:mt-20">
          <motion.div className="-m-2 rounded-xl bg-secondary/5 dark:bg-primary/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            whileHover={{ scale: 1.02 }}>
            <img src={hero} width="2432" height="1442" className="rounded-md shadow-2xl ring-1 ring-gray-900/10" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
