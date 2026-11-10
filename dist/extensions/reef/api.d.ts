import { M as OpenClawConfig } from "../../types-D7I_F5Ux.js";
import { NE as ChannelPlugin, aO as ChannelMessageSendTextContext, cD as ChannelOutboundAdapter, cO as MessageReceipt } from "../../config-contracts-CY87ANNp.js";
import { a as ReefTransportClient, c as ReefAccount, d as ReefKeys, f as RelayFriend, i as ReefProtocolCompatibilityError, l as ReefDependencies, m as GuardAdapter, n as ReefFriendManager, o as WebSocketLike, p as ReefChannelConfig, r as ReefInboxConnection, s as InboxEntry, t as ReefMessageFlow, u as ReefIngressMessage } from "../../flow-BGnvCpn_.js";
//#region extensions/reef/src/channel.d.ts
export declare const reefPlugin: ChannelPlugin<ReefAccount, unknown, unknown, 2>;
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