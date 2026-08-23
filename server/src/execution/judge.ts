import { randomUUID } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { runInDocker } from "./dockerRunner";
import { ApiError } from "../utils/ApiError";

export interface TestCase {
  input: string;
  expectedOutput: string;
}

export type TestVerdict = "PASSED" | "FAILED" | "ERROR" | "TIMEOUT";

export interface TestResult {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  verdict: TestVerdict;
}

export interface JudgeResult {
  overallStatus: "PASSED" | "FAILED" | "ERROR";
  results: TestResult[];
  compileError?: string;
}

const MAX_CODE_LENGTH = 20_000;
const PER_TEST_TIMEOUT_MS = 8000;

// Very cheap, best-effort guardrails on top of the Docker sandbox itself.
// The container is the real security boundary (no network, no filesystem
// write access outside tmpfs, resource caps) — this is just an early,
// cheap rejection for obviously-wrong submissions before we even spin up
// a container.
const validateCode = (code: string) => {
  if (!code || !code.trim()) {
    throw new ApiError(400, "Code cannot be empty.");
  }
  if (code.length > MAX_CODE_LENGTH) {
    throw new ApiError(400, `Code is too long (max ${MAX_CODE_LENGTH} characters).`);
  }
};

const normalize = (s: string) => s.trim().replace(/\r\n/g, "\n");

// Runs `code` against every test case, one fresh container per test case.
// Stops early on a compile error (same error for every test, no point
// spinning up N containers to see the same failure N times).
export const judgeSubmission = async (code: string, testCases: TestCase[]): Promise<JudgeResult> => {
  validateCode(code);

  const results: TestResult[] = [];

  for (const testCase of testCases) {
    const scratchDir = await mkdtemp(path.join(tmpdir(), `dsa-judge-${randomUUID()}-`));

    try {
      await writeFile(path.join(scratchDir, "solution.cpp"), code, "utf-8");
      await writeFile(path.join(scratchDir, "input.txt"), testCase.input, "utf-8");

      const run = await runInDocker(scratchDir, PER_TEST_TIMEOUT_MS);

      if (run.dockerUnavailable) {
        throw new ApiError(
          503,
          "Code execution isn't available right now (the execution sandbox is not running on this server). Please contact the site administrator."
        );
      }

      if (run.timedOut) {
        results.push({
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: "Time limit exceeded.",
          verdict: "TIMEOUT",
        });
        continue;
      }

      // Non-empty stderr from a nonzero exit typically means the compile
      // step failed (we redirect compiler stderr into stdout in the
      // container command, so g++ errors show up in stdout instead).
      if (run.exitCode !== 0 && run.exitCode !== null) {
        return {
          overallStatus: "ERROR",
          results: [],
          compileError: run.stdout || run.stderr || "Compilation or runtime error.",
        };
      }

      const actualOutput = normalize(run.stdout);
      const expected = normalize(testCase.expectedOutput);
      const verdict: TestVerdict = actualOutput === expected ? "PASSED" : "FAILED";

      results.push({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: run.stdout.slice(0, 2000), // cap in case of runaway output
        verdict,
      });
    } finally {
      await rm(scratchDir, { recursive: true, force: true });
    }
  }

  const overallStatus = results.every((r) => r.verdict === "PASSED") ? "PASSED" : "FAILED";
  return { overallStatus, results };
};
