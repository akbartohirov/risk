const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");
const envPath = path.join(__dirname, "..", ".env");
require("dotenv").config({ path: envPath });

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    password: { type: String, minLength: 6 },
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.generateToken = async function () {
  const user = this;

  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.SECRET_KEY,
    {
      expiresIn: 24 * 60 * 60 * 1000,
    }
  );

  return token;
};

UserSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
