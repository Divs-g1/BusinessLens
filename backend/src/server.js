
import "dotenv/config";

import app from "./app.js";
import pool from "./config/db.js";
import "./config/firebaseAdmin.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const connection = await pool.getConnection();

    console.log("MySQL connected successfully");

    connection.release();

    console.log(
      "JWT_SECRET loaded:",
      Boolean(process.env.JWT_SECRET)
    );

    app.listen(PORT, () => {
      console.log(
        `BusinessLens API running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("MySQL connection failed:");
    console.error(error.message);

    process.exit(1);
  }
};

startServer();
