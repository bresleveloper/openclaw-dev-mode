import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as resolveChannelAccount } from "./account-resolution-DCHDXWZ0.mjs";
import { o as projectSafeChannelAccountSnapshotFields, s as redactChannelStatusSummaryBaseUrl } from "./account-snapshot-fields-e1ulxwox.mjs";
import { a as resolveUnavailableChannelAccountSnapshot, i as resolveChannelAccountState, r as resolveChannelAccountLinked, t as applyChannelAccountState } from "./account-state-4G5zay13.mjs";
import { t as buildChannelAccountSnapshotFromInspection } from "./account-summary-CegAey_r.mjs";
import { t as inspectChannelAccount } from "./account-inspection-tN6nrtAL.mjs";
//#region src/channels/plugins/status.ts
async function buildChannelAccountSnapshotFromAccount(params) {
	let snapshot;
	if (params.plugin.status?.buildAccountSnapshot) snapshot = await params.plugin.status.buildAccountSnapshot({
		account: params.account,
		cfg: params.cfg,
		runtime: params.runtime,
		probe: params.probe,
		audit: params.audit
	});
	else snapshot = {
		accountId: params.accountId,
		...projectSafeChannelAccountSnapshotFields(params.account),
		...projectSafeChannelAccountSnapshotFields(params.runtime)
	};
	const described = params.plugin.config.describeAccount?.(params.account, params.cfg);
	const enabled = params.plugin.config.isEnabled ? params.plugin.config.isEnabled(params.account, params.cfg) : described?.enabled ?? snapshot.enabled ?? params.enabledFallback ?? true;
	const configured = described?.configured ?? (params.plugin.config.isConfigured ? await params.plugin.config.isConfigured(params.account, params.cfg) : snapshot.configured ?? params.configuredFallback ?? true);
	const linkState = configured && params.plugin.config.isLinked ? await params.plugin.config.isLinked(params.account, params.cfg) : void 0;
	const state = resolveChannelAccountState({
		enabled,
		configured,
		linked: resolveChannelAccountLinked(linkState, described?.linked ?? snapshot.linked),
		runtime: snapshot,
		disabledReason: params.plugin.config.disabledReason?.(params.account, params.cfg),
		unconfiguredReason: params.plugin.config.unconfiguredReason?.(params.account, params.cfg),
		unlinkedReason: params.plugin.config.unlinkedReason?.(params.account, params.cfg)
	});
	const projectedSnapshot = { ...snapshot };
	applyChannelAccountState(projectedSnapshot, state);
	return redactChannelStatusSummaryBaseUrl({
		...projectedSnapshot,
		enabled,
		accountId: normalizeOptionalString(snapshot.accountId) ? snapshot.accountId : params.accountId,
		...params.probe !== void 0 && snapshot.probe === void 0 ? { probe: params.probe } : {}
	});
}
async function buildReadOnlySourceChannelAccountSnapshot(params) {
	const inspectedAccount = await inspectChannelAccount(params);
	if (!inspectedAccount) return null;
	return buildChannelAccountSnapshotFromInspection({
		...params,
		account: inspectedAccount
	});
}
async function resolveChannelAccountSnapshot(params) {
	const unavailable = resolveUnavailableChannelAccountSnapshot(params.cfg, {
		channelId: params.plugin.id,
		accountId: params.accountId,
		runtime: params.runtime
	});
	if (unavailable) return unavailable;
	const inspected = await buildReadOnlySourceChannelAccountSnapshot(params);
	if (inspected) return inspected;
	return await buildChannelAccountSnapshotFromAccount({
		...params,
		account: await resolveChannelAccount(params)
	});
}
//#endregion
export { buildReadOnlySourceChannelAccountSnapshot as n, resolveChannelAccountSnapshot as r, buildChannelAccountSnapshotFromAccount as t };
