import { LA as ChannelOutboundAdapter, Lj as MessageReceipt, Pj as ChannelMessageSendTextContext, iA as ChannelPlugin } from "../../config-contracts-hzlacViZ.js";
import { r as OpenClawConfig } from "../../types.openclaw-D8uW-XQA.js";
import { a as ReefTransportClient, c as ReefAccount, d as ReefKeys, f as RelayFriend, i as ReefProtocolCompatibilityError, l as ReefDependencies, m as GuardAdapter, n as ReefFriendManager, o as WebSocketLike, p as ReefChannelConfig, r as ReefInboxConnection, s as InboxEntry, t as ReefMessageFlow, u as ReefIngressMessage } from "../../flow-Bcs9ntqX.js";
export declare const reefPlugin: ChannelPlugin<ReefAccount, unknown, unknown, 2>;
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
export declare function createConfiguredGuard(config: ReefChannelConfig, fetcher?: typeof fetch): GuardAdapter;
export { type InboxEntry, type ReefAccount, type ReefDependencies, ReefFriendManager, ReefInboxConnection, type ReefIngressMessage, type ReefKeys, ReefMessageFlow, ReefProtocolCompatibilityError, ReefTransportClient, type RelayFriend, type WebSocketLike };