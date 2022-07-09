const User = require("../model/user");
const PasswordManager = require("../util/password");

exports.userLogin = async (email, password) => {
  const user = await User.findOne({ where: { email: email } });

  if (!user || !(await PasswordManager.verify(password, user.password))) {
    throw new Error("Invalid credentials");
  }

  return user;
};
