import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as asBoolean } from "./boolean-CFfzB3ix.mjs";
import { c as isRecord, r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as normalizeStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import "./utils-gjJ-tD2q.mjs";
import { n as describeChannelAccount } from "./account-resolution-akTcFkRf.mjs";
import { o as projectSafeChannelAccountSnapshotFields, s as redactChannelStatusSummaryBaseUrl } from "./account-snapshot-fields-BIlgyhxH.mjs";
import { i as resolveChannelAccountState, t as applyChannelAccountState } from "./account-state-0YA3UWGA.mjs";
import { a as buildRuntimeAccountStatusSnapshot } from "./status-helpers-MWPCenO2.mjs";
//#region src/channels/account-summary.ts
/** Projects an admitted lifetime without resolving its potentially stale account configuration. */
function buildChannelAccountSnapshotFromRuntime(runtime) {
	return {
		...buildRuntimeAccountStatusSnapshot({ runtime }),
		...projectSafeChannelAccountSnapshotFields(runtime),
		accountId: runtime.accountId,
		enabled: runtime.enabled,
		configured: runtime.configured,
		stateReason: runtime.stateReason
	};
}
/** Projects diagnostic inspection metadata without treating it as a runtime account. */
function buildChannelAccountSnapshotFromInspection(params) {
	const inspected = asNullableRecord(params.account);
	const enabled = asBoolean(inspected?.enabled) ?? params.runtime?.enabled ?? true;
	const configured = asBoolean(inspected?.configured) ?? params.runtime?.configured;
	const snapshot = {
		...buildRuntimeAccountStatusSnapshot(params),
		lastInboundAt: params.runtime?.lastInboundAt ?? null,
		lastOutboundAt: params.runtime?.lastOutboundAt ?? null,
		...projectSafeChannelAccountSnapshotFields(params.account),
		...params.runtime,
		...params.probe !== void 0 ? { probe: params.probe } : {},
		accountId: normalizeOptionalString(inspected?.accountId) ?? params.accountId,
		enabled,
		configured
	};
	if (configured === void 0) {
		snapshot.stateReason = enabled ? "configuration status unavailable" : "disabled";
		if (!enabled) snapshot.running = false;
		return redactChannelStatusSummaryBaseUrl(snapshot);
	}
	const reason = normalizeOptionalString(inspected?.stateReason);
	applyChannelAccountState(snapshot, resolveChannelAccountState({
		enabled,
		configured,
		linked: snapshot.linked,
		runtime: snapshot,
		disabledReason: reason,
		unconfiguredReason: reason
	}));
	return redactChannelStatusSummaryBaseUrl(snapshot);
}
async function buildChannelAccountSummary(params) {
	const described = await describeChannelAccount(params);
	return redactChannelStatusSummaryBaseUrl({
		enabled: params.enabled,
		configured: params.configured,
		...projectSafeChannelAccountSnapshotFields(params.account),
		...described,
		accountId: params.accountId
	});
}
function formatChannelAllowFrom(params) {
	if (params.plugin.config.formatAllowFrom) return params.plugin.config.formatAllowFrom({
		cfg: params.cfg,
		accountId: params.accountId,
		allowFrom: params.allowFrom
	});
	return normalizeStringEntries(params.allowFrom);
}
function resolveChannelAccountEnabled(params) {
	if (params.plugin.config.isEnabled) return params.plugin.config.isEnabled(params.account, params.cfg);
	return (isRecord(params.account) ? params.account.enabled : void 0) !== false;
}
async function resolveChannelAccountConfigured(params) {
	if (params.plugin.config.isConfigured) return await params.plugin.config.isConfigured(params.account, params.cfg);
	if (params.readAccountConfiguredField) return (isRecord(params.account) ? params.account.configured : void 0) !== false;
	return true;
}
//#endregion
export { resolveChannelAccountConfigured as a, formatChannelAllowFrom as i, buildChannelAccountSnapshotFromRuntime as n, resolveChannelAccountEnabled as o, buildChannelAccountSummary as r, buildChannelAccountSnapshotFromInspection as t };
