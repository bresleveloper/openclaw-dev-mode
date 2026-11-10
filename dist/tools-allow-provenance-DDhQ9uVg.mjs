import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as normalizeOptionalAccountId } from "./account-id-ifCOO7_9.mjs";
import { r as normalizeCronScheduledToolCallerOrigin, s as resolveCronScheduledToolPolicy } from "./scheduled-tool-policy-Bjq61U8o.mjs";
//#region src/cron/tools-allow-provenance.ts
/** Authority facts must be authored data, never inherited fields or accessor results. */
function snapshotProvenanceRecord(value) {
	if (!isRecord(value)) return;
	const snapshot = Object.create(null);
	for (const [key, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(value))) if (descriptor.enumerable) snapshot[key] = "value" in descriptor ? descriptor.value : void 0;
	return snapshot;
}
function normalizeCronAuthenticatedChannelRequester(value) {
	const input = snapshotProvenanceRecord(value);
	if (input?.version !== 1) return;
	const channel = normalizeOptionalLowercaseString(input.channel);
	const accountId = normalizeOptionalAccountId(typeof input.accountId === "string" ? input.accountId : void 0);
	const senderId = normalizeOptionalString(input.senderId);
	return channel && accountId && senderId ? {
		version: 1,
		channel,
		accountId,
		senderId
	} : void 0;
}
function normalizeCronToolsAllowProvenance(value) {
	const input = snapshotProvenanceRecord(value);
	if (input?.version !== 1) return;
	const channelRequester = normalizeCronAuthenticatedChannelRequester(input.channelRequester);
	const normalizedCallerOrigin = normalizeCronScheduledToolCallerOrigin(snapshotProvenanceRecord(input.callerOrigin));
	const callerOrigin = normalizedCallerOrigin.kind === "unknown" ? void 0 : normalizedCallerOrigin;
	if (input.source === "authenticated-requester") {
		if (callerOrigin) return {
			version: 1,
			source: "authenticated-requester",
			callerOrigin,
			...channelRequester ? { channelRequester } : {}
		};
		return channelRequester ? {
			version: 1,
			source: "authenticated-requester",
			channelRequester
		} : void 0;
	}
	if (input.source !== "final-executable-surface") return;
	return {
		version: 1,
		source: "final-executable-surface",
		callerOrigin: normalizedCallerOrigin,
		...channelRequester ? { channelRequester } : {}
	};
}
/** Caller origin is usable only within the job's persisted account policy. */
function resolveCronAuthenticatedCallerOrigin(job) {
	if (resolveCronScheduledToolPolicy({
		toolsAllow: job.payload.toolsAllow,
		owner: job.owner,
		scheduledToolPolicy: job.scheduledToolPolicy
	})?.mode !== "account") return;
	const callerOrigin = normalizeCronToolsAllowProvenance(job.toolsAllowProvenance)?.callerOrigin;
	return callerOrigin?.kind === "unknown" ? void 0 : callerOrigin;
}
/** Requester facts are usable only within the existing job owner and account policy. */
function resolveCronAuthenticatedChannelRequester(job) {
	const policy = resolveCronScheduledToolPolicy({
		toolsAllow: job.payload.toolsAllow,
		owner: job.owner,
		scheduledToolPolicy: job.scheduledToolPolicy
	});
	if (policy?.mode !== "account") return;
	const requester = normalizeCronToolsAllowProvenance(job.toolsAllowProvenance)?.channelRequester;
	return requester?.accountId === policy.ownerAccountId ? requester : void 0;
}
//#endregion
export { resolveCronAuthenticatedChannelRequester as i, normalizeCronToolsAllowProvenance as n, resolveCronAuthenticatedCallerOrigin as r, normalizeCronAuthenticatedChannelRequester as t };
