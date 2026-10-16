import { u as toErrorObject } from "../../error-coercion-CvJK4lmH.mjs";
import { c as isRecord } from "../../record-coerce-TIsquoVR.mjs";
import "../../error-runtime-BmospGvZ.mjs";
import "../../string-coerce-runtime-50qKeWeL.mjs";
import { t as hasClaudeRawToolInvocation } from "../../cli-output-CGHp3Q7v.mjs";
import { t as prepareClaudeCliTransportArgs } from "../../cli-runtime-args-UumcGmHy.mjs";
import { t as createClaudeCliTransport } from "../../cli-transport-CEP0VCj-.mjs";
import { t as createClaudeCliUserInputAuthorizer } from "../../cli-user-input-JuwgTecH.mjs";
import { randomUUID } from "node:crypto";
import { once } from "node:events";
import { PassThrough } from "node:stream";
//#region extensions/anthropic/cli.runtime.ts
const IDLE_TIMEOUT_MS = 6e5;
function readReplayedTaskId(message, inputUuid) {
	if (message.type !== "user" || message.isReplay !== true || message.parent_tool_use_id !== null || message.uuid === inputUuid || !isRecord(message.message)) return;
	if (message.origin !== void 0 && (!isRecord(message.origin) || message.origin.kind !== "task-notification" || message.origin.subkind !== void 0)) return;
	const content = message.message.content;
	const first = Array.isArray(content) ? content[0] : void 0;
	const text = typeof content === "string" ? content : isRecord(first) && first.type === "text" && typeof first.text === "string" ? first.text : "";
	return /^<task-notification>\s*<task-id>([^<]+)<\/task-id>/u.exec(text)?.[1];
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
	const { input, tool_name: toolName } = request;
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
		if (decision.behavior === "allow" && toolName === "Bash" && toolUseId && decision.updatedInput.run_in_background !== true) turn.foregroundBashToolUseIds.add(toolUseId);
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
	const holdsBackgroundTasks = turn.pendingBackgroundTaskIds.size > 0;
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
		if (message.owned_by_subagent === true) {
			if (typeof message.task_id === "string" && message.task_id) turn.subagentTaskIds.add(message.task_id);
		} else if (typeof message.task_id === "string" && message.task_id) {
			if (message.is_backgrounded === false) turn.foregroundTaskIds.add(message.task_id);
			if (typeof message.tool_use_id === "string" && turn.foregroundBashToolUseIds.delete(message.tool_use_id) && message.is_backgrounded === true) turn.pendingBackgroundTaskIds.add(message.task_id);
		}
	}
	if (message.type === "system" && message.subtype === "background_tasks_changed") for (const task of Array.isArray(message.tasks) ? message.tasks : []) {
		if (!isRecord(task) || typeof task.task_id !== "string" || !task.task_id) continue;
		if (task.task_type === "local_agent" || task.task_type === "local_workflow" || task.task_type === "local_bash" && turn.foregroundTaskIds.has(task.task_id)) turn.pendingBackgroundTaskIds.add(task.task_id);
	}
	const replayedTaskId = readReplayedTaskId(message, turn.inputUuid);
	if (replayedTaskId) {
		turn.pendingBackgroundTaskIds.delete(replayedTaskId);
		turn.foregroundTaskIds.delete(replayedTaskId);
		turn.taskNotifications.set(replayedTaskId, "replayed");
	}
	if (message.type === "system" && message.subtype === "task_notification" && typeof message.task_id === "string" && message.task_id && !turn.subagentTaskIds.delete(message.task_id)) turn.taskNotifications.set(message.task_id, "queued");
	let completesTurn = false;
	if (message.type === "result") {
		const failed = message.is_error === true || typeof message.subtype === "string" && message.subtype.startsWith("error") || typeof message.result === "string" && hasClaudeRawToolInvocation(message.result);
		const taskNotification = isRecord(message.origin) && message.origin.kind === "task-notification" && message.origin.subkind === void 0;
		if (taskNotification && message.subtype === "success" && !failed) {
			const taskId = turn.taskNotifications.keys().next().value;
			if (taskId) {
				turn.taskNotifications.delete(taskId);
				turn.pendingBackgroundTaskIds.delete(taskId);
				turn.foregroundTaskIds.delete(taskId);
			}
		}
		for (const [taskId, state] of turn.taskNotifications) if (state === "replayed") turn.taskNotifications.delete(taskId);
		const queuedContinuation = turn.sawTerminalResult && taskNotification && message.num_turns === 0 && message.result === "" && message.stop_reason === null && message.terminal_reason === void 0;
		turn.sawTerminalResult = true;
		completesTurn = turn.pendingBackgroundTaskIds.size === 0 && !queuedContinuation || failed;
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
		foregroundBashToolUseIds: /* @__PURE__ */ new Set(),
		pendingBackgroundTaskIds: /* @__PURE__ */ new Set(),
		subagentTaskIds: /* @__PURE__ */ new Set(),
		taskNotifications: /* @__PURE__ */ new Map()
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
					systemPromptSnapshot: false,
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
