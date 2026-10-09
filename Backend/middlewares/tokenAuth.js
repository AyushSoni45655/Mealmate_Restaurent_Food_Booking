
import jwt from "jsonwebtoken";

const tokenAuth = async (req, res, next) => {
  try {
    const fullToken = req.headers.authorization;

    // Token missing
    if (!fullToken) {
      return res.status(401).json({
        success: false,
        msg: "Authorization token is missing",
      });
    }

    // Check Bearer format
    if (!fullToken.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        msg: "Invalid authorization format",
      });
    }

    // Extract token
    const token = fullToken.split(" ")[1];

    // Token empty
    if (!token) {
      return res.status(401).json({
        success: false,
        msg: "Invalid token",
      });
    }

    // Verify token
    const user = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    // Attach decoded user to request
    req.user = user;

    next();

  } catch (error) {
    console.error("Authentication error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        msg: "Access token has expired",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        msg: "Invalid access token",
      });
    }

    return res.status(401).json({
      success: false,
      msg: "Authentication failed",
    });
  }
};

export default tokenAuth;

