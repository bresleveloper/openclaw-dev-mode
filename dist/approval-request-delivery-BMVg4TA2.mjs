import { s as trackAsyncWork } from "./async-work-scope-BH2yUdBz.mjs";
import { n as GATEWAY_CLIENT_IDS } from "./client-info-BgcoFakQ.mjs";
import { k as runWithRetainedGatewayRootWork } from "./gateway-work-admission-FWbk4b3p.mjs";
import { i as buildRequestedApprovalEvent, s as handlePendingApprovalRequest } from "./approval-shared-QJKmB54s.mjs";
import { n as isApprovalRecordVisibleToClient } from "./approval-record-lookup-KFM8XG5s.mjs";
//#region src/gateway/server-methods/approval-request-delivery.ts
/** Request producers share delivery and expiry handling while retaining their typed payloads. */
function handlePendingApprovalRequestWithDelivery(params) {
	const { approvalKind, source, forwardRequest, getIosPushDelivery, afterDecision, afterDecisionErrorLabel, ...pending } = params;
	const requestEvent = buildRequestedApprovalEvent(pending.record, approvalKind);
	const iosPushDelivery = getIosPushDelivery();
	const iosPushRequest = iosPushDelivery?.handleRequested?.bind(iosPushDelivery);
	const logContext = source === "node-policy" ? "node policy " : "";
	const logPrefix = `${approvalKind} approvals:`;
	return handlePendingApprovalRequest({
		...pending,
		approvalKind,
		requestEventName: `${approvalKind}.approval.requested`,
		requestEvent,
		deliverRequest: () => {
			const isTargetVisible = (target) => isApprovalRecordVisibleToClient({
				record: pending.record,
				client: { connect: {
					client: { id: GATEWAY_CLIENT_IDS.IOS_APP },
					device: { id: target.deviceId },
					scopes: [...target.scopes]
				} }
			});
			const deliveryTasks = [];
			const startDelivery = (run, errorLabel) => {
				deliveryTasks.push(trackAsyncWork(() => runWithRetainedGatewayRootWork(run)).catch((err) => {
					pending.context.logGateway?.error?.(`${errorLabel}: ${String(err)}`);
					return false;
				}));
			};
			if (forwardRequest) startDelivery(() => forwardRequest(requestEvent), `${logPrefix} forward ${logContext}request failed`);
			if (iosPushRequest) startDelivery(() => iosPushRequest(requestEvent, { isTargetVisible }), `${logPrefix} iOS push ${logContext}request failed`);
			try {
				const webPushDelivery = pending.context.approvalWebPushDelivery?.handleRequested(pending.record);
				if (webPushDelivery !== false && webPushDelivery !== void 0) startDelivery(() => Promise.resolve(webPushDelivery), "approval Web Push request failed");
			} catch (err) {
				pending.context.logGateway?.error?.(`approval Web Push request failed: ${String(err)}`);
			}
			if (deliveryTasks.length === 0) return false;
			return new Promise((resolve) => {
				let remaining = deliveryTasks.length;
				for (const delivery of deliveryTasks) delivery.then((delivered) => {
					remaining -= 1;
					if (delivered || remaining === 0) resolve(delivered);
				});
			});
		},
		afterDecision: async (decision) => {
			if (decision === null) await getIosPushDelivery()?.handleExpired?.(requestEvent);
			await afterDecision?.(decision, requestEvent);
		},
		afterDecisionErrorLabel: afterDecisionErrorLabel ?? `${logPrefix} iOS push ${logContext}expire failed`
	});
}
//#endregion
export { handlePendingApprovalRequestWithDelivery as t };
