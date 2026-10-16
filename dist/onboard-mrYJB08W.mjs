//#region extensions/fal/onboard.ts
const FAL_DEFAULT_IMAGE_MODEL_REF = "fal/fal-ai/flux/dev";
function applyFalConfig(cfg) {
	if (cfg.agents?.defaults?.mediaModels?.image) return cfg;
	return {
		...cfg,
		agents: {
			...cfg.agents,
			defaults: {
				...cfg.agents?.defaults,
				mediaModels: {
					...cfg.agents?.defaults?.mediaModels,
					image: { primary: FAL_DEFAULT_IMAGE_MODEL_REF }
				}
			}
		}
	};
}
//#endregion
export { applyFalConfig as t };
