import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { i as getActivePluginGatewayCommandRegistry } from "./runtime-wIYJz8NY.js";
import { t as getChannelPlugin } from "./registry-Ba1KQQW12.js";
import "./plugins-DnKj2WmH.js";
import { r as listChatCommandsForConfig } from "./commands-registry-list-Pb9MPbeS.js";
import { Pn as COMMAND_DESCRIPTION_MAX_LENGTH } from "./schema-Ctppm7Dp.js";
import { n as getPluginCommandEntrySpecsFromRegistrations, t as getPluginCommandEntrySpecs } from "./command-specs-Dd4UH3Gz.js";
import "./commands-registry-gLExuKrZ.js";
import { t as listSkillCommandsForAgents } from "./chat-commands-CKmd7VIS.js";
//#region src/gateway/server-methods/commands-list-result.ts
function clampString(value, maxLength) {
	return value.length > maxLength ? value.slice(0, maxLength) : value;
}
function trimClampNonEmpty(value, maxLength) {
	const trimmed = value.trim();
	if (!trimmed) return null;
	return clampString(trimmed, maxLength);
}
function clampDescription(value) {
	return clampString(value ?? "", COMMAND_DESCRIPTION_MAX_LENGTH);
}
function resolveNativeName(cmd, provider) {
	const baseName = cmd.nativeName ?? cmd.key;
	if (!provider || !cmd.nativeName) return baseName;
	return getChannelPlugin(provider)?.commands?.resolveNativeCommandName?.({
		commandKey: cmd.key,
		defaultName: cmd.nativeName
	}) ?? baseName;
}
function stripLeadingSlash(value) {
	return value.startsWith("/") ? value.slice(1) : value;
}
/** Resolves normalized text aliases, preserving slash-prefixed command names. */
function resolveTextAliases(cmd) {
	const seen = /* @__PURE__ */ new Set();
	const aliases = [];
	for (const alias of cmd.textAliases) {
		const trimmed = trimClampNonEmpty(alias, 200);
		if (!trimmed) continue;
		const exactAlias = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
		if (seen.has(exactAlias)) continue;
		seen.add(exactAlias);
		aliases.push(exactAlias);
		if (aliases.length >= 20) break;
	}
	if (aliases.length > 0) return aliases;
	return [`/${clampString(cmd.key, 200)}`];
}
function resolvePrimaryTextName(cmd) {
	return stripLeadingSlash(resolveTextAliases(cmd)[0] ?? `/${cmd.key}`);
}
/** Serializes a command argument into the bounded gateway protocol shape. */
function serializeArg(arg) {
	const isDynamic = typeof arg.choices === "function";
	const staticChoices = Array.isArray(arg.choices) ? arg.choices.slice(0, 50).map(normalizeChoice) : void 0;
	return {
		name: clampString(arg.name, 200),
		description: clampString(arg.description, 500),
		type: arg.type,
		...arg.required ? { required: true } : {},
		...staticChoices ? { choices: staticChoices } : {},
		...isDynamic ? { dynamic: true } : {}
	};
}
function normalizeChoice(choice) {
	if (typeof choice === "string") return {
		value: clampString(choice, 200),
		label: clampString(choice, 200)
	};
	return {
		value: clampString(choice.value, 200),
		label: clampString(choice.label, 200)
	};
}
function mapCommand(cmd, source, includeArgs, nameSurface, provider) {
	const shouldIncludeArgs = includeArgs && cmd.acceptsArgs && cmd.args?.length;
	const nativeName = cmd.scope === "text" ? void 0 : resolveNativeName(cmd, provider);
	return {
		name: clampString(nameSurface === "text" ? resolvePrimaryTextName(cmd) : nativeName ?? cmd.key, 200),
		...nativeName ? { nativeName: clampString(nativeName, 200) } : {},
		...cmd.scope !== "native" ? { textAliases: resolveTextAliases(cmd) } : {},
		description: clampDescription(cmd.description),
		...cmd.category ? { category: cmd.category } : {},
		source,
		scope: cmd.scope,
		acceptsArgs: Boolean(cmd.acceptsArgs),
		...shouldIncludeArgs ? { args: cmd.args.slice(0, 20).map(serializeArg) } : {}
	};
}
/** Builds plugin command entries from text specs plus provider-native metadata. */
function buildPluginCommandEntries(params) {
	const gatewayRegistry = getActivePluginGatewayCommandRegistry();
	const pluginSpecs = gatewayRegistry ? getPluginCommandEntrySpecsFromRegistrations(gatewayRegistry.commands, params.provider, { config: params.cfg }) : getPluginCommandEntrySpecs(params.provider, { config: params.cfg });
	const entries = [];
	for (const spec of pluginSpecs) entries.push({
		name: clampString(params.nameSurface === "text" ? spec.name : spec.nativeName ?? spec.name, 200),
		...spec.nativeName ? { nativeName: clampString(spec.nativeName, 200) } : {},
		textAliases: [`/${clampString(spec.name, 200)}`],
		description: clampDescription(spec.description),
		source: "plugin",
		scope: "both",
		acceptsArgs: spec.acceptsArgs
	});
	if (params.nameSurface === "native") return entries.filter((entry) => entry.nativeName);
	return entries;
}
/** Builds the public commands.list payload for an agent/provider/scope view. */
function buildCommandsListResult(params) {
	const includeArgs = params.includeArgs !== false;
	const scopeFilter = params.scope ?? "both";
	const nameSurface = scopeFilter === "text" ? "text" : "native";
	const provider = normalizeOptionalLowercaseString(params.provider);
	const skillCommands = listSkillCommandsForAgents({
		cfg: params.cfg,
		agentIds: [params.agentId]
	});
	const chatCommands = listChatCommandsForConfig(params.cfg, { skillCommands });
	const skillKeys = new Set(skillCommands.map((sc) => `skill:${sc.skillName}`));
	const commands = [];
	for (const cmd of chatCommands) {
		if (scopeFilter !== "both" && cmd.scope !== "both" && cmd.scope !== scopeFilter) continue;
		commands.push(mapCommand(cmd, skillKeys.has(cmd.key) ? "skill" : "native", includeArgs, nameSurface, provider));
	}
	commands.push(...buildPluginCommandEntries({
		provider,
		nameSurface,
		cfg: params.cfg
	}));
	return { commands: commands.slice(0, 500) };
}
//#endregion
export { buildCommandsListResult as t };
