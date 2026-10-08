import jwt from "jsonwebtoken";


export const requireAuth = (
  req,
  res,
  next
) => {
  try {
    const token =
      req.cookies?.businesslens_session;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    if (
      !decoded?.userId ||
      !decoded?.email
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication session.",
      });
    }

    req.user = {
      id: decoded.userId,
      googleId: decoded.googleId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error(
      "Authentication middleware error:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication session.",
    });
  }
};