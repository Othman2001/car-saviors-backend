import * as functions from "firebase-functions";
import { defaultCors } from "../../cors";
import { db } from "../user/create";
const haversine = require("haversine");
// @ts-ignore
export const fetchDrivers = functions.https.onRequest(async (req, res) => {
  defaultCors(req, res, async () => {});
  const winchDrivers = await db.collection("winchDrivers").get();
  const { lat, lng } = req.body;

  functions.logger.debug(req.body, "body");

  let drivers: any[] = [];
  let Drivers: any[] = [];

  winchDrivers.forEach((doc) => {
    const data = doc.data();
    functions.logger.debug("before");

    if (data.availability === true) {
      functions.logger.debug("data", data.geopoint);

      const start = {
        latitude: lat,
        longitude: lng,
      };
      const end = {
        latitude: data.geopoint.latitude || data.geopoint._latitude,
        longitude: data.geopoint.longitude || data.geopoint._longitude,
      };
      functions.logger.debug(haversine(start, end), "harv");
      const distnace = haversine(start, end);
      functions.logger.debug("distance", distnace);

      drivers.push({
        firstName: data.firstName,
        lastName: data.lastName,
        id: data.id,
        geopoint: data.geopoint,
        availability: data.availability,
        distance: distnace,
        phoneNumber: data.phoneNumber,
        price: distnace * 100,
      });
      const sortedDrivers = drivers.sort(function (a: any, b: any) {
        return a.distance - b.distance;
      });
      const length = sortedDrivers.length - 1;
      sortedDrivers[length].isLastDriver = true;
      Drivers = sortedDrivers;
    }
  });

  return res.status(200).send({ message: "success ", drivers: Drivers });
});
