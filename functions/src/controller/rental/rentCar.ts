import * as functions from "firebase-functions";
import { db } from "../user/create";
import { uid } from "uid";
import * as admin from "firebase-admin";

db.settings({ ignoreUndefinedProperties: true });
// @ts-ignore
const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export const rentCar = functions.https.onRequest(async (req, res) => {
  const {
    dates,
    carId,
    carOwnerId,
    userId,
    daysCount,
    total,
    startDate,
    endDate,
  } = req.body;

  const rentalCollections = db.collection("rental");

  if (startDate && endDate) {
    dates.map(async (date: string) => {
      const startDateCollections = await db
        .collection("rental")
        .where("carOwnerId", "==", carOwnerId)
        .where("dates", "array-contains", date)
        .get();
      const endDateCollections = await db
        .collection("rental")
        .where("carOwnerId", "==", carOwnerId)
        .where("dates", "array-contains", date)
        .get();
      if (!startDateCollections.empty || !endDateCollections.empty) {
        res.status(500).send({
          message: "car is rented on this date",
        });
        throw new Error();
      }
    });

    const startDateCollections = await db
      .collection("rental")
      .where("carOwnerId", "==", carOwnerId)
      .where("dates", "array-contains", startDate)
      .get();

    const endDateCollections = await db
      .collection("rental")
      .where("carOwnerId", "==", carOwnerId)
      .where("dates", "array-contains", endDate)
      .get();

    functions.logger.debug("info", startDateCollections);

    const field = admin.firestore.FieldValue;
    if (startDateCollections.empty || endDateCollections.empty) {
      await rentalCollections.doc(uid(3)).set({
        carId,
        carOwnerId,
        userId,
        dates,
        daysCount,
        total,
      });
      await db
        .collection("users")
        .doc(userId)
        .update({
          rentedCar: field.increment(1),
        });
      res.send({
        message: "car rented successfully",
      });
    } else {
      res.status(500).send({
        message: "sorry the care is already rented in this date",
      });
    }
  }
});
