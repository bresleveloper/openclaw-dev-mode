import { s as resolveAgentModelPrimaryValue } from "./model-input-CeM8o97s.mjs";
import "./defaults-Bg930vxE.mjs";
import { n as parseModelRef } from "./model-selection-normalize-DulZGI4S.mjs";
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
