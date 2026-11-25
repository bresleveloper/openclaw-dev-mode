import { Ot as escapeSlackMrkdwn, V as SLACK_QUESTION_FINALIZATION_BLOCKS, Y as isSlackQuestionActionForQuestion, Z as resolveSlackQuestionActionIds, ct as buildSlackCompleteBlocksFallbackText } from "./probe-BHqvMbno.mjs";
import { questionGatewayRuntime } from "openclaw/plugin-sdk/question-gateway-runtime";
// extensions/slack/src/question-delivery.ts
function registerSlackQuestionDelivery(params) {
	const blocks = params.result.meta?.[SLACK_QUESTION_FINALIZATION_BLOCKS];
	if (!blocks || resolveSlackQuestionActionIds(blocks, params.questionId).length === 0) return;
	const messageId = params.result.meta?.slackQuestionMessageId ?? params.result.messageId;
	const text = params.text || buildSlackCompleteBlocksFallbackText(blocks);
	questionGatewayRuntime.registerChannelDelivery({
		questionId: params.questionId,
		deliveryId: `slack:${params.accountId ?? "default"}:${params.result.channelId}:${messageId}`,
		finalize: async (statusLine) => {
			const escapedStatusLine = escapeSlackMrkdwn(statusLine);
			const displayBlocks = blocks.flatMap((block) => {
				if (block.type !== "actions") return [block];
				const actions = block;
				const elements = actions.elements.filter((element) => !isSlackQuestionActionForQuestion(element, params.questionId));
				return elements.length ? [{
					...actions,
					elements
				}] : [];
			});
			await params.update({
				channelId: params.result.channelId,
				messageTs: messageId,
				text: `${text}\n\n${escapedStatusLine}`,
				blocks: [...displayBlocks, {
					type: "context",
					elements: [{
						type: "mrkdwn",
						text: escapedStatusLine
					}]
				}]
			});
		}
	});
}
export { registerSlackQuestionDelivery as t };
