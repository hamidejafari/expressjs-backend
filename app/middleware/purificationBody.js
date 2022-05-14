const purificationBody = async (req, _, next) => {
  for (const property in req.body) {
    if (!req.body[property] || req.body[property] === "undefined" || req.body[property] === "null") {
      delete req.body[property];
    }
  }


  req.body = { ...req.body };
  next();
};

module.exports = purificationBody;
