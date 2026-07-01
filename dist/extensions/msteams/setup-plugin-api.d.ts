import { t as ChannelPlugin } from "../../types.plugin-DvEuFaxA.js";
//#region extensions/msteams/src/channel.setup.d.ts
type ResolvedMSTeamsAccount = {
  accountId: string;
  enabled: boolean;
  configured: boolean;
};
declare const msteamsSetupPlugin: ChannelPlugin<ResolvedMSTeamsAccount>;
//#endregion
export { msteamsSetupPlugin };