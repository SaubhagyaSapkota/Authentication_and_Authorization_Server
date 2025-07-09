import jwt from "jsonwebtoken";
import { isBlacklisted } from "../token/tokenBlacklist.js";
import {Auth} from '../models/authModel.js'
import { console } from "inspector";


// Middleware for user authentication
export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token missing" });

  const token = authHeader.split(" ")[1];

  if (isBlacklisted(token)) {
    return res.status(401).json({ message: "Token has been revoked" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)
    const user = await Auth.findById(decoded.id).select("-password");
    // console.log(user)
    if (!user) throw new Error();

    req.user = user; // Attach user to request for use in next middleware or controller
    next(); // Continue to the next middleware or controller
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}
