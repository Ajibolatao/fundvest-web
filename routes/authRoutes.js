import express from "express";
import passport from "passport";
import bcrypt from "bcrypt";
const router = express.Router();
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import axios from "axios";

// IMPORT MODELS
import User from "../models/User.js";

// IMPORT UTILS
import transporter from "../util/emailTransporter.js";
import signUpEmail from "../util/emailTemplates/signUpEmail.js";
import requestResetPassword from "../util/emailTemplates/requestResetPassword.js";
import updateResetPassword from "../util/emailTemplates/updateResetPassword.js";

if (process.env.NODE_ENV !== "production") dotenv.config();

// Signup
router
  .get("/signup", (req, res) => res.render(`app/signup`))
  .post("/signup", (req, res) => {
    let { firstname, lastname, email, tel, referralCode, password, password2 } =
      req.body;

    // Incase nothing is entered
    referralCode === ""
      ? (referralCode = 0)
      : (referralCode = Number(referralCode));

    const personalReferralCode = Math.floor(Math.random() * 1000000);

    let errors = [];

    // Check password match

    if (password !== password2) {
      errors.push({ msg: "Password do not match" });
    }

    // Check password length
    if (password.length < 6) {
      errors.push({ msg: "Password should be at least 6 characters" });
    }

    if (errors.length > 0) {
      res.render(`app/signup`, { firstname, lastname, email, tel, errors });
    } else {
      // User validation
      User.findOne({ email })
        .then((user) => {
          // If user exists
          if (user) {
            errors.push({ msg: "Email already exists" });
            res.render(`app/signup`, {
              firstname,
              lastname,
              email,
              tel,
              errors,
              referralCode,
              personalReferralCode,
            });
          } else {
            User.find()
              .sort({ customerId: -1 })
              .then((users) => {
                // CREATE A NEW USER

                let customerId = Math.floor(Math.random() * 10000000);
                // Create Verification Code
                const verificationCode = Math.floor(Math.random() * 1000000000);
                bcrypt.genSalt(10).then((salt) => {
                  bcrypt
                    .hash(password, salt)
                    .then((hash) => {
                      password = hash;
                      User.create({
                        customerId,
                        firstname,
                        lastname,
                        email,
                        tel,
                        password,
                        verificationCode,
                        referralCode,
                        personalReferralCode,
                      })
                        .then((user) => {
                          const verificationRoute = `${process.env.BASE_URL}verify-users/${verificationCode}`;

                          // send mail with defined transport object
                          let options = {
                            // from: `Fundvest <${process.env.SENDINBLUE_ADDRESS}>`, // sender address
                            from: `Fundvest <noreply@fundvest.ng>`, // sender address
                            to: email, // list of receivers
                            subject: "Confirmation Mail", // Subject line
                            // html: `<p>Please Click <a href="${process.env.BASE_URL}verify-users/${verificationCode}">HERE</a> to verify your email</p>`,
                            html: signUpEmail(
                              user.firstname,
                              user.lastname,
                              verificationRoute
                            ),
                          };
                          transporter
                            .sendMail(options)
                            .then((success) => console.log(success))
                            .catch((err) => console.log(err));

                          req.flash(
                            "success_msg",
                            "Please check your email form confirmation"
                          );
                          res.redirect("/signin");
                        })
                        .catch((err) => console.log(err));
                    })
                    .catch((err) => console.log(err));
                });
              })
              .catch((err) => console.log(err));
          }
        })
        .catch((err) => console.log(err));
    }
  });

// Signin
router
  .route("/signin")
  .get((req, res) => res.render(`app/signin`))
  .post(
    passport.authenticate("local", {
      failureRedirect: "/signin",
      failureFlash: true,
      successFlash: true,
    }),
    (req, res) => {
      // GET INTERNET TIME
      axios
        .get("http://worldtimeapi.org/api/timezone/Africa/Lagos")
        .then((resp) => {
          const loggedInTime = new Date(resp.data.unixtime * 1000);

          // UPDATE USER LOGGED IN TIME
          User.findOneAndUpdate({ email: req.user.email }, { loggedInTime })
            .then((user) => {
              res.redirect("/dashboard");
            })
            .catch((err) => console.log(err));
        });
    }
  );

