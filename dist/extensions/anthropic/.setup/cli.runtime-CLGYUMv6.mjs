import { t as hasClaudeRawToolInvocation } from "./cli-output-BXHF88ZZ.mjs";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { killProcessTree, prepareSecretInputStdio, signalProcessTree } from "openclaw/plugin-sdk/process-runtime";
import { randomUUID } from "node:crypto";
import { once } from "node:events";
import { PassThrough } from "node:stream";
import { attachErrorDiagnostic, toErrorObject } from "openclaw/plugin-sdk/error-runtime";
import { createDeferred } from "openclaw/plugin-sdk/extension-shared";
import { spawn } from "node:child_process";
import { redactSensitiveFieldValue, redactSensitiveText } from "openclaw/plugin-sdk/logging-core";
import { sliceUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
//#region extensions/anthropic/cli-runtime-args.ts
const PROTOCOL_FLAGS = /* @__PURE__ */ new Set([
	"-p",
	"--print",
	"--verbose",
	"--include-partial-messages",
	"--replay-user-messages",
	"--dangerously-skip-permissions",
	"--allow-dangerously-skip-permissions"
]);
const PROTOCOL_VALUE_FLAGS = /* @__PURE__ */ new Set([
	"--output-format",
	"--input-format",
	"--permission-prompt-tool",
	"--permission-mode",
	"--model",
	"--session-id",
	"--resume",
	"-r",
	"--append-system-prompt-file",
	"--append-system-prompt",
	"--system-prompt-file",
	"--system-prompt"
]);
const TOOL_FLAGS = /* @__PURE__ */ new Set([
	"--tools",
	"--allowedTools",
	"--allowed-tools"
]);
/** Keep prepared CLI arguments, replacing only transport and admission-owned policy. */
function prepareClaudeCliTransportArgs(context) {
	const args = [];
	const allowedTools = [];
	let tools;
	let settingSources = "user";
	let excludeDynamicSections = false;
	for (let index = 0; index < context.args.length; index += 1) {
		const raw = context.args[index];
		const equals = raw.indexOf("=");
		const flag = equals < 0 ? raw : raw.slice(0, equals);
		if (PROTOCOL_FLAGS.has(flag)) continue;
		if (flag === "--exclude-dynamic-system-prompt-sections") {
			excludeDynamicSections = true;
			continue;
		}
		if (!PROTOCOL_VALUE_FLAGS.has(flag) && !TOOL_FLAGS.has(flag) && flag !== "--setting-sources") {
			args.push(raw);
			continue;
		}
		const value = equals < 0 ? context.args[++index] : raw.slice(equals + 1);
		if (value === void 0) throw new Error(`Claude CLI cannot preserve ${flag} without its value.`);
		if (PROTOCOL_VALUE_FLAGS.has(flag)) continue;
		if (flag === "--setting-sources") {
			if (value !== "" && value !== "user") throw new Error("Claude CLI settings must be limited to user settings.");
			settingSources = value;
			continue;
		}
		const values = [value];
		if (equals < 0) while (index + 1 < context.args.length && !context.args[index + 1]?.startsWith("-")) values.push(context.args[++index]);
		const names = values.flatMap((entry) => entry.split(",").map((name) => name.trim()).filter(Boolean));
		if (flag === "--tools") tools = names;
		else allowedTools.push(...names.filter((name) => name.startsWith("mcp__openclaw__")));
	}
	let approvedTools = [...new Set(allowedTools)];
	if (context.toolAvailability) {
		tools = [...context.toolAvailability.native];
		approvedTools = context.toolAvailability.openClaw.map((name) => `mcp__openclaw__${name}`).filter((name) => allowedTools.includes(name) || allowedTools.includes("mcp__openclaw__*"));
	}
	args.push("--print", "--input-format", "stream-json", "--output-format", "stream-json", "--verbose", "--include-partial-messages", "--replay-user-messages", "--permission-prompt-tool", "stdio", "--permission-mode", "default", "--setting-sources", settingSources, "--model", context.modelId);
	if (tools) args.push("--tools", tools.join(","));
	if (approvedTools.length) args.push("--allowedTools", approvedTools.join(","));
	if (context.sessionId) args.push(context.useResume ? "--resume" : "--session-id", context.sessionId);
	return {
		args,
		excludeDynamicSections
	};
}
//#endregion
//#region \0@oxc-project+runtime@0.149.0/helpers/esm/usingCtx.js
function _usingCtx() {
	var r = "function" == typeof SuppressedError ? SuppressedError : function(r, e) {
		var n = Error();
		return n.name = "SuppressedError", n.error = r, n.suppressed = e, n;
	}, e = {}, n = [];
	function using(r, e) {
		if (null != e) {
			if (Object(e) !== e) throw new TypeError("using declarations can only be used with objects, functions, null, or undefined.");
			if (r) var o = e[Symbol.asyncDispose || Symbol["for"]("Symbol.asyncDispose")];
			if (void 0 === o && (o = e[Symbol.dispose || Symbol["for"]("Symbol.dispose")], r)) var t = o;
			if ("function" != typeof o) throw new TypeError("Object is not disposable.");
			t && (o = function o() {
				try {
					t.call(e);
				} catch (r) {
					return Promise.reject(r);
				}
			}), n.push({
				v: e,
				d: o,
				a: r
			});
		} else r && n.push({
			d: e,
			a: r
		});
		return e;
	}
	return {
		e,
		u: using.bind(null, !1),
		a: using.bind(null, !0),
		d: function d() {
			var o, t = this.e, s = 0;
			function next() {
				for (; o = n.pop();) try {
					if (!o.a && 1 === s) return s = 0, n.push(o), Promise.resolve().then(next);
					if (o.d) {
						var r = o.d.call(o.v);
						if (o.a) return s |= 2, Promise.resolve(r).then(next, err);
					} else s |= 1;
				} catch (r) {
					return err(r);
				}
				if (1 === s) return t !== e ? Promise.reject(t) : Promise.resolve();
				if (t !== e) throw t;
			}
			function err(n) {
				return t = t !== e ? new r(n, t) : n, next();
			}
			return next();
		}
	};
}
//#endregion
//#region extensions/anthropic/cli-process.ts
const STDERR_CAPTURE_CHARS = 8192;
const STDERR_DRAIN_GRACE_MS = 200;
function spawnClaudeCliProcess(options, secretInput, observeStderr) {
	try {
		var _usingCtx$1 = _usingCtx();
		const stdio = [
			"pipe",
			"pipe",
			"pipe"
		];
		const secretDelivery = _usingCtx$1.u(prepareSecretInputStdio(stdio, secretInput));
		const child = spawn(options.command, options.args, {
			argv0: options.argv0,
			cwd: options.cwd,
			detached: process.platform !== "win32",
			env: options.env,
			signal: options.signal,
			stdio,
			windowsHide: true
		});
		observeStderr(child);
		const killChild = child.kill.bind(child);
		child.kill = (signal) => {
			if (!child.pid || signal !== void 0 && signal !== "SIGTERM" && signal !== "SIGKILL") return killChild(signal);
			killProcessTree(child.pid, {
				detached: process.platform !== "win32",
				...signal === "SIGKILL" ? { force: true } : {}
			});
			return true;
		};
		secretDelivery?.deliverTo(child).catch(() => child.kill());
		return child;
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
	}
}
/** Owns process-wide diagnostics and the credentials needed to redact warm turns. */
function createClaudeCliProcessOwner(currentContext, secretInput) {
	const assertCurrent = () => {
		const context = currentContext();
		if (!context) throw new Error("Claude CLI run is no longer active.");
		context.assertCurrent?.();
	};
	assertCurrent();
	const credential = secretInput?.createData();
	let environment = {};
	let child;
	let drained;
	let disposed = false;
	let tail = "";
	let dropPartialLine = false;
	const observeStderr = (process) => {
		child = process;
		drained = new Promise((resolve) => {
			process.stderr.once("close", resolve);
		});
		process.stderr.setEncoding("utf8");
		process.stderr.on("error", () => {});
		process.stderr.on("data", (chunk) => {
			let text = chunk;
			if (disposed) return;
			if (dropPartialLine) {
				const newline = text.indexOf("\n");
				if (newline < 0) return;
				text = text.slice(newline + 1);
				dropPartialLine = false;
			}
			tail += text;
			if (tail.length > STDERR_CAPTURE_CHARS) {
				const bounded = sliceUtf16Safe(tail, -8192);
				const newline = bounded.indexOf("\n");
				tail = newline < 0 ? "" : bounded.slice(newline + 1);
				dropPartialLine = newline < 0;
			}
		});
	};
	return {
		[Symbol.dispose]() {
			disposed = true;
			credential?.fill(0);
			environment = {};
			tail = "";
		},
		spawn: (options) => {
			assertCurrent();
			environment = options.env;
			return spawnClaudeCliProcess(options, secretInput, observeStderr);
		},
		async withDiagnostics(error) {
			const context = currentContext();
			if (disposed || !context || context.abortSignal?.aborted) return error;
			if (child && (child.exitCode !== null || child.signalCode !== null)) {
				let timer;
				try {
					await Promise.race([drained, new Promise((resolve) => {
						timer = setTimeout(resolve, STDERR_DRAIN_GRACE_MS);
					})]);
				} finally {
					clearTimeout(timer);
				}
			}
			if (disposed || currentContext() !== context || context.abortSignal?.aborted) return error;
			let diagnostic = tail;
			const secrets = [environment, context.env].flatMap((env) => Object.entries(env).flatMap(([name, value]) => value && redactSensitiveFieldValue(name, value, { mode: "tools" }) !== value ? [value] : []));
			if (credential) secrets.push(credential.toString("utf8"));
			for (const secret of secrets.filter(Boolean)) for (const value of [
				secret,
				encodeURIComponent(secret),
				JSON.stringify(secret).slice(1, -1)
			]) diagnostic = diagnostic.replaceAll(value, "[REDACTED]");
			diagnostic = sliceUtf16Safe(redactSensitiveText(diagnostic, { mode: "tools" }), -2e3).trim();
			if (diagnostic && error instanceof Error) attachErrorDiagnostic(error, `stderr (process-wide; may include earlier turns): ${diagnostic}`);
			return error;
		}
	};
}
//#endregion
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
//#region extensions/anthropic/cli-user-input.ts
function createClaudeCliUserInputAuthorizer(context) {
	const requests = /* @__PURE__ */ new Map();
	return { authorize(params) {
		const existing = params.toolUseId ? requests.get(params.toolUseId) : void 0;
		if (existing) return existing;
		const request = runClaudeUserInput(context, params);
		if (params.toolUseId) requests.set(params.toolUseId, request);
		return request;
	} };
}
async function runClaudeUserInput(context, params) {
	const parsed = readClaudeUserInputQuestions(params.input);
	if (!parsed.ok) return {
		behavior: "deny",
		message: `OpenClaw rejected malformed Claude user questions: ${parsed.failure}. Correct the invalid field and retry AskUserQuestion.`
	};
	const questions = parsed.questions;
	const result = await context.requestUserInput({
		toolName: "AskUserQuestion",
		questions,
		intro: "Claude needs input:",
		...params.toolUseId ? { toolCallId: params.toolUseId } : {},
		abortSignal: params.signal
	});
	if (result.status !== "answered") return {
		behavior: "deny",
		message: `${result.message} Continue with your best judgment.`
	};
	const answers = {};
	questions.forEach((question) => {
		answers[question.question] = (result.answers[question.id] ?? []).join(", ");
	});
	return {
		behavior: "allow",
		updatedInput: {
			...params.input,
			answers
		}
	};
}
function readClaudeUserInputQuestions(input) {
	const rawQuestions = input.questions;
	if (!Array.isArray(rawQuestions) || rawQuestions.length < 1 || rawQuestions.length > 4) return {
		ok: false,
		failure: "questions must be an array of 1 to 4 questions"
	};
	const questions = [];
	for (const [index, rawQuestion] of rawQuestions.entries()) {
		const questionPath = `questions[${index}]`;
		if (!isRecord(rawQuestion)) return {
			ok: false,
			failure: `${questionPath} must be an object`
		};
		const question = readBoundedText(rawQuestion.question, 4096);
		if (!question.ok) return {
			ok: false,
			failure: `${questionPath}.question ${question.failure}`
		};
		const header = readBoundedText(rawQuestion.header, 12);
		if (!header.ok) return {
			ok: false,
			failure: `${questionPath}.header ${header.failure}`
		};
		const rawOptions = rawQuestion.options;
		if (!Array.isArray(rawOptions) || rawOptions.length < 2 || rawOptions.length > 4) return {
			ok: false,
			failure: `${questionPath}.options must be an array of 2 to 4 options`
		};
		if (typeof rawQuestion.multiSelect !== "boolean") return {
			ok: false,
			failure: `${questionPath}.multiSelect must be a boolean`
		};
		const options = [];
		for (const [optionIndex, rawOption] of rawOptions.entries()) {
			const optionPath = `${questionPath}.options[${optionIndex}]`;
			if (!isRecord(rawOption)) return {
				ok: false,
				failure: `${optionPath} must be an object`
			};
			const label = readBoundedText(rawOption.label, 256);
			if (!label.ok) return {
				ok: false,
				failure: `${optionPath}.label ${label.failure}`
			};
			const description = readBoundedText(rawOption.description, 1024);
			if (!description.ok) return {
				ok: false,
				failure: `${optionPath}.description ${description.failure}`
			};
			options.push({
				label: label.text,
				description: description.text
			});
		}
		questions.push({
			id: `question_${index + 1}`,
			header: header.text,
			question: question.text,
			multiSelect: rawQuestion.multiSelect,
			isOther: true,
			options
		});
	}
	return {
		ok: true,
		questions
	};
}
function readBoundedText(value, maxLength) {
	if (typeof value !== "string") return {
		ok: false,
		failure: "must be a string"
	};
	if (value.length === 0) return {
		ok: false,
		failure: "must not be empty"
	};
	if (value.length > maxLength) return {
		ok: false,
		failure: `must be at most ${maxLength} characters`
	};
	return {
		ok: true,
		text: value
	};
}
//#endregion
//#region extensions/anthropic/cli.runtime.ts
const IDLE_TIMEOUT_MS = 6e5;
const RESULT_HOLDING_TASK_TYPES = /* @__PURE__ */ new Set(["local_agent", "local_workflow"]);
const TIMEOUT_BACKGROUNDED_TASK_TYPE = "local_bash";
function readReplayedTaskId(message, inputUuid) {
	if (message.type !== "user" || message.isReplay !== true || message.parent_tool_use_id !== null || message.uuid === inputUuid || !isRecord(message.message)) return;
	if (message.origin !== void 0 && (!isRecord(message.origin) || message.origin.kind !== "task-notification" || message.origin.subkind !== void 0)) return;
	const content = message.message.content;
	const first = Array.isArray(content) ? content[0] : void 0;
	const text = typeof content === "string" ? content : isRecord(first) && first.type === "text" && typeof first.text === "string" ? first.text : "";
	return /^<task-notification>\s*<task-id>([^<]+)<\/task-id>/u.exec(text)?.[1];
}
/** Background work whose final answer Claude Code delivers in a later result. */
function hasResultHoldingBackgroundTasks(session, turn) {
	return session.hasBackgroundTasks || turn.pendingBackgroundTaskIds.size > 0;
}
const sessions = /* @__PURE__ */ new WeakMap();
function activeTurn(session) {
	const turn = session.currentTurn;
	if (!turn || turn.controller.signal.aborted || turn.context.abortSignal?.aborted) return;
	if (session.hasInputLifecycle && !turn.inputStarted) return;
	try {
		turn.context.assertCurrent?.();
		return turn;
	} catch {
		return;
	}
}
async function authorizeTool(session, request, signal) {
	const turn = activeTurn(session);
	const input = request.input;
	const toolName = request.tool_name;
	if (!turn || signal.aborted || typeof toolName !== "string" || !isRecord(input)) return {
		behavior: "deny",
		message: "The OpenClaw run or native tool input is no longer valid."
	};
	const toolUseId = typeof request.tool_use_id === "string" ? request.tool_use_id : void 0;
	const abortSignal = AbortSignal.any([signal, turn.controller.signal]);
	try {
		const decision = toolName === "AskUserQuestion" ? await turn.userInput.authorize({
			input,
			signal: abortSignal,
			toolUseId
		}) : await turn.context.requestToolPermission({
			toolName,
			toolInput: input,
			cwd: typeof request.cwd === "string" ? request.cwd : void 0,
			toolCallId: toolUseId,
			abortSignal
		});
		if (activeTurn(session) !== turn || abortSignal.aborted) return {
			behavior: "deny",
			message: "The OpenClaw run is no longer active."
		};
		return decision;
	} catch {
		return {
			behavior: "deny",
			message: "OpenClaw could not authorize this tool call."
		};
	}
}
async function handleRequest(session, request, signal) {
	if (request.subtype === "can_use_tool") return {
		...await authorizeTool(session, request, signal),
		toolUseID: request.tool_use_id
	};
	if (request.subtype !== "hook_callback" || !isRecord(request.input)) throw new Error("Unsupported Claude CLI control request.");
	const input = request.input;
	const turn = activeTurn(session);
	if (request.callback_id === "UserPromptSubmit" && input.hook_event_name === "UserPromptSubmit") {
		if (!turn || signal.aborted) return {};
		const additionalContext = [turn.context.promptContext?.prependContext, turn.context.promptContext?.appendContext].filter(Boolean).join("\n\n");
		return additionalContext ? { hookSpecificOutput: {
			hookEventName: "UserPromptSubmit",
			additionalContext
		} } : {};
	}
	if (request.callback_id === "PreToolUse" && input.hook_event_name === "PreToolUse") {
		if (turn && !signal.aborted && typeof input.tool_name === "string" && input.tool_name.startsWith("mcp__openclaw__")) return { continue: true };
		const decision = await authorizeTool(session, {
			tool_name: input.tool_name,
			input: input.tool_input,
			cwd: input.cwd,
			tool_use_id: request.tool_use_id ?? input.tool_use_id
		}, signal);
		return { hookSpecificOutput: {
			hookEventName: "PreToolUse",
			permissionDecision: decision.behavior,
			...decision.behavior === "allow" ? { updatedInput: decision.updatedInput } : { permissionDecisionReason: decision.message }
		} };
	}
	throw new Error("Unknown Claude CLI hook callback.");
}
function closeSession(session, _reason, error) {
	if (session.closed) return;
	session.closed = true;
	clearTimeout(session.idleTimer);
	session.capability?.remove(session.handle);
	const turn = session.currentTurn;
	session.currentTurn = void 0;
	if (turn) {
		turn.error = toErrorObject(error, "Claude CLI live session closed.");
		turn.controller.abort();
		turn.events.end();
	}
	session.transport?.close();
}
function completeTurn(session, turn) {
	const holdsBackgroundTasks = hasResultHoldingBackgroundTasks(session, turn);
	session.currentTurn = void 0;
	turn.controller.abort();
	turn.events.end();
	if (!session.capability || holdsBackgroundTasks) session.handle.close(holdsBackgroundTasks ? "abort" : "idle");
	else {
		session.idleTimer = setTimeout(() => session.handle.close("idle"), IDLE_TIMEOUT_MS);
		session.idleTimer.unref();
	}
}
async function acceptMessage(session, message) {
	if (message.type === "system" && message.subtype === "init") session.hasInputLifecycle = Array.isArray(message.capabilities) && message.capabilities.includes("msg_lifecycle_v1");
	const turn = session.currentTurn;
	if (!turn) return;
	if (message.type === "command_lifecycle") {
		if (message.state === "started" && message.command_uuid === turn.inputUuid) turn.inputStarted = true;
		return;
	}
	if (session.hasInputLifecycle && !turn.inputStarted && !(message.type === "system" && message.subtype === "init")) return;
	if (message.type === "system" && message.subtype === "task_started") {
		if (typeof message.task_id === "string" && message.task_id && message.is_backgrounded === false) turn.foregroundTaskIds.add(message.task_id);
	}
	if (message.type === "system" && message.subtype === "background_tasks_changed") {
		session.hasBackgroundTasks = false;
		for (const task of Array.isArray(message.tasks) ? message.tasks : []) {
			if (!isRecord(task) || typeof task.task_id !== "string" || !task.task_id) continue;
			if (typeof task.task_type === "string" && RESULT_HOLDING_TASK_TYPES.has(task.task_type)) session.hasBackgroundTasks = true;
			else if (task.task_type === TIMEOUT_BACKGROUNDED_TASK_TYPE && turn.foregroundTaskIds.has(task.task_id)) turn.pendingBackgroundTaskIds.add(task.task_id);
		}
	}
	if (turn.pendingBackgroundTaskIds.size > 0) {
		const taskId = readReplayedTaskId(message, turn.inputUuid);
		if (taskId && turn.pendingBackgroundTaskIds.delete(taskId)) turn.foregroundTaskIds.delete(taskId);
	}
	let completesTurn = false;
	if (message.type === "result") {
		const queuedContinuation = turn.sawTerminalResult && isRecord(message.origin) && message.origin.kind === "task-notification" && message.origin.subkind === void 0 && message.num_turns === 0 && message.result === "" && message.stop_reason === null && message.terminal_reason === void 0;
		turn.sawTerminalResult = true;
		completesTurn = !hasResultHoldingBackgroundTasks(session, turn) && !queuedContinuation || message.is_error === true || typeof message.subtype === "string" && message.subtype.startsWith("error") || typeof message.result === "string" && hasClaudeRawToolInvocation(message.result);
	}
	const outputMessage = message.type === "result" && !completesTurn ? {
		...message,
		openclaw_interim_result: true
	} : message;
	if (!turn.events.write(outputMessage)) await once(turn.events, "drain", { signal: turn.controller.signal });
	if (completesTurn) completeTurn(session, turn);
}
function createSession(capability) {
	const session = {
		capability,
		hasBackgroundTasks: false,
		hasInputLifecycle: false,
		closed: false,
		handle: {
			generation: randomUUID(),
			fingerprint: capability?.fingerprint ?? randomUUID(),
			isIdle: () => !session.closed && !session.currentTurn,
			close: (reason, error) => closeSession(session, reason, error),
			waitForExit: () => session.transport?.waitForExit() ?? Promise.resolve()
		}
	};
	sessions.set(session.handle, session);
	capability?.register(session.handle);
	return session;
}
async function* executeClaudeCli(context, secretInput) {
	context.assertCurrent?.();
	context.abortSignal?.throwIfAborted();
	const capability = context.liveSession;
	const existing = capability?.current();
	const reusable = existing && existing.fingerprint === capability?.fingerprint ? sessions.get(existing) : void 0;
	if (!reusable && capability) await capability.restart();
	context.assertCurrent?.();
	const session = reusable ?? createSession(capability);
	session.capability = capability;
	if (session.closed || session.currentTurn) throw new Error("Claude CLI live session is closed or already handling another turn.");
	clearTimeout(session.idleTimer);
	const turn = {
		context,
		controller: new AbortController(),
		userInput: createClaudeCliUserInputAuthorizer(context),
		events: new PassThrough({ objectMode: true }),
		inputUuid: randomUUID(),
		inputStarted: false,
		sawTerminalResult: false,
		foregroundTaskIds: /* @__PURE__ */ new Set(),
		pendingBackgroundTaskIds: /* @__PURE__ */ new Set()
	};
	session.currentTurn = turn;
	const abort = () => session.handle.close("abort", context.abortSignal?.reason);
	context.abortSignal?.addEventListener("abort", abort, { once: true });
	try {
		context.abortSignal?.throwIfAborted();
		capability?.activate(session.handle);
		if (!session.transport) {
			const { args, excludeDynamicSections } = prepareClaudeCliTransportArgs(context);
			session.transport = createClaudeCliTransport({
				context,
				args,
				secretInput,
				currentContext: () => session.currentTurn?.context,
				initialize: {
					appendSystemPrompt: context.systemPrompt,
					excludeDynamicSections,
					hooks: {
						UserPromptSubmit: [{ hookCallbackIds: ["UserPromptSubmit"] }],
						PreToolUse: [{ hookCallbackIds: ["PreToolUse"] }]
					}
				},
				onMessage: (message) => acceptMessage(session, message),
				onRequest: async (request, signal) => {
					if (request.subtype === "elicitation") return () => ({ action: "decline" });
					const admittedTurn = activeTurn(session);
					const response = await handleRequest(session, request, signal);
					return () => {
						if (admittedTurn && activeTurn(session) === admittedTurn && !signal.aborted) return response;
						const message = "The OpenClaw run is no longer active.";
						if (request.subtype === "can_use_tool") return {
							behavior: "deny",
							message,
							toolUseID: request.tool_use_id
						};
						return request.callback_id === "PreToolUse" ? { hookSpecificOutput: {
							hookEventName: "PreToolUse",
							permissionDecision: "deny",
							permissionDecisionReason: message
						} } : {};
					};
				},
				onError: (error) => session.handle.close("abort", error)
			});
			await session.transport.initialize();
		}
		context.assertCurrent?.();
		if (session.closed || session.currentTurn !== turn) throw turn.error ?? /* @__PURE__ */ new Error("Claude CLI closed before its prompt was accepted.");
		await session.transport.send({
			type: "user",
			message: {
				role: "user",
				content: context.prompt
			},
			parent_tool_use_id: null,
			uuid: turn.inputUuid,
			...context.sessionId ? { session_id: context.sessionId } : {}
		});
		for await (const record of turn.events) yield record;
		if (turn.error) throw turn.error;
		if (!turn.sawTerminalResult) throw new Error("Claude CLI exited without a terminal result.");
	} catch (error) {
		session.handle.close("abort", error);
		throw error;
	} finally {
		turn.controller.abort();
		context.abortSignal?.removeEventListener("abort", abort);
		if (session.currentTurn === turn) session.handle.close("abort");
		if (session.closed) await session.handle.waitForExit();
	}
}
//#endregion
export { executeClaudeCli };
