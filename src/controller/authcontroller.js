import express from "express";
import { Auth, authSchemaZod } from "../models/authModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { addToBlacklist, isBlacklisted } from "../token/tokenBlacklist.js";
import { error } from "console";
import winstonLogger from "../logger/winston.logger.js";

// To see all the register users
export async function getAllUser(req, res) {
  try {
    const users = await Auth.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getAllUser controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// For registering the users & to check if the users already exists or not
export async function userRegister(req, res) {
  const { name, email, password } = req.body;

  const existingUser = await Auth.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: "User already exists." });

  const hashedPassword = await bcrypt.hash(password, 10);
  await Auth.create({ name, email, password: hashedPassword });

  res.status(201).json({ message: "User registered successfully." });
  winstonLogger.info(`New user registered: ${email}`);
}

// For logging in by checking the hashed password(previous password) and plain password (currently entered password)
export async function userlogin(req, res) {
  const { email, password } = req.body;

  const user = await Auth.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials." });

  const plainPassword = password;
  const hashedPassword = user.password;
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  if (!isMatch)
    return res.status(400).json({ message: "Invalid credentials 2." });

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  res.status(200).json({ message: "Login successful", token });
}

// To authenticate the users
export async function userProfile(req, res) {
  res.json(req.user);
}

// To Update user Profile
export async function userUpdate(req, res) {
  try {
    const { gender, address, education } = req.body;
    if (!gender && !address && !education) {
      return res
        .status(400)
        .json({ message: "At least one field must be provided for update" });
    }
    const userUpdate = await Auth.findByIdAndUpdate(
      req.user._id,
      { gender, address, education },
      { new: true }
    );
    if (!userUpdate) {
      return res.status(404).json({ message: "User not Found" });
    }
    res.status(200).json({
      message: "User details has been Updated",
      user: userUpdate, // Returning the updated user data
    });
    winstonLogger.info(`Updated user details ${userUpdate}`);
  } catch (error) {
    console.error("Error in userUpdate contoller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// To Logout the users
export async function userLogout(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(400).json({ message: "Token missing" });

  const token = authHeader.split(" ")[1];
  addToBlacklist(token); // blacklist it

  res.status(200).json({ message: "Logged out successfully" });
}

export async function removeUser(req, res) {
  try {
    const { _id } = req.body;
    const deleteuser = await Auth.findByIdAndDelete({ _id });
    if (!deleteuser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User has been deleted" });
  } catch (error) {
    console.error("Error in removeUser controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
