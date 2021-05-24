const mongoose = require("mongoose");
const storeSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Provide an item name"],
    },
    price: {
      type: Number,
      required: [true, "Provide an item price"],
    },
    left: {
      type: Number,
      required: [true, "Provide an item left"],
    },
    total: {
      type: Number,
      required: [true, "Provide an item total"],
    },
  });

module.exports = storeSchema;