-- =========================================================
-- userAccounts (20 users)
-- =========================================================
INSERT INTO userAccounts (username, email, password_hash) VALUES
('alice', 'alice@example.com', 'hash_alice'),
('bob', 'bob@example.com', 'hash_bob'),
('charlie', 'charlie@example.com', 'hash_charlie'),
('daisy', 'daisy@example.com', 'hash_daisy'),
('edgar', 'edgar@example.com', 'hash_edgar'),
('fiona', 'fiona@example.com', 'hash_fiona'),
('george', 'george@example.com', 'hash_george'),
('hannah', 'hannah@example.com', 'hash_hannah'),
('ivan', 'ivan@example.com', 'hash_ivan'),
('julia', 'julia@example.com', 'hash_julia'),
('kevin', 'kevin@example.com', 'hash_kevin'),
('laura', 'laura@example.com', 'hash_laura'),
('mike', 'mike@example.com', 'hash_mike'),
('nina', 'nina@example.com', 'hash_nina'),
('oliver', 'oliver@example.com', 'hash_oliver'),
('paula', 'paula@example.com', 'hash_paula'),
('quentin', 'quentin@example.com', 'hash_quentin'),
('rachel', 'rachel@example.com', 'hash_rachel'),
('steve', 'steve@example.com', 'hash_steve'),
('tina', 'tina@example.com', 'hash_tina');

-- =========================================================
-- players
-- =========================================================
INSERT INTO players (id, pseudonym, bio, coins, avatar_url) VALUES
(1, 'BeanAlice', 'Falls with confidence', 120, 'https://example.com/a1.png'),
(2, 'BobBounce', 'Never stops jumping', 80, 'https://example.com/a2.png'),
(3, 'ChaosCharlie', 'Hits every obstacle', 200, 'https://example.com/a3.png'),
(4, 'DizzyDaisy', 'Spins a lot', 60, 'https://example.com/a4.png'),
(5, 'EdgeEdgar', 'Lives dangerously', 90, 'https://example.com/a5.png'),
(6, 'FumbleFiona', 'Trips at the finish', 40, 'https://example.com/a6.png'),
(7, 'GrabbyGeorge', 'Loves grabbing', 110, 'https://example.com/a7.png'),
(8, 'HopHannah', 'Pure jump timing', 130, 'https://example.com/a8.png'),
(9, 'InertiaIvan', 'Physics enjoyer', 70, 'https://example.com/a9.png'),
(10, 'JellyJulia', 'Wobbly but effective', 150, 'https://example.com/a10.png'),
(11, 'KnockoutKevin', 'Aggressive bean', 95, 'https://example.com/a11.png'),
(12, 'LazyLaura', 'Still qualifies', 85, 'https://example.com/a12.png'),
(13, 'MomentumMike', 'Never slows down', 160, 'https://example.com/a13.png'),
(14, 'NudgeNina', 'Small pushes matter', 75, 'https://example.com/a14.png'),
(15, 'OfftrackOliver', 'Wrong way expert', 55, 'https://example.com/a15.png'),
(16, 'PushyPaula', 'Chaos agent', 140, 'https://example.com/a16.png'),
(17, 'QuickQuentin', 'Fast reactions', 180, 'https://example.com/a17.png'),
(18, 'RagdollRachel', 'Physics victim', 65, 'https://example.com/a18.png'),
(19, 'SlipSteve', 'Banana peel magnet', 45, 'https://example.com/a19.png'),
(20, 'TiltedTina', 'Tilts easily', 100, 'https://example.com/a20.png');

-- =========================================================
-- friends
-- =========================================================

-- Pending friend requests (one-way)
INSERT INTO friends (player_id, friend_id, status) VALUES
(1, 4, 'pending'),
(2, 5, 'pending'),
(3, 6, 'pending'),
(4, 7, 'pending'),
(5, 8, 'pending'),
(6, 9, 'pending'),
(7, 10, 'pending'),
(8, 11, 'pending'),
(9, 12, 'pending'),
(10, 13, 'pending');

