const express = require("express");
const cors = require("cors");
const passport = require("passport");
const db = require('./models');

/**
 * ------------- GENERAL SETUP -------------
 */
require("dotenv").config();
const app = express();

require("./config/passport")(passport);

app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

//Sync Database
db.sequelize.sync().then(function() {
 
    console.log('Nice! Database looks fine')
 
}).catch(function(err) {
 
    console.log(err, "Something went wrong with the Database Update!")
 
});


/**
 * ------------- ROUTES ------------------
 */

// Imports all th routes from ./routes/index.js
app.use(require('./routes'))

app.listen(5000, () => {
    console.log("Server is running");
});