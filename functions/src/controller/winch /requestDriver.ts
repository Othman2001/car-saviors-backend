import * as functions from "firebase-functions";
import { uid } from "uid";
import { db } from "../user/create";

export const requestDriver = functions.https.onRequest(async (req, res) => {
  const { price, userName, winchDriverName, winchDriverId } = req.body;
  if (!price || !userName || !winchDriverName || !winchDriverId) {
    res.status(404).send({ error: "price is required" });
  } else {
    const id = uid();
    const request = db.collection("winchRequests").doc(id);
    request.set({
      price,
      userName,
      winchDriverName,
      winchDriverId,
      requestId: id,
    });
    res.status(200).send({ message: "success", visitId: id });
  }
});
