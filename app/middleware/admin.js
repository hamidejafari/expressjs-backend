const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const verifyToken = async (req, res, next) => {
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
    const data = await User.findById(decoded.user_id).populate("permissions");
    if (!data) {
      return res.status(401).send("Not authorized, token failed");
    }
    if (data.role !== "admin") {
      return res.status(403).send("Not authorized, not admin!");
    }
    req.user = data;
  } catch (err) {
    return next(err);
  }
  return next();
};

module.exports = verifyToken;
