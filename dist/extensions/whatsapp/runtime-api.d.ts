import { Ns as stripHeartbeatToken, js as HEARTBEAT_PROMPT } from "../../types-BVLQjFJF.js";
import { D as LocalMediaAccessErrorCode, E as LocalMediaAccessError, k as getDefaultLocalRoots, m as optimizeImageToPng } from "../../media-services-BqLZh0ST.js";
import { i as optimizeImageToJpeg, n as loadWebMedia, r as loadWebMediaRaw, t as WebMediaResult } from "../../web-media-D1aVPCGn.js";
import { n as SILENT_REPLY_TOKEN, t as HEARTBEAT_TOKEN } from "../../tokens-CLx0Aap_.js";
import { n as NormalizedLocation } from "../../location-Nlme7YFG.js";
import { a as sendReactionWhatsApp, i as sendPollWhatsApp, n as whatsAppActionRuntime, o as sendTypingWhatsApp, r as sendMessageWhatsApp, t as handleWhatsAppAction } from "../../action-runtime-oFsLSRKm.js";
import { t as DEFAULT_WEB_MEDIA_BYTES } from "../../constants-DyY8ENiv.js";
import { i as loginWeb, l as WebMonitorTuning, n as monitorWebChannel, r as monitorWebInbox, s as WebChannelStatus } from "../../runtime-api-DYmzVw5J.js";
import { C as webAuthExists, E as resolveWebCredsPath, S as restoreCredsFromBackupIfNeeded, T as resolveWebCredsBackupPath, _ as readWebAuthState, a as WhatsAppAuthUnstableError, b as readWebSelfIdentityForDecision, c as getWebAuthAgeMs, d as pickWebChannel, f as readCredsJsonRaw, g as readWebAuthSnapshotBestEffort, h as readWebAuthSnapshot, i as WHATSAPP_AUTH_UNSTABLE_CODE, l as logWebSelfId, m as readWebAuthExistsForDecision, n as getStatusCode, o as WhatsAppWebAuthState, p as readWebAuthExistsBestEffort, r as WA_WEB_AUTH_DIR, s as formatWhatsAppWebAuthStatusState, t as formatError, u as logoutWeb, v as readWebSelfId, w as hasWebCredsSync, x as resolveDefaultWebAuthDir, y as readWebSelfIdentity } from "../../session-errors-D1XNW0hq.js";
import { u as proto } from "../../identity-DUUOfk_S.js";
import { a as WebInboundCallbackMessage, c as WebListenerCloseReason, d as WhatsAppInboundAdmission, i as LegacyFlatWebInboundMessage, l as WhatsAppStructuredContactContext, n as ActiveWebSendOptions, o as WebInboundMessage, s as WebInboundMessageInput, t as ActiveWebListener } from "../../types-D_qg3PxW2.js";
import { a as waitForWaConnection, c as waitForCredsSaveQueueWithTimeout, i as newConnectionId, l as writeCredsJsonAtomically, n as waitForWebLogin, o as CredsQueueWaitResult, r as createWaSocket, s as waitForCredsSaveQueue, t as startWebLoginWithQr } from "../../login-qr-runtime-Ditcedkm.js";
import { n as resolveWebAccountId, t as getActiveWebListener } from "../../active-listener-D4fmWo02.js";
import { t as createWhatsAppLoginTool } from "../../agent-tools-login-B2haKok6.js";
import { t as setWhatsAppRuntime } from "../../runtime-D-o72c2k.js";

//#region extensions/whatsapp/src/inbound/dedupe.d.ts
declare function resetWebInboundDedupe(): void;
//#endregion
//#region extensions/whatsapp/src/inbound/extract.d.ts
declare function extractText(rawMessage: proto.IMessage | undefined): string | undefined;
declare function extractMediaPlaceholder(rawMessage: proto.IMessage | undefined): string | undefined;
declare function extractContactContext(rawMessage: proto.IMessage | undefined): WhatsAppStructuredContactContext | undefined;
declare function extractLocationData(rawMessage: proto.IMessage | undefined): NormalizedLocation | null;
//#endregion
export { type ActiveWebListener, type ActiveWebSendOptions, type CredsQueueWaitResult, DEFAULT_WEB_MEDIA_BYTES, HEARTBEAT_PROMPT, HEARTBEAT_TOKEN, type LegacyFlatWebInboundMessage, LocalMediaAccessError, type LocalMediaAccessErrorCode, SILENT_REPLY_TOKEN, WA_WEB_AUTH_DIR, WHATSAPP_AUTH_UNSTABLE_CODE, type WebChannelStatus, type WebInboundCallbackMessage, type WebInboundMessage, type WebInboundMessageInput, type WebListenerCloseReason, type WebMediaResult, type WebMonitorTuning, WhatsAppAuthUnstableError, type WhatsAppInboundAdmission, type WhatsAppWebAuthState, createWaSocket, createWhatsAppLoginTool, extractContactContext, extractLocationData, extractMediaPlaceholder, extractText, formatError, formatWhatsAppWebAuthStatusState, getActiveWebListener, getDefaultLocalRoots, getStatusCode, getWebAuthAgeMs, handleWhatsAppAction, hasWebCredsSync, loadWebMedia, loadWebMediaRaw, logWebSelfId, loginWeb, logoutWeb, monitorWebChannel, monitorWebInbox, newConnectionId, optimizeImageToJpeg, optimizeImageToPng, pickWebChannel, readCredsJsonRaw, readWebAuthExistsBestEffort, readWebAuthExistsForDecision, readWebAuthSnapshot, readWebAuthSnapshotBestEffort, readWebAuthState, readWebSelfId, readWebSelfIdentity, readWebSelfIdentityForDecision, resetWebInboundDedupe, resolveDefaultWebAuthDir, resolveWebAccountId, resolveWebCredsBackupPath, resolveWebCredsPath, restoreCredsFromBackupIfNeeded, sendMessageWhatsApp, sendPollWhatsApp, sendReactionWhatsApp, sendTypingWhatsApp, setWhatsAppRuntime, startWebLoginWithQr, stripHeartbeatToken, waitForCredsSaveQueue, waitForCredsSaveQueueWithTimeout, waitForWaConnection, waitForWebLogin, webAuthExists, whatsAppActionRuntime, writeCredsJsonAtomically };