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
  const { firstName, lastName, email, password, phoneNumber } = req.body;

  if (!firstName || !lastName || !email || !password || !phoneNumber) {
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
    phoneNumber: req.body.phoneNumber,
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
      phoneNumber: req.body.phoneNumber,
    });
  }
});

// import * as admin from "firebase-admin";
// import { v4 as uuidv4 } from "uuid";
// import * as functions from "firebase-functions";

// const serviceAccount = require("../../serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// export const db = admin.firestore();
// export const auth = admin.auth();

// // @ts-ignore
// export const createUser = functions.https.onRequest(async (req, res) => {
//   const { firstName, lastName, email, password } = req.body;

//   if (!firstName || !lastName || !email || !password) {
//     return res.status(400).send({
//       message: "missing required fields",
//     });
//   }
//   const userID = uuidv4();
//   const userData = await auth.createUser({
//     email: req.body.email,
//     password: req.body.password,
//     displayName: req.body.firstName + " " + req.body.lastName,
//     disabled: false,
//     emailVerified: true,
//     uid: userID,
//   });

//   await db.collection("users").doc(userData.uid).set({
//     id: userID,
//     firstName: req.body.firstName,
//     lastName: req.body.lastName,
//     email: req.body.email,
//     role: "user",
//     password: req.body.password,
//     visitedWorkShops: 0,
//     rentedCar: 0,
//     rentingCar: 0,
//   });
//   await auth.setCustomUserClaims(userData.uid, {
//     role: "user",
//   });

//   const customClaims = await (await auth.getUser(userID)).customClaims?.role;
//   if (customClaims) {
//     return res.status(200).send({
//       message: "user created",
//       user: userData,
//       role: customClaims,
//       visitedWorkShops: 0,
//       rentedCar: 0,
//       rentingCar: 0,
//     });
//   }
// });
