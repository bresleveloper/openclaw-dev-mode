import { asOptionalRecord, readStringField } from "openclaw/plugin-sdk/string-coerce-runtime";
import "openclaw/plugin-sdk/provider-http";
//#region extensions/minimax/media-provider-runtime.ts
function assertMinimaxBaseResp(value, context) {
	const baseResp = asOptionalRecord(value);
	if (baseResp && typeof baseResp.status_code === "number" && baseResp.status_code !== 0) throw new Error(`${context} (${baseResp.status_code}): ${readStringField(baseResp, "status_msg") ?? "unknown error"}`);
}
function normalizeMinimaxHexAudio(data, label) {
	const normalized = data.trim();
	if (!/^[0-9a-f]+$/iu.test(normalized) || normalized.length % 2 !== 0) throw new Error(`${label} returned malformed hex audio`);
	return normalized;
}
//#endregion
export { assertMinimaxBaseResp, normalizeMinimaxHexAudio };
