import { t as createClaudeCliTransport } from "./cli-transport-Bha-fPop.mjs";
import { t as hasClaudeRawToolInvocation } from "./cli-output-iGeO18JR.mjs";
import { isRecord, truncateUtf16Safe } from "openclaw/plugin-sdk/string-coerce-runtime";
import { once } from "node:events";
import { randomUUID } from "node:crypto";
import { createDeferred } from "openclaw/plugin-sdk/extension-shared";
import { toErrorObject } from "openclaw/plugin-sdk/error-runtime";
import { PassThrough } from "node:stream";
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
//#region extensions/anthropic/cli-runtime-tasks.ts
function readReplayedTaskId(message, submittedInputUuids) {
	if (message.type !== "user" || message.isReplay !== true || message.parent_tool_use_id !== null || typeof message.uuid === "string" && submittedInputUuids.has(message.uuid) || !isRecord(message.message)) return;
	if (message.origin !== void 0 && (!isRecord(message.origin) || message.origin.kind !== "task-notification" || message.origin.subkind !== void 0)) return;
	const content = message.message.content;
	const first = Array.isArray(content) ? content[0] : void 0;
	const text = typeof content === "string" ? content : isRecord(first) && first.type === "text" && typeof first.text === "string" ? first.text : "";
	return /^<task-notification>\s*<task-id>([^<]+)<\/task-id>/u.exec(text)?.[1];
}
function recordTaskOwnership(session, task, inputUuid) {
	const taskId = task.task_id;
	if (typeof taskId !== "string" || !taskId) return;
	const previous = session.taskOwners.get(taskId);
	const owner = task.owned_by_subagent === true ? false : previous ?? (typeof task.parent_task_id === "string" ? session.taskOwners.get(task.parent_task_id) : void 0) ?? inputUuid;
	if (owner !== previous) session.taskOwners.set(taskId, owner);
	if (typeof task.run_id === "string" && task.run_id) session.taskRuns.set(task.run_id, taskId);
	return owner === false ? void 0 : taskId;
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
			const description = readBoundedText(rawOption.description, 1024, { shorten: true });
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
function readBoundedText(value, maxLength, options = {}) {
	if (typeof value !== "string") return {
		ok: false,
		failure: "must be a string"
	};
	if (value.length === 0) return {
		ok: false,
		failure: "must not be empty"
	};
	if (value.length > maxLength) return options.shorten ? {
		ok: true,
		text: `${truncateUtf16Safe(value, maxLength - 1)}\u2026`
	} : {
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
function isInjectedPrompt(turn, prompt) {
	if (turn.promptInputUuid !== turn.inputUuid) return true;
	const injected = [...turn.injectedInputs].find(([, input]) => input.text === prompt);
	if (!injected) return false;
	turn.promptInputUuid = injected[0];
	return true;
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
		if (!turn || signal.aborted || isInjectedPrompt(turn, input.prompt)) return {};
		turn.promptSubmitted = true;
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
function createUserInput(context, text, uuid) {
	return {
		type: "user",
		message: {
			role: "user",
			content: text
		},
		parent_tool_use_id: null,
		uuid,
		...context.sessionId ? { session_id: context.sessionId } : {}
	};
}
function rejectInjectedInputs(turn, error) {
	for (const input of turn.injectedInputs.values()) input.started.reject(error);
}
async function injectInput(session, turn, text, withCurrent) {
	const uuid = randomUUID();
	const started = createDeferred();
	started.promise.catch(() => {});
	let written;
	await withCurrent(() => {
		if (!session.hasInputLifecycle || !session.transport || !turn.promptSubmitted || activeTurn(session) !== turn) throw new Error("The Claude CLI turn cannot accept more input.");
		turn.injectedInputs.set(uuid, {
			text,
			started
		});
		turn.submittedInputUuids.add(uuid);
		written = session.transport.send(createUserInput(turn.context, text, uuid));
		written.catch(() => {});
	});
	if (!written) throw new Error("The host did not admit Claude CLI input.");
	try {
		await written;
	} catch (error) {
		turn.injectedInputs.delete(uuid);
		throw error;
	}
	await started.promise;
}
function closeSession(session, error) {
	if (session.closed) return;
	session.closed = true;
	clearTimeout(session.idleTimer);
	session.capability?.remove(session.handle);
	const turn = session.currentTurn;
	session.currentTurn = void 0;
	if (turn) {
		turn.error = toErrorObject(error, "Claude CLI live session closed.");
		rejectInjectedInputs(turn, turn.error);
		turn.controller.abort();
		turn.events.end();
	}
	session.transport?.close();
}
function completeTurn(session, turn) {
	const holdsBackgroundTasks = turn.pendingBackgroundTaskIds.size > 0 || session.runningDescendants.size > 0;
	session.currentTurn = void 0;
	const orphanedInput = turn.injectedInputs.size > 0;
	rejectInjectedInputs(turn, /* @__PURE__ */ new Error("Claude CLI turn ended before its injected input completed."));
	turn.controller.abort();
	turn.events.end();
	if (!session.capability || holdsBackgroundTasks || orphanedInput) session.handle.close(holdsBackgroundTasks || orphanedInput ? "abort" : "idle");
	else {
		session.idleTimer = setTimeout(() => session.handle.close("idle"), IDLE_TIMEOUT_MS);
		session.idleTimer.unref();
	}
}
async function emitHeldInterimResult(turn) {
	const heldResult = turn.heldResult;
	if (!heldResult) return;
	turn.heldResult = void 0;
	if (!turn.events.write({
		...heldResult,
		openclaw_interim_result: true
	})) await once(turn.events, "drain", { signal: turn.controller.signal });
}
async function acceptMessage(session, message) {
	if (message.type === "system" && message.subtype === "init") session.hasInputLifecycle = Array.isArray(message.capabilities) && message.capabilities.includes("msg_lifecycle_v1");
	const turn = session.currentTurn;
	let parentRuns = false;
	let notifiedTaskId;
	if (message.type === "system") {
		const inputUuid = activeTurn(session)?.inputUuid ?? "";
		const tasks = message.subtype === "background_tasks_changed" && Array.isArray(message.tasks) ? message.tasks.filter(isRecord) : message.subtype === "task_started" || message.subtype === "task_notification" ? [message] : [];
		for (const task of tasks) {
			if (typeof task.task_id !== "string" || !task.task_id) continue;
			const id = task.task_id;
			recordTaskOwnership(session, task, inputUuid);
			if (task.owned_by_subagent === true && turn) {
				turn.pendingBackgroundTaskIds.delete(id);
				turn.foregroundTaskIds.delete(id);
				turn.taskNotifications.delete(id);
			}
			if (task.task_type === "local_agent" || task.task_type === "local_workflow" || task.owned_by_subagent === true || typeof task.parent_task_id === "string") session.runningDescendants.set(id, typeof task.parent_task_id === "string" ? task.parent_task_id : session.runningDescendants.get(id));
		}
		if (message.subtype === "task_notification" && typeof message.task_id === "string") {
			const id = message.task_id;
			const parent = session.runningDescendants.get(id);
			parentRuns = parent !== void 0 && session.runningDescendants.has(parent);
			session.runningDescendants.delete(id);
			if (!session.notifiedTasks.has(id) && session.taskOwners.get(id) !== false) notifiedTaskId = id;
			session.notifiedTasks.add(id);
		}
	}
	if (!turn) return;
	if (message.type === "command_lifecycle") {
		if (message.state === "started" && message.command_uuid === turn.inputUuid) turn.inputStarted = true;
		const injectedUuid = typeof message.command_uuid === "string" ? message.command_uuid : void 0;
		const injected = injectedUuid ? turn.injectedInputs.get(injectedUuid) : void 0;
		if (injected && injectedUuid && message.state === "started") {
			turn.promptInputUuid = injectedUuid;
			injected.started.resolve();
			await emitHeldInterimResult(turn);
		} else if (injected && injectedUuid && (message.state === "completed" || message.state === "cancelled" || message.state === "discarded" || message.state === "refused")) {
			if (message.state === "completed") injected.started.resolve();
			else injected.started.reject(/* @__PURE__ */ new Error(`Claude CLI ${message.state} the injected input.`));
			turn.injectedInputs.delete(injectedUuid);
			if (turn.promptInputUuid === injectedUuid) turn.promptInputUuid = turn.inputUuid;
			const heldResult = turn.heldResult;
			if (heldResult && turn.injectedInputs.size === 0 && turn.pendingBackgroundTaskIds.size === 0) {
				turn.heldResult = void 0;
				if (!turn.events.write(heldResult)) await once(turn.events, "drain", { signal: turn.controller.signal });
				completeTurn(session, turn);
			}
		}
		return;
	}
	if (session.hasInputLifecycle && !turn.inputStarted && !(message.type === "system" && message.subtype === "init")) return;
	if (message.type === "system" && message.subtype === "task_started" && typeof message.task_id === "string" && session.taskOwners.get(message.task_id) === turn.inputUuid) {
		if (message.is_backgrounded === false) turn.foregroundTaskIds.add(message.task_id);
		if (typeof message.tool_use_id === "string" && turn.foregroundBashToolUseIds.delete(message.tool_use_id) && message.is_backgrounded === true) turn.pendingBackgroundTaskIds.add(message.task_id);
	}
	if (message.type === "system" && message.subtype === "background_tasks_changed") {
		const tasks = Array.isArray(message.tasks) ? message.tasks.filter(isRecord) : [];
		let acquiredHold;
		do {
			acquiredHold = false;
			for (const task of tasks) {
				const id = task.task_id;
				if (typeof id !== "string" || session.taskOwners.get(id) !== turn.inputUuid || session.notifiedTasks.has(id) || turn.pendingBackgroundTaskIds.has(id)) continue;
				const parent = session.runningDescendants.get(id);
				if (parent !== void 0 && !turn.pendingBackgroundTaskIds.has(parent)) continue;
				if (task.task_type === "local_agent" || task.task_type === "local_workflow" || task.task_type === "local_bash" && turn.foregroundTaskIds.has(id)) {
					turn.pendingBackgroundTaskIds.add(id);
					acquiredHold = true;
				}
			}
		} while (acquiredHold);
	}
	const replayedTaskId = readReplayedTaskId(message, turn.submittedInputUuids);
	if (replayedTaskId) {
		turn.pendingBackgroundTaskIds.delete(replayedTaskId);
		turn.foregroundTaskIds.delete(replayedTaskId);
		turn.taskNotifications.set(replayedTaskId, "replayed");
	}
	if (message.type === "system" && message.subtype === "task_notification" && notifiedTaskId) {
		if (parentRuns || message.status === "stopped") {
			turn.pendingBackgroundTaskIds.delete(notifiedTaskId);
			turn.foregroundTaskIds.delete(notifiedTaskId);
			turn.taskNotifications.delete(notifiedTaskId);
		} else if (turn.foregroundTaskIds.has(notifiedTaskId) && !turn.pendingBackgroundTaskIds.has(notifiedTaskId)) turn.foregroundTaskIds.delete(notifiedTaskId);
		else turn.taskNotifications.set(notifiedTaskId, "queued");
	}
	let completesTurn = false;
	let holdsForInput = false;
	if (message.type === "result") {
		const failed = message.is_error === true || typeof message.subtype === "string" && message.subtype.startsWith("error") || typeof message.result === "string" && hasClaudeRawToolInvocation(message.result);
		const origin = isRecord(message.origin) ? message.origin : void 0;
		const taskNotification = origin?.kind === "task-notification" && origin.subkind === void 0;
		const runTaskId = taskNotification && typeof origin?.runId === "string" ? session.taskRuns.get(origin.runId) : void 0;
		const resultTaskId = taskNotification ? runTaskId ?? turn.taskNotifications.keys().next().value : void 0;
		const priorInputResult = resultTaskId !== void 0 && session.taskOwners.get(resultTaskId) !== turn.inputUuid && (!failed || runTaskId !== void 0);
		if (taskNotification && message.subtype === "success" && !failed && resultTaskId) {
			turn.taskNotifications.delete(resultTaskId);
			turn.pendingBackgroundTaskIds.delete(resultTaskId);
			turn.foregroundTaskIds.delete(resultTaskId);
		}
		const queuedContinuation = turn.sawTerminalResult && taskNotification && message.num_turns === 0 && message.result === "" && message.stop_reason === null && message.terminal_reason === void 0;
		if (!priorInputResult) {
			await emitHeldInterimResult(turn);
			for (const [replayedId, state] of turn.taskNotifications) if (state === "replayed") turn.taskNotifications.delete(replayedId);
			turn.sawTerminalResult = true;
			completesTurn = turn.pendingBackgroundTaskIds.size === 0 && !queuedContinuation || failed;
			holdsForInput = completesTurn && !failed && turn.injectedInputs.size > 0;
		}
	}
	if (holdsForInput) {
		turn.heldResult = message;
		return;
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
		taskOwners: /* @__PURE__ */ new Map(),
		taskRuns: /* @__PURE__ */ new Map(),
		runningDescendants: /* @__PURE__ */ new Map(),
		notifiedTasks: /* @__PURE__ */ new Set(),
		hasInputLifecycle: false,
		closed: false,
		handle: {
			generation: randomUUID(),
			fingerprint: capability?.fingerprint ?? randomUUID(),
			isIdle: () => !session.closed && !session.currentTurn,
			close: (_reason, error) => closeSession(session, error),
			waitForExit: async () => {
				await (session.transport ?? await session.transportStartup)?.waitForExit();
			}
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
	const inputUuid = randomUUID();
	const turn = {
		context,
		controller: new AbortController(),
		userInput: createClaudeCliUserInputAuthorizer(context),
		events: new PassThrough({ objectMode: true }),
		inputUuid,
		submittedInputUuids: /* @__PURE__ */ new Set([inputUuid]),
		inputStarted: false,
		promptSubmitted: false,
		promptInputUuid: inputUuid,
		sawTerminalResult: false,
		foregroundTaskIds: /* @__PURE__ */ new Set(),
		foregroundBashToolUseIds: /* @__PURE__ */ new Set(),
		pendingBackgroundTaskIds: /* @__PURE__ */ new Set(),
		injectedInputs: /* @__PURE__ */ new Map(),
		taskNotifications: /* @__PURE__ */ new Map()
	};
	session.currentTurn = turn;
	const abort = () => session.handle.close("abort", context.abortSignal?.reason);
	context.abortSignal?.addEventListener("abort", abort, { once: true });
	try {
		context.abortSignal?.throwIfAborted();
		capability?.activate(session.handle);
		let transport = session.transport;
		if (!transport) {
			const { args, excludeDynamicSections } = prepareClaudeCliTransportArgs(context);
			session.transportStartup = createClaudeCliTransport({
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
			}).then((created) => {
				session.transport = created;
				if (session.closed) created.close();
				return created;
			});
			transport = await session.transportStartup;
			if (session.closed) throw turn.error ?? /* @__PURE__ */ new Error("Claude CLI closed during startup.");
			await transport.initialize();
		}
		context.assertCurrent?.();
		if (session.closed || session.currentTurn !== turn) throw turn.error ?? /* @__PURE__ */ new Error("Claude CLI closed before its prompt was accepted.");
		await transport.send(createUserInput(context, context.prompt, turn.inputUuid));
		context.registerMessageInjection?.({
			isAvailable: () => session.hasInputLifecycle && turn.inputStarted && turn.promptSubmitted && activeTurn(session) === turn,
			queueMessage: (text, withCurrent) => injectInput(session, turn, text, withCurrent)
		});
		for await (const record of turn.events) yield record;
		if (turn.error) throw turn.error;
		if (!turn.sawTerminalResult) throw new Error("Claude CLI exited without a terminal result.");
	} catch (error) {
		session.handle.close("abort", error);
		throw turn.error ?? error;
	} finally {
		turn.controller.abort();
		context.abortSignal?.removeEventListener("abort", abort);
		if (session.currentTurn === turn) session.handle.close("abort");
		if (session.closed) await session.handle.waitForExit();
	}
}
//#endregion
export { executeClaudeCli };
