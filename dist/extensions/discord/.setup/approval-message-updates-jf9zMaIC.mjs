import { $ as parseCustomId } from "./discord-BXpHW-cu.mjs";
import { c as parseExecApprovalData } from "./components-yBEb75bB.mjs";
import { KeyedAsyncQueue } from "openclaw/plugin-sdk/keyed-async-queue";
//#region extensions/discord/src/approval-message-updates.ts
const discordApprovalMessageUpdates = new KeyedAsyncQueue();
/** Read the current control identity, rather than reconstructing delivery ownership. */
function hasDiscordApprovalControl(message, approval) {
	if (!message || typeof message !== "object") return false;
	if ("custom_id" in message && typeof message.custom_id === "string") {
		const customId = parseCustomId(message.custom_id);
		const current = customId.key === "execapproval" ? parseExecApprovalData(customId.data) : null;
		return current?.approvalId === approval.approvalId && current.approvalKind === approval.approvalKind && current.action === approval.action;
	}
	return "components" in message && Array.isArray(message.components) && message.components.some((component) => hasDiscordApprovalControl(component, approval));
}
//#endregion
export { hasDiscordApprovalControl as n, discordApprovalMessageUpdates as t };
