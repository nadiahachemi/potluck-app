const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

const Potluck = require("../models/potluck-model.js");
const User = require("../models/user-model.js");

const router = express.Router();

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.gmail_email,
    pass: process.env.gmail_password
  }
});

cloudinary.config({
  cloud_name: "dx9ynexey",
  api_key: "687438279721981",
  api_secret: "dBpWFn_UjFY1YABfHZlZ0NxVDas"
});

const storage = cloudinaryStorage({
  cloudinary,
  folder: "potluck-pictures"
});
const uploader = multer({ storage });

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

// "pictureUpload" is our file input's name attribute
router.post(
  "/process-potlucks",
  uploader.single("pictureUpload"),
  (req, res, next) => {
    if (!req.user) {
      // req.flash() is defined by the "connect-flash" package
      req.flash("error", "You must be logged in");
      // redirect away if you aren't logged in (authorization!)
      res.redirect("/login");
      return;
    }

    let { name, date, guests, pictureUrl, latitude, longitude } = req.body;
    //multer stores the file information in "req.file"
    let { secure_url } = req.file;
    //create the geoJson structure for our ...
    let location = { coordinates: [latitude, longitude] };

    pictureUrl = pictureUrl || undefined;

    Potluck.create({
      host: req.user._id,
      name,
      date,
      pictureUrl: secure_url,
      guests,
      location
    })
      .then(potluckDoc => {
        req.flash("success", "Potluck created!");
        res.redirect("/potlucks");
      })
      .catch(err => {
        next(err);
      });
  }
);

// Route pour afficher la page avec tous les potlucks
router.get("/potlucks", (req, res, next) => {
  if (!req.user) {
    // req.flash() is defined by the "connect-flash" package
    req.flash("error", "You must be logged in");
    // redirect away if you aren't logged in (authorization!)
    res.redirect("/login");
    return;
  }
  Potluck.find({ host: req.user._id }).then(potluckResults => {
    res.locals.potluckArrayHost = potluckResults;
  });
  Potluck.find({ guests: req.user._id })
    .then(potluckResults => {
      res.locals.potluckArrayGuests = potluckResults;
      res.render("potluck-views/potluck-list.hbs");
    })
    .catch(err => {
      next(err);
    });
});

//route pour acceder au detail du potluck
router.get("/potlucks/:potluckId", (req, res, next) => {
  const { potluckId } = req.params;

  if (!req.user) {
    //req.flash is defined by the "connect-flash" package
    req.flash("error", "you must be logged in");
    // redirect away if you aren't logged in
    res.redirect("/login");
    return;
  }
  Potluck.findById(potluckId)
    .populate("guests")
    .populate("host")

    .then(potluckDoc => {
      res.locals.potluckItem = potluckDoc;
      res.render("potluck-views/potlucks-details.hbs");
    })
    .catch(err => {
      //show our error page
      next(err);
    });
});

//potluck settings
router.get("/potlucks/:potluckId/edit", (req, res, next) => {
  const { potluckId } = req.params;

  Potluck.findById(potluckId)
    .then(potluckDoc => {
      res.locals.potluckItem = potluckDoc;
      res.render("potluck-views/potluck-edit.hbs");
    })
    .catch(err => {
      next(err);
    });
});

router.post(
  "/process-edit/:potluckId",
  uploader.single("pictureUpload"),
  (req, res, next) => {
    const { potluckId } = req.params;
    const { name, location, date, pictureUrl } = req.body;
    let { secure_url } = req.file;

    Potluck.findByIdAndUpdate(
      potluckId,
      { $set: { name, location, date, pictureUrl: secure_url } },
      { runValidators: true }
    )
      .then(potluckDoc => {
        res.redirect(`/potlucks/${potluckId}`);
      })
      .catch(err => {
        next(err);
      });
  }
);

// Route pour supprimer un potluck
router.post("/potlucks/:potluckId/delete", (req, res, next) => {
  // Get the ID from the URL
  // const bookId = req.params.bookId
  const { potluckId } = req.params;

  Potluck.findByIdAndRemove(potluckId)
    .then(potluckDoc => {
      res.redirect("/potlucks");
    })
    .catch(err => {
      next(err);
    });
});

