const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", (req, res) => {
    res.json({ reply: "Hello from backend" });
});

app.listen(4000, () => console.log("Backend is running on port 4000"));