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
import Forex from '../models/Forex.js'

// IMPORT MIDDLEWARE
import middleware from "../middlewares/middleware.js";

// IMPORT UTIL
import transporter from '../util/emailTransporter.js'

// Dashboard
router.route("/dashboard").get(middleware.isLoggedIn, (req, res) => {
  // FIND A USER
  User.findOne({ email: req.user.email })
    .populate("portfolios")
    .then((user) => {
      let investments = 0;
      let interests = 0;

      // GET PRESENT TIME
      const todaysDate = req.user.loggedInTime;

      // Update Portfolio details
      user.portfolios.forEach((portfolio) => {
        const secInDays = 60 * 60 * 24;

        const passedTimeinSec =
          (todaysDate.getTime() - portfolio.startDate.getTime()) / 1000;

        // Passed Days
        const passedDays = passedTimeinSec / secInDays;

        // IF PORTFOLIO IS NOT MATURED
        if (portfolio.dueDate.getTime() > todaysDate.getTime()) {
          // Current Interest
          const currentInterest = portfolio.dailyInterest * passedDays;

          // Current Amount
          const currentAmount = portfolio.principal + currentInterest;
          Portfolio.findOneAndUpdate(
            { portfolioId: portfolio.portfolioId },
            { currentInterest, currentAmount }
          )
            .then((trans2) => {})
            .catch((err) => console.log(err));

        } else {
          // IF INTEREST MATURES

          // IF WE HAVEN'T PAID THE USER
          if (portfolio.isPaid === false) {
            // PAY THE USER
            user.nairaWallet = user.nairaWallet + portfolio.proposedTotalAmount;

            // UPDATE IS PAID
            Portfolio.findOneAndUpdate(
              { portfolioId: portfolio.portfolioId },
              { isMatured: true, isPaid: true }
            )
              .then((port) => {})
              .catch((err) => console.log(err));
          }
        }
      });
    })
    .catch((err) => console.log(err));


    // ADD INVESTMENTS AND INTEREST
    User.findOne({ email: req.user.email })
      .populate("portfolios")
      .exec()
      .then((user) => {
        let investments = 0;
        let interests = 0;

        // GET ALL PORTFOLIOS
        user.portfolios.forEach((portfolio) => {
          // GET THE PRINCIPALS OF RUNNING PORTFOLIO
          if (portfolio.isMatured !== true) {
            investments += portfolio.principal;
            interests += portfolio.currentInterest;
          }
        });
        res.render(`app/dashboard`, { user, investments, interests });
      })
      .catch((err) => console.log(err));
});

// Profile
router.get("/profile", middleware.isLoggedIn, (req, res) => {
  User.findOne({ email: req.user.email })
    .populate("portfolios")
    .exec()
    .then((user) => {
      res.render(`app/profile`, { user });
    })
    .catch((err) => console.log(err));
});

