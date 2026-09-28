import { U as isSlackApprovalActionId } from "./session-status-Cf7AvWOt.mjs";
import { _ as decodeSlackApprovalAction } from "./reply-blocks-Bm8kf6mK.mjs";
import { asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { KeyedAsyncQueue } from "openclaw/plugin-sdk/keyed-async-queue";
//#region extensions/slack/src/approval-message-updates.ts
const updates = new KeyedAsyncQueue();
function runSlackApprovalMessageUpdate(target, update) {
	return updates.enqueue(JSON.stringify([
		target.accountId,
		target.channelId,
		target.messageTs
	]), update);
}
function hasSlackApprovalControl(blocks, approval) {
	return blocks?.some((rawBlock) => {
		const block = asOptionalRecord(rawBlock);
		if (block?.type !== "actions" || !Array.isArray(block.elements)) return false;
		return block.elements.some((rawElement) => {
			const element = asOptionalRecord(rawElement);
			if (element?.type !== "button" || typeof element.action_id !== "string" || !isSlackApprovalActionId(element.action_id)) return false;
			const current = decodeSlackApprovalAction(element.value);
			return current?.approvalId === approval.approvalId && current.approvalKind === approval.approvalKind && current.decision === approval.decision;
		});
	}) ?? false;
}
//#endregion
export { runSlackApprovalMessageUpdate as n, hasSlackApprovalControl as t };
