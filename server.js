require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const schedule = require('node-schedule'); // Add this import for scheduling
const sendEmailNotification = require("./Controllers/SendMail"); // Import the email notification function
const {authenticateUser} = require('./Controllers/AuthController'); // Import the middleware
const AuthRouter=require("./Routes/AuthRouter")
const UserModel = require("./Models/User"); // Import the User model properly

const app = express();
const PORT = process.env.PORT || 50000; // Use port from environment variable or default to 50000

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
app.post("/sensor-data", authenticateUser, async (req, res) => {
  try {
    console.log("Received POST data:", req.body);  // Log the data for debugging

    const { temperature, humidity, air_quality } = req.body;

    // Validate required fields
    if (temperature === undefined || humidity === undefined) {
      return res.status(400).json({ error: "Temperature and humidity are required" });
    }

    const status = determineGameStatus(temperature, humidity);

    // Create a new sensor data entry
    const newData = new SensorData({
      temperature,
      humidity,
      air_quality: air_quality || null, // Handle optional air_quality
      status,
    });

    // Save the data to the database
    await newData.save();

    // Send email notification if user is authenticated
    if (req.user && req.user.email) {
      try {
        await sendEmailNotification(req.user.email, temperature, status);
      } catch (emailError) {
        console.error("Email notification failed:", emailError);
        // Continue execution even if email fails
      }
    }

    // Respond with the saved data
    res.status(201).json({
      message: "✅ Data saved successfully",
      status,
      data: newData.toObject(), // Convert to plain object for response
    });
  } catch (err) {
    console.error("Error occurred while saving sensor data:", err);
    res.status(5000).json({ error: "❌ Server Error: " + err.message });
  }
});




// API Endpoint to fetch the latest sensor data (up to 10 most recent entries)
app.get("/sensor-data", async (req, res) => {
  try {
    const data = await SensorData.find().sort({ timestamp: -1 }).limit(10);
    res.status(200).json(data);
  } catch (err) {
    res.status(5000).json({ error: "❌ Server Error: " + err.message });
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
  res.status(5000).json({ message: "Something went wrong, please try again later." });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('🎉 Welcome to the server! Your IoT project is up and running!');
});

const checkConditionsAndNotify = async () => {
  try {
    // Get the latest sensor data (just one document)
    const latestData = await SensorData.findOne().sort({ timestamp: -1 });
    console.log(latestData);

    if (!latestData) {
      console.log("No sensor data available for checking");
      return;
    }
    
    // Check if conditions are unfavorable
    const status = determineGameStatus(latestData.temperature, latestData.humidity);
    
    if(status === "No data received"){
      console.log("No data received");
      return;
    }

    // If game is not allowed, send notifications
    if (status !== "Game Allowed") {
      console.log(`Unfavorable conditions detected: ${status}`);
      
      // Get all users who should receive notifications
      const users = await UserModel.find();
      
      // Send email to each user
      for (const user of users) {
        try {
          await sendEmailNotification(
            user.email, 
            latestData.temperature, 
            status,
            latestData.humidity
          );
          console.log(`Notification sent to ${user.email}`);
        } catch (emailError) {
          console.error(`Failed to send email to ${user.email}:`, emailError);
        }
      }
      
      console.log(`Sent notifications to ${users.length} users`);
    } else {
      console.log("Conditions are favorable, no notifications needed");
    }
  } catch (error) {
    console.error("Error in condition checking job:", error);
  }
};

// Schedule the job to run every 30 minutes without storing the reference
schedule.scheduleJob('*/30 * * * *', checkConditionsAndNotify);

console.log("Scheduled condition monitoring job");
