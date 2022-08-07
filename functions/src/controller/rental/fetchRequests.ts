import * as functions from "firebase-functions";
import { db } from "../user/create";

export const fetchRequests = functions.https.onRequest(
  async (req: any, res: any) => {
    const { userId } = req.body;

    if (!userId) {
      return res.status(500).send({ message: "user id is required" });
    }
    const rentalCollection = db.collection("rental");
    const data = await rentalCollection
      .where("carOwnrerId", "==", userId)
      .get();
    data.forEach((snapshot) => {
      functions.logger.debug(snapshot.data());
    });

    return res.status(200).send({ message: "success" });
  }
);
