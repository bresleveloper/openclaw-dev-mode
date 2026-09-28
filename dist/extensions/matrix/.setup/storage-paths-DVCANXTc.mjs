import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import crypto from "node:crypto";
import path from "node:path";
//#region extensions/matrix/src/storage-paths.ts
const MATRIX_TOKEN_HASH_DIRECTORY_PATTERN = /^[a-f0-9]{16}$/u;
const MATRIX_SERVER_USER_DIRECTORY_PATTERN = /^.+__.+$/u;
function isMatrixActiveTokenRootDirectory(name) {
	return MATRIX_TOKEN_HASH_DIRECTORY_PATTERN.test(name);
}
function resolveMatrixStateLayoutChildDepth(depth, name) {
	if (depth === 0) return name === "accounts" ? 1 : null;
	if (depth === 1) return 2;
	if (depth === 2) return MATRIX_SERVER_USER_DIRECTORY_PATTERN.test(name) ? 3 : null;
	if (depth === 3) return isMatrixActiveTokenRootDirectory(name) ? 4 : null;
	return null;
}
function sanitizeMatrixPathSegment(value) {
	return normalizeLowercaseStringOrEmpty(value).replace(/[^a-z0-9._-]+/g, "_").replace(/^_+|_+$/g, "") || "unknown";
}
function resolveMatrixHomeserverKey(homeserver) {
	try {
		const url = new URL(homeserver);
		if (url.host) return sanitizeMatrixPathSegment(url.host);
	} catch {}
	return sanitizeMatrixPathSegment(homeserver);
}
function hashMatrixAccessToken(accessToken) {
	return crypto.createHash("sha256").update(accessToken).digest("hex").slice(0, 16);
}
function resolveMatrixCredentialsFilename(accountId) {
	const normalized = normalizeAccountId(accountId);
	return normalized === DEFAULT_ACCOUNT_ID ? "credentials.json" : `credentials-${normalized}.json`;
}
function resolveMatrixCredentialsDir(stateDir) {
	return path.join(stateDir, "credentials", "matrix");
}
function resolveMatrixCredentialsPath(params) {
	return path.join(resolveMatrixCredentialsDir(params.stateDir), resolveMatrixCredentialsFilename(params.accountId));
}
function resolveMatrixAccountStorageRoot(params) {
	const accountKey = sanitizeMatrixPathSegment(params.accountId ?? DEFAULT_ACCOUNT_ID);
	const userKey = sanitizeMatrixPathSegment(params.userId);
	const serverKey = resolveMatrixHomeserverKey(params.homeserver);
	const tokenHash = hashMatrixAccessToken(params.accessToken);
	return {
		rootDir: path.join(params.stateDir, "matrix", "accounts", accountKey, `${serverKey}__${userKey}`, tokenHash),
		accountKey,
		tokenHash
	};
}
//#endregion
export { resolveMatrixCredentialsFilename as a, resolveMatrixStateLayoutChildDepth as c, resolveMatrixCredentialsDir as i, sanitizeMatrixPathSegment as l, isMatrixActiveTokenRootDirectory as n, resolveMatrixCredentialsPath as o, resolveMatrixAccountStorageRoot as r, resolveMatrixHomeserverKey as s, hashMatrixAccessToken as t };
