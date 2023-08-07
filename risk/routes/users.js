const express = require("express");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const router = express.Router();
const mongoose = require("mongoose");
const { auth, admin } = require('../middlewares/auth')


/* POST create user. */
router.post(
  "/create-user",
  asyncHandler(async (req, res) => {
    const { name, password } = req.body;

    //check user exists
    const isExists = await User.findOne({ name });
    if (isExists) {
      return res.status(409).json({
        status: "Fail",
        data: { message: "User already exists" },
      });
    }

    //create user
    const user = new User({ name, password });
    const token = await user.generateToken();

    console.log(token);

    await user.save();

    //response
    res.status(201).json({
      status: "Success",
      data: { user, token },
    });
  })
);

/* POST log into account. */
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { name, password } = req.body;

    //find user
    const user = await User.findOne({ name });

    //check user
    if (!user) {
      return res.status(404).json({
        status: "Fail",
        data: { message: "User not found" },
      });
    }

    //check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(403).json({
        status: "Fail",
        data: { message: "Password or Login is incorrect" },
      });
    }

    //create token
    const token = await user.generateToken();

    //response
    res.status(200).json({
      status: "Success",
      data: { user, token },
    });
  })
);

router.get(
  "/logout",
  asyncHandler(async (req, res) => {
    res
      .cookie("token", "loggedout", { httpOnly: true })
      .status(200)
      .json({
        status: "Success",
        data: { message: "You are logged out" },
      });
  })
);

/* GET users list. */
router.get(
  "/all-users",
  auth,
  asyncHandler(async function (req, res) {
    //all users
    const users = await User.find({});

    //response
    res.status(200).json({
      status: "Success",
      data: users,
    });
  })
);

/* GET user by id. */
router.get(
  "/user/:id",
  auth,
  asyncHandler(async function (req, res) {
    const { id } = req.params;

    //check valid id
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidObjectId) {
      return res.status(400).json({
        status: "Fail",
        data: { message: "Invalid ID provided" },
      });
    }

    //check user exists
    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({
        status: "Fail",
        data: { message: "User not found" },
      });
    }



    //response
    res.status(200).json({
      status: "Success",
      data: user,
    });
  })
);

/* DELETE user by id. */
router.delete(
  "/user/:id",
  auth,
  asyncHandler(async function (req, res) {
    const { id } = req.params;

    //check valid id
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidObjectId) {
      return res.status(400).json({
        status: "Fail",
        data: { message: "Invalid ID provided" },
      });
    }

    //check user exists
    const isExists = await User.findById(id);
    if (!isExists) {
      return res.status(404).json({
        status: "Fail",
        data: { message: "User not found" },
      });
    }

    //delete user
    await User.findByIdAndDelete({ _id: id });

    //response
    res.status(200).json({
      status: "Success",
      data: { message: "User successfully deleted" },
    });
  })
);

/* PUT update user by id. */
router.put(
  "/update-user/:id",
  auth,
  asyncHandler(async function (req, res) {
    const { id } = req.params;
    const { password } = req.body;

    //check id
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidObjectId) {
      return res.status(400).json({
        status: "Fail",
        data: { message: "Invalid ID provided" },
      });
    }

    //check user exists
    const isExists = await User.findById(id);
    if (!isExists) {
      return res.status(404).json({
        status: "Fail",
        data: { message: "User not found" },
      });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 8);

    await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );

    //response
    res.status(200).json({
      status: "Success",
      data: { message: "User password successfully updated" },
    });
  })
);

module.exports = router;
