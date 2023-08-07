const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const products = require("../products.json");
const { auth, admin } = require('../middlewares/auth')


router.get("/insertmany", async (req, res) => {
  await Product.insertMany(products);

  res.send("created");
});

/* GET all products. */
router.get(
  "/products",
  asyncHandler(async (req, res) => {
    // all products
    const products = await Product.find({}).populate(
      "department",
      "department"
    );

    // response
    res.status(200).json({
      status: "Success",
      data: products,
    });
  })
);

/* GET product by id */
router.get(
  "/product/:id",
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

    const product = await Product.findById(id).populate(
      "department",
      "department"
    );

    //check product exists
    if (!product) {
      return res.status(404).json({
        status: "Fail",
        data: { message: "Product not found" },
      });
    }

    //response
    res.status(200).json({
      status: "Success",
      data: product,
    });
  })
);

/* Post new product */
router.post(
  "/products",
  asyncHandler(async (req, res) => {
    const { product, department, productCode } = req.body;

    //check product exists
    const isExists = await Product.findOne({ product });
    if (isExists) {
      return res.status(400).json({
        status: "Fail",
        data: { message: "This product name exists" },
      });
    }

    //new product
    const newProduct = await new Product({
      product,
      department,
      productCode,
    });
    await newProduct.save();

    //response
    res.status(201).json({
      status: "Success",
      data: { product: newProduct },
    });
  })
);

/* DELETE product by id. */
router.delete(
  "/product/:id",
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

    //check product exists
    const isExists = await Product.findById(id);
    if (!isExists) {
      return res.status(404).json({
        status: "Fail",
        data: { message: "Product not found" },
      });
    }

    //delete product
    await Product.findByIdAndDelete({ _id: id });

    //response
    res.status(200).json({
      status: "Success",
      data: { message: "Product successfully deleted" },
    });
  })
);

/* PUT update product by id. */
router.put(
  "/update-product/:id",
  asyncHandler(async function (req, res) {
    const { id } = req.params;
    const data = req.body;

    //check id
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidObjectId) {
      return res.status(400).json({
        status: "Fail",
        data: { message: "Invalid ID provided" },
      });
    }

    //check product exists
    const isExists = await Product.findById(id);
    if (!isExists) {
      return res.status(404).json({
        status: "Fail",
        data: { message: "Product not found" },
      });
    }

    await Product.findByIdAndUpdate(
      id,
      { ...data },
      { new: true }
    );

    //response
    res.status(200).json({
      status: "Success",
      data: { message: "Product successfully updated" },
    });
  })
);

module.exports = router;
