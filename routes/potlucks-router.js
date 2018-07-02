const express = require("express");

const Potluck = require("../models/potluck-model.js");

const router = express.Router();

// Route pour créer un potluck
router.get("/potlucks/create", (req, res, next) => {
  if (!req.user) {
    // req.flash() is defined by the "connect-flash" package
    req.flash("error", "You must be logged in");
    // redirect away if you aren't logged in (authorization!)
    res.redirect("/login");
    return;
  }

  res.render("potluck-views/potluck-form.hbs");
});

router.post("/process-potlucks", (req, res, next) => {
  if (!req.user) {
    // req.flash() is defined by the "connect-flash" package
    req.flash("error", "You must be logged in");
    // redirect away if you aren't logged in (authorization!)
    res.redirect("/login");
    return;
  }

  const { name, location, pictureUrl, guests } = req.body;

  Potluck.create({ host: req.user._id, name, location, pictureUrl, guests })
    .then(potluckDoc => {
      req.flash("success", "Potluck created!");
      res.redirect("/potlucks");
    })
    .catch(err => {
      next(err);
    });
});

// Route pour afficher la page avec tous les potlucks
router.get("/potlucks", (req, res, next) => {
  if (!req.user) {
    // req.flash() is defined by the "connect-flash" package
    req.flash("error", "You must be logged in");
    // redirect away if you aren't logged in (authorization!)
    res.redirect("/login");
    return;
  }

  Potluck.find({ host: req.user._id })
    .then(potluckResults => {
      res.locals.potluckArray = potluckResults;
      res.render("potluck-views/potluck-list.hbs");
    })
    .catch(err => {
      next(err);
    });
});

router.get("/potlucks/:potluckId", (req, res, nest) => {
  const { potluckId } = req.params;
  // console.log(req.user,"````````````````````````````````````");
  if (!req.user) {
    //req.flash is defined by the "connect-flash" package
    req.flash("error", "you must be logged in");
    // redirect away if you aren't logged in
    res.redirect("/login");
    return;
  }
  Potluck.find({ host: req.user._id })
    .then(result => {
      console.log(result);
      res.locals.potluckArray = result;
      res.render("potlucks-details.hbs", { result });
    })
    .catch(err => console.log(err));

  // console.log()
  //   Potluck.find({host: req.user._id})
  //   .then((potluckResults)=>{
  //       res.locals.potluckArray= potluckResults;
  //       console.log("Je suis le console.log   ====================== " + res.locals.potluckArray);
  //       res.render("potluck-details.hbs");
  //   })
  //   .catch((err)=>{
  //       nest(err);
  //   })
});

module.exports = router;
