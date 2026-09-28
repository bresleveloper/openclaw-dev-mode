import { a as isExternallyDistributedPlugin, h as resolveOfficialExternalPluginLabel, i as getOfficialExternalPluginCatalogEntryForPackage, m as resolveOfficialExternalPluginInstallSources, r as getOfficialExternalPluginCatalogEntry } from "./official-external-plugin-catalog-CzZljLFK.mjs";
import { h as resolveOfficialExternalPluginId, o as getOfficialExternalPluginCatalogManifest } from "./official-external-plugin-catalog-source-CkmJlLAW.mjs";
import { u as resolveConfiguredChannelPresencePolicy } from "./channel-presence-policy-C83ks5im.mjs";
import "./channel-plugin-ids-5hZDJEQZ.mjs";
//#region src/plugins/official-external-plugin-repair-hints.ts
/**
* Bundled plugins ship their dependencies inside the root package, so dependency status is
* only meaningful for external installs and for externally distributed plugins whose runtime
* was compiled into the bundled tree without its plugin-local dependencies.
*/
function tracksPluginDependencyStatus(candidate) {
	return candidate.origin !== "bundled" || isExternallyDistributedPlugin(candidate);
}
/**
* Names the install path when an externally distributed plugin fails to import its runtime
* dependencies. Source builds compile these plugins into `dist/extensions/<id>` but their
* dependencies stay plugin-local, so a moved or pruned checkout leaves the dist link dangling.
*/
function resolveExternalPluginRuntimeDependencyRepairHint(candidate) {
	if (!isExternallyDistributedPlugin(candidate)) return;
	const entry = getOfficialExternalPluginCatalogEntryForPackage(candidate.packageName);
	const hint = entry && resolveOfficialExternalPluginId(entry) === candidate.pluginId ? buildOfficialExternalPluginRepairHint(entry, candidate.pluginId) : null;
	return hint ? `runtime dependencies are missing for externally distributed plugin ${hint.label}; ${hint.repairHint}` : `runtime dependencies are missing for externally distributed plugin ${candidate.pluginId}; reinstall or update the plugin package, then restart the Gateway.`;
}
/** Resolves install/doctor commands for an official external plugin or channel id. */
function resolveOfficialExternalPluginRepairHint(pluginIdOrChannelId) {
	const entry = getOfficialExternalPluginCatalogEntry(pluginIdOrChannelId);
	return entry ? buildOfficialExternalPluginRepairHint(entry, pluginIdOrChannelId) : null;
}
function buildOfficialExternalPluginRepairHint(entry, pluginIdOrChannelId) {
	const installSpec = resolveOfficialExternalPluginInstallSources(entry)[0]?.spec;
	if (!installSpec) return null;
	const manifest = getOfficialExternalPluginCatalogManifest(entry);
	const pluginId = resolveOfficialExternalPluginId(entry) ?? pluginIdOrChannelId.trim();
	const channelId = manifest?.channel?.id?.trim();
	const label = resolveOfficialExternalPluginLabel(entry);
	const installCommand = `openclaw plugins install ${installSpec}`;
	const doctorFixCommand = "openclaw doctor --fix";
	return {
		pluginId,
		...channelId ? { channelId } : {},
		label,
		installSpec,
		installCommand,
		doctorFixCommand,
		repairHint: `Install the official external plugin with: ${installCommand}, or run: ${doctorFixCommand}.`
	};
}
/** Resolves repair hints for missing configured channels with one presence-policy pass. */
function resolveMissingOfficialExternalChannelPluginRepairHints(params) {
	if (params.channelIds.length === 0) return [];
	const policiesByChannelId = new Map(resolveConfiguredChannelPresencePolicy({
		config: params.config,
		activationSourceConfig: params.activationSourceConfig,
		workspaceDir: params.workspaceDir,
		env: params.env,
		includePersistedAuthState: false,
		manifestRecords: params.manifestRecords
	}).map((entry) => [entry.channelId, entry]));
	return params.channelIds.flatMap((channelId) => {
		const hint = resolveOfficialExternalPluginRepairHint(channelId);
		if (!hint?.channelId || hint.channelId !== channelId) return [];
		const policy = policiesByChannelId.get(hint.channelId);
		return policy && !policy.effective && policy.blockedReasons.length === 1 && policy.blockedReasons[0] === "no-channel-owner" ? [{
			...hint,
			channelId: hint.channelId
		}] : [];
	});
}
/** Resolves a repair hint only when a missing configured channel is blocked by no plugin owner. */
function resolveMissingOfficialExternalChannelPluginRepairHint(params) {
	return resolveMissingOfficialExternalChannelPluginRepairHints({
		config: params.config,
		activationSourceConfig: params.activationSourceConfig,
		channelIds: [params.channelId],
		workspaceDir: params.workspaceDir,
		env: params.env,
		manifestRecords: params.manifestRecords
	})[0] ?? null;
}
//#endregion
export { tracksPluginDependencyStatus as a, resolveOfficialExternalPluginRepairHint as i, resolveMissingOfficialExternalChannelPluginRepairHint as n, resolveMissingOfficialExternalChannelPluginRepairHints as r, resolveExternalPluginRuntimeDependencyRepairHint as t };