// Portfolio
router.get("/portfolio", middleware.isLoggedIn, (req, res) => {
  // FIND USER
  User.findOne({ email: req.user.email })
    .populate("portfolios")
    .then((user) => {
      

      // GET PRESENT TIME
      const todaysDate = req.user.loggedInTime;

      // Update Portfolio details
      user.portfolios.forEach((portfolio) => {
        const secInDays = 60 * 60 * 24;

        const passedTimeinSec =
          (todaysDate.getTime() - portfolio.startDate.getTime()) / 1000;

        // Passed Days
        const passedDays = passedTimeinSec / secInDays;

        // IF PORTFOLIO IS NOT MATURED
        if (portfolio.dueDate.getTime() > todaysDate.getTime()) {
          // Current Interest
          const currentInterest = portfolio.dailyInterest * passedDays;

          // Current Amount
          const currentAmount = portfolio.principal + currentInterest;
          Portfolio.findOneAndUpdate(
            { portfolioId: portfolio.portfolioId },
            { currentInterest, currentAmount }
          )
            .then((trans2) => {})
            .catch((err) => console.log(err));
        } else {
          // IF INTEREST MATURES

          // IF WE HAVEN'T PAID THE USER
          if (portfolio.isPaid === false) {
            // PAY THE USER
            user.nairaWallet = user.nairaWallet + portfolio.proposedTotalAmount;

            // UPDATE IS PAID
            Portfolio.findOneAndUpdate(
              { portfolioId: portfolio.portfolioId },
              { isMatured: true, isPaid: true }
            )
              .then((port) => {})
              .catch((err) => console.log(err));
          }
        }
      });

      // SHOW PORTFOLIO
      User.findOne({ email: req.user.email })
        .populate("portfolios")
        .then((user) => {
          res.render("app/portfolio", { portfolios: user.portfolios });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

// Wallet
router.get("/wallet", middleware.isLoggedIn, (req, res) => {
  User.findOne({ email: req.user.email })
    .populate("portfolios")
    .exec()
    .then((user) => {
      let investments = 0;
      let interests = 0;

      // GET ALL PORTFOLIOS
      user.portfolios.forEach((portfolio) => {
        // GET THE PRINCIPALS OF RUNNING PORTFOLIO
        if (portfolio.isMatured !== true) {
          investments += portfolio.principal;
          interests += portfolio.currentInterest;
        }
      });
      res.render(`app/wallet`, { user, investments, interests });
    })
    .catch((err) => console.log(err));
});

// BACK
router.get("/back", middleware.isLoggedIn, (req, res) => {
  res.redirect(prevUrl);
});

// LOG OUT
router.get("/logout", middleware.isLoggedIn, (req, res) => {
  req.logout();
  res.redirect("/signin");
});

// UPLOAD ID
router
  .route("/uploadID")
  .post(middleware.isLoggedIn, upload.single("idCard"), (req, res) => {
    let path;
    let filename;
    let idCard = "";

    if (req.file != null) {
      path = req.file.path;
      filename = req.file.filename;
      idCard = { path, filename };
    }

    let change = [];

    const { gender, DOB } = req.body;

    if (idCard !== "") {
      User.findOneAndUpdate({ email: req.user.email }, { idCard }).then(
        (user) => console.log("ID added")
      );
      change.push("ID added");
    }
    if (gender != null) {
      User.findOneAndUpdate({ email: req.user.email }, { gender }).then(
        (user) => console.log("Gender added")
      );
      change.push("Gender added");
    }
    if (DOB !== "") {
      User.findOneAndUpdate({ email: req.user.email }, { DOB }).then((user) =>
        console.log("DOB added")
      );
      change.push("DOB added");
    }

    if (change.length > 0) {
      req.flash("success_msg", "You have updated your profile");
      res.redirect("/profile");
    } else {
      req.flash("warning_msg", "Nothing to add");
      res.redirect("/profile");
    }
  });

// ADD BANK ACCOUNT
router.route("/add-bank-account").post((req, res) => {
  const { bankName, accountName, accountNumber } = req.body;

  User.findOne({ email: req.user.email }).then((user) => {
    // IF THE ADDED ACCOUNTS IS LESS THAN THREE
    if (user.banks.length < 2) {
      user.banks.push({ bankName, accountName, accountNumber });
      user.save();
      req.flash("success_msg", "Your profile has been updated");
      res.redirect("/dashboard");
    } else {
      req.flash("success_msg", "You have updated your profile");req.flash("success_msg", "You have updated your profile");req.flash("success_msg", "You have updated your profile");
      res.redirect("/dashboard");
    }
  });
});

// CREDIT WALLET USER REQUEST
router
  .route("/credit/wallet/:email")
  .post(middleware.isLoggedIn, upload.single("receipt"), (req, res) => {
    const { amount } = req.body;
    const { path } = req.file;

    User.findOne({ email: req.user.email }).then((user) => {
      // CREATE ACTIVITY AND ADD TO USER
      Activity.create({
        name: "bank deposit",
        type: "request",
        status: "pending",
        amount: Number(amount),
        user: req.user._id,
        receipt: req.file.path,
      })
        .then((activity) => {
          user.activities.push(activity);
          user.save();

          // MAIL SERVICE
          
          let options = {
            // from: `FUNDVEST CREDIT <${process.env.SENDINBLUE_ADDRESS}>`, // sender address
            from: `FUNDVEST CREDIT <noreply@fundvest.ng>`, // sender address
            to: process.env.BUSINESS_EMAIL, // list of receivers
            subject: "Credit request", // Subject line
            text: "You have received a credit Request", // plain text body
            html: `<p>EMAIL: ${req.user.email} </p><p>Amount: ${Number(amount)
              .toString()
              .replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ","
              )} </p><p>Receipt: ${path} </p><p>ActivityID: ${
              activity._id
            } </p>`, 
            
          };
          transporter
            .sendMail(options)
            .then((success) => console.log(success))
            .catch((err) => console.log(err));

          req.flash(
            "success_msg",
            "Your account will be credited after confirmation"
          );
          res.redirect("/profile");
        })
        .catch((err) => console.log(err));
    });
  });

// DEBIT WALLET USER REQUEST
router.route("/debit/wallet/:email").post(middleware.isLoggedIn, (req, res) => {
  let { amount } = req.body;
  amount = Number(amount);

  // IF USER HAS ENOUGH BALANCE
  if (req.user.nairaWallet > amount) {
    // GET THE USER
    User.findOne({ email: req.user.email })
      .then((user) => {
        // ADD ACTIVITY
        Activity.create({
          name: "bank withdrawal",
          type: "request",
          status: "pending",
          amount: Number(amount),
          user: req.user._id,
        })
          .then((activity) => {
            user.activities.push(activity);
            user.save();

            // EMAIL

            
            let options = {
              // from: `FUNDVEST CREDIT <${process.env.SENDINBLUE_ADDRESS}>`, // sender address
              from: `FUNDVEST DEBIT <noreply@fundvest.ng>`, // sender address
              to: process.env.BUSINESS_EMAIL, // list of receivers
              subject: "Debit request", // Subject line
              text: "You have received a debit Request", // plain text body
              html: `<p>EMAIL: ${req.user.email} </p><p>Amount: ${amount
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </p> <p>ActivityID: ${
                activity._id
              } </p>`, // html body
            };
            transporter
              .sendMail(options)
              .then((success) => console.log(success))
              .catch((err) => console.log(err));

            req.flash("success_msg", "Your request is being attended to");
            res.redirect("/dashboard");
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }
});

// BUY DOLLARS
router
  .route("/exchange-dollars")
  .get(middleware.isLoggedIn, (req, res) => {
    res.render("forex/exchange-dollars");
});

// CONVERT TO DOLLARS
router
  .route("/convert-to-dollars")
  .get(middleware.isLoggedIn, async (req, res) => {
    const forex = await Forex.findOne({ name: "fundvest" });
    const { buyingPrice, sellingPrice } = forex;
    res.render("forex/convert-to-dollars", { buyingPrice, sellingPrice });
  })
  .post(async (req, res) => {
    const {amount, nairaValue} = req.body;

    // IF USER DOESN"T HAVE ENOUGH MONEY
    if (req.user.nairaWallet < nairaValue) {
      req.flash("warning_msg", "You do not have enough fund");
      return res.redirect("/convert-to-dollars");
    }

    const user = await User.findOneAndUpdate(
      { email: req.user.email },
      { $inc: { dollarWallet: amount, nairaWallet: -nairaValue }}, {new: true}
    );


    req.flash("success_msg", "You have funded your dollar balance");
    res.redirect("/dashboard");
  })


  // CONVERT TO NAIRA
router
  .route("/convert-to-naira")
  .get(middleware.isLoggedIn, async (req, res) => {
    const forex = await Forex.findOne({ name: "fundvest" });
    const { buyingPrice, sellingPrice } = forex;
    res.render("forex/convert-to-naira", { buyingPrice, sellingPrice });
  })
  .post(async (req, res) => {
    const { amount, nairaValue } = req.body;

    // IF USER DOESN"T HAVE ENOUGH MONEY
    if (req.user.dollarWallet < amount) {
      req.flash("warning_msg", "Insufficient dollar balance");
      return res.redirect("/convert-to-naira");
    }

    const user = await User.findOneAndUpdate(
      { email: req.user.email },
      { $inc: { dollarWallet: -amount, nairaWallet: nairaValue } },
      { new: true }
    );

    req.flash("success_msg", "You have funded your dollar balance");
    res.redirect("/dashboard");
  });



export default router;
