import { l as lineChannelPluginCommon } from "./channel-DIEVJ4PQ.mjs";
import { r as lineSetupContract, t as lineSetupWizard } from "./setup-surface-CYd8oqzt.mjs";
//#region extensions/line/src/channel.setup.ts
const lineSetupPlugin = {
	id: "line",
	...lineChannelPluginCommon,
	setupWizard: lineSetupWizard,
	setupContract: lineSetupContract
};
//#endregion
export { lineSetupPlugin as t };
