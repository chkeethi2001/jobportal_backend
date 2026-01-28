// hash.js
import bcrypt from "bcryptjs";

const plainPassword = "SuperAdmin@123";

bcrypt.hash(plainPassword, 10).then((hashed) => {
  console.log("Hashed password:", hashed);
});
