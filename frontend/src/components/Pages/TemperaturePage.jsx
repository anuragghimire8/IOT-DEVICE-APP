import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const TemperaturePage = () => {
  const [temperatureData, setTemperatureData] = useState([]);

  useEffect(() => {
    const fetchTemperatureData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/sensor-data");
        const filteredData = response.data.map(({ temperature, timestamp }) => ({
          temperature,
          timestamp,
        }));
        setTemperatureData(filteredData);
      } catch (error) {
        console.error("Error fetching temperature data:", error);
      }
    };

    fetchTemperatureData();
    const interval = setInterval(fetchTemperatureData, 5000);
    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: temperatureData.map((data) => new Date(data.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: "Temperature (°C)",
        data: temperatureData.map((data) => data.temperature),
        fill: false,
        borderColor: "#ff6384",
        tension: 0.4,
      },
    ],
  };

  return (
    <motion.div className="p-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Temperature Data</h2>

      <motion.div 
        className="bg-white p-6 rounded-lg shadow-lg"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <Line data={chartData} />
      </motion.div>

      <table className="min-w-full mt-6 border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Temperature (°C)</th>
            <th className="border px-4 py-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {temperatureData.length > 0 ? (
            temperatureData.map((data, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{data.temperature}</td>
                <td className="border px-4 py-2">{new Date(data.timestamp).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="text-center py-2">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
};

export default TemperaturePage;
