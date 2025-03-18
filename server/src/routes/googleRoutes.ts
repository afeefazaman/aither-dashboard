import express from "express";
import { googleAuth, googleAuthCallback, getLatestFiles } from "../controllers/googleController";

const router = express.Router();

router.get("/auth", googleAuth);
router.get("/auth/google/callback", googleAuthCallback);
router.get("/drive/files", getLatestFiles);

export default router;
