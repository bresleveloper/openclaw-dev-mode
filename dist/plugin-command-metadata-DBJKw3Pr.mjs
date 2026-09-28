import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
//#region src/plugins/plugin-command-metadata.ts
function pluginCommandSupportsChannel(command, channel) {
	if (!command.channels || command.channels.length === 0 || !channel) return true;
	const normalizedChannel = normalizeOptionalLowercaseString(channel);
	return command.channels.some((entry) => normalizeOptionalLowercaseString(entry) === normalizedChannel);
}
/** Projects the safe provider-native metadata shared by catalog and runtime surfaces. */
function projectPluginCommandNativeMetadata(command, provider) {
	const normalizedProvider = normalizeOptionalLowercaseString(provider);
	const providerName = normalizedProvider ? command.nativeNames?.[normalizedProvider] : void 0;
	const defaultName = command.nativeNames?.default;
	const name = typeof providerName === "string" && providerName.trim() ? providerName.trim() : typeof defaultName === "string" && defaultName.trim() ? defaultName.trim() : command.name.trim() || command.name;
	const providerProgress = normalizedProvider ? command.nativeProgressMessages?.[normalizedProvider] : void 0;
	const defaultProgress = command.nativeProgressMessages?.default;
	const progressMessage = typeof providerProgress === "string" && providerProgress.trim() ? providerProgress.trim() : typeof defaultProgress === "string" && defaultProgress.trim() ? defaultProgress.trim() : void 0;
	const descriptionLocalizations = command.descriptionLocalizations ? Object.freeze({ ...command.descriptionLocalizations }) : void 0;
	return Object.freeze({
		name,
		description: command.description.trim(),
		...descriptionLocalizations ? { descriptionLocalizations } : {},
		acceptsArgs: command.acceptsArgs ?? false,
		requireAuth: command.requireAuth !== false,
		...progressMessage ? { progressMessage } : {}
	});
}
//#endregion
export { projectPluginCommandNativeMetadata as n, pluginCommandSupportsChannel as t };
