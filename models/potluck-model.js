const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const potluckSchema = new Schema(
  {
    name: { type: String, required: true },
    // location: { type: String, required: true },
    // date: { type: Date, required: true },
    pictureUrl: {
      type: String,
      default:
        "http://www.chequamegonfoodcoop.com/wp-content/uploads/2017/03/foodiesfeed.com_vegetable-party-snacksWEB-1240x826.jpg"
    },
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
      },
    foodAndDrink: [
      { type: String }
      ],
 },
 {timestamps: true}, );

// userSchema.virtual("isAdmin").get(function() {
//   return this.role === "admin";
// });

const Potluck = mongoose.model("Potluck", potluckSchema);


module.exports = Potluck;
