const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes/auth-route");
const profileRoute = require("./routes/profile-route");
const passport = require("passport");
require("./config/passport");
const session = require("express-session");
const flash = require("connect-flash");

// mongoose connect to mongodb atlas (.connect(URL)裏頭有acc:pin所以藏在.env)
mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlparser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connect to mongodb atlas.");
  })
  .catch((err) => {
    console.log(err);
  });

// middleware
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 包含bodyparser

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
// Setting User's browser can stores cookies(flash)
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg"); // 這邊設定 sucess_msg & error_msg 同時可以用於views-ejs
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use("/auth", authRoute); // 當操作符合/auth就連結到authRoute執行./routes/auth-route.js程式碼
app.use("/profile", profileRoute);

// request
app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});

app.listen(8080, () => {
  console.log("Sever is runing on port 8080.");
});
