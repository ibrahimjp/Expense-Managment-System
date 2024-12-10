const User=require("../models/user");

module.exports.signUp=async (req, res,next) => {
  try {
    let { username, email, password, name } = req.body; // Ensure `name` is part of the signup form
    const newUser = new User({ email, username, name }); // Include name in user creation
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome To WanderLust");
      res.redirect("/expenses");
    });
  } catch (e) {
    // req.flash("error", e.message);
    res.redirect("/signup");
  }
  }

module.exports.logout=(req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.saveName = null; // Clear saveName from session
    req.flash("success", "Successfully logged out!");
    res.redirect("/login");
});
  };
  