import { c as lineChannelPluginCommon } from "./channel-InKuXaRS.mjs";
import { r as lineSetupContract, t as lineSetupWizard } from "./setup-surface-1jkHGWg7.mjs";
//#region extensions/line/src/channel.setup.ts
const lineSetupPlugin = {
	id: "line",
	...lineChannelPluginCommon,
	setupWizard: lineSetupWizard,
	setupContract: lineSetupContract
};
//#endregion
export { lineSetupPlugin as t };
