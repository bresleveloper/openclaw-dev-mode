import { r as getRuntimeConfig } from "./io.runtime-CXaC-ufL.mjs";
import { s as readChannelAllowFromStore } from "./pairing-store-Cvj6ctV_.mjs";
import "./runtime-config-snapshot-CyQh9ezF.mjs";
import "./conversation-runtime-DR4DYTzk.mjs";
import { t as listSkillCommandsForAgents } from "./chat-commands-DJzkxYfH.mjs";
import "./skill-commands-runtime-aNxq_Val.mjs";
import { t as loadTelegramSendModule } from "./send-runtime-C6sNmHxn.mjs";
import { r as syncTelegramMenuCommands } from "./bot-native-command-menu-gyXk1-Xd.mjs";
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
