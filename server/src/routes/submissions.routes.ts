import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireAuth } from "../middleware/auth.middleware";
import { getSubmissions, postRun, postSubmit } from "../controllers/submissions.controller";

const router = Router();

// requireAuth runs first so req.userId is available for the rate-limit
// key — each user gets their own execution quota rather than sharing one
// bucket per IP (relevant behind NAT/shared networks, and prevents one
// user from starving others' quota).
router.use(requireAuth);

const executionLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.userId || req.ip || "anonymous",
  message: { error: { message: "Too many code executions. Please wait a few minutes and try again." } },
});

router.post("/run", executionLimiter, postRun);
router.post("/", executionLimiter, postSubmit);
router.get("/", getSubmissions);

export default router;
