import { t as formatCliCommand } from "./command-format-2N79m0dg.js";
import { m as resolveUserPath, s as ensureDir } from "./utils-BApvfmPs.js";
import { n as VERSION } from "./version-CeFj_iGk.js";
import { d as toPinoLikeLogger, r as getChildLogger } from "./logger-ByU25eYB.js";
import { s as success, t as danger } from "./globals-BWmHKFNH.js";
import { n as createHttp1EnvHttpProxyAgent, r as createHttp1ProxyAgent } from "./undici-runtime-BfllGx-h.js";
import { n as createNodeProxyAgent } from "./node-proxy-agent-CWnkEd0Y.js";
import "./media-runtime-BGWQwoXi.js";
import { t as renderQrTerminal } from "./qr-terminal-zFHurnm4.js";
import "./runtime-env-oOti2yy7.js";
import "./text-utility-runtime-hurZUKRN.js";
import "./fetch-runtime-BGAisVPC.js";
import "./cli-runtime-Comrp7kq.js";
import { o as resolveWebCredsBackupPath, s as resolveWebCredsPath, t as assertWebCredsPathRegularFileOrMissing } from "./creds-files-B4KulFy1.js";
import { n as getStatusCode } from "./session-errors-CbsoQqoy.js";
import { t as DEFAULT_WHATSAPP_SOCKET_TIMING } from "./socket-timing-Fw8AJE9F.js";
import { C as waitForCredsSaveQueueWithTimeout, T as writeWebCredsRawAtomically, l as readCredsJsonRaw, v as resolveDefaultWebAuthDir, w as writeCredsJsonAtomically, x as enqueueCredsSave, y as restoreCredsFromBackupIfNeeded } from "./auth-store-BERBvAOr.js";
import { l as fetchLatestBaileysVersion, n as useMultiFileAuthState, r as makeCacheableSignalKeyStore, t as makeWASocket } from "./session.runtime-1AU-NIKD.js";
import { randomUUID } from "node:crypto";
//#region extensions/whatsapp/src/session.ts
const LOGGED_OUT_STATUS = 401;
const WHATSAPP_WEBSOCKET_PROXY_TARGET = "https://mmg.whatsapp.net/";
const CREDS_FLUSH_TIMEOUT_MESSAGE = "Queued WhatsApp creds save did not finish before auth bootstrap; skipping repair and continuing with primary creds.";
async function rejectUnsafeWebCredsPath(authDir) {
	await assertWebCredsPathRegularFileOrMissing(resolveWebCredsPath(authDir));
}
function enqueueSaveCreds(authDir, saveCreds, logger) {
	enqueueCredsSave(authDir, () => safeSaveCreds(authDir, saveCreds, logger), (err) => {
		logger.warn({ error: String(err) }, "WhatsApp creds save queue error");
	});
}
async function safeSaveCreds(authDir, saveCreds, logger) {
	try {
		const credsPath = resolveWebCredsPath(authDir);
		const backupPath = resolveWebCredsBackupPath(authDir);
		const raw = readCredsJsonRaw(credsPath);
		if (raw) try {
			JSON.parse(raw);
			await writeWebCredsRawAtomically({
				filePath: backupPath,
				content: raw,
				tempPrefix: ".creds.backup"
			});
		} catch {}
	} catch {}
	try {
		await Promise.resolve(saveCreds());
	} catch (err) {
		logger.warn({ error: String(err) }, "failed saving WhatsApp creds");
	}
}
async function printTerminalQr(qr) {
	const output = await renderQrTerminal(qr, { small: true });
	process.stdout.write(output.endsWith("\n") ? output : `${output}\n`);
}
/**
* Create a Baileys socket backed by the multi-file auth store we keep on disk.
* Consumers can opt into QR printing for interactive login flows.
*/
async function createWaSocket(printQr, verbose, opts = {}) {
	const logger = toPinoLikeLogger(getChildLogger({ module: "baileys" }, { level: verbose ? "info" : "silent" }), verbose ? "info" : "silent");
	const authDir = resolveUserPath(opts.authDir ?? resolveDefaultWebAuthDir());
	await rejectUnsafeWebCredsPath(authDir);
	await ensureDir(authDir);
	const sessionLogger = getChildLogger({ module: "web-session" });
	if (await waitForCredsSaveQueueWithTimeout(authDir) === "timed_out") sessionLogger.warn({ authDir }, CREDS_FLUSH_TIMEOUT_MESSAGE);
	else {
		await rejectUnsafeWebCredsPath(authDir);
		await restoreCredsFromBackupIfNeeded(authDir);
	}
	await rejectUnsafeWebCredsPath(authDir);
	const { state } = await useMultiFileAuthState(authDir);
	const saveCreds = async () => {
		await writeCredsJsonAtomically(authDir, state.creds);
	};
	const { version } = await fetchLatestBaileysVersion();
	const agent = await resolveEnvProxyAgent(sessionLogger);
	const fetchAgent = await resolveEnvFetchDispatcher(sessionLogger, agent);
	const socketTiming = {
		keepAliveIntervalMs: opts.keepAliveIntervalMs ?? DEFAULT_WHATSAPP_SOCKET_TIMING.keepAliveIntervalMs,
		connectTimeoutMs: opts.connectTimeoutMs ?? DEFAULT_WHATSAPP_SOCKET_TIMING.connectTimeoutMs,
		defaultQueryTimeoutMs: opts.defaultQueryTimeoutMs ?? DEFAULT_WHATSAPP_SOCKET_TIMING.defaultQueryTimeoutMs
	};
	const sock = makeWASocket({
		auth: {
			creds: state.creds,
			keys: makeCacheableSignalKeyStore(state.keys, logger)
		},
		version,
		logger,
		printQRInTerminal: false,
		browser: [
			"openclaw",
			"cli",
			VERSION
		],
		syncFullHistory: false,
		markOnlineOnConnect: false,
		...socketTiming,
		agent,
		fetchAgent,
		...opts.getMessage ? { getMessage: opts.getMessage } : {},
		...opts.cachedGroupMetadata ? { cachedGroupMetadata: opts.cachedGroupMetadata } : {}
	});
	sock.ev.on("creds.update", () => enqueueSaveCreds(authDir, saveCreds, sessionLogger));
	sock.ev.on("connection.update", (update) => {
		(async () => {
			try {
				const { connection, lastDisconnect, qr } = update;
				if (qr) {
					opts.onQr?.(qr);
					if (printQr) {
						console.log("Open the WhatsApp app, go to Linked Devices, then scan this QR:");
						printTerminalQr(qr).catch((err) => {
							sessionLogger.warn({ error: String(err) }, "failed rendering WhatsApp QR");
						});
					}
				}
				if (connection === "close") {
					if (getStatusCode(lastDisconnect?.error) === LOGGED_OUT_STATUS) console.error(danger(`WhatsApp session logged out. Run: ${formatCliCommand("openclaw channels login")}`));
				}
				if (connection === "open" && verbose) console.log(success("WhatsApp Web connected."));
			} catch (err) {
				sessionLogger.error({ error: String(err) }, "connection.update handler error");
			}
		})();
	});
	if (sock.ws && typeof sock.ws.on === "function") sock.ws.on("error", (err) => {
		sessionLogger.error({ error: String(err) }, "WebSocket error");
	});
	if (process.env.OPENCLAW_DEV_MODE === "1" && process.env.OPENCLAW_DEV_MODE_WA_SAVE_MESSAGES === "1") try {
		const { attachWaHistoryLogger } = await import("./openclaw-whatsapp-claw-ChWPTFf3.js");
		attachWaHistoryLogger(sock);
	} catch (err) {
		console.error("[dev-mode] attachWaHistoryLogger failed:", err instanceof Error ? err.message : String(err));
	}
	return sock;
}
async function resolveEnvProxyAgent(logger) {
	try {
		const agent = createNodeProxyAgent({
			mode: "env",
			targetUrl: WHATSAPP_WEBSOCKET_PROXY_TARGET,
			protocol: "https"
		});
		if (!agent) return;
		logger.info("Using ambient env proxy for WhatsApp WebSocket connection");
		return agent;
	} catch (error) {
		logger.warn({ error: String(error) }, "Failed to initialize env proxy agent for WhatsApp WebSocket connection");
		return;
	}
}
async function resolveEnvFetchDispatcher(logger, agent) {
	const proxyUrl = resolveProxyUrlFromAgent(agent);
	const envProxyUrl = resolveEnvHttpsProxyUrl();
	if (!proxyUrl && !envProxyUrl) return;
	try {
		return proxyUrl ? createHttp1ProxyAgent({ uri: proxyUrl }) : createHttp1EnvHttpProxyAgent();
	} catch (error) {
		logger.warn({ error: String(error) }, "Failed to initialize env proxy dispatcher for WhatsApp media uploads");
		return;
	}
}
function resolveProxyUrlFromAgent(agent) {
	if (typeof agent === "object" && agent !== null && "getProxyForUrl" in agent && typeof agent.getProxyForUrl === "function") {
		const proxyUrl = agent.getProxyForUrl(WHATSAPP_WEBSOCKET_PROXY_TARGET);
		return typeof proxyUrl === "string" && proxyUrl.length > 0 ? proxyUrl : void 0;
	}
	if (typeof agent !== "object" || agent === null || !("proxy" in agent)) return;
	const proxy = agent.proxy;
	if (proxy instanceof URL) return proxy.toString();
	return typeof proxy === "string" && proxy.length > 0 ? proxy : void 0;
}
function resolveEnvHttpsProxyUrl(env = process.env) {
	const lowerHttpsProxy = normalizeEnvProxyValue(env.https_proxy);
	const lowerHttpProxy = normalizeEnvProxyValue(env.http_proxy);
	const httpsProxy = lowerHttpsProxy !== void 0 ? lowerHttpsProxy : normalizeEnvProxyValue(env.HTTPS_PROXY);
	const httpProxy = lowerHttpProxy !== void 0 ? lowerHttpProxy : normalizeEnvProxyValue(env.HTTP_PROXY);
	return httpsProxy ?? httpProxy ?? void 0;
}
function normalizeEnvProxyValue(value) {
	if (typeof value !== "string") return;
	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : null;
}
async function waitForWaConnection(sock, options = { timeout: "none" }) {
	return new Promise((resolve, reject) => {
		const evWithOff = sock.ev;
		let timer;
		const cleanup = () => {
			evWithOff.off?.("connection.update", handler);
			if (timer) {
				clearTimeout(timer);
				timer = void 0;
			}
		};
		const handler = (...args) => {
			const update = args[0] ?? {};
			if (update.connection === "open") {
				cleanup();
				resolve();
			}
			if (update.connection === "close") {
				cleanup();
				reject(toLintErrorObject(update.lastDisconnect ?? /* @__PURE__ */ new Error("Connection closed"), "Non-Error rejection"));
			}
		};
		sock.ev.on("connection.update", handler);
		if ("timeoutMs" in options) {
			const timeoutMs = options.timeoutMs;
			timer = setTimeout(() => {
				cleanup();
				reject(createConnectionTimeoutError(timeoutMs));
			}, timeoutMs);
			timer.unref?.();
		}
	});
}
function newConnectionId() {
	return randomUUID();
}
function toLintErrorObject(value, fallbackMessage) {
	if (value instanceof Error) return value;
	if (typeof value === "string") return new Error(value);
	const error = new Error(fallbackMessage, { cause: value });
	if (typeof value === "object" && value !== null || typeof value === "function") Object.assign(error, value);
	return error;
}
function createConnectionTimeoutError(timeoutMs) {
	const error = /* @__PURE__ */ new Error(`WhatsApp connection timed out after ${timeoutMs}ms`);
	Object.assign(error, { output: { statusCode: 408 } });
	return error;
}
//#endregion
export { newConnectionId as n, waitForWaConnection as r, createWaSocket as t };
