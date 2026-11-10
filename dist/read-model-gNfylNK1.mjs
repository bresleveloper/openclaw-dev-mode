import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { o as asRecord } from "./record-coerce-TIsquoVR.mjs";
import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import "./session-key-CSDERtm3.mjs";
import "./account-id-ifCOO7_9.mjs";
import { r as hasConfiguredUnavailableCredentialStatus, t as CREDENTIAL_STATUS_KEYS } from "./account-snapshot-fields-BIlgyhxH.mjs";
//#region src/channels/status/read-model.ts
function readRuntimeAccountsByChannel(payload) {
	return asRecord(asRecord(payload).channelAccounts);
}
/** Reads raw runtime account records for one channel from a gateway payload. */
function getRuntimeChannelAccounts(params) {
	const raw = readRuntimeAccountsByChannel(params.payload)[params.channelId];
	return Array.isArray(raw) ? raw.map(asRecord) : [];
}
/** Normalizes gateway channel account snapshots into a channel-id map. */
function normalizeRuntimeChannelAccountSnapshots(payload) {
	const out = /* @__PURE__ */ new Map();
	for (const [channelId, accounts] of Object.entries(readRuntimeAccountsByChannel(payload))) {
		if (!Array.isArray(accounts)) continue;
		const normalized = accounts.filter((account) => Boolean(account) && typeof account === "object" && typeof account.accountId === "string");
		if (normalized.length > 0) out.set(channelId, normalized);
	}
	return out;
}
/** Reports whether a runtime account has usable live credentials. */
function hasRuntimeCredentialAvailable(params) {
	const account = params.liveAccounts.find((candidate) => (normalizeOptionalString(candidate.accountId) ?? normalizeOptionalString(candidate.id) ?? normalizeOptionalString(candidate.name) ?? "default") === params.accountId) ?? (params.accountId === "default" && params.liveAccounts.length === 1 ? params.liveAccounts[0] : void 0);
	if (!account) return false;
	if (hasConfiguredUnavailableCredentialStatus(account)) return false;
	return account.running === true || account.connected === true;
}
/** Converts configured-but-unavailable credential markers to available. */
function markConfiguredUnavailableCredentialStatusesAvailable(account) {
	const record = { ...asRecord(account) };
	for (const key of CREDENTIAL_STATUS_KEYS) if (record[key] === "configured_unavailable") record[key] = "available";
	return record;
}
/** Merges local and runtime accounts into display rows with source metadata. */
async function resolveChannelAccountStatusRows(params) {
	const mergedAccountIds = uniqueStrings([...params.localAccountIds, ...params.runtimeAccounts.map((account) => account.accountId)]);
	const rows = [];
	for (const accountId of mergedAccountIds) {
		const runtimeSnapshot = params.runtimeAccounts.find((account) => account.accountId === accountId);
		rows.push({
			accountId,
			snapshot: runtimeSnapshot ?? await params.resolveLocalSnapshot(accountId),
			source: runtimeSnapshot ? "gateway" : "config"
		});
	}
	return rows;
}
//#endregion
export { resolveChannelAccountStatusRows as a, normalizeRuntimeChannelAccountSnapshots as i, hasRuntimeCredentialAvailable as n, markConfiguredUnavailableCredentialStatusesAvailable as r, getRuntimeChannelAccounts as t };
