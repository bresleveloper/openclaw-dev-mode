import { n as createLazyRuntimeMethodBinder } from "./lazy-runtime-CJrzFzqU.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { t as readChannelAllowFromStore } from "./pairing-store.read-30DeRp-H.mjs";
import "./runtime-config-snapshot-kTPhBdOK.mjs";
import "./conversation-runtime-BSuRFTFZ.mjs";
import { i as prepareSkillCommandsForAgents } from "./chat-commands-C__qSMA1.mjs";
import "./skill-commands-runtime-BENJGDHO.mjs";
import { t as loadTelegramSendModule } from "./send-runtime-D0DywdNH.mjs";
import { r as syncTelegramMenuCommands } from "./bot-native-command-menu-BewpTM88.mjs";
//#region extensions/telegram/src/bot-native-command-deps.runtime.ts
const bindSend = createLazyRuntimeMethodBinder(loadTelegramSendModule);
const defaultTelegramNativeCommandDeps = {
	getRuntimeConfig: readRuntimeConfig,
	readChannelAllowFromStore,
	prepareSkillCommandsForAgents,
	syncTelegramMenuCommands,
	async runModelsAuthLoginFlow(opts) {
		const { runModelsAuthLoginFlow } = await import("./plugin-sdk/provider-auth-login-flow-runtime.js");
		return await runModelsAuthLoginFlow(opts);
	},
	editMessageTelegram: bindSend((runtime) => runtime.editMessageTelegram),
	sendMessageTelegram: bindSend((runtime) => runtime.sendMessageTelegram)
};
//#endregion
export { defaultTelegramNativeCommandDeps as t };
