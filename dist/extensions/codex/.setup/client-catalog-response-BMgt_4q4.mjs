import { n as projectCodexCatalogNativeResponse, r as projectCodexCatalogNativeThread } from "./session-catalog-native-projection-DowriLid.mjs";
import { i as isJsonObject } from "./protocol-CANUwXJ3.mjs";
import { coerceErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { sanitizeTerminalText } from "openclaw/plugin-sdk/text-chunking";
//#region extensions/codex/src/app-server/protocol-json.ts
function isRpcResponse(message) {
	return message !== null && typeof message === "object" && "id" in message && (typeof message.id === "number" || typeof message.id === "string") && !("method" in message);
}
//#endregion
//#region extensions/codex/src/app-server/client-line-preview.ts
const CODEX_APP_SERVER_PARSE_LOG_MAX = 500;
function redactCodexAppServerLinePreview(value) {
	const redacted = value.replace(/\s+/g, " ").trim().replace(/(Bearer\s+)[A-Za-z0-9._~+/-]+/gi, "$1<redacted>").replace(/("(?:api_?key|authorization|token|access_token|refresh_token)"\s*:\s*")([^"]+)(")/gi, "$1<redacted>$3").replace(/\b([a-z0-9_]*(?:api_?key|authorization|access_token|refresh_token|token))(\s*=\s*)(["']?)[^\s"']+(\3)/gi, "$1$2$3<redacted>$4");
	return redacted.length > CODEX_APP_SERVER_PARSE_LOG_MAX ? `${truncateUtf16Safe(redacted, CODEX_APP_SERVER_PARSE_LOG_MAX)}...` : redacted;
}
//#endregion
//#region extensions/codex/src/app-server/client-message-decoder.ts
const PARSE_BUFFER_MAX = 8388608;
const PARSE_BUFFER_MAX_LINES = 1e3;
const UNICODE_ESCAPE_QUAD = /^[\da-fA-F]{4}$/u;
/** Recovers the raw newlines observed inside native JSON string values. */
var CodexAppServerMessageDecoder = class {
	constructor(reportError) {
		this.reportError = reportError;
	}
	clear() {
		this.pending = void 0;
	}
	get hasPending() {
		return this.pending !== void 0;
	}
	parse(line) {
		const rawLine = line.endsWith("\r") ? line.slice(0, -1) : line;
		if (this.pending) return this.parseContinuation(rawLine, this.pending);
		const trimmed = rawLine.trim();
		if (!trimmed) return;
		try {
			return JSON.parse(trimmed);
		} catch (error) {
			if (isRecoverableParseFailure(trimmed, error)) {
				const text = rawLine.trimStart();
				this.pending = {
					fragments: [text],
					length: text.length,
					inString: endsInsideJsonString(text)
				};
			} else this.reportError(trimmed, error, 1);
		}
	}
	parseContinuation(line, pending) {
		pending.fragments.push(line);
		pending.length += 2 + line.length;
		const withinBounds = pending.length <= PARSE_BUFFER_MAX && pending.fragments.length <= PARSE_BUFFER_MAX_LINES;
		if (withinBounds && pending.inString && scanJsonString(line, 0) === line.length) return;
		const candidate = pending.fragments.join("\\n");
		this.pending = void 0;
		try {
			return JSON.parse(candidate);
		} catch (error) {
			if (withinBounds && isRecoverableParseFailure(candidate, error)) {
				pending.inString = endsInsideJsonString(candidate);
				this.pending = pending;
			} else this.reportError(candidate, error, pending.fragments.length);
		}
	}
};
function isRecoverableParseFailure(value, error) {
	if (!value.startsWith("{") && !value.startsWith("[")) return false;
	const message = coerceErrorMessage(error);
	return message.includes("Unterminated string") || message.includes("Unexpected end of JSON input");
}
function endsInsideJsonString(value) {
	for (let index = 0; index < value.length; index++) {
		if (value[index] !== "\"") continue;
		const end = scanJsonString(value, index + 1);
		if (end < 0) return false;
		if (end === value.length) return true;
		index = end;
	}
	return false;
}
/** Finds a closing quote; incomplete or invalid escapes require native parsing. */
function scanJsonString(value, start) {
	for (let index = start; index < value.length; index++) {
		const character = value[index];
		if (character === "\"") return index;
		if (value.charCodeAt(index) < 32) return -1;
		if (character !== "\\") continue;
		const escape = value[++index];
		if (escape === "u") {
			if (!UNICODE_ESCAPE_QUAD.test(value.slice(index + 1, index + 5))) return -1;
			index += 4;
		} else if (!escape || !"\"\\/bfnrt".includes(escape)) return -1;
	}
	return value.length;
}
//#endregion
//#region extensions/codex/src/app-server/client-message-frames.ts
const UNPAIRED_SURROGATE_RE = /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g;
/** One byte reader owns framing and stops at an asynchronous page decode. */
function listenCodexAppServerLines(input, onLine, onError) {
	let fragments = [];
	let length = 0;
	let remainder;
	let waiting = false;
	let ended = false;
	let closed = false;
	const close = () => {
		closed = true;
		fragments = [];
		remainder = void 0;
		input.off("data", onData);
		input.off("end", onEnd);
		input.pause();
	};
	const deliver = (tail) => {
		const line = fragments.length ? Buffer.concat([...fragments, tail], length + tail.length) : tail;
		fragments = [];
		length = 0;
		const completion = onLine(line);
		if (!completion) return true;
		waiting = true;
		input.pause();
		completion.then(() => {
			waiting = false;
			if (!closed) {
				drain();
				if (!waiting && !ended && !closed) input.resume();
			}
		}).catch((error) => {
			close();
			onError(error);
		});
		return false;
	};
	const drain = () => {
		try {
			const chunk = remainder;
			remainder = void 0;
			if (chunk) {
				let start = 0;
				let end;
				while ((end = chunk.indexOf(10, start)) !== -1) {
					if (closed) return;
					remainder = chunk.subarray(end + 1);
					if (!deliver(chunk.subarray(start, end))) return;
					remainder = void 0;
					start = end + 1;
				}
				if (!closed && start < chunk.length) {
					fragments.push(chunk.subarray(start));
					length += chunk.length - start;
				}
			}
			if (ended && !closed) {
				if (length && !deliver(Buffer.alloc(0))) return;
				close();
			}
		} catch (error) {
			close();
			onError(error);
		}
	};
	const onData = (chunk) => {
		remainder = chunk;
		drain();
	};
	const onEnd = () => {
		ended = true;
		if (!waiting) drain();
	};
	input.on("data", onData);
	input.once("end", onEnd);
	return close;
}
function codexCatalogResponseRoute(id) {
	return typeof id === "number" && Number.isSafeInteger(id) && id >= 2 ** 52 ? {
		id,
		kind: id % 2 === 1 ? "list" : "thread"
	} : void 0;
}
/** Read bounded envelope keys and IDs; skip native payload strings as bytes. */
function readCodexCatalogDecodeRoute(line) {
	let depth = 0;
	let route;
	let response = false;
	for (let index = 0; index < line.length; index++) {
		const byte = line[index];
		if (byte === 123 || byte === 91) depth++;
		else if (byte === 125 || byte === 93) depth--;
		else if (byte === 34) {
			const start = index;
			for (;;) {
				index = line.indexOf(34, index + 1);
				if (index < 0) return "unresolved";
				let slash = index - 1;
				while (line[slash] === 92) slash--;
				if ((index - slash) % 2 === 1) break;
			}
			if (depth !== 1 || index - start > 64) continue;
			let colon = index + 1;
			while (line[colon] === 32 || line[colon] === 9 || line[colon] === 13) colon++;
			if (line[colon] !== 58) continue;
			const token = line.toString("utf8", start, index + 1);
			let key = token.slice(1, -1);
			if (token.includes("\\")) try {
				key = JSON.parse(token);
			} catch {
				return "unresolved";
			}
			if (key === "method") return;
			if (key === "result" || key === "error") {
				response = true;
				if (route) return route;
			}
			if (key !== "id") continue;
			const match = /^\s*:\s*(\d+)(?=\s*[,}])/u.exec(line.toString("utf8", index + 1, Math.min(index + 100, line.length)));
			if (!match) continue;
			route = codexCatalogResponseRoute(Number(match[1]));
			if (!route || response) return route;
		}
	}
	return response || route ? "unresolved" : void 0;
}
function stringifyCodexAppServerMessage(message) {
	return JSON.stringify(message, (_key, value) => typeof value === "string" ? value.replace(UNPAIRED_SURROGATE_RE, "") : value) ?? "null";
}
//#endregion
//#region extensions/codex/src/app-server/client-catalog-response.ts
/** The worker retains recovery fragments, but never a completed native page. */
function createCodexCatalogDecoder() {
	let failures = [];
	const decoder = new CodexAppServerMessageDecoder((value, error, fragmentCount) => {
		failures.push({
			value: redactCodexAppServerLinePreview(value),
			error,
			fragmentCount
		});
	});
	return (input) => {
		failures = [];
		const result = projectCodexCatalogMessage(decoder.parse(Buffer.from(input.bytes.buffer, input.bytes.byteOffset, input.bytes.byteLength).toString("utf8")), input);
		result.pending = decoder.hasPending;
		result.failures = failures;
		return result;
	};
}
function projectCodexCatalogMessage(parsed, input, cachedPreview) {
	const result = {
		pending: false,
		failures: []
	};
	if (!isJsonObject(parsed)) return result;
	result.message = parsed;
	if (!isRpcResponse(parsed)) return result;
	const message = parsed;
	const route = codexCatalogResponseRoute(message.id);
	if (message.error || !route) return result;
	const remainingRows = input.route === "unresolved" ? input.catalogRows?.has(route.id) ? input.catalogRows.get(route.id) : 0 : input.remainingRows;
	try {
		if (!isJsonObject(message.result)) throw new Error("Codex catalog response contains an invalid result");
		if (route.kind === "list") {
			const raw = message.result;
			message.result = projectCodexCatalogNativeResponse(raw, sanitizeTerminalText, cachedPreview, remainingRows);
			if (!cachedPreview) result.previewStates = Array.isArray(raw.data) ? raw.data.slice(0, Array.isArray(message.result.data) ? message.result.data.length : 0).map((row) => isJsonObject(row) && typeof row.preview === "string" ? Boolean(row.preview) : void 0) : [];
		} else {
			const thread = message.result.thread;
			message.result = { thread: {
				...projectCodexCatalogNativeThread(thread, sanitizeTerminalText),
				...isJsonObject(thread) && typeof thread.cwd === "string" ? { cwd: thread.cwd } : {},
				...isJsonObject(thread) && (thread.historyMode === "paginated" || thread.historyMode === "legacy") ? { historyMode: thread.historyMode } : {}
			} };
		}
	} catch (error) {
		delete result.message;
		result.projectionError = {
			id: route.id,
			error: error instanceof Error ? error : new Error("Codex catalog projection failed", { cause: error })
		};
	}
	return result;
}
//#endregion
export { stringifyCodexAppServerMessage as a, isRpcResponse as c, readCodexCatalogDecodeRoute as i, projectCodexCatalogMessage as n, CodexAppServerMessageDecoder as o, listenCodexAppServerLines as r, redactCodexAppServerLinePreview as s, createCodexCatalogDecoder as t };
