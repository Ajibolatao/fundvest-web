// Import packages
import express from "express";
import expressLayout from "express-ejs-layouts";
import methodOverride from "method-override";
import mongoose from "mongoose";
import passport from "passport";
import LocalStrategy from "passport-local";
import bcrypt from "bcrypt";
import session from "express-session";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import multer from "multer";
import flash from "connect-flash";
import axios from 'axios';
import sslRedirect from 'heroku-ssl-redirect'
const app = express();

if (process.env.NODE_ENV !== "production") dotenv.config();

// Import models
import User from "./models/User.js";
import Portfolio from "./models/Portfolio.js";
import Activity from "./models/Activity.js";

// Import middlewares
import middleware from "./middlewares/middleware.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import mainRoutes from "./routes/mainRoutes.js";
import appRoutes from "./routes/appRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

mongoose
  .connect(process.env.DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((done) => console.log(`Connected to DB`))
  .catch((err) => console.log(err));

  // enable ssl redirect
  app.use(sslRedirect.default());
app.set("view engine", "ejs");
// app.set('views', __dirname + '/views')
app.set("layout", "layouts/layout");
app.use(expressLayout);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          return done(null, false, { message: `Email isn't registered` });
        }
        // Check hash password
        bcrypt
          .compare(password, user.password)
          .then((isMatch) => {
            if (isMatch) return done(null, user);
            if (!isMatch)
              return done(null, false, {
                message: `Incorrect password`,
              });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  })
);


// Global middleware
app.use((req, res, next) => {

  res.locals.activeUser = req.user;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.warning_msg = req.flash("warning_msg");
  res.locals.error = req.flash("error");
  return next();
});



// Import routers
app.use("/", authRoutes);
app.use("/", transactionRoutes);
app.use("/", mainRoutes);
app.use("/", appRoutes);
app.use("/plans/", planRoutes);
app.use("/", adminRoutes);

const port = process.env.PORT;
app.listen(port, console.log(`Server @ ${port}`));
