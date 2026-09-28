import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as normalizeOptionalAccountId } from "./account-id-B1bfbA5J.mjs";
//#region src/cron/own-record.ts
/**
* Copies authored fields into a record with no inherited properties.
* Direct normalization would otherwise persist prototype-only input.
*/
function snapshotOwnCronRecord(record) {
	return Object.assign(Object.create(null), record);
}
//#endregion
//#region src/cron/scheduled-tool-policy.ts
/** Invalid, legacy, or incomplete origin facts stay explicitly unknown. */
function normalizeCronScheduledToolCallerOrigin(value) {
	const input = isRecord(value) ? snapshotOwnCronRecord(value) : void 0;
	if (!input || typeof input.kind !== "string") return { kind: "unknown" };
	const keys = Object.keys(input);
	if (input.kind === "local" && keys.every((key) => key === "kind")) return { kind: "local" };
	if (input.kind === "unknown" && keys.every((key) => key === "kind")) return { kind: "unknown" };
	const channel = normalizeOptionalString(input.kind === "external" && typeof input.channel === "string" ? input.channel : void 0)?.toLowerCase();
	return channel && keys.every((key) => key === "kind" || key === "channel") ? {
		kind: "external",
		channel
	} : { kind: "unknown" };
}
/** Retains only recognized restrictions; future fields remain reader-safe. */
function normalizeCronToolsAllowExecTarget(value) {
	const input = isRecord(value) ? snapshotOwnCronRecord(value) : void 0;
	return input?.version === 1 && input.host === "gateway" ? {
		version: 1,
		host: "gateway",
		...input.ask === "always" ? { ask: "always" } : {}
	} : void 0;
}
/** Invalid requirement markers remain durable fail-closed recovery state. */
function normalizeCronToolsAllowExecTargetRequirement(value) {
	if (value === void 0) return;
	const input = isRecord(value) ? snapshotOwnCronRecord(value) : void 0;
	if (!input || input.version !== 1 || input.recoveryRequired === true) return {
		version: 1,
		recoveryRequired: true
	};
	const rawTarget = isRecord(input.target) ? snapshotOwnCronRecord(input.target) : void 0;
	const target = rawTarget && rawTarget.version === 1 && rawTarget.host === "gateway" && (rawTarget.ask === void 0 || rawTarget.ask === "always") ? {
		version: 1,
		host: "gateway",
		...rawTarget.ask === "always" ? { ask: "always" } : {}
	} : void 0;
	const grantIndex = input.grantIndex;
	return target && typeof grantIndex === "number" && Number.isInteger(grantIndex) && grantIndex >= 0 ? {
		version: 1,
		target,
		grantIndex
	} : {
		version: 1,
		recoveryRequired: true
	};
}
function resolveMatchingCronExecTarget(params) {
	const requirement = normalizeCronToolsAllowExecTargetRequirement(params.requirement);
	const execTarget = normalizeCronToolsAllowExecTarget(params.execTarget);
	return requirement && "target" in requirement && requirement.target !== void 0 && execTarget?.host === requirement.target.host && execTarget.ask === requirement.target.ask ? requirement : void 0;
}
/** Removes a pinned exec grant from the generic persisted cap; the private envelope owns it. */
function stripCronPinnedExecGrant(params) {
	if (!params.toolsAllow) return;
	return normalizeCronToolsAllowExecTargetRequirement(params.requirement) ? params.toolsAllow.filter((tool) => tool !== "exec") : [...params.toolsAllow];
}
/** Rehydrates canonical exec only after the persisted grant and restriction agree. */
function restoreCronPinnedExecGrant(params) {
	if (!params.toolsAllow) return;
	const requirement = resolveMatchingCronExecTarget(params);
	if (!requirement || params.toolsAllow.includes("exec")) return [...params.toolsAllow];
	const restored = [...params.toolsAllow];
	restored.splice(Math.min(requirement.grantIndex, restored.length), 0, "exec");
	return restored;
}
/** Returns operator-visible recovery guidance when a required pin cannot be proven intact. */
function resolveCronToolsAllowExecTargetRecoveryError(params) {
	if (!normalizeCronToolsAllowExecTargetRequirement(params.requirement)) return;
	if (resolveMatchingCronExecTarget(params)) return;
	return `${params.jobId ? `Automation ${params.jobId}` : "This automation"} cannot run because its captured exec restriction is missing or invalid. No trigger, script, or agent action was executed. Recreate it from a fresh authenticated creator turn, or explicitly reauthorize its complete tool cap from a trusted operator shell with \`${params.jobId ? `openclaw automations edit ${params.jobId} --tools <tool,...>` : "openclaw automations list --all"}\`.`;
}
/** Creates provenance for an authenticated operator or trusted in-process caller. */
function createTrustedCronScheduledToolPolicy() {
	return {
		version: 1,
		mode: "trusted"
	};
}
/** Creates requester-scoped provenance from an authenticated account identity. */
function createAccountCronScheduledToolPolicy(params) {
	const ownerSessionKey = normalizeOptionalString(params.ownerSessionKey);
	const ownerAccountId = normalizeOptionalAccountId(params.ownerAccountId);
	if (!ownerSessionKey || !ownerAccountId) return;
	return {
		version: 1,
		mode: "account",
		ownerSessionKey,
		ownerAccountId
	};
}
/** Accepts only the current closed provenance shape; unknown versions fail closed. */
function normalizeCronScheduledToolPolicy(value) {
	const input = isRecord(value) ? snapshotOwnCronRecord(value) : void 0;
	if (!input || input.version !== 1) return;
	if (input.mode === "trusted") return Object.keys(input).every((key) => key === "version" || key === "mode") ? createTrustedCronScheduledToolPolicy() : void 0;
	if (input.mode !== "account") return;
	const policy = createAccountCronScheduledToolPolicy({
		ownerSessionKey: typeof input.ownerSessionKey === "string" ? input.ownerSessionKey : "",
		ownerAccountId: typeof input.ownerAccountId === "string" ? input.ownerAccountId : ""
	});
	if (!policy) return;
	return Object.keys(input).every((key) => key === "version" || key === "mode" || key === "ownerSessionKey" || key === "ownerAccountId") ? policy : void 0;
}
/** Resolves trusted provenance only when it is consistent with the persisted job owner. */
function resolveCronScheduledToolPolicy(params) {
	if (params.toolsAllow === void 0) return;
	const policy = normalizeCronScheduledToolPolicy(params.scheduledToolPolicy);
	if (!policy || policy.mode === "trusted") return policy;
	const ownerSessionKey = normalizeOptionalString(params.owner?.sessionKey);
	const ownerAccountId = normalizeOptionalAccountId(params.owner?.accountId);
	return ownerSessionKey === policy.ownerSessionKey && ownerAccountId === policy.ownerAccountId ? policy : void 0;
}
//#endregion
export { normalizeCronToolsAllowExecTarget as a, resolveCronToolsAllowExecTargetRecoveryError as c, snapshotOwnCronRecord as d, normalizeCronScheduledToolPolicy as i, restoreCronPinnedExecGrant as l, createTrustedCronScheduledToolPolicy as n, normalizeCronToolsAllowExecTargetRequirement as o, normalizeCronScheduledToolCallerOrigin as r, resolveCronScheduledToolPolicy as s, createAccountCronScheduledToolPolicy as t, stripCronPinnedExecGrant as u };
