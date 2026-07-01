import { I as ChannelStructuredComponents } from "./types.core-DDKBE3_n.js";
import { mt as PluginInteractiveRegistration } from "./types-BVLQjFJF.js";
import { n as PluginConversationBindingRequestParams, r as PluginConversationBindingRequestResult, t as PluginConversationBinding } from "./conversation-binding.types-BOz_kKQY.js";
//#region extensions/discord/src/interactive-dispatch.d.ts
type DiscordInteractiveHandlerContext = {
  channel: "discord";
  accountId: string;
  interactionId: string;
  conversationId: string;
  parentConversationId?: string;
  guildId?: string;
  senderId?: string;
  senderUsername?: string;
  auth: {
    isAuthorizedSender: boolean;
  };
  interaction: {
    kind: "button" | "select" | "modal";
    data: string;
    namespace: string;
    payload: string;
    messageId?: string;
    values?: string[];
    fields?: Array<{
      id: string;
      name: string;
      values: string[];
    }>;
  };
  respond: {
    acknowledge: () => Promise<void>;
    reply: (params: {
      text: string;
      ephemeral?: boolean;
    }) => Promise<void>;
    followUp: (params: {
      text: string;
      ephemeral?: boolean;
    }) => Promise<void>;
    editMessage: (params: {
      text?: string;
      components?: ChannelStructuredComponents;
    }) => Promise<void>;
    clearComponents: (params?: {
      text?: string;
    }) => Promise<void>;
  };
  requestConversationBinding: (params?: PluginConversationBindingRequestParams) => Promise<PluginConversationBindingRequestResult>;
  detachConversationBinding: () => Promise<{
    removed: boolean;
  }>;
  getCurrentConversationBinding: () => Promise<PluginConversationBinding | null>;
};
type DiscordInteractiveHandlerRegistration = PluginInteractiveRegistration<DiscordInteractiveHandlerContext, "discord">;
//#endregion
export { DiscordInteractiveHandlerRegistration as n, DiscordInteractiveHandlerContext as t };