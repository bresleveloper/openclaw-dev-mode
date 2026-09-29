import "./src-CZ2wJvNB.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { a as resolveAgentDir, l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CUi_tcgF.mjs";
import { A as parseAgentSessionKey, S as isSubagentSessionKey, _ as toAgentStoreSessionKey, l as resolveAgentIdFromSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.mjs";
import { a as normalizeOptionalAgentRuntimeId } from "./agent-runtime-id-9mBje111.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { t as findModelCatalogEntry } from "./model-catalog-lookup-C3iQmurZ.mjs";
import { n as resolveSubagentConfiguredModelSelection, t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-D-CL26h0.mjs";
import { c as normalizeSessionDeliveryState } from "./delivery-context.shared-CW8dxG7X.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { f as errorShape, p as missingScopeErrorShape } from "./error-codes-DvB36bCj.mjs";
import { o as normalizeSessionColorValue } from "./session-agent-status-BSzRJm_2.mjs";
import { i as isUserModelAuthProfileId } from "./profile-usage-stats-Uo3hJqOO.mjs";
import { r as isUserModelAuthProfileOwner } from "./user-model-accounts-C87WCnZM.mjs";
import { r as resolveAgentMainSessionKey } from "./main-session-De-bcoks.mjs";
import { a as readResidentUserProfileId } from "./user-profile-list-B5pNqyXa.mjs";
import { l as resolveCreatorSandbox, n as authorizeGatewaySessionCreation } from "./operator-role-policy-BNrKHiJ3.mjs";
import "./model-catalog-Bg5BjnVl.mjs";
import { t as resolveModelProviderAuthConfig } from "./model-auth-provider-route-qM_24l0u.mjs";
import "./model-selection-CaFyCMqp.mjs";
import { a as isAgentHarnessSessionKey, o as isAgentHarnessSessionKeyOwnedBy, r as AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE } from "./agent-harness-session-key-CQ6tTBOH.mjs";
import { o as resolveEffectiveAgentRuntime } from "./thinking-runtime-Dvszh-e-.mjs";
import { i as inheritSpawnSessionOwner, n as buildSessionCreationStamp, r as inheritSessionCreationPolicy } from "./session-entry-provenance-C-JyMH54.mjs";
import { g as runExclusiveSessionLifecycleMutation, h as isSessionWorkAdmissionActive } from "./session-lifecycle-admission-Pys9TN37.mjs";
import { v as projectPublicSessionEntry } from "./session-accessor.sqlite-transcript-write-Bk_2EeDT.mjs";
import { d as patchSessionEntryCore } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import { i as loadExactSessionEntryFromStoreReadOnly } from "./session-accessor.sqlite-exact-read-Dk6_8wqr.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { a as resolveSessionEntryAccessTarget } from "./session-accessor.entry-CwzWysXO.mjs";
import { a as createSessionEntryWithTranscript, g as inheritSessionSelection } from "./session-accessor.reset-0gTJAhVB.mjs";
import { r as deleteSessionEntryLifecycle } from "./session-accessor.sqlite-lifecycle-3ezSeI3j.mjs";
import { n as MODEL_SELECTION_LOCKED_PARENT_FORK_MESSAGE, s as isModelSelectionLocked } from "./model-overrides-FXSJttoI.mjs";
import { d as isEmbeddedAgentRunActive } from "./runs-Cjzxx3Pg.mjs";
import { g as normalizeInheritedToolDenylist, h as normalizeInheritedToolAllowlist } from "./subagent-capabilities-CXh51XLK.mjs";
import { i as hasInternalHookListeners, n as createInternalHookEvent, u as triggerInternalHook } from "./internal-hooks-B-eMkNRp.mjs";
import { n as buildMainSessionRecoveryClearPatch } from "./main-session-recovery-clear-H7IP1700.mjs";
import { r as forkSessionFromParentWithDecision } from "./session-fork-BqsWLXeV.mjs";
import { t as resolveSessionWorkerPlacementContext } from "./session-worker-placement-context-BLRgDgSo.mjs";
import { n as resolveSessionModelRef } from "./session-model-ref-Z1HiwFXK.mjs";
import { a as resolveGatewaySessionStoreTarget } from "./session-utils-store-lookup-EioWBMfl.mjs";
import { a as resolveContextTokensForModel } from "./context-BNGdirIS.mjs";
import { i as selectModelCatalogRuntimeEntry } from "./model-catalog-view-Be2xmOuQ.mjs";
import { t as resolveModelContextWindowProfile } from "./model-context-window-CoR3Uyg1.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DDuAGjCc.mjs";
import { J as resolveSessionVisibility, U as isSessionVisibilityAllowed } from "./session-sharing-C4w_but1.mjs";
import "./session-utils-CJ7A982R.mjs";
import { n as shouldPreserveSessionAuthProfileOverride } from "./auth-profile-preservation-jhjED_s9.mjs";
import { t as recordSessionCreated } from "./session-created-CtPFddEb.mjs";
import "./embedded-agent-DGv6YF31.mjs";
import { t as createSessionDiffBaselineCaptureClaim } from "./session-diff-baseline-capture-6ejBT0Am.mjs";
import { n as rollbackGatewaySessionPreparation, t as projectPreparedSessionWorkspace } from "./session-lifecycle-preparation-asDwlSUK.mjs";
import { t as resolvePluginSessionOwnershipError } from "./session-plugin-ownership-BAwSgzgQ.mjs";
import { t as ModelAccountConnectAuthorityError } from "./model-account-connect-CMUHZZob.mjs";
import { n as prepareSessionForkFilesystemRoot, t as prepareSessionCreateFilesystemRoot } from "./session-create-root-DONGPA9n.mjs";
import { a as resolveSessionPatchModelSelection, n as prepareSessionPatchRuntimeSelection, r as refreshSessionPatchQueuedSelection } from "./sessions-patch-model-selection-DzMOxpbM.mjs";
import { n as projectSessionsPatchEntry } from "./sessions-patch-Dj0aiQ9t.mjs";
import { isDeepStrictEqual } from "node:util";
import { randomUUID } from "node:crypto";
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
function buildForkedGatewaySessionEntry(entry, fork, forkSource, previousEntry) {
	return {
		...entry,
		...buildMainSessionRecoveryClearPatch(entry),
		sessionId: fork.sessionId,
		lifecycleRunId: void 0,
		lastRunId: void 0,
		forkSource: previousEntry?.forkSource ?? forkSource,
		...previousEntry?.sessionId && previousEntry.sessionId !== fork.sessionId ? { previousSessionId: previousEntry.sessionId } : {},
		totalTokens: void 0,
		totalTokensFresh: false,
		totalTokensVersion: void 0
	};
}
//#endregion
//#region src/gateway/session-create-inheritance.ts
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
			...inheritSessionCreationPolicy(params.parent, params.creation.actor)
		},
		...ownerAssignment ? { ownerAssignment } : {}
	};
}
//#endregion
//#region src/gateway/session-create-model-selection.ts
function resolveSessionCreateModelSelection(cfg, agentId, input, parentEntry, preparedModelSelection) {
	const model = normalizeOptionalString(typeof input === "string" ? input : input?.model);
	if (!model) {
		const inherited = inheritSessionSelection(parentEntry);
		return {
			providerOverride: inherited.providerOverride,
			modelOverride: inherited.modelOverride,
			agentRuntimeOverride: inherited.agentRuntimeOverride,
			authProfileOverride: inherited.authProfileOverride
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
	if (!resolved.ok) return null;
	const agentRuntimeOverride = normalizeOptionalAgentRuntimeId(typeof input === "string" ? void 0 : input?.agentRuntime);
	return {
		providerOverride: resolved.provider,
		modelOverride: resolved.model,
		...agentRuntimeOverride ? { agentRuntimeOverride } : {},
		...resolved.profile ? { authProfileOverride: resolved.profile } : {}
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
//#region src/gateway/session-create-service.ts
const loadSessionLifecycleRuntime = createLazyRuntimeModule(() => import("./sessions.runtime.js"));
const loadSessionAuthRuntime = createLazyRuntimeModule(() => import("./session-override-ufF1yTr-.mjs"));
function buildDashboardSessionKey(agentId, options = {}) {
	return `agent:${agentId}:dashboard:${`${options.incognito ? "incognito-" : ""}${randomUUID()}`}`;
}
async function createGatewaySession(params) {
	const { personalModelSelection, personalAccountDefaults } = params;
	if (params.agentRuntime !== void 0 && (!params.model || params.catalogTarget)) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "agentRuntime requires an explicit canonical provider/model selection")
	};
	const requestedProfile = splitTrailingAuthProfile(params.catalogTarget?.model ?? params.model ?? "").profile;
	if (requestedProfile && isUserModelAuthProfileId(requestedProfile) && personalModelSelection?.authProfileId !== requestedProfile) return {
		ok: false,
		error: errorShape(ErrorCodes.FORBIDDEN, "Choose your personal account from an identified Gateway connection.")
	};
	let selectedDefaultProfile;
	let validateRuntimeSelection;
	const commitGuard = personalModelSelection || personalAccountDefaults || params.activeParentFork || params.preparedModelSelection || typeof params.model === "string" || params.agentRuntime !== void 0 ? () => {
		params.commitGuard?.();
		const runtimeError = validateRuntimeSelection?.();
		if (runtimeError) throw new Error(runtimeError.message);
		params.activeParentFork?.assertCurrent();
		params.preparedModelSelection?.assertCurrent();
		personalModelSelection?.assertCurrent();
		personalAccountDefaults?.assertCurrent();
		if (personalAccountDefaults && selectedDefaultProfile && isUserModelAuthProfileId(selectedDefaultProfile) && !isUserModelAuthProfileOwner({
			profileId: personalAccountDefaults.owner,
			authProfileId: selectedDefaultProfile
		})) throw new ModelAccountConnectAuthorityError();
	} : params.commitGuard;
	commitGuard?.();
	const displayName = truncateUtf16Safe(params.displayName?.trim() ?? "", 500).trimEnd();
	const requestedKey = normalizeOptionalString(params.key);
	const parentSessionKey = normalizeOptionalString(params.parentSessionKey);
	const projectId = normalizeOptionalString(params.projectId);
	const pendingProjectGitUrl = normalizeOptionalString(params.pendingProjectGitUrl);
	const requestedToolOverrides = params.toolOverrides !== void 0;
	const explicitAgentId = params.agentId;
	const explicitKeyAgentId = parseAgentSessionKey(requestedKey)?.agentId;
	const selectedAgent = resolveRequestedSessionAgentId(params.cfg, requestedKey ?? (explicitAgentId === void 0 ? "main" : void 0), explicitAgentId ?? explicitKeyAgentId);
	if (!selectedAgent.ok) return selectedAgent;
	const agentId = selectedAgent.agentId;
	const catalogModel = normalizeOptionalString(params.catalogTarget?.model);
	const catalogAgentRuntime = normalizeOptionalAgentRuntimeId(params.catalogTarget?.agentRuntime);
	const catalogPluginOwnerId = normalizeOptionalString(params.catalogTarget?.pluginOwnerId);
	if (params.catalogTarget && (!catalogModel || !catalogAgentRuntime || !catalogPluginOwnerId)) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "invalid catalog session target")
	};
	if (params.succeedsParent !== void 0) {
		if (!parentSessionKey) return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, "succeedsParent requires parentSessionKey")
		};
		if (params.emitCommandHooks !== true) return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, "succeedsParent requires emitCommandHooks")
		};
		if (params.succeedsParent && params.fork === true) return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, "succeedsParent conflicts with fork: a fork runs in parallel to its parent")
		};
	}
	if (params.atomicInitialization === true && (!params.afterCreate || params.initialEntry)) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "atomic initialization requires afterCreate and cannot use trusted initial state")
	};
	const loweredRequestedKey = normalizeOptionalLowercaseString(requestedKey);
	const explicitTargetKey = requestedKey ? loweredRequestedKey === "global" || loweredRequestedKey === "unknown" ? loweredRequestedKey : toAgentStoreSessionKey({
		agentId,
		requestKey: requestedKey,
		mainKey: params.cfg.session?.mainKey
	}) : void 0;
	const explicitTargetParts = parseAgentSessionKey(explicitTargetKey);
	const explicitIncognito = isIncognitoSessionKey(explicitTargetKey);
	const explicitDashboardIncognito = explicitIncognito && explicitTargetParts?.agentId === agentId && explicitTargetParts.rest.startsWith("dashboard:");
	if (explicitIncognito && params.incognito !== true) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "incognito-shaped session keys require incognito: true")
	};
	if (params.incognito === true && explicitTargetKey) {
		if (!explicitDashboardIncognito) return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, "incognito sessions are web-only")
		};
		const durableStorePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId });
		if (loadExactSessionEntryFromStoreReadOnly({
			agentId,
			storePath: durableStorePath,
			sessionKey: explicitTargetKey,
			projection: "list"
		}) || loadGatewaySessionEntryReadOnly(explicitTargetKey).entry) return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, "incognito is immutable and requires a new session key")
		};
	}
	if (params.catalogTarget && explicitTargetKey && !explicitTargetKey.startsWith(`agent:${agentId}:dashboard:`)) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "catalog sessions require a generated dashboard key")
	};
	const authorizedHarnessCreation = Boolean(explicitTargetKey && params.initialEntry && normalizeOptionalAgentRuntimeId(params.authorizedAgentHarnessId) === normalizeOptionalAgentRuntimeId(params.initialEntry.agentHarnessId) && isAgentHarnessSessionKeyOwnedBy(explicitTargetKey, params.authorizedAgentHarnessId));
	const authorizedPluginCreation = Boolean(explicitTargetKey && params.initialEntry?.pluginOwnerId && params.authorizedPluginId === params.initialEntry.pluginOwnerId);
	if (params.initialEntry?.pluginOwnerId && !authorizedPluginCreation) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "trusted plugin session owner is not authorized")
	};
	const existingHarnessEntry = explicitTargetKey && isAgentHarnessSessionKey(explicitTargetKey) ? resolveSessionEntryAccessTarget({
		cfg: params.cfg,
		sessionKey: explicitTargetKey
	}).entry : void 0;
	if (explicitTargetKey && isAgentHarnessSessionKey(explicitTargetKey) && !authorizedHarnessCreation && (!existingHarnessEntry || existingHarnessEntry.modelSelectionLocked === true)) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE)
	};
	if (params.fork === true && !parentSessionKey) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "fork requires parentSessionKey")
	};
	if (params.forkFrom && params.fork !== true) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "forkFrom requires fork=true")
	};
	if (params.spawnDepth !== void 0) {
		if (!Number.isInteger(params.spawnDepth) || params.spawnDepth < 1) return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, "spawnDepth must be an integer >= 1")
		};
		if (!parentSessionKey) return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, "spawnDepth requires parentSessionKey")
		};
	}
	if (params.spawnToolPolicy && params.spawnDepth === void 0) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "spawn tool policy requires spawnDepth")
	};
	let canonicalParentSessionKey;
	let parentSessionEntry;
	let parentSelectedAgentId;
	let parentSessionTarget;
	if (parentSessionKey) {
		const parentRequestedAgent = resolveRequestedSessionAgentId(params.cfg, parentSessionKey, !parseAgentSessionKey(parentSessionKey) && ["global", "unknown"].includes(parentSessionKey.toLowerCase()) ? explicitAgentId : void 0);
		if (!parentRequestedAgent.ok) return parentRequestedAgent;
		parentSelectedAgentId = parentRequestedAgent.agentId;
		const parent = loadGatewaySessionEntryReadOnly(parentSessionKey, { agentId: parentSelectedAgentId });
		if (!parent.entry?.sessionId) return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, `unknown parent session: ${parentSessionKey}`)
		};
		const parentOwnershipError = resolvePluginSessionOwnershipError({
			action: params.fork === true ? "fork" : "link",
			entry: parent.entry,
			key: parent.canonicalKey,
			pluginOwnerId: params.authorizedPluginId
		});
		if (parentOwnershipError) return {
			ok: false,
			error: parentOwnershipError
		};
		if (isModelSelectionLocked(parent.entry)) return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, MODEL_SELECTION_LOCKED_PARENT_FORK_MESSAGE)
		};
		canonicalParentSessionKey = parent.canonicalKey;
		parentSessionEntry = parent.entry;
		parentSessionTarget = resolveGatewaySessionStoreTarget({
			cfg: params.cfg,
			key: parentSessionKey,
			...parentSelectedAgentId ? { agentId: parentSelectedAgentId } : {}
		});
	}
	if (params.activeParentFork && (params.fork !== true || parentSelectedAgentId !== agentId || resolveGatewaySessionStoreTarget({
		cfg: params.cfg,
		key: params.activeParentFork.requesterSessionKey,
		agentId
	}).canonicalKey !== canonicalParentSessionKey)) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "active fork parent must match the same-agent requester")
	};
	const parentIncognito = parentSessionEntry?.incognito === true || isIncognitoSessionKey(canonicalParentSessionKey);
	const incognito = params.incognito === true || parentIncognito;
	if (incognito && params.requestingOperatorScopes !== void 0 && !params.requestingOperatorScopes.includes("operator.admin")) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, `incognito sessions require gateway scope: ${ADMIN_SCOPE}`)
	};
	if (incognito && canonicalParentSessionKey && !parentIncognito) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "incognito sessions cannot have durable parents")
	};
	if (parentIncognito && explicitTargetKey) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "incognito sessions are web-only")
	};
	if (canonicalParentSessionKey && explicitTargetKey && resolveGatewaySessionStoreTarget({
		cfg: params.cfg,
		key: explicitTargetKey,
		agentId
	}).canonicalKey === canonicalParentSessionKey) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create key must differ from parentSessionKey")
	};
	const targetSessionKey = explicitTargetKey ?? buildDashboardSessionKey(agentId, { incognito });
	const creationTarget = resolveGatewaySessionStoreTarget({
		cfg: params.cfg,
		key: targetSessionKey,
		agentId
	});
	if (explicitTargetKey && !params.initialEntry) {
		if (resolveSessionEntryAccessTarget({
			cfg: params.cfg,
			sessionKey: creationTarget.canonicalKey,
			agentId: creationTarget.agentId
		}).entry?.initializationPending === true) return {
			ok: false,
			error: errorShape(ErrorCodes.UNAVAILABLE, `Session ${creationTarget.canonicalKey} is still initializing; retry creation later.`)
		};
	}
	const agentMainSessionKey = resolveAgentMainSessionKey({
		cfg: params.cfg,
		agentId
	});
	const dashboardParentSessionKey = !parentSessionKey && !params.authorizedPluginId && !incognito && params.fork !== true && (params.cfg.session?.dmScope ?? "main") === "main" && params.cfg.session?.scope !== "global" && targetSessionKey !== agentMainSessionKey ? agentMainSessionKey : void 0;
	if (canonicalParentSessionKey && params.fork !== true && params.emitCommandHooks === true && !requestedKey && params.resetMainWhenUnspecified === true && !requestedToolOverrides && !parentIncognito && !params.catalogTarget && params.cfg.session?.dmScope === "main") {
		const parentAgentId = normalizeAgentId(parentSelectedAgentId ?? resolveAgentIdFromSessionKey(canonicalParentSessionKey) ?? agentId);
		const parentMainKey = resolveAgentMainSessionKey({
			cfg: params.cfg,
			agentId: parentAgentId
		});
		if (canonicalParentSessionKey === parentMainKey) {
			if (params.visibility) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create visibility requires a new session")
			};
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
			if ("incognitoDeleted" in resetResult) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, "incognito sessions cannot reset in place")
			};
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
	const spawnToolPolicy = params.spawnToolPolicy && canonicalParentSessionKey ? {
		completionOwnerSessionKey: normalizeOptionalString(params.spawnToolPolicy.completionOwnerSessionKey),
		allow: normalizeInheritedToolAllowlist(params.spawnToolPolicy.allow),
		deny: normalizeInheritedToolDenylist(params.spawnToolPolicy.deny),
		parentSessionKey: canonicalParentSessionKey
	} : void 0;
	const createChildSession = async () => {
		commitGuard?.();
		let currentParentSessionEntry = parentSessionEntry;
		if (canonicalParentSessionKey && parentSessionTarget && holdParentLifecycle) {
			const currentParentEntry = loadGatewaySessionEntryReadOnly(canonicalParentSessionKey, parentSelectedAgentId ? { agentId: parentSelectedAgentId } : void 0).entry;
			if (!currentParentEntry?.sessionId || currentParentEntry.sessionId !== parentSessionEntry?.sessionId || currentParentEntry.lifecycleRevision !== parentSessionEntry?.lifecycleRevision) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, `Parent session ${parentSessionKey} changed before child creation; retry.`)
			};
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
			if ((params.emitCommandHooks === true || params.fork === true) && isModelSelectionLocked(currentParentEntry)) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, MODEL_SELECTION_LOCKED_PARENT_FORK_MESSAGE)
			};
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
		const titleModelSelection = resolveSessionCreateModelSelection(params.cfg, target.agentId, params.catalogTarget ?? (params.model ? {
			model: params.model,
			agentRuntime: params.agentRuntime
		} : void 0), currentParentSessionEntry, params.preparedModelSelection?.ref);
		commitGuard?.();
		const preparationResult = params.prepareLifecycle ? await params.prepareLifecycle({
			agentId: target.agentId,
			entry: currentTargetEntry,
			key: target.canonicalKey,
			storePath: target.storePath,
			titleModelSelection,
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
		const created = await createSessionEntryWithTranscript({
			agentId: target.agentId,
			sessionKey: target.canonicalKey,
			storePath: target.storePath
		}, async ({ existingEntry, targetEntry, isLabelInUse }) => {
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
			if (isAgentHarnessSessionKey(target.canonicalKey) && !authorizedHarnessCreation && (!existingEntry || existingEntry.modelSelectionLocked === true)) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE)
			};
			if (!params.initialEntry && existingEntry?.initializationPending === true) return {
				ok: false,
				error: errorShape(ErrorCodes.UNAVAILABLE, `Session ${target.canonicalKey} is still initializing; retry creation later.`)
			};
			if (params.initialEntry && existingEntry !== void 0) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, "trusted initial session state requires a new session")
			};
			if (params.catalogTarget && existingEntry !== void 0) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, "catalog session target requires a new session")
			};
			if ((pendingProjectGitUrl || pendingWorktree) && existingEntry !== void 0) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, "workspace preparation requires a new session")
			};
			if (spawnToolPolicy && existingEntry !== void 0) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, "spawn tool policy requires a new session")
			};
			if (params.visibility && existingEntry === void 0 && !isSessionVisibilityAllowed(params.cfg, params.visibility)) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, `session visibility is disabled: ${params.visibility}`, { details: {
					code: "SESSION_VISIBILITY_DISABLED",
					visibility: params.visibility
				} })
			};
			if (params.visibility && existingEntry !== void 0 && resolveSessionVisibility(existingEntry) !== params.visibility) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create visibility requires a new session")
			};
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
				isLabelInUse,
				storeKey: target.canonicalKey,
				agentId: target.agentId,
				preparedSessionRoot: sessionRoot,
				preparedAgentRuntime: catalogAgentRuntime,
				patch: {
					key: target.canonicalKey,
					label: normalizeOptionalString(params.label),
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
				preparedModelSelection: params.preparedModelSelection?.ref
			});
			if (!patched.ok) return patched;
			const spawnModelAutoSelection = params.creation?.spawnModelAutoSelection?.model === requestedModel ? params.creation?.spawnModelAutoSelection : void 0;
			if (requestedToolOverrides && existingEntry !== void 0 && stableStringify(existingEntry.toolOverrides) !== stableStringify(patched.entry.toolOverrides)) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create toolOverrides requires a new session")
			};
			const execNode = normalizeOptionalString(params.execNode);
			const execCwd = normalizeOptionalString(params.execCwd);
			const initialAgentHarnessId = params.initialEntry ? normalizeOptionalString(params.initialEntry.agentHarnessId) : void 0;
			const initialColor = params.initialEntry?.color ? normalizeSessionColorValue(params.initialEntry.color) : null;
			if (params.initialEntry && !initialAgentHarnessId && !authorizedPluginCreation) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, params.initialEntry?.agentHarnessId !== void 0 ? "initial agentHarnessId must be non-empty" : "trusted initial session state requires an authorized owner")
			};
			if (params.initialEntry?.modelSelectionLocked !== void 0 && !params.initialEntry.modelSelectionLocked) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, "initial modelSelectionLocked must be true when provided")
			};
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
					sandbox: creation.sandbox ?? resolveCreatorSandbox(params.cfg, creation)
				}) : {},
				...createdNewEntry && inheritedSpawnOwner ? { owner: inheritedSpawnOwner } : {},
				...params.visibility && createdNewEntry ? { visibility: params.visibility } : {},
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
				...existingEntry === void 0 && spawnToolPolicy ? {
					spawnedBy: spawnToolPolicy.parentSessionKey,
					...spawnToolPolicy.completionOwnerSessionKey ? { completionOwnerSessionKey: spawnToolPolicy.completionOwnerSessionKey } : {},
					inheritedToolPolicyVersion: 1,
					...spawnToolPolicy.allow.length > 0 ? { inheritedToolAllow: spawnToolPolicy.allow } : {},
					...spawnToolPolicy.deny.length > 0 ? { inheritedToolDeny: spawnToolPolicy.deny } : {}
				} : {},
				...existingEntry === void 0 && incognito ? { incognito: true } : {}
			};
			const initialized = {
				...patched,
				entry: initializedEntry
			};
			const explicitParentSessionKey = canonicalParentSessionKey ?? normalizeOptionalString(initializedEntry.parentSessionKey);
			const storedParentSessionKey = explicitParentSessionKey ?? dashboardParentSessionKey;
			const inheritedSelection = !canonicalParentSessionKey || catalogModel || normalizeOptionalString(params.model) ? {} : inheritSessionSelection(currentParentSessionEntry);
			if (requestedToolOverrides) delete inheritedSelection.toolOverrides;
			if (requestedFastMode !== void 0) delete inheritedSelection.fastMode;
			const entry = {
				...initializedEntry,
				...inheritedSelection,
				...createdNewEntry && dashboardParentSessionKey && !explicitParentSessionKey && !initializedEntry.modelOverride ? { modelOverrideSource: "default" } : {},
				...storedParentSessionKey ? { parentSessionKey: storedParentSessionKey } : {},
				...canonicalParentSessionKey && currentParentSessionEntry?.sessionId ? { parentSessionId: currentParentSessionEntry.sessionId } : {}
			};
			if (params.fork !== true) {
				if (createdNewEntry && !entry.authProfileOverride && personalAccountDefaults) {
					const { resolveUserLinkedAuthProfile } = await loadSessionAuthRuntime();
					commitGuard?.();
					const model = resolveSessionModelRef(params.cfg, entry, target.agentId);
					const linked = resolveUserLinkedAuthProfile({
						cfg: resolveModelProviderAuthConfig({
							config: params.cfg,
							provider: model.provider,
							modelId: model.model
						}),
						agentDir: resolveAgentDir(params.cfg, target.agentId),
						provider: model.provider,
						requesterProfileId: personalAccountDefaults.owner
					});
					selectedDefaultProfile = linked?.profileId;
					commitGuard?.();
					if (linked) {
						entry.authProfileOverride = linked.profileId;
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
				...params.agentRuntime !== void 0 || params.model !== void 0 ? { placement: {
					context: resolveSessionWorkerPlacementContext(),
					sessionKey: target.canonicalKey
				} } : {}
			});
			if (!runtimeSelection.ok) return runtimeSelection;
			validateRuntimeSelection = runtimeSelection.validate;
			if (params.fork !== true) return {
				...initialized,
				entry
			};
			const forkParentSessionKey = canonicalParentSessionKey;
			if (!forkParentSessionKey || !currentParentSessionEntry || !parentSessionTarget) return {
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
			const forkFromParent = async (assertSourceCurrent) => await forkSessionFromParentWithDecision({
				parentEntry: currentParentSessionEntry,
				agentId: parentSessionTarget.agentId,
				...commitGuard || assertSourceCurrent ? { commitGuard: () => {
					commitGuard?.();
					assertSourceCurrent?.();
				} } : {},
				parentSessionKey: forkParentSessionKey,
				sessionKey: target.canonicalKey,
				storePath: parentSessionTarget.storePath,
				...forkMaxTokens ? { maxTokens: forkMaxTokens } : {},
				targetStorePath: target.storePath,
				...params.forkFrom ? { forkFrom: params.forkFrom } : {}
			});
			const forkResult = preparedLifecycle?.withCommit ? await preparedLifecycle.withCommit(forkFromParent) : await forkFromParent();
			if (forkResult.status === "too-large") return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, `parent session is too large to fork (${forkResult.decision.parentTokens}/${forkResult.decision.maxTokens} tokens)`)
			};
			if (forkResult.status !== "created") return {
				ok: false,
				error: errorShape(ErrorCodes.UNAVAILABLE, "failed to fork parent session transcript")
			};
			const fork = forkResult.transcript;
			return {
				...initialized,
				entry: buildForkedGatewaySessionEntry(entry, fork, {
					sessionKey: forkParentSessionKey,
					sessionId: currentParentSessionEntry.sessionId
				}, existingEntry)
			};
		}, {
			...params.initialEntry ? {
				activeSessionKey: target.canonicalKey,
				requireWriteSuccess: true
			} : {},
			...commitGuard ? { commitGuard } : {},
			...preparedLifecycle?.withCommit ? { withCommit: preparedLifecycle.withCommit } : {},
			...inheritedSpawnOwner ? { resolveOwnerAssignment: () => createdNewEntry ? inheritedSpawnOwner : void 0 } : {},
			onLifecycleCommitted: (entry) => {
				lifecyclePreparationCommitted = true;
				if (createdNewEntry) params.onCreatedSessionCommitted?.({
					key: target.canonicalKey,
					agentId: target.agentId,
					storePath: target.storePath,
					entry,
					isNew: true
				});
			},
			...runtimeCwd ? { cwd: runtimeCwd } : {}
		});
		if (!created.ok) return {
			ok: false,
			error: created.phase === "transcript" ? errorShape(ErrorCodes.UNAVAILABLE, `failed to create session transcript: ${created.error}`) : created.error
		};
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
		if (createdNewEntry) recordSessionCreated(params.cfg, {
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
	const lifecycleTargets = [{
		scope: creationTarget.storePath,
		identities: [creationTarget.canonicalKey]
	}];
	if (canonicalParentSessionKey && parentSessionEntry?.sessionId && parentSessionTarget && holdParentLifecycle) lifecycleTargets.push({
		scope: parentSessionTarget.storePath,
		identities: [canonicalParentSessionKey, parentSessionEntry.sessionId]
	});
	const result = await runExclusiveSessionLifecycleMutation({
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
}
//#endregion
export { resolveSessionCreateModelSelection as i, createGatewaySession as n, resolveSessionCreateCatalogSelectionError as r, buildDashboardSessionKey as t };
