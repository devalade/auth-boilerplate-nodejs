const router = require('express').Router();
const passport = require('passport');
const utils = require('../lib/utils');
const Users = require("../models").user;

// TODO
router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.status(200).json({ success: true, message: "You are authorized!" });
});

// TODO
router.post('/login', (req, res, next) => {
    Users.findOne({
        where: { username: req.body.username }
    }).then((user) => {
        if (!user) {
            res.status(401).json({ success: false, message: "Could not find user" })
        }

        const isValid = utils.validPassword(req.body.password, user.password, user.salt);

        if (isValid) {
            const { token, expires } = utils.issueJWT(user);

            res.status(200).json({ success: true, user: user, token: token, expiresIn: expires })
        } else {
            res.status(401).json({ success: false, message: "You entered a wrong password" });
        }
    }).catch((err) => next(err));
});

//TODO
router.post('/register', (req, res, next) => {
    const { firstname, lastname, username, password } = req.body
    const saltHash = utils.genPassword(password);

    const salt = saltHash.salt;
    const hash = saltHash.hash;
    
    // FIXME: Move the create function to services
    Users.create({
        username,
        firstname,
        lastname,
        password: hash,
        salt: salt
    }).then((user) => {
        const { token, expires } = utils.issueJWT(user);

        res.json({ success: true, user: user, token: token, expiresIn: expires });
    });
});

router.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));
  
router.get("/auth/google/redirect",
    passport.authenticate('google', { failureRedirect: '/login', session: false }), (req, res) => {
        console.log("User:", req.user);
        const { token, expires } = utils.issueJWT(req.user);

        res.json({ success: true, user: req.user, token: token, expiresIn: expires });
    });

router.get('/auth/github',passport.authenticate('github', { scope: [ 'user:email' ] }));

router.get("/auth/github/callback",
    passport.authenticate('github', { failureRedirect: '/login', session: false }),
    (req, res) => {
        console.log("User:", req.user);
        const { token, expires } = utils.issueJWT(req.user);

        res.json({ success: true, user: req.user, token: token, expiresIn: expires });
    });

router.get('/auth/facebook',
    passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    (req, res) => {
        console.log("User:", req.user);
        const { token, expires } = utils.issueJWT(req.user);

        res.json({ success: true, user: req.user, token: token, expiresIn: expires });
    });


module.exports = router;