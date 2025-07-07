import express from "express";
import {
  getAllUser,
  userRegister,
  userlogin,
  userProfile,
  userLogout,
  removeUser
} from "../controller/authcontroller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const route = express.Router();

// routes for each methods

route.get("/", getAllUser);
route.post("/register", userRegister);
route.post("/login", userlogin);
route.post("/profile", authenticate, userProfile);
route.post("/logout", authenticate, userLogout);
route.delete("/remove", removeUser)

export default route;
