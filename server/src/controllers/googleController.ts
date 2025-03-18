import { Request, Response } from "express";
import { google } from "googleapis";
import { oauth2Client } from "../config/google";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
/**
 * Initiates Google OAuth authentication.
 */
export const googleAuth = async (req: Request, res: Response): Promise<void> => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "select_account",
        scope: ["https://www.googleapis.com/auth/drive.metadata.readonly"],
    });
    res.redirect(authUrl);
};

/**
 * Handles OAuth callback and stores access token.
 */
export const googleAuthCallback = async (req: Request, res: Response): Promise<void> => {
    const { code } = req.query;
    if (!code || typeof code !== "string") {
        res.status(400).json({ error: "Authorization code is required." });
        return;
    }

    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // Redirect user to frontend with token in query params
        res.redirect(`http://localhost:3001?accessToken=${tokens.access_token}`);

    } catch (error) {
        res.status(500).json({ error: "Failed to authenticate with Google" });
    }
};

/**
 * Fetches the latest 5 modified files from Google Drive.
 */
export const getLatestFiles = async (req: Request, res: Response): Promise<void> => {
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) {
        res.status(401).json({ error: "User not authenticated. Please log in first." });
        return;
    }

    oauth2Client.setCredentials({ access_token: accessToken });

    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const response = await drive.files.list({
        pageSize: 5,
        fields: "files(id, name, modifiedTime)",
        orderBy: "modifiedTime desc",
    });

    res.json(response.data.files);
};
