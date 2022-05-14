const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const verifyToken = async (req, _, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return next();
  }
  let decoded;
  try {
    decoded = jwt.verify(token.split(" ")[1], process.env.TOKEN_KEY);
  } catch (err) {
    return next();
  }
  try {
    const data = await User.findById(decoded.user_id).populate("permissions");
    if (!data) {
      return next();
    }
    req.user = data;
  } catch (err) {
    return next();
  }
  return next();
};

module.exports = verifyToken;
