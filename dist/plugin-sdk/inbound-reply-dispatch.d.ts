import { M as OpenClawConfig } from "../types-D7I_F5Ux.js";
import { Bp as DurableInboundReplyDeliveryParams, Cm as resolveChannelTurnDispatchCounts, Sm as hasVisibleChannelTurnDispatch, Vx as recordInboundSession, _k as ReplyPayload, _p as dispatchChannelInboundReply, bp as runChannelInboundEvent, f as GetReplyOptions, fp as ChannelInboundEventRunnerParams, h_ as ChannelTurnRecordOptions, hp as PreparedInboundReply, i as FinalizedMsgContext, kd as deliverInboundReplyWithMessageSendContext, lp as AssembledInboundReply, m_ as ChannelTurnDroppedHistoryOptions, mp as InboundReplyDispatchResult, o_ as DispatchReplyWithBufferedBlockDispatcher, v_ as ChannelBotLoopProtectionFacts, wm as recordDroppedChannelTurnHistory, xm as hasFinalChannelTurnDispatch, xp as runPreparedInboundReply, y_ as recordChannelBotPairLoopAndCheckSuppression, zp as DurableInboundReplyDeliveryOptions } from "../config-contracts-CY87ANNp.js";
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