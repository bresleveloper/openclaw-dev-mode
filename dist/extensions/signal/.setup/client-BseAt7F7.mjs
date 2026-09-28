import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import net, { createConnection } from "node:net";
import path from "node:path";
import { detectMime, extractOriginalFilename, parseMediaContentLength } from "openclaw/plugin-sdk/media-runtime";
import { parseStrictNonNegativeInteger, resolvePositiveTimerTimeoutMs, resolveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
import { coerceErrorMessage, formatErrorMessage, toErrorObject } from "openclaw/plugin-sdk/error-runtime";
import { resolveFetch } from "openclaw/plugin-sdk/fetch-runtime";
import { readResponseTextPrefix, readResponseWithLimit } from "openclaw/plugin-sdk/response-limit-runtime";
import { readRegularFile } from "openclaw/plugin-sdk/security-runtime";
import { Buffer as Buffer$1 } from "node:buffer";
import http from "node:http";
import https from "node:https";
import { generateSecureUuid } from "openclaw/plugin-sdk/core";
import { randomUUID } from "node:crypto";
import { execFile } from "node:child_process";
import { lstat, mkdir, rmdir, unlink } from "node:fs/promises";
import os from "node:os";
import { promisify } from "node:util";
//#region extensions/signal/src/ws-runtime.ts
const require = createRequire(import.meta.url);
const WebSocket = require(path.join(path.dirname(require.resolve("ws/package.json")), "index.js"));
//#endregion
//#region extensions/signal/src/client-container.ts
/**
* Signal client for bbernhard/signal-cli-rest-api container.
* Uses WebSocket for receiving messages and REST API for sending.
*
* This is a separate implementation from client.ts (native signal-cli)
* to keep the two modes cleanly isolated.
*/
const DEFAULT_TIMEOUT_MS$2 = 1e4;
const DEFAULT_ATTACHMENT_RESPONSE_MAX_BYTES = 1048576;
const SIGNAL_REST_ERROR_RESPONSE_MAX_BYTES = 16384;
const SIGNAL_REST_SUCCESS_RESPONSE_MAX_BYTES = 16777216;
const WS_MAX_PAYLOAD = 1048576;
const WS_HANDSHAKE_MS = 3e4;
const WS_SHUTDOWN_DRAIN_TIMEOUT_MS = 1500;
const DEFAULT_SIGNAL_CONTAINER_MAX_ATTACHMENT_BYTES = 8388608;
const CONTAINER_TEXT_STYLE_MARKERS = {
	BOLD: "**",
	ITALIC: "*",
	STRIKETHROUGH: "~",
	MONOSPACE: "`",
	SPOILER: "||"
};
function normalizeBaseUrl$1(url) {
	const trimmed = url.trim();
	if (!trimmed) throw new Error("Signal base URL is required");
	const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`;
	const parsed = new URL(withProtocol);
	if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error(`Signal base URL unsupported protocol: ${parsed.protocol}`);
	if (parsed.username || parsed.password) throw new Error("Signal base URL must not include credentials");
	const pathname = parsed.pathname === "/" ? "" : parsed.pathname.replace(/\/+$/, "");
	return `${parsed.protocol}//${parsed.host}${pathname}`;
}
var SignalRestTimeoutError = class extends Error {
	constructor() {
		super("Signal REST request timed out");
		this.name = "SignalRestTimeoutError";
	}
};
function signalRestRequestTimeoutError() {
	return new SignalRestTimeoutError();
}
/** Keep one absolute deadline across headers and every bounded body reader. */
async function withSignalRestDeadline(timeoutMs, run) {
	const safeTimeoutMs = resolveTimerTimeoutMs(timeoutMs, DEFAULT_TIMEOUT_MS$2);
	const deadlineAtMs = Date.now() + safeTimeoutMs;
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(signalRestRequestTimeoutError()), safeTimeoutMs);
	timer.unref?.();
	try {
		return await run({
			signal: controller.signal,
			timeoutMs: () => {
				const remainingMs = deadlineAtMs - Date.now();
				if (remainingMs <= 0) throw signalRestRequestTimeoutError();
				return Math.max(1, Math.min(safeTimeoutMs, remainingMs));
			}
		});
	} finally {
		clearTimeout(timer);
	}
}
async function fetchWithTimeout(url, init, timeoutMs) {
	const fetchImpl = resolveFetch();
	if (!fetchImpl) throw new Error("fetch is not available");
	return await withSignalRestDeadline(timeoutMs, async ({ signal }) => fetchImpl(url, {
		...init,
		signal
	}));
}
function normalizeMaxResponseBytes(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return DEFAULT_ATTACHMENT_RESPONSE_MAX_BYTES;
	return Math.floor(value);
}
function readContentLength(res) {
	return parseMediaContentLength(res.headers?.get("content-length") ?? null) ?? void 0;
}
function signalRestIdleTimeoutError({ chunkTimeoutMs }) {
	return /* @__PURE__ */ new Error(`Signal REST response body stalled after ${chunkTimeoutMs}ms`);
}
function signalAttachmentIdleTimeoutError({ chunkTimeoutMs }) {
	return /* @__PURE__ */ new Error(`Signal REST attachment response body stalled after ${chunkTimeoutMs}ms`);
}
async function readSignalRestText(res, bodyIdleTimeoutMs, bodyTimeoutMs) {
	const bytes = await readResponseWithLimit(res, SIGNAL_REST_SUCCESS_RESPONSE_MAX_BYTES, {
		chunkTimeoutMs: bodyIdleTimeoutMs,
		onIdleTimeout: signalRestIdleTimeoutError,
		timeoutMs: bodyTimeoutMs,
		onTimeout: signalRestRequestTimeoutError,
		onOverflow: ({ maxBytes }) => /* @__PURE__ */ new Error(`Signal REST: text response exceeds ${maxBytes} bytes`)
	});
	return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}
