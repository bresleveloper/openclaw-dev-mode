import { t as loadVoiceWakeRoutingConfig } from "./voicewake-routing-Dh15APAj.mjs";
//#region src/gateway/server-methods/voicewake-routing.ts
/** Gateway request handlers for reading voice wake routing. */
const voicewakeRoutingHandlers = { "voicewake.routing.get": async ({ respond }) => {
	respond(true, { config: await loadVoiceWakeRoutingConfig() });
} };
//#endregion
export { voicewakeRoutingHandlers };
