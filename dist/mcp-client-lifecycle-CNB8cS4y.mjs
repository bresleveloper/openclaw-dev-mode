import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as mergeProcessEnv } from "./process-env-DlZFJzq6.mjs";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-DspuXlEe.mjs";
import { b as redactToolPayloadText } from "./redact-B5EGyLvV.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as recordAgentCleanupFailure } from "./run-cleanup-timeout-BlChlpzQ.mjs";
import { i as settlesWithin, n as closeOwnedStdioProcess, r as createOwnedStdioProcess, t as OwnedStdioCleanupError } from "./owned-stdio-B_QaseFA.mjs";
import process from "node:process";
import fs from "node:fs/promises";
import { PassThrough } from "node:stream";
import { ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { StreamableHTTPClientTransport, StreamableHTTPError } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { SSEClientTransport, SseError } from "@modelcontextprotocol/sdk/client/sse.js";
import { ReadBuffer, STDIO_DEFAULT_MAX_BUFFER_SIZE, serializeMessage } from "@modelcontextprotocol/sdk/shared/stdio.js";
import { getDefaultEnvironment } from "@modelcontextprotocol/sdk/client/stdio.js";
//#region src/agents/mcp-error.ts
const STREAMABLE_RESPONSE_BODY_MARKER = "Error POSTing to endpoint:";
const LEGACY_RESPONSE_BODY_RE = /Error POSTing to endpoint \(HTTP \d+\):/;
/** MCP lifecycle errors use the protocol code, including serialized SDK errors. */
function isMcpRequestTimeoutError(error) {
	return isRecord(error) && error.code === ErrorCode.RequestTimeout;
}
/** Redacts MCP diagnostics, including response bodies the SDK includes in thrown errors. */
function redactMcpDiagnosticError(error) {
	let message = formatErrorMessage(error);
	const streamableIndex = message.indexOf(STREAMABLE_RESPONSE_BODY_MARKER);
	const legacyMatch = LEGACY_RESPONSE_BODY_RE.exec(message);
	const prefixEnd = streamableIndex >= 0 ? streamableIndex + 26 : legacyMatch ? legacyMatch.index + legacyMatch[0].length : void 0;
	if (prefixEnd !== void 0) message = `${message.slice(0, prefixEnd)} [redacted response body]`;
	return redactToolPayloadText(redactSensitiveUrlLikeString(message));
}
//#endregion
//#region src/agents/mcp-http-transport.ts
const STREAM_RETRY_EXHAUSTED_RE = /^Maximum reconnection attempts \(\d+\) exceeded\.$/;
const SESSION_TERMINATION_TIMEOUT_MS = 5e3;
var McpSseSessionExpiredError = class extends Error {};
var McpHttpResponseTooLargeError = class extends Error {
	constructor(unit) {
		super(`MCP ${unit} exceeds ${STDIO_DEFAULT_MAX_BUFFER_SIZE} bytes`);
		this.code = "MCP_HTTP_RESPONSE_TOO_LARGE";
		this.name = "McpHttpResponseTooLargeError";
	}
};
function isMcpSseEventTooLargeError(error) {
	return error.message.includes(`MCP SSE event exceeds ${STDIO_DEFAULT_MAX_BUFFER_SIZE} bytes`);
}
function isEventStreamResponse(response) {
	return response.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase() === "text/event-stream";
}
function limitMcpResponseStream(body, eventStream) {
	let messageBytes = 0;
	let retainedEventBytes = 0;
	let lineBytes = 0;
	let lineIsComment = false;
	let previousByteWasCr = false;
	const checkEventLimit = () => {
		if (retainedEventBytes + lineBytes > STDIO_DEFAULT_MAX_BUFFER_SIZE) throw new McpHttpResponseTooLargeError("SSE event");
	};
	const finishEventLine = () => {
		if (lineBytes === 0) retainedEventBytes = 0;
		else if (!lineIsComment) retainedEventBytes += lineBytes + 1;
		lineBytes = 0;
		lineIsComment = false;
		checkEventLimit();
	};
	return body.pipeThrough(new TransformStream({ transform(chunk, controller) {
		if (!eventStream) {
			messageBytes += chunk.byteLength;
			if (messageBytes > STDIO_DEFAULT_MAX_BUFFER_SIZE) throw new McpHttpResponseTooLargeError("HTTP response");
			controller.enqueue(chunk);
			return;
		}
		const bytes = Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength);
		let cursor = previousByteWasCr && bytes[0] === 10 ? 1 : 0;
		if (bytes.length > 0) previousByteWasCr = false;
		let lf = bytes.indexOf(10, cursor);
		let cr = bytes.indexOf(13, cursor);
		while (cursor < bytes.length) {
			const delimiter = lf < 0 ? cr : cr < 0 ? lf : Math.min(lf, cr);
			const end = delimiter < 0 ? bytes.length : delimiter;
			if (end > cursor) {
				if (lineBytes === 0) lineIsComment = bytes[cursor] === 58;
				lineBytes += end - cursor;
				previousByteWasCr = false;
				checkEventLimit();
			}
			if (delimiter < 0) break;
			finishEventLine();
			previousByteWasCr = bytes[delimiter] === 13;
			cursor = delimiter + 1;
			if (previousByteWasCr && bytes[cursor] === 10) {
				cursor += 1;
				previousByteWasCr = false;
			}
			if (lf >= 0 && lf < cursor) lf = bytes.indexOf(10, cursor);
			if (cr >= 0 && cr < cursor) cr = bytes.indexOf(13, cursor);
		}
		controller.enqueue(chunk);
	} }));
}
function limitMcpHttpResponse(response) {
	if (!response.body) return response;
	return new Response(limitMcpResponseStream(response.body, isEventStreamResponse(response)), {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers
	});
}
function withMcpHttpResponseLimits(fetchFn) {
	return async (input, init) => limitMcpHttpResponse(await fetchFn(input, init));
}
function toEventSourceByteStream(body) {
	if (body instanceof ReadableStream) return body;
	const reader = body.getReader();
	return new ReadableStream({
		async pull(controller) {
			const result = await reader.read();
			if (result.done) {
				controller.close();
				return;
			}
			if (!(result.value instanceof Uint8Array)) {
				await reader.cancel();
				throw new TypeError("MCP SSE response body must contain byte chunks");
			}
			controller.enqueue(new Uint8Array(result.value));
		},
		async cancel() {
			await reader.cancel();
		}
	});
}
function limitMcpEventSourceResponse(response) {
	if (!response.body && response instanceof Response) return response;
	const headers = response instanceof Response ? response.headers : new Headers();
	if (!(response instanceof Response)) for (const name of ["content-type", "www-authenticate"]) {
		const value = response.headers.get(name);
		if (value) headers.set(name, value);
	}
	const body = response.body ? limitMcpResponseStream(toEventSourceByteStream(response.body), true) : null;
	const limitedResponse = new Response(body, {
		status: response.status,
		...response instanceof Response ? { statusText: response.statusText } : {},
		headers
	});
	Object.defineProperties(limitedResponse, {
		url: { value: response.url },
		redirected: { value: response.redirected }
	});
	return limitedResponse;
}
var OpenClawMcpHttpTransport = class {
	constructor() {
		this.closed = false;
		this.closeEmitted = false;
	}
	emitClose() {
		if (this.closeEmitted) return;
		this.closeEmitted = true;
		this.onclose?.();
	}
	emitError(error) {
		if (!this.closed) this.onerror?.(error);
	}
};
/** Converts legacy SSE terminal HTTP failures into the lifecycle close the SDK omits. */
var OpenClawSSEClientTransport = class extends OpenClawMcpHttpTransport {
	constructor(url, options) {
		super();
		const baseFetch = options?.fetch ?? fetch;
		const limitedFetch = withMcpHttpResponseLimits(baseFetch);
		const eventSourceInit = options?.eventSourceInit;
		const configuredEventSourceFetch = eventSourceInit?.fetch;
		this.transport = new SSEClientTransport(url, {
			...options,
			fetch: async (input, init) => {
				const response = await limitedFetch(input, init);
				if (init?.method === "POST" && response.status === 404) throw new McpSseSessionExpiredError(`Error POSTing to endpoint (HTTP 404): ${await response.text().catch(() => null)}`);
				return response;
			},
			eventSourceInit: {
				...eventSourceInit,
				fetch: async (eventUrl, init) => {
					return limitMcpEventSourceResponse(configuredEventSourceFetch ? await configuredEventSourceFetch(eventUrl, init) : await baseFetch(eventUrl, init));
				}
			}
		});
	}
	async start() {
		this.transport.onmessage = (message) => this.onmessage?.(message);
		this.transport.onclose = () => this.emitClose();
		this.transport.onerror = (error) => {
			this.emitError(error);
			if (isMcpSseEventTooLargeError(error) || error instanceof SseError && error.code !== void 0) {
				this.close();
				setTimeout(() => void this.transport.close(), 0).unref?.();
			}
		};
		await this.transport.start();
	}
	async close() {
		if (this.closed) return;
		this.closed = true;
		await this.transport.close();
		this.emitClose();
	}
	async send(message) {
		if (this.closed) throw new Error("MCP SSE transport is closed");
		await this.transport.send(message);
	}
	setProtocolVersion(version) {
		this.transport.setProtocolVersion(version);
	}
};
/** Owns Streamable HTTP notification recovery and stateful cleanup around SDK 1.30.0. */
var OpenClawStreamableHTTPClientTransport = class extends OpenClawMcpHttpTransport {
	constructor(url, options = {}) {
		super();
		this.pendingExpiredNotificationGet = false;
		this.url = url;
		this.cleanupFetch = options.fetch ?? fetch;
		this.requestInit = options.requestInit;
		const runtimeFetch = async (input, init) => {
			if (this.closed) throw new Error("MCP Streamable HTTP transport is closed");
			const response = limitMcpHttpResponse(await this.cleanupFetch(input, init));
			if (init?.method === "GET" && response.status === 404 && this.sessionId !== void 0) this.pendingExpiredNotificationGet = true;
			return response;
		};
		this.transport = new StreamableHTTPClientTransport(url, {
			...options,
			fetch: runtimeFetch
		});
	}
	get sessionId() {
		return this.transport.sessionId;
	}
	get protocolVersion() {
		return this.transport.protocolVersion;
	}
	async start() {
		this.transport.onmessage = (message) => this.onmessage?.(message);
		this.transport.onclose = () => this.emitClose();
		this.transport.onerror = (error) => {
			if (this.closed) {
				setTimeout(() => void this.transport.close(), 0).unref?.();
				return;
			}
			this.emitError(error);
			const sessionExpired = this.pendingExpiredNotificationGet && error instanceof StreamableHTTPError && error.code === 404;
			if (sessionExpired) this.pendingExpiredNotificationGet = false;
			if (isMcpSseEventTooLargeError(error) || sessionExpired || STREAM_RETRY_EXHAUSTED_RE.test(error.message)) this.close();
		};
		await this.transport.start();
	}
	async close() {
		if (this.closed) return;
		this.closed = true;
		await this.transport.close();
		this.emitClose();
	}
	async send(message, options) {
		await this.transport.send(message, options);
	}
	setProtocolVersion(version) {
		this.transport.setProtocolVersion(version);
	}
	/** Uses a fresh request signal because failed initialization makes the SDK's signal unusable. */
	async terminateSession() {
		const sessionId = this.sessionId;
		if (!sessionId || sessionId === this.terminatedSessionId) return;
		const headers = new Headers(this.requestInit?.headers);
		headers.set("mcp-session-id", sessionId);
		if (this.protocolVersion) headers.set("mcp-protocol-version", this.protocolVersion);
		const response = await this.cleanupFetch(this.url, {
			...this.requestInit,
			method: "DELETE",
			headers,
			signal: AbortSignal.timeout(SESSION_TERMINATION_TIMEOUT_MS)
		});
		response.body?.cancel().catch(() => void 0);
		if (!response.ok && response.status !== 404 && response.status !== 405) throw new StreamableHTTPError(response.status, `Failed to terminate session: ${response.statusText}`);
		this.terminatedSessionId = sessionId;
	}
};
//#endregion
//#region src/agents/mcp-stdio-transport.ts
/**
* OpenClaw stdio transport wrapper for MCP server subprocesses.
*/
var OpenClawStdioClientTransport = class {
	constructor(serverParams) {
		this.serverParams = serverParams;
		this.stderrStream = null;
		this.forceRequested = false;
		this.closeNotified = false;
		this.startupAbort = new AbortController();
		this.readBuffer = serverParams.decoder ?? new ReadBuffer();
		if (serverParams.stderr === "pipe" || serverParams.stderr === "overlapped") this.stderrStream = new PassThrough();
	}
	async start() {
		if (this.starting || this.closing) throw new Error("OpenClawStdioClientTransport already started or closed; Client.connect() starts transports automatically.");
		this.starting = this.startProcess();
		return this.starting;
	}
	async startProcess() {
		const prepareDataDir = this.serverParams.prepareDataDir?.trim();
		if (prepareDataDir) try {
			await fs.mkdir(prepareDataDir, { recursive: true });
		} catch (error) {
			throw new Error(`unable to prepare PLUGIN_DATA directory "${prepareDataDir}": ${formatErrorMessage(error)}`, { cause: error });
		}
		if (this.startupAbort.signal.aborted) throw new Error("MCP stdio transport is closed");
		try {
			const child = await createOwnedStdioProcess({
				argv: [this.serverParams.command, ...this.serverParams.args ?? []],
				cwd: this.serverParams.cwd,
				env: this.serverParams.exactEnv ? mergeProcessEnv([this.serverParams.env]) : mergeProcessEnv([getDefaultEnvironment(), this.serverParams.env]),
				...this.serverParams.exactEnv ? { exactEnv: true } : {},
				abortSignal: this.startupAbort.signal,
				stderrDestination: this.stderrStream ?? (this.serverParams.stderr === "ignore" ? void 0 : process.stderr)
			});
			this.process = child;
			child.onError((error) => this.onerror?.(error));
			const receive = (chunk) => {
				if (this.closing) return;
				try {
					this.readBuffer.append(chunk);
					this.processReadBuffer();
				} catch (error) {
					this.onerror?.(error instanceof Error ? error : new Error(String(error)));
					this.close().catch(() => {});
				}
			};
			child.onStdout((text) => {
				if (!child.supportsRawOutput) receive(Buffer.from(text));
			}, receive);
			if (this.serverParams.stderr === "ignore") child.onStderr(() => {});
			child.wait().then((exit) => {
				try {
					this.onexit?.(exit);
				} catch (error) {
					this.onerror?.(error instanceof Error ? error : new Error(String(error)));
				} finally {
					this.close().catch(() => {});
					this.notifyClosed();
				}
			}, (error) => {
				this.onerror?.(error instanceof Error ? error : new Error(String(error)));
				this.close().catch(() => {});
				this.notifyClosed();
			});
		} catch (error) {
			if (error instanceof OwnedStdioCleanupError) {
				this.startupCleanupError = error;
				recordAgentCleanupFailure();
			}
			this.onerror?.(error instanceof Error ? error : new Error(String(error)));
			throw error;
		}
	}
	get stderr() {
		return this.stderrStream;
	}
	get pid() {
		return this.process?.pid ?? null;
	}
	get cleanupResult() {
		return this.cleanup;
	}
	notifyClosed() {
		if (this.closeNotified) return;
		this.closeNotified = true;
		this.onclose?.();
	}
	processReadBuffer() {
		while (!this.closing) try {
			const message = this.readBuffer.readMessage();
			if (message === null) break;
			this.onmessage?.(message);
		} catch (error) {
			this.onerror?.(error instanceof Error ? error : new Error(String(error)));
		}
	}
	close() {
		if (this.starting && !this.process) this.startupAbort.abort();
		this.closing ??= (async () => {
			await this.starting?.catch(() => void 0);
			try {
				if (this.startupCleanupError) throw this.startupCleanupError;
				if (this.process) this.cleanup = await closeOwnedStdioProcess(this.process, { force: this.forceRequested });
			} catch (error) {
				recordAgentCleanupFailure();
				throw error;
			} finally {
				this.process = void 0;
				this.readBuffer.clear();
				this.stderrStream?.end();
				this.notifyClosed();
			}
		})();
		this.closing.catch(() => recordAgentCleanupFailure());
		return this.closing;
	}
	/** Retire RPC admission now; the returned promise still joins owned-process cleanup. */
	retire() {
		const closing = this.close();
		this.readBuffer.clear();
		this.notifyClosed();
		return closing;
	}
	terminate() {
		this.process?.kill("SIGTERM");
		return this.retire();
	}
	forceClose() {
		this.forceRequested = true;
		this.process?.kill("SIGKILL");
		return this.close();
	}
	send(message) {
		return new Promise((resolve, reject) => {
			const stdin = this.closing ? void 0 : this.process?.stdin;
			if (!stdin) throw new Error("Not connected");
			const json = serializeMessage(message);
			try {
				stdin.write(json, (err) => {
					if (err) reject(err);
					else resolve();
				});
			} catch (err) {
				reject(err instanceof Error ? err : new Error(String(err)));
			}
		});
	}
};
//#endregion
//#region src/agents/mcp-client-lifecycle.ts
var McpClientConnectTimeoutError = class extends Error {};
/** Matches an expired HTTP session without treating stateless HTTP 404s as expiration. */
function isMcpHttpSessionExpired(session, error) {
	if (session.transportType === "sse") return session.transport instanceof OpenClawSSEClientTransport && error instanceof McpSseSessionExpiredError;
	return session.transportType === "streamable-http" && session.transport instanceof OpenClawStreamableHTTPClientTransport && session.transport.sessionId !== void 0 && error instanceof StreamableHTTPError && error.code === 404;
}
async function connectMcpClient(params) {
	const deadline = AbortSignal.timeout(params.timeoutMs);
	const signal = params.signal ? AbortSignal.any([params.signal, deadline]) : deadline;
	let onAbort;
	const aborted = new Promise((_, reject) => {
		onAbort = () => reject(signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("MCP startup aborted"));
		if (signal.aborted) onAbort();
		else signal.addEventListener("abort", onAbort, { once: true });
	});
	try {
		await Promise.race([(async () => {
			const { client } = params;
			const close = client.close;
			client.close = () => {
				const closing = close.call(client);
				closing.catch(() => recordAgentCleanupFailure());
				return closing;
			};
			try {
				await client.connect(params.transport, {
					signal,
					timeout: params.timeoutMs,
					maxTotalTimeout: params.timeoutMs
				});
			} finally {
				client.close = close;
			}
		})(), aborted]);
	} catch (error) {
		if (deadline.aborted || isMcpRequestTimeoutError(error)) {
			await disposeMcpClient({
				client: params.client,
				transport: params.transport,
				transportType: params.transport instanceof OpenClawStdioClientTransport ? "stdio" : params.transport instanceof OpenClawStreamableHTTPClientTransport ? "streamable-http" : "sse"
			}, Math.min(params.timeoutMs, 1e3));
			throw new McpClientConnectTimeoutError(`MCP server connection timed out after ${params.timeoutMs}ms`, { cause: error });
		}
		throw error;
	} finally {
		if (onAbort) signal.removeEventListener("abort", onAbort);
	}
}
async function disposeMcpClient(session, timeoutMs = 5e3) {
	let failed = false;
	const markFailed = () => {
		failed = true;
		recordAgentCleanupFailure();
	};
	const ignoreCloseFailure = async (close) => {
		try {
			await close();
		} catch (error) {
			const firstFailure = !failed;
			markFailed();
			if (firstFailure) try {
				session.onCleanupError?.(error);
			} catch {}
		}
	};
	try {
		const graceful = (async () => {
			if (session.transportType === "streamable-http") await ignoreCloseFailure(() => session.transport.terminateSession?.());
			await ignoreCloseFailure(() => session.transport.close());
			await ignoreCloseFailure(() => session.client.close());
		})();
		if (await settlesWithin(graceful, timeoutMs)) return failed ? "uncertain" : "closed";
		const { transport } = session;
		const closeTransport = session.transportType === "stdio" && transport instanceof OpenClawStdioClientTransport ? () => transport.forceClose() : () => transport.close();
		if (!await settlesWithin(Promise.all([
			graceful,
			ignoreCloseFailure(closeTransport),
			ignoreCloseFailure(() => session.client.close())
		]), timeoutMs)) markFailed();
		return failed ? "uncertain" : "closed";
	} finally {
		session.detachStderr?.();
	}
}
//#endregion
export { OpenClawStdioClientTransport as a, isMcpRequestTimeoutError as c, isMcpHttpSessionExpired as i, redactMcpDiagnosticError as l, connectMcpClient as n, OpenClawSSEClientTransport as o, disposeMcpClient as r, OpenClawStreamableHTTPClientTransport as s, McpClientConnectTimeoutError as t };
