import { a as readWebCredsJsonRawSync, o as resolveWebCredsBackupPath, s as resolveWebCredsPath, t as assertWebCredsPathRegularFileOrMissing } from "./creds-files-B8WcOAmE.mjs";
import { M as writeCredsJsonAtomically, N as writeWebCredsRawAtomically, j as waitForCredsSaveQueueWithTimeout, k as enqueueCredsSave, v as resolveDefaultWebAuthDir, y as restoreCredsFromBackupIfNeeded } from "./auth-store-D2rN-hP5.mjs";
import { n as getStatusCode } from "./session-errors-B8UcAnZN.mjs";
import { a as makeWASocket, i as makeCacheableSignalKeyStore, n as createBaileysSignalRepository, r as fetchLatestBaileysVersion, s as useMultiFileAuthState } from "./session.runtime-st1konFI.mjs";
import { VERSION, formatCliCommand } from "openclaw/plugin-sdk/cli-runtime";
import { toErrorObject } from "openclaw/plugin-sdk/error-runtime";
import { computeBackoff, danger, getChildLogger, sleepWithAbort, sleepWithAbort as sleepWithAbort$1, success, toPinoLikeLogger } from "openclaw/plugin-sdk/runtime-env";
import { renderQrTerminal } from "openclaw/plugin-sdk/media-runtime";
import { clamp, ensureDir, resolveUserPath } from "openclaw/plugin-sdk/text-utility-runtime";
import fs from "node:fs/promises";
import { KeyedAsyncQueue } from "openclaw/plugin-sdk/keyed-async-queue";
import { parseStrictPositiveInteger, resolveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
import { raceWithTimeout, withTimeout } from "openclaw/plugin-sdk/time-runtime";
import { createDeferred } from "openclaw/plugin-sdk/extension-shared";
import { FILE_LOCK_STALE_ERROR_CODE, FILE_LOCK_TIMEOUT_ERROR_CODE, acquireFileLock } from "openclaw/plugin-sdk/file-lock";
import { createNodeProxyAgent } from "openclaw/plugin-sdk/fetch-runtime";
import { randomUUID } from "node:crypto";
//#region extensions/whatsapp/src/connection-owner.ts
const WHATSAPP_CONNECTION_OWNER_BUSY_CODE = "whatsapp_connection_owner_busy";
var WhatsAppConnectionOwnerBusyError = class extends Error {
	constructor(authDir, options) {
		super("Another process owns this WhatsApp connection.", options);
		this.authDir = authDir;
		this.code = WHATSAPP_CONNECTION_OWNER_BUSY_CODE;
		this.name = "WhatsAppConnectionOwnerBusyError";
	}
};
const OWNER_LOCK_STALE_MS = 3e5;
const GATEWAY_LOCAL_OWNER_WAIT_MS = 15e4;
const processOwners = /* @__PURE__ */ new Map();
function ownershipCancelledError(signal) {
	const reason = signal?.reason;
	return reason instanceof Error ? reason : new Error("WhatsApp connection ownership cancelled", reason === void 0 ? {} : { cause: reason });
}
async function reserveProcessOwner(params) {
	while (true) {
		if (params.signal?.aborted) throw ownershipCancelledError(params.signal);
		const current = processOwners.get(params.ownerPath);
		if (!current) {
			const released = createDeferred();
			const owner = {
				released: released.promise,
				resolveReleased: released.resolve,
				token: Symbol(params.ownerPath)
			};
			processOwners.set(params.ownerPath, owner);
			return owner;
		}
		if (!params.waitForLocalOwner) throw new WhatsAppConnectionOwnerBusyError(params.authDir);
		let timer;
		let onAbort;
		const outcome = await Promise.race([
			current.released.then(() => "released"),
			new Promise((resolve) => {
				timer = setTimeout(() => resolve("timed_out"), GATEWAY_LOCAL_OWNER_WAIT_MS);
				timer.unref?.();
			}),
			new Promise((resolve) => {
				onAbort = () => resolve("aborted");
				params.signal?.addEventListener("abort", onAbort, { once: true });
			})
		]).finally(() => {
			if (timer) clearTimeout(timer);
			if (onAbort) params.signal?.removeEventListener("abort", onAbort);
		});
		if (outcome === "aborted") throw ownershipCancelledError(params.signal);
		if (outcome === "timed_out") throw new WhatsAppConnectionOwnerBusyError(params.authDir);
	}
}
function abandonProcessOwner(ownerPath, owner) {
	if (processOwners.get(ownerPath)?.token !== owner.token) return;
	processOwners.delete(ownerPath);
	owner.resolveReleased();
}
async function acquireOwnerLease(params) {
	const resolvedOwnerPath = resolveUserPath(params.authDir);
	await fs.mkdir(resolvedOwnerPath, { recursive: true });
	const ownerPath = await fs.realpath(resolvedOwnerPath);
	const processOwner = await reserveProcessOwner({
		authDir: params.authDir,
		ownerPath,
		signal: params.signal,
		waitForLocalOwner: params.waitForLocalOwner
	});
	let fileLock;
	let attempt = 0;
	while (true) {
		if (params.signal?.aborted) {
			abandonProcessOwner(ownerPath, processOwner);
			throw ownershipCancelledError(params.signal);
		}
		try {
			fileLock = await acquireFileLock(ownerPath, {
				retries: {
					retries: 0,
					factor: 1,
					minTimeout: 1,
					maxTimeout: 1
				},
				stale: OWNER_LOCK_STALE_MS,
				staleRecovery: "remove-if-unchanged"
			});
			break;
		} catch (error) {
			const code = error.code;
			if (code === FILE_LOCK_STALE_ERROR_CODE) {
				abandonProcessOwner(ownerPath, processOwner);
				throw new WhatsAppConnectionOwnerBusyError(params.authDir, { cause: error });
			}
			if (code !== FILE_LOCK_TIMEOUT_ERROR_CODE || attempt >= params.retries) {
				abandonProcessOwner(ownerPath, processOwner);
				if (code === FILE_LOCK_TIMEOUT_ERROR_CODE) throw new WhatsAppConnectionOwnerBusyError(params.authDir, { cause: error });
				throw error;
			}
			const delayMs = Math.min(100 * 1.5 ** attempt, 1e3);
			attempt += 1;
			await sleepWithAbort(delayMs, params.signal).catch(() => {
				abandonProcessOwner(ownerPath, processOwner);
				throw ownershipCancelledError(params.signal);
			});
		}
	}
	let releasePromise = null;
	return { release: async () => {
		if (!releasePromise) releasePromise = fileLock.release().then(() => {
			abandonProcessOwner(ownerPath, processOwner);
		}).catch((releaseError) => {
			releasePromise = null;
			throw releaseError;
		});
		await releasePromise;
	} };
}
/** Gateway owner waits for a bounded standalone lookup to finish before startup. */
async function acquireWhatsAppGatewayConnectionOwner(authDir, signal) {
	return await acquireOwnerLease({
		authDir,
		retries: 150,
		signal,
		waitForLocalOwner: true
	});
}
/** Standalone lookup fails quickly when a gateway already owns the account. */
async function acquireWhatsAppStandaloneConnectionOwner(authDir) {
	return await acquireOwnerLease({
		authDir,
		retries: 3,
		waitForLocalOwner: false
	});
}
//#endregion
//#region extensions/whatsapp/src/socket-timing.ts
const socketSendMessageQueues = /* @__PURE__ */ new WeakMap();
const DEFAULT_WHATSAPP_SOCKET_TIMING = {
	keepAliveIntervalMs: 25e3,
	connectTimeoutMs: 6e4,
	defaultQueryTimeoutMs: 6e4
};
var WhatsAppSocketOperationTimeoutError = class extends Error {
	constructor(operation, timeoutMs) {
		super(`WhatsApp socket ${operation} timed out after ${timeoutMs}ms; delivery state is unknown`);
		this.operation = operation;
		this.timeoutMs = timeoutMs;
		this.deliveryState = "unknown";
		this.name = "WhatsAppSocketOperationTimeoutError";
	}
};
function resolveWhatsAppSocketTiming(overrides) {
	return {
		keepAliveIntervalMs: parseStrictPositiveInteger(overrides?.keepAliveIntervalMs) ?? DEFAULT_WHATSAPP_SOCKET_TIMING.keepAliveIntervalMs,
		connectTimeoutMs: parseStrictPositiveInteger(overrides?.connectTimeoutMs) ?? DEFAULT_WHATSAPP_SOCKET_TIMING.connectTimeoutMs,
		defaultQueryTimeoutMs: parseStrictPositiveInteger(overrides?.defaultQueryTimeoutMs) ?? DEFAULT_WHATSAPP_SOCKET_TIMING.defaultQueryTimeoutMs
	};
}
function isWhatsAppSocketOperationTimeoutError(error) {
	return error instanceof WhatsAppSocketOperationTimeoutError;
}
function resolveWhatsAppSocketOperationTimeoutMs(timeoutMs) {
	return resolveTimerTimeoutMs(timeoutMs, DEFAULT_WHATSAPP_SOCKET_TIMING.defaultQueryTimeoutMs);
}
function runSerializedSocketSendMessage(sock, run) {
	let queue = socketSendMessageQueues.get(sock);
	if (!queue) {
		queue = new KeyedAsyncQueue();
		socketSendMessageQueues.set(sock, queue);
	}
	return queue.enqueue("sendMessage", run);
}
async function withWhatsAppSocketOperationTimeout(operation, promise, timeoutMs, onTimeout) {
	const resolvedTimeoutMs = resolveWhatsAppSocketOperationTimeoutMs(timeoutMs);
	return await raceWithTimeout(promise, resolvedTimeoutMs, () => {
		onTimeout?.();
		throw new WhatsAppSocketOperationTimeoutError(operation, resolvedTimeoutMs);
	}, { ref: false });
}
function createWhatsAppSocketOperationTimeoutAdapter(sock, timeoutMs, hooks) {
	const operationTimeoutMs = resolveWhatsAppSocketOperationTimeoutMs(timeoutMs);
	return {
		sendMessage: (jid, content, options) => {
			return runSerializedSocketSendMessage(sock, () => {
				const send = options ? sock.sendMessage(jid, content, options) : sock.sendMessage(jid, content);
				return withWhatsAppSocketOperationTimeout("sendMessage", send, operationTimeoutMs, hooks?.onSendMessageTimeout ? () => hooks.onSendMessageTimeout?.({
					jid,
					promise: send
				}) : void 0);
			});
		},
		sendPresenceUpdate: (presence, jid) => {
			return withWhatsAppSocketOperationTimeout("sendPresenceUpdate", jid === void 0 ? sock.sendPresenceUpdate(presence) : sock.sendPresenceUpdate(presence, jid), operationTimeoutMs);
		}
	};
}
//#endregion
//#region extensions/whatsapp/src/reconnect.ts
const DEFAULT_HEARTBEAT_SECONDS = 60;
const DEFAULT_RECONNECT_POLICY = {
	initialMs: 2e3,
	maxMs: 3e4,
	factor: 1.8,
	jitter: .25,
	maxAttempts: 12
};
function resolveHeartbeatSeconds(overrideSeconds) {
	if (typeof overrideSeconds === "number" && overrideSeconds > 0) return overrideSeconds;
	return DEFAULT_HEARTBEAT_SECONDS;
}
function resolveReconnectPolicy(overrides) {
	const merged = {
		...DEFAULT_RECONNECT_POLICY,
		...overrides
	};
	merged.initialMs = Math.max(250, merged.initialMs);
	merged.maxMs = Math.max(merged.initialMs, merged.maxMs);
	merged.factor = clamp(merged.factor, 1.1, 10);
	merged.jitter = clamp(merged.jitter, 0, 1);
	merged.maxAttempts = Math.max(0, Math.floor(merged.maxAttempts));
	return merged;
}
function newConnectionId() {
	return randomUUID();
}
//#endregion
//#region extensions/whatsapp/src/session.ts
const LOGGED_OUT_STATUS = 401;
const WHATSAPP_WEBSOCKET_PROXY_TARGET = "https://mmg.whatsapp.net/";
const CREDS_FLUSH_TIMEOUT_MESSAGE = "Queued WhatsApp creds save did not finish before auth bootstrap; skipping repair and continuing with primary creds.";
const OPENCLAW_WHATSAPP_WEB_SOCKET_URL_ENV = "OPENCLAW_WHATSAPP_WEB_SOCKET_URL";
async function rejectUnsafeWebCredsPath(authDir) {
	await assertWebCredsPathRegularFileOrMissing(resolveWebCredsPath(authDir));
}
async function safeSaveCreds(params) {
	let backup;
	try {
		const credsPath = resolveWebCredsPath(params.authDir);
		const backupPath = resolveWebCredsBackupPath(params.authDir);
		const raw = readWebCredsJsonRawSync(credsPath);
		if (raw) try {
			JSON.parse(raw);
			backup = {
				content: raw,
				filePath: backupPath
			};
		} catch {}
	} catch {}
	if (backup) {
		await params.beforeCredentialPersistence?.();
		try {
			await writeWebCredsRawAtomically({
				filePath: backup.filePath,
				content: backup.content,
				tempPrefix: ".creds.backup"
			});
		} catch {}
	}
	await params.beforeCredentialPersistence?.();
	try {
		await Promise.resolve(params.saveCreds());
	} catch (err) {
		params.logger.warn({ error: String(err) }, "failed saving WhatsApp creds");
		if (params.beforeCredentialPersistence) throw err;
	}
}
function abortSocketAfterCredentialPersistenceFailure(sock, error) {
	const failure = error instanceof Error ? error : /* @__PURE__ */ new Error("WhatsApp credential persistence rejected");
	const closeWebSocket = () => {
		try {
			sock.ws?.close?.();
		} catch {}
	};
	try {
		sock.end(failure).catch(closeWebSocket);
	} catch {
		closeWebSocket();
	}
}
async function printTerminalQr(qr) {
	const output = await renderQrTerminal(qr, { small: true });
	process.stdout.write(output.endsWith("\n") ? output : `${output}\n`);
}
function resolveWaWebSocketUrl(value) {
	if (typeof value !== "string") return value;
	return value.trim() || void 0;
}
function resolveEnvWaWebSocketUrl() {
	const value = resolveWaWebSocketUrl(process.env[OPENCLAW_WHATSAPP_WEB_SOCKET_URL_ENV]);
	if (!value) return;
	let url;
	try {
		url = new URL(value);
	} catch {
		throw new Error(`${OPENCLAW_WHATSAPP_WEB_SOCKET_URL_ENV} must be a valid URL.`);
	}
	if (url.protocol !== "ws:" && url.protocol !== "wss:") throw new Error(`${OPENCLAW_WHATSAPP_WEB_SOCKET_URL_ENV} must use ws:// or wss://.`);
	return url.toString();
}
/**
* Create a Baileys socket backed by the multi-file auth store we keep on disk.
* Consumers can opt into QR printing for interactive login flows.
*/
async function createWaSocket(printQr, verbose, opts = {}) {
	return await createWaSocketInternal(printQr, verbose, opts, "normal");
}
async function createWaSocketInternal(printQr, verbose, opts, receiveMode) {
	const baseLogger = getChildLogger({ module: "baileys" }, { level: verbose ? "info" : "silent" });
	const logger = toPinoLikeLogger(baseLogger, verbose ? "info" : "silent");
	const authDir = resolveUserPath(opts.authDir ?? resolveDefaultWebAuthDir());
	await rejectUnsafeWebCredsPath(authDir);
	await opts.beforeCredentialPersistence?.();
	await ensureDir(authDir);
	const sessionLogger = getChildLogger({ module: "web-session" });
	if (await waitForCredsSaveQueueWithTimeout(authDir) === "timed_out") sessionLogger.warn({ authDir }, CREDS_FLUSH_TIMEOUT_MESSAGE);
	else {
		await rejectUnsafeWebCredsPath(authDir);
		await restoreCredsFromBackupIfNeeded(authDir, { beforeCredentialPersistence: opts.beforeCredentialPersistence });
	}
	await rejectUnsafeWebCredsPath(authDir);
	const { state } = await useMultiFileAuthState(authDir);
	const saveCreds = async () => {
		await writeCredsJsonAtomically(authDir, state.creds);
	};
	const { version } = await fetchLatestBaileysVersion();
	const waWebSocketUrl = resolveWaWebSocketUrl(opts.waWebSocketUrl) ?? resolveEnvWaWebSocketUrl();
	const fetchAgent = createNodeProxyAgent({
		mode: "env",
		protocol: "https"
	});
	const agent = resolveEnvProxyAgent(sessionLogger, WHATSAPP_WEBSOCKET_PROXY_TARGET);
	const socketTiming = {
		keepAliveIntervalMs: opts.keepAliveIntervalMs ?? DEFAULT_WHATSAPP_SOCKET_TIMING.keepAliveIntervalMs,
		connectTimeoutMs: opts.connectTimeoutMs ?? DEFAULT_WHATSAPP_SOCKET_TIMING.connectTimeoutMs,
		defaultQueryTimeoutMs: opts.defaultQueryTimeoutMs ?? DEFAULT_WHATSAPP_SOCKET_TIMING.defaultQueryTimeoutMs
	};
	const socketRef = {};
	let pendingSocketAbort;
	const reportCredentialPersistenceError = (error) => {
		if (socketRef.current) abortSocketAfterCredentialPersistenceFailure(socketRef.current, error);
		else pendingSocketAbort = { error };
		opts.onCredentialPersistenceError?.(error);
	};
	const persistedSignalKeys = opts.beforeCredentialPersistence ? {
		...state.keys,
		async set(data) {
			await opts.beforeCredentialPersistence?.();
			await state.keys.set(data);
		}
	} : state.keys;
	const cachedSignalKeys = makeCacheableSignalKeyStore(persistedSignalKeys, logger);
	const signalKeys = opts.beforeCredentialPersistence ? {
		...cachedSignalKeys,
		get(type, ids) {
			const task = Promise.resolve(cachedSignalKeys.get(type, ids));
			opts.onCredentialPersistenceTask?.(task);
			return task;
		},
		set(data) {
			const task = (async () => {
				try {
					await cachedSignalKeys.set(data);
				} catch (error) {
					reportCredentialPersistenceError(error);
					throw error;
				}
			})();
			opts.onCredentialPersistenceTask?.(task);
			return task;
		}
	} : cachedSignalKeys;
	const makeSignalRepository = opts.onCredentialPersistenceTask ? (...args) => {
		const repository = createBaileysSignalRepository(...args);
		const storeLidPnMappings = repository.lidMapping.storeLIDPNMappings.bind(repository.lidMapping);
		repository.lidMapping.storeLIDPNMappings = (...storeArgs) => {
			const task = storeLidPnMappings(...storeArgs);
			opts.onCredentialPersistenceTask?.(task);
			task.then(void 0, reportCredentialPersistenceError);
			return task;
		};
		const migrateSession = repository.migrateSession.bind(repository);
		repository.migrateSession = (...migrateArgs) => {
			const task = migrateSession(...migrateArgs);
			opts.onCredentialPersistenceTask?.(task);
			task.then(void 0, reportCredentialPersistenceError);
			return task;
		};
		return repository;
	} : void 0;
	const sock = makeWASocket({
		auth: {
			creds: state.creds,
			keys: signalKeys
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
		fireInitQueries: receiveMode !== "directory",
		markOnlineOnConnect: false,
		...socketTiming,
		agent,
		fetchAgent,
		...makeSignalRepository ? { makeSignalRepository } : {},
		...waWebSocketUrl ? { waWebSocketUrl } : {},
		...opts.getMessage ? { getMessage: opts.getMessage } : {},
		...opts.cachedGroupMetadata ? { cachedGroupMetadata: opts.cachedGroupMetadata } : {}
	});
	if (receiveMode === "directory") for (const event of [
		"CB:message",
		"CB:call",
		"CB:receipt",
		"CB:notification",
		"CB:ack,class:message",
		"CB:presence",
		"CB:chatstate",
		"CB:ib,,dirty",
		"CB:ib,,offline_preview",
		"CB:ib,,offline",
		"CB:ib,,edge_routing"
	]) sock.ws.removeAllListeners(event);
	socketRef.current = sock;
	if (pendingSocketAbort) abortSocketAfterCredentialPersistenceFailure(sock, pendingSocketAbort.error);
	sock.ev.on("creds.update", () => enqueueCredsSave(authDir, () => safeSaveCreds({
		authDir,
		saveCreds,
		logger: sessionLogger,
		beforeCredentialPersistence: opts.beforeCredentialPersistence
	}), (err) => {
		sessionLogger.warn({ error: String(err) }, "WhatsApp creds save queue error");
		reportCredentialPersistenceError(err);
	}));
	sock.ev.on("connection.update", (update) => {
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
				agent?.destroy();
				fetchAgent?.destroy();
				if (getStatusCode(lastDisconnect?.error) === LOGGED_OUT_STATUS) console.error(danger(`WhatsApp session logged out. Run: ${formatCliCommand("openclaw channels login")}`));
			}
			if (connection === "open" && verbose) console.log(success("WhatsApp Web connected."));
		} catch (err) {
			sessionLogger.error({ error: String(err) }, "connection.update handler error");
		}
	});
	if (sock.ws && typeof sock.ws.on === "function") sock.ws.on("error", (err) => {
		sessionLogger.error({ error: String(err) }, "WebSocket error");
	});
	if (process.env.OPENCLAW_DEV_MODE === "1" && receiveMode === "normal") try {
		const { attachWaHistoryLogger } = await import("./wa-history-CfXbg--w.mjs");
		attachWaHistoryLogger(sock);
	} catch {}
	return sock;
}
async function createWaDirectorySocket(authDir) {
	return await createWaSocketInternal(false, false, { authDir }, "directory");
}
function resolveEnvProxyAgent(logger, targetUrl) {
	try {
		const agent = createNodeProxyAgent({
			mode: "env",
			targetUrl,
			protocol: "https"
		});
		if (agent) logger.info("Using ambient env proxy for WhatsApp connection");
		return agent;
	} catch (error) {
		logger.warn({ error: String(error) }, "Failed to initialize env proxy agent for WhatsApp connection");
		return;
	}
}
async function waitForWaConnection(sock, options = { timeout: "none" }) {
	return new Promise((resolve, reject) => {
		let timer;
		const cleanup = () => {
			sock.ev.off?.("connection.update", handler);
			if (timer) {
				clearTimeout(timer);
				timer = void 0;
			}
		};
		const handler = (update = {}) => {
			if (update.connection === "open") {
				cleanup();
				resolve();
			}
			if (update.connection === "close") {
				cleanup();
				const disconnectError = update.lastDisconnect?.error ?? update.lastDisconnect;
				reject(toErrorObject(disconnectError ?? /* @__PURE__ */ new Error("Connection closed"), "Non-Error rejection"));
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
function createConnectionTimeoutError(timeoutMs) {
	const error = /* @__PURE__ */ new Error(`WhatsApp connection timed out after ${timeoutMs}ms`);
	Object.assign(error, { output: { statusCode: 408 } });
	return error;
}
//#endregion
//#region extensions/whatsapp/src/socket-close.ts
const SOCKET_CLOSE_TIMEOUT_MS = 15e3;
async function withCloseTimeout(task, operationName) {
	await withTimeout(task, SOCKET_CLOSE_TIMEOUT_MS, { message: `WhatsApp ${operationName} timed out` });
}
async function waitForTransportClose(ws, operation, operationName) {
	let onClose;
	const closed = ws.isClosed ? Promise.resolve() : new Promise((resolve) => {
		onClose = resolve;
		ws.once("close", onClose);
		if (ws.isClosed) onClose();
	});
	try {
		await withCloseTimeout(Promise.all([Promise.resolve(operation), closed]), operationName);
	} finally {
		if (onClose) ws.removeListener("close", onClose);
	}
}
/** Close Baileys and verify the transport state before connection ownership moves. */
async function closeWhatsAppSocketAndWait(sock, reason) {
	const errors = [];
	try {
		const endResult = sock.end(new Error(reason));
		if (sock.ws.isClosed) {
			await waitForTransportClose(sock.ws, endResult, "socket end");
			return;
		}
		if (sock.ws.isClosing) await waitForTransportClose(sock.ws, endResult, "socket end");
		else await withCloseTimeout(Promise.resolve(endResult), "socket end");
	} catch (error) {
		errors.push(error);
	}
	if (sock.ws.isClosed) return;
	try {
		const closeResult = sock.ws.close();
		await waitForTransportClose(sock.ws, closeResult, "WebSocket close");
	} catch (error) {
		errors.push(error);
	}
	if (sock.ws.isClosed) return;
	throw new AggregateError(errors, "WhatsApp socket close could not be confirmed");
}
//#endregion
export { renderQrTerminal as _, DEFAULT_RECONNECT_POLICY as a, acquireWhatsAppStandaloneConnectionOwner as b, resolveHeartbeatSeconds as c, DEFAULT_WHATSAPP_SOCKET_TIMING as d, createWhatsAppSocketOperationTimeoutAdapter as f, withWhatsAppSocketOperationTimeout as g, resolveWhatsAppSocketTiming as h, waitForWaConnection as i, resolveReconnectPolicy as l, resolveWhatsAppSocketOperationTimeoutMs as m, createWaDirectorySocket as n, computeBackoff as o, isWhatsAppSocketOperationTimeoutError as p, createWaSocket as r, newConnectionId as s, closeWhatsAppSocketAndWait as t, sleepWithAbort$1 as u, WhatsAppConnectionOwnerBusyError as v, acquireWhatsAppGatewayConnectionOwner as y };
