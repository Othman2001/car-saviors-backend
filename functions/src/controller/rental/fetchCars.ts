import * as functions from "firebase-functions";
import { db } from "../user/create";

export const fetchCars = functions.https.onRequest(async (req, res) => {
  await db
    .collection("cars")
    .get()
    .then((snapshot) => {
      const cars = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      res.send({
        message: "cars fetched",
        cars,
      });
    });
});
