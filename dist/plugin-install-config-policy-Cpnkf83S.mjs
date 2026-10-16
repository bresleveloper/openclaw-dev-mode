import { a as resolvePluginInstallRequestContext } from "./install-config-BzMqqnd7.mjs";
//#region src/cli/plugin-install-config-policy.ts
function resolvePluginInstallArgvTokens(commandPath, argv) {
	const args = argv.slice(2);
	let cursor = 0;
	for (const segment of commandPath) {
		while (cursor < args.length && args[cursor] !== segment) cursor += 1;
		if (cursor >= args.length) return [];
		cursor += 1;
	}
	return args.slice(cursor);
}
function resolvePluginInstallArgvRequest(commandPath, argv) {
	const tokens = resolvePluginInstallArgvTokens(commandPath, argv);
	let rawSpec = null;
	let marketplace;
	for (let index = 0; index < tokens.length; index += 1) {
		const token = tokens.at(index);
		if (token === void 0) break;
		if (token.startsWith("--marketplace=")) {
			marketplace = token.slice(14);
			continue;
		}
		if (token === "--marketplace") {
			const value = tokens[index + 1];
			if (typeof value === "string") {
				marketplace = value;
				index += 1;
			}
			continue;
		}
		if (token.startsWith("-")) continue;
		rawSpec ??= token;
	}
	return rawSpec ? {
		rawSpec,
		marketplace
	} : null;
}
/** Recover the plugin install request from Commander state plus raw argv fallback parsing. */
function resolvePluginInstallPreactionRequest(params) {
	if (params.commandPath[0] !== "plugins" || params.commandPath[1] !== "install") return null;
	const argvRequest = resolvePluginInstallArgvRequest(params.commandPath, params.argv);
	const opts = params.actionCommand.opts();
	const marketplace = (typeof opts.marketplace === "string" && opts.marketplace.trim() ? opts.marketplace : argvRequest?.marketplace) || void 0;
	const rawSpec = (typeof params.actionCommand.processedArgs?.[0] === "string" ? params.actionCommand.processedArgs[0] : argvRequest?.rawSpec) ?? null;
	if (!rawSpec) return null;
	const request = resolvePluginInstallRequestContext({
		rawSpec,
		marketplace
	});
	return request.ok ? request.request : null;
}
//#endregion
export { resolvePluginInstallPreactionRequest };
