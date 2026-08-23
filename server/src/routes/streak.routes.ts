import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { getStreakHandler } from "../controllers/streak.controller";

const router = Router();

router.get("/", requireAuth, getStreakHandler);

export default router;
