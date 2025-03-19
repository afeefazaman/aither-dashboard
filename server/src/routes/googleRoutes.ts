import express from "express";
import { googleAuth, googleAuthCallback, getLatestFiles, getCalendarEvents } from "../controllers/googleController";

const router = express.Router();

router.get("/auth", googleAuth);
router.get("/auth/google/callback", googleAuthCallback);
router.get("/drive/files", getLatestFiles);
router.get("/calendar/events", getCalendarEvents);


export default router;
