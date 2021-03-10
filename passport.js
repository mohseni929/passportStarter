const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userController = require("../controllers/userController");
const GitHubStrategy = require('passport-github').Strategy;
const localLogin = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  (email, password, done) => {
    const user = userController.getUserByEmailIdAndPassword(email, password);
    return user
      ? done(null, user)
      : done(null, false, {
          message: "Your login details are not valid. Please try again",
        });
  }
);

const github = new GitHubStrategy({
    clientID: "e6395cf4141a38a730a5",
    clientSecret: "6d6bb2b984887726a7490adab020b0201958b87c",
    callbackURL: "http://127.0.0.1:8000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    const user = userController.getUserById(profile.id);
    return user
    ? cb(null, user)
    : cb(null, false, {
      message: "Your login details are invalid. Please try again",
    })
  });

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  let user = userController.getUserById(id);
  if (user) {
    done(null, user);
  } else {
    done({ message: "User not found" }, null);
  }
});

module.exports = passport.use(localLogin), passport.use(github);
