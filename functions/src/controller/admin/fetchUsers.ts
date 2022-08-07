import * as functions from "firebase-functions";
import { db } from "../user/create";
import { defaultCors } from "../../cors";

export const fetchUsers = functions.https.onRequest(async (req, res) => {
  defaultCors(req, res, async () => {
    const users = await db.collection("users").get();
    const usersArray = users.docs.map((doc) => doc.data());
    res.status(200).send(usersArray);
  });
});
