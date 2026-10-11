import { Ii as ChannelTurnRecordOptions, Pi as ChannelTurnDroppedHistoryOptions, Ui as ChannelBotLoopProtectionFacts, Wi as recordChannelBotPairLoopAndCheckSuppression, _a as DispatchReplyWithBufferedBlockDispatcher, _i as recordDroppedChannelTurnHistory } from "../agent-harness-runtime-wMciqZ6Z.js";
import { r as OpenClawConfig } from "../types.openclaw-Ccmw-oTa.js";
import { h as GetReplyOptions, r as FinalizedMsgContext } from "../templating-0ElMwhje.js";
import { h as ReplyPayload } from "../reply-payload-DSrL-UWv.js";
import { f as runChannelInboundEvent, i as ChannelInboundEventRunnerParams, l as dispatchChannelInboundReply, o as InboundReplyDispatchResult, p as runPreparedInboundReply, s as PreparedInboundReply, t as AssembledInboundReply } from "../channel-inbound-DcDh12dH.js";
import { n as hasVisibleChannelTurnDispatch, r as resolveChannelTurnDispatchCounts, t as hasFinalChannelTurnDispatch } from "../dispatch-result-CC62y_Y1.js";
import { a as DurableInboundReplyDeliveryParams, i as DurableInboundReplyDeliveryOptions } from "../receipt-CIhXFsCC.js";
import { n as deliverInboundReplyWithMessageSendContext } from "../channel-outbound-B339aBc0.js";
import { t as recordInboundSession } from "../session-Dzsx6DOO.js";
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