import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as listReadOnlyChannelPluginsForConfig } from "./read-only-bu8BjV4Y.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-Bm4RKejp.mjs";
import { n as resolveInspectedChannelAccount } from "./account-inspection-u4OYe2Rv.mjs";
//#region src/status/link-channel.ts
/** Returns link status for the first configured read-only channel that exposes linked state. */
async function resolveLinkChannelContext(cfg, options = {}) {
	const sourceConfig = options.sourceConfig ?? cfg;
	for (const plugin of listReadOnlyChannelPluginsForConfig(cfg, {
		activationSourceConfig: sourceConfig,
		includeSetupFallbackPlugins: false
	})) {
		const defaultAccountId = resolveChannelDefaultAccountId({
			plugin,
			cfg
		});
		const context = await resolveInspectedChannelAccount({
			plugin,
			cfg,
			sourceConfig,
			accountId: defaultAccountId
		});
		if (context.kind === "unavailable") continue;
		const { account, snapshot } = context;
		const summary = context.kind === "resolved" && plugin.status?.buildChannelSummary ? await plugin.status.buildChannelSummary({
			account,
			cfg,
			defaultAccountId,
			snapshot
		}) : snapshot;
		const summaryRecord = asNullableRecord(summary);
		const linked = summaryRecord && typeof summaryRecord.linked === "boolean" ? summaryRecord.linked : null;
		if (linked === null) continue;
		return {
			linked,
			authAgeMs: summaryRecord && typeof summaryRecord.authAgeMs === "number" ? summaryRecord.authAgeMs : null,
			account,
			accountId: defaultAccountId,
			plugin
		};
	}
	return null;
}
//#endregion
export { resolveLinkChannelContext };
