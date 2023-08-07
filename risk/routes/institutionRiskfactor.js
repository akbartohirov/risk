const express = require("express");
const router = express.Router();
const InstitutionRiskFactor = require("../models/InstitutionRiskFactor");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const users = require("../users.json");

// router.get("/inst", async (req, res) => {
//   await InstitutionRiskFactor.insertMany(users);
//   res.send("created");
// });

/* GET all institutions. */
router.get(
  "/institutions",
  asyncHandler(async (req, res) => {
    const { userId } = req.query;

    // all institutions
    const institution = await InstitutionRiskFactor.find(
      userId ? { user: userId } : {}
    ).populate("user", "name");

    // response
    res.status(200).json({
      status: "Success",
      data: institution,
    });
  })
);

/* GET institution by id */
router.get(
  "/institution/:id",
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

    const institution = await InstitutionRiskFactor.findById(id).populate(
      "user",
      "name"
    );

    //check institution exists
    if (!institution) {
      return res.status(404).json({
        status: "Fail",
        data: { message: "Institution not found" },
      });
    }

    //response
    res.status(200).json({
      status: "Success",
      data: institution,
    });
  })
);

/* Post new institution */
router.post(
  "/institutions",
  asyncHandler(async (req, res) => {
    const { user } = req.body;

    //check institution exists
    const isExists = await InstitutionRiskFactor.findOne({ user });
    if (isExists) {
      return res.status(400).json({
        status: "Fail",
        data: { message: "This institution name exists" },
      });
    }

    //new institution
    const newInstitution = await new InstitutionRiskFactor({
      user,
    });
    await newInstitution.save();

    //response
    res.status(201).json({
      status: "Success",
      data: { product: newInstitution },
    });
  })
);

/* DELETE institution by id. */
router.delete(
  "/institution/:id",
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

    //check institution exists
    const isExists = await InstitutionRiskFactor.findById(id);
    if (!isExists) {
      return res.status(404).json({
        status: "Fail",
        data: { message: "Institution not found" },
      });
    }

    //delete institution
    await InstitutionRiskFactor.findByIdAndDelete({ _id: id });

    //response
    res.status(200).json({
      status: "Success",
      data: { message: "Institution successfully deleted" },
    });
  })
);

/* PUT update institution by id. */
router.put(
  "/update-institution/:id",
  asyncHandler(async function (req, res) {
    const { id } = req.params;
    const newData = req.body;

    //check id
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidObjectId) {
      return res.status(400).json({
        status: "Fail",
        data: { message: "Invalid ID provided" },
      });
    }

    //check institution exists
    let doc = await InstitutionRiskFactor.findById(id);
    if (!doc) {
      return res.status(404).json({
        status: "Fail",
        data: { message: "Product not found" },
      });
    }

    //update

    doc.riskFactor = { ...doc.riskFactor, ...newData };

    console.log(doc);

    await doc.save();

    //response
    res.status(200).json({
      status: "Success",
      data: { message: "Institution Factors successfully updated" },
    });
  })
);

router.get(
  "/institution/status/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
      const doc = await InstitutionRiskFactor
    } catch (err) {
      
    }

  })
);

module.exports = router;
