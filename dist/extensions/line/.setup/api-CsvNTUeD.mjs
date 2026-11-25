import { r as lineSetupContract, t as lineSetupWizard } from "./setup-surface-DvbBjHFi.mjs";
import { l as lineChannelPluginCommon } from "./channel-DKx73los.mjs";
// extensions/line/src/channel.setup.ts
const lineSetupPlugin = {
	id: "line",
	...lineChannelPluginCommon,
	setupWizard: lineSetupWizard,
	setupContract: lineSetupContract
};
export { lineSetupPlugin as t };
