import { o as formatCodexDisplayText } from "./command-formatters-Bmqvr9tO.mjs";
import { n as describeControlFailure } from "./capabilities-CDXOOFdZ.mjs";
//#region extensions/codex/src/command-dispatch.ts
/** Dispatches a `/codex` command to the lazily loaded handler. */
async function handleCodexCommand(ctx, options) {
	const commandContext = {
		...ctx,
		gatewayClientScopes: ctx.gatewayClientScopes?.slice()
	};
	const { loadSubcommandHandler, resolvePluginConfig, ...subcommandOptions } = options;
	try {
		return await (loadSubcommandHandler ? await loadSubcommandHandler() : await loadDefaultCodexSubcommandHandler())(commandContext, {
			...subcommandOptions,
			pluginConfig: resolvePluginConfig?.() ?? subcommandOptions.pluginConfig
		});
	} catch (error) {
		return { text: `Codex command failed: ${formatCodexDisplayText(describeControlFailure(error))}` };
	}
}
async function loadDefaultCodexSubcommandHandler() {
	const { handleCodexSubcommand } = await import("./command-handlers-DW7Lx9oH.mjs");
	return handleCodexSubcommand;
}
//#endregion
export { handleCodexCommand };
