import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { r as resolveCollapsedSessionAuthPinSource } from "./auth-profile-override-provenance-Jztnei-C.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { c as normalizeThinkLevel, s as normalizeReasoningLevel } from "./thinking.shared-Jy32Vp-O.mjs";
import { x as isIndexedSessionEntry } from "./transcript-payload-Yc_w8Yx5.mjs";
import { Ti as validateSessionsCompactParams } from "./src-l2dWvEsN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { n as captureGatewayOperatorRunAuthority } from "./operator-run-authority-BPRn5nuX.mjs";
import "./thinking-DK1cFezU.mjs";
import { n as resolveManualCompactionCliTarget } from "./session-runtime-compat-BI3cB4bq.mjs";
import { l as scanSessionTranscriptTree, p as selectSessionTranscriptTreePathNodes } from "./transcript-tree-CaYJo8Xs.mjs";
import { g as runExclusiveSessionLifecycleMutation, p as isCompetingSessionWorkAdmissionActive } from "./session-lifecycle-admission-GoxISURZ.mjs";
import { C as readTranscriptStatsSync } from "./session-accessor.sqlite-read-D4vZepQN.mjs";
import { c as trimSessionTranscriptForManualCompact, d as loadTranscriptEvents, s as preflightSessionTranscriptForManualCompact } from "./session-accessor-cUVSaeKy.mjs";
import { a as tryResolveSessionCompatibilityOwnerAgentId, n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { p as applySessionPatchProjection } from "./session-accessor.reset-DWr6djSD.mjs";
import { v as projectCompactionAccountingPatch } from "./session-accessor.sqlite-transcript-write-Kl-_Ewp0.mjs";
import { a as resolveSessionTranscriptRuntimeTarget } from "./session-accessor.transcript-target-CpxKGy_2.mjs";
import "./session-manager-codec-Dl5j6GJ-.mjs";
import { l as resolveCurrentSessionPrimaryConversation } from "./conversation-registry-CcMjrJ1T.mjs";
import { l as recordSessionCompacted } from "./session-state-events-B7wdeeGU.mjs";
import { o as getCommandLaneSnapshot } from "./command-queue-CFE60Avj.mjs";
import { o as resolveSessionWorkStartError, t as SESSION_LIFECYCLE_CHANGED_ERROR_REASON } from "./lifecycle-BH2MRg79.mjs";
import "./sessions-DNhLX2Ep.mjs";
import { n as resolveSessionModelRef } from "./session-model-ref-zMXEXgI3.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-CxCbIrod.mjs";
import { s as resolveGatewaySessionStoreTargetWithStore } from "./session-utils-store-lookup-D3SOcr8y.mjs";
import { c as hasPendingFollowupQueueWork } from "./state-C3aKakvf.mjs";
import { o as resolveCanonicalGatewaySessionStoreKey } from "./session-utils-store-BX-eWQU_.mjs";
import { i as resolveVisibleActiveSessionRunState } from "./session-active-runs-6vHANwv_.mjs";
import { r as resolveIngressWorkspaceOverrideForSessionRun } from "./spawned-context-BjFFoRwI.mjs";
import { n as resolveSessionLane } from "./lanes-DQO4OUmF.mjs";
import { s as preflightManualSessionCompaction } from "./resource-loader-IrNmCZ5j.mjs";
import { n as compactEmbeddedAgentSession } from "./embedded-agent-B_DdyEe2.mjs";
import "./session-utils-CwljFiKR.mjs";
import { r as emitSessionsChanged } from "./session-change-event-B7XNN_I7.mjs";
import { i as getWorkerInferenceSessionControl } from "./inference-control-internal-h8yXQYae.mjs";
import { t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { i as loadAccessorSessionEntryForGatewayTarget, o as requireSessionKey, t as emitSessionOperation } from "./sessions-shared-CHxhVZeL.mjs";
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
	const transcriptTarget = await resolveSessionTranscriptRuntimeTarget({
		agentId: params.agentId,
		sessionId: params.sessionId,
		sessionKey: params.sessionStoreKey,
		storePath: params.storePath
	});
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
	const primaryConversation = await resolveCurrentSessionPrimaryConversation(transcriptTarget);
	params.abortSignal?.throwIfAborted();
	return await compactEmbeddedAgentSession({
		abortSignal: params.abortSignal,
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
const sessionCompactHandlers = { "sessions.compact": async (options) => {
	const { params, respond, context, client, signal, hasCurrentClientAuthority } = options;
	const requestAuthority = readGatewayRequestMutationAuthority(options);
	if (!assertValidParams(params, validateSessionsCompactParams, "sessions.compact", respond)) return;
	const key = requireSessionKey(params.key, respond);
	if (!key) return;
	const maxLines = params.maxLines;
	const cfg = context.getRuntimeConfig();
	const requestedAgent = resolveRequestedSessionAgentId(cfg, key, params.agentId);
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
	let capturedOperator;
	const assertRequestCurrent = () => {
		requestAuthority.assertCurrent();
		capturedOperator?.authority.assertCurrent();
	};
	try {
		if (maxLines === void 0) capturedOperator = await captureGatewayOperatorRunAuthority({
			client,
			context,
			hasCurrentClientAuthority,
			invocationAuthority: {
				assertCurrent: requestAuthority.assertCurrent,
				signal
			}
		});
		const sourceSignal = capturedOperator?.authority.signal;
		const abortSignal = signal && sourceSignal ? AbortSignal.any([signal, sourceSignal]) : signal ?? sourceSignal;
		assertRequestCurrent();
		let compactPrimaryKey = target.canonicalKey;
		const compactRead = await applySessionPatchProjection({
			agentId: target.agentId,
			assertCurrent: assertRequestCurrent,
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
		const entry = compactRead.ok ? compactRead.entry : void 0;
		const sessionId = entry?.sessionId;
		const respondNotCompacted = (details) => {
			respond(true, {
				ok: true,
				key: target.canonicalKey,
				compacted: false,
				...details
			}, void 0);
		};
		if (!sessionId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Session ${key} not found. Run openclaw sessions list --json to choose a valid key.`));
			return;
		}
		const transcriptScope = {
			agentId: target.agentId,
			sessionId,
			sessionKey: compactPrimaryKey,
			storePath
		};
		if (maxLines !== void 0) {
			const trimPreflight = await preflightSessionTranscriptForManualCompact(transcriptScope, { maxLines });
			if (!trimPreflight.compacted) {
				respondNotCompacted("kept" in trimPreflight ? { kept: trimPreflight.kept } : { reason: "no transcript" });
				return;
			}
		} else if (readTranscriptStatsSync(transcriptScope).eventCount === 0) {
			respondNotCompacted({ reason: "no transcript" });
			return;
		}
		const lifecycleRevision = entry.lifecycleRevision;
		const readCurrentEntry = () => {
			const latest = loadAccessorSessionEntryForGatewayTarget({
				key,
				cfg,
				agentId: requestedAgentId
			}).entry;
			return latest && latest.sessionId === sessionId && latest.lifecycleRevision === lifecycleRevision && !resolveSessionWorkStartError(target.canonicalKey, latest) ? latest : void 0;
		};
		const queueIdentities = [
			key,
			target.canonicalKey,
			compactPrimaryKey,
			sessionId
		];
		const lifecycleIdentities = [...queueIdentities, lifecycleRevision];
		let sessionStillCurrent = true;
		let compactionNoopReason;
		let blockedByActiveRun = false;
		let blockedByQueuedWork = false;
		await runExclusiveSessionLifecycleMutation("compact", {
			scope: storePath,
			identities: lifecycleIdentities,
			kind: "compaction",
			signal: abortSignal,
			prepare: async () => {
				assertRequestCurrent();
				const latestEntry = readCurrentEntry();
				if (!latestEntry) {
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
						sessionStoreKey: compactPrimaryKey,
						storePath
					}))?.reason;
					if (compactionNoopReason) return;
				}
				blockedByActiveRun = isCompetingSessionWorkAdmissionActive(storePath, lifecycleIdentities) || (getWorkerInferenceSessionControl(context.workerEnvironmentService)?.hasSession(sessionId) ?? false) || resolveVisibleActiveSessionRunState({
					context,
					requestedKey: key,
					canonicalKey: target.canonicalKey,
					sessionId,
					agentId: requestedAgentId,
					defaultAgentId: compatibilityDefaultAgentId
				}).active;
				blockedByQueuedWork = hasPendingFollowupQueueWork(queueIdentities) || queueIdentities.some((identity) => getCommandLaneSnapshot(resolveSessionLane(identity)).queuedCount > 0);
			},
			run: async () => {
				assertRequestCurrent();
				if (!sessionStillCurrent) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Session ${key} changed before compaction. Retry.`, { details: { reason: SESSION_LIFECYCLE_CHANGED_ERROR_REASON } }));
					return;
				}
				if (compactionNoopReason) {
					respondNotCompacted({
						ok: false,
						reason: compactionNoopReason
					});
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
				const latestEntry = readCurrentEntry();
				if (!latestEntry) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Session ${key} changed before compaction. Retry.`, { details: { reason: SESSION_LIFECYCLE_CHANGED_ERROR_REASON } }));
					return;
				}
				const operationId = randomUUID();
				if (maxLines !== void 0) {
					const trimResult = await trimSessionTranscriptForManualCompact(transcriptScope, { maxLines });
					if (trimResult.compacted) await recordSessionCompacted({
						sessionKey: target.canonicalKey,
						operationId,
						sessionId,
						agentId: target.agentId ?? requestedAgentId
					});
					respond(true, {
						ok: true,
						key: target.canonicalKey,
						compacted: trimResult.compacted,
						..."kept" in trimResult ? { kept: trimResult.kept } : { reason: "no transcript" }
					}, void 0);
					if (trimResult.compacted) emitSessionsChanged(context, {
						sessionKey: target.canonicalKey,
						agentId: target.agentId,
						reason: "compact",
						compacted: true
					});
					return;
				}
				if (readTranscriptStatsSync(transcriptScope).eventCount === 0) {
					respondNotCompacted({ reason: "no transcript" });
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
				const assertActive = () => {
					assertRequestCurrent();
					abortSignal?.throwIfAborted();
				};
				try {
					result = await runGatewaySessionCompaction({
						cfg,
						entry: latestEntry,
						abortSignal,
						runId: operationId,
						agentId: target.agentId,
						sessionId,
						sessionKey: target.canonicalKey,
						sessionStoreKey: compactPrimaryKey,
						storePath
					}, {
						assertActive,
						sourceAuthority: {
							assertActive,
							operatorAuthority: capturedOperator?.authority
						},
						onCommitted: (accepted) => {
							expectedEntry = accepted.entry;
						}
					});
				} catch (err) {
					emitCompactionEnd(false, formatErrorMessage(err));
					throw err;
				}
				if (result.ok && result.compacted) {
					let persisted;
					try {
						persisted = (await applySessionPatchProjection({
							agentId: target.agentId,
							assertCurrent: assertActive,
							sessionKeys: [compactPrimaryKey],
							storePath,
							resolveTarget: () => ({ primaryKey: compactPrimaryKey }),
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
					await recordSessionCompacted({
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
	} finally {
		capturedOperator?.release();
	}
} };
//#endregion
export { sessionCompactHandlers };
