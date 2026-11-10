import { o as formatCodexDisplayText } from "./command-formatters-B_7-QZ1c.mjs";
import { n as describeControlFailure } from "./capabilities-Cul-h11D.mjs";
//#region extensions/codex/src/command-dispatch.ts
async function handleCodexCommand(ctx, options) {
	const commandContext = {
		...ctx,
		gatewayClientScopes: ctx.gatewayClientScopes?.slice()
	};
	const { resolvePluginConfig, ...subcommandOptions } = options;
	try {
		const { handleCodexSubcommand } = await import("./command-handlers-DDkG87L4.mjs");
		return await handleCodexSubcommand(commandContext, {
			...subcommandOptions,
			pluginConfig: resolvePluginConfig?.() ?? subcommandOptions.pluginConfig
		});
	} catch (error) {
		return { text: `Codex command failed: ${formatCodexDisplayText(describeControlFailure(error))}` };
	}
}
//#endregion
export { handleCodexCommand };
