const express = require("express");
const asyncHandler = require("express-async-handler");
const Department = require("../models/Department");
const router = express.Router();
const mongoose = require("mongoose");

/* GET all departments */
router.get(
  "/departments",
  asyncHandler(async (req, res) => {
    const departments = await Department.find({});

    //response
    res.status(200).json({
      status: "Success",
      data: departments,
    });
  })
);

/* GET department by id */
router.get(
  "/departent/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    //check valid id
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidObjectId) {
      return res.status(400).json({
        status: "Fail",
        data: { message: "Invalid ID provided" },
      });
    }

    const department = await Department.findById(id);

    //check factor exists
    if (!department) {
      return res.status(404).json({
        status: "Fail",
        data: { message: "Department not found" },
      });
    }

    //response
    res.status(200).json({
      status: "Success",
      data: department,
    });
  })
);

/* Post new risk factors */
router.post(
  "/departments",
  asyncHandler(async (req, res) => {
    const { department } = req.body;
    console.log("asdasd");

    //check factor exists
    const isExists = await Department.findOne({ department });
    if (isExists) {
      return res.status(400).json({
        status: "Fail",
        data: { message: "This department name exists" },
      });
    }

    //new risk factor
    const newDepartment = await new Department({
      department,
    });
    await newDepartment.save();

    //response
    res.status(201).json({
      status: "Success",
      data: { department: newDepartment },
    });
  })
);

/* DELETE risk factor by id. */
router.delete(
  "/department/:id",
  asyncHandler(async function (req, res) {
    const { id } = req.params;

    console.log("adadadasdasd");

    //check valid id
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidObjectId) {
      return res.status(400).json({
        status: "Fail",
        data: { message: "Invalid ID provided" },
      });
    }

    //check user exists
    const isExists = await Department.findById(id);
    if (!isExists) {
      return res.status(404).json({
        status: "Fail",
        data: { message: "Department not found" },
      });
    }

    //delete user
    const deleted = await Department.findByIdAndDelete({ _id: id });

    //response
    res.status(200).json({
      status: "Success",
      data: { message: "Department successfully deleted" },
    });
  })
);

/* PUT update factor by id. */
router.put(
  "/update-department/:id",
  asyncHandler(async function (req, res) {
    const { id } = req.params;
    const { department } = req.body;

    //check id
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidObjectId) {
      return res.status(400).json({
        status: "Fail",
        data: { message: "Invalid ID provided" },
      });
    }

    //check user exists
    const isExists = await Department.findById(id);
    if (!isExists) {
      return res.status(404).json({
        status: "Fail",
        data: { message: "Department not found" },
      });
    }

    await Department.findByIdAndUpdate(id, { department }, { new: true });

    //response
    res.status(200).json({
      status: "Success",
      data: { message: "Department successfully updated" },
    });
  })
);

module.exports = router;
