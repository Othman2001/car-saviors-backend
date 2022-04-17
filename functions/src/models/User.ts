import { db } from "../controller/user/create";
import { auth } from "../controller/user/create";
class User {
  public firstName: string;
  public lastName: string;
  public email: string;
  public password: string;
  public id: string;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    id: string
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.id = id;
  }

  public async registerUser() {
    const userData = {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
    };
    db.collection("users").doc(userData.id).set(userData);
    const user = await auth.createUser({
      uid: this.id,
      email: this.email,
      password: this.password,
      displayName: this.firstName + " " + this.lastName,
      disabled: false,
      emailVerified: true,
    });
    return user;
  }
}

export default User;
