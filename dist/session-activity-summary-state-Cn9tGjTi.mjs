import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { t as readSessionActivitySummary } from "./activity-summary-CfqWjwl5.mjs";
import { o as resolveSessionStoreKey } from "./session-store-key-DKpto8R6.mjs";
import { a as resolveUtilityModelRefForAgent } from "./utility-model-nsnbR10X.mjs";
import { n as readSessionTranscriptWatermarkAsync } from "./session-transcript-watermark-gXttdn2N.mjs";
//#region src/gateway/session-activity-summary-state.ts
function resolveActivitySummaryEventTarget(cfg, key, agentId) {
	const agentOwner = agentId ?? (key ? parseAgentSessionKey(key)?.agentId : void 0);
	return key && agentOwner ? {
		key: resolveSessionStoreKey({
			cfg,
			sessionKey: key,
			storeAgentId: agentOwner
		}),
		agentId: agentOwner
	} : void 0;
}
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
		agentId: target.agentId,
		scope: "runtime",
		facts: { kind: "unchanged" }
	});
	return true;
}
/** Presentation consumes the watermark prepared with the row; it never opens its transcript. */
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
	const watermark = params.watermark;
	const fresh = summary && summary.formatRevision === 3 && summary.coveredMessages === summary.totalMessages && watermark?.generation === summary.generation && watermark.maxSeq === summary.maxSeq;
	return {
		...summary?.text ? {
			text: summary.text,
			updatedAt: summary.updatedAt
		} : {},
		state: !enabled ? "unavailable" : validRuntime?.state === "updating" || validRuntime?.state === "unavailable" ? validRuntime.state : fresh ? "current" : "stale"
	};
}
async function prepareSessionActivitySummaryView(params) {
	const watermark = params.entry && readSessionActivitySummary(params.entry) ? await readSessionTranscriptWatermarkAsync({
		storePath: params.storePath,
		agentId: params.agentId,
		sessionKey: params.key,
		sessionId: params.entry.sessionId
	}) : void 0;
	const projected = projectSessionActivitySummary({
		...params,
		watermark
	});
	return !params.admitted && projected?.state !== "current" ? {
		...projected,
		state: "unavailable"
	} : projected ?? { state: "updating" };
}
//#endregion
export { sessionActivitySummaryOwnerIsCurrent as a, resolveActivitySummaryEventTarget as i, prepareSessionActivitySummaryView as n, setSessionActivitySummaryState as o, projectSessionActivitySummary as r, activitySummaryScope as t };
