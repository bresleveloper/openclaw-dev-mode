import { createMessageReceiptFromOutboundResults } from "openclaw/plugin-sdk/channel-outbound";
// extensions/slack/src/send-results.ts
function mergeSlackSendResults(results) {
	const lastResult = results.at(-1);
	if (!lastResult) throw new Error("Slack send plan produced no delivery.");
	if (results.length === 1) return lastResult;
	const receipt = createMessageReceiptFromOutboundResults({ results });
	receipt.parts.forEach((part, index) => {
		part.index = index;
	});
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
export { mergeSlackSendResults as t };
