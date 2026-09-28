import { F as MessageReceipt, M as ChannelPlugin, N as ChannelOutboundAdapter, P as ChannelMessageSendTextContext, z as OpenClawConfig } from "../../cli-backend.types-kTOThe9I.js";
import "../../context-visibility-B6IQ5BVZ.js";
import { a as ReefProtocolCompatibilityError, c as InboxEntry, d as ReefIngressMessage, f as ReefKeys, h as GuardAdapter, i as ReefInboxConnection, l as ReefAccount, m as ReefChannelConfig, o as ReefTransportClient, p as RelayFriend, r as ReefFriendManager, s as WebSocketLike, t as ReefMessageFlow, u as ReefDependencies } from "../../flow-DHgGYNGA.js";
//#region extensions/reef/src/channel.d.ts
export declare const reefPlugin: ChannelPlugin<ReefAccount>;
//#endregion
//#region extensions/reef/src/outbound.d.ts
export declare const reefOutboundAdapter: ChannelOutboundAdapter;
export declare const reefMessageAdapter: {
  readonly id: "reef";
  readonly durableFinal: {
    readonly capabilities: {
      readonly text: true;
      readonly replyTo: true;
      readonly thread: true;
    };
  };
  readonly send: {
    readonly text: (ctx: ChannelMessageSendTextContext<OpenClawConfig>) => Promise<{
      receipt: MessageReceipt;
      messageId: string;
    }>;
  };
  readonly receive: {
    readonly defaultAckPolicy: "after_receive_record";
    readonly supportedAckPolicies: readonly ["after_receive_record"];
  };
} & {
  receive: {
    readonly defaultAckPolicy: "after_receive_record";
    readonly supportedAckPolicies: readonly ["after_receive_record"];
  };
};
//#endregion
//#region extensions/reef/src/guard.d.ts
export declare function createConfiguredGuard(config: ReefChannelConfig, fetcher?: typeof fetch): GuardAdapter;
//#endregion
export { type InboxEntry, type ReefAccount, type ReefDependencies, ReefFriendManager, ReefInboxConnection, type ReefIngressMessage, type ReefKeys, ReefMessageFlow, ReefProtocolCompatibilityError, ReefTransportClient, type RelayFriend, type WebSocketLike };