import dotenv from "dotenv";
import app from "./app.js";
import pool from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const connection = await pool.getConnection();

    console.log("MySQL connected successfully");

    connection.release();

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