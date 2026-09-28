import { i as resolveManagedCodexNativeCommand, r as resolveManagedCodexAppServerStartOptions, t as isManagedCodexDesktopCommand } from "./managed-binary-BnshlFag.mjs";
import { a as closeCodexAppServerTransportAndWait, t as createStdioTransport } from "./transport-stdio-h2VHOskC.mjs";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { stripVTControlCharacters } from "node:util";
import { killProcessTree } from "openclaw/plugin-sdk/process-runtime";
import path from "node:path";
import { mkdir } from "node:fs/promises";
import { once } from "node:events";
import { resolvePreferredOpenClawTmpDir, tempWorkspace } from "openclaw/plugin-sdk/temp-path";
import { createDeferred } from "openclaw/plugin-sdk/extension-shared";
import { StringDecoder } from "node:string_decoder";
import { sanitizeEnvVars } from "openclaw/plugin-sdk/sandbox";
//#region extensions/codex/src/node-exec-server.runtime.ts
const MAX_CODEX_EXEC_SERVER_MESSAGE_BYTES = 67108864;
const MAX_CODEX_EXEC_SERVER_STDERR_BYTES = 4096;
const CODEX_EXEC_SERVER_READY_LINE = "codex_exec_server::server::transport: codex-exec-server listening on stdio";
const CODEX_EXEC_SERVER_TERMINATION_GRACE_MS = 1e3;
const CODEX_EXEC_SERVER_REAP_TIMEOUT_MS = 5e3;
const NODE_EXEC_SERVER_PLATFORM_ENVIRONMENT = /^(?:SYSTEMROOT|WINDIR|COMSPEC|PATHEXT|TEMP|TMP|TMPDIR)$/iu;
function validateNodeExecServerMessage(message) {
	if (message.byteLength === 0 || message.byteLength > MAX_CODEX_EXEC_SERVER_MESSAGE_BYTES) throw new Error("Codex exec-server JSON-RPC message exceeds its 64 MiB limit.");
	const encoded = Buffer.from(message.buffer, message.byteOffset, message.byteLength);
	if (encoded.includes(10) || encoded.includes(13)) throw new Error("Codex exec-server JSON-RPC frames must contain exactly one message.");
	let decoded;
	try {
		const text = new TextDecoder("utf-8", { fatal: true }).decode(encoded);
		decoded = JSON.parse(text);
	} catch {
		throw new Error("Codex exec-server received malformed UTF-8 or JSON-RPC.");
	}
	if (!isRecord(decoded) || decoded.jsonrpc !== void 0 && decoded.jsonrpc !== "2.0" || typeof decoded.method !== "string" && !("id" in decoded && ("result" in decoded || "error" in decoded))) throw new Error("Codex exec-server received an invalid JSON-RPC message.");
	return encoded;
}
function nodeExecServerAbortError(signal) {
	return signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("Codex node exec-server connection closed.");
}
function writeNodeExecServerMessage(child, message, signal) {
	if (signal.aborted) throw nodeExecServerAbortError(signal);
	const payload = Buffer.concat([message, Buffer.from("\n")]);
	if (!child.stdin.write(payload)) return once(child.stdin, "drain", { signal }).then(() => void 0);
}
async function relayNodeExecServerOutput(child, send) {
	let fragments = [];
	let pendingBytes = 0;
	for await (const rawChunk of child.stdout) {
		const chunk = Buffer.isBuffer(rawChunk) ? rawChunk : Buffer.from(rawChunk);
		let offset = 0;
		while (offset < chunk.byteLength) {
			const newline = chunk.indexOf(10, offset);
			const fragment = chunk.subarray(offset, newline === -1 ? chunk.byteLength : newline);
			const nextLength = pendingBytes + fragment.byteLength;
			if (nextLength > 67108865) throw new Error("Codex exec-server stdout message exceeds its 64 MiB limit.");
			if (fragment.byteLength > 0) fragments.push(fragment);
			pendingBytes = nextLength;
			if (newline === -1) {
				if (pendingBytes > MAX_CODEX_EXEC_SERVER_MESSAGE_BYTES && fragment[fragment.byteLength - 1] !== 13) throw new Error("Codex exec-server stdout message exceeds its 64 MiB limit.");
				break;
			}
			const trailing = fragments.at(-1);
			if (trailing?.[trailing.byteLength - 1] === 13) {
				pendingBytes -= 1;
				if (trailing.byteLength === 1) fragments.pop();
				else fragments[fragments.length - 1] = trailing.subarray(0, trailing.byteLength - 1);
			}
			const message = validateNodeExecServerMessage(fragments.length === 1 ? fragments[0] : Buffer.concat(fragments, pendingBytes));
			fragments = [];
			pendingBytes = 0;
			await send(message);
			offset = newline + 1;
		}
	}
	if (pendingBytes > 0) throw new Error("Codex exec-server stdout ended with an unterminated JSON-RPC message.");
}
function createNodeExecServerProcessOwner(child, closed, releaseResources, activeProcesses) {
	let termination;
	let hasClosed = false;
	const settled = closed.then(async () => {
		hasClosed = true;
		await termination?.catch(() => {});
		await releaseResources();
		activeProcesses.delete(terminate);
	});
	settled.catch(() => {});
	const terminate = async () => {
		if (!hasClosed) await (termination ??= (async () => {
			if (process.platform === "win32" && child.pid) killProcessTree(child.pid, { graceMs: CODEX_EXEC_SERVER_TERMINATION_GRACE_MS });
			const { exited } = await closeCodexAppServerTransportAndWait(child, {
				forceKillDelayMs: CODEX_EXEC_SERVER_TERMINATION_GRACE_MS,
				exitTimeoutMs: CODEX_EXEC_SERVER_REAP_TIMEOUT_MS
			});
			if (!exited) throw new Error("Codex node exec-server process tree did not terminate.");
		})());
		await settled;
	};
	activeProcesses.add(terminate);
	return terminate;
}
/** Runs the one-connection paired-node exec-server after lightweight command admission. */
async function runCodexNodeExecServer(params) {
	const { io, workspace } = params;
	const frames = io.frames;
	const cwd = workspace.workspaceDir;
	let writes;
	let output;
	let temporaryHome;
	let unsubscribe;
	const releaseResources = async () => {
		try {
			await Promise.allSettled([output, writes]);
			await temporaryHome?.cleanup();
		} finally {
			workspace.release();
		}
	};
	let close = releaseResources;
	let rejectDisconnected;
	const disconnected = new Promise((_resolve, reject) => {
		rejectDisconnected = reject;
	});
	disconnected.catch(() => {});
	const onAbort = () => {
		const error = nodeExecServerAbortError(io.signal);
		rejectDisconnected(error);
	};
	io.signal.addEventListener("abort", onAbort, { once: true });
	try {
		if (!frames) throw new Error("Codex node exec-server requires duplex frames.");
		if (io.signal.aborted) throw nodeExecServerAbortError(io.signal);
		temporaryHome = await tempWorkspace({
			rootDir: resolvePreferredOpenClawTmpDir(),
			prefix: "codex-node-exec-server-"
		});
		const { dir } = temporaryHome;
		const codexHome = path.join(dir, ".codex");
		await mkdir(codexHome, {
			recursive: true,
			mode: 448
		});
		const resolved = await resolveManagedCodexAppServerStartOptions({
			transport: "stdio",
			command: "codex",
			commandSource: "managed",
			managedCommandOrder: "package-first",
			args: [
				"exec-server",
				"--listen",
				"stdio"
			],
			headers: {}
		});
		const native = resolveManagedCodexNativeCommand(resolved.command);
		if (!native || isManagedCodexDesktopCommand(resolved.command)) throw new Error("Codex node exec-server requires the pinned managed package binary.");
		const baseEnv = sanitizeEnvVars(process.env, {
			strictMode: true,
			customAllowedPatterns: [NODE_EXEC_SERVER_PLATFORM_ENVIRONMENT]
		}).allowed;
		if (io.signal.aborted) throw nodeExecServerAbortError(io.signal);
		params.assertExecAuthorized();
		const nativeReady = createDeferred();
		const exit = createDeferred();
		let stderr = Buffer.alloc(0);
		let startupSettled = false;
		let pendingLine = "";
		const decoder = new StringDecoder("utf8");
		const child = await createStdioTransport({
			transport: "stdio",
			command: native,
			commandSource: "resolved-managed",
			args: resolved.args,
			headers: {},
			cwd,
			env: {
				HOME: workspace.homeDir ?? dir,
				CODEX_HOME: codexHome,
				RUST_LOG: "error,opentelemetry_sdk=off,opentelemetry_otlp=off,codex_exec_server::server::transport=info",
				...process.platform === "win32" ? { USERPROFILE: workspace.homeDir ?? dir } : {}
			},
			clearEnv: ["NODE_OPTIONS"]
		}, baseEnv, () => {
			if (io.signal.aborted) throw nodeExecServerAbortError(io.signal);
			params.assertExecAuthorized();
		}, (spawned) => {
			spawned.once("close", (code, signal) => exit.resolve({
				code,
				signal
			}));
			close = createNodeExecServerProcessOwner(spawned, exit.promise, releaseResources, params.activeProcesses);
			output = relayNodeExecServerOutput(spawned, frames.send.bind(frames));
			output.catch((error) => {
				rejectDisconnected(error instanceof Error ? error : new Error(String(error)));
			});
			spawned.once("error", rejectDisconnected);
			spawned.stdin.on("error", rejectDisconnected);
			spawned.stderr.on("data", (chunk) => {
				const next = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
				stderr = Buffer.concat([stderr, next.subarray(-4096)]).subarray(-4096);
				if (startupSettled) return;
				const lines = (pendingLine + decoder.write(next)).split("\n");
				pendingLine = lines.pop();
				for (const line of [...lines, pendingLine]) if (Buffer.byteLength(line, "utf8") > MAX_CODEX_EXEC_SERVER_STDERR_BYTES) {
					startupSettled = true;
					pendingLine = "";
					rejectDisconnected(/* @__PURE__ */ new Error("Codex node startup diagnostic line exceeded 4 KiB."));
					return;
				}
				if (lines.some((line) => stripVTControlCharacters(line).trimEnd().endsWith(CODEX_EXEC_SERVER_READY_LINE))) {
					startupSettled = true;
					pendingLine = "";
					nativeReady.resolve();
				}
			});
		});
		const stopped = exit.promise.then((outcome) => {
			const diagnostic = stderr.toString("utf8").trim();
			throw new Error(`Codex node exec-server exited (code ${outcome.code ?? "none"}, signal ${outcome.signal ?? "none"})${diagnostic ? `: ${diagnostic}` : "."}`);
		});
		await Promise.race([
			nativeReady.promise,
			stopped,
			disconnected
		]);
		if (io.signal.aborted) throw nodeExecServerAbortError(io.signal);
		if (child.exitCode !== null || child.signalCode !== null) await stopped;
		params.assertExecAuthorized();
		unsubscribe = frames.onMessage((message) => {
			const encoded = validateNodeExecServerMessage(message);
			const operation = writes ? writes.then(() => writeNodeExecServerMessage(child, encoded, io.signal)) : writeNodeExecServerMessage(child, encoded, io.signal);
			if (!operation) return;
			const observed = operation.catch(() => {});
			writes = observed;
			observed.then(() => {
				if (writes === observed) writes = void 0;
			});
			return operation;
		});
		return await Promise.race([stopped, disconnected]);
	} finally {
		io.signal.removeEventListener("abort", onAbort);
		try {
			unsubscribe?.();
		} finally {
			await close();
		}
	}
}
//#endregion
export { runCodexNodeExecServer };
