import * as admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";
import * as functions from "firebase-functions";

const serviceAccount = require("../../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const db = admin.firestore();
export const auth = admin.auth();

// @ts-ignore
export const createUser = functions.https.onRequest(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).send({
      message: "missing required fields",
    });
  }
  const userData = await auth.createUser({
    email: req.body.email,
    password: req.body.password,
    displayName: req.body.firstName + " " + req.body.lastName,
    disabled: false,
    emailVerified: true,
    uid: uuidv4(),
  });

  await db.collection("users").doc(userData.uid).set({
    id: userData.uid,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  });
  await auth.setCustomUserClaims(userData.uid, {
    role: "user",
  });

  const customClaims = await (
    await auth.getUser(userData.uid)
  ).customClaims?.role;
  if (customClaims) {
    return res.status(200).send({
      message: "user created",
      user: userData,
      role: customClaims,
    });
  }
});
