const express = require("express");
const con = require("../server/connection");
const router = express.Router();

// Helper function to create routes
function createViewRoute(routePath, tableName, viewFile) {
  router.get(routePath, (req, res) => {
    const sql = `SELECT * FROM ${tableName}`;
    con.query(sql, (err, result) => {
      if (err) {
        console.error(`Error fetching ${tableName}:`, err);
        return res.status(500).send("Database error");
      }
      res.render(viewFile, { [tableName]: result });
    });
  });
}

// Existing routes for viewing tables
createViewRoute("/view_tables/squads", "squads", "squads_list");
createViewRoute("/view_tables/clubs", "clubs", "clubs_list");
createViewRoute("/view_tables/stadiums", "stadiums", "stadiums_list");
createViewRoute("/view_tables/matches", "matches", "matches_list");
createViewRoute("/view_tables/positions", "positions", "positions_list");
createViewRoute("/view_tables/all_players_info", "all_players_info", "all_players_info");
createViewRoute("/view_tables/players_stats", "players_stats", "players_stats");
createViewRoute("/view_tables/keepers_stats", "keepers_stats", "keepers_stats");

// New routes for custom queries
router.get("/view_tables/top_players", (req, res) => {
  const sql = `
    SELECT player_name, goals, matches_played
    FROM all_players_info
    JOIN players_stats ON all_players_info.player_id = players_stats.player_id
    ORDER BY goals DESC
    LIMIT 5;
  `;
  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching top players:", err);
      return res.status(500).send("Database error");
    }
    res.render("top_players", { top_players: result });
  });
});

router.get("/view_tables/squads_with_high_goals", (req, res) => {
  const sql = `
    SELECT squad_name, SUM(goals) AS total_goals
    FROM squads
    JOIN all_players_info ON squads.squad_id = all_players_info.squad_id
    JOIN players_stats ON all_players_info.player_id = players_stats.player_id
    GROUP BY squad_name
    HAVING SUM(goals) > 10;
  `;
  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching squads with high goals:", err);
      return res.status(500).send("Database error");
    }
    res.render("squads_with_high_goals", { squads: result });
  });
});

router.get("/view_tables/keepers", (req, res) => {
  const sql = `
SELECT 
    p.player_name AS goalkeeper_name,
    s.squad_name,
    c.club_name
FROM all_players_info p
JOIN keepers_stats ks ON p.player_id = ks.player_id
JOIN squads s ON p.squad_id = s.squad_id
JOIN clubs c ON p.club_id = c.club_id
ORDER BY p.player_name ASC;
  `;
  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching keepers:", err);
      return res.status(500).send("Database error");
    }
    res.render("keepers", { keepers: result });
  });
});

router.get("/view_tables/squads_and_players", (req, res) => {
  const sql = `
SELECT s.squad_name, p.player_name
FROM Squads s
CROSS JOIN All_players_info p
WHERE s.squad_id = p.squad_id
GROUP BY s.squad_name, p.player_name;
  `;
  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching squads and players:", err);
      return res.status(500).send("Database error");
    }
    res.render("squads_and_players", { squads_and_players: result });
  });
});

router.get("/view_tables/squad_goals", (req, res) => {
  const sql = `
    SELECT squad_name, SUM(goals) AS total_goals
    FROM squads
    JOIN all_players_info ON squads.squad_id = all_players_info.squad_id
    JOIN players_stats ON all_players_info.player_id = players_stats.player_id
    GROUP BY squad_name
    ORDER BY total_goals DESC;
  `;
  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching squad goals:", err);
      return res.status(500).send("Database error");
    }
    res.render("squad_goals", { squad_goals: result });
  });
});

router.get("/view_tables/clean_sheet_percentage", (req, res) => {
  const sql = `
    SELECT 
        p.player_name AS goalkeeper_name,
        p.matches_played,
        k.clean_sheets,
        (k.clean_sheets * 100.0 / p.matches_played) AS clean_sheet_percentage
    FROM 
        all_players_info p
    JOIN 
        keepers_stats k ON p.player_id = k.player_id
    ORDER BY 
        k.clean_sheets DESC;
  `;
  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching clean sheet percentages:", err);
      return res.status(500).send("Database error");
    }
    res.render("clean_sheet_percentage", { clean_sheets: result });
  });
});

