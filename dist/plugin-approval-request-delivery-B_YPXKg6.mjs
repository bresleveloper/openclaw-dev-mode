import { i as buildRequestedApprovalEvent, s as handlePendingApprovalRequest } from "./approval-shared-Dq8WeEIr.mjs";
import { t as runApprovalRequestDeliveries } from "./approval-request-delivery-DB3aKVt4.mjs";
//#region src/gateway/server-methods/plugin-approval-request-delivery.ts
function handlePendingPluginApprovalRequest(params) {
	const { forwardRequest, getIosPushDelivery, source, ...pending } = params;
	const requestEvent = buildRequestedApprovalEvent(pending.record, "plugin");
	const iosPushDelivery = getIosPushDelivery();
	const iosPushRequest = iosPushDelivery?.handleRequested?.bind(iosPushDelivery);
	const logContext = source === "node-policy" ? "node policy " : "";
	return handlePendingApprovalRequest({
		...pending,
		requestEventName: "plugin.approval.requested",
		requestEvent,
		approvalKind: "plugin",
		deliverRequest: () => runApprovalRequestDeliveries({
			context: pending.context,
			record: pending.record,
			forward: forwardRequest ? [() => forwardRequest(requestEvent), `plugin approvals: forward ${logContext}request failed`] : void 0,
			iosPush: iosPushRequest ? [(isTargetVisible) => iosPushRequest(requestEvent, { isTargetVisible }), `plugin approvals: iOS push ${logContext}request failed`] : void 0
		}),
		afterDecision: async (decision) => {
			if (decision === null) await getIosPushDelivery()?.handleExpired?.(requestEvent);
		},
		afterDecisionErrorLabel: `plugin approvals: iOS push ${logContext}expire failed`
	});
}
//#endregion
export { handlePendingPluginApprovalRequest as t };
