import { r as resolveGlobalMap } from "./global-singleton-DrXvEBww.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { a as resolveSessionWorkStartError } from "./session-work-start-Sz_vqYld.mjs";
import { a as SessionWorkStartInvalidatedError, i as SessionWorkStartChangedError, s as isSessionWorkStartInvalidatedError } from "./work-start-error-BI-UhSB2.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { o as patchSessionEntryCore } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import "./lifecycle-CKc8qk3B.mjs";
import { i as logVerbose } from "./globals-XVSoVbNQ.mjs";
import { t as createSessionDiffBaselineCaptureClaim } from "./session-diff-baseline-capture-6ejBT0Am.mjs";
//#region src/sessions/session-diff-baseline.ts
const captureInFlight = resolveGlobalMap(Symbol.for("openclaw.sessionDiffBaselineCaptureInFlight"), async (captures) => {
	await Promise.allSettled(captures.values());
	captures.clear();
});
async function ensureSessionDiffBaseline(params) {
	const { entry, sessionKey, storePath, agentId } = params;
	const captureKey = JSON.stringify([
		storePath,
		agentId,
		sessionKey,
		entry.sessionId
	]);
	const pending = captureInFlight.get(captureKey);
	if (pending) return pending;
	const capture = entry.sessionDiffBaselineCapture;
	if (entry.execNode || entry.sessionDiffBaseline?.sessionId === entry.sessionId || capture?.status === "unavailable" || !capture && (!params.isNewSession || entry.createdVia !== "operator")) return entry;
	return await getOrCreatePromise(captureInFlight, captureKey, async () => {
		let baseline;
		try {
			const { captureSessionDiffBaseline } = await import("./session-diff-DeyQkheD.mjs");
			baseline = await captureSessionDiffBaseline({
				cwd: params.cwd,
				sessionId: entry.sessionId
			});
		} catch (error) {
			if (isSessionWorkStartInvalidatedError(error)) throw error;
			logVerbose(`session diff baseline capture failed; continuing without attribution filtering: ${formatErrorMessage(error)}`);
		}
		const persisted = await patchSessionEntryCore({
			agentId,
			sessionKey,
			storePath
		}, (current) => {
			if (current.sessionId !== entry.sessionId || current.sessionDiffBaseline?.sessionId === entry.sessionId || current.sessionDiffBaselineCapture?.status === "unavailable") return null;
			return baseline ? {
				sessionDiffBaseline: baseline,
				sessionDiffBaselineCapture: void 0
			} : { sessionDiffBaselineCapture: {
				...capture ?? createSessionDiffBaselineCaptureClaim(),
				status: "unavailable"
			} };
		}, {
			preserveActivity: true,
			skipMaintenance: true,
			workerGuard: {}
		}).catch((error) => {
			if (isSessionWorkStartInvalidatedError(error)) throw error;
			logVerbose(`session diff baseline settlement failed for ${sessionKey}: ${formatErrorMessage(error)}`);
			throw new SessionWorkStartInvalidatedError(`Session "${sessionKey}" could not persist its diff baseline before starting work. Retry.`);
		});
		if (!persisted || persisted.sessionId !== entry.sessionId) throw new SessionWorkStartChangedError(resolveSessionWorkStartError(sessionKey, persisted, { expectedSessionId: entry.sessionId }) ?? `Session "${sessionKey}" changed while starting work. Retry.`);
		return persisted;
	}, { evictOnSettled: true });
}
//#endregion
export { ensureSessionDiffBaseline as t };
