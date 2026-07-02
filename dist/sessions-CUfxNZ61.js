import { c as normalizeOptionalString, p as readStringValue, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { i as formatErrorMessage } from "./errors-DCRXIYSQ.js";
import "./agent-scope-CDZXADgT.js";
import { c as parseAgentSessionKey } from "./session-key-utils-C7uT9A4s.js";
import { b as toAgentStoreSessionKey, p as resolveAgentIdFromSessionKey, u as normalizeAgentId } from "./session-key-pTKRJb0m.js";
import { c as resolveDefaultAgentId, n as listAgentIds, o as resolveAgentWorkspaceDir } from "./agent-scope-config-C3ijpoNo.js";
import { l as measureDiagnosticsTimelineSpan, u as measureDiagnosticsTimelineSpanSync } from "./plugin-metadata-snapshot-Dp5LgxH6.js";
import { f as normalizeReasoningLevel, p as normalizeThinkLevel } from "./thinking-DxaN427I.js";
import { n as GATEWAY_CLIENT_IDS } from "./client-info-CcqJJIan.js";
import { t as ADMIN_SCOPE } from "./operator-scopes-CS3xdS-V.js";
import { g as patchPluginSessionExtension } from "./registry-yozg2pVI.js";
import { t as isPluginJsonValue } from "./host-hook-json-CRVrIqU9.js";
import { i as hasInternalHookListeners, m as triggerInternalHook, n as createInternalHookEvent } from "./internal-hooks-BGR46Oie.js";
import { i as resolveMainSessionKey, n as resolveAgentMainSessionKey } from "./main-session-DWI7gPJU.js";
import { _ as updateSessionStore, at as resolveStoredSessionKeyForAgentStore, it as resolveSessionStoreKey, ot as resolveStoredSessionOwnerAgentId, rt as resolveSessionStoreAgentId } from "./store-DJ7wx5_V.js";
import { t as listConfiguredSessionStoreAgentIds } from "./targets-7kfDzi_O.js";
import { M as trimSessionTranscriptForManualCompact, a as applySessionPatchProjection, d as deleteSessionEntryLifecycle, u as createSessionEntryWithTranscript, x as preflightSessionTranscriptForManualCompact } from "./session-accessor-Dx6KDG0K.js";
import { r as readAcpSessionMeta } from "./session-meta-SVmmuxkv.js";
import { S as waitForEmbeddedAgentRunEnd, n as abortEmbeddedAgentRun, s as isEmbeddedAgentRunActive } from "./runs-DXoQzrw0.js";
import { t as loadCombinedSessionStoreForGateway } from "./combined-store-gateway-OdNGpb-p.js";
import { i as serializeSessionCleanupResult, r as runSessionsCleanup } from "./sessions-gBZPP61K.js";
import { i as resolveSessionTranscriptCandidates } from "./session-transcript-files.fs-BJ1LyduE.js";
import { a as readSessionMessageCountAsync, c as readSessionPreviewItemsFromTranscript, n as readRecentSessionMessagesWithStatsAsync } from "./session-transcript-readers-B1Z-s_uS.js";
import { t as resolveModelAgentRuntimeMetadata } from "./agent-runtime-metadata-DjPe21q4.js";
import { _ as resolveGatewaySessionStoreTargetWithStore, b as resolveSessionModelRef, c as listSessionsFromStoreAsync, d as migrateAndPruneGatewaySessionStoreKey, g as resolveGatewaySessionStoreTarget, m as resolveFreshestSessionEntryFromStoreKeys, n as buildGatewaySessionRow, p as resolveDeletedAgentIdFromSessionKey, u as loadSessionEntry, v as resolveSessionDisplayModelIdentityRef } from "./session-utils-CWlrm3MP.js";
import { a as clearSessionQueues } from "./queue-DlJx-5Kf.js";
import { mn as errorShape, pn as ErrorCodes } from "./schema-Ctppm7Dp.js";
import { $t as validateSessionsMessagesUnsubscribeParams, Bt as validateSessionsCleanupParams, Gt as validateSessionsCompactionRestoreParams, Ht as validateSessionsCompactionBranchParams, Jt as validateSessionsDescribeParams, Kt as validateSessionsCreateParams, Qt as validateSessionsMessagesSubscribeParams, Ut as validateSessionsCompactionGetParams, Vt as validateSessionsCompactParams, Wt as validateSessionsCompactionListParams, Zt as validateSessionsListParams, an as validateSessionsSendParams, en as validateSessionsPatchParams, in as validateSessionsResolveParams, nn as validateSessionsPreviewParams, qt as validateSessionsDeleteParams, rn as validateSessionsResetParams, tn as validateSessionsPluginPatchParams, zt as validateSessionsAbortParams } from "./src-CSp7rUPX.js";
import { t as triggerSessionPatchHook } from "./session-patch-hooks-D_uq0IS4.js";
import { n as compactEmbeddedAgentSession } from "./embedded-agent-BewHxe-S.js";
import { d as getSessionCompactionCheckpoint, f as listSessionCompactionCheckpoints, u as createFileBackedCompactionCheckpointStore } from "./run-session-target-B3BxXQMM.js";
import { r as chatHandlers } from "./chat-xOFUeJ8e.js";
import { r as setGatewayDedupeEntry, t as emitSessionsChanged } from "./session-change-event-CX10OsX0.js";
import { t as loadOptionalServerMethodModelCatalog } from "./optional-model-catalog-lfLlMqV0.js";
import { n as hasTrackedActiveSessionRun } from "./session-event-payload-Bj2f4rz0.js";
import { t as resolveSessionKeyFromResolveParams } from "./sessions-resolve-BXg6t2VW.js";
import { t as reactivateCompletedSubagentSession } from "./session-subagent-reactivation-bFfmc6Bm.js";
import { n as resolveSessionKeyForRun } from "./server-session-key-CiNoL7u5.js";
import { t as assertValidParams } from "./validation-CGUihuqY.js";
import { n as projectSessionsPatchEntry, t as applySessionsPatchToStore } from "./sessions-patch-CLxtp0M1.js";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
//#region src/gateway/server-methods/sessions.ts
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
function inheritSessionRuntimeSelection(parentEntry) {
	if (!parentEntry) return {};
	return {
		...parentEntry.providerOverride ? { providerOverride: parentEntry.providerOverride } : {},
		...parentEntry.modelOverride ? { modelOverride: parentEntry.modelOverride } : {},
		...parentEntry.modelOverrideSource ? { modelOverrideSource: parentEntry.modelOverrideSource } : {},
		...parentEntry.agentRuntimeOverride ? { agentRuntimeOverride: parentEntry.agentRuntimeOverride } : {},
		...parentEntry.modelProvider ? { modelProvider: parentEntry.modelProvider } : {},
		...parentEntry.model ? { model: parentEntry.model } : {},
		...typeof parentEntry.contextTokens === "number" ? { contextTokens: parentEntry.contextTokens } : {},
		...parentEntry.thinkingLevel ? { thinkingLevel: parentEntry.thinkingLevel } : {},
		...parentEntry.fastMode !== void 0 ? { fastMode: parentEntry.fastMode } : {},
		...parentEntry.verboseLevel ? { verboseLevel: parentEntry.verboseLevel } : {},
		...parentEntry.traceLevel ? { traceLevel: parentEntry.traceLevel } : {},
		...parentEntry.reasoningLevel ? { reasoningLevel: parentEntry.reasoningLevel } : {},
		...parentEntry.elevatedLevel ? { elevatedLevel: parentEntry.elevatedLevel } : {},
		...parentEntry.authProfileOverride ? { authProfileOverride: parentEntry.authProfileOverride } : {},
		...parentEntry.authProfileOverrideSource ? { authProfileOverrideSource: parentEntry.authProfileOverrideSource } : {}
	};
}
let sessionsRuntimeModulePromise;
function loadSessionsRuntimeModule() {
	sessionsRuntimeModulePromise ??= import("./sessions.runtime.js");
	return sessionsRuntimeModulePromise;
}
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
function buildDashboardSessionKey(agentId) {
	return `agent:${agentId}:dashboard:${randomUUID()}`;
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
function resolveRequestedGlobalAgentId(cfg, key, explicitAgentId) {
	const canonicalKey = resolveSessionStoreKey({
		cfg,
		sessionKey: key
	});
	const parsed = parseAgentSessionKey(key);
	const requestedAgentId = normalizeOptionalString(explicitAgentId);
	if (requestedAgentId) {
		const agentId = normalizeAgentId(requestedAgentId);
		if (!listAgentIds(cfg).includes(agentId)) return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, `Unknown agent id "${explicitAgentId}"`)
		};
		if (parsed?.agentId && normalizeAgentId(parsed.agentId) !== agentId) return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, "session key agent does not match agentId")
		};
		if (canonicalKey !== "global") {
			if ((parsed?.agentId ? normalizeAgentId(parsed.agentId) : normalizeAgentId(resolveSessionStoreAgentId(cfg, canonicalKey))) !== agentId) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, "session key agent does not match agentId")
			};
		}
		return {
			ok: true,
			agentId
		};
	}
	if (!parsed?.agentId) return { ok: true };
	const inferredAgentId = normalizeAgentId(parsed.agentId);
	if (canonicalKey === "global" && !listAgentIds(cfg).includes(inferredAgentId)) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, `Unknown agent id "${parsed.agentId}"`)
	};
	return {
		ok: true,
		agentId: canonicalKey === "global" ? inferredAgentId : void 0
	};
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
	const requestedAgent = resolveRequestedGlobalAgentId(cfg, key, p.agentId);
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
	const rawIdempotencyKey = p.idempotencyKey;
	const idempotencyKey = typeof rawIdempotencyKey === "string" && rawIdempotencyKey.trim() ? rawIdempotencyKey.trim() : randomUUID();
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
		respond: (ok, payload, error, meta) => {
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
		},
		context: params.context,
		client: params.client,
		isWebchatConnect: params.isWebchatConnect
	});
	if (sendAcked) {
		if (shouldAttachPendingMessageSeq({
			payload: sendPayload,
			cached: sendCached
		})) await reactivateCompletedSubagentSession({
			sessionKey: canonicalKey,
			runId: startedRunId
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
				return result.sessions.map((session) => Object.assign({}, session, { hasActiveRun: hasTrackedActiveSessionRun({
					context,
					requestedKey: session.key,
					canonicalKey: session.key,
					...session.key === "global" && p.agentId ? { agentId: p.agentId } : {},
					defaultAgentId: resolveDefaultAgentId(cfg)
				}) }));
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
		const requestedAgent = resolveRequestedGlobalAgentId(cfg, key, p.agentId);
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
		const requestedAgent = resolveRequestedGlobalAgentId(cfg, key, p.agentId);
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
		const requestedAgent = resolveRequestedGlobalAgentId(context.getRuntimeConfig(), key, p.agentId);
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
		const requestedAgent = resolveRequestedGlobalAgentId(context.getRuntimeConfig(), key, p.agentId);
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
		const requestedKey = normalizeOptionalString(p.key);
		const agentId = normalizeAgentId(normalizeOptionalString(p.agentId) ?? resolveDefaultAgentId(cfg));
		if (requestedKey) {
			const requestedAgentId = parseAgentSessionKey(requestedKey)?.agentId;
			if (requestedAgentId && requestedAgentId !== agentId && normalizeOptionalString(p.agentId)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `sessions.create key agent (${requestedAgentId}) does not match agentId (${agentId})`));
				return;
			}
		}
		const parentSessionKey = normalizeOptionalString(p.parentSessionKey);
		let canonicalParentSessionKey;
		let parentSessionEntry;
		let parentSelectedAgentId;
		if (parentSessionKey) {
			if (resolveSessionStoreKey({
				cfg,
				sessionKey: parentSessionKey
			}) === "global") {
				const parentRequestedAgent = resolveRequestedGlobalAgentId(cfg, parentSessionKey, p.agentId);
				if (!parentRequestedAgent.ok) {
					respond(false, void 0, parentRequestedAgent.error);
					return;
				}
				parentSelectedAgentId = parentRequestedAgent.agentId;
			}
			const parent = loadSessionEntry(parentSessionKey, parentSelectedAgentId ? { agentId: parentSelectedAgentId } : void 0);
			if (!parent.entry?.sessionId) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown parent session: ${parentSessionKey}`));
				return;
			}
			canonicalParentSessionKey = parent.canonicalKey;
			parentSessionEntry = parent.entry;
		}
		if (canonicalParentSessionKey && p.emitCommandHooks === true && !requestedKey && !resolveOptionalInitialSessionMessage(p) && cfg.session?.dmScope === "main") {
			const parentMainKey = resolveAgentMainSessionKey({
				cfg,
				agentId: normalizeAgentId(parentSelectedAgentId ?? resolveAgentIdFromSessionKey(canonicalParentSessionKey) ?? resolveDefaultAgentId(cfg))
			});
			if (canonicalParentSessionKey === parentMainKey) {
				const { performGatewaySessionReset } = await loadSessionsRuntimeModule();
				const resetResult = await performGatewaySessionReset({
					key: canonicalParentSessionKey,
					...canonicalParentSessionKey === "global" && parentSelectedAgentId ? { agentId: parentSelectedAgentId } : {},
					reason: "new",
					commandSource: "webchat"
				});
				if (!resetResult.ok) {
					respond(false, void 0, resetResult.error);
					return;
				}
				respond(true, {
					ok: true,
					key: resetResult.key,
					sessionId: resetResult.entry.sessionId,
					entry: resetResult.entry,
					runStarted: false
				}, void 0);
				emitSessionsChanged(context, {
					sessionKey: resetResult.key,
					...resetResult.key === "global" ? { agentId: resetResult.agentId } : {},
					reason: "new"
				});
				return;
			}
		}
		if (canonicalParentSessionKey && p.emitCommandHooks === true) {
			const { entry: parentEntry } = loadSessionEntry(canonicalParentSessionKey, parentSelectedAgentId ? { agentId: parentSelectedAgentId } : void 0);
			const workspaceDir = resolveAgentWorkspaceDir(cfg, normalizeAgentId(parentSelectedAgentId ?? resolveAgentIdFromSessionKey(canonicalParentSessionKey) ?? resolveDefaultAgentId(cfg)));
			if (hasInternalHookListeners("command", "new")) await triggerInternalHook(createInternalHookEvent("command", "new", canonicalParentSessionKey, {
				sessionEntry: parentEntry,
				previousSessionEntry: parentEntry,
				commandSource: "webchat",
				cfg,
				workspaceDir
			}));
			const parentTarget = resolveGatewaySessionStoreTarget({
				cfg,
				key: canonicalParentSessionKey,
				...canonicalParentSessionKey === "global" && parentSelectedAgentId ? { agentId: parentSelectedAgentId } : {}
			});
			const { emitGatewayBeforeResetPluginHook } = await loadSessionsRuntimeModule();
			await emitGatewayBeforeResetPluginHook({
				cfg,
				key: canonicalParentSessionKey,
				target: parentTarget,
				storePath: parentTarget.storePath,
				entry: parentEntry,
				reason: "new"
			});
		}
		const loweredRequestedKey = normalizeOptionalLowercaseString(requestedKey);
		const target = resolveGatewaySessionStoreTarget({
			cfg,
			key: requestedKey ? loweredRequestedKey === "global" || loweredRequestedKey === "unknown" ? loweredRequestedKey : toAgentStoreSessionKey({
				agentId,
				requestKey: requestedKey,
				mainKey: cfg.session?.mainKey
			}) : buildDashboardSessionKey(agentId),
			agentId
		});
		const targetAgentId = target.agentId;
		const created = await createSessionEntryWithTranscript({
			agentId: targetAgentId,
			sessionKey: target.canonicalKey,
			storePath: target.storePath
		}, async ({ sessionEntries }) => {
			const patched = await applySessionsPatchToStore({
				cfg,
				store: sessionEntries,
				storeKey: target.canonicalKey,
				agentId: targetAgentId,
				patch: {
					key: target.canonicalKey,
					label: normalizeOptionalString(p.label),
					model: normalizeOptionalString(p.model)
				},
				loadGatewayModelCatalog: context.loadGatewayModelCatalog
			});
			if (!patched.ok || !canonicalParentSessionKey) return patched;
			const inheritedSelection = normalizeOptionalString(p.model) ? {} : inheritSessionRuntimeSelection(parentSessionEntry);
			const nextEntry = {
				...patched.entry,
				...inheritedSelection,
				parentSessionKey: canonicalParentSessionKey
			};
			return {
				...patched,
				entry: nextEntry
			};
		});
		if (!created.ok) {
			respond(false, void 0, created.phase === "transcript" ? errorShape(ErrorCodes.UNAVAILABLE, `failed to create session transcript: ${created.error}`) : created.error);
			return;
		}
		const createdEntry = created.entry;
		const initialMessage = resolveOptionalInitialSessionMessage(p);
		let runPayload;
		let runError;
		let runMeta;
		const messageSeq = initialMessage ? await readSessionMessageCountAsync({
			agentId: target.agentId,
			sessionEntry: createdEntry,
			sessionId: createdEntry.sessionId,
			sessionKey: target.canonicalKey,
			storePath: target.storePath
		}) + 1 : void 0;
		if (initialMessage) await chatHandlers["chat.send"]({
			req,
			params: {
				sessionKey: target.canonicalKey,
				...target.canonicalKey === "global" ? { agentId: target.agentId } : {},
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
		const runStarted = runPayload !== void 0 && shouldAttachPendingMessageSeq({
			payload: runPayload,
			cached: runMeta?.cached === true
		});
		respond(true, {
			ok: true,
			key: target.canonicalKey,
			sessionId: createdEntry.sessionId,
			entry: createdEntry,
			runStarted,
			...runPayload ? runPayload : {},
			...runStarted && typeof messageSeq === "number" ? { messageSeq } : {},
			...runError ? { runError } : {}
		}, void 0);
		emitSessionsChanged(context, {
			sessionKey: target.canonicalKey,
			...target.canonicalKey === "global" ? { agentId: target.agentId } : {},
			reason: "create"
		});
		if (runStarted) emitSessionsChanged(context, {
			sessionKey: target.canonicalKey,
			...target.canonicalKey === "global" ? { agentId: target.agentId } : {},
			reason: "send"
		});
		if (canonicalParentSessionKey && p.emitCommandHooks === true) {
			const { entry: parentEntry } = loadSessionEntry(canonicalParentSessionKey, parentSelectedAgentId ? { agentId: parentSelectedAgentId } : void 0);
			const parentTarget = resolveGatewaySessionStoreTarget({
				cfg,
				key: canonicalParentSessionKey,
				...canonicalParentSessionKey === "global" && parentSelectedAgentId ? { agentId: parentSelectedAgentId } : {}
			});
			const { emitGatewaySessionEndPluginHook, emitGatewaySessionStartPluginHook } = await loadSessionsRuntimeModule();
			emitGatewaySessionEndPluginHook({
				cfg,
				sessionKey: canonicalParentSessionKey,
				sessionId: parentEntry?.sessionId,
				storePath: parentTarget.storePath,
				sessionFile: parentEntry?.sessionFile,
				agentId: parentTarget.agentId,
				reason: "new",
				nextSessionId: createdEntry.sessionId,
				nextSessionKey: target.canonicalKey
			});
			emitGatewaySessionStartPluginHook({
				cfg,
				sessionKey: target.canonicalKey,
				sessionId: createdEntry.sessionId,
				resumedFrom: parentEntry?.sessionId,
				storePath: target.storePath,
				sessionFile: createdEntry.sessionFile,
				agentId: target.agentId
			});
		}
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
		const requestedAgent = resolveRequestedGlobalAgentId(context.getRuntimeConfig(), key, p.agentId);
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
		const requestedAgent = resolveRequestedGlobalAgentId(context.getRuntimeConfig(), key, p.agentId);
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
		const interruptResult = await interruptSessionRunIfActive({
			req,
			context,
			client,
			isWebchatConnect,
			requestedKey: key,
			canonicalKey,
			agentId: requestedAgent.agentId,
			sessionId: entry.sessionId
		});
		if (interruptResult.error) {
			respond(false, void 0, interruptResult.error);
			return;
		}
		const restoredSession = await compactionCheckpointStore.restoreCheckpointSession({
			storePath,
			sessionKey: canonicalKey,
			sessionStoreKey: legacyKey,
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
			sessionKey: canonicalKey,
			...canonicalKey === "global" && requestedAgent.agentId ? { agentId: requestedAgent.agentId } : {},
			reason: "checkpoint-restore"
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
		const requestedGlobalAgent = resolveRequestedGlobalAgentId(cfg, key, requestedParamAgentId ?? requestedRunAgentId);
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
		const requestedAgent = resolveRequestedGlobalAgentId(cfg, key, p.agentId);
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const requestedAgentId = requestedAgent.agentId;
		const { target, storePath } = resolveGatewaySessionTargetFromKey(key, cfg, { agentId: requestedAgentId });
		const applied = await applySessionPatchProjection({
			storePath,
			resolveTarget: ({ entries }) => {
				const { target: migratedTarget, primaryKey } = migrateAndPruneGatewaySessionStoreKey({
					cfg,
					key,
					store: Object.fromEntries(entries.map(({ sessionKey, entry }) => [sessionKey, entry])),
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
				loadGatewayModelCatalog: context.loadGatewayModelCatalog
			})
		});
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
		const acpMeta = readAcpSessionMeta({ sessionKey: target.canonicalKey ?? key });
		const agentRuntime = resolveModelAgentRuntimeMetadata({
			cfg,
			agentId,
			provider: resolvedDisplayModel.provider,
			model: resolvedDisplayModel.model,
			sessionKey: target.canonicalKey ?? key,
			acpRuntime: acpMeta != null,
			acpBackend: acpMeta?.backend
		});
		respond(true, {
			ok: true,
			path: storePath,
			key: target.canonicalKey,
			entry: applied.entry,
			resolved: {
				modelProvider: resolvedDisplayModel.provider,
				model: resolvedDisplayModel.model,
				agentRuntime
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
		const requestedAgent = resolveRequestedGlobalAgentId(cfg, key, p.agentId);
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
		const { entry, legacyKey, canonicalKey } = loadSessionEntry(key, { agentId: requestedAgentId });
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
		const deletion = await deleteSessionEntryLifecycle({
			agentId: target.agentId,
			archiveTranscript: deleteTranscript,
			storePath,
			target: {
				canonicalKey: target.canonicalKey,
				storeKeys: target.storeKeys
			}
		});
		const deleted = deletion.deleted;
		const sessionId = deletion.deletedSessionId;
		const sessionFile = deletion.deletedSessionFile;
		const archivedTranscripts = deletion.archivedTranscripts;
		const archived = archivedTranscripts.map((entryLocal) => entryLocal.archivedPath);
		if (deleted) {
			emitGatewaySessionEndPluginHook({
				cfg,
				sessionKey: target.canonicalKey ?? key,
				sessionId,
				storePath,
				sessionFile,
				agentId: target.agentId,
				reason: "deleted",
				archivedTranscripts
			});
			const emitLifecycleHooks = p.emitLifecycleHooks !== false;
			await emitSessionUnboundLifecycleEvent({
				targetSessionKey: target.canonicalKey ?? key,
				reason: "session-delete",
				emitHooks: emitLifecycleHooks
			});
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
		const requestedAgent = resolveRequestedGlobalAgentId(cfg, key, normalizeOptionalString(p.agentId));
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
		const requestedAgent = resolveRequestedGlobalAgentId(cfg, key, p.agentId);
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const requestedAgentId = requestedAgent.agentId;
		const { target, storePath } = resolveGatewaySessionTargetFromKey(key, cfg, { agentId: requestedAgentId });
		const compactTarget = await updateSessionStore(storePath, (store) => {
			const { entry, primaryKey } = migrateAndPruneGatewaySessionStoreKey({
				cfg,
				key,
				store,
				agentId: requestedAgentId
			});
			return {
				entry,
				primaryKey
			};
		});
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
		if (maxLines === void 0) {
			const filePath = resolveSessionTranscriptCandidates(sessionId, storePath, entry?.sessionFile, target.agentId).find((candidate) => fs.existsSync(candidate));
			if (!filePath) {
				respond(true, {
					ok: true,
					key: target.canonicalKey,
					compacted: false,
					reason: "no transcript"
				}, void 0);
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
			const resolvedModel = resolveSessionModelRef(cfg, entry, target.agentId);
			const workspaceDir = normalizeOptionalString(entry?.spawnedWorkspaceDir) || resolveAgentWorkspaceDir(cfg, target.agentId);
			const cwd = normalizeOptionalString(entry?.spawnedCwd);
			const operationId = randomUUID();
			emitSessionOperation(context, {
				operationId,
				operation: "compact",
				phase: "start",
				sessionKey: target.canonicalKey,
				...target.canonicalKey === "global" && target.agentId ? { agentId: target.agentId } : {}
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
					cwd,
					config: cfg,
					provider: resolvedModel.provider,
					model: resolvedModel.model,
					authProfileId: entry?.authProfileOverride,
					agentHarnessId: entry?.sessionId === sessionId ? entry.agentHarnessId : void 0,
					thinkLevel: normalizeThinkLevel(entry?.thinkingLevel),
					reasoningLevel: normalizeReasoningLevel(entry?.reasoningLevel),
					bashElevated: {
						enabled: false,
						allowed: false,
						defaultLevel: "off"
					},
					trigger: "manual"
				});
			} catch (err) {
				emitSessionOperation(context, {
					operationId,
					operation: "compact",
					phase: "end",
					sessionKey: target.canonicalKey,
					...target.canonicalKey === "global" && target.agentId ? { agentId: target.agentId } : {},
					completed: false,
					reason: formatErrorMessage(err)
				});
				throw err;
			}
			emitSessionOperation(context, {
				operationId,
				operation: "compact",
				phase: "end",
				sessionKey: target.canonicalKey,
				...target.canonicalKey === "global" && target.agentId ? { agentId: target.agentId } : {},
				completed: result.ok && result.compacted,
				reason: result.reason
			});
			if (result.ok && result.compacted) await updateSessionStore(storePath, (store) => {
				const entryToUpdate = store[compactTarget.primaryKey];
				if (!entryToUpdate) return;
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
			});
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
			return;
		}
		const trimPreflight = await preflightSessionTranscriptForManualCompact({
			sessionId,
			storePath,
			sessionKey: compactTarget.primaryKey,
			agentId: target.agentId
		}, {
			maxLines,
			sessionFile: entry?.sessionFile
		});
		if (!trimPreflight.compacted) {
			if ("kept" in trimPreflight) respond(true, {
				ok: true,
				key: target.canonicalKey,
				compacted: false,
				kept: trimPreflight.kept
			}, void 0);
			else respond(true, {
				ok: true,
				key: target.canonicalKey,
				compacted: false,
				reason: "no transcript"
			}, void 0);
			return;
		}
		const truncateInterrupt = await interruptSessionRunIfActive({
			req,
			context,
			client,
			isWebchatConnect,
			requestedKey: key,
			canonicalKey: target.canonicalKey,
			agentId: requestedAgentId,
			sessionId
		});
		if (truncateInterrupt.error) {
			respond(false, void 0, truncateInterrupt.error);
			return;
		}
		const trimResult = await trimSessionTranscriptForManualCompact({
			sessionId,
			storePath,
			sessionKey: compactTarget.primaryKey,
			agentId: target.agentId
		}, {
			maxLines,
			sessionFile: entry?.sessionFile
		});
		if (!trimResult.compacted) {
			if ("kept" in trimResult) respond(true, {
				ok: true,
				key: target.canonicalKey,
				compacted: false,
				kept: trimResult.kept
			}, void 0);
			else respond(true, {
				ok: true,
				key: target.canonicalKey,
				compacted: false,
				reason: "no transcript"
			}, void 0);
			return;
		}
		respond(true, {
			ok: true,
			key: target.canonicalKey,
			compacted: true,
			archived: trimResult.archived,
			kept: trimResult.kept
		}, void 0);
		emitSessionsChanged(context, {
			sessionKey: target.canonicalKey,
			...target.canonicalKey === "global" && target.agentId ? { agentId: target.agentId } : {},
			reason: "compact",
			compacted: true
		});
	}
};
//#endregion
export { sessionsHandlers };
