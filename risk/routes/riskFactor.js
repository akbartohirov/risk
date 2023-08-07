const express = require("express");
const asyncHandler = require("express-async-handler");
const RiskFactor = require("../models/RiskFactor");
const router = express.Router();
const mongoose = require("mongoose");

/* GET all risk factors */
router.get(
  "/risk-factors",
  asyncHandler(async (req, res) => {
    const factors = await RiskFactor.find({});

    //response
    res.status(200).json({
      status: "Success",
      data: factors,
    });
  })
);

/* GET risk factor by id */
router.get(
  "/risk-factor/:id",
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

    const factor = await RiskFactor.findById(id);

    //check factor exists
    if (!factor) {
      return res.status(404).json({
        status: "Fail",
        data: { message: "Factor not found" },
      });
    }

    //response
    res.status(200).json({
      status: "Success",
      data: factor,
    });
  })
);

/* Post new risk factors */
router.post(
  "/risk-factors",
  asyncHandler(async (req, res) => {
    const { factor, refIndex, definition } = req.body;

    //check factor exists
    const isExists = await RiskFactor.findOne({ factor });
    if (isExists) {
      return res.status(400).json({
        status: "Fail",
        data: { message: "This Risk factor name exists" },
      });
    }

    //new risk factor
    const newFactor = await new RiskFactor({ factor, refIndex, definition });
    await newFactor.save();

    //response
    res.status(201).json({
      status: "Success",
      data: { factor: newFactor },
    });
  })
);

/* DELETE risk factor by id. */
router.delete(
  "/risk-factor/:id",
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

    //check factor exists
    const isExists = await RiskFactor.findById(id);
    if (!isExists) {
      return res.status(404).json({
        status: "Fail",
        data: { message: "Factor not found" },
      });
    }

    //delete factor
    await RiskFactor.findByIdAndDelete({ _id: id });

    //response
    res.status(200).json({
      status: "Success",
      data: { message: "Risk factor successfully deleted" },
    });
  })
);

/* PUT update factor by id. */
router.put(
  "/update-factor/:id",
  asyncHandler(async function (req, res) {
    const { id } = req.params;
    const { factor, refIndex, definition } = req.body;

    //check id
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidObjectId) {
      return res.status(400).json({
        status: "Fail",
        data: { message: "Invalid ID provided" },
      });
    }

    //check factor exists
    const isExists = await RiskFactor.findById(id);
    if (!isExists) {
      return res.status(404).json({
        status: "Fail",
        data: { message: "Factor not found" },
      });
    }

    await RiskFactor.findByIdAndUpdate(
      id,
      { factor, refIndex, definition },
      { new: true }
    );

    //response
    res.status(200).json({
      status: "Success",
      data: { message: "Risk factor successfully updated" },
    });
  })
);

module.exports = router;
