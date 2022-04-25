import * as functions from "firebase-functions";

import { auth, db } from "./create";
// @ts-ignore

export const authorize = functions.https.onRequest(async (req, res) => {
  const userEmail = req.body.email;
  const { uid } = await auth.getUserByEmail(userEmail);

  const users: any = (await db.collection("users").doc(uid).get()).data();

  if (users) {
    return res.status(200).send({
      message: "user authorized",
      user: users,
      rentedCar: users.rentedCar,
      rentingCar: users.rentingCar,
      visitedWorkShops: users.visitedWorkShops,
    });
  } else {
    return res.status(404).send({
      message: "user not found",
    });
  }
});
