import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import { i as enqueueRoutedSystemEvent } from "./system-events-DevGIiH8.mjs";
import { n as deliverStructuredInboundReplyWithMessageSendContext } from "./channel-outbound-r_EvcKqq.mjs";
import { s as resolveInboundLastRouteSessionKey } from "./resolve-route-zfKT6ZcU.mjs";
import { n as loadWebMedia } from "./web-media-BGRqIyLZ.mjs";
import { o as resolvePinnedMainDmOwnerFromAllowlist } from "./dm-policy-shared-NwS6IC07.mjs";
import "./routing-JKvWkBDR.mjs";
import { t as buildChannelInboundEventContext } from "./context-CEXDqQYw.mjs";
import { t as recordInboundSession } from "./session-oascTmim.mjs";
import { n as recordChannelActivity } from "./channel-activity-KGHrbxIK.mjs";
import { d as upsertChannelPairingRequest, s as readChannelAllowFromStore } from "./pairing-store-Cvj6ctV_.mjs";
import { t as resolveApprovalOverGateway } from "./approval-gateway-resolver-gtHUJQmo.mjs";
import "./approval-gateway-runtime-BXomq1FR.mjs";
import { n as resolveAmbientTranscriptWatermarkKey } from "./ambient-transcript-watermark-CHGJD06v.mjs";
import { h as resolveStorePath, i as getSessionEntry, l as readAmbientTranscriptWatermark, u as readSessionUpdatedAt } from "./session-store-runtime-XTMMGjZf.mjs";
import { t as dispatchReplyWithBufferedBlockDispatcher } from "./reply-dispatch-runtime-grHURw9w.mjs";
import { t as createChannelReplyPipeline } from "./reply-pipeline-Ch5hnWyF.mjs";
import "./channel-inbound-DcAqUPMY.mjs";
import "./web-media-C2tn59_W.mjs";
import "./system-event-runtime-BeN9tHJs.mjs";
import "./runtime-config-snapshot-Bc7N5SpK.mjs";
import "./conversation-runtime-BdU2H6Dm.mjs";
import "./security-runtime-HdPo6iAV.mjs";
import { t as listSkillCommandsForAgents } from "./chat-commands-TSrzWQ3Y.mjs";
import { a as buildPreparedModelsProviderData } from "./commands-models-C40zUQy-.mjs";
import "./models-provider-runtime-sOpYOxNH.mjs";
import "./skill-commands-runtime-C-GFD8Oz.mjs";
import { J as recordOutboundMessageForPromptContext, W as wasSentByBot, w as editMessageTelegram } from "./send-DZq2Pk_C.mjs";
import { r as syncTelegramMenuCommands } from "./bot-native-command-menu-mqauwpQM.mjs";
import { a as emitTelegramMessageSentHooks, n as deliverStructuredReplies, t as deliverReplies } from "./delivery-BFgt5rf6.mjs";
import { t as createTelegramDraftStream } from "./draft-stream-C4PptHzM.mjs";
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
