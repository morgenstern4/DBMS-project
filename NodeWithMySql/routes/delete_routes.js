const express = require("express");
const con = require("../server/connection");
const path = require("path");

const router = express.Router();

// Reusable function for rendering delete success response
function renderDeleteSuccess(res, table, recordId, viewUrl) {
    res.send(`
        <h1>Delete Successful</h1>
        <p>The record with ID <strong>${recordId}</strong> has been deleted successfully from the ${table} table.</p>
        <a href="${viewUrl}" style="font-size: 18px; color: blue; text-decoration: underline;">
            Back to ${table.charAt(0).toUpperCase() + table.slice(1)} List
        </a>
    `);
}

// -------------------- Delete Routes ------------------------------

// Delete squad info
router.get("/tables/delete-squad-info", (req, res) => {
    const squad_id = req.query.squad_id;

    if (!squad_id) {
        return res.status(400).send("<h1>Bad Request</h1><p>Missing squad_id parameter.</p>");
    }

    const sql = "DELETE FROM squads WHERE squad_id = ?";
    con.query(sql, [squad_id], (err, result) => {
        if (err) {
            console.error("Error deleting squad record:", err);
            return res.status(500).send("<h1>Database Error</h1><p>Failed to delete squad. Please try again later.</p>");
        }
        if (result.affectedRows > 0) {
            renderDeleteSuccess(res, 'Squad', squad_id, '/view_tables/squads');
        } else {
            res.send(`
                <h1>Record Not Found</h1>
                <p>No squad with ID <strong>${squad_id}</strong> was found.</p>
                <a href="/view_tables/squads" style="font-size: 18px; color: blue; text-decoration: underline;">Back to Squad List</a>
            `);
        }
    });
});

// Delete club info
router.get("/tables/delete-club-info", (req, res) => {
    const club_id = req.query.club_id;

    if (!club_id) {
        return res.status(400).send("<h1>Bad Request</h1><p>Missing club_id parameter.</p>");
    }

    const sql = "DELETE FROM clubs WHERE club_id = ?";
    con.query(sql, [club_id], (err, result) => {
        if (err) {
            console.error("Error deleting club:", err);
            return res.status(500).send("<h1>Database Error</h1><p>Failed to delete club. Please try again later.</p>");
        }
        if (result.affectedRows > 0) {
            renderDeleteSuccess(res, 'Club', club_id, '/view_tables/clubs');
        } else {
            res.send(`
                <h1>Record Not Found</h1>
                <p>No club with ID <strong>${club_id}</strong> was found.</p>
                <a href="/view_tables/clubs" style="font-size: 18px; color: blue; text-decoration: underline;">Back to Club List</a>
            `);
        }
    });
});

// Delete position info
router.get("/tables/delete-position-info", (req, res) => {
    const position_id = req.query.position_id;

    if (!position_id) {
        return res.status(400).send("<h1>Bad Request</h1><p>Missing position_id parameter.</p>");
    }

    const sql = "DELETE FROM positions WHERE position_id = ?";
    con.query(sql, [position_id], (err, result) => {
        if (err) {
            console.error("Error deleting position record:", err);
            return res.status(500).send("<h1>Database Error</h1><p>Failed to delete position. Please try again later.</p>");
        }
        if (result.affectedRows > 0) {
            renderDeleteSuccess(res, 'Position', position_id, '/view_tables/positions');
        } else {
            res.send(`
                <h1>Record Not Found</h1>
                <p>No position with ID <strong>${position_id}</strong> was found.</p>
                <a href="/view_tables/positions" style="font-size: 18px; color: blue; text-decoration: underline;">Back to Position List</a>
            `);
        }
    });
});

// Delete player info
router.get("/tables/delete-all-player-info", (req, res) => {
    const player_id = req.query.player_id;

    if (!player_id) {
        return res.status(400).send("<h1>Bad Request</h1><p>Missing player_id parameter.</p>");
    }

    const sql = "DELETE FROM all_players_info WHERE player_id = ?";
    con.query(sql, [player_id], (err, result) => {
        if (err) {
            console.error("Error deleting player record:", err);
            return res.status(500).send("<h1>Database Error</h1><p>Failed to delete player. Please try again later.</p>");
        }
        if (result.affectedRows > 0) {
            renderDeleteSuccess(res, 'Player', player_id, '/view_tables/all_players_info');
        } else {
            res.send(`
                <h1>Record Not Found</h1>
                <p>No player with ID <strong>${player_id}</strong> was found.</p>
                <a href="/view_tables/all_players_info" style="font-size: 18px; color: blue; text-decoration: underline;">Back to Player Info List</a>
            `);
        }
    });
});

// Delete keeper info
router.get("/tables/delete-keeper-info", (req, res) => {
    const keeper_stats_id = req.query.keeper_stats_id;

    if (!keeper_stats_id) {
        return res.status(400).send("<h1>Bad Request</h1><p>Missing keeper_stats_id parameter.</p>");
    }

    const sql = "DELETE FROM keepers_stats WHERE keeper_stats_id = ?";
    con.query(sql, [keeper_stats_id], (err, result) => {
        if (err) {
            console.error("Error deleting keeper stats:", err);
            return res.status(500).send("<h1>Database Error</h1><p>Failed to delete keeper stats. Please try again later.</p>");
        }
        if (result.affectedRows > 0) {
            renderDeleteSuccess(res, 'Keeper Stats', keeper_stats_id, '/view_tables/keepers_stats');
        } else {
            res.send(`
                <h1>Record Not Found</h1>
                <p>No keeper stats with ID <strong>${keeper_stats_id}</strong> was found.</p>
                <a href="/view_tables/keepers_stats" style="font-size: 18px; color: blue; text-decoration: underline;">Back to Keeper Stats List</a>
            `);
        }
    });
});

// Delete stadium info
router.get("/tables/delete-stadium-info", (req, res) => {
    const stadium_id = req.query.stadium_id;

    if (!stadium_id) {
        return res.status(400).send("<h1>Bad Request</h1><p>Missing stadium_id parameter.</p>");
    }

    const sql = "DELETE FROM stadiums WHERE stadium_id = ?";
    con.query(sql, [stadium_id], (err, result) => {
        if (err) {
            console.error("Error deleting stadium record:", err);
            return res.status(500).send("<h1>Database Error</h1><p>Failed to delete stadium. Please try again later.</p>");
        }
        if (result.affectedRows > 0) {
            renderDeleteSuccess(res, 'Stadium', stadium_id, '/view_tables/stadiums');
        } else {
            res.send(`
                <h1>Record Not Found</h1>
                <p>No stadium with ID <strong>${stadium_id}</strong> was found.</p>
                <a href="/view_tables/stadiums" style="font-size: 18px; color: blue; text-decoration: underline;">Back to Stadium List</a>
            `);
        }
    });
});

module.exports = router;
