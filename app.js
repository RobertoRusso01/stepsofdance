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

// add a product

app.post("/api/clienti/:id/buying", async (req, res) => {
  const { id } = req.params;
  const { product, price, notes = "", date } = req.body;
  if (!product || !price) {
    return res.status(400).json({
      message: "Please select both product ,price and if needed Notes.",
    });
  }
  try {
    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({ message: "Cliente non trovato." });
    }
    const newBuy = {
      product,
      price,
      date: date ? new Date(date) : Date.now(),
      notes,
    };
    client.acquisti.push(newBuy);
    await client.save();
    res.status(200).json({
      message: "Acquisto aggiunto con successo!",
      acquisti: client.acquisti,
    });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

app.delete("/api/clienti/:id/delete/:productIndex", async (req, res) => {
  const { id, productIndex } = req.params;
  try {
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Cliente non trovato." });
    }
    const acquistoIndex = client.acquisti.findIndex(
      (acquisto) => acquisto._id.toString() === productIndex
    );

    if (acquistoIndex === -1) {
      return res.status(404).json({ message: "Acquisto non trovato." });
    }

    // Rimuovi l'elemento dal campo `acquisti`
    client.acquisti.splice(acquistoIndex, 1);
    await client.save();

    res.status(200).json({
      message: "Acquisto eliminato con successo!",
      acquisti: client.acquisti,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get incassi

app.get("/api/incassi", async (req, res) => {
  try {
    // Prendi le date dai parametri della query
    const { startDate, endDate } = req.query;

    // Convalida e converti le date
    const inizioPeriodo = new Date(startDate);
    const finePeriodo = new Date(endDate);

    if (isNaN(inizioPeriodo) || isNaN(finePeriodo)) {
      return res.status(400).json({ error: "Date non valide" });
    }

    // Trova tutti i clienti con acquisti nel periodo specificato
    const clients = await Client.find({
      "acquisti.date": {
        $gte: inizioPeriodo,
        $lte: finePeriodo,
      },
    });

    // Calcola il totale degli incassi nel periodo
    let totaleIncassi = 0;

    clients.forEach((client) => {
      client.acquisti.forEach((acquisto) => {
        if (acquisto.date >= inizioPeriodo && acquisto.date <= finePeriodo) {
          totaleIncassi += acquisto.price;
        }
      });
    });

    res.status(200).json({ totaleIncassi });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/incassi-oggi", async (req, res) => {
  try {
    // Data di inizio e fine per il giorno odierno
    const inizioOggi = new Date().setHours(0, 0, 0, 0);
    const fineOggi = new Date().setHours(23, 59, 59, 999);

    // Trova tutti i clienti che hanno acquisti effettuati oggi
    const clients = await Client.find({
      "acquisti.date": {
        $gte: new Date(inizioOggi),
        $lte: new Date(fineOggi),
      },
    });

    // Calcola il totale degli incassi di oggi
    let totaleIncassi = 0;

    clients.forEach((client) => {
      client.acquisti.forEach((acquisto) => {
        if (acquisto.date >= inizioOggi && acquisto.date <= fineOggi) {
          totaleIncassi += acquisto.price;
        }
      });
    });

    res.status(200).json({ totaleIncassi });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
