import { l as stringifyNonErrorCause } from "./error-coercion-C787aVxk.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { g as readStringValue } from "./string-coerce-CIXf7egm.mjs";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { _ as redactSensitiveText } from "./redact-B5EGyLvV.mjs";
import "./errors-DnjwnOju.mjs";
import { t as isVerbose } from "./global-state-BAD7XgmL.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import "./globals-QODkv80i.mjs";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-G378iYNJ.mjs";
import "./reply-payload-RBmrGrXG.mjs";
import { t as getGatewayWsLogStyle } from "./ws-logging-86BGsxSJ.mjs";
import chalk from "chalk";
//#region src/gateway/ws-log.ts
/**
* WebSocket logging helpers for gateway request, response, and event traffic.
*/
const LOG_VALUE_LIMIT = 240;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const WS_LOG_REDACT_OPTIONS = { mode: "tools" };
let wsLastCompactConnId;
const wsInflightSince = /* @__PURE__ */ new Map();
const wsLog = createSubsystemLogger("gateway/ws");
const WS_META_SKIP_KEYS = /* @__PURE__ */ new Set([
	"connId",
	"id",
	"method",
	"ok",
	"event"
]);
function collectWsRestMeta(meta) {
	const restMeta = [];
	if (!meta) return restMeta;
	for (const [key, value] of Object.entries(meta)) {
		if (value === void 0) continue;
		if (WS_META_SKIP_KEYS.has(key)) continue;
		restMeta.push(`${chalk.dim(key)}=${formatForLog(value)}`);
	}
	return restMeta;
}
function buildWsHeadline(params) {
	if ((params.kind === "req" || params.kind === "res") && params.method) return chalk.bold(params.method);
	if (params.kind === "event" && params.event) return chalk.bold(params.event);
}
function buildWsStatusToken(kind, ok) {
	if (kind !== "res" || ok === void 0) return;
	return ok ? chalk.greenBright("✓") : chalk.redBright("✗");
}
function logWsInfoLine(params) {
	const tokens = [
		params.prefix,
		params.statusToken,
		params.headline,
		params.durationToken,
		...params.restMeta,
		...params.trailing
	].filter((t) => Boolean(t));
	wsLog.info(tokens.join(" "));
}
/** Returns true when a frame can produce console output or required timing state. */
function shouldLogWs(direction, kind) {
	if (isVerbose()) return wsLog.isEnabled("info");
	if (kind === "parse-error") return wsLog.isEnabled("warn");
	return (direction === "in" && kind === "req" || direction === "out" && kind === "res") && wsLog.isEnabled("info");
}
/** Compacts long ids while keeping enough entropy for log correlation. */
function shortId(value) {
	const s = value.trim();
	if (UUID_RE.test(s)) return `${sliceUtf16Safe(s, 0, 8)}…${sliceUtf16Safe(s, -4)}`;
	if (s.length <= 24) return s;
	return `${sliceUtf16Safe(s, 0, 12)}…${sliceUtf16Safe(s, -4)}`;
}
/** Formats and redacts arbitrary values before they are written to gateway logs. */
function formatForLog(value) {
	try {
		if (value instanceof Error) {
			const combined = renderErrorChainForLog(value);
			if (combined) {
				const redacted = redactSensitiveText(combined, WS_LOG_REDACT_OPTIONS);
				return redacted.length > LOG_VALUE_LIMIT ? `${truncateUtf16Safe(redacted, LOG_VALUE_LIMIT)}...` : redacted;
			}
		}
		if (value && typeof value === "object") {
			const rec = value;
			if (typeof rec.message === "string" && rec.message.trim()) {
				const name = typeof rec.name === "string" ? rec.name.trim() : "";
				const code = typeof rec.code === "string" || typeof rec.code === "number" ? String(rec.code) : "";
				const parts = [name, rec.message.trim()].filter(Boolean);
				if (code) parts.push(`code=${code}`);
				const combined = redactSensitiveText(parts.join(": ").trim(), WS_LOG_REDACT_OPTIONS);
				return combined.length > LOG_VALUE_LIMIT ? `${truncateUtf16Safe(combined, LOG_VALUE_LIMIT)}...` : combined;
			}
		}
		const str = typeof value === "string" || typeof value === "number" ? String(value) : JSON.stringify(value);
		if (!str) return "";
		const redacted = redactSensitiveText(str, WS_LOG_REDACT_OPTIONS);
		return redacted.length > LOG_VALUE_LIMIT ? `${truncateUtf16Safe(redacted, LOG_VALUE_LIMIT)}...` : redacted;
	} catch {
		return String(value);
	}
}
function renderSingleErrorForLog(error) {
	const parts = [];
	if (error.name) parts.push(error.name);
	if (error.message) parts.push(error.message);
	const codeValue = isRecord(error) ? error.code : void 0;
	const code = typeof codeValue === "string" || typeof codeValue === "number" ? String(codeValue) : "";
	if (code) parts.push(`code=${code}`);
	return parts.filter(Boolean).join(": ").trim();
}
function renderErrorChainForLog(error) {
	const segments = [renderSingleErrorForLog(error)];
	let current = error.cause;
	let depth = 0;
	while (current !== void 0 && current !== null && depth < 8) {
		if (current instanceof Error) {
			segments.push(renderSingleErrorForLog(current));
			current = current.cause;
		} else {
			segments.push(stringifyNonErrorCause(current));
			current = void 0;
		}
		depth += 1;
	}
	return segments.filter(Boolean).join(" <- ");
}
function compactPreview(input, maxLen = 160) {
	const prefixLength = maxLen * 2;
	let oneLine = input.slice(0, prefixLength).replace(/\s+/g, " ").trim();
	if (oneLine.length <= maxLen && input.length > prefixLength) oneLine = input.replace(/\s+/g, " ").trim();
	if (oneLine.length <= maxLen) return oneLine;
	return `${truncateUtf16Safe(oneLine, Math.max(0, maxLen - 1))}…`;
}
/** Extracts small, non-sensitive fields from agent event payloads for WS logs. */
function summarizeAgentEventForWsLog(payload) {
	if (!payload || typeof payload !== "object") return {};
	const rec = payload;
	const runId = readStringValue(rec.runId);
	const stream = readStringValue(rec.stream);
	const seq = typeof rec.seq === "number" ? rec.seq : void 0;
	const sessionKey = readStringValue(rec.sessionKey);
	const data = rec.data && typeof rec.data === "object" ? rec.data : void 0;
	const extra = {};
	if (runId) extra.run = shortId(runId);
	if (sessionKey) {
		const parsed = parseAgentSessionKey(sessionKey);
		if (parsed) {
			extra.agent = parsed.agentId;
			extra.session = parsed.rest;
		} else extra.session = sessionKey;
	}
	if (stream) extra.stream = stream;
	if (seq !== void 0) extra.aseq = seq;
	if (!data) return extra;
	if (stream === "assistant") {
		const text = readStringValue(data.text);
		if (text?.trimStart()) extra.text = compactPreview(text);
		const mediaCount = resolveSendableOutboundReplyParts({ mediaUrls: Array.isArray(data.mediaUrls) ? data.mediaUrls : void 0 }).mediaCount;
		if (mediaCount > 0) extra.media = mediaCount;
		return extra;
	}
	if (stream === "tool") {
		const phase = readStringValue(data.phase);
		const name = readStringValue(data.name);
		if (phase || name) extra.tool = `${phase ?? "?"}:${name ?? "?"}`;
		const toolCallId = readStringValue(data.toolCallId);
		if (toolCallId) extra.call = shortId(toolCallId);
		const meta = readStringValue(data.meta);
		if (meta?.trim()) extra.meta = meta;
		if (typeof data.isError === "boolean") extra.err = data.isError;
		return extra;
	}
	if (stream === "lifecycle") {
		const phase = typeof data.phase === "string" ? data.phase : void 0;
		if (phase) extra.phase = phase;
		if (typeof data.aborted === "boolean") extra.aborted = data.aborted;
		const error = typeof data.error === "string" ? data.error : void 0;
		if (error?.trimStart()) extra.error = compactPreview(error, 120);
		return extra;
	}
	const reason = typeof data.reason === "string" ? data.reason : void 0;
	if (reason?.trim()) extra.reason = reason;
	return extra;
}
function logWs(direction, kind, metaInput) {
	if (!shouldLogWs(direction, kind)) return;
	const meta = typeof metaInput === "function" ? metaInput() : metaInput;
	const connId = typeof meta?.connId === "string" ? meta.connId : void 0;
	const id = typeof meta?.id === "string" ? meta.id : void 0;
	const inflightKey = connId && id ? `${connId}:${id}` : void 0;
	let durationMs;
	if (direction === "in" && kind === "req" && inflightKey) {
		wsInflightSince.set(inflightKey, Date.now());
		if (wsInflightSince.size > 2e3) wsInflightSince.clear();
	} else if (direction === "out" && kind === "res" && inflightKey) {
		const startedAt = wsInflightSince.get(inflightKey);
		wsInflightSince.delete(inflightKey);
		if (startedAt !== void 0) durationMs = Date.now() - startedAt;
	}
	const style = getGatewayWsLogStyle();
	if (!isVerbose()) {
		logWsOptimized(direction, kind, meta, durationMs);
		return;
	}
	if (style === "compact" || style === "auto") {
		logWsCompact(direction, kind, meta, durationMs);
		return;
	}
	const method = typeof meta?.method === "string" ? meta.method : void 0;
	const ok = typeof meta?.ok === "boolean" ? meta.ok : void 0;
	const event = typeof meta?.event === "string" ? meta.event : void 0;
	const dirArrow = direction === "in" ? "←" : "→";
	const prefix = `${(direction === "in" ? chalk.greenBright : chalk.cyanBright)(dirArrow)} ${chalk.bold(kind)}`;
	const headline = buildWsHeadline({
		kind,
		method,
		event
	});
	const statusToken = buildWsStatusToken(kind, ok);
	const durationToken = typeof durationMs === "number" ? chalk.dim(`${durationMs}ms`) : void 0;
	const restMeta = collectWsRestMeta(meta);
	const trailing = [];
	if (connId) trailing.push(`${chalk.dim("conn")}=${chalk.gray(shortId(connId))}`);
	if (id) trailing.push(`${chalk.dim("id")}=${chalk.gray(shortId(id))}`);
	logWsInfoLine({
		prefix,
		statusToken,
		headline,
		durationToken,
		restMeta,
		trailing
	});
}
function logWsOptimized(direction, kind, meta, durationMs) {
	const connId = typeof meta?.connId === "string" ? meta.connId : void 0;
	const id = typeof meta?.id === "string" ? meta.id : void 0;
	const ok = typeof meta?.ok === "boolean" ? meta.ok : void 0;
	const method = typeof meta?.method === "string" ? meta.method : void 0;
	if (kind === "parse-error") {
		const errorMsg = typeof meta?.error === "string" ? formatForLog(meta.error) : void 0;
		wsLog.warn([
			`${chalk.redBright("✗")} ${chalk.bold("parse-error")}`,
			errorMsg ? `${chalk.dim("error")}=${errorMsg}` : void 0,
			`${chalk.dim("conn")}=${chalk.gray(shortId(connId ?? "?"))}`
		].filter((t) => Boolean(t)).join(" "));
		return;
	}
	if (direction !== "out" || kind !== "res") return;
	if (!(ok === false || typeof durationMs === "number" && durationMs >= 50)) return;
	const statusToken = buildWsStatusToken("res", ok);
	const durationToken = typeof durationMs === "number" ? chalk.dim(`${durationMs}ms`) : void 0;
	const restMeta = collectWsRestMeta(meta);
	logWsInfoLine({
		prefix: `${chalk.yellowBright("⇄")} ${chalk.bold("res")}`,
		statusToken,
		headline: method ? chalk.bold(method) : void 0,
		durationToken,
		restMeta,
		trailing: [connId ? `${chalk.dim("conn")}=${chalk.gray(shortId(connId))}` : "", id ? `${chalk.dim("id")}=${chalk.gray(shortId(id))}` : ""].filter(Boolean)
	});
}
function logWsCompact(direction, kind, meta, durationMs) {
	const connId = typeof meta?.connId === "string" ? meta.connId : void 0;
	const id = typeof meta?.id === "string" ? meta.id : void 0;
	const method = typeof meta?.method === "string" ? meta.method : void 0;
	const ok = typeof meta?.ok === "boolean" ? meta.ok : void 0;
	if (kind === "req" && direction === "in" && connId && id) return;
	const compactArrow = (() => {
		if (kind === "req" || kind === "res") return "⇄";
		return direction === "in" ? "←" : "→";
	})();
	const prefix = `${(kind === "req" || kind === "res" ? chalk.yellowBright : direction === "in" ? chalk.greenBright : chalk.cyanBright)(compactArrow)} ${chalk.bold(kind)}`;
	const statusToken = buildWsStatusToken(kind, ok);
	const durationToken = typeof durationMs === "number" ? chalk.dim(`${durationMs}ms`) : void 0;
	const headline = buildWsHeadline({
		kind,
		method,
		event: typeof meta?.event === "string" ? meta.event : void 0
	});
	const restMeta = collectWsRestMeta(meta);
	const trailing = [];
	if (connId && connId !== wsLastCompactConnId) {
		trailing.push(`${chalk.dim("conn")}=${chalk.gray(shortId(connId))}`);
		wsLastCompactConnId = connId;
	}
	if (id) trailing.push(`${chalk.dim("id")}=${chalk.gray(shortId(id))}`);
	logWsInfoLine({
		prefix,
		statusToken,
		headline,
		durationToken,
		restMeta,
		trailing
	});
}
//#endregion
export { logWs as n, summarizeAgentEventForWsLog as r, formatForLog as t };
