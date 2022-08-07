import * as functions from "firebase-functions";
import { db } from "../user/create";
import { uid } from "uid";

export const bookDate = functions.https.onRequest(async (req, res) => {
  const { workshopName, workshopId, userId, userName, pickedDate } = req.body;
  if (!workshopName || !workshopId || !userId || !userName || !pickedDate) {
    res.status(404).send({ error: "workshop name is required" });
  } else {
    const id = uid();
    const workShopsRequests = db.collection("workShopsRequests").doc(id);
    workShopsRequests.set({
      workshopName,
      workshopId,
      userId,
      userName,
      pickedDate,
      isVisited: false,
      receiptImage: "",
      visitId: id,
    });
    res.status(200).send({ message: "success", visitId: id });
  }
});
