import { C as parseStrictNonNegativeInteger } from "./number-coercion-CLj0HTDM.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as commandReply } from "./command-gates-DqpLd5XK.mjs";
import { t as formatRunLabel } from "./subagents-utils-uco3tjYq.mjs";
import { t as bindAgentToolGatewayRequest } from "./in-process-gateway-DZ9VbywH.mjs";
import { n as stripToolMessages } from "./chat-history-text-ZJR9s0Sl.mjs";
import { i as resolveSubagentEntryForToken, n as formatLogLines } from "./shared-CRbYc0tq.mjs";
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
	const lines = formatLogLines(filtered);
	const header = `📜 Subagent log: ${formatRunLabel(targetResolution.entry)}`;
	if (lines.length === 0) return commandReply(`${header}\n(no messages)`);
	return commandReply([header, ...lines].join("\n"));
}
//#endregion
export { handleSubagentsLogAction };
