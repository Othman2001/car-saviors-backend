import * as functions from "firebase-functions";
import { db } from "../user/create";

export const rejectRequest = functions.https.onRequest(async (req, res) => {
  const { requestId } = req.body;
  if (!requestId) {
    res.status(404).send({ error: "requestId is required" });
  } else {
    const winchRequests = db.collection("winchRequests").doc(requestId);
    if (winchRequests) {
      winchRequests.delete();
    }
  }
});
