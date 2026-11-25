import { t as resolveValidatedMatrixHomeserverUrl } from "./url-validation-DesoKUns.mjs";
import { C as reconcileMatrixUnknownSend, S as cleanupMatrixDeliveryPlans, o as sendTypingMatrix, r as sendMessageMatrix } from "./send-COg4UAcR.mjs";
import { c as resolveMatrixLocalTimeoutMs } from "./client-support-CqXAOZp3.mjs";
import { c as resolveMatrixAuth } from "./client-BVgnwwz0.mjs";
import { n as listMatrixDirectoryGroupsLive, r as listMatrixDirectoryPeersLive } from "./directory-live-CQNKUJJx.mjs";
import { t as matrixOutbound } from "./outbound-CFFxi_uJ.mjs";
import { t as resolveMatrixTargets } from "./resolve-targets-B3NLls5a.mjs";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { isRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { ssrfPolicyFromDangerouslyAllowPrivateNetwork } from "openclaw/plugin-sdk/ssrf-runtime";
import { runChannelProbe } from "openclaw/plugin-sdk/text-utility-runtime";
// extensions/matrix/src/matrix/probe.ts
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
		const inputUserId = normalizeOptionalString(params.userId);
		const homeserver = await resolveValidatedMatrixHomeserverUrl(params.homeserver, { dangerouslyAllowPrivateNetwork: params.allowPrivateNetwork });
		const { MatrixAuthedHttpClient } = await import("./http-client-CqnKFKUH.mjs").then((n) => n.n);
		const identity = await new MatrixAuthedHttpClient({
			homeserver,
			accessToken: params.accessToken,
			ssrfPolicy: params.ssrfPolicy ?? ssrfPolicyFromDangerouslyAllowPrivateNetwork(params.allowPrivateNetwork),
			dispatcherPolicy: params.dispatcherPolicy
		}).requestJson({
			method: "GET",
			endpoint: "/_matrix/client/v3/account/whoami",
			timeoutMs: resolveMatrixLocalTimeoutMs(params.timeoutMs)
		});
		const userId = isRecord(identity) && typeof identity.user_id === "string" ? identity.user_id.trim() : "";
		if (!userId) throw new Error("Matrix whoami did not return user_id");
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
// extensions/matrix/src/channel.runtime.ts
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
export { matrixChannelRuntime };
