const express = require("express");
const router = express.Router();
const User=require("../models/user");
const wrapAsync=require("../utils/wrapAsync");
const userController=require("../controllers/user");
const passport=require("passport");

// Render the signup form// Handle signup submission
router
  .route("/signup")
  .get((req, res) => {
    res.render("users/signup.ejs"); 
  })
  .post(wrapAsync(userController.signUp));


// Render the login form// Handle login submission
  router.route("/login").get((req, res) => {
    res.render("users/login.ejs");
  }).post(
    passport.authenticate("local", {
      failureRedirect: "/login", 
      failureFlash: true, 
    }),
    async (req, res) => {
      req.session.saveName = req.user.name;

      // Flash a success message
      req.flash("success", `Welcome back, ${req.user.name}!`);

      // Redirect to the intended URL or expenses page
      const redirectUrl = req.session.redirectUrl || "/expenses";
      delete req.session.redirectUrl;
      res.redirect(redirectUrl);
    }
  );

// Handle logout
router.get("/logout", userController.logout);

module.exports = router;
