import { n as zalouserSetupAdapter } from "./setup-core-D9JVwI25.js";
import { t as createZalouserPluginBase } from "./shared-DIzz-mTl.js";
import { t as zalouserSetupWizard } from "./setup-surface-CaGPOSFZ.js";
//#region extensions/zalouser/src/channel.setup.ts
const zalouserSetupPlugin = { ...createZalouserPluginBase({
	setupWizard: zalouserSetupWizard,
	setup: zalouserSetupAdapter
}) };
//#endregion
export { zalouserSetupPlugin as t };
