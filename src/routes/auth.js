import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.js";
import { validateRegBody, validateLoginBody } from "../middlewares/validate.js";
import auth from "../middlewares/auth.js";
import config from "../../config/config.js";

const router = Router();

// @route   POST auth/register
// @desc    Register New User
// @access  Public
router.post("/register", validateRegBody, async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, role, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      name,
      email,
      role,
      password: hashedPassword,
    });
    await user.save();
    const payload = {
      id: user.id,
      role,
    };
    const token = jwt.sign(payload, config.jwtSecret);
    res.status(201).json({ token });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// @route   POST auth/login
// @desc    Login User
// @access  Public
router.post("/login", validateLoginBody, async (req, res) => {
  try {
    const { email, role, password } = req.body;

    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }
    const payload = {
      id: user.id,
      role,
    };
    const token = jwt.sign(payload, config.jwtSecret);
    res.status(201).json({ token });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// @route   Get auth/
// @desc    Test route to check authentication
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    console.log(req.body);
    res.json({ msg: "Authentication Successful" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

export default router;
