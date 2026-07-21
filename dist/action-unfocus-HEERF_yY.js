import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { n as normalizeConversationRef } from "./session-binding-normalization-sQL-8bRz.js";
import { n as getSessionBindingService } from "./session-binding-service-Cp2KThxY.js";
import { r as resolveConversationBindingContextFromAcpCommand } from "./conversation-binding-input-CpcHDFh9.js";
import { l as stopWithText } from "./shared-BeUhUF4c.js";
//#region src/auto-reply/reply/commands-subagents/action-unfocus.ts
async function handleSubagentsUnfocusAction(ctx) {
	const { params } = ctx;
	const bindingService = getSessionBindingService();
	const bindingContext = resolveConversationBindingContextFromAcpCommand(params);
	if (!bindingContext) return stopWithText("⚠️ /unfocus must be run inside a focused conversation.");
	const binding = bindingService.resolveByConversation(normalizeConversationRef({
		channel: bindingContext.channel,
		accountId: bindingContext.accountId,
		conversationId: bindingContext.conversationId,
		parentConversationId: bindingContext.parentConversationId
	}));
	if (!binding) return stopWithText("ℹ️ This conversation is not currently focused.");
	const senderId = normalizeOptionalString(params.command.senderId) ?? "";
	const boundBy = normalizeOptionalString(binding.metadata?.boundBy) ?? "";
	if (boundBy && boundBy !== "system" && senderId && senderId !== boundBy) return stopWithText(`⚠️ Only ${boundBy} can unfocus this conversation.`);
	await bindingService.unbind({
		bindingId: binding.bindingId,
		reason: "manual"
	});
	return stopWithText("✅ Conversation unfocused.");
}
//#endregion
export { handleSubagentsUnfocusAction };
