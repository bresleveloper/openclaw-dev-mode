import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
//#region src/secrets/model-provider-header-policy.ts
/** Classifies model-provider request headers that should be treated as credential material. */
const SENSITIVE_MODEL_PROVIDER_HEADER_NAME_FRAGMENTS = [
	"api-key",
	"apikey",
	"token",
	"secret",
	"password",
	"credential"
];
/**
* Returns whether a model-provider header name should be treated as secret-bearing.
* This is intentionally conservative: false positives are audit noise, false negatives leak keys.
*/
function isLikelySensitiveModelProviderHeaderName(value) {
	const normalized = normalizeLowercaseStringOrEmpty(value);
	return normalized === "authorization" || normalized === "proxy-authorization" || SENSITIVE_MODEL_PROVIDER_HEADER_NAME_FRAGMENTS.some((fragment) => normalized.includes(fragment));
}
//#endregion
export { isLikelySensitiveModelProviderHeaderName as t };
