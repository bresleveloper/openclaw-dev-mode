import { t as __exportAll } from "./rolldown-runtime-B4FMCO8f.mjs";
import { Routes } from "discord-api-types/v10";
import { raceWithTimeout } from "openclaw/plugin-sdk/time-runtime";
//#region extensions/discord/src/monitor/typing.ts
var typing_exports = /* @__PURE__ */ __exportAll({ sendTyping: () => sendTyping });
const DISCORD_TYPING_START_TIMEOUT_MS = 5e3;
async function sendTyping(params) {
	if ((await raceWithTimeout(params.rest.post(Routes.channelTyping(params.channelId)).then(() => ({ kind: "sent" })), DISCORD_TYPING_START_TIMEOUT_MS, () => ({ kind: "timeout" }), { ref: false })).kind === "timeout") throw new Error(`discord typing start timed out after ${DISCORD_TYPING_START_TIMEOUT_MS}ms`);
}
//#endregion
export { typing_exports as n, sendTyping as t };
