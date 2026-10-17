import { n as createLazyRuntimeMethodBinder } from "./lazy-runtime-CJrzFzqU.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import { s as readChannelAllowFromStore } from "./pairing-store-DEvhBgUm.mjs";
import "./runtime-config-snapshot-DlrhEsA8.mjs";
import "./conversation-runtime-DTQoVMvr.mjs";
import { t as listSkillCommandsForAgents } from "./chat-commands-DxFzY5zT.mjs";
import "./skill-commands-runtime-C6Ekpjtr.mjs";
import { t as loadTelegramSendModule } from "./send-runtime-DySi3qWn.mjs";
import { r as syncTelegramMenuCommands } from "./bot-native-command-menu-Bn19l31L.mjs";
//#region extensions/telegram/src/bot-native-command-deps.runtime.ts
const bindSend = createLazyRuntimeMethodBinder(loadTelegramSendModule);
const defaultTelegramNativeCommandDeps = {
	getRuntimeConfig,
	readChannelAllowFromStore,
	listSkillCommandsForAgents,
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
