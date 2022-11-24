

const middleware = {
  // IS LOGGED IN
  isLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      if (!req.user.isVerified) {
        req.flash("error", "Please, verify your email address");
        req.logout();
        return res.redirect("/signin");
      }
      if (req.user.isVerified) return next();
    }
    return res.redirect("/signin");
  },

  // IS ADMIN
  isAdmin: (req, res, next) =>
    req.user.isAdmin ? next() : res.redirect("/dashboard"),


};

export default middleware;
