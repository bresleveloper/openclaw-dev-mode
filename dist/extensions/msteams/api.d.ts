import { n as ChannelSetupWizard } from "../../setup-wizard-types-B5d8gsCo.js";
import { H as ChannelSetupAdapter } from "../../types.adapters-DTX0gDI1.js";
import { t as msteamsPlugin } from "../../channel-B2_1bmFq.js";

//#region extensions/msteams/src/setup-core.d.ts
declare const msteamsSetupAdapter: ChannelSetupAdapter;
declare function createMSTeamsSetupWizardBase(): Pick<ChannelSetupWizard, "channel" | "resolveAccountIdForConfigure" | "resolveShouldPromptAccountIds" | "status" | "credentials" | "finalize">;
//#endregion
//#region extensions/msteams/src/setup-surface.d.ts
declare function openDelegatedOAuthUrl(url: string): Promise<void>;
declare const msteamsSetupWizard: ChannelSetupWizard;
//#endregion
export { createMSTeamsSetupWizardBase, msteamsPlugin, msteamsSetupAdapter, msteamsSetupWizard, openDelegatedOAuthUrl };