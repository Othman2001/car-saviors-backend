import * as functions from "firebase-functions";
import { v4 as uuidv4 } from "uuid";

import { db } from "../user/create";

// @ts-ignore
export const registerAsCarOwner = functions.https.onRequest(
  async (req, res) => {
    const {
      phoneNumber,
      carModel,
      carColor,
      carNumber,
      userId,
      images,
      imageUrl,
    } = req.body;

    const carId = uuidv4();
    await db.collection("cars").doc(carId).set({
      phoneNumber,
      carId,
      carOwnerId: userId,
      carModel,
      carColor,
      carNumber,
      images,
      imageUrl,
    });
    await db.collection("users").doc(userId).update({
      role: "car-owner",
    });
    await db.collection("carOwners").doc(userId).set({
      carOwnerId: userId,
      phoneNumber,
      carId,
    });
    res.send({
      message: "we will contact you soon",
    });
  }
);
