const mongoose = require("mongoose");

// column and x value are the same
const gameSchema = new mongoose.Schema({
  name: String, // Name of user. WILL be entered by user
  score: String, // Score of user. NOT entered by user
  duration: String, // Time Survived. NOT entered by user
  largestChain: String,
  totalClears: String,
  month: String,
  day: String,
  year: String,
  hour: String,
  minute: String,
  meridian: String
});

const Game = mongoose.model("Game", gameSchema);

module.exports = {
  model: Game,
  schema: gameSchema
};
