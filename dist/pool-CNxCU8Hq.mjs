import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
//#region extensions/clawrouter/pool.ts
function text(value) {
	return typeof value === "string" && value.trim() && value.length <= 256 ? value.trim() : void 0;
}
function number(value, max = Number.MAX_SAFE_INTEGER) {
	return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= max ? value : void 0;
}
function bool(value) {
	return typeof value === "boolean" ? value : void 0;
}
function date(value) {
	const str = text(value);
	return str && Number.isFinite(Date.parse(str)) ? str : void 0;
}
function rows(value, max) {
	return Array.isArray(value) ? value.slice(0, max).flatMap((row) => {
		const record = asOptionalRecord(row);
		return record ? [record] : [];
	}) : [];
}
function strings(value) {
	return Array.isArray(value) ? [...new Set(value.slice(0, 200).flatMap((entry) => text(entry) ?? []))] : [];
}
function traffic(value) {
	return rows(value, 400).map((row) => ({
		provider: text(row.provider),
		grantLane: text(row.grantLane),
		grantKey: text(row.grantKey),
		requests: number(row.requests),
		inputTokens: number(row.inputTokens),
		outputTokens: number(row.outputTokens),
		cacheReadTokens: number(row.cacheReadTokens),
		cacheWriteTokens: number(row.cacheWriteTokens),
		costMicros: number(row.costMicros)
	}));
}
/** Select only the public pool contract; upstream additions never leak into RPC results. */
function parseClawRouterPool(value) {
	const root = asOptionalRecord(value);
	if (root?.version !== "clawrouter.pool.v1") return;
	const routing = asOptionalRecord(root.routing);
	const usage = asOptionalRecord(root.usage);
	return {
		version: "clawrouter.pool.v1",
		observedAt: date(root.observedAt),
		policyId: text(root.policyId),
		routing: routing ? {
			strategy: text(routing.strategy),
			includedQuotaReservePercent: number(routing.includedQuotaReservePercent, 100),
			environmentFallback: bool(routing.environmentFallback)
		} : void 0,
		models: strings(root.models),
		grants: rows(root.grants, 200).map((grant) => {
			const account = asOptionalRecord(grant.account);
			const extra = asOptionalRecord(grant.extraUsage);
			const eligibility = asOptionalRecord(grant.eligibility);
			return {
				key: text(grant.key),
				label: text(grant.label),
				provider: text(grant.provider),
				kind: text(grant.kind),
				enabled: bool(grant.enabled),
				credentialStatus: text(grant.credentialStatus),
				plan: text(grant.plan),
				account: account ? {
					email: text(account.email),
					rateLimitTier: text(account.rateLimitTier),
					subscriptionStatus: text(account.subscriptionStatus)
				} : void 0,
				windows: rows(grant.windows, 20).map((window) => ({
					id: text(window.id),
					window: text(window.window),
					models: window.models === null ? null : Array.isArray(window.models) ? strings(window.models) : void 0,
					remainingPercent: number(window.remainingPercent, 100),
					resetAt: date(window.resetAt),
					observedAt: date(window.observedAt)
				})),
				extraUsage: extra ? {
					enabled: bool(extra.enabled),
					usedCredits: number(extra.usedCredits),
					monthlyLimit: number(extra.monthlyLimit),
					currency: text(extra.currency),
					spendLimitReached: bool(extra.spendLimitReached)
				} : void 0,
				eligibility: Object.fromEntries(Object.entries(eligibility ?? {}).slice(0, 200).flatMap(([model, state]) => text(model) && (state === "eligible" || state === "exhausted" || state === "cooldown" || state === "stale" || state === "reauth_required") ? [[model, state]] : [])),
				lastSelectedAt: date(grant.lastSelectedAt),
				selectedCount: number(grant.selectedCount)
			};
		}),
		usage: {
			days: number(usage?.days),
			lanes: traffic(usage?.lanes),
			grants: traffic(usage?.grants)
		}
	};
}
//#endregion
export { parseClawRouterPool as t };
