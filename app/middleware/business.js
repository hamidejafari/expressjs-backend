const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const business = async (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).send("Not authorized, no token");
  }
  let decoded;
  try {
    decoded = jwt.verify(token.split(" ")[1], process.env.TOKEN_KEY);
  } catch (err) {
    return res.status(401).send("Not authorized, token failed");
  }
  try {
    const data = await User.findById(decoded.user_id);
    if (!data) {
      return res.status(401).send("Not authorized, token failed");
    }
    if (data.role !== "business") {
      return res.status(403).send("Not authorized, not a brand owner!");
    }
    req.user = data;
  } catch (err) {
    return next(err);
  }
  return next();
};

module.exports = business;
