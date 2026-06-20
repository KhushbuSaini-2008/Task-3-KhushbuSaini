const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();

app.use(express.json());

// Database Connection
const db = new sqlite3.Database("./database.db", (err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Connected to SQLite Database");
    }
});

// Create Table
db.run(`
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    course TEXT NOT NULL
)
`);

// Home Route
app.get("/", (req, res) => {
    res.send("Student Management API");
});

// CREATE Student
app.post("/students", (req, res) => {

    const { name, email, course } = req.body;

    if (!name || !email || !course) {
        return res.status(400).json({
            error: "All fields are required"
        });
    }

    db.run(
        "INSERT INTO students(name,email,course) VALUES(?,?,?)",
        [name, email, course],
        function(err) {

            if (err) {
                return res.status(500).json(err.message);
            }

            res.json({
                message: "Student Added Successfully",
                id: this.lastID
            });
        }
    );
});

// READ Students
app.get("/students", (req, res) => {

    db.all(
        "SELECT * FROM students",
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json(err.message);
            }

            res.json(rows);
        }
    );
});

// UPDATE Student
app.put("/students/:id", (req, res) => {

    const { name, email, course } = req.body;

    db.run(
        "UPDATE students SET name=?, email=?, course=? WHERE id=?",
        [name, email, course, req.params.id],
        function(err) {

            if (err) {
                return res.status(500).json(err.message);
            }

            res.json({
                message: "Student Updated Successfully"
            });
        }
    );
});

// DELETE Student
app.delete("/students/:id", (req, res) => {

    db.run(
        "DELETE FROM students WHERE id=?",
        req.params.id,
        function(err) {

            if (err) {
                return res.status(500).json(err.message);
            }

            res.json({
                message: "Student Deleted Successfully"
            });
        }
    );
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});