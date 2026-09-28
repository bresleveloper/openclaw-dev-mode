import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { a as OpenClawStdioClientTransport, c as isMcpRequestTimeoutError, n as connectMcpClient, r as disposeMcpClient } from "./mcp-client-lifecycle-CNB8cS4y.mjs";
import { JSONRPCMessageSchema, McpError, ResultSchema } from "@modelcontextprotocol/sdk/types.js";
import { Protocol } from "@modelcontextprotocol/sdk/shared/protocol.js";
//#region src/agents/mcp-stdio-frame-decoder.ts
var McpStdioFrameError = class extends Error {};
var McpStdioFrameDecoder = class {
	constructor(maxFrameBytes) {
		this.maxFrameBytes = maxFrameBytes;
		this.pending = Buffer.alloc(0);
		this.pendingBytes = 0;
		this.chunk = Buffer.alloc(0);
		this.cursor = 0;
	}
	append(chunk) {
		if (this.pendingBytes + chunk.length > this.maxFrameBytes) throw new McpStdioFrameError("response exceeded the line-size limit");
		this.chunk = chunk;
		this.cursor = 0;
	}
	readMessage() {
		while (this.cursor < this.chunk.length) {
			const newline = this.chunk.indexOf(10, this.cursor);
			if (newline < 0) {
				this.appendPending(this.chunk.subarray(this.cursor));
				this.chunk = Buffer.alloc(0);
				this.cursor = 0;
				return null;
			}
			let line = this.chunk.subarray(this.cursor, newline);
			this.cursor = newline + 1;
			if (this.pendingBytes > 0) {
				this.appendPending(line);
				line = this.pending.subarray(0, this.pendingBytes);
				this.pending = Buffer.alloc(0);
				this.pendingBytes = 0;
			}
			if (this.cursor === this.chunk.length) {
				this.chunk = Buffer.alloc(0);
				this.cursor = 0;
			}
			if (line.length === 0) continue;
			let response;
			try {
				response = JSON.parse(line.toString("utf8"));
			} catch (cause) {
				throw new McpStdioFrameError("proxy returned invalid JSON", { cause });
			}
			if (!isRecord(response) || response.jsonrpc !== "2.0") throw new McpStdioFrameError("proxy returned an invalid JSON-RPC version");
			if (("result" in response || "error" in response) && !Number.isSafeInteger(response.id)) throw new McpStdioFrameError("proxy returned an invalid response id");
			try {
				return JSONRPCMessageSchema.parse(response);
			} catch (cause) {
				throw new McpStdioFrameError("proxy returned an invalid JSON-RPC message", { cause });
			}
		}
		return null;
	}
	clear() {
		this.pending = Buffer.alloc(0);
		this.pendingBytes = 0;
		this.chunk = Buffer.alloc(0);
		this.cursor = 0;
	}
	appendPending(chunk) {
		const required = this.pendingBytes + chunk.length;
		if (required > this.pending.length) {
			const capacity = Math.min(this.maxFrameBytes, Math.max(required, this.pending.length * 2));
			const pending = Buffer.allocUnsafe(capacity);
			this.pending.copy(pending, 0, 0, this.pendingBytes);
			this.pending = pending;
		}
		chunk.copy(this.pending, this.pendingBytes);
		this.pendingBytes = required;
	}
};
//#endregion
//#region src/agents/mcp-stdio-client.ts
/**
* A strict client for a caller-owned stdio MCP proxy process fronting a stateful driver.
* Any connection anomaly retires the whole connection; the caller supplies the error taxonomy.
*/
function createMcpStdioClient(params) {
	const { errors, startupTimeoutMs } = params;
	let available = false;
	let stopped = false;
	let failure;
	let shutdown;
	let cleanupError;
	let inFlight = 0;
	let stderr = Buffer.alloc(0);
	class StdioProtocol extends Protocol {
		async connect(transport, options) {
			const signal = options?.signal;
			const onAbort = () => fail(errors.unavailable(`initialize timed out after ${startupTimeoutMs}ms`));
			signal?.addEventListener("abort", onAbort, { once: true });
			try {
				await super.connect(transport);
				if ((await request("initialize", {
					protocolVersion: params.protocolVersion,
					capabilities: {},
					clientInfo: params.clientInfo
				}, { timeoutMs: startupTimeoutMs })).protocolVersion !== params.protocolVersion) throw errors.protocol("proxy returned an incompatible protocol version");
				await this.notification({
					method: "notifications/initialized",
					params: {}
				});
				available = !stopped && !failure;
			} finally {
				signal?.removeEventListener("abort", onAbort);
			}
		}
		assertCapabilityForMethod() {}
		assertNotificationCapability() {}
		assertRequestHandlerCapability(method) {
			if (method !== "ping") throw new Error(`MCP stdio request handler is not supported: ${method}`);
		}
		assertTaskCapability() {
			throw new Error("MCP task helpers are not exposed by this client");
		}
		assertTaskHandlerCapability() {
			throw new Error("MCP task helpers are not exposed by this client");
		}
	}
	class StdioTransport extends OpenClawStdioClientTransport {
		constructor(..._args) {
			super(..._args);
			this.onerror = (error) => fail(error instanceof McpStdioFrameError ? errors.protocol(error.message, error.cause) : errors.unavailable("proxy failed to start", error));
			this.onexit = ({ code, signal }) => {
				if (!stopped && !failure) {
					const tail = stderr.toString("utf8").trim();
					fail(errors.unavailable(`proxy exited (${signal ?? code ?? "unknown"})${tail ? `: ${tail}` : ""}`));
				}
			};
		}
		async send(message) {
			if ("method" in message && message.method === "notifications/cancelled") return;
			try {
				await super.send(message);
			} catch (error) {
				fail(errors.unavailable("proxy write failed", error));
				throw error;
			}
		}
	}
	const transport = new StdioTransport({
		command: params.command,
		args: params.args,
		env: params.env,
		exactEnv: true,
		stderr: "pipe",
		decoder: new McpStdioFrameDecoder(params.maxFrameBytes)
	});
	const protocol = new StdioProtocol();
	const onStderr = (chunk) => {
		stderr = Buffer.concat([stderr, chunk]).subarray(-32768);
	};
	transport.stderr?.on("data", onStderr);
	const startup = connectMcpClient({
		client: protocol,
		transport,
		timeoutMs: startupTimeoutMs
	}).catch((error) => {
		fail(error instanceof Error ? error : errors.unavailable("proxy failed to start", error));
		throw failure ?? error;
	});
	startup.catch(() => {});
	function beginShutdown() {
		shutdown ??= disposeMcpClient({
			client: protocol,
			transport,
			transportType: "stdio",
			detachStderr: () => transport.stderr?.off("data", onStderr),
			onCleanupError: (error) => {
				cleanupError = error;
			}
		}).then((outcome) => {
			if (outcome !== "closed") throw errors.unavailable("proxy cleanup could not be confirmed", cleanupError);
		});
		shutdown.catch(() => {});
	}
	function fail(error) {
		if (failure || stopped) return;
		failure = error;
		available = false;
		transport.terminate().catch(() => void 0);
		beginShutdown();
	}
	async function request(method, requestParams, { timeoutMs, signal }) {
		if (failure) throw failure;
		if (stopped) throw errors.unavailable("proxy is stopping");
		if (signal?.aborted) throw errors.unavailable("request was cancelled", signal.reason);
		if (inFlight >= params.maxPendingRequests) throw errors.unavailable("proxy has too many pending requests");
		inFlight += 1;
		const onAbort = () => fail(errors.unavailable("request was cancelled", signal?.reason));
		signal?.addEventListener("abort", onAbort, { once: true });
		try {
			return await protocol.request({
				method,
				params: requestParams
			}, ResultSchema, {
				timeout: timeoutMs,
				maxTotalTimeout: timeoutMs
			});
		} catch (error) {
			if (isMcpRequestTimeoutError(error)) fail(errors.unavailable(`${method} timed out after ${timeoutMs}ms`));
			if (!failure && error instanceof McpError) throw errors.protocol(`request failed: ${error.message}`, error);
			throw failure ?? error;
		} finally {
			inFlight -= 1;
			signal?.removeEventListener("abort", onAbort);
		}
	}
	return {
		isAvailable: () => available && !failure && !stopped,
		get cleanupResult() {
			return transport.cleanupResult;
		},
		async request(method, requestParams, options) {
			await startup;
			return request(method, requestParams, options);
		},
		async stop() {
			stopped = true;
			available = false;
			failure ??= errors.unavailable("proxy is stopping");
			transport.retire().catch(() => void 0);
			beginShutdown();
			await startup.catch(() => void 0);
			await shutdown;
		}
	};
}
//#endregion
export { createMcpStdioClient };
