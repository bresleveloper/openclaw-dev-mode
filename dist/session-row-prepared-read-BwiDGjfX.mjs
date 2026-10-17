import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { l as asNonNegativeFiniteNumber, u as asPositiveFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { r as getAsyncWorkSignal } from "./async-work-scope-BYeX3gh6.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { t as normalizeControlUiBasePath } from "./control-ui-shared-DqFhbHR8.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { A as normalizeSessionKeyPreservingOpaquePeerIds, D as parseSessionDeliveryRoute, M as parseAgentSessionKey, O as parseThreadSessionSuffix, S as isCronSessionKey, b as isAcpSessionKey, w as isSubagentSessionKey } from "./session-key-C09ow4h0.mjs";
import "./defaults-Jag53zwP.mjs";
import { k as resolveSessionModelOverrideSource } from "./agent-scope-CG17uXFn.mjs";
import { n as sessionChanges } from "./session-row-changes-BcJIdta8.mjs";
import { E as resolveProjectedAgentRunProgressState, T as resolveProjectedAgentRunModel, t as buildProjectedAgentRunIndex } from "./agent-run-registry-BaxMDLZF.mjs";
import { l as getAgentEventLifecycleGeneration, u as isAgentEventLifecycleGenerationCurrent } from "./agent-events-GvNTkbe3.mjs";
import { f as resolveEffectiveResponseUsage } from "./thinking.shared-Jy32Vp-O.mjs";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-B3vfipkP.mjs";
import "./session-participant-CA6bsNes.mjs";
import { l as projectSessionDeliveryFields } from "./delivery-context.shared-PF5njaoI.mjs";
import { r as resolveAgentMainSessionKey } from "./main-session-00MgEWj5.mjs";
import { t as SESSION_AGENT_ATTENTION_ICON_IDS } from "./session-agent-status-BSzRJm_2.mjs";
import "./thinking-NbdrO8vA.mjs";
import { n as sessionDeliveryChannel, r as sessionDeliveryOrigin } from "./delivery-context.read-CR06zOJ4.mjs";
import { m as withCanonicalSessionValidationDeferral } from "./session-canonical-key-D1TSJMmX.mjs";
import { h as isPinnableSessionEntry } from "./store-maintenance-CGOlSbiV.mjs";
import { s as resolveCronSessionTargetSessionKey } from "./session-target-DJsUULzX.mjs";
import { s as sessionCreatorProfileId, t as MAX_SESSION_PARTICIPANTS } from "./session-entry-provenance-Bfs2J1E7.mjs";
import { n as buildGroupDisplayTitle, t as buildGroupDisplayName } from "./group-DiW6xNkZ.mjs";
import { n as renderUserFacingText } from "./user-facing-text-DC1sCo4O.mjs";
import { a as sessionEntryForkedFromParent } from "./session-entry-lineage-Dms9xZt1.mjs";
import { n as isTerminalSessionStatus, o as resolveFreshSessionTotalTokens } from "./types-BZlUzQZy.mjs";
import { c as selectStoredSessionLineage, o as resolveStoredSessionKeyForAgentStore } from "./session-store-key-Ci099tm9.mjs";
import { t as classifySessionKind } from "./classify-session-kind-CT3WV_2y.mjs";
import { l as canContinueSessionProviderReview } from "./lifecycle-DdaXH8bC.mjs";
import { r as resolveSessionParentSessionKey } from "./session-conversation-BIYNj_jF.mjs";
import { d as resolveSessionGoalDisplayState } from "./sessions-D_sxp1B4.mjs";
import { n as resolveProjectedSessionContextTokens, t as resolveProjectedSessionContextBudgetStatus } from "./context-token-provenance-Djv3AdiI.mjs";
import { a as projectPluginSessionExtensionsSync } from "./host-hook-state-OKBUv5bt.mjs";
import { s as resolveModelContextTokenProjection } from "./context-DtziOKiU.mjs";
import { a as isSubagentRunLive, o as isSubagentRunQueued } from "./subagent-run-liveness-C7bJPLJU.mjs";
import { i as resolveSubagentSessionStatus, n as getSubagentSessionStartedAt, t as getSubagentSessionRuntimeMs } from "./subagent-session-metrics-BCHEYB6I.mjs";
import { n as buildSubagentRunReadIndexFromRuns } from "./subagent-registry-queries-rT6zMXb5.mjs";
import { n as buildSubagentSessionListReadIndex } from "./subagent-registry-read-BE_xWkJl.mjs";
import { i as projectGatewaySessionEntry } from "./combined-store-gateway-BS1S2ivy.mjs";
import { n as sortAndLimitByWork } from "./sort-and-limit-NdojqZsZ.mjs";
import { t as readSessionListSelectionFacts } from "./session-list-target-C2rmz7hN.mjs";
import { t as resolveFastModeState } from "./fast-mode-CdiysUl0.mjs";
import { a as resolveGatewaySessionThinkingProjectionInternal, o as resolveSessionDisplayModelIdentityRefCached, s as resolveModelContextWindowProfile } from "./session-utils-model-JtZ-2MzK.mjs";
import { r as resolveSelectedAndActiveModel, t as readSessionFallbackModel } from "./session-fallback-model-GrIUyRG6.mjs";
import { t as resolveQueueSettingsCore } from "./settings-BlxNNwS3.mjs";
import { t as resolveActiveFallbackState } from "./fallback-notice-state-CCOA5IKG.mjs";
import { t as buildControlUiChannelAvatarUrl } from "./control-ui-resource-routes-y_jZ6jnp.mjs";
import "./control-ui-contract-B_YMMx3J.mjs";
import { r as tryResolveCronJobEffectiveAgentId } from "./agent-id-uYw1RFJQ.mjs";
import { t as resolveCronAgentSessionKey } from "./session-key-C18RZBZJ.mjs";
import { a as projectSessionOwner, i as projectSessionActor, s as projectSessionParticipants } from "./session-identity-projection-C_gwtUz2.mjs";
import { n as readPreparedGatewayModelCatalogMetadata } from "./server-model-catalog-view-muuNaRwE.mjs";
import { t as resolveSessionSelectedModelRef } from "./session-utils-model-selection-DXm2tidn.mjs";
import { a as resolveEstimatedSessionCostUsd, i as readStoreChildSessionLinks, o as resolveSessionChildOwners, r as prepareSessionTitleRead, t as deriveSessionTitle } from "./session-utils-core-CxvBHP5P.mjs";
import { t as projectWorkerPlacementAgentRuntime } from "./placement-session-runtime-D5yJBcMK.mjs";
import { a as resolveTranscriptUsageFallbacks, n as buildSessionListRowMetadataContext } from "./session-utils-projection-CwKHGoI0.mjs";
import { t as readSessionTitleFieldsFromTranscript } from "./session-transcript-title-reader-DiujdOfq.mjs";
import { a as parseGroupKey, t as isGroupOrChannelDisplaySession } from "./session-utils-store-DrLraxiU.mjs";
import { isDeepStrictEqual } from "node:util";
import { createHash } from "node:crypto";
//#region src/shared/session-activity-timestamp.ts
function sessionActivityTimestamp(row) {
	const lastActivityAt = asPositiveFiniteNumber(row.lastActivityAt);
	const lastInteractionAt = asPositiveFiniteNumber(row.lastInteractionAt);
	if (lastActivityAt !== void 0 || lastInteractionAt !== void 0) return Math.max(lastActivityAt ?? 0, lastInteractionAt ?? 0);
	return asPositiveFiniteNumber(row.updatedAt) ?? asPositiveFiniteNumber(row.createdAt) ?? 0;
}
//#endregion
//#region src/gateway/session-list-order.ts
function compareSessionEntryPairs(a, b, sortBy = "updatedAt") {
	if (sortBy === "updatedAt") {
		const aPinnedAt = a[1]?.pinnedAt !== void 0 && isPinnableSessionEntry(a[0], a[1]) ? a[1].pinnedAt ?? 0 : 0;
		const bPinnedAt = b[1]?.pinnedAt !== void 0 && isPinnableSessionEntry(b[0], b[1]) ? b[1].pinnedAt ?? 0 : 0;
		if (aPinnedAt !== bPinnedAt) return bPinnedAt - aPinnedAt;
	}
	const aTimestamp = sortBy === "activity" ? sessionActivityTimestamp(a[1]) : a[1]?.[sortBy];
	const byTimestamp = ((sortBy === "activity" ? sessionActivityTimestamp(b[1]) : b[1]?.[sortBy]) ?? 0) - (aTimestamp ?? 0);
	if (byTimestamp !== 0) return byTimestamp;
	return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0;
}
function* sortAndLimitSessionEntries(entries, limit, sortBy, shouldYield) {
	return yield* sortAndLimitByWork(entries, limit, (a, b) => compareSessionEntryPairs(a, b, sortBy), shouldYield);
}
//#endregion
//#region src/sessions/session-agent-status.ts
const SESSION_AGENT_STATUS_NOTE_MAX_CHARS = 120;
const SESSION_AGENT_STATUS_DEFAULT_TTL_MINUTES = 30;
const ATTENTION_ICON_IDS = new Set(SESSION_AGENT_ATTENTION_ICON_IDS);
function isSessionAgentAttentionIconId(value) {
	return typeof value === "string" && ATTENTION_ICON_IDS.has(value);
}
function sanitizeSessionAgentStatusNote(value) {
	const normalized = renderUserFacingText(value, { errorContext: true }).replace(/\s+/g, " ").trim();
	return truncateUtf16Safe(normalized, SESSION_AGENT_STATUS_NOTE_MAX_CHARS).trimEnd();
}
function resolveActiveSessionAgentStatus(status, now) {
	if (!status || !status.note.trim() || !Number.isFinite(status.expiresAt) || status.expiresAt <= now) return;
	if (status.attention !== void 0 && !isSessionAgentAttentionIconId(status.attention)) return;
	return status;
}
function sessionAgentStatusExpiresAt(now, ttlMinutes) {
	return now + (ttlMinutes ?? SESSION_AGENT_STATUS_DEFAULT_TTL_MINUTES) * 6e4;
}
//#endregion
//#region src/shared/session-unread.ts
function deriveSessionUnread(entry) {
	const unreadBaselineAt = entry?.lastReadAt ?? entry?.createdAt;
	return entry?.markedUnreadAt !== void 0 || unreadBaselineAt !== void 0 && Math.max(entry?.lastInteractionAt ?? 0, entry?.lastActivityAt ?? 0) > unreadBaselineAt;
}
//#endregion
//#region src/cron/job-session-bindings.ts
/**
* Resolves every canonical session key a job is bound to: the session the run
* joins (main/isolated/session:<key>) plus the explicit wake/delivery lane in
* job.sessionKey. Keys use the same canonicalization as cron run/session
* creation, so they compare equal to gateway session-store row keys.
*/
function resolveCronJobBoundSessionKeys(job, opts) {
	const keys = /* @__PURE__ */ new Set();
	const agentId = tryResolveCronJobEffectiveAgentId(job, opts.defaultAgentId);
	if (!agentId) return keys;
	const add = (sessionKey) => {
		const trimmed = sessionKey?.trim();
		if (!trimmed) return;
		keys.add(resolveCronAgentSessionKey({
			sessionKey: trimmed,
			agentId,
			mainKey: opts.cfg.session?.mainKey,
			cfg: opts.cfg
		}));
	};
	try {
		if (job.sessionTarget === "main") add("main");
		else if (job.sessionTarget === "isolated" || job.sessionTarget === "current") add(`cron:${job.id}`);
		else add(resolveCronSessionTargetSessionKey(job.sessionTarget));
		add(job.sessionKey);
	} catch {
		keys.clear();
	}
	return keys;
}
/** Signals a locked re-check found the job no longer bound; a per-job no-op. */
var CronJobBindingStaleError = class extends Error {
	constructor() {
		super("cron job binding changed concurrently");
	}
};
/** Disables enabled jobs bound to any archived session with one job-list scan. */
async function disableCronJobsBoundToSessions(params) {
	const sessionKeys = [...new Set(params.sessionKeys.map((key) => key.trim()).filter(Boolean))];
	const disabledBySession = new Map(sessionKeys.map((sessionKey) => [sessionKey, []]));
	if (sessionKeys.length === 0) return disabledBySession;
	const targetKeys = new Set(sessionKeys);
	const jobs = await params.cron.list();
	const defaultAgentId = params.cron.getDefaultAgentId();
	const matchingSessionKeys = (job) => {
		if (!job.enabled) return [];
		return [...resolveCronJobBoundSessionKeys(job, {
			cfg: params.cfg,
			defaultAgentId
		})].filter((sessionKey) => targetKeys.has(sessionKey));
	};
	const failures = [];
	for (const job of jobs) {
		if (matchingSessionKeys(job).length === 0) continue;
		try {
			let lockedMatches = [];
			await params.cron.updateWithPrecondition(job.id, { enabled: false }, (currentJob) => {
				lockedMatches = matchingSessionKeys(currentJob);
				if (lockedMatches.length === 0) throw new CronJobBindingStaleError();
			});
			for (const sessionKey of lockedMatches) disabledBySession.get(sessionKey)?.push(job.id);
		} catch (error) {
			if (error instanceof CronJobBindingStaleError) continue;
			failures.push(error);
		}
	}
	if (failures.length > 0) {
		const subject = sessionKeys.length === 1 ? `bound to ${sessionKeys[0]}` : `bound to ${sessionKeys.length} archived sessions`;
		throw new AggregateError(failures, `failed to disable ${failures.length} cron job(s) ${subject}`);
	}
	return disabledBySession;
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
	const metadataSnapshot = readPreparedGatewayModelCatalogMetadata(preparedCatalog);
	const selectedModel = resolveSessionSelectedModelRef({
		cfg,
		sessionKey: key,
		source,
		agentId,
		rowContext,
		allowPluginNormalization: !lightweight,
		manifestPlugins: metadataSnapshot
	});
	const { provider, model } = selectedModel;
	const rowModelIdentity = resolveSessionDisplayModelIdentityRefCached({
		cfg,
		provider,
		model,
		rowContext
	});
	const rowModelCatalog = params.modelCatalog instanceof Map ? preparedCatalog?.entries : params.modelCatalog;
	const thinkingProjection = resolveGatewaySessionThinkingProjectionInternal({
		cfg,
		agentId,
		provider: provider ?? "openai",
		model: model ?? "gpt-6-astra",
		sessionKey: key,
		entry: params.entry,
		preparedAcpMeta: params.preparedAcpMeta,
		modelCatalog: rowModelCatalog ?? (lightweight ? [] : void 0),
		modelCatalogRouteVariants: preparedCatalog?.routeVariants,
		metadataSnapshot,
		rowContext,
		providerPolicySource: preparedCatalog?.pluginRegistry ?? (lightweight ? "active" : void 0)
	});
	return {
		selectedModel,
		rowModelIdentity,
		thinkingProjection,
		catalogEntry: rowModelCatalog && provider && model ? thinkingProjection.catalogEntry : void 0
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
//#region src/gateway/session-utils-display.ts
function resolveGatewaySessionDisplayName(key, entry) {
	const explicitLabel = normalizeOptionalString(entry?.label);
	if (explicitLabel !== void 0) return explicitLabel;
	const parsed = parseGroupKey(key);
	const isGroupSession = isGroupOrChannelDisplaySession(entry, parsed);
	const groupTitle = isGroupSession ? buildGroupDisplayTitle(entry ?? {}) : void 0;
	if (groupTitle !== void 0) return groupTitle;
	const channel = sessionDeliveryChannel(entry) ?? parsed?.channel;
	const id = parsed?.id;
	const compactGroupFallback = isGroupSession && channel ? buildGroupDisplayName({
		provider: channel,
		subject: entry?.subject,
		topicName: entry?.topicName,
		groupChannel: entry?.groupChannel,
		space: entry?.space,
		id,
		key
	}) : void 0;
	const displayName = (channel === "imessage" && isGroupSession && entry?.displayName === compactGroupFallback ? void 0 : entry?.displayName) ?? entry?.autoLabel ?? (channel === "imessage" ? void 0 : compactGroupFallback);
	if (displayName !== void 0) return displayName;
	if (parseAgentSessionKey(key)?.rest.startsWith("dashboard:")) return;
	const origin = sessionDeliveryOrigin(entry);
	const originLabel = origin?.label;
	const normalizedOriginFrom = normalizeOptionalString(origin?.from);
	const routeIdentityTail = normalizedOriginFrom?.split(":").at(-1);
	const routeIdentityTailIsOpaque = routeIdentityTail != null && (routeIdentityTail.includes("@") || /^[+]?[\d\s().-]+$/.test(routeIdentityTail));
	const originIsRouteIdentity = originLabel != null && (originLabel === normalizedOriginFrom || routeIdentityTailIsOpaque && originLabel === routeIdentityTail);
	const originIsGenericGroupFallback = channel === "imessage" && isGroupSession && id != null && originLabel?.toLowerCase() === `group id:${id.toLowerCase()}`;
	return originIsRouteIdentity || originIsGenericGroupFallback ? void 0 : originLabel;
}
function resolveGatewaySessionKind(key, entry) {
	const sessionKind = classifySessionKind(key, entry);
	return sessionKind === "cron" || sessionKind === "spawn-child" ? "direct" : sessionKind;
}
function projectGatewaySessionRunState(params) {
	const { key, entry, now, rowContext } = params;
	const subagentRuns = rowContext?.subagentRuns ?? buildSubagentSessionListReadIndex(now);
	const subagentRun = subagentRuns.getDisplaySubagentRun(key);
	const subagentOwner = normalizeOptionalString(subagentRun?.controllerSessionKey) || normalizeOptionalString(subagentRun?.requesterSessionKey);
	const liveSubagentRunActive = isSubagentRunLive(subagentRun) || isSubagentRunQueued(subagentRun);
	const hasProjectedRun = (sessionKey, sessionId) => {
		if (!rowContext?.projectedAgentRuns) return false;
		return resolveProjectedAgentRunProgressState({
			sessionKeys: [sessionKey],
			sessionId,
			index: rowContext.projectedAgentRuns
		}) !== void 0;
	};
	const hasActiveSubagentRun = liveSubagentRunActive || subagentRuns.countActiveDescendantRuns(key) > 0 || (subagentRun !== null || entry?.spawnedBy !== void 0) && hasProjectedRun(key, entry?.sessionId) || rowContext?.projectedSubagentActivity?.has(key) === true;
	const fields = {
		status: entry?.status,
		lastRunError: entry?.lastRunError,
		subagentRunState: void 0,
		hasActiveSubagentRun: subagentRun || hasActiveSubagentRun ? hasActiveSubagentRun : void 0,
		startedAt: entry?.startedAt,
		endedAt: entry?.endedAt,
		runtimeMs: entry?.runtimeMs
	};
	if (subagentRun) {
		const endedAt = subagentRun.execution.endedAt;
		const subagentStatus = resolveSubagentSessionStatus(subagentRun);
		fields.subagentRunState = liveSubagentRunActive ? "active" : typeof endedAt === "number" || isTerminalSessionStatus(fields.status) || typeof fields.endedAt === "number" ? "historical" : "interrupted";
		fields.status = liveSubagentRunActive ? subagentStatus : fields.status === "running" ? void 0 : fields.status ?? (typeof endedAt === "number" ? subagentStatus : void 0);
		const ownsInterruptedSession = entry?.lifecycleRunId === subagentRun.runId || entry?.lifecycleRunId === void 0 && entry?.lastRunId === subagentRun.runId || subagentRun.taskRunId !== void 0 && entry?.subagentRecovery?.lastRunId === subagentRun.runId && entry.lifecycleRunId === (entry.subagentRecovery.sessionLifecycleRunId ?? subagentRun.taskRunId);
		if (fields.status === "interrupted" && subagentStatus === "failed" && subagentRun.execution.interruptionReason === "gateway-restart" && ownsInterruptedSession) {
			fields.status = "failed";
			fields.lastRunError ??= "Restart recovery could not reach the parent. Inspect the child session before continuing.";
		}
		fields.startedAt = (liveSubagentRunActive ? void 0 : fields.startedAt) ?? getSubagentSessionStartedAt(subagentRun);
		fields.endedAt = liveSubagentRunActive ? endedAt : fields.endedAt ?? endedAt;
		fields.runtimeMs = liveSubagentRunActive ? getSubagentSessionRuntimeMs(subagentRun, now) : fields.runtimeMs ?? (typeof endedAt === "number" ? getSubagentSessionRuntimeMs(subagentRun, now) : void 0);
	}
	return {
		subagentRun,
		subagentOwner,
		fields
	};
}
function resolveGatewaySessionGoal(entry, now, usage = entry) {
	return entry?.goal ? resolveSessionGoalDisplayState({
		...usage,
		goal: entry.goal
	}, now, { adoptFreshBaseline: false }) : void 0;
}
function projectGatewaySessionActiveRun(active, status) {
	return {
		hasActiveRun: active?.active,
		status: active?.active ? active.status ?? "running" : status
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
		source: params.modelSource ?? {
			entry,
			readSourceEntry: (parentKey) => store[parentKey]
		},
		agentId,
		rowContext,
		modelCatalog: params.modelCatalog,
		lightweightListRow: lightweight
	});
	const freshSessionTotalTokens = asNonNegativeFiniteNumber(resolveFreshSessionTotalTokens(entry));
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
		storeAgentId: params.storeAgentId
	}) : void 0;
	const { provider, model } = selectedModel;
	const activeModel = resolveGatewaySessionActiveModel({
		cfg,
		active: params.active,
		activeModel: params.activeModel,
		storeAgentId: params.storeAgentId,
		selectedModel,
		projectedAgentRuns: rowContext.projectedAgentRuns ??= buildProjectedAgentRunIndex(),
		entry,
		agentId,
		sessionId: entry?.sessionId,
		sessionKey: key,
		storePath
	});
	const titleRead = prepareSessionTitleRead(entry, displayName, params);
	let derivedTitle = titleRead?.derivedTitle;
	let lastMessagePreview;
	if (entry?.sessionId && titleRead?.needsTranscript) {
		const fields = readSessionTitleFieldsFromTranscript({
			agentId: params.storeAgentId ?? agentId,
			sessionEntry: entry,
			sessionId: entry.sessionId,
			sessionKey: key,
			storePath
		});
		if (params.includeDerivedTitles) derivedTitle ??= deriveSessionTitle(entry, fields.firstUserMessage, displayName);
		lastMessagePreview = params.includeLastMessage && fields.lastMessagePreview || void 0;
	}
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
		allowAsyncLoad: false
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
			derivedTitle,
			lastMessagePreview,
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
				agentHarnessId: thinkingProjection.agentRuntime.id,
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
	if (params.active ?? (liveModel !== void 0 || params.entry?.status === "running")) return liveModel ?? void 0;
	if (!params.entry?.fallbackNotice) return;
	const { selectedModel } = params;
	const fallbackEntry = params.activeModel === void 0 ? readSessionFallbackModel({
		selectedProvider: selectedModel.provider,
		selectedModel: selectedModel.model,
		sessionEntry: params.entry,
		config: params.cfg,
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
/** Opaque cache-busting revision for the channel-avatar route; never leaks the reference. */
function channelAvatarRevision(reference) {
	return createHash("sha256").update(reference).digest("base64url").slice(0, 12);
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
/** Child presentation needs live ownership and sharing facts, never the child's stored payload. */
function projectSessionRowChildLinks(links) {
	return links?.map(({ key, entry }) => ({
		key,
		entry: {
			sessionId: entry.sessionId,
			updatedAt: entry.updatedAt,
			status: entry.status,
			startedAt: entry.startedAt,
			endedAt: entry.endedAt,
			spawnedBy: entry.spawnedBy,
			parentSessionKey: entry.parentSessionKey,
			createdActor: entry.createdActor,
			visibility: entry.visibility,
			incognito: entry.incognito
		}
	}));
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
	return {
		row: {
			key,
			...input.includeSwarmSummary ? { swarm: input.swarm } : {},
			visibility: entry ? entry.visibility ?? "shared" : void 0,
			incognito: entry?.incognito,
			spawnedBy: void 0,
			controlOwnerSessionKey: void 0,
			swarmGroupId: entry?.swarmGroupId,
			spawnedWorkspaceDir: entry?.spawnedWorkspaceDir,
			spawnedCwd: entry?.spawnedCwd,
			workspaceDir: entry?.spawnedCwd ?? entry?.spawnedWorkspaceDir,
			projectId: entry?.projectId,
			permissionMode: entry?.permissionMode,
			sandboxMode: entry?.sandboxMode,
			nativeRuntimeConsent: entry?.nativeRuntimeConsent,
			permissionModePending: input.permissionModePending,
			...entry?.permissionMode !== void 0 && entry.sessionRoot !== void 0 ? { sessionRoot: entry.sessionRoot } : {},
			worktree: entry?.worktree,
			repositoryWorkspaceId: entry?.repositoryWorkspaceId,
			...input.repository ? { repository: input.repository } : {},
			execNode: entry?.execNode,
			execCwd: entry?.execCwd,
			forkedFromParent: sessionEntryForkedFromParent(entry) ? true : void 0,
			spawnDepth: entry?.spawnDepth,
			subagentRole: entry?.subagentRole,
			subagentControlScope: entry?.subagentControlScope,
			createdVia: entry?.createdVia,
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
			conversationLink: entry?.conversationLink,
			chatType: entry?.chatType,
			origin: storedOrigin ? (({ avatar: _avatar, ...safeOrigin }) => safeOrigin)(storedOrigin) : void 0,
			updatedAt: entry?.updatedAt ?? null,
			archived: entry?.archivedAt !== void 0,
			archivedAt: entry?.archivedAt,
			archiveReason: entry?.archiveReason,
			pinned: pinnedAt !== void 0,
			pinnedAt,
			snoozedUntil: pinnable ? entry?.snoozedUntil : void 0,
			snoozedAt: pinnable ? entry?.snoozedAt : void 0,
			unread: deriveSessionUnread(entry),
			lastReadAt: entry?.lastReadAt,
			markedUnreadAt: entry?.markedUnreadAt,
			agentStatus: void 0,
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
			totalTokens: void 0,
			totalTokensFresh: void 0,
			goal: void 0,
			estimatedCostUsd: void 0,
			status: void 0,
			subagentRunState: void 0,
			hasActiveSubagentRun: void 0,
			startedAt: void 0,
			endedAt: void 0,
			runtimeMs: void 0,
			lastRunError: void 0,
			providerReview: projectSessionProviderReview(entry, key),
			lastRunId: entry?.lastRunId,
			hasAutomation: input.hasAutomation,
			parentSessionKey: entry?.parentSessionKey,
			parentSessionId: entry?.parentSessionId,
			childSessions: void 0,
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
			activeModelProvider: void 0,
			activeModel: void 0,
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
		},
		source: {
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
			freshSessionTotalTokens: input.freshSessionTotalTokens,
			usageByFallbackModel: input.usageByFallbackModel,
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
	const children = source.childLinks?.flatMap(({ key, entry: childEntry }) => {
		if (options.excludedChildKeys?.has(key)) return [];
		const childActive = projectGatewaySessionRunState({
			key,
			entry: childEntry,
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
/** Sharing fences every publication; selection holds only unchanged metadata. */
function createSessionRowProjectionRevisions() {
	let sharing;
	let selection;
	const selectionListeners = /* @__PURE__ */ new Set();
	const invalidate = (metadataChanged = false) => {
		sharing = void 0;
		if (metadataChanged) selection = void 0;
	};
	const publishSelection = (row, removed = false) => {
		if (!row) invalidate(true);
		const change = row ? {
			kind: "row",
			id: identity(row),
			key: row.key,
			agentId: row.agentId,
			row: removed ? void 0 : selectionRow(row)
		} : { kind: "reset" };
		notifyListeners(selectionListeners, change, () => notifyListeners(selectionListeners, { kind: "reset" }));
	};
	return {
		onSelectionChange(listener) {
			selectionListeners.add(listener);
		},
		publishSelection,
		dispose() {
			publishSelection();
			selectionListeners.clear();
		},
		sharing: () => sharing ??= {},
		selection: () => selection ??= {},
		invalidate,
		materialized(row, previousBoard) {
			const changed = row.hasBoard !== previousBoard;
			invalidate(changed);
			if (changed && !isIncognitoSessionKey(row.key)) publishSelection(row);
		},
		replace(previous, row) {
			const changed = !previous || previous.generation !== row.generation || previous.hasBoard !== row.hasBoard || !isDeepStrictEqual(previous.entry, row.entry);
			invalidate(changed);
			if (changed) publishSelection(row);
		}
	};
}
const identity = (row) => `${row.agentId}\0${row.storeTarget.storePath}\0${row.key}`;
const physical = (storePath, key) => `physical:${storePath}\0${key}`;
const logical = (agentId, key) => `logical:${agentId}\0${key}`;
function dependents(row, byParent) {
	const children = new Set(byParent.get(logical(row.agentId, row.key)));
	const physicalChildren = byParent.get(physical(row.storeTarget.storePath, row.key));
	if (physicalChildren) for (const id of physicalChildren) children.add(id);
	return children;
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
/** Mark resident logical owners without changing stored entries, relatives, or backfill. */
function markAutomation(rows, agentId, dirty) {
	for (const row of rows) if (!agentId || row.agentId === agentId) {
		invalidateDatabaseFacts(row);
		dirty.add(identity(row));
	}
}
/** Expire both accepted facts and worker replies still waiting to enter this row. */
function invalidateDatabaseFacts(row) {
	row.databaseFactsRevision++;
	row.pendingDatabaseFacts = void 0;
	row.retainedDatabaseFacts = void 0;
	row.preparedAcpMeta = void 0;
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
/** Native acquisition and prepared worker facts share one transient row constructor. */
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
			entries: {
				...params.prepared.relatedEntries,
				[key]: storedEntry
			},
			databaseFacts: params.prepared.databaseFacts
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
		pendingDatabaseFacts: void 0,
		retainedDatabaseFacts: void 0,
		preparedAcpMeta: void 0,
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
	for (const sourcePath of storePaths) for (const row of candidates) if (row.storeTarget.storePath === sourcePath) return row;
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
	const active = options.active ?? (live !== void 0 || record.entry.status === "running");
	const row = presentSessionRow(record.materialized, {
		now,
		subagentRuns: options.subagentRuns ?? context.subagentRuns.atTime(now),
		projectedAgentRuns: context.projectedAgentRuns,
		projectedSubagentActivity: context.projectedSubagentActivity,
		activeModel: active ? live ?? void 0 : record.fallbackModel,
		excludedChildKeys: options.excludedChildKeys
	});
	Object.assign(row, options.preparedFacts ?? record.facts?.present());
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
	const runs = context.subagentRunsByChildSessionKey.get(row.key);
	if (runs) for (const run of runs) addParent(run.controllerSessionKey || run.requesterSessionKey);
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
	const { entry, parents } = lineage;
	const changed = !isDeepStrictEqual(row.parents, parents) || !Object.is(storedEntry.updatedAt, row.storedEntry?.updatedAt) || !isDeepStrictEqual(storedEntry, row.storedEntry) || !isDeepStrictEqual(entry, row.entry);
	const includeChildren = changesSessionRowDependents(row.storedEntry, storedEntry) || changesSessionRowDependents(row.entry, entry);
	if (changed) params.markRelated(row, includeChildren);
	const generation = !row.entry || row.entry.sessionId === entry.sessionId && row.entry.lifecycleRevision === entry.lifecycleRevision ? row.generation : Symbol("row");
	let next = {
		...row,
		storedEntry,
		pendingDatabaseFacts: void 0,
		retainedDatabaseFacts: void 0,
		databaseFactsRevision: row.databaseFactsRevision + 1,
		...lineage,
		sharingEntry: storedEntry,
		generation,
		fallbackModel: sameFallbackModelFacts(row.storedEntry, storedEntry) && sameFallbackModelFacts(row.entry, entry) ? row.fallbackModel : void 0,
		...generation !== row.generation ? {
			lastMessagePreview: void 0,
			fallbackModel: void 0,
			materialized: void 0,
			preparedAcpMeta: void 0
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
async function withPreparedSessionRows(owner, isActive, queries, consume, privateRepositories) {
	if (!isActive()) throw new Error("Session row read view is no longer active");
	return withCanonicalSessionValidationDeferral(() => {
		const state = owner.state;
		return consumePreparedSessionRows(owner, isActive, queries(state.cfg), consume, state, privateRepositories);
	});
}
/** Reenter the same synchronous consumer after canonical readiness finishes. */
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
	while (true) {
		signal?.throwIfAborted();
		const prepared = await owner.withPreparedExactRows(select, consumeCurrent, options);
		signal?.throwIfAborted();
		if (prepared.kind === "complete") return prepared.value;
		const { certifySessionCanonicalValidationPending } = await import("./session-canonical-validation-readiness-B2tXoRdP.mjs");
		signal?.throwIfAborted();
		await certifySessionCanonicalValidationPending(prepared.database);
	}
}
/** Private rows belong only to this synchronous consumer, never to the resident roster. */
function consumePreparedSessionRows(owner, isActive, queries, consume, initialState, privateRepositories) {
	let state = initialState;
	const privateRows = /* @__PURE__ */ new Map();
	const childSelections = /* @__PURE__ */ new Map();
	const privateKey = (query) => privateSessionRowReadKey(state.cfg, query);
	for (const query of queries) {
		const key = privateKey(query);
		if (key && !privateRows.has(key)) {
			const prepared = privateRepositories?.get(key);
			const row = prepared ? owner.describe(query, prepared.row, prepared.repository.current() ?? null) : owner.describe(query);
			if (prepared && (!isCurrentGeneration(prepared.row, row) || row?.entry?.repositoryWorkspaceId !== prepared.workspaceId)) throw new Error("Session repository binding changed while preparing its description");
			privateRows.set(key, row);
		}
	}
	for (const row of privateRows.values()) {
		for (const group of row?.materialized.row.swarm?.groups ?? []) for (const child of group.children ?? []) if (!childSelections.has(child.sessionKey)) childSelections.set(child.sessionKey, owner.selectEntries({ key: child.sessionKey }));
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
		return result;
	} finally {
		active = false;
		privateRows.clear();
		childSelections.clear();
	}
}
//#endregion
export { resolveCronJobBoundSessionKeys as $, seedSessionRowEntries as A, projectGatewaySessionRunState as B, physical as C, readSessionRowParents as D, readSessionRowLineage as E, materializeSessionRow as F, readSessionRowModelFacts as G, resolveGatewaySessionGoal as H, projectSessionRowChildLinks as I, claimSessionAutomationEpoch as J, beginSessionPermissionChange as K, readSessionRowInputs as L, snapshot as M, sort as N, ready as O, buildGatewaySessionRow as P, disableCronJobsBoundToSessions as Q, refreshSessionRowProfiles as R, parentReference as S, publishTranscriptFields as T, resolveGatewaySessionKind as U, resolveGatewaySessionDisplayName as V, buildSessionSwarmSummary as W, registerSessionAutomationSource as X, invalidateSessionAutomationIndex as Y, unregisterSessionAutomationSource as Z, invalidateDatabaseFacts as _, acquireSessionRowEntry as a, compareSessionEntryPairs as at, markAutomation as b, createIncognitoSessionRow as c, dependents as d, deriveSessionUnread as et, first as f, index as g, identity as h, withReadySessionRows as i, sessionAgentStatusExpiresAt as it, selectionRow as j, renewGeneration as k, createSessionRowProjectionRevisions as l, hasEntry as m, privateSessionRowReadKey as n, resolveActiveSessionAgentStatus as nt, changesSessionRowDependents as o, sortAndLimitSessionEntries as ot, firstReferenced as p, isSessionPermissionChangePending as q, withPreparedSessionRows as r, sanitizeSessionAgentStatusNote as rt, create as s, sessionActivityTimestamp as st, SessionRowFactsPending as t, isSessionAgentAttentionIconId as tt, dematerialize as u, isCurrentGeneration as v, present as w, markRelated as x, isPrivateSourceCurrent as y, projectGatewaySessionActiveRun as z };
