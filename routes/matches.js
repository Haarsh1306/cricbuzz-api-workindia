const express = require("express");
const authenticateToken = require("../middleware/authenticate");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { query } = require("../db");

router.post("/", authenticateToken, async (req, res) => {
  const { team_1, team_2, date, venue } = req.body;
  console.log(req.user, req.body);

  await query("INSERT IGNORE INTO teams (name) VALUES (?)", [team_1]);
  await query("INSERT IGNORE INTO teams (name) VALUES (?)", [team_2]);

  const result = await query(
    "INSERT INTO matches (team_1, team_2, date, venue, status) VALUES (?, ?, ?, ?, ?)",
    [team_1, team_2, date, venue, "upcoming"]
  );
  res.status(200).json({
    message: "Match created successfully",
    match_id: result.insertId,
  });
});

router.get("/", async (req, res) => {
  const results = await query("SELECT * FROM matches");
  res.status(200).json({ matches: results });
});

router.get("/:id", async (req, res) => {
  const matchId = req.params.id;

  const results = await query(
    `SELECT matches.*, 
        team_1_players.id AS team1_player_id, 
        team_1_players.name AS team1_player_name, 
        team_2_players.id AS team2_player_id, 
        team_2_players.name AS team2_player_name 
        FROM matches 
        LEFT JOIN teams AS team_1_info ON matches.team_1 = team_1_info.name 
        LEFT JOIN teams AS team_2_info ON matches.team_2 = team_2_info.name
        LEFT JOIN players AS team_1_players ON team_1_players.team_id = team_1_info.id 
        LEFT JOIN players AS team_2_players ON team_2_players.team_id = team_2_info.id 
        WHERE matches.id = ?`,
    [matchId]
  );
  console.log(results);

  if (results.length === 0) return res.sendStatus(404);

  const responseData = {
    match_id: results[0].id,
    team_1: results[0].team_1,
    team_2: results[0].team_2,
    date: results[0].date,
    venue: results[0].venue,
    status: results[0].status,
    squads: {
      team_1: [],
      team_2: [],
    },
  };

  results.forEach((row) => {
    if (row.team1_player_id) {
      responseData.squads.team_1.push({
        player_id: row.team1_player_id,
        name: row.team1_player_name,
      });
    }
    if (row.team2_player_id) {
      responseData.squads.team_2.push({
        player_id: row.team2_player_id,
        name: row.team2_player_name,
      });
    }
  });

  res.status(200).json(responseData);
});

module.exports = router;
