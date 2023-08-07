const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema(
  {
    department: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

const Department = mongoose.model("Department", DepartmentSchema);

module.exports = Department;
