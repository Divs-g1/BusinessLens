import jwt from "jsonwebtoken";
import pool from "../config/db.js";

import { firebaseAuth, } from "../config/firebaseAdmin.js";
import { findOrCreateGoogleUser, } from "../services/auth.service.js";


const createSessionToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      googleId: user.googleId,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};


export const googleLogin = async (
  req,
  res
) => {
  try {
    const {
      idToken,
    } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "Firebase ID token is required.",
      });
    }

    /*
     * Verify the Firebase ID token on the server.
     */
    const decodedToken =
      await firebaseAuth.verifyIdToken(
        idToken
      );

    const {
      uid,
      name,
      email,
      picture,
      email_verified: emailVerified,
    } = decodedToken;

    if (!uid || !email) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid Google authentication data.",
      });
    }

    if (!emailVerified) {
      return res.status(401).json({
        success: false,
        message:
          "Google email must be verified.",
      });
    }

    /*
     * Find existing user or create a new one.
     */
    const user =
      await findOrCreateGoogleUser({
        googleId: uid,
        name: name || "BusinessLens User",
        email,
        profilePicture: picture || null,
      });

    /*
     * Create our own BusinessLens session.
     */
    const sessionToken =
      createSessionToken(user);

    /*
     * Store session token in an HTTP-only cookie.
     */
    res.cookie(
      "businesslens_session",
      sessionToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite:
          process.env.NODE_ENV === "production"
            ? "none"
            : "lax",
        maxAge:
          7 * 24 * 60 * 60 * 1000,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Google login successful.",
      user,
    });
  } catch (error) {
    console.error( "Google login error:", error );
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);

    return res.status(401).json({
      success: false,
      message: error.message || "Google login failed.",
      code: error.code || "UNKNOWN_ERROR",
    });
  }
};


export const logout = async (
  req,
  res
) => {
  res.clearCookie(
    "businesslens_session",
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
    }
  );

  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};


export const getCurrentUser = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;

    const [rows] =
      await pool.execute(
        `
          SELECT
            id,
            google_id,
            name,
            email,
            profile_picture,
            created_at,
            updated_at
          FROM users
          WHERE id = ?
          LIMIT 1
        `,
        [userId]
      );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const user = rows[0];

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        googleId: user.google_id,
        name: user.name,
        email: user.email,
        profilePicture:
          user.profile_picture,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
    });
  } catch (error) {
    console.error(
      "Get current user error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch current user.",
    });
  }
};