import axios from "axios";
import { WebClient } from "@slack/web-api";

type UserTokens = Record<string, string>;
const userTokens: UserTokens = {}; // Temporary storage; replace with DB in production

// Generate Slack OAuth URL
export const getSlackAuthUrl = (): string => {
    return `https://slack.com/oauth/v2/authorize?client_id=${process.env.SLACK_CLIENT_ID}&scope=channels:read,channels:history&redirect_uri=${process.env.SLACK_REDIRECT_URI}`;
};

// Exchange OAuth code for access token
export const exchangeCodeForToken = async (code: string): Promise<{ access_token: string; user_id: string }> => {
    const response = await axios.post("https://slack.com/api/oauth.v2.access", null, {
        params: {
            client_id: process.env.SLACK_CLIENT_ID,
            client_secret: process.env.SLACK_CLIENT_SECRET,
            code,
            redirect_uri: process.env.SLACK_REDIRECT_URI,
        },
    });

    if (!response.data.ok) throw new Error(response.data.error);

    const { access_token, authed_user } = response.data;
    userTokens[authed_user.id] = access_token; // Store in DB in production

    return { access_token, user_id: authed_user.id };
};

// Fetch recent Slack messages
export const fetchRecentMessages = async (userId: string): Promise<any[]> => {
  if (!userTokens[userId]) throw new Error("User not authenticated");

  const web = new WebClient(userTokens[userId]);
  const { channels } = await web.conversations.list({ limit: 10 });

  if (!channels || channels.length === 0) throw new Error("No channels available");

  const recentChannel = channels[0]?.id;
  if (!recentChannel) throw new Error("Invalid channel ID");

  const { messages } = await web.conversations.history({ channel: recentChannel, limit: 5 });

  return messages || [];
};
