import { Router } from "express";
import { getProblem, getProblems, getTopics } from "../controllers/problems.controller";

const router = Router();

// Public — no auth required to browse the problem catalog.
router.get("/", getProblems);
router.get("/topics", getTopics);
router.get("/:slug", getProblem);

export default router;
