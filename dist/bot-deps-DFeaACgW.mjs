import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import { i as enqueueRoutedSystemEvent } from "./system-events-CaNeMrRE.mjs";
import { n as deliverStructuredInboundReplyWithMessageSendContext } from "./channel-outbound-Iecgam5T.mjs";
import "./security-runtime-CpTHQYW2.mjs";
import { i as resolvePinnedMainDmOwnerFromAllowlist } from "./dm-policy-shared-W0ZJUdtW.mjs";
import { n as resolveAmbientTranscriptWatermarkKey } from "./ambient-transcript-watermark-BXEARETw.mjs";
import { c as readAmbientTranscriptWatermark, f as resolveStorePath, i as getSessionEntry, l as readSessionUpdatedAt } from "./session-store-runtime-BXJVuXP_.mjs";
import { s as resolveInboundLastRouteSessionKey } from "./resolve-route-Bzb6opva.mjs";
import { n as loadWebMedia } from "./web-media-DkANOAh-.mjs";
import "./routing-CEr1aXk1.mjs";
import { t as buildChannelInboundEventContext } from "./context-C8X-VsUO.mjs";
import { t as recordInboundSession } from "./session-rcXfkt9U.mjs";
import { n as recordChannelActivity } from "./channel-activity-Bn5LeXyE.mjs";
import { d as upsertChannelPairingRequest, s as readChannelAllowFromStore } from "./pairing-store-DEvhBgUm.mjs";
import { n as resolveApprovalOverGateway } from "./approval-gateway-resolver-4h2en19_.mjs";
import "./approval-gateway-runtime-BYi8ARVi.mjs";
import { t as dispatchReplyWithBufferedBlockDispatcher } from "./reply-dispatch-runtime-J6Gk86e_.mjs";
import { t as createChannelReplyPipeline } from "./reply-pipeline-DIQNa18H.mjs";
import "./channel-inbound-BoYsZ3rI.mjs";
import "./web-media-CrOXx0IK.mjs";
import "./system-event-runtime-BcGFhK3c.mjs";
import "./runtime-config-snapshot-DlrhEsA8.mjs";
import "./conversation-runtime-DTQoVMvr.mjs";
import { t as listSkillCommandsForAgents } from "./chat-commands-DxFzY5zT.mjs";
import { a as buildPreparedModelsProviderData } from "./commands-models-8udJmNgL.mjs";
import "./models-provider-runtime-BOVvFHPB.mjs";
import "./skill-commands-runtime-C6Ekpjtr.mjs";
import { J as wasSentByBot, Y as recordOutboundMessageForPromptContext, w as editMessageTelegram } from "./send-yVJM-nuK.mjs";
import { r as syncTelegramMenuCommands } from "./bot-native-command-menu-Bn19l31L.mjs";
import { a as emitTelegramMessageSentHooks, n as deliverStructuredReplies, t as deliverReplies } from "./delivery-BFtxUs0P.mjs";
import { t as createTelegramDraftStream } from "./draft-stream-CbFfLt86.mjs";
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
