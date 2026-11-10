import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { i as enqueueRoutedSystemEvent } from "./system-events-EwTKG-tz.mjs";
import { n as deliverStructuredInboundReplyWithMessageSendContext } from "./channel-outbound-BbIm36V0.mjs";
import { s as resolveInboundLastRouteSessionKey } from "./resolve-route-DvaXhzgP.mjs";
import { i as resolvePinnedMainDmOwnerFromAllowlist } from "./dm-policy-shared-D66JT53_.mjs";
import "./security-runtime-6domDoE8.mjs";
import { n as loadWebMedia } from "./web-media-Dv3ATZ34.mjs";
import "./routing-Dl7FngGa.mjs";
import { t as getSessionEntryAsync } from "./session-store-runtime-internal-Cv2I3LCC.mjs";
import { t as resolveAmbientTranscriptWatermarkKey } from "./ambient-transcript-watermark-DK0xDO4J.mjs";
import { _ as readSessionUpdatedAtAsync, m as readAmbientTranscriptWatermarkAsync } from "./session-store-runtime-DVNFhqCK.mjs";
import { t as buildChannelInboundEventContext } from "./context-D2p4OQjv.mjs";
import { t as recordInboundSession } from "./session-bNhKQNY9.mjs";
import { n as recordChannelActivity } from "./channel-activity-Bn5LeXyE.mjs";
import { t as readChannelAllowFromStore } from "./pairing-store.read-30DeRp-H.mjs";
import { c as upsertChannelPairingRequest } from "./pairing-store-BIAARSUf.mjs";
import { n as resolveApprovalOverGateway } from "./approval-gateway-resolver-BbTScaK5.mjs";
import "./approval-gateway-runtime-BpWU7yBO.mjs";
import { t as dispatchReplyWithBufferedBlockDispatcher } from "./reply-dispatch-runtime-bOu4Ykpn.mjs";
import { t as createChannelReplyPipeline } from "./reply-pipeline-aTPs4FIz.mjs";
import "./channel-inbound-C0d69q8b.mjs";
import "./web-media-CgTCNYnE.mjs";
import "./system-event-runtime-BChjDF8M.mjs";
import "./runtime-config-snapshot-kTPhBdOK.mjs";
import "./conversation-runtime-BSuRFTFZ.mjs";
import { i as prepareSkillCommandsForAgents } from "./chat-commands-C__qSMA1.mjs";
import { o as buildPreparedModelsProviderData } from "./commands-models-DzIQgypm.mjs";
import "./models-provider-runtime-DqIbh4Wl.mjs";
import "./skill-commands-runtime-BENJGDHO.mjs";
import { C as editMessageTelegram, J as wasSentByBot, Y as recordOutboundMessageForPromptContext } from "./send-DWoEOMF4.mjs";
import { r as syncTelegramMenuCommands } from "./bot-native-command-menu-BewpTM88.mjs";
import { a as emitTelegramMessageSentHooks, n as deliverStructuredReplies, t as deliverReplies } from "./delivery-D47cp5dD.mjs";
import { t as createTelegramDraftStream } from "./draft-stream-CP7PvSxV.mjs";
const defaultTelegramBotDeps = {
	getRuntimeConfig: readRuntimeConfig,
	resolveStorePath: resolveSessionStorePathCore,
	getSessionEntryAsync,
	readChannelAllowFromStore,
	readSessionUpdatedAtAsync,
	readAmbientTranscriptWatermarkAsync,
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
	prepareSkillCommandsForAgents,
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
