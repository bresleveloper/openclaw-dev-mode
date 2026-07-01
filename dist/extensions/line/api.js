import { n as lineChannelPluginCommon, t as linePlugin } from "../../channel-CQcF54tQ.js";
import { n as lineSetupAdapter, t as lineSetupWizard } from "../../setup-surface-D_txgOfO.js";
//#region extensions/line/src/channel.setup.ts
const lineSetupPlugin = {
	id: "line",
	...lineChannelPluginCommon,
	setupWizard: lineSetupWizard,
	setup: lineSetupAdapter
};
//#endregion
export { linePlugin, lineSetupPlugin };
