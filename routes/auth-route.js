const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const nodemailer = require("nodemailer");

const User = require("../models/user-model");

const router = express.Router();
const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.gmail_email,
    pass: process.env.gmail_password
  }
});

router.get("/signup", (req, res, next) => {
  res.render("auth-views/signup-form.hbs");
});

router.post("/process-signup", (req, res, next) => {
  const { fullName, email, originalPassword } = req.body;

  //password can't be blank
  if (originalPassword === "" || originalPassword.match(/[0-9]/) === null) {
    flash.req("error", "password can't be blank etc..");
    res.redirect("/signup");
    return;
  }

  const encryptedPassword = bcrypt.hashSync(originalPassword, 10);
  User.create({ fullName, email, encryptedPassword })
    .then(userDoc => {
      transport.sendMail({
          from: "Potluck Users <potuse@example.com>",
          to: `${fullName} <${email}>`,
          subject: "Thank you for joining Potluck App!",
          text: `Welcome, ${fullName}! Thank you for joining Potluck App :)`,
          html: `<h1>Welcome, ${fullName}!</h1>
              <p>Thank you for joining Potluck App!</p>`
        })
        .then(() => {
          req.flash("success", "signed up successfully! Try to log in baby!");
          res.redirect("/");
        });
    })
    .catch(err => {
      next(err);
    });
});

router.get("/login", (req, res, next) => {
  res.render("auth-views/login-form.hbs");
});

router.post("/process-login", (req, res, next) => {
  const { email, loginPassword } = req.body;

  User.findOne({ email })
    .then(userDoc => {
      //"userDoc" will be falsy if we didn't find a user (wrong email).
      if (!userDoc) {
        res.redirect("/");
        return; // return instead of else when there is a lot of code.
      }

      //we are ready to check the password if we get here(email was okay)
      const { encryptedPassword } = userDoc;
      if (!bcrypt.compareSync(loginPassword, encryptedPassword)) {
        req.flash("error ", "incorect password");
        res.redirect("/login");
        return;
      }

      //we are ready to LOG THEM IN if we get here (password okay too)
      // res.logIn is a passport method for logging in a user
      //behind the scenes it calls our passport.serialized() function
      req.logIn(userDoc, () => {
        req.flash("success", "you're logged in");
        res.redirect("/potlucks");
      });
      // req.session.userId = userDoc._id;
    })
    .catch(err => {
      next(err);
    });
});

router.get("/logout", (req, res, next) => {
  req.logout();
  req.flash("succes", "logged out succesfully");
  res.redirect("/");
});

// // Link to "/google/login" to start the log with Google proccess
// router.get("/google/login",
// passport.authenticate("google",{
//     scope: [
//         "https://www.googleapis.com/auth/plus.login",
//         "https://www.googleapis.com/auth/plus.profile.emails.read"
//       ]
// }));
// router.get("/google/success",
//     passport.authenticate ("google",{
//     successRedirect:"/",
//     failureRedirect:"/login",
//     successFlash:"Google log in success",
//     failureFlash:"Google log in failure. 💩"
// }));

// // Link to "/github/login" to start the log with Github proccess
// router.get("/github/login", passport.authenticate("github"));
// router.get("/github/success",
//     passport.authenticate("github",{
//     successRedirect:"/",
//     failureRedirect:"/login",
//     successFlash:"github log in success",
//     failureFlash:"github log in failure. 💩"
// }));

module.exports = router;
