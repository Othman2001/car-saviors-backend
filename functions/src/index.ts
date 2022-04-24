import { createUser } from "./controller/user/create";
import { authorize } from "./controller/";
import { fetchCars } from "./controller/index";
import { rentCar } from "./controller/rental/rentCar";
module.exports = {
  createUser,
  authorize,
  fetchCars,
  rentCar,
};
