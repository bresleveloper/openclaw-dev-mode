import { normalizeAccountId, normalizeOptionalAccountId } from "openclaw/plugin-sdk/account-id";
//#region extensions/matrix/src/env-vars.ts
const MATRIX_SCOPED_ENV_SUFFIXES = [
	"HOMESERVER",
	"USER_ID",
	"ACCESS_TOKEN",
	"PASSWORD",
	"DEVICE_ID",
	"DEVICE_NAME"
];
const MATRIX_GLOBAL_ENV_KEYS = MATRIX_SCOPED_ENV_SUFFIXES.map((suffix) => `MATRIX_${suffix}`);
const MATRIX_SCOPED_ENV_RE = new RegExp(`^MATRIX_(.+)_(${MATRIX_SCOPED_ENV_SUFFIXES.join("|")})$`);
function resolveMatrixEnvAccountToken(accountId) {
	return normalizeAccountId(accountId).toUpperCase().replace(/[-_]/g, (char) => char === "-" ? "_X2D_" : "_X5F_");
}
function getMatrixScopedEnvVarNames(accountId) {
	const token = resolveMatrixEnvAccountToken(accountId);
	return {
		homeserver: `MATRIX_${token}_HOMESERVER`,
		userId: `MATRIX_${token}_USER_ID`,
		accessToken: `MATRIX_${token}_ACCESS_TOKEN`,
		password: `MATRIX_${token}_PASSWORD`,
		deviceId: `MATRIX_${token}_DEVICE_ID`,
		deviceName: `MATRIX_${token}_DEVICE_NAME`
	};
}
function decodeMatrixEnvAccountToken(token) {
	const decoded = token.replace(/_X(?:2D|5F)_/g, (escape) => escape === "_X2D_" ? "-" : "_").toLowerCase();
	const normalized = normalizeOptionalAccountId(decoded);
	if (!normalized) return;
	return resolveMatrixEnvAccountToken(normalized) === token ? normalized : void 0;
}
function listMatrixEnvAccountIds(env = process.env) {
	const ids = /* @__PURE__ */ new Set();
	for (const key of MATRIX_GLOBAL_ENV_KEYS) if (typeof env[key] === "string" && env[key]?.trim()) {
		ids.add(normalizeAccountId("default"));
		break;
	}
	for (const key of Object.keys(env)) {
		const match = MATRIX_SCOPED_ENV_RE.exec(key);
		if (!match) continue;
		const encodedAccountId = match[1];
		if (!encodedAccountId) continue;
		const accountId = decodeMatrixEnvAccountToken(encodedAccountId);
		if (accountId) ids.add(accountId);
	}
	return Array.from(ids).toSorted((a, b) => a.localeCompare(b));
}
//#endregion
export { listMatrixEnvAccountIds as n, resolveMatrixEnvAccountToken as r, getMatrixScopedEnvVarNames as t };
