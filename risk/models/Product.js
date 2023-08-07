const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    product: { type: String, unique: true, required: true },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    productCode: { type: String, required: true, enum: ["product", "service"] },
    depOfCer: { type: Boolean, default: false },
    payThrAcc: { type: Boolean, default: false },
    offsureZone: { type: Boolean, default: false },
    precMetel: { type: Boolean, default: false },
    anonimity: { type: Boolean, default: false },
    traceability: { type: Boolean, default: false },
    mobility: { type: Boolean, default: false },
    thrdPartInv: { type: Boolean, default: false },
    crosBorTran: { type: Boolean, default: false },
    velocity: { type: Boolean, default: false },
    riskScore: { type: Number, default: 1 },
    initialRiskRating: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },
    adjustedRiskRating: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },
    manualOverride: {
      type: String,
      enum: ["", "Low", "Medium", "High"],
    },
    rationale: { type: String },
    finalRiskRating: {
      type: String,
      enum: ["Low", "Medium", "High"],
      get: function () {
        const adjusted = this.adjustedRiskRating
        const manual = this.manualOverride

        if (manual !== "") {
          return manual
        }

        return adjusted
      }
    },
  },

  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
