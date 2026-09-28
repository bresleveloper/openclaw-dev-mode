import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
//#region extensions/feishu/subagent-hooks-api.ts
const loadFeishuSubagentHooksModule = createLazyRuntimeModule(() => import("./.setup/subagent-hooks-BBfF1hZk.mjs").then((n) => n.r));
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
export { registerFeishuSubagentHooks };
