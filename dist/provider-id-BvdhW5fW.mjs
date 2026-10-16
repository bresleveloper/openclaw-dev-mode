import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import "./model-ref-parse-BI8o1mtw.mjs";
//#region extensions/xai/provider-id.ts
const XAI_PROVIDER_IDS = /* @__PURE__ */ new Set(["xai", "x-ai"]);
function isXaiProviderId(provider) {
	return typeof provider === "string" && XAI_PROVIDER_IDS.has(normalizeProviderId(provider));
}
//#endregion
export { isXaiProviderId as t };
