const jwt = require("jsonwebtoken");
const tokenDb = require("../userDB");

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is requried for authentication");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded jwt value",decoded)
    tokenDb.get(
      "SELECT * FROM tokens WHERE user_id=?",
      [decoded.id],
      (err, row) => {
        if (err) {
          return res.status(400).send(err);
        }
        if (!row) {
          return res.status(400).send("Invalid Token");
        } else {
          req.user = decoded;
          return next();
        }
      }
    );
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }

};

module.exports = verifyToken;
