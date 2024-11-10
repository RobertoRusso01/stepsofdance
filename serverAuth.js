require("dotenv").config();
const express = require("express");
const app = express();
const User = require("./models/User.schema");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

//middlewares
app.use(express.json());
app.use(cors());
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Unathorized!" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).json({ error: "Unathorized!" });
    }
    req.user = decoded;
    next();
  });
};

// REGISTRATION
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    // 1. Look inside the DB if there is an account with same username
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exist!" });
    }
    // 2. If false, hash the password and save the user inside the Db.
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // 3. Create and save the user inside the database
    const newUser = new User({
      username: req.body.username,
      password: hashedPassword,
    });
    await newUser.save();
    // 4. Send the status of adding post
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await User.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).send("Utente non trovato");
    }
    res.status(200).send("Utente eliminato con successo ✅");
  } catch (error) {
    console.error(error); // Add this for logging
    res.status(500).send("Errore durante l'eliminazione del cliente");
  }
});

// Login

app.post("api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    // 1. Start by looking if the username exist
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).json({ message: `User doesn't exist!` });
    }
    // 2. Check if password is correct by comparing with Hashed one inside the DB
    const verify = await bcrypt.compare(req.body.password, user.password);
    if (!verify) {
      return res.status(401).json({ message: `Password is incorrect!` });
    }
    // Generate the JWT Token
    const token = jwt.sign(
      { username: req.body.username },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "30m",
      }
    );
    res.status(200).json({ accessToken: token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

mongoose
  .connect(process.env.MONGO_USERS_URL)
  .then(() => {
    console.log("You are connected to MongoDB 🍃");
    app.listen(process.env.AUTH_PORT, () => {
      console.log(`Server is listening on port ${process.env.AUTH_PORT}  ✅`);
    });
  })
  .catch(() => {
    console.log(
      "There was an issue trying connecting to MongoDB, please retry ❌"
    );
  });
