
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());


// ===============================
// TEST ROUTE
// ===============================
app.get("/", (req, res) => {
    res.send("Animal Listing System Backend is running!");
});


// ===============================
// GET ALL ANIMALS
// ===============================
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


// ===============================
// ADD ANIMAL
// ===============================
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


// ===============================
// DELETE ANIMAL
// ===============================
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

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Animal not found."
                });
            }

            res.json({
                message: "Animal deleted successfully!"
            });
        }
    );
});


// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

