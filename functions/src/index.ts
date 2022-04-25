import { createUser } from "./controller/user/create";
import { authorize } from "./controller/";
import { fetchCars } from "./controller/index";
import { rentCar } from "./controller/rental/rentCar";
import { registerAsCarOwner } from "./controller/rental/registerAsCarOwner";

module.exports = {
  createUser,
  authorize,
  fetchCars,
  rentCar,
  registerAsCarOwner,
};
