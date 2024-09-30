require("dotenv").config();

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Ottieni il token

  if (!token) {
    return res.status(401).json({ message: "Accesso negato. Token mancante." });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token non valido o scaduto." });
    }

    req.user = user; // Salva l'utente nella richiesta
    next();
  });
};

module.exports = verifyToken;
