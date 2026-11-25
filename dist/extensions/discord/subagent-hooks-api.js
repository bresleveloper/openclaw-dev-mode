import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
// extensions/discord/subagent-hooks-api.ts
const loadDiscordSubagentHooksModule = createLazyRuntimeModule(() => import("./.setup/subagent-hooks-CVmIOrAR.mjs").then((n) => n.i));
function registerDiscordSubagentHooks(api) {
	api.on("subagent_ended", async (event) => {
		const { handleDiscordSubagentEnded } = await loadDiscordSubagentHooksModule();
		await handleDiscordSubagentEnded(event);
	});
	api.on("subagent_delivery_target", async (event) => {
		const { handleDiscordSubagentDeliveryTargetAsync } = await loadDiscordSubagentHooksModule();
		return await handleDiscordSubagentDeliveryTargetAsync(event);
	});
}
export { registerDiscordSubagentHooks };
