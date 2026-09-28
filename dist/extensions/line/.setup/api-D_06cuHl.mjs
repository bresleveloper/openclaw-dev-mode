import { n as lineChannelPluginCommon } from "./channel-kc3VRglA.mjs";
import { r as lineSetupContract, t as lineSetupWizard } from "./setup-surface-CcfKJKtr.mjs";
//#region extensions/line/src/channel.setup.ts
const lineSetupPlugin = {
	id: "line",
	...lineChannelPluginCommon,
	setupWizard: lineSetupWizard,
	setupContract: lineSetupContract
};
//#endregion
export { lineSetupPlugin as t };
