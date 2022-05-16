import * as functions from "firebase-functions";
import { db } from "../user/create";
// @ts-ignore
export const fetchWorkshop = functions.https.onRequest(async (req, res) => {
  const { brandName } = req.body;

  if (!brandName) {
    res.status(404).send({ error: "brand name is required" });
  } else {
    const workshops = await db
      .collection("carWorkshops")
      .doc(brandName)
      .collection("workshops")
      .doc("mohamed")
      .get();
    functions.logger.debug("doc", workshops.data());
    const data = workshops.data();
    res.send({
      data,
    });
  }

  return res.status(200).send({ message: "success" });
});
