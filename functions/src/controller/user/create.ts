import * as admin from "firebase-admin";
import User from "../../models/User";
import { v4 as uuidv4 } from "uuid";
import * as functions from "firebase-functions";

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const db = admin.firestore();
export const auth = admin.auth();

export const createUser = functions.https.onRequest(
  async (req: functions.https.Request, res: functions.Response<any>) => {
    functions.logger.info("createUser", req.body);
    try {
      const { firstName, lastName, password, email, role } = req.body;

      const user = new User(
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        req.body.password,
        uuidv4()
      );
      const userData = await user.registerUser();
      await db.collection("users").doc(userData.uid).set({
        firstName,
        lastName,
        email: userData.email,
        role,
        userId: userData.uid,
        password,
      });
      const { uid } = await auth.createUser({
        email,
        password,
        displayName: firstName + lastName,
        disabled: false,
      });
      await auth.setCustomUserClaims(uid, {
        role,
      });

      return res.status(201).send({
        message: "user created successfully",
        data: {
          id: uid,
          userData,
        },
      });
    } catch (err) {
      //   @ts-ignore
      return handleError(res, err);
    }
  }
);

function handleError(res: Response, err: any) {
  // @ts-ignore
  return res.status(500).send({ message: `${err.code}-${err.message}` });
}
