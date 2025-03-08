const express = require("express");
const path = require("path");
const con = require("../server/connection");

const router = express.Router();

// Reusable function for rendering success response
function renderSuccessResponse(res, tableName, viewUrl) {
    res.send(`
        <h1>Insert Successful</h1>
        <p>Data has been inserted into the ${tableName} table successfully.</p>
        <a href="${viewUrl}" style="font-size: 18px; color: blue; text-decoration: underline;">Click here to view the updated ${tableName} table</a>
    `);
}

// -------------------- Insert Routes ------------------------------

const insertRoutes = [
    {
        table: "squads",
        fields: ["squad_id", "squad_name"],
        htmlFile: "squads.html",
        viewUrl: "/view_tables/squads",
    },
    {
        table: "clubs",
        fields: ["club_id", "club_name"],
        htmlFile: "clubs.html",
        viewUrl: "/view_tables/clubs",
    },
    {
        table: "positions",
        fields: ["position_id", "position_name"],
        htmlFile: "positions.html",
        viewUrl: "/view_tables/positions",
    },
    {
        table: "stadiums",
        fields: ["stadium_id", "stadium_name", "capacity", "total_match_played"],
        htmlFile: "stadiums.html",
        viewUrl: "/view_tables/stadiums",
    },
    {
        table: "matches",
        fields: ["match_id", "match_date", "stadium_id", "squad_1_id", "squad_2_id", "score_squad_1", "score_squad_2"],
        htmlFile: "matches.html",
        viewUrl: "/view_tables/matches",
    },
    {
        table: "players_stats",
        fields: ["player_stats_id", "player_id", "goals", "non_penalty_goals", "pk_goals", "pk_attempts", "yellow_cards", "red_cards"],
        htmlFile: "players_stats.html",
        viewUrl: "/view_tables/players_stats",
    },
    {
        table: "keepers_stats",
        fields: ["keeper_stats_id", "player_id", "goals_against", "shots_on_target_against", "saves", "clean_sheets", "penalty_kicks_attempted", "penalty_kicks_allowed", "penalty_kicks_saved"],
        htmlFile: "keepers_stats.html",
        viewUrl: "/view_tables/keepers_stats",
    },
    {
        table: "all_players_info",
        fields: ["player_id", "player_name", "position_id", "position_2_id", "squad_id", "age", "club_id", "birth_year", "matches_played", "starts", "minutes_played"],
        htmlFile: "all_players.html",
        viewUrl: "/view_tables/all_players_info",
    }
];

// Generate routes dynamically
insertRoutes.forEach(({ table, fields, htmlFile, viewUrl }) => {
    router.get(`/insert_data_into_tables/${table}`, (req, res) => {
        res.sendFile(path.join(__dirname, `../insert-forms/${htmlFile}`));
    });

    router.post(`/insert_data_into_tables/${table}`, (req, res) => {
        const values = fields.map(field => req.body[field] || null);
        const placeholders = fields.map(() => "?").join(", ");
        const sql = `INSERT INTO ${table} (${fields.join(", ")}) VALUES (${placeholders})`;

        con.query(sql, values, (err, result) => {
            if (err) {
                console.error(`Error inserting data into ${table}:`, err);
                return res.status(500).send(`
                    <h1>Database Error</h1>
                    <p>Failed to insert data. Please try again later.</p>
                `);
            }
            renderSuccessResponse(res, table, viewUrl);
        });
    });
});

module.exports = router;
