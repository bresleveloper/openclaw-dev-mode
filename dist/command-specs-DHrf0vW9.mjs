import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { v as requireActivePluginRegistry } from "./runtime-DfYPSUKC.mjs";
import { t as listRegisteredPluginCommands } from "./plugin-command-registry-DJl3dxiE.mjs";
import { n as getLoadedChannelPlugin } from "./registry-DOE8N7Jo.mjs";
import "./plugins-Z9_SzFi0.mjs";
import { n as projectPluginCommandNativeMetadata, t as pluginCommandSupportsChannel } from "./plugin-command-metadata-BOq2c1ES.mjs";
import { i as resolveReadOnlyChannelCommandDefaults } from "./read-only-command-defaults-B8kUMdL2.mjs";
//#region src/plugins/command-specs.ts
function pluginNativeCommandsEnabled(providerName, options) {
	if (!providerName) return true;
	const commandDefaults = options.config ? resolveReadOnlyChannelCommandDefaults(providerName, {
		...options,
		config: options.config
	}) : void 0;
	return (getLoadedChannelPlugin(providerName)?.commands ?? commandDefaults)?.nativeCommandsAutoEnabled === true;
}
function getPluginCommandSpecs(provider, options = {}) {
	const providerName = normalizeOptionalLowercaseString(provider);
	if (!pluginNativeCommandsEnabled(providerName, options)) return [];
	return listProviderPluginCommandSpecs(providerName);
}
function getPluginCommandEntrySpecs(provider, options = {}) {
	return getPluginCommandEntrySpecsFromRegistrations(requireActivePluginRegistry().commands, provider, options);
}
function getPluginCommandEntrySpecsFromRegistrations(commands, provider, options = {}) {
	const providerName = normalizeOptionalLowercaseString(provider);
	const nativeCommandsEnabled = pluginNativeCommandsEnabled(providerName, options);
	return commands.map((entry) => serializePluginCommandEntrySpec(entry.command, providerName, nativeCommandsEnabled)).filter((spec) => spec !== null);
}
/** Resolve plugin command specs for a provider's native naming surface without support gating. */
function listProviderPluginCommandSpecs(provider) {
	return listRegisteredPluginCommands(requireActivePluginRegistry()).filter((cmd) => pluginCommandSupportsChannel(cmd, provider)).map((cmd) => serializePluginCommandSpec(cmd, provider));
}
function serializePluginCommandSpec(cmd, provider) {
	const metadata = projectPluginCommandNativeMetadata(cmd, provider);
	return {
		name: metadata.name,
		description: metadata.description,
		acceptsArgs: metadata.acceptsArgs,
		...metadata.descriptionLocalizations ? { descriptionLocalizations: { ...metadata.descriptionLocalizations } } : {}
	};
}
function serializePluginCommandEntrySpec(cmd, provider, nativeCommandsEnabled) {
	if (!pluginCommandSupportsChannel(cmd, provider)) return null;
	const nativeName = nativeCommandsEnabled ? projectPluginCommandNativeMetadata(cmd, provider).name : void 0;
	return {
		name: cmd.name.trim() || cmd.name,
		description: cmd.description.trim(),
		acceptsArgs: cmd.acceptsArgs ?? false,
		...nativeName ? { nativeName } : {},
		...cmd.clientPresentation ? { clientPresentation: cmd.clientPresentation } : {}
	};
}
//#endregion
export { listProviderPluginCommandSpecs as i, getPluginCommandEntrySpecsFromRegistrations as n, getPluginCommandSpecs as r, getPluginCommandEntrySpecs as t };
