import express from "express";
import {
  getAllUser,
  userRegister,
  userlogin,
  userProfile,
  userLogout,
} from "../controller/authcontroller.js";

const route = express.Router();

// routes for each methods

route.get("/", getAllUser);
route.post("/register", userRegister);
route.post("/login", userlogin);
route.post("/profile", userProfile);
route.post("/logout", userLogout);

export default route;
