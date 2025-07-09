import express from "express";
import {
  getAllUser,
  userRegister,
  userlogin,
  userProfile,
  userLogout,
  userUpdate,
  removeUser,
} from "../controller/authcontroller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { loginSchemaZod, authSchemaZod } from "../models/authModel.js";
import { zodValidateRequest } from "../middleware/zodValidate.middleware.js";
const route = express.Router();

// routes for each methods

route.get("/", getAllUser);
route.post("/register", zodValidateRequest(authSchemaZod), userRegister);
route.post("/login", zodValidateRequest(loginSchemaZod), userlogin);

route.post("/profile", authenticate, userProfile);
route.put("/profile", authenticate, userUpdate);
route.post("/logout", authenticate, userLogout);
route.delete("/remove", removeUser);

export default route;
