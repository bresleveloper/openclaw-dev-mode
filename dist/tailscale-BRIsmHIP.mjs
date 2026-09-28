import { D as resolveExpiresAtMsFromDurationMs, o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { n as asNullableObjectRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-C7YSvZ9t.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as isVitestRuntimeEnv } from "./test-runtime-env-mVzBKwSd.mjs";
import "./env-C4a8LL2I.mjs";
import { r as signalProcessTree } from "./kill-tree-BGQdx374.mjs";
import "./errors-DnjwnOju.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-DazJcPEG.mjs";
import { r as resolveRuntimeWorkerUrl } from "./runtime-worker-url-B4o9tqvO.mjs";
import { a as resolveExecutableFromPathEnv } from "./executable-path-BMRdcL7i.mjs";
import { n as runExec } from "./exec-shcN2-sN.mjs";
import { t as extractTailscaleServeGatewayUrls } from "./tailscale-status-Dr51G8r4.mjs";
import { t as retryAsync } from "./retry-C0DLN1oj.mjs";
import { t as TAILSCALE_ROUTE_OWNER_ARG } from "./tailscale-route-owner-protocol-B2D1XMya.mjs";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fork } from "node:child_process";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
//#region src/infra/tailscale-backend-ready.ts
const TAILSCALE_BACKEND_READY_WAIT_MS = 9e4;
const TAILSCALE_BACKEND_READY_POLL_MS = 2e3;
/** Backend states the daemon reports only while it is still coming up after boot. */
const TAILSCALE_BOOTING_BACKEND_STATES = /* @__PURE__ */ new Set(["NoState", "Starting"]);
function parsePossiblyNoisyJsonObject(stdout) {
	const trimmed = stdout.trim();
	const start = trimmed.indexOf("{");
	const end = trimmed.lastIndexOf("}");
	if (start >= 0 && end > start) return JSON.parse(trimmed.slice(start, end + 1));
	return JSON.parse(trimmed);
}
function isTransientTailscaleStatusError(error) {
	const record = asNullableObjectRecord(error);
	const detail = [
		error instanceof Error ? error.message : void 0,
		typeof record?.stderr === "string" ? record.stderr : void 0,
		typeof record?.stdout === "string" ? record.stdout : void 0
	].filter((value) => Boolean(value)).join("\n").toLowerCase();
	return record?.timedOut === true || detail.includes("failed to connect to local tailscale") || detail.includes("connection refused") || detail.includes("503 service unavailable");
}
/**
* Wait, bounded, while the local daemon is still booting (`NoState`/`Starting`, or not yet
* accepting connections). Any other state, an unreadable status, or the deadline returns
* immediately so the route claim itself reports the authoritative error.
*/
async function waitForTailscaleBackendReady(params) {
	const exec = params.exec ?? runExec;
	const pollMs = params.pollMs ?? TAILSCALE_BACKEND_READY_POLL_MS;
	const deadline = Date.now() + (params.deadlineMs ?? TAILSCALE_BACKEND_READY_WAIT_MS);
	let announced;
	for (;;) {
		let pending;
		try {
			const { stdout } = await exec(params.bin, [
				...params.prefix ?? [],
				"status",
				"--json"
			], {
				timeoutMs: 5e3,
				maxBuffer: 4e5,
				logOutput: false
			});
			const parsed = stdout ? parsePossiblyNoisyJsonObject(stdout) : {};
			const state = typeof parsed.BackendState === "string" ? parsed.BackendState : void 0;
			if (state === void 0 || !TAILSCALE_BOOTING_BACKEND_STATES.has(state)) return;
			pending = state;
		} catch (error) {
			if (!isTransientTailscaleStatusError(error)) return;
			pending = "daemon not reachable";
		}
		if (Date.now() >= deadline) return;
		if (announced !== pending) {
			params.info(`waiting for the local Tailscale daemon (${pending})`);
			announced = pending;
		}
		await setTimeout$1(pollMs);
	}
}
//#endregion
//#region src/infra/tailscale-route-ownership-error.ts
const TAILSCALE_ROUTE_OWNERSHIP_CONFLICT_CODE = "TAILSCALE_ROUTE_OWNERSHIP_CONFLICT";
var TailscaleRouteOwnershipConflictError = class extends Error {
	constructor(port = 443, serveStatus = "{}") {
		const status = safeParseJsonRecord(serveStatus.slice(serveStatus.indexOf("{"), serveStatus.lastIndexOf("}") + 1));
		const [session, config] = Object.entries(asNullableObjectRecord(status?.Foreground) ?? {}).find(([, entry]) => asNullableObjectRecord(asNullableObjectRecord(entry)?.TCP)?.[String(port)]) ?? [];
		const [host, server] = Object.entries(asNullableObjectRecord(asNullableObjectRecord(config)?.Web) ?? {}).find(([hostPort]) => hostPort.endsWith(`:${port}`)) ?? [];
		const [mount, handler] = Object.entries(asNullableObjectRecord(asNullableObjectRecord(server)?.Handlers) ?? {})[0] ?? [];
		const route = host ? `https://${host}${mount ?? ""} -> ${normalizeOptionalString(asNullableObjectRecord(handler)?.Proxy) ?? "non-proxy handler"}` : `HTTPS port ${port}`;
		super(`Tailscale HTTPS port ${port} is already owned by a route whose ownership OpenClaw cannot prove; it was not modified. ` + (session ? `Foreground session ${session} (${route.slice(0, 512)}). Inspect \`tailscale serve status --json\` and stop the confirmed owning process, then restart the Gateway. Tailscale status does not report the claimant PID; \`serve off\` does not release foreground claims. ` : `Inspect \`tailscale serve status\`. If the route belongs to the current Tailscale hostname and is stale from an older OpenClaw release, remove its background root handler with \`tailscale serve --yes --https=${port} --set-path=/ off\`, then restart the Gateway. Otherwise disable managed Tailscale ingress or reconfigure the route before restarting.`));
		this.code = TAILSCALE_ROUTE_OWNERSHIP_CONFLICT_CODE;
		this.name = "TailscaleRouteOwnershipConflictError";
	}
};
function isTailscaleRouteOwnershipConflictError(error) {
	return error instanceof TailscaleRouteOwnershipConflictError || asNullableObjectRecord(error)?.code === TAILSCALE_ROUTE_OWNERSHIP_CONFLICT_CODE;
}
//#endregion
//#region src/infra/tailscale.ts
const TAILSCALE_STATUS_ATTEMPTS = 3;
const TAILSCALE_STATUS_RETRY_DELAY_MS = 500;
const TAILSCALE_ROUTE_START_TIMEOUT_MS = 15e3;
const TAILSCALE_ROUTE_STOP_TIMEOUT_MS = 4e3;
const SUDO_NONINTERACTIVE_AUTH_ERROR = /^sudo: (?:a password is required|no password was provided|a terminal is required|no tty present|no askpass program specified)/im;
function tailnetHostnameFromStatus(parsed) {
	const self = typeof parsed.Self === "object" && parsed.Self !== null ? parsed.Self : void 0;
	const dns = typeof self?.DNSName === "string" ? self.DNSName : void 0;
	const ips = Array.isArray(self?.TailscaleIPs) ? parsed.Self.TailscaleIPs ?? [] : [];
	if (dns && dns.length > 0) return dns.replace(/\.$/, "");
	const [firstIp] = ips;
	if (firstIp !== void 0) return firstIp;
	throw new Error("Could not determine Tailscale DNS or IP");
}
/**
* Locate Tailscale binary using multiple strategies:
* 1. Filesystem PATH lookup
* 2. Known macOS app path
* 3. locate database (if available)
*
* @returns Path to Tailscale binary or null if not found
*/
async function findTailscaleBinary() {
	const checkBinary = async (filePath) => {
		if (!filePath || !existsSync(filePath)) return false;
		try {
			await runExec(filePath, ["version"], { timeoutMs: 3e3 });
			return true;
		} catch {
			return false;
		}
	};
	try {
		const fromPath = resolveExecutableFromPathEnv("tailscale", process.env.PATH ?? "", process.env, {
			cwd: process.cwd(),
			useCache: false
		});
		if (fromPath && await checkBinary(fromPath)) return fromPath;
	} catch {}
	const macAppPath = "/Applications/Tailscale.app/Contents/MacOS/Tailscale";
	if (await checkBinary(macAppPath)) return macAppPath;
	try {
		const { stdout } = await runExec("locate", ["Tailscale.app"]);
		const candidates = stdout.trim().split("\n").filter((line) => line.includes("/Tailscale.app/Contents/MacOS/Tailscale"));
		for (const candidate of candidates) if (await checkBinary(candidate)) return candidate;
	} catch {}
	return null;
}
async function getTailnetHostname(exec = runExec, detectedBinary) {
	const candidates = detectedBinary ? [detectedBinary] : ["tailscale", "/Applications/Tailscale.app/Contents/MacOS/Tailscale"];
	let lastError;
	for (const candidate of candidates) {
		if (candidate.startsWith("/") && !existsSync(candidate)) continue;
		try {
			const { stdout } = await exec(candidate, ["status", "--json"], {
				timeoutMs: 5e3,
				maxBuffer: 4e5
			});
			return tailnetHostnameFromStatus(stdout ? parsePossiblyNoisyJsonObject(stdout) : {});
		} catch (err) {
			lastError = err;
		}
	}
	throw toErrorObject(lastError ?? /* @__PURE__ */ new Error("Could not determine Tailscale DNS or IP"), "Non-Error thrown");
}
/**
* Get the Tailscale binary command to use.
* Returns a cached detected binary or the default "tailscale" command.
*/
let cachedTailscaleBinary = null;
function getTestTailscaleBinaryOverride(env = process.env) {
	if (!isVitestRuntimeEnv(env)) return null;
	return env.OPENCLAW_TEST_TAILSCALE_BINARY?.trim() || null;
}
async function getTailscaleBinary() {
	const forcedBinary = getTestTailscaleBinaryOverride();
	if (forcedBinary) {
		cachedTailscaleBinary = forcedBinary;
		return forcedBinary;
	}
	if (cachedTailscaleBinary) return cachedTailscaleBinary;
	cachedTailscaleBinary = await findTailscaleBinary();
	return cachedTailscaleBinary ?? "tailscale";
}
let tailscaleRouteOperation = Promise.resolve();
function serializeTailscaleRouteOperation(operation) {
	const result = tailscaleRouteOperation.then(operation);
	tailscaleRouteOperation = result.then(() => void 0, () => void 0);
	return result;
}
function routeClaimError(message, serveStatus) {
	const conflict = /listener already exists for port (\d+)/i.exec(`${message.stderr}\n${message.stdout}`);
	if (conflict) return new TailscaleRouteOwnershipConflictError(Number(conflict[1]), serveStatus);
	const detail = [message.stderr.trim(), message.stdout.trim()].find(Boolean);
	return Object.assign(new Error(detail || "Tailscale route owner exited before claiming route"), {
		code: message.code,
		stdout: message.stdout,
		stderr: message.stderr
	});
}
function waitWithTimeout(promise, timeoutMs) {
	return new Promise((resolve) => {
		const timer = setTimeout(() => resolve(false), timeoutMs);
		timer.unref?.();
		promise.then(() => {
			clearTimeout(timer);
			resolve(true);
		}, () => {
			clearTimeout(timer);
			resolve(true);
		});
	});
}
async function startTailscaleRouteOwner(argv, serveStatus) {
	const workerUrl = resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.tailscaleRouteOwner);
	const execArgv = workerUrl.pathname.endsWith(".ts") ? ["--import", "tsx"] : void 0;
	const worker = fork(fileURLToPath(workerUrl), [TAILSCALE_ROUTE_OWNER_ARG, JSON.stringify({ argv })], {
		execArgv,
		detached: process.platform !== "win32",
		stdio: [
			"ignore",
			"ignore",
			"ignore",
			"ipc"
		]
	});
	let routePid;
	let ready = false;
	let active = false;
	let stopping = false;
	let failure;
	let resolveExit;
	const exited = new Promise((resolve) => {
		resolveExit = resolve;
	});
	const startup = new Promise((resolve, reject) => {
		const settle = (error) => {
			clearTimeout(startupTimer);
			if (error) reject(error);
			else resolve();
		};
		const startupTimer = setTimeout(() => settle(/* @__PURE__ */ new Error("Tailscale route claim did not become ready within 15 seconds")), TAILSCALE_ROUTE_START_TIMEOUT_MS);
		startupTimer.unref?.();
		worker.on("message", (message) => {
			const event = asNullableObjectRecord(message);
			if (!event) return;
			if (event.type === "spawned") {
				if (typeof event.pid !== "number") return;
				routePid = event.pid;
			} else if (event.type === "ready") {
				ready = true;
				active = true;
				settle();
			} else if (event.type === "failed") {
				if (event.code !== null && typeof event.code !== "number" || typeof event.stdout !== "string" || typeof event.stderr !== "string") return;
				failure = routeClaimError({
					code: event.code,
					stdout: event.stdout,
					stderr: event.stderr
				}, serveStatus);
				if (!ready) settle(failure);
			}
		});
		worker.once("error", (error) => settle(toErrorObject(error, "Tailscale route owner failed")));
		worker.once("exit", (code, signal) => {
			active = false;
			resolveExit();
			if (!ready) settle(failure ?? /* @__PURE__ */ new Error(`Tailscale route owner exited before readiness (${signal ? `signal ${signal}` : `code ${code ?? "unknown"}`})`));
		});
	});
	const stop = async () => {
		if (stopping) {
			await exited;
			return;
		}
		stopping = true;
		if (worker.connected) try {
			worker.send({ type: "stop" }, () => void 0);
		} catch {
			worker.kill("SIGTERM");
		}
		else worker.kill("SIGTERM");
		if (await waitWithTimeout(exited, TAILSCALE_ROUTE_STOP_TIMEOUT_MS)) return;
		if (routePid) signalProcessTree(routePid, "SIGKILL", { detached: process.platform !== "win32" });
		worker.kill("SIGKILL");
		await exited;
	};
	try {
		await startup;
		return {
			exited,
			isActive: () => active,
			stop
		};
	} catch (error) {
		await stop();
		throw failure ?? error;
	}
}
/** Claim the Gateway route, adopting only its recognized legacy root handler. */
async function claimTailscaleRoute(mode, target, gatewayPort, info) {
	return serializeTailscaleRouteOperation(() => claimTailscaleRouteOwned({
		mode,
		target,
		gatewayPort,
		info
	}));
}
/** Claim a private HTTPS Serve port without adopting or clearing existing routes. */
async function claimTailscaleServePort(target, httpsPort, assertCurrent) {
	for (const [name, port] of [["target", target], ["httpsPort", httpsPort]]) if (!Number.isInteger(port) || port < 1 || port > 65535) throw new RangeError(`Tailscale ${name} must be an integer port between 1 and 65535`);
	return serializeTailscaleRouteOperation(() => claimTailscaleRouteOwned({
		mode: "serve",
		target,
		httpsPort,
		assertCurrent,
		info: () => void 0
	}));
}
async function claimTailscaleRouteOwned(params) {
	const { mode, target, info } = params;
	let authorityDenied = false;
	const assertCurrent = () => {
		try {
			params.assertCurrent?.();
		} catch (error) {
			authorityDenied = true;
			throw error;
		}
	};
	assertCurrent();
	const tailscaleBin = await getTailscaleBinary();
	let adopted = false;
	const start = async (bin, prefix = []) => {
		assertCurrent();
		const exec = (args) => runExec(bin, [...prefix, ...args], {
			timeoutMs: 5e3,
			maxBuffer: 4e5
		});
		await waitForTailscaleBackendReady({
			bin,
			prefix,
			info
		});
		assertCurrent();
		const { stdout } = await exec([
			"serve",
			"status",
			"--json"
		]);
		if ((params.gatewayPort === void 0 ? void 0 : extractTailscaleServeGatewayUrls(stdout, params.gatewayPort, true))?.some((url) => !new URL(url).port)) {
			await exec([
				"serve",
				"--yes",
				"--https=443",
				"--set-path=/",
				"off"
			]);
			adopted = true;
		}
		assertCurrent();
		return startTailscaleRouteOwner([
			bin,
			...prefix,
			mode,
			"--yes",
			"--bg=false",
			...params.httpsPort === void 0 ? [] : [`--https=${params.httpsPort}`],
			`${target}`
		], stdout);
	};
	let claim;
	try {
		claim = await start(tailscaleBin);
	} catch (error) {
		if (authorityDenied || !isPermissionDeniedError(error)) throw error;
		try {
			claim = await start("sudo", ["-n", tailscaleBin]);
		} catch (sudoError) {
			if (authorityDenied) throw sudoError;
			const { stderr, message } = extractExecErrorText(sudoError);
			const detail = stderr.trim() || message.trim();
			if (!SUDO_NONINTERACTIVE_AUTH_ERROR.test(detail)) throw sudoError;
			throw new Error(`Tailscale ${mode} needs elevated access and non-interactive sudo failed: ${detail}. Run \`sudo tailscale set --operator=\$USER\` once so the unprivileged path succeeds.`, { cause: sudoError });
		}
	}
	if (adopted) info("Tailscale route adopted from a previous OpenClaw release");
	return {
		...claim,
		stop: () => serializeTailscaleRouteOperation(claim.stop)
	};
}
/** Resolve the hostname after Serve startup, while the local daemon may still be settling. */
async function getTailnetHostnameAfterServe(exec = runExec) {
	const candidate = await getTailscaleBinary();
	return tailnetHostnameFromStatus(await retryAsync(async () => {
		const { stdout } = await exec(candidate, ["status", "--json"], {
			timeoutMs: 5e3,
			maxBuffer: 4e5,
			logOutput: false
		});
		return stdout ? parsePossiblyNoisyJsonObject(stdout) : {};
	}, {
		attempts: TAILSCALE_STATUS_ATTEMPTS,
		minDelayMs: TAILSCALE_STATUS_RETRY_DELAY_MS,
		maxDelayMs: TAILSCALE_STATUS_RETRY_DELAY_MS,
		jitter: 0,
		shouldRetry: isTransientTailscaleStatusError
	}));
}
const whoisCache = /* @__PURE__ */ new Map();
function extractExecErrorText(err) {
	const errOutput = err;
	return {
		stdout: typeof errOutput.stdout === "string" ? errOutput.stdout : "",
		stderr: typeof errOutput.stderr === "string" ? errOutput.stderr : "",
		message: typeof errOutput.message === "string" ? errOutput.message : "",
		code: typeof errOutput.code === "string" ? errOutput.code : ""
	};
}
function isPermissionDeniedError(err) {
	const { stdout, stderr, message, code } = extractExecErrorText(err);
	if (code.toUpperCase() === "EACCES") return true;
	const combined = normalizeLowercaseStringOrEmpty(`${stdout}\n${stderr}\n${message}`);
	return combined.includes("permission denied") || combined.includes("access denied") || combined.includes("operation not permitted") || combined.includes("not permitted") || combined.includes("requires root") || combined.includes("must be run as root") || combined.includes("must be run with sudo") || combined.includes("requires sudo") || combined.includes("need sudo");
}
async function hasTailscaleFunnelRouteForPort(port, exec = runExec) {
	const { stdout } = await exec(await getTailscaleBinary(), [
		"funnel",
		"status",
		"--json"
	], {
		maxBuffer: 2e5,
		timeoutMs: 5e3
	});
	return tailscaleFunnelStatusCoversPort(stdout ? parsePossiblyNoisyJsonObject(stdout) : {}, port);
}
const TAILSCALE_LOOPBACK_PROXY_HOSTS = /* @__PURE__ */ new Set([
	"127.0.0.1",
	"localhost",
	"[::1]",
	"::1"
]);
function tailscaleFunnelStatusCoversPort(status, port) {
	for (const proxy of funnelStatusBackendsForPort(status)) if (tailscaleProxyMatchesLoopbackPort(proxy, port)) return true;
	return false;
}
function tailscaleProxyMatchesLoopbackPort(proxy, port) {
	const stripped = proxy.replace(/^[a-z][a-z0-9+\-.]*:\/\//i, "").replace(/\/.*$/, "");
	if (stripped === String(port)) return true;
	const sep = stripped.lastIndexOf(":");
	if (sep < 0) return false;
	const host = stripped.slice(0, sep);
	if (stripped.slice(sep + 1) !== String(port)) return false;
	return TAILSCALE_LOOPBACK_PROXY_HOSTS.has(host);
}
function funnelStatusBackendsForPort(status) {
	const backends = /* @__PURE__ */ new Set();
	const allowFunnel = status.AllowFunnel ?? {};
	const enabledHosts = new Set(Object.entries(allowFunnel).filter(([, value]) => value === true).map(([host]) => host));
	if (enabledHosts.size === 0) return backends;
	const web = status.Web;
	if (!web || typeof web !== "object") return backends;
	for (const [host, handlers] of Object.entries(web)) {
		if (!enabledHosts.has(host)) continue;
		if (!handlers || typeof handlers !== "object") continue;
		const handlerEntries = handlers.Handlers;
		if (!handlerEntries || typeof handlerEntries !== "object") continue;
		for (const handler of Object.values(handlerEntries)) {
			const proxy = handler?.Proxy;
			if (typeof proxy === "string" && proxy.length > 0) backends.add(proxy);
		}
	}
	return backends;
}
function parseWhoisIdentity(payload) {
	const userProfile = asNullableObjectRecord(payload.UserProfile) ?? asNullableObjectRecord(payload.userProfile) ?? asNullableObjectRecord(payload.User);
	const login = normalizeOptionalString(userProfile?.LoginName) ?? normalizeOptionalString(userProfile?.Login) ?? normalizeOptionalString(userProfile?.login) ?? normalizeOptionalString(payload.LoginName) ?? normalizeOptionalString(payload.login);
	if (!login) return null;
	return {
		login,
		name: normalizeOptionalString(userProfile?.DisplayName) ?? normalizeOptionalString(userProfile?.Name) ?? normalizeOptionalString(userProfile?.displayName) ?? normalizeOptionalString(payload.DisplayName) ?? normalizeOptionalString(payload.name)
	};
}
function readCachedWhois(ip, now) {
	const validNow = asDateTimestampMs(now);
	if (validNow === void 0) return;
	const cached = whoisCache.get(ip);
	if (!cached) return;
	const expiresAt = asDateTimestampMs(cached.expiresAt);
	if (expiresAt === void 0 || expiresAt <= validNow) {
		whoisCache.delete(ip);
		return;
	}
	return cached.value;
}
function writeCachedWhois(ip, value, ttlMs) {
	const expiresAt = resolveExpiresAtMsFromDurationMs(ttlMs);
	if (expiresAt !== void 0) whoisCache.set(ip, {
		value,
		expiresAt
	});
}
async function readTailscaleWhoisIdentity(ip, exec = runExec, opts) {
	const normalized = ip.trim();
	if (!normalized) return null;
	const cacheTtlMs = opts?.cacheTtlMs ?? 6e4;
	const errorTtlMs = opts?.errorTtlMs ?? 5e3;
	const now = Date.now();
	if (cacheTtlMs > 0) {
		const cached = readCachedWhois(normalized, now);
		if (cached !== void 0) return cached;
	}
	try {
		const result = await exec(await getTailscaleBinary(), [
			"whois",
			"--json",
			normalized
		], {
			timeoutMs: opts?.timeoutMs ?? 5e3,
			maxBuffer: 2e5
		});
		const identity = parseWhoisIdentity(result.stdout ? parsePossiblyNoisyJsonObject(result.stdout) : {});
		if (cacheTtlMs > 0) writeCachedWhois(normalized, identity, cacheTtlMs);
		return identity;
	} catch {
		if (errorTtlMs > 0) writeCachedWhois(normalized, null, errorTtlMs);
		return null;
	}
}
//#endregion
export { getTailnetHostnameAfterServe as a, isTailscaleRouteOwnershipConflictError as c, getTailnetHostname as i, claimTailscaleServePort as n, hasTailscaleFunnelRouteForPort as o, findTailscaleBinary as r, readTailscaleWhoisIdentity as s, claimTailscaleRoute as t };
