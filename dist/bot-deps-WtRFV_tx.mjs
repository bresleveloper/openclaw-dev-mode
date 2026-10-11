import { r as getRuntimeConfig } from "./io.runtime-CXaC-ufL.mjs";
import { i as enqueueRoutedSystemEvent } from "./system-events-Cfr4zXec.mjs";
import { n as deliverStructuredInboundReplyWithMessageSendContext } from "./channel-outbound-Cr3Uz9_9.mjs";
import { s as resolveInboundLastRouteSessionKey } from "./resolve-route-CaibtbpY.mjs";
import { n as loadWebMedia } from "./web-media-DlKZebGG.mjs";
import { o as resolvePinnedMainDmOwnerFromAllowlist } from "./dm-policy-shared-NwS6IC07.mjs";
import "./routing-gwrpgNm_.mjs";
import { t as buildChannelInboundEventContext } from "./context-kuPG_wGy.mjs";
import { t as recordInboundSession } from "./session-BmhKIS8u.mjs";
import { n as recordChannelActivity } from "./channel-activity-KGHrbxIK.mjs";
import { d as upsertChannelPairingRequest, s as readChannelAllowFromStore } from "./pairing-store-Cvj6ctV_.mjs";
import { t as resolveApprovalOverGateway } from "./approval-gateway-resolver-gtHUJQmo.mjs";
import "./approval-gateway-runtime-BXomq1FR.mjs";
import { n as resolveAmbientTranscriptWatermarkKey } from "./ambient-transcript-watermark-BmDJbzSb.mjs";
import { h as resolveStorePath, i as getSessionEntry, l as readAmbientTranscriptWatermark, u as readSessionUpdatedAt } from "./session-store-runtime-zdAEZuei.mjs";
import { t as dispatchReplyWithBufferedBlockDispatcher } from "./reply-dispatch-runtime--FJx3kRe.mjs";
import { t as createChannelReplyPipeline } from "./reply-pipeline-CWk8ZwBZ.mjs";
import "./channel-inbound-CNfCp9un.mjs";
import "./web-media-DMjTswod.mjs";
import "./system-event-runtime-C2qSvy3h.mjs";
import "./runtime-config-snapshot-CyQh9ezF.mjs";
import "./conversation-runtime-DR4DYTzk.mjs";
import "./security-runtime-ByyEMO4I.mjs";
import { t as listSkillCommandsForAgents } from "./chat-commands-DJzkxYfH.mjs";
import { a as buildPreparedModelsProviderData } from "./commands-models-BMtnug8l.mjs";
import "./models-provider-runtime-ClYif9AM.mjs";
import "./skill-commands-runtime-aNxq_Val.mjs";
import { J as recordOutboundMessageForPromptContext, W as wasSentByBot, w as editMessageTelegram } from "./send-CgFj68tW.mjs";
import { r as syncTelegramMenuCommands } from "./bot-native-command-menu-gyXk1-Xd.mjs";
import { a as emitTelegramMessageSentHooks, n as deliverStructuredReplies, t as deliverReplies } from "./delivery-DnV_MAeG.mjs";
import { t as createTelegramDraftStream } from "./draft-stream-CDMt2iye.mjs";
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
