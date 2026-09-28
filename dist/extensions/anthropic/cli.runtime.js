import { u as toErrorObject } from "../../error-coercion-C787aVxk.mjs";
import { c as isRecord } from "../../record-coerce-DItp3I4t.mjs";
import "../../error-runtime-Bf1fYXFh.mjs";
import "../../string-coerce-runtime-C_MKhRVt.mjs";
import { t as hasClaudeRawToolInvocation } from "../../cli-output-EjggqnXd.mjs";
import { t as prepareClaudeCliTransportArgs } from "../../cli-runtime-args-UumcGmHy.mjs";
import { t as createClaudeCliTransport } from "../../cli-transport-DD__rvZc.mjs";
import { t as createClaudeCliUserInputAuthorizer } from "../../cli-user-input-B7giNhbQ.mjs";
import { PassThrough } from "node:stream";
import { randomUUID } from "node:crypto";
import { once } from "node:events";
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
