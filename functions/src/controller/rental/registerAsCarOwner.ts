import * as functions from "firebase-functions";
import { v4 as uuidv4 } from "uuid";

import { db } from "../user/create";

// @ts-ignore
export const registerAsCarOwner = functions.https.onRequest(
  // @ts-ignore
  async (req, res) => {
    const {
      phoneNumber,
      carModel,
      carColor,
      carNumber,
      userId,
      images,
      imageUrl,
      address,
      bodyType,
      modelYear,
      motorType,
      carBrand,
      pricePerDay,
    } = req.body;

    const carId = uuidv4();
    if (
      !phoneNumber ||
      !carModel ||
      !carColor ||
      !carNumber ||
      !userId ||
      !images ||
      !imageUrl ||
      !address ||
      !bodyType ||
      !modelYear ||
      !motorType ||
      !carBrand ||
      !pricePerDay
    ) {
      return res.status(400).send("Please provide all the required fields");
    }
    functions.logger.debug(`${req.body}`);
    const carData = {
      carBrand,
      carColor,
      carId,
      carModel,
      carModelYear: modelYear,
      carOwnerId: userId,
      carType: bodyType,
      carNumber,
      images,
      imageUrl,
      location: address,
      motorType,
      pricePerDay,
      rating: 0,
    };
    await db.collection("cars").doc(carId).set(carData);
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
