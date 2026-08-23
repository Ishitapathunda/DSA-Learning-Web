import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { getBadges } from "../controllers/badges.controller";

const router = Router();

router.get("/", requireAuth, getBadges);

export default router;
