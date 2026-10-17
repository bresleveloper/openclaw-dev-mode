import { c as trackAsyncWork } from "./async-work-scope-BYeX3gh6.mjs";
import { n as GATEWAY_CLIENT_IDS } from "./client-info-C8RatpKO.mjs";
import { T as runWithRetainedGatewayRootWork } from "./gateway-work-admission-rc4ZgKq_.mjs";
import { i as buildRequestedApprovalEvent, s as handlePendingApprovalRequest } from "./approval-shared-Dk0HJprz.mjs";
import { n as isApprovalRecordVisibleToClient } from "./approval-record-lookup-FW2BL3jI.mjs";
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
		deliverRequest: () => runApprovalRequestDeliveries({
			context: pending.context,
			record: pending.record,
			forward: forwardRequest ? [() => forwardRequest(requestEvent), `${logPrefix} forward ${logContext}request failed`] : void 0,
			iosPush: iosPushRequest ? [(isTargetVisible) => iosPushRequest(requestEvent, { isTargetVisible }), `${logPrefix} iOS push ${logContext}request failed`] : void 0
		}),
		afterDecision: async (decision) => {
			if (decision === null) await getIosPushDelivery()?.handleExpired?.(requestEvent);
			await afterDecision?.(decision, requestEvent);
		},
		afterDecisionErrorLabel: afterDecisionErrorLabel ?? `${logPrefix} iOS push ${logContext}expire failed`
	});
}
function trackApprovalDelivery(run) {
	return trackAsyncWork(() => runWithRetainedGatewayRootWork(run));
}
function resolveFirstSuccessfulApprovalDelivery(deliveryTasks) {
	return new Promise((resolve) => {
		let remaining = deliveryTasks.length;
		for (const delivery of deliveryTasks) delivery.then((delivered) => {
			if (delivered) {
				resolve(true);
				return;
			}
			remaining -= 1;
			if (remaining === 0) resolve(false);
		});
	});
}
/** Runs external approval deliveries concurrently and reports whether any route accepted. */
function runApprovalRequestDeliveries(params) {
	const isTargetVisible = (target) => isApprovalRecordVisibleToClient({
		record: params.record,
		client: { connect: {
			client: { id: GATEWAY_CLIENT_IDS.IOS_APP },
			device: { id: target.deviceId },
			scopes: [...target.scopes]
		} }
	});
	const deliveryTasks = [params.forward, params.iosPush].flatMap((delivery) => {
		if (!delivery) return [];
		const [run, errorLabel] = delivery;
		return [trackApprovalDelivery(() => run(isTargetVisible)).catch((err) => {
			params.context.logGateway?.error?.(`${errorLabel}: ${String(err)}`);
			return false;
		})];
	});
	try {
		const webPushDelivery = params.context.approvalWebPushDelivery?.handleRequested(params.record);
		if (webPushDelivery !== false && webPushDelivery !== void 0) deliveryTasks.push(trackApprovalDelivery(() => Promise.resolve(webPushDelivery)).catch((err) => {
			params.context.logGateway?.error?.(`approval Web Push request failed: ${String(err)}`);
			return false;
		}));
	} catch (err) {
		params.context.logGateway?.error?.(`approval Web Push request failed: ${String(err)}`);
	}
	if (deliveryTasks.length === 0) return false;
	return resolveFirstSuccessfulApprovalDelivery(deliveryTasks);
}
//#endregion
export { handlePendingApprovalRequestWithDelivery as t };
