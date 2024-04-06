require("dotenv").config();
const express = require("express");
const authenticateToken = require("./middleware/authenticate");
const { query } = require("./db");
const app = express();
app.use(express.json());

app.use("/api/admin", require("./routes/admin"));

app.use("/api/matches", require("./routes/matches"));

app.post("/api/teams/:team_id/squad", authenticateToken, async (req, res) => {
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
app.use("/api/teams", require("./routes/teams"));

app.use("/api/players", require("./routes/player"));

app.listen(3000, () => console.log("Server started on port 3000"));
