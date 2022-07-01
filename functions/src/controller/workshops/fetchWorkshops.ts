import * as functions from "firebase-functions";
import { defaultCors } from "../../cors";
import { db } from "../user/create";
// @ts-ignore

export const fetchWorkshops = functions.https.onRequest(async (req, res) => {
  defaultCors(req, res, async () => {
    const WorkShopdata: any = [];
    const { brandName } = req.body;

    if (!brandName) {
      res.status(404).send({ error: "brand name is required" });
    } else {
      const workshops = await db
        .collection("carWorkshops")
        .doc(brandName)
        .collection("workshops")
        .get();

      workshops.forEach((doc) => {
        functions.logger.debug("doc", doc.id);
        const data = doc.data();
        WorkShopdata.push({
          name: data.name,
          title: data.title,
          geopoint: data.geopoint,
          location: data.location,
          openHours: data.openHours,
          closeHours: data.closeHours,
          id: data.id,
          distance: data.distance,
          description: data.description,
          brandName: brandName,
          docId: doc.id,
          descriptionAr: data.descriptionAr,
          locationAr: data.locationAr,
          phoneNumber: data.phoneNumber,
        });
      });
    }

    return res.status(200).send({ message: "success", WorkShopdata });
  });
});
