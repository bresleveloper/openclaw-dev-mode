import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { t as createAbortError } from "./abort-signal-Z3A36sLL.mjs";
import "./errors-DnjwnOju.mjs";
import { s as sanitizeHostExecEnv } from "./host-env-security-D7wdDMke.mjs";
import { i as logWarn, t as logDebug } from "./logger-BHMMVs5C.mjs";
import { n as recordAgentCleanupFailure } from "./run-cleanup-timeout-BlChlpzQ.mjs";
import { n as resolveStdioMcpServerLaunchConfig, t as describeStdioMcpServerLaunchConfig } from "./mcp-stdio-BYr36l_O.mjs";
import { i as settlesWithin, n as closeOwnedStdioProcess, r as createOwnedStdioProcess, t as OwnedStdioCleanupError } from "./owned-stdio-B_QaseFA.mjs";
import { a as resolveWindowsSpawnProgram, r as materializeWindowsSpawnProgram } from "./windows-spawn-CR3vyrK9.mjs";
import { a as setPluginToolMeta } from "./tool-metadata-DpaqT_qU.mjs";
import { t as createPendingRequestRegistry } from "./pending-request-registry-6Top3fRe.mjs";
import { n as loadEnabledBundleLspConfig } from "./bundle-lsp-CaUzXSwj.mjs";
//#region src/agents/agent-bundle-lsp-process.ts
/** Spawns bundled LSP server processes with sanitized environment and platform handling. */
const defaultLspSpawnDependencies = {
	spawn: createOwnedStdioProcess,
	sanitizeHostExecEnv,
	resolveWindowsSpawnProgram,
	materializeWindowsSpawnProgram
};
async function spawnLspServerProcess(config, options = {}) {
	const dependencies = options.dependencies ?? defaultLspSpawnDependencies;
	const mergedEnv = dependencies.sanitizeHostExecEnv({
		baseEnv: process.env,
		overrides: config.env ?? null
	});
	const program = dependencies.resolveWindowsSpawnProgram({
		command: config.command,
		env: mergedEnv,
		allowShellFallback: true
	});
	const invocation = dependencies.materializeWindowsSpawnProgram(program, config.args ?? []);
	return await dependencies.spawn({
		argv: [invocation.command, ...invocation.argv],
		env: mergedEnv,
		exactEnv: true,
		cwd: config.cwd,
		abortSignal: options.abortSignal,
		...invocation.shell === true ? { windowsShell: true } : {}
	});
}
//#endregion
//#region src/agents/embedded-agent-lsp.ts
/** Resolve enabled embedded-agent LSP servers and diagnostics. */
function loadEmbeddedAgentLspConfig(params) {
	const bundleLsp = loadEnabledBundleLspConfig({
		workspaceDir: params.workspaceDir,
		cfg: params.cfg,
		manifestRegistry: params.manifestRegistry
	});
	return {
		lspServers: { ...bundleLsp.config.lspServers },
		diagnostics: bundleLsp.diagnostics
	};
}
//#endregion
//#region src/agents/agent-bundle-lsp-dependencies.ts
/** Owns the process/config dependencies used by the bundled LSP runtime. */
const defaultBundleLspRuntimeDependencies = {
	loadLspConfig: loadEmbeddedAgentLspConfig,
	spawnServerProcess: spawnLspServerProcess
};
//#endregion
//#region src/agents/agent-bundle-lsp-runtime.ts
/** Session-scoped embedded LSP runtime and tool materialization for agent bundles. */
const LSP_SHUTDOWN_GRACE_MS = 500;
const LSP_PROCESS_TREE_KILL_GRACE_MS = 1e3;
const activeBundleLspSessions = /* @__PURE__ */ new Set();
function createLspSession(serverName, child) {
	return {
		serverName,
		process: child,
		requestId: 0,
		pendingRequests: createPendingRequestRegistry(),
		input: {
			buffer: Buffer.alloc(0),
			length: 0
		},
		initialized: false,
		capabilities: {},
		disposed: false,
		forceClose: false
	};
}
function registerActiveLspSession(session) {
	activeBundleLspSessions.add(session);
}
function rememberLspFailure(session, error) {
	session.failure ??= error;
}
function failLspSession(session, error) {
	rememberLspFailure(session, error);
	session.pendingRequests.rejectAll(session.failure ?? error);
}
function lspProcessExitError(session, code, signal) {
	return /* @__PURE__ */ new Error(`LSP server "${session.serverName}" exited (${signal ?? code ?? "unknown"})`);
}
function attachLspProcessHandlers(session) {
	session.process.onError((error, source) => {
		if (source === "stderr") logWarn(`bundle-lsp:${session.serverName}: stderr failed: ${String(error)}`);
		else {
			session.forceClose = true;
			failLspSession(session, error);
		}
	});
	session.process.onExit((code, signal) => {
		rememberLspFailure(session, lspProcessExitError(session, code, signal));
	});
	session.process.wait().then(({ code, signal }) => failLspSession(session, lspProcessExitError(session, code, signal)), (error) => failLspSession(session, toErrorObject(error, "LSP process failed")));
	session.process.onStdout(() => {}, (chunk) => handleIncomingData(session, chunk));
	session.process.onStderr((chunk) => {
		for (const line of chunk.split(/\r?\n/).filter(Boolean)) logDebug(`bundle-lsp:${session.serverName}: ${line.trim()}`);
	});
}
function encodeLspMessage(body) {
	const json = JSON.stringify(body);
	return `Content-Length: ${Buffer.byteLength(json, "utf-8")}\r\n\r\n${json}`;
}
const LSP_HEADER_SEPARATOR = Buffer.from("\r\n\r\n", "ascii");
const MAX_LSP_HEADER_BYTES = 8192;
const MAX_LSP_BODY_BYTES = 67108864;
const LSP_BODY_DECODER = new TextDecoder("utf-8", {
	fatal: true,
	ignoreBOM: true
});
var LspFramingError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "LspFramingError";
	}
};
function framingError(messages, detail) {
	return {
		ok: false,
		messages,
		error: new LspFramingError(`LSP framing error: ${detail}`)
	};
}
function parseContentLength(header) {
	const values = [];
	for (const line of header.split("\r\n")) {
		const separator = line.indexOf(":");
		if (separator === -1) return new LspFramingError("LSP framing error: header line must contain a colon");
		if (line.slice(0, separator).trim().toLowerCase() === "content-length") values.push(line.slice(separator + 1).trim());
	}
	if (values.length !== 1) return new LspFramingError(`LSP framing error: expected exactly one Content-Length header, received ${values.length}`);
	const value = values[0];
	if (value === void 0 || !/^[0-9]+$/.test(value)) return new LspFramingError("LSP framing error: Content-Length must be decimal digits");
	const length = Number(value);
	if (!Number.isSafeInteger(length) || length <= 0) return new LspFramingError("LSP framing error: Content-Length must be a positive safe integer");
	if (length > MAX_LSP_BODY_BYTES) return new LspFramingError(`LSP framing error: Content-Length exceeds ${MAX_LSP_BODY_BYTES} bytes`);
	return length;
}
function parseLspMessages(input) {
	const messages = [];
	let consumed = 0;
	while (true) {
		if (!input.body) {
			const remaining = input.buffer.subarray(consumed, input.length);
			const headerEnd = remaining.indexOf(LSP_HEADER_SEPARATOR);
			if (headerEnd === -1) {
				const maxIncompleteHeaderBytes = MAX_LSP_HEADER_BYTES + LSP_HEADER_SEPARATOR.length - 1;
				return remaining.length > maxIncompleteHeaderBytes ? framingError(messages, `header exceeds ${MAX_LSP_HEADER_BYTES} bytes`) : {
					ok: true,
					messages,
					consumed
				};
			}
			if (headerEnd > MAX_LSP_HEADER_BYTES) return framingError(messages, `header exceeds ${MAX_LSP_HEADER_BYTES} bytes`);
			const contentLength = parseContentLength(remaining.subarray(0, headerEnd).toString("ascii"));
			if (contentLength instanceof LspFramingError) return {
				ok: false,
				messages,
				error: contentLength
			};
			const start = consumed + headerEnd + LSP_HEADER_SEPARATOR.length;
			input.body = {
				start,
				end: start + contentLength
			};
		}
		if (input.length < input.body.end) return {
			ok: true,
			messages,
			consumed
		};
		let body;
		try {
			body = LSP_BODY_DECODER.decode(input.buffer.subarray(input.body.start, input.body.end));
		} catch {
			return framingError(messages, "body is not valid UTF-8");
		}
		try {
			messages.push(JSON.parse(body));
		} catch (error) {
			return framingError(messages, `body is not valid JSON: ${error instanceof Error ? error.message : String(error)}`);
		}
		consumed = input.body.end;
		input.body = void 0;
	}
}
function lspAbortError(signal) {
	return signal?.reason instanceof Error ? signal.reason : createAbortError("LSP request aborted", { cause: signal?.reason });
}
function throwIfLspAborted(signal) {
	if (signal?.aborted) throw lspAbortError(signal);
}
function lspSessionDisposedError() {
	return /* @__PURE__ */ new Error("LSP session disposed");
}
function sendRequest(session, method, params, signal) {
	if (session.disposed && method !== "shutdown") return Promise.reject(lspSessionDisposedError());
	if (session.failure) return Promise.reject(session.failure);
	if (signal?.aborted) return Promise.reject(lspAbortError(signal));
	const id = ++session.requestId;
	const onAbort = () => {
		const aborted = session.pendingRequests.take(id);
		if (!aborted) return;
		try {
			session.process.stdin?.write(encodeLspMessage({
				jsonrpc: "2.0",
				method: "$/cancelRequest",
				params: { id }
			}));
		} catch {}
		aborted.reject(lspAbortError(signal));
	};
	const pending = session.pendingRequests.add(id, {
		value: void 0,
		timeoutMs: 1e4,
		timeoutError: () => /* @__PURE__ */ new Error(`LSP request ${method} timed out`),
		dispose: () => signal?.removeEventListener("abort", onAbort)
	});
	if (!pending) return Promise.reject(/* @__PURE__ */ new Error(`LSP request id collision: ${id}`));
	signal?.addEventListener("abort", onAbort, { once: true });
	const message = {
		jsonrpc: "2.0",
		id,
		method,
		params
	};
	try {
		const encoded = encodeLspMessage(message);
		session.process.stdin?.write(encoded);
	} catch (error) {
		pending.reject(error);
	}
	return pending.promise;
}
function handleIncomingData(session, chunk) {
	const bytes = typeof chunk === "string" ? Buffer.from(chunk, "utf8") : chunk;
	const input = session.input;
	const length = input.length + bytes.length;
	if (length > input.buffer.length) {
		const capacity = Math.max(length, Math.min(Math.max(4096, input.buffer.length * 2), MAX_LSP_HEADER_BYTES + LSP_HEADER_SEPARATOR.length + MAX_LSP_BODY_BYTES));
		const buffer = Buffer.allocUnsafe(capacity);
		input.buffer.copy(buffer, 0, 0, input.length);
		input.buffer = buffer;
	}
	bytes.copy(input.buffer, input.length);
	input.length = length;
	const parsed = parseLspMessages(input);
	if (!parsed.ok || parsed.consumed === input.length) session.input = {
		buffer: Buffer.alloc(0),
		length: 0
	};
	else if (parsed.consumed > 0) {
		input.buffer = Buffer.from(input.buffer.subarray(parsed.consumed, input.length));
		input.length -= parsed.consumed;
		if (input.body) {
			input.body.start -= parsed.consumed;
			input.body.end -= parsed.consumed;
		}
	}
	for (const msg of parsed.messages) {
		if (typeof msg !== "object" || msg === null) continue;
		const record = msg;
		if ("id" in record && typeof record.id === "number") {
			const pending = session.pendingRequests.take(record.id);
			if (pending) {
				if ("error" in record) pending.reject(new Error(JSON.stringify(record.error)));
				else pending.resolve(record.result);
			}
		}
		if ("method" in record && !("id" in record)) logDebug(`bundle-lsp:${session.serverName}: notification ${String(record.method)}`);
	}
	if (!parsed.ok) {
		session.forceClose = true;
		failLspSession(session, parsed.error);
		disposeSession(session).catch(() => {});
	}
}
async function initializeSession(session, signal) {
	const result = await sendRequest(session, "initialize", {
		processId: process.pid,
		rootUri: null,
		capabilities: { textDocument: {
			hover: { contentFormat: ["plaintext", "markdown"] },
			completion: { completionItem: { snippetSupport: false } },
			definition: {},
			references: {}
		} }
	}, signal);
	throwIfLspAborted(signal);
	session.process.stdin?.write(encodeLspMessage({
		jsonrpc: "2.0",
		method: "initialized",
		params: {}
	}));
	session.initialized = true;
	return result?.capabilities ?? {};
}
function disposeSession(session) {
	if (session.disposal) return session.disposal;
	session.disposed = true;
	session.pendingRequests.rejectAll(lspSessionDisposedError());
	session.disposal = (async () => {
		if (session.initialized && !session.failure) try {
			const shutdown = sendRequest(session, "shutdown").catch(() => void 0);
			await settlesWithin(shutdown, LSP_SHUTDOWN_GRACE_MS);
			session.process.stdin?.write(encodeLspMessage({
				jsonrpc: "2.0",
				method: "exit",
				params: null
			}));
		} catch {}
		session.pendingRequests.rejectAll(lspSessionDisposedError());
		try {
			await closeOwnedStdioProcess(session.process, {
				graceMs: LSP_PROCESS_TREE_KILL_GRACE_MS,
				force: session.forceClose
			});
		} catch (error) {
			recordAgentCleanupFailure();
			logWarn(`bundle-lsp:${session.serverName}: process cleanup could not confirm descendant shutdown; inspect this server before retrying automatic recovery.`);
			throw error;
		} finally {
			activeBundleLspSessions.delete(session);
		}
	})();
	return session.disposal;
}
async function disposeSessions(sessions) {
	if ((await Promise.allSettled(Array.from(sessions, (session) => disposeSession(session)))).some((result) => result.status === "rejected")) recordAgentCleanupFailure();
}
function createLspPositionTool(params) {
	return {
		name: params.toolName,
		label: params.label,
		description: params.description,
		parameters: {
			type: "object",
			properties: {
				uri: {
					type: "string",
					description: "File URI (file:///path/to/file)"
				},
				line: {
					type: "number",
					description: "Zero-based line number"
				},
				character: {
					type: "number",
					description: "Zero-based character offset"
				}
			},
			required: [
				"uri",
				"line",
				"character"
			]
		},
		execute: async (_toolCallId, input, signal) => {
			const position = input;
			const result = await sendRequest(params.session, params.method, {
				textDocument: { uri: position.uri },
				position: {
					line: position.line,
					character: position.character
				}
			}, signal);
			return formatLspResult(params.session.serverName, params.resultLabel, result);
		}
	};
}
function buildLspTools(session) {
	const tools = [];
	const caps = session.capabilities;
	const serverLabel = session.serverName;
	if (caps.hoverProvider) tools.push(createLspPositionTool({
		session,
		toolName: `lsp_hover_${serverLabel}`,
		label: `LSP Hover (${serverLabel})`,
		description: `Get hover information for a symbol at a position in a file via the ${serverLabel} language server.`,
		method: "textDocument/hover",
		resultLabel: "hover"
	}));
	if (caps.definitionProvider) tools.push(createLspPositionTool({
		session,
		toolName: `lsp_definition_${serverLabel}`,
		label: `LSP Go to Definition (${serverLabel})`,
		description: `Find the definition of a symbol at a position in a file via the ${serverLabel} language server.`,
		method: "textDocument/definition",
		resultLabel: "definition"
	}));
	if (caps.referencesProvider) tools.push({
		name: `lsp_references_${serverLabel}`,
		label: `LSP Find References (${serverLabel})`,
		description: `Find all references to a symbol at a position in a file via the ${serverLabel} language server.`,
		parameters: {
			type: "object",
			properties: {
				uri: {
					type: "string",
					description: "File URI (file:///path/to/file)"
				},
				line: {
					type: "number",
					description: "Zero-based line number"
				},
				character: {
					type: "number",
					description: "Zero-based character offset"
				},
				includeDeclaration: {
					type: "boolean",
					description: "Include the declaration in results"
				}
			},
			required: [
				"uri",
				"line",
				"character"
			]
		},
		execute: async (_toolCallId, input, signal) => {
			const params = input;
			const result = await sendRequest(session, "textDocument/references", {
				textDocument: { uri: params.uri },
				position: {
					line: params.line,
					character: params.character
				},
				context: { includeDeclaration: params.includeDeclaration ?? true }
			}, signal);
			return formatLspResult(serverLabel, "references", result);
		}
	});
	return tools;
}
function formatLspResult(serverName, method, result) {
	return {
		content: [{
			type: "text",
			text: result !== null && result !== void 0 ? JSON.stringify(result, null, 2) : `No ${method} result from ${serverName}`
		}],
		details: {
			lspServer: serverName,
			lspMethod: method
		}
	};
}
async function createBundleLspToolRuntime(params) {
	throwIfLspAborted(params.abortSignal);
	const dependencies = params.dependencies ?? defaultBundleLspRuntimeDependencies;
	const loaded = dependencies.loadLspConfig({
		workspaceDir: params.workspaceDir,
		cfg: params.cfg,
		manifestRegistry: params.manifestRegistry
	});
	for (const diagnostic of loaded.diagnostics) logWarn(`bundle-lsp: ${diagnostic.pluginId}: ${diagnostic.message}`);
	if (Object.keys(loaded.lspServers).length === 0) return {
		tools: [],
		sessions: [],
		dispose: async () => {}
	};
	const reservedNames = new Set(Array.from(params.reservedToolNames ?? [], (name) => normalizeOptionalLowercaseString(name)).filter(Boolean));
	const sessions = [];
	const tools = [];
	try {
		for (const [serverName, rawServer] of Object.entries(loaded.lspServers)) {
			throwIfLspAborted(params.abortSignal);
			const launch = resolveStdioMcpServerLaunchConfig(rawServer);
			if (!launch.ok) {
				logWarn(`bundle-lsp: skipped server "${serverName}" because ${launch.reason}.`);
				continue;
			}
			const launchConfig = launch.config;
			let session;
			try {
				session = createLspSession(serverName, await dependencies.spawnServerProcess(launchConfig, { abortSignal: params.abortSignal }));
				registerActiveLspSession(session);
				attachLspProcessHandlers(session);
				throwIfLspAborted(params.abortSignal);
				const capabilities = await initializeSession(session, params.abortSignal);
				throwIfLspAborted(params.abortSignal);
				session.capabilities = capabilities;
				sessions.push(session);
				const serverTools = buildLspTools(session);
				for (const tool of serverTools) {
					const normalizedName = normalizeOptionalLowercaseString(tool.name);
					if (!normalizedName) continue;
					if (reservedNames.has(normalizedName)) {
						logWarn(`bundle-lsp: skipped tool "${tool.name}" from server "${serverName}" because the name already exists.`);
						continue;
					}
					reservedNames.add(normalizedName);
					setPluginToolMeta(tool, {
						pluginId: "bundle-lsp",
						optional: false
					});
					tools.push(tool);
				}
				logDebug(`bundle-lsp: started "${serverName}" (${describeStdioMcpServerLaunchConfig(launchConfig)}) with ${serverTools.length} tools`);
			} catch (error) {
				if (session) await disposeSessions([session]);
				else if (error instanceof OwnedStdioCleanupError) recordAgentCleanupFailure();
				if (!params.abortSignal?.aborted || error instanceof OwnedStdioCleanupError) logWarn(`bundle-lsp: failed to start server "${serverName}" (${describeStdioMcpServerLaunchConfig(launchConfig)}): ${String(error)}`);
				throwIfLspAborted(params.abortSignal);
			}
		}
		return {
			tools,
			sessions: sessions.map((s) => ({
				serverName: s.serverName,
				capabilities: s.capabilities
			})),
			dispose: () => disposeSessions(sessions)
		};
	} catch (error) {
		await disposeSessions(sessions);
		throw error;
	}
}
async function disposeAllBundleLspRuntimes() {
	await disposeSessions(activeBundleLspSessions);
}
//#endregion
export { disposeAllBundleLspRuntimes as n, createBundleLspToolRuntime as t };
