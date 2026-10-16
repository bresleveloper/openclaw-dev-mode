import { s as resolveAgentModelPrimaryValue } from "./model-input-C9K4a_6k.mjs";
import "./defaults-Jag53zwP.mjs";
import { n as parseModelRef } from "./model-selection-normalize-AjjSfI-g.mjs";
//#region src/commands/doctor/shared/primary-model-ref.ts
function resolveDoctorPrimaryModelRef(cfg, agentModel) {
	const raw = resolveAgentModelPrimaryValue(agentModel) ?? resolveAgentModelPrimaryValue(cfg.agents?.defaults?.model) ?? "gpt-6-astra";
	return parseModelRef(raw, "openai", { allowPluginNormalization: false }) ?? {
		provider: "openai",
		model: "gpt-6-astra"
	};
}
//#endregion
export { resolveDoctorPrimaryModelRef as t };
