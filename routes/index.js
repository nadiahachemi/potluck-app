const express = require("express");
const router = express.Router();
const flash = require("connect-flash");
const bcrypt = require("bcrypt");
const passport = require("passport");
const nodemailer = require("nodemailer");
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

const User = require("../models/user-model.js");

cloudinary.config({
  cloud_name: process.env.cloudinary_name,
  api_key: process.env.cloudinary_key,
  api_secret: process.env.cloudinary_secret
});

const storage = cloudinaryStorage({
  cloudinary,
  folder: "user-pictures"
});
const uploader = multer({ storage });

router.get("/signup", (req, res, next) => {
  res.render("auth-views/signup-form.hbs");
});

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

router.post(
  "/process-settings",
  uploader.single("pictureUpload"),
  (req, res, next) => {
    if (!req.user) {
      // req.flash() is defined by the "connect-flash" package
      req.flash("error", "You must be logged in");
      // redirect away if you aren't logged in (authorization!)
      res.redirect("/login");
      return;
    }

    const { fullName, pictureUrl, oldPassword, newPassword } = req.body;
    let { secure_url } = req.file;
    let changes = { fullName, pictureUrl: secure_url };

    if (oldPassword && newPassword) {
      if (!bcrypt.compareSync(oldPassword, req.user.encryptedPassword)) {
        // req.flash() is defined by the "connect-flash" package
        req.flash("error", "Old password incorrect.");
        res.redirect("/settings");
        return;
      }
      const encryptedPassword = bcrypt.hashSync(newPassword, 10);
      changes = { fullName, pictureUrl: secure_url, encryptedPassword };
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
  }
);

module.exports = router;
