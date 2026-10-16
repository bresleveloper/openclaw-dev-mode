import "./targets-BicBiYsM.mjs";
import "./accounts-evTpvJMv.mjs";
import "./message-tool-api-CqfRxLlT.mjs";
import "./actions-DJqbUmbN.mjs";
import { s as imessageSetupContract } from "./setup-core-DqOBe-n0.mjs";
import { n as createIMessagePluginBase, r as imessageSetupWizard } from "./channel-CL73qdMG.mjs";
import "./conversation-bindings-GDQ_Laxj.mjs";
import { createAllowedChatSenderMatcher as createAllowedChatSenderMatcher$1, parseChatAllowTargetPrefixes, parseChatTargetPrefixesOrThrow as parseChatTargetPrefixesOrThrow$1, resolveServicePrefixedAllowTarget, resolveServicePrefixedChatTarget as resolveServicePrefixedChatTarget$1, resolveServicePrefixedOrChatAllowTarget as resolveServicePrefixedOrChatAllowTarget$1, resolveServicePrefixedTarget } from "openclaw/plugin-sdk/channel-targets";
//#region extensions/imessage/src/channel.setup.ts
const imessageSetupPlugin = { ...createIMessagePluginBase({
	setupWizard: imessageSetupWizard,
	setupContract: imessageSetupContract
}) };
//#endregion
export { resolveServicePrefixedChatTarget$1 as a, imessageSetupPlugin as c, resolveServicePrefixedAllowTarget as i, parseChatAllowTargetPrefixes as n, resolveServicePrefixedOrChatAllowTarget$1 as o, parseChatTargetPrefixesOrThrow$1 as r, resolveServicePrefixedTarget as s, createAllowedChatSenderMatcher$1 as t };