// router.get("/view_tables/top_scorers", (req, res) => {
//   const sql = `
//     WITH TopScorers AS (
//       SELECT player_id, goals
//       FROM players_stats
//       WHERE goals > 3
//     )
//     SELECT player_name, goals
//     FROM TopScorers
//     JOIN all_players_info ON TopScorers.player_id = all_players_info.player_id;
//   `;
//   con.query(sql, (err, result) => {
//     if (err) {
//       console.error("Error fetching top scorers:", err);
//       return res.status(500).send("Database error");
//     }
//     res.render("top_scorers", { top_scorers: result });
//   });
// });

router.get("/view_tables/top_scorers", (req, res) => {
  const limit = parseInt(req.query.limit) || 5; // Convert to integer, default to 5
  const sql = `
    WITH TopScorers AS (
      SELECT player_id, goals
      FROM players_stats
      ORDER BY goals DESC
      LIMIT ?
    )
    SELECT player_name, goals
    FROM TopScorers
    JOIN all_players_info ON TopScorers.player_id = all_players_info.player_id;
  `;
  con.query(sql, [limit], (err, result) => {
    if (err) {
      console.error("Error fetching top scorers:", err);
      return res.status(500).send("Database error");
    }
    res.render("top_scorers", { top_scorers: result, selectedLimit: limit });
  });
});

router.get("/view_tables/players_with_penalties", (req, res) => {
  const sql = `
SELECT 
    p.player_name,
    (SELECT k.penalty_kicks_attempted FROM keepers_stats k WHERE k.player_id = p.player_id) AS penalties_attempted,
    (SELECT k.penalty_kicks_saved FROM keepers_stats k WHERE k.player_id = p.player_id) AS penalties_saved,
    (SELECT k.penalty_kicks_attempted - k.penalty_kicks_saved FROM keepers_stats k WHERE k.player_id = p.player_id) AS penalties_missed
FROM 
    all_players_info p
WHERE 
    EXISTS (
        SELECT 1
        FROM keepers_stats k
        WHERE k.player_id = p.player_id
        AND k.penalty_kicks_attempted > 0
        AND k.penalty_kicks_saved = 0
    );
  `;
  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching players with penalties:", err);
      return res.status(500).send("Database error");
    }
    res.render("players_with_penalties", { players: result });
  });
});

router.get("/view_tables/above_average_goals", (req, res) => {
  const sql = `
    SELECT player_name, goals
    FROM all_players_info
    JOIN players_stats ON all_players_info.player_id = players_stats.player_id
    WHERE goals > (SELECT AVG(goals) FROM players_stats);
  `;
  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching players with above-average goals:", err);
      return res.status(500).send("Database error");
    }
    res.render("above_average_goals", { players: result });
  });
});

router.get("/view_tables/match-finder", (req, res) => {
  const sql = "SELECT squad_id, squad_name FROM Squads";
  con.query(sql, (err, squads) => {
      if (err) {
          console.error("Error fetching squads:", err);
          return res.status(500).send("Database error");
      }
      res.render("match-finder", { squads });
  });
});

router.get("/view_tables/find-matches", (req, res) => {
  const squad1 = req.query.squad1;
  const squad2 = req.query.squad2;

  const sql = `
      SELECT 
          m.match_id, 
          m.match_date, 
          s1.squad_name AS squad_1_name, 
          s2.squad_name AS squad_2_name, 
          m.score_squad_1, 
          m.score_squad_2
      FROM matches m
      JOIN Squads s1 ON m.squad_1_id = s1.squad_id
      JOIN Squads s2 ON m.squad_2_id = s2.squad_id
      WHERE (m.squad_1_id = ? AND m.squad_2_id = ?)
         OR (m.squad_1_id = ? AND m.squad_2_id = ?)
  `;
  const params = [squad1, squad2, squad2, squad1];

  con.query(sql, params, (err, matches) => {
      if (err) {
          console.error("Error fetching matches:", err);
          return res.status(500).send("Database error");
      }

      res.render("match-results", { matches });
  });
});

