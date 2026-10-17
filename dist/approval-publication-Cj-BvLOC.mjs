import { r as broadcastApprovalResolvedEvent } from "./approval-shared-Dk0HJprz.mjs";
//#region src/gateway/server-methods/approval-publication.ts
async function publishAppliedApprovalResolution(params) {
	const runSideEffect = async (effect, run) => {
		const approvalKind = params.record.kind;
		try {
			await run();
		} catch (error) {
			params.context.logGateway?.error?.(`${approvalKind} approvals: unified resolve ${effect} failed: ${String(error)}`);
		}
	};
	const decision = params.record.decision ?? "deny";
	const resolvedBy = params.liveRecord.resolvedBy ?? null;
	const ts = params.record.resolvedAtMs ?? Date.now();
	const event = {
		id: params.record.id,
		decision,
		resolvedBy,
		ts,
		request: params.liveRecord.request,
		...params.record.kind === "system-agent" && (params.record.status === "expired" || params.record.status === "cancelled") ? { terminalStatus: params.record.status } : {}
	};
	await runSideEffect("broadcast", () => broadcastApprovalResolvedEvent({
		approvalKind: params.record.kind,
		context: params.context,
		event,
		record: params.liveRecord
	}));
	const nativeApprovalKind = params.record.kind;
	if (nativeApprovalKind !== "system-agent" || params.record.status !== "allowed") try {
		params.context.approvalEvents?.publishResolved(nativeApprovalKind, event);
	} catch (error) {
		params.context.logGateway?.error?.(`${nativeApprovalKind} approvals: unified resolve internal-subscriber failed: ${String(error)}`);
	}
	const webPushDelivery = params.context.approvalWebPushDelivery;
	if (webPushDelivery && (nativeApprovalKind === "exec" || nativeApprovalKind === "plugin")) await runSideEffect("web-push", () => params.record.status === "expired" ? webPushDelivery.handleExpired(params.liveRecord) : webPushDelivery.handleResolved(event));
	if (params.record.kind === "exec" && params.forwarder) await runSideEffect("forwarder", () => params.forwarder.handleResolved(event));
	if (params.record.kind === "exec" && params.iosPushDelivery?.handleResolved) await runSideEffect("ios-push", () => params.iosPushDelivery.handleResolved(event));
	if (params.record.kind === "plugin" && params.forwarder?.handlePluginApprovalResolved) await runSideEffect("forwarder", () => params.forwarder.handlePluginApprovalResolved(event));
	if (params.record.kind === "plugin" && params.pluginIosPushDelivery?.handleResolved) await runSideEffect("ios-push", () => params.pluginIosPushDelivery.handleResolved(event));
	if (params.record.kind === "system-agent" && (params.record.status === "expired" || params.record.status === "cancelled") && params.forwarder?.handleSystemAgentApprovalResolved) await runSideEffect("forwarder", () => params.forwarder.handleSystemAgentApprovalResolved(event));
}
//#endregion
export { publishAppliedApprovalResolution as t };
