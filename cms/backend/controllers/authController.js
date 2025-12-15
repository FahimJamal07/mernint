const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create user
    // HACK: First user registered becomes Admin automatically for testing
    // Remove this logic later for production!
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'student';

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
// ... inside authController.js

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  // ===> ADD THIS LOG HERE <===
  console.log("👉 Backend received login for:", email); 

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // ===> ADD THIS LOG HERE <===
      console.log("✅ Password match! Sending response.");
      
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      // ===> ADD THIS LOG HERE <===
      console.log("❌ Invalid credentials");
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.log("🔥 Backend Crash:", error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Helper: Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  registerUser,
  loginUser,
};