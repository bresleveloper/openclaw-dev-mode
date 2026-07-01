import { n as ChannelSetupWizard } from "./setup-wizard-types-B5d8gsCo.js";
import { H as ChannelSetupAdapter } from "./types.adapters-DTX0gDI1.js";
import { ml as OpenClawPluginToolContext } from "./types-BVLQjFJF.js";
import { a as AnyAgentTool } from "./plugin-entry-DpILbQ7M.js";
//#region extensions/zalouser/src/tool.d.ts
type ZalouserToolContext = Pick<OpenClawPluginToolContext, "deliveryContext">;
declare function createZalouserTool(context?: ZalouserToolContext): AnyAgentTool;
//#endregion
//#region extensions/zalouser/src/setup-core.d.ts
declare const zalouserSetupAdapter: ChannelSetupAdapter;
declare function createZalouserSetupWizardProxy(loadWizard: () => Promise<ChannelSetupWizard>): ChannelSetupWizard;
//#endregion
//#region extensions/zalouser/src/setup-surface.d.ts
declare const zalouserSetupWizard: ChannelSetupWizard;
//#endregion
export { createZalouserTool as i, createZalouserSetupWizardProxy as n, zalouserSetupAdapter as r, zalouserSetupWizard as t };