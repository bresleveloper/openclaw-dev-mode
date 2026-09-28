import { n as zalouserSetupWizard } from "./setup-surface-BqN86eDL.mjs";
import { i as zalouserSetupContract, t as createZalouserPluginBase } from "./shared-Dv-QbpZj.mjs";
//#region extensions/zalouser/src/channel.setup.ts
const zalouserSetupPlugin = { ...createZalouserPluginBase({
	setupWizard: zalouserSetupWizard,
	setupContract: zalouserSetupContract
}) };
//#endregion
export { zalouserSetupPlugin as t };
