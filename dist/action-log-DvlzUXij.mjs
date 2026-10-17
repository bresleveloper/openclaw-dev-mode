import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { C as parseStrictNonNegativeInteger } from "./number-coercion-CuVhdCBs.mjs";
import { H as extractTextFromChatContent } from "./user-facing-text-DC1sCo4O.mjs";
import { n as stripToolMessages, t as extractStoredAssistantText } from "./chat-history-text-DMESwvkV.mjs";
import { n as commandReply } from "./command-gates-BzqqR9SG.mjs";
import { t as bindAgentToolGatewayRequest } from "./in-process-gateway-5-3wumVL.mjs";
import { t as formatRunLabel } from "./subagents-utils-DtuM-aOJ.mjs";
import { r as resolveSubagentEntryForToken } from "./shared-BzfMdhS1.mjs";
//#region src/auto-reply/reply/commands-subagents/action-log.ts
async function handleSubagentsLogAction(ctx) {
	const { readContext, restTokens } = ctx;
	const target = restTokens[0];
	if (!target) return commandReply("📜 Usage: /subagents log <id|#> [limit]");
	const includeTools = restTokens.some((token) => normalizeLowercaseStringOrEmpty(token) === "tools");
	const limitToken = restTokens.slice(1).find((token) => parseStrictNonNegativeInteger(token) !== void 0);
	const parsedLimit = parseStrictNonNegativeInteger(limitToken);
	const limit = parsedLimit === void 0 ? 20 : Math.min(200, Math.max(1, parsedLimit));
	const targetResolution = resolveSubagentEntryForToken(readContext.list.view, target);
	if ("reply" in targetResolution) return targetResolution.reply;
	const history = await bindAgentToolGatewayRequest({ hostedOnly: true })({
		method: "chat.history",
		params: {
			sessionKey: targetResolution.entry.childSessionKey,
			limit
		}
	});
	const rawMessages = Array.isArray(history?.messages) ? history.messages : [];
	const filtered = includeTools ? rawMessages : stripToolMessages(rawMessages);
	const lines = [];
	for (const message of filtered) {
		const assistant = message.role === "assistant";
		const text = extractTextFromChatContent(assistant ? extractStoredAssistantText(message) : message.content);
		if (!text) continue;
		lines.push(`${assistant ? "Assistant" : "User"}: ${text}`);
	}
	const header = `📜 Subagent log: ${formatRunLabel(targetResolution.entry)}`;
	if (lines.length === 0) return commandReply(`${header}\n(no messages)`);
	return commandReply([header, ...lines].join("\n"));
}
//#endregion
export { handleSubagentsLogAction };
