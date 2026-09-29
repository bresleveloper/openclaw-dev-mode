import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { A as parseAgentSessionKey, C as parseCronRunScopeSuffix } from "./session-key-CBvmC8zz.mjs";
import { Mt as cronTaskRecordToRunLogEntry } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { _o as validateTasksCancelParams, bo as validateTasksListParams, if as TasksHistoryResultSchema, vo as validateTasksGetParams, xo as validateTasksRecoveryParams, yo as validateTasksHistoryParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { n as canonicalizeMainSessionAlias } from "./main-session-De-bcoks.mjs";
import { v as readGatewayAccessRevision } from "./operator-role-policy-BNrKHiJ3.mjs";
import { _ as resolveSessionKeyBySessionId } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { n as prepareTaskRegistryRead, t as createTaskRegistryReadPreparation } from "./task-registry-read-BpKCOEEj.mjs";
import { o as listTaskRecordPage, r as getTaskById } from "./task-registry-query-Cb1HIUfX.mjs";
import "./runtime-internal-BQjc0KPP.mjs";
import "./sessions-DE4llkPV.mjs";
import { i as retrySubagentCompletionDelivery, n as dismissSubagentCompletionDelivery } from "./subagent-completion-delivery-BBzygnla.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { a as prepareTaskSessionReadFilter, i as canAccessTaskRequesterSession, n as resolveTaskHistoryHarness, r as taskTranscriptSessionKey, t as mapTaskSummary } from "./task-summary-BMTJih88.mjs";
import { createHash, randomUUID } from "node:crypto";
import { Value } from "typebox/value";
//#region src/gateway/server-methods/task-history.ts
const MAX_TASK_HISTORY_BYTES = 4194304;
function historyBinding(task) {
	return createHash("sha256").update(JSON.stringify([
		task.taskId,
		task.runId,
		task.runtime,
		task.taskKind,
		task.childSessionKey,
		task.agentId,
		task.requesterAgentId,
		task.requesterSessionKey,
		task.ownerKey,
		cronTaskRecordToRunLogEntry(task)?.sessionId,
		taskTranscriptSessionKey(task) ? null : task.detail
	])).digest("base64url");
}
function decodeCursor(cursor, binding) {
	if (cursor === void 0) return;
	const value = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8"));
	if (!Array.isArray(value) || value.length !== 2 || value[0] !== binding || typeof value[1] !== "string" || !value[1]) throw new Error("Invalid task history cursor");
	return value[1];
}
const taskHistoryHandler = async (opts) => {
	const { params, respond, context, client } = opts;
	if (!assertValidParams(params, validateTasksHistoryParams, "tasks.history", respond)) return;
	const fail = (message, code = ErrorCodes.UNAVAILABLE) => respond(false, void 0, errorShape(code, message));
	const read = await prepareTaskRegistryRead();
	if (!read) {
		fail("Task activity did not stabilize. Refresh the task.");
		return;
	}
	const task = read.getTaskById(params.taskId);
	const allowed = (value) => Boolean(value && canAccessTaskRequesterSession({
		cfg: context.getRuntimeConfig(),
		client,
		task: value
	}));
	if (!allowed(task)) {
		fail("Task not found.", ErrorCodes.INVALID_REQUEST);
		return;
	}
	const binding = historyBinding(task);
	const sessionKey = taskTranscriptSessionKey(task);
	let cursor;
	let offset = 0;
	try {
		cursor = decodeCursor(params.cursor, binding);
		if (sessionKey && cursor !== void 0) {
			offset = Number(cursor);
			if (!Number.isSafeInteger(offset) || offset < 0) throw new Error("Invalid task history offset");
		}
	} catch {
		fail("Invalid task history cursor. Refresh the task.", ErrorCodes.INVALID_REQUEST);
		return;
	}
	const harness = resolveTaskHistoryHarness(task);
	let active = true;
	let retainedTranscript;
	const assertCurrent = () => {
		const current = read.getTaskById(task.taskId);
		if (!active || opts.signal?.aborted || !allowed(current) || historyBinding(current) !== binding || !sessionKey && resolveTaskHistoryHarness(current) !== harness || retainedTranscript && (resolveSessionStorePathCore(context.getRuntimeConfig().session?.store, { agentId: retainedTranscript.agentId }) !== retainedTranscript.storePath || resolveSessionKeyBySessionId(retainedTranscript) !== retainedTranscript.sessionKey)) throw new Error("Task history access changed");
	};
	const publish = (page) => {
		assertCurrent();
		const result = {
			messages: page.messages,
			...page.activity ? { activity: page.activity } : {},
			...page.nextCursor ? { nextCursor: Buffer.from(JSON.stringify([binding, page.nextCursor])).toString("base64url") } : {}
		};
		if (Buffer.byteLength(JSON.stringify(result), "utf8") > MAX_TASK_HISTORY_BYTES || (result.nextCursor?.length ?? 0) > 8192) throw new Error("Task history page exceeds the response limit");
		respond(true, result);
	};
	try {
		const limit = params.limit ?? 100;
		if (sessionKey) {
			const { chatHistoryHandlers, handleChatHistoryRequest } = await import("./chat-history-handler-Dkc2AElI.mjs");
			assertCurrent();
			const childAgentId = parseAgentSessionKey(sessionKey)?.agentId ?? task.agentId;
			const cronRun = cronTaskRecordToRunLogEntry(task);
			const retainedSessionId = cronRun?.sessionId;
			if (cronRun && !retainedSessionId) throw new Error("The task has no recorded transcript generation");
			let historySessionKey = sessionKey;
			if (retainedSessionId) {
				const readScope = {
					agentId: childAgentId,
					sessionId: retainedSessionId,
					storePath: resolveSessionStorePathCore(context.getRuntimeConfig().session?.store, { agentId: childAgentId })
				};
				const ownerKey = resolveSessionKeyBySessionId(readScope);
				const { baseSessionKey } = parseCronRunScopeSuffix(sessionKey);
				if (!ownerKey || ownerKey !== sessionKey && ownerKey !== baseSessionKey) throw new Error("The recorded task transcript is unavailable");
				retainedTranscript = {
					...readScope,
					sessionKey: ownerKey
				};
				historySessionKey = ownerKey;
			}
			await (retainedSessionId ? (args) => handleChatHistoryRequest({
				...args,
				method: "chat.history",
				retainedSessionId
			}) : expectDefined(chatHistoryHandlers["chat.history"], "chat history handler"))({
				...opts,
				params: {
					sessionKey: historySessionKey,
					...childAgentId ? { agentId: childAgentId } : {},
					limit,
					offset,
					maxBytes: 4177920
				},
				respond: (ok, payload, error) => {
					assertCurrent();
					if (!ok) {
						respond(false, void 0, error);
						return;
					}
					const page = asOptionalRecord(payload);
					if (!Array.isArray(page?.messages)) throw new Error("Task transcript returned no messages");
					const result = {
						messages: page.messages,
						...page.activity ? { activity: page.activity } : {},
						...page.hasMore === true && typeof page.nextOffset === "number" ? { nextCursor: String(page.nextOffset) } : {}
					};
					if (!Value.Check(TasksHistoryResultSchema, result)) throw new Error("Task transcript returned an invalid page");
					publish(result);
				}
			});
		} else if (harness?.taskHistory) publish(await harness.taskHistory.read({
			task,
			cfg: context.getRuntimeConfig(),
			cursor,
			limit,
			assertCurrent
		}));
		else fail("This task has no readable transcript.");
	} catch {
		fail("Unable to load this task's transcript. Refresh the task and try again.");
	} finally {
		active = false;
	}
};
//#endregion
//#region src/gateway/server-methods/tasks.ts
const DEFAULT_TASKS_LIST_LIMIT = 100;
const MAX_TASKS_LIST_LIMIT = 500;
const TASKS_LIST_MAX_ATTEMPTS = 3;
const TASKS_LIST_CURSOR_VERSION = "1";
const taskListGatewayIds = /* @__PURE__ */ new WeakMap();
const LEDGER_STATUS_TO_TASK_STATUSES = {
	queued: ["queued"],
	running: ["running"],
	completed: ["succeeded"],
	failed: ["failed", "lost"],
	timed_out: ["timed_out"],
	cancelled: ["cancelled"]
};
function normalizeTaskStatusFilter(status) {
	if (!status) return null;
	return new Set((Array.isArray(status) ? status : [status]).flatMap((value) => LEDGER_STATUS_TO_TASK_STATUSES[value] ?? []));
}
function taskListGatewayId(context) {
	const current = taskListGatewayIds.get(context);
	if (current) return current;
	const created = randomUUID();
	taskListGatewayIds.set(context, created);
	return created;
}
function taskListFingerprint(value) {
	return createHash("sha256").update(JSON.stringify(value)).digest("base64url");
}
function encodeTaskListCursor(cursor) {
	return [
		TASKS_LIST_CURSOR_VERSION,
		cursor.offset,
		cursor.taskRevision,
		cursor.accessRevision,
		cursor.binding
	].join(".");
}
function parseTaskListCursor(value) {
	if (value === void 0) return;
	if (!value || value.length > 512) return null;
	const [version, rawOffset, rawTaskRevision, rawAccessRevision, binding] = value.split(".");
	const cursor = {
		offset: Number(rawOffset),
		taskRevision: Number(rawTaskRevision),
		accessRevision: Number(rawAccessRevision),
		binding: binding ?? ""
	};
	if (version !== TASKS_LIST_CURSOR_VERSION || !Number.isSafeInteger(cursor.offset) || cursor.offset < 0 || !Number.isSafeInteger(cursor.taskRevision) || cursor.taskRevision < 0 || !Number.isSafeInteger(cursor.accessRevision) || cursor.accessRevision < 0 || encodeTaskListCursor(cursor) !== value) return null;
	return cursor;
}
function invalidTaskListCursor(respond) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid or expired tasks.list cursor; restart pagination without a cursor"));
}
const tasksHandlers = {
	"tasks.list": async ({ params, respond, context, client }) => {
		if (typeof params.cursor === "string" && params.cursor.length > 512) {
			invalidTaskListCursor(respond);
			return;
		}
		if (!assertValidParams(params, validateTasksListParams, "tasks.list", respond)) return;
		const cursor = parseTaskListCursor(params.cursor);
		if (cursor === null) {
			invalidTaskListCursor(respond);
			return;
		}
		const statusFilter = normalizeTaskStatusFilter(params.status);
		const statuses = statusFilter ? [...statusFilter].toSorted() : void 0;
		const limit = Math.min(params.limit ?? DEFAULT_TASKS_LIST_LIMIT, MAX_TASKS_LIST_LIMIT);
		const requestedSessionKey = normalizeOptionalString(params.sessionKey);
		const cfg = context.getRuntimeConfig();
		let sessionKey;
		let sessionAgentId;
		if (requestedSessionKey) {
			const sessionOwner = resolveRequestedSessionAgentId(cfg, requestedSessionKey, normalizeOptionalString(params.agentId));
			if (!sessionOwner.ok) {
				respond(false, void 0, sessionOwner.error);
				return;
			}
			sessionAgentId = sessionOwner.agentId;
			sessionKey = canonicalizeMainSessionAlias({
				cfg,
				agentId: sessionOwner.agentId,
				sessionKey: requestedSessionKey
			});
		}
		const agentId = sessionKey ? void 0 : normalizeOptionalString(params.agentId);
		const bindingFacts = [
			taskListGatewayId(context),
			client?.connId ?? null,
			client?.authenticatedUserProfile?.profileId ?? null,
			client?.authenticatedUserId ?? null,
			client?.pairedClientId ?? null,
			client?.connect.role ?? null,
			client?.connect.scopes?.toSorted() ?? null,
			statuses,
			agentId,
			sessionKey,
			sessionAgentId,
			params.sortBy ?? null
		];
		const bindCursor = (...fields) => taskListFingerprint([fields, ...bindingFacts]);
		const cursorBinding = cursor && bindCursor(cursor.offset, cursor.taskRevision, cursor.accessRevision);
		if (cursor && cursor.binding !== cursorBinding) {
			invalidTaskListCursor(respond);
			return;
		}
		const prepareFilter = (tasks) => prepareTaskSessionReadFilter({
			cfg: context.getRuntimeConfig(),
			client
		}, tasks);
		const pageParams = {
			prepareRead: createTaskRegistryReadPreparation(),
			offset: cursor?.offset ?? 0,
			limit,
			expectedRevision: cursor?.taskRevision,
			statuses,
			agentId,
			sessionKey,
			sessionAgentId,
			cfg,
			prepareFilter,
			sortBy: params.sortBy
		};
		for (let attempt = 0; attempt < TASKS_LIST_MAX_ATTEMPTS; attempt += 1) {
			const accessRevision = readGatewayAccessRevision();
			if (cursor && cursor.accessRevision !== accessRevision) {
				invalidTaskListCursor(respond);
				return;
			}
			const pageResult = await listTaskRecordPage(pageParams);
			if (!pageResult.ok) {
				if (pageResult.error === "cursor_stale") {
					invalidTaskListCursor(respond);
					return;
				}
				continue;
			}
			const page = pageResult.value;
			if (!page.isCurrent() || accessRevision !== readGatewayAccessRevision() || !page.tasks.every(prepareFilter(page.tasks))) {
				if (cursor) {
					invalidTaskListCursor(respond);
					return;
				}
				continue;
			}
			const nextOffset = pageParams.offset + page.tasks.length;
			respond(true, {
				tasks: page.tasks.map((task) => mapTaskSummary(task)),
				...page.hasMore ? { nextCursor: encodeTaskListCursor({
					offset: nextOffset,
					taskRevision: page.revision,
					accessRevision,
					binding: bindCursor(nextOffset, page.revision, accessRevision)
				}) } : {}
			});
			return;
		}
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Task activity did not stabilize. Wait a moment, then refresh Tasks.", {
			retryable: true,
			retryAfterMs: 250
		}));
	},
	"tasks.get": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateTasksGetParams, "tasks.get", respond)) return;
		const taskId = params.taskId;
		const read = await prepareTaskRegistryRead();
		if (!read) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Task activity did not stabilize. Refresh the task."));
			return;
		}
		const task = read.getTaskById(taskId);
		if (!task || !canAccessTaskRequesterSession({
			cfg: context.getRuntimeConfig(),
			client,
			task
		})) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `task not found: ${taskId}`));
			return;
		}
		respond(true, { task: mapTaskSummary(task, { includePrompt: true }) });
	},
	"tasks.history": taskHistoryHandler,
	"tasks.cancel": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateTasksCancelParams, "tasks.cancel", respond)) return;
		const taskId = params.taskId;
		const reason = normalizeOptionalString(params.reason);
		const { cancelDetachedTaskRunByIdCore } = await import("./task-executor-cancel.runtime.js");
		const cfg = context.getRuntimeConfig();
		const task = getTaskById(taskId);
		if (task && !canAccessTaskRequesterSession({
			access: "write",
			cfg,
			client,
			task
		})) {
			respond(true, {
				found: false,
				cancelled: false
			});
			return;
		}
		const result = await cancelDetachedTaskRunByIdCore({
			cfg,
			taskId,
			...reason ? { reason } : {}
		});
		respond(true, {
			found: result.found,
			cancelled: result.cancelled,
			...result.reason ? { reason: result.reason } : {},
			...result.task ? { task: mapTaskSummary(result.task) } : {}
		});
	},
	"tasks.retry": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateTasksRecoveryParams, "tasks.retry", respond)) return;
		const results = [];
		const cfg = context.getRuntimeConfig();
		for (const taskId of params.taskIds) {
			const task = getTaskById(taskId);
			if (task && !canAccessTaskRequesterSession({
				access: "write",
				cfg,
				client,
				task
			})) {
				results.push({
					taskId,
					ok: false,
					reason: "task not found"
				});
				continue;
			}
			const result = await retrySubagentCompletionDelivery(taskId);
			results.push({
				taskId,
				ok: result.ok,
				...result.reason ? { reason: result.reason } : {},
				...result.duplicateRisk ? { duplicateRisk: true } : {},
				...result.task ? { task: mapTaskSummary(result.task, { includePrompt: true }) } : {}
			});
		}
		respond(true, { results });
	},
	"tasks.dismiss": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateTasksRecoveryParams, "tasks.dismiss", respond)) return;
		const { discardSubagentTerminalDelivery } = await import("./subagent-registry-WbeCeGgw.mjs");
		const results = [];
		const cfg = context.getRuntimeConfig();
		for (const taskId of params.taskIds) {
			const task = getTaskById(taskId);
			if (task && !canAccessTaskRequesterSession({
				access: "write",
				cfg,
				client,
				task
			})) {
				results.push({
					taskId,
					ok: false,
					reason: "task not found"
				});
				continue;
			}
			const result = await dismissSubagentCompletionDelivery(taskId, { discardTerminalDelivery: discardSubagentTerminalDelivery });
			results.push({
				taskId,
				ok: result.ok,
				...result.reason ? { reason: result.reason } : {},
				...result.task ? { task: mapTaskSummary(result.task, { includePrompt: true }) } : {}
			});
		}
		respond(true, { results });
	}
};
//#endregion
export { tasksHandlers };
