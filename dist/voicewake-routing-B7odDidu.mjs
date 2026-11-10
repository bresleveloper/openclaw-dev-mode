import { t as loadVoiceWakeRoutingConfig } from "./voicewake-routing-oBBZkItX.mjs";
//#region src/gateway/server-methods/voicewake-routing.ts
const voicewakeRoutingHandlers = { "voicewake.routing.get": async ({ respond }) => {
	respond(true, { config: await loadVoiceWakeRoutingConfig() });
} };
//#endregion
export { voicewakeRoutingHandlers };
