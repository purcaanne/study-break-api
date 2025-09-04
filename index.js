const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");


const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());


const DATA_FILE = path.join(__dirname, "data", "suggestions.json");


function loadSuggestions() {
try {
const raw = fs.readFileSync(DATA_FILE, "utf8");
return JSON.parse(raw);
} catch (e) {
return [];
}
}


function saveSuggestions(list) {
try {
fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2));
} catch (e) {
console.warn("Could not persist suggestions to file:", e.message);
}
}


let suggestions = loadSuggestions();


app.get("/", (req, res) => {
res.json({
message: "Study Break Suggestion API",
version: "1.0",
endpoints: [
"GET /api/v1/health",
"GET /api/v1/suggestion?mood=stressed|sleepy|energized|eyes|bored|general",
"GET /api/v1/suggestions",
"POST /api/v1/suggestions { text, mood }",
"GET /api/v1/pomodoro?minutes=50"
]
});
});


app.get("/api/v1/health", (req, res) => {
res.json({ status: "ok", time: new Date().toISOString() });
});


app.get("/api/v1/suggestion", (req, res) => {
const mood = (req.query.mood || "").toLowerCase();
let pool = suggestions;
if (mood) {
pool = suggestions.filter((s) => s.mood === mood);
}
if (pool.length === 0) {
return res.status(404).json({ error: "No suggestions found for that mood." });
}
});

app.listen(PORT, () => {
  console.log(`✅ API listening at http://localhost:${PORT}`);
});
