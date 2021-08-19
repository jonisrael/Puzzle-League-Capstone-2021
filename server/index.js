const { Router } = require("express");
const game = require("../models/game");

const router = Router();

// Create record in MongoDB
router.post("/games", (request, response) => {
  const newPizza = new game.model(request.body);
  newPizza.save((err, game) => {
    return err ? response.sendStatus(500).json(err) : response.json(game);
  });
});

// Get all game records
router.get("/games", (request, response) => {
  game.model.find({}, (error, data) => {
    if (error) return res.sendStatus(500).json(error);
    return response.json(data);
  });
});

// Get a game by ID
router.get("/games/:id", (request, response) => {
  game.model.findById(request.params.id, (error, data) => {
    if (error) return response.sendStatus(500).json(error);
    return response.json(data);
  });
});

// Delete a game by ID
router.delete("/games/:id", (request, response) => {
  game.model.findByIdAndRemove(request.params.id, {}, (error, data) => {
    if (error) return response.sendStatus(500).json(error);
    return response.json(data);
  });
});

// Update a game by ID
router.put("/games/:id", (request, response) => {
  const body = request.body;
  game.model.findByIdAndUpdate(
    request.params.id,
    {
      $set: {
        crust: body.crust,
        cheese: body.cheese,
        sauce: body.sauce,
        toppings: body.toppings
      }
    },
    (error, data) => {
      if (error) return response.sendStatus(500).json(error);
      return response.json(request.body);
    }
  );
});

module.exports = router;
