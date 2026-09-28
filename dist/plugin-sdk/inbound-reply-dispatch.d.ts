import { Ii as ChannelTurnRecordOptions, Pi as ChannelTurnDroppedHistoryOptions, Ui as ChannelBotLoopProtectionFacts, Wi as recordChannelBotPairLoopAndCheckSuppression, _a as DispatchReplyWithBufferedBlockDispatcher, _i as recordDroppedChannelTurnHistory } from "../agent-harness-runtime-CWL0fcg5.js";
import { r as OpenClawConfig } from "../types.openclaw-LzSbb55e.js";
import { h as GetReplyOptions, r as FinalizedMsgContext } from "../templating-OpWn1DzT.js";
import { h as ReplyPayload } from "../reply-payload-Dv0rYqXd.js";
import { f as runChannelInboundEvent, i as ChannelInboundEventRunnerParams, l as dispatchChannelInboundReply, o as InboundReplyDispatchResult, p as runPreparedInboundReply, s as PreparedInboundReply, t as AssembledInboundReply } from "../channel-inbound-BNnjjnWo.js";
import { n as hasVisibleChannelTurnDispatch, r as resolveChannelTurnDispatchCounts, t as hasFinalChannelTurnDispatch } from "../dispatch-result-qzcbsHjZ.js";
import { a as DurableInboundReplyDeliveryParams, i as DurableInboundReplyDeliveryOptions } from "../receipt-DCtO_bEh.js";
import { n as deliverInboundReplyWithMessageSendContext } from "../channel-outbound-B3ajNl1f.js";
import { t as recordInboundSession } from "../session-CLUHG8Dl.js";
//#region src/infra/outbound/reply-payload-normalize.d.ts
/**
 * Outbound-facing subset of reply payload fields accepted from loose producers.
 */
type OutboundReplyPayload = {
  text?: string;
  mediaUrls?: string[];
  mediaUrl?: string;
  presentation?: ReplyPayload["presentation"];
  presentationTextMode?: ReplyPayload["presentationTextMode"];
  /**
   * @deprecated Use presentation. Runtime support remains for legacy producers.
   */
  interactive?: ReplyPayload["interactive"];
  channelData?: ReplyPayload["channelData"];
  sensitiveMedia?: boolean;
  replyToId?: string;
  location?: ReplyPayload["location"];
  videoAsNote?: boolean;
};
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