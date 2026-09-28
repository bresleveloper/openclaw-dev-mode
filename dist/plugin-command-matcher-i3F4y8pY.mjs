import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { t as pluginCommandSupportsChannel } from "./plugin-command-metadata-DBJKw3Pr.mjs";
//#region src/plugins/plugin-command-matcher.ts
function matchesInvocationName(command, aliasScope, candidateName) {
	let matched = normalizeOptionalLowercaseString(command.name) === candidateName;
	if (aliasScope.kind === "all") {
		for (const alias of Object.values(command.nativeNames ?? {})) if (typeof alias === "string" && normalizeOptionalLowercaseString(alias) === candidateName) matched = true;
		return matched;
	}
	const provider = normalizeOptionalLowercaseString(aliasScope.provider);
	const providerAlias = provider ? command.nativeNames?.[provider] : void 0;
	const aliasName = typeof providerAlias === "string" ? providerAlias : command.nativeNames?.default;
	return normalizeOptionalLowercaseString(aliasName) === candidateName || matched;
}
function parsePluginInvocation(commandBody) {
	const commandMatch = commandBody.trim().match(/^\/\s*([^\s]+)(?:\s+([\s\S]*))?$/);
	if (!commandMatch) return null;
	const key = normalizeLowercaseStringOrEmpty(`/${commandMatch[1]}`);
	return {
		keys: [.../* @__PURE__ */ new Set([
			key,
			key.replace(/_/g, "-"),
			key.replace(/-/g, "_")
		])],
		args: commandMatch[2]?.trim() || void 0
	};
}
function matchRegisteredPluginCommand(params) {
	const invocation = parsePluginInvocation(params.commandBody);
	if (!invocation) return null;
	const { keys, args } = invocation;
	for (const candidateKey of keys) {
		const candidateName = candidateKey.slice(1);
		const command = params.commands.find((candidate) => pluginCommandSupportsChannel(candidate, params.channel) && matchesInvocationName(candidate, params.aliasScope, candidateName));
		if (command) return args && !command.acceptsArgs ? null : {
			command,
			args
		};
	}
	return null;
}
//#endregion
export { parsePluginInvocation as n, matchRegisteredPluginCommand as t };
