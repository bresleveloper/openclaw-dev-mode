import { normalizeOptionalLowercaseString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/pixverse/constants.ts
const PIXVERSE_PROVIDER_ID = "pixverse";
const PIXVERSE_BASE_URL_BY_REGION = {
	international: "https://app-api.pixverse.ai/openapi/v2",
	cn: "https://app-api.pixverseai.cn/openapi/v2"
};
const DEFAULT_PIXVERSE_REGION = "international";
const DEFAULT_PIXVERSE_MODEL_ID = "v6";
const PIXVERSE_DEFAULT_VIDEO_MODEL_REF = `${PIXVERSE_PROVIDER_ID}/v6`;
function normalizePixVerseRegion(value) {
	switch (normalizeOptionalLowercaseString(value)) {
		case "cn":
		case "china":
		case "mainland":
		case "pai": return "cn";
		case "global":
		case "intl":
		case "international": return "international";
		default: return;
	}
}
//#endregion
export { DEFAULT_PIXVERSE_MODEL_ID, DEFAULT_PIXVERSE_REGION, PIXVERSE_BASE_URL_BY_REGION, PIXVERSE_DEFAULT_VIDEO_MODEL_REF, PIXVERSE_PROVIDER_ID, normalizePixVerseRegion };
