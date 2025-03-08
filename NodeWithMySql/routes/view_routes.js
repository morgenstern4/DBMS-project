const express = require("express");
const con = require("../server/connection");
const router = express.Router();
const analyticsRouter = require("./analytics"); // Import the analytics router

// Use the analytics router for all analytics-related routes with /view_tables prefix
router.use("/view_tables", analyticsRouter);

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

module.exports = router;
