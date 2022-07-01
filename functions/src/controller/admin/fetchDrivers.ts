import * as functions from "firebase-functions";
import { defaultCors } from "../../cors";
import { db } from "../user/create";
// @ts-ignore
export const fetchDriversAdmin = functions.https.onRequest(async (req, res) => {
  defaultCors(req, res, async () => {
    const winchDrivers = await db.collection("winchDrivers").get();

    functions.logger.debug(req.body, "body");

    let drivers: any[] = [];

    winchDrivers.forEach((doc) => {
      const data = doc.data();
      functions.logger.debug("before");
      functions.logger.debug("data", data.geopoint);

      drivers.push({
        firstName: data.firstName,
        lastName: data.lastName,
        id: data.id,
        geopoint: data.geopoint,
        availability: data.availability,
        phoneNumber: data.phoneNumber,
      });
    });

    return res.status(200).send({ message: "success ", drivers: drivers });
  });
});
