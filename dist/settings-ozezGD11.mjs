import { c as isSecretRef, p as isValidSecretRef } from "./ref-contract-D0kWy5jy.mjs";
import "./secret-input-BXhRrpGu.mjs";
//#region extensions/cloudflare/settings.ts
var R2SettingsError = class extends Error {};
function validBucket(value) {
	return typeof value === "string" && /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/.test(value);
}
function validPrefix(value) {
	return value === void 0 || typeof value === "string" && Buffer.byteLength(value) <= 512 && value.split("/").every((part) => /^[A-Za-z0-9._-]+$/.test(part) && part !== "." && part !== "..");
}
function credential(value, key) {
	if (!isSecretRef(value) || !isValidSecretRef(value)) throw new R2SettingsError(`R2 ${key} must be a valid SecretRef; store the credential in a secret provider first.`);
	return value;
}
function parseR2Settings(settings) {
	const { accountId, bucket, prefix, jurisdiction } = settings;
	if (typeof accountId !== "string" || !/^[a-f0-9]{32}$/.test(accountId)) throw new R2SettingsError("R2 accountId must be 32 lowercase hexadecimal characters.");
	if (!validBucket(bucket)) throw new R2SettingsError("R2 bucket must be 3–63 lowercase letters, digits, or hyphens, beginning and ending with a letter or digit.");
	if (!validPrefix(prefix)) throw new R2SettingsError("R2 prefix must contain key-safe segments without leading or trailing /, . or .. segments, and be at most 512 bytes.");
	if (jurisdiction !== void 0 && jurisdiction !== "eu" && jurisdiction !== "fedramp") throw new R2SettingsError("R2 jurisdiction must be eu or fedramp, or omitted.");
	const allowed = /* @__PURE__ */ new Set([
		"accountId",
		"bucket",
		"prefix",
		"jurisdiction",
		"accessKeyId",
		"secretAccessKey",
		"sessionToken"
	]);
	if (Object.keys(settings).some((key) => !allowed.has(key))) throw new R2SettingsError("R2 settings only accept accountId, bucket, prefix, jurisdiction, accessKeyId, secretAccessKey, and sessionToken.");
	return {
		accountId,
		bucket,
		prefix,
		jurisdiction,
		accessKeyId: credential(settings.accessKeyId, "accessKeyId"),
		secretAccessKey: credential(settings.secretAccessKey, "secretAccessKey"),
		sessionToken: settings.sessionToken === void 0 ? void 0 : credential(settings.sessionToken, "sessionToken")
	};
}
function validateR2Settings(settings) {
	try {
		parseR2Settings(settings);
		return;
	} catch (error) {
		return error instanceof R2SettingsError ? error.message : "R2 settings could not be read; check the location configuration.";
	}
}
function describeR2Target(settings) {
	if (!validBucket(settings.bucket) || !validPrefix(settings.prefix)) return;
	return `r2://${settings.bucket}${settings.prefix ? `/${settings.prefix}` : ""}`;
}
function r2Endpoint(settings) {
	return `https://${settings.accountId}${settings.jurisdiction ? `.${settings.jurisdiction}` : ""}.r2.cloudflarestorage.com`;
}
//#endregion
export { validateR2Settings as i, parseR2Settings as n, r2Endpoint as r, describeR2Target as t };
