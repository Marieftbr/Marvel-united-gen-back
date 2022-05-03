const Session = require("./models/Session");
const { get } = require("lodash");

module.exports = {
  async adminRoute(req, res, next) {
    const match = get(req, "headers.authorization", "").match(/^Bearer (.+)/);
    if (!match) {
      res.status(401).json({ message: "Invalid header" });
      return;
    }
    const providedToken = match[1];
    if (await Session.findOne({ token: providedToken })) {
      next();
    } else {
      res.status(401).json({ message: "Invalid Token" });
    }
  },
};
