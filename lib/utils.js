const crypto = require("crypto");
const jsonwebtoken = require("jsonwebtoken");
const fs = require('fs');
const path = require("path");

const pathToKey = path.join(__dirname, '..', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf-8');

/**
 * ---------------- HELPER FUNCTOIONS ------------------------
 */

function validPassword(password, hash, salt) {
    const hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
    return hash === hashVerify;
}

function genPassword(password) {
    const salt = crypto.randomBytes(32).toString('hex');
    const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return { salt, hash: genHash };
}

/**
 * @param {*} user  - The user object. We need this to set the JWT `sub` payload properly
 */

function issueJWT(user) {
    const { id } = user;
    const expiresIn = '1d';

    const payload = {
        sub: id,
        iat: Date.now()
    };

    const signToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn, algorithm: 'RS256' });

    return {
        token: "Barear " + signToken,
        expires: expiresIn
    };
}

module.exports = {genPassword,validPassword, issueJWT}