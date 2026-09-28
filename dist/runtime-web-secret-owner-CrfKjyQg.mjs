//#region src/secrets/runtime-web-secret-owner.ts
/** Stable degraded-owner id for one configured web provider surface. */
function runtimeWebSecretOwnerId(kind, providerId) {
	return `web-${kind}:${providerId}`;
}
//#endregion
export { runtimeWebSecretOwnerId as t };
