import { i as zalouserSetupContract, t as createZalouserPluginBase } from "./shared-CM-QZ6_V.mjs";
import { n as zalouserSetupWizard } from "./setup-surface-DOT4B6O5.mjs";
// extensions/zalouser/src/channel.setup.ts
const zalouserSetupPlugin = { ...createZalouserPluginBase({
	setupWizard: zalouserSetupWizard,
	setupContract: zalouserSetupContract
}) };
export { zalouserSetupPlugin as t };
