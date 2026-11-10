import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { i as getPluginRegistryForContext } from "./gateway-request-scope-1BXD1G3l.mjs";
import { gd as COMMAND_DESCRIPTION_MAX_LENGTH } from "./src-pLJQA6J5.mjs";
import { t as getChannelPlugin } from "./registry-B91r5qN6.mjs";
import "./plugins-CCVkYF8m.mjs";
import { r as listChatCommandsForConfig } from "./commands-registry-list-BWZj-KCw.mjs";
import { m as supportsNativeProvider } from "./commands-registry-CFDGAPH8.mjs";
import { n as getPluginCommandEntrySpecsFromRegistrations, t as getPluginCommandEntrySpecs } from "./command-specs-vKDKhDle.mjs";
import { i as prepareSkillCommandsForAgents } from "./chat-commands-C__qSMA1.mjs";
//#region src/gateway/server-methods/commands-list-result.ts
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
		const baseName = cmd.nativeName ?? cmd.key;
		const nativeName = cmd.scope === "text" ? void 0 : provider && cmd.nativeName ? getChannelPlugin(provider)?.commands?.resolveNativeCommandName?.({
			commandKey: cmd.key,
			defaultName: cmd.nativeName
		}) ?? baseName : baseName;
		let textAliases;
		if (cmd.scope !== "native") {
			const aliases = /* @__PURE__ */ new Set();
			for (const alias of cmd.textAliases) {
				const trimmed = alias.trim();
				if (!trimmed) continue;
				const bounded = truncateUtf16Safe(trimmed, 200);
				aliases.add(bounded.startsWith("/") ? bounded : `/${bounded}`);
				if (aliases.size >= 20) break;
			}
			textAliases = aliases.size > 0 ? [...aliases] : [`/${truncateUtf16Safe(cmd.key, 200)}`];
		}
		commands.push({
			name: truncateUtf16Safe(nameSurface === "text" ? textAliases?.[0]?.slice(1) ?? cmd.key : nativeName ?? cmd.key, 200),
			...nativeName ? { nativeName: truncateUtf16Safe(nativeName, 200) } : {},
			...textAliases ? { textAliases } : {},
			description: truncateUtf16Safe(cmd.description ?? "", COMMAND_DESCRIPTION_MAX_LENGTH),
			...cmd.category ? { category: cmd.category === "docks" ? "tools" : cmd.category } : {},
			source: skill ? "skill" : "native",
			scope: cmd.scope,
			acceptsArgs: Boolean(cmd.acceptsArgs),
			...includeArgs && cmd.acceptsArgs && cmd.args?.length ? { args: cmd.args.slice(0, 20).map((arg) => {
				const projected = {
					name: truncateUtf16Safe(arg.name, 200),
					description: truncateUtf16Safe(arg.description, 500),
					type: arg.type
				};
				if (arg.required) projected.required = true;
				if (Array.isArray(arg.choices)) projected.choices = arg.choices.slice(0, 50).map((choice) => ({
					value: truncateUtf16Safe(typeof choice === "string" ? choice : choice.value, 200),
					label: truncateUtf16Safe(typeof choice === "string" ? choice : choice.label, 200)
				}));
				if (typeof arg.choices === "function") projected.dynamic = true;
				return projected;
			}) } : {},
			...skill ? {
				skillDisplayName: truncateUtf16Safe(skill.displayName ?? skill.skillName, 200),
				skillModelVisible: skill.modelVisible !== false
			} : {}
		});
	}
	const gatewayRegistry = getPluginRegistryForContext();
	const pluginSpecs = gatewayRegistry ? getPluginCommandEntrySpecsFromRegistrations(gatewayRegistry.commands, provider, { config: params.cfg }) : getPluginCommandEntrySpecs(provider, { config: params.cfg });
	for (const spec of pluginSpecs) {
		if (nameSurface === "native" && !spec.nativeName) continue;
		commands.push({
			name: truncateUtf16Safe(nameSurface === "text" ? spec.name : spec.nativeName ?? spec.name, 200),
			...spec.nativeName ? { nativeName: truncateUtf16Safe(spec.nativeName, 200) } : {},
			textAliases: [`/${truncateUtf16Safe(spec.name, 200)}`],
			description: truncateUtf16Safe(spec.description ?? "", COMMAND_DESCRIPTION_MAX_LENGTH),
			source: "plugin",
			scope: "both",
			acceptsArgs: spec.acceptsArgs,
			...spec.clientPresentation ? { clientPresentation: spec.clientPresentation } : {}
		});
	}
	return { commands: commands.slice(0, 500) };
}
//#endregion
export { buildCommandsListResult as t };
