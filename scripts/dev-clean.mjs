import { rmSync } from "node:fs";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const nextDir = join(root, ".next");

try {
  rmSync(nextDir, { recursive: true, force: true });
  console.log("[dev:clean] Removed .next");
} catch (err) {
  console.warn("[dev:clean] Could not remove .next:", err);
}

const env = { ...process.env, NEXT_PUBLIC_BASE_PATH: "" };
const child = spawn("npm run dev", {
  cwd: root,
  env,
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => process.exit(code ?? 0));
