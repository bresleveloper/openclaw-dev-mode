//#region src/utils/normalize-secret-input.ts
/**
* Normalizes a raw secret value from config, env, setup prompts, or plugin SDK callers.
* Returns an empty string for absent/invalid input so callers can keep boolean presence checks simple.
*/
function normalizeSecretInput(value) {
	if (typeof value !== "string") return "";
	return value.replace(/[^\u0020-\u007e\u00a0-\u00ff]/gu, "").trim();
}
/**
* Normalizes a raw secret value and converts empty normalized output to `undefined`.
* Use this at optional config boundaries where "not configured" is clearer than an empty string.
*/
function normalizeOptionalSecretInput(value) {
	return normalizeSecretInput(value) || void 0;
}
//#endregion
export { normalizeSecretInput as n, normalizeOptionalSecretInput as t };
