import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { a as createDeferred } from "./extension-shared-Bp_Ziw8S.mjs";
import { t as createClaudeCliProcessOwner } from "./cli-process-CbtpJrda.mjs";
import { randomUUID } from "node:crypto";
//#region extensions/anthropic/cli-transport.ts
const MAX_LINE_CHARS = 8388608;
const CLOSE_GRACE_MS = 500;
const KILL_GRACE_MS = 1e3;
/** One Claude Code subprocess and its bidirectional stream-json control channel. */
async function createClaudeCliTransport(params) {
	const owner = createClaudeCliProcessOwner(params.currentContext, params.secretInput);
	let child;
	try {
		const env = { ...params.context.env };
		delete env.NODE_OPTIONS;
		delete env.DEBUG;
		child = await owner.spawn({
			...params.context,
			args: params.args,
			env,
			signal: params.context.abortSignal
		});
	} catch (error) {
		owner[Symbol.dispose]();
		throw error;
	}
	const requests = /* @__PURE__ */ new Map();
	const initializeId = randomUUID();
	const { promise: ready, resolve: resolveReady, reject: rejectReady } = createDeferred();
	ready.catch(() => {});
	let closed = false;
	let shutdownStarted = false;
	let forcedExit = false;
	let hasExited = false;
	let exitError;
	let inputFailure;
	let terminateTimer;
	let killTimer;
	const { promise: exited, resolve: resolveExit } = createDeferred();
	const terminate = () => {
		forcedExit = true;
		child.kill("SIGTERM");
		killTimer = setTimeout(() => {
			child.kill("SIGKILL");
		}, KILL_GRACE_MS);
		killTimer.unref();
	};
	const abortRequests = () => {
		for (const controller of requests.values()) controller.abort();
		requests.clear();
	};
	const beginShutdown = () => {
		if (shutdownStarted) return;
		shutdownStarted = true;
		abortRequests();
		if (process.platform === "win32" && !hasExited) {
			forcedExit = true;
			child.kill("SIGKILL");
			child.waitForExtinction?.().then(() => child.stdin?.end(), () => {});
		} else child.stdin?.end();
		if (process.platform !== "win32" && !hasExited) {
			terminateTimer = setTimeout(terminate, CLOSE_GRACE_MS);
			terminateTimer.unref();
		}
	};
	const close = () => {
		if (closed) return;
		closed = true;
		rejectReady(/* @__PURE__ */ new Error("Claude CLI closed before initialization completed."));
		abortRequests();
		owner[Symbol.dispose]();
		beginShutdown();
	};
	const processExitError = () => exitError ?? /* @__PURE__ */ new Error("Claude CLI live session exited unexpectedly without a terminal result.");
	const settleInputError = (error) => {
		if (process.platform === "win32" || !isRecord(error) || error.code !== "EPIPE") return;
		const context = params.currentContext();
		inputFailure ??= Promise.resolve().then(async () => {
			beginShutdown();
			await exited;
			const failure = context?.abortSignal?.aborted ? context.abortSignal.reason : forcedExit ? error : processExitError();
			return owner.withDiagnostics(failure);
		}).catch((failure) => failure).then((failure) => context?.abortSignal?.aborted ? context.abortSignal.reason : failure);
		return inputFailure;
	};
	const fail = async (error) => {
		if (closed) return;
		const diagnostic = await (inputFailure ?? owner.withDiagnostics(error));
		if (!closed) {
			rejectReady(diagnostic);
			params.onError(diagnostic);
			close();
		}
	};
	const didExit = () => {
		if (hasExited) return;
		hasExited = true;
		clearTimeout(terminateTimer);
		clearTimeout(killTimer);
		if (process.platform !== "win32" || !closed) child.kill("SIGKILL");
		resolveExit();
	};
	child.onExit((code, signal) => {
		if (code !== 0) exitError = /* @__PURE__ */ new Error(signal ? `Claude Code process exited with signal ${signal}` : `Claude Code process exited with code ${code}`);
		didExit();
	});
	const send = (message) => {
		if (inputFailure) return inputFailure.then((error) => {
			throw error;
		});
		if (closed || shutdownStarted) return Promise.reject(/* @__PURE__ */ new Error("Claude CLI control channel is closed."));
		return new Promise((resolve, reject) => {
			child.stdin.write(`${JSON.stringify(message)}\n`, (error) => {
				if (error) {
					const settling = settleInputError(error);
					if (settling) settling.then(reject, reject);
					else reject(error);
				} else resolve();
			});
		});
	};
	const dispatch = async (id, request) => {
		if (requests.has(id)) return;
		const controller = new AbortController();
		requests.set(id, controller);
		try {
			let response;
			try {
				const reply = await params.onRequest(request, controller.signal);
				response = () => ({
					subtype: "success",
					request_id: id,
					response: reply()
				});
			} catch {
				response = () => ({
					subtype: "error",
					request_id: id,
					error: "OpenClaw could not handle this Claude control request."
				});
			}
			if (!closed) await send({
				type: "control_response",
				response: response()
			});
		} finally {
			if (requests.get(id) === controller) requests.delete(id);
		}
	};
	const acceptLine = async (line) => {
		if (inputFailure || !line.trim()) return;
		let message;
		try {
			message = JSON.parse(line);
		} catch {
			return;
		}
		if (!isRecord(message)) return;
		if (message.type === "control_response") {
			const response = message.response;
			if (isRecord(response) && response.request_id === initializeId) {
				if (response.subtype === "success") resolveReady(isRecord(response.response) ? response.response : {});
				else throw new Error("Claude CLI initialization failed.");
			}
		} else if (message.type === "control_request") {
			if (typeof message.request_id !== "string" || !isRecord(message.request)) throw new Error("Claude CLI sent a malformed control request.");
			dispatch(message.request_id, message.request).catch(fail);
		} else if (message.type === "control_cancel_request") {
			if (typeof message.request_id === "string") requests.get(message.request_id)?.abort();
		} else if (message.type !== "keep_alive") await params.onMessage(message);
	};
	const read = async () => {
		let pending = "";
		await child.consumeStdout(async (text) => {
			for (let offset = 0; offset < text.length;) {
				const newline = text.indexOf("\n", offset);
				const end = newline < 0 ? text.length : newline;
				if (pending.length + end - offset > MAX_LINE_CHARS) throw new Error(`Claude CLI JSONL line exceeded ${MAX_LINE_CHARS} characters.`);
				pending += text.slice(offset, end);
				offset = end + 1;
				if (newline >= 0) {
					const line = pending;
					pending = "";
					await acceptLine(line);
				}
			}
		});
		if (pending) await acceptLine(pending);
		await exited;
		if (!closed) throw inputFailure ? await inputFailure : processExitError();
	};
	const reading = read();
	child.onError((error, source) => {
		if (source === "process") exitError = error;
		const settling = source === "stdin" ? settleInputError(error) : void 0;
		settling ? settling.then(fail) : fail(error);
	});
	reading.catch(fail);
	return {
		close,
		waitForExit: async () => {
			await exited;
			await Promise.all([child.wait().catch(() => void 0), child.waitForExtinction?.()]);
			child.dispose();
		},
		send,
		async initialize() {
			await send({
				type: "control_request",
				request_id: initializeId,
				request: {
					subtype: "initialize",
					...params.initialize
				}
			});
			return await ready;
		}
	};
}
//#endregion
export { createClaudeCliTransport as t };
