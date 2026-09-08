const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


// DATABASE CONNECTION
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


// CHECK DATABASE CONNECTION
db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }

    console.log("MySQL connected successfully!");
});


// TEST ROUTE
app.get("/", (req, res) => {
    res.send("Animal Listing System Backend is running!");
});


// GET ALL ANIMALS
app.get("/api/animals", (req, res) => {

    db.query("SELECT * FROM animals", (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});


// ADD ANIMAL
app.post("/api/animals", (req, res) => {

    const { name, category, icon } = req.body;

    if (!name || !category) {
        return res.status(400).json({
            message: "Name and category are required."
        });
    }

    const sql = `
        INSERT INTO animals (name, category, icon)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [name, category, icon || "🐾"],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Animal added successfully!",
                id: result.insertId
            });
        }
    );
});


// DELETE ANIMAL
app.delete("/api/animals/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM animals WHERE id = ?",
        [id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "Animal deleted successfully!"
            });
        }
    );
});


// START SERVER
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});