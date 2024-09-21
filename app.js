const express = require("express");
const PORT = 3000;
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const clientiRoute = require("./routes/clienti.route");
const Client = require("./models/clients.schema");
// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

////////////////////
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.status(200).send(`Letsgoski letsgo, il server risponde su ${PORT}`);
});

// GET ALL CLIENTS
app.get("/api/clienti", async (req, res) => {
  try {
    const client = await Client.find({});
    res.status(200).json(client);
  } catch (err) {
    res.status(500).json({ message: error.mesage });
  }
});
// get: search by Nome, Cognome or Scuola
app.use("/api/clienti/search", clientiRoute);

app.post("/api/clienti", async (req, res) => {
  try {
    const addingClient = await Client.create(req.body);
    res.status(200).json(addingClient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// app.use("api/clienti", clientiRoute);
app.put("/api/clienti", async (req, res) => {
  try {
    const { nome, cognome } = req.body; // Recupera nome e cognome dal corpo della richiesta

    // Verifica che entrambi nome e cognome siano forniti
    if (!nome || !cognome) {
      return res.status(400).json({
        message: "Nome e cognome sono necessari per aggiornare il cliente.",
      });
    }

    // Cerca il cliente in base a nome e cognome
    const client = await Client.findOneAndUpdate(
      { nome: nome, cognome: cognome }, // Filtro per trovare il cliente
      req.body, // Aggiorna i campi forniti nel corpo della richiesta
      { new: true } // Restituisce il cliente aggiornato
    );

    // Se non viene trovato il cliente
    if (!client) {
      return res.status(404).json({ message: "Cliente non trovato." });
    }

    // Restituisce il cliente aggiornato
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// mongodb & port listening
mongoose
  .connect(
    "mongodb+srv://robertorusso:7Zlt1sSNZFoZIS4u@mongodb-restapi.2era0.mongodb.net/steps?retryWrites=true&w=majority&appName=MongoDB-RestAPI"
  )
  .then(() => {
    console.log("Connected to the MongoDB Database 🍃");
    app.listen(3000, () => {
      console.log("Server is listening on port 3000 ✅");
    });
  })
  .catch(() => {
    console.log("Error on connecting to MongoDB Database, please retry 🔴");
  });