// Route for booking section
router.get("/view_tables/booking", (req, res) => {
  res.render("booking", { individualResults: null, teamResults: null });
});

// Route for handling individual player search
// Route for showing all individual players' booking data
router.get("/view_tables/booking/all_individuals", (req, res) => {
  const sql = `
    SELECT 
        p.player_name, 
        s.squad_name, 
        ps.yellow_cards, 
        ps.red_cards
    FROM players_stats ps
    JOIN all_players_info p ON ps.player_id = p.player_id
    JOIN squads s ON p.squad_id = s.squad_id
    ORDER BY ps.yellow_cards DESC, ps.red_cards DESC;
  `;
  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching all individual booking data:", err);
      return res.status(500).send("Database error");
    }
    res.render("booking", { individualResults: result, teamResults: null });
  });
});

// Route for handling individual player search
router.post("/view_tables/booking/individual", (req, res) => {
  const playerName = req.body.playerName;
  const sql = `
    SELECT 
        p.player_name, 
        s.squad_name, 
        ps.yellow_cards, 
        ps.red_cards
    FROM players_stats ps
    JOIN all_players_info p ON ps.player_id = p.player_id
    JOIN squads s ON p.squad_id = s.squad_id
    WHERE p.player_name LIKE ?
    ORDER BY ps.yellow_cards DESC, ps.red_cards DESC;
  `;
  con.query(sql, [`%${playerName}%`], (err, result) => {
    if (err) {
      console.error("Error fetching individual booking data:", err);
      return res.status(500).send("Database error");
    }
    res.render("booking", { individualResults: result, teamResults: null });
  });
});

// Route for handling team/squad search
router.post("/view_tables/booking/team", (req, res) => {
  const squadName = req.body.squadName;
  const sql = `
    SELECT squad_name, SUM(yellow_cards) AS total_yellow_cards, SUM(red_cards) AS total_red_cards
    FROM players_stats
    JOIN all_players_info ON players_stats.player_id = all_players_info.player_id
    JOIN squads ON all_players_info.squad_id = squads.squad_id
    WHERE squad_name LIKE ?
    GROUP BY squad_name;
  `;
  con.query(sql, [`%${squadName}%`], (err, result) => {
    if (err) {
      console.error("Error fetching team booking data:", err);
      return res.status(500).send("Database error");
    }
    res.render("booking", { individualResults: null, teamResults: result });
  });
});


// Route for showing all individual players' booking data
// router.get("/view_tables/booking/all_individuals", (req, res) => {
//   const sql = `
//     SELECT player_name, yellow_cards, red_cards
//     FROM players_stats
//     JOIN all_players_info ON players_stats.player_id = all_players_info.player_id
//     ORDER BY yellow_cards DESC, red_cards DESC;
//   `;
//   con.query(sql, (err, result) => {
//     if (err) {
//       console.error("Error fetching all individual booking data:", err);
//       return res.status(500).send("Database error");
//     }
//     res.render("booking", { individualResults: result, teamResults: null });
//   });
// });

// Route for showing all teams' booking data
router.get("/view_tables/booking/all_teams", (req, res) => {
  const sql = `
    SELECT squad_name, SUM(yellow_cards) AS total_yellow_cards, SUM(red_cards) AS total_red_cards
    FROM players_stats
    JOIN all_players_info ON players_stats.player_id = all_players_info.player_id
    JOIN squads ON all_players_info.squad_id = squads.squad_id
    GROUP BY squad_name
    ORDER BY total_yellow_cards DESC, total_red_cards DESC;
  `;
  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching all team booking data:", err);
      return res.status(500).send("Database error");
    }
    res.render("booking", { individualResults: null, teamResults: result });
  });
});

module.exports = router;