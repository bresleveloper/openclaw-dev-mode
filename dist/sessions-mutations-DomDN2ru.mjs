import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { a as createSqliteLifecycleAggregateError } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { f as ModelAccountConnectAuthorityError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { t as SessionWorktreeLifecycleError } from "./errors-WYf-uyBk.mjs";
import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey, w as isSubagentSessionKey } from "./session-key-CSDERtm3.mjs";
import { t as isPluginJsonValue } from "./host-hook-json-CvItNyy3.mjs";
import { Ea as validateSessionsPluginPatchParams, La as validateSessionsSetInvolvementParams, Li as validateSessionsAssignOwnerParams, Ma as validateSessionsResetParams, Ng as errorShape, Pg as missingScopeErrorShape, Ta as validateSessionsPatchParams, wa as validateSessionsPatchManyParams } from "./src-pLJQA6J5.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import { B as SessionLabelOwnerIndex } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { t as AgentDeletionPendingError } from "./session-agent-work-admission-D63nonbM.mjs";
import { t as SESSION_LIFECYCLE_CHANGED_ERROR_REASON } from "./session-work-start-Sz_vqYld.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { l as resolveCreatorSandbox, n as authorizeGatewaySessionCreation } from "./operator-role-policy-Coro3qc5.mjs";
import { i as sessionToolOverridesEqual } from "./session-tool-overrides-B6c6gJaM.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-B6hhdgLR.mjs";
import { v as updateSessionProfileInvolvementAsync } from "./session-accessor-Czw4l8kI.mjs";
import { S as runExclusiveSessionLifecycleMutation } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { t as invalidSessionRequest } from "./session-request-error-qLiiFHUD.mjs";
import { r as resolveRequestedSessionAgentId, s as tryResolveSessionCompatibilityOwnerAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { s as resolveStoredSessionKeyForAgentStore } from "./session-store-key-DKpto8R6.mjs";
import { r as sqliteSessionEntriesEqual, t as assertLifecycleTargetSnapshotUnchanged } from "./session-accessor.sqlite-entry-equality-59qE2chV.mjs";
import { m as resolveMissingAgentHarnessSessionError } from "./agent-harness-session-key-zbrcLVpT.mjs";
import { b as applySessionEntryCanonicalReplacements, s as prepareSessionEntryMutationDatabases } from "./session-accessor.entry-mutation-DgCGNicZ.mjs";
import "./lifecycle-CKc8qk3B.mjs";
import { r as isSyntheticGatewayCaller } from "./gateway-personal-caller-BLfLqLHg.mjs";
import { i as gatewayClientSessionCreator } from "./gateway-client-identity-DXWhtQve.mjs";
import { l as hasSessionReadAccessChanged, n as authorizeIncognitoSessionTarget } from "./session-sharing-policy-vx7GWqzs.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import { t as prepareSessionMutationFacts } from "./session-sharing-preparation-DAfvBDLL.mjs";
import { r as resolveGatewaySessionStoreTargetInWorker } from "./session-utils-store-worker-u3lCvEEg.mjs";
import { r as createSessionListEntryFilter } from "./session-sharing-read-B9_xLej9.mjs";
import "./session-sharing-DuL10izq.mjs";
import { i as prepareSessionFastModePresentation } from "./operator-model-presentation-C1cUPSmr.mjs";
import { n as captureSessionEntrySourceAssertion, t as captureSessionEntryMetadataRead } from "./session-entry-source-authority-CY_NaTk4.mjs";
import { n as projectSessionPatchResult } from "./session-utils-model-Bx2gzKtO.mjs";
import { r as captureGatewayOperatorRunAuthority } from "./operator-run-authority-BcrXDfhQ.mjs";
import { i as patchPluginSessionExtension } from "./host-hook-state-CBArMttW.mjs";
import { t as disableCronJobsBoundToSessions } from "./job-session-bindings-JxvgRjIX.mjs";
import { t as resolveCurrentUserProfileDisplay } from "./current-user-profile-display-84IsFWS2.mjs";
import { i as projectSessionActor, r as projectAssignableSessionOwner } from "./session-identity-projection-sgwF_hD_.mjs";
import { t as readAcpSessionMetaForEntries } from "./session-meta-readonly-CHaonIQO.mjs";
import { c as resolveCanonicalSessionEntryFromStoreKeys, s as resolveCanonicalGatewaySessionStoreKey } from "./session-utils-store-lW7Wu3P0.mjs";
import { n as emitSessionsChanged } from "./session-change-event-0LxChmzi.mjs";
import { n as resolveOperatorSessionCreation } from "./session-creation-provenance-CZ3I7AOG.mjs";
import { t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { a as prepareSessionWorkerPlacementMutationCheck, i as prepareSessionWorkerPlacementArchiveCheckAsync, t as SessionWorkerPlacementStopError } from "./session-placement-lifecycle-CAT_zN-p.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-ClTdEKsf.mjs";
import { n as isSessionStatusModelPatchOrigin, r as recordSessionStatusModelPatchOutcome } from "./session-model-patch-origin-7_HzyeSY.mjs";
import { t as triggerSessionPatchHook } from "./session-patch-hooks-Bgv6_R3W.mjs";
import { t as parseSessionLabel } from "./session-label-DSD-L6TD.mjs";
import { n as withGatewaySessionEntryReadOnly } from "./session-utils-read-lifetime-CQKtyavc.mjs";
import "./session-utils-CGx9I2of.mjs";
import { r as restoreSessionWorktree } from "./session-worktree-lifecycle-BMwsFta4.mjs";
import { r as prepareGatewaySessionLifecycleTargets } from "./session-lifecycle-preparation-CelOZMyq.mjs";
import { t as resolvePluginSessionOwnershipError } from "./session-plugin-ownership-D5Z0-DHb.mjs";
import { n as WorkerInferenceSessionDrainBusyError } from "./inference-control-internal-Bk4Jd75M.mjs";
import { t as createPhaseTimings } from "./phase-timings-CyAGitir.mjs";
import { t as sessionLog } from "./session-log-BKA9lku6.mjs";
import { n as prepareSessionLifecycleDrain, t as SessionLifecycleWorkspaceRecoveryError } from "./sessions-lifecycle-drain-bs9bSf42.mjs";
import { n as preparePersonalModelSelection } from "./users-model-account-access-CmjctvSj.mjs";
import { a as requireSessionKey, i as prepareSessionWorkerPlacementPatchValidation, o as resolveProtectedSessionVisibilityError } from "./sessions-shared-DECO-QN2.mjs";
import { i as refreshSessionPatchQueuedSelection, r as prepareSessionPatchRuntimeSelection, t as persistSessionPatchModelSelection } from "./sessions-patch-model-selection-HDHD8IDv.mjs";
import { r as sharingExpectedEntry } from "./sessions-sharing-authority-D3-YNQkH.mjs";
import { i as loadSessionLifecycleRuntime, n as projectSessionsPatchEntry, r as session_unread_ack_exports, t as prepareSessionsPatchEntry } from "./sessions-patch-CVUsUuuY.mjs";
import { n as createSessionModelCatalogWait, t as SessionModelCatalogUnavailableError } from "./session-model-catalog-wait-_D49l19T.mjs";
import { t as registerCommittedSessionCategory } from "./session-create-category-BCvaT6Og.mjs";
import { n as assignSessionOwnerInWorker } from "./session-metadata-write.async-Bn8QH4ek.mjs";
import { isDeepStrictEqual } from "node:util";
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
	"runtimeSelection",
	"archivePlacement",
	"worktree",
	"commit",
	"permissions",
	"lifecycleFinalize",
	"cleanup",
	"effects",
	"cronEffects",
	"response"
];
/** Fixed, request-owned elapsed totals. Parallel and nested phases can overlap. */
function startSessionPatchDiagnostics(method) {
	const startedAt = performance.now();
	const timing = createPhaseTimings();
	let finished = false;
	return {
		scope: (phase) => finished ? void 0 : timing.scope(phase),
		finish() {
			if (finished) return;
			timing.flush(performance.now());
			timing.close();
			finished = true;
			const elapsedMs = performance.now() - startedAt;
			if (elapsedMs < SLOW_SESSION_PATCH_MS) return;
			try {
				let message = `slow session patch ${Math.round(elapsedMs)}ms method=${method}`;
				for (const phase of PHASES) {
					const total = timing.totals.get(phase);
					if (total !== void 0) message += ` ${phase}=${Math.round(total)}ms`;
				}
				sessionLog.info(message);
			} catch {}
		}
	};
}
//#endregion
//#region src/gateway/server-methods/sessions-patch-errors.ts
function unexpectedPatchError(key, error) {
	if (error instanceof AgentDeletionPendingError) return errorShape(ErrorCodes.UNAVAILABLE, error.message);
	if (error instanceof SessionModelCatalogUnavailableError) return error.error;
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
			return unexpectedPatchError(key, error);
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
//#region src/gateway/server-methods/sessions-patch-sidebar-ancestors.ts
/** Follow authoritative lineage, never caller-supplied lookup keys, and retain worker-prepared facts. */
async function prepareSessionPatchSidebarAncestors(params) {
	let active = true;
	const retained = [];
	const changed = () => new SessionMutationAuthorizationChangedError(sessionChangedError(params.key));
	const parentKey = (entry) => normalizeOptionalString(entry.parentSessionKey) ?? normalizeOptionalString(entry.spawnedBy);
	const release = () => {
		active = false;
		for (const { read } of retained.splice(0).toReversed()) read.release();
	};
	const assertCurrent = () => {
		params.assertCallerCurrent();
		if (!active) throw changed();
		try {
			const cfg = params.getCurrentConfig();
			for (const { read, sessionId, lifecycleRevision, parent, ancestor, expected } of retained) {
				const entry = read.readCurrent(cfg).target?.entry;
				if (!entry || entry.sessionId !== sessionId || entry.lifecycleRevision !== lifecycleRevision || parentKey(entry) !== parent || ancestor && entry.archivedAt !== void 0 || expected && (entry.sessionId !== expected.expectedSessionId || entry.sidebarRoot === true !== expected.expectedSidebarRoot || (entry.category ?? null) !== expected.expectedCategory)) throw changed();
			}
		} catch {
			throw changed();
		}
	};
	try {
		let key = params.key;
		let agentId = params.agentId;
		let matched = 0;
		const visited = /* @__PURE__ */ new Set();
		while (key && (retained.length === 0 || matched < params.ancestors.length)) {
			assertCurrent();
			const identity = agentId + "\0" + key;
			if (visited.has(identity) || retained.length >= 256) throw changed();
			visited.add(identity);
			const read = await prepareSessionMutationFacts({
				cfg: params.cfg,
				sessionKey: key,
				agentId
			});
			let adopted = false;
			try {
				assertCurrent();
				const target = read.readCurrent(params.getCurrentConfig()).target;
				if (!target) throw changed();
				const expected = retained.length > 0 && !isSubagentSessionKey(target.canonicalKey) ? params.ancestors[matched++] : void 0;
				if (expected && (expected.key.trim() !== target.canonicalKey || expected.agentId !== void 0 && expected.agentId !== target.agentId)) throw changed();
				retained.push({
					read,
					sessionId: target.entry.sessionId,
					lifecycleRevision: target.entry.lifecycleRevision,
					parent: parentKey(target.entry),
					ancestor: retained.length > 0,
					expected
				});
				adopted = true;
				key = parentKey(target.entry);
				agentId = parseAgentSessionKey(key)?.agentId ?? target.agentId;
			} finally {
				if (!adopted) read.release();
			}
		}
		if (matched !== params.ancestors.length) throw changed();
		assertCurrent();
		return {
			assertCurrent,
			release
		};
	} catch (error) {
		release();
		if (error instanceof SessionMutationAuthorizationChangedError) throw error;
		throw changed();
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
	return patch.expectedSessionId !== void 0 && entry?.sessionId !== patch.expectedSessionId || patch.expectedSidebarRoot !== void 0 && entry?.sidebarRoot === true !== patch.expectedSidebarRoot || patch.expectedCategory !== void 0 && (entry?.category ?? null) !== patch.expectedCategory || patch.expectedArchived !== void 0 && entry?.archivedAt !== void 0 !== patch.expectedArchived || patch.expectedLifecycleRevision !== void 0 && entry?.lifecycleRevision !== patch.expectedLifecycleRevision || initialEntry !== void 0 && entry === void 0 || patch.archived === true && (initialEntry === void 0 ? entry !== void 0 : entry !== void 0 && (entry.sessionId !== initialEntry.sessionId || entry.lifecycleRevision !== initialEntry.lifecycleRevision)) || patch.expectedSandboxMode !== void 0 && (entry?.sandboxMode ?? null) !== patch.expectedSandboxMode || patch.expectedPermissionMode !== void 0 && (entry?.permissionMode ?? null) !== patch.expectedPermissionMode || patch.expectedNativeRuntimeConsent !== void 0 && (entry?.nativeRuntimeConsent ?? null) !== patch.expectedNativeRuntimeConsent || patch.expectedToolOverrides !== void 0 && !sessionToolOverridesEqual(entry?.toolOverrides, patch.expectedToolOverrides) ? sessionChangedError(target.key) : void 0;
}
/** Prepare original writers and bind their facts before patch projection can acquire admission. */
async function prepareSessionPatchTargets(params) {
	let operatorAuthority;
	const ready = params.operatorAuthority ? params.operatorAuthority.then((captured) => {
		operatorAuthority = captured?.authority;
		operatorAuthority?.assertCurrent();
	}) : Promise.resolve();
	const selected = params.operatorAuthority ? params.prepared : [];
	const durableTargets = selected.filter((target) => !isIncognitoSessionKey(target.canonicalKey));
	const databaseCustody = prepareSessionEntryMutationDatabases(durableTargets.map((target) => ({
		scope: {
			agentId: target.targetAgentId,
			sessionKey: target.canonicalKey,
			storePath: target.storePath
		},
		assertCurrent: () => {
			assertSessionPatchCommitAllowed({
				personalModelSelection: params.personalModelSelection,
				guards: [params.originalCommitGuards[target.index]],
				archiveTransitions: []
			});
			operatorAuthority?.assertCurrent();
		}
	})), ready);
	const storage = /* @__PURE__ */ new Map();
	const storagePreparations = new Map(durableTargets.map((target, index) => [target.index, databaseCustody.preparations[index].then((prepared) => {
		storage.set(target.index, prepared);
		return prepared;
	})]));
	let targetCustody;
	const ancestorReads = [];
	const release = async () => {
		for (const ancestors of ancestorReads.splice(0)) ancestors.release();
		const errors = [];
		try {
			await targetCustody?.[Symbol.asyncDispose]();
		} catch (error) {
			errors.push(error);
		}
		try {
			await databaseCustody[Symbol.asyncDispose]();
		} catch (error) {
			errors.push(error);
		}
		if (errors.length) throw createSqliteLifecycleAggregateError(errors, "Session patch preparation cleanup failed", errors[0]);
	};
	try {
		targetCustody = prepareGatewaySessionLifecycleTargets({
			cfg: params.cfg,
			getCurrentConfig: params.getCurrentConfig,
			targets: selected.map((target) => {
				const storageReady = storagePreparations.get(target.index);
				return {
					target: {
						agentId: target.targetAgentId,
						canonicalKey: target.canonicalKey,
						storePath: target.storePath
					},
					entry: target.initialEntry,
					...storageReady ? { storageReady } : {}
				};
			})
		});
		await ready;
		for (const [index, preparation] of targetCustody.preparations.entries()) {
			const target = selected[index];
			const result = await preparation.then((facts) => ({ facts }), (error) => ({ error }));
			const originalGuard = params.originalCommitGuards[target.index];
			const guard = () => {
				try {
					assertSessionPatchCommitAllowed({
						personalModelSelection: params.personalModelSelection,
						guards: [originalGuard],
						archiveTransitions: []
					});
					operatorAuthority?.assertCurrent();
					if ("error" in result) throw result.error instanceof Error ? result.error : new Error("Session target preparation failed", { cause: result.error });
					return result.facts.matchesCurrent(params.getCurrentConfig()) ? void 0 : sessionChangedError(target.key);
				} catch (error) {
					return unexpectedPatchError(target.key, error);
				}
			};
			params.mutationTargets[target.index].commitGuard = guard;
			if ("error" in result) params.outcomes[target.index] = {
				ok: false,
				error: expectDefined(guard(), "failed session preparation error")
			};
		}
		for (const target of params.prepared) {
			const ancestors = target.fullPatch.expectedSidebarAncestors;
			if (!ancestors?.length || params.outcomes[target.index] !== void 0) continue;
			const originalGuard = params.mutationTargets[target.index].commitGuard;
			try {
				const read = await prepareSessionPatchSidebarAncestors({
					cfg: params.cfg,
					getCurrentConfig: params.getCurrentConfig,
					key: target.canonicalKey,
					agentId: target.targetAgentId,
					ancestors,
					assertCallerCurrent: () => assertSessionPatchCommitAllowed({
						guards: [originalGuard],
						archiveTransitions: []
					})
				});
				ancestorReads.push(read);
				params.mutationTargets[target.index].commitGuard = () => {
					try {
						read.assertCurrent();
						return;
					} catch (error) {
						return unexpectedPatchError(target.key, error);
					}
				};
			} catch (error) {
				params.outcomes[target.index] = {
					ok: false,
					error: unexpectedPatchError(target.key, error)
				};
			}
		}
		return {
			operatorAuthority,
			prepared: params.prepared.filter((target) => params.outcomes[target.index] === void 0),
			storage,
			[Symbol.asyncDispose]: release
		};
	} catch (error) {
		try {
			await release();
		} catch (cleanupError) {
			throw createSqliteLifecycleAggregateError([error, cleanupError], "Session patch preparation and cleanup failed", error);
		}
		throw error;
	}
}
//#endregion
//#region src/gateway/server-methods/sessions-patch-archive.ts
async function releaseSessionPatchArchive(preparation) {
	try {
		try {
			preparation?.drain.release();
		} finally {
			await preparation?.releaseSource?.();
		}
	} catch (error) {
		sessionLog.warn(`sessions.patch: archive drain release failed for ${preparation?.canonicalKey}: ${formatErrorMessage(error)}`);
	}
}
function archiveUnavailableError(key, message) {
	return errorShape(ErrorCodes.UNAVAILABLE, message === "active" ? `Session ${key} is still active; retry the archive.` : `Session ${key} did not finish stopping; retry the archive.`, { retryable: true });
}
function archiveTargetChanged(params) {
	const { baselineEntry, currentEntry, patch } = params;
	return patch.expectedSessionId !== void 0 && currentEntry?.sessionId !== patch.expectedSessionId || patch.expectedLifecycleRevision !== void 0 && currentEntry?.lifecycleRevision !== patch.expectedLifecycleRevision || baselineEntry === void 0 !== (currentEntry === void 0) || currentEntry?.sessionId !== baselineEntry?.sessionId || currentEntry?.lifecycleRevision !== baselineEntry?.lifecycleRevision;
}
const archivePolicyFields = [
	"sessionId",
	"lifecycleRevision",
	"archivedAt",
	"sandbox",
	"sandboxMode",
	"permissionMode",
	"nativeRuntimeConsent",
	"agentHarnessId",
	"pluginOwnerId",
	"agentRuntimeOverride",
	"authProfileOverride",
	"modelSelectionLocked",
	"toolOverrides",
	"modelOverride",
	"providerOverride",
	"modelOverrideRouteResolution",
	"modelOverrideFallbackOriginProvider",
	"modelOverrideFallbackOriginModel"
];
async function prepareSessionPatchArchive(params) {
	const metadata = captureSessionEntryMetadataRead({
		agentId: params.target.requestedAgentId,
		sessionKey: params.target.canonicalKey,
		storePath: params.target.storePath
	}, () => {
		const error = params.commitGuard();
		if (error) throw new SessionMutationAuthorizationChangedError(error);
	});
	if (metadata) return withGatewaySessionEntryReadOnly({
		cfg: params.cfg,
		key: params.target.key,
		agentId: params.target.requestedAgentId
	}, async (selected) => prepareSessionPatchArchiveFromSource(params, {
		selected,
		readCurrent: () => metadata.readCurrent()
	}));
	const selected = params.target.initialTarget;
	const source = await captureSessionEntrySourceAssertion({
		scope: {
			agentId: selected.agentId,
			sessionKey: selected.canonicalKey,
			storePath: selected.storePath
		},
		readSource: selected.capturedReadSource,
		expected: params.target.initialEntry,
		fields: [
			...archivePolicyFields,
			...params.target.fullPatch.expectedSidebarRoot !== void 0 ? ["sidebarRoot"] : [],
			...params.target.fullPatch.expectedCategory !== void 0 ? ["category"] : []
		],
		assertCurrent: () => {
			params.personalModelSelection?.assertCurrent();
			const error = params.commitGuard();
			if (error) throw new SessionMutationAuthorizationChangedError(error);
		},
		refuse: () => {
			throw new SessionMutationAuthorizationChangedError(sessionChangedError(params.target.key));
		}
	}).prepareSessionSource();
	let transferred = false;
	try {
		const result = await prepareSessionPatchArchiveFromSource(params, {
			selected,
			readCurrent: () => params.target.initialEntry,
			isCurrent: () => {
				source.assertCurrent();
				return true;
			}
		});
		if (result.ok) {
			result.value.releaseSource = source.release;
			transferred = true;
		}
		return result;
	} finally {
		if (!transferred) await source.release?.();
	}
}
async function prepareSessionPatchArchiveFromSource(params, source) {
	const { cfg, target } = params;
	const selected = source.selected;
	const canonicalKey = selected.canonicalKey;
	const resolveCurrent = () => {
		if (source.isCurrent?.() === false || selected.storePath !== target.storePath) return err(sessionChangedError(target.key));
		const entry = source.readCurrent();
		const ownershipError = resolvePluginSessionOwnershipError({
			action: "patch",
			entry,
			key: canonicalKey,
			pluginOwnerId: params.pluginOwnerId
		});
		if (ownershipError) return err(ownershipError);
		if (canonicalKey !== target.canonicalKey || archiveTargetChanged({
			currentEntry: entry,
			baselineEntry: target.initialEntry,
			patch: target.fullPatch
		}) || archivePolicyFields.some((field) => !isDeepStrictEqual(entry?.[field], selected.store[canonicalKey]?.[field]))) return err(sessionChangedError(target.key));
		const expectationError = resolveSessionPatchTargetError(entry, target);
		if (expectationError) return err(expectationError);
		const missingHarnessSessionError = resolveMissingAgentHarnessSessionError(canonicalKey, entry);
		if (missingHarnessSessionError) return err(errorShape(ErrorCodes.INVALID_REQUEST, missingHarnessSessionError));
		const protectedError = resolveProtectedSessionVisibilityError(cfg, canonicalKey, "archive");
		if (protectedError) return err(protectedError);
		return ok(entry);
	};
	const resolved = resolveCurrent();
	if (!resolved.ok) return resolved;
	const entry = resolved.value;
	const planningEntry = selected.store[canonicalKey];
	const candidateKeys = new Set(selected.storeKeys);
	const preview = await projectSessionsPatchEntry({
		cfg,
		existingEntry: planningEntry,
		isLabelInUse: (label) => Object.entries(selected.store).some(([sessionKey, candidate]) => !candidateKeys.has(sessionKey) && candidate.label === label),
		storeKey: canonicalKey,
		agentId: target.requestedAgentId,
		patch: target.fullPatch,
		archivedBy: target.archiveActor,
		loadGatewayModelCatalogSnapshot: params.loadGatewayModelCatalogSnapshot,
		personalModelSelection: params.personalModelSelection
	});
	if (!preview.ok) return err(preview.error);
	const placementValidation = await prepareSessionWorkerPlacementPatchValidation({
		agentId: selected.agentId,
		cfg,
		context: params.context,
		entry: preview.entry,
		key: target.key,
		patch: target.fullPatch,
		sessionKey: canonicalKey,
		validateModelRuntime: true
	});
	const assertCurrent = () => {
		params.personalModelSelection?.assertCurrent();
		const authorizationError = params.commitGuard();
		if (authorizationError) throw new SessionMutationAuthorizationChangedError(authorizationError);
		const placementError = placementValidation.validate();
		if (placementError) throw new SessionMutationAuthorizationChangedError(errorShape(ErrorCodes.INVALID_REQUEST, placementError));
		const current = resolveCurrent();
		if (!current.ok) throw new SessionMutationAuthorizationChangedError(current.error);
	};
	let transferred = false;
	try {
		const drain = await prepareSessionLifecycleDrain({
			action: "archive",
			authorize: assertCurrent,
			context: params.context,
			storePath: target.storePath,
			sessionKeys: Array.from(/* @__PURE__ */ new Set([
				target.key,
				target.canonicalKey,
				...target.initialTarget.storeKeys,
				canonicalKey,
				...selected.storeKeys
			])),
			sessionId: entry?.sessionId,
			session: {
				ok: true,
				value: {
					cfg,
					storePath: target.storePath,
					entry,
					canonicalKey,
					agentId: selected.agentId
				}
			},
			sessionKey: canonicalKey,
			agentId: selected.agentId,
			defaultAgentId: tryResolveSessionCompatibilityOwnerAgentId(cfg, canonicalKey),
			lifecycleIdentities: target.lifecycleIdentities.filter((identity) => Boolean(identity))
		});
		transferred = true;
		return ok({
			canonicalKey,
			drain: {
				...drain,
				release: () => {
					try {
						drain.release();
					} finally {
						placementValidation.release();
					}
				}
			},
			...planningEntry ? { entry: planningEntry } : {}
		});
	} catch (error) {
		if (error instanceof SessionLifecycleWorkspaceRecoveryError) return err(error.error);
		if (error instanceof WorkerInferenceSessionDrainBusyError) return err(errorShape(ErrorCodes.UNAVAILABLE, `Session ${target.key} is already being stopped by another archive or delete request. Wait for that request to finish.`, { retryable: true }));
		if (error instanceof SessionWorkerPlacementStopError) return err(errorShape(ErrorCodes.UNAVAILABLE, error.message, { retryable: true }));
		if (error instanceof SessionMutationAuthorizationChangedError || error instanceof ModelAccountConnectAuthorityError) return err(unexpectedPatchError(target.key, error));
		sessionLog.warn(`sessions.patch: archive drain failed for ${target.canonicalKey}: ${formatErrorMessage(error)}`);
		return err(archiveUnavailableError(target.key, "stopping"));
	} finally {
		if (!transferred) placementValidation.release();
	}
}
function validateSessionPatchArchiveProjection(params) {
	if (params.preparation.drain.hasAuthoritativeWork()) return archiveUnavailableError(params.key, "active");
	if (params.primaryKey !== params.preparation.canonicalKey || archiveTargetChanged({
		currentEntry: params.existingEntry,
		baselineEntry: params.preparation.entry,
		patch: params.fullPatch
	})) return sessionChangedError(params.key);
	return resolveProtectedSessionVisibilityError(params.cfg, params.primaryKey, "archive") ?? resolvePluginSessionOwnershipError({
		action: "patch",
		entry: params.existingEntry,
		key: params.primaryKey,
		pluginOwnerId: params.pluginOwnerId
	});
}
/** Restore before opening admission; durable archive metadata delegates removal to GC. */
async function prepareSessionPatchArchiveTransition(params) {
	const placementTarget = {
		context: params.context,
		sessionId: params.entry.sessionId
	};
	const placement = await prepareSessionWorkerPlacementArchiveCheckAsync(placementTarget);
	let assertWorktreeMutationAllowed;
	const commitGuard = () => {
		const authorizationError = params.authorize();
		if (authorizationError) throw new SessionMutationAuthorizationChangedError(authorizationError);
		placement.assertCurrent();
		assertWorktreeMutationAllowed?.();
		if (params.preparation?.drain.hasAuthoritativeWork()) throw new SessionWorktreeLifecycleError("Session worktree is still active; retry the archive after work settles.", "busy");
	};
	return { assertCommitAllowed: params.archived ? commitGuard : await restoreSessionWorktree({
		entry: params.entry,
		scope: params.scope,
		commitGuard,
		assertRestoreAllowed: () => {
			assertWorktreeMutationAllowed = prepareSessionWorkerPlacementMutationCheck(placementTarget);
		}
	}) };
}
//#endregion
//#region src/gateway/server-methods/sessions-patch-catalog-preparation.ts
function createSessionPatchCatalogPreparation(loadCatalog, diagnostics) {
	const preparations = /* @__PURE__ */ new Map();
	const prepare = (agentId) => getOrCreatePromise(preparations, agentId, async () => {
		const timing = diagnostics?.scope("catalog");
		try {
			return ok(await loadCatalog(agentId));
		} catch (error) {
			return err(error);
		} finally {
			timing?.finish();
		}
	});
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
			const projection = await prepareSessionsPatchEntry(params.projection);
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
//#region src/gateway/server-methods/sessions-patch-discovery.ts
/** Resolve each patch target once and reject aliases targeting the same logical session. */
async function discoverSessionPatchTargets(cfg, targets) {
	const prepared = await Promise.all(targets.map(async (input) => {
		const key = input.key.trim();
		const requestedAgent = resolveRequestedSessionAgentId(cfg, key, input.agentId);
		return {
			input,
			key,
			requestedAgent,
			resolved: requestedAgent.ok ? await resolveGatewaySessionStoreTargetInWorker({
				cfg,
				key,
				agentId: requestedAgent.agentId
			}) : void 0
		};
	}));
	const logicalTargets = /* @__PURE__ */ new Set();
	for (const { key, resolved } of prepared) {
		if (!resolved) continue;
		const logicalId = `${resolved.storePath}\0${resolved.canonicalKey ?? key}`;
		if (logicalTargets.has(logicalId)) return invalidSessionRequest("Duplicate target.");
		logicalTargets.add(logicalId);
	}
	return ok(prepared);
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
	if (params.callerCanManageCron && archivedSessionKeys.size > 0) {
		const timing = params.diagnostics?.scope("cronEffects");
		try {
			const disabledBySession = await disableCronJobsBoundToSessions({
				cron: params.context.cron,
				cfg: params.cfg,
				sessionKeys: [...archivedSessionKeys]
			});
			for (const [sessionKey, disabledJobIds] of disabledBySession) if (disabledJobIds.length > 0) sessionLog.info(`sessions.patch: disabled cron jobs bound to archived session ${sessionKey}: ${disabledJobIds.join(", ")}`);
		} catch (error) {
			sessionLog.warn(`sessions.patch: failed to disable cron jobs for archived sessions: ${formatErrorMessage(error)}`);
		} finally {
			timing?.finish();
		}
	}
	return archivedSessionKeys.size > 0;
}
/** Only applied assignments may repair the catalog; detached and status-model no-ops cannot. */
function createSessionPatchCategoryRegistration(params) {
	const category = params.patch.category;
	return async (result, source) => {
		if (typeof category === "string" && result.kind === "complete" && result.outcomes.some((outcome) => outcome.ok && outcome.applied && outcome.entry.category === category.trim())) await registerCommittedSessionCategory(category, params.context, source);
	};
}
//#endregion
//#region src/gateway/server-methods/sessions-patch-groups.ts
/** Tree archival commits descendants before ancestors, including across physical stores. */
async function runSessionPatchGroups(targets, apply) {
	const ready = targets.filter((target) => target.fullPatch.archived !== true || target.archivePreparation !== void 0);
	if (ready.some((target) => target.fullPatch.archived === true && target.fullPatch.expectedSidebarAncestors !== void 0)) {
		for (const target of ready.toSorted((a, b) => (b.fullPatch.expectedSidebarAncestors?.length ?? 0) - (a.fullPatch.expectedSidebarAncestors?.length ?? 0))) await apply([target]);
		return;
	}
	const groups = /* @__PURE__ */ new Map();
	for (const target of ready) {
		const key = target.storePath + "\0" + target.targetAgentId;
		const group = groups.get(key) ?? [];
		group.push(target);
		groups.set(key, group);
	}
	await Promise.all([...groups.values()].map(apply));
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
			accessChanged: params.primaryKey !== params.canonicalKey || previousSessionKeys.length > 0 || !params.existingEntry?.lifecycleRevision?.trim() || hasSessionReadAccessChanged(params.existingEntry, params.projectedEntry),
			entry: params.labelOwners.replaceEntry(params.candidateKeys, params.primaryKey, params.projectedEntry)
		}
	};
}
/** Keep ordinary projection in one writer admission; detached preparation must revalidate its snapshot. */
function createSessionPatchGroupWriter(params) {
	const requestedLabel = parseSessionLabel(params.patch.label);
	const store = {
		...params.store,
		...requestedLabel.ok ? { includeLabelOwners: requestedLabel.label } : {}
	};
	const targetKeys = new Set(store.sessionKeys);
	return async (catalog) => {
		params.timing?.mark("snapshot");
		const admitted = await applySessionEntryCanonicalReplacements({
			...store,
			update: (entries) => {
				if (typeof params.patch.agentRuntime === "string" || typeof params.patch.model === "string" || typeof params.patch.nativeRuntimeConsent === "string" || params.patch.archived === false && entries.some(({ sessionKey, entry }) => targetKeys.has(sessionKey) && entry.worktree)) return { result: {
					kind: "detached",
					snapshot: entries
				} };
				params.timing?.mark("projection");
				return params.project(entries, "admitted", catalog).then((operation) => {
					params.timing?.mark("commit");
					return operation;
				});
			}
		});
		if (admitted.kind !== "detached") return admitted;
		params.timing?.mark("projection");
		const operation = await params.project(admitted.snapshot, "detached", catalog);
		params.timing?.mark("commit");
		return operation.replacements?.length ? await applySessionEntryCanonicalReplacements({
			...store,
			update: (entries) => {
				assertLifecycleTargetSnapshotUnchanged(admitted.snapshot, entries, "session patch");
				return operation;
			}
		}) : operation.result;
	};
}
//#endregion
//#region src/gateway/server-methods/sessions-patch-engine.ts
const { resolveSessionUnreadAck, validateSessionUnreadAck } = session_unread_ack_exports;
async function executeSessionPatchMutations(params) {
	try {
		var _usingCtx$1 = _usingCtx();
		const { client } = params;
		const timing = params.diagnostics?.scope("preflight");
		let personalModelSelection;
		try {
			personalModelSelection = await preparePersonalModelSelection(params, params.patch.model);
		} catch (error) {
			return {
				ok: false,
				error: unexpectedPatchError(params.targets[0]?.key ?? "", error)
			};
		}
		const getCurrentConfig = params.context.getRuntimeConfig;
		const cfg = getCurrentConfig();
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
		const discovery = await discoverSessionPatchTargets(cfg, params.targets);
		if (!discovery.ok) return discovery;
		const targetAccessError = (entry, agentId, key) => !entry && authorizeGatewaySessionCreation({
			cfg,
			client,
			agentId
		}) || resolvePluginSessionOwnershipError({
			action: "patch",
			entry,
			key,
			pluginOwnerId
		});
		const outcomes = Array.from({ length: params.targets.length });
		const permissionErrors = /* @__PURE__ */ new Map();
		const placementChecks = /* @__PURE__ */ new Map();
		_usingCtx$1.u({ [Symbol.dispose]: () => {
			for (const validation of placementChecks.values()) validation.release();
		} });
		const prepared = [];
		const preparedByIndex = Array.from({ length: params.targets.length });
		for (const [index, { input, key, requestedAgent, resolved }] of discovery.value.entries()) {
			const unreadAckError = validateSessionUnreadAck(params.patch, input);
			if (unreadAckError) {
				outcomes[index] = invalidSessionRequest(unreadAckError);
				continue;
			}
			if (!requestedAgent.ok) {
				outcomes[index] = requestedAgent;
				continue;
			}
			if (!resolved) {
				outcomes[index] = invalidSessionRequest("Session target could not be resolved.");
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
			const accessError = targetAccessError(initialEntry, resolved.agentId, canonicalKey);
			if (accessError) {
				outcomes[index] = {
					ok: false,
					error: accessError
				};
				continue;
			}
			const missingHarnessSessionError = resolveMissingAgentHarnessSessionError(canonicalKey, initialEntry);
			if (missingHarnessSessionError) {
				outcomes[index] = invalidSessionRequest(missingHarnessSessionError);
				continue;
			}
			const { commitGuard: _commitGuard, ...identity } = input;
			const fullPatch = {
				...params.patch,
				...identity
			};
			const expectationError = resolveSessionPatchExpectationError(fullPatch);
			if (expectationError) {
				outcomes[index] = invalidSessionRequest(expectationError);
				continue;
			}
			let placementValidation;
			try {
				placementValidation = await prepareSessionWorkerPlacementPatchValidation({
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
			placementChecks.set(index, placementValidation);
			const preparedTarget = {
				archiveActor,
				canonicalKey,
				fullPatch,
				index,
				...initialEntry ? { initialEntry } : {},
				initialTarget: resolved,
				key,
				lifecycleIdentities: [
					key,
					canonicalKey,
					...candidateKeys,
					initialEntry?.sessionId
				],
				...requestedAgentId ? { requestedAgentId } : {},
				storePath: resolved.storePath,
				targetAgentId: resolved.agentId
			};
			prepared.push(preparedTarget);
			preparedByIndex[index] = preparedTarget;
		}
		const mutationTargets = params.targets.map((target, index) => ({
			...target,
			commitGuard: () => {
				const error = target.commitGuard();
				if (error) return error;
				const placementError = placementChecks.get(index)?.validate();
				return placementError ? errorShape(ErrorCodes.INVALID_REQUEST, placementError) : void 0;
			}
		}));
		const originalCommitGuards = mutationTargets.map((target) => target.commitGuard);
		const preparation = _usingCtx$1.a(await prepareSessionPatchTargets({
			cfg,
			getCurrentConfig,
			prepared,
			mutationTargets,
			originalCommitGuards,
			outcomes,
			operatorAuthority: params.operatorAuthority,
			personalModelSelection
		}));
		const { operatorAuthority, prepared: activePrepared } = preparation;
		const permissionRuntime = "permissionMode" in params.patch ? await import("./sessions-patch-permissions.runtime.js") : void 0;
		const sandboxRuntime = "sandboxMode" in params.patch || "nativeRuntimeConsent" in params.patch ? await import("./sessions-patch-sandbox.runtime.js") : void 0;
		const catalogWait = createSessionModelCatalogWait([
			params.signal,
			client?.connectionSignal,
			operatorAuthority?.signal,
			client?.internal?.operatorRunAuthority?.signal,
			client?.internal?.operatorAccessAuthority?.signal
		], "The session was not changed");
		const catalogs = createSessionPatchCatalogPreparation((agentId) => catalogWait.run(() => params.context.loadGatewayModelCatalogSnapshot({ agentId })), params.diagnostics);
		if (activePrepared.length > 0) {
			const releaseArchiveDrains = async () => {
				await Promise.all(activePrepared.map((target) => releaseSessionPatchArchive(target.archivePreparation)));
			};
			try {
				timing?.mark("archive");
				await Promise.all(activePrepared.filter((target) => target.fullPatch.archived === true).map(async (target) => {
					try {
						const result = await prepareSessionPatchArchive({
							cfg,
							commitGuard: mutationTargets[target.index].commitGuard,
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
				const archived = params.patch.archived;
				await runExclusiveSessionLifecycleMutation(archived === void 0 ? "patch" : archived ? "archive" : "restore", {
					targets: activePrepared.map((target) => ({
						scope: target.storePath,
						identities: target.lifecycleIdentities
					})),
					prepare: async () => {
						for (const target of activePrepared) target.archivePreparation?.drain.handoffToMutation();
					},
					finalize: releaseArchiveDrains,
					run: async () => {
						timing?.mark();
						try {
							await runSessionPatchGroups(activePrepared, async (group) => {
								const first = group[0];
								const storage = preparation.storage.get(first.index);
								const groupTiming = params.diagnostics?.scope("snapshot");
								const runtimeSelectionReleases = [];
								const releaseRuntimeSelections = () => {
									for (const release of runtimeSelectionReleases.splice(0)) release();
								};
								try {
									const selectedSessionKeys = group.flatMap((target) => [
										target.key,
										target.canonicalKey,
										...target.initialTarget.storeKeys
									]);
									const archiveTransitions = /* @__PURE__ */ new Map();
									const createdSessions = [];
									const commitGuards = /* @__PURE__ */ new Set();
									const originalGuards = group.map(({ index }) => expectDefined(originalCommitGuards[index], "original patch guard"));
									const assertCommitAllowed = () => {
										operatorAuthority?.assertCurrent();
										assertSessionPatchCommitAllowed({
											personalModelSelection,
											guards: commitGuards.size ? commitGuards : originalGuards,
											archiveTransitions: archiveTransitions.values()
										});
										storage?.assertCurrent();
									};
									const projectGroup = async (entries, admission, catalogPreparation) => {
										releaseRuntimeSelections();
										createdSessions.length = 0;
										const workingStore = Object.fromEntries(entries.flatMap(({ entry, sessionKey }) => isInternalSessionEffectsKey(sessionKey) ? [] : [[sessionKey, entry]]));
										const labelOwners = new SessionLabelOwnerIndex(workingStore);
										const replacements = [];
										const projectedOutcomes = [];
										for (const target of group) try {
											if (params.operatorAuthority) {
												assertSessionPatchCommitAllowed({
													personalModelSelection,
													guards: [expectDefined(originalCommitGuards[target.index], "original patch guard")],
													archiveTransitions: []
												});
												operatorAuthority?.assertCurrent();
											}
											const { entry: existingEntry, primaryKey, target: currentTarget } = resolveCanonicalGatewaySessionStoreKey({
												cfg,
												key: target.key,
												target: target.initialTarget,
												store: workingStore,
												...target.requestedAgentId ? { agentId: target.requestedAgentId } : {}
											});
											const accessError = targetAccessError(existingEntry, target.targetAgentId, primaryKey);
											if (accessError) {
												projectedOutcomes.push({
													ok: false,
													error: accessError
												});
												continue;
											}
											const candidateKeys = currentTarget.storeKeys;
											const projectionError = resolveSessionPatchTargetError(existingEntry, target) || params.operatorAuthority && mutationTargets[target.index].commitGuard() || target.fullPatch.archived === true && validateSessionPatchArchiveProjection({
												cfg,
												existingEntry,
												fullPatch: target.fullPatch,
												key: target.key,
												...pluginOwnerId ? { pluginOwnerId } : {},
												preparation: target.archivePreparation,
												primaryKey
											});
											if (projectionError) {
												projectedOutcomes.push({
													ok: false,
													error: projectionError
												});
												continue;
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
												const authorizationFailure = mutationTargets[target.index].commitGuard();
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
													personalModelSelection,
													operatorAuthority
												}
											});
											if (projection.kind === "model-catalog") return { result: projection };
											const projected = projection.result;
											if (!projected.ok) {
												projectedOutcomes.push(projected);
												continue;
											}
											const validateSandbox = sandboxRuntime ? await sandboxRuntime.prepareSessionPatchSandboxChange({
												client,
												context: params.context,
												patch: target.fullPatch,
												existingEntry,
												entry: projected.entry,
												sessionKey: primaryKey,
												storePath: target.storePath,
												lifecycleIdentities: target.lifecycleIdentities
											}) : void 0;
											groupTiming?.mark("runtimeSelection");
											const runtimeSelection = await prepareSessionPatchRuntimeSelection({
												cfg,
												agentId: target.targetAgentId,
												patch: target.fullPatch,
												entry: projected.entry,
												expectedEntry: existingEntry,
												callerCanConsent: callerIsAdmin,
												catalog: (await catalogs.available(target.targetAgentId))?.entries,
												validateModelSelection: projected.validateModelSelection,
												placement: {
													context: params.context,
													sessionKey: primaryKey
												}
											});
											groupTiming?.mark("projection");
											if (!runtimeSelection.ok) {
												projectedOutcomes.push(runtimeSelection);
												continue;
											}
											if (runtimeSelection.release) {
												const release = runtimeSelection.release;
												runtimeSelectionReleases.push(() => {
													if (runtimeSelection.validate) commitGuards.delete(runtimeSelection.validate);
													release();
												});
											}
											const authorizationFailure = mutationTargets[target.index].commitGuard();
											if (authorizationFailure) {
												projectedOutcomes.push({
													ok: false,
													error: authorizationFailure
												});
												continue;
											}
											if (existingEntry && typeof target.fullPatch.archived === "boolean" && (existingEntry.worktree || existingEntry.archivedAt !== void 0 || target.fullPatch.archived)) {
												const worktreeTiming = params.diagnostics?.scope(target.fullPatch.archived ? "archivePlacement" : "worktree");
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
														authorize: mutationTargets[target.index].commitGuard,
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
													assertCurrent: mutationTargets[target.index].commitGuard
												});
												if (!permission.ok) {
													projectedOutcomes.push(permission);
													continue;
												}
												target.permissionChange = permission.change;
											}
											commitGuards.add(mutationTargets[target.index].commitGuard);
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
											if (replacement.replacement) {
												replacements.push(replacement.replacement);
												if (!existingEntry && params.onCreatedSessionCommitted) createdSessions.push({
													agentId: target.targetAgentId,
													sessionKey: primaryKey,
													storePath: target.storePath,
													sessionId: replacement.outcome.entry.sessionId,
													entry: replacement.outcome.entry,
													lifecycleRevision: replacement.outcome.entry.lifecycleRevision
												});
											}
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
									const applyGroup = createSessionPatchGroupWriter({
										store: {
											...storage ? {
												env: storage.env,
												retainedExecution: storage.execution
											} : {},
											onLifecycleCommitted: () => {
												for (const created of createdSessions) params.onCreatedSessionCommitted?.(created);
											},
											afterCommitted: createSessionPatchCategoryRegistration(params),
											assertCommitAllowed,
											agentId: first.targetAgentId,
											sessionKeys: selectedSessionKeys,
											storePath: first.storePath,
											skipMaintenance: true
										},
										patch: first.fullPatch,
										project: projectGroup,
										timing: groupTiming
									});
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
									}
								} catch (error) {
									for (const target of group) outcomes[target.index] = {
										ok: false,
										error: unexpectedPatchError(target.key, error)
									};
								} finally {
									releaseRuntimeSelections();
									groupTiming?.finish();
								}
							});
							timing?.mark("permissions");
							for (const target of activePrepared) {
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
				for (const target of activePrepared) target.permissionChange?.finish();
				await releaseArchiveDrains();
			}
		}
		timing?.mark("effects");
		const archivedSessionsCommitted = await publishSessionPatchEffects({
			cfg,
			context: params.context,
			callerScopes,
			callerCanManageCron: callerIsAdmin,
			diagnostics: params.diagnostics,
			targets: activePrepared.flatMap((target) => {
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
			archivedSessionsCommitted,
			cfg,
			outcomes,
			preparedByIndex,
			catalogs
		};
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
//#endregion
//#region src/gateway/server-methods/sessions-mutations.ts
function createSessionPatchHandler(method) {
	return async (options) => {
		const { params, respond, context, client, sessionMutationAuthorization, hasCurrentClientAuthority, signal } = options;
		const requestAuthority = readGatewayRequestMutationAuthority(options);
		const diagnostics = startSessionPatchDiagnostics(method);
		let archivedSessionsCommitted = false;
		let preparingOperator;
		try {
			let request;
			if (method === "sessions.patchMany") {
				if (!assertValidParams(params, validateSessionsPatchManyParams, method, respond)) return;
				request = {
					many: true,
					params
				};
			} else {
				if (!assertValidParams(params, validateSessionsPatchParams, method, respond)) return;
				request = {
					many: false,
					params
				};
			}
			const inputPatch = request.many ? request.params.patch : request.params;
			const scopes = Array.isArray(client?.connect.scopes) ? client.connect.scopes : [];
			if ((inputPatch.permissionMode === "full" || inputPatch.sandboxMode !== void 0 || inputPatch.nativeRuntimeConsent !== void 0) && client !== null && !scopes.includes("operator.admin")) {
				respond(false, void 0, missingScopeErrorShape({
					missingScope: ADMIN_SCOPE,
					requiredScopes: [ADMIN_SCOPE]
				}));
				return;
			}
			let targets;
			let patch;
			if (request.many) {
				targets = structuredClone(request.params.targets);
				patch = structuredClone(request.params.patch);
			} else {
				const key = requireSessionKey(request.params.key, respond);
				if (!key) return;
				const singlePatch = structuredClone({
					...request.params,
					key
				});
				patch = singlePatch;
				targets = [singlePatch];
			}
			const assertCurrent = () => {
				requestAuthority.assertCurrent();
				if (!request.many) sessionMutationAuthorization?.assertCurrent();
			};
			if (patch.model !== void 0) {
				preparingOperator = captureGatewayOperatorRunAuthority({
					client,
					context,
					hasCurrentClientAuthority,
					invocationAuthority: {
						assertCurrent,
						signal
					}
				});
				preparingOperator.catch(() => {});
			}
			const executed = await executeSessionPatchMutations({
				client,
				context,
				signal,
				diagnostics,
				operatorAuthority: preparingOperator,
				onCreatedSessionCommitted: request.many ? void 0 : sessionMutationAuthorization?.recordCreatedSession,
				patch,
				targets: targets.map((target) => ({
					...target,
					commitGuard: createCommitGuard(target.key.trim(), () => {
						assertCurrent();
						if (request.many) sessionMutationAuthorization?.assertTargetCurrent({
							sessionKey: target.key.trim(),
							...target.agentId ? { agentId: target.agentId } : {}
						});
					})
				}))
			});
			if (!executed.ok) {
				respond(false, void 0, executed.error);
				return;
			}
			archivedSessionsCommitted = executed.archivedSessionsCommitted;
			if (request.many) {
				diagnostics?.scope("response");
				respond(true, { outcomes: executed.outcomes.map((outcome, index) => {
					const target = targets[index];
					const identity = {
						key: target.key,
						...target.agentId ? { agentId: target.agentId } : {}
					};
					return outcome.ok ? {
						ok: true,
						...identity
					} : {
						ok: false,
						...identity,
						error: outcome.error
					};
				}) }, void 0);
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
			const [acpMeta] = await readAcpSessionMetaForEntries({
				cfg: executed.cfg,
				entries: [{
					agentId: prepared.targetAgentId,
					sessionKey: prepared.canonicalKey,
					entry: outcome.entry
				}]
			});
			assertCurrent();
			respond(true, projectSessionPatchResult({
				...prepared,
				cfg: executed.cfg,
				preparedAcpMeta: acpMeta ?? null,
				entry: {
					...outcome.entry,
					fastMode: prepareSessionFastModePresentation(client)(outcome.entry.fastMode)
				},
				modelCatalog: catalog?.entries,
				modelCatalogRouteVariants: catalog?.routeVariants
			}), void 0);
		} finally {
			try {
				if (preparingOperator) (await preparingOperator.catch(() => void 0))?.release();
			} finally {
				diagnostics?.finish();
				if (archivedSessionsCommitted) {
					const { notifyGatewayWorktreeArchive } = await import("./worktree-maintenance-DrTiUCPN.mjs");
					notifyGatewayWorktreeArchive(context.getRuntimeConfig);
				}
			}
		}
	};
}
const sessionMutationHandlers = {
	"sessions.patchMany": createSessionPatchHandler("sessions.patchMany"),
	"sessions.patch": createSessionPatchHandler("sessions.patch"),
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
		const facts = await prepareSessionMutationFacts({
			cfg,
			sessionKey: params.key,
			agentId: requestedAgent.agentId,
			allowMissing: true
		});
		try {
			const target = facts.readCurrent(context.getRuntimeConfig()).target;
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
			if (!await updateSessionProfileInvolvementAsync({
				agentId: target.agentId,
				sessionKey: target.storeKey,
				storePath: target.storePath
			}, {
				expectedSessionId: params.expectedSessionId,
				expectedEntry: target.entry,
				profileIds: [profile.profileId],
				change: {
					kind: "visibility",
					hidden: params.hidden
				},
				assertCurrent: () => {
					const currentCfg = context.getRuntimeConfig();
					const current = facts.readCurrent(currentCfg).target;
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
		} finally {
			facts.release();
		}
	},
	"sessions.assignOwner": async ({ params, respond, context, client, signal, sessionMutationAuthorization }) => {
		if (!assertValidParams(params, validateSessionsAssignOwnerParams, "sessions.assignOwner", respond)) return;
		const key = requireSessionKey(params.key, respond);
		if (!key) return;
		const respondUnknownSession = () => {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown session: ${key}`));
		};
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
		const facts = await prepareSessionMutationFacts({
			cfg,
			sessionKey: key,
			agentId: requestedAgent.agentId,
			allowMissing: true
		});
		try {
			const target = facts.readCurrent(context.getRuntimeConfig()).target;
			if (!target) {
				respondUnknownSession();
				return;
			}
			const authorizeView = (candidate, currentCfg = context.getCommittedRuntimeConfig?.() ?? context.getRuntimeConfig()) => authorizeIncognitoSessionTarget({
				client,
				sessionKey: key,
				target: candidate
			}) ?? (createSessionListEntryFilter({
				client,
				cfg: currentCfg
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
			const expectedSessionId = target.entry.sessionId;
			const assertCurrent = () => {
				signal?.throwIfAborted();
				sessionMutationAuthorization?.assertCurrent();
				const currentCfg = context.getRuntimeConfig();
				const current = facts.readCurrent(currentCfg).target;
				ownerIdentityById.clear();
				const currentOwner = projectAssignableSessionOwner(params.owner, ownerIdentityById, currentCfg);
				const currentError = current ? authorizeView(current, context.getCommittedRuntimeConfig?.() ?? currentCfg) : null;
				if (!current || current.agentId !== target.agentId || current.canonicalKey !== target.canonicalKey || current.storeKey !== target.storeKey || current.storePath !== target.storePath || current.entry.sessionId !== expectedSessionId || currentOwner?.id !== owner.id || currentOwner.type !== owner.type || currentError) throw new SessionMutationAuthorizationChangedError(currentError ?? errorShape(ErrorCodes.INVALID_REQUEST, "session changed before sessions.assignOwner; retry the request"));
			};
			const assignment = await runExclusiveSessionLifecycleMutation("assign-owner", {
				scope: target.storePath,
				identities: [target.storeKey, expectedSessionId],
				run: () => assignSessionOwnerInWorker({
					agentId: target.agentId,
					sessionKey: target.storeKey,
					storePath: target.storePath
				}, {
					owner,
					assignedBy,
					expectedSessionId,
					expectedEntry: {
						...sharingExpectedEntry(target),
						lifecycleRevision: target.entry.lifecycleRevision
					}
				}, assertCurrent)
			});
			const projectedActor = assignment ? projectAssignableSessionOwner(assignment.actor, ownerIdentityById, cfg) : null;
			const projectedAssignedBy = assignment?.assignedBy ? projectSessionActor(assignment.assignedBy, /* @__PURE__ */ new Map(), cfg) : void 0;
			const projected = assignment && projectedActor ? {
				actor: projectedActor,
				...projectedAssignedBy ? { assignedBy: projectedAssignedBy } : {},
				...assignment.assignedAt !== void 0 ? { assignedAt: assignment.assignedAt } : {}
			} : void 0;
			if (!projected) {
				respondUnknownSession();
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
		} finally {
			facts.release();
		}
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
		const { performGatewaySessionReset } = await loadSessionLifecycleRuntime();
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
		const deleted = "incognitoDeleted" in result;
		respond(true, {
			ok: true,
			key: result.key,
			...deleted ? {
				deleted: true,
				...result.worktreePreserved ? { worktreePreserved: result.worktreePreserved } : {}
			} : {
				entry: {
					...result.entry,
					fastMode: prepareSessionFastModePresentation(client)(result.entry.fastMode)
				},
				resolved: result.resolved
			}
		}, void 0);
		emitSessionsChanged(context, {
			sessionKey: result.key,
			agentId: result.agentId,
			...deleted ? { sessionId: result.deletedSessionId } : {},
			reason: deleted ? "delete" : reason
		});
	}
};
//#endregion
export { sessionMutationHandlers };
