import { l as normalizeE164, m as resolveUserPath } from "../../utils-BApvfmPs.js";
import "../../core-BbmhFA6e.js";
import "../../account-resolution-DTzMrP_G.js";
import "../../channel-actions-CdLhqkfP.js";
import { o as formatLocationText } from "../../channel-inbound-BEf_Qy7M.js";
import { r as resolveDefaultWhatsAppAccountId, t as listAccountIds } from "../../account-ids-Bgg1wvIw.js";
import { a as resolveWhatsAppAccount, i as listWhatsAppAuthDirs, n as hasAnyWhatsAppAuth, o as resolveWhatsAppAuthDir, r as listEnabledWhatsAppAccounts, s as resolveWhatsAppMediaMaxBytes, t as DEFAULT_WHATSAPP_MEDIA_MAX_MB } from "../../accounts-D4l-iMIF.js";
import { a as normalizeWhatsAppAllowFromEntries, c as normalizeWhatsAppTarget, i as looksLikeWhatsAppTargetId, r as isWhatsAppUserTarget, s as normalizeWhatsAppMessagingTarget, t as isWhatsAppGroupJid } from "../../normalize-target-D-WjuB2k.js";
import { t as resolveWhatsAppOutboundTarget } from "../../resolve-outbound-target-QcdbIXoT.js";
import "../../reaction-level-DNbrizS1.js";
import "../../send-DDGrapnh.js";
import { n as getStatusCode, t as formatError } from "../../session-errors-CbsoQqoy.js";
import { n as createWhatsAppSocketOperationTimeoutAdapter, t as DEFAULT_WHATSAPP_SOCKET_TIMING } from "../../socket-timing-Fw8AJE9F.js";
import { c as toWhatsappJidWithLid, i as markdownToWhatsApp, n as isSelfChatMode, o as resolveJidToE164, r as jidToE164, s as toWhatsappJid, t as assertWebChannel } from "../../text-runtime-DshxRpTA.js";
import { n as WHATSAPP_LEGACY_OUTBOUND_SEND_DEP_KEYS, t as whatsappPlugin } from "../../channel-BmtfYHJV.js";
import { t as whatsappCommandPolicy } from "../../command-policy-BIOSHySD.js";
import { a as resolveWhatsAppGroupToolPolicy, i as resolveWhatsAppGroupRequireMention, o as resolveWhatsAppGroupIntroHint } from "../../shared-hEx5Du-N.js";
import "../../config-schema-BKRyYaD4.js";
import { t as whatsappSetupPlugin } from "../../channel.setup-Dc5EkNdc.js";
import { t as DEFAULT_WEB_MEDIA_BYTES } from "../../constants-HU41RHGI.js";
import { n as listWhatsAppDirectoryPeersFromConfig, t as listWhatsAppDirectoryGroupsFromConfig } from "../../directory-config-D1Dyfh84.js";
import { n as testing } from "../../access-control-msdQCtem.js";
import { s as normalizeMessageContent } from "../../session.runtime-1AU-NIKD.js";
import { c as resolveInboundMediaMimetype, d as extractContextInfo, g as extractText, l as describeReplyContext, p as extractLocationData, t as createWebSendApi } from "../../send-api-BLTzEzDi.js";
import { r as waitForWaConnection, t as createWaSocket } from "../../session-CjoWbkaw.js";
//#region extensions/whatsapp/src/qa-driver.runtime.ts
function isRecord(value) {
	return Boolean(value && typeof value === "object");
}
function readString(value) {
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function readBoolean(value) {
	return typeof value === "boolean" ? value : void 0;
}
function findMessageSection(message, sectionNames) {
	if (!isRecord(message)) return;
	const queue = [{
		depth: 0,
		value: message
	}];
	const seen = /* @__PURE__ */ new Set();
	while (queue.length > 0) {
		const current = queue.shift();
		if (!current || seen.has(current.value)) continue;
		seen.add(current.value);
		for (const sectionName of sectionNames) {
			const section = current.value[sectionName];
			if (isRecord(section)) return section;
		}
		if (current.depth >= 4) continue;
		for (const wrapperName of [
			"botInvokeMessage",
			"documentWithCaptionMessage",
			"ephemeralMessage",
			"groupMentionedMessage",
			"viewOnceMessage",
			"viewOnceMessageV2",
			"viewOnceMessageV2Extension"
		]) {
			const wrapper = current.value[wrapperName];
			if (isRecord(wrapper) && isRecord(wrapper.message)) queue.push({
				depth: current.depth + 1,
				value: wrapper.message
			});
		}
	}
}
function readReaction(message) {
	const reaction = findMessageSection(message, ["reactionMessage"]);
	if (!reaction) return;
	const emoji = readString(reaction.text) ?? "";
	const key = isRecord(reaction.key) ? reaction.key : void 0;
	return {
		emoji,
		fromMe: readBoolean(key?.fromMe),
		messageId: readString(key?.id),
		participant: readString(key?.participant)
	};
}
function readPoll(message) {
	const poll = findMessageSection(message, [
		"pollCreationMessage",
		"pollCreationMessageV2",
		"pollCreationMessageV3"
	]);
	if (!poll) return;
	return {
		options: (Array.isArray(poll.options) ? poll.options : []).map((option) => isRecord(option) ? readString(option.optionName) : void 0).filter((option) => Boolean(option)),
		question: readString(poll.name)
	};
}
function readMedia(message) {
	const normalizedMessage = isRecord(message) ? normalizeMessageContent(message) : void 0;
	for (const sectionName of [
		"imageMessage",
		"videoMessage",
		"audioMessage",
		"documentMessage",
		"stickerMessage"
	]) {
		const section = findMessageSection(normalizedMessage ?? message, [sectionName]);
		if (!section) continue;
		const mediaMessage = { [sectionName]: section };
		return {
			fileName: readString(section.fileName),
			mediaType: resolveInboundMediaMimetype(mediaMessage)
		};
	}
}
function readQuotedMessage(message) {
	const contextInfo = extractContextInfo(message.message ?? void 0);
	const replyContext = describeReplyContext(message.message);
	if (!contextInfo && !replyContext) return;
	if (!contextInfo?.stanzaId && !contextInfo?.participant && !replyContext?.body) return;
	return {
		messageId: replyContext?.id ?? contextInfo?.stanzaId ?? void 0,
		participant: replyContext?.sender?.jid ?? contextInfo?.participant ?? void 0,
		text: replyContext?.body
	};
}
function normalizeObservedMessage(message, authDir) {
	if (message.key.fromMe) return null;
	const extractedText = extractText(message.message ?? void 0);
	const location = extractLocationData(message.message);
	const text = [extractedText, location ? formatLocationText(location) : void 0].filter(Boolean).join("\n").trim() || void 0;
	const reaction = readReaction(message.message);
	const poll = readPoll(message.message);
	const media = readMedia(message.message);
	const quoted = readQuotedMessage(message);
	const kind = reaction ? "reaction" : poll ? "poll" : media ? "media" : location ? "location" : text ? "text" : "unknown";
	if (!text && kind === "unknown") return null;
	const fromJid = message.key.remoteJid ?? void 0;
	return {
		fromJid,
		fromPhoneE164: fromJid ? jidToE164(fromJid, { authDir }) : null,
		hasMedia: media ? true : void 0,
		kind,
		mediaFileName: media?.fileName,
		mediaType: media?.mediaType,
		messageId: message.key.id ?? void 0,
		observedAt: (/* @__PURE__ */ new Date()).toISOString(),
		poll,
		quoted,
		reaction,
		text: text ?? ""
	};
}
function closeSocket(sock) {
	const maybeEnd = sock.end;
	if (typeof maybeEnd === "function") {
		maybeEnd.call(sock);
		return;
	}
	const maybeClose = sock.ws?.close;
	if (typeof maybeClose === "function") maybeClose.call(sock.ws);
}
function createConnectionClosedError(update) {
	const reason = update.lastDisconnect?.error;
	const status = getStatusCode(reason);
	const details = reason ? `: ${formatError(reason)}` : "";
	const statusLabel = typeof status === "number" ? ` (status ${status})` : "";
	return /* @__PURE__ */ new Error(`WhatsApp QA driver connection closed${statusLabel}${details}`);
}
async function startWhatsAppQaDriverSession(params) {
	const sock = await createWaSocket(false, false, { authDir: params.authDir });
	const observedMessages = [];
	const pendingNotificationsWaiters = [];
	const waiters = [];
	let closed = false;
	let closedError;
	let receivedPendingNotifications = false;
	const removeWaiter = (waiter) => {
		const index = waiters.indexOf(waiter);
		if (index >= 0) waiters.splice(index, 1);
		clearTimeout(waiter.timeout);
	};
	const removePendingNotificationsWaiter = (waiter) => {
		const index = pendingNotificationsWaiters.indexOf(waiter);
		if (index >= 0) pendingNotificationsWaiters.splice(index, 1);
		clearTimeout(waiter.timeout);
	};
	const markPendingNotificationsReceived = () => {
		if (receivedPendingNotifications) return;
		receivedPendingNotifications = true;
		for (const waiter of pendingNotificationsWaiters.slice()) {
			removePendingNotificationsWaiter(waiter);
			waiter.resolve();
		}
	};
	const observe = (message) => {
		observedMessages.push(message);
		for (const waiter of waiters.slice()) {
			if (!waiter.predicate(message)) continue;
			removeWaiter(waiter);
			waiter.resolve(message);
		}
	};
	const onMessagesUpsert = (event) => {
		for (const rawMessage of event.messages ?? []) {
			const observed = normalizeObservedMessage(rawMessage, params.authDir);
			if (observed) observe(observed);
		}
	};
	const onConnectionUpdate = (event) => {
		if (event.receivedPendingNotifications === true) markPendingNotificationsReceived();
		if (event.connection === "close") closeSessionResources(createConnectionClosedError(event));
	};
	const removeMessageListener = () => {
		const evWithOff = sock.ev;
		evWithOff.off?.("messages.upsert", onMessagesUpsert);
		evWithOff.off?.("connection.update", onConnectionUpdate);
	};
	const closeSessionResources = (waiterError) => {
		if (closed) return;
		closed = true;
		closedError = waiterError;
		for (const waiter of pendingNotificationsWaiters.slice()) {
			removePendingNotificationsWaiter(waiter);
			if (waiterError) waiter.reject(waiterError);
		}
		for (const waiter of waiters.slice()) {
			removeWaiter(waiter);
			if (waiterError) waiter.reject(waiterError);
		}
		removeMessageListener();
		closeSocket(sock);
	};
	sock.ev.on("messages.upsert", onMessagesUpsert);
	sock.ev.on("connection.update", onConnectionUpdate);
	try {
		await waitForWaConnection(sock, { timeoutMs: params.connectionTimeoutMs ?? 45e3 });
		if (params.waitForPendingNotifications) await new Promise((resolve, reject) => {
			if (receivedPendingNotifications) {
				resolve();
				return;
			}
			if (closed) {
				reject(closedError ?? /* @__PURE__ */ new Error("WhatsApp QA driver session closed"));
				return;
			}
			const timeoutMs = params.connectionTimeoutMs ?? 45e3;
			const waiter = {
				resolve,
				reject,
				timeout: setTimeout(() => {
					removePendingNotificationsWaiter(waiter);
					reject(/* @__PURE__ */ new Error(`timed out after ${timeoutMs}ms waiting for WhatsApp QA driver pending notifications`));
				}, timeoutMs)
			};
			pendingNotificationsWaiters.push(waiter);
		});
	} catch (error) {
		closeSessionResources(error instanceof Error ? error : /* @__PURE__ */ new Error("failed starting WhatsApp QA driver session"));
		throw error;
	}
	const sendApi = createWebSendApi({
		sock: createWhatsAppSocketOperationTimeoutAdapter(sock, DEFAULT_WHATSAPP_SOCKET_TIMING.defaultQueryTimeoutMs),
		defaultAccountId: "qa-driver",
		authDir: params.authDir
	});
	return {
		async close() {
			closeSessionResources(/* @__PURE__ */ new Error("WhatsApp QA driver session closed"));
		},
		getObservedMessages() {
			return [...observedMessages];
		},
		async sendContact(to, contact) {
			return { messageId: (await sendApi.sendContact(to, contact)).messageId };
		},
		async sendLocation(to, location) {
			return { messageId: (await sendApi.sendLocation(to, location)).messageId };
		},
		async sendMedia(to, text, mediaBuffer, mediaType, options) {
			return { messageId: (await sendApi.sendMessage(to, text, mediaBuffer, mediaType, options)).messageId };
		},
		async sendPoll(to, poll) {
			return { messageId: (await sendApi.sendPoll(to, poll)).messageId };
		},
		async sendReaction(chatJid, messageId, emoji, options) {
			return { messageId: (await sendApi.sendReaction(chatJid, messageId, emoji, options.fromMe, options.participant)).messageId };
		},
		async sendSticker(to, stickerBuffer, options) {
			return { messageId: (await sendApi.sendSticker(to, stickerBuffer, options)).messageId };
		},
		async sendText(to, text, options) {
			return { messageId: (await sendApi.sendMessage(to, text, void 0, void 0, options)).messageId };
		},
		async waitForMessage(paramsLocal) {
			const predicate = (message) => (!paramsLocal.observedAfter || new Date(message.observedAt).getTime() >= paramsLocal.observedAfter.getTime()) && paramsLocal.match(message);
			const existing = observedMessages.find(predicate);
			if (existing) return existing;
			if (closed) throw closedError ?? /* @__PURE__ */ new Error("WhatsApp QA driver session closed");
			return await new Promise((resolve, reject) => {
				const waiter = {
					predicate,
					resolve,
					reject,
					timeout: setTimeout(() => {
						removeWaiter(waiter);
						reject(/* @__PURE__ */ new Error("timed out waiting for WhatsApp QA driver message"));
					}, paramsLocal.timeoutMs)
				};
				waiters.push(waiter);
			});
		}
	};
}
//#endregion
export { DEFAULT_WEB_MEDIA_BYTES, DEFAULT_WHATSAPP_MEDIA_MAX_MB, WHATSAPP_LEGACY_OUTBOUND_SEND_DEP_KEYS, assertWebChannel, hasAnyWhatsAppAuth, isSelfChatMode, isWhatsAppGroupJid, isWhatsAppUserTarget, jidToE164, listEnabledWhatsAppAccounts, listAccountIds as listWhatsAppAccountIds, listWhatsAppAuthDirs, listWhatsAppDirectoryGroupsFromConfig, listWhatsAppDirectoryPeersFromConfig, looksLikeWhatsAppTargetId, markdownToWhatsApp, normalizeE164, normalizeWhatsAppAllowFromEntries, normalizeWhatsAppMessagingTarget, normalizeWhatsAppTarget, resolveDefaultWhatsAppAccountId, resolveJidToE164, resolveUserPath, resolveWhatsAppAccount, resolveWhatsAppAuthDir, resolveWhatsAppGroupIntroHint, resolveWhatsAppGroupRequireMention, resolveWhatsAppGroupToolPolicy, resolveWhatsAppMediaMaxBytes, resolveWhatsAppOutboundTarget, startWhatsAppQaDriverSession, toWhatsappJid, toWhatsappJidWithLid, testing as whatsappAccessControlTesting, whatsappCommandPolicy, whatsappPlugin, whatsappSetupPlugin };
