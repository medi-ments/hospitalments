// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://adnanmohdk1234:FgSY2VP3g6hRKGpG@cluster-01.ewtn7.mongodb.net/hospitalInventory?retryWrites=true&w=majority&appName=cluster-01", {
useNewUrlParser: true,
useUnifiedTopology: true,
});


// Define the Item Schema
const itemSchema = new mongoose.Schema({
  name: String,
  category: String,
  quantity: Number,
  expiryDate: Date,
  arrivalDate: Date,
});

const Item = mongoose.model("Item", itemSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Route to add a new item
app.post("https://hospitalments.onrender.com/api/items", async (req, res) => {
  try {
    const { name, category, quantity, expiryDate, arrivalDate } = req.body;
    const item = new Item({
      name: req.body.name,
      category: req.body.category,
      quantity: req.body.quantity,
      expiryDate: req.body.expiryDate,
      arrivalDate: req.body.arrivalDate, 
   });
    await item.save();
    res.status(201).send(item);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// Route to get all items
app.get("https://hospitalments.onrender.com/api/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).send(items);
  } catch (error) {
    res.status(500).send({ error: "Failed to retrieve items" });
  }
});

// Route to get expired items
app.get("/api/items/expired", async (req, res) => {
  try {
    const today = new Date();
    const expiredItems = await Item.find({ expiryDate: { $lt: today } });
    res.status(200).send(expiredItems);
  } catch (error) {
    res.status(500).send({ error: "Failed to retrieve expired items" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
