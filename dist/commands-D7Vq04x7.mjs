import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-BvpWSO2L.mjs";
import { n as getLoadedChannelPlugin } from "./registry-DOE8N7Jo.mjs";
import "./plugins-Z9_SzFi0.mjs";
import { i as resolveReadOnlyChannelCommandDefaults } from "./read-only-command-defaults-B8kUMdL2.mjs";
//#region src/config/commands.ts
/** Resolves native skill exposure for a provider, with provider config overriding global config. */
function resolveNativeSkillsEnabled(params) {
	return resolveNativeCommandSetting(params, "nativeSkills");
}
/** Resolves native command exposure for a provider, with provider config overriding global config. */
function resolveNativeCommandsEnabled(params) {
	return resolveNativeCommandSetting(params, "native");
}
function resolveNativeCommandSetting(params, kind) {
	const { providerId, providerSetting, globalSetting, ...options } = params;
	const setting = providerSetting === void 0 ? globalSetting : providerSetting;
	if (typeof setting === "boolean") return setting;
	const id = normalizeAnyChannelId(providerId) ?? normalizeOptionalLowercaseString(providerId);
	if (!id) return false;
	if (typeof options.autoDefault === "boolean") return options.autoDefault;
	const commandDefaults = getLoadedChannelPlugin(id)?.commands ?? (options.config ? resolveReadOnlyChannelCommandDefaults(id, {
		...options,
		config: options.config
	}) : void 0);
	return kind === "native" ? commandDefaults?.nativeCommandsAutoEnabled === true : commandDefaults?.nativeSkillsAutoEnabled === true;
}
/** Returns true only when native commands are explicitly disabled by provider or inherited global config. */
function isNativeCommandsExplicitlyDisabled(params) {
	const { providerSetting, globalSetting } = params;
	return providerSetting === false || providerSetting === void 0 && globalSetting === false;
}
//#endregion
export { resolveNativeCommandsEnabled as n, resolveNativeSkillsEnabled as r, isNativeCommandsExplicitlyDisabled as t };
