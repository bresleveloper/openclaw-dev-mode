import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as areRuntimeModelRefsEquivalent } from "./model-runtime-aliases-CJA2j26Y.mjs";
//#region src/status/fallback-notice-state.ts
function resolveActiveFallbackState(params) {
	const selected = normalizeOptionalString(params.state?.fallbackNotice?.selectedModel);
	const active = normalizeOptionalString(params.state?.fallbackNotice?.activeModel);
	const reason = normalizeOptionalString(params.state?.fallbackNotice?.reason);
	const fallbackActive = selected === params.selectedModelRef && active === params.activeModelRef && !areRuntimeModelRefsEquivalent(params.selectedModelRef, params.activeModelRef, { config: params.config });
	return {
		active: fallbackActive,
		reason: fallbackActive ? reason : void 0
	};
}
//#endregion
export { resolveActiveFallbackState as t };
