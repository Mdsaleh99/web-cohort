import express from "express";

const app = express();

app.use(express.json());

// it is a session based authentication and server is stateful because server is maintaining a diary for us where it is keeping a record of which token is issued to which person
// session based authentication scalabilty is a issue because it is stateful, but it is scalable for short lived sessions for e.g: banking applications
// sessions data is stored in db but after some time it is deleted

// for long lived session we use JWT (stateless authentication)

// diary is db
const DIARY = {};
const EMAILS = new Set();

// Hey, here is my car - please park it and give me back a token
app.post("/signup", (req, res) => {
    const { name, email, password } = req.body;
    if (EMAILS.has(email)) {
        return res.status(400).json({ error: "Email already taken" });
    }
    // Create a token for user
    const token = `${Date.now()}`;

    // Do a entry in diary
    DIARY[token] = { name, email, password };
    EMAILS.add(email);
    res.status(201).json({ status: "success", token });
});

I;
app.post("/me", (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ error: "Missing Token" });
    }
    if (!(token in DIARY)) {
        return res.status(400).json({ error: "Invalid Token" });
    }
    const entry = DIARY[token];
    return res.json({ data: entry });
});

app.post("/private-data", (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ error: "Missing Token" });
    }
    if (!(token in DIARY)) {
        return res.status(400).json({ error: "Invalid Token" });
    }
    const entry = DIARY[token];
    return res.json({ data: { privateData: "Access Granted" } });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
