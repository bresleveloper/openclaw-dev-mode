import { l as asNonNegativeFiniteNumber, u as asPositiveFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CUi_tcgF.mjs";
import { A as parseAgentSessionKey, E as parseThreadSessionSuffix, O as normalizeSessionKeyPreservingOpaquePeerIds, S as isSubagentSessionKey, T as parseSessionDeliveryRoute, x as isCronSessionKey, y as isAcpSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import "./defaults-BbU4k6fu.mjs";
import { t as sessionChanges } from "./session-row-changes-xuu0eHng.mjs";
import { A as resolveSessionModelOverrideSource } from "./agent-scope-CTuYDtny.mjs";
import { d as resolveEffectiveResponseUsage } from "./thinking.shared-BKzBCWpI.mjs";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-Cd7Eq8Zi.mjs";
import { l as projectSessionDeliveryFields } from "./delivery-context.shared-CW8dxG7X.mjs";
import { t as normalizeControlUiBasePath } from "./control-ui-shared-DqFhbHR8.mjs";
import "./session-participant-Cj8YyLga.mjs";
import { t as SESSION_AGENT_ATTENTION_ICON_IDS } from "./session-agent-status-BSzRJm_2.mjs";
import { C as resolveProjectedAgentRunModel, t as buildProjectedAgentRunIndex } from "./agent-run-registry-DO6Dg2r0.mjs";
import { l as getAgentEventLifecycleGeneration, u as isAgentEventLifecycleGenerationCurrent } from "./agent-events-BOSJcayE.mjs";
import { r as resolveAgentMainSessionKey } from "./main-session-De-bcoks.mjs";
import "./thinking-B1p5pEC8.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-IBx2zWDG.mjs";
import { s as resolveCronSessionTargetSessionKey } from "./session-target-DJsUULzX.mjs";
import { o as readBoardSessionKeys } from "./sqlite-board-store.kernel--WWNhhyI.mjs";
import { m as withCanonicalSessionValidationDeferral } from "./session-canonical-key-BBylVEaq.mjs";
import { o as sessionCreatorProfileId, t as MAX_SESSION_PARTICIPANTS } from "./session-entry-provenance-C-JyMH54.mjs";
import { Z as getSessionRepositoryWorkspaceStore } from "./session-accessor.sqlite-entry-store-BUBLa7UE.mjs";
import { g as isPinnableSessionEntry } from "./store-maintenance-C5xEVYop.mjs";
import { o as resolveFreshSessionTotalTokens } from "./types-ByCc34Vn.mjs";
import { D as sessionEntryForkedFromParent } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import { l as readSessionTranscriptWatermark } from "./session-accessor-C05KQ5A3.mjs";
import { a as resolveStoredSessionKeyForAgentStore, i as resolveSessionStoreKey } from "./session-store-key-BoleEY7N.mjs";
import { v as buildSubagentRunReadIndexFromRuns } from "./subagent-registry-read-C2SIiLpb.mjs";
import { n as renderUserFacingText } from "./user-facing-text-D8c_iKUB.mjs";
import "./sessions-Cesa3L0p.mjs";
import { m as canContinueSessionProviderReview } from "./lifecycle-CQXOIBZ7.mjs";
import { r as resolveSessionParentSessionKey } from "./session-conversation-Bpasei-d.mjs";
import { n as resolveProjectedSessionContextTokens, t as resolveProjectedSessionContextBudgetStatus } from "./context-token-provenance-CO52ZGCb.mjs";
import { a as projectPluginSessionExtensionsSync } from "./host-hook-state-C4UiW1p8.mjs";
import { n as isFailedWorkerPlacementEnvironmentGone } from "./session-placement-lifecycle-DAKgxrlj.mjs";
import { i as projectGatewaySessionEntry } from "./combined-store-gateway-Bb3P3TzM.mjs";
import { a as resolveEstimatedSessionCostUsd, i as prepareSessionTitleRead, n as deriveSessionTitle, o as resolvePositiveNumber, s as resolveSessionChildOwners, t as buildStoreChildSessionLinksWork } from "./session-utils-core-CPCyMcSJ.mjs";
import { i as resolveUtilityModelRefForAgent } from "./utility-model-Bk8FTgwT.mjs";
import { t as buildControlUiChannelAvatarUrl } from "./control-ui-resource-routes-DVy_LnYu.mjs";
import "./control-ui-contract-Dup6xL62.mjs";
import { o as resolveModelContextTokenProjection } from "./context-na2bB1IO.mjs";
import { t as resolveModelContextWindowProfile } from "./model-context-window-CoR3Uyg1.mjs";
import { s as resolveSessionSelectedModelRef, t as projectWorkerPlacementAgentRuntime } from "./placement-session-runtime-PDZExznz.mjs";
import { a as resolveTranscriptUsageFallbacks, n as buildSessionListRowMetadataContext } from "./session-utils-projection-DROAVGV8.mjs";
import { a as resolveGatewaySessionThinkingProjectionInternal, o as resolveSessionDisplayModelIdentityRefCached } from "./session-utils-model-CUQjuht1.mjs";
import { a as parseGroupKey } from "./session-utils-store-DqGvpsY3.mjs";
import { t as resolveFastModeState } from "./fast-mode-D3LS63Ki.mjs";
import { n as resolveSelectedAndActiveModel, t as readSessionFallbackModel } from "./session-fallback-model-D-bv1sOC.mjs";
import { t as resolveQueueSettingsCore } from "./settings-DtJ6NdCU.mjs";
import { n as sortAndLimitByWork, r as runSynchronousWork } from "./sort-and-limit-NdojqZsZ.mjs";
import { t as resolveActiveFallbackState } from "./fallback-notice-state-RaMg3ufK.mjs";
import { t as resolveCronAgentSessionKey } from "./session-key-Cl5l5Sfo.mjs";
import { a as projectSessionOwner, i as projectSessionActor, s as projectSessionParticipants } from "./session-identity-projection-C0mYume0.mjs";
import { n as readPreparedGatewayModelCatalogMetadata } from "./server-model-catalog-view-muuNaRwE.mjs";
import { t as readSessionTitleFieldsFromTranscript } from "./session-transcript-title-reader-CmL82Ily.mjs";
import { a as resolveGatewaySessionKind, i as resolveGatewaySessionGoal, n as projectGatewaySessionRunState, r as resolveGatewaySessionDisplayName } from "./session-utils-display-C9DkcmRI.mjs";
import { t as readSessionActivitySummary } from "./activity-summary-CfqWjwl5.mjs";
import "./device-provider-identity-v6nXqNq_.mjs";
import { t as readSessionListSelectionFacts } from "./session-list-target-BT5Ax3-V.mjs";
import { isDeepStrictEqual } from "node:util";
import { createHash } from "node:crypto";
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
	const agentId = normalizeAgentId(job.agentId ?? opts.defaultAgentId);
	const keys = /* @__PURE__ */ new Set();
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
function classifyRest(rest) {
	const normalized = normalizeLowercaseStringOrEmpty(rest);
	if (normalized.startsWith("dashboard:")) return "dashboard";
	if (normalized.startsWith("tui-")) return "tui";
	if (normalized.startsWith("explicit:")) return "explicit";
	if (normalized.startsWith("hook:")) return "hook";
	if (normalized.startsWith("node-") || normalized.startsWith("node:")) return "node";
	if (normalized.startsWith("harness:")) return "harness";
	if (normalized.startsWith("voice:")) return "voice";
	if (normalized.startsWith("dreaming-narrative-")) return "dreaming";
	if (normalized === "boot" || normalized.startsWith("boot:") || normalized.startsWith("internal-session-effects:")) return "system";
	return "custom";
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
	else if (entry?.chatType === "direct" || entry?.chatType === "group" || entry?.chatType === "channel") classification = entry.chatType;
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
		sessionKey: resolveStoredSessionKeyForAgentStore({
			cfg,
			agentId,
			sessionKey: key
		}),
		entry: params.entry,
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
		maxTranscriptBytes: params.transcriptUsageMaxBytes,
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
	const resolvedModelContextTokens = resolvePositiveNumber(modelContext.contextTokens);
	const pluginExtensions = !lightweight && entry ? projectPluginSessionExtensionsSync({
		sessionKey: key,
		entry
	}) : [];
	const repositoryWorkspace = entry?.repositoryWorkspaceId ? getSessionRepositoryWorkspaceStore().get(entry.repositoryWorkspaceId) : void 0;
	return {
		inputs: {
			cfg,
			key,
			entry,
			lightweight,
			swarm: buildSessionSwarmSummary(params.rowContext?.subagentRuns.swarmRunsByRequesterSessionKey.get(key) ?? [], key, agentId, { includeChildren: params.includeSwarmChildren }),
			permissionModePending: isSessionPermissionChangePending(entry?.sessionId),
			repository: repositoryWorkspace?.agentId === agentId && repositoryWorkspace.sessionKey === key ? {
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
				authoredContextTokens: resolvePositiveNumber(modelContext.authoredContextTokens)
			}),
			pluginExtensions,
			includeSwarmSummary: params.rowContext !== void 0,
			childLinks: (params.storeChildSessionLinksByKey ?? runSynchronousWork(buildStoreChildSessionLinksWork({
				store,
				keys: [key],
				subagentRunsByChildSessionKey: rowContext.subagentRunsByChildSessionKey
			}))).get(key),
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
	if (!params.agentId) return;
	const liveModel = resolveProjectedAgentRunModel({
		agentId: params.agentId,
		sessionId: params.sessionId,
		index: params.projectedAgentRuns
	});
	if (params.active ?? (liveModel !== void 0 || params.entry?.status === "running")) return liveModel ?? void 0;
	if (!params.entry?.fallbackNotice || params.storePath === void 0) return;
	const selectedModel = params.selectedModel ?? (params.modelSource ? resolveSessionSelectedModelRef({
		cfg: params.cfg,
		source: params.modelSource,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	}) : void 0);
	if (!selectedModel) return;
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
function materializeSessionRow(input) {
	const { cfg, key, entry } = input;
	const observerDigest = entry?.observerDigest && (entry.startedAt === void 0 || entry.observerDigest.updatedAt > entry.startedAt) ? entry.observerDigest : void 0;
	const deliveryFields = projectSessionDeliveryFields(entry?.delivery);
	const channel = deliveryFields.channel ?? parseGroupKey(key)?.channel;
	const storedOrigin = deliveryFields.origin;
	const avatar = normalizeOptionalString(storedOrigin?.avatar);
	const controlUiBasePath = normalizeControlUiBasePath(cfg.gateway?.controlUi?.basePath);
	const pinnedAt = entry?.pinnedAt !== void 0 && isPinnableSessionEntry(key, entry) ? entry.pinnedAt : void 0;
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
			chatType: entry?.chatType,
			origin: storedOrigin ? (({ avatar: _avatar, ...safeOrigin }) => safeOrigin)(storedOrigin) : void 0,
			updatedAt: entry?.updatedAt ?? null,
			archived: entry?.archivedAt !== void 0,
			archivedAt: entry?.archivedAt,
			archiveReason: entry?.archiveReason,
			pinned: pinnedAt !== void 0,
			pinnedAt,
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
			lastRunError: entry?.lastRunError,
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
		source: input
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
	const aTimestamp = sortBy === "activity" ? sessionActivityTimestamp(a[1]) : sortBy === "lastInteractionAt" ? a[1]?.lastInteractionAt : a[1]?.updatedAt;
	const byTimestamp = ((sortBy === "activity" ? sessionActivityTimestamp(b[1]) : sortBy === "lastInteractionAt" ? b[1]?.lastInteractionAt : b[1]?.updatedAt) ?? 0) - (aTimestamp ?? 0);
	if (byTimestamp !== 0) return byTimestamp;
	return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0;
}
function* sortAndLimitSessionEntries(entries, limit, sortBy, shouldYield) {
	return yield* sortAndLimitByWork(entries, limit, (a, b) => compareSessionEntryPairs(a, b, sortBy), shouldYield);
}
//#endregion
//#region src/gateway/session-activity-summary-state.ts
const pending = /* @__PURE__ */ new Map();
const activitySummaryScope = (target) => `${target.agentId}\0${target.key}`;
const sessionActivitySummaryOwnerIsCurrent = (target, owner) => pending.get(activitySummaryScope(target))?.owner === owner;
function setSessionActivitySummaryState(target, owner, value, force = false) {
	const key = activitySummaryScope(target);
	const existing = pending.get(key);
	if (value) {
		if (!force && existing?.owner === owner && existing.sessionId === value.sessionId && existing.storePath === value.storePath && existing.lifecycleRevision === value.lifecycleRevision && existing.state === value.state) return false;
		pending.set(key, {
			...value,
			owner
		});
	} else if (existing?.owner === owner) pending.delete(key);
	else return false;
	sessionChanges.emit({
		sessionKey: target.key,
		agentId: target.agentId
	});
	return true;
}
/** Activity lists supply batched watermarks; explicit ensure reads one exact target. */
function projectSessionActivitySummary(params) {
	const { entry } = params;
	if (!entry) return;
	if (!entry.sessionId || entry.initializationPending) return { state: "unavailable" };
	const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId: params.agentId });
	const summary = readSessionActivitySummary(entry);
	const canonicalKey = resolveSessionStoreKey({
		cfg: params.cfg,
		sessionKey: params.key,
		storeAgentId: params.agentId
	});
	const runtime = pending.get(activitySummaryScope({
		key: canonicalKey,
		agentId: params.agentId
	}));
	const validRuntime = runtime && runtime.storePath === storePath && runtime.sessionId === entry.sessionId && runtime.lifecycleRevision === entry.lifecycleRevision ? runtime : void 0;
	const enabled = params.enabled ?? Boolean(resolveUtilityModelRefForAgent({
		cfg: params.cfg,
		agentId: params.agentId
	}));
	const watermark = summary ? params.watermark ?? readSessionTranscriptWatermark({
		agentId: params.storeTarget?.agentId ?? params.agentId,
		sessionId: entry.sessionId,
		sessionKey: params.key,
		storePath: params.storeTarget?.storePath ?? storePath
	}) : void 0;
	const fresh = summary && summary.formatRevision === 2 && summary.coveredMessages === summary.totalMessages && watermark?.generation === summary.generation && watermark.maxSeq === summary.maxSeq;
	return {
		...summary?.text ? {
			text: summary.text,
			updatedAt: summary.updatedAt
		} : {},
		state: !enabled ? "unavailable" : validRuntime?.state === "updating" || validRuntime?.state === "unavailable" ? validRuntime.state : fresh ? "current" : "stale"
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-projector.ts
function readWorkerPlacementIdentity(record, environments, preparedEnvironment) {
	const environment = preparedEnvironment === void 0 ? record.environmentId ? environments?.get(record.environmentId) : void 0 : preparedEnvironment;
	if (!environment) return;
	if (!(record.activeOwnerEpoch !== null ? environment.ownerEpoch === record.activeOwnerEpoch : record.state === "provisioning" || record.state === "syncing" || record.state === "starting")) return;
	const machine = environments?.readMachineShape(environment.environmentId, preparedEnvironment ?? void 0);
	return {
		providerId: environment.providerId,
		profileId: environment.profileId,
		...machine && Object.keys(machine).length ? { machine } : {}
	};
}
function createWorkerPlacementRunnerAvailabilityReader(params) {
	let version = 0;
	const read = (record, preparedEnvironment) => {
		if (record.state !== "active") return;
		const environment = preparedEnvironment === void 0 ? params.environments.get(record.environmentId) : preparedEnvironment;
		if (environment?.providerId !== "device" || environment.state !== "attached" || environment.ownerEpoch !== record.activeOwnerEpoch || environment.attachedSessionIds.length !== 1 || environment.attachedSessionIds[0] !== record.sessionId || !environment.nodeDeviceId) return;
		return {
			kind: "device",
			deviceId: environment.nodeDeviceId,
			status: params.hasCurrentDeviceRunner(environment.nodeDeviceId) ? "available" : "offline"
		};
	};
	return {
		read,
		markChanged: () => {
			version += 1;
		},
		version: () => version
	};
}
function projectWorkerPlacementMove(intent) {
	return {
		target: intent.target,
		updatedAtMs: intent.updatedAtMs,
		...intent.lastError ? { error: intent.lastError } : {}
	};
}
/** Removes gateway-only identity and turn-claim fields from the operator projection. */
function projectWorkerSessionPlacement(record, diskSpace, runner, identity, failedRecoveryAction, workspaceResultReconciling = false) {
	const timing = {
		generation: record.generation,
		createdAtMs: record.createdAtMs,
		updatedAtMs: record.updatedAtMs,
		stateChangedAtMs: record.stateChangedAtMs
	};
	const conflict = record.workspaceResultConflict ? { workspaceResultConflict: record.workspaceResultConflict } : {};
	const terminal = {
		...record.terminalReason ? { terminalReason: record.terminalReason } : {},
		...record.terminalAtMs !== null ? { terminalAtMs: record.terminalAtMs } : {}
	};
	switch (record.state) {
		case "local": return {
			state: "local",
			...timing
		};
		case "requested": return {
			state: "requested",
			...timing
		};
		case "provisioning": return {
			state: "provisioning",
			...timing,
			...identity,
			...record.environmentId ? { environmentId: record.environmentId } : {}
		};
		case "syncing": return {
			state: "syncing",
			...timing,
			...identity,
			environmentId: record.environmentId,
			workerBundleHash: record.workerBundleHash
		};
		case "starting": return {
			state: "starting",
			...timing,
			...identity,
			environmentId: record.environmentId,
			workerBundleHash: record.workerBundleHash,
			workspaceBaseManifestRef: record.workspaceBaseManifestRef,
			remoteWorkspaceDir: record.remoteWorkspaceDir
		};
		case "active":
		case "draining":
		case "reconciling": return {
			state: record.state,
			...timing,
			...identity,
			environmentId: record.environmentId,
			activeOwnerEpoch: record.activeOwnerEpoch,
			workerBundleHash: record.workerBundleHash,
			workspaceBaseManifestRef: record.workspaceBaseManifestRef,
			remoteWorkspaceDir: record.remoteWorkspaceDir,
			...record.lastTranscriptAckCursor !== null ? { lastTranscriptAckCursor: record.lastTranscriptAckCursor } : {},
			...record.lastLiveEventAckCursor !== null ? { lastLiveEventAckCursor: record.lastLiveEventAckCursor } : {},
			...record.state === "active" && diskSpace ? { diskSpace } : {},
			...record.state === "active" && runner ? { runner } : {},
			...workspaceResultReconciling && record.state !== "reconciling" ? { workspaceResultReconciling: true } : {},
			...conflict
		};
		case "reclaimed":
		case "failed": {
			const retained = {
				...timing,
				...identity,
				...record.environmentId ? { environmentId: record.environmentId } : {},
				...record.activeOwnerEpoch !== null ? { activeOwnerEpoch: record.activeOwnerEpoch } : {},
				...record.workspaceBaseManifestRef ? { workspaceBaseManifestRef: record.workspaceBaseManifestRef } : {},
				...record.remoteWorkspaceDir ? { remoteWorkspaceDir: record.remoteWorkspaceDir } : {},
				...record.workerBundleHash ? { workerBundleHash: record.workerBundleHash } : {},
				...record.lastTranscriptAckCursor !== null ? { lastTranscriptAckCursor: record.lastTranscriptAckCursor } : {},
				...record.lastLiveEventAckCursor !== null ? { lastLiveEventAckCursor: record.lastLiveEventAckCursor } : {},
				...conflict
			};
			return record.state === "failed" ? {
				state: "failed",
				...retained,
				recoveryError: record.recoveryError,
				...failedRecoveryAction ? { recoveryAction: failedRecoveryAction } : {},
				...terminal
			} : {
				state: "reclaimed",
				...retained,
				...terminal
			};
		}
	}
	return record;
}
//#endregion
//#region src/gateway/server-methods/session-placement-read-projection.ts
/** Acquire row facts once; selected rows refresh placement facts after owner publications. */
function readSessionRowFacts(params) {
	const { cfg, entry, placementFactsReader } = params;
	const { key, agentId, storeTarget } = params.target;
	const context = params.context ?? {};
	let placementSource = placementFactsReader?.getProjectionFacts(entry.sessionId);
	const readPlacementFacts = () => {
		const { placement, move, environment, workspaceResultReconciling = false } = placementSource ?? {};
		return {
			placement,
			move,
			workspaceResultReconciling,
			environment,
			identity: placement ? readWorkerPlacementIdentity(placement, context.workerEnvironmentService, environment ?? null) : void 0,
			failedRecoveryAction: placement?.state === "failed" ? isFailedWorkerPlacementEnvironmentGone({
				environmentService: context.workerEnvironmentService ? { get: () => environment } : void 0,
				placement
			}) ? "restart" : "stop-first" : void 0
		};
	};
	let placementFacts = readPlacementFacts();
	const activitySummary = projectSessionActivitySummary({
		key,
		agentId,
		storeTarget,
		cfg,
		entry,
		enabled: params.activitySummaryEnabled,
		watermark: params.databaseFacts?.activitySummaryWatermark
	});
	return {
		hasBoard: params.databaseFacts?.hasBoard ?? readSessionRowHasBoard({
			key,
			storeTarget
		}),
		present: () => {
			const currentSource = placementFactsReader?.getProjectionFacts(entry.sessionId);
			if (currentSource !== placementSource) {
				placementSource = currentSource;
				placementFacts = readPlacementFacts();
			}
			const { placement, move, workspaceResultReconciling, environment, identity, failedRecoveryAction } = placementFacts;
			return {
				...placement ? { placement: projectWorkerSessionPlacement(placement, context.workerPlacementDiskSpaceReader?.read(placement), context.workerPlacementRunnerAvailabilityReader?.read(placement, environment ?? null), identity, failedRecoveryAction, workspaceResultReconciling) } : {},
				...move ? { placementMove: projectWorkerPlacementMove(move) } : {},
				permissionModePending: isSessionPermissionChangePending(entry.sessionId),
				activitySummary: activitySummary ? { ...activitySummary } : void 0
			};
		}
	};
}
/** Selection can check board membership without materializing placement or display fields. */
function readSessionRowHasBoard(target) {
	const { key, storeTarget } = target;
	const board = withOpenClawAgentDatabaseReadOnly((database) => readBoardSessionKeys(database, key).length > 0, {
		agentId: storeTarget.agentId,
		path: storeTarget.storePath
	});
	return board.found && board.value;
}
//#endregion
//#region src/gateway/session-row-projection-record.ts
const identity = (row) => `${row.agentId}\0${row.storeTarget.storePath}\0${row.key}`;
const physical = (storePath, key) => `physical:${storePath}\0${key}`;
const logical = (agentId, key) => `logical:${agentId}\0${key}`;
function dependents(row, byParent) {
	const children = new Set(byParent.get(logical(row.agentId, row.key)));
	const physicalChildren = byParent.get(physical(row.storeTarget.storePath, row.key));
	if (physicalChildren) for (const id of physicalChildren) children.add(id);
	return children;
}
function markRelated(row, indexes, dirty, includeChildren = true) {
	if (includeChildren) for (const id of dependents(row, indexes.byParent)) dirty.add(id);
	for (const parent of row.parents) for (const id of indexes.byKey.get(parent) ?? []) dirty.add(id);
}
/** Children consume parent model overrides, not its changing progress or display metadata. */
function changesSessionRowDependents(before, after) {
	return !before || !after || before.sessionId !== after.sessionId || before.lifecycleRevision !== after.lifecycleRevision || before.providerOverride !== after.providerOverride || before.modelOverride !== after.modelOverride || before.modelOverrideSource !== after.modelOverrideSource || before.modelOverrideRouteResolution !== after.modelOverrideRouteResolution || before.modelOverrideFallbackOriginProvider !== after.modelOverrideFallbackOriginProvider || before.modelOverrideFallbackOriginModel !== after.modelOverrideFallbackOriginModel;
}
/** Mark resident logical owners without changing stored entries, relatives, or backfill. */
function markAutomation(rows, agentId, dirty) {
	for (const row of rows) if (!agentId || row.agentId === agentId) dirty.add(identity(row));
}
function create(target, entry) {
	return {
		...target,
		storedEntry: entry,
		sharingEntry: entry,
		selection: readSessionListSelectionFacts(target.key, entry),
		parents: /* @__PURE__ */ new Set(),
		membership: /* @__PURE__ */ new Set(),
		generation: Symbol("row")
	};
}
function renewGeneration(row) {
	return {
		...row,
		entry: void 0,
		storedEntry: void 0,
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
	return Boolean(row?.entry && row.materialized);
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
	Object.assign(row, record.facts?.present());
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
function changesRowStructure(row, entry) {
	const previous = row.storedEntry;
	return !previous || !entry || previous.sessionId !== entry.sessionId || previous.lifecycleRevision !== entry.lifecycleRevision || previous.parentSessionKey !== entry.parentSessionKey || previous.spawnedBy !== entry.spawnedBy || previous.incognito !== entry.incognito || previous.archivedAt !== entry.archivedAt;
}
function isCurrentGeneration(row, current) {
	return current?.generation === row.generation && (!isIncognitoSessionKey(row.key) || current.entry?.sessionId === row.entry?.sessionId && current.entry?.lifecycleRevision === row.entry?.lifecycleRevision);
}
function parentReference(cfg, key, fallbackAgentId, sourcePath) {
	if (sourcePath && (key === "global" || key === "unknown")) return physical(sourcePath, key);
	const agentId = parseAgentSessionKey(key)?.agentId ?? fallbackAgentId;
	return logical(agentId, resolveStoredSessionKeyForAgentStore({
		cfg,
		agentId,
		sessionKey: key
	}));
}
/** Drop reader-only graphs while retaining cold metadata and index identity. */
function dematerialize(row) {
	return {
		...row,
		materialized: void 0,
		materializedSequence: void 0,
		facts: void 0,
		membership: /* @__PURE__ */ new Set(),
		lastMessagePreview: void 0,
		fallbackModel: void 0
	};
}
function readSessionRowParents(row, storedEntry, cfg, context) {
	const parents = /* @__PURE__ */ new Set();
	const addParent = (key) => {
		if (key && key !== row.key) parents.add(parentReference(cfg, key, row.agentId, row.storeTarget.storePath));
	};
	addParent(storedEntry.parentSessionKey ?? resolveSessionParentSessionKey(row.key));
	addParent(storedEntry.spawnedBy);
	const runs = context.subagentRunsByChildSessionKey.get(row.key);
	if (runs) for (const run of runs) addParent(run.controllerSessionKey || run.requesterSessionKey);
	return parents;
}
function sameParents(left, right) {
	if (left.size !== right.size) return false;
	for (const parent of left) if (!right.has(parent)) return false;
	return true;
}
function acquireSessionRowEntry(params) {
	const { row, storedEntry, cfg, context, remove, put, archive } = params;
	if (!storedEntry || storedEntry.incognito) {
		remove(identity(row));
		return;
	}
	const entry = projectGatewaySessionEntry(cfg, storedEntry);
	const parents = readSessionRowParents(row, storedEntry, cfg, context);
	const changed = !sameParents(row.parents, parents) || !Object.is(storedEntry.updatedAt, row.storedEntry?.updatedAt) || !isDeepStrictEqual(storedEntry, row.storedEntry);
	const includeChildren = changesSessionRowDependents(row.storedEntry, storedEntry);
	if (changed) params.markRelated(row, includeChildren);
	const generation = !row.entry || row.entry.sessionId === entry.sessionId && row.entry.lifecycleRevision === entry.lifecycleRevision ? row.generation : Symbol("row");
	let next = {
		...row,
		storedEntry,
		entry,
		sharingEntry: entry,
		selection: readSessionListSelectionFacts(row.key, entry),
		parents,
		generation,
		hasBoard: entry.archivedAt !== void 0 ? row.hasBoard ?? readSessionRowHasBoard(row) : row.hasBoard,
		fallbackModel: sameFallbackModelFacts(row.storedEntry, storedEntry) ? row.fallbackModel : void 0,
		...generation !== row.generation ? {
			lastMessagePreview: void 0,
			fallbackModel: void 0,
			materialized: void 0
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
async function withPreparedSessionRows(owner, isActive, queries, consume) {
	if (!isActive()) throw new Error("Session row read view is no longer active");
	return withCanonicalSessionValidationDeferral(() => {
		const state = owner.state;
		return consumePreparedSessionRows(owner, isActive, queries(state.cfg), consume, state);
	});
}
/** Reenter the same synchronous consumer after canonical readiness finishes. */
async function withReadySessionRows(owner, queries, consume, options) {
	while (true) {
		const prepared = await owner.withPreparedExactRows(queries, consume, options);
		if (prepared.kind === "complete") return prepared.value;
		const { certifySessionCanonicalValidationPending } = await import("./session-canonical-validation-readiness-DvYAlpmU.mjs");
		await certifySessionCanonicalValidationPending(prepared.database);
	}
}
/** Private rows belong only to this synchronous consumer, never to the resident roster. */
function consumePreparedSessionRows(owner, isActive, queries, consume, initialState) {
	let state = initialState;
	const privateRows = /* @__PURE__ */ new Map();
	const childSelections = /* @__PURE__ */ new Map();
	const privateKey = (query) => {
		const key = resolveStoredSessionKeyForAgentStore({
			cfg: state.cfg,
			agentId: query.agentId,
			sessionKey: query.key
		});
		return isIncognitoSessionKey(key) ? JSON.stringify([query.agentId, key]) : void 0;
	};
	for (const query of queries) {
		const key = privateKey(query);
		if (key && !privateRows.has(key)) privateRows.set(key, owner.describe(query));
	}
	for (const row of privateRows.values()) {
		for (const group of row?.materialized.row.swarm?.groups ?? []) for (const child of group.children ?? []) if (!childSelections.has(child.sessionKey)) childSelections.set(child.sessionKey, owner.selectEntries({ key: child.sessionKey }));
		if (row && !owner.isCurrent(row)) throw new Error("Session changed while preparing its description; retry the request");
	}
	const preparedState = owner.state;
	state = {
		cfg: preparedState.cfg,
		rowContext: preparedState.rowContext
	};
	let active = true;
	const assertActive = () => {
		if (!active || !isActive()) throw new Error("Session row read view is no longer active");
	};
	const read = {
		describe(query, captured) {
			assertActive();
			const key = privateKey(query);
			if (!key) return owner.describe(query, captured);
			if (!privateRows.has(key)) throw new Error("Incognito session description was not prepared");
			const row = privateRows.get(key);
			return captured && !isCurrentGeneration(captured, row) ? void 0 : row;
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
			return state;
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
export { sessionAgentStatusExpiresAt as $, readWorkerPlacementIdentity as A, refreshSessionRowProfiles as B, renewGeneration as C, readSessionRowFacts as D, sort as E, sortAndLimitSessionEntries as F, invalidateSessionAutomationIndex as G, readSessionRowModelFacts as H, sessionActivityTimestamp as I, disableCronJobsBoundToSessions as J, registerSessionAutomationSource as K, buildGatewaySessionRow as L, projectSessionActivitySummary as M, sessionActivitySummaryOwnerIsCurrent as N, createWorkerPlacementRunnerAvailabilityReader as O, setSessionActivitySummaryState as P, sanitizeSessionAgentStatusNote as Q, materializeSessionRow as R, ready as S, snapshot as T, beginSessionPermissionChange as U, buildSessionSwarmSummary as V, claimSessionAutomationEpoch as W, isSessionAgentAttentionIconId as X, resolveCronJobBoundSessionKeys as Y, resolveActiveSessionAgentStatus as Z, parentReference as _, changesSessionRowDependents as a, publishTranscriptFields as b, dependents as c, hasEntry as d, identity as f, markRelated as g, markAutomation as h, changesRowStructure as i, activitySummaryScope as j, projectWorkerSessionPlacement as k, first as l, isCurrentGeneration as m, withReadySessionRows as n, create as o, index as p, unregisterSessionAutomationSource as q, acquireSessionRowEntry as r, dematerialize as s, withPreparedSessionRows as t, firstReferenced as u, physical as v, sameParents as w, readSessionRowParents as x, present as y, readSessionRowInputs as z };
