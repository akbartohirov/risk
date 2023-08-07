const mongoose = require("mongoose");
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: ".env" });

const usersRouter = require("./routes/users");
const riskFactorRouter = require("./routes/riskFactor");
const departmentsRouter = require("./routes/departments");
const productRouter = require("./routes/products");
const InstitutionRiskFactorRoute = require("./routes/institutionRiskfactor");

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(logger("dev"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "static")));

app.use("/api/v1", usersRouter);
app.use("/api/v1", riskFactorRouter);
app.use("/api/v1", departmentsRouter);
app.use("/api/v1", productRouter);
app.use("/api/v1", InstitutionRiskFactorRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  //
  res.status(err.status || 500);
  res.json({
    status: "Fail",
    data: {
      message: err.message,
      url: `The url: ${req.originalUrl}`,
      method: req.method,
    },
  });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.log(err.message);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`The server has been started on port ${PORT}...`)
);
