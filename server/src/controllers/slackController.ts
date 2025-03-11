import { Request, Response } from "express";
import { getSlackAuthUrl, exchangeCodeForToken, fetchRecentMessages } from "../services/slackService";

// Redirect user to Slack OAuth
export const slackAuth = (req: Request, res: Response): void => {
    const authUrl: string = getSlackAuthUrl();
    res.redirect(authUrl);
};

// Handle OAuth Callback from Slack
export const slackOAuthCallback = async (req: Request, res: Response): Promise<void> => {
    try {
        const { code } = req.query;
        if (!code || typeof code !== "string") {
            res.status(400).send("Missing code");
            return;
        }

        const userToken = await exchangeCodeForToken(code);
        res.cookie("slack_user_id", userToken.user_id, { httpOnly: true });

        res.redirect(`${process.env.CLIENT_URL}/dashboard`);
    } catch (error) {
        console.error(error);
        res.status(500).send("OAuth failed");
    }
};

// Fetch recent messages
export const getRecentActivity = async (req: Request, res: Response): Promise<void> => {
    try {
        const slackUserId = req.cookies.slack_user_id;
        if (!slackUserId) {
            res.status(401).send("Unauthorized");
            return;
        }

        const messages = await fetchRecentMessages(slackUserId);
        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to fetch messages");
    }
};