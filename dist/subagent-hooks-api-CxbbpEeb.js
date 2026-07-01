//#region extensions/feishu/subagent-hooks-api.ts
let feishuSubagentHooksPromise = null;
function loadFeishuSubagentHooksModule() {
	feishuSubagentHooksPromise ??= import("./subagent-hooks-BVR6_Gim.js");
	return feishuSubagentHooksPromise;
}
function registerFeishuSubagentHooks(api) {
	api.on("subagent_delivery_target", async (event) => {
		const { handleFeishuSubagentDeliveryTarget } = await loadFeishuSubagentHooksModule();
		return handleFeishuSubagentDeliveryTarget(event);
	});
	api.on("subagent_ended", async (event) => {
		const { handleFeishuSubagentEnded } = await loadFeishuSubagentHooksModule();
		handleFeishuSubagentEnded(event);
	});
}
//#endregion
export { registerFeishuSubagentHooks as t };
