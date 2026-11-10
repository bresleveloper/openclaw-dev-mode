import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { s as requestGatewayRestartWithSignalAdmission } from "./restart-B5lVkjlo.mjs";
import { o as readActiveGatewayLockIdentity } from "./gateway-lock-OT1e72lx.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-ClTdEKsf.mjs";
import { n as scheduleSafeGatewayRestart, t as createSafeGatewayRestartPreflight } from "./restart-coordinator-B06wi524.mjs";
import { i as parseTargetedGatewayRestartIntent, r as parseTargetedGatewayRestart } from "./restart-request-Bb_ECfbs.mjs";
//#region src/gateway/server-methods/restart.ts
function normalizeReason(value) {
	return typeof value === "string" && value.trim() ? truncateUtf16Safe(value.trim(), 200) : void 0;
}
function rejectRestartRequest(respond, message) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, message));
}
const restartHandlers = {
	"gateway.stop.request": async (options) => {
		const { params, respond, context } = options;
		const target = isRecord(params) ? parseTargetedGatewayRestart(params.target) : null;
		if (!target) return rejectRestartRequest(respond, "invalid targeted gateway stop");
		const { assertCurrent } = readGatewayRequestMutationAuthority(options);
		try {
			assertCurrent();
			const activeLock = await readActiveGatewayLockIdentity();
			assertCurrent();
			if (activeLock?.pid !== process.pid || activeLock.pid !== target.pid || activeLock.ownerId !== target.ownerId || activeLock.port !== target.port) return rejectRestartRequest(respond, "target gateway no longer owns the active lock");
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
			rejectRestartRequest(respond, "invalid gateway.restart.request params");
			return;
		}
		const reason = normalizeReason(params.reason);
		const target = parseTargetedGatewayRestart(params.target);
		if (target === null) {
			rejectRestartRequest(respond, "invalid targeted gateway restart");
			return;
		}
		if (target && params.safe !== void 0 && typeof params.safe !== "boolean") {
			rejectRestartRequest(respond, "invalid safe targeted restart mode");
			return;
		}
		if (target && params.safe === true && params.restartIntent !== void 0) {
			rejectRestartRequest(respond, "safe targeted restart does not accept intent");
			return;
		}
		if (target && params.safe !== true) {
			const intent = parseTargetedGatewayRestartIntent(params.restartIntent, reason);
			if (!intent) {
				rejectRestartRequest(respond, "invalid targeted gateway restart intent");
				return;
			}
			const activeLock = await readActiveGatewayLockIdentity().catch(() => void 0);
			if (activeLock?.pid !== process.pid || activeLock.pid !== target.pid || activeLock.ownerId !== target.ownerId || activeLock.port !== target.port) {
				rejectRestartRequest(respond, "target gateway no longer owns the active lock");
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
