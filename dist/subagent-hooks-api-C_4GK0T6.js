//#region extensions/discord/subagent-hooks-api.ts
let discordSubagentHooksPromise = null;
function loadDiscordSubagentHooksModule() {
	discordSubagentHooksPromise ??= import("./subagent-hooks-DcxpFd7u.js");
	return discordSubagentHooksPromise;
}
function registerDiscordSubagentHooks(api) {
	api.on("subagent_ended", async (event) => {
		const { handleDiscordSubagentEnded } = await loadDiscordSubagentHooksModule();
		handleDiscordSubagentEnded(event);
	});
	api.on("subagent_delivery_target", async (event) => {
		const { handleDiscordSubagentDeliveryTarget } = await loadDiscordSubagentHooksModule();
		return handleDiscordSubagentDeliveryTarget(event);
	});
}
//#endregion
export { registerDiscordSubagentHooks as t };
