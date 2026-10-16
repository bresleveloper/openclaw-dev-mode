import { canonicalizeBase64 } from "openclaw/plugin-sdk/realtime-voice-provider";
//#region extensions/google/base64.ts
/**
* Convert a ProtoJSON URL-safe Base64 payload to the standard alphabet without
* validating the payload. Returns undefined when the input mixes alphabets, so
* callers can reject it before the shared strict validator runs once.
*/
function toStandardGoogleProviderBase64(value) {
	const usesStandardAlphabet = value.includes("+") || value.includes("/");
	const usesUrlSafeAlphabet = value.includes("-") || value.includes("_");
	if (usesStandardAlphabet && usesUrlSafeAlphabet) return;
	return usesUrlSafeAlphabet ? value.replace(/[-_]/g, (symbol) => symbol === "-" ? "+" : "/") : value;
}
function canonicalizeGoogleProviderBase64(value) {
	const standard = toStandardGoogleProviderBase64(value);
	return standard === void 0 ? void 0 : canonicalizeBase64(standard);
}
//#endregion
export { canonicalizeGoogleProviderBase64 };
