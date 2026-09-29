import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import "./session-key-CBvmC8zz.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { r as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { go as validateTaskSuggestionsListParams, ho as validateTaskSuggestionsDismissParams, mo as validateTaskSuggestionsCreateParams, po as validateTaskSuggestionsAcceptParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { n as authorizeGatewaySessionCreation, r as hasOperatorBoundary } from "./operator-role-policy-BNrKHiJ3.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import "./sessions-DE4llkPV.mjs";
import { d as resolveSessionWorkStartError } from "./lifecycle-WWQJH57y.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DDuAGjCc.mjs";
import { E as createSessionListEntryFilter, I as authorizeSessionSharingTarget, K as resolveSessionSharingTarget } from "./session-sharing-C4w_but1.mjs";
import "./session-utils-CJ7A982R.mjs";
import { m as resolveProjectCheckout } from "./project-registry-CT4rCnL9.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { t as handleChatSend } from "./chat-send-handler-B23MaQHN.mjs";
import { r as listWorkerProfiles } from "./environments-BsMLVi8M.mjs";
import { t as buildDashboardSessionKey } from "./session-create-service-Cq3tAtcK.mjs";
import { t as sessionCreateHandlers } from "./sessions-create-PWhsPLmI.mjs";
import { t as sessionDeleteHandlers } from "./sessions-delete-DmDLFw1K.mjs";
import { t as sessionDispatchHandlers } from "./sessions-dispatch-DCtH74ct.mjs";
import path from "node:path";
import { randomUUID } from "node:crypto";
//#region src/gateway/task-suggestion-registry.ts
const MAX_TASK_SUGGESTIONS = 100;
const MAX_TASK_SUGGESTION_RETAINED_BYTES = 2097152;
const suggestions = /* @__PURE__ */ new Map();
let retainedSuggestionBytes = 0;
function retainedBytesForSuggestion(suggestion) {
	return Buffer.byteLength(JSON.stringify(suggestion)) + 1;
}
function planTaskSuggestionEvictions(suggestionBytes) {
	let projectedCount = suggestions.size + 1;
	let projectedBytes = retainedSuggestionBytes + suggestionBytes + 1;
	const planned = [];
	for (const status of [
		"dismissed",
		"accepted",
		"pending"
	]) for (const [taskId, record] of suggestions) {
		if (projectedCount <= MAX_TASK_SUGGESTIONS && projectedBytes <= MAX_TASK_SUGGESTION_RETAINED_BYTES) return planned;
		if (record.status !== status) continue;
		planned.push([taskId, record]);
		projectedCount -= 1;
		projectedBytes -= retainedBytesForSuggestion(record.suggestion);
	}
	return projectedCount <= MAX_TASK_SUGGESTIONS && projectedBytes <= MAX_TASK_SUGGESTION_RETAINED_BYTES ? planned : null;
}
/** Records one suggestion without starting work. IDs intentionally vanish on restart. */
function createTaskSuggestion(params) {
	const suggestion = {
		id: `task_${randomUUID()}`,
		title: params.title.trim(),
		prompt: params.prompt.trim(),
		tldr: params.tldr.trim(),
		cwd: params.cwd,
		sessionKey: params.sessionKey,
		...params.agentId ? { agentId: params.agentId } : {},
		createdAt: Date.now()
	};
	const suggestionBytes = retainedBytesForSuggestion(suggestion);
	const plannedEvictions = planTaskSuggestionEvictions(suggestionBytes);
	if (!plannedEvictions) return { status: "full" };
	const evictedPendingSuggestions = [];
	for (const [taskId, record] of plannedEvictions) {
		retainedSuggestionBytes -= retainedBytesForSuggestion(record.suggestion);
		suggestions.delete(taskId);
		if (record.status === "pending") evictedPendingSuggestions.push(record.suggestion);
	}
	suggestions.set(suggestion.id, {
		status: "pending",
		suggestion
	});
	retainedSuggestionBytes += suggestionBytes;
	return {
		status: "created",
		suggestion,
		evictedPendingSuggestions
	};
}
/** Lists newest suggestions first, optionally scoped to their source chat. */
function listTaskSuggestions(params) {
	return [...suggestions.values()].filter((record) => record.status === "pending").map((record) => record.suggestion).filter((suggestion) => (!params.sessionKey || suggestion.sessionKey === params.sessionKey) && (!params.agentId || suggestion.agentId === params.agentId)).toReversed();
}
/** Returns the authoritative source session before task-id-only authorization. */
function getTaskSuggestion(taskId) {
	return suggestions.get(taskId)?.suggestion;
}
/** Claims one suggestion before any privileged worktree/session side effects begin. */
function beginTaskSuggestionAcceptance(taskId) {
	const record = suggestions.get(taskId);
	if (!record) return { status: "missing" };
	if (record.status === "accepted") return {
		status: "accepted",
		sessionKey: record.sessionKey
	};
	if (record.status !== "pending") return { status: record.status };
	suggestions.set(taskId, {
		status: "accepting",
		suggestion: record.suggestion
	});
	return {
		status: "claimed",
		suggestion: record.suggestion
	};
}
/** Restores a claim when session creation fails before an acceptance result exists. */
function cancelTaskSuggestionAcceptance(taskId) {
	const record = suggestions.get(taskId);
	if (record?.status === "accepting") {
		suggestions.set(taskId, {
			status: "pending",
			suggestion: record.suggestion
		});
		return record.suggestion;
	}
}
/** Retires a claimed suggestion when partial side effects cannot be rolled back safely. */
function abandonTaskSuggestionAcceptance(taskId) {
	const record = suggestions.get(taskId);
	if (record?.status !== "accepting") return false;
	suggestions.set(taskId, {
		status: "dismissed",
		suggestion: record.suggestion
	});
	return true;
}
/** Retains the created session key so retries return the same accepted task. */
function completeTaskSuggestionAcceptance(taskId, sessionKey) {
	const record = suggestions.get(taskId);
	if (record?.status === "accepting") suggestions.set(taskId, {
		status: "accepted",
		suggestion: record.suggestion,
		sessionKey
	});
}
/** Dismisses only a pending suggestion; accepted or in-flight tasks stay immutable. */
function dismissTaskSuggestion(taskId) {
	const record = suggestions.get(taskId);
	if (record?.status !== "pending") return false;
	suggestions.set(taskId, {
		status: "dismissed",
		suggestion: record.suggestion
	});
	return true;
}
//#endregion
//#region src/gateway/server-methods/task-suggestion-acceptance.ts
function broadcastResolvedTaskSuggestion(context, suggestion, resolution) {
	context.broadcast("task.suggestion", {
		action: "resolved",
		taskId: suggestion.id,
		resolution
	}, {
		dropIfSlow: true,
		sessionKeys: [suggestion.sessionKey],
		...suggestion.agentId ? { agentId: suggestion.agentId } : {}
	});
}
function abandonSuggestedTaskAcceptance(taskId, options) {
	const suggestion = getTaskSuggestion(taskId);
	if (suggestion && abandonTaskSuggestionAcceptance(taskId)) broadcastResolvedTaskSuggestion(options.context, suggestion, "expired");
}
async function rollbackSuggestedTaskSession(params) {
	let deletionResponse;
	try {
		const deleteSession = sessionDeleteHandlers["sessions.delete"];
		if (!deleteSession) return false;
		await deleteSession({
			...params.options,
			params: {
				key: params.key,
				...params.agentId ? { agentId: params.agentId } : {},
				deleteTranscript: true,
				emitLifecycleHooks: false
			},
			respond: (ok, payload) => {
				if (!ok || !payload || typeof payload !== "object" || !("deleted" in payload) || typeof payload.deleted !== "boolean") {
					deletionResponse = { ok: false };
					return;
				}
				deletionResponse = {
					ok: true,
					worktreePreserved: "worktreePreserved" in payload && payload.worktreePreserved !== void 0
				};
			}
		});
	} catch {
		return false;
	}
	if (!deletionResponse?.ok || deletionResponse.worktreePreserved) return false;
	try {
		return !loadGatewaySessionEntryReadOnly(params.key, { agentId: params.agentId }).entry;
	} catch {
		return false;
	}
}
async function failSuggestedTaskSession(params) {
	if (await rollbackSuggestedTaskSession({
		key: params.sessionKey,
		agentId: params.agentId,
		options: params.options
	})) {
		const restored = cancelTaskSuggestionAcceptance(params.taskId);
		if (restored) params.options.context.broadcast("task.suggestion", {
			action: "created",
			suggestion: restored
		}, { dropIfSlow: true });
		return {
			ok: false,
			error: params.error
		};
	}
	abandonSuggestedTaskAcceptance(params.taskId, params.options);
	return {
		ok: false,
		error: errorShape(ErrorCodes.UNAVAILABLE, `${params.error.message}; failed to roll back the partial suggested task session`)
	};
}
function finishSuggestedTaskAcceptance(params) {
	completeTaskSuggestionAcceptance(params.taskId, params.sessionKey);
	broadcastResolvedTaskSuggestion(params.options.context, params.suggestion, "accepted");
	return {
		ok: true,
		result: {
			taskId: params.taskId,
			key: params.sessionKey
		}
	};
}
function restoreSuggestedTaskClaim(params) {
	const restored = cancelTaskSuggestionAcceptance(params.taskId);
	if (restored) params.options.context.broadcast("task.suggestion", {
		action: "created",
		suggestion: restored
	}, { dropIfSlow: true });
	return {
		ok: false,
		error: params.error
	};
}
//#endregion
//#region src/gateway/server-methods/task-suggestions.ts
const activeAcceptances = /* @__PURE__ */ new Map();
function authorizeSuggestedTaskSource(params) {
	const suggestion = getTaskSuggestion(params.taskId);
	const target = suggestion ? resolveSessionSharingTarget({
		cfg: params.cfg,
		sessionKey: suggestion.sessionKey,
		agentId: suggestion.agentId
	}) : null;
	if (!target) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "task suggestion was not found")
	};
	const error = authorizeSessionSharingTarget({
		cfg: params.cfg,
		client: params.client,
		target
	});
	return error ? {
		ok: false,
		error
	} : {
		ok: true,
		agentId: target.agentId
	};
}
async function sendSuggestedTaskPrompt(params) {
	let response;
	const chatParams = {
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		...params.sessionId ? { sessionId: params.sessionId } : {},
		message: params.suggestion.prompt,
		queueMode: "steer",
		idempotencyKey: `task-suggestion:${params.taskId}`
	};
	await handleChatSend({
		...params.options,
		req: {
			...params.options.req,
			method: "chat.send",
			params: chatParams
		},
		params: chatParams,
		respond: (...args) => {
			response = args;
		}
	});
	return response;
}
async function createSuggestedTaskSession(params) {
	let sessionResponse;
	const { agentId } = params;
	const cwd = params.cwd ?? params.suggestion.cwd;
	if (params.mode === "worktree") try {
		await resolveProjectCheckout(cwd);
	} catch {
		return restoreSuggestedTaskClaim({
			taskId: params.taskId,
			options: params.options,
			error: errorShape(ErrorCodes.INVALID_REQUEST, "Choose a repository with a commit to start this task in a new worktree. The task has not started.", { details: {
				code: GatewayErrorDetailCodes.TASK_WORKTREE_SOURCE_REQUIRED,
				cwd
			} })
		});
	}
	const task = params.mode === "local" ? `Start by addressing this task in the current folder. If an isolated Git worktree is needed, explain why and ask the user before creating or switching to it.\n\n${params.suggestion.prompt}` : params.suggestion.prompt;
	const sessionKey = buildDashboardSessionKey(agentId);
	const fail = (key, error) => failSuggestedTaskSession({
		taskId: params.taskId,
		sessionKey: key,
		agentId,
		options: params.options,
		error
	});
	try {
		await sessionCreateHandlers["sessions.create"]?.({
			...params.options,
			params: {
				key: sessionKey,
				agentId,
				parentSessionKey: params.suggestion.sessionKey,
				label: params.suggestion.title,
				...params.mode === "cloud" ? {} : { task },
				...params.mode === "local" ? {} : { worktree: true },
				cwd
			},
			respond: (...args) => {
				sessionResponse = args;
			}
		});
	} catch (error) {
		return await fail(sessionKey, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
	}
	if (!sessionResponse) return await fail(sessionKey, errorShape(ErrorCodes.UNAVAILABLE, "sessions.create did not respond"));
	const [ok, payload, sessionError] = sessionResponse;
	if (!ok) return await fail(sessionKey, sessionError ?? errorShape(ErrorCodes.UNAVAILABLE, "failed to create suggested task"));
	const key = payload && typeof payload === "object" && typeof payload.key === "string" ? payload.key : void 0;
	if (!key) return await fail(sessionKey, errorShape(ErrorCodes.UNAVAILABLE, "sessions.create returned no session key"));
	if (params.mode === "cloud") {
		let dispatchResponse;
		try {
			await sessionDispatchHandlers["sessions.dispatch"]?.({
				...params.options,
				params: {
					key,
					agentId,
					profileId: params.cloudProfileId
				},
				respond: (...args) => {
					dispatchResponse = args;
				}
			});
		} catch (error) {
			return await fail(key, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
		}
		if (!dispatchResponse?.[0]) return await fail(key, dispatchResponse?.[2] ?? errorShape(ErrorCodes.UNAVAILABLE, dispatchResponse ? "failed to dispatch suggested task" : "sessions.dispatch did not respond"));
		let sendResponse;
		try {
			sendResponse = await sendSuggestedTaskPrompt({
				taskId: params.taskId,
				suggestion: params.suggestion,
				options: params.options,
				sessionKey: key,
				agentId
			});
		} catch (error) {
			return await fail(key, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
		}
		if (!sendResponse?.[0]) return await fail(key, sendResponse?.[2] ?? errorShape(ErrorCodes.UNAVAILABLE, sendResponse ? "failed to deliver suggested task" : "chat.send did not respond"));
		return finishSuggestedTaskAcceptance({
			taskId: params.taskId,
			sessionKey: key,
			suggestion: params.suggestion,
			options: params.options
		});
	}
	const result = payload;
	if (result.runStarted !== true) {
		const runMessage = result.runError && typeof result.runError === "object" && typeof result.runError.message === "string" ? result.runError.message : "initial task did not start";
		return await fail(key, errorShape(ErrorCodes.UNAVAILABLE, runMessage));
	}
	return finishSuggestedTaskAcceptance({
		taskId: params.taskId,
		sessionKey: key,
		suggestion: params.suggestion,
		options: params.options
	});
}
async function deliverSuggestedTaskToSourceSession(params) {
	const { agentId } = params;
	const fail = (error) => restoreSuggestedTaskClaim({
		taskId: params.taskId,
		options: params.options,
		error
	});
	let source;
	try {
		source = loadGatewaySessionEntryReadOnly(params.suggestion.sessionKey, { agentId });
	} catch (error) {
		return fail(errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
	}
	if (!source.entry?.sessionId) return fail(errorShape(ErrorCodes.INVALID_REQUEST, "source session no longer exists; start it in a new session instead"));
	const lifecycleError = resolveSessionWorkStartError(source.canonicalKey, source.entry);
	if (lifecycleError) return fail(errorShape(ErrorCodes.INVALID_REQUEST, lifecycleError));
	let sendResponse;
	try {
		sendResponse = await sendSuggestedTaskPrompt({
			taskId: params.taskId,
			suggestion: params.suggestion,
			options: params.options,
			sessionKey: params.suggestion.sessionKey,
			agentId,
			sessionId: source.entry.sessionId
		});
	} catch (error) {
		return fail(errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
	}
	if (!sendResponse?.[0]) return fail(sendResponse?.[2] ?? errorShape(ErrorCodes.UNAVAILABLE, sendResponse ? "failed to deliver suggested task" : "chat.send did not respond"));
	return finishSuggestedTaskAcceptance({
		taskId: params.taskId,
		sessionKey: params.suggestion.sessionKey,
		suggestion: params.suggestion,
		options: params.options
	});
}
const taskSuggestionsHandlers = {
	"taskSuggestions.list": ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateTaskSuggestionsListParams, "taskSuggestions.list", respond)) return;
		const requestedSessionKey = params.sessionKey;
		const sessionOwner = requestedSessionKey ? resolveRequestedSessionAgentId(context.getRuntimeConfig(), requestedSessionKey, params.agentId) : void 0;
		if (sessionOwner && !sessionOwner.ok) {
			respond(false, void 0, sessionOwner.error);
			return;
		}
		const cfg = context.getRuntimeConfig();
		const visibilityFilter = hasOperatorBoundary(client, cfg) ? createSessionListEntryFilter({
			client,
			cfg
		}) : void 0;
		respond(true, { suggestions: listTaskSuggestions({
			...params,
			...sessionOwner ? { agentId: sessionOwner.agentId } : {}
		}).filter((suggestion) => {
			if (!visibilityFilter) return true;
			const target = resolveSessionSharingTarget({
				cfg,
				sessionKey: suggestion.sessionKey,
				agentId: suggestion.agentId
			});
			return Boolean(target && visibilityFilter(target.storeKey, target.entry));
		}) }, void 0);
	},
	"taskSuggestions.create": ({ params, respond, context }) => {
		if (!assertValidParams(params, validateTaskSuggestionsCreateParams, "taskSuggestions.create", respond)) return;
		if (!path.isAbsolute(params.cwd)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "task suggestion cwd must be absolute"));
			return;
		}
		const requestedAgentId = params.agentId ? normalizeAgentId(params.agentId) : void 0;
		const sourceOwner = resolveRequestedSessionAgentId(context.getRuntimeConfig(), params.sessionKey, requestedAgentId);
		if (!sourceOwner.ok) {
			respond(false, void 0, sourceOwner.error);
			return;
		}
		const agentId = normalizeAgentId(sourceOwner.agentId);
		const created = createTaskSuggestion({
			...params,
			agentId
		});
		if (created.status === "full") {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "task suggestion registry is busy", { retryable: true }));
			return;
		}
		const { suggestion } = created;
		for (const evicted of created.evictedPendingSuggestions) broadcastResolvedTaskSuggestion(context, evicted, "expired");
		context.broadcast("task.suggestion", {
			action: "created",
			suggestion
		}, { dropIfSlow: true });
		respond(true, {
			taskId: suggestion.id,
			suggestion
		}, void 0);
	},
	"taskSuggestions.accept": async (options) => {
		const { params, respond } = options;
		if (!assertValidParams(params, validateTaskSuggestionsAcceptParams, "taskSuggestions.accept", respond)) return;
		const mode = params.mode ?? "worktree";
		if (params.cwd !== void 0 && (mode !== "worktree" || !path.isAbsolute(params.cwd))) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "task suggestion cwd correction requires worktree mode and an absolute repository path"));
			return;
		}
		const config = options.context.getRuntimeConfig();
		if (hasOperatorBoundary(options.client, config)) {
			const authorization = authorizeSuggestedTaskSource({
				cfg: config,
				client: options.client,
				taskId: params.taskId
			});
			if (!authorization.ok) {
				respond(false, void 0, authorization.error);
				return;
			}
			if (mode !== "session") {
				const creationError = authorizeGatewaySessionCreation({
					cfg: config,
					client: options.client,
					agentId: authorization.agentId
				});
				if (creationError) {
					respond(false, void 0, creationError);
					return;
				}
			}
		}
		let cloudProfileId;
		if (mode === "cloud") {
			const profiles = listWorkerProfiles(options.context);
			if (profiles.length === 0) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "no cloud worker profiles configured"));
				return;
			}
			cloudProfileId = params.cloudProfileId;
			if (!cloudProfileId || !profiles.some((profile) => profile.id === cloudProfileId)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, cloudProfileId ? `unknown cloud worker profile: ${cloudProfileId}` : "cloudProfileId is required for cloud mode"));
				return;
			}
		}
		const active = activeAcceptances.get(params.taskId);
		if (active) {
			const outcome = await active;
			respond(outcome.ok, outcome.ok ? outcome.result : void 0, outcome.ok ? void 0 : outcome.error);
			return;
		}
		const acceptance = beginTaskSuggestionAcceptance(params.taskId);
		if (acceptance.status === "accepted") {
			respond(true, {
				taskId: params.taskId,
				key: acceptance.sessionKey
			}, void 0);
			return;
		}
		if (acceptance.status !== "claimed") {
			respond(false, void 0, errorShape(acceptance.status === "accepting" ? ErrorCodes.UNAVAILABLE : ErrorCodes.INVALID_REQUEST, `task suggestion cannot be accepted: ${acceptance.status}`));
			return;
		}
		const pending = (async () => {
			const sourceOwner = resolveRequestedSessionAgentId(config, acceptance.suggestion.sessionKey, acceptance.suggestion.agentId);
			if (!sourceOwner.ok) return restoreSuggestedTaskClaim({
				taskId: params.taskId,
				options,
				error: sourceOwner.error
			});
			const agentId = normalizeAgentId(sourceOwner.agentId);
			return mode === "session" ? deliverSuggestedTaskToSourceSession({
				taskId: params.taskId,
				suggestion: acceptance.suggestion,
				options,
				agentId
			}) : createSuggestedTaskSession({
				taskId: params.taskId,
				suggestion: acceptance.suggestion,
				options,
				agentId,
				mode,
				cwd: params.cwd,
				...cloudProfileId ? { cloudProfileId } : {}
			});
		})().catch((error) => {
			abandonSuggestedTaskAcceptance(params.taskId, options);
			throw error;
		});
		activeAcceptances.set(params.taskId, pending);
		try {
			const outcome = await pending;
			respond(outcome.ok, outcome.ok ? outcome.result : void 0, outcome.ok ? void 0 : outcome.error);
		} finally {
			activeAcceptances.delete(params.taskId);
		}
	},
	"taskSuggestions.dismiss": ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateTaskSuggestionsDismissParams, "taskSuggestions.dismiss", respond)) return;
		const config = context.getRuntimeConfig();
		if (hasOperatorBoundary(client, config)) {
			if (!authorizeSuggestedTaskSource({
				cfg: config,
				client,
				taskId: params.taskId
			}).ok) {
				respond(true, {
					taskId: params.taskId,
					dismissed: false
				}, void 0);
				return;
			}
		}
		const suggestion = getTaskSuggestion(params.taskId);
		const dismissed = dismissTaskSuggestion(params.taskId);
		if (dismissed && suggestion) broadcastResolvedTaskSuggestion(context, suggestion, "dismissed");
		respond(true, {
			taskId: params.taskId,
			dismissed
		}, void 0);
	}
};
//#endregion
export { taskSuggestionsHandlers };
