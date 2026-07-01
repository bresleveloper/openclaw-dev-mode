import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

/**
 * Resolve runtime configuration from environment variables.
 * Pure — no filesystem access.
 * @param {Record<string, string|undefined>} env
 * @returns {{ dbPath: string, port: number, publicDir: string, token: string }}
 */
export function resolveConfig(env = process.env) {
  const home = env.HOME || env.USERPROFILE || homedir();
  const dbPath = env.WA_CLAW_DB || join(home, ".openclaw", "dev-mode", "openclaw-whatsapp-claw.db");
  const port = Number(env.WA_CLAW_PORT) || 18790;
  const publicDir = resolve(HERE, "..", "public");
  const token = env.WA_CLAW_TOKEN || env.OPENCLAW_GATEWAY_TOKEN;
  if (!token) {
    throw new Error("[wa-claw] FATAL: no auth token. Set WA_CLAW_TOKEN or OPENCLAW_GATEWAY_TOKEN.");
  }
  return { dbPath, port, publicDir, token };
}
