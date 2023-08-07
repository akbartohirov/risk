const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({ _id: decoded.id });

    if (!user) {
      throw new Error("Please authenticate!");
    }

    req.user = user;

    next();
  } catch (e) {
    res.status(401).send({
      status: "Fail",
      data: { message: "Please authenticate" },
    });
  }
};

const admin = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    res.status(403).send({
      status: "Fail",
      data: { message: "You are not allowed to do that operation!" },
    });
  }
};

module.exports = { auth, admin };
