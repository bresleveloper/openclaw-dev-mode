import { I as listAgentRunsForSession, p as hasAgentRunContextExecutionOwner } from "./agent-run-registry-gmaPgO-n.mjs";
import { Ng as errorShape, Pg as missingScopeErrorShape } from "./src-pLJQA6J5.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { b as isSessionWorkAdmissionActive } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { n as isEmbeddedAgentRunActive } from "./active-run-projections-Crpg2l0z.mjs";
import "./runs-Czr-I6_B.mjs";
import { l as readSessionWorkerPlacementAsync } from "./session-placement-lifecycle-CAT_zN-p.mjs";
//#region src/gateway/server-methods/sessions-patch-sandbox.runtime.ts
async function prepareSessionPatchSandboxChange(params) {
	await readSessionWorkerPlacementAsync({
		context: params.context,
		sessionId: params.existingEntry?.sessionId
	});
	return () => validateSessionPatchSandboxChange(params);
}
/** Check authority and idle execution at the synchronous write boundary. */
function validateSessionPatchSandboxChange(params) {
	if (params.client !== null && !params.client.connect.scopes?.includes("operator.admin")) return missingScopeErrorShape({
		missingScope: ADMIN_SCOPE,
		requiredScopes: [ADMIN_SCOPE]
	});
	const grantingConsent = typeof params.patch.nativeRuntimeConsent === "string";
	if (params.entry.sandbox === "required" && (params.entry.sandboxMode === "off" || grantingConsent)) return errorShape(ErrorCodes.INVALID_REQUEST, "This session requires a sandbox and cannot run without one.");
	if (grantingConsent && (!params.existingEntry || params.patch.expectedSessionId !== params.existingEntry.sessionId || params.patch.expectedLifecycleRevision !== params.existingEntry.lifecycleRevision)) return errorShape(ErrorCodes.INVALID_REQUEST, "Native runtime consent must target the current session incarnation.");
	if (!grantingConsent && params.existingEntry?.sandboxMode === params.entry.sandboxMode && params.existingEntry?.nativeRuntimeConsent === params.entry.nativeRuntimeConsent) return;
	const sessionId = params.existingEntry?.sessionId;
	const placement = sessionId ? params.context.workerSessionPlacementService?.getMany([sessionId]).get(sessionId) : void 0;
	if (isSessionWorkAdmissionActive(params.storePath, params.lifecycleIdentities) || sessionId && isEmbeddedAgentRunActive(sessionId) || listAgentRunsForSession({
		sessionKey: params.sessionKey,
		sessionId
	}).some(({ runId }) => hasAgentRunContextExecutionOwner(runId)) || placement?.executionMode === "worker-turn" && placement.turnClaim) return errorShape(ErrorCodes.INVALID_REQUEST, "Stop the active run before changing this session's execution permissions.");
}
//#endregion
export { prepareSessionPatchSandboxChange };
