import { C as formatUnknownError, S as SLACK_SOCKET_RECONNECT_POLICY, a as requireSlackMessageEvent, i as parseSlackMessageEvent } from "./provider-C-jPaGt2.mjs";
import { asOptionalRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { computeBackoff, sleepWithAbort, warn } from "openclaw/plugin-sdk/runtime-env";
import { createNodeProxyAgent } from "openclaw/plugin-sdk/fetch-runtime";
import { isIP } from "node:net";
import { rawDataToString } from "openclaw/plugin-sdk/webhook-ingress";
import { WebSocket } from "openclaw/plugin-sdk/websocket-runtime";
//#region extensions/slack/src/monitor/relay-source.ts
const SLACK_RELAY_ROUTE_KINDS = /* @__PURE__ */ new Set([
	"user_group",
	"thread_affinity",
	"channel_default"
]);
const SLACK_RELAY_MAX_PAYLOAD_BYTES = 1048576;
async function monitorSlackRelaySource(params) {
	let reconnectAttempts = 0;
	while (!params.abortSignal?.aborted) {
		let connection;
		try {
			connection = await openRelayWebSocket(params.config, params.abortSignal);
			reconnectAttempts = 0;
			params.setStatus?.({
				connected: true,
				lastConnectedAt: Date.now(),
				...params.identityHealth
			});
			params.runtime.log?.(`slack relay mode connected gateway_id:${params.config.gatewayId}`);
			await runRelayWebSocket({
				connection,
				acceptRelayEvent: params.acceptRelayEvent,
				runtime: params.runtime,
				abortSignal: params.abortSignal,
				setStatus: params.setStatus,
				setIdentity: params.setIdentity
			});
		} catch (err) {
			if (params.abortSignal?.aborted) break;
			reconnectAttempts += 1;
			const delayMs = computeBackoff(SLACK_SOCKET_RECONNECT_POLICY, reconnectAttempts);
			params.setStatus?.({
				connected: false,
				lifecycle: "recovering",
				lastDisconnect: {
					at: Date.now(),
					error: formatUnknownError(err)
				},
				lastError: formatUnknownError(err)
			});
			params.runtime.log?.(warn(`slack relay mode disconnected; reconnecting in ${Math.round(delayMs / 1e3)}s (attempt ${reconnectAttempts}) reason="${formatUnknownError(err)}"`));
			await sleepWithAbort(delayMs, params.abortSignal);
		} finally {
			closeRelayWebSocket(connection);
			params.setIdentity?.(void 0);
		}
	}
}
function openRelayWebSocket(config, abortSignal) {
	if (abortSignal?.aborted) return Promise.reject(/* @__PURE__ */ new Error("Slack relay websocket aborted before connect"));
	return new Promise((resolve, reject) => {
		const url = buildRelayWebSocketUrl(config);
		const ws = new WebSocket(url, buildRelayWebSocketOptions(config.authToken, url));
		const cleanup = () => {
			ws.off("open", onOpen);
			ws.off("error", onError);
			ws.off("close", onClose);
			abortSignal?.removeEventListener("abort", onAbort);
		};
		const onOpen = () => {
			ws.pause();
			cleanup();
			resolve(ws);
		};
		const onError = (error) => {
			cleanup();
			reject(error);
		};
		const onClose = (code, reason) => {
			cleanup();
			reject(new Error(formatRelayClose(code, reason)));
		};
		const onAbort = () => {
			closeRelayWebSocket(ws);
			reject(/* @__PURE__ */ new Error("Slack relay websocket aborted during connect"));
		};
		ws.once("open", onOpen);
		ws.once("error", onError);
		ws.once("close", onClose);
		abortSignal?.addEventListener("abort", onAbort, { once: true });
	});
}
function runRelayWebSocket(params) {
	const ws = params.connection;
	let pending = Promise.resolve();
	return new Promise((resolve, reject) => {
		const cleanup = () => {
			ws.off("message", onMessage);
			ws.off("error", onError);
			ws.off("close", onClose);
			params.abortSignal?.removeEventListener("abort", onAbort);
		};
		const settleResolve = () => {
			cleanup();
			pending.then(resolve, reject);
		};
		const settleReject = (error) => {
			cleanup();
			pending.then(() => reject(error), reject);
		};
		const onMessage = (data) => {
			pending = pending.then(() => handleRelayFrame({
				ws,
				data,
				acceptRelayEvent: params.acceptRelayEvent,
				setStatus: params.setStatus,
				setIdentity: params.setIdentity
			})).catch((err) => {
				params.runtime.error?.(`slack relay frame failed: ${formatUnknownError(err)}`);
			});
		};
		const onError = (error) => {
			cleanup();
			reject(error);
		};
		const onClose = (code, reason) => {
			const closeReason = formatRelayClose(code, reason);
			params.setStatus?.({
				connected: false,
				lifecycle: "recovering",
				lastDisconnect: {
					at: Date.now(),
					error: closeReason
				}
			});
			settleReject(new Error(closeReason));
		};
		const onAbort = () => {
			closeRelayWebSocket(ws);
			settleResolve();
		};
		ws.on("message", onMessage);
		ws.once("error", onError);
		ws.once("close", onClose);
		params.abortSignal?.addEventListener("abort", onAbort, { once: true });
		ws.resume();
	});
}
async function handleRelayFrame(params) {
	const frame = parseRelayFrame(params.data);
	const hello = extractRelayHello(frame);
	if (hello) {
		params.setIdentity?.(hello.identity);
		params.setStatus?.({ relayIdentity: hello.identity ?? null });
		return;
	}
	const event = extractRelaySlackMessageEvent(frame);
	if (!event) return;
	const now = Date.now();
	params.setStatus?.({
		lastEventAt: now,
		lastInboundAt: now
	});
	params.setStatus?.({ relayRoute: event.route });
	await params.acceptRelayEvent({
		deliveryId: event.deliveryId,
		message: event.message
	});
	sendRelayAck(params.ws, event.deliveryId);
}
function buildRelayWebSocketOptions(authToken, url) {
	const agent = url.startsWith("wss:") ? createNodeProxyAgent({
		mode: "env",
		targetUrl: url,
		protocol: "https"
	}) : void 0;
	return {
		...agent ? { agent } : {},
		headers: { Authorization: `Bearer ${authToken}` },
		handshakeTimeout: 3e4,
		maxPayload: SLACK_RELAY_MAX_PAYLOAD_BYTES,
		perMessageDeflate: false
	};
}
function buildRelayWebSocketUrl(config) {
	const url = new URL(config.url);
	if (url.protocol === "http:") url.protocol = "ws:";
	else if (url.protocol === "https:") url.protocol = "wss:";
	if (url.protocol !== "ws:" && url.protocol !== "wss:") throw new Error(`Slack relay URL must use http(s) or ws(s): ${config.url}`);
	if (url.protocol === "ws:" && !isLocalRelayHost(url.hostname)) throw new Error(`Slack relay URL uses plaintext ws:// for non-local host "${url.host}". Use wss:// for remote relay URLs; ws:// is only allowed for localhost, 127.0.0.1, or [::1].`);
	if (!url.pathname || url.pathname === "/") throw new Error(`Slack relay URL must include its websocket path: ${config.url}`);
	url.searchParams.set("gateway_id", config.gatewayId);
	return url.toString();
}
function isLocalRelayHost(hostname) {
	const normalized = hostname.trim().toLowerCase();
	const host = normalized.startsWith("[") && normalized.endsWith("]") ? normalized.slice(1, -1) : normalized;
	if (host === "localhost" || host === "::1") return true;
	return isIP(host) === 4 && host.startsWith("127.");
}
var SlackRelayMalformedFrameError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "SlackRelayMalformedFrameError";
	}
};
function parseRelayFrame(data) {
	const text = rawDataToString(data);
	try {
		return JSON.parse(text);
	} catch (cause) {
		throw new SlackRelayMalformedFrameError("Slack relay received malformed JSON frame", { cause });
	}
}
function extractRelaySlackMessageEvent(frame) {
	const record = asOptionalRecord(frame);
	if (!record || record.type !== "slack_event") return;
	const deliveryId = stringValue(record.delivery_id);
	const routeRecord = asOptionalRecord(record.route);
	const routeKind = stringValue(routeRecord?.kind);
	const routeKey = stringValue(routeRecord?.key);
	const payload = asOptionalRecord(record.payload);
	const event = parseSlackMessageEvent(payload?.event);
	if (!event) return;
	if (!deliveryId || !routeKind || !SLACK_RELAY_ROUTE_KINDS.has(routeKind) || !routeKey) return;
	return {
		deliveryId,
		message: event,
		route: {
			kind: routeKind,
			key: routeKey
		}
	};
}
function extractRelayHello(frame) {
	const record = asOptionalRecord(frame);
	if (!record || record.type !== "hello") return;
	return { identity: extractRelayIdentity(record) };
}
function extractRelayIdentity(record) {
	const identityRecord = asOptionalRecord(record.slack_identity) ?? asOptionalRecord(record.slackIdentity);
	if (!identityRecord) return;
	const username = normalizeOptionalString(identityRecord.username);
	const iconUrl = normalizeOptionalString(identityRecord.icon_url) ?? normalizeOptionalString(identityRecord.iconUrl);
	const iconEmoji = normalizeOptionalString(identityRecord.icon_emoji) ?? normalizeOptionalString(identityRecord.iconEmoji);
	if (!username && !iconUrl && !iconEmoji) return;
	return {
		...username ? { username } : {},
		...iconUrl ? { iconUrl } : {},
		...iconEmoji ? { iconEmoji } : {}
	};
}
function sendRelayAck(ws, deliveryId) {
	if (ws.readyState !== WebSocket.OPEN) return;
	ws.send(JSON.stringify({
		type: "ack",
		delivery_id: deliveryId
	}));
}
function closeRelayWebSocket(ws) {
	if (!ws || ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING) return;
	ws.close();
}
function formatRelayClose(code, reason) {
	const text = reason.toString("utf8");
	return text ? `Slack relay websocket closed (${code} ${text})` : `Slack relay websocket closed (${code})`;
}
function stringValue(value) {
	return typeof value === "string" ? value : void 0;
}
//#endregion
export { SLACK_RELAY_MAX_PAYLOAD_BYTES, SlackRelayMalformedFrameError, buildRelayWebSocketOptions, buildRelayWebSocketUrl, monitorSlackRelaySource, parseRelayFrame, requireSlackMessageEvent };
