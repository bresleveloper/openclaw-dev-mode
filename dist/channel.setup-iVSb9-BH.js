import { n as zalouserSetupAdapter } from "./setup-core-DNg9zUmt.js";
import { t as createZalouserPluginBase } from "./shared-CSgcP8WB.js";
import { t as zalouserSetupWizard } from "./setup-surface-D10_wzGH.js";
//#region extensions/zalouser/src/channel.setup.ts
const zalouserSetupPlugin = { ...createZalouserPluginBase({
	setupWizard: zalouserSetupWizard,
	setup: zalouserSetupAdapter
}) };
//#endregion
export { zalouserSetupPlugin as t };
