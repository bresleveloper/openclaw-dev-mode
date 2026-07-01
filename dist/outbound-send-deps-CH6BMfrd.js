import { n as createOutboundSendDepsFromCliSource } from "./outbound-send-mapping-BQ1Lv0rZ.js";
//#region src/cli/outbound-send-deps.ts
/** Convert the broad CLI dependency bundle into the narrow outbound-send dependency shape. */
function createOutboundSendDeps(deps) {
	return createOutboundSendDepsFromCliSource(deps);
}
//#endregion
export { createOutboundSendDeps as t };
