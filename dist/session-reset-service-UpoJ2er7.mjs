import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { s as raceWithTimeout } from "./src-Bzfi3cQM.mjs";
import { r as getInProcessGatewayRequestContext } from "./gateway-request-scope-1BXD1G3l.mjs";
import { f as readDatabasePathIdentitySync, r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { A as withTimeout } from "./fs-safe-6Z4UiMS4.mjs";
import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey, _ as toAgentStoreSessionKey, w as isSubagentSessionKey } from "./session-key-CSDERtm3.mjs";
import { l as getActivePluginRegistry } from "./runtime-DkPagH0y.mjs";
import { a as resolveAgentDir, f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { Ng as errorShape, Pg as missingScopeErrorShape } from "./src-pLJQA6J5.mjs";
import { w as runWithGatewayDetachedWorkContinuation } from "./gateway-work-admission-FWbk4b3p.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import "./io-DIF-KW3P.mjs";
import { X as createSessionResetBoundaryId, st as projectPublicSessionEntry } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { a as handleSessionStateSessionDeleted, o as handleSessionStateSessionReset } from "./session-state-events-BCzDVKh0.mjs";
import { a as resolveSessionWorkStartError, r as isRestartRecoveryTombstone, t as SESSION_LIFECYCLE_CHANGED_ERROR_REASON } from "./session-work-start-Sz_vqYld.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { l as resolveCreatorSandbox, n as authorizeGatewaySessionCreation } from "./operator-role-policy-Coro3qc5.mjs";
import { n as resolveCanonicalMainSessionKey } from "./main-session-key-BNNxukz6.mjs";
import { i as preserveSessionLineage, l as buildSessionCreationStamp, p as preserveCreationStamp } from "./session-entry-lineage-B7Mubzwj.mjs";
import { o as rebindCliSessionReseedReceiptsForReset, t as clearAllCliSessions } from "./cli-session-binding-Dx1VbkI8.mjs";
import { a as isModelSelectionLocked, n as MODEL_SELECTION_LOCKED_RESET_MESSAGE } from "./model-overrides-CgHG3YVT.mjs";
import { t as formatSqliteSessionFileMarker } from "./legacy-sqlite-marker-CkjJ0jcJ.mjs";
import { r as getSessionActorStorageBinding, s as withSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { l as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { S as runExclusiveSessionLifecycleMutation, _ as interruptSessionWorkAdmissions, g as hasOnlySessionLifecycleMutationKindActive, t as SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS, y as isSessionLifecycleMutationActive } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { r as unavailableSessionRequest, t as invalidSessionRequest } from "./session-request-error-qLiiFHUD.mjs";
import { i as resolveRequestedSessionAgentInput } from "./session-request-agent-ByGzV8Af.mjs";
import { o as resolveSessionStoreKey } from "./session-store-key-DKpto8R6.mjs";
import { m as resolveMissingAgentHarnessSessionError } from "./agent-harness-session-key-zbrcLVpT.mjs";
import { n as deleteSessionEntryLifecycle, r as resetSessionEntryLifecycle } from "./session-accessor.sqlite-lifecycle-7VGnaDT3.mjs";
import "./sessions-CnzPI1yx.mjs";
import { r as resolveGatewaySessionStoreTargetInWorker } from "./session-utils-store-worker-u3lCvEEg.mjs";
import { i as resetRegisteredAgentHarnessSessions } from "./registry-BDZ8eM01.mjs";
import { r as resolveSessionModelRef } from "./session-model-ref-BTkDCi12.mjs";
import { i as captureWorktreeRunEndContext } from "./run-end-lifecycle-DPl2TsZ4.mjs";
import { u as readRegistryWorktree } from "./registry-read-Do2Ks9un.mjs";
import { i as logVerbose } from "./globals-XVSoVbNQ.mjs";
import { n as getGlobalHookRunner } from "./hook-runner-global-yjqy4fXI.mjs";
import { i as clearFinishedSessionsForScopes } from "./bash-process-registry-D3AARAgk.mjs";
import { c as waitForEmbeddedAgentRunEnd, n as isEmbeddedAgentRunActive } from "./active-run-projections-Crpg2l0z.mjs";
import { n as abortEmbeddedAgentRun } from "./runs-Czr-I6_B.mjs";
import { n as clearBootstrapSnapshotOnSessionBoundary, t as clearBootstrapSnapshot } from "./bootstrap-cache-DPiLx4Sp.mjs";
import "./cli-session-CBCjrsL6.mjs";
import { d as resolveAcpSessionTarget } from "./manager.utils-L7wnnIwz.mjs";
import { t as getAcpRuntimeBackend } from "./registry-S4l3N3eT.mjs";
import { l as retireSessionMcpRuntime } from "./agent-bundle-mcp-manager-api-BF9Uyz8N.mjs";
import { n as acquireAgentRuntimeCleanupRegistries } from "./prepared-model-runtime-wDlPVSla.mjs";
import { c as isAcpOwnerRepairRequired, n as getAcpSessionManager, o as getAcpSessionResetControls, s as tryPrepareFreshManagerRuntimeSession } from "./manager-Cge77N9B.mjs";
import { r as readAcpSessionMetaAsync, s as commitAcpSessionMutation } from "./session-meta-read-C9RqVGp2.mjs";
import { i as upsertAcpSessionMeta, o as listAcpSessionEntries } from "./session-meta-DC-FqIqd.mjs";
import { t as getSessionBindingService } from "./session-binding-service-ByKk9LiJ.mjs";
import { n as createInternalHookEvent, u as triggerInternalHook } from "./internal-hooks-DNLQqCT3.mjs";
import { f as retireSessionWorkerPlacementBeforeMutation, l as readSessionWorkerPlacementAsync, u as resolveSessionWorkerPlacementMutationError } from "./session-placement-lifecycle-CAT_zN-p.mjs";
import { t as resolveResetPreservedSelection } from "./reset-preserved-selection-BUsSR2xu.mjs";
import "./agent-bundle-mcp-tools-CR5Vro5t.mjs";
import { i as resolveSessionTranscriptCandidates, o as resolveStableSessionEndTranscript } from "./session-transcript-files.fs-tRCRA3R9.mjs";
import { l as readSessionMessagesAsync } from "./session-transcript-readers-ChK_-oGN.mjs";
import { a as buildSessionStartHookPayload, f as createResetBoundaryTranscriptSource, i as buildSessionEndHookPayload, r as noteActiveSessionForShutdown, t as forgetActiveSessionForShutdown, u as createArchivedSessionTranscriptSource } from "./active-sessions-shutdown-tracker-BfdUDClC.mjs";
import { t as recordSessionCreated } from "./session-created-CHLwCn_J.mjs";
import { n as withGatewaySessionEntryReadOnly } from "./session-utils-read-lifetime-CQKtyavc.mjs";
import { t as createSessionDiffBaselineCaptureClaim } from "./session-diff-baseline-capture-6ejBT0Am.mjs";
import { a as stopSessionResetSubagents, i as prepareSessionResetCleanupGuard, r as clearSessionResetRuntimeState, t as SessionResetCleanupError } from "./session-reset-cleanup-u-ZRUSad.mjs";
import { t as cleanupBrowserSessionsForLifecycleEnd } from "./browser-lifecycle-cleanup-D3rGziAc.mjs";
import { n as hasSessionAutoResetListeners, r as isSessionAutoResetReason, t as emitSessionAutoResetHook } from "./session-auto-reset-CqDm4bvb.mjs";
import "./session-utils-CGx9I2of.mjs";
import { n as runPluginHostCleanup } from "./host-hook-cleanup-DX-4euxZ.mjs";
import { n as removeSessionWorktree, t as finalizeDetachedSessionWorktree } from "./session-worktree-lifecycle-BMwsFta4.mjs";
import { c as rollbackGatewaySessionPreparation, l as settleGatewaySessionLifecycleCommit } from "./session-lifecycle-preparation-CelOZMyq.mjs";
import { t as resolvePluginSessionOwnershipError } from "./session-plugin-ownership-D5Z0-DHb.mjs";
import { t as notifyGatewaySessionReset } from "./session-reset-notifications-DdbPPvrX.mjs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { cleanupSessionResources } from "@openclaw/ai/internal/runtime";
//#region src/acp/runtime/session-meta-reset.ts
/** Rebind a durable reset; Gateway incognito resets delete their session through the actor owner. */
async function rebindDurableAcpSessionMetaAfterReset(params) {
	const assertCallerCurrent = params.assertCurrent;
	const committedSource = params.context;
	committedSource.assertCurrent();
	assertCallerCurrent?.();
	const context = captureOpenClawStateWorkerContext({ env: committedSource.env });
	const source = {
		...committedSource.source,
		identity: readDatabasePathIdentitySync(committedSource.source.path)
	};
	const entry = structuredClone(params.entry);
	const assertCurrent = () => {
		committedSource.assertCurrent();
		assertCallerCurrent?.();
		context.admission.assertCurrent();
		assertExistingDatabaseIdentity(source.path, source.identity.key, source.identity.birthtime);
	};
	await commitAcpSessionMutation(context, {
		agentId: params.agentId,
		storageSessionKey: params.sessionKey,
		sessionKey: params.sessionKey,
		entry,
		updatedAt: entry.updatedAt,
		decision: {
			kind: "set",
			meta: structuredClone(params.meta)
		},
		source: {
			...source,
			kind: "reset"
		}
	}, assertCurrent);
}
//#endregion
//#region src/config/sessions/reset-preserved-presentation.ts
/** A logical conversation keeps its organization and display choices across reset. */
function preserveResetSessionPresentation(entry) {
	return {
		label: entry?.label,
		autoLabel: entry?.autoLabel,
		icon: entry?.icon,
		category: entry?.category,
		boardFace: entry?.boardFace,
		boardPresentation: entry?.boardPresentation,
		visibility: entry?.visibility,
		displayName: entry?.displayName,
		pinnedAt: entry?.pinnedAt,
		sidebarRoot: entry?.sidebarRoot
	};
}
//#endregion
//#region src/gateway/session-reset-acp.ts
const ACP_RUNTIME_CLEANUP_TIMEOUT_MS = 15e3;
async function runAcpCleanupStep(op) {
	return raceWithTimeout(() => op().then(() => ({ status: "ok" })).catch((error) => ({
		status: "error",
		error
	})), ACP_RUNTIME_CLEANUP_TIMEOUT_MS, () => ({ status: "timeout" }));
}
async function closeAcpRuntimeForSession(params) {
	params.assertCurrent?.();
	const readMeta = (sessionKey) => readAcpSessionMetaAsync({
		sessionKey,
		agentId: params.agentId,
		cfg: params.cfg,
		assertCurrent: params.assertCurrent
	});
	const sessionKeys = Array.from(new Set([params.sessionKey, ...params.fallbackSessionKeys ?? []].map((key) => typeof key === "string" ? key.trim() : "").filter(Boolean)));
	let acpMeta;
	let acpSessionKey = params.sessionKey;
	for (const sessionKey of sessionKeys) {
		acpMeta = await readMeta(sessionKey);
		params.assertCurrent?.();
		if (acpMeta) {
			acpSessionKey = sessionKey;
			break;
		}
	}
	if (!acpMeta) return;
	const acpManager = getAcpSessionManager();
	params.assertCurrent?.();
	const resetControls = getAcpSessionResetControls(acpManager);
	const ownership = resetControls.captureSessionRuntimeOwnership({
		cfg: params.cfg,
		sessionKey: acpSessionKey,
		agentId: params.agentId
	});
	try {
		const target = {
			cfg: params.cfg,
			sessionKey: acpSessionKey,
			agentId: params.agentId,
			reason: params.reason
		};
		for (const step of ["cancel", "runtime close"]) {
			params.assertCurrent?.();
			const outcome = await runAcpCleanupStep(async () => {
				if (step === "cancel") await acpManager.cancelSession(target);
				else await acpManager.closeSession({
					...target,
					discardPersistentState: true,
					requireAcpSession: false,
					allowBackendUnavailable: true
				});
			});
			params.assertCurrent?.();
			if (outcome.status === "timeout") {
				await resetControls.forceDiscardSessionRuntime({
					...target,
					isCurrent: ownership.isCurrent,
					assertCurrent: params.assertCurrent
				});
				params.assertCurrent?.();
				break;
			}
			if (outcome.status === "error") {
				if (isAcpOwnerRepairRequired(outcome.error)) return errorShape(ErrorCodes.UNAVAILABLE, String(outcome.error));
				logVerbose(`sessions.${params.reason}: ACP ${step} failed for ${params.sessionKey}: ${String(outcome.error)}`);
			}
		}
		if (params.reason === "session-delete") {
			params.assertCurrent?.();
			await upsertAcpSessionMeta({
				cfg: params.cfg,
				sessionKey: acpSessionKey,
				agentId: params.agentId,
				assertCommitAllowed: params.assertCurrent,
				mutate: () => null
			});
			params.assertCurrent?.();
		} else if (params.deferResetState) params.onDeferredResetState?.({
			sessionKey: acpSessionKey,
			meta: acpMeta
		});
		else {
			const latestMeta = await readMeta(acpSessionKey) ?? acpMeta;
			params.assertCurrent?.();
			if (!latestMeta.identity || latestMeta.identity.state !== "resolved" || !latestMeta.identity.acpxSessionId && !latestMeta.identity.agentSessionId) return;
			await tryPrepareFreshManagerRuntimeSession({
				deps: { getRuntimeBackend: getAcpRuntimeBackend },
				cfg: params.cfg,
				meta: latestMeta,
				...resolveAcpSessionTarget({
					cfg: params.cfg,
					sessionKey: acpSessionKey,
					agentId: params.agentId
				}),
				logPrefix: "sessions.session-reset"
			});
			params.assertCurrent?.();
			const now = Date.now();
			await upsertAcpSessionMeta({
				cfg: params.cfg,
				sessionKey: acpSessionKey,
				agentId: params.agentId,
				assertCommitAllowed: params.assertCurrent,
				mutate: (current) => {
					params.assertCurrent?.();
					return buildPendingAcpMeta(current ?? latestMeta, now);
				}
			});
			params.assertCurrent?.();
		}
		return;
	} finally {
		ownership.release();
	}
}
async function closeChildAcpRuntimesForParent(params) {
	let children;
	try {
		params.assertCurrent?.();
		children = (await listAcpSessionEntries({ cfg: params.cfg })).filter(({ entry, sessionKey }) => {
			if (!entry || entry.spawnedBy !== params.parentKey && entry.parentSessionKey !== params.parentKey) return false;
			const requesterAgentId = entry.createdVia === "spawn" && entry.createdActor?.type === "agent" ? entry.createdActor.id : parseAgentSessionKey(params.parentKey)?.agentId;
			try {
				if (!requesterAgentId) throw new Error("ACP parent ownership is not recorded for this unqualified key");
				return resolveAcpSessionTarget({
					cfg: params.cfg,
					sessionKey: params.parentKey,
					agentId: requesterAgentId
				}).agentId === params.parentAgentId;
			} catch (error) {
				logVerbose(`sessions.${params.reason}: retained ACP child ${sessionKey} because parent ownership could not be proven: ${String(error)}`);
				return false;
			}
		});
	} catch (error) {
		logVerbose(`sessions.${params.reason}: failed to enumerate sessions for child ACP cleanup: ${String(error)}`);
		return;
	}
	params.assertCurrent?.();
	await Promise.allSettled(children.map(({ sessionKey, agentId }) => closeAcpRuntimeForSession({
		cfg: params.cfg,
		sessionKey,
		agentId,
		reason: params.reason,
		assertCurrent: params.assertCurrent
	}).then((childError) => {
		if (childError) logVerbose(`sessions.${params.reason}: child ACP cleanup incomplete for ${sessionKey}`);
	})));
	params.assertCurrent?.();
}
function buildPendingAcpMeta(base, now) {
	const currentIdentity = base.identity;
	return {
		backend: base.backend,
		agent: base.agent,
		runtimeSessionName: base.runtimeSessionName,
		identity: {
			state: "pending",
			...currentIdentity?.acpxRecordId ? { acpxRecordId: currentIdentity.acpxRecordId } : {},
			source: currentIdentity ? currentIdentity.source : "ensure",
			lastUpdatedAt: now
		},
		mode: base.mode,
		...base.runtimeOptions ? { runtimeOptions: base.runtimeOptions } : {},
		...base.cwd ? { cwd: base.cwd } : {},
		state: "idle",
		lastActivityAt: now
	};
}
//#endregion
//#region src/gateway/session-reset-runtime-cleanup.ts
const mcpRunEndWatcherState = resolveGlobalSingleton(Symbol.for("openclaw.mcpRunEndWatchers"), () => ({
	cancellations: /* @__PURE__ */ new Map(),
	retirements: /* @__PURE__ */ new Set(),
	watchers: /* @__PURE__ */ new Map()
}), async (state) => {
	for (const cancel of state.cancellations.values()) cancel();
	await Promise.allSettled([...state.watchers.values(), ...state.retirements]);
	state.cancellations.clear();
	state.retirements.clear();
	state.watchers.clear();
});
const mcpRunEndWatchers = mcpRunEndWatcherState.watchers;
async function ensureSessionRuntimeCleanup(params) {
	try {
		var _usingCtx$2 = _usingCtx();
		let cleanup;
		try {
			cleanup = await prepareSessionResetCleanupGuard({
				agentId: params.target.agentId,
				storePath: params.target.storePath,
				sessionKey: params.target.canonicalKey,
				expectedSession: params.sessionId ? {
					sessionId: params.sessionId,
					lifecycleRevision: params.sessionLifecycleRevision
				} : void 0,
				assertCurrent: params.assertCurrent
			});
		} catch (error) {
			if (error instanceof SessionResetCleanupError) return errorShape(ErrorCodes.UNAVAILABLE, error.message);
			throw error;
		}
		const assertCurrent = cleanup.assertCurrent;
		_usingCtx$2.u({ [Symbol.dispose]: cleanup.release });
		const queueKeys = [
			...params.target.storeKeys,
			params.target.canonicalKey,
			params.sessionId
		].filter((key) => key !== void 0);
		const closeTrackedBrowserTabs = async () => {
			assertCurrent();
			await cleanupBrowserSessionsForLifecycleEnd({
				cfg: params.cfg,
				sessionKeys: [...queueKeys, params.key].map((requestKey) => toAgentStoreSessionKey({
					agentId: params.target.agentId,
					requestKey
				})),
				onWarn: (message) => logVerbose(message)
			});
			assertCurrent();
		};
		try {
			assertCurrent();
			await stopSessionResetSubagents({
				cfg: params.cfg,
				sessionKey: params.target.canonicalKey,
				agentId: params.target.agentId,
				assertCurrent
			});
		} catch (error) {
			if (error instanceof SessionResetCleanupError) return errorShape(ErrorCodes.UNAVAILABLE, error.message);
			throw error;
		}
		assertCurrent();
		clearFinishedSessionsForScopes([...queueKeys, params.key]);
		clearSessionResetRuntimeState(queueKeys, {
			activeReplySessionId: params.sessionId,
			agentId: params.target.agentId,
			sessionKey: params.target.canonicalKey,
			assertCurrent
		});
		if (!params.sessionId) {
			assertCurrent();
			clearBootstrapSnapshot(params.target.canonicalKey);
			await closeTrackedBrowserTabs();
			return;
		}
		const sessionId = params.sessionId;
		assertCurrent();
		const cleanupProviderResources = () => {
			try {
				cleanupSessionResources(sessionId);
			} catch (error) {
				logVerbose(`sessions cleanup: failed to dispose provider resources for ${sessionId}: ${String(error)}`);
			}
		};
		const retireMcpRuntime = async (retainAcrossReuse) => {
			await retireSessionMcpRuntime({
				sessionId,
				reason: "gateway-session-cleanup",
				preserveActiveLeases: true,
				retainAcrossReuse,
				onError: (error, retiredSessionId) => {
					logVerbose(`sessions cleanup: failed to dispose bundle MCP runtime for ${retiredSessionId}: ${String(error)}`);
				}
			});
		};
		const mcpRetirementWatcher = getOrCreatePromise(mcpRunEndWatchers, sessionId, async () => {
			let cancelWatcher = () => {};
			const cancelled = new Promise((resolve) => {
				cancelWatcher = () => resolve(false);
			});
			mcpRunEndWatcherState.cancellations.set(sessionId, cancelWatcher);
			try {
				while (await Promise.race([waitForEmbeddedAgentRunEnd(sessionId, null), cancelled])) {
					if (isEmbeddedAgentRunActive(sessionId)) continue;
					const retirement = retireMcpRuntime(false);
					mcpRunEndWatcherState.retirements.add(retirement);
					try {
						await retirement;
					} finally {
						mcpRunEndWatcherState.retirements.delete(retirement);
					}
					if (isEmbeddedAgentRunActive(sessionId)) continue;
					cleanupProviderResources();
					return;
				}
			} catch (error) {
				logVerbose(`sessions cleanup: failed to disarm deferred MCP retirement: ${String(error)}`);
			} finally {
				if (mcpRunEndWatcherState.cancellations.get(sessionId) === cancelWatcher) mcpRunEndWatcherState.cancellations.delete(sessionId);
			}
		}, { evictOnSettled: true });
		abortEmbeddedAgentRun(sessionId);
		await retireMcpRuntime(true);
		const ended = await waitForEmbeddedAgentRunEnd(sessionId, 15e3);
		assertCurrent();
		await retireMcpRuntime(!ended);
		assertCurrent();
		clearBootstrapSnapshot(params.target.canonicalKey);
		if (ended && !isEmbeddedAgentRunActive(sessionId)) {
			assertCurrent();
			mcpRunEndWatcherState.cancellations.get(sessionId)?.();
			await mcpRetirementWatcher;
			assertCurrent();
			cleanupProviderResources();
			await closeTrackedBrowserTabs();
			return;
		}
		return errorShape(ErrorCodes.UNAVAILABLE, `Session ${params.key} is still active; try again in a moment.`);
	} catch (_) {
		_usingCtx$2.e = _;
	} finally {
		_usingCtx$2.d();
	}
}
//#endregion
//#region src/gateway/session-lifecycle-cleanup.ts
async function resetSessionAgentHarnesses(params) {
	try {
		var _usingCtx$1 = _usingCtx();
		const { agentId, canonicalKey: sessionKey } = params.target;
		params.assertCurrent?.();
		const owners = _usingCtx$1.a(await acquireAgentRuntimeCleanupRegistries(resolveAgentDir(params.cfg, agentId)));
		params.assertCurrent?.();
		await resetRegisteredAgentHarnessSessions({
			agentId,
			sessionId: params.entry.sessionId,
			sessionKey,
			sessionFile: sessionKey,
			reason: params.reason
		}, owners.registries);
		params.assertCurrent?.();
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
async function emitSessionUnboundLifecycleEvent(params) {
	const targetKind = isSubagentSessionKey(params.targetSessionKey) ? "subagent" : "acp";
	await getSessionBindingService().unbind({
		targetSessionKey: params.targetSessionKey,
		reason: params.reason
	});
	if (params.emitHooks === false) return;
	const hookRunner = getGlobalHookRunner();
	if (!hookRunner?.hasHooks("subagent_ended")) return;
	await hookRunner.runSubagentEnded({
		targetSessionKey: params.targetSessionKey,
		targetKind,
		reason: params.reason,
		sendFarewell: true,
		outcome: params.reason === "session-reset" ? "reset" : "deleted"
	}, { childSessionKey: params.targetSessionKey });
}
async function cleanupSessionBeforeMutation(params) {
	const cleanupError = await ensureSessionRuntimeCleanup({
		cfg: params.cfg,
		key: params.key,
		target: params.target,
		sessionId: params.entry?.sessionId,
		sessionLifecycleRevision: params.entry?.lifecycleRevision,
		assertCurrent: params.assertCurrent
	});
	if (cleanupError) return cleanupError;
	await runPluginHostCleanup({
		cfg: params.cfg,
		registry: getActivePluginRegistry(),
		reason: params.reason === "session-reset" ? "reset" : "delete",
		sessionKey: params.target.canonicalKey,
		sessionStoreTargets: [params.target],
		shouldCleanup: () => {
			params.assertCurrent?.();
			return true;
		}
	});
	params.assertCurrent?.();
	const parentSessionKey = params.target.canonicalKey;
	const parentAcpError = await closeAcpRuntimeForSession({
		cfg: params.cfg,
		sessionKey: parentSessionKey,
		agentId: params.target.agentId,
		fallbackSessionKeys: [
			params.canonicalKey,
			params.legacyKey,
			params.key
		],
		reason: params.reason,
		assertCurrent: params.assertCurrent
	});
	params.assertCurrent?.();
	await closeChildAcpRuntimesForParent({
		cfg: params.cfg,
		parentKey: parentSessionKey,
		parentAgentId: params.target.agentId,
		reason: params.reason,
		assertCurrent: params.assertCurrent
	});
	params.assertCurrent?.();
	if (parentAcpError) return parentAcpError;
	if (params.entry?.sessionId) {
		await resetSessionAgentHarnesses({
			cfg: params.cfg,
			target: params.target,
			entry: params.entry,
			reason: params.reason === "session-reset" ? "reset" : "deleted",
			assertCurrent: params.assertCurrent
		});
		params.assertCurrent?.();
	}
}
//#endregion
//#region src/gateway/session-lifecycle-plugin-hooks.ts
function emitGatewaySessionEndPluginHook(params) {
	if (!params.sessionId) return;
	forgetActiveSessionForShutdown(params.sessionId);
	const hookRunner = getGlobalHookRunner();
	const shouldEmitAutoReset = isSessionAutoResetReason(params.reason) && hasSessionAutoResetListeners();
	const shouldEmitPluginHook = hookRunner?.hasHooks("session_end") === true;
	if (!shouldEmitAutoReset && !shouldEmitPluginHook) return;
	const archiveCandidates = new Set(resolveSessionTranscriptCandidates(params.sessionId, params.storePath, params.sessionFile, params.agentId).map((candidate) => path.resolve(candidate)));
	const endedArchive = params.archivedTranscripts?.find((archive) => archiveCandidates.has(path.resolve(archive.sourcePath)));
	const transcript = resolveStableSessionEndTranscript({
		sessionId: params.sessionId,
		storePath: params.storePath,
		sessionFile: params.sessionFile,
		agentId: params.agentId,
		archivedTranscripts: endedArchive ? [endedArchive] : params.archivedTranscripts
	});
	const hookParams = {
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		reason: params.reason,
		sessionFile: transcript.sessionFile,
		transcriptArchived: transcript.transcriptArchived,
		nextSessionId: params.nextSessionId,
		nextSessionKey: params.nextSessionKey
	};
	if (shouldEmitAutoReset) emitSessionAutoResetHook({
		cfg: params.cfg,
		...hookParams,
		workspaceDir: params.workspaceDir,
		storePath: params.storePath
	});
	if (!shouldEmitPluginHook || !hookRunner) return;
	const endedTranscript = params.endedTranscript ?? (params.reason === "deleted" ? endedArchive ? createArchivedSessionTranscriptSource({
		archivedPath: endedArchive.archivedPath,
		agentId: params.agentId,
		sessionId: params.sessionId,
		storePath: params.storePath
	}) : {
		available: false,
		reason: "archive-unavailable"
	} : params.reason === "new" ? {
		available: false,
		reason: "no-stable-cutoff"
	} : {
		available: false,
		reason: "unsupported-source"
	});
	const payload = buildSessionEndHookPayload({
		...hookParams,
		endedTranscript
	});
	runWithGatewayDetachedWorkContinuation(async () => {
		await hookRunner.runSessionEnd(payload.event, payload.context);
	}, "hooks:session-end").catch((err) => {
		logVerbose(`session_end hook failed: ${String(err)}`);
	});
}
function emitGatewaySessionStartPluginHook(params) {
	if (!params.sessionId) return;
	if (params.storePath) noteActiveSessionForShutdown({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		storePath: params.storePath,
		sessionFile: params.sessionFile,
		agentId: params.agentId
	});
	const hookRunner = getGlobalHookRunner();
	if (!hookRunner?.hasHooks("session_start")) return;
	const payload = buildSessionStartHookPayload({
		...params,
		sessionId: params.sessionId
	});
	runWithGatewayDetachedWorkContinuation(async () => {
		await hookRunner.runSessionStart(payload.event, payload.context);
	}, "hooks:session-start").catch((err) => {
		logVerbose(`session_start hook failed: ${String(err)}`);
	});
}
//#endregion
//#region src/gateway/session-reset-incognito.ts
async function deleteIncognitoSessionForReset(params) {
	const assertCurrent = params.commitGuard;
	return await withSessionActorStorage({
		...params,
		sessionKey: params.target.canonicalKey
	}, {
		lifetime: {
			assertCurrent,
			assertReadable: assertCurrent
		},
		authority: {
			assertCurrent,
			authorize() {}
		}
	}, () => deleteIncognitoSessionForResetInScope(params)) ?? unavailableSessionRequest(`Session ${params.key} changed before reset. Retry.`);
}
async function deleteIncognitoSessionForResetInScope(params) {
	const terminalDrain = getInProcessGatewayRequestContext()?.terminalSessions?.beginAgentSessionDrain({
		kind: "agent",
		agentSessionKey: params.target.canonicalKey,
		agentSessionId: params.entry.sessionId,
		agentId: params.agentId
	});
	try {
		if (terminalDrain) try {
			await withTimeout(terminalDrain.drained, SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS, "agent terminal lifecycle drain");
		} catch {
			return unavailableSessionRequest(`Session ${params.key} terminals are still active; try again in a moment.`);
		}
		await params.beforeDelete();
		const deleted = await deleteSessionEntryLifecycle({
			commitGuard: params.commitGuard,
			agentId: params.agentId,
			archiveTranscript: false,
			deleteDeliveryArtifacts: true,
			deleteTranscriptWithoutArchive: true,
			expectedSessionId: params.entry.sessionId,
			storePath: params.storePath,
			target: params.target
		});
		if (!deleted.deleted) return unavailableSessionRequest(`Session ${params.key} changed before reset. Retry.`);
		return {
			ok: true,
			value: { deletedSessionId: deleted.deletedSessionId }
		};
	} finally {
		terminalDrain?.release();
	}
}
//#endregion
//#region src/gateway/session-reset-target.ts
async function resolveSessionResetTarget(cfg, params) {
	const agentInput = resolveRequestedSessionAgentInput(params.key, params.agentId);
	if (!agentInput.ok) return agentInput;
	const explicitAgentId = agentInput.value;
	const parsedKey = parseAgentSessionKey(params.key);
	const inferredGlobalAgentId = !explicitAgentId && parsedKey && resolveSessionStoreKey({
		cfg,
		sessionKey: params.key
	}) === "global" ? normalizeAgentId(parsedKey.agentId) : void 0;
	const requestedAgentId = explicitAgentId ?? inferredGlobalAgentId;
	if (requestedAgentId && !listAgentIds(cfg).includes(requestedAgentId)) return invalidSessionRequest(`Unknown agent id: ${requestedAgentId}`);
	if (explicitAgentId && parsedKey?.agentId && normalizeAgentId(parsedKey.agentId) !== explicitAgentId) return invalidSessionRequest("session key agent does not match agentId");
	const lookup = {
		cfg,
		key: params.key,
		...requestedAgentId ? { agentId: requestedAgentId } : {}
	};
	const target = await resolveGatewaySessionStoreTargetInWorker(lookup);
	return {
		ok: true,
		cfg,
		target,
		storePath: target.storePath,
		requestedAgentId
	};
}
//#endregion
//#region src/gateway/session-reset-transcript.ts
async function readGatewayBeforeResetPluginHookMessages(params) {
	if (typeof params.sessionId !== "string" || params.sessionId.trim().length === 0) return [];
	try {
		return await readSessionMessagesAsync({
			agentId: params.agentId,
			sessionEntry: params.entry,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		}, {
			mode: "full",
			reason: "before_reset hook payload"
		});
	} catch (err) {
		logVerbose(`before_reset: failed to read session messages for ${params.sessionId}; firing hook with empty messages (${String(err)})`);
		return [];
	}
}
//#endregion
//#region src/gateway/session-reset-service.ts
async function emitGatewayBeforeResetPluginHook(params) {
	const hookRunner = getGlobalHookRunner();
	if (!hookRunner?.hasHooks("before_reset")) return;
	const sessionKey = params.target.canonicalKey;
	const sessionId = params.entry?.sessionId;
	const agentId = params.target.agentId;
	const sessionFile = sessionId ? formatSqliteSessionFileMarker({
		agentId,
		sessionId,
		storePath: params.storePath
	}) : void 0;
	const workspaceDir = resolveAgentWorkspaceDir(params.cfg, agentId);
	const messages = params.messages ?? await readGatewayBeforeResetPluginHookMessages({
		agentId,
		entry: params.entry,
		sessionId,
		sessionKey,
		storePath: params.storePath
	});
	hookRunner.runBeforeReset({
		sessionFile,
		messages,
		reason: params.reason
	}, {
		agentId,
		sessionKey,
		sessionId,
		workspaceDir
	}).catch((err) => {
		logVerbose(`before_reset hook failed: ${String(err)}`);
	});
}
async function performGatewaySessionReset(params) {
	const worktreeContext = captureWorktreeRunEndContext(process.env);
	const worktreeEnv = {
		...process.env,
		...worktreeContext.environment
	};
	const resetTarget = await resolveSessionResetTarget(readRuntimeConfig(), params);
	if (!resetTarget.ok) return resetTarget;
	const lookup = {
		cfg: resetTarget.cfg,
		key: params.key,
		agentId: resetTarget.requestedAgentId,
		excludeInternalEffects: true
	};
	const run = () => withGatewaySessionEntryReadOnly(lookup, async ({ entry }) => performPreparedGatewaySessionReset({
		params,
		resetTarget,
		worktreeContext,
		worktreeEnv,
		lookup,
		initialResetEntry: entry
	}));
	return await withSessionActorStorage({
		sessionKey: resetTarget.target.canonicalKey,
		agentId: resetTarget.target.agentId,
		storePath: resetTarget.storePath
	}, {
		lifetime: {
			assertCurrent() {},
			assertReadable() {}
		},
		authority: {
			assertCurrent() {},
			authorize() {}
		}
	}, run) ?? run();
}
async function performPreparedGatewaySessionReset({ params, resetTarget, worktreeContext, worktreeEnv, lookup, initialResetEntry }) {
	const memory = getSessionActorStorageBinding({
		sessionKey: resetTarget.target.canonicalKey,
		agentId: resetTarget.target.agentId,
		storePath: resetTarget.storePath
	});
	const authorizeResetCreation = () => authorizeGatewaySessionCreation({
		cfg: resetTarget.cfg,
		agentId: resetTarget.target.agentId,
		...params.operatorRoleActor ? { actor: params.operatorRoleActor } : { profileId: params.requestingOperatorProfileId }
	});
	const reportLifecycleCleanupError = (error) => {
		if (params.onLifecycleCleanupError) {
			params.onLifecycleCleanupError(error);
			return;
		}
		logVerbose(`session lifecycle resource cleanup failed: ${String(error)}`);
	};
	const assertReadAuthorized = () => {
		params.assertCurrent?.();
		params.assertAuthorizedInstance?.();
	};
	const loadResetSession = (assertReadCurrent) => withGatewaySessionEntryReadOnly(lookup, async (current) => {
		assertReadCurrent?.();
		return current;
	});
	const expectedSessionMatches = (entry) => params.expectedSessionId === void 0 || entry?.sessionId === params.expectedSessionId;
	const sessionChangedError = () => errorShape(ErrorCodes.INVALID_REQUEST, `Session ${params.key} changed before reset. Retry.`, { details: { reason: SESSION_LIFECYCLE_CHANGED_ERROR_REASON } });
	const resolveResetCreationError = (entry) => !expectedSessionMatches(entry) ? sessionChangedError() : !entry ? authorizeResetCreation() : void 0;
	const resolveResetOwnershipError = (entry, key = resetTarget.target.canonicalKey) => resolvePluginSessionOwnershipError({
		action: "reset",
		entry,
		key,
		pluginOwnerId: params.authorizedPluginId
	});
	const resolveResetHarnessError = (entry) => {
		const message = resolveMissingAgentHarnessSessionError(resetTarget.target.canonicalKey, entry);
		return message ? errorShape(ErrorCodes.INVALID_REQUEST, message) : void 0;
	};
	const resolveFastModeSelectionError = (entry) => {
		const selection = params.fastModeSelection;
		return entry && selection && selection.value !== entry.fastMode && !selection.allowExistingChange ? missingScopeErrorShape({
			missingScope: ADMIN_SCOPE,
			requiredScopes: [ADMIN_SCOPE]
		}) : void 0;
	};
	const resolveResetEntryAccessError = (entry, canonicalKey) => resolveFastModeSelectionError(entry) ?? resolveResetOwnershipError(entry, canonicalKey);
	const initialEntryError = resolveResetCreationError(initialResetEntry) ?? resolveResetOwnershipError(initialResetEntry) ?? resolveFastModeSelectionError(initialResetEntry) ?? resolveResetHarnessError(initialResetEntry);
	if (initialEntryError) return {
		ok: false,
		error: initialEntryError
	};
	if (isModelSelectionLocked(initialResetEntry)) return invalidSessionRequest(MODEL_SELECTION_LOCKED_RESET_MESSAGE);
	const workerPlacementContext = params.workerPlacementContext ?? (await import("./session-worker-placement-context-FjdsrOSQ.mjs")).resolveSessionWorkerPlacementContext();
	const resolveResetEntryStateError = (entry, canonicalKey) => {
		const placementError = resolveSessionWorkerPlacementMutationError({
			action: "reset",
			context: workerPlacementContext,
			key: params.key,
			sessionId: normalizeOptionalString(entry?.sessionId)
		});
		if (placementError) return errorShape(ErrorCodes.INVALID_REQUEST, placementError.message);
		const archivedSessionError = resolveSessionWorkStartError(canonicalKey, entry, {
			allowPendingWorkspace: true,
			allowRestartTombstoneReplacement: entry !== void 0 && isRestartRecoveryTombstone(entry) && (entry.archivedAt === void 0 || entry.archiveReason === "restart-recovery" && canonicalKey === resolveCanonicalMainSessionKey({
				agentId: resetTarget.target.agentId,
				mainKey: resetTarget.cfg.session?.mainKey,
				sessionScope: resetTarget.cfg.session?.scope
			}))
		});
		if (archivedSessionError) return errorShape(ErrorCodes.INVALID_REQUEST, archivedSessionError);
		if (isModelSelectionLocked(entry)) return errorShape(ErrorCodes.INVALID_REQUEST, MODEL_SELECTION_LOCKED_RESET_MESSAGE);
		if (!entry && isIncognitoSessionKey(resetTarget.target.canonicalKey)) return errorShape(ErrorCodes.INVALID_REQUEST, `unknown session: ${params.key}`);
	};
	const resetLifecycleIdentities = [
		resetTarget.target.canonicalKey,
		params.key,
		initialResetEntry?.sessionId
	];
	const activeLifecycleMutation = isSessionLifecycleMutationActive(resetTarget.storePath, resetLifecycleIdentities);
	const activeCompaction = hasOnlySessionLifecycleMutationKindActive(resetTarget.storePath, resetLifecycleIdentities, "compaction");
	if (activeLifecycleMutation && !activeCompaction) return unavailableSessionRequest(`Session ${params.key} has another lifecycle mutation in progress; try again.`);
	let admittedWorkReleased = true;
	let resetPreparationError;
	let preparedResetSessionId;
	let preparedLifecycle;
	let lifecyclePreparationCommitted = false;
	return await runExclusiveSessionLifecycleMutation("reset", {
		scope: resetTarget.storePath,
		identities: resetLifecycleIdentities,
		prepare: async () => {
			assertReadAuthorized();
			const { entry: currentEntry, canonicalKey: currentCanonicalKey } = await loadResetSession(assertReadAuthorized);
			await readSessionWorkerPlacementAsync({
				context: workerPlacementContext,
				sessionId: normalizeOptionalString(currentEntry?.sessionId)
			});
			resetPreparationError = resolveResetCreationError(currentEntry) ?? resolveResetEntryAccessError(currentEntry, resetTarget.target.canonicalKey) ?? resolveResetHarnessError(currentEntry) ?? resolveResetEntryStateError(currentEntry, currentCanonicalKey);
			if (resetPreparationError) return;
			preparedResetSessionId = normalizeOptionalString(currentEntry?.sessionId);
			admittedWorkReleased = await interruptSessionWorkAdmissions({
				scope: resetTarget.storePath,
				identities: resetLifecycleIdentities,
				timeoutMs: SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS
			});
			if (admittedWorkReleased && params.prepareLifecycle) {
				const prepared = await params.prepareLifecycle({
					agentId: resetTarget.target.agentId,
					entry: currentEntry,
					key: resetTarget.target.canonicalKey,
					storePath: resetTarget.storePath
				});
				if (!prepared.ok) {
					resetPreparationError = prepared.error;
					return;
				}
				preparedLifecycle = prepared.value;
			}
		},
		run: async () => {
			const { cfg, target, storePath } = resetTarget;
			if (resetPreparationError) return {
				ok: false,
				error: resetPreparationError
			};
			if (!admittedWorkReleased) return unavailableSessionRequest(`Session ${params.key} is still active; try again in a moment.`);
			params.assertCurrent?.();
			params.assertAuthorizedInstance?.();
			const { entry, legacyKey, canonicalKey } = await loadResetSession(assertReadAuthorized);
			if (!memory && normalizeOptionalString(entry?.sessionId) !== preparedResetSessionId) return params.expectedSessionId === void 0 ? unavailableSessionRequest(`Session ${params.key} changed before reset. Retry.`) : {
				ok: false,
				error: sessionChangedError()
			};
			const entryStateError = resolveResetEntryAccessError(entry, canonicalKey) ?? resolveResetEntryStateError(entry, canonicalKey);
			if (entryStateError) return {
				ok: false,
				error: entryStateError
			};
			const incognito = entry?.incognito === true || isIncognitoSessionKey(target.canonicalKey);
			const placementRetirementError = await retireSessionWorkerPlacementBeforeMutation({
				action: "reset",
				context: workerPlacementContext,
				key: params.key,
				sessionId: normalizeOptionalString(entry?.sessionId),
				assertCurrent: assertReadAuthorized
			});
			if (placementRetirementError) return invalidSessionRequest(placementRetirementError.message);
			if (entry?.worktree?.id) {
				const record = await readRegistryWorktree(worktreeContext, entry.worktree.id);
				params.assertCurrent?.();
				if (record && record.removedAt === void 0) {
					const { withSettledLocalWorkspace } = await import("./local-workspace-projection-B04UXZLe.mjs");
					await withSettledLocalWorkspace({
						worktree: record,
						env: worktreeEnv,
						assertCurrent: params.assertCurrent,
						retireRuntime: true
					}, async () => {});
				}
			}
			const hadExistingEntry = Boolean(entry);
			const detachedWorktreeId = params.clearSpawnedCwd ? normalizeOptionalString(entry?.worktree?.id) : void 0;
			const resetLifecycleRevision = entry?.lifecycleRevision;
			const agentId = target.agentId;
			const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
			const resetPluginRegistry = getActivePluginRegistry();
			const isResetLifecycleCurrent = () => {
				try {
					params.assertCurrent?.();
					return true;
				} catch {
					return false;
				}
			};
			let deferredAcpResetState;
			const hookEvent = createInternalHookEvent("command", params.reason, target.canonicalKey, {
				agentId,
				sessionEntry: entry,
				previousSessionEntry: entry,
				commandSource: params.commandSource,
				cfg,
				storePath,
				workspaceDir
			});
			await triggerInternalHook(hookEvent);
			params.assertCurrent?.();
			params.assertAuthorizedInstance?.();
			const assertCompletionAuthorized = hadExistingEntry ? void 0 : () => {
				params.assertCurrent?.();
				params.assertAuthorizedInstance?.();
			};
			const runtimeCleanupError = await ensureSessionRuntimeCleanup({
				cfg,
				key: params.key,
				target,
				sessionId: entry?.sessionId,
				sessionLifecycleRevision: resetLifecycleRevision
			});
			if (runtimeCleanupError) return {
				ok: false,
				error: runtimeCleanupError
			};
			const parentSessionKey = target.canonicalKey;
			const parentAcpError = await closeAcpRuntimeForSession({
				cfg,
				sessionKey: parentSessionKey,
				agentId: target.agentId,
				fallbackSessionKeys: [
					canonicalKey,
					legacyKey,
					params.key
				],
				reason: "session-reset",
				deferResetState: true,
				onDeferredResetState: (state) => {
					deferredAcpResetState = state;
				}
			});
			if (parentAcpError) return {
				ok: false,
				error: parentAcpError
			};
			await runPluginHostCleanup({
				cfg,
				registry: resetPluginRegistry,
				reason: "reset",
				sessionKey: target.canonicalKey,
				skipPersistentSessionState: true
			});
			await closeChildAcpRuntimesForParent({
				cfg,
				parentKey: parentSessionKey,
				parentAgentId: target.agentId,
				reason: "session-reset"
			});
			if (entry?.sessionId) await resetSessionAgentHarnesses({
				cfg,
				target,
				entry,
				reason: "reset"
			});
			const beforeResetMessages = getGlobalHookRunner()?.hasHooks("before_reset") ? await readGatewayBeforeResetPluginHookMessages({
				agentId,
				entry,
				sessionId: entry?.sessionId,
				sessionKey: target.canonicalKey,
				storePath
			}) : void 0;
			const { prepareSubagentSessionCleanupRevocation, SubagentSessionCleanupRevocationChangedError } = await import("./subagent-registry-BSZR34Tv.mjs");
			let validateCleanupRevocation;
			let rejectedRevocation;
			const commitGuard = () => {
				assertCompletionAuthorized?.();
				try {
					validateCleanupRevocation?.();
				} catch (error) {
					if (error instanceof SubagentSessionCleanupRevocationChangedError) rejectedRevocation = error;
					throw error;
				}
			};
			const withCurrentCleanupRevocation = async (reset) => {
				for (let attempt = 0;; attempt += 1) {
					validateCleanupRevocation = void 0;
					rejectedRevocation = void 0;
					try {
						return await reset();
					} catch (error) {
						if (attempt >= 2 || error !== rejectedRevocation || !(error instanceof SubagentSessionCleanupRevocationChangedError)) throw error;
					}
				}
			};
			if (incognito) {
				if (!entry) return invalidSessionRequest(`unknown session: ${params.key}`);
				let beforeDeleteEmitted = false;
				const deleted = await withCurrentCleanupRevocation(() => deleteIncognitoSessionForReset({
					key: params.key,
					agentId,
					storePath,
					target,
					entry,
					commitGuard,
					beforeDelete: async () => {
						if (!beforeDeleteEmitted) {
							beforeDeleteEmitted = true;
							await emitGatewayBeforeResetPluginHook({
								cfg,
								key: params.key,
								messages: beforeResetMessages,
								target,
								storePath,
								entry,
								reason: params.reason
							});
						}
						if (memory) {
							validateCleanupRevocation = await prepareSubagentSessionCleanupRevocation(target.canonicalKey, agentId, assertCompletionAuthorized);
							return;
						}
						await withSessionEntryReadOnlyInWorker({
							agentId,
							storePath,
							sessionKey: target.canonicalKey
						}, () => assertCompletionAuthorized?.(), async (read) => {
							if (!read.ok) throw read.error;
							if (read.value?.sessionId === entry.sessionId && read.value.lifecycleRevision === resetLifecycleRevision) validateCleanupRevocation = await prepareSubagentSessionCleanupRevocation(target.canonicalKey, agentId, assertCompletionAuthorized);
						});
					}
				}));
				if (!deleted.ok) return deleted;
				await handleSessionStateSessionDeleted(target.canonicalKey, agentId);
				const worktreePreserved = await removeSessionWorktree({
					id: normalizeOptionalString(entry.worktree?.id),
					sessionKey: target.canonicalKey,
					reason: "session-reset"
				});
				notifyGatewaySessionReset(target.canonicalKey, target.agentId);
				emitGatewaySessionEndPluginHook({
					cfg,
					sessionKey: target.canonicalKey,
					sessionId: entry.sessionId,
					storePath,
					sessionFile: target.canonicalKey,
					agentId: target.agentId,
					reason: params.reason,
					archivedTranscripts: [],
					endedTranscript: {
						available: false,
						reason: "incognito-deleted"
					}
				});
				await emitSessionUnboundLifecycleEvent({
					targetSessionKey: target.canonicalKey,
					reason: "session-reset"
				});
				return {
					ok: true,
					key: target.canonicalKey,
					agentId: target.agentId,
					storePath,
					incognitoDeleted: true,
					deletedSessionId: deleted.value.deletedSessionId,
					...worktreePreserved ? { worktreePreserved } : {}
				};
			}
			let createdNewEntry = false;
			assertCompletionAuthorized?.();
			const boundaryEntry = (await loadResetSession(assertCompletionAuthorized)).entry;
			if (boundaryEntry?.sessionId !== entry?.sessionId) {
				params.assertCurrent?.();
				throw new Error(`Session ${params.key} changed before reset boundary append.`);
			}
			let resetBoundaryAppended = false;
			const resetBoundaryId = boundaryEntry ? createSessionResetBoundaryId() : void 0;
			let resetSkipped = false;
			let creationAuthorizationError;
			let fastModeSelectionError;
			const postCommitActions = [];
			const lifecycleRequest = {
				commitGuard,
				archivePreviousTranscript: false,
				agentId: target.agentId,
				resetBoundary: boundaryEntry ? {
					boundaryId: resetBoundaryId,
					context: "clear",
					reason: params.reason,
					cwd: workspaceDir
				} : void 0,
				storePath,
				target: {
					canonicalKey: target.canonicalKey,
					storeKeys: [...new Set([
						...target.storeKeys,
						canonicalKey,
						legacyKey,
						params.key
					].filter((key) => Boolean(key)))]
				},
				buildNextEntry: async ({ currentEntry, primaryKey }) => {
					assertCompletionAuthorized?.();
					if (!currentEntry) {
						creationAuthorizationError = authorizeResetCreation();
						if (creationAuthorizationError) throw new Error(creationAuthorizationError.message);
					}
					createdNewEntry = currentEntry === void 0;
					fastModeSelectionError = resolveFastModeSelectionError(currentEntry);
					if (fastModeSelectionError) throw new Error(fastModeSelectionError.message);
					if (currentEntry?.sessionId !== boundaryEntry?.sessionId) {
						if (currentEntry) {
							resetSkipped = true;
							return currentEntry;
						}
						params.assertCurrent?.();
						throw new Error(`Session ${params.key} changed before reset boundary commit.`);
					}
					if (currentEntry && currentEntry.lifecycleRevision !== resetLifecycleRevision) {
						resetSkipped = true;
						return currentEntry;
					}
					validateCleanupRevocation = await prepareSubagentSessionCleanupRevocation(target.canonicalKey, agentId, assertCompletionAuthorized);
					resetBoundaryAppended = currentEntry !== void 0;
					const resetPreservedSelection = resolveResetPreservedSelection({ entry: currentEntry });
					const now = Date.now();
					const nextSessionId = currentEntry?.sessionId ?? randomUUID();
					const nextExecNode = params.execNode ? params.execNode : params.clearExecBinding ? void 0 : currentEntry?.execNode;
					const creationStamp = currentEntry ? {
						...preserveCreationStamp({}, currentEntry),
						projectId: currentEntry.projectId
					} : params.creation ? {
						...buildSessionCreationStamp(params.creation),
						...resolveCreatorSandbox(cfg, params.creation) === "required" ? { sandbox: "required" } : {}
					} : {};
					const nextEntry = {
						sessionId: nextSessionId,
						lifecycleRevision: randomUUID(),
						updatedAt: now,
						sessionStartedAt: now,
						systemSent: false,
						abortedLastRun: false,
						contextWindow: currentEntry?.contextWindow,
						thinkingLevel: currentEntry?.thinkingLevel,
						fastMode: params.fastModeSelection?.value ?? currentEntry?.fastMode,
						toolOverrides: currentEntry?.toolOverrides,
						verboseLevel: currentEntry?.verboseLevel,
						traceLevel: currentEntry?.traceLevel,
						reasoningLevel: currentEntry?.reasoningLevel,
						elevatedLevel: currentEntry?.elevatedLevel,
						ttsAuto: currentEntry?.ttsAuto,
						execHost: params.execNode ? "node" : params.clearExecBinding ? void 0 : currentEntry?.execHost,
						execNode: nextExecNode,
						execCwd: params.execNode ? params.execCwd : params.clearExecBinding ? void 0 : currentEntry?.execCwd,
						...params.armSessionDiffBaselineCapture && !nextExecNode && !currentEntry?.deviceFolder ? { sessionDiffBaselineCapture: createSessionDiffBaselineCaptureClaim() } : {},
						responseUsage: currentEntry?.responseUsage,
						...preserveResetSessionPresentation(currentEntry),
						...resetPreservedSelection,
						groupActivation: currentEntry?.groupActivation,
						groupActivationNeedsSystemIntro: currentEntry?.groupActivationNeedsSystemIntro,
						chatType: currentEntry?.chatType,
						compactionCount: 0,
						sendPolicy: currentEntry?.sendPolicy,
						queueMode: currentEntry?.queueMode,
						queueDebounceMs: currentEntry?.queueDebounceMs,
						queueCap: currentEntry?.queueCap,
						queueDrop: currentEntry?.queueDrop,
						...preserveSessionLineage(currentEntry),
						completionOwnerSessionKey: currentEntry?.completionOwnerSessionKey,
						spawnedWorkspaceDir: currentEntry?.spawnedWorkspaceDir,
						spawnedCwd: params.clearSpawnedCwd ? void 0 : preparedLifecycle?.spawnedCwd ?? params.spawnedCwd ?? currentEntry?.spawnedCwd,
						sessionRoot: params.clearSpawnedCwd ? void 0 : preparedLifecycle?.sessionRoot ?? params.sessionRoot ?? currentEntry?.sessionRoot,
						permissionMode: params.clearSpawnedCwd ? void 0 : params.permissionMode ?? currentEntry?.permissionMode,
						sandboxMode: currentEntry?.sandboxMode,
						worktree: params.clearSpawnedCwd ? void 0 : preparedLifecycle?.worktree ?? currentEntry?.worktree,
						repositoryWorkspaceId: preparedLifecycle?.repositoryWorkspaceId ?? currentEntry?.repositoryWorkspaceId,
						deviceFolder: currentEntry?.deviceFolder ? { ...currentEntry.deviceFolder } : void 0,
						...creationStamp,
						delivery: currentEntry?.delivery,
						pendingDeliveryNotice: currentEntry?.pendingDeliveryNotice,
						groupId: currentEntry?.groupId,
						subject: currentEntry?.subject,
						groupChannel: currentEntry?.groupChannel,
						space: currentEntry?.space,
						pluginOwnerId: currentEntry?.pluginOwnerId ?? params.authorizedPluginId,
						cliSessionBindings: currentEntry?.cliSessionBindings,
						cliSessionIds: currentEntry?.cliSessionIds,
						claudeCliSessionId: currentEntry?.claudeCliSessionId,
						usageFamilyKey: currentEntry?.usageFamilyKey,
						usageFamilySessionIds: currentEntry?.usageFamilySessionIds,
						inputTokens: 0,
						outputTokens: 0,
						totalTokens: 0,
						totalTokensFresh: true,
						totalTokensVersion: 1
					};
					if (resetBoundaryAppended && !isSubagentSessionKey(primaryKey)) clearAllCliSessions(nextEntry);
					else nextEntry.cliSessionBindings = rebindCliSessionReseedReceiptsForReset(nextEntry.cliSessionBindings, nextSessionId);
					return nextEntry;
				},
				afterEntryMutation: async (mutation, committedSource) => {
					if (resetSkipped) return;
					lifecyclePreparationCommitted = true;
					let committedAcpResetState;
					postCommitActions.push(async () => {
						if (committedAcpResetState && isResetLifecycleCurrent()) await tryPrepareFreshManagerRuntimeSession({
							deps: { getRuntimeBackend: getAcpRuntimeBackend },
							cfg,
							meta: committedAcpResetState.meta,
							sessionKey: committedAcpResetState.sessionKey,
							agentId,
							logPrefix: "sessions.session-reset"
						});
						await emitGatewayBeforeResetPluginHook({
							cfg,
							key: params.key,
							messages: beforeResetMessages,
							target,
							storePath,
							entry: mutation.previousEntry,
							reason: params.reason
						});
					}, async () => {
						const resetSessionKey = target.canonicalKey;
						await handleSessionStateSessionReset(resetSessionKey);
						notifyGatewaySessionReset(resetSessionKey, target.agentId);
						emitGatewaySessionEndPluginHook({
							cfg,
							sessionKey: resetSessionKey,
							sessionId: mutation.previousSessionId,
							storePath,
							sessionFile: mutation.previousSessionFile,
							agentId: target.agentId,
							reason: params.reason,
							archivedTranscripts: [],
							nextSessionId: mutation.nextEntry.sessionId,
							endedTranscript: resetBoundaryId ? createResetBoundaryTranscriptSource({
								agentId: target.agentId,
								sessionId: mutation.previousSessionId,
								sessionKey: resetSessionKey,
								storePath
							}, resetBoundaryId) : {
								available: false,
								reason: "unsupported-source"
							}
						});
						emitGatewaySessionStartPluginHook({
							cfg,
							sessionKey: resetSessionKey,
							sessionId: mutation.nextEntry.sessionId,
							resumedFrom: mutation.previousSessionId,
							storePath,
							sessionFile: resetSessionKey,
							agentId: target.agentId
						});
					});
					if (hadExistingEntry) postCommitActions.push(() => emitSessionUnboundLifecycleEvent({
						targetSessionKey: target.canonicalKey,
						reason: "session-reset"
					}));
					if (detachedWorktreeId) postCommitActions.push(() => finalizeDetachedSessionWorktree({
						id: detachedWorktreeId,
						env: worktreeEnv,
						context: worktreeContext
					}).catch(reportLifecycleCleanupError));
					clearBootstrapSnapshotOnSessionBoundary({
						boundaryAppended: resetBoundaryAppended,
						sessionKey: target.canonicalKey
					});
					if (createdNewEntry) await recordSessionCreated(cfg, {
						sessionKey: target.canonicalKey,
						agentId,
						entry: mutation.nextEntry
					});
					if (deferredAcpResetState) {
						const meta = buildPendingAcpMeta(deferredAcpResetState.meta, Date.now());
						await rebindDurableAcpSessionMetaAfterReset({
							sessionKey: target.canonicalKey,
							agentId,
							context: committedSource,
							entry: mutation.nextEntry,
							meta,
							assertCurrent: assertCompletionAuthorized
						});
						committedAcpResetState = {
							sessionKey: target.canonicalKey,
							meta
						};
					}
					params.onCommitted?.({
						key: target.canonicalKey,
						sessionId: mutation.nextEntry.sessionId
					});
				}
			};
			const resetLifecycle = (assertSourceCurrent) => withCurrentCleanupRevocation(() => resetSessionEntryLifecycle({
				...lifecycleRequest,
				commitGuard: () => {
					commitGuard();
					assertSourceCurrent?.();
				}
			}));
			const lifecyclePromise = preparedLifecycle?.withCommit ? preparedLifecycle.withCommit(resetLifecycle) : resetLifecycle();
			let lifecycle;
			try {
				lifecycle = await settleGatewaySessionLifecycleCommit(lifecyclePromise, postCommitActions);
			} catch (error) {
				if (fastModeSelectionError) return {
					ok: false,
					error: fastModeSelectionError
				};
				if (creationAuthorizationError) return {
					ok: false,
					error: creationAuthorizationError
				};
				throw error;
			}
			const next = lifecycle.nextEntry;
			const selectedModel = resolveSessionModelRef(cfg, next, target.agentId);
			const resolved = {
				modelProvider: selectedModel.provider,
				model: selectedModel.model
			};
			const responseEntry = {
				...projectPublicSessionEntry(next),
				modelProvider: resolved.modelProvider,
				model: resolved.model
			};
			return {
				ok: true,
				key: target.canonicalKey,
				entry: responseEntry,
				resolved,
				agentId: target.agentId,
				storePath
			};
		},
		finalize: async () => {
			if (!lifecyclePreparationCommitted) await rollbackGatewaySessionPreparation({
				prepared: preparedLifecycle,
				onError: reportLifecycleCleanupError
			});
		}
	});
}
//#endregion
export { cleanupSessionBeforeMutation as a, emitGatewaySessionStartPluginHook as i, performGatewaySessionReset as n, emitSessionUnboundLifecycleEvent as o, emitGatewaySessionEndPluginHook as r, emitGatewayBeforeResetPluginHook as t };
