import { i as zalouserSetupContract, t as createZalouserPluginBase } from "./shared-BrhVdA-C.mjs";
import { n as zalouserSetupWizard } from "./setup-surface-e3KfVOUQ.mjs";
//#region extensions/zalouser/src/channel.setup.ts
const zalouserSetupPlugin = { ...createZalouserPluginBase({
	setupWizard: zalouserSetupWizard,
	setupContract: zalouserSetupContract
}) };
//#endregion
export { zalouserSetupPlugin as t };
