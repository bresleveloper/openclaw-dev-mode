import { o as formatCodexDisplayText } from "./command-formatters-DV3DHhdr.mjs";
import { n as describeControlFailure } from "./capabilities-kQntafj_.mjs";
//#region extensions/codex/src/command-dispatch.ts
/** Dispatches a `/codex` command to the lazily loaded handler. */
async function handleCodexCommand(ctx, options) {
	const commandContext = {
		...ctx,
		gatewayClientScopes: ctx.gatewayClientScopes?.slice()
	};
	const { resolvePluginConfig, ...subcommandOptions } = options;
	try {
		const { handleCodexSubcommand } = await import("./command-handlers-QRqHGuRy.mjs");
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
