import { createMessageReceiptFromOutboundResults } from "openclaw/plugin-sdk/channel-outbound";
//#region extensions/slack/src/send-results.ts
function mergeSlackSendResults(results) {
	const lastResult = results.at(-1);
	if (!lastResult) throw new Error("Slack send plan produced no delivery.");
	if (results.length === 1) return lastResult;
	const receipt = createMessageReceiptFromOutboundResults({ results });
	receipt.parts = receipt.parts.map((part, index) => ({
		...part,
		index
	}));
	const questionResult = results.find((result) => result.meta?.slackQuestionActionIds.length);
	return {
		...lastResult,
		receipt,
		...questionResult?.meta ? { meta: {
			...questionResult.meta,
			slackQuestionMessageId: questionResult.meta.slackQuestionMessageId ?? questionResult.messageId
		} } : {}
	};
}
//#endregion
export { mergeSlackSendResults as t };
