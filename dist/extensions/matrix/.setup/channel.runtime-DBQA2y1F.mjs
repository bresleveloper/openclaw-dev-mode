import { S as reconcileMatrixUnknownSend, o as sendTypingMatrix, r as sendMessageMatrix, x as cleanupMatrixDeliveryPlans } from "./send-B1Y2L4wj.mjs";
import { u as resolveMatrixAuth } from "./client-kmih04ng.mjs";
import { n as listMatrixDirectoryGroupsLive, r as listMatrixDirectoryPeersLive } from "./directory-live-DW5UykLL.mjs";
import { t as matrixOutbound } from "./outbound-CqQou3ny.mjs";
import { t as resolveMatrixTargets } from "./resolve-targets-DFeU1Ww6.mjs";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { runChannelProbe } from "openclaw/plugin-sdk/text-utility-runtime";
//#region extensions/matrix/src/matrix/probe.ts
const loadMatrixProbeRuntimeDeps = createLazyRuntimeModule(() => import("./client-kmih04ng.mjs").then((n) => n.t));
async function probeMatrix(params) {
	return await runChannelProbe(void 0, async () => {
		const result = {
			ok: false,
			status: null,
			error: null
		};
		if (!params.homeserver?.trim()) return {
			...result,
			error: "missing homeserver"
		};
		if (!params.accessToken?.trim()) return {
			...result,
			error: "missing access token"
		};
		const { createMatrixClient } = await loadMatrixProbeRuntimeDeps();
		const inputUserId = normalizeOptionalString(params.userId);
		const userId = await (await createMatrixClient({
			homeserver: params.homeserver,
			userId: void 0,
			accessToken: params.accessToken,
			deviceId: params.deviceId,
			persistStorage: false,
			localTimeoutMs: params.timeoutMs,
			accountId: params.accountId,
			allowPrivateNetwork: params.allowPrivateNetwork,
			ssrfPolicy: params.ssrfPolicy,
			dispatcherPolicy: params.dispatcherPolicy
		})).getUserId();
		if (inputUserId && inputUserId !== userId) return {
			...result,
			error: "Matrix access token user does not match configured userId"
		};
		return {
			...result,
			ok: true,
			userId
		};
	}, (error) => ({
		ok: false,
		status: typeof error === "object" && error && "statusCode" in error ? Number(error.statusCode) : null,
		error: formatErrorMessage(error)
	}));
}
//#endregion
//#region extensions/matrix/src/channel.runtime.ts
const matrixChannelRuntime = {
	cleanupMatrixDeliveryPlans,
	listMatrixDirectoryGroupsLive,
	listMatrixDirectoryPeersLive,
	matrixOutbound,
	probeMatrix,
	resolveMatrixAuth,
	resolveMatrixTargets,
	reconcileMatrixUnknownSend,
	sendMessageMatrix,
	sendTypingMatrix
};
//#endregion
export { matrixChannelRuntime };
