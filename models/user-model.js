const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /^.+@.+\..+$/ },
    // role: {type: String, enum:["guest", "host"], default:"guest", required: true},

    pictureUrl:{type:String, default:"https://image.freepik.com/free-icon/user-image-with-black-background_318-34564.jpg"},
    //only for users that sign up normally
    encryptedPassword: { type: String },

    //only for users that log in with Google
    googleID: { type: String },

    //only for users who log in with github
    githubID: { type: String }
  },
  { timestamps: true }
);

// userSchema.virtual("isAdmin").get(function(){
//     return this.role ==="admin";
// });

const User = mongoose.model("User", userSchema);

module.exports = User;
