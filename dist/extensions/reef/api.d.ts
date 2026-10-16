import { n as OpenClawConfig } from "../../types.openclaw-C-OasKBU.js";
import { C as ChannelOutboundAdapter, S as ChannelPlugin, T as MessageReceipt, w as ChannelMessageSendTextContext } from "../../net-CNd-dg0-.js";
import "../../node-list-types-BtJ_nH3c.js";
import "../../config-contracts-C9WIRZbi.js";
import { a as ReefTransportClient, c as ReefAccount, d as ReefKeys, f as RelayFriend, i as ReefProtocolCompatibilityError, l as ReefDependencies, m as GuardAdapter, n as ReefFriendManager, o as WebSocketLike, p as ReefChannelConfig, r as ReefInboxConnection, s as InboxEntry, t as ReefMessageFlow, u as ReefIngressMessage } from "../../flow-tKggAzpf.js";
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