
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";

import { getAuth } from "firebase-admin/auth";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.resolve(
  __dirname,
  "../../firebase-service-account.json"
);

const getServiceAccount = () => {
  // Option 1: Use environment variables (Render/production)
  const {
    FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY,
  } = process.env;

  if (
    FIREBASE_PROJECT_ID &&
    FIREBASE_CLIENT_EMAIL &&
    FIREBASE_PRIVATE_KEY
  ) {
    return {
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    };
  }

  // Option 2: Use the local service account JSON file
  if (fs.existsSync(serviceAccountPath)) {
    return JSON.parse(
      fs.readFileSync(serviceAccountPath, "utf8")
    );
  }

  throw new Error(
    "Firebase credentials are missing. Configure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY, or provide firebase-service-account.json locally."
  );
};

const firebaseApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert(getServiceAccount()),
      });

export const firebaseAuth = getAuth(firebaseApp);

console.log("Firebase Admin initialized successfully");
