import { t as runSecurityAuditCore } from "./audit-xXLBuci0.mjs";
//#region src/security/audit.runtime.ts
/** Runtime facade for the full security audit entrypoint. */
function runSecurityAudit(...args) {
	return runSecurityAuditCore(...args);
}
//#endregion
export { runSecurityAudit };
