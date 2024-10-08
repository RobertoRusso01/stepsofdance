require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const clientiRoute = require("./routes/clienti.route");
const Client = require("./models/clients.schema");
const verifyToken = require("./middlewares/authMiddleware");
const path = require("path");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Serve login.html without authentication
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Serve index.html with authentication
app.get("/dashboard", verifyToken, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// GET ALL CLIENTS
app.get("/api/clienti", verifyToken, async (req, res) => {
  try {
    const clients = await Client.find({});
    res.status(200).json(clients);
  } catch (err) {
    res.status(500).json({ message: "Not found | Not authorized" });
  }
});

// Search by Nome, Cognome or Scuola
app.use("/api/clienti/search", verifyToken, clientiRoute);

// Add a new client
app.post("/api/clienti", verifyToken, async (req, res) => {
  try {
    const addingClient = await Client.create(req.body);
    res.status(200).json(addingClient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a client
app.put("/api/clienti", verifyToken, async (req, res) => {
  try {
    const { nome, cognome } = req.body;

    if (!nome || !cognome) {
      return res.status(400).json({
        message: "Nome e cognome sono necessari per aggiornare il cliente.",
      });
    }

    const client = await Client.findOneAndUpdate(
      { nome: nome, cognome: cognome },
      req.body,
      { new: true }
    );

    if (!client) {
      return res.status(404).json({ message: "Cliente non trovato." });
    }

    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a client
app.delete("/api/clienti/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Client.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).send("Cliente non trovato");
    }
    res.status(200).send("Cliente eliminato con successo");
  } catch (error) {
    console.error(error); // Add this for logging
    res.status(500).send("Errore durante l'eliminazione del cliente");
  }
});

// MongoDB & port listening
mongoose
  .connect(process.env.MONGO_CLIENTI_URL)
  .then(() => {
    console.log("Connected to the MongoDB Database 🍃");
    app.listen(process.env.APP_PORT, () => {
      console.log(`Server is listening on port ${process.env.APP_PORT} ✅`);
    });
  })
  .catch(() => {
    console.log("Error on connecting to MongoDB Database, please retry 🔴");
  });
