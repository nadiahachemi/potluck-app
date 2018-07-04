const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

const Potluck = require("../models/potluck-model.js");
const User = require("../models/user-model.js");

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.cloudinary_name,
  api_key: process.env.cloudinary_key,
  api_secret: process.env.cloudinary_secret
});
const storage = cloudinaryStorage({
  cloudinary,
  folder: "room-pictures"
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

router.post("/process-edit/:potluckId", (req, res, next) => {
  const { potluckId } = req.params;
  const { name, location, date, pictureUrl } = req.body;

  Potluck.findByIdAndUpdate(
    potluckId,
    { $set: { name, location, date, pictureUrl } },
    { runValidators: true }
  )
    .then(potluckDoc => {
      res.redirect(`/potlucks/${potluckId}`);
    })
    .catch(err => {
      next(err);
    });
});

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
  const { foodAndDrink } = req.body;

  Potluck.findByIdAndUpdate(
    potluckId,
    { $push: { foodAndDrink } },
    { runValidators: true }
  )
    .then(potluckDoc => {
      //test
      res.locals.potluckArrayFoodAndDrink = potluckDoc;
      // fin du test
      res.redirect(`/potlucks/${potluckId}`);
    })
    .catch(err => {
      next(err);
    });
});

router.post("/potlucks/:potluckId/process-guests", (req, res, next) => {
  const { potluckId } = req.params;
  const { guests } = req.body;

  User.findOne({ email: guests })
    .then(userResult => {
      Potluck.findByIdAndUpdate(
        potluckId,
        { $push: { guests: userResult._id } },
        { runValidators: true }
      ).then(() => {
        res.redirect(`/potlucks/${potluckId}`);
      });
    })

    .catch(err => {
      next(err);
    });
});

module.exports = router;
