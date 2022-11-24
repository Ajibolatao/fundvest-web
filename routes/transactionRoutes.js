import express from "express";
import axios from "axios";

const router = express.Router();

// Import models
import User from "../models/User.js";
import Portfolio from "../models/Portfolio.js";
import Activity from "../models/Activity.js";

// Import middleware
import middleware from "../middlewares/middleware.js";

// ****** ROUTES **********

// Transaction
router.get("/transaction", middleware.isLoggedIn, (req, res) => {
  User.findOne({ email: req.user.email })
    .populate("activities")
    .then((user) => {
      res.render("app/transaction", { activities: user.activities });
    })
    .catch((err) => console.log(err));
});

// PURCHASE PLAN
router.post("/purchase-plan", (req, res) => {
  let { principal, duration, rate, plan } = req.body;
  principal = Number(principal);
  duration = Number(duration);
  rate = Number(rate);

  const portfolioId = Math.floor(Math.random() * 10000000);

  // FETCH DATE
  axios
    .get("http://worldtimeapi.org/api/timezone/Africa/Lagos")
    .then((resp) => {
      // STARTDATE
      const startDate = new Date(resp.data.unixtime * 1000);

      console.log(startDate)

      //   Get due date
      const dueDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + duration,
        startDate.getDate(),
        startDate.getHours(),
        startDate.getMinutes(),
        startDate.getSeconds()
      );

      // Set Status to active
      const status = "active";

      // Proposed total interest
      const proposedTotalInterest = (principal * rate * (duration / 12)) / 100;

      // Proposed total amount
      const proposedTotalAmount = principal + proposedTotalInterest;

      // Get Daily interest
      const timeDiffInSec = (dueDate.getTime() - startDate.getTime()) / 1000;
      const secInDays = 60 * 60 * 24;
      const daysDiff = timeDiffInSec / secInDays;
      const dailyInterest = proposedTotalInterest / daysDiff;

      // Find a user
      User.findOneAndUpdate(
        { email: req.user.email },
        { loggedInTime: startDate }
      )
        .then((user) => {
          // IF user has enough mmoney
          if (user.nairaWallet > principal) {
            // Create a Portfolio
            Portfolio.create({
              portfolioId,
              type: "subscription",
              plan,
              status,
              principal,
              duration,
              startDate,
              proposedTotalInterest,
              proposedTotalAmount,
              dueDate,
              dailyInterest,
            })
              .then((portfolio) => {
                // ADD PORTFOLIO
                user.portfolios.push(portfolio);
                user.save();

                // GET current wallet
                const currentWallet = user.nairaWallet - principal;

                // Update current wallet
                User.findOneAndUpdate(
                  { email: req.user.email },
                  { nairaWallet: currentWallet }
                ).then((myUser) => {
                  // ADD ACTIVITY
                  Activity.create({
                    name: plan,
                    type: "subscription",
                    status: "completed",
                    amount: principal,
                    user: req.user._id,
                  })
                    .then((activity) => {
                      myUser.activities.push(activity);
                      myUser.save();

                      // CREDIT REFERRAL IF THIS IS THE FIRST TRANSACTION
                      if (
                        myUser.portfolios.length === 0 &&
                        myUser.referralCode !== 0
                      ) {
                        User.findOneAndUpdate(
                          {
                            personalReferralCode: myUser.referralCode,
                          },
                          {
                            $inc: {
                              referralWallet: 1000,
                            },
                          }
                        ).then((credit) => {});
                      }

                      req.flash(
                        "success_msg",
                        "You have subscribed to a new plan"
                      );
                      res.redirect("/dashboard");
                    })
                    .catch((err) => console.log(err));
                });
              })
              .catch((err) => console.log(err));
          }

          // If user doesnt have enough money
          if (user.nairaWallet < principal) {
            req.flash("warning_msg", "Credit your wallet to subscribe");
            res.redirect("/wallet");
          }
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

// module.exports = router;
export default router;
