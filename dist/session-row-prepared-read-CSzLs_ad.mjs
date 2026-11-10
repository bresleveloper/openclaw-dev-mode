import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { l as asNonNegativeFiniteNumber, u as asPositiveFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { r as getAsyncWorkSignal } from "./async-work-scope-BH2yUdBz.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { E as resolveProjectedAgentRunModel, t as buildProjectedAgentRunIndex } from "./agent-run-registry-gmaPgO-n.mjs";
import { d as getAgentEventLifecycleGeneration, f as isAgentEventLifecycleGenerationCurrent } from "./agent-events-Bf3Js0D3.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { A as normalizeSessionKeyPreservingOpaquePeerIds, D as parseSessionDeliveryRoute, M as parseAgentSessionKey, O as parseThreadSessionSuffix, S as isCronSessionKey, b as isAcpSessionKey, w as isSubagentSessionKey } from "./session-key-CSDERtm3.mjs";
import "./session-participant-rDryrWG-.mjs";
import { o as resolveSessionModelOverrideSource } from "./model-override-provenance-ByJqxWxk.mjs";
import { p as resolveEffectiveResponseUsage } from "./thinking.shared-Be8dhC75.mjs";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-B3vfipkP.mjs";
import { c as canContinueSessionProviderReview } from "./session-work-start-Sz_vqYld.mjs";
import { u as projectSessionDeliveryFields } from "./delivery-context.shared-I8-iaaj1.mjs";
import { r as resolveAgentMainSessionKey } from "./main-session-CHYPkxYr.mjs";
import { h as resolveSessionCommunicationPolicy } from "./session-accessor.sqlite-entry-cache-publication-BpzZnZxY.mjs";
import { m as sessionCreatorProfileId, o as sessionEntryForkedFromParent, s as MAX_SESSION_PARTICIPANTS } from "./session-entry-lineage-B7Mubzwj.mjs";
import { p as isPinnableSessionEntry } from "./store-maintenance-BqMt1Twc.mjs";
import { o as resolveFreshSessionTotalTokens } from "./types-BGDhC4_W.mjs";
import { l as selectStoredSessionLineage, s as resolveStoredSessionKeyForAgentStore } from "./session-store-key-DKpto8R6.mjs";
import { h as resolveSessionPinnedHarnessId } from "./agent-harness-session-key-zbrcLVpT.mjs";
import "./sessions-CnzPI1yx.mjs";
import { r as resolveSessionParentSessionKey } from "./session-conversation-DnUQmZJM.mjs";
import { n as resolveProjectedSessionContextTokens, t as resolveProjectedSessionContextBudgetStatus } from "./context-token-provenance-1ZLJbdqW.mjs";
import { T as buildSubagentRunReadIndexFromRuns } from "./subagent-registry-state-DBdy-FdI.mjs";
import "./thinking-BCNoGfZ5.mjs";
import { o as resolveModelContextTokenProjection } from "./context-XynHJtne.mjs";
import { t as resolveModelContextWindowProfile } from "./model-context-window-CoR3Uyg1.mjs";
import { a as readStoreChildSessionLinks, o as resolveEstimatedSessionCostUsd, s as resolveSessionChildOwners } from "./session-utils-core-DYhQWF9T.mjs";
import { t as resolveSessionSelectedModelRef } from "./session-utils-model-selection-pzj_r9Dj.mjs";
import { t as projectWorkerPlacementAgentRuntime } from "./placement-session-runtime-CaRixRbi.mjs";
import { n as buildSessionListRowMetadataContext, o as resolveTranscriptUsageFallbacks, r as projectSessionRowChildLinks } from "./session-utils-projection-M7JDHtmu.mjs";
import { a as resolveGatewaySessionThinkingProjectionInternal, o as resolveSessionDisplayModelIdentityRefCached } from "./session-utils-model-Bx2gzKtO.mjs";
import { s as projectGatewaySessionEntry } from "./combined-store-gateway-D1UQome7.mjs";
import { t as sessionActivityTimestamp } from "./session-activity-timestamp-AzhKZXR9.mjs";
import { n as sortAndLimitByWork } from "./sort-and-limit-NdojqZsZ.mjs";
import { t as readSessionListSelectionFacts } from "./session-list-target-Dq9g89hN.mjs";
import { t as resolveFastModeState } from "./fast-mode-DezNRstT.mjs";
import { i as resolveSelectedAndActiveModel, t as readSessionFallbackModel } from "./session-fallback-model-079vSBeH.mjs";
import { n as resolveQueueSettingsCore } from "./settings-B2OKXilH.mjs";
import { a as projectPluginSessionExtensionsSync } from "./host-hook-state-CBArMttW.mjs";
import { n as resolveActiveSessionAgentStatus } from "./session-agent-status-rvbCDjfy.mjs";
import { t as resolveActiveFallbackState } from "./fallback-notice-state-Bf7HNrTn.mjs";
import { t as channelAvatarRevision } from "./channel-avatar-reference-BD2jqCs9.mjs";
import { t as normalizeControlUiBasePath } from "./control-ui-shared-DqFhbHR8.mjs";
import { t as buildControlUiChannelAvatarUrl } from "./control-ui-resource-routes-B42sqIG-.mjs";
import "./control-ui-contract-IX_0OA0h.mjs";
import { n as resolveCronJobBoundSessionKeys } from "./job-session-bindings-JxvgRjIX.mjs";
import { a as projectSessionOwner, i as projectSessionActor, s as projectSessionParticipants } from "./session-identity-projection-sgwF_hD_.mjs";
import { t as sessionModelRevision } from "./session-model-revision-CBPmDUHh.mjs";
import { r as readPreparedGatewayModelMetadata } from "./server-model-catalog-view-DGYC_Ub2.mjs";
import { a as parseGroupKey } from "./session-utils-store-lW7Wu3P0.mjs";
import { a as resolveGatewaySessionKind, i as resolveGatewaySessionGoal, n as projectGatewaySessionRunState, r as resolveGatewaySessionDisplayName } from "./session-utils-display-DdkO-Qt-.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/shared/session-unread.ts
function deriveSessionUnread(entry) {
	const unreadBaselineAt = entry?.lastReadAt ?? entry?.createdAt;
	return entry?.markedUnreadAt !== void 0 || unreadBaselineAt !== void 0 && Math.max(entry?.lastInteractionAt ?? 0, entry?.lastActivityAt ?? 0) > unreadBaselineAt;
}
//#endregion
//#region src/gateway/session-list-order.ts
function compareSessionEntryPairs(a, b, sortBy = "updatedAt") {
	if (sortBy === "updatedAt") {
		const aPinnedAt = a[1]?.pinnedAt !== void 0 && isPinnableSessionEntry(a[0], a[1]) ? a[1].pinnedAt ?? 0 : 0;
		const bPinnedAt = b[1]?.pinnedAt !== void 0 && isPinnableSessionEntry(b[0], b[1]) ? b[1].pinnedAt ?? 0 : 0;
		if (aPinnedAt !== bPinnedAt) return bPinnedAt - aPinnedAt;
	}
	const aTimestamp = sortBy === "activity" ? sessionActivityTimestamp(a[1]) : a[1][sortBy];
	const byTimestamp = ((sortBy === "activity" ? sessionActivityTimestamp(b[1]) : b[1][sortBy]) ?? 0) - (aTimestamp ?? 0);
	if (byTimestamp !== 0) return byTimestamp;
	return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0;
}
function* sortAndLimitSessionEntries(entries, limit, sortBy, shouldYield) {
	return yield* sortAndLimitByWork(entries, limit, (a, b) => compareSessionEntryPairs(a, b, sortBy), shouldYield);
}
//#endregion
//#region src/gateway/session-automation-index.ts
let source = null;
let epochCounter = 0;
let registeredEpoch = 0;
let memo = null;
let publishedKeys;
/**
* Claimed at cron service build time so registration authority follows build
* order: a stale service whose start resolves after a config reload cannot
* clobber the replacement's registration.
*/
function claimSessionAutomationEpoch() {
	return ++epochCounter;
}
/** Registered by the gateway cron owner; newer epochs win over stale services. */
function registerSessionAutomationSource(next, epoch) {
	const effectiveEpoch = epoch ?? claimSessionAutomationEpoch();
	if (effectiveEpoch < registeredEpoch) return;
	registeredEpoch = effectiveEpoch;
	source = next;
	invalidateSessionAutomationIndex();
}
/**
* Owner-compare unregistration: a stopped cron service must not clear a
* replacement's registration when config reloads race the lazy service build.
*/
function unregisterSessionAutomationSource(owner) {
	if (source !== owner) return;
	source = null;
	invalidateSessionAutomationIndex();
}
/** Called from the cron onEvent hook after any job/store change. */
function invalidateSessionAutomationIndex() {
	if (!memo) return;
	publishAutomationKeys(refreshAutomationKeys(memo.cfg).keys);
}
/** Publish membership deltas without letting speculative reader refreshes consume them. */
function publishAutomationKeys(current) {
	const previous = publishedKeys ?? /* @__PURE__ */ new Set();
	publishedKeys = current;
	for (const identity of /* @__PURE__ */ new Set([...previous, ...current])) {
		if (previous.has(identity) === current.has(identity)) continue;
		const separator = identity.indexOf("\0");
		sessionChanges.emit({
			scope: "automation",
			facts: { kind: "unchanged" },
			sessionKey: separator < 0 ? identity : identity.slice(separator + 1),
			...separator < 0 ? {} : { agentId: identity.slice(0, separator) }
		});
	}
}
function buildAutomationKeys(jobs, cfg, defaultAgentId) {
	const keys = /* @__PURE__ */ new Set();
	for (const job of jobs) {
		if (!job.enabled) continue;
		for (const key of resolveCronJobBoundSessionKeys(job, {
			cfg,
			defaultAgentId
		})) {
			const agentId = job.owner?.agentId ?? defaultAgentId;
			if (parseAgentSessionKey(key)) keys.add(key);
			else if (agentId) keys.add(`${normalizeAgentId(agentId)}\0${key}`);
		}
	}
	return keys;
}
/** Replace the existing memo with a snapshot, never retaining mutable job facts. */
function refreshAutomationKeys(cfg) {
	const jobs = source?.getJobs();
	const defaultAgentId = source?.getDefaultAgentId();
	memo = {
		jobs,
		cfg,
		defaultAgentId,
		keys: buildAutomationKeys(jobs ?? [], cfg, defaultAgentId)
	};
	publishedKeys ??= memo.keys;
	return memo;
}
/** True when an enabled cron job is bound to the canonical session key. */
function sessionHasAutomation(sessionKey, cfg, agentId) {
	const jobs = source?.getJobs();
	const defaultAgentId = source?.getDefaultAgentId();
	const configChanged = memo && memo.cfg !== cfg;
	const current = memo && memo.jobs === jobs && memo.cfg === cfg && memo.defaultAgentId === defaultAgentId ? memo : refreshAutomationKeys(cfg);
	if (configChanged) publishAutomationKeys(current.keys);
	const identity = parseAgentSessionKey(sessionKey) ? sessionKey : agentId ? `${normalizeAgentId(agentId)}\0${sessionKey}` : void 0;
	return identity ? current.keys.has(identity) : false;
}
//#endregion
//#region src/gateway/session-classification.ts
/** Builds non-sensitive, client-useful classification facts for Gateway session rows. */
const BACKGROUND_CLASSIFICATIONS = /* @__PURE__ */ new Set([
	"acp",
	"cron",
	"dreaming",
	"harness",
	"heartbeat",
	"hook",
	"subagent",
	"system"
]);
const SESSION_CLASSIFICATION_PREFIXES = [
	["dashboard:", "dashboard"],
	["tui-", "tui"],
	["explicit:", "explicit"],
	["hook:", "hook"],
	["node-", "node"],
	["node:", "node"],
	["harness:", "harness"],
	["voice:", "voice"],
	["dreaming-narrative-", "dreaming"],
	["boot:", "system"],
	["internal-session-effects:", "system"]
];
function classifyRest(rest) {
	const normalized = normalizeLowercaseStringOrEmpty(rest);
	if (normalized === "boot") return "system";
	return SESSION_CLASSIFICATION_PREFIXES.find(([prefix]) => normalized.startsWith(prefix))?.[1] ?? "custom";
}
/**
* Derive portable facts without exposing peer ids, transcript text, absolute
* paths, or other data that is not already a session-list field.
*/
function sessionClassificationForRow(cfg, key, agentId, entry) {
	const canonicalKey = normalizeSessionKeyPreservingOpaquePeerIds(key);
	const isMain = canonicalKey === "global" ? cfg.session?.scope === "global" : canonicalKey === resolveAgentMainSessionKey({
		cfg,
		agentId
	});
	const parsedAgent = parseAgentSessionKey(canonicalKey);
	const resolvedAgentId = parsedAgent?.agentId ?? normalizeOptionalString(agentId);
	const rest = parsedAgent?.rest ?? canonicalKey;
	const parsedThread = parseThreadSessionSuffix(canonicalKey);
	const route = parseSessionDeliveryRoute(canonicalKey);
	const hasLegacyDirectPeer = /^(?:direct|dm):.+$/i.test(parseAgentSessionKey(parsedThread.baseSessionKey)?.rest ?? "");
	const hasDirectPeer = route?.peerKind === "direct" || route?.peerKind === "dm" || hasLegacyDirectPeer || entry?.chatType === "direct";
	let classification;
	if (canonicalKey === "global") classification = "global";
	else if (canonicalKey === "unknown") classification = "unknown";
	else if (entry?.heartbeatIsolatedBaseSessionKey) classification = "heartbeat";
	else if (isMain) classification = "main";
	else if (isSubagentSessionKey(canonicalKey)) classification = "subagent";
	else if (isAcpSessionKey(canonicalKey)) classification = "acp";
	else if (isCronSessionKey(canonicalKey)) classification = "cron";
	else if (parsedThread.threadId) classification = "thread";
	else if (route?.peerKind === "group") classification = "group";
	else if (route?.peerKind === "channel") classification = "channel";
	else if (hasDirectPeer) classification = "direct";
	else if (entry?.chatType === "group" || entry?.chatType === "channel") classification = entry.chatType;
	else classification = classifyRest(rest);
	const peerKind = route?.peerKind === "dm" || hasLegacyDirectPeer ? "direct" : route?.peerKind;
	return {
		classification,
		...resolvedAgentId ? { agentId: resolvedAgentId } : {},
		...route?.accountId ? { accountId: route.accountId } : {},
		...peerKind ? { peerKind } : {},
		isMain,
		isDock: entry?.createdSurface === "plugin-dock",
		isBackground: BACKGROUND_CLASSIFICATIONS.has(classification)
	};
}
//#endregion
//#region src/gateway/session-permission-change.ts
const pendingChanges = resolveGlobalSingleton(Symbol.for("openclaw.sessionPermissionChanges"), () => /* @__PURE__ */ new Map());
function beginSessionPermissionChange(sessionId) {
	const owner = { generation: getAgentEventLifecycleGeneration() };
	pendingChanges.set(sessionId, owner);
	return () => {
		if (pendingChanges.get(sessionId) === owner) pendingChanges.delete(sessionId);
	};
}
function isSessionPermissionChangePending(sessionId) {
	const pending = sessionId === void 0 ? void 0 : pendingChanges.get(sessionId);
	return pending !== void 0 && isAgentEventLifecycleGenerationCurrent(pending.generation);
}
//#endregion
//#region src/gateway/session-provider-review-projection.ts
function projectSessionProviderReview(entry, sessionKey) {
	const review = entry?.providerReview;
	if (!review || review.sessionId !== entry?.sessionId) return;
	const canContinue = canContinueSessionProviderReview(review, sessionKey);
	return {
		id: review.id,
		runId: review.runId,
		...review.review ? { explanation: review.review.explanation } : {},
		...canContinue && review.review?.continuation ? { continuationMessage: review.review.continuation.message } : {},
		canContinue
	};
}
//#endregion
//#region src/gateway/session-row-model-facts.ts
/** Search and row presentation share model policy without preparing unrelated row fields. */
function readSessionRowModelFacts(params) {
	const { cfg, key, agentId, source, rowContext } = params;
	const lightweight = params.lightweightListRow === true;
	const preparedCatalog = params.modelCatalog instanceof Map ? params.modelCatalog.get(agentId) : void 0;
	const metadataSnapshot = preparedCatalog ? readPreparedGatewayModelMetadata(cfg, preparedCatalog) : params.preparedModelMetadata;
	const selectedModel = resolveSessionSelectedModelRef({
		cfg,
		sessionKey: key,
		source,
		agentId,
		rowContext,
		preparedRuntimeOwnership: params.preparedRuntimeOwnership,
		allowPluginNormalization: !lightweight,
		manifestPlugins: metadataSnapshot === null ? [] : metadataSnapshot
	});
	const { provider, model } = selectedModel;
	const rowModelIdentity = resolveSessionDisplayModelIdentityRefCached({
		cfg,
		provider,
		model,
		metadataSnapshot,
		rowContext
	});
	const rowModelCatalog = params.modelCatalog instanceof Map ? preparedCatalog?.entries : params.modelCatalog;
	const thinkingProjection = resolveGatewaySessionThinkingProjectionInternal({
		cfg,
		agentId,
		provider,
		model,
		sessionKey: key,
		entry: params.entry,
		preparedAcpMeta: params.preparedAcpMeta,
		modelCatalog: rowModelCatalog ?? (lightweight || metadataSnapshot !== void 0 ? [] : void 0),
		modelCatalogRouteVariants: preparedCatalog?.routeVariants,
		metadataSnapshot,
		rowContext,
		providerPolicySource: preparedCatalog?.pluginRegistry ?? (lightweight || metadataSnapshot !== void 0 ? "active" : void 0)
	});
	return {
		selectedModel,
		rowModelIdentity,
		thinkingProjection,
		catalogEntry: rowModelCatalog && provider && model ? thinkingProjection.capacityCatalogEntry : void 0
	};
}
//#endregion
//#region src/gateway/session-swarm-summary.ts
const MAX_ACTIVE_GROUPS = 4;
const STATUS_RANK = {
	running: 0,
	queued: 1,
	failed: 2,
	done: 3
};
/** Counts requester-owned operations, including tombstones whose child sessions were deleted. */
function buildSessionSwarmSummary(runs, sessionKey, agentId, options = {}) {
	const groups = /* @__PURE__ */ new Map();
	const members = options.includeChildren ? /* @__PURE__ */ new Map() : void 0;
	for (const run of runs) {
		const requester = run.swarmRequesterSessionKey;
		if (!run.collect || !run.groupId || requester !== sessionKey || run.requesterAgentId !== agentId) continue;
		const group = groups.get(run.groupId) ?? {
			groupId: run.groupId,
			createdAt: run.createdAt,
			queued: 0,
			running: 0,
			done: 0,
			failed: 0
		};
		group.createdAt = Math.min(group.createdAt, run.createdAt);
		const completion = run.collectorCompletion?.status;
		const status = completion ? completion === "done" ? "done" : "failed" : run.execution.status === "queued" ? "queued" : "running";
		group[status] += 1;
		groups.set(run.groupId, group);
		if (members) {
			const children = members.get(run.groupId) ?? [];
			children.push({
				sessionKey: run.childSessionKey,
				status,
				createdAt: run.createdAt
			});
			members.set(run.groupId, children);
		}
	}
	if (groups.size === 0) return;
	const ordered = [...groups.values()].toSorted((left, right) => right.createdAt - left.createdAt || left.groupId.localeCompare(right.groupId));
	const active = ordered.filter((group) => group.queued + group.running > 0);
	const terminal = ordered.find((group) => group.queued + group.running === 0);
	const selected = [...active.slice(0, MAX_ACTIVE_GROUPS), ...terminal ? [terminal] : []];
	if (members) for (const group of selected) group.children = (members.get(group.groupId) ?? []).toSorted((left, right) => STATUS_RANK[left.status] - STATUS_RANK[right.status] || left.createdAt - right.createdAt || left.sessionKey.localeCompare(right.sessionKey)).slice(0, 64).map(({ sessionKey: childKey, status }) => ({
		sessionKey: childKey,
		status
	}));
	return {
		groups: selected,
		otherActiveGroups: Math.max(0, active.length - MAX_ACTIVE_GROUPS)
	};
}
//#endregion
//#region src/gateway/session-utils-row.ts
function readSessionRowInputs(params) {
	const { cfg, storePath, store, key, entry, agentId } = params;
	const lightweight = params.lightweightListRow === true;
	const now = params.now ?? Date.now();
	const rowContext = params.rowContext ?? buildSessionListRowMetadataContext({
		now,
		sessionKeys: [key, ...Object.keys(store)]
	});
	const displayName = resolveGatewaySessionDisplayName(key, entry);
	const { selectedModel, rowModelIdentity, thinkingProjection, catalogEntry } = readSessionRowModelFacts({
		cfg,
		key,
		entry,
		preparedAcpMeta: params.preparedAcpMeta,
		preparedRuntimeOwnership: params.preparedRuntimeOwnership,
		preparedModelMetadata: params.preparedModelMetadata,
		source: params.modelSource ?? {
			entry,
			readSourceEntry: (parentKey) => store[parentKey]
		},
		agentId,
		rowContext,
		modelCatalog: params.modelCatalog,
		lightweightListRow: lightweight
	});
	const freshSessionTotalTokens = resolveFreshSessionTotalTokens(entry);
	const usageByFallbackModel = params.skipTranscriptUsageFallback !== true ? resolveTranscriptUsageFallbacks({
		cfg,
		key,
		entry,
		storePath,
		freshTotalTokens: freshSessionTotalTokens,
		fallbackModelRefs: [void 0, ...(rowContext.subagentRunsByChildSessionKey.get(key) ?? []).map((run) => run.model)],
		allowPluginNormalization: !lightweight,
		rowContext,
		agentId,
		storeAgentId: params.storeAgentId,
		transcriptUsage: params.transcriptUsage
	}) : void 0;
	const { provider, model } = selectedModel;
	const activeModel = resolveGatewaySessionActiveModel({
		cfg,
		active: params.active,
		activeModel: params.activeModel,
		terminalModel: params.terminalModel,
		storeAgentId: params.storeAgentId,
		selectedModel,
		projectedAgentRuns: rowContext.projectedAgentRuns ??= buildProjectedAgentRunIndex(),
		entry,
		agentId,
		sessionId: entry?.sessionId,
		sessionKey: key,
		storePath
	});
	const contextWindowProfile = resolveModelContextWindowProfile({
		catalogEntry,
		selected: entry?.contextWindow
	});
	const modelContext = resolveModelContextTokenProjection({
		cfg,
		provider,
		model,
		modelContextTokens: catalogEntry?.contextTokens,
		modelContextWindow: contextWindowProfile.contextTokens,
		allowAsyncLoad: false,
		allowCacheLookup: false
	});
	const resolvedModelContextTokens = asPositiveFiniteNumber(modelContext.contextTokens);
	const pluginExtensions = !lightweight && entry ? projectPluginSessionExtensionsSync({
		sessionKey: key,
		entry
	}) : [];
	if (entry?.repositoryWorkspaceId && params.preparedRepositoryWorkspace === void 0) throw new Error("Repository workspace facts must be prepared before presenting the session");
	const repositoryWorkspace = params.preparedRepositoryWorkspace;
	return {
		inputs: {
			cfg,
			key,
			entry,
			lightweight,
			swarm: buildSessionSwarmSummary(params.rowContext?.subagentRuns.swarmRunsByRequesterSessionKey.get(key) ?? [], key, agentId, { includeChildren: params.includeSwarmChildren }),
			permissionModePending: isSessionPermissionChangePending(entry?.sessionId),
			repository: repositoryWorkspace?.workspaceId === entry?.repositoryWorkspaceId && repositoryWorkspace?.agentId === agentId && repositoryWorkspace.sessionKey === key ? {
				url: repositoryWorkspace.url,
				...repositoryWorkspace.requestedRef ? { ref: repositoryWorkspace.requestedRef } : {},
				branch: repositoryWorkspace.branch
			} : void 0,
			userProfileIdentityById: rowContext.userProfileIdentityById,
			identityProjection: rowContext.identityProjection,
			configuredAgentIds: params.configuredAgentIds,
			agentId,
			displayName,
			derivedTitle: params.preparedTitle?.derivedTitle,
			lastMessagePreview: params.preparedTitle?.lastMessagePreview,
			thinkingProjection,
			agentRuntime: projectWorkerPlacementAgentRuntime(thinkingProjection.agentRuntime),
			contextWindowProfile,
			fastModeState: resolveFastModeState({
				cfg,
				provider,
				model,
				agentId,
				sessionEntry: entry
			}),
			hasAutomation: sessionHasAutomation(key, cfg, agentId) ? true : void 0,
			rowModelIdentity,
			selectedModel,
			contextTokens: resolveProjectedSessionContextTokens({
				entry,
				provider,
				model,
				agentHarnessId: thinkingProjection.capacityRuntime,
				resolvedContextTokens: contextWindowProfile.contextTokens ? Math.min(resolvedModelContextTokens ?? contextWindowProfile.contextTokens, contextWindowProfile.contextTokens) : resolvedModelContextTokens,
				authoredContextTokens: asPositiveFiniteNumber(modelContext.authoredContextTokens)
			}),
			pluginExtensions,
			includeSwarmSummary: params.rowContext !== void 0,
			childLinks: params.childLinks ?? readStoreChildSessionLinks({
				store,
				key,
				subagentRunsByChildSessionKey: rowContext.subagentRunsByChildSessionKey
			}),
			usageByFallbackModel,
			freshSessionTotalTokens,
			estimatedCostUsd: lightweight ? asNonNegativeFiniteNumber(entry?.estimatedCostUsd) : resolveEstimatedSessionCostUsd({
				cfg,
				provider,
				model,
				entry,
				rowContext
			}),
			subagentRunInputs: rowContext.subagentRuns.inputs
		},
		presentation: {
			now,
			subagentRuns: rowContext.subagentRuns,
			projectedAgentRuns: rowContext.projectedAgentRuns,
			projectedSubagentActivity: rowContext.projectedSubagentActivity,
			activeModel,
			excludedChildKeys: params.excludedChildKeys
		}
	};
}
function buildGatewaySessionRow(params) {
	const { inputs, presentation } = readSessionRowInputs(params);
	return presentSessionRow(materializeSessionRow(inputs), presentation);
}
function resolveGatewaySessionActiveModel(params) {
	const liveModel = resolveProjectedAgentRunModel({
		agentId: params.agentId,
		sessionId: params.sessionId,
		index: params.projectedAgentRuns
	});
	if (params.active ?? liveModel !== void 0) return liveModel ?? void 0;
	if (!params.entry?.fallbackNotice) return;
	const { selectedModel } = params;
	const fallbackEntry = params.activeModel === void 0 ? readSessionFallbackModel({
		selectedProvider: selectedModel.provider,
		selectedModel: selectedModel.model,
		sessionEntry: params.entry,
		config: params.cfg,
		terminalModel: params.terminalModel ?? null,
		sessionScope: {
			agentId: params.storeAgentId ?? params.agentId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		}
	}) : params.activeModel ? {
		modelProvider: params.activeModel.provider,
		model: params.activeModel.model
	} : void 0;
	const { selected, active } = resolveSelectedAndActiveModel({
		selectedProvider: selectedModel.provider,
		selectedModel: selectedModel.model,
		sessionEntry: fallbackEntry ?? params.entry
	});
	return resolveActiveFallbackState({
		selectedModelRef: selected.label,
		activeModelRef: active.label,
		config: params.cfg,
		state: params.entry
	}).active ? {
		provider: active.provider,
		model: active.model
	} : void 0;
}
/** Profile publications invalidate display facts independently of stored session metadata. */
function projectSessionRowProfiles(input) {
	const { entry, cfg, userProfileIdentityById, configuredAgentIds, identityProjection } = input;
	const owner = (identityProjection?.owner ?? projectSessionOwner)(entry, userProfileIdentityById, cfg, configuredAgentIds);
	const projected = (identityProjection?.participants ?? projectSessionParticipants)(entry, userProfileIdentityById, cfg);
	const ownerKey = owner?.actor.identity && JSON.stringify(owner.actor.identity);
	const participants = [...projected].flatMap(([key, participant]) => key === ownerKey ? [] : [participant]);
	return {
		createdActor: projectSessionActor(entry?.createdActor, userProfileIdentityById, cfg, Boolean(sessionCreatorProfileId(entry?.createdActor))),
		owner,
		participants: participants.length ? participants.slice(0, 4) : void 0,
		expandedParticipants: participants.length ? participants.slice(0, MAX_SESSION_PARTICIPANTS) : void 0,
		participantCount: participants.length || void 0,
		archivedBy: projectSessionActor(entry?.archivedBy, userProfileIdentityById, cfg)
	};
}
function refreshSessionRowProfiles(materialized) {
	Object.assign(materialized.row, projectSessionRowProfiles(materialized.source));
}
function materializeSessionRow(input) {
	const { cfg, key, entry } = input;
	const observerDigest = entry?.observerDigest && (entry.startedAt === void 0 || entry.observerDigest.updatedAt > entry.startedAt) ? entry.observerDigest : void 0;
	const deliveryFields = projectSessionDeliveryFields(entry?.delivery);
	const channel = deliveryFields.channel ?? parseGroupKey(key)?.channel;
	const storedOrigin = deliveryFields.origin;
	const avatar = normalizeOptionalString(storedOrigin?.avatar);
	const controlUiBasePath = normalizeControlUiBasePath(cfg.gateway?.controlUi?.basePath);
	const pinnable = isPinnableSessionEntry(key, entry);
	const pinnedAt = pinnable ? entry?.pinnedAt : void 0;
	const row = {
		key,
		sessionModelRevision: sessionModelRevision(entry),
		...input.includeSwarmSummary ? { swarm: input.swarm } : {},
		visibility: entry ? entry.visibility ?? "shared" : void 0,
		incognito: entry?.incognito,
		swarmGroupId: entry?.swarmGroupId,
		spawnedWorkspaceDir: entry?.spawnedWorkspaceDir,
		spawnedCwd: entry?.spawnedCwd,
		workspaceDir: entry?.spawnedCwd ?? entry?.spawnedWorkspaceDir,
		projectId: entry?.projectId,
		permissionMode: entry?.permissionMode,
		communication: entry?.communication,
		effectiveCommunication: resolveSessionCommunicationPolicy({
			config: input.cfg,
			entry
		}),
		sandboxMode: entry?.sandboxMode,
		nativeRuntimeConsent: entry?.nativeRuntimeConsent,
		permissionModePending: input.permissionModePending,
		...entry?.permissionMode !== void 0 && entry.sessionRoot !== void 0 ? { sessionRoot: entry.sessionRoot } : {},
		worktree: entry?.worktree,
		deviceFolder: entry?.deviceFolder,
		repositoryWorkspaceId: entry?.repositoryWorkspaceId,
		...input.repository ? { repository: input.repository } : {},
		execNode: entry?.execNode,
		execCwd: entry?.execCwd,
		forkedFromParent: sessionEntryForkedFromParent(entry) ? true : void 0,
		spawnDepth: entry?.spawnDepth,
		subagentRole: entry?.subagentRole,
		subagentControlScope: entry?.subagentControlScope,
		createdVia: entry?.createdVia,
		createdSurface: entry?.createdSurface,
		...projectSessionRowProfiles(input),
		createdAt: entry?.createdAt,
		forkSource: entry?.forkSource,
		previousSessionId: entry?.previousSessionId,
		kind: resolveGatewaySessionKind(key, entry),
		label: entry?.label,
		autoLabel: entry?.autoLabel,
		icon: entry?.icon,
		color: entry?.color,
		channelAvatarUrl: avatar ? buildControlUiChannelAvatarUrl(controlUiBasePath, key, channelAvatarRevision(avatar)) : void 0,
		category: entry?.category,
		boardFace: entry?.boardFace,
		boardPresentation: entry?.boardPresentation,
		...sessionClassificationForRow(cfg, key, input.agentId, entry),
		displayName: input.displayName,
		derivedTitle: input.derivedTitle,
		lastMessagePreview: input.lastMessagePreview,
		channel,
		subject: entry?.subject,
		groupChannel: entry?.groupChannel,
		space: entry?.space,
		chatType: entry?.chatType,
		origin: storedOrigin ? (({ avatar: _avatar, ...safeOrigin }) => safeOrigin)(storedOrigin) : void 0,
		updatedAt: entry?.updatedAt ?? null,
		archived: entry?.archivedAt !== void 0,
		archivedAt: entry?.archivedAt,
		archiveReason: entry?.archiveReason,
		pinned: pinnedAt !== void 0,
		sidebarRoot: entry?.sidebarRoot === true,
		pinnedAt,
		snoozedUntil: pinnable ? entry?.snoozedUntil : void 0,
		snoozedAt: pinnable ? entry?.snoozedAt : void 0,
		unread: deriveSessionUnread(entry),
		lastReadAt: entry?.lastReadAt,
		markedUnreadAt: entry?.markedUnreadAt,
		observerDigest: observerDigest ? {
			...observerDigest.agentId ? { agentId: observerDigest.agentId } : {},
			runId: observerDigest.runId,
			headline: observerDigest.headline,
			health: observerDigest.health,
			updatedAt: observerDigest.updatedAt,
			revision: observerDigest.revision
		} : void 0,
		lastInteractionAt: entry?.lastInteractionAt,
		lastActivityAt: entry?.lastActivityAt,
		sessionId: entry?.sessionId,
		lifecycleRevision: entry?.lifecycleRevision,
		systemSent: entry?.systemSent,
		abortedLastRun: entry?.abortedLastRun,
		restartRecoveryStatus: entry?.mainRestartRecovery?.tombstone ? "tombstoned" : void 0,
		thinkingLevel: input.thinkingProjection.thinkingLevel,
		contextWindow: input.contextWindowProfile.contextWindow,
		contextWindows: input.contextWindowProfile.contextWindows,
		contextWindowDefault: input.contextWindowProfile.contextWindowDefault,
		thinkingLevels: input.thinkingProjection.thinkingLevels,
		thinkingOptions: input.thinkingProjection.thinkingOptions,
		thinkingDefault: input.thinkingProjection.thinkingDefault,
		fastMode: entry?.fastMode,
		toolOverrides: entry?.toolOverrides,
		effectiveFastMode: input.fastModeState.mode,
		effectiveFastModeSource: input.fastModeState.source,
		fastAutoOnSeconds: input.fastModeState.fastAutoOnSeconds,
		verboseLevel: entry?.verboseLevel,
		traceLevel: entry?.traceLevel,
		reasoningLevel: entry?.reasoningLevel,
		elevatedLevel: entry?.elevatedLevel,
		sendPolicy: entry?.sendPolicy,
		inputTokens: entry?.inputTokens,
		outputTokens: entry?.outputTokens,
		usageReport: entry?.usageReport,
		providerReview: projectSessionProviderReview(entry, key),
		lastRunId: entry?.lastRunId,
		hasAutomation: input.hasAutomation,
		parentSessionKey: entry?.parentSessionKey,
		parentSessionId: entry?.parentSessionId,
		responseUsage: entry?.responseUsage,
		effectiveResponseUsage: resolveEffectiveResponseUsage(entry?.responseUsage, cfg.messages?.responseUsage, channel),
		queueMode: entry?.queueMode,
		effectiveQueueMode: resolveQueueSettingsCore({
			cfg,
			channel: INTERNAL_MESSAGE_CHANNEL,
			sessionEntry: entry
		}).mode,
		modelProvider: input.rowModelIdentity.provider,
		model: input.rowModelIdentity.model,
		modelOverrideSource: input.selectedModel.storedOverrideSource === "parent" ? "inherited" : resolveSessionModelOverrideSource(entry),
		modelSelectionLocked: entry?.modelSelectionLocked,
		runtimeSelectionLocked: input.thinkingProjection.runtimeSelectionLocked,
		agentRuntime: input.agentRuntime,
		contextTokens: input.contextTokens,
		contextBudgetStatus: resolveProjectedSessionContextBudgetStatus({
			entry,
			provider: input.selectedModel.provider,
			model: input.selectedModel.model,
			contextTokens: input.contextTokens
		}),
		deliveryContext: deliveryFields.deliveryContext,
		lastChannel: deliveryFields.lastChannel,
		lastTo: deliveryFields.lastTo,
		lastAccountId: deliveryFields.lastAccountId,
		lastThreadId: deliveryFields.lastThreadId,
		pluginExtensions: input.pluginExtensions.length > 0 ? input.pluginExtensions : void 0
	};
	for (const field in row) if (Reflect.get(row, field) === void 0) Reflect.deleteProperty(row, field);
	return {
		row,
		source: {
			parsedKey: parseAgentSessionKey(key),
			cfg,
			entry,
			selectedModel: input.selectedModel,
			rowModelIdentity: input.rowModelIdentity,
			thinkingProjection: {
				acpMeta: input.thinkingProjection.acpMeta,
				agentRuntime: input.thinkingProjection.agentRuntime
			},
			userProfileIdentityById: input.userProfileIdentityById,
			identityProjection: input.identityProjection,
			configuredAgentIds: input.configuredAgentIds,
			lightweight: input.lightweight,
			usageByFallbackModel: input.usageByFallbackModel,
			freshSessionTotalTokens: input.freshSessionTotalTokens,
			estimatedCostUsd: input.estimatedCostUsd,
			subagentRunInputs: input.subagentRunInputs,
			lastMessagePreview: input.lastMessagePreview,
			childLinks: projectSessionRowChildLinks(input.childLinks)
		}
	};
}
function presentSessionRow(materialized, options) {
	const row = { ...materialized.row };
	const { source } = materialized;
	const { entry, freshSessionTotalTokens } = source;
	const { now } = options;
	row.snapshotAt = now;
	const subagentRuns = options.subagentRuns ?? buildSubagentRunReadIndexFromRuns({
		...source.subagentRunInputs,
		now
	});
	const { subagentRun, subagentOwner, fields } = projectGatewaySessionRunState({
		key: row.key,
		parsedKey: source.parsedKey,
		entry,
		now,
		rowContext: {
			subagentRuns,
			projectedAgentRuns: options.projectedAgentRuns,
			projectedSubagentActivity: options.projectedSubagentActivity
		}
	});
	Object.assign(row, fields);
	const usage = source.usageByFallbackModel?.get(subagentRun?.model);
	row.usageReport ??= usage?.usageReport;
	row.totalTokens = freshSessionTotalTokens ?? asNonNegativeFiniteNumber(usage?.totalTokens);
	row.totalTokensFresh = freshSessionTotalTokens !== void 0 || typeof row.totalTokens === "number" && row.totalTokens > 0 || usage?.totalTokensFresh === true;
	row.agentStatus = resolveActiveSessionAgentStatus(entry?.agentStatus, now);
	row.spawnedBy = row.controlOwnerSessionKey = subagentOwner || entry?.spawnedBy;
	row.goal = resolveGatewaySessionGoal(entry, now, {
		totalTokens: row.totalTokens,
		totalTokensFresh: row.totalTokensFresh,
		totalTokensVersion: row.totalTokensFresh ? 1 : void 0
	});
	row.estimatedCostUsd = source.estimatedCostUsd ?? asNonNegativeFiniteNumber(source.lightweight ? void 0 : usage?.estimatedCostUsd);
	const children = source.childLinks?.flatMap(({ key, parsedKey, entry: childEntry }) => {
		if (options.excludedChildKeys?.has(key)) return [];
		const childActive = projectGatewaySessionRunState({
			key,
			entry: childEntry,
			parsedKey,
			now,
			rowContext: {
				subagentRuns,
				projectedAgentRuns: options.projectedAgentRuns,
				projectedSubagentActivity: options.projectedSubagentActivity
			}
		}).fields.hasActiveSubagentRun;
		if (!resolveSessionChildOwners({
			key,
			entry: childEntry,
			parsedKey,
			now,
			subagentRuns,
			hasActiveRun: childActive
		}).includes(row.key)) return [];
		if (childActive) row.hasActiveSubagentRun = true;
		return [key];
	});
	row.childSessions = children?.length ? children : void 0;
	row.activeModelProvider = options.activeModel?.provider;
	row.activeModel = options.activeModel?.model;
	return row;
}
//#endregion
//#region src/gateway/session-row-projection-record.ts
function isPreparedSessionRowDatabaseFacts(facts) {
	return facts !== void 0 && facts.acpMeta !== void 0 && facts.runtimeOwnership !== void 0 && facts.runtimeOwnershipDependencies !== void 0 && facts.repositoryWorkspace !== void 0;
}
/** Opaque legacy/external ownership must be prepared again whenever its row becomes dirty. */
function canRetainSessionRowRuntimeOwnership(facts) {
	return !facts.runtimeOwnershipRetryPending && (facts.runtimeOwnershipDependencies.length > 0 || resolveSessionPinnedHarnessId(facts.entry) === void 0);
}
function selectionRow(row) {
	return row.entry ? {
		key: row.key,
		agentId: row.agentId,
		storeTarget: row.storeTarget,
		entry: row.entry,
		selection: row.selection,
		hasBoard: row.hasBoard,
		generation: row.generation
	} : void 0;
}
const identity = (row) => `${row.agentId}\0${row.storeTarget.storePath}\0${row.key}`;
const physical = (storePath, key) => `physical:${storePath}\0${key}`;
const logical = (agentId, key) => `logical:${agentId}\0${key}`;
function dependents(row, byParent) {
	return /* @__PURE__ */ new Set([...byParent.get(logical(row.agentId, row.key)) ?? [], ...byParent.get(physical(row.storeTarget.storePath, row.key)) ?? []]);
}
function markRelated(row, indexes, dirty, includeChildren = true, cfg) {
	if (includeChildren) {
		for (const id of dependents(row, indexes.byParent)) dirty.add(id);
		if (cfg && parseAgentSessionKey(row.key)) for (const id of indexes.byParent.get(parentReference(cfg, row.key, row.agentId)) ?? []) dirty.add(id);
	}
	for (const parent of row.parents) for (const id of indexes.byKey.get(parent) ?? []) dirty.add(id);
}
/** Children consume parent model overrides, not its changing progress or display metadata. */
function changesSessionRowDependents(before, after) {
	return !before || !after || before.sessionId !== after.sessionId || before.lifecycleRevision !== after.lifecycleRevision || before.providerOverride !== after.providerOverride || before.modelOverride !== after.modelOverride || before.modelOverrideSource !== after.modelOverrideSource || before.modelOverrideRouteResolution !== after.modelOverrideRouteResolution || before.modelOverrideFallbackOriginProvider !== after.modelOverrideFallbackOriginProvider || before.modelOverrideFallbackOriginModel !== after.modelOverrideFallbackOriginModel;
}
/** Expire accepted facts and pending replies, retaining only installed owner facts. */
function invalidateDatabaseFacts(row, retained) {
	row.databaseFactsRevision++;
	row.pendingDatabaseFacts = void 0;
	row.retainedDatabaseFacts = retained;
	row.preparedAcpMeta = retained?.acpMeta;
	row.preparedRuntimeOwnership = retained?.runtimeOwnership;
	row.runtimeOwnershipDependencies = retained?.runtimeOwnershipDependencies;
}
function create(target, entry) {
	return {
		...target,
		storedEntry: entry,
		sharingEntry: entry,
		selection: readSessionListSelectionFacts(target.key, entry),
		parents: /* @__PURE__ */ new Set(),
		membership: /* @__PURE__ */ new Set(),
		generation: Symbol("row"),
		databaseFactsRevision: 0
	};
}
/** Memory acquisition and prepared actor facts share one transient row constructor. */
function createIncognitoSessionRow(params) {
	const { cfg, key, agentId, storePath, source, entry: storedEntry } = params;
	source.assertCurrent();
	const row = create({
		key,
		agentId,
		storeTarget: {
			agentId,
			storePath
		}
	});
	const entry = projectGatewaySessionEntry(cfg, storedEntry);
	return Object.assign(row, {
		generation: source.identity,
		privateSource: source,
		storedEntry,
		entry,
		membership: new Set(params.membership),
		selection: readSessionListSelectionFacts(key, entry),
		...params.prepared ? { preparedPrivate: {
			relatedRows: params.prepared.relatedRows,
			entries: {
				...Object.fromEntries(Object.entries(params.prepared.relatedRows).map(([relatedKey, relatedRow]) => [relatedKey, relatedRow.entry])),
				[key]: storedEntry
			},
			databaseFacts: params.prepared.databaseFacts,
			titleFields: params.prepared.titleFields,
			terminalModel: params.prepared.terminalModel
		} } : {}
	});
}
/** Seed the complete identity inventory before any row selects its stored lineage. */
function seedSessionRowEntries(params) {
	const { targets, rows, replaced, remove, put } = params;
	const admitted = /* @__PURE__ */ new Set();
	const acquisitions = [];
	for (const [key, target] of targets) {
		const entry = target.entry;
		if (!entry || entry.incognito || isIncognitoSessionKey(key)) continue;
		const fields = {
			key: target.storeKey ?? key,
			agentId: target.agentId,
			storeTarget: target.storeTarget
		};
		const id = identity(fields);
		admitted.add(id);
		if (!rows.has(id) || replaced.has(target.storeTarget.storePath)) {
			remove(id);
			const row = create(fields, entry);
			put(row);
			acquisitions.push({
				row,
				entry
			});
		}
	}
	for (const id of rows.keys()) if (!admitted.has(id)) remove(id);
	return acquisitions;
}
function renewGeneration(row) {
	return {
		...row,
		entry: void 0,
		storedEntry: void 0,
		entryAcquisitionPending: void 0,
		pendingDatabaseFacts: void 0,
		retainedDatabaseFacts: void 0,
		preparedAcpMeta: void 0,
		preparedRuntimeOwnership: void 0,
		runtimeOwnershipDependencies: void 0,
		unresolvedDatabaseFacts: void 0,
		publishedSource: void 0,
		sharingEntry: void 0,
		materialized: void 0,
		lastMessagePreview: void 0,
		fallbackModel: void 0,
		generation: Symbol("row")
	};
}
function hasEntry(row) {
	return Boolean(row?.entry);
}
function ready(row) {
	return Boolean(row?.entry && row.unresolvedDatabaseFacts !== "category" && row.materialized?.source.entry === row.entry);
}
function publishTranscriptFields(row, fields, cfg, context) {
	const fallbackModel = resolveGatewaySessionActiveModel({
		cfg,
		agentId: row.agentId,
		sessionId: row.entry.sessionId,
		sessionKey: row.key,
		storePath: row.storeTarget.storePath,
		entry: row.entry,
		selectedModel: row.materialized.source.selectedModel,
		projectedAgentRuns: context.projectedAgentRuns,
		active: false,
		activeModel: fields.fallbackModel ?? null
	});
	if (row.lastMessagePreview === fields.lastMessagePreview && isDeepStrictEqual(row.fallbackModel, fallbackModel)) return false;
	Object.assign(row, {
		lastMessagePreview: fields.lastMessagePreview,
		fallbackModel
	});
	row.materialized.source.lastMessagePreview = fields.lastMessagePreview;
	row.materialized.row.lastMessagePreview = fields.lastMessagePreview;
	return true;
}
function sort(rows, sortBy) {
	return sortBy === null ? rows : rows.toSorted((a, b) => compareSessionEntryPairs([a.key, a.entry], [b.key, b.entry], sortBy));
}
function sameFallbackModelFacts(previous, current) {
	return previous?.modelProvider === current.modelProvider && previous?.model === current.model && previous?.lastRunId === current.lastRunId && isDeepStrictEqual(previous?.fallbackNotice, current.fallbackNotice);
}
function first(candidates, storePaths) {
	if (candidates.length < 2) return candidates[0];
	for (const sourcePath of storePaths) {
		const row = candidates.find((candidate) => candidate.storeTarget.storePath === sourcePath);
		if (row) return row;
	}
}
function firstReferenced(ref, rows, byKey, storePaths) {
	return first([...byKey.get(ref) ?? []].flatMap((id) => rows.get(id) ?? []), storePaths);
}
function present(record, context, options = {}) {
	const now = options.now ?? Date.now();
	const live = resolveProjectedAgentRunModel({
		agentId: record.agentId,
		sessionId: record.entry.sessionId,
		index: context.projectedAgentRuns
	});
	const active = options.active ?? live !== void 0;
	const row = presentSessionRow(record.materialized, {
		now,
		subagentRuns: options.subagentRuns ?? context.subagentRuns.atTime(now),
		projectedAgentRuns: context.projectedAgentRuns,
		projectedSubagentActivity: context.projectedSubagentActivity,
		activeModel: active ? live ?? void 0 : record.fallbackModel,
		excludedChildKeys: options.excludedChildKeys
	});
	Object.assign(row, options.preparedFacts ?? record.facts?.present());
	row.hasBoard = record.hasBoard;
	if (!options.includeDerivedTitles) row.derivedTitle = void 0;
	if (!options.includeLastMessage) row.lastMessagePreview = void 0;
	return row;
}
/** The wire snapshot and lifecycle identity come from the same materialized record. */
function snapshot(row, context, options) {
	return row ? {
		row: present(row, context, options),
		lifecycleRunId: row.entry.lifecycleRunId
	} : { row: null };
}
function updateIndex(map, key, id, deleting) {
	if (!key) return;
	const values = map.get(key);
	if (deleting) {
		values?.delete(id);
		if (values?.size === 0) map.delete(key);
	} else if (values) values.add(id);
	else map.set(key, /* @__PURE__ */ new Set([id]));
}
function index(row, indexes, deleting = false) {
	const { byStore, byAgent, byKey, byParent } = indexes;
	const id = identity(row);
	updateIndex(byStore, row.storeTarget.storePath, id, deleting);
	updateIndex(byAgent, row.agentId, id, deleting);
	updateIndex(byKey, `key:${row.key}`, id, deleting);
	updateIndex(byKey, row.entry && `id:${row.entry.sessionId}`, id, deleting);
	updateIndex(byKey, logical(row.agentId, row.key), id, deleting);
	updateIndex(byKey, physical(row.storeTarget.storePath, row.key), id, deleting);
	for (const parent of row.parents) updateIndex(byParent, parent, id, deleting);
}
function isPrivateSourceCurrent(source) {
	try {
		source.assertCurrent();
		return true;
	} catch {
		return false;
	}
}
function isCurrentGeneration(row, current) {
	return current?.generation === row.generation && (!isIncognitoSessionKey(row.key) || current.entry?.sessionId === row.entry?.sessionId && current.entry?.lifecycleRevision === row.entry?.lifecycleRevision);
}
function parentReference(cfg, key, fallbackAgentId, sourcePath, referenced) {
	return selectSessionRowParent(cfg, key, fallbackAgentId, sourcePath, referenced).reference;
}
function selectSessionRowParent(cfg, key, fallbackAgentId, sourcePath, referenced) {
	if (sourcePath && (key === "global" || key === "unknown")) return {
		key,
		reference: physical(sourcePath, key)
	};
	const selected = selectStoredSessionLineage({
		cfg,
		agentId: fallbackAgentId,
		sessionKey: key,
		read: (agentId, sessionKey) => referenced?.(logical(agentId, sessionKey))?.storedEntry
	});
	return {
		key: selected.key,
		reference: logical(selected.agentId, selected.key)
	};
}
/** Drop reader-only graphs while retaining cold metadata and index identity. */
function dematerialize(row) {
	return {
		...row,
		materialized: void 0,
		materializedSequence: void 0,
		facts: void 0,
		pendingDatabaseFacts: void 0,
		retainedDatabaseFacts: void 0,
		databaseFactsRevision: row.databaseFactsRevision + 1,
		membership: /* @__PURE__ */ new Set(),
		lastMessagePreview: void 0,
		fallbackModel: void 0
	};
}
function readSessionRowParents(row, storedEntry, cfg, context, referenced) {
	const parents = /* @__PURE__ */ new Set();
	const addParent = (key) => {
		if (key && key !== row.key) parents.add(parentReference(cfg, key, row.agentId, row.storeTarget.storePath, referenced));
	};
	addParent(storedEntry.parentSessionKey ?? resolveSessionParentSessionKey(row.key));
	addParent(storedEntry.spawnedBy);
	for (const run of context.subagentRunsByChildSessionKey.get(row.key) ?? []) addParent(run.controllerSessionKey || run.requesterSessionKey);
	return parents;
}
/** Reproject held lineage without acquiring board, transcript, or database facts. */
function readSessionRowLineage(row, storedEntry, cfg, context, referenced) {
	const entry = projectGatewaySessionEntry(cfg, storedEntry, (key) => selectSessionRowParent(cfg, key, row.agentId, row.storeTarget.storePath, referenced).key);
	return {
		entry,
		parents: readSessionRowParents(row, storedEntry, cfg, context, referenced),
		selection: readSessionListSelectionFacts(row.key, entry)
	};
}
function acquireSessionRowEntry(params) {
	const { row, storedEntry, cfg, context, remove, put, archive } = params;
	if (!storedEntry || storedEntry.incognito) {
		remove(identity(row));
		return;
	}
	const lineage = readSessionRowLineage(row, storedEntry, cfg, context, params.referenced);
	const entryChanged = !isDeepStrictEqual(lineage.entry, row.entry);
	if (!entryChanged && row.entry) lineage.entry = row.entry;
	const { entry, parents } = lineage;
	const changed = !isDeepStrictEqual(row.parents, parents) || !Object.is(storedEntry.updatedAt, row.storedEntry?.updatedAt) || !isDeepStrictEqual(storedEntry, row.storedEntry) || entryChanged;
	const includeChildren = changesSessionRowDependents(row.storedEntry, storedEntry) || changesSessionRowDependents(row.entry, entry);
	if (changed) params.markRelated(row, includeChildren);
	const generation = !row.entry || row.entry.sessionId === entry.sessionId && row.entry.lifecycleRevision === entry.lifecycleRevision ? row.generation : Symbol("row");
	const retainedDatabaseFacts = row.retainedDatabaseFacts?.entry === storedEntry ? row.retainedDatabaseFacts : void 0;
	let next = {
		...row,
		storedEntry,
		entryAcquisitionPending: void 0,
		pendingDatabaseFacts: void 0,
		retainedDatabaseFacts,
		databaseFactsRevision: row.databaseFactsRevision + (retainedDatabaseFacts ? 0 : 1),
		...lineage,
		sharingEntry: storedEntry,
		generation,
		fallbackModel: sameFallbackModelFacts(row.storedEntry, storedEntry) && sameFallbackModelFacts(row.entry, entry) ? row.fallbackModel : void 0,
		...generation !== row.generation ? {
			lastMessagePreview: void 0,
			fallbackModel: void 0,
			materialized: void 0,
			preparedAcpMeta: void 0,
			preparedRuntimeOwnership: void 0,
			runtimeOwnershipDependencies: void 0
		} : {}
	};
	put(next);
	if (entry.archivedAt !== void 0 && row.entry?.archivedAt === void 0) next = archive.demote(next);
	else if (entry.archivedAt === void 0) archive.forget(identity(next));
	if (changed) params.markRelated(next, includeChildren);
	return next;
}
//#endregion
//#region src/gateway/session-row-prepared-read.ts
/** Synchronous selection reenters through the existing exact worker preparation owner. */
var SessionRowFactsPending = class extends Error {
	constructor(queries) {
		super("Session row facts require worker reconciliation");
		this.queries = queries;
	}
};
function privateSessionRowReadKey(cfg, query) {
	const key = resolveStoredSessionKeyForAgentStore({
		cfg,
		agentId: query.agentId,
		sessionKey: query.key
	});
	return isIncognitoSessionKey(key) ? JSON.stringify([query.agentId, key]) : void 0;
}
function readPreparedSessionRows(owner, isActive, queries, consume, privateRepositories, capturedPrivateRows) {
	if (!isActive()) throw new Error("Session row read view is no longer active");
	let state = owner.state;
	const privateRows = /* @__PURE__ */ new Map();
	const childSelections = /* @__PURE__ */ new Map();
	const privateKey = (query) => privateSessionRowReadKey(state.cfg, query);
	for (const query of queries(state.cfg)) {
		const key = privateKey(query);
		if (key && !privateRows.has(key)) {
			const prepared = privateRepositories?.get(key);
			const row = capturedPrivateRows?.has(key) ? capturedPrivateRows.get(key) && owner.describe(query, capturedPrivateRows.get(key)) : prepared ? owner.describe(query, prepared.row, prepared.repository.current() ?? null) : owner.describe(query);
			if (prepared && (!isCurrentGeneration(prepared.row, row) || row?.entry?.repositoryWorkspaceId !== prepared.workspaceId)) throw new Error("Session repository binding changed while preparing its description");
			privateRows.set(key, row);
		}
	}
	for (const row of privateRows.values()) {
		for (const group of row?.materialized.row.swarm?.groups ?? []) for (const child of group.children ?? []) if (!childSelections.has(child.sessionKey)) {
			const related = row?.preparedPrivate;
			const prepared = related?.relatedRows[child.sessionKey];
			childSelections.set(child.sessionKey, prepared ? [{
				...create(prepared, prepared.entry),
				entry: prepared.entry
			}] : related ? [] : owner.selectEntries({ key: child.sessionKey }));
		}
		if (row && !owner.isCurrent(row)) throw new Error("Session changed while preparing its description; retry the request");
	}
	const preparedState = owner.state;
	state = {
		cfg: preparedState.cfg,
		policyConfig: preparedState.policyConfig,
		rowContext: preparedState.rowContext
	};
	let active = true;
	const assertActive = () => {
		if (!active || !isActive()) throw new Error("Session row read view is no longer active");
	};
	const read = {
		readSource(row) {
			assertActive();
			return owner.readSource(row);
		},
		describe(query, captured) {
			assertActive();
			const key = privateKey(query);
			if (!key) return owner.describe(query, captured);
			if (!privateRows.has(key)) throw new Error("Incognito session description was not prepared");
			const row = privateRows.get(key);
			return captured && !isCurrentGeneration(captured, row) ? void 0 : row;
		},
		readMembership(query) {
			assertActive();
			const key = privateKey(query);
			if (key) {
				if (!privateRows.has(key)) throw new Error("Incognito session description was not prepared");
				return privateRows.get(key)?.membership;
			}
			return owner.readMembership(query);
		},
		present(record, options) {
			assertActive();
			return owner.present(record, options);
		},
		selectEntries(query) {
			assertActive();
			if (privateRows.size > 0) {
				const rows = childSelections.get(query.key);
				if (!rows) throw new Error("Session child selection was not prepared");
				return rows;
			}
			return owner.selectEntries(query);
		},
		get state() {
			assertActive();
			return {
				...state,
				policyConfig: owner.getPolicyConfig()
			};
		}
	};
	try {
		const result = consume(read);
		if (isPromiseLike(result)) {
			Promise.resolve(result).catch(() => {});
			throw new Error("Session row read consumers must remain synchronous");
		}
		assertActive();
		for (const row of privateRows.values()) row?.privateSource?.assertCurrent();
		return result;
	} finally {
		active = false;
		privateRows.clear();
		childSelections.clear();
	}
}
/** Consume prepared facts with the request's cancellation scope. */
async function withReadySessionRows(owner, queries, consume, options) {
	const signal = getAsyncWorkSignal();
	const select = (config) => {
		signal?.throwIfAborted();
		return queries(config);
	};
	const consumeCurrent = (read) => {
		signal?.throwIfAborted();
		return consume(read);
	};
	signal?.throwIfAborted();
	const result = await owner.withPreparedExactRows(select, consumeCurrent, options);
	signal?.throwIfAborted();
	return result;
}
//#endregion
export { seedSessionRowEntries as A, beginSessionPermissionChange as B, physical as C, readSessionRowParents as D, readSessionRowLineage as E, materializeSessionRow as F, registerSessionAutomationSource as G, sessionClassificationForRow as H, readSessionRowInputs as I, sortAndLimitSessionEntries as J, unregisterSessionAutomationSource as K, refreshSessionRowProfiles as L, snapshot as M, sort as N, ready as O, buildGatewaySessionRow as P, buildSessionSwarmSummary as R, parentReference as S, publishTranscriptFields as T, claimSessionAutomationEpoch as U, isSessionPermissionChangePending as V, invalidateSessionAutomationIndex as W, deriveSessionUnread as Y, invalidateDatabaseFacts as _, acquireSessionRowEntry as a, isPrivateSourceCurrent as b, create as c, dependents as d, first as f, index as g, identity as h, withReadySessionRows as i, selectionRow as j, renewGeneration as k, createIncognitoSessionRow as l, hasEntry as m, privateSessionRowReadKey as n, canRetainSessionRowRuntimeOwnership as o, firstReferenced as p, compareSessionEntryPairs as q, readPreparedSessionRows as r, changesSessionRowDependents as s, SessionRowFactsPending as t, dematerialize as u, isCurrentGeneration as v, present as w, markRelated as x, isPreparedSessionRowDatabaseFacts as y, readSessionRowModelFacts as z };
