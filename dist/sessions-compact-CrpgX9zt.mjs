import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { Ng as errorShape, qi as validateSessionsCompactParams } from "./src-pLJQA6J5.mjs";
import { i as isIndexedSessionEntry } from "./session-entry-codec-DSMJ1XFN.mjs";
import { r as resolveCollapsedSessionAuthPinSource } from "./auth-profile-override-provenance-Jztnei-C.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { c as normalizeReasoningLevel, l as normalizeThinkLevel } from "./thinking.shared-Be8dhC75.mjs";
import { l as recordSessionCompacted } from "./session-state-events-BCzDVKh0.mjs";
import { a as resolveSessionWorkStartError, t as SESSION_LIFECYCLE_CHANGED_ERROR_REASON } from "./session-work-start-Sz_vqYld.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { l as scanSessionTranscriptTree, p as selectSessionTranscriptTreePathNodes } from "./transcript-tree-D61jhi_i.mjs";
import { s as isSessionWorkStartInvalidatedError } from "./work-start-error-BI-UhSB2.mjs";
import { i as readSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { f as readTranscriptStatsAsync, o as preflightSessionTranscriptForManualCompact, s as trimSessionTranscriptForManualCompact } from "./session-accessor-Czw4l8kI.mjs";
import { S as runExclusiveSessionLifecycleMutation, v as isCompetingSessionWorkAdmissionActive } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { r as resolveRequestedSessionAgentId, s as tryResolveSessionCompatibilityOwnerAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { t as applySessionEntryOperation } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { t as loadSessionTranscriptEvents } from "./session-transcript-events-BFcYGLfY.mjs";
import "./sessions-CnzPI1yx.mjs";
import { r as resolveGatewaySessionStoreTargetInWorker } from "./session-utils-store-worker-u3lCvEEg.mjs";
import { a as hasPreparedGatewayDeviceAuthority } from "./device-revocation-DpGQRUdo.mjs";
import "./thinking-BCNoGfZ5.mjs";
import { n as resolveManualCompactionCliTarget } from "./session-runtime-compat-BQN27lQg.mjs";
import { r as resolveSessionModelRef } from "./session-model-ref-BTkDCi12.mjs";
import { r as captureGatewayOperatorRunAuthority } from "./operator-run-authority-BcrXDfhQ.mjs";
import { l as hasPendingFollowupQueueWork } from "./state-DNPW_vEt.mjs";
import { i as resolveVisibleActiveSessionRunState } from "./session-active-runs-CAoWtmWT.mjs";
import { n as emitSessionsChanged } from "./session-change-event-0LxChmzi.mjs";
import { o as getCommandLaneSnapshot } from "./command-queue-Dvag6gVL.mjs";
import { t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { c as resolveCurrentSessionPrimaryConversation } from "./conversation-registry-DdNx9ZQ8.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-ClTdEKsf.mjs";
import { r as resolveIngressWorkspaceOverrideForSessionRun } from "./spawned-context-B5FDP6Bm.mjs";
import { n as resolveSessionLane } from "./lanes-DQO4OUmF.mjs";
import { l as preflightManualSessionCompaction } from "./settings-manager-D9ggLoN1.mjs";
import "./session-manager-codec-DTpe_z-3.mjs";
import { n as compactEmbeddedAgentSession } from "./embedded-agent-B8S-WtrO.mjs";
import "./session-utils-CGx9I2of.mjs";
import { i as getWorkerInferenceSessionControl } from "./inference-control-internal-Bk4Jd75M.mjs";
import { a as requireSessionKey, t as emitSessionOperation } from "./sessions-shared-DECO-QN2.mjs";
import { t as waitForTerminalSessionRunSettlement } from "./session-run-settlement-mY-e-9lD.mjs";
import { randomUUID } from "node:crypto";
//#region src/gateway/server-methods/sessions-compaction-runner.ts
/** Returns only definitive legacy-runtime no-op verdicts; other runtimes decide for themselves. */
async function preflightGatewaySessionCompaction(params) {
	const resolvedModel = resolveSessionModelRef(params.cfg, params.entry, params.agentId);
	const persistedRuntime = resolveManualCompactionCliTarget({
		provider: resolvedModel.provider,
		entry: params.entry,
		cfg: params.cfg
	}).agentHarnessId;
	const contextEngine = params.cfg.plugins?.slots?.contextEngine?.trim();
	if (persistedRuntime && persistedRuntime !== "openclaw" || contextEngine && contextEngine !== "legacy") return;
	try {
		const transcriptEvents = await loadSessionTranscriptEvents({
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
	const transcriptTarget = {
		agentId: params.agentId,
		sessionId: params.sessionId,
		sessionKey: params.sessionStoreKey,
		storePath: params.storePath
	};
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
		sessionTarget: transcriptTarget,
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
	const sessionChangedError = () => errorShape(ErrorCodes.INVALID_REQUEST, `Session ${key} changed before compaction. Retry.`, { details: { reason: SESSION_LIFECYCLE_CHANGED_ERROR_REASON } });
	const cfg = context.getRuntimeConfig();
	const requestedAgent = resolveRequestedSessionAgentId(cfg, key, params.agentId);
	if (!requestedAgent.ok) {
		respond(false, void 0, requestedAgent.error);
		return;
	}
	const requestedAgentId = requestedAgent.agentId;
	const compatibilityDefaultAgentId = tryResolveSessionCompatibilityOwnerAgentId(cfg, key);
	let capturedOperator;
	const assertRequestCurrent = () => {
		requestAuthority.assertCurrent();
		capturedOperator?.authority.assertCurrent();
	};
	try {
		const target = await resolveGatewaySessionStoreTargetInWorker({
			cfg,
			key,
			agentId: requestedAgentId,
			assertActive: assertRequestCurrent
		});
		const storePath = target.storePath;
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
		const compactPrimaryKey = target.canonicalKey;
		const entry = target.store[compactPrimaryKey];
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
			assertRequestCurrent();
			if (!trimPreflight.compacted) {
				respondNotCompacted("kept" in trimPreflight ? { kept: trimPreflight.kept } : { reason: "no transcript" });
				return;
			}
		}
		const lifecycleRevision = entry.lifecycleRevision;
		const readCurrentEntry = async () => {
			const latest = await readSessionEntryReadOnlyInWorker({
				...transcriptScope,
				readConsistency: "latest"
			}, assertRequestCurrent);
			assertRequestCurrent();
			return latest && latest.sessionId === sessionId && latest.lifecycleRevision === lifecycleRevision && !resolveSessionWorkStartError(target.canonicalKey, latest) ? latest : void 0;
		};
		const queueIdentities = [
			key,
			target.canonicalKey,
			compactPrimaryKey,
			sessionId
		];
		const lifecycleIdentities = [...queueIdentities, lifecycleRevision];
		let admissionError;
		let compactionNoopReason;
		let preparedEntry;
		let noTranscript = false;
		const terminalSettled = await waitForTerminalSessionRunSettlement({
			context,
			storePath,
			requestedKey: key,
			canonicalKey: target.canonicalKey,
			sessionId,
			agentId: requestedAgentId,
			defaultAgentId: compatibilityDefaultAgentId,
			signal: abortSignal
		});
		await runExclusiveSessionLifecycleMutation("compact", {
			scope: storePath,
			identities: lifecycleIdentities,
			kind: "compaction",
			signal: abortSignal,
			prepare: async () => {
				assertRequestCurrent();
				if (maxLines === void 0) {
					preparedEntry = await readCurrentEntry();
					if (!preparedEntry) {
						admissionError = sessionChangedError();
						return;
					}
					const transcriptStats = await readTranscriptStatsAsync(transcriptScope);
					assertRequestCurrent();
					noTranscript = transcriptStats.eventCount === 0;
					if (noTranscript) return;
					compactionNoopReason = (await preflightGatewaySessionCompaction({
						cfg,
						entry: preparedEntry,
						agentId: target.agentId,
						sessionId,
						sessionKey: target.canonicalKey,
						sessionStoreKey: compactPrimaryKey,
						storePath
					}))?.reason;
					if (compactionNoopReason) return;
				}
				const blockedByActiveRun = !terminalSettled || isCompetingSessionWorkAdmissionActive(storePath, lifecycleIdentities) || (getWorkerInferenceSessionControl(context.workerEnvironmentService)?.hasSession(sessionId) ?? false) || resolveVisibleActiveSessionRunState({
					context,
					requestedKey: key,
					canonicalKey: target.canonicalKey,
					sessionId,
					agentId: requestedAgentId,
					defaultAgentId: compatibilityDefaultAgentId
				}).active;
				const blockedByQueuedWork = hasPendingFollowupQueueWork(queueIdentities) || queueIdentities.some((identity) => getCommandLaneSnapshot(resolveSessionLane(identity)).queuedCount > 0);
				if (blockedByQueuedWork || blockedByActiveRun) admissionError = errorShape(ErrorCodes.INVALID_REQUEST, `Session ${key} has ${blockedByQueuedWork ? "queued work" : "an active run"}; retry after it finishes.`);
			},
			run: async () => {
				assertRequestCurrent();
				if (admissionError) {
					respond(false, void 0, admissionError);
					return;
				}
				if (noTranscript) {
					respondNotCompacted({ reason: "no transcript" });
					return;
				}
				if (compactionNoopReason) {
					respondNotCompacted({
						ok: false,
						reason: compactionNoopReason
					});
					return;
				}
				const operationId = randomUUID();
				const emitCompacted = (compacted) => emitSessionsChanged(context, {
					sessionKey: target.canonicalKey,
					agentId: target.agentId,
					reason: "compact",
					compacted
				});
				if (maxLines !== void 0) {
					const trimResult = await trimSessionTranscriptForManualCompact(transcriptScope, {
						maxLines,
						authority: {
							source: composeSessionSourceAssertion([requestAuthority.assertCurrent, options.sessionMutationAuthorization?.assertCurrent]),
							assertHostCurrent: () => {
								signal?.throwIfAborted();
								if (!hasPreparedGatewayDeviceAuthority(client, hasCurrentClientAuthority)) throw new Error("Gateway requester authority changed");
							},
							expectedLifecycleRevision: lifecycleRevision,
							expectedSource: target.capturedReadSource
						}
					});
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
					if (trimResult.compacted) emitCompacted(true);
					return;
				}
				const latestEntry = preparedEntry;
				if (!latestEntry) {
					respond(false, void 0, sessionChangedError());
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
				let persisted = false;
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
					if (result.ok && result.compacted) {
						const persistedEntry = await applySessionEntryOperation(transcriptScope, {
							kind: "compaction-accounting",
							expected: {
								sessionId: expectedEntry.sessionId,
								lifecycleRevision: expectedEntry.lifecycleRevision,
								activeWriterRunId: expectedEntry.activeWriterRunId
							},
							accounting: {
								compactionKind: result.compactionKind,
								tokensAfter: result.result?.tokensAfter,
								transcriptByteCompactionLatch: result.compactionKind === "native-harness" ? void 0 : null
							}
						}, {
							skipMaintenance: true,
							assertCommitAllowed: assertActive
						});
						persisted = persistedEntry !== null && persistedEntry.sessionId === expectedEntry.sessionId && persistedEntry.lifecycleRevision === expectedEntry.lifecycleRevision && persistedEntry.activeWriterRunId === expectedEntry.activeWriterRunId;
					}
				} catch (err) {
					emitCompactionEnd(false, formatErrorMessage(err));
					throw err;
				}
				if (result.ok && result.compacted) {
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
				if (result.ok) emitCompacted(result.compacted);
			}
		});
	} catch (err) {
		respond(false, void 0, maxLines !== void 0 && isSessionWorkStartInvalidatedError(err) ? sessionChangedError() : errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(err)));
	} finally {
		capturedOperator?.release();
	}
} };
//#endregion
export { sessionCompactHandlers };
