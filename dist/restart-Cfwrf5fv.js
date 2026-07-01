import { mn as errorShape, pn as ErrorCodes } from "./schema-Ctppm7Dp.js";
import "./src-CSp7rUPX.js";
import { n as requestSafeGatewayRestart, t as createSafeGatewayRestartPreflight } from "./restart-coordinator-Xr8G9STP.js";
//#region src/gateway/server-methods/restart.ts
function isRestartRequestParams(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function normalizeReason(value) {
	return typeof value === "string" && value.trim() ? value.trim().slice(0, 200) : void 0;
}
function normalizeSkipDeferral(value) {
	return value === true;
}
/** Gateway request handlers for safe restart coordination. */
const restartHandlers = {
	"gateway.restart.request": async ({ respond, params }) => {
		if (!isRestartRequestParams(params)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid gateway.restart.request params"));
			return;
		}
		respond(true, requestSafeGatewayRestart({
			reason: normalizeReason(params.reason),
			delayMs: 0,
			skipDeferral: normalizeSkipDeferral(params.skipDeferral)
		}));
	},
	"gateway.restart.preflight": async ({ respond }) => {
		respond(true, createSafeGatewayRestartPreflight());
	}
};
//#endregion
export { restartHandlers };
