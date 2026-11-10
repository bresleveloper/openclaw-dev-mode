import { c as SECRET_STORE_VALUE_MAX_BYTES, l as SecretStoreValidationError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
//#region src/secrets/store/secret-store-github-names.ts
const GITHUB_SETUP_HANDOFF_MAX_AGE_MS = 6e5;
const GITHUB_DEVICE_STORE_MAX_AGE_MS = 9e5;
const HIDDEN_GITHUB_STORE_NAME_PATTERN = /^github-(setup|device|oauth)-[a-f0-9]{32}$/u;
function classifyHiddenGitHubStoreName(name) {
	const kind = HIDDEN_GITHUB_STORE_NAME_PATTERN.exec(name)?.[1];
	return kind === "setup" || kind === "device" || kind === "oauth" ? kind : void 0;
}
function assertHiddenGitHubSecretRecordName(name) {
	const kind = classifyHiddenGitHubStoreName(name);
	if (kind !== "device" && kind !== "oauth") throw new SecretStoreValidationError("SECRET_STORE_INVALID_NAME", "Hidden GitHub secret record name must match github-device-<32 lowercase hex characters> or github-oauth-<32 lowercase hex characters>.");
	return kind;
}
function hiddenGitHubStoreKindFromPrefix(prefix) {
	if (prefix === "github-device") return "device";
	if (prefix === "github-oauth") return "oauth";
	throw new SecretStoreValidationError("SECRET_STORE_INVALID_NAME", "Hidden GitHub secret record prefix must be \"github-device\" or \"github-oauth\".");
}
//#endregion
//#region src/secrets/store/secret-store-value.ts
function assertSecretStoreValueLength(value, kind) {
	if (Buffer.byteLength(value, "utf8") > 65536) throw new SecretStoreValidationError("SECRET_STORE_VALUE_TOO_LARGE", `Secret store value exceeds ${SECRET_STORE_VALUE_MAX_BYTES} UTF-8 bytes.`);
	if (kind === "secret" && value.length === 0) throw new SecretStoreValidationError("SECRET_STORE_VALUE_EMPTY", "Secret store value is empty. Secret entries require a value; check the command that produced it.");
}
//#endregion
export { classifyHiddenGitHubStoreName as a, assertHiddenGitHubSecretRecordName as i, GITHUB_DEVICE_STORE_MAX_AGE_MS as n, hiddenGitHubStoreKindFromPrefix as o, GITHUB_SETUP_HANDOFF_MAX_AGE_MS as r, assertSecretStoreValueLength as t };
