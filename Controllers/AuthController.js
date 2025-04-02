const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User");

// Signup function
const signup = async (req, res) => {
    try {
        const { name, email, phone, location, password, confirmPassword } = req.body;

        // Check if all required fields are present
        if (!name || !email || !phone || !location || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        // Check if the email is already registered
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please log in instead.",
            });
        }

        // Ensure passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match.",
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long.",
            });
        }

        // Hash the password securely
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user and save
        const newUser = new UserModel({
            name,
            email,
            phone,
            location,
            password: hashedPassword,
        });
        await newUser.save();

        return res.status(201).json({
            success: true,
            message: "Signup successful! You can now log in.",
        });
    } catch (err) {
        console.error("Signup error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Please try again later.",
        });
    }
};

// Login function
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "24h" } // Token expires in 24 hours
        );

        return res.status(200).json({
            success: true,
            message: "Login successful!",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                location: user.location,
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Please try again later.",
        });
    }
};

// Middleware for authenticating the user based on the JWT token
const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization");

    // If token is missing
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        // Ensure the token starts with "Bearer " and extract the token
        const tokenWithoutBearer = token.replace("Bearer ", "");

        // Verify the token and decode the payload
        const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
        req.user = decoded; // Attach the user data to the request object

        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        return res.status(401).json({ message: "Invalid token." });
    }
};

module.exports = { signup, login, authenticateUser };
