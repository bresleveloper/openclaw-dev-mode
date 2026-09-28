//#region src/gateway/standing-grant-expiry-config.ts
/** Normalizes tools.exec.grantExpiryDays: whole days >= 1, else null (until revoked). */
function resolveGrantExpiryDaysConfig(cfg) {
	const days = cfg.tools?.exec?.grantExpiryDays;
	return typeof days === "number" && Number.isFinite(days) && days >= 1 ? Math.floor(days) : null;
}
//#endregion
export { resolveGrantExpiryDaysConfig as t };
