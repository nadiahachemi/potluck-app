const express = require("express");

const Potluck= require("../models/potluck-model");

const router = express.Router();



router.get("/potlucks/:potluckId", (req, res, nest)=>{
    const {potluckId} = req.params;
    // console.log(req.user,"````````````````````````````````````");
    if(!req.user){
        //req.flash is defined by the "connect-flash" package
        req.flash("error", "you must be logged in")
        // redirect away if you aren't logged in
        res.redirect("/login");
        return;
      }
     Potluck.find({host:req.user._id})
        .then(result => {
        console.log(result)
        res.locals.potluckArray= result;
        res.render("potlucks-details.hbs", {result});
     }).catch(err => console.log(err))

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
    
})

module.exports= router;
