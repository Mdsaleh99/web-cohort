import express from "express";
import { randomBytes, createHmac } from "crypto";
import db from "../db/index.js";
import { usersTable } from "../db/schema.js";
import { eq } from "drizzle-orm";
import e from "express";

const router = express.Router();

router.get("/", async (req, res) => {
    const sessionId = req.headers["session-id"];
    if (!sessionId) {
        return res.status(401).json({ error: "You are not logged in" });
    }

    const [data] = await db
        .select({
            sessionId: userSessions.id,
            userId: userSessions.userId,
            email: usersTable.email,
        })
        .from(userSessions)
        .rightJoin(usersTable, eq(usersTable.id, userSessions.userId))
        .where((table) => eq(table.sessionId, sessionId));


    if (!data) {
        return res.status(401).json({ error: "You are not logged in" });
    }

    return res.status(200).json({ status: "success", data: { userId: data.userId } });
}); // Returns current logged in user

router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    const [existingUser] = await db
        .select({
            email: usersTable.email,
        })
        .from(usersTable)
        .where((table) => eq(table.email, email));

    if (existingUser) {
        return res
            .status(400)
            .json({ error: `user with email ${email} already exists!` });
    }

    const salt = randomBytes(256).toString("hex");
    const hashedPassword = createHmac("sha256", salt)
        .update(password)
        .digest("hex");

    const [user] = await db
        .insert(usersTable)
        .values({
            name,
            email,
            password: hashedPassword,
            salt,
        })
        .returning({ id: usersTable.id });

    return res
        .status(201)
        .json({ status: "success", data: { userId: user.id } });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const [existingUser] = await db
        .select({
            id: usersTable.id,
            email: usersTable.email,
            salt: usersTable.salt,
            password: usersTable.password,
        })
        .from(usersTable)
        .where((table) => eq(table.email, email));

    if (!existingUser) {
        return res
            .status(404)
            .json({ error: `user with email ${email} does not exists!` });
    }

    const salt = existingUser.salt;
    const existingHash = existingUser.password;
    const newHash = createHmac("sha256", salt).update(password).digest("hex");

    if (existingHash !== newHash) {
        return res.status(401).json({ error: "invalid email or password!" });
    }

    // Create a session for the user
    const [session] = await db
        .insert(userSessions)
        .values({
            userId: existingUser.id,
        })
        .returning({ id: userSessions.id });

    return res
        .status(200)
        .json({ status: "success", data: { sessionId: session.id } });
});

export default router;
