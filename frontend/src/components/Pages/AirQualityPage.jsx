import React, { useEffect, useState } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router-dom"; // Redirect unauthorized users

ChartJS.register(ArcElement, Tooltip, Legend);

const AirQualityPage = () => {
  const [airQualityData, setAirQualityData] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // For navigation on auth failure

  useEffect(() => {
    const fetchAirQualityData = async () => {
      const token = localStorage.getItem("jwtToken"); // Get token

      if (!token) {
        setError("❌ Unauthorized: Please log in.");
        navigate("/login"); // Redirect to login page if not authenticated
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/sensor-data", {
          headers: { Authorization: `Bearer ${token}` }, // Attach token
        });

        const filteredData = response.data.map(({ air_quality, timestamp }) => ({
          air_quality,
          timestamp,
        }));

        setAirQualityData(filteredData);
        setError(""); // Clear any previous errors
      } catch (error) {
        if (error.response?.status === 401) {
          setError("❌ Session expired. Please log in again.");
          localStorage.removeItem("jwtToken"); // Remove expired token
          navigate("/login"); // Redirect to login page
        } else {
          setError("❌ Failed to fetch air quality data.");
        }
      }
    };

    fetchAirQualityData();
    const interval = setInterval(fetchAirQualityData, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  const doughnutChartData = {
    labels: ["Good", "Moderate", "Unhealthy", "Very Unhealthy", "Hazardous"],
    datasets: [
      {
        data: [
          airQualityData.filter((d) => d.air_quality <= 1).length,
          airQualityData.filter((d) => d.air_quality > 3 && d.air_quality <= 5).length,
          airQualityData.filter((d) => d.air_quality > 5 && d.air_quality <= 7).length,
          airQualityData.filter((d) => d.air_quality > 150 && d.air_quality <= 200).length,
          airQualityData.filter((d) => d.air_quality > 200).length,
        ],
        backgroundColor: ["#2ecc71", "#f1c40f", "#e67e22", "#e74c3c", "#8e44ad"],
      },
    ],
  };

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Air Quality Monitoring</h2>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

      {!error && (
        <>
          <motion.div
            className="mt-10 flex justify-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-80 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200">AQI Distribution</h3>
              <Doughnut data={doughnutChartData} />
            </div>
          </motion.div>

          <div className="mt-10">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Recent Air Quality Data</h3>
            <table className="min-w-full mt-6 border">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="border px-4 py-2">AQI</th>
                  <th className="border px-4 py-2">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {airQualityData.length > 0 ? (
                  airQualityData.map((data, index) => (
                    <tr key={index} className="text-center">
                      <td className="border px-4 py-2">{data.air_quality}</td>
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
          </div>
        </>
      )}
    </motion.div>
  );
};

export default AirQualityPage;