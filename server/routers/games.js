const { Router } = require("express");
const game = require("../models/game");

const router = Router();

const databaseName = "games2023";

// Create record in MongoDB
router.post(databaseName, (request, response) => {
  const newGame = new game.model(request.body);
  console.log("request", request);
  console.log("response", response);
  console.log("newGame", newGame);
  newGame.save((err, game) => {
    return err ? response.sendStatus(500).json(err) : response.json(game);
  });
});

// Get all game records
router.get(databaseName, (request, response) => {
  game.model.find({}, (error, data) => {
    if (error) return res.sendStatus(500).json(error);
    return response.json(data);
  });
});

// Get a game by ID
router.get(`${databaseName}/:id`, (request, response) => {
  game.model.findById(request.params.id, (error, data) => {
    if (error) return response.sendStatus(500).json(error);
    return response.json(data);
  });
});

// Delete a game by ID
router.delete(`${databaseName}/:id`, (request, response) => {
  game.model.findByIdAndRemove(request.params.id, {}, (error, data) => {
    if (error) return response.sendStatus(500).json(error);
    return response.json(data);
  });
});

// Update a game by ID
router.put(`${databaseName}/:id`, (request, response) => {
  const body = request.body;
  game.model.findByIdAndUpdate(
    request.params.id,
    {
      $set: {
        name: body.name,
        score: body.score,
        duration: body.duration,
        largestChain: body.largestChain,
        totalClears: body.totalClears,
        month: body.month,
        day: body.day,
        year: body.year,
        hour: body.hour,
        minute: body.minute,
        meridian: body.meridian,
        gamelog: body.gameLog,
      },
    },
    (error, data) => {
      if (error) return response.sendStatus(500).json(error);
      return response.json(request.body);
    }
  );
});

module.exports = router;
