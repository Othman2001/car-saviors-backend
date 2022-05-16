import { createUser } from "./controller/user/create";
import { authorize } from "./controller/";
import { fetchCars } from "./controller/index";
import { rentCar } from "./controller/rental/rentCar";
import { registerAsCarOwner } from "./controller/rental/registerAsCarOwner";
import { fetchBrands } from "./controller/workshops/fetchBrands";
import { fetchWorkshops } from "./controller/workshops/fetchWorkshops";
import { fetchWorkshop } from "./controller/workshops/fetchWorkshop";
import { bookDate } from "./controller/workshops/book";
module.exports = {
  createUser,
  authorize,
  fetchCars,
  rentCar,
  registerAsCarOwner,
  fetchBrands,
  fetchWorkshops,
  fetchWorkshop,
  bookDate,
};
