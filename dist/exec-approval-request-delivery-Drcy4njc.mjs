import { i as buildRequestedApprovalEvent, s as handlePendingApprovalRequest } from "./approval-shared-88sDMzSO.mjs";
import { t as runApprovalRequestDeliveries } from "./approval-request-delivery-Ct1gfS2o.mjs";
//#region src/gateway/server-methods/exec-approval-request-delivery.ts
/** All command approval producers share the same delivery routes and visibility checks. */
function handlePendingExecApprovalRequest(params) {
	const { forwardRequest, getIosPushDelivery, afterDecision, afterDecisionErrorLabel, ...pending } = params;
	const requestEvent = buildRequestedApprovalEvent(pending.record, "exec");
	const iosPushDelivery = getIosPushDelivery();
	const iosPushRequest = iosPushDelivery?.handleRequested?.bind(iosPushDelivery);
	return handlePendingApprovalRequest({
		...pending,
		requestEventName: "exec.approval.requested",
		requestEvent,
		approvalKind: "exec",
		deliverRequest: () => runApprovalRequestDeliveries({
			context: pending.context,
			record: pending.record,
			forward: forwardRequest ? [() => forwardRequest(requestEvent), "exec approvals: forward request failed"] : void 0,
			iosPush: iosPushRequest ? [(isTargetVisible) => iosPushRequest(requestEvent, { isTargetVisible }), "exec approvals: iOS push request failed"] : void 0
		}),
		afterDecision: async (decision) => {
			if (decision === null) await getIosPushDelivery()?.handleExpired?.(requestEvent);
			await afterDecision?.(decision, requestEvent);
		},
		afterDecisionErrorLabel: afterDecisionErrorLabel ?? "exec approvals: iOS push expire failed"
	});
}
//#endregion
export { handlePendingExecApprovalRequest as t };
