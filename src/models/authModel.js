import mongoose from "mongoose";
import { z } from "zod";
import { email } from "zod/v4";

// Zod schema for validation
const authSchemaZod = z.object({
  name: z
    .string()
    .min(3, { message: "Name with at list 3 characters is required" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .transform((email) => email.toLowerCase().trim()),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
});

const authSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
});

const Auth = mongoose.model("Auth", authSchema);
// console.log(Auth)
// console.log(authSchemaZod)
export { Auth, authSchemaZod };
