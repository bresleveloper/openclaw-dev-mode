import { c as isRecord, r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { t as asBoolean } from "./boolean-C30ltbL7.mjs";
import "./utils-aKqR_F_U.mjs";
import { a as projectSafeChannelAccountSnapshotFields, o as redactChannelAccountSnapshotBaseUrl } from "./account-snapshot-fields-DpvG7B4L.mjs";
import { i as resolveChannelAccountState, t as applyChannelAccountState } from "./account-state-Bap6_YQI.mjs";
import { a as buildRuntimeAccountStatusSnapshot } from "./status-helpers-Dx120xqp.mjs";
//#region src/channels/account-summary.ts
/**
* Channel account summary helpers.
*
* Builds safe status snapshots and resolves enabled/configured account state.
*/
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
		return redactChannelAccountSnapshotBaseUrl(snapshot);
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
	return redactChannelAccountSnapshotBaseUrl(snapshot);
}
/**
* Builds the safe account snapshot shown by CLI, gateway, and status summaries.
*/
function buildChannelAccountSummary(params) {
	const described = params.plugin.config.describeAccount?.(params.account, params.cfg);
	return redactChannelAccountSnapshotBaseUrl({
		enabled: params.enabled,
		configured: params.configured,
		...projectSafeChannelAccountSnapshotFields(params.account),
		...described,
		accountId: params.accountId
	});
}
/**
* Formats allowFrom entries with a plugin formatter when one exists.
*/
function formatChannelAllowFrom(params) {
	if (params.plugin.config.formatAllowFrom) return params.plugin.config.formatAllowFrom({
		cfg: params.cfg,
		accountId: params.accountId,
		allowFrom: params.allowFrom
	});
	return normalizeStringEntries(params.allowFrom);
}
/**
* Resolves whether a channel account should be treated as enabled.
*/
function resolveChannelAccountEnabled(params) {
	if (params.plugin.config.isEnabled) return params.plugin.config.isEnabled(params.account, params.cfg);
	return (isRecord(params.account) ? params.account.enabled : void 0) !== false;
}
/**
* Resolves whether a channel account has enough configuration to run.
*/
async function resolveChannelAccountConfigured(params) {
	if (params.plugin.config.isConfigured) return await params.plugin.config.isConfigured(params.account, params.cfg);
	if (params.readAccountConfiguredField) return (isRecord(params.account) ? params.account.configured : void 0) !== false;
	return true;
}
//#endregion
export { resolveChannelAccountConfigured as a, formatChannelAllowFrom as i, buildChannelAccountSnapshotFromRuntime as n, resolveChannelAccountEnabled as o, buildChannelAccountSummary as r, buildChannelAccountSnapshotFromInspection as t };
