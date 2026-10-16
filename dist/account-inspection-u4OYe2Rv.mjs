import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as resolveChannelAccount } from "./account-resolution-DCHDXWZ0.mjs";
import { i as hasResolvedCredentialValue, r as hasConfiguredUnavailableCredentialStatus } from "./account-snapshot-fields-e1ulxwox.mjs";
import { a as resolveUnavailableChannelAccountSnapshot } from "./account-state-BCMKW1kd.mjs";
import { a as resolveChannelAccountConfigured, o as resolveChannelAccountEnabled, r as buildChannelAccountSummary, t as buildChannelAccountSnapshotFromInspection } from "./account-summary-BxKjshxY.mjs";
import { t as inspectReadOnlyChannelAccount } from "./read-only-account-inspect-Dd3gHNsR.mjs";
//#region src/channels/account-inspection.ts
async function inspectChannelAccount(params) {
	return params.plugin.config.inspectAccount?.(params.cfg, params.accountId) ?? await inspectReadOnlyChannelAccount({
		channelId: params.plugin.id,
		cfg: params.cfg,
		accountId: params.accountId
	});
}
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
	const account = await resolveChannelAccount(params);
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
