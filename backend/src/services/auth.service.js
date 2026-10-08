import pool from "../config/db.js";


export const findOrCreateGoogleUser = async ({
  googleId,
  name,
  email,
  profilePicture,
}) => {
  const connection = await pool.getConnection();

  try {
    /*
     * First try to find the user using Google UID.
     */
    const [googleUsers] = await connection.execute(
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
        WHERE google_id = ?
        LIMIT 1
      `,
      [googleId]
    );

    if (googleUsers.length > 0) {
      const user = googleUsers[0];

      /*
       * Keep profile information updated.
       */
      await connection.execute(
        `
          UPDATE users
          SET
            name = ?,
            email = ?,
            profile_picture = ?
          WHERE id = ?
        `,
        [
          name,
          email,
          profilePicture || null,
          user.id,
        ]
      );

      return {
        id: user.id,
        googleId,
        name,
        email,
        profilePicture: profilePicture || null,
      };
    }

    /*
     * If Google UID does not exist, check whether
     * this email already belongs to an existing
     * BusinessLens user.
     */
    const [emailUsers] = await connection.execute(
      `
        SELECT
          id,
          google_id,
          name,
          email,
          profile_picture
        FROM users
        WHERE email = ?
        LIMIT 1
      `,
      [email]
    );

    if (emailUsers.length > 0) {
      const existingUser = emailUsers[0];

      /*
       * Link the existing BusinessLens user
       * to the verified Google account.
       */
      await connection.execute(
        `
          UPDATE users
          SET
            google_id = ?,
            name = ?,
            profile_picture = ?
          WHERE id = ?
        `,
        [
          googleId,
          name,
          profilePicture || null,
          existingUser.id,
        ]
      );

      return {
        id: existingUser.id,
        googleId,
        name,
        email,
        profilePicture: profilePicture || null,
      };
    }

    /*
     * Completely new BusinessLens user.
     */
    const [result] = await connection.execute(
      `
        INSERT INTO users (
          google_id,
          name,
          email,
          profile_picture
        )
        VALUES (?, ?, ?, ?)
      `,
      [
        googleId,
        name,
        email,
        profilePicture || null,
      ]
    );

    return {
      id: result.insertId,
      googleId,
      name,
      email,
      profilePicture: profilePicture || null,
    };
  } finally {
    connection.release();
  }
};