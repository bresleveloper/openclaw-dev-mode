import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { y as requireActivePluginRegistry } from "./runtime-BvdPUus5.mjs";
import { t as listRegisteredPluginCommands } from "./plugin-command-registry-3YOixkIa.mjs";
import { n as getLoadedChannelPlugin } from "./registry-D3wOWFDo.mjs";
import "./plugins-BEpDh--e.mjs";
import { n as projectPluginCommandNativeMetadata, t as pluginCommandSupportsChannel } from "./plugin-command-metadata-DBJKw3Pr.mjs";
import { i as resolveReadOnlyChannelCommandDefaults } from "./read-only-command-defaults-CX1LEENG.mjs";
//#region src/plugins/command-specs.ts
function resolvePluginTextName(command) {
	return command.name.trim() || command.name;
}
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
	const providerName = normalizeOptionalLowercaseString(provider);
	const nativeCommandsEnabled = pluginNativeCommandsEnabled(providerName, options);
	return listRegisteredPluginCommands(requireActivePluginRegistry()).map((cmd) => serializePluginCommandEntrySpec(cmd, providerName, nativeCommandsEnabled)).filter((spec) => spec !== null);
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
	const spec = {
		name: metadata.name,
		description: metadata.description,
		acceptsArgs: metadata.acceptsArgs
	};
	if (metadata.descriptionLocalizations) spec.descriptionLocalizations = { ...metadata.descriptionLocalizations };
	return spec;
}
function serializePluginCommandEntrySpec(cmd, provider, nativeCommandsEnabled) {
	if (!pluginCommandSupportsChannel(cmd, provider)) return null;
	const nativeName = nativeCommandsEnabled ? projectPluginCommandNativeMetadata(cmd, provider).name : void 0;
	return {
		name: resolvePluginTextName(cmd),
		description: cmd.description.trim(),
		acceptsArgs: cmd.acceptsArgs ?? false,
		...nativeName ? { nativeName } : {},
		...cmd.clientPresentation ? { clientPresentation: cmd.clientPresentation } : {}
	};
}
//#endregion
export { listProviderPluginCommandSpecs as i, getPluginCommandEntrySpecsFromRegistrations as n, getPluginCommandSpecs as r, getPluginCommandEntrySpecs as t };
