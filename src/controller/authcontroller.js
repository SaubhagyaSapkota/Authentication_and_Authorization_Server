import express from "express";
import Auth from "../models/authModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function getAllUser(req, res) {
  try {
    const users = await Auth.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getAllUser controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function userRegister(req, res) {
  const { name, email, password } = req.body;

  if (!(name && email && password)) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const existingUser = await Auth.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: "User already exists." });

  const hashedPassword = await bcrypt.hash(password, 10);
  await Auth.create({ name, email, password: hashedPassword });

  res.status(201).json({ message: "User registered successfully." });
}

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

export async function userProfile(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token missing" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Auth.findById(decoded.id).select("-password");
    if (!user) throw new Error();

    res.json(user);
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}
