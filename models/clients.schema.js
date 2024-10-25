const mongoose = require("mongoose");

const purchaseSchema = mongoose.Schema({
  product: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

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
  acquisti: [purchaseSchema],
});

const Client = mongoose.model("Client", ClientSchema, "dev");

module.exports = Client;
