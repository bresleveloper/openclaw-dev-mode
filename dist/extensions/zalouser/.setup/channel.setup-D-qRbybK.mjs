import { i as zalouserSetupContract, t as createZalouserPluginBase } from "./shared-CRZ1TLNs.mjs";
import { n as zalouserSetupWizard } from "./setup-surface-Dps1TyX-.mjs";
//#region extensions/zalouser/src/channel.setup.ts
const zalouserSetupPlugin = { ...createZalouserPluginBase({
	setupWizard: zalouserSetupWizard,
	setupContract: zalouserSetupContract
}) };
//#endregion
export { zalouserSetupPlugin as t };
