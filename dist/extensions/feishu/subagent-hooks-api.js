import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
// extensions/feishu/subagent-hooks-api.ts
const loadFeishuSubagentHooksModule = createLazyRuntimeModule(() => import("./.setup/subagent-hooks-BRem84Mh.mjs").then((n) => n.r));
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
export { registerFeishuSubagentHooks };
