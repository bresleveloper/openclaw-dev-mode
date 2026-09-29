import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import { s as readChannelAllowFromStore } from "./pairing-store-Cvj6ctV_.mjs";
import "./runtime-config-snapshot-Bm2YKbTW.mjs";
import "./conversation-runtime-Bg7d3Eiv.mjs";
import { t as listSkillCommandsForAgents } from "./chat-commands-DZNqfvMX.mjs";
import "./skill-commands-runtime-BYFCfsmk.mjs";
import { t as loadTelegramSendModule } from "./send-runtime-CC5nIb5r.mjs";
import { r as syncTelegramMenuCommands } from "./bot-native-command-menu-mqauwpQM.mjs";
//#region extensions/telegram/src/bot-native-command-deps.runtime.ts
const defaultTelegramNativeCommandDeps = {
	get getRuntimeConfig() {
		return getRuntimeConfig;
	},
	get readChannelAllowFromStore() {
		return readChannelAllowFromStore;
	},
	get listSkillCommandsForAgents() {
		return listSkillCommandsForAgents;
	},
	get syncTelegramMenuCommands() {
		return syncTelegramMenuCommands;
	},
	async runModelsAuthLoginFlow(opts) {
		const { runModelsAuthLoginFlow } = await import("./plugin-sdk/provider-auth-login-flow-runtime.js");
		return await runModelsAuthLoginFlow(opts);
	},
	async editMessageTelegram(...args) {
		const { editMessageTelegram } = await loadTelegramSendModule();
		return await editMessageTelegram(...args);
	},
	async sendMessageTelegram(...args) {
		const { sendMessageTelegram } = await loadTelegramSendModule();
		return await sendMessageTelegram(...args);
	}
};
//#endregion
export { defaultTelegramNativeCommandDeps as t };
