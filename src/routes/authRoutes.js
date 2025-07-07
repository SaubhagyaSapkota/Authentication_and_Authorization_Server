import express from "express";
import {
  getAllUser,
  userRegister,
  userlogin,
  userProfile,
  userLogout,
  removeUser,
} from "../controller/authcontroller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { loginSchemaZod, authSchemaZod } from "../models/authModel.js";
import { validateRequest } from "../middleware/validate.middleware.js";
const route = express.Router();

// routes for each methods

route.get("/", getAllUser);
route.post("/register", validateRequest(authSchemaZod), userRegister);
route.post("/login", validateRequest(loginSchemaZod), userlogin);

route.post("/profile", authenticate, userProfile);
route.post("/logout", authenticate, userLogout);
route.delete("/remove", removeUser);

export default route;
