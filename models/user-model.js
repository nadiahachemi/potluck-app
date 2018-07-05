const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /^.+@.+\..+$/ },
    pictureUrl: {
      type: String,
      default:
        "https://i.pinimg.com/originals/f4/3f/68/f43f68c7802e11848f5cf92110cee700.jpg"
    },
    // role: {type: String, enum:["guest", "host"], default:"guest", required: true},

    //only for users that sign up normally
    encryptedPassword: { type: String },

    //only for users that log in with Google
    googleID: { type: String }
  },
  { timestamps: true }
);

// userSchema.virtual("isAdmin").get(function(){
//     return this.role ==="admin";
// });

const User = mongoose.model("User", userSchema);

module.exports = User;
