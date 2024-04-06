-- Create the database
CREATE DATABASE cricbuzz;
USE cricbuzz;

-- Create the users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE
);

-- Create the teams table
CREATE TABLE teams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

-- Create the matches table
CREATE TABLE matches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  team_1 VARCHAR(255) NOT NULL,
  team_2 VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  venue VARCHAR(255) NOT NULL,
  status ENUM('upcoming', 'live', 'completed') NOT NULL DEFAULT 'upcoming',
  FOREIGN KEY (team_1) REFERENCES teams(name),
  FOREIGN KEY (team_2) REFERENCES teams(name)
);

-- Create the players table
CREATE TABLE players (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  team_id INT NOT NULL,
  FOREIGN KEY (team_id) REFERENCES teams(id)
);

-- Create the player_stats table
CREATE TABLE player_stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  player_id INT NOT NULL,
  matches_played INT NOT NULL DEFAULT 0,
  runs INT NOT NULL DEFAULT 0,
  average DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
  strike_rate DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
  FOREIGN KEY (player_id) REFERENCES players(id)
);