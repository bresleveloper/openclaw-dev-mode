import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { A as withTimeout } from "./fs-safe-BUXBSN-4.mjs";
import { n as sanitizeForLog } from "./ansi-BeFJ0Uu7.mjs";
import { t as _usingCtx } from "./usingCtx-DwOBYOJf.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { a as resolveAgentDir, d as resolveAgentWorkspaceDir, p as resolveAmbientOwnerAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey, w as isSubagentSessionKey } from "./session-key-C09ow4h0.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { n as getInProcessGatewayRequestContext } from "./gateway-request-scope-BSmCVVpP.mjs";
import { l as getActivePluginRegistry } from "./runtime-D4MkflNJ.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-DsrPoRc4.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./io-CUI9EWW_.mjs";
import { l as retireSessionMcpRuntime } from "./agent-bundle-mcp-manager-api-CsCOZa1-.mjs";
import { i as logVerbose } from "./globals-BXbZ1A_g.mjs";
import { t as getGlobalHookRunner } from "./hook-runner-global-eJIIEpha.mjs";
import { x as runWithGatewayDetachedWorkContinuation } from "./gateway-work-admission-rc4ZgKq_.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape, p as missingScopeErrorShape } from "./error-codes-Dh56LniQ.mjs";
import { l as resolveCreatorSandbox, n as authorizeGatewaySessionCreation } from "./operator-role-policy-BqPaarjx.mjs";
import { a as rebindCliSessionReseedReceiptsForReset, t as clearAllCliSessions } from "./cli-session-binding-CMk8AbZT.mjs";
import { i as resetRegisteredAgentHarnessSessions } from "./registry-BUEqtPpd.mjs";
import { m as resolveMissingAgentHarnessSessionError } from "./agent-harness-session-key-D8EQIzja.mjs";
import { n as acquireAgentRuntimeCleanupRegistries } from "./prepared-model-runtime-B8unFFC9.mjs";
import { t as formatSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.mjs";
import { n as buildSessionCreationStamp, o as preserveCreationStamp } from "./session-entry-provenance-Bfs2J1E7.mjs";
import { d as hasOnlySessionLifecycleMutationKindActive, f as interruptSessionWorkAdmissions, g as runExclusiveSessionLifecycleMutation, m as isSessionLifecycleMutationActive, t as SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS } from "./session-lifecycle-admission-GoxISURZ.mjs";
import { n as createSessionResetBoundaryId } from "./session-accessor.sqlite-reset-boundary-DJhJRD2j.mjs";
import { r as preserveSessionLineage } from "./session-entry-lineage-Dms9xZt1.mjs";
import { u as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-qEzTuOKY.mjs";
import { c as invalidSessionRequest, r as resolveRequestedSessionAgentInput } from "./session-request-agent-Bxi11ET4.mjs";
import { a as resolveSessionStoreKey } from "./session-store-key-Ci099tm9.mjs";
import { n as deleteSessionEntryLifecycle, r as resetSessionEntryLifecycle } from "./session-accessor.sqlite-lifecycle-BH4CIDLX.mjs";
import { r as MODEL_SELECTION_LOCKED_RESET_MESSAGE, s as isModelSelectionLocked } from "./model-overrides-uZFvcSRc.mjs";
import { y as projectPublicSessionEntry } from "./session-accessor.sqlite-transcript-write-Kl-_Ewp0.mjs";
import { a as handleSessionStateSessionDeleted, o as handleSessionStateSessionReset } from "./session-state-events-B7wdeeGU.mjs";
import { n as buildAcpDatabaseSessionKey } from "./session-meta-keys-Bj_FyJ-3.mjs";
import { d as resolveAcpSessionTarget } from "./manager.utils-Bvd6j1MX.mjs";
import { c as isAcpOwnerRepairRequired, n as getAcpSessionManager, o as getAcpSessionResetControls, s as tryPrepareFreshManagerRuntimeSession } from "./manager-Cmu0euXz.mjs";
import { t as getAcpRuntimeBackend } from "./registry-CQAJvYwl.mjs";
import { i as writeAcpSessionMetaForMigration, l as readAcpSessionMetaAsync, o as upsertAcpSessionMeta, u as listAcpSessionEntries } from "./session-meta-C2UXd_yK.mjs";
import { I as waitForEmbeddedAgentRunEnd, d as isEmbeddedAgentRunActive, n as abortEmbeddedAgentRun } from "./runs-BErx7xDZ.mjs";
import { i as clearFinishedSessionsForScopes } from "./bash-process-registry-BsL_e5bm.mjs";
import { i as isRestartRecoveryTombstone, o as resolveSessionWorkStartError, t as SESSION_LIFECYCLE_CHANGED_ERROR_REASON } from "./lifecycle-BH2MRg79.mjs";
import "./sessions-DNhLX2Ep.mjs";
import { t as getSessionBindingService } from "./session-binding-service-DzGpg6K8.mjs";
import { n as clearBootstrapSnapshotOnSessionBoundary, t as clearBootstrapSnapshot } from "./bootstrap-cache-799ZO2Op.mjs";
import "./cli-session-B9R5wqcb.mjs";
import { n as createInternalHookEvent, u as triggerInternalHook } from "./internal-hooks-CcXmGbgu.mjs";
import { l as retireSessionWorkerPlacementBeforeMutation, s as resolveSessionWorkerPlacementMutationError } from "./session-placement-lifecycle-D5GPja58.mjs";
import { t as resolveResetPreservedSelection } from "./reset-preserved-selection-LF-PWTG4.mjs";
import { n as resolveSessionModelRef } from "./session-model-ref-zMXEXgI3.mjs";
import "./agent-bundle-mcp-tools-CmVTlZqR.mjs";
import { i as resolveSessionTranscriptCandidates, o as resolveStableSessionEndTranscript } from "./session-transcript-files.fs-CdF7y2ZY.mjs";
import { s as readSessionMessagesAsync } from "./session-transcript-readers-CDyCeaj9.mjs";
import { a as buildSessionStartHookPayload, f as createResetBoundaryTranscriptSource, i as buildSessionEndHookPayload, r as noteActiveSessionForShutdown, t as forgetActiveSessionForShutdown, u as createArchivedSessionTranscriptSource } from "./active-sessions-shutdown-tracker--g_C6Pbu.mjs";
import { r as loadGatewaySessionEntry } from "./session-utils-store-BX-eWQU_.mjs";
import { t as resolveGatewaySessionStoreTargetInWorker } from "./session-utils-store-worker-Dc1i92s7.mjs";
import { t as recordSessionCreated } from "./session-created-8DGomWci.mjs";
import { a as managedWorktrees } from "./service-DvlxnA92.mjs";
import "./session-utils-CwljFiKR.mjs";
import { t as createSessionDiffBaselineCaptureClaim } from "./session-diff-baseline-capture-6ejBT0Am.mjs";
import { a as stopSessionResetSubagents, i as createSessionResetCleanupGuard, r as clearSessionResetRuntimeState, t as SessionResetCleanupError } from "./session-reset-cleanup-CZtvnqS6.mjs";
import { t as cleanupBrowserSessionsForLifecycleEnd } from "./browser-lifecycle-cleanup-BvQA8BG4.mjs";
import { n as hasSessionAutoResetListeners, r as isSessionAutoResetReason, t as emitSessionAutoResetHook } from "./session-auto-reset-BGSoK2RG.mjs";
import { n as runPluginHostCleanup } from "./host-hook-cleanup-CYtTb4qs.mjs";
import { o as rollbackGatewaySessionPreparation, s as settleGatewaySessionLifecycleCommit } from "./session-lifecycle-preparation-CfwLlYlr.mjs";
import { t as resolvePluginSessionOwnershipError } from "./session-plugin-ownership-BbxQNnS-.mjs";
import { t as notifyGatewaySessionReset } from "./session-reset-notifications-DLG7y_Yk.mjs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { cleanupSessionResources } from "@openclaw/ai/internal/runtime";
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
	if (shouldEmitAutoReset) emitSessionAutoResetHook({
		cfg: params.cfg,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		reason: params.reason,
		sessionFile: transcript.sessionFile,
		transcriptArchived: transcript.transcriptArchived,
		nextSessionId: params.nextSessionId,
		nextSessionKey: params.nextSessionKey,
		agentId: params.agentId,
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
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		reason: params.reason,
		sessionFile: transcript.sessionFile,
		transcriptArchived: transcript.transcriptArchived,
		nextSessionId: params.nextSessionId,
		nextSessionKey: params.nextSessionKey,
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
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		resumedFrom: params.resumedFrom
	});
	runWithGatewayDetachedWorkContinuation(async () => {
		await hookRunner.runSessionStart(payload.event, payload.context);
	}, "hooks:session-start").catch((err) => {
		logVerbose(`session_start hook failed: ${String(err)}`);
	});
}
//#endregion
//#region src/gateway/session-reset-acp.ts
const ACP_RUNTIME_CLEANUP_TIMEOUT_MS = 15e3;
async function runAcpCleanupStep(op) {
	let timer;
	const timeoutPromise = new Promise((resolve) => {
		timer = setTimeout(() => resolve({ status: "timeout" }), ACP_RUNTIME_CLEANUP_TIMEOUT_MS);
	});
	const opPromise = op().then(() => ({ status: "ok" })).catch((error) => ({
		status: "error",
		error
	}));
	const outcome = await Promise.race([opPromise, timeoutPromise]);
	if (timer) clearTimeout(timer);
	return outcome;
}
async function closeAcpRuntimeForSession(params) {
	params.assertCurrent?.();
	const sessionKeys = Array.from(new Set([params.sessionKey, ...params.fallbackSessionKeys ?? []].map((key) => typeof key === "string" ? key.trim() : "").filter(Boolean)));
	let acpMeta;
	let acpSessionKey = params.sessionKey;
	for (const sessionKey of sessionKeys) {
		acpMeta = await readAcpSessionMetaAsync({
			sessionKey,
			agentId: params.agentId,
			cfg: params.cfg,
			assertCurrent: params.assertCurrent
		});
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
		else await ensureFreshAcpResetState({
			cfg: params.cfg,
			sessionKey: acpSessionKey,
			agentId: params.agentId,
			reason: params.reason,
			acpMeta,
			assertCurrent: params.assertCurrent
		});
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
async function ensureFreshAcpResetState(params) {
	const latestMeta = await readAcpSessionMetaAsync({
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		cfg: params.cfg,
		assertCurrent: params.assertCurrent
	}) ?? params.acpMeta;
	params.assertCurrent?.();
	if (!latestMeta?.identity || latestMeta.identity.state !== "resolved" || !latestMeta.identity.acpxSessionId && !latestMeta.identity.agentSessionId) return;
	await tryPrepareFreshManagerRuntimeSession({
		deps: { getRuntimeBackend: getAcpRuntimeBackend },
		cfg: params.cfg,
		meta: latestMeta,
		...resolveAcpSessionTarget(params),
		logPrefix: `sessions.${params.reason}`
	});
	params.assertCurrent?.();
	const now = Date.now();
	await upsertAcpSessionMeta({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		assertCommitAllowed: params.assertCurrent,
		mutate: (current) => {
			params.assertCurrent?.();
			return buildPendingAcpMeta(current ?? latestMeta, now);
		}
	});
	params.assertCurrent?.();
}
//#endregion
//#region src/gateway/session-reset-incognito.ts
/** The caller retains the reset lifecycle fence through deletion and its notifications. */
async function deleteIncognitoSessionForReset(params) {
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
			return {
				ok: false,
				error: errorShape(ErrorCodes.UNAVAILABLE, `Session ${params.key} terminals are still active; try again in a moment.`)
			};
		}
		await params.beforeDelete();
		const deleted = await deleteSessionEntryLifecycle({
			commitGuard: params.commitGuard,
			agentId: params.agentId,
			archiveTranscript: false,
			deleteDeliveryArtifacts: true,
			deleteTranscriptWithoutArchive: true,
			expectedEntry: params.entry,
			expectedSessionId: params.entry.sessionId,
			expectedUpdatedAt: params.entry.updatedAt,
			storePath: params.storePath,
			target: params.target
		});
		if (!deleted.deleted) return {
			ok: false,
			error: errorShape(ErrorCodes.UNAVAILABLE, `Session ${params.key} changed before reset. Retry.`)
		};
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
	const target = await resolveGatewaySessionStoreTargetInWorker({
		cfg,
		key: params.key,
		...requestedAgentId ? { agentId: requestedAgentId } : {}
	});
	return {
		ok: true,
		cfg,
		target,
		storePath: target.storePath,
		requestedAgentId
	};
}
function resolveLifecycleAgentId(cfg, agentId) {
	return normalizeAgentId(agentId ?? resolveAmbientOwnerAgentId(cfg));
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
async function resetSessionAgentHarnesses(params) {
	try {
		var _usingCtx$1 = _usingCtx();
		const agentId = resolveLifecycleAgentId(params.cfg, params.target.agentId);
		const sessionKey = params.target.canonicalKey ?? params.key;
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
async function ensureSessionRuntimeCleanup(params) {
	const assertCurrent = createSessionResetCleanupGuard({
		storePath: params.target.storePath,
		sessionKey: params.target.canonicalKey,
		expectedSession: params.sessionId ? {
			sessionId: params.sessionId,
			lifecycleRevision: params.sessionLifecycleRevision
		} : void 0,
		assertCurrent: params.assertCurrent
	});
	const closeTrackedBrowserTabs = async () => {
		assertCurrent();
		const closeKeys = /* @__PURE__ */ new Set([
			params.key,
			params.target.canonicalKey,
			...params.target.storeKeys,
			params.sessionId ?? ""
		]);
		await cleanupBrowserSessionsForLifecycleEnd({
			cfg: params.cfg,
			sessionKeys: [...closeKeys],
			onWarn: (message) => logVerbose(message)
		});
		assertCurrent();
	};
	try {
		assertCurrent();
		await stopSessionResetSubagents({
			cfg: params.cfg,
			sessionKey: params.target.canonicalKey,
			agentId: resolveLifecycleAgentId(params.cfg, params.target.agentId),
			assertCurrent
		});
	} catch (error) {
		if (error instanceof SessionResetCleanupError) return errorShape(ErrorCodes.UNAVAILABLE, error.message);
		throw error;
	}
	assertCurrent();
	const queueKeys = [
		...params.target.storeKeys,
		params.target.canonicalKey,
		params.sessionId
	].filter((key) => key !== void 0);
	clearFinishedSessionsForScopes([...queueKeys, params.key]);
	clearSessionResetRuntimeState(queueKeys, {
		activeReplySessionId: params.sessionId,
		agentId: resolveLifecycleAgentId(params.cfg, params.target.agentId),
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
	const pluginCleanup = await runPluginHostCleanup({
		cfg: params.cfg,
		registry: getActivePluginRegistry(),
		reason: params.reason === "session-reset" ? "reset" : "delete",
		sessionKey: params.target.canonicalKey ?? params.key,
		sessionStoreTargets: [params.target],
		shouldCleanup: () => {
			params.assertCurrent?.();
			return true;
		}
	});
	params.assertCurrent?.();
	for (const failure of pluginCleanup.failures) logVerbose(`plugin host cleanup failed for ${failure.pluginId}/${failure.hookId}: ${String(failure.error)}`);
	const parentSessionKey = params.target.canonicalKey ?? params.canonicalKey ?? params.key;
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
		parentKey: params.target.canonicalKey ?? params.canonicalKey ?? params.key,
		parentAgentId: params.target.agentId,
		reason: params.reason,
		assertCurrent: params.assertCurrent
	});
	params.assertCurrent?.();
	if (parentAcpError) return parentAcpError;
	if (params.entry?.sessionId) {
		await resetSessionAgentHarnesses({
			cfg: params.cfg,
			key: params.key,
			target: params.target,
			entry: params.entry,
			reason: params.reason === "session-reset" ? "reset" : "deleted",
			assertCurrent: params.assertCurrent
		});
		params.assertCurrent?.();
	}
}
async function emitGatewayBeforeResetPluginHook(params) {
	const hookRunner = getGlobalHookRunner();
	if (!hookRunner?.hasHooks("before_reset")) return;
	const sessionKey = params.target.canonicalKey ?? params.key;
	const sessionId = params.entry?.sessionId;
	const agentId = resolveLifecycleAgentId(params.cfg, params.target.agentId);
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
	const resetTarget = await resolveSessionResetTarget(getRuntimeConfig(), params);
	if (!resetTarget.ok) return resetTarget;
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
	const initialResetEntry = loadGatewaySessionEntry(params.key, resetTarget.requestedAgentId ? { agentId: resetTarget.requestedAgentId } : void 0).entry;
	const expectedSessionMatches = (entry) => params.expectedSessionId === void 0 || entry?.sessionId === params.expectedSessionId;
	const sessionChangedError = () => errorShape(ErrorCodes.INVALID_REQUEST, `Session ${params.key} changed before reset. Retry.`, { details: { reason: SESSION_LIFECYCLE_CHANGED_ERROR_REASON } });
	if (!expectedSessionMatches(initialResetEntry)) return {
		ok: false,
		error: sessionChangedError()
	};
	if (!initialResetEntry) {
		const creationError = authorizeResetCreation();
		if (creationError) return {
			ok: false,
			error: creationError
		};
	}
	const initialOwnershipError = resolvePluginSessionOwnershipError({
		action: "reset",
		entry: initialResetEntry,
		key: resetTarget.target.canonicalKey,
		pluginOwnerId: params.authorizedPluginId
	});
	if (initialOwnershipError) return {
		ok: false,
		error: initialOwnershipError
	};
	const resolveFastModeSelectionError = (entry) => {
		const selection = params.fastModeSelection;
		return entry && selection && selection.value !== entry.fastMode && !selection.allowExistingChange ? missingScopeErrorShape({
			missingScope: ADMIN_SCOPE,
			requiredScopes: [ADMIN_SCOPE]
		}) : void 0;
	};
	const initialFastModeSelectionError = resolveFastModeSelectionError(initialResetEntry);
	if (initialFastModeSelectionError) return {
		ok: false,
		error: initialFastModeSelectionError
	};
	const missingHarnessSessionError = resolveMissingAgentHarnessSessionError(resetTarget.target.canonicalKey, initialResetEntry);
	if (missingHarnessSessionError) return invalidSessionRequest(missingHarnessSessionError);
	if (isModelSelectionLocked(initialResetEntry)) return invalidSessionRequest(MODEL_SELECTION_LOCKED_RESET_MESSAGE);
	const workerPlacementContext = params.workerPlacementContext ?? (await import("./session-worker-placement-context-BtFp-Xlc.mjs")).resolveSessionWorkerPlacementContext();
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
			allowRestartTombstoneReplacement: entry !== void 0 && entry.archivedAt === void 0 && isRestartRecoveryTombstone(entry)
		});
		if (archivedSessionError) return errorShape(ErrorCodes.INVALID_REQUEST, archivedSessionError);
		if (isModelSelectionLocked(entry)) return errorShape(ErrorCodes.INVALID_REQUEST, MODEL_SELECTION_LOCKED_RESET_MESSAGE);
		if (!entry && isIncognitoSessionKey(resetTarget.target.canonicalKey)) return errorShape(ErrorCodes.INVALID_REQUEST, `unknown session: ${params.key}`);
	};
	const initialPlacementError = resolveSessionWorkerPlacementMutationError({
		action: "reset",
		context: workerPlacementContext,
		key: params.key,
		sessionId: normalizeOptionalString(initialResetEntry?.sessionId)
	});
	if (initialPlacementError) return invalidSessionRequest(initialPlacementError.message);
	const resetLifecycleIdentities = [
		resetTarget.target.canonicalKey,
		params.key,
		initialResetEntry?.sessionId
	];
	const activeLifecycleMutation = isSessionLifecycleMutationActive(resetTarget.storePath, resetLifecycleIdentities);
	const activeCompaction = hasOnlySessionLifecycleMutationKindActive(resetTarget.storePath, resetLifecycleIdentities, "compaction");
	if (activeLifecycleMutation && !activeCompaction) return {
		ok: false,
		error: errorShape(ErrorCodes.UNAVAILABLE, `Session ${params.key} has another lifecycle mutation in progress; try again.`)
	};
	let admittedWorkReleased = true;
	let resetPreparationError;
	let preparedResetSessionId;
	let preparedLifecycle;
	let lifecyclePreparationCommitted = false;
	return await runExclusiveSessionLifecycleMutation("reset", {
		scope: resetTarget.storePath,
		identities: resetLifecycleIdentities,
		prepare: async () => {
			params.assertCurrent?.();
			params.assertAuthorizedInstance?.();
			const { entry: currentEntry, canonicalKey: currentCanonicalKey } = loadGatewaySessionEntry(params.key, resetTarget.requestedAgentId ? { agentId: resetTarget.requestedAgentId } : void 0);
			if (!expectedSessionMatches(currentEntry)) {
				resetPreparationError = sessionChangedError();
				return;
			}
			if (!currentEntry) {
				resetPreparationError = authorizeResetCreation();
				if (resetPreparationError) return;
			}
			resetPreparationError = resolveFastModeSelectionError(currentEntry);
			if (resetPreparationError) return;
			resetPreparationError = resolvePluginSessionOwnershipError({
				action: "reset",
				entry: currentEntry,
				key: resetTarget.target.canonicalKey,
				pluginOwnerId: params.authorizedPluginId
			});
			if (resetPreparationError) return;
			const currentMissingHarnessSessionError = resolveMissingAgentHarnessSessionError(resetTarget.target.canonicalKey, currentEntry);
			if (currentMissingHarnessSessionError) {
				resetPreparationError = errorShape(ErrorCodes.INVALID_REQUEST, currentMissingHarnessSessionError);
				return;
			}
			resetPreparationError = resolveResetEntryStateError(currentEntry, currentCanonicalKey);
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
			const { cfg, target, storePath, requestedAgentId } = resetTarget;
			if (resetPreparationError) return {
				ok: false,
				error: resetPreparationError
			};
			if (!admittedWorkReleased) return {
				ok: false,
				error: errorShape(ErrorCodes.UNAVAILABLE, `Session ${params.key} is still active; try again in a moment.`)
			};
			params.assertCurrent?.();
			params.assertAuthorizedInstance?.();
			const { entry, legacyKey, canonicalKey } = loadGatewaySessionEntry(params.key, requestedAgentId ? { agentId: requestedAgentId } : void 0);
			if (normalizeOptionalString(entry?.sessionId) !== preparedResetSessionId) return {
				ok: false,
				error: params.expectedSessionId === void 0 ? errorShape(ErrorCodes.UNAVAILABLE, `Session ${params.key} changed before reset. Retry.`) : sessionChangedError()
			};
			const currentFastModeSelectionError = resolveFastModeSelectionError(entry);
			if (currentFastModeSelectionError) return {
				ok: false,
				error: currentFastModeSelectionError
			};
			const currentOwnershipError = resolvePluginSessionOwnershipError({
				action: "reset",
				entry,
				key: canonicalKey,
				pluginOwnerId: params.authorizedPluginId
			});
			if (currentOwnershipError) return {
				ok: false,
				error: currentOwnershipError
			};
			const entryStateError = resolveResetEntryStateError(entry, canonicalKey);
			if (entryStateError) return {
				ok: false,
				error: entryStateError
			};
			const incognito = entry?.incognito === true || isIncognitoSessionKey(target.canonicalKey);
			const placementRetirementError = retireSessionWorkerPlacementBeforeMutation({
				action: "reset",
				context: workerPlacementContext,
				key: params.key,
				sessionId: normalizeOptionalString(entry?.sessionId)
			});
			if (placementRetirementError) return invalidSessionRequest(placementRetirementError.message);
			if (entry?.worktree?.id) {
				const record = managedWorktrees.findLiveById(entry.worktree.id);
				if (record) {
					const { withSettledLocalWorkspace } = await import("./local-workspace-projection-Da4BBZ4y.mjs");
					await withSettledLocalWorkspace({
						worktree: record,
						assertCurrent: params.assertCurrent,
						retireRuntime: true
					}, async () => {});
				}
			}
			const hadExistingEntry = Boolean(entry);
			const detachedWorktreeId = params.clearSpawnedCwd ? normalizeOptionalString(entry?.worktree?.id) : void 0;
			const resetLifecycleRevision = entry?.lifecycleRevision;
			const agentId = resolveLifecycleAgentId(cfg, target.agentId);
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
			const hookEvent = createInternalHookEvent("command", params.reason, target.canonicalKey ?? params.key, {
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
			const parentAcpError = await closeAcpRuntimeForSession({
				cfg,
				sessionKey: target.canonicalKey ?? canonicalKey ?? params.key,
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
			const pluginCleanup = await runPluginHostCleanup({
				cfg,
				registry: resetPluginRegistry,
				reason: "reset",
				sessionKey: target.canonicalKey ?? params.key,
				skipPersistentSessionState: true
			});
			for (const failure of pluginCleanup.failures) logVerbose(`plugin host cleanup failed for ${failure.pluginId}/${failure.hookId}: ${String(failure.error)}`);
			await closeChildAcpRuntimesForParent({
				cfg,
				parentKey: target.canonicalKey ?? canonicalKey ?? params.key,
				parentAgentId: target.agentId,
				reason: "session-reset"
			});
			if (entry?.sessionId) await resetSessionAgentHarnesses({
				cfg,
				key: params.key,
				target,
				entry,
				reason: "reset"
			});
			const beforeResetMessages = getGlobalHookRunner()?.hasHooks("before_reset") ? await readGatewayBeforeResetPluginHookMessages({
				agentId: resolveLifecycleAgentId(cfg, target.agentId ?? requestedAgentId),
				entry,
				sessionId: entry?.sessionId,
				sessionKey: target.canonicalKey ?? params.key,
				storePath
			}) : void 0;
			const { prepareSubagentSessionCleanupRevocation, SubagentSessionCleanupRevocationChangedError } = await import("./subagent-registry-DXEFX54X.mjs");
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
				handleSessionStateSessionDeleted(target.canonicalKey, agentId);
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
					deletedSessionId: deleted.value.deletedSessionId
				};
			}
			let createdNewEntry = false;
			assertCompletionAuthorized?.();
			const boundaryEntry = loadGatewaySessionEntry(params.key, requestedAgentId ? { agentId: requestedAgentId } : void 0).entry;
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
						...params.armSessionDiffBaselineCapture && !nextExecNode ? { sessionDiffBaselineCapture: createSessionDiffBaselineCaptureClaim() } : {},
						responseUsage: currentEntry?.responseUsage,
						pinnedAt: currentEntry?.pinnedAt,
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
						inheritedToolPolicyVersion: currentEntry?.inheritedToolPolicyVersion,
						inheritedToolAllow: currentEntry?.inheritedToolAllow,
						inheritedToolDeny: currentEntry?.inheritedToolDeny,
						spawnedWorkspaceDir: currentEntry?.spawnedWorkspaceDir,
						spawnedCwd: params.clearSpawnedCwd ? void 0 : preparedLifecycle?.spawnedCwd ?? params.spawnedCwd ?? currentEntry?.spawnedCwd,
						sessionRoot: params.clearSpawnedCwd ? void 0 : preparedLifecycle?.sessionRoot ?? params.sessionRoot ?? currentEntry?.sessionRoot,
						permissionMode: params.clearSpawnedCwd ? void 0 : params.permissionMode ?? currentEntry?.permissionMode,
						sandboxMode: currentEntry?.sandboxMode,
						worktree: params.clearSpawnedCwd ? void 0 : preparedLifecycle?.worktree ?? currentEntry?.worktree,
						repositoryWorkspaceId: preparedLifecycle?.repositoryWorkspaceId ?? currentEntry?.repositoryWorkspaceId,
						...creationStamp,
						label: currentEntry?.label,
						autoLabel: currentEntry?.autoLabel,
						icon: currentEntry?.icon,
						category: currentEntry?.category,
						boardFace: currentEntry?.boardFace,
						boardPresentation: currentEntry?.boardPresentation,
						visibility: currentEntry?.visibility,
						displayName: currentEntry?.displayName,
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
				afterEntryMutation: async (mutation) => {
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
					}, () => {
						const resetSessionKey = target.canonicalKey ?? params.key;
						handleSessionStateSessionReset(resetSessionKey);
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
						targetSessionKey: target.canonicalKey ?? params.key,
						reason: "session-reset"
					}));
					if (detachedWorktreeId) postCommitActions.push(async () => {
						try {
							if (!await managedWorktrees.removeIfLossless(detachedWorktreeId)) {
								const retained = managedWorktrees.findLiveById(detachedWorktreeId);
								if (retained) {
									const safePath = truncateUtf16Safe(sanitizeForLog(retained.path), 256);
									reportLifecycleCleanupError(/* @__PURE__ */ new Error(`worktree retained: branch=${retained.branch} path=${safePath} outcome=${retained.runEndCleanup?.outcome}`));
								}
							}
						} catch (error) {
							reportLifecycleCleanupError(error);
						}
					});
					clearBootstrapSnapshotOnSessionBoundary({
						boundaryAppended: resetBoundaryAppended,
						sessionKey: target.canonicalKey ?? params.key
					});
					if (createdNewEntry) await recordSessionCreated(cfg, {
						sessionKey: target.canonicalKey ?? params.key,
						agentId,
						entry: mutation.nextEntry
					});
					if (deferredAcpResetState) {
						const resetState = {
							sessionKey: target.canonicalKey,
							meta: buildPendingAcpMeta(deferredAcpResetState.meta, Date.now())
						};
						writeAcpSessionMetaForMigration({
							sessionKey: buildAcpDatabaseSessionKey(target.canonicalKey, agentId),
							sessionId: mutation.nextEntry.sessionId,
							lifecycleRevision: mutation.nextEntry.lifecycleRevision,
							meta: resetState.meta
						});
						committedAcpResetState = resetState;
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
export { emitGatewaySessionEndPluginHook as a, performGatewaySessionReset as i, emitGatewayBeforeResetPluginHook as n, emitGatewaySessionStartPluginHook as o, emitSessionUnboundLifecycleEvent as r, cleanupSessionBeforeMutation as t };
