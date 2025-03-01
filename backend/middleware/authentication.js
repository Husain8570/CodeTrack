const jwt = require("jsonwebtoken");
require("dotenv").config();

function auth(req, res, next) {
  try {
    // 🔹 Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        msg: "Unauthorized - No token provided",
      });
    }

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer "
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);

    req.username = decoded.username; // Attach user data to request object
    next();

  } catch (err) {
    return res.status(401).json({
      success: false,
      msg: "Unauthorized - Invalid or expired token",
      error: err.message, // Debugging information
    });
  }
}

module.exports = auth;

