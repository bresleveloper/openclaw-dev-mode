import { withAgentModelAliases } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/opencode/onboard.ts
const OPENCODE_ZEN_DEFAULT_MODEL_REF = "opencode/claude-opus-5";
function applyOpencodeZenProviderConfig(cfg) {
	return {
		...cfg,
		agents: {
			...cfg.agents,
			defaults: {
				...cfg.agents?.defaults,
				models: withAgentModelAliases(cfg.agents?.defaults?.models, [{
					modelRef: OPENCODE_ZEN_DEFAULT_MODEL_REF,
					alias: "Opus"
				}])
			}
		}
	};
}
//#endregion
export { OPENCODE_ZEN_DEFAULT_MODEL_REF, applyOpencodeZenProviderConfig };
