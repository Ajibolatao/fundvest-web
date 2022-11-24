import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") dotenv.config();

import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import axios from "axios";
const router = express.Router();

import storage from "../util/cloudinary.js";
const upload = multer({ storage });

// IMPORT MODELS
import User from "../models/User.js";
import Portfolio from "../models/Portfolio.js";
import Activity from "../models/Activity.js";
import Forex from "../models/Forex.js";

// IMPORT MIDDLEWARE
import middleware from "../middlewares/middleware.js";

// IMPORT UTIL
import transporter from '../util/emailTransporter.js';
import creditUserEmail from '../util/emailTemplates/creditUserEmail.js';

// middleware.isLoggedIn, middleware.isAdmin,

// Forex.create({
//   buyingPrice: 560,
//   sellingPrice: 570
// })
// .then(forex => console.log(forex))

// LOCAL
router
  .route("/local")
  .get(middleware.isLoggedIn, middleware.isAdmin, (req, res) => {
    res.render("admin/local");
  });

// ACTIVITIES
router
  .route("/local/activities")
  .get(middleware.isLoggedIn, middleware.isAdmin, (req, res) => {
    Activity.find({})
      .populate("user")
      .then((activities) => {
        res.render("admin/activities", { activities });
      })
      .catch((err) => console.log(err));
  });

// ALL SUBSCRIPTIONS ACTIVITIES
router
  .route("/local/activities/subscriptions")
  .get(middleware.isLoggedIn, middleware.isAdmin, (req, res) => {
    Activity.find({ type: "subscription" })
      .populate("user")
      .then((activities) => {
        res.render("admin/activities", { activities });
      })
      .catch((err) => console.log(err));
  });

// ALL REQUESTS
router
  .route("/local/activities/request")
  .get(middleware.isLoggedIn, middleware.isAdmin, (req, res) => {
    Activity.find({ type: "request" })
      .populate("user")
      .then((activities) => {
        res.render("admin/activities", { activities });
      })
      .catch((err) => console.log(err));
  });

// ALL PENDING REQUESTS
router
  .route("/local/activities/request/pending")
  .get(middleware.isLoggedIn, middleware.isAdmin, (req, res) => {
    Activity.find({ status: "pending" })
      .populate("user")
      .then((activities) => {
        res.render("admin/activities", { activities });
      })
      .catch((err) => console.log(err));
  });

// ALL SUCCESSFUL REQUESTS
router
  .route("/local/activities/request/successful")
  .get(middleware.isLoggedIn, middleware.isAdmin, (req, res) => {
    Activity.find({ status: "successful" })
      .populate("user")
      .then((activities) => {
        res.render("admin/activities", { activities });
      })
      .catch((err) => console.log(err));
  });

// ALL FAILED REQUESTS
router
  .route("/local/activities/request/failed")
  .get(middleware.isLoggedIn, middleware.isAdmin, (req, res) => {
    Activity.find({ status: "failed" })
      .populate("user")
      .then((activities) => {
        res.render("admin/activities", { activities });
      })
      .catch((err) => console.log(err));
  });

