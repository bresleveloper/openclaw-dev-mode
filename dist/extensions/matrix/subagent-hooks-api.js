import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
// extensions/matrix/subagent-hooks-api.ts
const loadMatrixSubagentHooksModule = createLazyRuntimeModule(() => import("./.setup/subagent-hooks-BdbuojSv.mjs"));
function registerMatrixSubagentHooks(api) {
	api.on("subagent_ended", async (event) => {
		const { handleMatrixSubagentEnded } = await loadMatrixSubagentHooksModule();
		await handleMatrixSubagentEnded(event);
	});
	api.on("subagent_delivery_target", async (event) => {
		const { handleMatrixSubagentDeliveryTarget } = await loadMatrixSubagentHooksModule();
		return handleMatrixSubagentDeliveryTarget(event);
	});
}
export { registerMatrixSubagentHooks };
