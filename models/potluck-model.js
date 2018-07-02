const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const potluckSchema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    guests: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
      }
    ],
    host: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

// userSchema.virtual("isAdmin").get(function() {
//   return this.role === "admin";
// });

const Potluck = mongoose.model("Potluck", potluckSchema);

module.exports =Potluck;