-- Accepted friendships (bidirectional)
INSERT INTO friends (player_id, friend_id, status) VALUES
(1, 2, 'accepted'), (2, 1, 'accepted'),
(1, 3, 'accepted'), (3, 1, 'accepted'),
(1, 5, 'accepted'), (5, 1, 'accepted'),
(2, 3, 'accepted'), (3, 2, 'accepted'),
(2, 4, 'accepted'), (4, 2, 'accepted'),
(2, 6, 'accepted'), (6, 2, 'accepted'),
(3, 4, 'accepted'), (4, 3, 'accepted'),
(3, 7, 'accepted'), (7, 3, 'accepted'),
(4, 5, 'accepted'), (5, 4, 'accepted'),
(4, 8, 'accepted'), (8, 4, 'accepted'),
(5, 6, 'accepted'), (6, 5, 'accepted'),
(5, 9, 'accepted'), (9, 5, 'accepted'),
(6, 7, 'accepted'), (7, 6, 'accepted'),
(6, 10, 'accepted'), (10, 6, 'accepted'),
(7, 8, 'accepted'), (8, 7, 'accepted'),
(7, 11, 'accepted'), (11, 7, 'accepted'),
(8, 9, 'accepted'), (9, 8, 'accepted'),
(8, 12, 'accepted'), (12, 8, 'accepted'),
(9, 10, 'accepted'), (10, 9, 'accepted'),
(9, 13, 'accepted'), (13, 9, 'accepted'),
(10, 11, 'accepted'), (11, 10, 'accepted'),
(10, 14, 'accepted'), (14, 10, 'accepted'),
(11, 12, 'accepted'), (12, 11, 'accepted'),
(11, 15, 'accepted'), (15, 11, 'accepted'),
(12, 13, 'accepted'), (13, 12, 'accepted'),
(12, 16, 'accepted'), (16, 12, 'accepted'),
(13, 14, 'accepted'), (14, 13, 'accepted'),
(13, 17, 'accepted'), (17, 13, 'accepted'),
(14, 15, 'accepted'), (15, 14, 'accepted'),
(14, 18, 'accepted'), (18, 14, 'accepted'),
(15, 16, 'accepted'), (16, 15, 'accepted'),
(15, 19, 'accepted'), (19, 15, 'accepted'),
(16, 17, 'accepted'), (17, 16, 'accepted'),
(16, 20, 'accepted'), (20, 16, 'accepted'),
(17, 18, 'accepted'), (18, 17, 'accepted'),
(18, 19, 'accepted'), (19, 18, 'accepted'),
(19, 20, 'accepted'), (20, 19, 'accepted');



-- =========================================================
-- games
-- =========================================================
INSERT INTO games (mode, start_time, end_time) VALUES
('Door Dash', '2026-02-01 10:00:00', '2026-02-01 10:07:00'),
('Hex-A-Gone', '2026-02-01 10:10:00', '2026-02-01 10:18:00'),
('Slime Climb', '2026-02-01 10:20:00', '2026-02-01 10:30:00'),
('Jump Club', '2026-02-01 10:35:00', '2026-02-01 10:42:00'),
('Roll Out', '2026-02-01 10:45:00', '2026-02-01 10:55:00'),
('Tail Tag', '2026-02-01 11:00:00', '2026-02-01 11:08:00'),
('Fruit Chute', '2026-02-01 11:10:00', '2026-02-01 11:17:00'),
('Fall Ball', '2026-02-01 11:20:00', '2026-02-01 11:35:00');

-- =========================================================
-- playerStats
-- Each player plays multiple games
-- Each game has 2–5 players
-- eliminated = NULL when game has no elimination
-- =========================================================
INSERT INTO playerStats (player_id, game_id, chrono, position, eliminated) VALUES

-- Game 1 (Door Dash, elimination)
(1, 1, 420, 1, FALSE),
(2, 1, 450, 2, FALSE),
(3, 1, 470, 3, TRUE),
(4, 1, 480, 4, TRUE),
(5, 1, 500, 5, TRUE),

-- Game 2 (Hex-A-Gone, elimination)
(6, 2, 510, 1, FALSE),
(7, 2, 530, 2, FALSE),
(8, 2, 560, 3, TRUE),
(9, 2, 590, 4, TRUE),

