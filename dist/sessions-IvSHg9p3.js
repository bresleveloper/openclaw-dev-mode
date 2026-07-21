import { c as normalizeOptionalString, p as readStringValue } from "./string-coerce-DW4mBlAt.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BgpbKGBP.js";
import { i as formatErrorMessage } from "./errors-sMD712F3.js";
import { t as createSubsystemLogger } from "./subsystem-C3fiUGN1.js";
import "./agent-scope-B2Pk_xhT.js";
import { c as parseAgentSessionKey } from "./session-key-utils-A-JGvyXu.js";
import { u as normalizeAgentId } from "./session-key-VWT_xzM9.js";
import { c as resolveDefaultAgentId, o as resolveAgentWorkspaceDir } from "./agent-scope-config-BxAUeF6t.js";
import { l as measureDiagnosticsTimelineSpan, u as measureDiagnosticsTimelineSpanSync } from "./plugin-metadata-snapshot-fqwcFyP9.js";
import "./thinking-BcvxxriC.js";
import { o as normalizeReasoningLevel, s as normalizeThinkLevel } from "./thinking.shared-BWnbgBUO.js";
import { n as GATEWAY_CLIENT_IDS } from "./client-info-CcqJJIan.js";
import { t as ADMIN_SCOPE } from "./operator-scopes-CpPJIv7P.js";
import { g as patchPluginSessionExtension } from "./registry-CZzZT4dp.js";
import { t as isPluginJsonValue } from "./host-hook-json-CRVrIqU9.js";
import { a as resolveMainSessionKey, r as resolveAgentMainSessionKey } from "./main-session-D7Jmp9DO.js";
import { ct as resolveSessionStoreAgentId, dt as resolveStoredSessionOwnerAgentId, lt as resolveSessionStoreKey, ut as resolveStoredSessionKeyForAgentStore } from "./store-Cvp82S16.js";
import { D as preflightSessionTranscriptForManualCompact, H as trimSessionTranscriptForManualCompact, a as applySessionPatchProjection, p as deleteSessionEntryLifecycle } from "./session-accessor-CwhXEUId.js";
import { t as listConfiguredSessionStoreAgentIds } from "./targets-ChErRWTQ.js";
import { _ as replyRunRegistry } from "./reply-run-registry-CioKebTS.js";
import { T as waitForEmbeddedAgentRunEnd, l as isEmbeddedAgentRunActive, n as abortEmbeddedAgentRun } from "./runs-CGcPGyzc.js";
import { t as loadCombinedSessionStoreForGateway } from "./combined-store-gateway-CzF585qn.js";
import { i as serializeSessionCleanupResult, r as runSessionsCleanup } from "./sessions-BIAJdhW6.js";
import { c as resolveSessionWorkStartError, t as SESSION_LIFECYCLE_CHANGED_ERROR_REASON } from "./lifecycle-BS_t5emX.js";
import { i as resolveSessionTranscriptCandidates } from "./session-transcript-files.fs-Cj46Z9Oy.js";
import { a as readSessionMessageCountAsync, l as readSessionPreviewItemsFromTranscript, n as readRecentSessionMessagesWithStatsAsync } from "./session-transcript-readers-QQhnqU33.js";
import { n as insideGitCheckout } from "./git-BYAbpu1o.js";
import { _ as resolveGatewaySessionStoreTargetWithStore, c as listSessionsFromStoreAsync, d as migrateAndPruneGatewaySessionStoreKey, g as resolveGatewaySessionStoreTarget, m as resolveFreshestSessionEntryFromStoreKeys, n as buildGatewaySessionRow, p as resolveDeletedAgentIdFromSessionKey, u as loadSessionEntry, v as resolveGatewaySessionThinkingProjection, x as resolveSessionModelRef, y as resolveSessionDisplayModelIdentityRef } from "./session-utils-D5cDecWw.js";
import { d as getSessionCompactionCheckpoint, f as listSessionCompactionCheckpoints, u as createFileBackedCompactionCheckpointStore } from "./run-session-target-Dd7doi7F.js";
import { a as clearSessionQueues } from "./queue-D4SO3sXg.js";
import { $t as validateSessionsCompactionRestoreParams, Jt as validateSessionsCleanupParams, Qt as validateSessionsCompactionListParams, Xt as validateSessionsCompactionBranchParams, Yt as validateSessionsCompactParams, Zt as validateSessionsCompactionGetParams, an as validateSessionsListParams, cn as validateSessionsPatchParams, dn as validateSessionsResetParams, en as validateSessionsCreateParams, fn as validateSessionsResolveParams, ln as validateSessionsPluginPatchParams, nn as validateSessionsDescribeParams, on as validateSessionsMessagesSubscribeParams, pn as validateSessionsSendParams, qt as validateSessionsAbortParams, sn as validateSessionsMessagesUnsubscribeParams, tn as validateSessionsDeleteParams, un as validateSessionsPreviewParams } from "./src-CToKmqGn.js";
import { Gn as errorShape, Wn as ErrorCodes } from "./schema-BuOFpc7K.js";
import { t as triggerSessionPatchHook } from "./session-patch-hooks-gf9NDs3Z.js";
import { r as resolveIngressWorkspaceOverrideForSpawnedRun } from "./spawned-context-QGy9i1y8.js";
import { r as compactEmbeddedAgentSession } from "./embedded-agent-rBjsQK7b.js";
import { a as isSessionLifecycleMutationActive, i as interruptSessionWorkAdmissions, o as isSessionWorkAdmissionActive, s as runExclusiveSessionLifecycleMutation, t as SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS } from "./session-lifecycle-admission-DfdITEs1.js";
import { n as chatHandlers } from "./chat-B_PC-0Rk.js";
import { r as setGatewayDedupeEntry, t as emitSessionsChanged } from "./session-change-event-B7QC96gg.js";
import { t as loadOptionalServerMethodModelCatalog } from "./optional-model-catalog-lfLlMqV0.js";
import { n as hasVisibleActiveSessionRun, r as resolveVisibleActiveSessionRunState, t as hasTrackedActiveSessionRun } from "./session-active-runs-BhZGmpNB.js";
import { t as resolveSessionKeyFromResolveParams } from "./sessions-resolve-nYRzouV4.js";
import { a as managedWorktrees } from "./service-CZP996nB.js";
import { t as reactivateCompletedSubagentSession } from "./session-subagent-reactivation-t06_V7Rj.js";
import { t as assertValidParams } from "./validation-BlJXIosl.js";
import { n as resolveSessionKeyForRun } from "./server-session-key-D85Ovkxs.js";
import { i as projectSessionsPatchEntry, n as createGatewaySession, r as resolveRequestedSessionAgentId, t as buildDashboardSessionKey } from "./session-create-service-CJvh7RSi.js";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
//#region src/gateway/server-methods/sessions.ts
const log = createSubsystemLogger("gateway/sessions");
const compactionCheckpointStore = createFileBackedCompactionCheckpointStore();
function filterSessionStoreToConfiguredAgents(cfg, store) {
	const configuredAgentIds = new Set(listConfiguredSessionStoreAgentIds(cfg));
	const isConfiguredSessionKey = (key) => {
		const normalizedKey = normalizeOptionalString(key);
		if (!normalizedKey) return false;
		const agentId = resolveSessionStoreAgentId(cfg, resolveSessionStoreKey({
			cfg,
			sessionKey: normalizedKey
		}));
		return configuredAgentIds.has(normalizeAgentId(agentId));
	};
	return Object.fromEntries(Object.entries(store).filter(([key, entry]) => {
		if (key === "global" || key === "unknown") return true;
		if (isConfiguredSessionKey(key)) return true;
		return isConfiguredSessionKey(entry?.spawnedBy) || isConfiguredSessionKey(entry?.parentSessionKey);
	}));
}
const loadSessionsRuntimeModule = createLazyRuntimeModule(() => import("./sessions.runtime.js"));
function requireSessionKey(key, respond) {
	const normalized = normalizeOptionalString(typeof key === "string" ? key : typeof key === "number" ? String(key) : typeof key === "bigint" ? String(key) : "") ?? "";
	if (!normalized) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "key required"));
		return null;
	}
	return normalized;
}
function rejectPluginRuntimeDeleteMismatch(params) {
	const pluginOwnerId = normalizeOptionalString(params.client?.internal?.pluginRuntimeOwnerId);
	if (!pluginOwnerId || !params.entry) return false;
	if (normalizeOptionalString(params.entry.pluginOwnerId) === pluginOwnerId) return false;
	params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Plugin "${pluginOwnerId}" cannot delete session "${params.key}" because it did not create it.`));
	return true;
}
function resolveGatewaySessionTargetFromKey(key, cfg, opts) {
	const target = resolveGatewaySessionStoreTarget({
		cfg,
		key,
		...opts?.agentId ? { agentId: opts.agentId } : {}
	});
	return {
		cfg,
		target,
		storePath: target.storePath
	};
}
function loadSessionEntriesForTarget(params) {
	const target = resolveGatewaySessionStoreTargetWithStore({
		cfg: params.cfg,
		key: params.key,
		clone: false,
		...params.agentId ? { agentId: params.agentId } : {}
	});
	const store = target.store;
	const entry = resolveFreshestSessionEntryFromStoreKeys(store, target.storeKeys);
	return {
		target,
		storePath: target.storePath,
		store,
		entry
	};
}
function resolveOptionalInitialSessionMessage(params) {
	if (typeof params.task === "string" && params.task.trim()) return params.task;
	if (typeof params.message === "string" && params.message.trim()) return params.message;
}
function shouldAttachPendingMessageSeq(params) {
	if (params.cached) return false;
	return (params.payload && typeof params.payload === "object" ? params.payload.status : void 0) === "started";
}
function emitSessionOperation(context, payload) {
	const connIds = context.getSessionEventSubscriberConnIds();
	if (connIds.size === 0) return;
	context.broadcastToConnIds("session.operation", {
		...payload,
		ts: Date.now()
	}, connIds, { dropIfSlow: true });
}
function rejectWebchatSessionMutation(params) {
	if (!params.client?.connect || !params.isWebchatConnect(params.client.connect)) return false;
	if (params.client.connect.client.id === GATEWAY_CLIENT_IDS.CONTROL_UI) return false;
	params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `webchat clients cannot ${params.action} sessions; use chat.send for session-scoped updates`));
	return true;
}
function isAgentMainSessionKey(cfg, sessionKey) {
	const parsed = parseAgentSessionKey(sessionKey);
	if (!parsed) return false;
	return sessionKey === resolveAgentMainSessionKey({
		cfg,
		agentId: parsed.agentId
	});
}
async function createAgentMainSessionForSend(params) {
	const agentId = parseAgentSessionKey(params.canonicalKey)?.agentId;
	if (!agentId) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, `session not found: ${params.canonicalKey}`)
	};
	let createResult;
	await sessionsHandlers["sessions.create"]({
		req: params.req,
		params: {
			key: params.canonicalKey,
			agentId
		},
		respond: (ok, payload, error) => {
			createResult = {
				ok,
				payload: payload && typeof payload === "object" ? payload : void 0,
				error
			};
		},
		context: params.context,
		client: params.client,
		isWebchatConnect: params.isWebchatConnect
	});
	if (!createResult) return {
		ok: false,
		error: errorShape(ErrorCodes.UNAVAILABLE, "sessions.create did not respond")
	};
	if (!createResult.ok) return {
		ok: false,
		error: createResult.error ?? errorShape(ErrorCodes.UNAVAILABLE, "failed to create session")
	};
	const createdKey = normalizeOptionalString(createResult.payload?.key) ?? params.canonicalKey;
	const loaded = loadSessionEntry(createdKey);
	if (!loaded.entry?.sessionId) return {
		ok: false,
		error: errorShape(ErrorCodes.UNAVAILABLE, `session not created: ${createdKey}`)
	};
	return {
		ok: true,
		entry: loaded.entry,
		canonicalKey: loaded.canonicalKey,
		storePath: loaded.storePath
	};
}
function resolveAbortSessionKey(params) {
	if (params.activeRunSessionKey) return params.activeRunSessionKey;
	const candidates = [
		params.canonicalKey,
		params.requestedKey,
		...params.aliasKeys ?? []
	];
	for (const active of params.context.chatAbortControllers.values()) {
		if (active.controlUiVisible === false) continue;
		for (const candidate of candidates) if (active.sessionKey === candidate) return candidate;
	}
	return params.requestedKey;
}
function resolveSessionKeyAgentId(sessionKey, cfg) {
	const key = normalizeOptionalString(sessionKey);
	if (!key) return;
	if (!parseAgentSessionKey(key) && key.toLowerCase().startsWith("agent:")) return;
	return resolveSessionStoreAgentId(cfg, resolveSessionStoreKey({
		cfg,
		sessionKey: key
	}));
}
function sessionKeyBelongsToAgent(sessionKey, agentId, cfg) {
	const key = normalizeOptionalString(sessionKey);
	if (cfg.session?.scope === "global" && key?.toLowerCase() === "global") return true;
	const sessionAgentId = resolveSessionKeyAgentId(sessionKey, cfg);
	return Boolean(sessionAgentId && sessionAgentId === normalizeAgentId(agentId));
}
function resolveScopedAbortKey(params) {
	const key = normalizeOptionalString(params.key);
	if (!key) return;
	const requestedAgentId = normalizeOptionalString(params.agentId);
	if (!requestedAgentId) return key;
	const scopedAgentId = normalizeAgentId(requestedAgentId);
	const ownerAgentId = resolveStoredSessionOwnerAgentId({
		cfg: params.cfg,
		agentId: scopedAgentId,
		sessionKey: key
	});
	if (ownerAgentId && ownerAgentId !== scopedAgentId) return;
	return resolveStoredSessionKeyForAgentStore({
		cfg: params.cfg,
		agentId: scopedAgentId,
		sessionKey: key
	});
}
function resolveSessionMessageSubscriptionKey(params) {
	const agentId = params.agentId ? normalizeAgentId(params.agentId) : params.canonicalKey === "global" && params.defaultAgentId ? normalizeAgentId(params.defaultAgentId) : void 0;
	return params.canonicalKey === "global" && agentId ? `agent:${agentId}:global` : params.canonicalKey;
}
async function interruptSessionRunIfActive(params) {
	const cfg = params.context.getRuntimeConfig();
	const hasTrackedRun = hasTrackedActiveSessionRun({
		context: params.context,
		requestedKey: params.requestedKey,
		canonicalKey: params.canonicalKey,
		agentId: params.agentId,
		defaultAgentId: resolveDefaultAgentId(cfg)
	});
	const hasEmbeddedRun = typeof params.sessionId === "string" && params.sessionId ? isEmbeddedAgentRunActive(params.sessionId) : false;
	if (!hasTrackedRun && !hasEmbeddedRun) return { interrupted: false };
	if (hasTrackedRun) {
		let abortOk = true;
		let abortError;
		const abortSessionKey = resolveAbortSessionKey({
			context: params.context,
			requestedKey: params.requestedKey,
			canonicalKey: params.canonicalKey
		});
		await chatHandlers["chat.abort"]({
			req: params.req,
			params: {
				sessionKey: abortSessionKey,
				...params.canonicalKey === "global" && params.agentId ? { agentId: params.agentId } : {}
			},
			respond: (ok, _payload, error) => {
				abortOk = ok;
				abortError = error;
			},
			context: params.context,
			client: params.client,
			isWebchatConnect: params.isWebchatConnect
		});
		if (!abortOk) return {
			interrupted: true,
			error: abortError ?? errorShape(ErrorCodes.UNAVAILABLE, "failed to interrupt active session")
		};
	}
	if (hasEmbeddedRun && params.sessionId) abortEmbeddedAgentRun(params.sessionId);
	clearSessionQueues([
		params.requestedKey,
		params.canonicalKey,
		params.sessionId
	]);
	if (hasEmbeddedRun && params.sessionId) {
		if (!await waitForEmbeddedAgentRunEnd(params.sessionId, 15e3)) return {
			interrupted: true,
			error: errorShape(ErrorCodes.UNAVAILABLE, `Session ${params.requestedKey} is still active; try again in a moment.`)
		};
	}
	return { interrupted: true };
}
async function handleSessionSend(params) {
	if (!assertValidParams(params.params, validateSessionsSendParams, params.method, params.respond)) return;
	const p = params.params;
	const key = requireSessionKey(p.key, params.respond);
	if (!key) return;
	const cfg = params.context.getRuntimeConfig();
	const requestedAgent = resolveRequestedSessionAgentId(cfg, key, p.agentId);
	if (!requestedAgent.ok) {
		params.respond(false, void 0, requestedAgent.error);
		return;
	}
	const requestedAgentId = requestedAgent.agentId;
	const loaded = loadSessionEntry(key, { agentId: requestedAgentId });
	const { legacyKey } = loaded;
	let { entry, canonicalKey, storePath } = loaded;
	const deletedAgentId = resolveDeletedAgentIdFromSessionKey(cfg, canonicalKey, entry, { acpMetadataSessionKey: legacyKey ?? canonicalKey });
	if (deletedAgentId !== null) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Agent "${deletedAgentId}" no longer exists in configuration`));
		return;
	}
	const rawIdempotencyKey = p.idempotencyKey;
	const explicitIdempotencyKey = typeof rawIdempotencyKey === "string" && rawIdempotencyKey.trim() ? rawIdempotencyKey.trim() : void 0;
	const idempotencyKey = explicitIdempotencyKey ?? randomUUID();
	const dispatchChatSend = async (respond) => {
		await chatHandlers["chat.send"]({
			req: params.req,
			params: {
				sessionKey: canonicalKey,
				...canonicalKey === "global" && requestedAgentId ? { agentId: requestedAgentId } : {},
				message: p.message,
				thinking: p.thinking,
				attachments: p.attachments,
				timeoutMs: p.timeoutMs,
				idempotencyKey
			},
			respond,
			context: params.context,
			client: params.client,
			isWebchatConnect: params.isWebchatConnect
		});
	};
	const archivedSessionError = resolveSessionWorkStartError(canonicalKey, entry);
	if (archivedSessionError) {
		if (explicitIdempotencyKey) {
			await dispatchChatSend(params.respond);
			return;
		}
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, archivedSessionError));
		return;
	}
	if (!entry?.sessionId && !params.interruptIfActive && isAgentMainSessionKey(cfg, canonicalKey)) {
		const created = await createAgentMainSessionForSend({
			req: params.req,
			canonicalKey,
			context: params.context,
			client: params.client,
			isWebchatConnect: params.isWebchatConnect
		});
		if (!created.ok) {
			params.respond(false, void 0, created.error);
			return;
		}
		entry = created.entry;
		canonicalKey = created.canonicalKey;
		storePath = created.storePath;
	}
	if (!entry?.sessionId) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `session not found: ${key}`));
		return;
	}
	let interruptedActiveRun = false;
	if (params.interruptIfActive) {
		const interruptResult = await interruptSessionRunIfActive({
			req: params.req,
			context: params.context,
			client: params.client,
			isWebchatConnect: params.isWebchatConnect,
			requestedKey: key,
			canonicalKey,
			agentId: requestedAgentId,
			sessionId: entry.sessionId
		});
		if (interruptResult.error) {
			params.respond(false, void 0, interruptResult.error);
			return;
		}
		interruptedActiveRun = interruptResult.interrupted;
	}
	const messageSeq = await readSessionMessageCountAsync({
		agentId: requestedAgentId,
		sessionEntry: entry,
		sessionId: entry.sessionId,
		sessionKey: canonicalKey,
		storePath
	}) + 1;
	let sendAcked = false;
	let sendPayload;
	let sendCached = false;
	let startedRunId;
	await dispatchChatSend((ok, payload, error, meta) => {
		sendAcked = ok;
		sendPayload = payload;
		sendCached = meta?.cached === true;
		startedRunId = payload && typeof payload === "object" && typeof payload.runId === "string" ? payload.runId : void 0;
		if (ok && shouldAttachPendingMessageSeq({
			payload,
			cached: meta?.cached === true
		})) {
			params.respond(true, {
				...payload && typeof payload === "object" ? payload : {},
				messageSeq,
				...interruptedActiveRun ? { interruptedActiveRun: true } : {}
			}, void 0, meta);
			return;
		}
		params.respond(ok, ok && payload && typeof payload === "object" ? {
			...payload,
			...interruptedActiveRun ? { interruptedActiveRun: true } : {}
		} : payload, error, meta);
	});
	if (sendAcked) {
		if (shouldAttachPendingMessageSeq({
			payload: sendPayload,
			cached: sendCached
		})) await reactivateCompletedSubagentSession({
			sessionKey: canonicalKey,
			runId: startedRunId,
			task: p.message
		});
		emitSessionsChanged(params.context, {
			sessionKey: canonicalKey,
			...canonicalKey === "global" && requestedAgentId ? { agentId: requestedAgentId } : {},
			reason: interruptedActiveRun ? "steer" : "send"
		});
	}
}
const sessionsHandlers = {
	"sessions.list": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSessionsListParams, "sessions.list", respond)) return;
		const p = params;
		const cfg = context.getRuntimeConfig();
		const configuredAgentsOnly = p.configuredAgentsOnly === true;
		respond(true, await measureDiagnosticsTimelineSpan("gateway.sessions.list", async () => {
			const { storePath, store } = measureDiagnosticsTimelineSpanSync("gateway.sessions.list.store_load", () => loadCombinedSessionStoreForGateway(cfg, { agentId: p.agentId }), {
				config: cfg,
				phase: "sessions.list",
				attributes: {
					agentId: p.agentId ?? null,
					configuredAgentsOnly
				}
			});
			const listStore = configuredAgentsOnly ? filterSessionStoreToConfiguredAgents(cfg, store) : store;
			const modelCatalog = await measureDiagnosticsTimelineSpan("gateway.sessions.list.model_catalog", () => loadOptionalServerMethodModelCatalog(context, "sessions.list"), {
				config: cfg,
				phase: "sessions.list"
			});
			const result = await measureDiagnosticsTimelineSpan("gateway.sessions.list.rows", () => listSessionsFromStoreAsync({
				cfg,
				storePath,
				store: listStore,
				modelCatalog,
				opts: p
			}), {
				config: cfg,
				phase: "sessions.list",
				attributes: { storeEntries: Object.keys(listStore).length }
			});
			const sessions = measureDiagnosticsTimelineSpanSync("gateway.sessions.list.active_run_flags", () => {
				return result.sessions.map((session) => {
					const activeRunState = resolveVisibleActiveSessionRunState({
						context,
						requestedKey: session.key,
						canonicalKey: session.key,
						sessionId: session.sessionId,
						...session.key === "global" && p.agentId ? { agentId: p.agentId } : {},
						defaultAgentId: resolveDefaultAgentId(cfg)
					});
					return Object.assign({}, session, {
						hasActiveRun: activeRunState.active,
						...activeRunState.runIds.length > 0 ? { activeRunIds: activeRunState.runIds } : {}
					});
				});
			}, {
				config: cfg,
				phase: "sessions.list",
				attributes: { sessions: result.sessions.length }
			});
			return {
				...result,
				sessions
			};
		}, {
			config: cfg,
			phase: "sessions.list",
			attributes: {
				agentId: p.agentId ?? null,
				configuredAgentsOnly
			}
		}), void 0);
	},
	"sessions.cleanup": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSessionsCleanupParams, "sessions.cleanup", respond)) return;
		const p = params;
		try {
			const { mode, appliedSummaries } = await runSessionsCleanup({
				cfg: context.getRuntimeConfig(),
				opts: {
					agent: p.agent,
					allAgents: p.allAgents,
					enforce: p.enforce,
					activeKey: p.activeKey,
					fixMissing: p.fixMissing,
					fixDmScope: p.fixDmScope
				}
			});
			respond(true, serializeSessionCleanupResult({
				mode,
				dryRun: false,
				summaries: appliedSummaries
			}), void 0);
			for (const summary of appliedSummaries) {
				emitSessionsChanged(context, {
					reason: "cleanup",
					sessionKey: void 0
				});
				if (summary.wouldMutate) context.logGateway.debug(`sessions.cleanup applied ${summary.storePath}: ${summary.beforeCount} -> ${summary.afterCount}`);
			}
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, formatErrorMessage(error)));
		}
	},
	"sessions.subscribe": ({ client, context, respond }) => {
		const connId = client?.connId?.trim();
		if (connId) context.subscribeSessionEvents(connId);
		respond(true, { subscribed: Boolean(connId) }, void 0);
	},
	"sessions.unsubscribe": ({ client, context, respond }) => {
		const connId = client?.connId?.trim();
		if (connId) context.unsubscribeSessionEvents(connId);
		respond(true, { subscribed: false }, void 0);
	},
	"sessions.messages.subscribe": ({ params, client, context, respond }) => {
		if (!assertValidParams(params, validateSessionsMessagesSubscribeParams, "sessions.messages.subscribe", respond)) return;
		const connId = client?.connId?.trim();
		const p = params;
		const key = requireSessionKey(p.key, respond);
		if (!key) return;
		const cfg = context.getRuntimeConfig();
		const requestedAgent = resolveRequestedSessionAgentId(cfg, key, p.agentId);
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const requestedAgentId = requestedAgent.agentId;
		const { canonicalKey } = loadSessionEntry(key, { agentId: requestedAgentId });
		const subscriptionKey = resolveSessionMessageSubscriptionKey({
			canonicalKey,
			agentId: requestedAgentId,
			defaultAgentId: resolveDefaultAgentId(cfg)
		});
		if (connId) {
			context.subscribeSessionMessageEvents(connId, subscriptionKey);
			respond(true, {
				subscribed: true,
				key: canonicalKey
			}, void 0);
			return;
		}
		respond(true, {
			subscribed: false,
			key: canonicalKey
		}, void 0);
	},
	"sessions.messages.unsubscribe": ({ params, client, context, respond }) => {
		if (!assertValidParams(params, validateSessionsMessagesUnsubscribeParams, "sessions.messages.unsubscribe", respond)) return;
		const connId = client?.connId?.trim();
		const p = params;
		const key = requireSessionKey(p.key, respond);
		if (!key) return;
		const cfg = context.getRuntimeConfig();
		const requestedAgent = resolveRequestedSessionAgentId(cfg, key, p.agentId);
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const requestedAgentId = requestedAgent.agentId;
		const { canonicalKey } = loadSessionEntry(key, { agentId: requestedAgentId });
		const subscriptionKey = resolveSessionMessageSubscriptionKey({
			canonicalKey,
			agentId: requestedAgentId,
			defaultAgentId: resolveDefaultAgentId(cfg)
		});
		if (connId) context.unsubscribeSessionMessageEvents(connId, subscriptionKey);
		respond(true, {
			subscribed: false,
			key: canonicalKey
		}, void 0);
	},
	"sessions.preview": ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSessionsPreviewParams, "sessions.preview", respond)) return;
		const p = params;
		const keys = (Array.isArray(p.keys) ? p.keys : []).map((key) => normalizeOptionalString(key ?? "")).filter((key) => Boolean(key)).slice(0, 64);
		const limit = typeof p.limit === "number" && Number.isFinite(p.limit) ? Math.max(1, p.limit) : 12;
		const maxChars = typeof p.maxChars === "number" && Number.isFinite(p.maxChars) ? Math.max(20, p.maxChars) : 240;
		if (keys.length === 0) {
			respond(true, {
				ts: Date.now(),
				previews: []
			}, void 0);
			return;
		}
		const cfg = context.getRuntimeConfig();
		const storeCache = /* @__PURE__ */ new Map();
		const previews = [];
		for (const key of keys) try {
			const cachedStoreTarget = resolveGatewaySessionStoreTargetWithStore({
				cfg,
				key
			});
			const store = storeCache.get(cachedStoreTarget.storePath) ?? cachedStoreTarget.store;
			storeCache.set(cachedStoreTarget.storePath, store);
			const target = resolveGatewaySessionStoreTarget({
				cfg,
				key,
				store
			});
			const entry = resolveFreshestSessionEntryFromStoreKeys(store, target.storeKeys);
			if (!entry?.sessionId) {
				previews.push({
					key,
					status: "missing",
					items: []
				});
				continue;
			}
			const items = readSessionPreviewItemsFromTranscript({
				agentId: target.agentId,
				sessionEntry: entry,
				sessionId: entry.sessionId,
				sessionKey: target.canonicalKey,
				storePath: target.storePath
			}, limit, maxChars);
			previews.push({
				key,
				status: items.length > 0 ? "ok" : "empty",
				items
			});
		} catch {
			previews.push({
				key,
				status: "error",
				items: []
			});
		}
		respond(true, {
			ts: Date.now(),
			previews
		}, void 0);
	},
	"sessions.describe": ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSessionsDescribeParams, "sessions.describe", respond)) return;
		const p = params;
		const key = requireSessionKey(p.key, respond);
		if (!key) return;
		const cfg = context.getRuntimeConfig();
		const { target, storePath, store, entry } = loadSessionEntriesForTarget({
			key,
			cfg
		});
		if (!entry) {
			respond(true, { session: null }, void 0);
			return;
		}
		respond(true, { session: buildGatewaySessionRow({
			cfg,
			storePath,
			store,
			key: target.canonicalKey,
			entry,
			includeDerivedTitles: p.includeDerivedTitles,
			includeLastMessage: p.includeLastMessage,
			transcriptUsageMaxBytes: 64 * 1024
		}) }, void 0);
	},
	"sessions.resolve": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSessionsResolveParams, "sessions.resolve", respond)) return;
		const p = params;
		const resolved = await resolveSessionKeyFromResolveParams({
			cfg: context.getRuntimeConfig(),
			p
		});
		if (!resolved.ok) {
			respond(false, void 0, resolved.error);
			return;
		}
		if ("missing" in resolved) {
			respond(true, { ok: false }, void 0);
			return;
		}
		respond(true, {
			ok: true,
			key: resolved.key
		}, void 0);
	},
	"sessions.compaction.list": ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSessionsCompactionListParams, "sessions.compaction.list", respond)) return;
		const p = params;
		const key = requireSessionKey(p.key, respond);
		if (!key) return;
		const requestedAgent = resolveRequestedSessionAgentId(context.getRuntimeConfig(), key, p.agentId);
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const { entry, canonicalKey } = loadSessionEntry(key, { agentId: requestedAgent.agentId });
		respond(true, {
			ok: true,
			key: canonicalKey,
			checkpoints: listSessionCompactionCheckpoints(entry)
		}, void 0);
	},
	"sessions.compaction.get": ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSessionsCompactionGetParams, "sessions.compaction.get", respond)) return;
		const p = params;
		const key = requireSessionKey(p.key, respond);
		if (!key) return;
		const checkpointId = normalizeOptionalString(p.checkpointId) ?? "";
		if (!checkpointId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "checkpointId required"));
			return;
		}
		const requestedAgent = resolveRequestedSessionAgentId(context.getRuntimeConfig(), key, p.agentId);
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const { entry, canonicalKey } = loadSessionEntry(key, { agentId: requestedAgent.agentId });
		const checkpoint = getSessionCompactionCheckpoint({
			entry,
			checkpointId
		});
		if (!checkpoint) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `checkpoint not found: ${checkpointId}`));
			return;
		}
		respond(true, {
			ok: true,
			key: canonicalKey,
			checkpoint
		}, void 0);
	},
	"sessions.create": async ({ req, params, respond, context, client, isWebchatConnect }) => {
		if (!assertValidParams(params, validateSessionsCreateParams, "sessions.create", respond)) return;
		const p = params;
		const cfg = context.getRuntimeConfig();
		const initialMessage = resolveOptionalInitialSessionMessage(p);
		let sessionKey = p.key;
		let sessionAgentId = p.agentId;
		let sessionWorktree;
		let sessionCwd;
		let provisionedSessionWorktree = false;
		if (p.worktree === true) {
			const explicitKey = normalizeOptionalString(p.key);
			const requestedKey = explicitKey ?? "global";
			const requestedAgent = resolveRequestedSessionAgentId(cfg, requestedKey, p.agentId);
			if (!requestedAgent.ok) {
				respond(false, void 0, requestedAgent.error);
				return;
			}
			const agentId = normalizeAgentId(requestedAgent.agentId ?? normalizeOptionalString(p.agentId) ?? parseAgentSessionKey(requestedKey)?.agentId ?? resolveDefaultAgentId(cfg));
			let targetKey = explicitKey;
			let preservesUnspecifiedKey = false;
			const parentSessionKey = normalizeOptionalString(p.parentSessionKey);
			if (!targetKey && parentSessionKey && p.emitCommandHooks === true && !initialMessage && cfg.session?.dmScope === "main") {
				const parent = loadSessionEntry(parentSessionKey, requestedAgent.agentId ? { agentId: requestedAgent.agentId } : void 0);
				const parentAgentId = normalizeAgentId(requestedAgent.agentId ?? resolveSessionStoreAgentId(cfg, parent.canonicalKey));
				if (parent.entry?.sessionId && parent.canonicalKey === resolveAgentMainSessionKey({
					cfg,
					agentId: parentAgentId
				})) {
					targetKey = parent.canonicalKey;
					preservesUnspecifiedKey = true;
				}
			}
			targetKey ??= buildDashboardSessionKey(agentId);
			const target = resolveGatewaySessionStoreTarget({
				cfg,
				key: targetKey,
				agentId
			});
			sessionKey = preservesUnspecifiedKey ? void 0 : targetKey;
			sessionAgentId = target.agentId;
			const workspace = resolveAgentWorkspaceDir(cfg, target.agentId);
			if (!insideGitCheckout(workspace)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "agent workspace is not a git checkout"));
				return;
			}
			try {
				const existing = managedWorktrees.findLiveByOwner("session", target.canonicalKey);
				let existingDirectory = false;
				if (existing) try {
					existingDirectory = fs.lstatSync(existing.path).isDirectory();
				} catch {}
				if (existing && existingDirectory) sessionWorktree = existing;
				else {
					const scopes = Array.isArray(client?.connect.scopes) ? client.connect.scopes : [];
					sessionWorktree = await managedWorktrees.create({
						repoRoot: workspace,
						ownerKind: "session",
						ownerId: target.canonicalKey,
						runSetupScript: scopes.includes(ADMIN_SCOPE)
					});
					provisionedSessionWorktree = true;
				}
			} catch (error) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
				return;
			}
			sessionCwd = sessionWorktree.path;
			try {
				const relative = path.relative(fs.realpathSync(sessionWorktree.repoRoot), fs.realpathSync(workspace));
				if (relative && !relative.startsWith("..") && !path.isAbsolute(relative)) {
					sessionCwd = path.join(sessionWorktree.path, relative);
					fs.mkdirSync(sessionCwd, { recursive: true });
				}
			} catch {
				sessionCwd = sessionWorktree.path;
			}
		}
		let runPayload;
		let runError;
		let runMeta;
		let messageSeq;
		const created = await createGatewaySession({
			cfg,
			key: sessionKey,
			agentId: sessionAgentId,
			label: p.label,
			model: p.model,
			parentSessionKey: p.parentSessionKey,
			spawnedCwd: sessionCwd,
			clearSpawnedCwd: p.worktree !== true,
			fork: p.fork,
			emitCommandHooks: p.emitCommandHooks,
			resetMainWhenUnspecified: !initialMessage,
			commandSource: "webchat",
			loadGatewayModelCatalog: context.loadGatewayModelCatalog,
			afterCreate: initialMessage ? async ({ key, agentId, entry, storePath }) => {
				messageSeq = await readSessionMessageCountAsync({
					agentId,
					sessionEntry: entry,
					sessionId: entry.sessionId,
					sessionKey: key,
					storePath
				}) + 1;
				await chatHandlers["chat.send"]({
					req,
					params: {
						sessionKey: key,
						...key === "global" ? { agentId } : {},
						message: initialMessage,
						idempotencyKey: randomUUID()
					},
					respond: (ok, payload, error, meta) => {
						if (ok && payload && typeof payload === "object") runPayload = payload;
						else runError = error;
						runMeta = meta;
					},
					context,
					client,
					isWebchatConnect
				});
			} : void 0
		});
		if (!created.ok) {
			if (sessionWorktree && provisionedSessionWorktree) try {
				await managedWorktrees.remove({
					id: sessionWorktree.id,
					reason: "session-create-failed",
					force: true
				});
			} catch (error) {
				log.warn(`failed to clean up worktree after session creation failed: ${formatErrorMessage(error)}`);
			}
			respond(false, void 0, created.error);
			return;
		}
		if (p.worktree !== true) try {
			const owned = managedWorktrees.findLiveByOwner("session", created.key);
			if (owned) await managedWorktrees.removeIfLossless(owned.id);
		} catch (error) {
			log.warn(`failed to release worktree for reset session ${created.key}: ${formatErrorMessage(error)}`);
		}
		const createdWorktree = sessionWorktree ? {
			id: sessionWorktree.id,
			path: sessionWorktree.path,
			branch: sessionWorktree.branch
		} : void 0;
		if (created.resetExisting) {
			respond(true, {
				ok: true,
				key: created.key,
				sessionId: created.entry.sessionId,
				entry: created.entry,
				runStarted: false,
				...createdWorktree ? { worktree: createdWorktree } : {}
			}, void 0);
			emitSessionsChanged(context, {
				sessionKey: created.key,
				...created.key === "global" ? { agentId: created.agentId } : {},
				reason: "new"
			});
			return;
		}
		const runStarted = runPayload !== void 0 && shouldAttachPendingMessageSeq({
			payload: runPayload,
			cached: runMeta?.cached === true
		});
		respond(true, {
			ok: true,
			key: created.key,
			sessionId: created.entry.sessionId,
			entry: created.entry,
			runStarted,
			...runPayload ? runPayload : {},
			...runStarted && typeof messageSeq === "number" ? { messageSeq } : {},
			...runError ? { runError } : {},
			...createdWorktree ? { worktree: createdWorktree } : {}
		}, void 0);
		emitSessionsChanged(context, {
			sessionKey: created.key,
			...created.key === "global" ? { agentId: created.agentId } : {},
			reason: "create"
		});
		if (runStarted) emitSessionsChanged(context, {
			sessionKey: created.key,
			...created.key === "global" ? { agentId: created.agentId } : {},
			reason: "send"
		});
	},
	"sessions.compaction.branch": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSessionsCompactionBranchParams, "sessions.compaction.branch", respond)) return;
		const p = params;
		const key = requireSessionKey(p.key, respond);
		if (!key) return;
		const checkpointId = typeof p.checkpointId === "string" && p.checkpointId.trim() ? p.checkpointId.trim() : "";
		if (!checkpointId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "checkpointId required"));
			return;
		}
		const requestedAgent = resolveRequestedSessionAgentId(context.getRuntimeConfig(), key, p.agentId);
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const { cfg: loadedCfg, entry, canonicalKey, legacyKey } = loadSessionEntry(key, { agentId: requestedAgent.agentId });
		const target = resolveGatewaySessionStoreTarget({
			cfg: loadedCfg,
			key: canonicalKey,
			agentId: requestedAgent.agentId
		});
		if (!entry?.sessionId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `session not found: ${key}`));
			return;
		}
		if (!getSessionCompactionCheckpoint({
			entry,
			checkpointId
		})) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `checkpoint not found: ${checkpointId}`));
			return;
		}
		const nextKey = buildDashboardSessionKey(target.agentId);
		const branchedSession = await compactionCheckpointStore.branchCheckpointSession({
			storePath: target.storePath,
			sourceKey: canonicalKey,
			sourceStoreKey: legacyKey,
			nextKey,
			checkpointId
		});
		if (branchedSession.status === "missing-checkpoint" || branchedSession.status === "missing-boundary") {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `checkpoint not found: ${checkpointId}`));
			return;
		}
		if (branchedSession.status === "missing-session") {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `session not found: ${key}`));
			return;
		}
		if (branchedSession.status === "failed") {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "failed to create checkpoint branch transcript"));
			return;
		}
		respond(true, {
			ok: true,
			sourceKey: canonicalKey,
			key: branchedSession.key,
			sessionId: branchedSession.entry.sessionId,
			checkpoint: branchedSession.checkpoint,
			entry: branchedSession.entry
		}, void 0);
		emitSessionsChanged(context, {
			sessionKey: canonicalKey,
			...canonicalKey === "global" && requestedAgent.agentId ? { agentId: requestedAgent.agentId } : {},
			reason: "checkpoint-branch"
		});
		emitSessionsChanged(context, {
			sessionKey: branchedSession.key,
			reason: "checkpoint-branch"
		});
	},
	"sessions.compaction.restore": async ({ req, params, respond, context, client, isWebchatConnect }) => {
		if (!assertValidParams(params, validateSessionsCompactionRestoreParams, "sessions.compaction.restore", respond)) return;
		const p = params;
		const key = requireSessionKey(p.key, respond);
		if (!key) return;
		if (rejectWebchatSessionMutation({
			action: "restore",
			client,
			isWebchatConnect,
			respond
		})) return;
		const checkpointId = typeof p.checkpointId === "string" && p.checkpointId.trim() ? p.checkpointId.trim() : "";
		if (!checkpointId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "checkpointId required"));
			return;
		}
		const requestedAgent = resolveRequestedSessionAgentId(context.getRuntimeConfig(), key, p.agentId);
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const { entry, canonicalKey, legacyKey, storePath } = loadSessionEntry(key, { agentId: requestedAgent.agentId });
		if (!entry?.sessionId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `session not found: ${key}`));
			return;
		}
		if (!getSessionCompactionCheckpoint({
			entry,
			checkpointId
		})) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `checkpoint not found: ${checkpointId}`));
			return;
		}
		const lifecycleIdentities = [
			key,
			canonicalKey,
			legacyKey,
			entry.sessionId,
			entry.lifecycleRevision
		];
		let admittedWorkReleased = true;
		let restoreTargetStillCurrent = true;
		await runExclusiveSessionLifecycleMutation({
			scope: storePath,
			identities: lifecycleIdentities,
			prepare: async () => {
				const current = loadSessionEntry(key, { agentId: requestedAgent.agentId });
				restoreTargetStillCurrent = Boolean(current.entry?.sessionId === entry.sessionId && current.entry.lifecycleRevision === entry.lifecycleRevision && getSessionCompactionCheckpoint({
					entry: current.entry,
					checkpointId
				}));
				if (!restoreTargetStillCurrent) return;
				clearSessionQueues([
					key,
					current.canonicalKey,
					current.legacyKey,
					current.entry?.sessionId
				]);
				admittedWorkReleased = await interruptSessionWorkAdmissions({
					scope: storePath,
					identities: lifecycleIdentities,
					timeoutMs: SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS
				});
			},
			run: async () => {
				if (!restoreTargetStillCurrent) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Session ${key} changed before checkpoint restore. Retry.`, { details: { reason: SESSION_LIFECYCLE_CHANGED_ERROR_REASON } }));
					return;
				}
				if (!admittedWorkReleased) {
					respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `Session ${key} is still active; try again.`));
					return;
				}
				const current = loadSessionEntry(key, { agentId: requestedAgent.agentId });
				if (!current.entry?.sessionId) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `session not found: ${key}`));
					return;
				}
				if (!getSessionCompactionCheckpoint({
					entry: current.entry,
					checkpointId
				})) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `checkpoint not found: ${checkpointId}`));
					return;
				}
				const interruptResult = await interruptSessionRunIfActive({
					req,
					context,
					client,
					isWebchatConnect,
					requestedKey: key,
					canonicalKey: current.canonicalKey,
					agentId: requestedAgent.agentId,
					sessionId: current.entry.sessionId
				});
				if (interruptResult.error) {
					respond(false, void 0, interruptResult.error);
					return;
				}
				const restoredSession = await compactionCheckpointStore.restoreCheckpointSession({
					storePath,
					sessionKey: current.canonicalKey,
					sessionStoreKey: current.legacyKey,
					checkpointId
				});
				if (restoredSession.status === "missing-checkpoint" || restoredSession.status === "missing-boundary") {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `checkpoint not found: ${checkpointId}`));
					return;
				}
				if (restoredSession.status === "missing-session") {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `session not found: ${key}`));
					return;
				}
				if (restoredSession.status === "failed") {
					respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "failed to restore checkpoint transcript"));
					return;
				}
				respond(true, {
					ok: true,
					key: restoredSession.key,
					sessionId: restoredSession.entry.sessionId,
					checkpoint: restoredSession.checkpoint,
					entry: restoredSession.entry
				}, void 0);
				emitSessionsChanged(context, {
					sessionKey: current.canonicalKey,
					...current.canonicalKey === "global" && requestedAgent.agentId ? { agentId: requestedAgent.agentId } : {},
					reason: "checkpoint-restore"
				});
			}
		});
	},
	"sessions.send": async ({ req, params, respond, context, client, isWebchatConnect }) => {
		await handleSessionSend({
			method: "sessions.send",
			req,
			params,
			respond,
			context,
			client,
			isWebchatConnect,
			interruptIfActive: false
		});
	},
	"sessions.steer": async ({ req, params, respond, context, client, isWebchatConnect }) => {
		await handleSessionSend({
			method: "sessions.steer",
			req,
			params,
			respond,
			context,
			client,
			isWebchatConnect,
			interruptIfActive: true
		});
	},
	"sessions.abort": async ({ req, params, respond, context, client, isWebchatConnect }) => {
		if (!assertValidParams(params, validateSessionsAbortParams, "sessions.abort", respond)) return;
		const p = params;
		const cfg = context.getRuntimeConfig();
		const requestedRunId = readStringValue(p.runId);
		const requestedKey = normalizeOptionalString(p.key);
		const requestedParamAgentId = normalizeOptionalString(p.agentId);
		const scopedRequestedKey = resolveScopedAbortKey({
			cfg,
			key: requestedKey,
			agentId: requestedParamAgentId
		});
		if (requestedKey && requestedParamAgentId && !scopedRequestedKey) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "session key agent does not match agentId"));
			return;
		}
		const requestedKeyAgentId = scopedRequestedKey ? resolveSessionKeyAgentId(scopedRequestedKey, cfg) : void 0;
		const activeRun = requestedRunId ? context.chatAbortControllers.get(requestedRunId) : void 0;
		const activeRunSessionKey = activeRun?.sessionKey;
		const activeRunAgentId = normalizeOptionalString(activeRun?.agentId);
		const inferredRunAgentId = requestedParamAgentId ?? (requestedRunId && scopedRequestedKey?.toLowerCase() === "global" ? activeRunAgentId : void 0) ?? requestedKeyAgentId ?? (requestedRunId && !activeRunSessionKey ? resolveDefaultAgentId(cfg) : void 0);
		const requestedRunAgentId = requestedRunId ? inferredRunAgentId ? normalizeAgentId(inferredRunAgentId) : void 0 : void 0;
		const scopedActiveRunSessionKey = activeRunSessionKey ? requestedRunAgentId ? sessionKeyBelongsToAgent(activeRunSessionKey, requestedRunAgentId, cfg) ? activeRunSessionKey : void 0 : activeRunSessionKey : void 0;
		const keyCandidate = scopedRequestedKey ?? scopedActiveRunSessionKey ?? (requestedRunId ? resolveSessionKeyForRun(requestedRunId, { agentId: requestedRunAgentId ?? resolveDefaultAgentId(cfg) }) : void 0);
		if (!keyCandidate && requestedRunId) {
			respond(true, {
				ok: true,
				abortedRunId: null,
				status: "no-active-run"
			});
			return;
		}
		const key = requireSessionKey(keyCandidate, respond);
		if (!key) return;
		const requestedGlobalAgent = resolveRequestedSessionAgentId(cfg, key, requestedParamAgentId ?? requestedRunAgentId);
		if (!requestedGlobalAgent.ok) {
			respond(false, void 0, requestedGlobalAgent.error);
			return;
		}
		const requestedGlobalAgentId = requestedGlobalAgent.agentId;
		const { canonicalKey } = loadSessionEntry(key, { agentId: requestedGlobalAgentId });
		const resolvedAbortSessionKey = resolveAbortSessionKey({
			context,
			requestedKey: key,
			canonicalKey,
			activeRunSessionKey: scopedActiveRunSessionKey,
			aliasKeys: requestedKey && requestedKey !== key && (!requestedParamAgentId || sessionKeyBelongsToAgent(requestedKey, requestedParamAgentId, cfg)) ? [requestedKey] : void 0
		});
		const abortSessionKey = canonicalKey === "global" && requestedGlobalAgentId ? "global" : resolvedAbortSessionKey;
		const abortAgentId = abortSessionKey === "global" ? requestedGlobalAgentId ?? activeRunAgentId : void 0;
		const preAbortRunKinds = /* @__PURE__ */ new Map();
		if (requestedRunId) preAbortRunKinds.set(requestedRunId, context.chatAbortControllers.get(requestedRunId)?.kind);
		else for (const [rid, entry] of context.chatAbortControllers) preAbortRunKinds.set(rid, entry.kind);
		let abortedRunId = null;
		await chatHandlers["chat.abort"]({
			req,
			params: {
				sessionKey: abortSessionKey,
				runId: requestedRunId,
				...abortAgentId ? { agentId: abortAgentId } : {}
			},
			respond: (ok, payload, error, meta) => {
				if (!ok) {
					respond(ok, payload, error, meta);
					return;
				}
				const firstAbortedRunId = (payload && typeof payload === "object" && Array.isArray(payload.runIds) ? payload.runIds.filter((value) => Boolean(normalizeOptionalString(value))) : [])[0] ?? null;
				abortedRunId = firstAbortedRunId;
				if (firstAbortedRunId) {
					const endedAt = Date.now();
					const dedupePrefix = preAbortRunKinds.get(firstAbortedRunId) === "agent" ? "agent" : "chat";
					setGatewayDedupeEntry({
						dedupe: context.dedupe,
						key: `${dedupePrefix}:${firstAbortedRunId}`,
						entry: {
							ts: endedAt,
							ok: true,
							payload: {
								status: "timeout",
								runId: firstAbortedRunId,
								...abortAgentId ? { agentId: abortAgentId } : {},
								stopReason: "rpc",
								endedAt
							}
						}
					});
				}
				respond(true, {
					ok: true,
					abortedRunId,
					status: abortedRunId ? "aborted" : "no-active-run"
				}, void 0, meta);
			},
			context,
			client,
			isWebchatConnect
		});
		if (abortedRunId) emitSessionsChanged(context, {
			sessionKey: canonicalKey,
			...canonicalKey === "global" && abortAgentId ? { agentId: abortAgentId } : {},
			reason: "abort"
		});
	},
	"sessions.patch": async ({ params, respond, context, client, isWebchatConnect }) => {
		if (!assertValidParams(params, validateSessionsPatchParams, "sessions.patch", respond)) return;
		const p = params;
		const key = requireSessionKey(p.key, respond);
		if (!key) return;
		if (rejectWebchatSessionMutation({
			action: "patch",
			client,
			isWebchatConnect,
			respond
		})) return;
		const cfg = context.getRuntimeConfig();
		const requestedAgent = resolveRequestedSessionAgentId(cfg, key, p.agentId);
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const requestedAgentId = requestedAgent.agentId;
		const { target, storePath } = resolveGatewaySessionTargetFromKey(key, cfg, { agentId: requestedAgentId });
		const canonicalKey = target.canonicalKey ?? key;
		const lifecycleEntry = loadSessionEntry(key, { agentId: requestedAgentId }).entry;
		const lifecycleIdentities = [
			canonicalKey,
			key,
			lifecycleEntry?.sessionId
		];
		if (p.archived === true && isSessionLifecycleMutationActive(storePath, lifecycleIdentities)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Cannot archive a session with an active run."));
			return;
		}
		let patchModelCatalog;
		const loadPatchModelCatalog = async () => {
			const catalog = await context.loadGatewayModelCatalog();
			patchModelCatalog = catalog;
			return catalog;
		};
		const applyPatch = async () => {
			const currentLifecycleEntry = loadSessionEntry(key, { agentId: requestedAgentId }).entry;
			const lifecycleEntryRemoved = lifecycleEntry !== void 0 && currentLifecycleEntry === void 0;
			const archiveTargetChanged = p.archived === true && (lifecycleEntry === void 0 ? currentLifecycleEntry !== void 0 : currentLifecycleEntry !== void 0 && (currentLifecycleEntry.sessionId !== lifecycleEntry.sessionId || currentLifecycleEntry.lifecycleRevision !== lifecycleEntry.lifecycleRevision));
			if (lifecycleEntryRemoved || archiveTargetChanged) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Session ${key} changed before patch. Retry.`));
				return null;
			}
			if (p.archived === true) {
				if (canonicalKey === "global" || isAgentMainSessionKey(cfg, canonicalKey)) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Cannot archive an agent's main session."));
					return null;
				}
				const { entry } = loadSessionEntry(key, { agentId: requestedAgentId });
				const activeIdentities = [
					canonicalKey,
					key,
					entry?.sessionId
				];
				if (isSessionWorkAdmissionActive(storePath, activeIdentities) || replyRunRegistry.isActive(canonicalKey) || replyRunRegistry.isActive(key) || hasVisibleActiveSessionRun({
					context,
					requestedKey: key,
					canonicalKey,
					sessionId: entry?.sessionId,
					defaultAgentId: resolveDefaultAgentId(cfg)
				})) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Cannot archive a session with an active run."));
					return null;
				}
			}
			return await applySessionPatchProjection({
				storePath,
				resolveTarget: ({ entries }) => {
					const store = Object.fromEntries(entries.map(({ sessionKey, entry }) => [sessionKey, entry]));
					const { target: migratedTarget, primaryKey } = migrateAndPruneGatewaySessionStoreKey({
						cfg,
						key,
						store,
						agentId: requestedAgentId
					});
					return {
						primaryKey,
						candidateKeys: migratedTarget.storeKeys
					};
				},
				project: async ({ primaryKey, existingEntry, entries }) => await projectSessionsPatchEntry({
					cfg,
					entries,
					existingEntry,
					storeKey: primaryKey,
					agentId: requestedAgentId,
					patch: p,
					loadGatewayModelCatalog: loadPatchModelCatalog
				})
			});
		};
		const applied = await runExclusiveSessionLifecycleMutation({
			scope: storePath,
			identities: lifecycleIdentities,
			run: applyPatch
		});
		if (!applied) return;
		if (!applied.ok) {
			respond(false, void 0, applied.error);
			return;
		}
		triggerSessionPatchHook({
			cfg,
			sessionEntry: applied.entry,
			sessionKey: target.canonicalKey ?? key,
			patch: p
		});
		const parsed = parseAgentSessionKey(target.canonicalKey ?? key);
		const agentId = normalizeAgentId(target.canonicalKey === "global" ? target.agentId : parsed?.agentId ?? resolveDefaultAgentId(cfg));
		const resolved = resolveSessionModelRef(cfg, applied.entry, agentId);
		const resolvedDisplayModel = resolveSessionDisplayModelIdentityRef({
			cfg,
			agentId,
			provider: resolved.provider,
			model: resolved.model
		});
		const thinkingProjection = resolveGatewaySessionThinkingProjection({
			cfg,
			agentId,
			provider: resolvedDisplayModel.provider ?? resolved.provider,
			model: resolvedDisplayModel.model ?? resolved.model,
			sessionKey: target.canonicalKey ?? key,
			entry: applied.entry,
			modelCatalog: patchModelCatalog
		});
		const resolvedThinkingMetadata = patchModelCatalog === void 0 ? {} : {
			thinkingLevel: thinkingProjection.effectiveThinkingLevel,
			thinkingLevels: thinkingProjection.thinkingLevels
		};
		respond(true, {
			ok: true,
			path: storePath,
			key: target.canonicalKey,
			entry: applied.entry,
			resolved: {
				modelProvider: resolvedDisplayModel.provider,
				model: resolvedDisplayModel.model,
				agentRuntime: thinkingProjection.agentRuntime,
				...resolvedThinkingMetadata
			}
		}, void 0);
		emitSessionsChanged(context, {
			sessionKey: target.canonicalKey,
			...target.canonicalKey === "global" && requestedAgentId ? { agentId: requestedAgentId } : {},
			reason: "patch"
		});
	},
	"sessions.pluginPatch": async ({ params, respond, context, client, isWebchatConnect }) => {
		if (!assertValidParams(params, validateSessionsPluginPatchParams, "sessions.pluginPatch", respond)) return;
		const key = requireSessionKey(params.key, respond);
		if (!key) return;
		if (rejectWebchatSessionMutation({
			action: "patch",
			client,
			isWebchatConnect,
			respond
		})) return;
		if (!(Array.isArray(client?.connect.scopes) ? client.connect.scopes : []).includes("operator.admin")) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `sessions.pluginPatch requires gateway scope: ${ADMIN_SCOPE}`));
			return;
		}
		const pluginId = normalizeOptionalString(params.pluginId);
		const namespace = normalizeOptionalString(params.namespace);
		if (!pluginId || !namespace) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "pluginId and namespace are required"));
			return;
		}
		if (params.unset === true && params.value !== void 0) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "sessions.pluginPatch cannot specify both unset and value"));
			return;
		}
		if (params.value !== void 0 && !isPluginJsonValue(params.value)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "sessions.pluginPatch value must be JSON-compatible"));
			return;
		}
		const patched = await patchPluginSessionExtension({
			cfg: context.getRuntimeConfig(),
			sessionKey: key,
			pluginId,
			namespace,
			value: params.value,
			unset: params.unset === true
		});
		if (!patched.ok) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, patched.error));
			return;
		}
		respond(true, {
			ok: true,
			key: patched.key,
			value: patched.value
		}, void 0);
		emitSessionsChanged(context, {
			sessionKey: patched.key,
			reason: "plugin-patch"
		});
	},
	"sessions.reset": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSessionsResetParams, "sessions.reset", respond)) return;
		const p = params;
		const key = requireSessionKey(p.key, respond);
		if (!key) return;
		const reason = p.reason === "new" ? "new" : "reset";
		const { performGatewaySessionReset } = await loadSessionsRuntimeModule();
		const result = await performGatewaySessionReset({
			key,
			...p.agentId ? { agentId: p.agentId } : {},
			reason,
			commandSource: "gateway:sessions.reset"
		});
		if (!result.ok) {
			respond(false, void 0, result.error);
			return;
		}
		respond(true, {
			ok: true,
			key: result.key,
			entry: result.entry
		}, void 0);
		emitSessionsChanged(context, {
			sessionKey: result.key,
			...result.key === "global" ? { agentId: result.agentId } : {},
			reason
		});
	},
	"sessions.delete": async ({ params, respond, client, isWebchatConnect, context }) => {
		if (!assertValidParams(params, validateSessionsDeleteParams, "sessions.delete", respond)) return;
		const p = params;
		const key = requireSessionKey(p.key, respond);
		if (!key) return;
		if (rejectWebchatSessionMutation({
			action: "delete",
			client,
			isWebchatConnect,
			respond
		})) return;
		const cfg = context.getRuntimeConfig();
		const requestedAgent = resolveRequestedSessionAgentId(cfg, key, p.agentId);
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const requestedAgentId = requestedAgent.agentId;
		const { target, storePath } = resolveGatewaySessionTargetFromKey(key, cfg, { agentId: requestedAgentId });
		const mainKey = resolveMainSessionKey(cfg);
		const isSelectedNonDefaultGlobal = target.canonicalKey === "global" && requestedAgentId !== void 0 && requestedAgentId !== resolveDefaultAgentId(cfg);
		if (target.canonicalKey === mainKey && !isSelectedNonDefaultGlobal) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Cannot delete the main session (${mainKey}).`));
			return;
		}
		const deleteTranscript = typeof p.deleteTranscript === "boolean" ? p.deleteTranscript : true;
		const { cleanupSessionBeforeMutation, emitGatewaySessionEndPluginHook, emitSessionUnboundLifecycleEvent } = await loadSessionsRuntimeModule();
		const initialDeleteEntry = loadSessionEntry(key, { agentId: requestedAgentId }).entry;
		if (p.archivedOnly === true && initialDeleteEntry?.archivedAt === void 0) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Session ${key} is not archived. Archive it first, then delete it.`));
			return;
		}
		const expectedSessionId = p.expectedSessionId?.trim();
		const expectedLifecycleRevision = p.expectedLifecycleRevision?.trim();
		const expectedSessionUpdatedAt = p.expectedSessionUpdatedAt;
		const expectedLifecycleRevisionMatches = (entry) => !expectedLifecycleRevision || entry?.lifecycleRevision === expectedLifecycleRevision;
		const expectedSessionIdMatches = (entry) => {
			if (!expectedSessionId || entry?.sessionId === expectedSessionId) return true;
			return entry?.sessionId === void 0 && expectedLifecycleRevision !== void 0 && expectedLifecycleRevisionMatches(entry);
		};
		const respondSessionChanged = () => {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Session ${key} changed before deletion. Retry.`, { details: { reason: SESSION_LIFECYCLE_CHANGED_ERROR_REASON } }));
		};
		const rejectExpectedSessionMismatch = (entry) => {
			const updatedAtMatches = expectedSessionUpdatedAt === void 0 || entry?.updatedAt === expectedSessionUpdatedAt;
			if (expectedLifecycleRevisionMatches(entry) && expectedSessionIdMatches(entry) && updatedAtMatches) return false;
			respondSessionChanged();
			return true;
		};
		if (rejectExpectedSessionMismatch(initialDeleteEntry)) return;
		if (rejectPluginRuntimeDeleteMismatch({
			client,
			key: target.canonicalKey ?? key,
			entry: initialDeleteEntry,
			respond
		})) return;
		const deleteLifecycleIdentities = [
			target.canonicalKey,
			key,
			initialDeleteEntry?.sessionId,
			expectedSessionId
		];
		let admittedWorkReleased = true;
		let expectedSessionStillCurrent = true;
		const deletion = await runExclusiveSessionLifecycleMutation({
			scope: storePath,
			identities: deleteLifecycleIdentities,
			prepare: async () => {
				expectedSessionStillCurrent = !rejectExpectedSessionMismatch(loadSessionEntry(key, { agentId: requestedAgentId }).entry);
				if (!expectedSessionStillCurrent) return;
				admittedWorkReleased = await interruptSessionWorkAdmissions({
					scope: storePath,
					identities: deleteLifecycleIdentities,
					timeoutMs: SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS
				});
			},
			run: async () => {
				if (!expectedSessionStillCurrent) return;
				if (!admittedWorkReleased) {
					respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `Session ${key} is still active; try again.`));
					return;
				}
				const { entry, legacyKey, canonicalKey } = loadSessionEntry(key, { agentId: requestedAgentId });
				if (rejectExpectedSessionMismatch(entry)) return;
				if (p.archivedOnly === true && entry?.archivedAt === void 0) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Session ${key} is not archived. Archive it first, then delete it.`));
					return;
				}
				if (rejectPluginRuntimeDeleteMismatch({
					client,
					key: canonicalKey ?? key,
					entry,
					respond
				})) return;
				const mutationCleanupError = await cleanupSessionBeforeMutation({
					cfg,
					key,
					target,
					entry,
					legacyKey,
					canonicalKey,
					reason: "session-delete"
				});
				if (mutationCleanupError) {
					respond(false, void 0, mutationCleanupError);
					return;
				}
				const postCleanupEntry = loadSessionEntry(key, { agentId: requestedAgentId }).entry;
				if (!expectedLifecycleRevisionMatches(postCleanupEntry) || !expectedSessionIdMatches(postCleanupEntry)) {
					respondSessionChanged();
					return;
				}
				const result = await deleteSessionEntryLifecycle({
					agentId: target.agentId,
					archiveTranscript: deleteTranscript,
					expectedEntry: postCleanupEntry,
					expectedLifecycleRevision,
					expectedSessionId,
					expectedUpdatedAt: postCleanupEntry?.updatedAt,
					storePath,
					target: {
						canonicalKey: target.canonicalKey,
						storeKeys: target.storeKeys
					}
				});
				if (result.expectedEntryMismatch) {
					respondSessionChanged();
					return;
				}
				if (result.deleted) {
					emitGatewaySessionEndPluginHook({
						cfg,
						sessionKey: target.canonicalKey ?? key,
						sessionId: result.deletedSessionId,
						storePath,
						sessionFile: result.deletedSessionFile,
						agentId: target.agentId,
						reason: "deleted",
						archivedTranscripts: result.archivedTranscripts
					});
					await emitSessionUnboundLifecycleEvent({
						targetSessionKey: target.canonicalKey ?? key,
						reason: "session-delete",
						emitHooks: p.emitLifecycleHooks !== false
					});
				}
				return result;
			}
		});
		if (!deletion) return;
		const deleted = deletion.deleted;
		const archived = deletion.archivedTranscripts.map((entryLocal) => entryLocal.archivedPath);
		if (deleted) try {
			const worktree = managedWorktrees.findLiveByOwner("session", target.canonicalKey);
			if (worktree) await managedWorktrees.removeIfLossless(worktree.id);
		} catch (error) {
			log.warn(`failed to clean up worktree for deleted session ${target.canonicalKey}: ${formatErrorMessage(error)}`);
		}
		respond(true, {
			ok: true,
			key: target.canonicalKey,
			deleted,
			archived
		}, void 0);
		if (deleted) emitSessionsChanged(context, {
			sessionKey: target.canonicalKey,
			...target.canonicalKey === "global" && requestedAgentId ? { agentId: requestedAgentId } : {},
			reason: "delete"
		});
	},
	"sessions.get": async ({ params, respond, context }) => {
		const p = params;
		const key = requireSessionKey(p.key ?? p.sessionKey, respond);
		if (!key) return;
		const limit = typeof p.limit === "number" && Number.isFinite(p.limit) ? Math.max(1, Math.floor(p.limit)) : 200;
		const cfg = context.getRuntimeConfig();
		const requestedAgent = resolveRequestedSessionAgentId(cfg, key, normalizeOptionalString(p.agentId));
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const { storePath, entry } = loadSessionEntriesForTarget({
			key,
			cfg,
			agentId: requestedAgent.agentId
		});
		if (!entry?.sessionId) {
			respond(true, { messages: [] }, void 0);
			return;
		}
		const { messages } = await readRecentSessionMessagesWithStatsAsync({
			agentId: requestedAgent.agentId,
			sessionEntry: entry,
			sessionId: entry.sessionId,
			sessionKey: key,
			storePath
		}, {
			maxMessages: limit,
			maxLines: limit * 20 + 20,
			allowResetArchiveFallback: true
		});
		respond(true, { messages }, void 0);
	},
	"sessions.compact": async ({ req, params, respond, context, client, isWebchatConnect }) => {
		if (!assertValidParams(params, validateSessionsCompactParams, "sessions.compact", respond)) return;
		const p = params;
		const key = requireSessionKey(p.key, respond);
		if (!key) return;
		if (rejectWebchatSessionMutation({
			action: "compact",
			client,
			isWebchatConnect,
			respond
		})) return;
		const maxLines = typeof p.maxLines === "number" && Number.isFinite(p.maxLines) ? Math.max(1, Math.floor(p.maxLines)) : void 0;
		const cfg = context.getRuntimeConfig();
		const requestedAgent = resolveRequestedSessionAgentId(cfg, key, p.agentId);
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const requestedAgentId = requestedAgent.agentId;
		const { target, storePath } = resolveGatewaySessionTargetFromKey(key, cfg, { agentId: requestedAgentId });
		let compactPrimaryKey = target.canonicalKey;
		const compactRead = await applySessionPatchProjection({
			storePath,
			resolveTarget: ({ entries }) => {
				const snapshot = Object.fromEntries(entries.map(({ sessionKey, entry }) => [sessionKey, entry]));
				const { target: migratedTarget, primaryKey } = migrateAndPruneGatewaySessionStoreKey({
					cfg,
					key,
					store: snapshot,
					agentId: requestedAgentId
				});
				compactPrimaryKey = primaryKey;
				return {
					primaryKey,
					candidateKeys: migratedTarget.storeKeys
				};
			},
			project: ({ existingEntry }) => existingEntry ? {
				ok: true,
				entry: existingEntry
			} : { ok: false }
		});
		const compactTarget = {
			entry: compactRead.ok ? compactRead.entry : void 0,
			primaryKey: compactPrimaryKey
		};
		const entry = compactTarget.entry;
		const sessionId = entry?.sessionId;
		if (!sessionId) {
			respond(true, {
				ok: true,
				key: target.canonicalKey,
				compacted: false,
				reason: "no sessionId"
			}, void 0);
			return;
		}
		if (maxLines !== void 0) {
			const trimPreflight = await preflightSessionTranscriptForManualCompact({
				sessionId,
				storePath,
				sessionKey: compactTarget.primaryKey,
				agentId: target.agentId
			}, {
				maxLines,
				sessionFile: entry.sessionFile
			});
			if (!trimPreflight.compacted) {
				respond(true, {
					ok: true,
					key: target.canonicalKey,
					compacted: false,
					..."kept" in trimPreflight ? { kept: trimPreflight.kept } : { reason: "no transcript" }
				}, void 0);
				return;
			}
		} else if (!resolveSessionTranscriptCandidates(sessionId, storePath, entry.sessionFile, target.agentId).find((candidate) => fs.existsSync(candidate))) {
			respond(true, {
				ok: true,
				key: target.canonicalKey,
				compacted: false,
				reason: "no transcript"
			}, void 0);
			return;
		}
		const lifecycleRevision = entry.lifecycleRevision;
		const lifecycleIdentities = [
			key,
			target.canonicalKey,
			compactTarget.primaryKey,
			sessionId,
			lifecycleRevision
		];
		let sessionStillCurrent = true;
		let admittedWorkReleased = true;
		try {
			await runExclusiveSessionLifecycleMutation({
				scope: storePath,
				identities: lifecycleIdentities,
				kind: "compaction",
				prepare: async () => {
					const latestEntry = loadSessionEntry(key, { agentId: requestedAgentId }).entry;
					sessionStillCurrent = Boolean(latestEntry && latestEntry.sessionId === sessionId && latestEntry.lifecycleRevision === lifecycleRevision && !resolveSessionWorkStartError(target.canonicalKey, latestEntry));
					if (!sessionStillCurrent) return;
					clearSessionQueues([
						key,
						target.canonicalKey,
						compactTarget.primaryKey,
						sessionId
					]);
					admittedWorkReleased = await interruptSessionWorkAdmissions({
						scope: storePath,
						identities: lifecycleIdentities,
						timeoutMs: SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS
					});
				},
				run: async () => {
					if (!sessionStillCurrent) {
						respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Session ${key} changed before compaction. Retry.`, { details: { reason: SESSION_LIFECYCLE_CHANGED_ERROR_REASON } }));
						return;
					}
					if (!admittedWorkReleased) {
						respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `Session ${key} is still active; try again.`));
						return;
					}
					const latestEntry = loadSessionEntry(key, { agentId: requestedAgentId }).entry;
					if (!latestEntry || latestEntry.sessionId !== sessionId || latestEntry.lifecycleRevision !== lifecycleRevision || resolveSessionWorkStartError(target.canonicalKey, latestEntry)) {
						respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Session ${key} changed before compaction. Retry.`, { details: { reason: SESSION_LIFECYCLE_CHANGED_ERROR_REASON } }));
						return;
					}
					const interruptResult = await interruptSessionRunIfActive({
						req,
						context,
						client,
						isWebchatConnect,
						requestedKey: key,
						canonicalKey: target.canonicalKey,
						agentId: requestedAgentId,
						sessionId
					});
					if (interruptResult.error) {
						respond(false, void 0, interruptResult.error);
						return;
					}
					if (maxLines !== void 0) {
						const trimResult = await trimSessionTranscriptForManualCompact({
							sessionId,
							storePath,
							sessionKey: compactTarget.primaryKey,
							agentId: target.agentId
						}, {
							maxLines,
							sessionFile: latestEntry.sessionFile
						});
						respond(true, {
							ok: true,
							key: target.canonicalKey,
							compacted: trimResult.compacted,
							...trimResult.compacted ? {
								archived: trimResult.archived,
								kept: trimResult.kept
							} : "kept" in trimResult ? { kept: trimResult.kept } : { reason: "no transcript" }
						}, void 0);
						if (trimResult.compacted) emitSessionsChanged(context, {
							sessionKey: target.canonicalKey,
							...target.canonicalKey === "global" && target.agentId ? { agentId: target.agentId } : {},
							reason: "compact",
							compacted: true
						});
						return;
					}
					const filePath = resolveSessionTranscriptCandidates(sessionId, storePath, latestEntry.sessionFile, target.agentId).find((candidate) => fs.existsSync(candidate));
					if (!filePath) {
						respond(true, {
							ok: true,
							key: target.canonicalKey,
							compacted: false,
							reason: "no transcript"
						}, void 0);
						return;
					}
					const resolvedModel = resolveSessionModelRef(cfg, latestEntry, target.agentId);
					const workspaceDir = resolveIngressWorkspaceOverrideForSpawnedRun({
						spawnedBy: latestEntry.spawnedBy,
						workspaceDir: latestEntry.spawnedWorkspaceDir
					}) ?? resolveAgentWorkspaceDir(cfg, target.agentId);
					const operationId = randomUUID();
					emitSessionOperation(context, {
						operationId,
						operation: "compact",
						phase: "start",
						sessionKey: target.canonicalKey,
						...target.canonicalKey === "global" && target.agentId ? { agentId: target.agentId } : {}
					});
					const emitCompactionEnd = (completed, reason) => emitSessionOperation(context, {
						operationId,
						operation: "compact",
						phase: "end",
						sessionKey: target.canonicalKey,
						...target.canonicalKey === "global" && target.agentId ? { agentId: target.agentId } : {},
						completed,
						reason
					});
					let result;
					try {
						result = await compactEmbeddedAgentSession({
							sessionId,
							sessionKey: target.canonicalKey,
							agentId: target.agentId,
							allowGatewaySubagentBinding: true,
							sessionFile: filePath,
							workspaceDir,
							cwd: normalizeOptionalString(latestEntry.spawnedCwd),
							config: cfg,
							provider: resolvedModel.provider,
							model: resolvedModel.model,
							authProfileId: latestEntry.authProfileOverride,
							agentHarnessId: latestEntry.agentHarnessId,
							thinkLevel: normalizeThinkLevel(latestEntry.thinkingLevel),
							reasoningLevel: normalizeReasoningLevel(latestEntry.reasoningLevel),
							bashElevated: {
								enabled: false,
								allowed: false,
								defaultLevel: "off"
							},
							trigger: "manual"
						});
					} catch (err) {
						emitCompactionEnd(false, formatErrorMessage(err));
						throw err;
					}
					if (result.ok && result.compacted) {
						let persisted;
						try {
							persisted = (await applySessionPatchProjection({
								storePath,
								resolveTarget: () => ({ primaryKey: compactTarget.primaryKey }),
								project: ({ existingEntry }) => {
									if (!existingEntry || existingEntry.sessionId !== sessionId || existingEntry.lifecycleRevision !== lifecycleRevision || resolveSessionWorkStartError(target.canonicalKey, existingEntry)) return { ok: false };
									const entryToUpdate = existingEntry;
									entryToUpdate.updatedAt = Date.now();
									entryToUpdate.compactionCount = Math.max(0, entryToUpdate.compactionCount ?? 0) + 1;
									if (result.result?.sessionId && result.result.sessionId !== entryToUpdate.sessionId) entryToUpdate.sessionId = result.result.sessionId;
									if (result.result?.sessionFile) entryToUpdate.sessionFile = result.result.sessionFile;
									delete entryToUpdate.inputTokens;
									delete entryToUpdate.outputTokens;
									delete entryToUpdate.contextBudgetStatus;
									if (typeof result.result?.tokensAfter === "number" && Number.isFinite(result.result.tokensAfter)) {
										entryToUpdate.totalTokens = result.result.tokensAfter;
										entryToUpdate.totalTokensFresh = true;
									} else {
										delete entryToUpdate.totalTokens;
										delete entryToUpdate.totalTokensFresh;
									}
									return {
										ok: true,
										entry: entryToUpdate
									};
								}
							})).ok;
						} catch (err) {
							emitCompactionEnd(false, formatErrorMessage(err));
							throw err;
						}
						if (!persisted) {
							const reason = `Session ${key} changed before compaction completed. Retry.`;
							emitCompactionEnd(false, reason);
							respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, reason, { details: { reason: SESSION_LIFECYCLE_CHANGED_ERROR_REASON } }));
							return;
						}
					}
					emitCompactionEnd(result.ok && result.compacted, result.reason);
					respond(true, {
						ok: result.ok,
						key: target.canonicalKey,
						compacted: result.compacted,
						reason: result.reason,
						result: result.result
					}, void 0);
					if (result.ok) emitSessionsChanged(context, {
						sessionKey: target.canonicalKey,
						...target.canonicalKey === "global" && target.agentId ? { agentId: target.agentId } : {},
						reason: "compact",
						compacted: result.compacted
					});
				}
			});
		} catch (err) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(err)));
		}
	}
};
//#endregion
export { sessionsHandlers };
