import "./targets-C7CIWJ0k.mjs";
import "./accounts-C1Ypv3Wn.mjs";
import "./message-tool-api-DtZ1wKbT.mjs";
import "./actions-hiNfM1nd.mjs";
import { s as imessageSetupContract } from "./setup-core-B1_P_t4T.mjs";
import { n as createIMessagePluginBase, r as imessageSetupWizard } from "./channel-lXec0E6o.mjs";
import "./conversation-bindings-8DjxoIYU.mjs";
import { createAllowedChatSenderMatcher as createAllowedChatSenderMatcher$1, parseChatAllowTargetPrefixes, parseChatTargetPrefixesOrThrow as parseChatTargetPrefixesOrThrow$1, resolveServicePrefixedAllowTarget, resolveServicePrefixedChatTarget as resolveServicePrefixedChatTarget$1, resolveServicePrefixedOrChatAllowTarget as resolveServicePrefixedOrChatAllowTarget$1, resolveServicePrefixedTarget } from "openclaw/plugin-sdk/channel-targets";
// extensions/imessage/src/channel.setup.ts
const imessageSetupPlugin = createIMessagePluginBase({
	setupWizard: imessageSetupWizard,
	setupContract: imessageSetupContract
});
export { resolveServicePrefixedChatTarget$1 as a, imessageSetupPlugin as c, resolveServicePrefixedAllowTarget as i, parseChatAllowTargetPrefixes as n, resolveServicePrefixedOrChatAllowTarget$1 as o, parseChatTargetPrefixesOrThrow$1 as r, resolveServicePrefixedTarget as s, createAllowedChatSenderMatcher$1 as t };
