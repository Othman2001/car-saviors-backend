import * as functions from "firebase-functions";
import { defaultCors } from "../../cors";
import * as admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";

// @ts-ignore

export const db = admin.firestore();
export const auth = admin.auth();

export const createUserAdmin = functions.https.onRequest(async (req, res) => {
  defaultCors(req, res, async () => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).send({
        message: "missing required fields",
      });
    }
    const userID = uuidv4();
    const userData = await auth.createUser({
      email: req.body.email,
      password: req.body.password,
      displayName: req.body.firstName + " " + req.body.lastName,
      disabled: false,
      emailVerified: true,
      uid: userID,
    });

    await db.collection("users").doc(userData.uid).set({
      id: userID,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      role: "user",
      password: req.body.password,
    });
    await auth.setCustomUserClaims(userData.uid, {
      role: "user",
    });

    const customClaims = await (await auth.getUser(userID)).customClaims?.role;
    if (customClaims) {
      return res.status(200).send({
        message: "user created",
        user: userData,
        role: customClaims,
        visitedWorkShops: 0,
        rentedCar: 0,
        rentingCar: 0,
      });
    } else {
      return res.status(500).send({
        message: "error",
      });
    }
  });
});