-- Game 3 (Slime Climb, elimination)
(10, 3, 600, 1, FALSE),
(11, 3, 620, 2, FALSE),
(12, 3, 650, 3, TRUE),
(13, 3, 680, 4, TRUE),

-- Game 4 (Jump Club, NO elimination)
(1, 4, 420, 1, NULL),
(6, 4, 430, 2, NULL),
(10, 4, 440, 3, NULL),

-- Game 5 (Roll Out, NO elimination)
(14, 5, 500, 1, NULL),
(15, 5, 510, 2, NULL),
(16, 5, 520, 3, NULL),
(17, 5, 530, 4, NULL),

-- Game 6 (Tail Tag, elimination)
(2, 6, 480, 1, FALSE),
(7, 6, 500, 2, FALSE),
(18, 6, 520, 3, TRUE),

-- Game 7 (Fruit Chute, elimination)
(3, 7, 470, 1, FALSE),
(8, 7, 490, 2, FALSE),
(19, 7, 510, 3, TRUE),
(20, 7, 530, 4, TRUE),

-- Game 8 (Fall Ball, team game → NO elimination)
(4, 8, 900, 1, NULL),
(9, 8, 910, 2, NULL),
(13, 8, 920, 3, NULL),
(17, 8, 930, 4, NULL);

-- =========================================================
-- items
-- =========================================================
INSERT INTO items (player_id, item_name, item_type) VALUES
(1, 'Bean Crown', 'Cosmetic'),
(2, 'Rubber Helmet', 'Cosmetic'),
(3, 'Chaos Cape', 'Cosmetic'),
(4, 'Spin Shoes', 'Cosmetic'),
(5, 'Edge Gloves', 'Cosmetic'),
(6, 'Clown Shoes', 'Cosmetic'),
(7, 'Grab Mittens', 'Cosmetic'),
(8, 'Spring Boots', 'Cosmetic'),
(9, 'Physics Goggles', 'Cosmetic'),
(10, 'Jelly Suit', 'Cosmetic'),
(11, 'Boxing Outfit', 'Cosmetic'),
(12, 'Sleepy Hat', 'Cosmetic'),
(13, 'Momentum Jacket', 'Cosmetic'),
(14, 'Nudge Pads', 'Cosmetic'),
(15, 'Wrong Way Sign', 'Cosmetic'),
(16, 'Push Gloves', 'Cosmetic'),
(17, 'Speed Visor', 'Cosmetic'),
(18, 'Ragdoll Cape', 'Cosmetic'),
(19, 'Slip Shoes', 'Cosmetic'),
(20, 'Tilt Crown', 'Cosmetic');

-- =========================================================
-- leaderboard
-- =========================================================
INSERT INTO leaderboard (player_id, total_score, global_rank) VALUES
(17, 980, 1),
(13, 920, 2),
(10, 880, 3),
(1, 850, 4),
(8, 820, 5),
(5, 790, 6),
(16, 760, 7),
(11, 730, 8),
(2, 700, 9),
(15, 680, 10),
(3, 650, 11),
(6, 620, 12),
(9, 600, 13),
(14, 580, 14),
(4, 550, 15),
(18, 520, 16),
(7, 500, 17),
(12, 480, 18),
(19, 450, 19),
(20, 430, 20);

-- =========================================================
-- achievements
-- =========================================================
INSERT INTO achievements (id, achievement_name, achievement_description, icon, category) VALUES
(1, 'First Win', 'Win your first game', '🏆', 'bronze'),
(2, '10 Wins', 'Win 10 games', '🥇', 'silver'),
(3, '50 Wins', 'Win 50 games', '👑', 'gold'),
(4, 'First Game', 'Play your first game', '🎮', 'bronze'),
(5, '100 Games', 'Play 100 games', '🎯', 'gold'),
(6, 'Level 5', 'Reach level 5', '⭐', 'silver'),
(7, 'Level 10', 'Reach level 10', '✨', 'gold'),
(8, 'Crown Master', 'Win a game in Crown mode', '👑', 'silver'),
(9, 'Survivor', 'Win a game in Survive mode', '💪', 'silver');
