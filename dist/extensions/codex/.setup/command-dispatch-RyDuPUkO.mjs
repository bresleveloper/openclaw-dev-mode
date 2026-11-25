import { o as formatCodexDisplayText } from "./command-formatters-CtPkCOdK.mjs";
import { n as describeControlFailure } from "./capabilities-C1G_nNP7.mjs";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
// extensions/codex/src/command-dispatch.ts
const loadCommandHandlers = createLazyRuntimeModule(() => import("./command-handlers-CVYJOjC2.mjs"));
async function handleCodexCommand(ctx, options) {
	const { resolvePluginConfig, ...subcommandOptions } = options;
	try {
		const { handleCodexSubcommand } = await loadCommandHandlers();
		return await handleCodexSubcommand(ctx, {
			...subcommandOptions,
			pluginConfig: resolvePluginConfig?.() ?? subcommandOptions.pluginConfig
		});
	} catch (error) {
		return { text: `Codex command failed: ${formatCodexDisplayText(describeControlFailure(error))}` };
	}
}
export { handleCodexCommand };
