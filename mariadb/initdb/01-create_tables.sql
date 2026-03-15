USE db;

-- Users table
CREATE TABLE userAccounts (
	id INT AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(50) NOT NULL UNIQUE,
	email VARCHAR(100) NOT NULL UNIQUE,
	password_hash VARCHAR(255) NOT NULL,
	enable_2FA BOOLEAN DEFAULT FALSE,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Players table
CREATE TABLE players (
	id INT PRIMARY KEY,
	pseudonym VARCHAR(50) NOT NULL,
	bio TEXT,
	xp INT DEFAULT 0,
	`level` INT DEFAULT 0,
	coins INT DEFAULT 0,
	avatar_url VARCHAR(255),
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	FOREIGN KEY (id) REFERENCES userAccounts(id) ON DELETE CASCADE
);

-- Friends table
CREATE TABLE friends (
	id INT AUTO_INCREMENT PRIMARY KEY,
	player_id INT NOT NULL,
	friend_id INT NOT NULL,
	`status` ENUM('pending', 'accepted') NOT NULL DEFAULT 'pending',
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	UNIQUE KEY unique_request (player_id, friend_id),
	CONSTRAINT check_no_self_friend CHECK (player_id <> friend_id),
	FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
	FOREIGN KEY (friend_id) REFERENCES players(id) ON DELETE CASCADE
);

-- Games table
CREATE TABLE games (
	id INT AUTO_INCREMENT PRIMARY KEY,
	roomId VARCHAR(255) UNIQUE,
	mode VARCHAR(100),
	start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
	end_time DATETIME
);

-- PlayerStats table
CREATE TABLE playerStats (
	id INT AUTO_INCREMENT PRIMARY KEY,
	player_id INT NOT NULL,
	game_id INT NOT NULL,
	chrono INT,
	position INT,
	eliminated BOOLEAN,
	FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
	FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- Items table
CREATE TABLE items (
	id INT AUTO_INCREMENT PRIMARY KEY,
	player_id INT NOT NULL,
	item_name VARCHAR(100) NOT NULL,
	item_type VARCHAR(50),
	acquired_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

CREATE TABLE achievements (
	id INT AUTO_INCREMENT PRIMARY KEY,
	achievement_name VARCHAR(50) NOT NULL,
	achievement_description VARCHAR(200) NOT NULL,
	icon VARCHAR (100),
	category VARCHAR(50)
);

CREATE TABLE player_achievements (
	id INT AUTO_INCREMENT PRIMARY KEY,
	player_id INT NOT NULL,
	achievement_id INT NOT NULL,
	acquired_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
	FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE,
	UNIQUE KEY unique_player_achievement (player_id, achievement_id)
);

-- Leaderboard table
CREATE TABLE leaderboard (
	id INT AUTO_INCREMENT PRIMARY KEY,
	player_id INT NOT NULL,
	total_score INT DEFAULT 0,
	global_rank INT,
	last_update DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);
