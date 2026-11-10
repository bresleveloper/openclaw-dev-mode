import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { l as asNonNegativeFiniteNumber, u as asPositiveFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { n as isTerminalSessionStatus } from "./types-BGDhC4_W.mjs";
import "./sessions-CnzPI1yx.mjs";
import { c as shouldKeepSubagentRunChildLink } from "./subagent-run-liveness-DPrFEcUI.mjs";
import { n as estimateAggregateUsageCost, o as resolveModelCostConfig } from "./usage-format-DT58obO2.mjs";
import { t as deriveGoalSessionTitle } from "./derive-goal-session-title-CzjCOnHZ.mjs";
//#region src/gateway/session-utils-contracts.ts
function createSessionRowModelCacheKey(provider, model) {
	return `${normalizeLowercaseStringOrEmpty(provider)}\0${normalizeOptionalString(model) ?? ""}`;
}
//#endregion
//#region src/gateway/session-utils-core.ts
function matchesSessionArchiveFilter(entry, archived) {
	return archived === "all" || entry.archivedAt !== void 0 === (archived === true);
}
function deriveSessionTitle(entry, firstUserMessage, externalDisplayName) {
	if (!entry) return;
	return normalizeOptionalString(entry.label) ?? normalizeOptionalString(externalDisplayName) ?? normalizeOptionalString(entry.displayName) ?? normalizeOptionalString(entry.subject) ?? (deriveGoalSessionTitle(firstUserMessage) || void 0);
}
function prepareSessionTitleRead(entry, displayName, opts) {
	if (!entry?.sessionId || !(opts.includeDerivedTitles || opts.includeLastMessage)) return;
	const derivedTitle = opts.includeDerivedTitles ? deriveSessionTitle(entry, void 0, displayName) : void 0;
	return {
		derivedTitle,
		needsTranscript: opts.includeLastMessage || !derivedTitle
	};
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
	if (params.entry?.usageReport?.state === "unavailable") return;
	const explicitCostUsd = asNonNegativeFiniteNumber(params.explicitCostUsd ?? params.entry?.estimatedCostUsd);
	if (explicitCostUsd !== void 0) return explicitCostUsd;
	const input = asPositiveFiniteNumber(params.entry?.inputTokens);
	const output = asPositiveFiniteNumber(params.entry?.outputTokens);
	const cacheRead = asPositiveFiniteNumber(params.entry?.cacheRead);
	const cacheWrite = asPositiveFiniteNumber(params.entry?.cacheWrite);
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
	return isFinitePositiveTimestamp(entry.startedAt) || isFinitePositiveTimestamp(entry.updatedAt) && now - entry.updatedAt <= STALE_STORE_ONLY_CHILD_LINK_MS;
}
const emptyChildOwners = Object.freeze([]);
const sessionChildOwners = /* @__PURE__ */ new WeakMap();
/** Reuse owner identities, but recheck time and live authority on every read. */
function resolveSessionChildOwners(params) {
	const { key, entry, now, subagentRuns } = params;
	const latest = subagentRuns.getDisplaySubagentRun(key);
	const keep = params.hasActiveRun || (latest ? shouldKeepSubagentRunChildLink(latest, {
		activeDescendants: subagentRuns.countActiveDescendantRuns(key),
		now
	}) : shouldKeepStoreOnlyChildLink(entry, now));
	const controller = keep ? latest ? normalizeOptionalString(latest.controllerSessionKey) || normalizeOptionalString(latest.requesterSessionKey) : normalizeOptionalString(entry.spawnedBy) : void 0;
	const parent = keep || (params.parsedKey === void 0 ? parseAgentSessionKey(key) : params.parsedKey)?.rest.startsWith("dashboard:") ? normalizeOptionalString(entry.parentSessionKey) : void 0;
	const cached = sessionChildOwners.get(entry);
	if (cached?.key === key && cached.controller === controller && cached.parent === parent) return cached.owners;
	const owners = [];
	if (controller && controller !== key) owners.push(controller);
	if (parent && parent !== key && parent !== controller) owners.push(parent);
	const result = owners.length ? Object.freeze(owners) : emptyChildOwners;
	sessionChildOwners.set(entry, {
		key,
		controller,
		parent,
		owners: result
	});
	return result;
}
/** Select canonical children; retained run results cannot create session links. */
function readStoreChildSessionLinks(params) {
	const children = [];
	for (const [key, entry] of Object.entries(params.store)) {
		if (key === params.key || !params.key) continue;
		if ([
			...(params.subagentRunsByChildSessionKey.get(key.trim()) ?? []).map((run) => normalizeOptionalString(run.controllerSessionKey) || normalizeOptionalString(run.requesterSessionKey)),
			normalizeOptionalString(entry.spawnedBy),
			normalizeOptionalString(entry.parentSessionKey)
		].includes(params.key)) children.push({
			key,
			entry
		});
	}
	return children.length ? children : void 0;
}
//#endregion
export { readStoreChildSessionLinks as a, createSessionRowModelCacheKey as c, prepareSessionTitleRead as i, isFinitePositiveTimestamp as n, resolveEstimatedSessionCostUsd as o, matchesSessionArchiveFilter as r, resolveSessionChildOwners as s, deriveSessionTitle as t };
