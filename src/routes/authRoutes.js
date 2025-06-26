import express from "express";
import {
  getAllUser,
  userRegister,
  userlogin,
  userProfile,
} from "../controller/authcontroller.js";

const route = express.Router();

// routes for each methods

route.get("/", getAllUser);
route.post("/register", userRegister);
route.post("/login", userlogin);
route.post("/profile", userProfile);

export default route;
