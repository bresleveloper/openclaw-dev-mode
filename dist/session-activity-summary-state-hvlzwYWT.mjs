import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { n as sessionChanges } from "./session-row-changes-BcJIdta8.mjs";
import { t as readSessionTranscriptWatermark } from "./session-accessor.sqlite-transcript-watermark-D3Is2Kik.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { a as resolveSessionStoreKey } from "./session-store-key-Ci099tm9.mjs";
import { a as resolveUtilityModelRefForAgent } from "./utility-model-T3nTQ8n8.mjs";
import { t as readSessionActivitySummary } from "./activity-summary-CfqWjwl5.mjs";
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
	const fresh = summary && summary.formatRevision === 3 && summary.coveredMessages === summary.totalMessages && watermark?.generation === summary.generation && watermark.maxSeq === summary.maxSeq;
	return {
		...summary?.text ? {
			text: summary.text,
			updatedAt: summary.updatedAt
		} : {},
		state: !enabled ? "unavailable" : validRuntime?.state === "updating" || validRuntime?.state === "unavailable" ? validRuntime.state : fresh ? "current" : "stale"
	};
}
//#endregion
export { setSessionActivitySummaryState as i, projectSessionActivitySummary as n, sessionActivitySummaryOwnerIsCurrent as r, activitySummaryScope as t };
