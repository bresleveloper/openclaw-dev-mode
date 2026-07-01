import { c as normalizeOptionalString, p as readStringValue } from "./string-coerce-DW4mBlAt.js";
import { u as redactToolPayloadText } from "./redact-CQ2tlRRk.js";
import { n as asNullableRecord } from "./record-coerce-DHZ4bFlT.js";
import { O as resolveNonNegativeIntegerOption, a as addTimerTimeoutGraceMs, b as parseStrictPositiveInteger } from "./number-coercion-CJQ8TR--.js";
import { _ as uniqueStrings, v as uniqueValues } from "./string-normalization-CRyoFBPt.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DOKojISm.js";
import { t as createSubsystemLogger } from "./subsystem-yNfG7O3v.js";
import "./number-runtime-DBLVDypr.js";
import "./string-coerce-runtime-BiZzULo_.js";
import { n as redactCdpUrl } from "./browser-config-BPzc9xWq.js";
import { S as BrowserTabNotFoundError, y as BrowserProfileUnavailableError } from "./cdp.helpers-C19acCN_.js";
import "./tmp-openclaw-dir-Md827g-c.js";
import "./record-shared-BC2jwWVC.js";
import "./subsystem-Cc6lJ4yV.js";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import { execFile } from "node:child_process";
import { randomUUID } from "node:crypto";
import { promisify } from "node:util";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
//#region extensions/browser/src/browser/chrome-mcp.ts
/**
* Chrome MCP existing-session adapter.
*
* Manages chrome-devtools-mcp processes and sessions, maps Browser actions to
* MCP tools, and exposes tab/snapshot/action helpers for logged-in browsers.
*/
const log = createSubsystemLogger("browser").child("chrome-mcp");
const DEFAULT_CHROME_MCP_COMMAND = "npx";
const DEFAULT_CHROME_MCP_PACKAGE_ARGS = ["-y", "chrome-devtools-mcp@latest"];
const DEFAULT_CHROME_MCP_FEATURE_ARGS = [
	"--no-usage-statistics",
	"--experimentalStructuredContent",
	"--experimental-page-id-routing"
];
const CHROME_MCP_USAGE_STATISTICS_FLAG_RE = /^--(?:no-)?usage-?statistics(?:=.*)?$/i;
const CHROME_MCP_CONNECTION_FLAGS = new Set([
	"--autoConnect",
	"--auto-connect",
	"--browserUrl",
	"--browser-url",
	"--wsEndpoint",
	"--ws-endpoint",
	"-w"
]);
const CHROME_MCP_USER_DATA_DIR_FLAGS = new Set(["--userDataDir", "--user-data-dir"]);
const CHROME_MCP_NEW_PAGE_TIMEOUT_MS = 5e3;
const CHROME_MCP_NAVIGATE_TIMEOUT_MS = 2e4;
const CHROME_MCP_HANDSHAKE_TIMEOUT_MS = 3e4;
const CHROME_MCP_STDERR_MAX_BYTES = 8 * 1024;
const CHROME_MCP_PROCESS_EXIT_GRACE_MS = 250;
const CDP_URL_IN_TEXT_RE = /\b(?:https?|wss?):\/\/[^\s"'<>`]+/gi;
const DEVTOOLS_ACTIVE_PORT_RE = /\bDevToolsActivePort\b/i;
const CHROME_CONNECTION_TOOL_ERROR_RE = /(?:Could not connect to Chrome|DevToolsActivePort|ECONNREFUSED|ECONNRESET|websocket|timed out)/i;
const STALE_SELECTED_PAGE_ERROR = "The selected page has been closed. Call list_pages to see open pages.";
const execFileAsync = promisify(execFile);
const sessions = /* @__PURE__ */ new Map();
const pendingSessions = /* @__PURE__ */ new Map();
let sessionFactory = null;
let chromeMcpProcessCleanupDepsForTest = null;
/** Decode a bounded UTF-8-safe stderr tail for Chrome MCP diagnostics. */
function decodeChromeMcpStderrTail(buffer) {
	if (buffer.length <= CHROME_MCP_STDERR_MAX_BYTES) return buffer.toString("utf8").trim();
	let start = buffer.length - CHROME_MCP_STDERR_MAX_BYTES;
	while (start < buffer.length && (buffer[start] & 192) === 128) start++;
	return buffer.subarray(start).toString("utf8").trim();
}
function asPages(value) {
	if (!Array.isArray(value)) return [];
	const out = [];
	for (const entry of value) {
		const record = asNullableRecord(entry);
		if (!record || typeof record.id !== "number") continue;
		out.push({
			id: record.id,
			url: readStringValue(record.url),
			selected: record.selected === true
		});
	}
	return out;
}
function parsePageId(targetId) {
	const parsed = parseStrictPositiveInteger(targetId);
	if (parsed === void 0) throw new BrowserTabNotFoundError();
	return parsed;
}
function toBrowserTabs(pages) {
	return pages.map((page) => ({
		targetId: String(page.id),
		title: "",
		url: page.url ?? "",
		type: "page"
	}));
}
function extractStructuredContent(result) {
	return asNullableRecord(result.structuredContent) ?? {};
}
function extractTextContent(result) {
	return (Array.isArray(result.content) ? result.content : []).map((entry) => {
		const record = asNullableRecord(entry);
		return record && typeof record.text === "string" ? record.text : "";
	}).filter(Boolean);
}
function extractTextPages(result) {
	const pages = [];
	for (const block of extractTextContent(result)) for (const line of block.split(/\r?\n/)) {
		const match = line.match(/^\s*(\d+):\s+(.+?)(?:\s+\[(selected)\])?\s*$/i);
		if (!match) continue;
		pages.push({
			id: Number.parseInt(match[1] ?? "", 10),
			url: normalizeOptionalString(match[2]),
			selected: Boolean(match[3])
		});
	}
	return pages;
}
function extractStructuredPages(result) {
	const structured = asPages(extractStructuredContent(result).pages);
	return structured.length > 0 ? structured : extractTextPages(result);
}
function extractSnapshot(result) {
	const snapshot = asNullableRecord(extractStructuredContent(result).snapshot);
	if (!snapshot) throw new Error("Chrome MCP snapshot response was missing structured snapshot data.");
	return snapshot;
}
function extractJsonBlock(text) {
	const raw = text.match(/```json\s*([\s\S]*?)\s*```/i)?.[1]?.trim() || text.trim();
	return raw ? JSON.parse(raw) : null;
}
function extractMessageText(result) {
	const message = extractStructuredContent(result).message;
	if (typeof message === "string" && message.trim()) return message;
	return extractTextContent(result).find((block) => block.trim()) ?? "";
}
function extractToolErrorMessage(result, name) {
	return extractMessageText(result).trim() || `Chrome MCP tool "${name}" failed.`;
}
function formatChromeMcpEndpointForDiagnostic(browserUrl) {
	return redactToolPayloadText(redactCdpUrl(browserUrl) ?? browserUrl);
}
function formatChromeMcpToolErrorMessage(params) {
	const detail = redactChromeMcpDiagnosticTextWithLocalPaths(params.message);
	const profileLabel = redactChromeMcpProfileLabelForDiagnostic(params.profileName);
	if (params.options.browserUrl && CHROME_CONNECTION_TOOL_ERROR_RE.test(params.message)) return `Chrome MCP tool "${params.toolName}" failed for profile "${profileLabel}" while using the configured Chrome endpoint (${formatChromeMcpEndpointForDiagnostic(params.options.browserUrl)}). Details: ${detail}`;
	if (!params.options.browserUrl && params.options.userDataDir && DEVTOOLS_ACTIVE_PORT_RE.test(params.message)) return `${detail} If this browser was started with --remote-debugging-port, set ${path.isAbsolute(params.profileName) ? "this existing-session profile's cdpUrl" : `browser.profiles.${params.profileName}.cdpUrl`} to that DevTools endpoint instead of relying on Chrome MCP auto-connect.`;
	return detail;
}
function shouldReconnectForToolError(name, message) {
	return name === "list_pages" && message.includes(STALE_SELECTED_PAGE_ERROR);
}
function extractJsonMessage(result) {
	const candidates = [extractMessageText(result), ...extractTextContent(result)].filter((text) => text.trim());
	let lastError;
	for (const candidate of candidates) try {
		return extractJsonBlock(candidate);
	} catch (err) {
		lastError = err;
	}
	if (lastError) throw toLintErrorObject(lastError, "Non-Error thrown");
	return null;
}
function normalizeChromeMcpUserDataDir(userDataDir) {
	const trimmed = userDataDir?.trim();
	return trimmed ? trimmed : void 0;
}
function normalizeChromeMcpStringList(values) {
	return Array.isArray(values) ? values.filter((value) => typeof value === "string" && value.trim().length > 0) : [];
}
function normalizeChromeMcpOptions(input) {
	if (typeof input === "object" && input && "command" in input && "extraArgs" in input) return input;
	const options = typeof input === "string" ? { userDataDir: input } : input ?? {};
	return {
		command: normalizeOptionalString(options.mcpCommand) ?? DEFAULT_CHROME_MCP_COMMAND,
		userDataDir: normalizeChromeMcpUserDataDir(options.userDataDir),
		browserUrl: normalizeOptionalString(options.cdpUrl),
		extraArgs: normalizeChromeMcpStringList(options.mcpArgs)
	};
}
function hasFlag(args, flags) {
	return args.some((arg) => {
		const [name] = arg.split("=", 1);
		return flags.has(name ?? arg);
	});
}
function isChromeMcpWebSocketEndpoint(url) {
	return /^wss?:\/\//i.test(url);
}
function buildChromeMcpConnectionArgs(options) {
	if (hasFlag(options.extraArgs, CHROME_MCP_CONNECTION_FLAGS)) return [];
	if (options.browserUrl) return isChromeMcpWebSocketEndpoint(options.browserUrl) ? ["--wsEndpoint", options.browserUrl] : ["--browserUrl", options.browserUrl];
	return ["--autoConnect"];
}
function buildChromeMcpUserDataDirArgs(options) {
	if (!options.userDataDir || options.browserUrl || hasFlag(options.extraArgs, CHROME_MCP_CONNECTION_FLAGS) || hasFlag(options.extraArgs, CHROME_MCP_USER_DATA_DIR_FLAGS)) return [];
	return ["--userDataDir", options.userDataDir];
}
function buildChromeMcpSessionCacheKey(profileName, options) {
	return JSON.stringify([
		profileName,
		options.userDataDir ?? "",
		options.browserUrl ?? "",
		options.command,
		options.extraArgs
	]);
}
function chromeMcpProfileOptionsFromParams(params) {
	return params.profile ?? params.userDataDir;
}
function cacheKeyMatchesProfileName(cacheKey, profileName) {
	try {
		const parsed = JSON.parse(cacheKey);
		return Array.isArray(parsed) && parsed[0] === profileName;
	} catch {
		return false;
	}
}
async function closeChromeMcpSessionsForProfile(profileName, keepKey) {
	let closed = false;
	for (const [key, pending] of Array.from(pendingSessions.entries())) if (key !== keepKey && cacheKeyMatchesProfileName(key, profileName)) {
		pendingSessions.delete(key);
		abortPendingChromeMcpSession(pending, /* @__PURE__ */ new Error("Chrome MCP profile session was replaced"));
		closed = true;
	}
	for (const [key, session] of Array.from(sessions.entries())) if (key !== keepKey && cacheKeyMatchesProfileName(key, profileName)) {
		sessions.delete(key);
		closed = true;
		await closeChromeMcpSessionHandle(session);
	}
	return closed;
}
function buildChromeMcpArgsFromOptions(options) {
	const commandPrefix = options.command === DEFAULT_CHROME_MCP_COMMAND ? DEFAULT_CHROME_MCP_PACKAGE_ARGS : [];
	const defaultFeatureArgs = options.extraArgs.some((arg) => CHROME_MCP_USAGE_STATISTICS_FLAG_RE.test(arg)) ? DEFAULT_CHROME_MCP_FEATURE_ARGS.filter((arg) => arg !== "--no-usage-statistics") : DEFAULT_CHROME_MCP_FEATURE_ARGS;
	return [
		...commandPrefix,
		...buildChromeMcpConnectionArgs(options),
		...defaultFeatureArgs,
		...buildChromeMcpUserDataDirArgs(options),
		...options.extraArgs
	];
}
function drainStderr(transport) {
	const stream = transport.stderr;
	if (!stream) return () => "";
	const chunks = [];
	let totalBytes = 0;
	stream.on("data", (chunk) => {
		const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
		const capped = buffer.length > CHROME_MCP_STDERR_MAX_BYTES ? buffer.subarray(buffer.length - CHROME_MCP_STDERR_MAX_BYTES) : buffer;
		chunks.push(capped);
		totalBytes += capped.length;
		while (totalBytes > CHROME_MCP_STDERR_MAX_BYTES && chunks.length > 1) {
			const dropped = chunks.shift();
			if (dropped) totalBytes -= dropped.length;
		}
	});
	stream.on("error", () => {});
	return () => decodeChromeMcpStderrTail(Buffer.concat(chunks));
}
function redactChromeMcpDiagnosticText(text) {
	return redactToolPayloadText(text.replace(CDP_URL_IN_TEXT_RE, (match) => redactToolPayloadText(redactCdpUrl(match) ?? match)));
}
function redactChromeMcpDiagnosticTextWithLocalPaths(text) {
	const homeDir = normalizeOptionalString(os.homedir());
	const homePath = homeDir ? path.resolve(homeDir) : void 0;
	return redactChromeMcpDiagnosticText(homePath ? text.split(homePath).join("~") : text);
}
function redactChromeMcpLocalPathForDiagnostic(filePath) {
	const homeDir = normalizeOptionalString(os.homedir());
	if (!homeDir || !path.isAbsolute(filePath)) return redactChromeMcpDiagnosticText(filePath);
	const relative = path.relative(path.resolve(homeDir), path.resolve(filePath));
	if (relative === "") return "~";
	if (!relative.startsWith("..") && !path.isAbsolute(relative)) return redactChromeMcpDiagnosticText(`~/${relative.split(path.sep).join("/")}`);
	return redactChromeMcpDiagnosticText(filePath);
}
function redactChromeMcpProfileLabelForDiagnostic(profileName) {
	return path.isAbsolute(profileName) ? redactChromeMcpLocalPathForDiagnostic(profileName) : redactChromeMcpDiagnosticText(profileName);
}
function readChromeMcpTransportPid(transport) {
	const pid = transport.pid;
	return typeof pid === "number" && Number.isInteger(pid) && pid > 0 && pid !== process.pid ? pid : void 0;
}
function parseChromeMcpProcessList(stdout) {
	const processes = [];
	for (const line of stdout.split(/\r?\n/)) {
		const match = /^\s*(?<pid>\d+)\s+(?<ppid>\d+)\s*$/.exec(line);
		if (!match?.groups) continue;
		processes.push({
			pid: Number.parseInt(match.groups.pid, 10),
			ppid: Number.parseInt(match.groups.ppid, 10)
		});
	}
	return processes;
}
async function listChromeMcpPlatformProcesses(deps) {
	if (deps?.listProcesses) return await deps.listProcesses();
	if ((deps?.platform ?? process.platform) === "win32") return [];
	const { stdout } = await execFileAsync("ps", ["-axo", "pid=,ppid="], { maxBuffer: 4 * 1024 * 1024 });
	return parseChromeMcpProcessList(stdout);
}
function collectChromeMcpProcessTreePids(rootPid, processes) {
	const childrenByParent = /* @__PURE__ */ new Map();
	for (const processInfo of processes) {
		const children = childrenByParent.get(processInfo.ppid) ?? [];
		children.push(processInfo);
		childrenByParent.set(processInfo.ppid, children);
	}
	const collected = [];
	const queue = [...childrenByParent.get(rootPid) ?? []];
	while (queue.length > 0) {
		const next = queue.shift();
		if (!next || next.pid === process.pid || next.pid === rootPid || collected.includes(next.pid)) continue;
		collected.push(next.pid);
		queue.push(...childrenByParent.get(next.pid) ?? []);
	}
	return collected;
}
async function collectChromeMcpDescendantPids(rootPid, deps) {
	try {
		return collectChromeMcpProcessTreePids(rootPid, await listChromeMcpPlatformProcesses(deps));
	} catch (err) {
		log.trace(`Unable to inspect Chrome MCP subprocess tree for pid ${rootPid}: ${err instanceof Error ? err.message : String(err)}`);
		return [];
	}
}
function isChromeMcpProcessAlive(pid) {
	try {
		process.kill(pid, 0);
		return true;
	} catch (err) {
		return err.code === "EPERM";
	}
}
async function taskkillChromeMcpProcessTree(rootPid, deps) {
	if (deps?.taskkillProcessTree) {
		await deps.taskkillProcessTree(rootPid);
		return;
	}
	await execFileAsync("taskkill", [
		"/pid",
		String(rootPid),
		"/t",
		"/f"
	], { windowsHide: true });
}
async function terminateChromeMcpProcessTree(rootPid, descendantPids) {
	if (!rootPid) return;
	const deps = chromeMcpProcessCleanupDepsForTest;
	if ((deps?.platform ?? process.platform) === "win32") {
		await taskkillChromeMcpProcessTree(rootPid, deps);
		return;
	}
	const killProcess = deps?.killProcess ?? ((pid, signal) => process.kill(pid, signal));
	const sleep = deps?.sleep ?? setTimeout$1;
	const pids = uniqueValues([...descendantPids.toReversed(), rootPid]).filter((pid) => Number.isInteger(pid) && pid > 0 && pid !== process.pid);
	const signaled = [];
	for (const pid of pids) try {
		killProcess(pid, "SIGTERM");
		signaled.push(pid);
	} catch {}
	if (signaled.length === 0) return;
	await sleep(CHROME_MCP_PROCESS_EXIT_GRACE_MS);
	for (const pid of signaled) if (deps?.killProcess || isChromeMcpProcessAlive(pid)) try {
		killProcess(pid, "SIGKILL");
	} catch {}
}
async function closeChromeMcpClientAndProcess(params) {
	const deps = chromeMcpProcessCleanupDepsForTest;
	const rootPid = params.ownsProcessTree ? readChromeMcpTransportPid(params.transport) : void 0;
	const descendantPids = rootPid ? await collectChromeMcpDescendantPids(rootPid, deps) : [];
	if (Boolean(rootPid && (deps?.platform ?? process.platform) === "win32")) {
		try {
			await terminateChromeMcpProcessTree(rootPid, descendantPids);
		} catch (err) {
			log.trace(`Unable to pre-terminate Chrome MCP subprocess tree for pid ${rootPid}: ${err instanceof Error ? err.message : String(err)}`);
			await params.client.close().catch(() => {});
		}
		return;
	}
	await params.client.close().catch(() => {});
	await terminateChromeMcpProcessTree(rootPid, descendantPids).catch((err) => {
		log.trace(`Unable to fully terminate Chrome MCP subprocess tree for pid ${rootPid}: ${err instanceof Error ? err.message : String(err)}`);
	});
}
async function closeChromeMcpSessionHandle(session) {
	await closeChromeMcpClientAndProcess({
		client: session.client,
		transport: session.transport,
		ownsProcessTree: session.ownsProcessTree
	});
}
async function withChromeMcpHandshakeTimeout(task) {
	let timer;
	try {
		return await Promise.race([task, new Promise((_, reject) => {
			timer = setTimeout(() => {
				reject(/* @__PURE__ */ new Error("Chrome MCP handshake timed out"));
			}, CHROME_MCP_HANDSHAKE_TIMEOUT_MS);
			timer.unref?.();
		})]);
	} finally {
		if (timer) clearTimeout(timer);
	}
}
async function createRealSession(profileName, options = normalizeChromeMcpOptions()) {
	const transport = new StdioClientTransport({
		command: options.command,
		args: buildChromeMcpArgsFromOptions(options),
		stderr: "pipe"
	});
	const client = new Client({
		name: "openclaw-browser",
		version: "0.0.0"
	}, {});
	let getStderr = () => "";
	const ready = (async () => {
		try {
			await withChromeMcpHandshakeTimeout((async () => {
				await client.connect(transport);
				getStderr = drainStderr(transport);
				if (!(await client.listTools()).tools.some((tool) => tool.name === "list_pages")) throw new Error("Chrome MCP server did not expose the expected navigation tools.");
			})());
		} catch (err) {
			await closeChromeMcpClientAndProcess({
				client,
				transport,
				ownsProcessTree: true
			});
			const stderr = getStderr();
			if (stderr) log.warn(`Chrome MCP attach failed for profile "${redactChromeMcpProfileLabelForDiagnostic(profileName)}". Subprocess stderr:\n${redactChromeMcpDiagnosticTextWithLocalPaths(stderr)}`);
			const targetLabel = options.browserUrl ? `the configured Chrome endpoint (${redactToolPayloadText(redactCdpUrl(options.browserUrl) ?? options.browserUrl)})` : options.userDataDir ? `the configured Chromium user data dir (${redactChromeMcpLocalPathForDiagnostic(options.userDataDir)})` : "Google Chrome's default profile";
			const detail = redactChromeMcpDiagnosticTextWithLocalPaths(err instanceof Error ? err.message : String(err));
			throw new BrowserProfileUnavailableError(`Chrome MCP existing-session attach failed for profile "${redactChromeMcpProfileLabelForDiagnostic(profileName)}". Make sure ${targetLabel} is running locally with remote debugging enabled. Details: ${detail}`);
		}
	})();
	ready.catch(() => {});
	return {
		client,
		transport,
		ready,
		ownsProcessTree: true
	};
}
async function waitForChromeMcpReady(session, profileName, timeoutMs, signal) {
	if (signal?.aborted) throw signal.reason ?? /* @__PURE__ */ new Error("aborted");
	if ((!timeoutMs || timeoutMs <= 0) && !signal) {
		await session.ready;
		return;
	}
	let timer;
	let abortListener;
	try {
		const racers = [session.ready];
		if (timeoutMs && timeoutMs > 0) racers.push(new Promise((_, reject) => {
			timer = setTimeout(() => {
				reject(new BrowserProfileUnavailableError(`Chrome MCP existing-session attach for profile "${redactChromeMcpProfileLabelForDiagnostic(profileName)}" timed out after ${timeoutMs}ms.`));
			}, timeoutMs);
		}));
		if (signal) racers.push(new Promise((_, reject) => {
			abortListener = () => reject(toLintErrorObject(signal.reason ?? /* @__PURE__ */ new Error("aborted"), "Non-Error rejection"));
			signal.addEventListener("abort", abortListener, { once: true });
		}));
		await Promise.race(racers);
	} finally {
		if (timer) clearTimeout(timer);
		if (signal && abortListener) signal.removeEventListener("abort", abortListener);
	}
}
async function waitForChromeMcpPendingSession(pending, signal) {
	if (signal?.aborted) throw signal.reason ?? /* @__PURE__ */ new Error("aborted");
	if (!signal) return await pending;
	let abortListener;
	try {
		return await Promise.race([pending, new Promise((_, reject) => {
			abortListener = () => reject(toLintErrorObject(signal.reason ?? /* @__PURE__ */ new Error("aborted"), "Non-Error rejection"));
			signal.addEventListener("abort", abortListener, { once: true });
		})]);
	} finally {
		if (abortListener) signal.removeEventListener("abort", abortListener);
	}
}
async function createChromeMcpSession(profileName, options, signal) {
	const created = (sessionFactory ?? createRealSession)(profileName, options);
	let closedAfterAbort = false;
	try {
		const session = await waitForChromeMcpPendingSession(created, signal);
		if (signal?.aborted) {
			closedAfterAbort = true;
			await closeChromeMcpSessionHandle(session);
			throw signal.reason ?? /* @__PURE__ */ new Error("aborted");
		}
		return session;
	} catch (err) {
		if (signal?.aborted && !closedAfterAbort) created.then((session) => closeChromeMcpSessionHandle(session)).catch(() => {});
		throw err;
	}
}
function abortPendingChromeMcpSession(pending, reason = /* @__PURE__ */ new Error("Chrome MCP session attach no longer has active waiters")) {
	if (!pending.state.settled && !pending.abortController.signal.aborted) pending.abortController.abort(reason);
}
function forgetCachedChromeMcpSessionIfCurrent(cacheKey, session) {
	if (sessions.get(cacheKey)?.transport !== session.transport) return false;
	sessions.delete(cacheKey);
	return true;
}
function forgetPendingChromeMcpSessionIfCurrent(cacheKey, pending) {
	if (pendingSessions.get(cacheKey) !== pending) return false;
	pendingSessions.delete(cacheKey);
	return true;
}
function createSharedPendingChromeMcpSession(cacheKey, profileName, options) {
	const id = Symbol(cacheKey);
	const abortController = new AbortController();
	const state = {
		waiters: 0,
		settled: false
	};
	const promise = (async () => {
		try {
			const created = await createChromeMcpSession(profileName, options, abortController.signal);
			if (pendingSessions.get(cacheKey)?.id === id) sessions.set(cacheKey, created);
			else await closeChromeMcpSessionHandle(created);
			return created;
		} finally {
			state.settled = true;
			if (state.waiters === 0 && pendingSessions.get(cacheKey)?.id === id) pendingSessions.delete(cacheKey);
		}
	})();
	const pending = {
		cacheKey,
		id,
		promise,
		abortController,
		state
	};
	promise.catch(() => {});
	return pending;
}
async function waitForSharedPendingChromeMcpSession(pending, signal) {
	pending.state.waiters += 1;
	let released = false;
	let leasedSession;
	const release = async (closeIfLastWaiter) => {
		if (released) return false;
		released = true;
		pending.state.waiters = Math.max(0, pending.state.waiters - 1);
		if (pending.state.waiters !== 0) return false;
		if (pendingSessions.get(pending.cacheKey) === pending) pendingSessions.delete(pending.cacheKey);
		if (!pending.state.settled) abortPendingChromeMcpSession(pending, signal?.reason);
		else if (closeIfLastWaiter && leasedSession) {
			forgetCachedChromeMcpSessionIfCurrent(pending.cacheKey, leasedSession);
			await closeChromeMcpSessionHandle(leasedSession);
		}
		return true;
	};
	try {
		leasedSession = await waitForChromeMcpPendingSession(pending.promise, signal);
		return {
			session: leasedSession,
			release
		};
	} catch (err) {
		await release(signal?.aborted === true);
		throw err;
	}
}
async function getSession(profileName, profileOptions, timeoutMs, signal) {
	const options = normalizeChromeMcpOptions(profileOptions);
	const cacheKey = buildChromeMcpSessionCacheKey(profileName, options);
	await closeChromeMcpSessionsForProfile(profileName, cacheKey);
	if (signal?.aborted) throw signal.reason ?? /* @__PURE__ */ new Error("aborted");
	let staleReadySessionRetries = 0;
	for (;;) {
		let session = sessions.get(cacheKey);
		if (session && session.transport.pid === null) {
			sessions.delete(cacheKey);
			session = void 0;
		}
		let pendingLease;
		let leasedPending;
		const pending = pendingSessions.get(cacheKey);
		if (pending) {
			leasedPending = pending;
			pendingLease = await waitForSharedPendingChromeMcpSession(pending, signal);
			session = pendingLease.session;
		}
		if (!session) {
			const createdPending = createSharedPendingChromeMcpSession(cacheKey, profileName, options);
			pendingSessions.set(cacheKey, createdPending);
			leasedPending = createdPending;
			pendingLease = await waitForSharedPendingChromeMcpSession(createdPending, signal);
			session = pendingLease.session;
		}
		try {
			await waitForChromeMcpReady(session, profileName, timeoutMs, signal);
			if (session.transport.pid === null) {
				forgetCachedChromeMcpSessionIfCurrent(cacheKey, session);
				if (leasedPending) forgetPendingChromeMcpSessionIfCurrent(cacheKey, leasedPending);
				if (pendingLease) {
					await pendingLease.release(true);
					pendingLease = void 0;
				}
				staleReadySessionRetries += 1;
				if (staleReadySessionRetries > 1) throw new BrowserProfileUnavailableError(`Chrome MCP existing-session attach failed for profile "${redactChromeMcpProfileLabelForDiagnostic(profileName)}". The Chrome MCP subprocess exited before it became usable.`);
				continue;
			}
			return session;
		} catch (err) {
			if (signal?.aborted && pendingLease) {
				await pendingLease.release(true);
				pendingLease = void 0;
			} else if (pendingLease && leasedPending && leasedPending.state.waiters > 1) {
				await pendingLease.release(false);
				pendingLease = void 0;
			} else {
				forgetCachedChromeMcpSessionIfCurrent(cacheKey, session);
				if (leasedPending) forgetPendingChromeMcpSessionIfCurrent(cacheKey, leasedPending);
				if (pendingLease) {
					await pendingLease.release(true);
					pendingLease = void 0;
				} else await closeChromeMcpSessionHandle(session);
			}
			throw err;
		} finally {
			await pendingLease?.release(false);
		}
	}
}
async function getExistingSession(cacheKey, profileName, timeoutMs, signal, includePending = true) {
	if (!includePending && pendingSessions.has(cacheKey)) return null;
	let session = sessions.get(cacheKey);
	if (session && session.transport.pid === null) {
		sessions.delete(cacheKey);
		session = void 0;
	}
	const pending = pendingSessions.get(cacheKey);
	if (includePending && pending) {
		const pendingLease = await waitForSharedPendingChromeMcpSession(pending, signal);
		let pendingLeaseReleased = false;
		session = pendingLease.session;
		try {
			await waitForChromeMcpReady(session, profileName, timeoutMs, signal);
			if (session.transport.pid === null) {
				forgetCachedChromeMcpSessionIfCurrent(cacheKey, session);
				forgetPendingChromeMcpSessionIfCurrent(cacheKey, pending);
				await pendingLease.release(true);
				pendingLeaseReleased = true;
				return null;
			}
			return session;
		} catch (err) {
			if (signal?.aborted) {
				await pendingLease.release(true);
				pendingLeaseReleased = true;
			} else if (pending.state.waiters > 1) {
				await pendingLease.release(false);
				pendingLeaseReleased = true;
			} else {
				forgetCachedChromeMcpSessionIfCurrent(cacheKey, session);
				forgetPendingChromeMcpSessionIfCurrent(cacheKey, pending);
				await pendingLease.release(true);
				pendingLeaseReleased = true;
			}
			throw err;
		} finally {
			if (!pendingLeaseReleased) await pendingLease.release(false);
		}
	}
	if (session) try {
		await waitForChromeMcpReady(session, profileName, timeoutMs, signal);
		return session;
	} catch (err) {
		forgetCachedChromeMcpSessionIfCurrent(cacheKey, session);
		throw err;
	}
	return null;
}
async function createEphemeralSession(profileName, profileOptions, timeoutMs, signal) {
	const session = await createChromeMcpSession(profileName, normalizeChromeMcpOptions(profileOptions), signal);
	try {
		await waitForChromeMcpReady(session, profileName, timeoutMs, signal);
		return session;
	} catch (err) {
		await closeChromeMcpSessionHandle(session);
		throw err;
	}
}
async function leaseSession(profileName, profileOptions, options = {}) {
	const normalizedProfileOptions = normalizeChromeMcpOptions(profileOptions);
	const cacheKey = buildChromeMcpSessionCacheKey(profileName, normalizedProfileOptions);
	if (!options.ephemeral) return {
		session: await getSession(profileName, normalizedProfileOptions, options.timeoutMs, options.signal),
		cacheKey,
		temporary: false
	};
	const existingSession = await getExistingSession(cacheKey, profileName, options.timeoutMs, options.signal, false);
	if (existingSession) return {
		session: existingSession,
		cacheKey,
		temporary: false
	};
	return {
		session: await createEphemeralSession(profileName, normalizedProfileOptions, options.timeoutMs, options.signal),
		cacheKey,
		temporary: true
	};
}
async function callTool(profileName, profileOptions, name, args = {}, options = {}) {
	const timeoutMs = options.timeoutMs;
	const signal = options.signal;
	if (signal?.aborted) throw signal.reason ?? /* @__PURE__ */ new Error("aborted");
	const normalizedProfileOptions = normalizeChromeMcpOptions(profileOptions);
	for (let attempt = 0; attempt < 2; attempt += 1) {
		const lease = await leaseSession(profileName, normalizedProfileOptions, options);
		const rawCall = lease.session.client.callTool({
			name,
			arguments: args
		});
		let timeoutHandle;
		let abortListener;
		const racers = [rawCall];
		if (timeoutMs !== void 0 && timeoutMs > 0) racers.push(new Promise((_, reject) => {
			timeoutHandle = setTimeout(() => {
				reject(/* @__PURE__ */ new Error(`Chrome MCP "${name}" timed out after ${timeoutMs}ms. Session reset for reconnect.`));
			}, timeoutMs);
		}));
		if (signal) racers.push(new Promise((_, reject) => {
			abortListener = () => reject(toLintErrorObject(signal.reason ?? /* @__PURE__ */ new Error("aborted"), "Non-Error rejection"));
			signal.addEventListener("abort", abortListener, { once: true });
		}));
		let result;
		try {
			result = racers.length === 1 ? await rawCall : await Promise.race(racers);
		} catch (err) {
			rawCall.catch(() => {});
			if (!lease.temporary) {
				if (sessions.get(lease.cacheKey)?.transport === lease.session.transport) {
					sessions.delete(lease.cacheKey);
					await closeChromeMcpSessionHandle(lease.session);
				}
			}
			throw err;
		} finally {
			if (timeoutHandle !== void 0) clearTimeout(timeoutHandle);
			if (signal && abortListener) signal.removeEventListener("abort", abortListener);
			if (lease.temporary) await closeChromeMcpSessionHandle(lease.session);
		}
		if (result.isError) {
			const message = extractToolErrorMessage(result, name);
			if (shouldReconnectForToolError(name, message)) {
				if (!lease.temporary) {
					if (sessions.get(lease.cacheKey)?.transport === lease.session.transport) {
						sessions.delete(lease.cacheKey);
						await closeChromeMcpSessionHandle(lease.session);
					}
				}
				if (attempt === 0) continue;
			}
			throw new Error(formatChromeMcpToolErrorMessage({
				profileName,
				options: normalizedProfileOptions,
				toolName: name,
				message
			}));
		}
		return result;
	}
	throw new Error(`Chrome MCP tool "${name}" failed after reconnect.`);
}
async function withTempFile(fn) {
	const dir = await fs.mkdtemp(path.join(resolvePreferredOpenClawTmpDir(), "openclaw-chrome-mcp-"));
	const filePath = path.join(dir, randomUUID());
	try {
		return await fn(filePath);
	} finally {
		await fs.rm(dir, {
			recursive: true,
			force: true
		}).catch(() => {});
	}
}
async function findPageById(profileName, pageId, profileOptions) {
	const page = (await listChromeMcpPages(profileName, profileOptions)).find((entry) => entry.id === pageId);
	if (!page) throw new BrowserTabNotFoundError();
	return page;
}
/** Ensure a Chrome MCP session can be started for the profile. */
async function ensureChromeMcpAvailable(profileName, profileOptions, options = {}) {
	const lease = await leaseSession(profileName, profileOptions, options);
	if (lease.temporary) await closeChromeMcpSessionHandle(lease.session);
}
/** Return the cached Chrome MCP process pid for a profile, when present. */
function getChromeMcpPid(profileName) {
	for (const [key, session] of sessions.entries()) if (cacheKeyMatchesProfileName(key, profileName)) return session.transport.pid ?? null;
	return null;
}
/** Close cached Chrome MCP sessions for one profile. */
async function closeChromeMcpSession(profileName) {
	return await closeChromeMcpSessionsForProfile(profileName);
}
/** Close every cached Chrome MCP session. */
async function stopAllChromeMcpSessions() {
	const names = uniqueStrings([...sessions.keys()].map((key) => JSON.parse(key)[0]));
	for (const name of names) await closeChromeMcpSession(name).catch(() => {});
}
/** List raw Chrome MCP pages for a profile. */
async function listChromeMcpPages(profileName, profileOptions, options = {}) {
	return extractStructuredPages(await callTool(profileName, profileOptions, "list_pages", {}, options));
}
/** List Chrome MCP pages converted to BrowserTab records. */
async function listChromeMcpTabs(profileName, profileOptions, options = {}) {
	return toBrowserTabs(await listChromeMcpPages(profileName, profileOptions, options));
}
/** Open a new Chrome MCP tab and navigate it to the requested URL. */
async function openChromeMcpTab(profileName, url, profileOptions) {
	const targetUrl = url.trim() || "about:blank";
	const pages = extractStructuredPages(await callTool(profileName, profileOptions, "new_page", {
		url: "about:blank",
		timeout: CHROME_MCP_NEW_PAGE_TIMEOUT_MS
	}));
	const chosen = pages.find((page) => page.selected) ?? pages.at(-1);
	if (!chosen) throw new Error("Chrome MCP did not return the created page.");
	const targetId = String(chosen.id);
	return {
		targetId,
		title: "",
		url: targetUrl === "about:blank" ? chosen.url ?? targetUrl : (await navigateChromeMcpPage({
			profileName,
			profile: typeof profileOptions === "string" ? void 0 : profileOptions,
			userDataDir: typeof profileOptions === "string" ? profileOptions : void 0,
			targetId,
			url: targetUrl,
			timeoutMs: CHROME_MCP_NAVIGATE_TIMEOUT_MS
		})).url,
		type: "page"
	};
}
/** Bring a Chrome MCP page to the foreground. */
async function focusChromeMcpTab(profileName, targetId, profileOptions) {
	await callTool(profileName, profileOptions, "select_page", {
		pageId: parsePageId(targetId),
		bringToFront: true
	});
}
/** Close a Chrome MCP page by target id. */
async function closeChromeMcpTab(profileName, targetId, profileOptions) {
	await callTool(profileName, profileOptions, "close_page", { pageId: parsePageId(targetId) });
}
/** Navigate a Chrome MCP page and return its resolved URL. */
async function navigateChromeMcpPage(params) {
	const resolvedTimeoutMs = params.timeoutMs ?? CHROME_MCP_NAVIGATE_TIMEOUT_MS;
	const callTimeoutMs = resolveChromeMcpNavigateCallTimeoutMs(resolvedTimeoutMs);
	await callTool(params.profileName, chromeMcpProfileOptionsFromParams(params), "navigate_page", {
		pageId: parsePageId(params.targetId),
		type: "url",
		url: params.url,
		timeout: resolvedTimeoutMs
	}, { timeoutMs: callTimeoutMs });
	return { url: (await findPageById(params.profileName, parsePageId(params.targetId), chromeMcpProfileOptionsFromParams(params))).url ?? params.url };
}
/** Add call-level grace around the MCP navigate timeout. */
function resolveChromeMcpNavigateCallTimeoutMs(timeoutMs) {
	return addTimerTimeoutGraceMs(timeoutMs) ?? 1;
}
/** Take a structured Chrome MCP snapshot for one page. */
async function takeChromeMcpSnapshot(params) {
	return extractSnapshot(await callTool(params.profileName, chromeMcpProfileOptionsFromParams(params), "take_snapshot", { pageId: parsePageId(params.targetId) }, { timeoutMs: params.timeoutMs }));
}
/** Take a screenshot via Chrome MCP and return the image bytes. */
async function takeChromeMcpScreenshot(params) {
	return await withTempFile(async (filePath) => {
		const format = params.format ?? "png";
		await callTool(params.profileName, chromeMcpProfileOptionsFromParams(params), "take_screenshot", {
			pageId: parsePageId(params.targetId),
			filePath,
			format,
			...params.uid ? { uid: params.uid } : {},
			...params.fullPage ? { fullPage: true } : {}
		}, { timeoutMs: params.timeoutMs });
		return await fs.readFile(`${filePath}.${format}`);
	});
}
/** Click a Chrome MCP snapshot element by uid. */
async function clickChromeMcpElement(params) {
	await callTool(params.profileName, chromeMcpProfileOptionsFromParams(params), "click", {
		pageId: parsePageId(params.targetId),
		uid: params.uid,
		...params.doubleClick ? { dblClick: true } : {}
	}, {
		timeoutMs: params.timeoutMs,
		signal: params.signal
	});
}
/** Dispatch mouse events at page coordinates through an in-page script. */
async function clickChromeMcpCoords(params) {
	const button = params.button ?? "left";
	const buttonCode = button === "middle" ? 1 : button === "right" ? 2 : 0;
	const pressedButtons = button === "middle" ? 4 : button === "right" ? 2 : 1;
	const x = JSON.stringify(params.x);
	const y = JSON.stringify(params.y);
	const delayMs = JSON.stringify(resolveNonNegativeIntegerOption(params.delayMs, 0));
	const doubleClick = params.doubleClick ? "true" : "false";
	await evaluateChromeMcpScript({
		profileName: params.profileName,
		profile: params.profile,
		userDataDir: params.userDataDir,
		targetId: params.targetId,
		fn: `async () => {
      const x = ${x};
      const y = ${y};
      const delayMs = ${delayMs};
      const doubleClick = ${doubleClick};
      const target = document.elementFromPoint(x, y) ?? document.body ?? document.documentElement ?? document;
      const base = {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: x,
        clientY: y,
        screenX: window.screenX + x,
        screenY: window.screenY + y,
        button: ${buttonCode},
      };
      const pressedButtons = ${pressedButtons};
      const dispatch = (type, buttons, detail) => {
        target.dispatchEvent(new MouseEvent(type, { ...base, buttons, detail }));
      };
      dispatch("mousemove", 0, 0);
      dispatch("mousedown", pressedButtons, 1);
      if (delayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
      dispatch("mouseup", 0, 1);
      dispatch("click", 0, 1);
      if (doubleClick) {
        dispatch("mousedown", pressedButtons, 2);
        dispatch("mouseup", 0, 2);
        dispatch("click", 0, 2);
        dispatch("dblclick", 0, 2);
      }
      return true;
    }`
	});
}
/** Fill one Chrome MCP element by uid. */
async function fillChromeMcpElement(params) {
	await callTool(params.profileName, chromeMcpProfileOptionsFromParams(params), "fill", {
		pageId: parsePageId(params.targetId),
		uid: params.uid,
		value: params.value
	});
}
/** Fill multiple Chrome MCP form elements in one tool call. */
async function fillChromeMcpForm(params) {
	await callTool(params.profileName, chromeMcpProfileOptionsFromParams(params), "fill_form", {
		pageId: parsePageId(params.targetId),
		elements: params.elements
	});
}
/** Hover a Chrome MCP snapshot element by uid. */
async function hoverChromeMcpElement(params) {
	await callTool(params.profileName, chromeMcpProfileOptionsFromParams(params), "hover", {
		pageId: parsePageId(params.targetId),
		uid: params.uid
	});
}
/** Drag between two Chrome MCP snapshot element uids. */
async function dragChromeMcpElement(params) {
	await callTool(params.profileName, chromeMcpProfileOptionsFromParams(params), "drag", {
		pageId: parsePageId(params.targetId),
		from_uid: params.fromUid,
		to_uid: params.toUid
	});
}
/** Upload a local file into a Chrome MCP file input by uid. */
async function uploadChromeMcpFile(params) {
	await callTool(params.profileName, chromeMcpProfileOptionsFromParams(params), "upload_file", {
		pageId: parsePageId(params.targetId),
		uid: params.uid,
		filePath: params.filePath
	});
}
/** Press a keyboard key in a Chrome MCP page. */
async function pressChromeMcpKey(params) {
	await callTool(params.profileName, chromeMcpProfileOptionsFromParams(params), "press_key", {
		pageId: parsePageId(params.targetId),
		key: params.key
	});
}
/** Resize a Chrome MCP page viewport. */
async function resizeChromeMcpPage(params) {
	await callTool(params.profileName, chromeMcpProfileOptionsFromParams(params), "resize_page", {
		pageId: parsePageId(params.targetId),
		width: params.width,
		height: params.height
	});
}
/** Evaluate a JavaScript function in a Chrome MCP page. */
async function evaluateChromeMcpScript(params) {
	return extractJsonMessage(await callTool(params.profileName, chromeMcpProfileOptionsFromParams(params), "evaluate_script", {
		pageId: parsePageId(params.targetId),
		function: params.fn,
		...params.args?.length ? { args: params.args } : {}
	}));
}
/** Replace Chrome MCP session creation for focused tests. */
function setChromeMcpSessionFactoryForTest(factory) {
	sessionFactory = factory;
}
/** Replace process cleanup hooks for focused tests. */
function setChromeMcpProcessCleanupDepsForTest(deps) {
	chromeMcpProcessCleanupDepsForTest = deps;
}
/** Reset cached sessions and test hooks. */
async function resetChromeMcpSessionsForTest() {
	sessionFactory = null;
	for (const pending of pendingSessions.values()) abortPendingChromeMcpSession(pending, /* @__PURE__ */ new Error("Chrome MCP sessions reset for test"));
	pendingSessions.clear();
	await stopAllChromeMcpSessions();
	chromeMcpProcessCleanupDepsForTest = null;
}
function toLintErrorObject(value, fallbackMessage) {
	if (value instanceof Error) return value;
	if (typeof value === "string") return new Error(value);
	const error = new Error(fallbackMessage, { cause: value });
	if (typeof value === "object" && value !== null || typeof value === "function") Object.assign(error, value);
	return error;
}
//#endregion
export { setChromeMcpSessionFactoryForTest as C, uploadChromeMcpFile as D, takeChromeMcpSnapshot as E, setChromeMcpProcessCleanupDepsForTest as S, takeChromeMcpScreenshot as T, openChromeMcpTab as _, decodeChromeMcpStderrTail as a, resizeChromeMcpPage as b, evaluateChromeMcpScript as c, focusChromeMcpTab as d, getChromeMcpPid as f, navigateChromeMcpPage as g, listChromeMcpTabs as h, closeChromeMcpTab as i, fillChromeMcpElement as l, listChromeMcpPages as m, clickChromeMcpElement as n, dragChromeMcpElement as o, hoverChromeMcpElement as p, closeChromeMcpSession as r, ensureChromeMcpAvailable as s, clickChromeMcpCoords as t, fillChromeMcpForm as u, pressChromeMcpKey as v, stopAllChromeMcpSessions as w, resolveChromeMcpNavigateCallTimeoutMs as x, resetChromeMcpSessionsForTest as y };
