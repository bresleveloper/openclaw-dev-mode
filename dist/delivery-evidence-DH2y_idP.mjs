//#region src/agents/cli-runner/delivery-evidence.ts
const CLI_MESSAGING_DELIVERY_EVIDENCE_KEY = "cliMessagingDeliveryEvidence";
function projectCliMessagingDeliveryEvidence(output, snapshot = false) {
	const evidence = {};
	for (const key of [
		"didSendViaMessagingTool",
		"didDeliverSourceReplyViaMessageTool",
		"sourceReplyDelivered"
	]) if (output[key]) evidence[key] = true;
	for (const key of [
		"messagingToolSentTexts",
		"messagingToolSentMediaUrls",
		"messagingToolSentTargets",
		"messagingToolSourceReplyPayloads"
	]) {
		const values = output[key];
		if (values?.length) Object.assign(evidence, { [key]: snapshot ? values.slice() : values });
	}
	return evidence;
}
function snapshotCliMessagingDeliveryEvidence(output) {
	return output.didSendViaMessagingTool === true ? projectCliMessagingDeliveryEvidence(output, true) : void 0;
}
/** Attaches confirmed delivery evidence so caller retries cannot duplicate a visible send. */
function attachCliMessagingDeliveryEvidence(error, output) {
	const evidence = snapshotCliMessagingDeliveryEvidence(output);
	if (!evidence) return error;
	if (error && typeof error === "object") try {
		Object.assign(error, { [CLI_MESSAGING_DELIVERY_EVIDENCE_KEY]: evidence });
		return error;
	} catch {}
	const wrapped = new Error(error instanceof Error ? error.message : String(error), { cause: error });
	Object.assign(wrapped, { [CLI_MESSAGING_DELIVERY_EVIDENCE_KEY]: evidence });
	return wrapped;
}
/** Reads confirmed delivery evidence from a failed CLI attempt. */
function getCliMessagingDeliveryEvidence(error) {
	if (!error || typeof error !== "object") return;
	const evidence = error[CLI_MESSAGING_DELIVERY_EVIDENCE_KEY];
	return evidence && typeof evidence === "object" ? snapshotCliMessagingDeliveryEvidence(evidence) : void 0;
}
//#endregion
export { getCliMessagingDeliveryEvidence as n, projectCliMessagingDeliveryEvidence as r, attachCliMessagingDeliveryEvidence as t };
