import express from "express";
import {
  getAllUser,
  userRegister,
  userlogin,
  userProfile,
  uploadFile,
  userLogout,
  userUpdate,
  removeUser,
} from "../controller/authcontroller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { loginSchemaZod, authSchemaZod } from "../models/authModel.js";
import { roleAuthenticate } from "../middleware/role.middleware.js";
import { zodValidateRequest } from "../middleware/zodValidate.middleware.js";
import upload from "../config/multerConfig.js";
const route = express.Router();

// routes for each methods

route.get("/", getAllUser);
route.post("/register", zodValidateRequest(authSchemaZod), userRegister);
route.post("/login", zodValidateRequest(loginSchemaZod), userlogin);
route.post("/upload",upload.single('profile'), uploadFile)

route.post("/profile", authenticate, userProfile);
route.put("/profile", authenticate, userUpdate);
route.post("/logout", authenticate, userLogout);
route.delete("/remove",authenticate, roleAuthenticate, removeUser);

export default route;
