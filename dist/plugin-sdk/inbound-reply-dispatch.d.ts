import { $ as DispatchReplyWithBufferedBlockDispatcher, $h as InboundReplyDispatchResult, I_ as ChannelBotLoopProtectionFacts, Jh as AssembledInboundReply, L_ as recordChannelBotPairLoopAndCheckSuppression, M_ as ChannelTurnDroppedHistoryOptions, N_ as ChannelTurnRecordOptions, Tg as DurableInboundReplyDeliveryParams, Yk as recordInboundSession, Zh as ChannelInboundEventRunnerParams, __ as resolveChannelTurnDispatchCounts, aM as ReplyPayload, ag as runChannelInboundEvent, eg as PreparedInboundReply, f as GetReplyOptions, fm as deliverInboundReplyWithMessageSendContext, g_ as hasVisibleChannelTurnDispatch, h_ as hasFinalChannelTurnDispatch, i as FinalizedMsgContext, ng as dispatchChannelInboundReply, og as runPreparedInboundReply, wg as DurableInboundReplyDeliveryOptions, y_ as recordDroppedChannelTurnHistory } from "../config-contracts-hzlacViZ.js";
import { r as OpenClawConfig } from "../types.openclaw-D8uW-XQA.js";
/** Outbound fields accepted from loose producers. */
type OutboundReplyPayload = Pick<ReplyPayload, "text" | "mediaUrls" | "mediaUrl" | "presentation" | "presentationTextMode" | "interactive" | "channelData" | "sensitiveMedia" | "replyToId" | "location" | "videoAsNote">;
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
export { type AssembledInboundReply, type ChannelBotLoopProtectionFacts, type ChannelTurnDroppedHistoryOptions as ChannelInboundDroppedHistoryOptions, type ChannelTurnDroppedHistoryOptions, type ChannelInboundEventRunnerParams, type ChannelTurnRecordOptions, type ChannelTurnRecordOptions as InboundReplyRecordOptions, type DurableInboundReplyDeliveryParams, type InboundReplyDispatchResult, type PreparedInboundReply, deliverInboundReplyWithMessageSendContext, dispatchChannelInboundReply, hasFinalChannelTurnDispatch as hasFinalInboundReplyDispatch, hasVisibleChannelTurnDispatch as hasVisibleInboundReplyDispatch, recordChannelBotPairLoopAndCheckSuppression, recordDroppedChannelTurnHistory as recordDroppedChannelInboundHistory, recordDroppedChannelTurnHistory, resolveChannelTurnDispatchCounts as resolveInboundReplyDispatchCounts, runChannelInboundEvent, runPreparedInboundReply };