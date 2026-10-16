import { n as markInboundContextLabel } from "./inbound-context-marker-DDxVZisx.mjs";
import { createHash } from "node:crypto";
//#region src/agents/cli-image-turn-correlation.ts
const CLI_IMAGE_TURN_HEADER = markInboundContextLabel("Image turn:");
const CLI_IMAGE_TURN_BLOCK_PATTERN = new RegExp(`${CLI_IMAGE_TURN_HEADER}\\n\`\`\`json\\n\\{"turnKey":"([a-f0-9]{64})"\\}\\n\`\`\``, "g");
function hashCliImageTurnEntryId(entryId) {
	return createHash("sha256").update(entryId).digest("hex");
}
function formatCliImageTurnContext(turnKey) {
	return `${CLI_IMAGE_TURN_HEADER}\n\`\`\`json\n${JSON.stringify({ turnKey })}\n\`\`\``;
}
function readCliImageTurnContext(text) {
	const keys = Array.from(text.matchAll(CLI_IMAGE_TURN_BLOCK_PATTERN), (match) => match[1]);
	if (keys.length !== text.split(CLI_IMAGE_TURN_HEADER).length - 1) return;
	const first = keys[0];
	return first && keys.every((key) => key === first) ? first : void 0;
}
function stripCliImageTurnContext(text, turnKey) {
	const block = formatCliImageTurnContext(turnKey);
	return text.replace(`\n\n${block}\n\n`, "\n\n").replace(`${block}\n\n`, "").replace(`\n\n${block}`, "");
}
//#endregion
export { stripCliImageTurnContext as i, hashCliImageTurnEntryId as n, readCliImageTurnContext as r, formatCliImageTurnContext as t };
