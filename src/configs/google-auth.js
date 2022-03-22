const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require("passport")
const { v4: uuidv4 } = require('uuid');

const User = require("../models/user.models")

require("dotenv").config()

passport.use(new GoogleStrategy({
    clientID: process.env.GGL_SECRETID,
    clientSecret: process.env.GGL_CLIENT,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {

    let user = await User.findOne({email : profile?._json?.email}).lean().exec()

    if(!user){
        user = await User.create({
            email : profile._json.email,
            password : uuidv4(), 
            role : ["customer"]
        })
    }

    console.log(user)
    return cb(null, user);
  }
));

module.exports = passport;