// BANK DEPOSIT
// CREDIT WALLET
router
  .route("/credit-wallet/activity/:activityId")
  .put(middleware.isLoggedIn, middleware.isAdmin, (req, res) => {
    const { activityId } = req.params;
    let { amount, status } = req.body;
    amount = Number(amount);

    // FIND ACTIVITY
    Activity.findOne({ _id: activityId })
      .then((activity) => {
        // FIND THE USER
        User.findOne({ _id: activity.user })
          .then((user) => {
            // IF ACCEPT THE ACTIVITY
            if (status === "successful") {
              // UPDATE USER WALLET
              User.findOneAndUpdate(
                { _id: activity.user },
                { nairaWallet: user.nairaWallet + amount }
              ).then((user2) => {});

              // UPDATE ACTIVITY
              Activity.findOneAndUpdate(
                { _id: activityId },
                { status: "successful" }
              ).then((activity2) => {});

              // SEND MAIL
              const amountString = Number(amount)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

              // send mail with defined transport object
              let option1 = {
                // from: `FUNDVEST CREDIT <${process.env.SENDINBLUE_ADDRESS}>`, // sender address
                from: `FUNDVEST CREDIT <noreply@fundvest.ng>`, // sender address
                to: process.env.BUSINESS_EMAIL, // list of receivers
                subject: "Credit user", // Subject line
                text: "You have creditted a user", // plain text body
                html: `<p>User info </p><p>Email address: ${
                  user.email
                }</p><p>Amount: ${Number(amount)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>`, // html body
              };
              let option2 = {
                // from: `FUNDVEST CREDIT <${process.env.SENDINBLUE_ADDRESS}>`, // sender address
                from: `FUNDVEST CREDIT <noreply@fundvest.ng>`, // sender address
                to: email, // list of receivers
                subject: "Account creditted", // Subject line
                // html: `<p>Hello ${
                //   user.email
                // }</p><p>Your account has been creditted with: ${Number(amount)
                //   .toString()
                //   .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>`,
                html: creditUserEmail(
                  user2.firstname,
                  user2.lastname,
                  "Fundvest",
                  amountString
                ),
              };
              transporter
                .sendMail(option1)
                .then((success) => console.log(success))
                .catch((err) => console.log(err));
              transporter
                .sendMail(option2)
                .then((success) => console.log(success))
                .catch((err) => console.log(err));

              // MAIL ENDS HERE
            }

            // IF TO FAIL THE ACTIVITY
            if (status === "failed") {
              // UPDATE ACTIVITY
              Activity.findOneAndUpdate(
                { _id: activityId },
                { status: "failed" }
              ).then((activity2) => {});
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));

    res.redirect("/local/activities");
  });

// BANK WITHDRAWAL
// DEBIT WALLET
router
  .route("/debit-wallet/activity/:activityId")
  .put(middleware.isLoggedIn, middleware.isAdmin, (req, res) => {
    const { activityId } = req.params;
    let { amount, status } = req.body;
    amount = Number(amount);

    // FIND ACTIVITY
    Activity.findOne({ _id: activityId }).then((activity) => {
      // FIND THE USER
      User.findOne({ _id: activity.user })
        .then((user) => {
          // IF ACCEPT THE ACTIVITY
          if (status === "successful") {
            // UPDATE USER WALLET
            User.findOneAndUpdate(
              { _id: activity.user },
              { nairaWallet: user.nairaWallet - amount }
            )
              .then((user2) => {})
              .catch((err) => console.log(err));


            // UPDATE ACTIVITY
            Activity.findOneAndUpdate(
              { _id: activityId },
              { status: "successful" }
            )
              .then((activity2) => {})
              .catch((err) => console.log(err));


            // SEND MAIL
            const amountString = Number(amount)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            // send mail with defined transport object
            let option1 = {
              // from: `FUNDVEST DEBIT <${process.env.SENDINBLUE_ADDRESS}>`, // sender address
              from: `FUNDVEST DEBIT <noreply@fundvest.ng>`, // sender address
              to: process.env.BUSINESS_EMAIL, // list of receivers
              subject: "Bank Withdrawal", // Subject line
              text: "You have paid a user", // plain text body
              html: `<p>User info </p><p>Email address: ${
                user.email
              }</p><p>Amount: ${Number(amount)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>`, // html body
            };
            let option2 = {
              from: `FUNDVEST DEBIT <noreply@fundvest.ng>`, // sender address
              to: user.email, // list of receivers
              subject: "Bank Withdrawal", // Subject line
              // html: `<p>Hello ${
              //   user.email
              // }</p><p>Your bank account has been creditted with: ${Number(amount)
              //   .toString()
              //   .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>`,
              html: creditUserEmail(
                user2.firstname,
                user2.lastname,
                "Fundvest",
                amountString
              ),
            };
            transporter
              .sendMail(option1)
              .then((success) => console.log(success))
              .catch((err) => console.log(err));
            transporter
              .sendMail(option2)
              .then((success) => console.log(success))
              .catch((err) => console.log(err));

            // MAIL ENDS HERE
          }

          // IF TO FAIL THE ACTIVITY
          if (status === "failed") {
            // UPDATE ACTIVITY
            Activity.findOneAndUpdate({ _id: activityId }, { status: "failed" })
              .then((activity2) => {})
              .catch((err) => console.log(err));

          }
        })
        .catch((err) => console.log(err));

    });
    res.redirect("/local/activities");
  });

  // DEBIT WALLET
router
  .route("/local/search-user")
  .get(middleware.isLoggedIn, middleware.isAdmin, (req, res) => {
    let customerId;

    // CHECK IF CUSTOMERID ID FILLED
    req.body.customerId === undefined
      ? (customerId = "")
      : (customerId = req.body.customerId);

    User.findOne({ customerId }).then((user) => {
      res.render("admin/search-user", { user });
    });
  })
  .post(middleware.isLoggedIn, middleware.isAdmin, (req, res) => {
    const { customerId } = req.body;

    // FIND USER
    User.findOne({ customerId })
      .then((user) => {
        return res.render("admin/search-user", { user });
      })
      .catch((err) => console.log(err));

  });


// FOREX PRICE
router
  .route("/local/set-forex")
  .get(middleware.isLoggedIn, middleware.isAdmin, (req, res) => {
    res.render('admin/set-forex')
  })
  .put(middleware.isLoggedIn, middleware.isAdmin, async (req, res) => {
    const {buyingPrice, sellingPrice} = req.body;

    const forex = await Forex.findOneAndUpdate(
      { name: 'fundvest' },
      { buyingPrice, sellingPrice }, {new: true}
    );

    res.redirect('/local')
  })


export default router;
