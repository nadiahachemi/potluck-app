const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const potluckSchema = new Schema(
  {
    name: { type: String, required: true },
<<<<<<< HEAD
    location: {
      type: { type: String, required: true }, // default:"Point"
      coordinates: [{ type: Number }]
=======
    location:{
      type: {type: String, required: true , default:"Point"},
      coordinates: [
        {type:Number}
      ]
>>>>>>> 2cbbbc9ce2b897b93741224e41cd494aa71ba60a
    },
    date: { type: Date, required: true },
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
      {
      name: {type: String, require: true},
      pictureUrl:{type: String, default: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAALVBMVEX///8AAACtra1hYWHw8PDz8/NkZGSsrKz7+/toaGjl5eXDw8P4+PhaWloxMTG2JgkLAAABK0lEQVR4nO3PgRHBQAAAwU+IIOi/XJow5t5uBXfj2NeZ7eexnC4Tuy3rWK5jZpfP4fbriK86Ocxz2Oewz2Gfwz6HfQ77HPY57HPY57DPYZ/DPod9Dvsc9jnsc9jnsM9hn8M+h30O+xz2Oexz2Oewz2Gfwz6HfQ77HPY57HPY57DPYZ/DPod9Dvsc9jnsc9jnsM9hn8M+h30O+xz2Oexz2Oewz2Gfwz6HfQ77HPY57HPY57DPYZ/DPod9Dvsc9jnsc9jnsM9hn8M+h30O+xz2Oexz2Oewz2Gfwz6HfQ77HPY57HPY57DPYZ/DPod9Dvsc9jnsc9jnsM9hn8M+h30O+xz2Oexz2Oewz2Gfwz6HfQ77HPY57HPY57DPYZ/Dvv84vG/neT2e63gtczve7YoVJLAkL+AAAAAASUVORK5CYII="}
    }]
  },
  { timestamps: true }
);

const Potluck = mongoose.model("Potluck", potluckSchema);

module.exports = Potluck;