// signout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// Verify User
router.route("/verify-users/:id").get((req, res) => {
  User.findOneAndUpdate(
    { verificationCode: req.params.id },
    { isVerified: true, verificationCode: "" }
  )
    .then((user) => {
      res.redirect("/signin");
    })
    .catch((err) => console.log(err));
});

// Reset Password
router
  .route("/reset-pasword")
  .get((req, res) => res.render("app/reset_password"))
  .post((req, res) => {
    const { email } = req.body;

    const resetPasswordCode = Math.floor(Math.random() * 10000000);

    User.findOneAndUpdate({ email }, { resetPasswordCode })
      .then((user) => {
        // If there is no user
        if (!user) {
          req.flash("warning_msg", "Email is not registered");
          return res.redirect("/reset-pasword");
        } else {
          // If there is a user

          // Send mail to email

          const resetPasswordRoute = `${process.env.BASE_URL}reset-password/${email}/${resetPasswordCode}`;
          let options = {
            // from: `Fundvest <${process.env.SENDINBLUE_ADDRESS}>`, // sender address
            from: `Fundvest <noreply@fundvest.ng>`, // sender address
            to: email, // list of receivers
            subject: "Reset password", // Subject line
            html: requestResetPassword(
              user.firstname,
              user.lastname,
              resetPasswordRoute
            ),
          };
          transporter
            .sendMail(options)
            .then((success) => console.log("successful"))
            .catch((err) => console.log(err));

          req.flash("success_msg", "Please check your email address");
          res.redirect("/reset-pasword");
        }
      })
      .catch((err) => console.log(err));
  });

// Change Password
router
  .route("/reset-password/:email/:resetPasswordCode")
  .get((req, res) => {
    const { email, resetPasswordCode } = req.params;
    res.render("app/change_password.ejs", { email, resetPasswordCode });
  })
  .post((req, res) => {
    const { email, resetPasswordCode } = req.params;
    let { password, password2 } = req.body;

    // Confirm resetPassowrdCode
    User.findOne({ email })
      .then((foundUser) => {
        // If email and rsesetPasswordCode match
        if (foundUser.resetPasswordCode === Number(resetPasswordCode)) {
          let errors = [];

          // Check password match

          if (password !== password2) {
            errors.push({ msg: "Password do not match" });
          }

          // Check password length
          if (password.length < 6) {
            errors.push({ msg: "Password should be at least 6 characters" });
          }

          if (errors.length > 0) {
            res.render(`app/change_password`, {
              email,
              resetPasswordCode,
              errors,
            });
          } else {
            bcrypt.genSalt(10).then((salt) => {
              bcrypt
                .hash(password, salt)
                .then((hash) => {
                  password = hash;

                  User.findOneAndUpdate(
                    { email },
                    { password, resetPasswordCode: 0 }
                  )
                    .then((user) => {
                      // send mail with defined transport object
                      let options = {
                        // from: `Fundvest <${process.env.SENDINBLUE_ADDRESS}>`, // sender address
                        from: `Fundvest <noreply@fundvest.ng>`, // sender address
                        to: email, // list of receivers
                        subject: "Password changed", // Subject line
                        text: "You have succesfully change your password", // plain text body
                        html: updateResetPassword(
                          user.firstname,
                          user.lastname
                        ),
                      };
                      transporter
                        .sendMail(options)
                        .then((success) => console.log(success))
                        .catch((err) => console.log(err));

                      req.flash("success_msg", "You have change your password");
                      res.redirect("/signin");
                    })
                    .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));
            });
          }
        } else {
          req.flash("warning_msg", "Something went wrong");
          res.redirect("/");
        }
      })
      .catch((err) => console.log(err));
  });

export default router;
