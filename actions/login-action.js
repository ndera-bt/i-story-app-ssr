const User = require("../model/user");
const PasswordManager = require("../util/password");

exports.userLogin = async (email, password) => {
  const user = await User.findOne({ where: { email: email } });
  if (!user) {
    throw new Error("Invalid email");
  }

  const isEqual = await PasswordManager.verify(password, user.password);
  if (isEqual) {
    return user;
  }
  throw new Error("Invalid password");
};
