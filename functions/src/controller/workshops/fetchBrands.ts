import * as functions from "firebase-functions";
import { db } from "../user/create";

export const fetchBrands = functions.https.onRequest(async (req, res) => {
  await db.collection("carWorkshops").doc("kia").listCollections();
  let brands: any = [];
  await db
    .collection("carWorkshops")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        functions.logger.debug("doc", doc.data());
        brands.push({ name: doc.id, imageUrl: doc.data().imageUrl });
      });
    });
  res.status(200).send({ brands });
});
