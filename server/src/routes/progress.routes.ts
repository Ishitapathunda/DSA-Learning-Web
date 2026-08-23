import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { getProgress } from "../controllers/progress.controller";

const router = Router();

router.get("/", requireAuth, getProgress);

export default router;
