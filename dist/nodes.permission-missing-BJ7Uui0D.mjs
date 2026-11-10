import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as getAgentRunContextOwnership, u as getAgentRunContext } from "./agent-run-registry-gmaPgO-n.mjs";
import { o as emitAgentEventForOwner, s as emitAgentEventForRunContext } from "./agent-events-Bf3Js0D3.mjs";
import { n as readNodePermissionDetails } from "./node-permissions-CxFiecbN.mjs";
//#region src/gateway/server-methods/nodes.permission-missing.ts
const CAPABILITY_NAMES = {
	notifications: "Notifications",
	accessibility: "Accessibility",
	eventPosting: "Event Posting",
	screenRecording: "Screen Recording",
	camera: "Camera",
	microphone: "Microphone",
	speechRecognition: "Speech Recognition",
	location: "Location",
	computerControl: "Computer Control",
	canvas: "Canvas"
};
/** A native refusal belongs to the requesting run, never a payload-supplied session. */
function publishNodePermissionMissing(params) {
	const error = asOptionalObjectRecord(params.error);
	const details = error?.code === "PERMISSION_MISSING" ? readNodePermissionDetails(error.details) : void 0;
	if (!details) return;
	const permissionMissing = {
		nodeId: params.nodeId,
		...params.nodeName ? { nodeName: params.nodeName } : {},
		command: params.command,
		...details
	};
	const identity = params.agentRuntimeIdentity ?? params.client?.internal?.agentRuntimeIdentity;
	let shownCard = false;
	if (identity && params.context.validateAgentRuntimeApprovalAuthority?.(identity) === true) {
		const runId = identity.operationalRunInstance.runId;
		const runContext = getAgentRunContext(runId);
		const owner = getAgentRunContextOwnership(runId)?.exclusiveClaimId;
		if (runContext) {
			const event = {
				runId: identity.operationalRunInstance.runId,
				lifecycleGeneration: identity.delegatedAuthority.lifecycleGeneration,
				sessionKey: identity.sessionKey,
				agentId: identity.agentId,
				stream: "notice",
				data: {
					phase: "warning",
					kind: "permission_missing",
					permissionMissing
				}
			};
			shownCard = (owner ? emitAgentEventForOwner(event, owner) : emitAgentEventForRunContext(event, runContext)) && runContext.isControlUiVisible !== false;
		}
	}
	return {
		permissionMissing,
		message: [
			`PERMISSION_MISSING: ${details.capabilities.map((id) => CAPABILITY_NAMES[id] ?? id).join(", ")} required on node ${params.nodeName ? `${params.nodeName} (${params.nodeId})` : params.nodeId} (${details.state}).`,
			shownCard ? "The user has been shown a Grant card in the chat." : "Grant access in the OpenClaw Mac app: Settings → This Mac → Permissions.",
			"Do not retry until the user confirms that access has been granted."
		].join(" ")
	};
}
//#endregion
export { publishNodePermissionMissing as t };
