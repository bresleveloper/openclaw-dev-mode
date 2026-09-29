import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import { i as enqueueRoutedSystemEvent } from "./system-events-DJITEjfa.mjs";
import { n as deliverStructuredInboundReplyWithMessageSendContext } from "./channel-outbound-Bk5sWC85.mjs";
import { s as resolveInboundLastRouteSessionKey } from "./resolve-route-zfKT6ZcU.mjs";
import { n as loadWebMedia } from "./web-media-wGhP3Hri.mjs";
import { o as resolvePinnedMainDmOwnerFromAllowlist } from "./dm-policy-shared-NwS6IC07.mjs";
import "./routing-JKvWkBDR.mjs";
import { t as buildChannelInboundEventContext } from "./context-F8osvPeB.mjs";
import { t as recordInboundSession } from "./session-2tgOCGL5.mjs";
import { n as recordChannelActivity } from "./channel-activity-KGHrbxIK.mjs";
import { d as upsertChannelPairingRequest, s as readChannelAllowFromStore } from "./pairing-store-Cvj6ctV_.mjs";
import { t as resolveApprovalOverGateway } from "./approval-gateway-resolver-gtHUJQmo.mjs";
import "./approval-gateway-runtime-BXomq1FR.mjs";
import { n as resolveAmbientTranscriptWatermarkKey } from "./ambient-transcript-watermark-CLuknSHG.mjs";
import { h as resolveStorePath, i as getSessionEntry, l as readAmbientTranscriptWatermark, u as readSessionUpdatedAt } from "./session-store-runtime-DhcFNaWV.mjs";
import { t as dispatchReplyWithBufferedBlockDispatcher } from "./reply-dispatch-runtime-hn6sA4BU.mjs";
import { t as createChannelReplyPipeline } from "./reply-pipeline-i3g0Dbwp.mjs";
import "./channel-inbound-X7KrQT_y.mjs";
import "./web-media-KK6MuXNf.mjs";
import "./system-event-runtime-CW0kUkre.mjs";
import "./runtime-config-snapshot-Bm2YKbTW.mjs";
import "./conversation-runtime-Bg7d3Eiv.mjs";
import "./security-runtime-HdPo6iAV.mjs";
import { t as listSkillCommandsForAgents } from "./chat-commands-DZNqfvMX.mjs";
import { a as buildPreparedModelsProviderData } from "./commands-models-Br8TkBOP.mjs";
import "./models-provider-runtime-BYDEv6xW.mjs";
import "./skill-commands-runtime-BYFCfsmk.mjs";
import { J as recordOutboundMessageForPromptContext, W as wasSentByBot, w as editMessageTelegram } from "./send-Cox8AAme.mjs";
import { r as syncTelegramMenuCommands } from "./bot-native-command-menu-mqauwpQM.mjs";
import { a as emitTelegramMessageSentHooks, n as deliverStructuredReplies, t as deliverReplies } from "./delivery-CDsjWQsj.mjs";
import { t as createTelegramDraftStream } from "./draft-stream-DPVqilI0.mjs";
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
