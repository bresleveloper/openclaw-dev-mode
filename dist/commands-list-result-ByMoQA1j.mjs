import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as getPluginRegistryForContext } from "./gateway-request-scope-BSmCVVpP.mjs";
import { ad as COMMAND_DESCRIPTION_MAX_LENGTH } from "./src-l2dWvEsN.mjs";
import { t as getChannelPlugin } from "./registry-DOE8N7Jo.mjs";
import "./plugins-Z9_SzFi0.mjs";
import { r as listChatCommandsForConfig } from "./commands-registry-list-DrLhyfgr.mjs";
import { p as supportsNativeProvider } from "./commands-registry-DcFr3mpT.mjs";
import { n as getPluginCommandEntrySpecsFromRegistrations, t as getPluginCommandEntrySpecs } from "./command-specs-D-oMHY44.mjs";
import { i as prepareSkillCommandsForAgents } from "./chat-commands-DPNB2D7k.mjs";
//#region src/gateway/server-methods/commands-list-result.ts
function trimClampNonEmpty(value, maxLength) {
	const trimmed = value.trim();
	if (!trimmed) return null;
	return truncateUtf16Safe(trimmed, maxLength);
}
function clampDescription(value) {
	return truncateUtf16Safe(value ?? "", COMMAND_DESCRIPTION_MAX_LENGTH);
}
function resolveNativeName(cmd, provider) {
	const baseName = cmd.nativeName ?? cmd.key;
	if (!provider || !cmd.nativeName) return baseName;
	return getChannelPlugin(provider)?.commands?.resolveNativeCommandName?.({
		commandKey: cmd.key,
		defaultName: cmd.nativeName
	}) ?? baseName;
}
function resolveTextAliases(cmd) {
	const aliases = /* @__PURE__ */ new Set();
	for (const alias of cmd.textAliases) {
		const trimmed = trimClampNonEmpty(alias, 200);
		if (!trimmed) continue;
		aliases.add(trimmed.startsWith("/") ? trimmed : `/${trimmed}`);
		if (aliases.size >= 20) break;
	}
	return aliases.size > 0 ? [...aliases] : [`/${truncateUtf16Safe(cmd.key, 200)}`];
}
function serializeArg(arg) {
	const isDynamic = typeof arg.choices === "function";
	const staticChoices = Array.isArray(arg.choices) ? arg.choices.slice(0, 50).map(normalizeChoice) : void 0;
	return {
		name: truncateUtf16Safe(arg.name, 200),
		description: truncateUtf16Safe(arg.description, 500),
		type: arg.type,
		...arg.required ? { required: true } : {},
		...staticChoices ? { choices: staticChoices } : {},
		...isDynamic ? { dynamic: true } : {}
	};
}
function normalizeChoice(choice) {
	return {
		value: truncateUtf16Safe(typeof choice === "string" ? choice : choice.value, 200),
		label: truncateUtf16Safe(typeof choice === "string" ? choice : choice.label, 200)
	};
}
function mapCommand(cmd, source, includeArgs, nameSurface, provider) {
	const shouldIncludeArgs = includeArgs && cmd.acceptsArgs && cmd.args?.length;
	const nativeName = cmd.scope === "text" ? void 0 : resolveNativeName(cmd, provider);
	const textAliases = cmd.scope !== "native" ? resolveTextAliases(cmd) : void 0;
	return {
		name: truncateUtf16Safe(nameSurface === "text" ? textAliases?.[0]?.slice(1) ?? cmd.key : nativeName ?? cmd.key, 200),
		...nativeName ? { nativeName: truncateUtf16Safe(nativeName, 200) } : {},
		...textAliases ? { textAliases } : {},
		description: clampDescription(cmd.description),
		...cmd.category ? { category: cmd.category === "docks" ? "tools" : cmd.category } : {},
		source,
		scope: cmd.scope,
		acceptsArgs: Boolean(cmd.acceptsArgs),
		...shouldIncludeArgs ? { args: cmd.args.slice(0, 20).map(serializeArg) } : {}
	};
}
function buildPluginCommandEntries(params) {
	const gatewayRegistry = getPluginRegistryForContext();
	const pluginSpecs = gatewayRegistry ? getPluginCommandEntrySpecsFromRegistrations(gatewayRegistry.commands, params.provider, { config: params.cfg }) : getPluginCommandEntrySpecs(params.provider, { config: params.cfg });
	const eligibleSpecs = params.nameSurface === "native" ? pluginSpecs.filter((spec) => spec.nativeName) : pluginSpecs;
	const entries = [];
	for (const spec of eligibleSpecs) entries.push({
		name: truncateUtf16Safe(params.nameSurface === "text" ? spec.name : spec.nativeName ?? spec.name, 200),
		...spec.nativeName ? { nativeName: truncateUtf16Safe(spec.nativeName, 200) } : {},
		textAliases: [`/${truncateUtf16Safe(spec.name, 200)}`],
		description: clampDescription(spec.description),
		source: "plugin",
		scope: "both",
		acceptsArgs: spec.acceptsArgs,
		...spec.clientPresentation ? { clientPresentation: spec.clientPresentation } : {}
	});
	return entries;
}
async function buildCommandsListResult(params) {
	const includeArgs = params.includeArgs !== false;
	const scopeFilter = params.scope ?? "both";
	const nameSurface = scopeFilter === "text" ? "text" : "native";
	const provider = normalizeOptionalLowercaseString(params.provider);
	const skillCommands = await prepareSkillCommandsForAgents({
		cfg: params.cfg,
		agentIds: [params.agentId],
		sessionEntry: params.sessionEntry,
		sessionKey: params.sessionKey
	});
	const chatCommands = listChatCommandsForConfig(params.cfg, { skillCommands });
	const skillsByKey = new Map(skillCommands.map((skill) => [`skill:${skill.skillName}`, skill]));
	const commands = [];
	for (const cmd of chatCommands) {
		if (scopeFilter !== "both" && cmd.scope !== "both" && cmd.scope !== scopeFilter) continue;
		if (nameSurface === "native" && cmd.scope !== "text" && provider && !supportsNativeProvider(cmd, provider)) continue;
		const skill = skillsByKey.get(cmd.key);
		commands.push({
			...mapCommand(cmd, skill ? "skill" : "native", includeArgs, nameSurface, provider),
			...skill ? {
				skillDisplayName: truncateUtf16Safe(skill.displayName ?? skill.skillName, 200),
				skillModelVisible: skill.modelVisible !== false
			} : {}
		});
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
