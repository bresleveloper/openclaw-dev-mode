import { r as createLazyRuntimeModule } from "./lazy-runtime-BgpbKGBP.js";
//#region extensions/matrix/subagent-hooks-api.ts
const loadMatrixSubagentHooksModule = createLazyRuntimeModule(() => import("./subagent-hooks-BnsQEV8E.js"));
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
export { registerMatrixSubagentHooks as t };
