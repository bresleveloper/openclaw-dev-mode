import { readProviderJsonResponse } from "openclaw/plugin-sdk/provider-http";
//#region extensions/feishu/src/json-response.ts
/** Feishu control-plane JSON responses are tiny; 16 MiB leaves ample headroom. */
const FEISHU_JSON_MAX_BYTES = 16777216;
async function readFeishuJsonResponse(response, label = "feishu.api") {
	return readProviderJsonResponse(response, label, { maxBytes: FEISHU_JSON_MAX_BYTES });
}
//#endregion
export { readFeishuJsonResponse as t };
