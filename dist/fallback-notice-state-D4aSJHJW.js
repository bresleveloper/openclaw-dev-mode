import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as areRuntimeModelRefsEquivalent } from "./model-runtime-aliases-CZ8RT-Uc.js";
//#region src/status/fallback-notice-state.ts
function resolveActiveFallbackState(params) {
	const selected = normalizeOptionalString(params.state?.fallbackNoticeSelectedModel);
	const active = normalizeOptionalString(params.state?.fallbackNoticeActiveModel);
	const reason = normalizeOptionalString(params.state?.fallbackNoticeReason);
	const fallbackActive = !areRuntimeModelRefsEquivalent(params.selectedModelRef, params.activeModelRef, { config: params.config }) && selected === params.selectedModelRef && active === params.activeModelRef;
	return {
		active: fallbackActive,
		reason: fallbackActive ? reason : void 0
	};
}
//#endregion
export { resolveActiveFallbackState as t };
