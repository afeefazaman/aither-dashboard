const express = require("express");
const { slackAuth, slackOAuthCallback, getRecentActivity } = require("../controllers/slackController");

const router = express.Router();

router.get("/auth", slackAuth);

router.get("/oauth/callback", slackOAuthCallback);

router.get("/recent-activity", getRecentActivity);

export default router;