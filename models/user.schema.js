import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import crypto from "crypto";
import AuthRoles from "../utils/authRoles";
import { config } from "dotenv";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      maxLength: [50, "Name must be less than 50"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [8, "password must be at least 8 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(AuthRoles),
      default: AuthRoles.USER,
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  {
    timestamps: true,
  }
);

/**Encrypt Password Hook */

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  /**Runs only when updating or creating Password */
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/** Helper methods for
 * Password Comparision
 * JWT Token Generation
 */

userSchema.methods = {
  comparePassword: async function (enterPassword) {
    return await bcrypt.compare(enterPassword, this.password);
  },

  // Generate JWT Token
  getJwtTokenL: function () {
    return JWT.sign(
      {
        _id: this._id,
        role: this.role,
      },
      config.JWT_SECRET,
      {
        expiresIn: config.JWT_EXPIRY,
      }
    );
  },
};
