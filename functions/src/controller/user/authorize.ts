import * as functions from "firebase-functions";

import { auth } from "./create";
// @ts-ignore

export const authorize = functions.https.onRequest(async (req, res) => {
  const userEmail = req.body.email;
  const user = await auth.getUserByEmail(userEmail);
  const userRole = user.customClaims?.role;

  if (userRole) {
    return res.status(200).send({
      message: "user authorized",
      role: userRole,
    });
  } else {
    return res.status(404).send({
      message: "user not found",
    });
  }
});
