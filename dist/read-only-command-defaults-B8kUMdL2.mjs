import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { r as STATE_DIR } from "./paths-DGIwWbpu.mjs";
import { r as isInstalledPluginEnabled } from "./installed-plugin-index-Zl-RSskC.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-6weqkLDz.mjs";
//#region src/channels/plugins/read-only-command-defaults.ts
const SAFE_MANIFEST_CHANNEL_ID_PATTERN = /^[a-z0-9][a-z0-9_-]{0,63}$/i;
/**
* Returns whether a manifest channel id is safe for own-property lookup.
*/
function isSafeManifestChannelId(channelId) {
	return SAFE_MANIFEST_CHANNEL_ID_PATTERN.test(channelId) && !isBlockedObjectKey(channelId);
}
/**
* Reads an own record property while blocking prototype-polluting keys.
*/
function readOwnRecordValue(record, key) {
	if (isBlockedObjectKey(key) || !Object.hasOwn(record, key)) return;
	return record[key];
}
/**
* Normalizes manifest command defaults down to supported boolean fields.
*/
function normalizeChannelCommandDefaults(value) {
	if (!value) return;
	const defaults = {};
	for (const key of ["nativeCommandsAutoEnabled", "nativeSkillsAutoEnabled"]) if (typeof value[key] === "boolean") defaults[key] = value[key];
	return Object.keys(defaults).length > 0 ? defaults : void 0;
}
/**
* Resolves command defaults from enabled installed plugin metadata without loading plugins.
*/
function resolveReadOnlyChannelCommandDefaults(channelId, options) {
	const normalizedChannelId = normalizeOptionalString(channelId) ?? "";
	if (!normalizedChannelId || !isSafeManifestChannelId(normalizedChannelId)) return;
	const env = options.env ?? process.env;
	const resolvedSnapshot = resolvePluginMetadataSnapshot({
		config: options.config,
		stateDir: options.stateDir !== void 0 && options.stateDir === (env === process.env ? STATE_DIR : resolveStateDir(env)) ? void 0 : options.stateDir,
		workspaceDir: options.workspaceDir,
		env,
		allowWorkspaceScopedCurrent: true
	});
	for (const record of resolvedSnapshot.plugins) {
		if (!record.channels.includes(normalizedChannelId)) continue;
		if (!isInstalledPluginEnabled(resolvedSnapshot.index, record.id, options.config)) continue;
		const channelConfigValue = record.channelConfigs ? readOwnRecordValue(record.channelConfigs, normalizedChannelId) : void 0;
		const channelConfig = channelConfigValue && typeof channelConfigValue === "object" && !Array.isArray(channelConfigValue) ? channelConfigValue : void 0;
		const catalogCommands = record.channelCatalogMeta?.id === normalizedChannelId ? record.channelCatalogMeta.commands : void 0;
		const commands = normalizeChannelCommandDefaults(channelConfig?.commands ?? catalogCommands);
		if (commands) return commands;
	}
}
//#endregion
export { resolveReadOnlyChannelCommandDefaults as i, normalizeChannelCommandDefaults as n, readOwnRecordValue as r, isSafeManifestChannelId as t };
