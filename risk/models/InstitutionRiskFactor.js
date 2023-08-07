const mongoose = require("mongoose");

const InstitutionRiskFactorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    riskFactor: {
      anonymityToTraceability: { type: Number, required: true, default: 5 },
      anonymityToMobility: { type: Number, required: true, default: 5 },
      anonymityToThirdPartyInvolvement: {
        type: Number,
        required: true,
        default: 5,
      },
      anonymityToCrossBorderTransaction: {
        type: Number,
         required: true,
        default: 5,
      },
      anonymityToVelocity: { type: Number, required: true, default: 5 },
      traceabilityToMobility: { type: Number, required: true, default: 5 },
      traceabilityToThirdPartyInvolvement: {
        type: Number,
        required: true,
        default: 5,
      },
      traceabilityToCrossBorderTransaction: {
        type: Number,
        required: true,
        default: 5,
      },
      traceabilityToVelocity: { type: Number, required: true, default: 5 },
      mobilityToThirdPartyInvolvement: {
        type: Number,
        required: true,
        default: 5,
      },
      mobilityToCrossBorderTransaction: {
        type: Number,
        required: true,
        default: 5,
      },
      mobilityToVelocity: { type: Number, required: true, default: 5 },
      thirdPartyInvolvementToCrossBorderTransaction: {
        type: Number,
        required: true,
        default: 5,
      },
      thirdPartyInvolvementToVelocity: {
        type: Number,
        required: true,
        default: 5,
      },
      crossBorderTransactionToVelocity: {
        type: Number,
        required: true,
        default: 5,
      },
    },
  },
  {
    timestamps: true,
  }
);

const InstitutionRiskFactor = mongoose.model(
  "InstitutionRiskFactor",
  InstitutionRiskFactorSchema
);

module.exports = InstitutionRiskFactor;
