import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as signalProcessTree } from "./kill-tree-BGQdx374.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./process-runtime-BF3dUvYO.mjs";
import { a as createDeferred } from "./extension-shared-N0S3ppSB.mjs";
import { t as createClaudeCliProcessOwner } from "./cli-process-CiPzcnHV.mjs";
import { randomUUID } from "node:crypto";
//#region extensions/anthropic/cli-transport.ts
const MAX_LINE_CHARS = 8388608;
const CLOSE_GRACE_MS = 500;
const KILL_GRACE_MS = 1e3;
/** One Claude Code subprocess and its bidirectional stream-json control channel. */
function createClaudeCliTransport(params) {
	const owner = createClaudeCliProcessOwner(params.currentContext, params.secretInput);
	let child;
	try {
		const env = { ...params.context.env };
		delete env.NODE_OPTIONS;
		delete env.DEBUG;
		child = owner.spawn({
			...params.context,
			args: params.args,
			env
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
	let hasExited = false;
	let exitError;
	let terminateTimer;
	let killTimer;
	const { promise: exited, resolve: resolveExit } = createDeferred();
	let treeExit = Promise.resolve();
	const signalTree = (signal) => new Promise((resolve) => {
		if (!child.pid) {
			resolve();
			return;
		}
		signalProcessTree(child.pid, signal, {
			detached: process.platform !== "win32",
			onComplete: resolve
		});
	});
	const terminate = () => {
		treeExit = signalTree("SIGTERM");
		killTimer = setTimeout(() => {
			treeExit = signalTree("SIGKILL");
		}, KILL_GRACE_MS);
		killTimer.unref();
	};
	const close = () => {
		if (closed) return;
		closed = true;
		rejectReady(/* @__PURE__ */ new Error("Claude CLI closed before initialization completed."));
		for (const controller of requests.values()) controller.abort();
		requests.clear();
		owner[Symbol.dispose]();
		if (process.platform === "win32" && !hasExited) {
			treeExit = signalTree("SIGKILL");
			treeExit.then(() => child.stdin.end());
		} else child.stdin.end();
		if (process.platform !== "win32" && !hasExited) {
			terminateTimer = setTimeout(terminate, CLOSE_GRACE_MS);
			terminateTimer.unref();
		}
	};
	const fail = async (error) => {
		if (closed) return;
		const diagnostic = await owner.withDiagnostics(error);
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
		if (process.platform !== "win32" || !closed) treeExit = signalTree("SIGKILL");
		resolveExit();
	};
	child.once("error", (error) => {
		exitError = error;
		if (!child.pid) didExit();
		fail(error);
	});
	child.once("exit", (code, signal) => {
		if (code !== 0) exitError = /* @__PURE__ */ new Error(signal ? `Claude Code process exited with signal ${signal}` : `Claude Code process exited with code ${code}`);
		didExit();
	});
	child.stdin.on("error", (error) => {
		fail(error);
	});
	const send = (message) => {
		if (closed) return Promise.reject(/* @__PURE__ */ new Error("Claude CLI control channel is closed."));
		return new Promise((resolve, reject) => {
			child.stdin.write(`${JSON.stringify(message)}\n`, (error) => {
				if (error) reject(error);
				else resolve();
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
		if (!line.trim()) return;
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
				if (response.subtype === "success") resolveReady();
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
		child.stdout.setEncoding("utf8");
		for await (const chunk of child.stdout) {
			const text = String(chunk);
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
		}
		if (pending) await acceptLine(pending);
		await exited;
		if (!closed) throw exitError ?? /* @__PURE__ */ new Error("Claude CLI live session exited unexpectedly without a terminal result.");
	};
	read().catch(fail);
	return {
		close,
		waitForExit: async () => {
			await exited;
			await treeExit;
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
			await ready;
		}
	};
}
//#endregion
export { createClaudeCliTransport as t };
