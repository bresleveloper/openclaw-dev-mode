import "./targets-B4oU7n-v.mjs";
import "./accounts-DacCvDBt.mjs";
import "./message-tool-api-B5NfPnFL.mjs";
import "./actions-FOjSVXxg.mjs";
import { s as imessageSetupContract } from "./setup-core-BHyLkAEJ.mjs";
import { n as createIMessagePluginBase, r as imessageSetupWizard } from "./channel-BtDnHgzF.mjs";
import "./conversation-bindings-DR-dbHjs.mjs";
import { createAllowedChatSenderMatcher as createAllowedChatSenderMatcher$1, parseChatAllowTargetPrefixes, parseChatTargetPrefixesOrThrow as parseChatTargetPrefixesOrThrow$1, resolveServicePrefixedAllowTarget, resolveServicePrefixedChatTarget as resolveServicePrefixedChatTarget$1, resolveServicePrefixedOrChatAllowTarget as resolveServicePrefixedOrChatAllowTarget$1, resolveServicePrefixedTarget } from "openclaw/plugin-sdk/channel-targets";
//#region extensions/imessage/src/channel.setup.ts
const imessageSetupPlugin = createIMessagePluginBase({
	setupWizard: imessageSetupWizard,
	setupContract: imessageSetupContract
});
//#endregion
export { resolveServicePrefixedChatTarget$1 as a, imessageSetupPlugin as c, resolveServicePrefixedAllowTarget as i, parseChatAllowTargetPrefixes as n, resolveServicePrefixedOrChatAllowTarget$1 as o, parseChatTargetPrefixesOrThrow$1 as r, resolveServicePrefixedTarget as s, createAllowedChatSenderMatcher$1 as t };
