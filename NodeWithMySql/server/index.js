const express = require("express");
const path = require("path");
const viewRoutes = require("../routes/view_routes");  
const insertRoutes = require("../routes/insert_routes");
const deleteRoutes = require("../routes/delete_routes");
const analyticsRoutes = require("../routes/analytics");

const con = require("./connection");

const app = express();

// Configure Express app
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views")); // Correct path to views
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public"))); // Correct path to public

 app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../html_files/index.html"));
 });

app.get("/view_tables", (req, res) => {
  res.sendFile(path.join(__dirname, "../html_files/view_table_list.html"));
});

app.get("/insert_data_into_tables", (req, res) => {
  res.sendFile(path.join(__dirname, "../html_files/insert_table_list.html"));
});

// Use view routes module
app.use("/", viewRoutes);
app.use("/", insertRoutes);
app.use("/",deleteRoutes);
// app.use("/", analyticsRoutes);
module.exports = app;
 
app.get('/tables/search-squad', function (req, res) {
    const squad_id = req.query.squad_id || '';
    const squad_name = req.query.squad_name || '';

    const sql = "SELECT * FROM squads WHERE squad_id LIKE ? AND squad_name LIKE ?";
    const params = [`%${squad_id}%`, `%${squad_name}%`];

    // Query the database
    con.query(sql, params, (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).send("Database query error.");
        }
        res.json(results); // Send results back as JSON
    });
});

app.get('/tables/search-club', function (req, res) {
    const club_id = req.query.club_id || '';
    const club_name = req.query.club_name || '';

    const sql = "SELECT * FROM clubs WHERE club_id LIKE ? AND club_name LIKE ?";
    const params = [`%${club_id}%`, `%${club_name}%`];

    // Query the database
    con.query(sql, params, (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).send("Database query error.");
        }
        res.json(results); // Send results back as JSON
    });
});

app.get('/tables/search-position', function (req, res) {
    const position_id = req.query.position_id || '';
    const position_name = req.query.position_name || '';

    const sql = "SELECT * FROM positions WHERE position_id LIKE ? AND position_name LIKE ?";
    const params = [`%${position_id}%`, `%${position_name}%`];

    // Query the database
    con.query(sql, params, (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).send("Database query error.");
        }
        res.json(results); // Send results back as JSON
    });
});
  
app.get('/tables/search-stadium', function (req, res) {
    const stadium_id = req.query.stadium_id || '';
    const stadium_name = req.query.stadium_name || '';
    const capacity = req.query.capacity || '';
    const total_match_played = req.query.total_match_played || '';

    const sql = `
        SELECT * FROM stadiums
        WHERE stadium_id LIKE ?
        AND stadium_name LIKE ?
        AND capacity LIKE ?
        AND total_match_played LIKE ?`;

    const params = [
        `%${stadium_id}%`,
        `%${stadium_name}%`,
        `%${capacity}%`,
        `%${total_match_played}%`,
    ];

    // Query the database
    con.query(sql, params, (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).send("Database query error.");
        }
        res.json(results); // Send results back as JSON
    });
});
app.get('/tables/search-match', function (req, res) {
    const match_id = req.query.match_id || '';
    const match_date = req.query.match_date || '';
    const squad_1_id = req.query.squad_1_id || '';
    const squad_2_id = req.query.squad_2_id || '';
    const score_squad_1 = req.query.score_squad_1 || '';
    const score_squad_2 = req.query.score_squad_2 || '';
    const stadium_id = req.query.stadium_id || '';

    const sql = `
        SELECT * FROM matches
        WHERE match_id LIKE ?
        AND match_date LIKE ?
        AND squad_1_id LIKE ?
        AND squad_2_id LIKE ?
        AND score_squad_1 LIKE ?
        AND score_squad_2 LIKE ?
        AND stadium_id LIKE ?`;

    const params = [
        `%${match_id}%`,
        `%${match_date}%`,
        `%${squad_1_id}%`,
        `%${squad_2_id}%`,
        `%${score_squad_1}%`,
        `%${score_squad_2}%`,
        `%${stadium_id}%`
    ];

    // Query the database
    con.query(sql, params, (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).send("Database query error.");
        }
        res.json(results); // Send results back as JSON
    });
}); 
// Start the server
const PORT = 9000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
