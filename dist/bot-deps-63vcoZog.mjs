import { r as getRuntimeConfig } from "./io.runtime-CwE7Ks5y.mjs";
import { i as enqueueRoutedSystemEvent } from "./system-events-BHzB_9CN.mjs";
import { n as deliverStructuredInboundReplyWithMessageSendContext } from "./channel-outbound-DFr-HqAB.mjs";
import { s as resolveInboundLastRouteSessionKey } from "./resolve-route-zfKT6ZcU.mjs";
import { n as loadWebMedia } from "./web-media-CyIxET-s.mjs";
import { o as resolvePinnedMainDmOwnerFromAllowlist } from "./dm-policy-shared-NwS6IC07.mjs";
import "./routing-JKvWkBDR.mjs";
import { t as buildChannelInboundEventContext } from "./context-31tfaN0x.mjs";
import { t as recordInboundSession } from "./session-JA-Mb0ms.mjs";
import { n as recordChannelActivity } from "./channel-activity-KGHrbxIK.mjs";
import { d as upsertChannelPairingRequest, s as readChannelAllowFromStore } from "./pairing-store-Cvj6ctV_.mjs";
import { t as resolveApprovalOverGateway } from "./approval-gateway-resolver-gtHUJQmo.mjs";
import "./approval-gateway-runtime-BXomq1FR.mjs";
import { n as resolveAmbientTranscriptWatermarkKey } from "./ambient-transcript-watermark-BEQLKA5V.mjs";
import { h as resolveStorePath, i as getSessionEntry, l as readAmbientTranscriptWatermark, u as readSessionUpdatedAt } from "./session-store-runtime-C8uM6zVu.mjs";
import { t as dispatchReplyWithBufferedBlockDispatcher } from "./reply-dispatch-runtime-m8kTRVqf.mjs";
import { t as createChannelReplyPipeline } from "./reply-pipeline-Daf0ePuj.mjs";
import "./channel-inbound-CsGa370i.mjs";
import "./web-media-D2TL1fjP.mjs";
import "./system-event-runtime-CNcjT2gA.mjs";
import "./runtime-config-snapshot-rxMji4ZC.mjs";
import "./conversation-runtime-BJpQuIxa.mjs";
import "./security-runtime-HdPo6iAV.mjs";
import { t as listSkillCommandsForAgents } from "./chat-commands-3NIYpCqk.mjs";
import { a as buildPreparedModelsProviderData } from "./commands-models-DmZSgrXX.mjs";
import "./models-provider-runtime-DwRNoV5r.mjs";
import "./skill-commands-runtime-DylCN7Dy.mjs";
import { J as recordOutboundMessageForPromptContext, W as wasSentByBot, w as editMessageTelegram } from "./send-Dspwv6Gr.mjs";
import { r as syncTelegramMenuCommands } from "./bot-native-command-menu-mqauwpQM.mjs";
import { a as emitTelegramMessageSentHooks, n as deliverStructuredReplies, t as deliverReplies } from "./delivery-CTaiIwLo.mjs";
import { t as createTelegramDraftStream } from "./draft-stream-Bc3G6Pro.mjs";
//#region extensions/telegram/src/bot-deps.ts
const defaultTelegramBotDeps = {
	get getRuntimeConfig() {
		return getRuntimeConfig;
	},
	get resolveStorePath() {
		return resolveStorePath;
	},
	get getSessionEntry() {
		return getSessionEntry;
	},
	get readChannelAllowFromStore() {
		return readChannelAllowFromStore;
	},
	get readSessionUpdatedAt() {
		return readSessionUpdatedAt;
	},
	get readAmbientTranscriptWatermark() {
		return readAmbientTranscriptWatermark;
	},
	get resolveAmbientTranscriptWatermarkKey() {
		return resolveAmbientTranscriptWatermarkKey;
	},
	get recordInboundSession() {
		return recordInboundSession;
	},
	get recordChannelActivity() {
		return recordChannelActivity;
	},
	get resolveInboundLastRouteSessionKey() {
		return resolveInboundLastRouteSessionKey;
	},
	get resolvePinnedMainDmOwnerFromAllowlist() {
		return resolvePinnedMainDmOwnerFromAllowlist;
	},
	get buildChannelInboundEventContext() {
		return buildChannelInboundEventContext;
	},
	get upsertChannelPairingRequest() {
		return upsertChannelPairingRequest;
	},
	get enqueueRoutedSystemEvent() {
		return enqueueRoutedSystemEvent;
	},
	get dispatchReplyWithBufferedBlockDispatcher() {
		return dispatchReplyWithBufferedBlockDispatcher;
	},
	get loadWebMedia() {
		return loadWebMedia;
	},
	get buildModelsProviderData() {
		return buildPreparedModelsProviderData;
	},
	get listSkillCommandsForAgents() {
		return listSkillCommandsForAgents;
	},
	get syncTelegramMenuCommands() {
		return syncTelegramMenuCommands;
	},
	get wasSentByBot() {
		return wasSentByBot;
	},
	get resolveApproval() {
		return resolveApprovalOverGateway;
	},
	get createTelegramDraftStream() {
		return createTelegramDraftStream;
	},
	get deliverReplies() {
		return deliverReplies;
	},
	get deliverStructuredReplies() {
		return deliverStructuredReplies;
	},
	get deliverStructuredInboundReplyWithMessageSendContext() {
		return deliverStructuredInboundReplyWithMessageSendContext;
	},
	get emitTelegramMessageSentHooks() {
		return emitTelegramMessageSentHooks;
	},
	get editMessageTelegram() {
		return editMessageTelegram;
	},
	get recordOutboundMessageForPromptContext() {
		return recordOutboundMessageForPromptContext;
	},
	get createChannelMessageReplyPipeline() {
		return createChannelReplyPipeline;
	}
};
//#endregion
export { defaultTelegramBotDeps as t };
