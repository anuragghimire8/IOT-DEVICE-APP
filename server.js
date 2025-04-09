require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const sendEmailNotification = require("./Controllers/SendMail"); // Import the email notification function
const {authenticateUser} = require('./Controllers/AuthController'); // Import the middleware
const AuthRouter=require("./Routes/AuthRouter")

const app = express();
const PORT = process.env.PORT || 5000; // Use port from environment variable or default to 5000

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse JSON bodies
app.use(bodyParser.json()); // Parse incoming JSON requests

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// Sensor Data Schema & Model 
const SensorDataSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  air_quality: Number,
  status: String,
  timestamp: { type: Date, default: Date.now },
});
const SensorData = mongoose.model("SensorData", SensorDataSchema);

// Function to determine game status based on temperature and humidity
const determineGameStatus = (temperature, humidity) => {
  // Check if data is missing
  if (temperature == null || humidity == null) {
    return "No data received"; // Handle cases where data is missing
  }
  
  // Check for extreme conditions
  if (temperature < 0 || temperature > 35) {
    return "Game Forfeited (Extreme Temperature)";
  } else if (humidity > 90) {
    return "Game Cancelled (High Humidity)";
  } else if (humidity > 75) {
    return "Game Postponed (Unfavorable Conditions)";
  }
  
  // If all conditions are met, return "Game Allowed"
  return "Game Allowed";
};

// API Endpoint to receive sensor data from ESP32
// API Endpoint to receive sensor data from ESP32
app.post("/sensor-data", authenticateUser, async (req, res) => {
  try {
    console.log("Received POST data:", req.body);  // Log the data for debugging

    const { temperature, humidity, air_quality } = req.body;

    // Check if temperature and humidity are provided
   

    const status = determineGameStatus(temperature, humidity);

    // Create a new sensor data entry
    const newData = new SensorData({
      temperature,
      humidity,
      air_quality,
      status,
    });

    // Save the data to the database
    await newData.save();

    // Optionally, send an email if the user is authenticated
    if (req.user && req.user.email) {
      await sendEmailNotification(req.user.email, temperature, status);
    }

    // Respond with the saved data, including all fields
    res.status(201).json({
      message: "✅ Data saved & email sent",
      status,
      data: {
        _id: newData._id,
        temperature: newData.temperature,
        humidity: newData.humidity,
        air_quality: newData.air_quality,
        status: newData.status,
        timestamp: newData.timestamp,
      },
    });
  } catch (err) {
    console.error("Error occurred while saving sensor data:", err);
    res.status(500).json({ error: "❌ Server Error: " + err.message });
  }
});




// API Endpoint to fetch the latest sensor data (up to 10 most recent entries)
app.get("/sensor-data", async (req, res) => {
  try {
    const data = await SensorData.find().sort({ timestamp: -1 }).limit(10);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "❌ Server Error: " + err.message });
  }
});

// Health Check Endpoint
app.get("/ping", (req, res) => {
  res.send("PONG");
});
app.get("/", (req, res) => {
  res.send("🎉 Welcome to the server! Your IoT project is up and running!");
});

// Integrate Authentication & Product Routes
app.use("/auth", AuthRouter);


// Centralized Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong, please try again later." });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('🎉 Welcome to the server! Your IoT project is up and running!');
});
