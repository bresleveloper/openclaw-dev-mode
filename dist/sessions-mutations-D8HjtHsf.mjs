import { r as __exportAll } from "./rolldown-runtime-Dr7-SnC6.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-CVabF32H.mjs";
import { t as isPluginJsonValue } from "./host-hook-json-BdcyDerH.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-D-CL26h0.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { Gi as validateSessionsPatchParams, Ki as validateSessionsPluginPatchParams, Qi as validateSessionsResetParams, Wi as validateSessionsPatchManyParams, ai as validateSessionsAssignOwnerParams, ra as validateSessionsSetInvolvementParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape, p as missingScopeErrorShape } from "./error-codes-DvB36bCj.mjs";
import { g as resolveOperatorSessionCreation, l as resolveCreatorSandbox, n as authorizeGatewaySessionCreation } from "./operator-role-policy-Bt6aG_wj.mjs";
import { m as resolveMissingAgentHarnessSessionError } from "./agent-harness-session-key-CQ6tTBOH.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-Xwd1VHk2.mjs";
import { bt as sqliteSessionEntriesEqual, vt as assertLifecycleTargetSnapshotUnchanged } from "./session-accessor.sqlite-entry-store-BUBLa7UE.mjs";
import { g as runExclusiveSessionLifecycleMutation } from "./session-lifecycle-admission-Pys9TN37.mjs";
import { K as updateSessionProfileInvolvement } from "./session-accessor-C05KQ5A3.mjs";
import { a as tryResolveSessionCompatibilityOwnerAgentId, n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { a as resolveStoredSessionKeyForAgentStore } from "./session-store-key-BoleEY7N.mjs";
import { S as applySessionEntryCanonicalReplacements, h as SessionLabelOwnerIndex } from "./session-accessor.reset-b9w8ccQ2.mjs";
import { t as assignSessionOwner } from "./session-accessor.sqlite-owner-BHSlwrCn.mjs";
import { t as SESSION_LIFECYCLE_CHANGED_ERROR_REASON } from "./lifecycle-CQXOIBZ7.mjs";
import { i as patchPluginSessionExtension } from "./host-hook-state-C4UiW1p8.mjs";
import { i as prepareSessionWorkerPlacementMutationCheck, r as prepareSessionWorkerPlacementArchiveCheck, t as SessionWorkerPlacementStopError } from "./session-placement-lifecycle-DAKgxrlj.mjs";
import { o as resolveGatewaySessionStoreTargetWithStore } from "./session-utils-store-lookup-CVR56ULk.mjs";
import { n as projectSessionPatchResult } from "./session-utils-model-CUQjuht1.mjs";
import { o as resolveCanonicalGatewaySessionStoreKey, s as resolveCanonicalSessionEntryFromStoreKeys } from "./session-utils-store-DqGvpsY3.mjs";
import { J as disableCronJobsBoundToSessions } from "./session-row-prepared-read-BZIZR-6Q.mjs";
import { i as projectSessionActor, p as resolveCurrentUserProfileDisplay, r as projectAssignableSessionOwner } from "./session-identity-projection-C0mYume0.mjs";
import { E as createSessionListEntryFilter, K as resolveSessionSharingTarget, _ as ensureSessionGroupRegistered, et as gatewayClientSessionCreator, it as isSyntheticGatewayCaller, j as authorizeIncognitoSessionTarget, z as hasSessionReadAccessChanged } from "./session-sharing-C_5FkkwM.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import "./session-utils-AxixtEyo.mjs";
import { n as isSessionStatusModelPatchOrigin, r as recordSessionStatusModelPatchOutcome } from "./session-model-patch-origin-C8lFJHHK.mjs";
import { t as triggerSessionPatchHook } from "./session-patch-hooks-sBzbk34F.mjs";
import { t as parseSessionLabel } from "./session-label-DSD-L6TD.mjs";
import { t as resolvePluginSessionOwnershipError } from "./session-plugin-ownership-BAwSgzgQ.mjs";
import { r as emitSessionsChanged } from "./session-change-event-BWFAGeR5.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { d as sessionLog, l as resolveSessionWorkerPlacementPatchError, n as isAgentMainSessionKey, o as loadSessionsRuntimeModule, s as requireSessionKey } from "./sessions-shared-DPyHwOCR.mjs";
import { t as WorkerInferenceSessionDrainBusyError } from "./inference-control-internal-Dk-ZtYoJ.mjs";
import { t as ModelAccountConnectAuthorityError } from "./model-account-connect-gjbDbUD5.mjs";
import { n as preparePersonalModelSelection } from "./users-model-account-access-DlgTxbVh.mjs";
import { n as prepareSessionPatchRuntimeSelection, r as refreshSessionPatchQueuedSelection, s as sessionToolOverridesEqual, t as persistSessionPatchModelSelection } from "./sessions-patch-model-selection-tMceuYT7.mjs";
import { n as projectSessionsPatchEntry, t as prepareSessionsPatchEntry } from "./sessions-patch-D8W3St71.mjs";
import { i as synchronizeSessionWorktreeArchive, t as SessionWorktreeLifecycleError } from "./session-worktree-lifecycle-_4PBQVm_.mjs";
import { n as prepareSessionLifecycleDrain, t as SessionLifecycleWorkspaceRecoveryError } from "./sessions-lifecycle-drain-DYMKiVPq.mjs";
import { performance } from "node:perf_hooks";
//#region src/gateway/server-methods/sessions-patch-diagnostics.ts
const SLOW_SESSION_PATCH_MS = 1e3;
const PHASES = [
	"preflight",
	"archive",
	"lifecycleAdmission",
	"snapshot",
	"projection",
	"catalog",
	"worktree",
	"commit",
	"worktreeCleanup",
	"permissions",
	"lifecycleFinalize",
	"cleanup",
	"effects",
	"response"
];
/** Fixed, request-owned elapsed totals. Parallel and nested phases can overlap. */
function startSessionPatchDiagnostics(method) {
	if (!areDiagnosticsEnabledForProcess()) return;
	const startedAt = performance.now();
	const totals = /* @__PURE__ */ new Map();
	const scopes = /* @__PURE__ */ new Set();
	let finished = false;
	return {
		scope(initialPhase) {
			if (finished) return;
			let phase = initialPhase;
			let phaseStartedAt = performance.now();
			let closed = false;
			const scope = {
				mark(nextPhase) {
					if (closed || finished) return;
					const now = performance.now();
					if (phase) {
						const total = totals.get(phase) ?? {
							elapsedMs: 0,
							count: 0
						};
						total.elapsedMs += now - phaseStartedAt;
						total.count++;
						totals.set(phase, total);
					}
					phase = nextPhase;
					phaseStartedAt = now;
				},
				finish() {
					if (closed) return;
					scope.mark();
					closed = true;
					scopes.delete(scope);
				}
			};
			scopes.add(scope);
			return scope;
		},
		finish() {
			if (finished) return;
			for (const scope of scopes) scope.finish();
			finished = true;
			if (!areDiagnosticsEnabledForProcess()) return;
			const elapsedMs = performance.now() - startedAt;
			if (elapsedMs < SLOW_SESSION_PATCH_MS) return;
			const entries = PHASES.flatMap((phase) => {
				const total = totals.get(phase);
				return total ? [[phase, total]] : [];
			});
			try {
				sessionLog.info("slow session patch", {
					method,
					elapsedMs: Math.round(elapsedMs),
					phaseDurationsMs: Object.fromEntries(entries.map(([phase, total]) => [phase, Math.round(total.elapsedMs)])),
					phaseCounts: Object.fromEntries(entries.map(([phase, total]) => [phase, total.count]))
				});
			} catch {}
		}
	};
}
//#endregion
//#region src/gateway/server-methods/session-unread-ack.ts
var session_unread_ack_exports = /* @__PURE__ */ __exportAll({
	resolveSessionUnreadAck: () => resolveSessionUnreadAck$1,
	validateSessionUnreadAck: () => validateSessionUnreadAck$1
});
const CONDITIONAL_UNREAD_ACK_ALLOWED_KEYS = /* @__PURE__ */ new Set([
	"agentId",
	"expectedLifecycleRevision",
	"expectedMarkedUnreadAt",
	"expectedSessionId",
	"key",
	"unread"
]);
function hasOtherMutation(patch) {
	return Object.entries(patch).some(([key, value]) => value !== void 0 && !CONDITIONAL_UNREAD_ACK_ALLOWED_KEYS.has(key));
}
function validateSessionUnreadAck$1(patch, target) {
	if (target.expectedMarkedUnreadAt === void 0) return;
	if (patch.unread === false && !hasOtherMutation(patch)) return;
	return "expectedMarkedUnreadAt requires unread=false as the only mutation.";
}
function resolveSessionUnreadAck$1(entry, patch) {
	const { expectedMarkedUnreadAt } = patch;
	if (patch.unread !== false || hasOtherMutation(patch) || expectedMarkedUnreadAt === void 0) return { kind: "apply" };
	if (!entry) return { kind: "missing" };
	return (entry.markedUnreadAt ?? null) === expectedMarkedUnreadAt ? { kind: "apply" } : {
		kind: "stale",
		entry
	};
}
//#endregion
//#region src/gateway/server-methods/sessions-patch-errors.ts
function invalidSessionPatchOutcome(message) {
	return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, message)
	};
}
function unexpectedPatchError(key, error) {
	if (error instanceof ModelAccountConnectAuthorityError) return errorShape(ErrorCodes.FORBIDDEN, error.message);
	if (error instanceof SessionMutationAuthorizationChangedError) return error.error;
	if (error instanceof SessionWorktreeLifecycleError) return error.reason === "session-changed" ? sessionChangedError(key) : errorShape(ErrorCodes.UNAVAILABLE, error.message, { retryable: true });
	sessionLog.warn(`sessions.patch: target failed for ${key}: ${formatErrorMessage(error)}`);
	return errorShape(ErrorCodes.UNAVAILABLE, "Session patch failed unexpectedly. Retry the request.", { retryable: true });
}
function sessionChangedError(key) {
	return errorShape(ErrorCodes.INVALID_REQUEST, `Session ${key} changed before patch. Retry.`, { details: { reason: SESSION_LIFECYCLE_CHANGED_ERROR_REASON } });
}
function createCommitGuard(key, assertCurrent) {
	return () => {
		try {
			assertCurrent?.();
			return;
		} catch (error) {
			return error instanceof SessionMutationAuthorizationChangedError ? error.error : unexpectedPatchError(key, error);
		}
	};
}
/** Every detached preparation must revalidate its exact owners at the synchronous commit. */
function assertSessionPatchCommitAllowed(params) {
	params.personalModelSelection?.assertCurrent();
	for (const guard of params.guards) {
		const error = guard();
		if (error) throw new SessionMutationAuthorizationChangedError(error);
	}
	for (const transition of params.archiveTransitions) transition.assertCommitAllowed();
}
//#endregion
//#region src/gateway/server-methods/sessions-patch-archive.ts
function releaseSessionPatchArchive(preparation) {
	try {
		preparation?.drain.release();
	} catch (error) {
		sessionLog.warn(`sessions.patch: archive drain release failed for ${preparation?.canonicalKey}: ${formatErrorMessage(error)}`);
	}
}
function archiveUnavailableError(key, message) {
	return errorShape(ErrorCodes.UNAVAILABLE, message === "active" ? `Session ${key} is still active; retry the archive.` : `Session ${key} did not finish stopping; retry the archive.`, { retryable: true });
}
function protectedArchiveError(cfg, canonicalKey) {
	if (canonicalKey === "unknown") return errorShape(ErrorCodes.INVALID_REQUEST, "Cannot archive the unknown session sentinel.");
	if (canonicalKey === "global" || isAgentMainSessionKey(cfg, canonicalKey)) return errorShape(ErrorCodes.INVALID_REQUEST, "Cannot archive an agent's main session.");
}
function archiveTargetChanged(params) {
	const { baselineEntry, currentEntry, patch } = params;
	const expectedSessionChanged = patch.expectedSessionId !== void 0 && currentEntry?.sessionId !== patch.expectedSessionId || patch.expectedLifecycleRevision !== void 0 && currentEntry?.lifecycleRevision !== patch.expectedLifecycleRevision;
	const generationChanged = baselineEntry !== void 0 && currentEntry !== void 0 && (currentEntry.sessionId !== baselineEntry.sessionId || currentEntry.lifecycleRevision !== baselineEntry.lifecycleRevision);
	return expectedSessionChanged || baselineEntry !== void 0 && currentEntry === void 0 || baselineEntry === void 0 && currentEntry !== void 0 || generationChanged;
}
async function prepareSessionPatchArchive(params) {
	const { cfg, target } = params;
	const resolveCurrent = () => {
		const freshResolved = resolveGatewaySessionStoreTargetWithStore({
			cfg,
			key: target.key,
			...target.requestedAgentId ? { agentId: target.requestedAgentId } : {},
			exactRead: true
		});
		if (freshResolved.storePath !== target.storePath) return err(sessionChangedError(target.key));
		const fresh = resolveCanonicalGatewaySessionStoreKey({
			cfg,
			key: target.key,
			store: freshResolved.store,
			agentId: target.requestedAgentId
		});
		const freshCanonicalKey = fresh.target.canonicalKey ?? target.key;
		const ownershipError = resolvePluginSessionOwnershipError({
			action: "patch",
			entry: fresh.entry,
			key: freshCanonicalKey,
			pluginOwnerId: params.pluginOwnerId
		});
		if (ownershipError) return err(ownershipError);
		if (freshCanonicalKey !== target.canonicalKey || archiveTargetChanged({
			currentEntry: fresh.entry,
			baselineEntry: target.initialEntry,
			patch: target.fullPatch
		})) return err(sessionChangedError(target.key));
		const missingHarnessSessionError = resolveMissingAgentHarnessSessionError(freshCanonicalKey, fresh.entry);
		if (missingHarnessSessionError) return err(errorShape(ErrorCodes.INVALID_REQUEST, missingHarnessSessionError));
		const protectedError = protectedArchiveError(cfg, freshCanonicalKey);
		if (protectedError) return err(protectedError);
		const placementError = resolveSessionWorkerPlacementPatchError({
			agentId: freshResolved.agentId,
			cfg,
			context: params.context,
			entry: fresh.entry,
			key: target.key,
			patch: target.fullPatch,
			sessionKey: freshCanonicalKey,
			validateModelRuntime: false
		});
		if (placementError) return err(errorShape(ErrorCodes.INVALID_REQUEST, placementError));
		return ok({
			freshResolved,
			fresh,
			freshCanonicalKey
		});
	};
	const resolved = resolveCurrent();
	if (!resolved.ok) return resolved;
	const { freshResolved, fresh, freshCanonicalKey } = resolved.value;
	const assertCurrent = () => {
		params.personalModelSelection?.assertCurrent();
		const authorizationError = params.commitGuard();
		if (authorizationError) throw new SessionMutationAuthorizationChangedError(authorizationError);
		const current = resolveCurrent();
		if (!current.ok) throw new SessionMutationAuthorizationChangedError(current.error);
	};
	const freshCandidateKeys = new Set(fresh.target.storeKeys);
	const preview = await projectSessionsPatchEntry({
		cfg,
		existingEntry: fresh.entry,
		isLabelInUse: (label) => Object.entries(freshResolved.store).some(([sessionKey, entry]) => !freshCandidateKeys.has(sessionKey) && entry.label === label),
		storeKey: fresh.primaryKey,
		agentId: target.requestedAgentId,
		patch: target.fullPatch,
		archivedBy: target.archiveActor,
		loadGatewayModelCatalogSnapshot: params.loadGatewayModelCatalogSnapshot,
		personalModelSelection: params.personalModelSelection
	});
	if (!preview.ok) return err(preview.error);
	const previewPlacementError = resolveSessionWorkerPlacementPatchError({
		agentId: freshResolved.agentId,
		cfg,
		context: params.context,
		entry: preview.entry,
		key: target.key,
		patch: target.fullPatch,
		sessionKey: freshCanonicalKey,
		validateModelRuntime: true
	});
	if (previewPlacementError) return err(errorShape(ErrorCodes.INVALID_REQUEST, previewPlacementError));
	try {
		const drain = await prepareSessionLifecycleDrain({
			action: "archive",
			authorize: assertCurrent,
			context: params.context,
			storePath: target.storePath,
			sessionKeys: Array.from(/* @__PURE__ */ new Set([
				target.key,
				target.canonicalKey,
				...target.initialStoreKeys,
				freshCanonicalKey,
				...fresh.target.storeKeys
			])),
			sessionId: fresh.entry?.sessionId,
			sessionKey: freshCanonicalKey,
			agentId: freshResolved.agentId,
			defaultAgentId: tryResolveSessionCompatibilityOwnerAgentId(cfg, freshCanonicalKey),
			lifecycleIdentities: target.lifecycleIdentities.filter((identity) => Boolean(identity))
		});
		return ok({
			canonicalKey: freshCanonicalKey,
			drain,
			...fresh.entry ? { entry: fresh.entry } : {}
		});
	} catch (error) {
		if (error instanceof SessionLifecycleWorkspaceRecoveryError) return err(error.error);
		if (error instanceof WorkerInferenceSessionDrainBusyError) return err(errorShape(ErrorCodes.UNAVAILABLE, `Session ${target.key} is already being stopped by another archive or delete request. Wait for that request to finish.`, { retryable: true }));
		if (error instanceof SessionWorkerPlacementStopError) return err(errorShape(ErrorCodes.UNAVAILABLE, error.message, { retryable: true }));
		if (error instanceof SessionMutationAuthorizationChangedError || error instanceof ModelAccountConnectAuthorityError) return err(unexpectedPatchError(target.key, error));
		sessionLog.warn(`sessions.patch: archive drain failed for ${target.canonicalKey}: ${formatErrorMessage(error)}`);
		return err(archiveUnavailableError(target.key, "stopping"));
	}
}
function validateSessionPatchArchiveProjection(params) {
	if (params.preparation.drain.hasAuthoritativeWork()) return archiveUnavailableError(params.key, "active");
	if (params.primaryKey !== params.preparation.canonicalKey || archiveTargetChanged({
		currentEntry: params.existingEntry,
		baselineEntry: params.preparation.entry,
		patch: params.fullPatch
	})) return sessionChangedError(params.key);
	return protectedArchiveError(params.cfg, params.primaryKey) ?? resolvePluginSessionOwnershipError({
		action: "patch",
		entry: params.existingEntry,
		key: params.primaryKey,
		pluginOwnerId: params.pluginOwnerId
	});
}
/** Restore before opening admission; remove only after archive metadata is durable. */
async function prepareSessionPatchArchiveTransition(params) {
	const placementTarget = {
		context: params.context,
		sessionId: params.entry.sessionId
	};
	const placement = prepareSessionWorkerPlacementArchiveCheck(placementTarget);
	let assertWorktreeMutationAllowed;
	const commitGuard = () => {
		const authorizationError = params.authorize();
		if (authorizationError) throw new SessionMutationAuthorizationChangedError(authorizationError);
		placement.assertCurrent();
		assertWorktreeMutationAllowed?.();
		if (params.preparation?.drain.hasAuthoritativeWork()) throw new SessionWorktreeLifecycleError("Session worktree is still active; retry the archive after work settles.", "busy");
	};
	const synchronize = (entry) => synchronizeSessionWorktreeArchive({
		archived: params.archived,
		entry,
		scope: params.scope,
		commitGuard,
		assertRestoreAllowed: () => {
			assertWorktreeMutationAllowed = prepareSessionWorkerPlacementMutationCheck(placementTarget);
		}
	});
	return {
		assertCommitAllowed: params.archived ? commitGuard : await synchronize(params.entry),
		afterCommit: params.archived && params.entry.worktree && !placement.cleanupPending ? async (entry) => {
			try {
				assertWorktreeMutationAllowed = prepareSessionWorkerPlacementMutationCheck(placementTarget);
				await synchronize(entry);
			} catch (error) {
				sessionLog.warn(`sessions.patch: archived worktree cleanup deferred for ${params.scope.sessionKey}: ${formatErrorMessage(error)}`);
			}
		} : void 0
	};
}
//#endregion
//#region src/gateway/server-methods/sessions-patch-catalog-preparation.ts
function createSessionPatchCatalogPreparation(loadCatalog, diagnostics) {
	const preparations = /* @__PURE__ */ new Map();
	const prepare = (agentId) => {
		let promise = preparations.get(agentId);
		if (!promise) {
			promise = (async () => {
				const timing = diagnostics?.scope("catalog");
				try {
					const catalog = await loadCatalog(agentId);
					return ok(catalog);
				} catch (error) {
					return err(error);
				} finally {
					timing?.finish();
				}
			})();
			preparations.set(agentId, promise);
		}
		return promise;
	};
	const load = async (agentId) => {
		const catalog = await prepare(agentId);
		if (!catalog.ok) throw catalog.error;
		return catalog.value;
	};
	return {
		prepare,
		load,
		available: async (agentId) => {
			const catalog = await preparations.get(agentId);
			return catalog?.ok ? catalog.value : void 0;
		},
		project: async (params) => {
			if (params.mode === "ordered") return {
				kind: "complete",
				result: await projectSessionsPatchEntry({
					...params.projection,
					loadGatewayModelCatalogSnapshot: () => load(params.agentId)
				})
			};
			const projection = prepareSessionsPatchEntry(params.projection);
			if (projection.kind === "complete") return projection;
			if (!params.catalog) return { kind: "model-catalog" };
			if (!params.catalog.ok) throw params.catalog.error;
			return {
				kind: "complete",
				result: projection.finish(params.catalog.value)
			};
		}
	};
}
//#endregion
//#region src/gateway/server-methods/sessions-patch-effects.ts
/** Publish committed patch effects even when active-runtime application later reports an error. */
async function publishSessionPatchEffects(params) {
	const archivedSessionKeys = /* @__PURE__ */ new Set();
	for (const { target, entry, accessChanged } of params.targets) {
		triggerSessionPatchHook({
			cfg: params.cfg,
			sessionEntry: entry,
			sessionKey: target.canonicalKey,
			patch: target.fullPatch
		});
		persistSessionPatchModelSelection({
			cfg: params.cfg,
			callerScopes: params.callerScopes,
			entry,
			patch: target.fullPatch,
			sessionKey: target.canonicalKey,
			targetAgentId: target.targetAgentId
		});
		emitSessionsChanged(params.context, {
			sessionKey: target.canonicalKey,
			...target.requestedAgentId ? { agentId: target.requestedAgentId } : {},
			reason: "patch",
			...target.fullPatch.model !== void 0 || target.fullPatch.agentRuntime !== void 0 ? { catalogChanged: true } : {}
		}, { accessChanged });
		if (typeof target.fullPatch.archived === "boolean") params.context.sessionActivitySummaries?.handleLifecycle({
			sessionKey: target.canonicalKey,
			agentId: target.targetAgentId,
			reason: target.fullPatch.archived ? "archive" : "unarchive"
		});
		if (target.fullPatch.archived === true) archivedSessionKeys.add(target.canonicalKey);
	}
	const category = params.category;
	if (params.targets.length > 0 && typeof category === "string" && category.trim()) {
		let catalogChanged;
		try {
			catalogChanged = await ensureSessionGroupRegistered(category);
		} catch (error) {
			sessionLog.warn(`sessions.patch: category ${JSON.stringify(category)} was saved, but group registration failed; retry the same category assignment to repair the catalog: ${formatErrorMessage(error)}`);
			catalogChanged = true;
		}
		if (catalogChanged) emitSessionsChanged(params.context, { reason: "groups" }, { catalogOnly: true });
	}
	if (params.callerCanManageCron && archivedSessionKeys.size > 0) try {
		const disabledBySession = await disableCronJobsBoundToSessions({
			cron: params.context.cron,
			cfg: params.cfg,
			sessionKeys: [...archivedSessionKeys]
		});
		for (const [sessionKey, disabledJobIds] of disabledBySession) if (disabledJobIds.length > 0) sessionLog.info(`sessions.patch: disabled cron jobs bound to archived session ${sessionKey}: ${disabledJobIds.join(", ")}`);
	} catch (error) {
		sessionLog.warn(`sessions.patch: failed to disable cron jobs for archived sessions: ${formatErrorMessage(error)}`);
	}
}
//#endregion
//#region src/gateway/server-methods/sessions-patch-expectations.ts
function resolveSessionPatchExpectationError(patch) {
	if (patch.expectedSandboxMode !== void 0 && patch.sandboxMode === void 0) return "expectedSandboxMode requires a sandboxMode replacement.";
	if (patch.expectedPermissionMode !== void 0 && patch.permissionMode === void 0) return "expectedPermissionMode requires a permissionMode replacement.";
	if (patch.expectedNativeRuntimeConsent !== void 0 && patch.nativeRuntimeConsent === void 0) return "expectedNativeRuntimeConsent requires a nativeRuntimeConsent replacement.";
	if (typeof patch.nativeRuntimeConsent === "string" && (!patch.expectedSessionId || patch.expectedPermissionMode === void 0 || patch.expectedSandboxMode === void 0 || patch.expectedNativeRuntimeConsent === void 0 || patch.permissionMode !== "full" || patch.sandboxMode !== "off")) return "Native runtime consent requires the current session and execution settings, Full access, and sandbox off.";
	if (patch.expectedToolOverrides !== void 0 && patch.toolOverrides === void 0) return "expectedToolOverrides requires a toolOverrides replacement.";
}
function resolveSessionPatchTargetError(entry, target) {
	const { fullPatch: patch, initialEntry } = target;
	return patch.expectedSessionId !== void 0 && entry?.sessionId !== patch.expectedSessionId || patch.expectedLifecycleRevision !== void 0 && entry?.lifecycleRevision !== patch.expectedLifecycleRevision || initialEntry !== void 0 && entry === void 0 || patch.archived === true && (initialEntry === void 0 ? entry !== void 0 : entry !== void 0 && (entry.sessionId !== initialEntry.sessionId || entry.lifecycleRevision !== initialEntry.lifecycleRevision)) || patch.expectedSandboxMode !== void 0 && (entry?.sandboxMode ?? null) !== patch.expectedSandboxMode || patch.expectedPermissionMode !== void 0 && (entry?.permissionMode ?? null) !== patch.expectedPermissionMode || patch.expectedNativeRuntimeConsent !== void 0 && (entry?.nativeRuntimeConsent ?? null) !== patch.expectedNativeRuntimeConsent || patch.expectedToolOverrides !== void 0 && !sessionToolOverridesEqual(entry?.toolOverrides, patch.expectedToolOverrides) ? sessionChangedError(target.key) : void 0;
}
function sessionPatchTargetIdentity(patch) {
	return {
		key: patch.key,
		...patch.agentId ? { agentId: patch.agentId } : {},
		...patch.expectedSessionId !== void 0 ? { expectedSessionId: patch.expectedSessionId } : {},
		...patch.expectedLifecycleRevision !== void 0 ? { expectedLifecycleRevision: patch.expectedLifecycleRevision } : {},
		...patch.expectedPermissionMode !== void 0 ? { expectedPermissionMode: patch.expectedPermissionMode } : {},
		...patch.expectedSandboxMode !== void 0 ? { expectedSandboxMode: patch.expectedSandboxMode } : {},
		...patch.expectedNativeRuntimeConsent !== void 0 ? { expectedNativeRuntimeConsent: patch.expectedNativeRuntimeConsent } : {},
		...patch.expectedToolOverrides !== void 0 ? { expectedToolOverrides: patch.expectedToolOverrides } : {},
		expectedMarkedUnreadAt: patch.expectedMarkedUnreadAt
	};
}
//#endregion
//#region src/gateway/server-methods/sessions-patch-replacement.ts
/** Select the canonical replacement and report no-op status selections without touching activity. */
function prepareSessionPatchReplacement(params) {
	const previousSessionKeys = params.candidateKeys.filter((sessionKey) => sessionKey !== params.primaryKey && params.workingStore[sessionKey]);
	if (isSessionStatusModelPatchOrigin() && params.existingEntry && previousSessionKeys.length === 0 && sqliteSessionEntriesEqual(params.existingEntry, {
		...params.projectedEntry,
		updatedAt: params.existingEntry.updatedAt
	})) {
		params.assertCurrent();
		return { outcome: {
			ok: true,
			applied: false,
			accessChanged: false,
			entry: params.existingEntry
		} };
	}
	return {
		replacement: {
			entry: params.projectedEntry,
			previousSessionKeys,
			sessionKey: params.primaryKey
		},
		outcome: {
			ok: true,
			applied: true,
			accessChanged: params.primaryKey !== params.canonicalKey || previousSessionKeys.length > 0 || hasSessionReadAccessChanged(params.existingEntry, params.projectedEntry),
			entry: params.labelOwners.replaceEntry(params.candidateKeys, params.primaryKey, params.projectedEntry)
		}
	};
}
//#endregion
//#region src/gateway/server-methods/sessions-patch-engine.ts
const { resolveSessionUnreadAck, validateSessionUnreadAck } = session_unread_ack_exports;
async function executeSessionPatchMutations(params) {
	const { client } = params;
	const timing = params.diagnostics?.scope("preflight");
	let personalModelSelection;
	try {
		personalModelSelection = preparePersonalModelSelection(params, params.patch.model);
	} catch (error) {
		return {
			ok: false,
			error: unexpectedPatchError(params.targets[0]?.key ?? "", error)
		};
	}
	const cfg = params.context.getRuntimeConfig();
	const operatorCreation = resolveOperatorSessionCreation(client);
	const sandbox = resolveCreatorSandbox(cfg, operatorCreation);
	const creation = {
		...operatorCreation,
		...sandbox ? { sandbox } : {}
	};
	const archiveActor = gatewayClientSessionCreator(client);
	const callerScopes = Array.isArray(client?.connect?.scopes) ? client.connect.scopes : [];
	const callerIsAdmin = client === null || callerScopes.includes("operator.admin");
	const pluginOwnerId = client?.internal?.pluginRuntimeOwnerId;
	const permissionRuntime = "permissionMode" in params.patch ? await import("./sessions-patch-permissions.runtime.js") : void 0;
	const sandboxRuntime = "sandboxMode" in params.patch || "nativeRuntimeConsent" in params.patch ? await import("./sessions-patch-sandbox.runtime.js") : void 0;
	const targetDiscoveryCache = /* @__PURE__ */ new Map();
	const preflightTargets = params.targets.map((input) => {
		const key = input.key.trim();
		const requestedAgent = resolveRequestedSessionAgentId(cfg, key, input.agentId);
		return {
			input,
			key,
			requestedAgent,
			resolved: requestedAgent.ok ? resolveGatewaySessionStoreTargetWithStore({
				cfg,
				key,
				agentId: requestedAgent.agentId,
				exactRead: true,
				targetDiscoveryCache
			}) : void 0
		};
	});
	const logicalTargets = /* @__PURE__ */ new Set();
	for (const { key, resolved } of preflightTargets) {
		if (!resolved) continue;
		const logicalId = `${resolved.storePath}\0${resolved.canonicalKey ?? key}`;
		if (logicalTargets.has(logicalId)) return invalidSessionPatchOutcome("Duplicate target.");
		logicalTargets.add(logicalId);
	}
	const outcomes = Array.from({ length: params.targets.length });
	const permissionErrors = /* @__PURE__ */ new Map();
	const prepared = [];
	const preparedByIndex = Array.from({ length: params.targets.length });
	for (const [index, { input, key, requestedAgent, resolved }] of preflightTargets.entries()) {
		const unreadAckError = validateSessionUnreadAck(params.patch, input);
		if (unreadAckError) {
			outcomes[index] = invalidSessionPatchOutcome(unreadAckError);
			continue;
		}
		if (!requestedAgent.ok) {
			outcomes[index] = requestedAgent;
			continue;
		}
		if (!resolved) {
			outcomes[index] = invalidSessionPatchOutcome("Session target could not be resolved.");
			continue;
		}
		const requestedAgentId = requestedAgent.agentId;
		const canonicalKey = resolved.canonicalKey ?? key;
		const candidateKeys = resolved.storeKeys;
		let initialEntry;
		try {
			initialEntry = resolveCanonicalSessionEntryFromStoreKeys(resolved.store, [...candidateKeys]);
		} catch (error) {
			outcomes[index] = {
				ok: false,
				error: unexpectedPatchError(key, error)
			};
			continue;
		}
		const creationError = !initialEntry && authorizeGatewaySessionCreation({
			cfg,
			client,
			agentId: resolved.agentId
		});
		if (creationError) {
			outcomes[index] = {
				ok: false,
				error: creationError
			};
			continue;
		}
		const ownershipError = resolvePluginSessionOwnershipError({
			action: "patch",
			entry: initialEntry,
			key: canonicalKey,
			pluginOwnerId
		});
		if (ownershipError) {
			outcomes[index] = {
				ok: false,
				error: ownershipError
			};
			continue;
		}
		const missingHarnessSessionError = resolveMissingAgentHarnessSessionError(canonicalKey, initialEntry);
		if (missingHarnessSessionError) {
			outcomes[index] = invalidSessionPatchOutcome(missingHarnessSessionError);
			continue;
		}
		const { commitGuard: _commitGuard, ...identity } = input;
		const fullPatch = {
			...params.patch,
			...identity
		};
		const expectationError = resolveSessionPatchExpectationError(fullPatch);
		if (expectationError) {
			outcomes[index] = invalidSessionPatchOutcome(expectationError);
			continue;
		}
		let initialPlacementPatchError;
		try {
			initialPlacementPatchError = resolveSessionWorkerPlacementPatchError({
				agentId: resolved.agentId,
				cfg,
				context: params.context,
				entry: initialEntry,
				key,
				patch: fullPatch,
				sessionKey: canonicalKey,
				validateModelRuntime: false
			});
		} catch (error) {
			outcomes[index] = {
				ok: false,
				error: unexpectedPatchError(key, error)
			};
			continue;
		}
		if (initialPlacementPatchError) {
			outcomes[index] = invalidSessionPatchOutcome(initialPlacementPatchError);
			continue;
		}
		const lifecycleIdentities = Array.from(/* @__PURE__ */ new Set([
			key,
			canonicalKey,
			...candidateKeys,
			initialEntry?.sessionId
		]));
		const preparedTarget = {
			archiveActor,
			canonicalKey,
			fullPatch,
			index,
			...initialEntry ? { initialEntry } : {},
			initialStoreKeys: [...candidateKeys],
			key,
			lifecycleIdentities,
			...requestedAgentId ? { requestedAgentId } : {},
			storePath: resolved.storePath,
			targetAgentId: resolved.agentId
		};
		prepared.push(preparedTarget);
		preparedByIndex[index] = preparedTarget;
	}
	const catalogs = createSessionPatchCatalogPreparation((agentId) => params.context.loadGatewayModelCatalogSnapshot({ agentId }), params.diagnostics);
	if (prepared.length > 0) {
		const releaseArchiveDrains = async () => prepared.forEach((target) => releaseSessionPatchArchive(target.archivePreparation));
		try {
			timing?.mark("archive");
			await Promise.all(prepared.filter((target) => target.fullPatch.archived === true).map(async (target) => {
				try {
					const result = await prepareSessionPatchArchive({
						cfg,
						commitGuard: params.targets[target.index].commitGuard,
						context: params.context,
						loadGatewayModelCatalogSnapshot: () => catalogs.load(target.targetAgentId),
						personalModelSelection,
						...pluginOwnerId ? { pluginOwnerId } : {},
						target
					});
					if (result.ok) target.archivePreparation = result.value;
					else outcomes[target.index] = result;
				} catch (error) {
					outcomes[target.index] = {
						ok: false,
						error: unexpectedPatchError(target.key, error)
					};
				}
			}));
			timing?.mark("lifecycleAdmission");
			await runExclusiveSessionLifecycleMutation({
				targets: prepared.map((target) => ({
					scope: target.storePath,
					identities: target.lifecycleIdentities
				})),
				prepare: async () => {
					for (const target of prepared) target.archivePreparation?.drain.handoffToMutation();
				},
				finalize: releaseArchiveDrains,
				run: async () => {
					timing?.mark();
					try {
						const groups = /* @__PURE__ */ new Map();
						for (const target of prepared) {
							if (target.fullPatch.archived === true && !target.archivePreparation) continue;
							const groupKey = `${target.storePath}\0${target.targetAgentId}`;
							const group = groups.get(groupKey) ?? [];
							group.push(target);
							groups.set(groupKey, group);
						}
						await Promise.all([...groups.values()].map(async (group) => {
							const first = group[0];
							const groupTiming = params.diagnostics?.scope("snapshot");
							try {
								const selectedSessionKeys = group.flatMap((target) => [
									target.key,
									target.canonicalKey,
									...target.initialStoreKeys
								]);
								const requestedLabel = parseSessionLabel(first.fullPatch.label);
								const archiveTransitions = /* @__PURE__ */ new Map();
								const commitGuards = /* @__PURE__ */ new Set();
								const assertCommitAllowed = () => {
									assertSessionPatchCommitAllowed({
										personalModelSelection,
										guards: commitGuards,
										archiveTransitions: archiveTransitions.values()
									});
								};
								const projectGroup = async (entries, admission, catalogPreparation) => {
									const workingStore = Object.fromEntries(entries.flatMap(({ entry, sessionKey }) => isInternalSessionEffectsKey(sessionKey) ? [] : [[sessionKey, entry]]));
									const labelOwners = new SessionLabelOwnerIndex(workingStore);
									const replacements = [];
									const projectedOutcomes = [];
									for (const target of group) try {
										const { entry: existingEntry, primaryKey, target: currentTarget } = resolveCanonicalGatewaySessionStoreKey({
											cfg,
											key: target.key,
											store: workingStore,
											...target.requestedAgentId ? { agentId: target.requestedAgentId } : {}
										});
										const creationError = !existingEntry && authorizeGatewaySessionCreation({
											cfg,
											client,
											agentId: target.targetAgentId
										});
										if (creationError) {
											projectedOutcomes.push({
												ok: false,
												error: creationError
											});
											continue;
										}
										const candidateKeys = currentTarget.storeKeys;
										const ownershipError = resolvePluginSessionOwnershipError({
											action: "patch",
											entry: existingEntry,
											key: primaryKey,
											pluginOwnerId
										});
										if (ownershipError) {
											projectedOutcomes.push({
												ok: false,
												error: ownershipError
											});
											continue;
										}
										const expectationError = resolveSessionPatchTargetError(existingEntry, target);
										if (expectationError) {
											projectedOutcomes.push({
												ok: false,
												error: expectationError
											});
											continue;
										}
										if (target.fullPatch.archived === true) {
											const archiveError = validateSessionPatchArchiveProjection({
												cfg,
												existingEntry,
												fullPatch: target.fullPatch,
												key: target.key,
												...pluginOwnerId ? { pluginOwnerId } : {},
												preparation: target.archivePreparation,
												primaryKey
											});
											if (archiveError) {
												projectedOutcomes.push({
													ok: false,
													error: archiveError
												});
												continue;
											}
										}
										const unreadAck = resolveSessionUnreadAck(existingEntry, target.fullPatch);
										if (unreadAck.kind === "missing") {
											projectedOutcomes.push({
												ok: false,
												error: sessionChangedError(target.key)
											});
											continue;
										}
										if (unreadAck.kind === "stale") {
											const authorizationFailure = params.targets[target.index].commitGuard();
											if (authorizationFailure) {
												projectedOutcomes.push({
													ok: false,
													error: authorizationFailure
												});
												continue;
											}
											projectedOutcomes.push({
												ok: true,
												applied: false,
												accessChanged: false,
												entry: unreadAck.entry
											});
											continue;
										}
										const projection = await catalogs.project({
											agentId: target.targetAgentId,
											mode: admission === "admitted" || group.length === 1 ? "prepare" : "ordered",
											catalog: catalogPreparation,
											projection: {
												cfg,
												creation,
												existingEntry,
												isLabelInUse: (label) => labelOwners.isLabelInUse(label, candidateKeys),
												storeKey: primaryKey,
												agentId: target.requestedAgentId,
												patch: target.fullPatch,
												archivedBy: archiveActor,
												personalModelSelection
											}
										});
										if (projection.kind === "model-catalog") return { result: projection };
										const projected = projection.result;
										if (!projected.ok) {
											projectedOutcomes.push(projected);
											continue;
										}
										const validateSandbox = sandboxRuntime ? () => sandboxRuntime.validateSessionPatchSandboxChange({
											client,
											context: params.context,
											patch: target.fullPatch,
											existingEntry,
											entry: projected.entry,
											sessionKey: primaryKey,
											storePath: target.storePath,
											lifecycleIdentities: target.lifecycleIdentities
										}) : void 0;
										const sandboxError = validateSandbox?.();
										if (sandboxError) {
											projectedOutcomes.push({
												ok: false,
												error: sandboxError
											});
											continue;
										}
										const runtimeSelection = await prepareSessionPatchRuntimeSelection({
											cfg,
											agentId: target.targetAgentId,
											patch: target.fullPatch,
											entry: projected.entry,
											expectedEntry: existingEntry,
											callerCanConsent: callerIsAdmin,
											catalog: (await catalogs.available(target.targetAgentId))?.entries,
											placement: {
												context: params.context,
												sessionKey: primaryKey
											}
										});
										if (!runtimeSelection.ok) {
											projectedOutcomes.push(runtimeSelection);
											continue;
										}
										const authorizationFailure = params.targets[target.index].commitGuard();
										if (authorizationFailure) {
											projectedOutcomes.push({
												ok: false,
												error: authorizationFailure
											});
											continue;
										}
										if (existingEntry && typeof target.fullPatch.archived === "boolean" && (existingEntry.worktree || existingEntry.archivedAt !== void 0 || target.fullPatch.archived)) {
											const worktreeTiming = params.diagnostics?.scope("worktree");
											let transition;
											try {
												transition = await prepareSessionPatchArchiveTransition({
													archived: target.fullPatch.archived,
													entry: existingEntry,
													context: params.context,
													scope: {
														agentId: target.targetAgentId,
														sessionKey: primaryKey,
														storePath: target.storePath
													},
													authorize: params.targets[target.index].commitGuard,
													preparation: target.archivePreparation
												});
											} finally {
												worktreeTiming?.finish();
											}
											archiveTransitions.set(target.index, transition);
										}
										if (permissionRuntime && existingEntry?.sessionId) {
											const permission = permissionRuntime.prepareSessionPatchPermissionChange({
												context: params.context,
												sessionId: existingEntry.sessionId,
												sessionKey: target.canonicalKey,
												agentId: target.targetAgentId,
												assertCurrent: params.targets[target.index].commitGuard
											});
											if (!permission.ok) {
												projectedOutcomes.push(permission);
												continue;
											}
											target.permissionChange = permission.change;
										}
										commitGuards.add(params.targets[target.index].commitGuard);
										if (validateSandbox) commitGuards.add(validateSandbox);
										if (runtimeSelection.validate) commitGuards.add(runtimeSelection.validate);
										const replacement = prepareSessionPatchReplacement({
											existingEntry,
											projectedEntry: projected.entry,
											primaryKey,
											canonicalKey: target.canonicalKey,
											candidateKeys,
											workingStore,
											labelOwners,
											assertCurrent: assertCommitAllowed
										});
										if (replacement.replacement) replacements.push(replacement.replacement);
										projectedOutcomes.push(replacement.outcome);
									} catch (error) {
										projectedOutcomes.push({
											ok: false,
											error: unexpectedPatchError(target.key, error)
										});
									}
									return {
										replacements,
										result: {
											kind: "complete",
											outcomes: projectedOutcomes
										}
									};
								};
								const groupStore = {
									assertCommitAllowed,
									agentId: first.targetAgentId,
									sessionKeys: selectedSessionKeys,
									...requestedLabel.ok ? { includeLabelOwners: requestedLabel.label } : {},
									storePath: first.storePath,
									skipMaintenance: true
								};
								const targetKeys = new Set(selectedSessionKeys);
								const applyGroup = async (catalog) => {
									groupTiming?.mark("snapshot");
									const admitted = await applySessionEntryCanonicalReplacements({
										...groupStore,
										update: (entries) => {
											if (typeof first.fullPatch.agentRuntime === "string" || typeof first.fullPatch.archived === "boolean" && entries.some(({ sessionKey, entry }) => targetKeys.has(sessionKey) && entry.worktree)) return { result: {
												kind: "detached",
												snapshot: entries
											} };
											groupTiming?.mark("projection");
											return projectGroup(entries, "admitted", catalog).then((operation) => {
												groupTiming?.mark("commit");
												return operation;
											});
										}
									});
									if (admitted.kind !== "detached") return admitted;
									groupTiming?.mark("projection");
									const operation = await projectGroup(admitted.snapshot, "detached", catalog);
									groupTiming?.mark("commit");
									return operation.replacements?.length ? await applySessionEntryCanonicalReplacements({
										...groupStore,
										update: (entries) => {
											assertLifecycleTargetSnapshotUnchanged(admitted.snapshot, entries, "session patch");
											return operation;
										}
									}) : operation.result;
								};
								let result = await applyGroup();
								if (result.kind === "model-catalog") {
									for (const target of group) {
										target.permissionChange?.finish();
										target.permissionChange = void 0;
									}
									commitGuards.clear();
									archiveTransitions.clear();
									groupTiming?.mark();
									result = await applyGroup(await catalogs.prepare(first.targetAgentId));
								}
								if (result.kind !== "complete") throw new Error("Session patch catalog preparation did not complete");
								const groupOutcomes = result.outcomes;
								for (const [groupIndex, target] of group.entries()) {
									const outcome = groupOutcomes[groupIndex];
									outcomes[target.index] = outcome;
									if (outcome.ok) recordSessionStatusModelPatchOutcome(outcome.applied);
									if (outcome.ok && outcome.applied) refreshSessionPatchQueuedSelection({
										cfg,
										entry: outcome.entry,
										patch: target.fullPatch,
										sessionKey: target.canonicalKey,
										agentId: target.targetAgentId,
										catalog: (await catalogs.available(target.targetAgentId))?.entries
									});
									const afterCommit = archiveTransitions.get(target.index)?.afterCommit;
									if (outcome.ok && outcome.applied && afterCommit) {
										groupTiming?.mark("worktreeCleanup");
										await afterCommit(outcome.entry);
									}
								}
							} catch (error) {
								for (const target of group) outcomes[target.index] = {
									ok: false,
									error: unexpectedPatchError(target.key, error)
								};
							} finally {
								groupTiming?.finish();
							}
						}));
						timing?.mark("permissions");
						for (const target of prepared) {
							const outcome = outcomes[target.index];
							if (!target.permissionChange || !outcome?.ok || !outcome.applied) continue;
							const error = await target.permissionChange.apply(outcome.entry.permissionMode ?? null);
							if (error) permissionErrors.set(target.index, error);
						}
					} finally {
						timing?.mark("lifecycleFinalize");
					}
				}
			});
		} finally {
			timing?.mark("cleanup");
			for (const target of prepared) target.permissionChange?.finish();
			await releaseArchiveDrains();
		}
	}
	timing?.mark("effects");
	await publishSessionPatchEffects({
		cfg,
		context: params.context,
		callerScopes,
		callerCanManageCron: callerIsAdmin,
		category: params.patch.category,
		targets: prepared.flatMap((target) => {
			const outcome = outcomes[target.index];
			return outcome?.ok && outcome.applied ? [{
				target,
				entry: outcome.entry,
				accessChanged: outcome.accessChanged
			}] : [];
		})
	});
	timing?.finish();
	for (const [index, error] of permissionErrors) outcomes[index] = {
		ok: false,
		error
	};
	return {
		ok: true,
		cfg,
		outcomes,
		preparedByIndex,
		catalogs
	};
}
//#endregion
//#region src/gateway/server-methods/sessions-mutations.ts
const sessionMutationHandlers = {
	"sessions.patchMany": async ({ params, respond, context, client, sessionMutationAuthorization }) => {
		const diagnostics = startSessionPatchDiagnostics("sessions.patchMany");
		try {
			if (!assertValidParams(params, validateSessionsPatchManyParams, "sessions.patchMany", respond)) return;
			const scopes = Array.isArray(client?.connect.scopes) ? client.connect.scopes : [];
			if ((params.patch.permissionMode === "full" || params.patch.sandboxMode !== void 0 || params.patch.nativeRuntimeConsent !== void 0) && client !== null && !scopes.includes("operator.admin")) {
				respond(false, void 0, missingScopeErrorShape({
					missingScope: ADMIN_SCOPE,
					requiredScopes: [ADMIN_SCOPE]
				}));
				return;
			}
			const targets = params.targets;
			const executed = await executeSessionPatchMutations({
				client,
				context,
				diagnostics,
				patch: params.patch,
				targets: targets.map((target) => ({
					...target,
					commitGuard: createCommitGuard(target.key.trim(), () => sessionMutationAuthorization?.assertTargetCurrent({
						sessionKey: target.key.trim(),
						...target.agentId ? { agentId: target.agentId } : {}
					}))
				}))
			});
			if (!executed.ok) {
				respond(false, void 0, executed.error);
				return;
			}
			const outcomes = [];
			diagnostics?.scope("response");
			for (const [index, outcome] of executed.outcomes.entries()) {
				const target = targets[index];
				const identity = {
					key: target.key,
					...target.agentId ? { agentId: target.agentId } : {}
				};
				outcomes.push(outcome.ok ? {
					ok: true,
					...identity
				} : {
					ok: false,
					...identity,
					error: outcome.error
				});
			}
			respond(true, { outcomes }, void 0);
		} finally {
			diagnostics?.finish();
		}
	},
	"sessions.patch": async ({ params, respond, context, client, sessionMutationAuthorization }) => {
		const diagnostics = startSessionPatchDiagnostics("sessions.patch");
		try {
			if (!assertValidParams(params, validateSessionsPatchParams, "sessions.patch", respond)) return;
			const scopes = Array.isArray(client?.connect.scopes) ? client.connect.scopes : [];
			if ((params.permissionMode === "full" || params.sandboxMode !== void 0 || params.nativeRuntimeConsent !== void 0) && client !== null && !scopes.includes("operator.admin")) {
				respond(false, void 0, missingScopeErrorShape({
					missingScope: ADMIN_SCOPE,
					requiredScopes: [ADMIN_SCOPE]
				}));
				return;
			}
			const key = requireSessionKey(params.key, respond);
			if (!key) return;
			const patch = {
				...params,
				key
			};
			const target = sessionPatchTargetIdentity(patch);
			const executed = await executeSessionPatchMutations({
				client,
				context,
				diagnostics,
				patch,
				targets: [{
					...target,
					commitGuard: createCommitGuard(target.key, sessionMutationAuthorization?.assertCurrent)
				}]
			});
			if (!executed.ok) {
				respond(false, void 0, executed.error);
				return;
			}
			const outcome = executed.outcomes[0];
			if (!outcome.ok) {
				respond(false, void 0, outcome.error);
				return;
			}
			const prepared = executed.preparedByIndex[0];
			diagnostics?.scope("response");
			const catalog = await executed.catalogs.available(prepared.targetAgentId);
			respond(true, projectSessionPatchResult({
				...prepared,
				cfg: executed.cfg,
				entry: outcome.entry,
				modelCatalog: catalog?.entries,
				modelCatalogRouteVariants: catalog?.routeVariants
			}), void 0);
		} finally {
			diagnostics?.finish();
		}
	},
	"sessions.setInvolvement": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateSessionsSetInvolvementParams, "sessions.setInvolvement", respond)) return;
		const profileId = client?.authenticatedUserProfile?.profileId;
		const profile = profileId && resolveCurrentUserProfileDisplay(profileId);
		if (!client || client.invalidated || client.connectionSignal?.aborted || isSyntheticGatewayCaller(client) || !profile || profile.kind !== "resolved") {
			respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, "Personal session visibility requires a signed-in profile."));
			return;
		}
		const cfg = context.getRuntimeConfig();
		const requestedAgent = resolveRequestedSessionAgentId(cfg, params.key, params.agentId);
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const target = resolveSessionSharingTarget({
			cfg,
			sessionKey: params.key,
			agentId: requestedAgent.agentId
		});
		if (!target || target.entry.sessionId !== params.expectedSessionId || target.entry.incognito || authorizeIncognitoSessionTarget({
			client,
			sessionKey: params.key,
			target
		}) || createSessionListEntryFilter({
			client,
			cfg
		})?.(target.storeKey, target.entry) === false) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Session is unavailable or changed. Refresh the session list."));
			return;
		}
		if (!updateSessionProfileInvolvement({
			agentId: target.agentId,
			sessionKey: target.storeKey,
			storePath: target.storePath
		}, {
			expectedSessionId: params.expectedSessionId,
			profileIds: [profile.profileId],
			change: {
				kind: "visibility",
				hidden: params.hidden
			},
			assertCurrent: () => {
				const currentCfg = context.getRuntimeConfig();
				const current = resolveSessionSharingTarget({
					cfg: currentCfg,
					sessionKey: target.canonicalKey,
					agentId: target.agentId
				});
				const currentProfile = client.authenticatedUserProfile?.profileId;
				if (client.invalidated || client.connectionSignal?.aborted || currentProfile !== profileId || !current || current.entry.sessionId !== params.expectedSessionId || current.entry.incognito || createSessionListEntryFilter({
					client,
					cfg: currentCfg
				})?.(current.storeKey, current.entry) === false) throw new SessionMutationAuthorizationChangedError(errorShape(ErrorCodes.FORBIDDEN, "Session access changed. Refresh the session list."));
			}
		})) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Session changed. Refresh the session list."));
			return;
		}
		respond(true, {
			ok: true,
			key: target.canonicalKey,
			hiddenFromInvolvingMe: params.hidden
		}, void 0);
	},
	"sessions.assignOwner": async ({ params, respond, context, client, sessionMutationAuthorization }) => {
		if (!assertValidParams(params, validateSessionsAssignOwnerParams, "sessions.assignOwner", respond)) return;
		const key = requireSessionKey(params.key, respond);
		if (!key) return;
		const runtimeAgentId = normalizeOptionalString(client?.internal?.agentRuntimeIdentity?.agentId);
		const agentToolCallerId = client?.internal?.syntheticClient === true ? normalizeOptionalString(client.internal.agentToolCaller?.agentId) : void 0;
		const trustedAgentId = runtimeAgentId ?? agentToolCallerId;
		const humanActor = gatewayClientSessionCreator(client);
		const assignedBy = trustedAgentId ? {
			type: "agent",
			id: trustedAgentId
		} : humanActor ? {
			type: "human",
			id: humanActor.id
		} : null;
		if (!assignedBy) {
			respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, "sessions.assignOwner requires an identified caller"));
			return;
		}
		const cfg = context.getRuntimeConfig();
		const requestedAgent = resolveRequestedSessionAgentId(cfg, key, params.agentId);
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const target = resolveSessionSharingTarget({
			cfg,
			sessionKey: key,
			agentId: requestedAgent.agentId
		});
		if (!target) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown session: ${key}`));
			return;
		}
		const authorizeView = (candidate) => authorizeIncognitoSessionTarget({
			client,
			sessionKey: key,
			target: candidate
		}) ?? (createSessionListEntryFilter({
			client,
			cfg
		})?.(candidate.storeKey, candidate.entry) === false ? errorShape(ErrorCodes.FORBIDDEN, "session is not visible to this connection") : null);
		const visibilityError = authorizeView(target);
		if (visibilityError) {
			respond(false, void 0, visibilityError);
			return;
		}
		const ownerIdentityById = /* @__PURE__ */ new Map();
		const projectedOwner = projectAssignableSessionOwner(params.owner, ownerIdentityById, cfg);
		if (!projectedOwner) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown session owner "${params.owner.id}"`));
			return;
		}
		const owner = {
			type: projectedOwner.type,
			id: projectedOwner.id
		};
		const assignment = await runExclusiveSessionLifecycleMutation({
			scope: target.storePath,
			identities: [target.storeKey, target.entry.sessionId],
			run: async () => assignSessionOwner({
				agentId: target.agentId,
				sessionKey: target.storeKey,
				storePath: target.storePath
			}, {
				owner,
				assignedBy,
				assertCurrent: () => {
					sessionMutationAuthorization?.assertCurrent();
					const current = resolveSessionSharingTarget({
						cfg: context.getRuntimeConfig(),
						sessionKey: target.canonicalKey,
						agentId: target.agentId
					});
					const currentError = current ? authorizeView(current) : null;
					if (!current || current.entry.sessionId !== target.entry.sessionId || current.storeKey !== target.storeKey || currentError) throw new SessionMutationAuthorizationChangedError(currentError ?? errorShape(ErrorCodes.INVALID_REQUEST, "session changed before sessions.assignOwner; retry the request"));
				}
			})
		});
		const projectedActor = assignment ? projectAssignableSessionOwner(assignment.actor, ownerIdentityById, cfg) : null;
		const projectedAssignedBy = assignment?.assignedBy ? projectSessionActor(assignment.assignedBy, /* @__PURE__ */ new Map(), cfg) : void 0;
		const projected = assignment && projectedActor ? {
			actor: projectedActor,
			...projectedAssignedBy ? { assignedBy: projectedAssignedBy } : {},
			...assignment.assignedAt !== void 0 ? { assignedAt: assignment.assignedAt } : {}
		} : void 0;
		if (!projected) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown session: ${key}`));
			return;
		}
		respond(true, {
			ok: true,
			key: target.canonicalKey,
			owner: projected
		}, void 0);
		emitSessionsChanged(context, {
			sessionKey: target.canonicalKey,
			agentId: target.agentId,
			reason: "owner"
		});
	},
	"sessions.pluginPatch": async ({ params, respond, context, client, sessionMutationAuthorization }) => {
		if (!assertValidParams(params, validateSessionsPluginPatchParams, "sessions.pluginPatch", respond)) return;
		const key = requireSessionKey(params.key, respond);
		if (!key) return;
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
		const requestedAgent = resolveRequestedSessionAgentId(context.getRuntimeConfig(), key, params.agentId);
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const canonicalKey = resolveStoredSessionKeyForAgentStore({
			cfg: context.getRuntimeConfig(),
			agentId: requestedAgent.agentId,
			sessionKey: key
		});
		const patched = await patchPluginSessionExtension({
			cfg: context.getRuntimeConfig(),
			sessionKey: canonicalKey,
			agentId: requestedAgent.agentId,
			pluginId,
			namespace,
			value: params.value,
			unset: params.unset === true,
			assertCurrent: sessionMutationAuthorization?.assertCurrent
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
			agentId: requestedAgent.agentId,
			reason: "plugin-patch"
		});
	},
	"sessions.reset": async ({ params, respond, context, client, sessionMutationAuthorization }) => {
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
			commandSource: "gateway:sessions.reset",
			creation: resolveOperatorSessionCreation(client),
			...client?.authenticatedUserProfile ? { requestingOperatorProfileId: client.authenticatedUserProfile.profileId } : {},
			...client?.internal?.operatorRoleActor ? { operatorRoleActor: client.internal.operatorRoleActor } : {},
			authorizedPluginId: normalizeOptionalString(client?.internal?.pluginRuntimeOwnerId),
			armSessionDiffBaselineCapture: true,
			workerPlacementContext: context,
			assertAuthorizedInstance: sessionMutationAuthorization?.assertCurrent,
			expectedSessionId: p.expectedSessionId
		});
		if (!result.ok) {
			respond(false, void 0, result.error);
			return;
		}
		if ("incognitoDeleted" in result) {
			respond(true, {
				ok: true,
				key: result.key,
				deleted: true
			}, void 0);
			emitSessionsChanged(context, {
				sessionKey: result.key,
				agentId: result.agentId,
				sessionId: result.deletedSessionId,
				reason: "delete"
			});
			return;
		}
		respond(true, {
			ok: true,
			key: result.key,
			entry: result.entry,
			resolved: result.resolved
		}, void 0);
		emitSessionsChanged(context, {
			sessionKey: result.key,
			agentId: result.agentId,
			reason
		});
	}
};
//#endregion
export { sessionMutationHandlers };
