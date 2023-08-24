const mongoose = require("mongoose");

const nombresSchema = new mongoose.Schema({
  nombre: String,
});

module.exports = mongoose.model("nombres", nombresSchema);
