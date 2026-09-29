import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { o as readActiveGatewayLockIdentity } from "./gateway-lock-CYjRlApN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { s as requestGatewayRestartWithSignalAdmission } from "./restart-Bb4QxGMO.mjs";
import { n as scheduleSafeGatewayRestart, t as createSafeGatewayRestartPreflight } from "./restart-coordinator-BOXbJ7wv.mjs";
import { i as parseTargetedGatewayRestartIntent, r as parseTargetedGatewayRestart } from "./restart-request-CTr9_H5j.mjs";
//#region src/gateway/server-methods/restart.ts
function isRestartRequestParams(value) {
	return isRecord(value);
}
function normalizeReason(value) {
	return typeof value === "string" && value.trim() ? truncateUtf16Safe(value.trim(), 200) : void 0;
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
		const reason = normalizeReason(params.reason);
		const target = parseTargetedGatewayRestart(params.target);
		if (target === null) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid targeted gateway restart"));
			return;
		}
		if (target) {
			if (params.safe !== void 0 && typeof params.safe !== "boolean") {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid safe targeted restart mode"));
				return;
			}
			if (params.safe === true) {
				if (params.restartIntent !== void 0) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "safe targeted restart does not accept intent"));
					return;
				}
				respond(true, scheduleSafeGatewayRestart({
					reason,
					delayMs: 0,
					skipDeferral: normalizeSkipDeferral(params.skipDeferral)
				}));
				return;
			}
			const intent = parseTargetedGatewayRestartIntent(params.restartIntent, reason);
			if (!intent) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid targeted gateway restart intent"));
				return;
			}
			const activeLock = await readActiveGatewayLockIdentity().catch(() => void 0);
			if (!activeLock || activeLock.pid !== process.pid || activeLock.pid !== target.pid || activeLock.ownerId !== target.ownerId || activeLock.port !== target.port) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "target gateway no longer owns the active lock"));
				return;
			}
			const result = requestGatewayRestartWithSignalAdmission(reason, intent);
			if (result.status === "failed") {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "target gateway restart delivery failed"));
				return;
			}
			respond(true, {
				ok: true,
				status: result.status,
				pid: process.pid
			});
			return;
		}
		respond(true, scheduleSafeGatewayRestart({
			reason,
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
