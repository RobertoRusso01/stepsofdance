const mongoose = require("mongoose");
const ClientSchema = mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  cognome: {
    type: String,
    required: true,
  },
  telefono: {
    type: String,
    required: true,
  },
  scuola: {
    type: String,
    required: true,
  },
  luogo: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    required: false,
  },
});

const Client = mongoose.model("Client", ClientSchema, "dev");

module.exports = Client;