// Route pour ajouter de la nourriture
router.post("/potlucks/:potluckId/process-foodAndDrink", (req, res, next) => {
  const { potluckId } = req.params;
  const { name } = req.body;

  Potluck.findByIdAndUpdate(
    potluckId,
    { $push: { foodAndDrink: { name } } },
    { runValidators: true }
  )
    .then(potluckDoc => {
      res.locals.potluckArrayFoodAndDrink = potluckDoc;
      console.log(potluckDoc);
      // fin du test
      res.redirect(`/potlucks/${potluckId}`);
    })
    .catch(err => {
      next(err);
    });
});
//route pour supprimer des food and drink

router.post(
  "/potlucks/:potluckID/process-removeFoodAndDrink",
  (req, res, next) => {
    const { potluckID } = req.params;
    const { foodIde } = req.body;

    Potluck.findOneAndUpdate(
      { _id: potluckID, "foodAndDrink._id": foodIde },
      { $pull: { foodAndDrink: { foodIde } } },
      { runValidators: true }
    )
      .then(() => {
        res.redirect(`/potlucks/${potluckID}`);
      })
      .catch(err => {
        next(err);
      });
  }
);

//CHECK BOX WITH PICTURE
// POST /food/:id/bring
router.post(
  "/potlucks/:potluckID/process-bringFoodAndDrink",
  (req, res, next) => {
    const { potluckID } = req.params;
    const { _id, pictureUrl } = req.user;
    const { foodId } = req.body;

    Potluck.findOneAndUpdate(
      { _id: potluckID, "foodAndDrink._id": foodId },
      { $set: { "foodAndDrink.$.pictureUrl": pictureUrl } },
      { runValidators: true }
    )
      .then(() => {
        res.redirect(`/potlucks/${potluckID}`);
      })
      .catch(err => {
        next(err);
      });
  }
);

//Ajouter un guest par email
router.post("/potlucks/:potluckId/process-guests", (req, res, next) => {
  const { potluckId } = req.params;
  const { guests } = req.body;

  User.findOne({ email: guests }).then(userResult => {
    if (userResult == null) {
      transport
        .sendMail({
          from: "Potluck App <trump@turd.com>", // gmail ignore this and just send from your account
          to: guests,
          subject: `${req.user.fullName}, invited you to a Potluck`,
          text:
            "click the link bellow to sign in and be a part of this Potluck",
          html: `<h1> It's your lucky day! </h1>
          <h2> Your friend ${req.user.fullName} invited you to a potluck!</h2>
          <p> Wanna see who's coming and what's on the menu? then just click the link below and sign up so you can be a part of the Potluck App family!</p>
          <p>http://easypotluck.herokuapp.com/</p>`
        })
        .then(() => {
          res.redirect(`/potlucks/${potluckId}`);
        });
    } else {
      Potluck.findById(req.params.potluckId)
        .then(potluckResult => {
          console.log(potluckResult);
          console.log("I stopped there!");
          var compteur = 0;
          if (potluckResult.guests.length > 0) {
            console.log("or there");
            potluckResult.guests.forEach(guest => {
              console.log(typeof guest);
              console.log(typeof userResult._id);
              if (guest.toString() == userResult._id.toString()) {
                console.log("+1");
                compteur += 1;
              }
            });
            console.log("compteur = " + compteur);
            if (compteur > 0) {
              console.log("existe déjà!");
              res.redirect(`/potlucks/${potluckId}`);
            } else {
              console.log("n'existe pas!");
              Potluck.findByIdAndUpdate(
                potluckId,
                { $push: { guests: userResult._id } },
                { runValidators: true }
              )
                .then(() => {
                  res.redirect(`/potlucks/${potluckId}`);
                })
                .catch(err => {
                  next(err);
                });
            }
          } else {
            Potluck.findByIdAndUpdate(
              potluckId,
              { $push: { guests: userResult._id } },
              { runValidators: true }
            )
              .then(() => {
                res.redirect(`/potlucks/${potluckId}`);
              })
              .catch(err => {
                next(err);
              });
          }
        })
        .catch(err => {
          next(err);
        });
    }
  });
});

module.exports = router;
