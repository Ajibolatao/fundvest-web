import express from "express";

const router = express.Router();

// IMPORT MIDDLEWARE
import middleware from "../middlewares/middleware.js";

// CLASSIC
router.get("/classic", (req, res) => {
  res.render(`plans/classic`);
});

// PREMIUM
router.get("/premium", (req, res) => {
  res.render(`plans/premium`);
});

// ELITE
router.get("/elite", (req, res) => {
  res.render(`plans/elite`);
});

// module.exports = router;
export default router;
