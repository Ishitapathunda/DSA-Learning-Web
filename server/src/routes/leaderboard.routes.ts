import { Router } from "express";
import { getLeaderboardHandler } from "../controllers/leaderboard.controller";

const router = Router();

router.get("/", getLeaderboardHandler);

export default router;
