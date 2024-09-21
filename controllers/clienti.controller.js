const Client = require("../models/clients.schema");

const searchClients = async (req, res) => {
  const { nome, cognome, scuola } = req.query;

  if (!nome && !cognome && !scuola) {
    return res.status(400).json({
      message:
        "Per favore, fornisci almeno un nome, cognome o scuola da cercare.",
    });
  }

  let searchQuery = {};

  if (nome) {
    searchQuery.nome = { $regex: nome, $options: "i" };
  }

  if (cognome) {
    searchQuery.cognome = { $regex: cognome, $options: "i" };
  }

  if (scuola) {
    searchQuery.scuola = { $regex: scuola, $options: "i" };
  }

  try {
    const clients = await Client.find(searchQuery);
    if (clients.length === 0) {
      return res
        .status(404)
        .json({ message: "Nessun cliente trovato con i criteri forniti." });
    }
    res.status(200).json(clients);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

const addClient = async (req, res) => {
  try {
    const addingClient = await Client.create(req.body);
    res.status(200).json(addingClient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { searchClients, addClient };
