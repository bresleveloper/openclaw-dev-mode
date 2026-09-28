import { a as resolveWhatsAppAccount, i as listWhatsAppAuthDirs, n as hasAnyWhatsAppAuth, o as resolveWhatsAppAuthDir, r as listEnabledWhatsAppAccounts, s as resolveWhatsAppMediaMaxBytes, t as DEFAULT_WHATSAPP_MEDIA_MAX_MB } from "./.setup/accounts-D_NGDjCx.mjs";
import { r as resolveDefaultWhatsAppAccountId, t as listAccountIds } from "./.setup/account-ids-CB5SOWjc.mjs";
import { a as normalizeWhatsAppAllowFromEntries, c as normalizeWhatsAppTarget, i as looksLikeWhatsAppTargetId, r as isWhatsAppUserTarget, s as normalizeWhatsAppMessagingTarget, t as isWhatsAppGroupJid } from "./.setup/normalize-target-BGra1ZnM.mjs";
import { t as resolveWhatsAppOutboundTarget } from "./.setup/resolve-outbound-target-C2eUvsTc.mjs";
import { c as toWhatsappJid, i as markdownToWhatsApp, l as toWhatsappJidWithLid, n as isSelfChatMode, r as jidToE164, s as resolveJidToE164, t as assertWebChannel } from "./.setup/targets-runtime-RBjx3pg_.mjs";
import { n as resolveUserPath, t as normalizeE164 } from "./.setup/text-runtime-CHl0iPYe.mjs";
import { n as WHATSAPP_LEGACY_OUTBOUND_SEND_DEP_KEYS, t as whatsappPlugin } from "./.setup/channel-B3wKfJ8K.mjs";
import { i as resolveWhatsAppGroupToolPolicy, r as resolveWhatsAppGroupRequireMention } from "./.setup/shared-DLXzimjT.mjs";
import { t as whatsappCommandPolicy } from "./.setup/command-policy-BIOSHySD.mjs";
import { t as whatsappSetupPlugin } from "./.setup/channel.setup-CFNN3GG1.mjs";
import { t as DEFAULT_WEB_MEDIA_BYTES } from "./.setup/constants-C7m81BNe.mjs";
import { a as waitForWaConnection, o as DEFAULT_WHATSAPP_SOCKET_TIMING, r as createWaSocket, s as createWhatsAppSocketOperationTimeoutAdapter } from "./.setup/socket-close-YDZcXb67.mjs";
import { n as getStatusCode, t as formatError } from "./.setup/session-errors-JuazczrA.mjs";
import { n as listWhatsAppDirectoryGroupsFromConfig, r as listWhatsAppDirectoryPeersFromConfig } from "./.setup/directory-config-DOMURvI_.mjs";
import { _ as resolveInboundMediaMimetype, c as extractContextInfo, m as findMessageSection, o as describeReplyContext, p as extractText, t as createWebSendApi, u as extractLocationData } from "./.setup/send-api-B4DOt2RJ.mjs";
import { asBoolean, isRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { formatLocationText } from "openclaw/plugin-sdk/channel-inbound";
//#region extensions/whatsapp/src/qa-driver.runtime.ts
function readReaction(message) {
	const reaction = findMessageSection(message ?? void 0, ["reactionMessage"])?.value;
	if (!reaction) return;
	const emoji = normalizeOptionalString(reaction.text) ?? "";
	const key = isRecord(reaction.key) ? reaction.key : void 0;
	return {
		emoji,
		fromMe: asBoolean(key?.fromMe),
		messageId: normalizeOptionalString(key?.id),
		participant: normalizeOptionalString(key?.participant)
	};
}
function readPoll(message) {
	const poll = findMessageSection(message ?? void 0, [
		"pollCreationMessage",
		"pollCreationMessageV2",
		"pollCreationMessageV3",
		"pollCreationMessageV5"
	])?.value;
	if (!poll) return;
	return {
		options: (Array.isArray(poll.options) ? poll.options : []).map((option) => isRecord(option) ? normalizeOptionalString(option.optionName) : void 0).filter((option) => Boolean(option)),
		question: normalizeOptionalString(poll.name)
	};
}
function readMedia(message) {
	const media = findMessageSection(message ?? void 0, [
		"imageMessage",
		"videoMessage",
		"ptvMessage",
		"audioMessage",
		"documentMessage",
		"stickerMessage"
	]);
	return media ? {
		fileName: normalizeOptionalString(media.value.fileName),
		mediaType: resolveInboundMediaMimetype({ [media.name]: media.value })
	} : void 0;
}
function readQuotedMessage(message) {
	const contextInfo = extractContextInfo(message.message ?? void 0);
	const replyContext = describeReplyContext(message.message ?? void 0);
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
	const location = extractLocationData(message.message ?? void 0);
	const text = [extractedText, location ? formatLocationText(location) : void 0].filter(Boolean).join("\n").trim() || void 0;
	const reaction = readReaction(message.message);
	const poll = readPoll(message.message);
	const media = readMedia(message.message);
	const quoted = readQuotedMessage(message);
	const kind = reaction ? "reaction" : poll ? "poll" : media ? "media" : location ? "location" : text ? "text" : "unknown";
	if (!text && kind === "unknown") return null;
	const fromJid = message.key.remoteJid ?? void 0;
	const senderJid = fromJid && isWhatsAppGroupJid(fromJid) ? message.key.participant ?? fromJid : fromJid;
	const participantJid = message.key.participant ?? void 0;
	return {
		fromJid,
		fromPhoneE164: senderJid ? jidToE164(senderJid, { authDir }) : null,
		hasMedia: media ? true : void 0,
		kind,
		mediaFileName: media?.fileName,
		mediaType: media?.mediaType,
		messageId: message.key.id ?? void 0,
		observedAt: (/* @__PURE__ */ new Date()).toISOString(),
		...participantJid ? { participantJid } : {},
		poll,
		quoted,
		reaction,
		text: text ?? ""
	};
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
	const waiters = /* @__PURE__ */ new Set();
	let pendingNotificationsWaiter;
	let closed = false;
	let closedError;
	let receivedPendingNotifications = false;
	const removeWaiter = (waiter) => {
		waiters.delete(waiter);
		clearTimeout(waiter.timeout);
	};
	const settlePendingNotifications = (error) => {
		const waiter = pendingNotificationsWaiter;
		if (!waiter) return;
		pendingNotificationsWaiter = void 0;
		clearTimeout(waiter.timeout);
		if (error) waiter.reject(error);
		else waiter.resolve();
	};
	const observe = (message) => {
		observedMessages.push(message);
		for (const waiter of waiters) {
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
		if (event.receivedPendingNotifications === true) {
			receivedPendingNotifications = true;
			settlePendingNotifications();
		}
		if (event.connection === "close") closeSessionResources(createConnectionClosedError(event));
	};
	const removeMessageListener = () => {
		sock.ev.off("messages.upsert", onMessagesUpsert);
		sock.ev.off("connection.update", onConnectionUpdate);
	};
	const closeSessionResources = (waiterError) => {
		if (closed) return;
		closed = true;
		closedError = waiterError;
		settlePendingNotifications(waiterError);
		for (const waiter of waiters) {
			removeWaiter(waiter);
			if (waiterError) waiter.reject(waiterError);
		}
		removeMessageListener();
		sock.end(void 0);
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
			pendingNotificationsWaiter = {
				resolve,
				reject,
				timeout: setTimeout(() => {
					pendingNotificationsWaiter = void 0;
					reject(/* @__PURE__ */ new Error(`timed out after ${timeoutMs}ms waiting for WhatsApp QA driver pending notifications`));
				}, timeoutMs)
			};
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
		sendContact(to, contact) {
			return toMessageIdResult(sendApi.sendContact(to, contact));
		},
		sendLocation(to, location) {
			return toMessageIdResult(sendApi.sendLocation(to, location));
		},
		sendMedia(to, text, mediaBuffer, mediaType, options) {
			return toMessageIdResult(sendApi.sendMessage(to, text, mediaBuffer, mediaType, options));
		},
		sendPoll(to, poll) {
			return toMessageIdResult(sendApi.sendPoll(to, poll));
		},
		sendReaction(chatJid, messageId, emoji, options) {
			return toMessageIdResult(sendApi.sendReaction(chatJid, messageId, emoji, options.fromMe, options.participant));
		},
		sendSticker(to, stickerBuffer, options) {
			return toMessageIdResult(sendApi.sendSticker(to, stickerBuffer, options));
		},
		sendText(to, text, options) {
			return toMessageIdResult(sendApi.sendMessage(to, text, void 0, void 0, options));
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
				waiters.add(waiter);
			});
		}
	};
}
async function toMessageIdResult(pending) {
	const { messageId } = await pending;
	return { messageId };
}
//#endregion
export { DEFAULT_WEB_MEDIA_BYTES, DEFAULT_WHATSAPP_MEDIA_MAX_MB, WHATSAPP_LEGACY_OUTBOUND_SEND_DEP_KEYS, assertWebChannel, hasAnyWhatsAppAuth, isSelfChatMode, isWhatsAppGroupJid, isWhatsAppUserTarget, jidToE164, listEnabledWhatsAppAccounts, listAccountIds as listWhatsAppAccountIds, listWhatsAppAuthDirs, listWhatsAppDirectoryGroupsFromConfig, listWhatsAppDirectoryPeersFromConfig, looksLikeWhatsAppTargetId, markdownToWhatsApp, normalizeE164, normalizeWhatsAppAllowFromEntries, normalizeWhatsAppMessagingTarget, normalizeWhatsAppTarget, resolveDefaultWhatsAppAccountId, resolveJidToE164, resolveUserPath, resolveWhatsAppAccount, resolveWhatsAppAuthDir, resolveWhatsAppGroupRequireMention, resolveWhatsAppGroupToolPolicy, resolveWhatsAppMediaMaxBytes, resolveWhatsAppOutboundTarget, startWhatsAppQaDriverSession, toWhatsappJid, toWhatsappJidWithLid, whatsappCommandPolicy, whatsappPlugin, whatsappSetupPlugin };
