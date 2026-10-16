import { DEEPINFRA_DEFAULT_MODEL_REF } from "./provider-static-catalog.js";
import { createAliasOnlyPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/deepinfra/onboard.ts
function applyDeepInfraConfig(cfg, modelRef = DEEPINFRA_DEFAULT_MODEL_REF) {
	return createAliasOnlyPresetAppliers({
		modelRef,
		alias: "DeepInfra"
	}).applyConfig(cfg);
}
//#endregion
export { applyDeepInfraConfig };
