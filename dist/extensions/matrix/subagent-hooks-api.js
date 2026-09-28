import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
//#region extensions/matrix/subagent-hooks-api.ts
const loadMatrixSubagentHooksModule = createLazyRuntimeModule(() => import("./.setup/subagent-hooks-jFgft_Mr.mjs"));
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
//#endregion
export { registerMatrixSubagentHooks };
