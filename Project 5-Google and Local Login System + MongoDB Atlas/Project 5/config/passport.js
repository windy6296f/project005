const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");

const User = require("../models/user-model");

// Create Cookies
//_id為mongoDB幫每一筆資料做的id的key
// done為callback function null為預設值
passport.serializeUser((user, done) => {
  console.log("Serializing user now");
  done(null, user._id);
});
passport.deserializeUser((_id, done) => {
  console.log("Deserializing user now");
  User.findById({ _id }).then((user) => {
    console.log("Found user");
    done(null, user);
  });
});

// 本地端帳號登入設定
passport.use(
  new LocalStrategy((username, password, done) => {
    console.log(username, password);
    User.findOne({ email: username })
      .then(async (user) => {
        if (!user) {
          return done(null, false);
        }
        await bcrypt.compare(password, user.password, function (err, result) {
          if (err) {
            return done(null, false);
          }
          if (!result) {
            return done(null, false);
          } else {
            return done(null, user);
          }
        });
      })
      .catch((err) => {
        return done(null, false);
      });
  })
);

// google帳號連動登入設定
// ID及Sercret = 用GoogleCloud申請OAuth2.0用戶端憑證的ID及PIN (專案名稱:Front-end Project05)
// ID及Sercret 加密資訊藏在.env
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // callbackURL須設定在GoogleCloud憑證用戶端的授權導向URL http://localhost:8080/auth/google/redirect
      // 為以gmail連結登入後導向的網址
      callbackURL: "/auth/google/redirect",
    },
    // done = Passport Verify Callback function
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleID: profile.id }).then((foundUser) => {
        if (foundUser) {
          console.log("User already exist");
          done(null, foundUser);
        } else {
          new User({
            name: profile.displayName,
            googleID: profile.id,
            thumnail: profile.photos[0].value,
            email: profile.emails[0].value,
          })
            .save()
            .then((newUser) => {
              console.log("New user created.");
              done(null, newUser);
            });
        }
      });
    }
  )
);
