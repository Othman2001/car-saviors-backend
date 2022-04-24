import * as functions from "firebase-functions";
import { db } from "../user/create";
import { uid } from "uid";
db.settings({ ignoreUndefinedProperties: true });
// @ts-ignore
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
        res.status(404).send({
          messsage: "map worked",
        });
        return;
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

    if (startDateCollections.empty || endDateCollections.empty) {
      res.status(200);
      await rentalCollections.doc(uid(3)).set({
        carId,
        carOwnerId,
        userId,
        dates,
        daysCount,
        total,
      });
      res.send({
        message: "you can rent the car in this date",
      });
    } else {
      res.status(500);
      res.send({
        message: "no data",
      });
    }
  }

  // if (resrvedDatesStart.empty && resrvedDatesEnd.empty) {
  //   await rentCollections.doc(uid(3)).set({
  //     carId,
  //     carOwnerId,
  //     userId,
  //     dates,
  //     daysCount,
  //   });

  //   res.status(200).send({
  //     message: "done",
  //   });
  // } else if (!resrvedDatesStart.empty || !resrvedDatesEnd) {
  //   res.status(500).send({
  //     message: "rent not okay",
  //   });
  // }
});
