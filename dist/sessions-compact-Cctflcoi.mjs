import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { r as resolveCollapsedSessionAuthPinSource } from "./auth-profile-override-provenance-B84_9MMh.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { o as normalizeReasoningLevel, s as normalizeThinkLevel } from "./thinking.shared-BKzBCWpI.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { mi as validateSessionsCompactParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { x as isIndexedSessionEntry } from "./transcript-payload-qsg5dB6v.mjs";
import "./thinking-B1p5pEC8.mjs";
import { n as resolveManualCompactionCliTarget } from "./session-runtime-compat-DmCrQjUt.mjs";
import { f as selectSessionTranscriptTreePathNodes, l as scanSessionTranscriptTree } from "./transcript-tree-3xvvNd9-.mjs";
import { g as runExclusiveSessionLifecycleMutation, p as isCompetingSessionWorkAdmissionActive } from "./session-lifecycle-admission-Pys9TN37.mjs";
import { _ as projectCompactionAccountingPatch } from "./session-accessor.sqlite-transcript-write-Bk_2EeDT.mjs";
import { E as readTranscriptStatsSync, c as loadTranscriptEvents } from "./session-accessor.sqlite-read-BzN7WYll.mjs";
import { T as trimSessionTranscriptForManualCompact, w as preflightSessionTranscriptForManualCompact } from "./session-accessor-l-4ZHvKn.mjs";
import { a as tryResolveSessionCompatibilityOwnerAgentId, n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { f as applySessionPatchProjection } from "./session-accessor.reset-0gTJAhVB.mjs";
import { i as resolveSessionTranscriptRuntimeTarget } from "./session-accessor.transcript-target-w5-iuMeM.mjs";
import { l as recordSessionCompacted } from "./session-state-events-CMg59EpB.mjs";
import { a as getCommandLaneSnapshot } from "./command-queue-CaY517ob.mjs";
import "./sessions-DE4llkPV.mjs";
import { d as resolveSessionWorkStartError, t as SESSION_LIFECYCLE_CHANGED_ERROR_REASON } from "./lifecycle-WWQJH57y.mjs";
import { o as resolveCurrentSessionPrimaryConversation } from "./conversation-registry-BOo4ipKL.mjs";
import { n as resolveSessionModelRef } from "./session-model-ref-Z1HiwFXK.mjs";
import { o as resolveGatewaySessionStoreTargetWithStore } from "./session-utils-store-lookup-EioWBMfl.mjs";
import { o as resolveCanonicalGatewaySessionStoreKey } from "./session-utils-store-DDuAGjCc.mjs";
import { o as hasPendingFollowupQueueWork } from "./state-B1aZH2hx.mjs";
import { i as resolveVisibleActiveSessionRunState } from "./session-active-runs-KvOWXexj.mjs";
import "./session-utils-CJ7A982R.mjs";
import { s as preflightManualSessionCompaction } from "./resource-loader-Bla9QJ3Z.mjs";
import "./session-manager-codec-DW3_Rlj9.mjs";
import { t as resolveEmbeddedSessionLane } from "./lanes-CVttd5qX.mjs";
import { r as resolveIngressWorkspaceOverrideForSessionRun } from "./spawned-context-sV3cxQP9.mjs";
import { n as compactEmbeddedAgentSession } from "./embedded-agent-DGv6YF31.mjs";
import { r as emitSessionsChanged } from "./session-change-event-DF8JnIsM.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { i as loadAccessorSessionEntryForGatewayTarget, s as requireSessionKey, t as emitSessionOperation } from "./sessions-shared-DFVq928u.mjs";
import { t as asWorkerInferenceControl } from "./inference-control-CDvM08Nt.mjs";
import { randomUUID } from "node:crypto";
//#region src/gateway/server-methods/sessions-compaction-runner.ts
function usesLegacyOpenClawCompaction(params) {
	const resolvedModel = resolveSessionModelRef(params.cfg, params.entry, params.agentId);
	const persistedRuntime = resolveManualCompactionCliTarget({
		provider: resolvedModel.provider,
		entry: params.entry,
		cfg: params.cfg
	}).agentHarnessId;
	const contextEngine = params.cfg.plugins?.slots?.contextEngine?.trim();
	return (!persistedRuntime || persistedRuntime === "openclaw") && (!contextEngine || contextEngine === "legacy");
}
async function resolveGatewayCompactionTranscriptTarget(params) {
	return await resolveSessionTranscriptRuntimeTarget({
		agentId: params.agentId,
		sessionId: params.sessionId,
		sessionKey: params.sessionStoreKey,
		storePath: params.storePath
	});
}
/** Returns only definitive legacy-runtime no-op verdicts; other runtimes decide for themselves. */
async function preflightGatewaySessionCompaction(params) {
	if (!usesLegacyOpenClawCompaction(params)) return;
	try {
		const transcriptEvents = await loadTranscriptEvents({
			agentId: params.agentId,
			sessionId: params.sessionId,
			sessionKey: params.sessionStoreKey,
			storePath: params.storePath
		});
		const tree = scanSessionTranscriptTree(transcriptEvents);
		const branch = selectSessionTranscriptTreePathNodes(tree, tree.leafId).map((node) => node.entry).filter(isIndexedSessionEntry);
		const preflight = preflightManualSessionCompaction(branch, {
			enabled: true,
			reserveTokens: 0,
			keepRecentTokens: 0
		});
		return preflight.compactable ? void 0 : { reason: preflight.reason };
	} catch {
		return;
	}
}
async function runGatewaySessionCompaction(params, host) {
	const transcriptTarget = await resolveGatewayCompactionTranscriptTarget(params);
	const resolvedModel = resolveSessionModelRef(params.cfg, params.entry, params.agentId);
	const workspaceDir = resolveIngressWorkspaceOverrideForSessionRun({
		spawnedBy: params.entry.spawnedBy,
		workspaceDir: params.entry.spawnedWorkspaceDir,
		cwd: params.entry.spawnedCwd
	}) ?? resolveAgentWorkspaceDir(params.cfg, params.agentId);
	const compactionCliTarget = resolveManualCompactionCliTarget({
		provider: resolvedModel.provider,
		entry: params.entry,
		cfg: params.cfg
	});
	const primaryConversation = resolveCurrentSessionPrimaryConversation(transcriptTarget);
	return await compactEmbeddedAgentSession({
		contextEngineAgentId: params.agentId,
		runId: params.runId,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		sessionTarget: {
			agentId: params.agentId,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		},
		allowGatewaySubagentBinding: true,
		sessionFile: transcriptTarget.sessionKey,
		workspaceDir,
		cwd: normalizeOptionalString(params.entry.spawnedCwd),
		config: params.cfg,
		agentAccountId: params.entry.delivery?.kind === "external" ? params.entry.delivery.context?.accountId : void 0,
		conversationRoutePeerId: primaryConversation?.routeContext?.peerId,
		chatType: primaryConversation?.kind,
		provider: resolvedModel.provider,
		model: resolvedModel.model,
		authProfileId: compactionCliTarget.cliSessionBinding?.authProfileId ?? params.entry.authProfileOverride,
		authProfileIdSource: resolveCollapsedSessionAuthPinSource(params.entry),
		agentHarnessId: compactionCliTarget.agentHarnessId,
		cliSessionId: compactionCliTarget.cliSessionId,
		cliSessionBinding: compactionCliTarget.cliSessionBinding,
		sessionEntry: params.entry,
		modelSelectionLocked: params.entry.modelSelectionLocked === true,
		thinkLevel: normalizeThinkLevel(params.entry.thinkingLevel),
		reasoningLevel: normalizeReasoningLevel(params.entry.reasoningLevel),
		bashElevated: {
			enabled: false,
			allowed: false,
			defaultLevel: "off"
		},
		trigger: "manual"
	}, host);
}
//#endregion
//#region src/gateway/server-methods/sessions-compact.ts
const sessionCompactHandlers = { "sessions.compact": async ({ params, respond, context }) => {
	if (!assertValidParams(params, validateSessionsCompactParams, "sessions.compact", respond)) return;
	const p = params;
	const key = requireSessionKey(p.key, respond);
	if (!key) return;
	const maxLines = typeof p.maxLines === "number" && Number.isFinite(p.maxLines) ? Math.max(1, Math.floor(p.maxLines)) : void 0;
	const cfg = context.getRuntimeConfig();
	const requestedAgent = resolveRequestedSessionAgentId(cfg, key, p.agentId);
	if (!requestedAgent.ok) {
		respond(false, void 0, requestedAgent.error);
		return;
	}
	const requestedAgentId = requestedAgent.agentId;
	const compatibilityDefaultAgentId = tryResolveSessionCompatibilityOwnerAgentId(cfg, key);
	const target = resolveGatewaySessionStoreTargetWithStore({
		cfg,
		key,
		exactRead: true,
		...requestedAgentId ? { agentId: requestedAgentId } : {}
	});
	const storePath = target.storePath;
	let compactPrimaryKey = target.canonicalKey;
	const compactRead = await applySessionPatchProjection({
		agentId: target.agentId,
		sessionKeys: target.storeKeys,
		storePath,
		resolveTarget: ({ store }) => {
			const { target: migratedTarget, primaryKey } = resolveCanonicalGatewaySessionStoreKey({
				cfg,
				key,
				store,
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
		}, { maxLines });
		if (!trimPreflight.compacted) {
			respond(true, {
				ok: true,
				key: target.canonicalKey,
				compacted: false,
				..."kept" in trimPreflight ? { kept: trimPreflight.kept } : { reason: "no transcript" }
			}, void 0);
			return;
		}
	} else if (readTranscriptStatsSync({
		agentId: target.agentId,
		sessionId,
		sessionKey: compactTarget.primaryKey,
		storePath
	}).eventCount === 0) {
		respond(true, {
			ok: true,
			key: target.canonicalKey,
			compacted: false,
			reason: "no transcript"
		}, void 0);
		return;
	}
	const lifecycleRevision = entry.lifecycleRevision;
	const queueIdentities = [
		key,
		target.canonicalKey,
		compactTarget.primaryKey,
		sessionId
	];
	const lifecycleIdentities = [...queueIdentities, lifecycleRevision];
	let sessionStillCurrent = true;
	let compactionNoopReason;
	let blockedByActiveRun = false;
	let blockedByQueuedWork = false;
	try {
		await runExclusiveSessionLifecycleMutation({
			scope: storePath,
			identities: lifecycleIdentities,
			kind: "compaction",
			prepare: async () => {
				const latestEntry = loadAccessorSessionEntryForGatewayTarget({
					key,
					cfg,
					agentId: requestedAgentId
				}).entry;
				if (!latestEntry || latestEntry.sessionId !== sessionId || latestEntry.lifecycleRevision !== lifecycleRevision || resolveSessionWorkStartError(target.canonicalKey, latestEntry)) {
					sessionStillCurrent = false;
					return;
				}
				if (maxLines === void 0) {
					compactionNoopReason = (await preflightGatewaySessionCompaction({
						cfg,
						entry: latestEntry,
						agentId: target.agentId,
						sessionId,
						sessionKey: target.canonicalKey,
						sessionStoreKey: compactTarget.primaryKey,
						storePath
					}))?.reason;
					if (compactionNoopReason) return;
				}
				blockedByActiveRun = isCompetingSessionWorkAdmissionActive(storePath, lifecycleIdentities) || (asWorkerInferenceControl(context.workerEnvironmentService)?.hasInferenceForSession(sessionId) ?? false) || resolveVisibleActiveSessionRunState({
					context,
					requestedKey: key,
					canonicalKey: target.canonicalKey,
					sessionId,
					agentId: requestedAgentId,
					defaultAgentId: compatibilityDefaultAgentId
				}).active;
				blockedByQueuedWork = hasPendingFollowupQueueWork(queueIdentities) || queueIdentities.some((identity) => getCommandLaneSnapshot(resolveEmbeddedSessionLane(identity)).queuedCount > 0);
			},
			run: async () => {
				if (!sessionStillCurrent) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Session ${key} changed before compaction. Retry.`, { details: { reason: SESSION_LIFECYCLE_CHANGED_ERROR_REASON } }));
					return;
				}
				if (compactionNoopReason) {
					respond(true, {
						ok: false,
						key: target.canonicalKey,
						compacted: false,
						reason: compactionNoopReason
					}, void 0);
					return;
				}
				if (blockedByQueuedWork) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Session ${key} has queued work; retry after it finishes.`));
					return;
				}
				if (blockedByActiveRun) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Session ${key} has an active run; retry after it finishes.`));
					return;
				}
				const latestEntry = loadAccessorSessionEntryForGatewayTarget({
					key,
					cfg,
					agentId: requestedAgentId
				}).entry;
				if (!latestEntry || latestEntry.sessionId !== sessionId || latestEntry.lifecycleRevision !== lifecycleRevision || resolveSessionWorkStartError(target.canonicalKey, latestEntry)) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Session ${key} changed before compaction. Retry.`, { details: { reason: SESSION_LIFECYCLE_CHANGED_ERROR_REASON } }));
					return;
				}
				const operationId = randomUUID();
				if (maxLines !== void 0) {
					const trimResult = await trimSessionTranscriptForManualCompact({
						sessionId,
						storePath,
						sessionKey: compactTarget.primaryKey,
						agentId: target.agentId
					}, { maxLines });
					respond(true, {
						ok: true,
						key: target.canonicalKey,
						compacted: trimResult.compacted,
						...trimResult.compacted ? { kept: trimResult.kept } : "kept" in trimResult ? { kept: trimResult.kept } : { reason: "no transcript" }
					}, void 0);
					if (trimResult.compacted) {
						recordSessionCompacted({
							sessionKey: target.canonicalKey,
							operationId,
							sessionId,
							agentId: target.agentId ?? requestedAgentId
						});
						emitSessionsChanged(context, {
							sessionKey: target.canonicalKey,
							agentId: target.agentId,
							reason: "compact",
							compacted: true
						});
					}
					return;
				}
				if (readTranscriptStatsSync({
					agentId: target.agentId,
					sessionId,
					sessionKey: compactTarget.primaryKey,
					storePath
				}).eventCount === 0) {
					respond(true, {
						ok: true,
						key: target.canonicalKey,
						compacted: false,
						reason: "no transcript"
					}, void 0);
					return;
				}
				emitSessionOperation(context, {
					operationId,
					operation: "compact",
					phase: "start",
					sessionKey: target.canonicalKey,
					agentId: target.agentId
				});
				const emitCompactionEnd = (completed, reason) => emitSessionOperation(context, {
					operationId,
					operation: "compact",
					phase: "end",
					sessionKey: target.canonicalKey,
					agentId: target.agentId,
					completed,
					reason
				});
				let result;
				let expectedEntry = latestEntry;
				try {
					result = await runGatewaySessionCompaction({
						cfg,
						entry: latestEntry,
						runId: operationId,
						agentId: target.agentId,
						sessionId,
						sessionKey: target.canonicalKey,
						sessionStoreKey: compactTarget.primaryKey,
						storePath
					}, { onCommitted: (accepted) => {
						expectedEntry = accepted.entry;
					} });
				} catch (err) {
					emitCompactionEnd(false, formatErrorMessage(err));
					throw err;
				}
				if (result.ok && result.compacted) {
					let persisted;
					try {
						persisted = (await applySessionPatchProjection({
							agentId: target.agentId,
							sessionKeys: [compactTarget.primaryKey],
							storePath,
							resolveTarget: () => ({ primaryKey: compactTarget.primaryKey }),
							project: ({ existingEntry }) => {
								if (!existingEntry || existingEntry.sessionId !== expectedEntry.sessionId || existingEntry.lifecycleRevision !== expectedEntry.lifecycleRevision || existingEntry.activeWriterRunId !== expectedEntry.activeWriterRunId || resolveSessionWorkStartError(target.canonicalKey, existingEntry)) return { ok: false };
								return {
									ok: true,
									entry: {
										...existingEntry,
										...projectCompactionAccountingPatch(existingEntry, {
											compactionKind: result.compactionKind,
											tokensAfter: result.result?.tokensAfter
										})
									}
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
					recordSessionCompacted({
						sessionKey: target.canonicalKey,
						operationId,
						sessionId: expectedEntry.sessionId,
						agentId: target.agentId ?? requestedAgentId
					});
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
					agentId: target.agentId,
					reason: "compact",
					compacted: result.compacted
				});
			}
		});
	} catch (err) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(err)));
	}
} };
//#endregion
export { sessionCompactHandlers };
