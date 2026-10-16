import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import { i as enqueueRoutedSystemEvent } from "./system-events-DILAmiTo.mjs";
import { n as deliverStructuredInboundReplyWithMessageSendContext } from "./channel-outbound-DBuu65Vg.mjs";
import "./security-runtime-CpTHQYW2.mjs";
import { i as resolvePinnedMainDmOwnerFromAllowlist } from "./dm-policy-shared-W0ZJUdtW.mjs";
import { n as resolveAmbientTranscriptWatermarkKey } from "./ambient-transcript-watermark-Cdi7WZ4A.mjs";
import { c as readAmbientTranscriptWatermark, f as resolveStorePath, i as getSessionEntry, l as readSessionUpdatedAt } from "./session-store-runtime-BS2ijndm.mjs";
import { s as resolveInboundLastRouteSessionKey } from "./resolve-route-Bzb6opva.mjs";
import { n as loadWebMedia } from "./web-media-DkANOAh-.mjs";
import "./routing-CEr1aXk1.mjs";
import { t as buildChannelInboundEventContext } from "./context-BSebOSwO.mjs";
import { t as recordInboundSession } from "./session-BA3PpvaK.mjs";
import { n as recordChannelActivity } from "./channel-activity-Bn5LeXyE.mjs";
import { d as upsertChannelPairingRequest, s as readChannelAllowFromStore } from "./pairing-store-DEvhBgUm.mjs";
import { n as resolveApprovalOverGateway } from "./approval-gateway-resolver-4h2en19_.mjs";
import "./approval-gateway-runtime-BYi8ARVi.mjs";
import { t as dispatchReplyWithBufferedBlockDispatcher } from "./reply-dispatch-runtime-DsQQqJn7.mjs";
import { t as createChannelReplyPipeline } from "./reply-pipeline-B4ZsvDU7.mjs";
import "./channel-inbound-3pp2RVN7.mjs";
import "./web-media-CrOXx0IK.mjs";
import "./system-event-runtime-lHk_u9HN.mjs";
import "./runtime-config-snapshot-DgZgcXUX.mjs";
import "./conversation-runtime-De-TwUwt.mjs";
import { t as listSkillCommandsForAgents } from "./chat-commands-DPNB2D7k.mjs";
import { a as buildPreparedModelsProviderData } from "./commands-models-CAT-ayCd.mjs";
import "./models-provider-runtime-C65O8Fah.mjs";
import "./skill-commands-runtime-Bwk84BOt.mjs";
import { J as wasSentByBot, Y as recordOutboundMessageForPromptContext, w as editMessageTelegram } from "./send-Dhm4bf4Y.mjs";
import { r as syncTelegramMenuCommands } from "./bot-native-command-menu-Bn19l31L.mjs";
import { a as emitTelegramMessageSentHooks, n as deliverStructuredReplies, t as deliverReplies } from "./delivery-BdVvvbD7.mjs";
import { t as createTelegramDraftStream } from "./draft-stream-BnPrts4W.mjs";
//#region extensions/telegram/src/bot-deps.ts
const defaultTelegramBotDeps = {
	getRuntimeConfig,
	resolveStorePath,
	getSessionEntry,
	readChannelAllowFromStore,
	readSessionUpdatedAt,
	readAmbientTranscriptWatermark,
	resolveAmbientTranscriptWatermarkKey,
	recordInboundSession,
	recordChannelActivity,
	resolveInboundLastRouteSessionKey,
	resolvePinnedMainDmOwnerFromAllowlist,
	buildChannelInboundEventContext,
	upsertChannelPairingRequest,
	enqueueRoutedSystemEvent,
	dispatchReplyWithBufferedBlockDispatcher,
	loadWebMedia,
	buildModelsProviderData: buildPreparedModelsProviderData,
	listSkillCommandsForAgents,
	syncTelegramMenuCommands,
	wasSentByBot,
	resolveApproval: resolveApprovalOverGateway,
	createTelegramDraftStream,
	deliverReplies,
	deliverStructuredReplies,
	deliverStructuredInboundReplyWithMessageSendContext,
	emitTelegramMessageSentHooks,
	editMessageTelegram,
	recordOutboundMessageForPromptContext,
	createChannelMessageReplyPipeline: createChannelReplyPipeline
};
//#endregion
export { defaultTelegramBotDeps as t };
