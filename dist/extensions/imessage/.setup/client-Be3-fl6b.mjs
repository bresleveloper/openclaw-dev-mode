import { u as expandIMessageUserPath } from "./accounts-C1Ypv3Wn.mjs";
import { i as invalidateCachedIMessagePrivateApiStatus } from "./message-tool-api-DtZ1wKbT.mjs";
import { asNullableRecord, asOptionalRecord, isRecord, normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
import { runCommandWithTimeout } from "openclaw/plugin-sdk/process-runtime";
import { resolveUserPath } from "openclaw/plugin-sdk/text-utility-runtime";
import { spawn } from "node:child_process";
import { StringDecoder } from "node:string_decoder";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { captureChannelReadAuthority, captureEffectAuthority } from "openclaw/plugin-sdk/fetch-runtime";
import { raceWithTimeout } from "openclaw/plugin-sdk/time-runtime";
// extensions/imessage/src/constants.ts
const DEFAULT_IMESSAGE_PROBE_TIMEOUT_MS = 1e4;
const DEFAULT_IMESSAGE_SEND_TIMEOUT_MS = 18e4;
// extensions/imessage/src/cli-output.ts
const IMESSAGE_CLI_STDOUT_MAX_BYTES = 8388608;
const IMESSAGE_CLI_STDERR_TAIL_BYTES = 65536;
function parseLastJsonObject(stdout) {
	const last = stdout.split(/\r?\n/u).findLast((line) => line.trim().length > 0)?.trim();
	if (!last) return null;
	try {
		return asNullableRecord(JSON.parse(last));
	} catch {
		return null;
	}
}
async function runIMessageCliJsonCommand(params) {
	const dbPath = params.dbPath?.trim();
	const argv = [
		expandIMessageUserPath(params.cliPath),
		...params.args,
		...dbPath ? ["--db", dbPath] : [],
		"--json"
	];
	const result = await runCommandWithTimeout(argv, {
		killProcessTree: true,
		maxOutputBytes: {
			stdout: IMESSAGE_CLI_STDOUT_MAX_BYTES,
			stderr: IMESSAGE_CLI_STDERR_TAIL_BYTES
		},
		outputCapture: {
			stdout: "head",
			stderr: "tail"
		},
		terminateOnOutputLimit: { stdout: true },
		timeoutMs: params.timeoutMs
	});
	if (result.termination === "timeout") throw new Error(`iMessage action timed out after ${params.timeoutMs}ms`);
	if (result.outputLimitExceeded || result.stdoutTruncatedBytes) throw new Error(`imsg stdout exceeded ${IMESSAGE_CLI_STDOUT_MAX_BYTES} bytes`);
	const parsed = parseLastJsonObject(result.stdout);
	if (result.code !== 0) {
		const detail = typeof parsed?.error === "string" && parsed.error.trim() || result.stderr.trim() || result.stdout.trim() || `imsg exited with code ${result.code}`;
		throw new Error(detail);
	}
	if (!parsed) throw new Error(`imsg returned non-JSON output: ${result.stdout.trim() || result.stderr.trim()}`);
	if (parsed.success === false) {
		const detail = typeof parsed.error === "string" && parsed.error.trim() ? parsed.error.trim() : "iMessage action failed";
		throw new Error(detail);
	}
	return parsed;
}
// extensions/imessage/src/bridge-recovery.ts
const BRIDGE_RECOVERY_TIMEOUT_MS = 3e4;
const recoveries = /* @__PURE__ */ new Map();
/**
* Re-inject the private bridge after imsg has positively identified it as
* unresponsive. This deliberately does not retry the failed mutation: imsg may
* still reconcile a published send, so replaying it could duplicate a message.
*/
function recoverIMessageBridge(cliPath) {
	const existing = recoveries.get(cliPath);
	if (existing) return existing;
	const recovery = runIMessageCliJsonCommand({
		cliPath,
		args: ["launch"],
		timeoutMs: BRIDGE_RECOVERY_TIMEOUT_MS
	}).then(() => void 0).finally(() => {
		recoveries.delete(cliPath);
	});
	recoveries.set(cliPath, recovery);
	return recovery;
}
// extensions/imessage/src/process-diagnostics.ts
function describeIMessageAutomationFailure(data, remoteHost) {
	const failure = asOptionalRecord(data);
	if (failure?.transport !== "applescript" || typeof failure.detail !== "string") return;
	const code = /^Messages automation failed with AppleScript error (-1712|-1743)\.$/u.exec(failure.detail)?.[1];
	if (!code) return;
	const reason = code === "-1743" ? "Messages Automation was denied." : "Messages Automation timed out. A missing Automation grant is one possible cause.";
	const context = remoteHost ? "Check System Settings > Privacy & Security > Automation for the SSH/wrapper process on the Messages Mac, not this Gateway's local runtime or Terminal." : "Check System Settings > Privacy & Security > Automation for the Gateway/launcher on the Messages Mac. Local Gateway runtime: " + JSON.stringify(process.execPath) + ". An app update that switches Node to Bun or moves the Gateway to a new runtime path needs this grant once; review the process macOS identifies, not just Terminal or OpenClaw.app.";
	return reason + " " + context + " Channel probes do not verify sending.";
}
const PUBLIC_IMESSAGE_FULL_DISK_ACCESS_ERROR = "imsg cannot access ~/Library/Messages/chat.db. Grant Full Disk Access to the Gateway/launcher process and restart Gateway.";
function normalizeIMessageFullDiskAccessError(message) {
	const normalized = normalizeLowercaseStringOrEmpty(message);
	return normalized.includes("full disk access") && normalized.includes("chat.db") ? PUBLIC_IMESSAGE_FULL_DISK_ACCESS_ERROR : void 0;
}
function normalizeIMessageAutomationError(message) {
	const code = /Messages automation failed with AppleScript error (-1712|-1743)(?![0-9])/i.exec(message)?.[1];
	if (!code) return;
	return (code === "-1712" ? "Messages took too long to respond, so OpenClaw couldn't confirm your iMessage was sent. Open Messages on your Mac and approve any permission prompt. If the app is frozen, quit and reopen it. " : "OpenClaw couldn't send your iMessage because it doesn't have permission to control Messages. ") + "On the Mac running Messages, open System Settings > Privacy & Security > Automation and allow Messages access for the process running OpenClaw. If this started after an OpenClaw update, you may need to allow access again. For an app-managed Gateway, look for \"bun\" in Automation settings. Check whether your message was delivered and review queued replies before retrying to avoid duplicates. Technical details: Messages automation failed with AppleScript error " + code + ".";
}
// extensions/imessage/src/client.ts
const IMSG_APPLE_FRAMEWORK_STDERR_PATTERN = /^(?:\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d+ imsg\[\d+:\d+\] )?Could not fetch group for change type \d+ with identifier [^:]+:ABGroup, making it a delete change type\.$/u;
var IMessageRpcRequestError = class extends Error {
	constructor(message, code, data) {
		super(message);
		this.code = code;
		this.data = data;
		this.name = "IMessageRpcRequestError";
	}
};
function isIMessageBridgeStall(error) {
	if (error instanceof IMessageRpcRequestError && isRecord(error.data)) {
		const { transport, detail } = error.data;
		if (transport === "bridge_v2" && typeof detail === "string" && detail.startsWith("The bridge response deadline expired.")) return true;
	}
	return error instanceof Error && error.message.includes("Timed out waiting for response");
}
const BRIDGE_STALL_GUIDANCE = "The imsg private API bridge stopped responding. Run `imsg launch` to re-inject the dylib, then `openclaw channels status --probe` to refresh capability detection.";
function describeIMessageBridgeStall(error) {
	if (error instanceof IMessageRpcRequestError) return new IMessageRpcRequestError(`${error.message} ${BRIDGE_STALL_GUIDANCE}`, error.code, error.data);
	if (error instanceof Error) return new Error(`${error.message} ${BRIDGE_STALL_GUIDANCE}`, { cause: error });
	return error;
}
const IMESSAGE_RPC_CLOSE_GRACE_MS = 500;
function isTestEnv() {
	const vitest = normalizeLowercaseStringOrEmpty(process.env.VITEST);
	return Boolean(vitest);
}
function createLfLineFramer(onLine) {
	const decoder = new StringDecoder("utf8");
	let buffer = "";
	return {
		write(chunk) {
			buffer += typeof chunk === "string" ? chunk : decoder.write(chunk);
			let newlineIndex = buffer.indexOf("\n");
			while (newlineIndex !== -1) {
				const line = buffer.slice(0, newlineIndex);
				buffer = buffer.slice(newlineIndex + 1);
				onLine(line);
				newlineIndex = buffer.indexOf("\n");
			}
		},
		flush() {
			buffer += decoder.end();
			if (!buffer) return;
			const line = buffer;
			buffer = "";
			onLine(line);
		}
	};
}
var IMessageRpcClient = class {
	constructor(opts = {}) {
		this.pending = /* @__PURE__ */ new Map();
		this.terminalResolve = null;
		this.reapedResolve = null;
		this.child = null;
		this.stopPromise = null;
		this.stdoutFramer = createLfLineFramer((line) => this.handleStdoutLine(line));
		this.stderrFramer = createLfLineFramer((line) => this.handleStderrLine(line));
		this.nextId = 1;
		this.publicProcessError = null;
		this.configuredCliPath = opts.cliPath?.trim() || "imsg";
		this.cliPath = expandIMessageUserPath(this.configuredCliPath);
		const dbPath = opts.dbPath?.trim();
		this.remoteHost = opts.remoteHost?.trim();
		this.dbPath = dbPath ? this.remoteHost ? dbPath : resolveUserPath(dbPath) : void 0;
		this.runtime = opts.runtime;
		this.onNotification = opts.onNotification;
		this.terminal = new Promise((resolve) => {
			this.terminalResolve = resolve;
		});
		this.reaped = new Promise((resolve) => {
			this.reapedResolve = resolve;
		});
	}
	async start() {
		if (this.child) return;
		if (isTestEnv()) throw new Error("Refusing to start imsg rpc in test environment; mock iMessage RPC client");
		const args = ["rpc", "--json"];
		if (this.dbPath) args.push("--db", this.dbPath);
		const child = spawn(this.cliPath, args, { stdio: [
			"pipe",
			"pipe",
			"pipe"
		] });
		this.child = child;
		for (const [stream, framer] of [[child.stdout, this.stdoutFramer], [child.stderr, this.stderrFramer]]) stream.on("data", (chunk) => {
			if (this.child === child) framer.write(chunk);
		});
		const failFromProcessError = (err) => this.failTransport(err, child);
		child.on("error", failFromProcessError);
		for (const stream of [
			child.stdin,
			child.stdout,
			child.stderr
		]) {
			stream.on("error", failFromProcessError);
			stream.once("close", () => {
				const error = stream.errored;
				if (error) failFromProcessError(error);
			});
		}
		child.on("close", (code, signal) => {
			if (this.child === child) {
				this.stdoutFramer.flush();
				this.stderrFramer.flush();
				this.child = null;
			}
			this.finish(this.buildCloseError(code, signal));
			const resolve = this.reapedResolve;
			this.reapedResolve = null;
			resolve?.();
		});
	}
	async stop() {
		if (this.stopPromise) return await this.stopPromise;
		const child = this.child;
		if (!child) return;
		this.stopPromise = this.stopChild(child);
		return await this.stopPromise;
	}
	async waitForClose() {
		throw await this.terminal;
	}
	async request(method, params, opts) {
		const child = this.child;
		const stdin = child?.stdin;
		const assertReadAuthority = captureChannelReadAuthority();
		return captureEffectAuthority().initiate(() => {
			if (child !== this.child || stdin !== this.child?.stdin) throw new Error("imsg rpc process changed before request initiation");
			assertReadAuthority?.();
			opts?.assertCurrent?.();
			return this.initiateRequest(method, params, opts);
		});
	}
	async initiateRequest(method, params, opts) {
		if (!this.child || !this.child.stdin) throw new Error("imsg rpc not running");
		const id = this.nextId++;
		const line = `${JSON.stringify({
			jsonrpc: "2.0",
			id,
			method,
			params: params ?? {}
		})}\n`;
		const timeoutMs = opts?.timeoutMs ?? 1e4;
		const key = String(id);
		const pendingResponse = new Promise((resolve, reject) => {
			this.pending.set(key, {
				resolve: (value) => resolve(value),
				reject
			});
		});
		const response = timeoutMs > 0 ? raceWithTimeout(pendingResponse, timeoutMs, () => {
			this.pending.delete(key);
			throw new Error(`imsg rpc timeout (${method})`);
		}) : pendingResponse;
		try {
			this.child.stdin.write(line, (err) => {
				if (err) this.failTransport(err, this.child);
			});
		} catch (err) {
			this.failTransport(err, this.child);
		}
		try {
			return await response;
		} catch (err) {
			if (isIMessageBridgeStall(err)) {
				invalidateCachedIMessagePrivateApiStatus(this.configuredCliPath);
				try {
					await recoverIMessageBridge(this.configuredCliPath);
				} catch (recoveryError) {
					this.runtime?.error?.(normalizeIMessageFullDiskAccessError(formatErrorMessage(recoveryError)) ?? `imessage: automatic bridge recovery failed. ${BRIDGE_STALL_GUIDANCE}`);
				}
				throw describeIMessageBridgeStall(err);
			}
			throw err;
		}
	}
	async stopChild(child) {
		try {
			child.stdin.end();
		} catch (err) {
			this.failTransport(err, child);
		}
		if (await this.waitForReap(IMESSAGE_RPC_CLOSE_GRACE_MS)) return;
		this.signalChild(child, "SIGTERM");
		if (await this.waitForReap(IMESSAGE_RPC_CLOSE_GRACE_MS)) return;
		this.signalChild(child, "SIGKILL");
		if (!await this.waitForReap(IMESSAGE_RPC_CLOSE_GRACE_MS)) throw new Error("imsg rpc did not exit after SIGKILL");
	}
	async waitForReap(timeoutMs) {
		if (!this.reapedResolve) return true;
		return await raceWithTimeout(this.reaped.then(() => true), timeoutMs, () => false);
	}
	signalChild(child, signal) {
		try {
			child.kill(signal);
		} catch {}
	}
	failTransport(err, child) {
		if (!this.finish(err instanceof Error ? err : new Error(String(err)))) return;
		if (child) this.signalChild(child, "SIGTERM");
	}
	handleStdoutLine(line) {
		const trimmed = line.trim();
		if (!trimmed) return;
		this.handleLine(trimmed);
	}
	handleStderrLine(line) {
		const trimmed = line.trim();
		if (!trimmed) return;
		this.recordProcessDiagnostic(trimmed);
		if (IMSG_APPLE_FRAMEWORK_STDERR_PATTERN.test(trimmed)) return;
		this.runtime?.error?.(normalizeIMessageFullDiskAccessError(trimmed) ?? "imsg rpc: stderr diagnostic received");
	}
	handleLine(line) {
		let parsed;
		try {
			parsed = JSON.parse(line);
		} catch {
			this.recordProcessDiagnostic(line);
			this.runtime?.error?.("imsg rpc: failed to parse JSON response");
			return;
		}
		if (parsed.id !== void 0 && parsed.id !== null) {
			const key = String(parsed.id);
			const pending = this.pending.get(key);
			if (!pending) return;
			this.pending.delete(key);
			if (parsed.error) {
				const baseMessage = parsed.error.message ?? "imsg rpc error";
				const details = parsed.error.data;
				const code = parsed.error.code;
				const suffixes = [];
				if (typeof code === "number") suffixes.push(`code=${code}`);
				if (details !== void 0) {
					const detailText = typeof details === "string" ? details : JSON.stringify(details, null, 2);
					if (detailText) suffixes.push(detailText);
				}
				const msg = suffixes.length > 0 ? `${baseMessage}: ${suffixes.join(" ")}` : baseMessage;
				const guidance = describeIMessageAutomationFailure(details, this.remoteHost);
				pending.reject(new IMessageRpcRequestError(guidance ? `${msg} ${guidance}` : msg, typeof code === "number" ? code : void 0, details));
				return;
			}
			pending.resolve(parsed.result);
			return;
		}
		if (parsed.method) this.onNotification?.({
			method: parsed.method,
			params: parsed.params
		});
	}
	recordProcessDiagnostic(line) {
		this.publicProcessError ??= normalizeIMessageFullDiskAccessError(line) ?? null;
	}
	buildCloseError(code, signal) {
		if (this.publicProcessError) return new Error(this.publicProcessError);
		if (code !== 0 && code !== null) {
			const reason = signal ? `signal ${signal}` : `code ${code}`;
			return /* @__PURE__ */ new Error(`imsg rpc exited (${reason})`);
		}
		return /* @__PURE__ */ new Error("imsg rpc closed");
	}
	finish(err) {
		const resolve = this.terminalResolve;
		if (!resolve) return false;
		this.terminalResolve = null;
		for (const [key, pending] of this.pending.entries()) {
			pending.reject(err);
			this.pending.delete(key);
		}
		resolve(err);
		return true;
	}
};
async function createIMessageRpcClient(opts = {}) {
	const client = new IMessageRpcClient(opts);
	await client.start();
	return client;
}
export { runIMessageCliJsonCommand as a, normalizeIMessageFullDiskAccessError as i, createIMessageRpcClient as n, DEFAULT_IMESSAGE_PROBE_TIMEOUT_MS as o, normalizeIMessageAutomationError as r, DEFAULT_IMESSAGE_SEND_TIMEOUT_MS as s, IMessageRpcRequestError as t };
