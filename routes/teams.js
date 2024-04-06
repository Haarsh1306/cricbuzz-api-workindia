const express = require("express");
const authenticateToken = require("../middleware/authenticate");
const { query } = require("../db");
const router = express.Router();

router.post("/:team_id/squad", authenticateToken, async (req, res) => {
  const { name, role } = req.body;
  const teamId = req.params.team_id;

  const result = await query(
    "INSERT INTO players (name, role, team_id) VALUES (?, ?, ?)",
    [name, role, teamId]
  );
  res.status(200).json({
    message: "Player added to squad successfully",
    player_id: result.insertId,
  });
});

module.exports = router;
