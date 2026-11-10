import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { f as ModelAccountConnectAuthorityError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { f as sessionEntryCommitGuardOptions } from "./session-source-authority-fdILH-PW.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey, l as resolveAgentIdFromSessionKey, w as isSubagentSessionKey } from "./session-key-CSDERtm3.mjs";
import { a as resolveAgentDir, f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { Ng as errorShape, Pg as missingScopeErrorShape } from "./src-pLJQA6J5.mjs";
import { W as isUserModelAuthProfileId } from "./user-model-account-authority-DFFjC5J5.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { a as normalizeOptionalAgentRuntimeId } from "./agent-runtime-id-BZLMe-UU.mjs";
import { t as findModelCatalogEntry } from "./model-catalog-lookup-BJKolYfz.mjs";
import { n as resolveSubagentConfiguredModelSelection, t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import { V as inheritSessionSelection, nt as buildMainSessionRecoveryClearPatch, st as projectPublicSessionEntry } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { l as normalizeSessionDeliveryState } from "./delivery-context.shared-I8-iaaj1.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { o as normalizeSessionColorValue } from "./session-agent-status-BSzRJm_2.mjs";
import { p as readResidentUserProfileId } from "./user-profile-list-BdNJnrJe.mjs";
import { l as resolveCreatorSandbox, n as authorizeGatewaySessionCreation } from "./operator-role-policy-Coro3qc5.mjs";
import { r as resolveAgentMainSessionKey } from "./main-session-CHYPkxYr.mjs";
import { u as runWithSessionEntryCreationPublication } from "./session-accessor.sqlite-entry-cache-publication-BpzZnZxY.mjs";
import { d as inheritSessionGitContributorProfileIds, f as inheritSpawnSessionOwner, l as buildSessionCreationStamp, t as buildSessionParentLink, u as inheritSessionCreationPolicy } from "./session-entry-lineage-B7Mubzwj.mjs";
import { n as forkCliSessionBindings } from "./cli-session-binding-Dx1VbkI8.mjs";
import { a as isModelSelectionLocked, t as MODEL_SELECTION_LOCKED_PARENT_FORK_MESSAGE } from "./model-overrides-CgHG3YVT.mjs";
import { n as captureSessionActorStorageOwner, r as getSessionActorStorageBinding, s as withSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { c as withSessionEntriesFromStoresInWorker, i as readSessionEntryReadOnlyInWorker, n as readSessionEntriesFromStoreInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import "./session-accessor.sqlite-entry-cache-BGcjBaH_.mjs";
import { S as runExclusiveSessionLifecycleMutation, b as isSessionWorkAdmissionActive, n as beginSessionWorkAdmission } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { n as sessionCreationFailure, r as unavailableSessionRequest, t as invalidSessionRequest } from "./session-request-error-qLiiFHUD.mjs";
import { a as resolveSessionCreateAgentId, r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { o as patchSessionEntryCore } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { a as isAgentHarnessSessionKey, o as isAgentHarnessSessionKeyOwnedBy, r as AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE } from "./agent-harness-session-key-zbrcLVpT.mjs";
import { r as createSessionEntryWithTranscript } from "./session-accessor.entry-mutation-DgCGNicZ.mjs";
import { n as deleteSessionEntryLifecycle } from "./session-accessor.sqlite-lifecycle-7VGnaDT3.mjs";
import { _ as resolveSessionVisibility, p as isSessionVisibilityAllowed } from "./session-sharing-policy-vx7GWqzs.mjs";
import { t as findCanonicalStoreMatch } from "./session-utils-store-selection-DIMLgaMc.mjs";
import { n as captureSessionMutationRouting } from "./session-sharing-preparation-DAfvBDLL.mjs";
import { r as resolveGatewaySessionStoreTargetInWorker, t as loadGatewaySessionEntryReadOnlyInWorker } from "./session-utils-store-worker-u3lCvEEg.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { t as cliBackendSupportsSessionFork } from "./cli-backends-BzVT3JSM.mjs";
import { a as resolveContextTokensForModel } from "./context-XynHJtne.mjs";
import { o as selectModelCatalogRuntimeEntry } from "./model-catalog-view-UkLRAY5C.mjs";
import "./model-catalog-vYmFg90_.mjs";
import { t as resolveModelContextWindowProfile } from "./model-context-window-CoR3Uyg1.mjs";
import { r as resolveSessionModelRef } from "./session-model-ref-BTkDCi12.mjs";
import { o as resolveEffectiveAgentRuntime } from "./thinking-runtime-DuxsJR5q.mjs";
import { v as prepareAuthProfileProvider } from "./store-runtime-CwqGD12G.mjs";
import { a as prepareUserModelAccountAuthority } from "./user-model-account-operations-DIqTwy80.mjs";
import { i as loadIncognitoGatewaySessionEntryReadOnly } from "./session-utils-store-lW7Wu3P0.mjs";
import { n as isEmbeddedAgentRunActive } from "./active-run-projections-Crpg2l0z.mjs";
import "./runs-Czr-I6_B.mjs";
import { C as normalizeInheritedToolDenylist, S as normalizeInheritedToolAllowlist, u as captureDelegatedToolPolicyAssertion } from "./subagent-capabilities-l3WVTf-e.mjs";
import { r as prepareSessionForkFromParent } from "./session-fork-CE3rQ2_3.mjs";
import { i as hasInternalHookListeners, n as createInternalHookEvent, u as triggerInternalHook } from "./internal-hooks-DNLQqCT3.mjs";
import { t as resolveModelProviderAuthConfig } from "./model-auth-provider-route-BGgWpgXk.mjs";
import { n as shouldPreserveSessionAuthProfileOverride } from "./auth-profile-preservation-UYIf2L8-.mjs";
import { n as waitForSessionParticipantRecording } from "./session-participant-recording-CDq1wlt1.mjs";
import { t as recordSessionCreated } from "./session-created-CHLwCn_J.mjs";
import { r as prepareSessionForkFilesystemRoot, t as prepareSessionCreateFilesystemRoot } from "./session-create-root-lHgGqSce.mjs";
import { t as createSessionDiffBaselineCaptureClaim } from "./session-diff-baseline-capture-6ejBT0Am.mjs";
import { t as resolveSessionWorkerPlacementContext } from "./session-worker-placement-context-DJzLYZPW.mjs";
import { a as resolveSessionCreateChildIntentError, c as rollbackGatewaySessionPreparation, i as projectPreparedSessionWorkspace, o as resolveSessionCreateIncognitoIntentError, r as prepareGatewaySessionLifecycleTargets, s as resolveSessionCreateLifecycleIntentError } from "./session-lifecycle-preparation-CelOZMyq.mjs";
import { t as resolvePluginSessionOwnershipError } from "./session-plugin-ownership-D5Z0-DHb.mjs";
import { i as refreshSessionPatchQueuedSelection, n as prepareSessionPatchModelSelection, o as resolveSessionPatchModelSelection, r as prepareSessionPatchRuntimeSelection } from "./sessions-patch-model-selection-HDHD8IDv.mjs";
import { r as resolveSessionCreateTargetKey, t as buildDashboardSessionKey } from "./session-create-key-BJp-9Sd1.mjs";
import { i as loadSessionLifecycleRuntime, n as projectSessionsPatchEntry } from "./sessions-patch-CVUsUuuY.mjs";
import { t as prepareSessionPublicShareGrant } from "./session-publication-grant-BzQK6QTg.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/session-create-target.ts
/** Select and retain the agent's admission through creation, finalization, and rollback. */
async function withSessionCreateAdmission(params, create) {
	const selectedAgent = resolveSessionCreateAgentId(params.cfg, {
		key: normalizeOptionalString(params.key),
		agentId: params.agentId,
		parentSessionKey: normalizeOptionalString(params.parentSessionKey)
	});
	if (!selectedAgent.ok) return selectedAgent;
	const interrupted = new AbortController();
	const assertCurrent = () => {
		interrupted.signal.throwIfAborted();
		params.commitGuard?.();
	};
	const admission = await beginSessionWorkAdmission({
		agentId: selectedAgent.agentId,
		scope: `agent:${selectedAgent.agentId}`,
		identities: [params.key ?? selectedAgent.agentId],
		assertAllowed: assertCurrent,
		onInterrupt: (reason) => interrupted.abort(reason)
	});
	try {
		return await admission.run(() => create({
			...params,
			commitGuard: assertCurrent
		}, selectedAgent.agentId));
	} finally {
		admission.release();
	}
}
async function validateSessionCreateIncognitoTarget(params, agentId, explicitTargetKey, commitGuard) {
	const explicitTargetParts = parseAgentSessionKey(explicitTargetKey);
	const explicitIncognito = isIncognitoSessionKey(explicitTargetKey);
	const explicitDashboardIncognito = explicitIncognito && explicitTargetParts?.agentId === agentId && explicitTargetParts.rest.startsWith("dashboard:");
	if (explicitIncognito && params.incognito !== true) return invalidSessionRequest("incognito-shaped session keys require incognito: true");
	if (params.incognito === true && explicitTargetKey) {
		if (!explicitDashboardIncognito) return invalidSessionRequest("incognito sessions are web-only");
		const durableStorePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId });
		const durableEntry = await withSessionEntriesFromStoresInWorker([{
			agentId,
			storePath: durableStorePath,
			sessionKeys: [explicitTargetKey],
			projection: "list"
		}], ([read]) => read.result.entries[0]?.entry);
		commitGuard?.();
		if (durableEntry || (await loadGatewaySessionEntryReadOnlyInWorker({
			cfg: params.cfg,
			key: explicitTargetKey,
			agentId,
			assertActive: commitGuard
		})).entry) return invalidSessionRequest("incognito is immutable and requires a new session key");
	}
	return {
		ok: true,
		value: void 0
	};
}
async function readRequestedSessionCreateTarget(params, agentId, key) {
	return key ? await loadGatewaySessionEntryReadOnlyInWorker({
		cfg: params.cfg,
		key,
		agentId
	}) : void 0;
}
async function readSessionCreateTarget(params, target, expectedSessionId, lifecycleIdentities) {
	const assertRoutingCurrent = captureSessionMutationRouting(params.cfg, void 0, [{
		agentId: target.agentId,
		sessionKey: target.canonicalKey
	}]);
	const assertCurrent = () => {
		params.commitGuard?.();
		assertRoutingCurrent(params.getCurrentConfig?.() ?? params.cfg);
	};
	const validate = (currentTargetEntry) => {
		assertCurrent();
		const existingOwnershipError = resolvePluginSessionOwnershipError({
			action: "adopt",
			entry: currentTargetEntry,
			key: target.canonicalKey,
			pluginOwnerId: params.authorizedPluginId
		});
		if (existingOwnershipError) return {
			ok: false,
			error: existingOwnershipError
		};
		if (currentTargetEntry) {
			const requestedCwd = normalizeOptionalString(params.spawnedCwd);
			const requestedRoot = normalizeOptionalString(params.sessionRoot ?? params.defaultSessionRoot);
			const requestedNode = normalizeOptionalString(params.execNode);
			const requestedExecCwd = normalizeOptionalString(params.execCwd);
			if (params.prepareLifecycle !== void 0 || requestedCwd !== void 0 && requestedCwd !== currentTargetEntry.spawnedCwd || requestedRoot !== void 0 && requestedRoot !== currentTargetEntry.sessionRoot || requestedNode !== void 0 && (currentTargetEntry.execHost !== "node" || requestedNode !== currentTargetEntry.execNode || requestedExecCwd !== void 0 && requestedExecCwd !== currentTargetEntry.execCwd)) {
				if (currentTargetEntry.sessionId !== expectedSessionId) return unavailableSessionRequest(`Session ${target.canonicalKey} changed before workspace preparation; retry.`);
				if (isSessionWorkAdmissionActive(target.storePath, lifecycleIdentities) || isEmbeddedAgentRunActive(currentTargetEntry.sessionId)) return unavailableSessionRequest(`Session ${target.canonicalKey} is still active; retry workspace preparation after its work finishes.`);
			}
		}
		if (!currentTargetEntry) {
			const creationError = authorizeGatewaySessionCreation({
				cfg: params.cfg,
				agentId: target.agentId,
				...params.operatorRoleActor ? { actor: params.operatorRoleActor } : { profileId: params.requestingOperatorProfileId }
			});
			if (creationError) return {
				ok: false,
				error: creationError
			};
		}
		return {
			ok: true,
			value: currentTargetEntry
		};
	};
	assertCurrent();
	if (isIncognitoSessionKey(target.canonicalKey)) return validate(loadIncognitoGatewaySessionEntryReadOnly(target.canonicalKey, { agentId: target.agentId }, params.cfg).entry);
	const read = await readSessionEntriesFromStoreInWorker({
		agentId: target.agentId,
		storePath: target.storePath,
		sessionKeys: target.storeKeys,
		projection: "exact"
	});
	const store = Object.fromEntries(read.entries.map(({ sessionKey, entry }) => [sessionKey, entry]));
	return validate(findCanonicalStoreMatch(store, target.storeKeys)?.entry);
}
async function finalizeSessionCreateTarget(target, expectedEntry, commitGuard) {
	const finalized = await patchSessionEntryCore({
		sessionKey: target.key,
		storePath: target.storePath
	}, (current) => {
		if (!isDeepStrictEqual(current, expectedEntry)) throw new Error(`created session ${target.key} changed before finalization`);
		return { initializationPending: void 0 };
	}, {
		preserveActivity: true,
		requireWriteSuccess: true,
		...sessionEntryCommitGuardOptions(commitGuard)
	});
	if (!finalized) throw new Error(`created session ${target.key} disappeared before finalization`);
	return finalized;
}
//#endregion
//#region src/gateway/session-create-completion.ts
async function completeGatewaySessionCreation(params, result, createdContext, commitGuard) {
	if (result.resetExisting || !createdContext || !params.afterCreate) return params.atomicInitialization === true ? unavailableSessionRequest("atomic session initialization did not create a session") : {
		...result,
		postCommit: { status: "completed" }
	};
	if (params.atomicInitialization === true) {
		const initializingSession = createdContext;
		const scope = {
			agentId: initializingSession.agentId,
			storePath: initializingSession.storePath,
			sessionKey: initializingSession.key
		};
		const memory = getSessionActorStorageBinding(scope);
		const stored = memory ? memory.actor.storage.readCurrent({
			type: "session.entry.read",
			input: {}
		}, memory.authority) : await readSessionEntryReadOnlyInWorker(scope, commitGuard);
		if (!stored || stored.sessionId !== initializingSession.entry.sessionId || stored.initializationPending !== true) return unavailableSessionRequest("atomic session initialization lost its owner");
		const expectedEntry = structuredClone(stored);
		try {
			await params.afterCreate(initializingSession);
			const finalized = await finalizeSessionCreateTarget(initializingSession, expectedEntry, params.commitGuard);
			return {
				...result,
				entry: projectPublicSessionEntry(finalized),
				postCommit: { status: "completed" }
			};
		} catch (error) {
			try {
				if (!(await deleteSessionEntryLifecycle({
					agentId: initializingSession.agentId,
					archiveTranscript: false,
					deleteTranscriptWithoutArchive: true,
					expectedEntry,
					expectedSessionId: expectedEntry.sessionId,
					expectedUpdatedAt: expectedEntry.updatedAt,
					requireWriteSuccess: true,
					storePath: initializingSession.storePath,
					target: {
						canonicalKey: initializingSession.key,
						storeKeys: [initializingSession.key]
					}
				})).deleted) throw new Error(`created session ${initializingSession.key} changed before rollback`, { cause: error });
			} catch (rollbackError) {
				return unavailableSessionRequest(`session initialization failed and rollback did not complete: ${formatErrorMessage(new AggregateError([error, rollbackError]))}`);
			}
			return unavailableSessionRequest(`session initialization failed: ${formatErrorMessage(error)}`);
		}
	}
	try {
		await params.afterCreate(createdContext);
		return {
			...result,
			postCommit: { status: "completed" }
		};
	} catch (error) {
		return {
			...result,
			postCommit: {
				status: "failed",
				error
			}
		};
	}
}
//#endregion
//#region src/gateway/session-create-existing-selection.ts
/** Creation can adopt a key, but only an explicit settings mutation can replace its policy. */
function sessionCreatePolicyAdoptionError(existing, projected, requested) {
	if (existing) {
		for (const field of ["toolOverrides", "communication"]) if (requested[field] !== void 0 && stableStringify(existing[field]) !== stableStringify(projected[field])) return "sessions.create " + field + " requires a new session";
	}
}
async function existingSessionSelectionWouldChange(params) {
	if (params.catalogModel) return true;
	if (params.requestedAgentRuntime !== void 0 && params.requestedAgentRuntime !== params.existingEntry.agentRuntimeOverride) return true;
	const requestedThinkingLevel = normalizeOptionalString(params.requestedThinkingLevel);
	const requestedContextWindow = normalizeOptionalString(params.requestedContextWindow);
	if (params.requestedFastMode !== void 0 && params.requestedFastMode !== params.existingEntry.fastMode) return true;
	if (requestedContextWindow && requestedContextWindow !== normalizeOptionalString(params.existingEntry.contextWindow)) return true;
	if (requestedThinkingLevel && requestedThinkingLevel !== normalizeOptionalString(params.existingEntry.thinkingLevel)) return true;
	const requestedModel = normalizeOptionalString(params.requestedModel);
	if (!requestedModel) return false;
	if (!params.loadGatewayModelCatalogSnapshot) return true;
	const catalog = await params.loadGatewayModelCatalogSnapshot();
	const selectionPolicy = {
		cfg: params.cfg,
		agentId: params.agentId,
		catalog: catalog.entries,
		defaultProvider: params.defaultProvider,
		defaultModel: params.defaultModel
	};
	const resolved = resolveSessionPatchModelSelection({
		...selectionPolicy,
		raw: requestedModel,
		subagentModelHint: params.subagentModelHint
	});
	if (!resolved.ok) return true;
	let existingProvider = normalizeOptionalString(params.existingEntry.providerOverride) ?? params.defaultProvider;
	let existingModel = normalizeOptionalString(params.existingEntry.modelOverride) ?? params.defaultModel;
	if (!normalizeOptionalString(params.existingEntry.modelOverride) && params.subagentModelHint) {
		const resolvedSubagentDefault = resolveSessionPatchModelSelection({
			...selectionPolicy,
			raw: params.subagentModelHint
		});
		if (!resolvedSubagentDefault.ok) return true;
		if (!normalizeOptionalString(params.existingEntry.providerOverride)) existingProvider = resolvedSubagentDefault.provider;
		existingModel = resolvedSubagentDefault.model;
	}
	const existingProfile = normalizeOptionalString(params.existingEntry.authProfileOverride);
	const requestedProfile = normalizeOptionalString(resolved.profile);
	const agentDir = resolveAgentDir(params.cfg, params.agentId);
	const recordedProvider = requestedProfile === void 0 && existingProfile ? await prepareAuthProfileProvider({
		agentDir,
		profileId: existingProfile
	}) : void 0;
	const profileWouldChange = requestedProfile !== void 0 ? requestedProfile !== existingProfile : existingProfile !== void 0 && !shouldPreserveSessionAuthProfileOverride({
		cfg: params.cfg,
		agentDir,
		recordedProvider,
		currentProvider: params.existingEntry.providerOverride ?? params.existingEntry.modelProvider ?? params.defaultProvider,
		entry: params.existingEntry,
		provider: resolved.provider
	});
	return resolved.provider !== existingProvider || resolved.model !== existingModel || profileWouldChange;
}
//#endregion
//#region src/gateway/session-create-fork-entry.ts
function buildForkedGatewaySessionEntry(entry, fork, parent, previousEntry) {
	return {
		...entry,
		...buildMainSessionRecoveryClearPatch(entry),
		sessionId: fork.sessionId,
		lifecycleRunId: void 0,
		lastRunId: void 0,
		forkSource: previousEntry?.forkSource ?? {
			sessionKey: parent.sessionKey,
			sessionId: parent.entry.sessionId
		},
		...previousEntry?.sessionId && previousEntry.sessionId !== fork.sessionId ? { previousSessionId: previousEntry.sessionId } : {},
		totalTokens: void 0,
		totalTokensFresh: false,
		totalTokensVersion: void 0,
		cliSessionBindings: forkCliSessionBindings(parent.entry, cliBackendSupportsSessionFork),
		cliSessionIds: void 0,
		claudeCliSessionId: void 0
	};
}
//#endregion
//#region src/gateway/session-create-inheritance.ts
/** Inherit parent selection without replacing explicitly requested choices. */
function inheritSessionCreateParentFields(params) {
	const { parent, overrides } = params;
	const inherited = overrides.catalogTarget?.model.trim() || overrides.model?.trim() ? {} : inheritSessionSelection(parent);
	if (overrides.toolOverrides !== void 0) delete inherited.toolOverrides;
	if (overrides.fastMode !== void 0) delete inherited.fastMode;
	if (params.newExplicitChild && overrides.communication === void 0 && parent?.communication) inherited.communication = { ...parent.communication };
	if (params.newDashboardRoot && !params.selectedModel) inherited.modelOverrideSource = "default";
	if (params.newDashboardRoot) inherited.chatType = "direct";
	return inherited;
}
/** Prepare the parent before lifecycle custody, while accepted input can still settle. */
async function prepareSessionCreateParent(input) {
	const target = await resolveGatewaySessionStoreTargetInWorker({
		cfg: input.params.cfg,
		key: input.key,
		...input.agentId ? { agentId: input.agentId } : {},
		assertActive: input.assertCurrent,
		projection: "full"
	});
	let entry = findCanonicalStoreMatch(target.store, target.storeKeys)?.entry;
	if (input.params.creation?.via === "spawn") {
		await waitForSessionParticipantRecording({
			agentId: target.agentId,
			sessionKey: target.canonicalKey,
			storePath: target.storePath
		});
		input.assertCurrent?.();
		entry = await readSessionEntryReadOnlyInWorker({
			agentId: target.agentId,
			storePath: target.storePath,
			sessionKey: target.canonicalKey
		});
		input.assertCurrent?.();
	}
	if (!entry?.sessionId) return invalidSessionRequest(`unknown parent session: ${input.key}`);
	const ownershipError = resolvePluginSessionOwnershipError({
		action: input.params.fork === true ? "fork" : "link",
		entry,
		key: target.canonicalKey,
		pluginOwnerId: input.params.authorizedPluginId
	});
	if (ownershipError) return {
		ok: false,
		error: ownershipError
	};
	if (isModelSelectionLocked(entry)) return invalidSessionRequest(MODEL_SELECTION_LOCKED_PARENT_FORK_MESSAGE);
	return {
		ok: true,
		entry,
		canonicalKey: target.canonicalKey,
		target
	};
}
function resolveResidentProfileId(profileId) {
	try {
		return readResidentUserProfileId(profileId);
	} catch {
		return;
	}
}
/** Derives trusted child policy and ownership from the locked spawn parent. */
function resolveSessionCreateInheritance(params) {
	if (params.creation?.via !== "spawn") return { creation: params.creation };
	const ownerAssignment = inheritSpawnSessionOwner(params.parent, params.creation.actor, params.creation.requesterProfileId, Date.now(), resolveResidentProfileId);
	return {
		creation: {
			...params.creation,
			...inheritSessionCreationPolicy(params.parent, params.creation.actor),
			inheritedGitContributorProfileIds: inheritSessionGitContributorProfileIds(params.parent)
		},
		...ownerAssignment ? { ownerAssignment } : {}
	};
}
/** Project the trusted spawn policy only onto a genuinely new child row. */
function resolveSessionCreateSpawnPolicy(params, parentSessionKey) {
	if (!params.spawnToolPolicy || !parentSessionKey) return;
	const completionOwnerSessionKey = normalizeOptionalString(params.spawnToolPolicy.completionOwnerSessionKey);
	const allow = normalizeInheritedToolAllowlist(params.spawnToolPolicy.allow);
	const deny = normalizeInheritedToolDenylist(params.spawnToolPolicy.deny);
	return {
		spawnedBy: parentSessionKey,
		...completionOwnerSessionKey ? { completionOwnerSessionKey } : {},
		inheritedToolPolicyVersion: 1,
		...params.spawnToolPolicy.delegatedToolPolicy ? { delegatedToolPolicy: params.spawnToolPolicy.delegatedToolPolicy } : {},
		...params.preparedPermissionSelection ? { permissionMode: params.preparedPermissionSelection.mode } : {},
		...allow.length > 0 ? { inheritedToolAllow: allow } : {},
		...deny.length > 0 ? { inheritedToolDeny: deny } : {}
	};
}
//#endregion
//#region src/gateway/session-create-lifecycle-targets.ts
function buildSessionCreateLifecycleTargets({ target, targetLifecycleIdentities, canonicalParentSessionKey, parentSessionEntry, parentSessionTarget, holdParentLifecycle }) {
	const lifecycleTargets = [{
		scope: target.storePath,
		identities: targetLifecycleIdentities
	}];
	if (canonicalParentSessionKey && parentSessionEntry?.sessionId && parentSessionTarget && holdParentLifecycle) lifecycleTargets.push({
		scope: parentSessionTarget.storePath,
		identities: [canonicalParentSessionKey, parentSessionEntry.sessionId]
	});
	return lifecycleTargets;
}
//#endregion
//#region src/gateway/session-create-model-selection.ts
/** Keep automatic selection provenance distinct from an explicit model pin. */
function projectSessionCreateSpawnModelSelection(params) {
	const selection = params.creation?.spawnModelAutoSelection;
	if (!params.createdNewEntry || !selection || selection.model !== params.requestedModel) return {};
	return {
		modelOverrideSource: "auto",
		...selection.hasFallbackOrigin ? {
			modelOverrideFallbackOriginProvider: params.entry.providerOverride,
			modelOverrideFallbackOriginModel: params.entry.modelOverride
		} : {}
	};
}
function resolveSessionCreateModelInputError(params) {
	if (params.agentRuntime !== void 0 && (!params.model || params.catalogTarget)) return errorShape(ErrorCodes.INVALID_REQUEST, "agentRuntime requires an explicit provider/model selection using full IDs");
	const requestedProfile = splitTrailingAuthProfile(params.catalogTarget?.model ?? params.model ?? "").profile;
	if (requestedProfile && isUserModelAuthProfileId(requestedProfile) && params.personalModelSelection?.authProfileId !== requestedProfile) return errorShape(ErrorCodes.FORBIDDEN, "Choose your personal account from an identified Gateway connection.");
}
function prepareSessionCreateModelSelection(params) {
	const { cfg, agentId, input, parentEntry, preparedModelSelection, operatorAuthority } = params;
	const model = normalizeOptionalString(typeof input === "string" ? input : input?.model);
	if (!model) {
		const inherited = inheritSessionSelection(parentEntry);
		return {
			ok: true,
			selection: {
				providerOverride: inherited.providerOverride,
				modelOverride: inherited.modelOverride,
				agentRuntimeOverride: inherited.agentRuntimeOverride,
				authProfileOverride: inherited.authProfileOverride
			}
		};
	}
	const defaults = resolveDefaultModelForAgent({
		cfg,
		agentId
	});
	const resolved = resolveSessionPatchModelSelection({
		cfg,
		agentId,
		catalog: [],
		raw: model,
		defaultProvider: defaults.provider,
		defaultModel: defaults.model,
		preparedModelSelection
	});
	if (!resolved.ok) return {
		ok: true,
		selection: null
	};
	const prepared = prepareSessionPatchModelSelection({
		cfg,
		agentId,
		selection: resolved,
		resetToDefault: false,
		operatorAuthority
	});
	if (!prepared.ok) return prepared;
	const agentRuntimeOverride = normalizeOptionalAgentRuntimeId(typeof input === "string" ? void 0 : input?.agentRuntime);
	return {
		ok: true,
		validate: prepared.validate,
		selection: {
			providerOverride: resolved.provider,
			modelOverride: resolved.model,
			...agentRuntimeOverride ? { agentRuntimeOverride } : {},
			...resolved.profile ? { authProfileOverride: resolved.profile } : {}
		}
	};
}
/** Assemble the creation lifetime once, including host-only publication intent. */
function resolveSessionCreationCommitGuard(params, prepared) {
	const assertDelegationCurrent = captureDelegatedToolPolicyAssertion(params.cfg, params.spawnToolPolicy?.delegatedToolPolicy);
	const assertCallerCurrent = params.childSessionPublication || assertDelegationCurrent ? () => {
		params.commitGuard?.();
		params.childSessionPublication?.assertCurrent();
		assertDelegationCurrent?.();
	} : params.commitGuard;
	if (!(params.personalModelSelection || params.operatorAuthority || params.personalAccountDefaults || params.activeParentFork || params.preparedModelSelection || params.preparedPermissionSelection || typeof params.model === "string" || params.agentRuntime !== void 0)) return assertCallerCurrent;
	const selections = [
		params.activeParentFork,
		params.preparedModelSelection,
		params.preparedPermissionSelection,
		params.personalModelSelection,
		params.personalAccountDefaults
	];
	return () => {
		assertCallerCurrent?.();
		prepared.assertPreparedTargetCurrent();
		prepared.readOperatorAuthority()?.assertCurrent();
		const error = prepared.validateSelection();
		if (error) throw new Error(error.message);
		for (const selection of selections) selection?.assertCurrent();
	};
}
/** New unpinned sessions bind an account for the caller's permitted default without storing a model pin. */
async function prepareSessionCreateDefaultAccount(params) {
	const { resolveUserLinkedAuthProfile } = await import("./session-override-Bywuiunx.mjs");
	params.assertCurrent?.();
	params.defaults.assertCurrent();
	const selected = prepareSessionPatchModelSelection({
		cfg: params.cfg,
		agentId: params.agentId,
		selection: {
			...resolveSessionModelRef(params.cfg, params.entry, params.agentId),
			isDefault: params.resetToDefault
		},
		resetToDefault: params.resetToDefault,
		operatorAuthority: params.operatorAuthority
	});
	if (!selected.ok) return selected;
	const model = selected.selection;
	const linked = await resolveUserLinkedAuthProfile({
		cfg: resolveModelProviderAuthConfig({
			config: params.cfg,
			provider: model.provider,
			modelId: model.model
		}),
		agentDir: resolveAgentDir(params.cfg, params.agentId),
		provider: model.provider,
		requesterProfileId: params.defaults.owner
	});
	const account = linked && isUserModelAuthProfileId(linked.profileId) ? await prepareUserModelAccountAuthority({
		profileId: params.defaults.owner,
		authProfileId: linked.profileId
	}) : void 0;
	params.assertCurrent?.();
	const validate = () => {
		params.defaults.assertCurrent();
		if (linked && isUserModelAuthProfileId(linked.profileId) && !account?.isCurrent()) throw new ModelAccountConnectAuthorityError();
		return selected.validate();
	};
	const error = validate();
	return error ? {
		ok: false,
		error
	} : {
		ok: true,
		profileId: linked?.profileId,
		validate
	};
}
/** Catalog-owned creations cannot mix independent model or key selections. */
function resolveSessionCreateCatalogSelectionError(params) {
	const catalogId = normalizeOptionalString(params.catalogId);
	const conflict = params.model ? "model" : params.agentRuntime ? "agentRuntime" : params.key ? "key" : void 0;
	return catalogId && conflict ? errorShape(ErrorCodes.INVALID_REQUEST, `sessions.create catalogId cannot include ${conflict}`) : void 0;
}
async function resolveSessionForkMaxTokens(params) {
	const childModel = resolveSessionModelRef(params.cfg, params.entry, params.agentId);
	const childCatalog = params.loadGatewayModelCatalogSnapshot ? await params.loadGatewayModelCatalogSnapshot() : void 0;
	const childLogicalEntry = findModelCatalogEntry(childCatalog?.entries ?? [], {
		provider: childModel.provider,
		modelId: childModel.model
	});
	const childCatalogEntry = childLogicalEntry && childCatalog ? selectModelCatalogRuntimeEntry({
		entry: childLogicalEntry,
		routeVariants: childCatalog.routeVariants,
		runtimeId: resolveEffectiveAgentRuntime({
			cfg: params.cfg,
			agentId: params.agentId,
			provider: childModel.provider,
			modelId: childModel.model,
			sessionKey: params.sessionKey,
			sessionEntry: params.entry
		}),
		allowApiFallback: false
	}).entry : void 0;
	const childContextWindow = resolveModelContextWindowProfile({
		catalogEntry: childCatalogEntry,
		selected: params.entry.contextWindow
	});
	const resolvedForkMaxTokens = resolveContextTokensForModel({
		cfg: params.cfg,
		provider: childModel.provider,
		model: childModel.model,
		modelContextTokens: childCatalogEntry?.contextTokens,
		modelContextWindow: childContextWindow.contextTokens,
		allowCacheLookup: false
	});
	return childContextWindow.contextTokens ? Math.min(resolvedForkMaxTokens ?? childContextWindow.contextTokens, childContextWindow.contextTokens) : resolvedForkMaxTokens;
}
//#endregion
//#region src/gateway/session-create-reset.ts
function tryResetGatewaySessionForCreation(params, { parentSessionKey: canonicalParentSessionKey, parentSelectedAgentId, agentId, parentIncognito, requestedKey, requestedToolOverrides, commitGuard }) {
	if (canonicalParentSessionKey && params.fork !== true && params.emitCommandHooks === true && !requestedKey && params.resetMainWhenUnspecified === true && !params.deviceFolder && !requestedToolOverrides && !parentIncognito && !params.catalogTarget && params.cfg.session?.dmScope === "main") {
		const parentAgentId = normalizeAgentId(parentSelectedAgentId ?? resolveAgentIdFromSessionKey(canonicalParentSessionKey) ?? agentId);
		if (canonicalParentSessionKey === resolveAgentMainSessionKey({
			cfg: params.cfg,
			agentId: parentAgentId
		})) return resetGatewaySessionForCreation(params, canonicalParentSessionKey, parentSelectedAgentId, commitGuard);
	}
}
async function resetGatewaySessionForCreation(params, canonicalParentSessionKey, parentSelectedAgentId, commitGuard) {
	if (params.visibility) return invalidSessionRequest("sessions.create visibility requires a new session");
	const { performGatewaySessionReset } = await loadSessionLifecycleRuntime();
	const spawnedCwd = normalizeOptionalString(params.spawnedCwd);
	const execCwd = normalizeOptionalString(params.execCwd);
	const resetResult = await performGatewaySessionReset({
		key: canonicalParentSessionKey,
		...parentSelectedAgentId ? { agentId: parentSelectedAgentId } : {},
		...params.requestingOperatorProfileId ? { requestingOperatorProfileId: params.requestingOperatorProfileId } : {},
		...params.operatorRoleActor ? { operatorRoleActor: params.operatorRoleActor } : {},
		reason: "new",
		commandSource: params.commandSource,
		...params.creation ? { creation: params.creation } : {},
		...spawnedCwd ? { spawnedCwd } : {},
		...params.sessionRoot ? { sessionRoot: params.sessionRoot } : {},
		...params.permissionMode ? { permissionMode: params.permissionMode } : {},
		...params.fastMode !== void 0 ? { fastModeSelection: {
			value: params.fastMode,
			allowExistingChange: params.allowExistingModelSelection === true
		} } : {},
		...params.prepareLifecycle ? { prepareLifecycle: params.prepareLifecycle } : {},
		...params.onLifecycleCleanupError ? { onLifecycleCleanupError: params.onLifecycleCleanupError } : {},
		...params.execNode ? { execNode: params.execNode } : {},
		...execCwd ? { execCwd } : {},
		...params.clearExecBinding ? { clearExecBinding: true } : {},
		...params.clearSpawnedCwd && !spawnedCwd ? { clearSpawnedCwd: true } : {},
		...params.armSessionDiffBaselineCapture ? { armSessionDiffBaselineCapture: true } : {},
		...commitGuard ? { assertAuthorizedInstance: commitGuard } : {}
	});
	if (!resetResult.ok) return resetResult;
	if ("incognitoDeleted" in resetResult) return invalidSessionRequest("incognito sessions cannot reset in place");
	return {
		ok: true,
		key: resetResult.key,
		agentId: resetResult.agentId,
		entry: projectPublicSessionEntry(resetResult.entry),
		resolved: resetResult.resolved,
		resetExisting: true,
		postCommit: { status: "completed" }
	};
}
//#endregion
//#region src/gateway/session-create-visibility.ts
function resolveSessionCreateVisibility(params, existingEntry) {
	const visibility = params.visibility ?? (existingEntry ? void 0 : params.defaultVisibility);
	if (visibility && !existingEntry && !isSessionVisibilityAllowed(params.cfg, visibility)) return invalidSessionRequest(`session visibility is disabled: ${visibility}`, { details: {
		code: "SESSION_VISIBILITY_DISABLED",
		visibility
	} });
	if (params.visibility && existingEntry && resolveSessionVisibility(existingEntry) !== params.visibility) return invalidSessionRequest("sessions.create visibility requires a new session");
	return {
		ok: true,
		value: visibility
	};
}
//#endregion
//#region src/gateway/session-create-service.ts
function createGatewaySession(params) {
	return withSessionCreateAdmission(params, createAdmittedGatewaySession);
}
async function createAdmittedGatewaySession(params, agentId) {
	const incognito = params.incognito === true || isIncognitoSessionKey(params.parentSessionKey);
	const generatedKey = !params.key?.trim() && incognito ? buildDashboardSessionKey(agentId, { incognito: true }) : void 0;
	const sessionKey = generatedKey ?? resolveSessionCreateTargetKey({
		cfg: params.cfg,
		agentId,
		requestedKey: normalizeOptionalString(params.key)
	});
	const assertCurrent = () => params.commitGuard?.();
	return await withSessionActorStorage({
		sessionKey,
		agentId
	}, {
		create: true,
		lifetime: {
			assertCurrent,
			assertReadable: assertCurrent
		},
		authority: {
			assertCurrent,
			authorize() {}
		}
	}, async (memory) => {
		try {
			return await createGatewaySessionInScope(params, agentId, generatedKey);
		} finally {
			const captured = captureSessionActorStorageOwner({ sessionActor: memory });
			if (!captured?.owner?.readSession(memory.actor.target.sessionKey, {
				assertCurrent() {},
				authorize() {}
			})?.entry) captured?.owner?.closeSession(memory.actor.target.sessionKey);
		}
	}) ?? createGatewaySessionInScope(params, agentId, generatedKey);
}
async function createGatewaySessionInScope(params, agentId, generatedKey) {
	try {
		var _usingCtx$1 = _usingCtx();
		const { personalAccountDefaults, onPhase } = params;
		let operatorAuthority;
		let assertPreparedTargetCurrent;
		let creationOperation;
		let createdTargetCommitted = false;
		let bindPreparedCreation;
		const modelInputError = resolveSessionCreateModelInputError(params);
		if (modelInputError) return {
			ok: false,
			error: modelInputError
		};
		let validateRuntimeSelection;
		let releaseRuntimeSelection;
		const commitGuard = resolveSessionCreationCommitGuard(params, {
			readOperatorAuthority: () => operatorAuthority,
			assertPreparedTargetCurrent: () => assertPreparedTargetCurrent?.(),
			validateSelection: () => validateRuntimeSelection?.()
		});
		commitGuard?.();
		const displayName = truncateUtf16Safe(params.displayName?.trim() ?? "", 500).trimEnd();
		const label = normalizeOptionalString(params.label);
		const requestedKey = normalizeOptionalString(params.key);
		const parentSessionKey = normalizeOptionalString(params.parentSessionKey);
		const projectId = normalizeOptionalString(params.projectId);
		const pendingProjectGitUrl = normalizeOptionalString(params.pendingProjectGitUrl);
		const requestedToolOverrides = params.toolOverrides !== void 0;
		const catalogModel = normalizeOptionalString(params.catalogTarget?.model);
		const catalogAgentRuntime = normalizeOptionalAgentRuntimeId(params.catalogTarget?.agentRuntime);
		const catalogPluginOwnerId = normalizeOptionalString(params.catalogTarget?.pluginOwnerId);
		if (params.catalogTarget && (!catalogModel || !catalogAgentRuntime || !catalogPluginOwnerId)) return invalidSessionRequest("invalid catalog session target");
		const lifecycleIntentError = resolveSessionCreateLifecycleIntentError(params, parentSessionKey);
		if (lifecycleIntentError) return {
			ok: false,
			error: lifecycleIntentError
		};
		const explicitTargetKey = resolveSessionCreateTargetKey({
			cfg: params.cfg,
			agentId,
			requestedKey
		});
		if (isIncognitoSessionKey(explicitTargetKey) || params.incognito === true) {
			const incognitoTarget = await validateSessionCreateIncognitoTarget(params, agentId, explicitTargetKey, commitGuard);
			if (!incognitoTarget.ok) return incognitoTarget;
		}
		if (params.catalogTarget && explicitTargetKey && !explicitTargetKey.startsWith(`agent:${agentId}:dashboard:`)) return invalidSessionRequest("catalog sessions require a generated dashboard key");
		const authorizedHarnessCreation = Boolean(explicitTargetKey && params.initialEntry && normalizeOptionalAgentRuntimeId(params.authorizedAgentHarnessId) === normalizeOptionalAgentRuntimeId(params.initialEntry.agentHarnessId) && isAgentHarnessSessionKeyOwnedBy(explicitTargetKey, params.authorizedAgentHarnessId));
		const authorizedPluginCreation = Boolean(explicitTargetKey && params.initialEntry?.pluginOwnerId && params.authorizedPluginId === params.initialEntry.pluginOwnerId);
		if (params.initialEntry?.pluginOwnerId && !authorizedPluginCreation) return invalidSessionRequest("trusted plugin session owner is not authorized");
		const explicitTarget = await readRequestedSessionCreateTarget(params, agentId, explicitTargetKey);
		const initialTargetEntry = explicitTarget?.entry;
		if (explicitTargetKey && isAgentHarnessSessionKey(explicitTargetKey) && !authorizedHarnessCreation && (!initialTargetEntry || initialTargetEntry.modelSelectionLocked === true)) return invalidSessionRequest(AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE);
		const childIntentError = resolveSessionCreateChildIntentError(params, parentSessionKey);
		if (childIntentError) return {
			ok: false,
			error: childIntentError
		};
		let canonicalParentSessionKey;
		let parentSessionEntry;
		let parentSelectedAgentId;
		let parentSessionTarget;
		if (parentSessionKey) {
			const parentRequestedAgent = resolveRequestedSessionAgentId(params.cfg, parentSessionKey, !parseAgentSessionKey(parentSessionKey) && ["global", "unknown"].includes(parentSessionKey.toLowerCase()) ? params.agentId : void 0);
			if (!parentRequestedAgent.ok) return parentRequestedAgent;
			parentSelectedAgentId = parentRequestedAgent.agentId;
			const parent = await prepareSessionCreateParent({
				params,
				key: parentSessionKey,
				agentId: parentSelectedAgentId,
				assertCurrent: commitGuard
			});
			if (!parent.ok) return parent;
			canonicalParentSessionKey = parent.canonicalKey;
			parentSessionEntry = parent.entry;
			parentSessionTarget = parent.target;
		}
		if (params.activeParentFork && (params.fork !== true || parentSelectedAgentId !== agentId || (await resolveGatewaySessionStoreTargetInWorker({
			cfg: params.cfg,
			key: params.activeParentFork.requesterSessionKey,
			agentId,
			assertActive: commitGuard
		})).canonicalKey !== canonicalParentSessionKey)) return invalidSessionRequest("active fork parent must match the same-agent requester");
		const parentIncognito = parentSessionEntry?.incognito === true || isIncognitoSessionKey(canonicalParentSessionKey);
		const incognito = params.incognito === true || parentIncognito;
		const incognitoIntentError = resolveSessionCreateIncognitoIntentError({
			incognito,
			parentIncognito,
			parentSessionKey: canonicalParentSessionKey,
			targetKey: explicitTargetKey,
			requestingOperatorScopes: params.requestingOperatorScopes
		});
		if (incognitoIntentError) return {
			ok: false,
			error: incognitoIntentError
		};
		const targetSessionKey = explicitTargetKey ?? generatedKey ?? buildDashboardSessionKey(agentId, { incognito });
		const target = explicitTarget ?? await resolveGatewaySessionStoreTargetInWorker({
			cfg: params.cfg,
			key: targetSessionKey,
			agentId,
			assertActive: commitGuard
		});
		const followRegistration = (change) => params.followSharingRegistration?.({
			agentId: target.agentId,
			sessionKey: target.canonicalKey
		}, change);
		const initializingSessionFailure = () => unavailableSessionRequest(`Session ${target.canonicalKey} is still initializing; retry creation later.`);
		if (explicitTargetKey && target.canonicalKey === canonicalParentSessionKey) return invalidSessionRequest("sessions.create key must differ from parentSessionKey");
		if (explicitTargetKey && !params.initialEntry) {
			if (initialTargetEntry?.initializationPending === true) return initializingSessionFailure();
		}
		const agentMainSessionKey = resolveAgentMainSessionKey({
			cfg: params.cfg,
			agentId
		});
		const dashboardParentSessionKey = !parentSessionKey && !params.authorizedPluginId && !incognito && params.fork !== true && (params.cfg.session?.dmScope ?? "main") === "main" && params.cfg.session?.scope !== "global" && targetSessionKey !== agentMainSessionKey ? agentMainSessionKey : void 0;
		const authorityTargets = params.operatorAuthority ? [{
			target,
			entry: initialTargetEntry
		}, ...parentSessionTarget ? [{
			target: parentSessionTarget,
			entry: parentSessionEntry
		}] : []] : [];
		const operatorReady = params.operatorAuthority?.then((captured) => {
			operatorAuthority = captured?.authority;
		});
		onPhase?.("admission");
		const targetCustody = _usingCtx$1.a(prepareGatewaySessionLifecycleTargets({
			cfg: params.cfg,
			targets: authorityTargets,
			getCurrentConfig: params.getCurrentConfig,
			...operatorReady && !incognito ? { creation: {
				ready: operatorReady,
				assertCurrent: () => commitGuard?.(),
				followRegistration,
				selectTargetInLifecycle: Boolean(explicitTargetKey && !initialTargetEntry && !params.initialEntry)
			} } : {}
		}));
		let preparedCreation;
		if (operatorReady) {
			assertPreparedTargetCurrent = targetCustody.assertCurrent;
			try {
				await operatorReady;
			} catch (error) {
				return {
					ok: false,
					error: errorShape(ErrorCodes.FORBIDDEN, formatErrorMessage(error))
				};
			}
			preparedCreation = await targetCustody.prepareCreationTargets(() => createdTargetCommitted);
			bindPreparedCreation = preparedCreation.bindCreation;
			assertPreparedTargetCurrent = preparedCreation.assertCurrent;
			commitGuard?.();
		}
		const reset = tryResetGatewaySessionForCreation(params, {
			parentSessionKey: canonicalParentSessionKey,
			parentSelectedAgentId,
			agentId,
			parentIncognito,
			requestedKey,
			requestedToolOverrides,
			commitGuard
		});
		if (reset) return await reset;
		let createdContext;
		let createdNewEntry = false;
		let preparedLifecycle;
		let lifecyclePreparationCommitted = false;
		const holdParentLifecycle = params.creation?.via === "spawn" || params.emitCommandHooks === true || params.fork === true || params.authorizedPluginId !== void 0;
		const spawnToolPolicy = resolveSessionCreateSpawnPolicy(params, canonicalParentSessionKey);
		const createChildSession = async () => {
			commitGuard?.();
			if (preparedCreation) {
				onPhase?.("targetPreparation");
				await preparedCreation.enterCreationLifecycle();
				commitGuard?.();
			}
			onPhase?.("entry");
			let currentParentSessionEntry = parentSessionEntry;
			if (canonicalParentSessionKey && parentSessionTarget && holdParentLifecycle) {
				const currentParentEntry = (await loadGatewaySessionEntryReadOnlyInWorker({
					cfg: params.cfg,
					key: canonicalParentSessionKey,
					...parentSelectedAgentId ? { agentId: parentSelectedAgentId } : {},
					assertActive: commitGuard
				})).entry;
				if (!currentParentEntry?.sessionId || currentParentEntry.sessionId !== parentSessionEntry?.sessionId || currentParentEntry.lifecycleRevision !== parentSessionEntry?.lifecycleRevision) return invalidSessionRequest(`Parent session ${parentSessionKey} changed before child creation; retry.`);
				currentParentSessionEntry = currentParentEntry;
				const parentOwnershipError = resolvePluginSessionOwnershipError({
					action: params.fork === true ? "fork" : "link",
					entry: currentParentEntry,
					key: canonicalParentSessionKey,
					pluginOwnerId: params.authorizedPluginId
				});
				if (parentOwnershipError) return {
					ok: false,
					error: parentOwnershipError
				};
				if ((params.emitCommandHooks === true || params.fork === true) && isModelSelectionLocked(currentParentEntry)) return invalidSessionRequest(MODEL_SELECTION_LOCKED_PARENT_FORK_MESSAGE);
				if ((params.emitCommandHooks === true || params.fork === true) && (isEmbeddedAgentRunActive(currentParentEntry.sessionId) || isSessionWorkAdmissionActive(parentSessionTarget.storePath, [canonicalParentSessionKey, currentParentEntry.sessionId])) && (params.emitCommandHooks === true || params.forkFrom !== "last-completed" && !params.activeParentFork)) return unavailableSessionRequest(`Parent session ${parentSessionKey} is still active; try again in a moment.`);
			}
			if (canonicalParentSessionKey && parentSessionTarget && params.emitCommandHooks === true) {
				const parentEntry = currentParentSessionEntry;
				const parentAgentId = normalizeAgentId(parentSelectedAgentId ?? resolveAgentIdFromSessionKey(canonicalParentSessionKey) ?? agentId);
				const workspaceDir = resolveAgentWorkspaceDir(params.cfg, parentAgentId);
				if (hasInternalHookListeners("command", "new")) await triggerInternalHook(createInternalHookEvent("command", "new", canonicalParentSessionKey, {
					agentId: parentAgentId,
					sessionEntry: parentEntry,
					previousSessionEntry: parentEntry,
					commandSource: params.commandSource,
					cfg: params.cfg,
					storePath: parentSessionTarget.storePath,
					workspaceDir
				}));
				const { emitGatewayBeforeResetPluginHook } = await loadSessionLifecycleRuntime();
				await emitGatewayBeforeResetPluginHook({
					cfg: params.cfg,
					key: canonicalParentSessionKey,
					target: parentSessionTarget,
					storePath: parentSessionTarget.storePath,
					entry: parentEntry,
					reason: "new"
				});
			}
			const { creation, ownerAssignment: inheritedSpawnOwner } = resolveSessionCreateInheritance({
				creation: params.creation,
				parent: currentParentSessionEntry
			});
			const targetRead = await readSessionCreateTarget({
				...params,
				commitGuard
			}, target, initialTargetEntry?.sessionId, targetLifecycleIdentities);
			commitGuard?.();
			if (!targetRead.ok) return targetRead;
			const currentTargetEntry = targetRead.value;
			const creationSandbox = creation?.sandbox ?? (creation ? resolveCreatorSandbox(params.cfg, creation) : void 0);
			const sandboxRequired = currentTargetEntry?.sandbox === "required" || creationSandbox === "required";
			const forkWorkspace = params.fork === true && currentParentSessionEntry && !currentTargetEntry && parentSessionTarget?.agentId === target.agentId && !projectId && !params.spawnedCwd && !params.sessionRoot && !params.execNode && !params.deviceFolder && !params.prepareLifecycle && !params.pendingWorktree && !params.pendingProjectGitUrl ? prepareSessionForkFilesystemRoot({
				cfg: params.cfg,
				parent: currentParentSessionEntry,
				targetAgentId: target.agentId,
				sessionKey: target.canonicalKey,
				sandboxRequired
			}) : void 0;
			if (forkWorkspace && !forkWorkspace.ok) return {
				ok: false,
				error: forkWorkspace.error
			};
			const inheritedWorkspace = forkWorkspace?.value;
			const requestedRoot = normalizeOptionalString(params.spawnedCwd ?? params.sessionRoot);
			if (sandboxRequired && requestedRoot && !params.execNode) {
				const root = prepareSessionCreateFilesystemRoot({
					cfg: params.cfg,
					enforceSandboxContainment: true,
					sandboxRequired,
					requestedProjectId: projectId,
					sessionCwd: requestedRoot,
					sessionKey: target.canonicalKey,
					targetAgentId: target.agentId
				});
				if (!root.ok) return {
					ok: false,
					error: root.error
				};
			}
			const modelSelection = prepareSessionCreateModelSelection({
				cfg: params.cfg,
				agentId: target.agentId,
				input: params.catalogTarget ?? (params.model ? {
					model: params.model,
					agentRuntime: params.agentRuntime
				} : void 0),
				parentEntry: currentParentSessionEntry,
				preparedModelSelection: params.preparedModelSelection?.ref,
				operatorAuthority
			});
			if (!modelSelection.ok) return modelSelection;
			validateRuntimeSelection = modelSelection.validate;
			commitGuard?.();
			onPhase?.("worktree");
			const preparationResult = params.prepareLifecycle ? await params.prepareLifecycle({
				agentId: target.agentId,
				entry: currentTargetEntry,
				key: target.canonicalKey,
				storePath: target.storePath,
				titleModelSelection: modelSelection.selection,
				projectId,
				sandboxRequired
			}) : void 0;
			if (preparationResult && !preparationResult.ok) return {
				ok: false,
				error: preparationResult.error
			};
			preparedLifecycle = preparationResult?.value;
			const pendingWorktree = preparedLifecycle?.pendingWorktree ?? params.pendingWorktree;
			const spawnedCwd = normalizeOptionalString(preparedLifecycle?.spawnedCwd ?? params.spawnedCwd ?? inheritedWorkspace?.spawnedCwd);
			const sessionRoot = normalizeOptionalString(preparedLifecycle?.sessionRoot ?? params.sessionRoot ?? inheritedWorkspace?.sessionRoot ?? params.defaultSessionRoot);
			const runtimeCwd = spawnedCwd ?? sessionRoot;
			const loadModelCatalog = params.loadGatewayModelCatalogSnapshot;
			let preparedModelCatalog;
			onPhase?.("snapshot");
			const created = await createSessionEntryWithTranscript({
				agentId: target.agentId,
				sessionKey: target.canonicalKey,
				storePath: target.storePath
			}, async ({ existingEntry, targetEntry, labelInUse }) => {
				if (!existingEntry) {
					const creationError = authorizeGatewaySessionCreation({
						cfg: params.cfg,
						agentId: target.agentId,
						...params.operatorRoleActor ? { actor: params.operatorRoleActor } : { profileId: params.requestingOperatorProfileId }
					});
					if (creationError) return {
						ok: false,
						error: creationError
					};
				}
				if (isAgentHarnessSessionKey(target.canonicalKey) && !authorizedHarnessCreation && (!existingEntry || existingEntry.modelSelectionLocked === true)) return invalidSessionRequest(AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE);
				if (!params.initialEntry && existingEntry?.initializationPending === true) return initializingSessionFailure();
				if (params.initialEntry && existingEntry !== void 0) return invalidSessionRequest("trusted initial session state requires a new session");
				if (params.deviceFolder && existingEntry !== void 0 && (existingEntry.deviceFolder?.deviceId !== params.deviceFolder.deviceId || existingEntry.deviceFolder.path !== params.deviceFolder.path)) return invalidSessionRequest("device folder requires a new session or its original folder");
				if (params.catalogTarget && existingEntry !== void 0) return invalidSessionRequest("catalog session target requires a new session");
				if ((pendingProjectGitUrl || pendingWorktree) && existingEntry !== void 0) return invalidSessionRequest("workspace preparation requires a new session");
				if (spawnToolPolicy && existingEntry !== void 0) return invalidSessionRequest("spawn tool policy requires a new session");
				const visibility = resolveSessionCreateVisibility(params, existingEntry);
				if (!visibility.ok) return visibility;
				createdNewEntry = existingEntry === void 0;
				const requestedModel = normalizeOptionalString(params.model);
				const requestedContextWindow = normalizeOptionalString(params.contextWindow);
				const requestedThinkingLevel = normalizeOptionalString(params.thinkingLevel);
				const requestedFastMode = params.fastMode;
				if (existingEntry?.sessionId && params.allowExistingModelSelection !== true) {
					const gateDefaultModel = resolveDefaultModelForAgent({
						cfg: params.cfg,
						agentId: target.agentId
					});
					if (await existingSessionSelectionWouldChange({
						agentId: target.agentId,
						cfg: params.cfg,
						catalogModel,
						defaultModel: gateDefaultModel.model,
						defaultProvider: gateDefaultModel.provider,
						existingEntry,
						loadGatewayModelCatalogSnapshot: params.loadGatewayModelCatalogSnapshot,
						requestedModel,
						requestedAgentRuntime: params.agentRuntime,
						requestedContextWindow,
						requestedFastMode,
						requestedThinkingLevel,
						subagentModelHint: isSubagentSessionKey(target.canonicalKey) ? resolveSubagentConfiguredModelSelection({
							cfg: params.cfg,
							agentId: target.agentId
						}) : void 0
					})) return {
						ok: false,
						error: missingScopeErrorShape({
							missingScope: ADMIN_SCOPE,
							requiredScopes: [ADMIN_SCOPE]
						})
					};
				}
				const patched = await projectSessionsPatchEntry({
					cfg: params.cfg,
					existingEntry: targetEntry,
					isLabelInUse: () => labelInUse,
					storeKey: target.canonicalKey,
					agentId: target.agentId,
					preparedSessionRoot: sessionRoot,
					preparedAgentRuntime: catalogAgentRuntime,
					patch: {
						key: target.canonicalKey,
						label,
						category: normalizeOptionalString(params.category),
						...catalogModel ?? requestedModel ? { model: catalogModel ?? requestedModel } : {},
						...params.agentRuntime !== void 0 ? { agentRuntime: params.agentRuntime } : {},
						...requestedContextWindow ? { contextWindow: requestedContextWindow } : {},
						...requestedThinkingLevel ? { thinkingLevel: requestedThinkingLevel } : {},
						...requestedFastMode !== void 0 ? { fastMode: requestedFastMode } : {},
						...requestedToolOverrides ? { toolOverrides: params.toolOverrides } : {},
						...params.communication !== void 0 ? { communication: params.communication } : {},
						...params.permissionMode ? { permissionMode: params.permissionMode } : {}
					},
					loadGatewayModelCatalogSnapshot: loadModelCatalog ? async () => {
						preparedModelCatalog = await loadModelCatalog();
						return preparedModelCatalog;
					} : void 0,
					authorizedAgentHarnessId: params.authorizedAgentHarnessId,
					personalModelSelection: params.personalModelSelection,
					operatorAuthority,
					preparedModelSelection: params.preparedModelSelection?.ref,
					pinModelSelection: true
				});
				if (!patched.ok) return patched;
				const adoptionError = sessionCreatePolicyAdoptionError(existingEntry, patched.entry, params);
				if (adoptionError) return invalidSessionRequest(adoptionError);
				const execNode = normalizeOptionalString(params.execNode);
				const execCwd = normalizeOptionalString(params.execCwd);
				const initialAgentHarnessId = params.initialEntry ? normalizeOptionalString(params.initialEntry.agentHarnessId) : void 0;
				const initialColor = params.initialEntry?.color ? normalizeSessionColorValue(params.initialEntry.color) : null;
				if (params.initialEntry && !initialAgentHarnessId && !authorizedPluginCreation) return invalidSessionRequest(params.initialEntry?.agentHarnessId !== void 0 ? "initial agentHarnessId must be non-empty" : "trusted initial session state requires an authorized owner");
				const catalogResolvedModel = params.catalogTarget ? resolveSessionModelRef(params.cfg, patched.entry, target.agentId) : void 0;
				const initializedEntry = {
					...patched.entry,
					...inheritedWorkspace,
					...createdNewEntry && displayName ? { displayName } : {},
					...projectSessionCreateSpawnModelSelection({
						entry: patched.entry,
						creation: params.creation,
						requestedModel,
						createdNewEntry
					}),
					...existingEntry === void 0 && patched.entry.delivery === void 0 ? { delivery: normalizeSessionDeliveryState() } : {},
					...creation && createdNewEntry ? buildSessionCreationStamp({
						...creation,
						sandbox: creationSandbox,
						incognito
					}) : {},
					...createdNewEntry && inheritedSpawnOwner ? { owner: inheritedSpawnOwner } : {},
					...visibility.value && createdNewEntry ? { visibility: visibility.value } : {},
					...projectPreparedSessionWorkspace(existingEntry, {
						projectId,
						pendingProjectGitUrl,
						pendingWorktree,
						spawnedCwd,
						preparedLifecycle
					}),
					...catalogResolvedModel && catalogAgentRuntime ? {
						providerOverride: catalogResolvedModel.provider,
						modelOverride: catalogResolvedModel.model,
						modelOverrideSource: "user",
						modelOverrideRouteResolution: "resolved",
						agentRuntimeOverride: catalogAgentRuntime,
						modelSelectionLocked: true,
						pluginOwnerId: catalogPluginOwnerId
					} : {},
					...params.deviceFolder ? { deviceFolder: { ...params.deviceFolder } } : {},
					...execNode ? {
						execHost: "node",
						execNode,
						...execCwd ? { execCwd } : {}
					} : {},
					...createdNewEntry && params.armSessionDiffBaselineCapture && !execNode && !params.deviceFolder ? { sessionDiffBaselineCapture: createSessionDiffBaselineCaptureClaim() } : {},
					...initialAgentHarnessId ? { agentHarnessId: initialAgentHarnessId } : {},
					...initialColor ? { color: initialColor } : {},
					...createdNewEntry && params.authorizedPluginId && !params.catalogTarget ? { pluginOwnerId: params.authorizedPluginId } : {},
					...authorizedPluginCreation && params.initialEntry?.providerOverride ? { providerOverride: params.initialEntry.providerOverride } : {},
					...authorizedPluginCreation && params.initialEntry?.modelOverride ? { modelOverride: params.initialEntry.modelOverride } : {},
					...authorizedPluginCreation && params.initialEntry?.modelOverrideRouteResolution ? { modelOverrideRouteResolution: params.initialEntry.modelOverrideRouteResolution } : {},
					...authorizedPluginCreation && params.initialEntry?.cliSessionBindings ? { cliSessionBindings: structuredClone(params.initialEntry.cliSessionBindings) } : {},
					...params.initialEntry?.initializationPending === true || params.atomicInitialization === true ? { initializationPending: true } : {},
					...params.initialEntry?.modelSelectionLocked === true ? { modelSelectionLocked: true } : {},
					...params.initialEntry?.pluginExtensions !== void 0 ? { pluginExtensions: structuredClone(params.initialEntry.pluginExtensions) } : {},
					...existingEntry === void 0 ? { spawnDepth: params.spawnDepth ?? 0 } : {},
					...existingEntry === void 0 ? spawnToolPolicy : {},
					...existingEntry === void 0 && incognito ? { incognito: true } : {}
				};
				const explicitParentSessionKey = canonicalParentSessionKey ?? normalizeOptionalString(initializedEntry.parentSessionKey);
				const entry = {
					...initializedEntry,
					...inheritSessionCreateParentFields({
						parent: currentParentSessionEntry,
						overrides: params,
						newExplicitChild: createdNewEntry && Boolean(canonicalParentSessionKey),
						newDashboardRoot: createdNewEntry && Boolean(dashboardParentSessionKey) && !explicitParentSessionKey,
						selectedModel: initializedEntry.modelOverride
					}),
					...buildSessionParentLink({
						parentSessionKey: explicitParentSessionKey ?? dashboardParentSessionKey,
						parent: canonicalParentSessionKey ? currentParentSessionEntry : void 0,
						captureSpawnAuthority: createdNewEntry && params.creation?.via === "spawn" && Boolean(spawnToolPolicy),
						requesterSenderIsOwner: params.creation?.requesterSenderIsOwner
					})
				};
				let validateAccountModel;
				if (params.fork !== true) {
					if (createdNewEntry && !entry.authProfileOverride && personalAccountDefaults) {
						const account = await prepareSessionCreateDefaultAccount({
							cfg: params.cfg,
							agentId: target.agentId,
							entry,
							defaults: personalAccountDefaults,
							operatorAuthority,
							resetToDefault: params.model === void 0 && !params.catalogTarget,
							assertCurrent: commitGuard
						});
						if (!account.ok) return account;
						validateAccountModel = account.validate;
						validateRuntimeSelection = account.validate;
						commitGuard?.();
						if (account.profileId) {
							entry.authProfileOverride = account.profileId;
							entry.authProfileOverrideSource = "user-link";
							delete entry.authProfileOverrideCompactionCount;
						}
					}
				}
				const runtimeSelection = await prepareSessionPatchRuntimeSelection({
					cfg: params.cfg,
					agentId: target.agentId,
					patch: {
						key: target.canonicalKey,
						agentRuntime: params.agentRuntime,
						model: params.model
					},
					entry,
					catalog: preparedModelCatalog?.entries,
					hydrateThinkingCatalog: false,
					validateModelSelection: validateAccountModel ?? patched.validateModelSelection ?? modelSelection.validate,
					...params.agentRuntime !== void 0 || params.model !== void 0 ? { placement: {
						context: resolveSessionWorkerPlacementContext(),
						sessionKey: target.canonicalKey
					} } : {}
				});
				if (!runtimeSelection.ok) return runtimeSelection;
				releaseRuntimeSelection?.();
				releaseRuntimeSelection = runtimeSelection.release;
				validateRuntimeSelection = runtimeSelection.validate;
				if (params.childSessionPublication) {
					params.childSessionPublication.claim({
						sessionKey: target.canonicalKey,
						entry,
						parentSessionKey: canonicalParentSessionKey,
						parent: currentParentSessionEntry,
						isNew: createdNewEntry,
						fork: params.fork
					});
					entry.publicShare = prepareSessionPublicShareGrant(entry, target.canonicalKey);
				}
				if (params.fork !== true) return {
					...patched,
					entry
				};
				if (!canonicalParentSessionKey || !currentParentSessionEntry || !parentSessionTarget) return unavailableSessionRequest("failed to resolve parent session for fork");
				const forkMaxTokens = await resolveSessionForkMaxTokens({
					cfg: params.cfg,
					agentId: target.agentId,
					sessionKey: target.canonicalKey,
					entry,
					loadGatewayModelCatalogSnapshot: params.loadGatewayModelCatalogSnapshot
				});
				const forkFromParent = async (assertSourceCurrent) => await prepareSessionForkFromParent({
					parentEntry: currentParentSessionEntry,
					agentId: parentSessionTarget.agentId,
					...commitGuard || assertSourceCurrent ? { commitGuard: () => {
						commitGuard?.();
						assertSourceCurrent?.();
					} } : {},
					parentSessionKey: canonicalParentSessionKey,
					sessionKey: target.canonicalKey,
					storePath: parentSessionTarget.storePath,
					...forkMaxTokens ? { maxTokens: forkMaxTokens } : {},
					targetStorePath: target.storePath,
					...params.forkFrom ? { forkFrom: params.forkFrom } : {}
				});
				const forkWithCreation = (assertSourceCurrent) => creationOperation ? runWithSessionEntryCreationPublication(creationOperation, () => forkFromParent(assertSourceCurrent)) : forkFromParent(assertSourceCurrent);
				const forkResult = preparedLifecycle?.withCommit ? await preparedLifecycle.withCommit(forkWithCreation) : await forkWithCreation();
				if (forkResult.status === "too-large") return invalidSessionRequest(`parent session is too large to fork (${forkResult.decision.parentTokens}/${forkResult.decision.maxTokens} tokens)`);
				if (forkResult.status !== "prepared") return unavailableSessionRequest("failed to fork parent session transcript");
				return {
					...patched,
					transcriptEvents: forkResult.events,
					entry: buildForkedGatewaySessionEntry(entry, forkResult.transcript, {
						sessionKey: canonicalParentSessionKey,
						entry: currentParentSessionEntry
					}, existingEntry)
				};
			}, {
				onPhase,
				label,
				...params.initialEntry ? {
					activeSessionKey: target.canonicalKey,
					requireWriteSuccess: true
				} : {},
				...commitGuard ? { commitGuard } : {},
				followRegistration,
				...bindPreparedCreation || params.bindSharingCreation ? { bindCreation: (operation) => {
					commitGuard?.();
					bindPreparedCreation?.(operation);
					params.bindSharingCreation?.(operation);
					creationOperation = operation;
				} } : {},
				...preparedLifecycle?.withCommit ? { withCommit: preparedLifecycle.withCommit } : {},
				...inheritedSpawnOwner ? { resolveOwnerAssignment: () => createdNewEntry ? inheritedSpawnOwner : void 0 } : {},
				afterCommitted: params.afterSessionCommitted,
				onLifecycleCommitted: (entry) => {
					onPhase?.("publication");
					lifecyclePreparationCommitted = true;
					createdTargetCommitted = true;
					if (createdNewEntry) params.onCreatedSessionCommitted?.({
						key: target.canonicalKey,
						agentId: target.agentId,
						storePath: target.storePath,
						entry,
						isNew: true
					});
				},
				...runtimeCwd ? { cwd: runtimeCwd } : {}
			}).catch((error) => {
				if (error instanceof Error && error.name === "SessionLabelConflictError") return {
					...invalidSessionRequest(error.message),
					phase: "entry"
				};
				throw error;
			});
			if (!created.ok) return sessionCreationFailure(created);
			onPhase?.("effects");
			createdContext = {
				key: target.canonicalKey,
				agentId: target.agentId,
				entry: projectPublicSessionEntry(created.entry),
				storePath: target.storePath,
				isNew: createdNewEntry
			};
			if (!createdNewEntry && (params.agentRuntime !== void 0 || params.model !== void 0)) refreshSessionPatchQueuedSelection({
				cfg: params.cfg,
				entry: created.entry,
				patch: {
					key: target.canonicalKey,
					agentRuntime: params.agentRuntime,
					model: params.model
				},
				sessionKey: target.canonicalKey,
				agentId: target.agentId,
				catalog: preparedModelCatalog?.entries
			});
			if (createdNewEntry) await recordSessionCreated(params.cfg, {
				sessionKey: createdContext.key,
				agentId: createdContext.agentId,
				entry: createdContext.entry
			});
			if (canonicalParentSessionKey && parentSessionTarget && params.emitCommandHooks === true) {
				const parentEntry = currentParentSessionEntry;
				const { emitGatewaySessionEndPluginHook, emitGatewaySessionStartPluginHook } = await loadSessionLifecycleRuntime();
				if (params.succeedsParent !== false) emitGatewaySessionEndPluginHook({
					cfg: params.cfg,
					sessionKey: canonicalParentSessionKey,
					sessionId: parentEntry?.sessionId,
					storePath: parentSessionTarget.storePath,
					sessionFile: canonicalParentSessionKey,
					agentId: parentSessionTarget.agentId,
					reason: "new",
					nextSessionId: created.entry.sessionId,
					nextSessionKey: target.canonicalKey
				});
				emitGatewaySessionStartPluginHook({
					cfg: params.cfg,
					sessionKey: target.canonicalKey,
					sessionId: created.entry.sessionId,
					resumedFrom: parentEntry?.sessionId,
					storePath: target.storePath,
					sessionFile: target.canonicalKey,
					agentId: target.agentId
				});
			}
			const selectedModel = resolveSessionModelRef(params.cfg, created.entry, target.agentId);
			return {
				ok: true,
				key: target.canonicalKey,
				agentId: target.agentId,
				entry: projectPublicSessionEntry(created.entry),
				resolved: {
					modelProvider: selectedModel.provider,
					model: selectedModel.model
				},
				resetExisting: false
			};
		};
		const targetLifecycleIdentities = [
			target.canonicalKey,
			...target.storeKeys,
			...requestedKey ? [requestedKey] : [],
			...initialTargetEntry?.sessionId ? [initialTargetEntry.sessionId] : []
		];
		const lifecycleTargets = buildSessionCreateLifecycleTargets({
			target,
			targetLifecycleIdentities,
			canonicalParentSessionKey,
			parentSessionEntry,
			parentSessionTarget,
			holdParentLifecycle
		});
		onPhase?.("lifecycleAdmission");
		try {
			const result = await runExclusiveSessionLifecycleMutation("create", {
				targets: lifecycleTargets,
				run: createChildSession,
				finalize: async () => {
					if (!lifecyclePreparationCommitted) await rollbackGatewaySessionPreparation({
						prepared: preparedLifecycle,
						onError: params.onLifecycleCleanupError
					});
				}
			});
			if (!result.ok) return result;
			onPhase?.("initialTurn");
			return await completeGatewaySessionCreation(params, result, createdContext, commitGuard);
		} finally {
			releaseRuntimeSelection?.();
		}
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
//#endregion
export { prepareSessionCreateModelSelection as n, resolveSessionCreateCatalogSelectionError as r, createGatewaySession as t };
