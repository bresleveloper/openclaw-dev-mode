import { t as collectChannelSecurityFindingsCore } from "./audit-channel-DF8Kg-60.mjs";
//#region src/security/audit-channel.collect.runtime.ts
/** Runtime facade for channel security collection, kept mockable for audit tests. */
function collectChannelSecurityFindings(...args) {
	return collectChannelSecurityFindingsCore(...args);
}
//#endregion
export { collectChannelSecurityFindings };
