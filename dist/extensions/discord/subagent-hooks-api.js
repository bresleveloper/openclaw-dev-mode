import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
//#region extensions/discord/subagent-hooks-api.ts
const loadDiscordSubagentHooksModule = createLazyRuntimeModule(() => import("./.setup/subagent-hooks-CjW7r8Pe.mjs").then((n) => n.r));
function registerDiscordSubagentHooks(api) {
	api.on("subagent_ended", async (event) => {
		const { ensureBindingsLoadedAsync, handleDiscordSubagentEnded } = await loadDiscordSubagentHooksModule();
		await ensureBindingsLoadedAsync();
		handleDiscordSubagentEnded(event);
	});
	api.on("subagent_delivery_target", async (event) => {
		const { handleDiscordSubagentDeliveryTargetAsync } = await loadDiscordSubagentHooksModule();
		return await handleDiscordSubagentDeliveryTargetAsync(event);
	});
}
//#endregion
export { registerDiscordSubagentHooks };
