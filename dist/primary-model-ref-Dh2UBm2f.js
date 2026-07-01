import { i as resolveAgentModelPrimaryValue } from "./model-input-BHKiDwaq.js";
import "./defaults-mDjiWzE5.js";
import { c as parseModelRef } from "./model-selection-normalize-Df7baLev.js";
//#region src/commands/doctor/shared/primary-model-ref.ts
function resolveDoctorPrimaryModelRef(cfg, agentModel) {
	return parseModelRef(resolveAgentModelPrimaryValue(agentModel) ?? resolveAgentModelPrimaryValue(cfg.agents?.defaults?.model) ?? "gpt-5.5", "openai", { allowPluginNormalization: false }) ?? {
		provider: "openai",
		model: "gpt-5.5"
	};
}
//#endregion
export { resolveDoctorPrimaryModelRef as t };
