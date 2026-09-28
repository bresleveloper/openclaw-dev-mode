import { l as asNonNegativeFiniteNumber, u as asPositiveFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as isTerminalSessionStatus } from "./types-ByCc34Vn.mjs";
import { s as shouldKeepSubagentRunChildLink } from "./subagent-run-liveness-9vTRtoqd.mjs";
import "./sessions-Cesa3L0p.mjs";
import { o as resolveModelCostConfig, t as estimateAggregateUsageCost } from "./usage-format-CisMpgmJ.mjs";
import { t as deriveGoalSessionTitle } from "./derive-goal-session-title-DILXsIfr.mjs";
//#region src/gateway/session-utils-contracts.ts
function createSessionRowModelCacheKey(provider, model) {
	return `${normalizeLowercaseStringOrEmpty(provider)}\0${normalizeOptionalString(model) ?? ""}`;
}
//#endregion
//#region src/gateway/session-utils-core.ts
function deriveSessionTitle(entry, firstUserMessage, externalDisplayName) {
	if (!entry) return;
	const label = normalizeOptionalString(entry.label);
	if (label) return label;
	const displayName = normalizeOptionalString(externalDisplayName) ?? normalizeOptionalString(entry.displayName);
	if (displayName) return displayName;
	const subject = normalizeOptionalString(entry.subject);
	if (subject) return subject;
	const goalTitle = deriveGoalSessionTitle(firstUserMessage);
	if (goalTitle) return goalTitle;
}
function prepareSessionTitleRead(entry, displayName, opts) {
	if (!entry?.sessionId || !(opts.includeDerivedTitles || opts.includeLastMessage)) return;
	const derivedTitle = opts.includeDerivedTitles ? deriveSessionTitle(entry, void 0, displayName) : void 0;
	return {
		derivedTitle,
		needsTranscript: opts.includeLastMessage || !derivedTitle
	};
}
function resolvePositiveNumber(value) {
	return asPositiveFiniteNumber(value);
}
function resolveModelCostConfigCached(provider, model, cfg, rowContext) {
	if (!rowContext) return resolveModelCostConfig({
		provider,
		model,
		config: cfg
	});
	const key = createSessionRowModelCacheKey(provider, model);
	if (rowContext.modelCostConfigByModelRef.has(key)) return rowContext.modelCostConfigByModelRef.get(key);
	const value = resolveModelCostConfig({
		provider,
		model,
		config: cfg
	});
	rowContext.modelCostConfigByModelRef.set(key, value);
	return value;
}
function resolveEstimatedSessionCostUsd(params) {
	const explicitCostUsd = asNonNegativeFiniteNumber(params.explicitCostUsd ?? params.entry?.estimatedCostUsd);
	if (explicitCostUsd !== void 0) return explicitCostUsd;
	const input = resolvePositiveNumber(params.entry?.inputTokens);
	const output = resolvePositiveNumber(params.entry?.outputTokens);
	const cacheRead = resolvePositiveNumber(params.entry?.cacheRead);
	const cacheWrite = resolvePositiveNumber(params.entry?.cacheWrite);
	if (input === void 0 && output === void 0 && cacheRead === void 0 && cacheWrite === void 0) return;
	const cost = resolveModelCostConfigCached(params.provider, params.model, params.cfg, params.rowContext);
	if (!cost) return;
	const estimated = estimateAggregateUsageCost({
		usage: {
			...input !== void 0 ? { input } : {},
			...output !== void 0 ? { output } : {},
			...cacheRead !== void 0 ? { cacheRead } : {},
			...cacheWrite !== void 0 ? { cacheWrite } : {}
		},
		cost
	});
	return asNonNegativeFiniteNumber(estimated);
}
const STALE_STORE_ONLY_CHILD_LINK_MS = 36e5;
function isFinitePositiveTimestamp(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0;
}
function shouldKeepStoreOnlyChildLink(entry, now) {
	if (isTerminalSessionStatus(entry.status) || isFinitePositiveTimestamp(entry.endedAt)) {
		const endedAt = isFinitePositiveTimestamp(entry.endedAt) ? entry.endedAt : entry.updatedAt;
		return isFinitePositiveTimestamp(endedAt) && now - endedAt <= 18e5;
	}
	return entry.status === "running" || isFinitePositiveTimestamp(entry.startedAt) || isFinitePositiveTimestamp(entry.updatedAt) && now - entry.updatedAt <= STALE_STORE_ONLY_CHILD_LINK_MS;
}
/** Resolve navigation owners from canonical existence and current run liveness. */
function resolveSessionChildOwners(params) {
	const { key, entry, now, subagentRuns } = params;
	const latest = subagentRuns.getDisplaySubagentRun(key);
	if (!(params.hasActiveRun || (latest ? shouldKeepSubagentRunChildLink(latest, {
		activeDescendants: subagentRuns.countActiveDescendantRuns(key),
		now
	}) : shouldKeepStoreOnlyChildLink(entry, now)))) return [];
	const controller = latest ? normalizeOptionalString(latest.controllerSessionKey) || normalizeOptionalString(latest.requesterSessionKey) : normalizeOptionalString(entry.spawnedBy);
	const parent = normalizeOptionalString(entry.parentSessionKey);
	return [.../* @__PURE__ */ new Set([controller, parent])].filter((owner) => owner !== void 0 && owner !== key);
}
/** Index only canonical children; retained run results cannot create session links. */
function* buildStoreChildSessionLinksWork(params, shouldYield) {
	const children = /* @__PURE__ */ new Map();
	if (params.keys.length === 0) return children;
	const parents = new Set(params.keys);
	for (const key of Object.keys(params.store)) {
		if (shouldYield?.()) yield;
		const entry = params.store[key];
		if (!entry) continue;
		const runs = params.subagentRunsByChildSessionKey.get(key.trim()) ?? [];
		const owners = /* @__PURE__ */ new Set([
			...runs.map((run) => normalizeOptionalString(run.controllerSessionKey) || normalizeOptionalString(run.requesterSessionKey)),
			normalizeOptionalString(entry.spawnedBy),
			normalizeOptionalString(entry.parentSessionKey)
		]);
		for (const owner of owners) if (owner && owner !== key && parents.has(owner)) {
			const siblings = children.get(owner) ?? [];
			siblings.push({
				key,
				entry
			});
			children.set(owner, siblings);
		}
	}
	return children;
}
//#endregion
export { resolveEstimatedSessionCostUsd as a, createSessionRowModelCacheKey as c, prepareSessionTitleRead as i, deriveSessionTitle as n, resolvePositiveNumber as o, isFinitePositiveTimestamp as r, resolveSessionChildOwners as s, buildStoreChildSessionLinksWork as t };
