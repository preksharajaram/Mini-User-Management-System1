const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = require("../middlewares/authMiddleware");


const router = express.Router();

/**
 * SIGNUP ROUTE
 * POST /api/auth/signup
 */
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // 1. Check all fields
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await user.save();

    // 5. Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 6. Send response
    res.status(201).json({
      message: "User registered successfully",
      token,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * LOGIN ROUTE
 * POST /api/auth/login
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 2. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 4. Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 5. Success response
    res.status(200).json({
      message: "Login successful",
      token,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET CURRENT USER
 * GET /api/auth/me
 */
router.get("/me", authMiddleware, async (req, res) => {
  res.status(200).json(req.user);
});


// UPDATE PROFILE (name + email)
router.put("/update", authMiddleware, async (req, res) => {
  try {
    const { fullName, email } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ message: "All fields required" });
    }

    req.user.fullName = fullName;
    req.user.email = email;
    await req.user.save();

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// CHANGE PASSWORD
router.put("/change-password", authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    const isMatch = await bcrypt.compare(oldPassword, req.user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    req.user.password = await bcrypt.hash(newPassword, 10);
    await req.user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// TEMP ADMIN CREATION (REMOVE AFTER USE)
router.post("/create-admin", async (req, res) => {
  const bcrypt = require("bcryptjs");
  const User = require("../models/User");

  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  const admin = new User({
    fullName: "Admin User",
    email: "admin@gmail.com",
    password: hashedPassword,
    role: "admin",
    status: "active",
  });

  await admin.save();
  res.json({ message: "Admin created" });
});

module.exports = router;
