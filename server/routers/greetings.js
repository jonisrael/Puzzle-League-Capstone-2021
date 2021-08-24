const { Router } = require("express");
const router = Router();

// routes should be plural (greetings)
router.route("/greetings/:name").get((request, response) => {
  const name = request.params.name;
  response.status(418).json({ message: `Hello ${name}` });
});

module.exports = router;
