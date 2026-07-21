import { i as resolveAgentModelPrimaryValue } from "./model-input-B5RmygIK.js";
import { r as logConfigUpdated } from "./logging-Bmyw9sby.js";
import { d as updateConfig, t as applyDefaultModelPrimaryUpdate } from "./shared-BPNNLkzQ.js";
//#region src/commands/models/set-image.ts
/** Command for setting the default image model. */
/** Sets agents.defaults.imageModel.primary after resolving aliases/catalog provider aliases. */
async function modelsSetImageCommand(modelRaw, runtime) {
	const updated = await updateConfig((cfg) => {
		return applyDefaultModelPrimaryUpdate({
			cfg,
			modelRaw,
			field: "imageModel"
		});
	});
	logConfigUpdated(runtime);
	runtime.log(`Image model: ${resolveAgentModelPrimaryValue(updated.agents?.defaults?.imageModel) ?? modelRaw}`);
}
//#endregion
export { modelsSetImageCommand };
