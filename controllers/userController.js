const db = require("../userDB");
const jwt = require("jsonwebtoken");

const refreshTokens = [];

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send("Please fill all fields");
    }

    db.get(`SELECT * FROM users WHERE email=?`, [email], (err, row) => {
      if (err) {
        return res.status(400).send(err);
      }
      if (!row) {
        db.run(
          `INSERT INTO users(name,email,password) VALUES(?,?,?)`,
          [name, email, password],
          (err, row) => {
            if (err) {
              return res.status(400).send(err);
            }
            db.get("SELECT * FROM users WHERE email=?", [email], (err, row) => {
              if (err) {
                return res.status(400).send(err);
              }
              token = jwt.sign(
                { name: name, email: email },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "1h" }
              );
              db.run(
                `INSERT INTO tokens(token,user_id) VALUES(?,?)`,
                [token, row.id],
                (err) => {
                  if (err) {
                    return res.status(400).send("Error while inserting token");
                  }
                  return res
                    .status(200)
                    .json({ msg: "User created successfully", token: token });
                }
              );
            });
          }
        );
      } else {
        return res.status(400).json("User already cerated");
      }
    });
  } catch (err) {
    res.status(400).json({ err });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Please fill all fields");
    }

    db.get(`SELECT * FROM users WHERE email=?`, [email], (err, row) => {
      if (err) {
        return res.status(400).send(err);
      }
      if (!row) {
        return res.status(400).send("No Email with this username exists");
      } else {
        db.get("SELECT * FROM users WHERE email=?", [email], (err, row) => {
          if (err) {
            return res.status(400).send(err);
          }
          token = jwt.sign(
            { name: row.name, email: email, id: row.id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1m" }
          );
          const refreshToken = jwt.sign(
            { name: row.name, email: email, id: row.id },
            process.env.REFRESH_TOKEN_SECRET_KEY,
            { expiresIn: "5m" }
          );
          refreshTokens.push(refreshToken);

          db.run(
            `INSERT INTO tokens(token,user_id) VALUES(?,?)`,
            [token, row.id],
            function (err) {
              if (err) {
                return res.status(400).send("Error while inserting token");
              }
              return res.status(200).json({
                msg: "User logged in successfully",
                token: token,
                refreshToken,
              });
            }
          );
        });
      }
    });
  } catch (err) {
    res.status(400).json({ err });
  }
};

const logOut = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    db.each(
      "SELECT * FROM tokens WHERE user_id=?",
      [req?.user?.id],
      (err, row) => {
        if (err) {
          return res.status(400).send(err);
        }
        if (row) {
          db.run(
            `DELETE FROM tokens
              WHERE id=?`,
            [row.id],
            (err) => {
              if (err) {
                return res.status(400).send(err);
              }
            }
          );
        }
      },
      () => {
        refreshTokens.splice(refreshTokens.indexOf(refreshToken), 1);
        return res.status(400).send("User logged out successfully");
      }
    );
  } catch (err) {
    res.status(400).send(err);
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken == null || !refreshTokens.includes(refreshToken)) {
      return res.status(400).send("Refresh token not found");
    }
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY,
      (err, user) => {
        if (err) return res.status(403).send(err);
        const token = jwt.sign(
          { name: user.name, email: user.email, id: user.id },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "1m",
          }
        );
        const newRefreshToken = jwt.sign(
          { name: user.name, email: user.email, id: user.id },
          process.env.REFRESH_TOKEN_SECRET_KEY,
          { expiresIn: "5m" }
        );

        refreshTokens.splice(
          refreshTokens.indexOf(refreshToken),
          1,
          newRefreshToken
        );

        return res.status(200).send({ token, refreshToken: newRefreshToken });
      }
    );
  } catch (err) {
    res.status(401).send(err);
  }
};

module.exports = { register, logOut, login, refreshToken };
