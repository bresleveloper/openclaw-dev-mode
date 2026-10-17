import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { t as killProcessTree } from "./kill-tree-ecObdMeW.mjs";
import "./utils-DgZn2dLu.mjs";
import { n as computeBackoff } from "./src-D1BHGNTj.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { i as runCommandWithTimeout, u as releaseChildProcessOutputAfterExit } from "./exec-DJvyCA0D.mjs";
import { i as resolveExecutable } from "./executable-path-CP2HPhgU.mjs";
import { i as formatCommandResult, r as formatCommandOutput } from "./command-error-CFVNEvkJ.mjs";
import "./backoff-BrzXG7iD.mjs";
import { n as hasBinary } from "./config-eval-DAVG8wM7.mjs";
import "./config-EAfnzCK1.mjs";
import { b as resolveGogExecutable, d as buildGogWatchStartArgs, g as normalizeServePath, l as buildGogWatchServeArgs, u as buildGogWatchServeLogArgs, x as resolveGogServeInvocation, y as resolveGmailHookRuntimeConfig } from "./gmail-BG9VhL2Z.mjs";
import fs from "node:fs";
import process$1 from "node:process";
import path from "node:path";
import { spawn } from "node:child_process";
//#region src/hooks/gmail-setup-utils.ts
let cachedPythonPath;
let gcloudBin;
function formatJsonParseFailure(command, result, err) {
	return `${command} returned invalid JSON: ${formatCommandOutput(formatErrorMessage(err))}\n${formatCommandResult(command, result)}`;
}
function findExecutablesOnPath(bins) {
	const parts = (process.env.PATH ?? "").split(path.delimiter).filter(Boolean);
	const seen = /* @__PURE__ */ new Set();
	const matches = [];
	for (const part of parts) for (const bin of bins) {
		const candidate = path.join(part, bin);
		if (seen.has(candidate)) continue;
		try {
			fs.accessSync(candidate, fs.constants.X_OK);
			matches.push(candidate);
			seen.add(candidate);
		} catch {}
	}
	return matches;
}
function ensureGcloudOnPath() {
	if (hasBinary("gcloud")) return true;
	for (const candidate of [
		"/opt/homebrew/share/google-cloud-sdk/bin/gcloud",
		"/usr/local/share/google-cloud-sdk/bin/gcloud",
		"/opt/homebrew/Caskroom/google-cloud-sdk/latest/google-cloud-sdk/bin/gcloud",
		"/usr/local/Caskroom/google-cloud-sdk/latest/google-cloud-sdk/bin/gcloud"
	]) try {
		fs.accessSync(candidate, fs.constants.X_OK);
		const dirPath = path.dirname(candidate);
		const parts = (process.env.PATH ?? "").split(path.delimiter).filter(Boolean);
		if (!parts.includes(dirPath)) process.env.PATH = [...parts, dirPath].join(path.delimiter);
		return true;
	} catch {}
	return false;
}
const MIN_GCLOUD_PYTHON = [3, 10];
const MAX_GCLOUD_PYTHON = [3, 14];
function isSupportedGcloudPythonVersion(major, minor) {
	if (major !== MIN_GCLOUD_PYTHON[0]) return false;
	return minor >= MIN_GCLOUD_PYTHON[1] && minor <= MAX_GCLOUD_PYTHON[1];
}
async function resolvePythonExecutablePath() {
	if (cachedPythonPath !== void 0) return cachedPythonPath ?? void 0;
	const candidates = findExecutablesOnPath(["python3", "python"]);
	for (const candidate of candidates) {
		const res = await runCommandWithTimeout([
			candidate,
			"-c",
			"import os, sys; print(os.path.realpath(sys.executable)); print('%d.%d' % sys.version_info[:2])"
		], { timeoutMs: 2e3 });
		if (res.code !== 0) continue;
		const lines = res.stdout.trim().split(/\r?\n/);
		const resolved = lines[0]?.trim();
		if (!resolved) continue;
		const version = lines[1]?.trim().match(/^(\d+)\.(\d+)/);
		if (!version) continue;
		if (!isSupportedGcloudPythonVersion(Number(version[1]), Number(version[2]))) continue;
		try {
			fs.accessSync(resolved, fs.constants.X_OK);
			cachedPythonPath = resolved;
			return resolved;
		} catch {}
	}
	cachedPythonPath = null;
}
async function gcloudEnv() {
	return {
		CLOUDSDK_PYTHON: await resolvePythonExecutablePath(),
		CLOUDSDK_PYTHON_ARGS: void 0
	};
}
async function runGcloudCommand(args, timeoutMs) {
	return await runCommandWithTimeout([gcloudBin ??= resolveExecutable("gcloud"), ...args], {
		timeoutMs,
		env: await gcloudEnv()
	});
}
async function ensureDependency(bin, brewArgs) {
	if (bin === "gcloud" && ensureGcloudOnPath()) return;
	if (hasBinary(bin)) return;
	if (process.platform !== "darwin") throw new Error(`${bin} not installed; install it and retry`);
	if (!hasBinary("brew")) throw new Error("Homebrew not installed (install brew and retry)");
	const brewEnv = bin === "gcloud" ? await gcloudEnv() : void 0;
	const result = await runCommandWithTimeout([
		"brew",
		"install",
		...brewArgs
	], {
		timeoutMs: 6e5,
		env: brewEnv
	});
	if (result.code !== 0) throw new Error(formatCommandResult(`brew install for ${bin}`, result));
	if (!hasBinary(bin)) throw new Error(`${bin} still not available after brew install`);
}
async function ensureGcloudAuth() {
	const res = await runGcloudCommand([
		"auth",
		"list",
		"--filter",
		"status:ACTIVE",
		"--format",
		"value(account)"
	], 3e4);
	if (res.code === 0 && res.stdout.trim()) return;
	const login = await runGcloudCommand(["auth", "login"], 6e5);
	if (login.code !== 0) throw new Error(formatCommandResult("gcloud auth login", login));
}
async function runGcloud(args) {
	const result = await runGcloudCommand(args, 12e4);
	if (result.code !== 0) throw new Error(formatCommandResult("gcloud command", result));
	return result;
}
async function ensureTopic(projectId, topicName) {
	if ((await runGcloudCommand([
		"pubsub",
		"topics",
		"describe",
		topicName,
		"--project",
		projectId
	], 3e4)).code === 0) return;
	await runGcloud([
		"pubsub",
		"topics",
		"create",
		topicName,
		"--project",
		projectId
	]);
}
async function ensureSubscription(projectId, subscription, topicName, pushEndpoint) {
	const describe = await runGcloudCommand([
		"pubsub",
		"subscriptions",
		"describe",
		subscription,
		"--project",
		projectId
	], 3e4);
	await runGcloud([
		"pubsub",
		"subscriptions",
		describe.code === 0 ? "update" : "create",
		subscription,
		"--project",
		projectId,
		...describe.code === 0 ? [] : ["--topic", topicName],
		"--push-endpoint",
		pushEndpoint
	]);
}
async function ensureTailscaleEndpoint(params) {
	if (params.mode === "off") return "";
	const tailscaleBin = resolveExecutable("tailscale");
	const statusArgs = ["status", "--json"];
	const statusCommand = "tailscale status --json";
	const status = await runCommandWithTimeout([tailscaleBin, ...statusArgs], {
		timeoutMs: 3e4,
		signal: params.signal
	});
	if (status.code !== 0) throw new Error(formatCommandResult(statusCommand, status));
	let parsed;
	try {
		parsed = JSON.parse(status.stdout);
	} catch (err) {
		throw new Error(formatJsonParseFailure(statusCommand, status, err), { cause: err });
	}
	const dnsName = parsed.Self?.DNSName?.replace(/\.$/, "");
	if (!dnsName) throw new Error("tailscale DNS name missing; run tailscale up");
	const target = typeof params.target === "string" && params.target.trim().length > 0 ? params.target.trim() : params.port ? String(params.port) : "";
	if (!target) throw new Error("tailscale target missing; set a port or target URL");
	const pathArg = normalizeServePath(params.path);
	const funnelArgs = [
		params.mode,
		"--bg",
		"--set-path",
		pathArg,
		"--yes",
		target
	];
	const funnelResult = await runCommandWithTimeout([tailscaleBin, ...funnelArgs], {
		timeoutMs: 3e4,
		signal: params.signal
	});
	if (funnelResult.code !== 0) throw new Error(formatCommandResult(`tailscale ${params.mode}`, funnelResult));
	const baseUrl = `https://${dnsName}${pathArg}`;
	return params.token ? `${baseUrl}?token=${params.token}` : baseUrl;
}
async function resolveProjectIdFromGogCredentials() {
	const candidates = gogCredentialsPaths();
	for (const candidate of candidates) {
		if (!fs.existsSync(candidate)) continue;
		try {
			const raw = fs.readFileSync(candidate, "utf-8");
			const projectNumber = extractGogClientId(JSON.parse(raw))?.match(/^(\d+)-/)?.[1] ?? null;
			if (!projectNumber) continue;
			const res = await runGcloudCommand([
				"projects",
				"list",
				"--filter",
				`projectNumber=${projectNumber}`,
				"--format",
				"value(projectId)"
			], 3e4);
			if (res.code !== 0) continue;
			const projectId = res.stdout.trim().split(/\s+/)[0];
			if (projectId) return projectId;
		} catch {}
	}
	return null;
}
function gogCredentialsPaths() {
	const paths = [];
	const xdg = process.env.XDG_CONFIG_HOME;
	if (xdg) paths.push(path.join(xdg, "gogcli", "credentials.json"));
	paths.push(resolveUserPath("~/.config/gogcli/credentials.json"));
	if (process.platform === "darwin") paths.push(resolveUserPath("~/Library/Application Support/gogcli/credentials.json"));
	return paths;
}
function extractGogClientId(parsed) {
	const installed = parsed.installed;
	const web = parsed.web;
	const candidate = installed?.client_id || web?.client_id || parsed.client_id || "";
	return typeof candidate === "string" ? candidate : null;
}
//#endregion
//#region src/hooks/gmail-watcher-errors.ts
const ADDRESS_IN_USE_RE = /address already in use|EADDRINUSE/i;
/** Detect watcher startup failures caused by an occupied bind port. */
function isAddressInUseError(line) {
	return ADDRESS_IN_USE_RE.test(line);
}
//#endregion
//#region src/hooks/gmail-watcher.ts
/**
* Gmail Watcher Service
*
* Automatically starts `gog gmail watch serve` when the gateway starts,
* if hooks.gmail is configured with an account.
*/
const log = createSubsystemLogger("gmail-watcher");
const GMAIL_BIND_RETRY_LIMIT = 3;
const GMAIL_BIND_BACKOFF = {
	initialMs: 5e3,
	maxMs: 2e4,
	factor: 2,
	jitter: 0
};
let watcherProcess = null;
let renewalScope;
let shuttingDown = false;
let currentConfig = null;
let respawnTimeout = null;
/**
* Start the Gmail watch (registers with Gmail API)
*/
async function startGmailWatch(cfg, options = {}) {
	const args = [resolveGogExecutable(), ...buildGogWatchStartArgs(cfg)];
	try {
		const result = await runCommandWithTimeout(args, {
			timeoutMs: 12e4,
			signal: options.signal
		});
		if (result.code !== 0) {
			log.error(formatCommandResult("gog gmail watch start", result));
			return false;
		}
		log.info(`watch started for ${cfg.account}`);
		return true;
	} catch (err) {
		log.error(`watch start error: ${String(err)}`);
		return false;
	}
}
/**
* Spawn the gog gmail watch serve process
*/
function spawnGogServe(cfg, bindRetries = 0) {
	const args = buildGogWatchServeArgs(cfg);
	log.info(`starting gog ${buildGogWatchServeLogArgs(cfg).join(" ")}`);
	let addressInUse = false;
	let spawnFailed = false;
	let stderrTail = "";
	const invocation = resolveGogServeInvocation(args);
	const child = spawn(invocation.command, invocation.args, {
		stdio: [
			"ignore",
			"pipe",
			"pipe"
		],
		detached: process$1.platform !== "win32",
		windowsHide: invocation.windowsHide,
		windowsVerbatimArguments: invocation.windowsVerbatimArguments
	});
	child.stdout?.on("error", (err) => {
		log.error(`gog stdout error: ${String(err)}`);
	});
	child.stdout?.on("data", (data) => {
		const line = data.toString().trim();
		if (line) log.info(`[gog] ${line}`);
	});
	child.stderr?.on("error", (err) => {
		log.error(`gog stderr error: ${String(err)}`);
	});
	child.stderr?.on("data", (data) => {
		const chunk = data.toString();
		const combined = stderrTail + chunk;
		if (!addressInUse && isAddressInUseError(combined)) addressInUse = true;
		stderrTail = combined.slice(-512);
		const line = chunk.trim();
		if (!line) return;
		log.warn(`[gog] ${line}`);
	});
	child.on("error", (err) => {
		if (child.pid === void 0) spawnFailed = true;
		log.error(`gog process error: ${String(err)}`);
	});
	const releaseOutput = releaseChildProcessOutputAfterExit(child);
	child.once("exit", () => {
		if (!shuttingDown && watcherProcess === child && process$1.platform !== "win32" && child.pid) killProcessTree(child.pid, {
			force: true,
			detached: true
		});
	});
	child.once("close", (code, signal) => {
		releaseOutput();
		if (shuttingDown || watcherProcess !== child) return;
		if (spawnFailed) {
			watcherProcess = null;
			return;
		}
		if (addressInUse && bindRetries >= GMAIL_BIND_RETRY_LIMIT) {
			log.error(`gog serve failed to bind after ${GMAIL_BIND_RETRY_LIMIT} retries (address already in use); stopping restarts. Stop the other process and restart the Gmail watcher, or set OPENCLAW_SKIP_GMAIL_WATCHER=1 if it is managed separately.`);
			watcherProcess = null;
			return;
		}
		const nextBindRetries = addressInUse ? bindRetries + 1 : 0;
		const delayMs = addressInUse ? computeBackoff(GMAIL_BIND_BACKOFF, nextBindRetries) : 5e3;
		log.warn(addressInUse ? `gog serve failed to bind (address already in use); retry ${nextBindRetries}/${GMAIL_BIND_RETRY_LIMIT} in ${delayMs / 1e3}s` : `gog exited (code=${code}, signal=${signal}); restarting in 5s`);
		watcherProcess = null;
		respawnTimeout = setTimeout(() => {
			respawnTimeout = null;
			if (shuttingDown || !currentConfig) return;
			watcherProcess = spawnGogServe(currentConfig, nextBindRetries);
		}, delayMs);
	});
	return child;
}
/**
* Signal the gog process tree to exit gracefully (SIGTERM, SIGKILL after 3 s)
* and resolve on exit/close/error or a final 8 s safety timeout.
*/
function settleProcess(proc) {
	if (process$1.platform === "win32" && (proc.exitCode != null || proc.signalCode != null)) return Promise.resolve();
	return new Promise((resolve) => {
		let settled = false;
		let processSettled = false;
		let graceElapsed = false;
		let graceTimer;
		const settle = () => {
			if (settled) return;
			settled = true;
			if (graceTimer) clearTimeout(graceTimer);
			if (finalTimeout) clearTimeout(finalTimeout);
			proc.removeListener("exit", settleAfterEscalation);
			proc.removeListener("close", settleAfterEscalation);
			proc.removeListener("error", settleAfterEscalation);
			resolve();
		};
		const settleAfterEscalation = () => {
			processSettled = true;
			if (graceElapsed) settle();
		};
		const finalTimeout = setTimeout(() => {
			if (!settled) {
				log.warn("gog process did not exit after SIGKILL; giving up");
				settle();
			}
		}, 8e3);
		proc.on("exit", settleAfterEscalation);
		proc.on("close", settleAfterEscalation);
		proc.on("error", settleAfterEscalation);
		if (typeof proc.pid === "number") {
			killProcessTree(proc.pid, {
				graceMs: 3e3,
				detached: process$1.platform !== "win32"
			});
			graceTimer = setTimeout(() => {
				graceElapsed = true;
				if (processSettled) settle();
			}, 3025);
		} else {
			try {
				proc.kill("SIGTERM");
			} catch {}
			graceElapsed = true;
		}
	});
}
async function stopWatcherResources(onProcessStop) {
	shuttingDown = true;
	if (respawnTimeout) {
		clearTimeout(respawnTimeout);
		respawnTimeout = null;
	}
	const renewal = renewalScope;
	await renewal?.stop();
	if (renewalScope === renewal) renewalScope = void 0;
	if (watcherProcess) {
		onProcessStop?.();
		const proc = watcherProcess;
		watcherProcess = null;
		await settleProcess(proc);
	}
}
function cancelledGmailWatcherStart(expectedConfig) {
	if (currentConfig === expectedConfig) currentConfig = null;
	return {
		started: false,
		reason: "startup cancelled"
	};
}
/**
* Start the Gmail watcher service.
* Called automatically by the gateway if hooks.gmail is configured.
*/
async function startGmailWatcher(cfg, options) {
	if (!cfg.hooks?.enabled) return {
		started: false,
		reason: "hooks not enabled"
	};
	if (!cfg.hooks?.gmail?.account) return {
		started: false,
		reason: "no gmail account configured"
	};
	if (!hasBinary("gog")) return {
		started: false,
		reason: "gog binary not found"
	};
	const resolved = resolveGmailHookRuntimeConfig(cfg, {});
	if (!resolved.ok) return {
		started: false,
		reason: resolved.error
	};
	return startGmailWatcherService(resolved.value, options);
}
/** Start the shared watcher lifecycle after the caller resolves config and prerequisites. */
async function startGmailWatcherService(runtimeConfig, options) {
	if (options.signal?.aborted) return cancelledGmailWatcherStart(runtimeConfig);
	currentConfig = runtimeConfig;
	if (watcherProcess || renewalScope || respawnTimeout) {
		await stopWatcherResources();
		shuttingDown = false;
	}
	if (runtimeConfig.tailscale.mode !== "off") try {
		await ensureTailscaleEndpoint({
			mode: runtimeConfig.tailscale.mode,
			path: runtimeConfig.tailscale.path,
			port: runtimeConfig.serve.port,
			signal: options.signal,
			target: runtimeConfig.tailscale.target
		});
		log.info(`tailscale ${runtimeConfig.tailscale.mode} configured for port ${runtimeConfig.serve.port}`);
		if (options.signal?.aborted) return cancelledGmailWatcherStart(runtimeConfig);
	} catch (err) {
		if (options.signal?.aborted) return cancelledGmailWatcherStart(runtimeConfig);
		log.error(`tailscale setup failed: ${String(err)}`);
		return {
			started: false,
			reason: `tailscale setup failed: ${String(err)}`
		};
	}
	const watchStarted = await startGmailWatch(runtimeConfig, { signal: options.signal });
	if (options.signal?.aborted) return cancelledGmailWatcherStart(runtimeConfig);
	if (!watchStarted) log.warn("gmail watch start failed, but continuing with serve");
	shuttingDown = false;
	watcherProcess = spawnGogServe(runtimeConfig);
	const renewMs = runtimeConfig.renewEveryMinutes * 6e4;
	const renewal = options.scheduler.scope();
	renewalScope = renewal;
	renewal.schedule({
		id: "gmail-watch-renewal",
		delayMs: renewMs,
		everyMs: renewMs,
		run: () => startGmailWatch(runtimeConfig, { signal: renewal.signal })
	});
	log.info(`gmail watcher started for ${runtimeConfig.account} (renew every ${runtimeConfig.renewEveryMinutes}m)`);
	return { started: true };
}
async function stopGmailWatcher() {
	await stopWatcherResources(() => log.info("stopping gmail watcher"));
	currentConfig = null;
	log.info("gmail watcher stopped");
}
//#endregion
export { ensureGcloudAuth as a, ensureTopic as c, ensureDependency as i, resolveProjectIdFromGogCredentials as l, startGmailWatcherService as n, ensureSubscription as o, stopGmailWatcher as r, ensureTailscaleEndpoint as s, startGmailWatcher as t, runGcloud as u };
