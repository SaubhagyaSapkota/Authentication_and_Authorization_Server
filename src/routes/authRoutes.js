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
import createUploadMiddleware from "../middleware/multer.middleware.js";
const route = express.Router();

// routes for each methods

route.get("/", getAllUser);
route.post("/register", zodValidateRequest(authSchemaZod), userRegister);
route.post("/login", zodValidateRequest(loginSchemaZod), userlogin);

const feedbackUpload = createUploadMiddleware({
  allowedTypes: ["image/jpeg", "image/png", "image/jpg", "image/webp"],
  maxFileSize: 10 * 1024 * 1024,
  maxFiles: 10,
})
route.post("/upload-images", feedbackUpload.array("images"), uploadFile)

const fileUpload = createUploadMiddleware({
  allowedTypes: ["application/pdf"],
  maxFileSize: 20 * 1024 * 1024,
  maxFiles: 5
})
route.post("/upload-documents", fileUpload.array("documents"), uploadFile)

route.post("/profile", authenticate, userProfile);
route.put("/profile", authenticate, userUpdate);
route.post("/logout", authenticate, userLogout);
route.delete("/remove",authenticate, roleAuthenticate, removeUser);

export default route;
