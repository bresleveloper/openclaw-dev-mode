import { r as OpenClawConfig } from "../types.openclaw-DWWUw8hA.js";
import { pn as ReplyPayload, st as FinalizedMsgContext, yt as GetReplyOptions } from "../reply-payload-DazZPys5.js";
import { Ba as ChannelTurnRecordOptions, La as ChannelTurnDroppedHistoryOptions, Xa as recordChannelBotPairLoopAndCheckSuppression, Ya as ChannelBotLoopProtectionFacts, ba as recordDroppedChannelTurnHistory, uo as DispatchReplyWithBufferedBlockDispatcher } from "../agent-harness-runtime-DZjstJNb.js";
import { at as hasVisibleChannelTurnDispatch, f as runChannelInboundEvent, i as ChannelInboundEventRunnerParams, it as hasFinalChannelTurnDispatch, l as dispatchChannelInboundReply, o as InboundReplyDispatchResult, ot as resolveChannelTurnDispatchCounts, p as runPreparedInboundReply, s as PreparedInboundReply, t as AssembledInboundReply } from "../channel-inbound-ClTMyLfP.js";
import { a as DurableInboundReplyDeliveryParams, i as DurableInboundReplyDeliveryOptions } from "../receipt-D19RX4vZ.js";
import { n as deliverInboundReplyWithMessageSendContext } from "../channel-outbound-S1LTwK5l.js";
import { t as recordInboundSession } from "../session-D7eRBIsl.js";
//#region src/infra/outbound/reply-payload-normalize.d.ts
/** Outbound fields accepted from loose producers. */
type OutboundReplyPayload = Pick<ReplyPayload, "text" | "mediaUrls" | "mediaUrl" | "presentation" | "presentationTextMode" | "interactive" | "channelData" | "sensitiveMedia" | "replyToId" | "location" | "videoAsNote">;
//#endregion
//#region src/plugin-sdk/inbound-reply-dispatch.d.ts
type ReplyOptionsWithoutModelSelected = Omit<Omit<GetReplyOptions, "onBlockReply">, "onModelSelected">;
type RecordInboundSessionFn = typeof recordInboundSession;
declare function buildInboundReplyDispatchBase(params: {
  cfg: OpenClawConfig;
  channel: string;
  accountId?: string;
  route: {
    agentId: string;
    sessionKey: string;
  };
  storePath: string;
  ctxPayload: FinalizedMsgContext;
  core: {
    channel: {
      session: {
        recordInboundSession: RecordInboundSessionFn;
      };
      reply: {
        dispatchReplyWithBufferedBlockDispatcher: DispatchReplyWithBufferedBlockDispatcher;
      };
    };
  };
}): {
  cfg: OpenClawConfig;
  channel: string;
  accountId: string | undefined;
  agentId: string;
  routeSessionKey: string;
  storePath: string;
  ctxPayload: FinalizedMsgContext;
  recordInboundSession: typeof recordInboundSession;
  dispatchReplyWithBufferedBlockDispatcher: DispatchReplyWithBufferedBlockDispatcher;
};
type BuildInboundReplyDispatchBaseParams = Parameters<typeof buildInboundReplyDispatchBase>[0];
type RecordInboundSessionAndDispatchReplyParams = {
  cfg: OpenClawConfig;
  channel: string;
  accountId?: string;
  agentId: string;
  routeSessionKey: string;
  storePath: string;
  ctxPayload: FinalizedMsgContext;
  recordInboundSession: RecordInboundSessionFn;
  dispatchReplyWithBufferedBlockDispatcher: DispatchReplyWithBufferedBlockDispatcher;
  deliver: (payload: OutboundReplyPayload) => Promise<void>;
  durable?: false | DurableInboundReplyDeliveryOptions;
  onRecordError: (err: unknown) => void;
  onDispatchError: (err: unknown, info: {
    kind: string;
  }) => void;
  replyOptions?: ReplyOptionsWithoutModelSelected;
};
export declare function dispatchInboundReplyWithBase(params: BuildInboundReplyDispatchBaseParams & Pick<RecordInboundSessionAndDispatchReplyParams, "deliver" | "durable" | "onRecordError" | "onDispatchError" | "replyOptions">): Promise<void>;
//#endregion
export { type AssembledInboundReply, type ChannelBotLoopProtectionFacts, type ChannelTurnDroppedHistoryOptions as ChannelInboundDroppedHistoryOptions, type ChannelTurnDroppedHistoryOptions, type ChannelInboundEventRunnerParams, type ChannelTurnRecordOptions, type ChannelTurnRecordOptions as InboundReplyRecordOptions, type DurableInboundReplyDeliveryParams, type InboundReplyDispatchResult, type PreparedInboundReply, deliverInboundReplyWithMessageSendContext, dispatchChannelInboundReply, hasFinalChannelTurnDispatch as hasFinalInboundReplyDispatch, hasVisibleChannelTurnDispatch as hasVisibleInboundReplyDispatch, recordChannelBotPairLoopAndCheckSuppression, recordDroppedChannelTurnHistory as recordDroppedChannelInboundHistory, recordDroppedChannelTurnHistory, resolveChannelTurnDispatchCounts as resolveInboundReplyDispatchCounts, runChannelInboundEvent, runPreparedInboundReply };