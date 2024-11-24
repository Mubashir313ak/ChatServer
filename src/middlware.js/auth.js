const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const verified = jwt.verify(token.split(" ")[1], SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