async function readSignalRestErrorText(res, bodyIdleTimeoutMs, bodyTimeoutMs) {
	return (await readResponseTextPrefix(res, SIGNAL_REST_ERROR_RESPONSE_MAX_BYTES, {
		chunkTimeoutMs: bodyIdleTimeoutMs,
		onIdleTimeout: signalRestIdleTimeoutError,
		timeoutMs: bodyTimeoutMs,
		onTimeout: signalRestRequestTimeoutError
	})).text;
}
async function readCappedResponseBuffer(res, maxResponseBytes, bodyIdleTimeoutMs, bodyTimeoutMs) {
	const contentLength = readContentLength(res);
	if (contentLength !== void 0 && contentLength > maxResponseBytes) throw new Error("Signal REST attachment exceeded size limit");
	return await readResponseWithLimit(res, maxResponseBytes, {
		chunkTimeoutMs: bodyIdleTimeoutMs,
		onIdleTimeout: signalAttachmentIdleTimeoutError,
		timeoutMs: bodyTimeoutMs,
		onTimeout: signalRestRequestTimeoutError,
		onOverflow: () => /* @__PURE__ */ new Error("Signal REST attachment exceeded size limit")
	});
}
async function releaseUnreadResponseBody(res) {
	if (res?.bodyUsed !== true) await res?.body?.cancel().catch(() => void 0);
}
/**
* Check if bbernhard container REST API is available.
*/
async function containerCheck(baseUrl, timeoutMs = DEFAULT_TIMEOUT_MS$2, account) {
	const normalized = normalizeBaseUrl$1(baseUrl);
	let res;
	try {
		res = await fetchWithTimeout(`${normalized}/v1/about`, { method: "GET" }, timeoutMs);
		if (!res.ok) return {
			ok: false,
			status: res.status,
			error: `HTTP ${res.status}`
		};
		const receiveAccount = account?.trim();
		if (receiveAccount) return await containerReceiveCheck(normalized, receiveAccount, timeoutMs);
		return {
			ok: true,
			status: res.status,
			error: null
		};
	} catch (err) {
		return {
			ok: false,
			status: null,
			error: coerceErrorMessage(err)
		};
	} finally {
		await releaseUnreadResponseBody(res);
	}
}
function containerReceiveCheck(normalizedBaseUrl, account, timeoutMs) {
	const wsUrl = `${normalizedBaseUrl.replace(/^http/, "ws")}/v1/receive/${encodeURIComponent(account)}`;
	return new Promise((resolve) => {
		const safeTimeoutMs = resolveTimerTimeoutMs(timeoutMs, DEFAULT_TIMEOUT_MS$2);
		let settled = false;
		let ws;
		const timer = setTimeout(() => {
			settle({
				ok: false,
				status: null,
				error: "Signal container receive WebSocket timed out"
			});
			ws?.terminate();
		}, safeTimeoutMs);
		timer.unref?.();
		const settle = (result) => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			resolve(result);
		};
		try {
			ws = new WebSocket(wsUrl, { maxPayload: WS_MAX_PAYLOAD });
		} catch (err) {
			settle({
				ok: false,
				status: null,
				error: coerceErrorMessage(err)
			});
			return;
		}
		ws.once("open", () => {
			settle({
				ok: true,
				status: 101,
				error: null
			});
			ws?.close();
		});
		ws.once("unexpected-response", (_request, response) => {
			settle({
				ok: false,
				status: response.statusCode ?? null,
				error: `Signal container receive endpoint did not upgrade to WebSocket (HTTP ${response.statusCode ?? "unknown"})`
			});
			ws?.terminate();
		});
		ws.once("error", (err) => {
			settle({
				ok: false,
				status: null,
				error: coerceErrorMessage(err)
			});
		});
		ws.once("close", (code, reason) => {
			const reasonText = reason.length > 0 ? `: ${reason.toString("utf8")}` : "";
			settle({
				ok: false,
				status: null,
				error: `Signal container receive WebSocket closed before open (${code}${reasonText})`
			});
		});
	});
}
/**
* Make a REST API request to bbernhard container.
*/
async function containerRestRequest(endpoint, opts, method = "GET", body) {
	const url = `${normalizeBaseUrl$1(opts.baseUrl)}${endpoint}`;
	const init = {
		method,
		headers: { "Content-Type": "application/json" }
	};
	if (body) init.body = JSON.stringify(body);
	const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS$2;
	const bodyIdleTimeoutMs = resolveTimerTimeoutMs(timeoutMs, DEFAULT_TIMEOUT_MS$2);
	const fetchImpl = resolveFetch();
	if (!fetchImpl) throw new Error("fetch is not available");
	return await withSignalRestDeadline(timeoutMs, async ({ signal, timeoutMs: bodyTimeoutMs }) => {
		opts.assertDirectAdapterHandoff?.();
		const res = await fetchImpl(url, {
			...init,
			signal
		});
		if (res.status === 204) return;
		if (!res.ok) {
			let errorText = "";
			try {
				errorText = await readSignalRestErrorText(res, bodyIdleTimeoutMs, bodyTimeoutMs);
			} catch (error) {
				if (error instanceof SignalRestTimeoutError) throw error;
			}
			throw new Error(`Signal REST ${res.status}: ${errorText || res.statusText}`);
		}
		const text = await readSignalRestText(res, bodyIdleTimeoutMs, bodyTimeoutMs);
		if (!text) return;
		try {
			return JSON.parse(text);
		} catch {
			throw new Error("Signal REST returned malformed JSON");
		}
	});
}
/**
* Fetch attachment binary from bbernhard container.
*/
async function containerFetchAttachment(attachmentId, opts) {
	const url = `${normalizeBaseUrl$1(opts.baseUrl)}/v1/attachments/${encodeURIComponent(attachmentId)}`;
	const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS$2;
	const bodyIdleTimeoutMs = resolveTimerTimeoutMs(timeoutMs, DEFAULT_TIMEOUT_MS$2);
	const fetchImpl = resolveFetch();
	if (!fetchImpl) throw new Error("fetch is not available");
	return await withSignalRestDeadline(timeoutMs, async ({ signal, timeoutMs: bodyTimeoutMs }) => {
		let res;
		try {
			const fetched = await fetchImpl(url, {
				method: "GET",
				signal
			});
			res = fetched;
			if (!fetched.ok) return null;
			return await readCappedResponseBuffer(fetched, normalizeMaxResponseBytes(opts.maxResponseBytes), bodyIdleTimeoutMs, bodyTimeoutMs);
		} finally {
			await releaseUnreadResponseBody(res);
		}
	});
}
/**
* Stream messages using WebSocket from bbernhard container.
* The Promise resolves when the connection closes (for any reason).
* The caller (runSignalLoopAdapter) is responsible for reconnection.
*/
async function streamContainerEvents(params) {
	const normalized = normalizeBaseUrl$1(params.baseUrl);
	const wsUrl = `${normalized.replace(/^http/, "ws")}/v1/receive/${encodeURIComponent(params.account ?? "")}`;
	const redactedWsUrl = `${normalized.replace(/^http/, "ws")}/v1/receive/<redacted>`;
	const log = params.logger?.log ?? (() => {});
	const logError = params.logger?.error ?? (() => {});
	log(`[signal-ws] connecting to ${redactedWsUrl}`);
	return new Promise((resolve, reject) => {
		let ws;
		let settled = false;
		let eventChain = Promise.resolve();
		let abortHandler;
		let shutdownDrainTimer;
		const cleanup = () => {
			if (shutdownDrainTimer) {
				clearTimeout(shutdownDrainTimer);
				shutdownDrainTimer = void 0;
			}
			if (abortHandler) {
				params.abortSignal?.removeEventListener("abort", abortHandler);
				abortHandler = void 0;
			}
		};
		const resolveOnce = () => {
			if (settled) return;
			settled = true;
			cleanup();
			resolve();
		};
		const rejectOnce = (error) => {
			if (settled) return;
			settled = true;
			cleanup();
			reject(toErrorObject(error, "Signal WebSocket receive handler failed"));
		};
		try {
			ws = new WebSocket(wsUrl, {
				maxPayload: WS_MAX_PAYLOAD,
				handshakeTimeout: resolvePositiveTimerTimeoutMs(params.timeoutMs, WS_HANDSHAKE_MS)
			});
		} catch (err) {
			logError(`[signal-ws] failed to create WebSocket: ${coerceErrorMessage(err)}`);
			reject(toErrorObject(err, "Non-Error rejection"));
			return;
		}
		ws.on("open", () => {
			log("[signal-ws] connected");
			params.onStreamOpen?.();
		});
		ws.on("message", (data) => {
			if (settled) return;
			try {
				const text = data.toString();
				const envelope = JSON.parse(text);
				if (envelope) {
					eventChain = eventChain.then(async () => {
						await params.onEvent(envelope);
					});
					eventChain.catch((err) => {
						logError(`[signal-ws] receive handler failed: ${coerceErrorMessage(err)}`);
						rejectOnce(err);
						ws.close();
					});
				}
			} catch (err) {
				logError(`[signal-ws] parse error: ${coerceErrorMessage(err)}`);
			}
		});
		ws.on("error", (err) => {
			logError(`[signal-ws] error: ${coerceErrorMessage(err)}`);
		});
		ws.on("close", (code, reason) => {
			const reasonStr = reason?.toString() || "no reason";
			log(`[signal-ws] closed (code=${code}, reason=${reasonStr})`);
			eventChain.then(resolveOnce, rejectOnce);
		});
		ws.on("ping", () => {
			log("[signal-ws] ping received");
		});
		ws.on("pong", () => {
			log("[signal-ws] pong received");
		});
		if (params.abortSignal) {
			abortHandler = () => {
				log("[signal-ws] aborted, closing connection");
				shutdownDrainTimer = setTimeout(() => {
					logError("[signal-ws] shutdown timed out draining accepted receive events; messages may be lost");
					ws.terminate();
					resolveOnce();
				}, WS_SHUTDOWN_DRAIN_TIMEOUT_MS);
				shutdownDrainTimer.unref?.();
				ws.close();
			};
			params.abortSignal.addEventListener("abort", abortHandler, { once: true });
			if (params.abortSignal.aborted) abortHandler();
		}
	});
}
/**
* Convert local file paths to base64 data URIs for the container REST API.
* The bbernhard container /v2/send only accepts `base64_attachments` (not file paths).
*/
async function filesToBase64DataUris(filePaths, maxAttachmentBytes) {
	const results = [];
	let remainingBytes = maxAttachmentBytes;
	for (const filePath of filePaths) {
		const { buffer } = await readRegularFile({
			filePath,
			maxBytes: remainingBytes
		});
		remainingBytes -= buffer.byteLength;
		const mime = await detectMime({
			buffer,
			filePath
		}) ?? "application/octet-stream";
		const filename = extractOriginalFilename(filePath).replace(/[,;#]/g, "_");
		const b64 = buffer.toString("base64");
		results.push(`data:${mime};filename=${filename};base64,${b64}`);
	}
	return results;
}
function escapeContainerStyledText(text) {
	return text.replace(/[*~`|]/g, (char) => `\\${char}`);
}
function renderContainerStyledText(text, styles) {
	const spans = styles.map((style) => {
		const marker = CONTAINER_TEXT_STYLE_MARKERS[style.style];
		if (!marker) return null;
		const start = Math.max(0, Math.min(style.start, text.length));
		const end = Math.max(start, Math.min(style.start + style.length, text.length));
		if (end <= start) return null;
		return {
			start,
			end,
			marker
		};
	}).filter((span) => span !== null);
	if (spans.length === 0) return text;
	const positions = [.../* @__PURE__ */ new Set([
		0,
		text.length,
		...spans.flatMap((span) => [span.start, span.end])
	])].toSorted((a, b) => a - b);
	let rendered = "";
	for (const [index, pos] of positions.entries()) {
		for (const span of spans.filter((candidate) => candidate.end === pos).toSorted((a, b) => b.start - a.start)) rendered += span.marker;
		for (const span of spans.filter((candidate) => candidate.start === pos).toSorted((a, b) => b.end - a.end)) rendered += span.marker;
		const next = positions[index + 1];
		if (next !== void 0 && next > pos) rendered += escapeContainerStyledText(text.slice(pos, next));
	}
	return rendered;
}
function parseContainerSendTimestamp(raw) {
	if (raw == null) return;
	const timestamp = parseStrictNonNegativeInteger(raw);
	if (timestamp === void 0) throw new Error("Signal REST send returned invalid timestamp");
	return timestamp;
}
function normalizeContainerQuoteTimestamp(raw) {
	return parseStrictNonNegativeInteger(raw) ?? void 0;
}
function normalizeContainerQuoteText(raw) {
	return typeof raw === "string" ? raw : void 0;
}
/**
* Send message via bbernhard container REST API.
*/
async function containerSendMessage(params) {
	const payload = {
		message: params.message,
		number: params.account,
		recipients: params.recipients
	};
	if (params.textStyles && params.textStyles.length > 0) {
		payload.message = renderContainerStyledText(params.message, params.textStyles);
		payload["text_mode"] = "styled";
	}
	if (params.attachments && params.attachments.length > 0) {
		const configuredMaxBytes = params.maxAttachmentBytes;
		const maxAttachmentBytes = typeof configuredMaxBytes === "number" && Number.isFinite(configuredMaxBytes) && configuredMaxBytes >= 0 ? Math.floor(configuredMaxBytes) : DEFAULT_SIGNAL_CONTAINER_MAX_ATTACHMENT_BYTES;
		payload.base64_attachments = await filesToBase64DataUris(params.attachments, maxAttachmentBytes);
	}
	if (params.quoteTimestamp !== void 0 && params.quoteAuthor) {
		payload.quote_timestamp = params.quoteTimestamp;
		payload.quote_author = params.quoteAuthor;
		payload.quote_message = params.quoteMessage ?? "";
	}
	const timestamp = parseContainerSendTimestamp((await containerRestRequest("/v2/send", params, "POST", payload))?.timestamp);
	return timestamp === void 0 ? {} : { timestamp };
}
/**
* Send typing indicator via bbernhard container REST API.
*/
async function containerSendTyping(params) {
	const method = params.stop ? "DELETE" : "PUT";
	await containerRestRequest(`/v1/typing-indicator/${encodeURIComponent(params.account)}`, params, method, { recipient: params.recipient });
	return true;
}
/**
* Send read receipt via bbernhard container REST API.
*/
async function containerSendReceipt(params) {
	await containerRestRequest(`/v1/receipts/${encodeURIComponent(params.account)}`, params, "POST", {
		recipient: params.recipient,
		timestamp: params.timestamp,
		receipt_type: params.type ?? "read"
	});
	return true;
}
/**
* Add or remove a message reaction via the bbernhard container REST API.
*/
async function containerSendReaction(params) {
	const payload = {
		recipient: params.recipient,
		reaction: params.emoji,
		target_author: params.targetAuthor,
		timestamp: params.targetTimestamp
	};
	if (params.groupId) payload.group_id = params.groupId;
	return await containerRestRequest(`/v1/reactions/${encodeURIComponent(params.account)}`, params, params.remove ? "DELETE" : "POST", payload) ?? {};
}
/**
* Strip the "uuid:" prefix that native signal-cli accepts but the container API rejects.
*/
function stripUuidPrefix(id) {
	return id.startsWith("uuid:") ? id.slice(5) : id;
}
/**
* Convert a group internal_id to the container-expected format.
* The bbernhard container expects groups as "group.{base64(internal_id)}".
*/
function formatGroupIdForContainer(groupId) {
	if (groupId.startsWith("group.")) return groupId;
	return `group.${Buffer.from(groupId).toString("base64")}`;
}
/**
* Drop-in replacement for native signalRpcRequest that translates
* JSON-RPC method + params into the equivalent container REST API calls.
* This keeps all container protocol details (uuid: stripping, group ID
* formatting, base64 attachments, text-style conversion) isolated here.
*/
async function containerRpcRequest(method, params, opts) {
	const p = params ?? {};
	switch (method) {
		case "send": {
			const recipients = (p.recipient ?? []).map(stripUuidPrefix);
			const usernames = (p.username ?? []).map(stripUuidPrefix);
			const groupId = p.groupId;
			const formattedGroupId = groupId ? formatGroupIdForContainer(groupId) : void 0;
			const finalRecipients = recipients.length > 0 ? recipients : usernames.length > 0 ? usernames : formattedGroupId ? [formattedGroupId] : [];
			const textStyles = p["text-style"]?.flatMap((s) => {
				const [start, length, style] = s.split(":");
				if (start === void 0 || length === void 0 || style === void 0) return [];
				return [{
					start: Number(start),
					length: Number(length),
					style
				}];
			});
			const quoteTimestamp = normalizeContainerQuoteTimestamp(p.quoteTimestamp ?? p["quote-timestamp"]);
			const quoteAuthor = normalizeContainerQuoteText(p.quoteAuthor ?? p["quote-author"]);
			return await containerSendMessage({
				...opts,
				account: p.account ?? "",
				recipients: finalRecipients,
				message: p.message ?? "",
				textStyles,
				attachments: p.attachments,
				quoteTimestamp,
				quoteAuthor: quoteAuthor ? stripUuidPrefix(quoteAuthor) : void 0,
				quoteMessage: normalizeContainerQuoteText(p.quoteMessage ?? p["quote-message"])
			});
		}
		case "sendTyping": {
			const recipient = stripUuidPrefix(p.recipient?.[0] ?? (p.groupId ? formatGroupIdForContainer(p.groupId) : ""));
			await containerSendTyping({
				...opts,
				account: p.account ?? "",
				recipient,
				stop: p.stop
			});
			return;
		}
		case "sendReceipt": {
			const recipient = stripUuidPrefix(p.recipient?.[0] ?? "");
			await containerSendReceipt({
				...opts,
				account: p.account ?? "",
				recipient,
				timestamp: p.targetTimestamp,
				type: p.type
			});
			return;
		}
		case "sendReaction": {
			const recipient = stripUuidPrefix(p.recipients?.[0] ?? "");
			const groupId = p.groupIds?.[0] ?? void 0;
			const formattedGroupId = groupId ? formatGroupIdForContainer(groupId) : void 0;
			const effectiveRecipient = formattedGroupId || recipient || "";
			return await containerSendReaction({
				...opts,
				account: p.account ?? "",
				recipient: effectiveRecipient,
				emoji: p.emoji ?? "",
				targetAuthor: stripUuidPrefix(p.targetAuthor ?? recipient),
				targetTimestamp: p.targetTimestamp,
				groupId: formattedGroupId,
				remove: Boolean(p.remove)
			});
		}
		case "getAttachment": {
			const attachmentId = p.id;
			const buffer = await containerFetchAttachment(attachmentId, {
				baseUrl: opts.baseUrl,
				timeoutMs: opts.timeoutMs,
				maxResponseBytes: opts.maxResponseBytes
			});
			if (!buffer) return { data: void 0 };
			return { data: buffer.toString("base64") };
		}
		case "version": return await containerRestRequest("/v1/about", {
			baseUrl: opts.baseUrl,
			timeoutMs: opts.timeoutMs
		});
		default: throw new Error(`Unsupported container RPC method: ${method}`);
	}
}
//#endregion
//#region extensions/signal/src/socket-path.ts
const execFileAsync = promisify(execFile);
function socketOwner(socketPath) {
	if (process.platform === "win32" || !process.getuid) throw new Error("Signal UNIX socket transport requires a POSIX host");
	if (!path.isAbsolute(socketPath) || path.normalize(socketPath) !== socketPath || socketPath.includes("\0")) throw new Error("Signal socketPath must be a normalized absolute path without NUL bytes");
	if (Buffer.byteLength(socketPath) > 103) throw new Error("Signal socketPath must be at most 103 UTF-8 bytes");
	return process.getuid();
}
async function assertDarwinAclSafe(entryPath, ownerUid, rejectInheritedAllow) {
	if (process.platform !== "darwin") return;
	let stdout;
	try {
		({stdout} = await execFileAsync("/bin/ls", ["-lde", entryPath], { encoding: "utf8" }));
	} catch {
		throw new Error("Signal socketPath ACLs could not be inspected safely");
	}
	const ownerName = ownerUid === 0 ? "root" : os.userInfo().username;
	for (const line of stdout.split("\n").slice(1)) {
		if (!/^\s*\d+:\s+/.test(line) || !/\ballow\b/.test(line)) continue;
		const ownerAllow = line.includes(`user:${ownerName} `);
		const inheritable = /\b(file_inherit|directory_inherit|limit_inherit|only_inherit)\b/.test(line);
		if (!ownerAllow || rejectInheritedAllow && inheritable) throw new Error("Signal socketPath must not grant ACL access to other users");
	}
}
async function validateDirectories(directory, uid, privateParent, inspectAcl) {
	const parts = path.resolve(directory).split(path.sep).filter(Boolean);
	let current = path.parse(directory).root;
	for (const part of parts) {
		current = path.join(current, part);
		const stat = await lstat(current);
		if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error("Signal socketPath must not traverse symlinks or non-directories");
		if (stat.uid !== uid && stat.uid !== 0) throw new Error("Signal socketPath ancestors must belong to the current user or root");
		if ((stat.mode & 18) !== 0 && !(stat.uid === 0 && (stat.mode & 512) !== 0)) throw new Error("Signal socketPath ancestors must not be writable by other users");
		if (privateParent && current === path.resolve(directory)) {
			if (stat.uid !== uid || (stat.mode & 511) !== 448) throw new Error("Signal socketPath parent must belong to the current user with mode 0700");
		}
		if (inspectAcl) await assertDarwinAclSafe(current, stat.uid, true);
	}
	if (privateParent && parts.length === 0) throw new Error("Signal socketPath requires a private parent directory");
}
/** Validate the OS-user boundary before every connection, not only at startup. */
async function validateSignalSocketPath(socketPath) {
	const uid = socketOwner(socketPath);
	await validateDirectories(path.dirname(socketPath), uid, true, true);
}
async function assertSignalSocketEndpoint(socketPath) {
	await validateSignalSocketPath(socketPath);
	const stat = await lstat(socketPath);
	if (!stat.isSocket() || stat.uid !== socketOwner(socketPath)) throw new Error("Signal socketPath must name a socket owned by the current user");
	await assertDarwinAclSafe(socketPath, stat.uid, false);
}
async function isStaleSocket(socketPath, abortSignal) {
	abortSignal?.throwIfAborted();
	return new Promise((resolve, reject) => {
		const socket = createConnection(socketPath);
		const timer = setTimeout(() => finish(/* @__PURE__ */ new Error("Signal socket ownership probe timed out")), 1e3);
		const onAbort = () => finish(/* @__PURE__ */ new Error("Signal socket ownership probe aborted"));
		function finish(error, stale = false) {
			clearTimeout(timer);
			abortSignal?.removeEventListener("abort", onAbort);
			socket.destroy();
			if (error) reject(error);
			else resolve(stale);
		}
		socket.once("connect", () => finish());
		socket.once("error", (error) => {
			if ("code" in error && error.code === "ECONNREFUSED") finish(void 0, true);
			else finish(error);
		});
		abortSignal?.addEventListener("abort", onAbort, { once: true });
	});
}
/** Recover crash leftovers without unlinking a live or replaced endpoint. */
async function prepareSignalSocketPath(socketPath, abortSignal) {
	const uid = socketOwner(socketPath);
	abortSignal?.throwIfAborted();
	const parent = path.dirname(socketPath);
	await validateDirectories(path.dirname(parent), uid, false, false);
	let createdParent = false;
	try {
		await mkdir(parent, { mode: 448 });
		createdParent = true;
	} catch (error) {
		if (!(error instanceof Error && "code" in error && error.code === "EEXIST")) throw error;
	}
	try {
		await validateSignalSocketPath(socketPath);
		let existing;
		try {
			existing = await lstat(socketPath);
		} catch (error) {
			if (error instanceof Error && "code" in error && error.code === "ENOENT") return;
			throw error;
		}
		if (existing.isSocket() && existing.uid === uid && await isStaleSocket(socketPath, abortSignal)) {
			await validateSignalSocketPath(socketPath);
			const current = await lstat(socketPath);
			abortSignal?.throwIfAborted();
			if (current.isSocket() && current.uid === uid && current.dev === existing.dev && current.ino === existing.ino) {
				await unlink(socketPath);
				return;
			}
			throw new Error("Signal socketPath changed during its ownership probe; retry startup");
		}
		throw new Error("Signal socketPath already exists; stop its owner or choose a different socket path before starting");
	} catch (error) {
		if (createdParent) try {
			const stat = await lstat(parent);
			if (stat.isDirectory() && !stat.isSymbolicLink() && stat.uid === uid) await rmdir(parent);
		} catch {}
		throw error;
	}
}
//#endregion
//#region extensions/signal/src/client-unix.ts
const MAX_FRAME_BYTES = 1048576;
const DEFAULT_TIMEOUT_MS$1 = 1e4;
function socketPath(baseUrl) {
	const url = new URL(baseUrl.trim());
	if (url.protocol !== "unix:" || url.host || url.username || url.password || url.search || url.hash) throw new Error("Signal UNIX URL must contain only an absolute socket path");
	return fileURLToPath(`file://${url.pathname}`);
}
function abortError() {
	return Object.assign(/* @__PURE__ */ new Error("Signal UNIX stream aborted"), { name: "AbortError" });
}
async function openSocket(options, abortSignal) {
	if (abortSignal?.aborted) throw abortError();
	const path = socketPath(options.baseUrl);
	await assertSignalSocketEndpoint(path);
	if (abortSignal?.aborted) throw abortError();
	const socket = net.createConnection({ path });
	socket.on("error", () => {});
	const timeoutMs = resolveTimerTimeoutMs(options.timeoutMs ?? DEFAULT_TIMEOUT_MS$1, DEFAULT_TIMEOUT_MS$1);
	const deadline = setTimeout(() => {
		socket.destroy(/* @__PURE__ */ new Error(`Signal UNIX RPC exceeded deadline after ${timeoutMs}ms`));
	}, timeoutMs);
	deadline.unref();
	const onAbort = () => socket.destroy(abortError());
	abortSignal?.addEventListener("abort", onAbort, { once: true });
	return {
		socket,
		ready: () => clearTimeout(deadline),
		close: () => {
			clearTimeout(deadline);
			abortSignal?.removeEventListener("abort", onAbort);
			socket.destroy();
		}
	};
}
async function* messages(socket, maxBytes = MAX_FRAME_BYTES) {
	let pending = Buffer$1.alloc(0);
	for await (const chunk of socket) {
		if (!Buffer$1.isBuffer(chunk)) throw new Error("Signal UNIX RPC expected a byte stream");
		let offset = 0;
		while (offset < chunk.length) {
			const newline = chunk.indexOf(10, offset);
			const end = newline < 0 ? chunk.length : newline;
			const fragment = chunk.subarray(offset, end);
			if (pending.length + fragment.length > maxBytes) throw new Error("Signal UNIX RPC frame exceeded size limit");
			pending = Buffer$1.concat([pending, fragment]);
			if (newline < 0) break;
			const text = new TextDecoder("utf-8", { fatal: true }).decode(pending);
			pending = Buffer$1.alloc(0);
			offset = newline + 1;
			let parsed;
			try {
				parsed = JSON.parse(text);
			} catch {
				throw new Error("Signal UNIX RPC returned malformed JSON");
			}
			if (!isRecord(parsed)) throw new Error("Signal UNIX RPC returned invalid response envelope");
			yield parsed;
		}
	}
	if (pending.length) throw new Error("Signal UNIX RPC closed with an incomplete frame");
}
const QUOTE_REJECTION_WORDS = [
	"reject",
	"invalid",
	"unrecognized",
	"unsupported",
	"not found",
	"no such",
	"unknown"
];
function isQuoteMetadataRejection(code, rawMessage) {
	if (code !== -32602) return false;
	const normalized = rawMessage.toLowerCase();
	return normalized.includes("quote") && QUOTE_REJECTION_WORDS.some((word) => normalized.includes(word));
}
function result(message) {
	if (message.jsonrpc !== "2.0" || !Object.hasOwn(message, "result") && !message.error) throw new Error("Signal UNIX RPC returned invalid response envelope");
	if (message.error) {
		const error = isRecord(message.error) ? message.error : {};
		const code = typeof error.code === "number" ? error.code : "unknown";
		if (typeof error.message === "string" && isQuoteMetadataRejection(code, error.message)) throw new Error(`Signal RPC ${code}: quote metadata rejected (redacted)`);
		throw new Error(`Signal RPC ${code}: remote error`);
	}
	return message.result;
}
async function signalUnixRpcRequest(method, params, options) {
	const connection = await openSocket(options);
	const id = randomUUID();
	const maxBytes = typeof options.maxResponseBytes === "number" && Number.isFinite(options.maxResponseBytes) && options.maxResponseBytes >= 1 ? Math.floor(options.maxResponseBytes) : MAX_FRAME_BYTES;
	try {
		const frame = `${JSON.stringify({
			jsonrpc: "2.0",
			id,
			method,
			params
		})}\n`;
		options.assertDirectAdapterHandoff?.();
		connection.socket.write(frame);
		for await (const message of messages(connection.socket, maxBytes)) if (message.id === id) return result(message);
		throw new Error("Signal UNIX RPC closed before response");
	} finally {
		connection.close();
	}
}
async function streamSignalUnixEvents(params) {
	const connection = await openSocket({
		...params,
		timeoutMs: params.timeoutMs === 0 ? DEFAULT_TIMEOUT_MS$1 : params.timeoutMs
	}, params.abortSignal);
	const id = randomUUID();
	let subscribed = false;
	let subscription;
	try {
		connection.socket.write(`${JSON.stringify({
			jsonrpc: "2.0",
			id,
			method: "subscribeReceive",
			params: params.account ? { account: params.account } : void 0
		})}\n`);
		for await (const message of messages(connection.socket)) {
			if (params.abortSignal?.aborted) throw abortError();
			if (message.id === id) {
				const value = result(message);
				if (typeof value !== "number" || !Number.isInteger(value) || value < 0) throw new Error("Signal UNIX RPC returned invalid receive subscription");
				subscription = value;
				subscribed = true;
				connection.ready();
				params.onStreamOpen?.();
				continue;
			}
			if (message.jsonrpc !== "2.0" || message.method !== "receive" || !isRecord(message.params)) continue;
			const notification = message.params;
			if (subscription !== void 0 && notification.subscription !== subscription) continue;
			const payload = notification.result;
			if (!isRecord(payload)) continue;
			const account = payload.account;
			if (params.account && typeof account === "string" && account !== params.account) continue;
			await params.onEvent({
				event: "receive",
				data: JSON.stringify(payload)
			});
		}
		if (!subscribed) throw new Error("Signal UNIX RPC closed before receive subscription");
	} finally {
		connection.close();
	}
}
//#endregion
//#region extensions/signal/src/client.ts
/** Thrown when the native SSE endpoint rejects the request with a non-2xx HTTP status. */
var SignalSseRejectionError = class extends Error {
	constructor(status, statusText) {
		super(`Signal SSE failed (${status} ${statusText})`);
		this.status = status;
	}
};
const DEFAULT_TIMEOUT_MS = 1e4;
const DEFAULT_SIGNAL_HTTP_RESPONSE_MAX_BYTES = 1048576;
const MAX_SIGNAL_SSE_BUFFER_BYTES = 1048576;
const MAX_SIGNAL_SSE_EVENT_DATA_BYTES = 1048576;
function createSignalSseAbortError() {
	const error = /* @__PURE__ */ new Error("Signal SSE aborted");
	error.name = "AbortError";
	return error;
}
function normalizeBaseUrl(url) {
	const trimmed = url.trim();
	if (!trimmed) throw new Error("Signal base URL is required");
	if (/^https?:\/\//i.test(trimmed)) return trimmed.replace(/\/+$/, "");
	return `http://${trimmed}`.replace(/\/+$/, "");
}
function parseSignalBaseUrl(url) {
	const parsed = new URL(normalizeBaseUrl(url));
	if (parsed.username || parsed.password) throw new Error("Signal base URL must not include credentials");
	return parsed;
}
function resolveSignalEndpointUrl(baseUrl, pathname) {
	const parsed = parseSignalBaseUrl(baseUrl);
	parsed.pathname = `${parsed.pathname.endsWith("/") ? parsed.pathname : `${parsed.pathname}/`}${pathname.replace(/^\/+/, "")}`;
	parsed.search = "";
	parsed.hash = "";
	return parsed;
}
function parseSignalRpcResponse(text, status) {
	let parsed;
	try {
		parsed = JSON.parse(text);
	} catch (err) {
		throw new Error(`Signal RPC returned malformed JSON (status ${status})`, { cause: err });
	}
	if (!parsed || typeof parsed !== "object") throw new Error(`Signal RPC returned invalid response envelope (status ${status})`);
	const rpc = parsed;
	const hasResult = Object.hasOwn(rpc, "result");
	if (!rpc.error && !hasResult) throw new Error(`Signal RPC returned invalid response envelope (status ${status})`);
	return rpc;
}
function assertSignalHttpProtocol(url, label) {
	if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error(`Signal ${label} unsupported protocol: ${url.protocol}`);
}
function normalizeSignalHttpResponseMaxBytes(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return DEFAULT_SIGNAL_HTTP_RESPONSE_MAX_BYTES;
	return Math.floor(value);
}
function normalizeSignalSseTimeoutMs(timeoutMs) {
	if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) return null;
	return resolveTimerTimeoutMs(timeoutMs, DEFAULT_TIMEOUT_MS);
}
function requestSignalHttp(url, options) {
	assertSignalHttpProtocol(url, "HTTP");
	const timeoutMs = resolveTimerTimeoutMs(options.timeoutMs, DEFAULT_TIMEOUT_MS);
	const client = url.protocol === "https:" ? https : http;
	options.assertDirectAdapterHandoff?.();
	return new Promise((resolve, reject) => {
		let settled = false;
		const deadline = setTimeout(() => {
			request?.destroy(/* @__PURE__ */ new Error(`Signal HTTP exceeded deadline after ${timeoutMs}ms`));
		}, timeoutMs);
		deadline.unref?.();
		const cleanup = () => {
			clearTimeout(deadline);
			request?.setTimeout(0);
		};
		const rejectOnce = (error) => {
			if (settled) return;
			settled = true;
			cleanup();
			reject(toErrorObject(error, "Non-Error rejection"));
		};
		const resolveOnce = (response) => {
			if (settled) return;
			settled = true;
			cleanup();
			resolve(response);
		};
		const maxResponseBytes = normalizeSignalHttpResponseMaxBytes(options.maxResponseBytes);
		const request = client.request(url, {
			method: options.method,
			headers: options.headers
		}, (res) => {
			const chunks = [];
			let totalBytes = 0;
			res.on("data", (chunk) => {
				const next = typeof chunk === "string" ? Buffer$1.from(chunk) : chunk;
				totalBytes += next.byteLength;
				if (totalBytes > maxResponseBytes) {
					const error = /* @__PURE__ */ new Error("Signal HTTP response exceeded size limit");
					request?.destroy(error);
					res.destroy(error);
					rejectOnce(error);
					return;
				}
				chunks.push(next);
			});
			res.on("error", rejectOnce);
			res.on("end", () => {
				resolveOnce({
					status: res.statusCode ?? 0,
					body: Buffer$1.concat(chunks)
				});
			});
		});
		request.setTimeout(timeoutMs, () => {
			request?.destroy(/* @__PURE__ */ new Error(`Signal HTTP timed out after ${timeoutMs}ms`));
		});
		request.on("error", rejectOnce);
		if (options.body !== void 0) request.write(options.body);
		request.end();
	});
}
async function signalRpcRequest(method, params, opts) {
	if (opts.baseUrl.trim().startsWith("unix:")) return signalUnixRpcRequest(method, params, opts);
	const id = generateSecureUuid();
	const body = JSON.stringify({
		jsonrpc: "2.0",
		method,
		params,
		id
	});
	const res = await requestSignalHttp(resolveSignalEndpointUrl(opts.baseUrl, "/api/v1/rpc"), {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Content-Length": String(Buffer$1.byteLength(body))
		},
		body,
		timeoutMs: opts.timeoutMs ?? DEFAULT_TIMEOUT_MS,
		maxResponseBytes: opts.maxResponseBytes,
		assertDirectAdapterHandoff: opts.assertDirectAdapterHandoff
	});
	if (res.status === 201) return;
	const text = new TextDecoder("utf-8", { fatal: true }).decode(res.body);
	if (!text) throw new Error(`Signal RPC empty response (status ${res.status})`);
	const parsed = parseSignalRpcResponse(text, res.status);
	if (parsed.error) {
		const code = parsed.error.code ?? "unknown";
		const msg = parsed.error.message ?? "Signal RPC error";
		throw new Error(`Signal RPC ${code}: ${msg}`);
	}
	return parsed.result;
}
async function signalCheck(baseUrl, timeoutMs = DEFAULT_TIMEOUT_MS) {
	try {
		if (baseUrl.trim().startsWith("unix:")) {
			await signalUnixRpcRequest("version", void 0, {
				baseUrl,
				timeoutMs
			});
			return {
				ok: true,
				status: null,
				error: null
			};
		}
		const res = await requestSignalHttp(resolveSignalEndpointUrl(baseUrl, "/api/v1/check"), {
			method: "GET",
			timeoutMs
		});
		if (res.status < 200 || res.status >= 300) return {
			ok: false,
			status: res.status,
			error: `HTTP ${res.status}`
		};
		return {
			ok: true,
			status: res.status,
			error: null
		};
	} catch (err) {
		return {
			ok: false,
			status: null,
			error: formatErrorMessage(err)
		};
	}
}
function openSignalEventStream(url, abortSignal, timeoutMs = DEFAULT_TIMEOUT_MS) {
	assertSignalHttpProtocol(url, "SSE");
	if (abortSignal?.aborted) throw createSignalSseAbortError();
	const client = url.protocol === "https:" ? https : http;
	return new Promise((resolve, reject) => {
		let settled = false;
		let response;
		let onAbort = () => {};
		const effectiveTimeoutMs = normalizeSignalSseTimeoutMs(timeoutMs);
		const headerDeadline = effectiveTimeoutMs === null ? void 0 : setTimeout(() => {
			const error = /* @__PURE__ */ new Error(`Signal SSE connection timed out after ${effectiveTimeoutMs}ms`);
			response?.destroy(error);
			request.destroy(error);
			rejectOnce(error);
		}, effectiveTimeoutMs);
		headerDeadline?.unref?.();
		const cleanup = () => {
			if (headerDeadline) clearTimeout(headerDeadline);
			abortSignal?.removeEventListener("abort", onAbort);
		};
		const rejectOnce = (error) => {
			if (settled) return;
			settled = true;
			cleanup();
			reject(toErrorObject(error, "Non-Error rejection"));
		};
		const request = client.request(url, {
			method: "GET",
			headers: { Accept: "text/event-stream" }
		}, (res) => {
			const status = res.statusCode ?? 0;
			if (status < 200 || status >= 300) {
				res.resume();
				rejectOnce(new SignalSseRejectionError(status, res.statusMessage || "error"));
				return;
			}
			if (settled) {
				res.destroy();
				return;
			}
			if (headerDeadline) clearTimeout(headerDeadline);
			settled = true;
			response = res;
			resolve({
				response: res,
				cleanup
			});
		});
		onAbort = () => {
			const error = createSignalSseAbortError();
			response?.destroy(error);
			request.destroy(error);
			rejectOnce(error);
		};
		abortSignal?.addEventListener("abort", onAbort, { once: true });
		request.on("error", rejectOnce);
		request.end();
	});
}
async function streamSignalEvents(params) {
	if (params.baseUrl.trim().startsWith("unix:")) return streamSignalUnixEvents(params);
	const url = resolveSignalEndpointUrl(params.baseUrl, "/api/v1/events");
	if (params.account) url.searchParams.set("account", params.account);
	const { response, cleanup } = await openSignalEventStream(url, params.abortSignal, params.timeoutMs ?? DEFAULT_TIMEOUT_MS);
	params.onStreamOpen?.();
	const decoder = new TextDecoder();
	let buffer = "";
	let bufferedBytes = 0;
	let currentEvent = {};
	let currentEventDataBytes = 0;
	const flushEvent = async () => {
		if (!currentEvent.data && !currentEvent.event && !currentEvent.id) return;
		await params.onEvent({
			event: currentEvent.event,
			data: currentEvent.data,
			id: currentEvent.id
		});
		currentEvent = {};
		currentEventDataBytes = 0;
	};
	const processLine = async (line) => {
		if (line === "") {
			await flushEvent();
			return;
		}
		if (line.startsWith(":")) return;
		const [rawField, ...rest] = line.split(":");
		if (rawField === void 0) return;
		const field = rawField.trim();
		const rawValue = rest.join(":");
		const value = rawValue.startsWith(" ") ? rawValue.slice(1) : rawValue;
		if (field === "event") currentEvent.event = value;
		else if (field === "data") {
			const segment = currentEvent.data ? `\n${value}` : value;
			currentEventDataBytes += Buffer$1.byteLength(segment, "utf8");
			if (currentEventDataBytes > MAX_SIGNAL_SSE_EVENT_DATA_BYTES) throw new Error("Signal SSE event data exceeded size limit");
			currentEvent.data = currentEvent.data ? `${currentEvent.data}${segment}` : segment;
		} else if (field === "id") currentEvent.id = value;
	};
	const drainCompleteLines = async () => {
		let lineEnd = buffer.indexOf("\n");
		while (lineEnd !== -1) {
			let line = buffer.slice(0, lineEnd);
			buffer = buffer.slice(lineEnd + 1);
			if (line.endsWith("\r")) line = line.slice(0, -1);
			await processLine(line);
			lineEnd = buffer.indexOf("\n");
		}
		bufferedBytes = Buffer$1.byteLength(buffer, "utf8");
	};
	try {
		for await (const chunk of response) {
			const value = typeof chunk === "string" ? Buffer$1.from(chunk) : chunk;
			bufferedBytes += value.byteLength;
			if (bufferedBytes > MAX_SIGNAL_SSE_BUFFER_BYTES) throw new Error("Signal SSE buffer exceeded size limit");
			buffer += decoder.decode(value, { stream: true });
			await drainCompleteLines();
		}
		const tail = decoder.decode();
		if (tail) {
			buffer += tail;
			bufferedBytes = Buffer$1.byteLength(buffer, "utf8");
		}
		if (bufferedBytes > MAX_SIGNAL_SSE_BUFFER_BYTES) throw new Error("Signal SSE buffer exceeded size limit");
		await drainCompleteLines();
	} finally {
		cleanup();
	}
	await flushEvent();
}
//#endregion
export { prepareSignalSocketPath as a, streamContainerEvents as c, streamSignalEvents as i, signalCheck as n, containerCheck as o, signalRpcRequest as r, containerRpcRequest as s, SignalSseRejectionError as t };
