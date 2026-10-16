import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import "./src-CdRlGRnW.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as _usingCtx } from "./usingCtx-DwOBYOJf.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { a as resolveAgentDir, d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey, l as resolveAgentIdFromSessionKey, w as isSubagentSessionKey } from "./session-key-C09ow4h0.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { a as normalizeOptionalAgentRuntimeId } from "./agent-runtime-id-BZLMe-UU.mjs";
import { t as findModelCatalogEntry } from "./model-catalog-lookup-vismCEk2.mjs";
import { n as resolveSubagentConfiguredModelSelection, t as resolveDefaultModelForAgent } from "./model-selection-config-DYd_ufXT.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-DsrPoRc4.mjs";
import { v as isUserModelAuthProfileId } from "./profile-usage-stats-BLwxBqRR.mjs";
import { r as isUserModelAuthProfileOwner } from "./user-model-accounts-sYn17idc.mjs";
import { c as normalizeSessionDeliveryState } from "./delivery-context.shared-PF5njaoI.mjs";
import { r as resolveAgentMainSessionKey } from "./main-session-00MgEWj5.mjs";
import { c as readResidentUserProfileId } from "./user-profile-list-CtETKur7.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape, p as missingScopeErrorShape } from "./error-codes-Dh56LniQ.mjs";
import { o as normalizeSessionColorValue } from "./session-agent-status-BSzRJm_2.mjs";
import { l as resolveCreatorSandbox, n as authorizeGatewaySessionCreation } from "./operator-role-policy-BqPaarjx.mjs";
import { n as forkCliSessionBindings } from "./cli-session-binding-CMk8AbZT.mjs";
import "./model-selection-C1qxt1eY.mjs";
import { a as isAgentHarnessSessionKey, o as isAgentHarnessSessionKeyOwnedBy, r as AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE } from "./agent-harness-session-key-D8EQIzja.mjs";
import { t as cliBackendSupportsSessionFork } from "./cli-backends-CEoVwGbW.mjs";
import { s as resolveEffectiveAgentRuntime } from "./thinking-runtime-BwS3HC5I.mjs";
import "./model-catalog-B5tSuR_i.mjs";
import { t as resolveModelProviderAuthConfig } from "./model-auth-provider-route-DRm2f6tV.mjs";
import { b as runWithSessionEntryCreationPublication } from "./session-accessor.sqlite-entry-cache-nS4OEr3G.mjs";
import { a as loadExactSessionEntryFromStoreReadOnly } from "./session-accessor.sqlite-exact-read-JW6IveXD.mjs";
import { a as inheritSpawnSessionOwner, i as inheritSessionGitContributorProfileIds, n as buildSessionCreationStamp, r as inheritSessionCreationPolicy } from "./session-entry-provenance-Bfs2J1E7.mjs";
import { g as runExclusiveSessionLifecycleMutation, h as isSessionWorkAdmissionActive } from "./session-lifecycle-admission-GoxISURZ.mjs";
import { s as patchSessionEntryCore } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import { t as buildSessionParentLink } from "./session-entry-lineage-Dms9xZt1.mjs";
import { a as resolveSessionEntryAccessTarget } from "./session-accessor.entry-Di4jQk7u.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { c as invalidSessionRequest, l as sessionCreationFailure, n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { b as inheritSessionSelection, i as createSessionEntryWithTranscript } from "./session-accessor.reset-DWr6djSD.mjs";
import { n as deleteSessionEntryLifecycle } from "./session-accessor.sqlite-lifecycle-BH4CIDLX.mjs";
import { n as MODEL_SELECTION_LOCKED_PARENT_FORK_MESSAGE, s as isModelSelectionLocked } from "./model-overrides-uZFvcSRc.mjs";
import { y as projectPublicSessionEntry } from "./session-accessor.sqlite-transcript-write-Kl-_Ewp0.mjs";
import { n as buildMainSessionRecoveryClearPatch } from "./main-session-recovery-clear-BczELu-B.mjs";
import { d as isEmbeddedAgentRunActive } from "./runs-BErx7xDZ.mjs";
import { g as normalizeInheritedToolDenylist, h as normalizeInheritedToolAllowlist } from "./subagent-capabilities-DD6QCsqy.mjs";
import { r as prepareSessionForkFromParent } from "./session-fork-U_mk7072.mjs";
import { i as hasInternalHookListeners, n as createInternalHookEvent, u as triggerInternalHook } from "./internal-hooks-CcXmGbgu.mjs";
import { t as resolveSessionWorkerPlacementContext } from "./session-worker-placement-context-98j7PlVT.mjs";
import { n as resolveSessionModelRef } from "./session-model-ref-zMXEXgI3.mjs";
import { o as resolveContextTokensForModel } from "./context-qaLs5Adf.mjs";
import { s as resolveModelContextWindowProfile } from "./session-utils-model-0e9R_Y2U.mjs";
import { i as selectModelCatalogRuntimeEntry } from "./model-catalog-view-B5SlLDbh.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-BX-eWQU_.mjs";
import { m as isSessionVisibilityAllowed, v as resolveSessionVisibility } from "./session-sharing-policy-4QkIpHi4.mjs";
import { t as resolveGatewaySessionStoreTargetInWorker } from "./session-utils-store-worker-Dc1i92s7.mjs";
import { n as shouldPreserveSessionAuthProfileOverride } from "./auth-profile-preservation-C7x4I4Ip.mjs";
import { n as waitForSessionParticipantRecording } from "./session-participant-recording-CvHYNod1.mjs";
import { t as recordSessionCreated } from "./session-created-8DGomWci.mjs";
import { n as prepareSessionForkFilesystemRoot, t as prepareSessionCreateFilesystemRoot } from "./session-create-root-DZxHdqNB.mjs";
import "./embedded-agent-B_DdyEe2.mjs";
import "./session-utils-CwljFiKR.mjs";
import { t as createSessionDiffBaselineCaptureClaim } from "./session-diff-baseline-capture-6ejBT0Am.mjs";
import { a as resolveSessionCreateLifecycleIntentError, i as resolveSessionCreateIncognitoIntentError, n as projectPreparedSessionWorkspace, o as rollbackGatewaySessionPreparation, r as resolveSessionCreateChildIntentError, t as prepareGatewaySessionLifecycleTargets } from "./session-lifecycle-preparation-CfwLlYlr.mjs";
import { t as resolvePluginSessionOwnershipError } from "./session-plugin-ownership-BbxQNnS-.mjs";
import { t as ModelAccountConnectAuthorityError } from "./model-account-connect-wfMmajkJ.mjs";
import { i as refreshSessionPatchQueuedSelection, n as prepareSessionPatchModelSelection, o as resolveSessionPatchModelSelection, r as prepareSessionPatchRuntimeSelection } from "./sessions-patch-model-selection-CJHin-tx.mjs";
import { r as resolveSessionCreateTargetKey, t as buildDashboardSessionKey } from "./session-create-key-PyagwtIc.mjs";
import { n as projectSessionsPatchEntry } from "./sessions-patch-CRUYU7MO.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/session-create-existing-selection.ts
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
	const resolved = resolveSessionPatchModelSelection({
		cfg: params.cfg,
		agentId: params.agentId,
		catalog: catalog.entries,
		raw: requestedModel,
		defaultProvider: params.defaultProvider,
		defaultModel: params.defaultModel,
		subagentModelHint: params.subagentModelHint
	});
	if (!resolved.ok) return true;
	let existingProvider = normalizeOptionalString(params.existingEntry.providerOverride) ?? params.defaultProvider;
	let existingModel = normalizeOptionalString(params.existingEntry.modelOverride) ?? params.defaultModel;
	if (!normalizeOptionalString(params.existingEntry.modelOverride) && params.subagentModelHint) {
		const resolvedSubagentDefault = resolveSessionPatchModelSelection({
			cfg: params.cfg,
			agentId: params.agentId,
			catalog: catalog.entries,
			raw: params.subagentModelHint,
			defaultProvider: params.defaultProvider,
			defaultModel: params.defaultModel
		});
		if (!resolvedSubagentDefault.ok) return true;
		if (!normalizeOptionalString(params.existingEntry.providerOverride)) existingProvider = resolvedSubagentDefault.provider;
		existingModel = resolvedSubagentDefault.model;
	}
	const existingProfile = normalizeOptionalString(params.existingEntry.authProfileOverride);
	const requestedProfile = normalizeOptionalString(resolved.profile);
	const profileWouldChange = requestedProfile !== void 0 ? requestedProfile !== existingProfile : existingProfile !== void 0 && !shouldPreserveSessionAuthProfileOverride({
		cfg: params.cfg,
		agentDir: resolveAgentDir(params.cfg, params.agentId),
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
/** Only an explicit parent supplies launch navigation; dashboard grouping is not lineage. */
function inheritSessionCreateParentFields(params) {
	const { parent, existing, overrides } = params;
	const inherited = overrides.catalogTarget?.model.trim() || overrides.model?.trim() ? {} : inheritSessionSelection(parent);
	if (overrides.toolOverrides !== void 0) delete inherited.toolOverrides;
	if (overrides.fastMode !== void 0) delete inherited.fastMode;
	return {
		...inherited,
		...!existing && parent?.conversationLink ? { conversationLink: parent.conversationLink } : {}
	};
}
/** Prepare the parent before lifecycle custody, while accepted input can still settle. */
async function prepareSessionCreateParent(input) {
	const target = await resolveGatewaySessionStoreTargetInWorker({
		cfg: input.params.cfg,
		key: input.key,
		...input.agentId ? { agentId: input.agentId } : {},
		assertActive: input.assertCurrent
	});
	if (input.params.creation?.via === "spawn") {
		await waitForSessionParticipantRecording({
			agentId: target.agentId,
			sessionKey: target.canonicalKey,
			storePath: target.storePath
		});
		input.assertCurrent?.();
	}
	const parent = loadGatewaySessionEntryReadOnly(input.key, { agentId: input.agentId });
	if (!parent.entry?.sessionId) return invalidSessionRequest(`unknown parent session: ${input.key}`);
	const ownershipError = resolvePluginSessionOwnershipError({
		action: input.params.fork === true ? "fork" : "link",
		entry: parent.entry,
		key: parent.canonicalKey,
		pluginOwnerId: input.params.authorizedPluginId
	});
	if (ownershipError) return {
		ok: false,
		error: ownershipError
	};
	if (isModelSelectionLocked(parent.entry)) return invalidSessionRequest(MODEL_SELECTION_LOCKED_PARENT_FORK_MESSAGE);
	return {
		ok: true,
		entry: parent.entry,
		canonicalKey: parent.canonicalKey,
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
		...params.preparedPermissionSelection ? { permissionMode: params.preparedPermissionSelection.mode } : {},
		...allow.length > 0 ? { inheritedToolAllow: allow } : {},
		...deny.length > 0 ? { inheritedToolDeny: deny } : {}
	};
}
//#endregion
//#region src/gateway/session-create-model-selection.ts
const loadSessionAuthRuntime = createLazyRuntimeModule(() => import("./session-override-CxDwOuOW.mjs"));
function resolveSessionCreateModelInputError(params) {
	if (params.agentRuntime !== void 0 && (!params.model || params.catalogTarget)) return errorShape(ErrorCodes.INVALID_REQUEST, "agentRuntime requires an explicit canonical provider/model selection");
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
/** Title preparation and the row commit retain the same caller, model, and account fences. */
function createSessionCreateCommitGuard(params) {
	return () => {
		params.assertCallerCurrent?.();
		params.operatorAuthority?.assertCurrent();
		const error = params.validateSelection();
		if (error) throw new Error(error.message);
		for (const selection of params.selections) selection?.assertCurrent();
		const selectedProfile = params.readDefaultProfile();
		if (params.personalAccountDefaults && selectedProfile && isUserModelAuthProfileId(selectedProfile) && !isUserModelAuthProfileOwner({
			profileId: params.personalAccountDefaults.owner,
			authProfileId: selectedProfile
		})) throw new ModelAccountConnectAuthorityError();
	};
}
/** New unpinned sessions bind an account for the caller's permitted default without storing a model pin. */
async function prepareSessionCreateDefaultAccount(params) {
	const { resolveUserLinkedAuthProfile } = await loadSessionAuthRuntime();
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
	return {
		ok: true,
		profileId: resolveUserLinkedAuthProfile({
			cfg: resolveModelProviderAuthConfig({
				config: params.cfg,
				provider: model.provider,
				modelId: model.model
			}),
			agentDir: resolveAgentDir(params.cfg, params.agentId),
			provider: model.provider,
			requesterProfileId: params.defaults.owner
		})?.profileId,
		validate: selected.validate
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
		})
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
		allowAsyncLoad: false,
		allowUnscopedModelLookup: false
	});
	return childContextWindow.contextTokens ? Math.min(resolvedForkMaxTokens ?? childContextWindow.contextTokens, childContextWindow.contextTokens) : resolvedForkMaxTokens;
}
//#endregion
//#region src/gateway/session-create-target.ts
function readSessionCreateTarget(params, target, expectedSessionId, lifecycleIdentities) {
	const currentTargetEntry = loadGatewaySessionEntryReadOnly(target.canonicalKey, { agentId: target.agentId }).entry;
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
			if (currentTargetEntry.sessionId !== expectedSessionId) return {
				ok: false,
				error: errorShape(ErrorCodes.UNAVAILABLE, `Session ${target.canonicalKey} changed before workspace preparation; retry.`)
			};
			if (isSessionWorkAdmissionActive(target.storePath, lifecycleIdentities) || isEmbeddedAgentRunActive(currentTargetEntry.sessionId)) return {
				ok: false,
				error: errorShape(ErrorCodes.UNAVAILABLE, `Session ${target.canonicalKey} is still active; retry workspace preparation after its work finishes.`)
			};
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
//#region src/gateway/session-lifecycle-runtime-loader.ts
/** Lazily loads the session lifecycle runtime to preserve the Gateway startup boundary. */
const loadSessionLifecycleRuntime = createLazyRuntimeModule(() => import("./sessions.runtime.js"));
//#endregion
//#region src/gateway/session-create-service.ts
async function createGatewaySession(params) {
	try {
		var _usingCtx$1 = _usingCtx();
		const { personalModelSelection, personalAccountDefaults, onPhase } = params;
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
		let selectedDefaultProfile;
		let validateRuntimeSelection;
		const commitGuard = personalModelSelection || params.operatorAuthority || personalAccountDefaults || params.activeParentFork || params.preparedModelSelection || params.preparedPermissionSelection || typeof params.model === "string" || params.agentRuntime !== void 0 ? createSessionCreateCommitGuard({
			assertCallerCurrent: () => {
				params.commitGuard?.();
				assertPreparedTargetCurrent?.();
			},
			get operatorAuthority() {
				return operatorAuthority;
			},
			selections: [
				params.activeParentFork,
				params.preparedModelSelection,
				params.preparedPermissionSelection,
				personalModelSelection,
				personalAccountDefaults
			],
			personalAccountDefaults,
			readDefaultProfile: () => selectedDefaultProfile,
			validateSelection: () => validateRuntimeSelection?.()
		}) : params.commitGuard;
		commitGuard?.();
		const displayName = truncateUtf16Safe(params.displayName?.trim() ?? "", 500).trimEnd();
		const label = normalizeOptionalString(params.label);
		const requestedKey = normalizeOptionalString(params.key);
		const parentSessionKey = normalizeOptionalString(params.parentSessionKey);
		const projectId = normalizeOptionalString(params.projectId);
		const pendingProjectGitUrl = normalizeOptionalString(params.pendingProjectGitUrl);
		const requestedToolOverrides = params.toolOverrides !== void 0;
		const selectedAgent = resolveRequestedSessionAgentId(params.cfg, requestedKey ?? (params.agentId === void 0 ? "main" : void 0), params.agentId ?? parseAgentSessionKey(requestedKey)?.agentId);
		if (!selectedAgent.ok) return selectedAgent;
		const agentId = selectedAgent.agentId;
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
		const explicitTargetParts = parseAgentSessionKey(explicitTargetKey);
		const explicitIncognito = isIncognitoSessionKey(explicitTargetKey);
		const explicitDashboardIncognito = explicitIncognito && explicitTargetParts?.agentId === agentId && explicitTargetParts.rest.startsWith("dashboard:");
		if (explicitIncognito && params.incognito !== true) return invalidSessionRequest("incognito-shaped session keys require incognito: true");
		if (params.incognito === true && explicitTargetKey) {
			if (!explicitDashboardIncognito) return invalidSessionRequest("incognito sessions are web-only");
			const durableStorePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId });
			if (loadExactSessionEntryFromStoreReadOnly({
				agentId,
				storePath: durableStorePath,
				sessionKey: explicitTargetKey,
				projection: "list"
			}) || loadGatewaySessionEntryReadOnly(explicitTargetKey).entry) return invalidSessionRequest("incognito is immutable and requires a new session key");
		}
		if (params.catalogTarget && explicitTargetKey && !explicitTargetKey.startsWith(`agent:${agentId}:dashboard:`)) return invalidSessionRequest("catalog sessions require a generated dashboard key");
		const authorizedHarnessCreation = Boolean(explicitTargetKey && params.initialEntry && normalizeOptionalAgentRuntimeId(params.authorizedAgentHarnessId) === normalizeOptionalAgentRuntimeId(params.initialEntry.agentHarnessId) && isAgentHarnessSessionKeyOwnedBy(explicitTargetKey, params.authorizedAgentHarnessId));
		const authorizedPluginCreation = Boolean(explicitTargetKey && params.initialEntry?.pluginOwnerId && params.authorizedPluginId === params.initialEntry.pluginOwnerId);
		if (params.initialEntry?.pluginOwnerId && !authorizedPluginCreation) return invalidSessionRequest("trusted plugin session owner is not authorized");
		const initialTargetEntry = explicitTargetKey ? resolveSessionEntryAccessTarget({
			cfg: params.cfg,
			sessionKey: explicitTargetKey,
			agentId
		}).entry : void 0;
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
		const targetSessionKey = explicitTargetKey ?? buildDashboardSessionKey(agentId, { incognito });
		const creationTarget = await resolveGatewaySessionStoreTargetInWorker({
			cfg: params.cfg,
			key: targetSessionKey,
			agentId,
			assertActive: commitGuard
		});
		if (explicitTargetKey && creationTarget.canonicalKey === canonicalParentSessionKey) return invalidSessionRequest("sessions.create key must differ from parentSessionKey");
		if (explicitTargetKey && !params.initialEntry) {
			if (initialTargetEntry?.initializationPending === true) return {
				ok: false,
				error: errorShape(ErrorCodes.UNAVAILABLE, `Session ${creationTarget.canonicalKey} is still initializing; retry creation later.`)
			};
		}
		const agentMainSessionKey = resolveAgentMainSessionKey({
			cfg: params.cfg,
			agentId
		});
		const dashboardParentSessionKey = !parentSessionKey && !params.authorizedPluginId && !incognito && params.fork !== true && (params.cfg.session?.dmScope ?? "main") === "main" && params.cfg.session?.scope !== "global" && targetSessionKey !== agentMainSessionKey ? agentMainSessionKey : void 0;
		const authorityTargets = params.operatorAuthority ? [{
			target: creationTarget,
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
		if (canonicalParentSessionKey && params.fork !== true && params.emitCommandHooks === true && !requestedKey && params.resetMainWhenUnspecified === true && !requestedToolOverrides && !parentIncognito && !params.catalogTarget && params.cfg.session?.dmScope === "main") {
			const parentAgentId = normalizeAgentId(parentSelectedAgentId ?? resolveAgentIdFromSessionKey(canonicalParentSessionKey) ?? agentId);
			const parentMainKey = resolveAgentMainSessionKey({
				cfg: params.cfg,
				agentId: parentAgentId
			});
			if (canonicalParentSessionKey === parentMainKey) {
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
		}
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
				const currentParentEntry = loadGatewaySessionEntryReadOnly(canonicalParentSessionKey, parentSelectedAgentId ? { agentId: parentSelectedAgentId } : void 0).entry;
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
				if ((params.emitCommandHooks === true || params.fork === true) && (isEmbeddedAgentRunActive(currentParentEntry.sessionId) || isSessionWorkAdmissionActive(parentSessionTarget.storePath, [canonicalParentSessionKey, currentParentEntry.sessionId])) && (params.emitCommandHooks === true || params.forkFrom !== "last-completed" && !params.activeParentFork)) return {
					ok: false,
					error: errorShape(ErrorCodes.UNAVAILABLE, `Parent session ${parentSessionKey} is still active; try again in a moment.`)
				};
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
			const target = creationTarget;
			const targetRead = readSessionCreateTarget(params, target, initialTargetEntry?.sessionId, targetLifecycleIdentities);
			if (!targetRead.ok) return targetRead;
			const currentTargetEntry = targetRead.value;
			const creationSandbox = creation?.sandbox ?? (creation ? resolveCreatorSandbox(params.cfg, creation) : void 0);
			const sandboxRequired = currentTargetEntry?.sandbox === "required" || creationSandbox === "required";
			const forkWorkspace = params.fork === true && currentParentSessionEntry && !currentTargetEntry && parentSessionTarget?.agentId === target.agentId && !projectId && !params.spawnedCwd && !params.sessionRoot && !params.execNode && !params.prepareLifecycle && !params.pendingWorktree && !params.pendingProjectGitUrl ? prepareSessionForkFilesystemRoot({
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
				if (!params.initialEntry && existingEntry?.initializationPending === true) return {
					ok: false,
					error: errorShape(ErrorCodes.UNAVAILABLE, `Session ${target.canonicalKey} is still initializing; retry creation later.`)
				};
				if (params.initialEntry && existingEntry !== void 0) return invalidSessionRequest("trusted initial session state requires a new session");
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
						...params.permissionMode ? { permissionMode: params.permissionMode } : {}
					},
					loadGatewayModelCatalogSnapshot: loadModelCatalog ? async () => {
						preparedModelCatalog = await loadModelCatalog();
						return preparedModelCatalog;
					} : void 0,
					authorizedAgentHarnessId: params.authorizedAgentHarnessId,
					personalModelSelection: params.personalModelSelection,
					operatorAuthority,
					preparedModelSelection: params.preparedModelSelection?.ref
				});
				if (!patched.ok) return patched;
				const spawnModelAutoSelection = params.creation?.spawnModelAutoSelection?.model === requestedModel ? params.creation?.spawnModelAutoSelection : void 0;
				if (requestedToolOverrides && existingEntry !== void 0 && stableStringify(existingEntry.toolOverrides) !== stableStringify(patched.entry.toolOverrides)) return invalidSessionRequest("sessions.create toolOverrides requires a new session");
				const execNode = normalizeOptionalString(params.execNode);
				const execCwd = normalizeOptionalString(params.execCwd);
				const initialAgentHarnessId = params.initialEntry ? normalizeOptionalString(params.initialEntry.agentHarnessId) : void 0;
				const initialColor = params.initialEntry?.color ? normalizeSessionColorValue(params.initialEntry.color) : null;
				if (params.initialEntry && !initialAgentHarnessId && !authorizedPluginCreation) return invalidSessionRequest(params.initialEntry?.agentHarnessId !== void 0 ? "initial agentHarnessId must be non-empty" : "trusted initial session state requires an authorized owner");
				if (params.initialEntry?.modelSelectionLocked !== void 0 && !params.initialEntry.modelSelectionLocked) return invalidSessionRequest("initial modelSelectionLocked must be true when provided");
				const catalogResolvedModel = params.catalogTarget ? resolveSessionModelRef(params.cfg, patched.entry, target.agentId) : void 0;
				const initializedEntry = {
					...patched.entry,
					...inheritedWorkspace,
					...createdNewEntry && displayName ? { displayName } : {},
					...createdNewEntry && spawnModelAutoSelection ? {
						modelOverrideSource: "auto",
						...spawnModelAutoSelection.hasFallbackOrigin ? {
							modelOverrideFallbackOriginProvider: patched.entry.providerOverride,
							modelOverrideFallbackOriginModel: patched.entry.modelOverride
						} : {}
					} : {},
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
					...execNode ? {
						execHost: "node",
						execNode,
						...execCwd ? { execCwd } : {}
					} : {},
					...createdNewEntry && params.armSessionDiffBaselineCapture && !execNode ? { sessionDiffBaselineCapture: createSessionDiffBaselineCaptureClaim() } : {},
					...initialAgentHarnessId ? { agentHarnessId: initialAgentHarnessId } : {},
					...initialColor ? { color: initialColor } : {},
					...createdNewEntry && params.authorizedPluginId && !params.catalogTarget ? { pluginOwnerId: params.authorizedPluginId } : {},
					...authorizedPluginCreation && params.initialEntry?.providerOverride ? { providerOverride: params.initialEntry.providerOverride } : {},
					...authorizedPluginCreation && params.initialEntry?.modelOverride ? { modelOverride: params.initialEntry.modelOverride } : {},
					...authorizedPluginCreation && params.initialEntry?.modelOverrideRouteResolution ? { modelOverrideRouteResolution: params.initialEntry.modelOverrideRouteResolution } : {},
					...authorizedPluginCreation && params.initialEntry?.cliSessionBindings ? { cliSessionBindings: structuredClone(params.initialEntry.cliSessionBindings) } : {},
					...params.initialEntry?.initializationPending === true ? { initializationPending: true } : {},
					...params.atomicInitialization === true ? { initializationPending: true } : {},
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
						existing: existingEntry,
						overrides: params
					}),
					...createdNewEntry && dashboardParentSessionKey && !explicitParentSessionKey && !initializedEntry.modelOverride ? { modelOverrideSource: "default" } : {},
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
						selectedDefaultProfile = account.profileId;
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
				validateRuntimeSelection = runtimeSelection.validate;
				if (params.fork !== true) return {
					...patched,
					entry
				};
				if (!canonicalParentSessionKey || !currentParentSessionEntry || !parentSessionTarget) return {
					ok: false,
					error: errorShape(ErrorCodes.UNAVAILABLE, "failed to resolve parent session for fork")
				};
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
				if (forkResult.status !== "prepared") return {
					ok: false,
					error: errorShape(ErrorCodes.UNAVAILABLE, "failed to fork parent session transcript")
				};
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
				...bindPreparedCreation ? { bindCreation: (operation) => {
					commitGuard?.();
					bindPreparedCreation?.(operation);
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
			creationTarget.canonicalKey,
			...creationTarget.storeKeys,
			...requestedKey ? [requestedKey] : [],
			...initialTargetEntry?.sessionId ? [initialTargetEntry.sessionId] : []
		];
		const lifecycleTargets = [{
			scope: creationTarget.storePath,
			identities: targetLifecycleIdentities
		}];
		if (canonicalParentSessionKey && parentSessionEntry?.sessionId && parentSessionTarget && holdParentLifecycle) lifecycleTargets.push({
			scope: parentSessionTarget.storePath,
			identities: [canonicalParentSessionKey, parentSessionEntry.sessionId]
		});
		onPhase?.("lifecycleAdmission");
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
		if (params.atomicInitialization === true) {
			if (result.resetExisting || !createdContext || !params.afterCreate) return {
				ok: false,
				error: errorShape(ErrorCodes.UNAVAILABLE, "atomic session initialization did not create a session")
			};
			const initializingSession = createdContext;
			const stored = loadGatewaySessionEntryReadOnly(initializingSession.key, { agentId: initializingSession.agentId }).entry;
			if (!stored || stored.sessionId !== initializingSession.entry.sessionId || stored.initializationPending !== true) return {
				ok: false,
				error: errorShape(ErrorCodes.UNAVAILABLE, "atomic session initialization lost its owner")
			};
			const expectedEntry = structuredClone(stored);
			try {
				await params.afterCreate(initializingSession);
				const finalized = await patchSessionEntryCore({
					sessionKey: initializingSession.key,
					storePath: initializingSession.storePath
				}, (current) => {
					if (!isDeepStrictEqual(current, expectedEntry)) throw new Error(`created session ${initializingSession.key} changed before finalization`);
					return { initializationPending: void 0 };
				}, {
					preserveActivity: true,
					requireWriteSuccess: true,
					...params.commitGuard ? { assertCommitAllowed: params.commitGuard } : {}
				});
				if (!finalized) throw new Error(`created session ${initializingSession.key} disappeared before finalization`);
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
					return {
						ok: false,
						error: errorShape(ErrorCodes.UNAVAILABLE, `session initialization failed and rollback did not complete: ${formatErrorMessage(new AggregateError([error, rollbackError]))}`)
					};
				}
				return {
					ok: false,
					error: errorShape(ErrorCodes.UNAVAILABLE, `session initialization failed: ${formatErrorMessage(error)}`)
				};
			}
		}
		if (result.resetExisting || !createdContext || !params.afterCreate) return {
			...result,
			postCommit: { status: "completed" }
		};
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
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
//#endregion
export { prepareSessionCreateModelSelection as n, resolveSessionCreateCatalogSelectionError as r, createGatewaySession as t };
