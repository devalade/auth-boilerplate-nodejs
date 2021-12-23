const Users = require("../models").user;
const utils = require("../lib/utils");

const login = (req, res, next) => {
  Users.findOne({
    where: { username: req.body.username },
  })
    .then((user) => {
      if (!user) {
        res
          .status(401)
          .json({ success: false, message: "Could not find user" });
      }

      const isValid = utils.validPassword(
        req.body.password,
        user.password,
        user.salt
      );

      if (isValid) {
        const { token, expires } = utils.issueJWT(user);

        res.status(200).json({
          success: true,
          user: user,
          token: token,
          expiresIn: expires,
        });
      } else {
        res
          .status(401)
          .json({ success: false, message: "You entered a wrong password" });
      }
    })
    .catch((err) => next(err));
};

const register = (req, res, next) => {
  const { firstname, lastname, username, password } = req.body;
  const saltHash = utils.genPassword(password);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  // FIXME: Move the create function to services
  Users.create({
    username,
    firstname,
    lastname,
    password: hash,
    salt: salt,
  }).then((user) => {
    const { token, expires } = utils.issueJWT(user);

    res.json({ success: true, user: user, token: token, expiresIn: expires });
  });
};

const googleAuth = (req, res) => {
  console.log("User:", req.user);
  const { token, expires } = utils.issueJWT(req.user);

  res.json({
    success: true,
    user: req.user,
    token: token,
    expiresIn: expires,
  });
};

const githubAuth = (req, res) => {
  console.log("User:", req.user);
  const { token, expires } = utils.issueJWT(req.user);

  res.json({
    success: true,
    user: req.user,
    token: token,
    expiresIn: expires,
  });
};

const facebookAuth = (req, res) => {
  console.log("User:", req.user);
  const { token, expires } = utils.issueJWT(req.user);

  res.json({
    success: true,
    user: req.user,
    token: token,
    expiresIn: expires,
  });
};

module.exports = {
  login,
  register,
  googleAuth,
  githubAuth,
  facebookAuth,
};
