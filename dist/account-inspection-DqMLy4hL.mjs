import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as hasConfiguredUnavailableCredentialStatus, r as hasResolvedCredentialValue } from "./account-snapshot-fields-DpvG7B4L.mjs";
import { a as resolveUnavailableChannelAccountSnapshot } from "./account-state-CFbF5_dt.mjs";
import { a as resolveChannelAccountConfigured, o as resolveChannelAccountEnabled, r as buildChannelAccountSummary, t as buildChannelAccountSnapshotFromInspection } from "./account-summary-BR6yNdkT.mjs";
import { t as inspectReadOnlyChannelAccount } from "./read-only-account-inspect-44l_sOq6.mjs";
//#region src/channels/account-inspection.ts
/**
* Channel account inspection helpers.
*
* Combines plugin inspection hooks, read-only fallbacks, and configured credential status.
*/
/**
* Inspects one channel account using the plugin hook or read-only fallback.
*/
async function inspectChannelAccount(params) {
	return params.plugin.config.inspectAccount?.(params.cfg, params.accountId) ?? await inspectReadOnlyChannelAccount({
		channelId: params.plugin.id,
		cfg: params.cfg,
		accountId: params.accountId
	});
}
/**
* Resolves an inspected channel account plus enabled/configured state for status surfaces.
*/
async function resolveInspectedChannelAccount(params) {
	const unavailable = resolveUnavailableChannelAccountSnapshot(params.cfg, {
		channelId: params.plugin.id,
		accountId: params.accountId
	});
	if (unavailable) return {
		kind: "unavailable",
		account: unavailable,
		enabled: unavailable.enabled !== false,
		configured: unavailable.configured === true,
		snapshot: unavailable
	};
	const sourceInspectedAccount = await inspectChannelAccount({
		plugin: params.plugin,
		cfg: params.sourceConfig,
		accountId: params.accountId
	});
	const resolvedInspectedAccount = await inspectChannelAccount({
		plugin: params.plugin,
		cfg: params.cfg,
		accountId: params.accountId
	});
	const resolvedInspection = asNullableRecord(resolvedInspectedAccount);
	const sourceInspection = asNullableRecord(sourceInspectedAccount);
	const inspected = Boolean(sourceInspectedAccount && hasConfiguredUnavailableCredentialStatus(sourceInspectedAccount) && (!hasResolvedCredentialValue(resolvedInspectedAccount) || sourceInspection?.configured === true && resolvedInspection?.configured === false)) ? sourceInspectedAccount : resolvedInspectedAccount;
	if (inspected != null) {
		const snapshot = buildChannelAccountSnapshotFromInspection({
			account: inspected,
			accountId: params.accountId
		});
		return {
			kind: "inspected",
			account: inspected,
			enabled: snapshot.enabled !== false,
			configured: snapshot.configured,
			snapshot
		};
	}
	const account = params.plugin.config.resolveAccount(params.cfg, params.accountId);
	const enabled = resolveChannelAccountEnabled({
		plugin: params.plugin,
		account,
		cfg: params.cfg
	});
	const configured = await resolveChannelAccountConfigured({
		plugin: params.plugin,
		account,
		cfg: params.cfg,
		readAccountConfiguredField: true
	});
	return {
		kind: "resolved",
		account,
		enabled,
		configured,
		snapshot: buildChannelAccountSummary({
			...params,
			account,
			enabled,
			configured
		})
	};
}
//#endregion
export { resolveInspectedChannelAccount as n, inspectChannelAccount as t };
