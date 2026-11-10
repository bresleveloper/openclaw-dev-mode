import { o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { n as bindGatewayDeviceRevocation } from "./device-revocation-DpGQRUdo.mjs";
import { a as assertRequiredWorkerSelection, t as RequiredWorkerProfileError } from "./required-worker-profile-B0DIhkdC.mjs";
import { n as ensureSessionWorkspaceForPlacement } from "./session-lifecycle-preparation-CelOZMyq.mjs";
import { n as withGatewayWorkerSessionAdmission } from "./server-worker-placement-dispatch-admission-DwFO4Cjr.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/server-worker-required-profile.ts
/** Required placement contributes policy; the session and placement owners retain its effects. */
function createRequiredWorkerSessionPreparation(options) {
	return async (identity, task, authorize, signal, preparation) => {
		const required = options.getConfig().cloudWorkers?.requiredProfile;
		if (!required) return await task(() => {});
		if (!identity.sessionKey?.trim() || !identity.agentId?.trim()) throw new RequiredWorkerProfileError("Required worker execution needs a real agent session; sessionless model helpers are unsupported.");
		const profile = options.getConfig().cloudWorkers?.profiles?.[required];
		if (!profile) throw new RequiredWorkerProfileError("Required worker profile \"" + required + "\" is not configured; configure it and retry.");
		const snapshot = structuredClone(profile);
		const assertPolicyCurrent = bindGatewayDeviceRevocation(composeSessionSourceAssertion([authorize], (assertSource) => {
			signal?.throwIfAborted();
			assertSource();
			if (options.getConfig().cloudWorkers?.requiredProfile !== required || !isDeepStrictEqual(options.getConfig().cloudWorkers?.profiles?.[required], snapshot)) throw new RequiredWorkerProfileError("Session source or required worker policy changed during placement; retry.");
		}), authorize);
		return await withGatewayWorkerSessionAdmission({
			identity: {
				sessionId: identity.sessionId,
				sessionKey: identity.sessionKey,
				agentId: identity.agentId
			},
			getConfig: options.getConfig,
			authorize: assertPolicyCurrent,
			signal,
			retainEntryFields: ["agentRuntimeOverride", "execNode"]
		}, async (source) => {
			const assertCurrent = composeSessionSourceAssertion([source.assertCurrent], (assertSource) => {
				assertSource();
				assertRequiredWorkerSelection(options.getConfig(), {
					agentRuntime: source.entry.agentRuntimeOverride,
					execNode: source.entry.execNode
				});
			});
			const placement = await options.dispatch.ensurePlacement({
				request: {
					sessionId: identity.sessionId,
					sessionKey: identity.sessionKey,
					agentId: identity.agentId,
					profileId: required,
					executionMode: "worker-turn",
					requiredProfile: required,
					runSetupScript: false,
					devicePlacement: {
						requiredNodeCommands: [],
						consumesWorkerSlot: true
					}
				},
				assertCurrent,
				authorizeDispatch: assertPolicyCurrent,
				signal: source.signal,
				waitForReady: preparation?.waitForReady,
				retainDispatch: preparation?.retainDispatch,
				prepareWorkspace: (canPrepare) => ensureSessionWorkspaceForPlacement({
					cfg: options.getConfig(),
					...source,
					assertCurrent,
					canPrepare
				})
			});
			try {
				placement.assertCurrent();
				return await task(placement.assertCurrent);
			} finally {
				placement.release();
			}
		});
	};
}
//#endregion
export { createRequiredWorkerSessionPreparation };
