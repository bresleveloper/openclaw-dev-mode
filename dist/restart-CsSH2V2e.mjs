import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { o as readActiveGatewayLockIdentity } from "./gateway-lock-B6mKYs2x.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { s as requestGatewayRestartWithSignalAdmission } from "./restart-DQIBmMjt.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-CxCbIrod.mjs";
import { n as scheduleSafeGatewayRestart, t as createSafeGatewayRestartPreflight } from "./restart-coordinator-DPEBQn0t.mjs";
import { i as parseTargetedGatewayRestartIntent, r as parseTargetedGatewayRestart } from "./restart-request-Cq5MrcJD.mjs";
//#region src/gateway/server-methods/restart.ts
function normalizeReason(value) {
	return typeof value === "string" && value.trim() ? truncateUtf16Safe(value.trim(), 200) : void 0;
}
const restartHandlers = {
	"gateway.stop.request": async (options) => {
		const { params, respond, context } = options;
		const target = isRecord(params) ? parseTargetedGatewayRestart(params.target) : null;
		if (!target) return respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid targeted gateway stop"));
		const { assertCurrent } = readGatewayRequestMutationAuthority(options);
		try {
			assertCurrent();
			const activeLock = await readActiveGatewayLockIdentity();
			assertCurrent();
			if (activeLock?.pid !== process.pid || activeLock.pid !== target.pid || activeLock.ownerId !== target.ownerId || activeLock.port !== target.port) return respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "target gateway no longer owns the active lock"));
			const result = await context.hostLifecycle?.request("stop", assertCurrent);
			if (!result?.ok) throw new Error(result?.error ?? "Gateway host does not own process exit");
			respond(true, {
				ok: true,
				pid: process.pid,
				status: "scheduled"
			});
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
		}
	},
	"gateway.restart.request": async ({ respond, params }) => {
		if (!isRecord(params)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid gateway.restart.request params"));
			return;
		}
		const reason = normalizeReason(params.reason);
		const target = parseTargetedGatewayRestart(params.target);
		if (target === null) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid targeted gateway restart"));
			return;
		}
		if (target && params.safe !== void 0 && typeof params.safe !== "boolean") {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid safe targeted restart mode"));
			return;
		}
		if (target && params.safe === true && params.restartIntent !== void 0) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "safe targeted restart does not accept intent"));
			return;
		}
		if (target && params.safe !== true) {
			const intent = parseTargetedGatewayRestartIntent(params.restartIntent, reason);
			if (!intent) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid targeted gateway restart intent"));
				return;
			}
			const activeLock = await readActiveGatewayLockIdentity().catch(() => void 0);
			if (activeLock?.pid !== process.pid || activeLock.pid !== target.pid || activeLock.ownerId !== target.ownerId || activeLock.port !== target.port) {
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
			skipDeferral: params.skipDeferral === true
		}));
	},
	"gateway.restart.preflight": async ({ respond }) => {
		respond(true, createSafeGatewayRestartPreflight());
	}
};
//#endregion
export { restartHandlers };
