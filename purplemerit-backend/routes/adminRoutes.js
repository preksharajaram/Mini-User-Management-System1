const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

/* ======================
   ADMIN CHECK MIDDLEWARE
====================== */
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

/* ======================
   GET ALL USERS (PAGINATION)
   GET /api/admin/users?page=1&limit=10
====================== */
router.get("/users", authMiddleware, adminOnly, async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments();

    const users = await User.find()
      .select("-password")
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      page,
      limit,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      users,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

/* ======================
   ACTIVATE USER
   PUT /api/admin/activate/:id
====================== */
router.put("/activate/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "active" },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User activated" });
  } catch (error) {
    res.status(500).json({ message: "Failed to activate user" });
  }
});

/* ======================
   DEACTIVATE USER
   PUT /api/admin/deactivate/:id
====================== */
router.put("/deactivate/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "inactive" },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deactivated" });
  } catch (error) {
    res.status(500).json({ message: "Failed to deactivate user" });
  }
});

module.exports = router;
