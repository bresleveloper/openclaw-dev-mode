import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { i as normalizeCronScheduledToolPolicy, r as normalizeCronScheduledToolCallerOrigin } from "./scheduled-tool-policy-pqnwO5x1.mjs";
//#region src/agents/scheduled-tool-policy.ts
/** Separates a scheduled creator's authorization identity from its delivery route. */
function resolveScheduledToolCallerContext(params) {
	const policy = params.scheduledToolPolicy;
	const origin = policy?.mode === "account" ? policy.ownerOrigin : void 0;
	return {
		accountId: policy?.ownerAccountId ?? params.accountId,
		...policy ? { scheduled: true } : {},
		...origin?.kind === "local" ? { local: true } : {},
		channel: origin?.kind === "external" ? origin.channel : origin?.kind === "local" ? void 0 : policy?.mode === "account" ? null : params.channel
	};
}
/** Builds scheduled policy context only when both the cap and trusted owner exist. */
function resolveScheduledToolPolicyContext(params) {
	if (params.toolsAllow === void 0) return;
	const rawPolicy = params.scheduledToolPolicy;
	const policy = normalizeCronScheduledToolPolicy(isRecord(rawPolicy) && rawPolicy.mode === "account" ? {
		version: rawPolicy.version,
		mode: rawPolicy.mode,
		ownerSessionKey: rawPolicy.ownerSessionKey,
		ownerAccountId: rawPolicy.ownerAccountId
	} : isRecord(rawPolicy) && rawPolicy.mode === "trusted" ? {
		version: rawPolicy.version,
		mode: rawPolicy.mode
	} : rawPolicy);
	if (!policy) return;
	const rawExecTarget = params.execTarget ?? (isRecord(rawPolicy) ? rawPolicy.execTarget : void 0);
	const pinned = isRecord(rawExecTarget) && rawExecTarget.host === "gateway" && (rawExecTarget.version === void 0 || rawExecTarget.version === 1) ? { execTarget: {
		host: "gateway",
		...rawExecTarget.ask === "always" ? { ask: "always" } : {}
	} } : {};
	if (policy.mode === "trusted") return {
		...policy,
		...pinned
	};
	return {
		...policy,
		ownerOrigin: normalizeCronScheduledToolCallerOrigin(params.callerOrigin ?? (isRecord(rawPolicy) ? rawPolicy.ownerOrigin : void 0)),
		...pinned
	};
}
//#endregion
export { resolveScheduledToolPolicyContext as n, resolveScheduledToolCallerContext as t };
