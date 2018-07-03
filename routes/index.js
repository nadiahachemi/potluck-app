const express = require("express");
const router = express.Router();
const flash = require("connect-flash");

const User = require("../models/user-model.js");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/settings", (req, res, next) => {
  if (!req.user) {
    // redirect away if you aren't logged in
    res.redirect("/login");
    return;
  }
  res.render("settings.hbs");
});

router.post("/process-settings", (req, res, next) => {
  if (!req.user) {
    // req.flash() is defined by the "connect-flash" package
    req.flash("error", "You must be logged in");
    // redirect away if you aren't logged in (authorization!)
    res.redirect("/login");
    return;
  }

  const { fullName, oldPassword, newPassword } = req.body;
  let changes = { fullName };

  if (oldPassword && newPassword) {
    if (!bcrypt.compareSync(oldPassword, req.user.encryptedPassword)) {
      // req.flash() is defined by the "connect-flash" package
      req.flash("error", "Old password incorrect.");
      res.redirect("/settings");
      return;
    }
    const encryptedPassword = bcrypt.hashSync(newPassword, 10);
    changes = { fullName, encryptedPassword };
  }

  User.findByIdAndUpdate(
    req.user._id,
    { $set: changes },
    { runValidators: true }
  )
    .then(userDoc => {
      // req.flash() is defined by the "connect-flash" package
      req.flash("success", "Settings saved successfully!");
      res.redirect("/");
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
