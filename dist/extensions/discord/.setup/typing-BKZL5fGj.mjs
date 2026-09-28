import { Ut as __exportAll, xt as sendChannelTyping } from "./discord-BXpHW-cu.mjs";
import { c as raceWithTimeout } from "./timeouts-D86uWLt_.mjs";
//#region extensions/discord/src/monitor/typing.ts
var typing_exports = /* @__PURE__ */ __exportAll({ sendTyping: () => sendTyping });
const DISCORD_TYPING_START_TIMEOUT_MS = 5e3;
async function sendTyping(params) {
	if ((await raceWithTimeout({
		promise: sendChannelTyping(params.rest, params.channelId).then(() => ({ kind: "sent" })),
		timeoutMs: DISCORD_TYPING_START_TIMEOUT_MS,
		onTimeout: () => ({ kind: "timeout" })
	})).kind === "timeout") throw new Error(`discord typing start timed out after ${DISCORD_TYPING_START_TIMEOUT_MS}ms`);
}
//#endregion
export { typing_exports as n, sendTyping as t };
