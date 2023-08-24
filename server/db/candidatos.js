const mongoose = require("mongoose");

const candidatosSchema = new mongoose.Schema({
  nombre: String,
  apellidos: String,
  sexo: String,
  cedula: String,
  municipio: String,
  provincia: String,
});

module.exports = mongoose.model("canditatos", candidatosSchema);
