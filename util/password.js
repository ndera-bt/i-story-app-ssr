const bcrypt = require("bcrypt");

class PasswordManager {
  static async hash(password, saltRound = 12) {
    return await bcrypt.hash(password, saltRound);
  }

  static async verify(password, userPass) {
    return await bcrypt.compare(password, userPass);
  }
}

module.exports = PasswordManager;
