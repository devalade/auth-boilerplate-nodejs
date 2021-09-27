const fs = require("fs");
const path = require("path");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt
const GoogleStrategy = require("passport-google-oauth20").Strategy;
var GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models').user;


require('dotenv').config();

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf-8');


/**
 * ------------- STRATEDIES OPTION ------------------
 */

// JWT Option
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256']
};
// Google Option
const googleOption = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/users/auth/google/redirect" // FIXME: Check if the url is working 
};
// Github Option
const githubOption = {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/users/auth/github/callback"
};
// Facebook Option
const facebookOption = {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:5000/users/auth/facebook/callback"
};

/**
 * ------------- STRATEGIES ------------------
 */

// JWT strategy 
const strategy = new JwtStrategy(
    jwtOptions,
    (payload, done) => {
        console.log(payload);
        User.findOne({
            where: {
                id: payload.sub
            }
        }).then((user) => {
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
            .catch(err => done(err, null))
    });

// Google strategy  
const googleStrategy = new GoogleStrategy(
    googleOption,
    (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        const defaultUser = {
            'firstname': profile.name.givenName,
            'lastname': profile.name.familyName,
            'email': profile.emails[0].value,
            'password': 'password',
            'username': profile.username,
            'googeId': profile.id
        }
    
        User.findOrCreate({
            where: { googleId: profile.id },
            defaults: defaultUser
        }).then((user) => {
            console.log(user);
            return done(null, user[0]);
        })
            .catch((error) => done(error, null))
    });

// Github strategy
const githubStrategy = new GitHubStrategy(
    githubOption,
    (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        const defaultUser = {
            'firstname': profile.displayName,
            'lastname': "",
            'email': profile.emails[0].value,
            'password': 'password',
            'username': profile.username,
            'githubId': profile.id
        }
    
        User.findOrCreate({
            where: { githubId: profile.id },
            defaults: defaultUser
        }).then((user) => {
            console.log(user);
            return done(null, user[0]);
        })
            .catch((error) => done(error, null))
    }
);

// facebook strategy
const facebookStrategy = new FacebookStrategy(
    facebookOption,
    (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        const defaultUser = {
            'firstname': profile.displayName,
            'lastname': "",
            'email': profile.emails[0].value,
            'password': 'password',
            'username': profile.username,
            'githubId': profile.id
        }
    
        User.findOrCreate({
            where: { githubId: profile.id },
            defaults: defaultUser
        }).then((user) => {
            console.log(user);
            return done(null, user[0]);
        })
            .catch((error) => done(error, null))
    }
);
module.exports = (passport) => {
    passport.use('jwt', strategy);
    passport.use('google', googleStrategy);
    passport.use('github', githubStrategy);
    passport.use('facebook', facebookStrategy);
}