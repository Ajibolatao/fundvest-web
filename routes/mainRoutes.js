import express from "express";

const router = express.Router();

// Index
router.get("/", (req, res) => {
  //   res.render(`main/index`);
  res.redirect("/dashboard");
});

// About
router.get("/about", (req, res) => {
  res.render(`main/about`);
});

// FAQ
router.get("/faq", (req, res) => {
  res.render(`main/faq`);
});

// Privacy Policy
router.get("/privacy-policy", (req, res) => {
  res.render(`main/privacy`);
});

// Terms and consitions
router.get("/terms", (req, res) => {
  res.render(`main/terms`);
});

// module.exports = router;
export default router;
