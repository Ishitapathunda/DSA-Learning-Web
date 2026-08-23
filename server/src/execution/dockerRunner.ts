import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export interface DockerRunResult {
  stdout: string;
  stderr: string;
  timedOut: boolean;
  /** true if the "docker" binary itself couldn't be found/run on this host */
  dockerUnavailable: boolean;
  exitCode: number | null;
}

const DOCKER_IMAGE = "gcc:13";

// Compiles /workspace/solution.cpp and runs it against /workspace/input.txt,
// entirely inside a locked-down, ephemeral container:
//   --network none        no network access at all, in or out
//   --memory / --cpus     hard resource caps so one submission can't starve the host
//   --pids-limit          blocks fork-bombs
//   --read-only + tmpfs   the mounted solution/input files are read-only;
//                         the only writable space is a small in-memory /tmp
//   -v ...:ro              the host directory holding the user's code is
//                         mounted read-only — the container cannot write
//                         back into it or reach anything else on the host
//   --cap-drop ALL         drops all Linux capabilities
//   --security-opt ...     blocks privilege escalation inside the container
//   --user 1000:1000       runs as a non-root, unprivileged user
//
// `hostDir` must contain exactly `solution.cpp` and `input.txt`.
export const runInDocker = async (hostDir: string, timeoutMs = 8000): Promise<DockerRunResult> => {
  const args = [
    "run",
    "--rm",
    "--network",
    "none",
    "--memory",
    "128m",
    "--memory-swap",
    "128m",
    "--cpus",
    "0.5",
    "--pids-limit",
    "64",
    "--read-only",
    "--tmpfs",
    "/tmp:rw,size=32m,exec",
    "--cap-drop",
    "ALL",
    "--security-opt",
    "no-new-privileges",
    "-v",
    `${hostDir}:/workspace:ro`,
    "--workdir",
    "/tmp",
    "--user",
    "1000:1000",
    DOCKER_IMAGE,
    "bash",
    "-c",
    // Compile into the writable tmpfs (the ro-mounted /workspace can't take
    // build output), then run the binary against the provided stdin file.
    "cp /workspace/solution.cpp . && g++ -O2 -std=c++17 -o solution solution.cpp 2>&1 && ./solution < /workspace/input.txt",
  ];

  try {
    const { stdout, stderr } = await execFileAsync("docker", args, {
      timeout: timeoutMs,
      maxBuffer: 2 * 1024 * 1024,
    });
    return { stdout, stderr, timedOut: false, dockerUnavailable: false, exitCode: 0 };
  } catch (error: unknown) {
    const err = error as NodeJS.ErrnoException & {
      stdout?: string;
      stderr?: string;
      killed?: boolean;
      signal?: string;
      code?: number | string;
    };

    if (err.code === "ENOENT") {
      // "docker" isn't installed / not on PATH for this process.
      return { stdout: "", stderr: "", timedOut: false, dockerUnavailable: true, exitCode: null };
    }

    const timedOut = err.killed === true && err.signal === "SIGTERM";

    return {
      stdout: err.stdout || "",
      stderr: err.stderr || "",
      timedOut,
      dockerUnavailable: false,
      exitCode: typeof err.code === "number" ? err.code : null,
    };
  }
};
