const express = require("express");
const { query } = require("../db");
const router = express.Router();

router.get("/:player_id/stats", async (req, res) => {
  const player_id = req.params.player_id;
  const results = await query(
    `SELECT players.id, players.name, player_stats.matches_played, player_stats.runs, player_stats.average, player_stats.strike_rate 
          FROM players 
          LEFT JOIN player_stats ON players.id = player_stats.player_id 
          WHERE players.id = ?`,
    [player_id]
  );

  if (results.length === 0) return res.sendStatus(404);

  const player = results[0];

  res.status(200).json({
    player_id: player.id,
    name: player.name,
    matches_played: player.matches_played,
    runs: player.runs,
    average: player.average,
    strike_rate: player.strike_rate,
  });
});

module.exports = router;
