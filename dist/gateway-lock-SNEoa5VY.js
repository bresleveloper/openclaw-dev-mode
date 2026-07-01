import { A as resolvePositiveTimerTimeoutMs, M as resolveTimestampMsToIsoString, j as resolveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import { c as resolveConfigPath, d as resolveGatewayLockDir, y as resolveStateDir } from "./paths-DyelItkH.js";
import { Rn as string, Tn as object, wn as number } from "./schemas-6cH6bZ7o.js";
import { t as safeParseJsonWithSchema } from "./zod-parse-Bip-sZi_.js";
import { n as isPidAlive } from "./pid-alive-C4bVUgUC.js";
import { a as isGatewayArgv, i as readWindowsProcessArgsSync, o as parseProcCmdline } from "./windows-port-pids-Dd55AXMs.js";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { execFileSync } from "node:child_process";
import net from "node:net";
import { createHash } from "node:crypto";
//#region src/infra/gateway-lock.ts
const DEFAULT_TIMEOUT_MS = 5e3;
const DEFAULT_POLL_INTERVAL_MS = 100;
const DEFAULT_STALE_MS = 3e4;
const DEFAULT_PORT_PROBE_TIMEOUT_MS = 1e3;
const LockPayloadSchema = object({
	pid: number(),
	createdAt: string(),
	configPath: string(),
	startTime: number().optional()
});
var GatewayLockError = class extends Error {
	constructor(message, cause) {
		super(message);
		this.cause = cause;
		this.name = "GatewayLockError";
	}
};
function readLinuxCmdline(pid) {
	try {
		return parseProcCmdline(fs.readFileSync(`/proc/${pid}/cmdline`, "utf8"));
	} catch {
		return null;
	}
}
const CMDLINE_EXEC_TIMEOUT_MS = 1e3;
function readWindowsCmdline(pid) {
	return readWindowsProcessArgsSync(pid, CMDLINE_EXEC_TIMEOUT_MS);
}
/**
* Read the command line of a macOS/BSD process via `ps`.
*
* `ps -o command=` outputs an unquoted flat string, so the naive whitespace
* split will misparse paths containing spaces. This is acceptable because
* standard macOS install paths do not contain spaces, and when the split
* does fail the caller falls back to "alive" (conservative).
*/
function readDarwinCmdline(pid) {
	try {
		const line = execFileSync("ps", [
			"-p",
			String(pid),
			"-o",
			"command="
		], {
			encoding: "utf8",
			timeout: CMDLINE_EXEC_TIMEOUT_MS,
			stdio: [
				"ignore",
				"pipe",
				"ignore"
			]
		}).trim();
		if (!line) return null;
		return line.split(/\s+/).filter(Boolean);
	} catch {
		return null;
	}
}
function readLinuxStartTime(pid) {
	try {
		const raw = fs.readFileSync(`/proc/${pid}/stat`, "utf8").trim();
		const closeParen = raw.lastIndexOf(")");
		if (closeParen < 0) return null;
		const fields = raw.slice(closeParen + 1).trim().split(/\s+/);
		const startTime = Number.parseInt(fields[19] ?? "", 10);
		return Number.isFinite(startTime) ? startTime : null;
	} catch {
		return null;
	}
}
async function checkPortFree(port, host = "127.0.0.1") {
	return await new Promise((resolve) => {
		const socket = net.createConnection({
			port,
			host
		});
		let settled = false;
		const finish = (result) => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			socket.removeAllListeners();
			socket.destroy();
			resolve(result);
		};
		const timer = setTimeout(() => {
			finish(true);
		}, DEFAULT_PORT_PROBE_TIMEOUT_MS);
		socket.once("connect", () => {
			finish(false);
		});
		socket.once("error", () => {
			finish(true);
		});
	});
}
function defaultReadProcessCmdline(pid, platform) {
	if (platform === "linux") return readLinuxCmdline(pid);
	if (platform === "win32") return readWindowsCmdline(pid);
	if (platform === "darwin") return readDarwinCmdline(pid);
	return null;
}
async function resolveGatewayOwnerStatus(pid, payload, platform, port, readCmdline) {
	if (port != null) {
		if (await checkPortFree(port)) return "dead";
	}
	if (!isPidAlive(pid)) return "dead";
	if (platform === "linux") {
		const payloadStartTime = payload?.startTime;
		if (Number.isFinite(payloadStartTime)) {
			const currentStartTime = readLinuxStartTime(pid);
			if (currentStartTime == null) return "unknown";
			return currentStartTime === payloadStartTime ? "alive" : "dead";
		}
	}
	const args = (readCmdline ?? ((p) => defaultReadProcessCmdline(p, platform)))(pid);
	if (!args) return platform === "linux" ? "unknown" : "alive";
	return isGatewayArgv(args) ? "alive" : "dead";
}
async function readLockPayload(lockPath) {
	try {
		return safeParseJsonWithSchema(LockPayloadSchema, await fs$1.readFile(lockPath, "utf8"));
	} catch {
		return null;
	}
}
function resolveGatewayLockPath(env, lockDir = resolveGatewayLockDir()) {
	const configPath = resolveConfigPath(env, resolveStateDir(env));
	const hash = createHash("sha256").update(configPath).digest("hex").slice(0, 8);
	return {
		lockPath: path.join(lockDir, `gateway.${hash}.lock`),
		configPath
	};
}
async function acquireGatewayLock(opts = {}) {
	const env = opts.env ?? process.env;
	const allowInTests = opts.allowInTests === true;
	if (env.OPENCLAW_ALLOW_MULTI_GATEWAY === "1" || !allowInTests && (env.VITEST || env.NODE_ENV === "test")) return null;
	const timeoutMs = resolveTimerTimeoutMs(opts.timeoutMs, DEFAULT_TIMEOUT_MS, 0);
	const pollIntervalMs = resolvePositiveTimerTimeoutMs(opts.pollIntervalMs, DEFAULT_POLL_INTERVAL_MS);
	const staleMs = resolveTimerTimeoutMs(opts.staleMs, DEFAULT_STALE_MS, 0);
	const platform = opts.platform ?? process.platform;
	const port = opts.port;
	const now = opts.now ?? Date.now;
	const sleep = opts.sleep ?? (async (ms) => await new Promise((resolve) => {
		setTimeout(resolve, ms);
	}));
	const { lockPath, configPath } = resolveGatewayLockPath(env, opts.lockDir);
	await fs$1.mkdir(path.dirname(lockPath), { recursive: true });
	const startedAt = now();
	let lastPayload = null;
	while (now() - startedAt < timeoutMs) try {
		const handle = await fs$1.open(lockPath, "wx");
		const startTime = platform === "linux" ? readLinuxStartTime(process.pid) : null;
		const payload = {
			pid: process.pid,
			createdAt: resolveTimestampMsToIsoString(now()),
			configPath
		};
		if (typeof startTime === "number" && Number.isFinite(startTime)) payload.startTime = startTime;
		await handle.writeFile(JSON.stringify(payload), "utf8");
		return {
			lockPath,
			configPath,
			release: async () => {
				await handle.close().catch(() => void 0);
				await fs$1.rm(lockPath, { force: true });
			}
		};
	} catch (err) {
		if (err.code !== "EEXIST") throw new GatewayLockError(`failed to acquire gateway lock at ${lockPath}`, err);
		lastPayload = await readLockPayload(lockPath);
		const ownerPid = lastPayload?.pid;
		const ownerStatus = ownerPid ? await resolveGatewayOwnerStatus(ownerPid, lastPayload, platform, port, opts.readProcessCmdline) : "unknown";
		if (ownerStatus === "dead" && ownerPid) {
			await fs$1.rm(lockPath, { force: true });
			continue;
		}
		if (ownerStatus !== "alive") {
			let stale = false;
			if (lastPayload?.createdAt) {
				const createdAt = Date.parse(lastPayload.createdAt);
				stale = Number.isFinite(createdAt) ? now() - createdAt > staleMs : false;
			}
			if (!stale) try {
				const st = await fs$1.stat(lockPath);
				stale = now() - st.mtimeMs > staleMs;
			} catch {
				stale = false;
			}
			if (stale) {
				await fs$1.rm(lockPath, { force: true });
				continue;
			}
		}
		const remainingMs = timeoutMs - (now() - startedAt);
		if (remainingMs <= 0) break;
		await sleep(Math.min(pollIntervalMs, remainingMs));
	}
	throw new GatewayLockError(`gateway already running${lastPayload?.pid ? ` (pid ${lastPayload.pid})` : ""}; lock timeout after ${timeoutMs}ms`);
}
//#endregion
export { acquireGatewayLock as n, GatewayLockError as t };
