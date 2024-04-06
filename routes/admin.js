const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { query } = require("../db");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await query(
    "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
    [username, hashedPassword, email]
  );

  res.status(200).json({
    status: "Admin Account successfully created",
    status_code: 200,
    user_id: result.insertId,
  });
});

// Admin login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const results = await query("SELECT * FROM users WHERE username = ?", [
    username,
  ]);
  const user = results[0];

  if (!user) {
    return res.status(401).json({
      status: "Incorrect username/password provided. Please retry",
      status_code: 401,
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      status: "Incorrect username/password provided. Please retry",
      status_code: 401,
    });
  }

  const accessToken = jwt.sign(
    { username: user.username, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  res.status(200).json({
    status: "Login successful",
    status_code: 200,
    user_id: user.id,
    access_token: accessToken,
  });
});

module.exports = router;
