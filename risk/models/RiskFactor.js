const mongoose = require("mongoose");

const RiskFactorSchema = new mongoose.Schema(
  {
    factor: { type: String, required: true, unique: true },
    refIndex: { type: String, required: true, unique: true },
    definition: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const RiskFactor = mongoose.model("RiskFactor", RiskFactorSchema);

module.exports = RiskFactor;
