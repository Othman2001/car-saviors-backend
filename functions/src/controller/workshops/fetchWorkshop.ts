import * as functions from "firebase-functions";
import { db } from "../user/create";
// @ts-ignore
export const fetchWorkshop = functions.https.onRequest(async (req, res) => {
  const workshopRef = db.collection(`carWorkshops/BYD`);

  const workshop = await workshopRef.get();
  workshop.forEach((doc) => {
    const data = doc.data();
    res.status(200).send({
      message: "this is actually working",
      data,
    });
  });

  return res.status(200).send({ message: "success" });
});
