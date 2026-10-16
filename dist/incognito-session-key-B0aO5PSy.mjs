//#region src/shared/incognito-session-key.ts
const INCOGNITO_SESSION_LIFETIME_MS = 864e5;
/** Legacy rows retain their known age; observing them never starts a new lifetime. */
function resolveIncognitoSessionExpiresAt(entry) {
	const startedAt = entry.createdAt ?? entry.updatedAt;
	return startedAt === void 0 ? void 0 : startedAt + INCOGNITO_SESSION_LIFETIME_MS;
}
//#endregion
export { resolveIncognitoSessionExpiresAt as t };
