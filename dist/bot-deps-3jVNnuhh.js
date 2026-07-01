import { c as normalizeOptionalString, p as readStringValue } from "./string-coerce-DW4mBlAt.js";
import { i as formatErrorMessage } from "./errors-DCRXIYSQ.js";
import { i as logVerbose } from "./globals-BWmHKFNH.js";
import { i as getRuntimeConfig } from "./io-BJfjPmGW.js";
import { d as resolveStorePath } from "./paths-CHZBIGhF.js";
import { a as enqueueSystemEvent } from "./system-events-DNR0hK3x.js";
import { a as resolveInboundLastRouteSessionKey } from "./resolve-route-BSWTgtc4.js";
import { l as resolvePinnedMainDmOwnerFromAllowlist } from "./dm-policy-shared-COc7no6a.js";
import { n as loadWebMedia } from "./web-media-DnX3imnL.js";
import "./error-runtime-Ck1CsJM-.js";
import "./runtime-config-snapshot-BJVEWeUQ.js";
import "./runtime-env-oOti2yy7.js";
import "./security-runtime-ZGC3cmUc.js";
import "./string-coerce-runtime-BiZzULo_.js";
import { a as isRecoverableTelegramNetworkError, h as readTelegramRetryAfterMs, o as isSafeToRetrySendError, p as isTelegramRateLimitError, s as isTelegramClientRejection, u as isTelegramMessageNotModifiedError } from "./request-timeouts-CB0H7cNv.js";
import "./routing-DGrdyZ4S.js";
import { y as buildChannelInboundEventContext } from "./kernel-Bxs7lxfo.js";
import { t as recordInboundSession } from "./session-DIP_KKAc.js";
import { t as createChannelReplyPipeline } from "./reply-pipeline-up_QEfXn.js";
import { n as recordChannelActivity } from "./channel-activity-4piA219h.js";
import { a as readChannelAllowFromStore, d as upsertChannelPairingRequest } from "./pairing-store-uQh6I0SL.js";
import { i as loadSessionStore, n as getSessionEntry, o as readSessionUpdatedAt, r as listSessionEntries } from "./session-store-runtime-BlqMkGtn.js";
import { t as resolveApprovalOverGateway } from "./approval-gateway-resolver-oPqfzhN6.js";
import "./approval-gateway-runtime-055vq4ud.js";
import { t as listSkillCommandsForAgents } from "./chat-commands-CKmd7VIS.js";
import { t as dispatchReplyWithBufferedBlockDispatcher } from "./reply-dispatch-runtime-De8wsidG.js";
import { t as deliverInboundReplyWithMessageSendContext } from "./channel-outbound-BNKGCEf1.js";
import { a as takeMessageIdAfterStop, i as createFinalizableDraftStreamControlsForState } from "./draft-stream-controls-SetnHdH6.js";
import "./web-media--IgHJT4v.js";
import "./system-event-runtime-7j3mZE-G.js";
import "./conversation-runtime-C5z_BtCi.js";
import { t as buildModelsProviderData } from "./commands-models-B1LkyO8_.js";
import "./channel-inbound-yghh6EJF.js";
import "./models-provider-runtime-B14jP7ib.js";
import "./skill-commands-runtime-Dch_Dp_8.js";
import { C as buildTelegramThreadParams, a as wasSentByBot, at as normalizeTelegramReplyToMessageId } from "./sent-message-cache-YM0DJkcI.js";
import { c as renderTelegramHtmlText, d as telegramHtmlToPlainTextFallback } from "./format-CHihbmMp.js";
import { t as TELEGRAM_TEXT_CHUNK_LIMIT } from "./outbound-adapter-DwPuIo_e.js";
import { r as normalizeTelegramCommandName, t as TELEGRAM_COMMAND_NAME_PATTERN } from "./command-config-C6JxOjWw.js";
import { A as recordOutboundMessageForPromptContext, R as withTelegramApiErrorLogging, S as isTelegramRichMessageWithinStructuralLimits, _ as TELEGRAM_RICH_TEXT_LIMIT, a as editMessageTelegram, x as getTelegramRichRawApi, y as buildTelegramRichMarkdown } from "./send-D_hlXqaA.js";
import { n as deliverReplies, r as emitInternalMessageSentHook } from "./delivery-hAjLKiHu.js";
import { createHash } from "node:crypto";
//#region extensions/telegram/src/bot-native-command-menu.ts
const TELEGRAM_MAX_COMMANDS = 100;
const TELEGRAM_TOTAL_COMMAND_TEXT_BUDGET = 5700;
const TELEGRAM_COMMAND_RETRY_RATIO = .8;
const TELEGRAM_MIN_COMMAND_DESCRIPTION_LENGTH = 1;
const TELEGRAM_MAX_COMMAND_DESCRIPTION_LENGTH = 256;
const TELEGRAM_MENU_RESULT_CACHE_MAX = 128;
const TELEGRAM_COMMAND_MENU_SCOPES = [{ label: "default" }, {
	label: "all_group_chats",
	options: { scope: { type: "all_group_chats" } }
}];
const cappedTelegramMenuCache = /* @__PURE__ */ new Map();
function countTelegramCommandText(value) {
	let count = 0;
	for (let index = 0; index < value.length;) {
		const codePoint = value.codePointAt(index);
		index += codePoint && codePoint > 65535 ? 2 : 1;
		count += 1;
	}
	return count;
}
function truncateTelegramCommandText(value, maxLength) {
	if (maxLength <= 0) return "";
	const suffix = maxLength > 1 ? "…" : "";
	const prefixLimit = maxLength - countTelegramCommandText(suffix);
	let count = 0;
	let prefixEnd = 0;
	for (const char of value) {
		count += 1;
		if (count <= prefixLimit) prefixEnd += char.length;
		if (count > maxLength) return `${value.slice(0, prefixEnd)}${suffix}`;
	}
	return value;
}
function fitTelegramCommandsWithinTextBudget(commands, maxTotalChars) {
	let candidateCommands = [...commands];
	while (candidateCommands.length > 0) {
		const descriptionBudget = maxTotalChars - candidateCommands.reduce((total, command) => total + countTelegramCommandText(command.command), 0);
		if (descriptionBudget < candidateCommands.length * TELEGRAM_MIN_COMMAND_DESCRIPTION_LENGTH) {
			candidateCommands = candidateCommands.slice(0, -1);
			continue;
		}
		const descriptionCap = Math.max(TELEGRAM_MIN_COMMAND_DESCRIPTION_LENGTH, Math.floor(descriptionBudget / candidateCommands.length));
		let descriptionTrimmed = false;
		const fittedCommands = candidateCommands.map((command) => {
			const description = truncateTelegramCommandText(command.description, Math.min(descriptionCap, TELEGRAM_MAX_COMMAND_DESCRIPTION_LENGTH));
			if (description !== command.description) {
				descriptionTrimmed = true;
				return Object.assign({}, command, { description });
			}
			return command;
		});
		return {
			commands: fittedCommands,
			descriptionTrimmed,
			textBudgetDropCount: commands.length - fittedCommands.length
		};
	}
	return {
		commands: [],
		descriptionTrimmed: false,
		textBudgetDropCount: commands.length
	};
}
function readErrorTextField(value, key) {
	if (!value || typeof value !== "object" || !(key in value)) return;
	return readStringValue(value[key]);
}
function isBotCommandsTooMuchError(err) {
	if (!err) return false;
	const pattern = /\bBOT_COMMANDS_TOO_MUCH\b/i;
	if (typeof err === "string") return pattern.test(err);
	if (err instanceof Error) {
		if (pattern.test(err.message)) return true;
	}
	const description = readErrorTextField(err, "description");
	if (description && pattern.test(description)) return true;
	const message = readErrorTextField(err, "message");
	if (message && pattern.test(message)) return true;
	return false;
}
function formatTelegramCommandRetrySuccessLog(params) {
	const omittedCount = Math.max(0, params.initialCount - params.acceptedCount);
	return `Telegram accepted ${params.acceptedCount} commands after BOT_COMMANDS_TOO_MUCH (started with ${params.initialCount}; omitted ${omittedCount}). Reduce plugin/skill/custom commands to expose more menu entries.`;
}
function buildPluginTelegramMenuCommands(params) {
	const { specs, existingCommands } = params;
	const commands = [];
	const issues = [];
	const pluginCommandNames = /* @__PURE__ */ new Set();
	for (const spec of specs) {
		const rawName = typeof spec.name === "string" ? spec.name : "";
		const normalized = normalizeTelegramCommandName(rawName);
		if (!normalized || !TELEGRAM_COMMAND_NAME_PATTERN.test(normalized)) {
			const invalidName = rawName.trim() ? rawName : "<unknown>";
			issues.push(`Plugin command "/${invalidName}" is invalid for Telegram (use a-z, 0-9, underscore; max 32 chars).`);
			continue;
		}
		const description = normalizeOptionalString(spec.description) ?? "";
		if (!description) {
			issues.push(`Plugin command "/${normalized}" is missing a description.`);
			continue;
		}
		if (existingCommands.has(normalized)) {
			if (pluginCommandNames.has(normalized)) issues.push(`Plugin command "/${normalized}" is duplicated.`);
			else issues.push(`Plugin command "/${normalized}" conflicts with an existing Telegram command.`);
			continue;
		}
		pluginCommandNames.add(normalized);
		existingCommands.add(normalized);
		const menuCommand = {
			command: normalized,
			description
		};
		if (spec.descriptionLocalizations) menuCommand.descriptionLocalizations = spec.descriptionLocalizations;
		commands.push(menuCommand);
	}
	return {
		commands,
		issues
	};
}
function buildCappedTelegramMenuCommands(params) {
	const maxCommands = params.maxCommands ?? TELEGRAM_MAX_COMMANDS;
	const maxTotalChars = params.maxTotalChars ?? 5700;
	const cacheKey = buildTelegramMenuResultCacheKey({
		allCommands: params.allCommands,
		maxCommands,
		maxTotalChars
	});
	const cached = cappedTelegramMenuCache.get(cacheKey);
	if (cached) return cached;
	const result = buildUncachedCappedTelegramMenuCommands({
		allCommands: params.allCommands,
		maxCommands,
		maxTotalChars
	});
	rememberCappedTelegramMenuResult(cacheKey, result);
	return result;
}
function buildUncachedCappedTelegramMenuCommands(params) {
	const { allCommands } = params;
	const { maxCommands, maxTotalChars } = params;
	const totalCommands = allCommands.length;
	const overflowCount = Math.max(0, totalCommands - maxCommands);
	const canonicalCommands = allCommands.filter((command) => !command.isAlias);
	const aliasCommands = allCommands.filter((command) => command.isAlias);
	const aliasBudget = Math.max(0, maxCommands - canonicalCommands.length);
	const { commands: fittedCommands, descriptionTrimmed, textBudgetDropCount } = fitTelegramCommandsWithinTextBudget((overflowCount === 0 ? allCommands : [...canonicalCommands, ...aliasCommands.slice(0, aliasBudget)]).slice(0, maxCommands), maxTotalChars);
	return {
		commandsToRegister: fittedCommands.map(({ isAlias: _isAlias, ...command }) => command),
		totalCommands,
		maxCommands,
		overflowCount,
		maxTotalChars,
		descriptionTrimmed,
		textBudgetDropCount
	};
}
function buildTelegramMenuResultCacheKey(params) {
	const digest = createHash("sha256");
	updateTelegramCommandDigestField(digest, String(params.maxCommands));
	updateTelegramCommandDigestField(digest, String(params.maxTotalChars));
	for (const command of params.allCommands) {
		updateTelegramCommandDigestField(digest, command.command);
		updateTelegramCommandDigestField(digest, command.description);
		updateTelegramCommandDigestField(digest, command.isAlias ? "1" : "0");
		updateTelegramCommandLocalizationDigest(digest, command.descriptionLocalizations);
	}
	return digest.digest("hex").slice(0, 16);
}
function updateTelegramCommandDigestField(digest, value) {
	digest.update(String(value.length));
	digest.update(":");
	digest.update(value);
}
function updateTelegramCommandLocalizationDigest(digest, localizations) {
	const entries = Object.entries(localizations ?? {}).toSorted(([a], [b]) => a.localeCompare(b));
	updateTelegramCommandDigestField(digest, String(entries.length));
	for (const [locale, description] of entries) {
		updateTelegramCommandDigestField(digest, locale);
		updateTelegramCommandDigestField(digest, description);
	}
}
function rememberCappedTelegramMenuResult(key, result) {
	cappedTelegramMenuCache.set(key, result);
	if (cappedTelegramMenuCache.size <= TELEGRAM_MENU_RESULT_CACHE_MAX) return;
	const oldestKey = cappedTelegramMenuCache.keys().next().value;
	if (oldestKey) cappedTelegramMenuCache.delete(oldestKey);
}
function hashCommandList(commands) {
	const sorted = [...commands].toSorted((a, b) => a.command.localeCompare(b.command));
	return createHash("sha256").update(JSON.stringify(sorted)).digest("hex").slice(0, 16);
}
const syncedCommandHashes = /* @__PURE__ */ new Map();
function getCommandHashKey(accountId, botIdentity) {
	return `${accountId ?? "default"}:${botIdentity ?? ""}`;
}
function readCachedCommandHash(accountId, botIdentity) {
	const key = getCommandHashKey(accountId, botIdentity);
	return syncedCommandHashes.get(key) ?? null;
}
function writeCachedCommandHash(accountId, botIdentity, hash) {
	const key = getCommandHashKey(accountId, botIdentity);
	syncedCommandHashes.set(key, hash);
}
function normalizeTelegramLanguageCode(languageCode) {
	const normalized = languageCode.trim().toLowerCase();
	return /^[a-z]{2}$/.test(normalized) ? normalized : null;
}
function readLocalizedDescription(command, languageCode) {
	for (const [rawLanguageCode, rawDescription] of Object.entries(command.descriptionLocalizations ?? {})) {
		if (normalizeTelegramLanguageCode(rawLanguageCode) !== languageCode) continue;
		const description = normalizeOptionalString(rawDescription);
		if (description) return description;
	}
}
function toTelegramBotCommands(commands) {
	return commands.map((command) => ({
		command: command.command,
		description: command.description
	}));
}
function buildLocalizedCommandVariants(commands) {
	const locales = /* @__PURE__ */ new Set();
	const unsupportedLanguageCodes = /* @__PURE__ */ new Set();
	for (const cmd of commands) if (cmd.descriptionLocalizations) for (const lang of Object.keys(cmd.descriptionLocalizations)) {
		const normalized = normalizeTelegramLanguageCode(lang);
		if (normalized) locales.add(normalized);
		else unsupportedLanguageCodes.add(lang);
	}
	return {
		variants: [...locales].toSorted().map((languageCode) => {
			return {
				languageCode,
				commands: fitTelegramCommandsWithinTextBudget(commands.map((cmd) => ({
					command: cmd.command,
					description: readLocalizedDescription(cmd, languageCode) ?? cmd.description
				})), TELEGRAM_TOTAL_COMMAND_TEXT_BUDGET).commands
			};
		}),
		unsupportedLanguageCodes: [...unsupportedLanguageCodes].toSorted()
	};
}
function formatTelegramCommandScopeOperation(operation, scope, languageCode) {
	const base = scope.label === "default" ? operation : `${operation}(${scope.label})`;
	return languageCode ? `${base}(${languageCode})` : base;
}
async function deleteTelegramMenuCommandsForScopes(params) {
	const { bot, runtime } = params;
	if (typeof bot.api.deleteMyCommands !== "function") return true;
	let allDeleted = true;
	for (const scope of TELEGRAM_COMMAND_MENU_SCOPES) {
		const deleted = await withTelegramApiErrorLogging({
			operation: formatTelegramCommandScopeOperation("deleteMyCommands", scope),
			runtime,
			fn: () => scope.options ? bot.api.deleteMyCommands(scope.options) : bot.api.deleteMyCommands()
		}).then(() => true).catch(() => false);
		allDeleted &&= deleted;
	}
	return allDeleted;
}
async function setTelegramMenuCommandsForScopes(params) {
	const { bot, runtime, commands, languageCode, shouldLog } = params;
	for (const scope of TELEGRAM_COMMAND_MENU_SCOPES) await withTelegramApiErrorLogging({
		operation: formatTelegramCommandScopeOperation("setMyCommands", scope, languageCode),
		runtime,
		shouldLog,
		fn: () => {
			const botCommands = toTelegramBotCommands(commands);
			const opts = {
				...scope.options,
				...languageCode ? { language_code: languageCode } : void 0
			};
			return Object.keys(opts).length > 0 ? bot.api.setMyCommands(botCommands, opts) : bot.api.setMyCommands(botCommands);
		}
	});
}
function syncTelegramMenuCommands(params) {
	const { bot, runtime, commandsToRegister, accountId, botIdentity } = params;
	const sync = async () => {
		const currentHash = hashCommandList(commandsToRegister);
		if (readCachedCommandHash(accountId, botIdentity) === currentHash) {
			logVerbose("telegram: command menu unchanged; skipping sync");
			return;
		}
		const deleteSucceeded = await deleteTelegramMenuCommandsForScopes({
			bot,
			runtime
		});
		if (commandsToRegister.length === 0) {
			if (!deleteSucceeded) {
				runtime.log?.("telegram: deleteMyCommands failed; skipping empty-menu hash cache write");
				return;
			}
			if (typeof bot.api.deleteMyCommands !== "function") await setTelegramMenuCommandsForScopes({
				bot,
				runtime,
				commands: []
			});
			writeCachedCommandHash(accountId, botIdentity, currentHash);
			return;
		}
		let retryCommands = commandsToRegister;
		let acceptedCommands = null;
		const initialCommandCount = commandsToRegister.length;
		while (retryCommands.length > 0) try {
			await setTelegramMenuCommandsForScopes({
				bot,
				runtime,
				commands: retryCommands,
				shouldLog: (err) => !isBotCommandsTooMuchError(err)
			});
			if (retryCommands.length < initialCommandCount) runtime.log?.(formatTelegramCommandRetrySuccessLog({
				initialCount: initialCommandCount,
				acceptedCount: retryCommands.length
			}));
			acceptedCommands = retryCommands;
			break;
		} catch (err) {
			if (!isBotCommandsTooMuchError(err)) throw err;
			const nextCount = Math.floor(retryCommands.length * TELEGRAM_COMMAND_RETRY_RATIO);
			const reducedCount = nextCount < retryCommands.length ? nextCount : retryCommands.length - 1;
			if (reducedCount <= 0) {
				runtime.error?.("Telegram rejected native command registration (BOT_COMMANDS_TOO_MUCH); leaving menu empty. Reduce commands or disable channels.telegram.commands.native.");
				return;
			}
			runtime.log?.(`Telegram rejected ${retryCommands.length} commands (BOT_COMMANDS_TOO_MUCH); retrying with ${reducedCount}.`);
			retryCommands = retryCommands.slice(0, reducedCount);
		}
		if (!acceptedCommands) return;
		const { variants, unsupportedLanguageCodes } = buildLocalizedCommandVariants(acceptedCommands);
		if (unsupportedLanguageCodes.length > 0) runtime.log?.(`Telegram command menu ignored unsupported description localization codes: ${unsupportedLanguageCodes.join(", ")}.`);
		for (const variant of variants) await setTelegramMenuCommandsForScopes({
			bot,
			runtime,
			commands: variant.commands,
			languageCode: variant.languageCode
		});
		writeCachedCommandHash(accountId, botIdentity, currentHash);
	};
	sync().catch((err) => {
		runtime.error?.(`Telegram command sync failed: ${String(err)}`);
	});
}
//#endregion
//#region extensions/telegram/src/draft-stream.ts
const TELEGRAM_STREAM_MAX_CHARS = TELEGRAM_TEXT_CHUNK_LIMIT;
const DEFAULT_THROTTLE_MS = 1e3;
const TELEGRAM_PARSE_ERR_RE = /can't parse entities|parse entities|find end of the entity/i;
const MAX_CONSECUTIVE_PREVIEW_FAILURES = 3;
const MAX_PREVIEW_FLOOD_SUSPEND_MS = 6e4;
function renderTelegramDraftPreview(text, renderText) {
	const trimmed = text.trimEnd();
	return renderText?.(trimmed) ?? { text: trimmed };
}
function isTelegramHtmlParseError(err) {
	return TELEGRAM_PARSE_ERR_RE.test(formatErrorMessage(err));
}
function telegramRichHtmlToParseModeHtml(html) {
	return html.replace(/<br\s*\/?>/giu, "\n");
}
function normalizeTelegramDraftTransportPreview(preview) {
	if (preview.richMessage?.html) return {
		text: telegramRichHtmlToParseModeHtml(preview.richMessage.html),
		parseMode: "HTML",
		plainText: preview.text
	};
	if (preview.richMessage?.markdown) return {
		text: renderTelegramHtmlText(preview.richMessage.markdown),
		parseMode: "HTML",
		plainText: preview.text
	};
	if (preview.parseMode === "HTML") return {
		text: preview.text,
		parseMode: "HTML",
		plainText: telegramHtmlToPlainTextFallback(preview.text)
	};
	return {
		text: preview.text,
		plainText: preview.text
	};
}
function telegramDraftPreviewKey(preview) {
	return JSON.stringify({
		text: preview.text,
		parseMode: preview.parseMode ?? "plain",
		richMessage: preview.richMessage
	});
}
function telegramDraftRichPayloadLength(preview) {
	if (!isTelegramRichMessageWithinStructuralLimits(preview.richMessage ?? { markdown: preview.text })) return TELEGRAM_RICH_TEXT_LIMIT + 1;
	const richMessage = preview.richMessage ?? buildTelegramRichMarkdown(preview.text);
	return richMessage.html?.length ?? richMessage.markdown?.length ?? 0;
}
function resolveTelegramDraftRenderedText(preview, richMessages) {
	return richMessages ? preview.text : normalizeTelegramDraftTransportPreview(preview).text;
}
function findTelegramDraftChunkLength(text, maxChars, renderText, richMessages) {
	let best = 0;
	let low = 1;
	let high = text.length;
	while (low <= high) {
		const mid = Math.floor((low + high) / 2);
		const preview = renderTelegramDraftPreview(text.slice(0, mid), renderText);
		const renderedText = resolveTelegramDraftRenderedText(preview, richMessages).trimEnd();
		const payloadLength = richMessages ? telegramDraftRichPayloadLength(preview) : renderedText.length;
		if (renderedText && payloadLength <= maxChars) {
			best = mid;
			low = mid + 1;
		} else high = mid - 1;
	}
	return best;
}
function createTelegramDraftStream(params) {
	const richMessages = params.richMessages === true;
	const transportLimit = richMessages ? TELEGRAM_RICH_TEXT_LIMIT : TELEGRAM_STREAM_MAX_CHARS;
	const maxChars = Math.min(params.maxChars ?? transportLimit, transportLimit);
	const throttleMs = Math.max(250, params.throttleMs ?? DEFAULT_THROTTLE_MS);
	const minInitialChars = params.minInitialChars;
	const chatId = params.chatId;
	const threadParams = buildTelegramThreadParams(params.thread);
	const replyToMessageId = normalizeTelegramReplyToMessageId(params.replyToMessageId);
	const sendMessageParams = replyToMessageId != null ? {
		...threadParams,
		reply_parameters: {
			message_id: replyToMessageId,
			allow_sending_without_reply: true
		}
	} : threadParams ?? {};
	const richMessageParams = replyToMessageId != null ? {
		...threadParams,
		reply_parameters: {
			message_id: replyToMessageId,
			allow_sending_without_reply: true
		}
	} : threadParams ?? {};
	const streamState = {
		stopped: false,
		final: false
	};
	let messageSendAttempted = false;
	let suspendedUntilMs = 0;
	let consecutivePreviewFailures = 0;
	let streamMessageId;
	let streamVisibleSinceMs;
	let lastSentPreviewKey = "";
	let lastDeliveredText = "";
	let lastRequestedText = "";
	let lastRequestedPreview;
	let previewRevision = 0;
	let generation = 0;
	let deliveredTextOffset = 0;
	const sendRenderedMessage = async (preview) => {
		if (richMessages) return await getTelegramRichRawApi(params.api).sendRichMessage({
			chat_id: chatId,
			rich_message: preview.richMessage ?? buildTelegramRichMarkdown(preview.text),
			...richMessageParams
		});
		const transportPreview = normalizeTelegramDraftTransportPreview(preview);
		const sendPlain = async () => await params.api.sendMessage(chatId, transportPreview.plainText, sendMessageParams);
		if (transportPreview.parseMode !== "HTML") return await sendPlain();
		try {
			return await params.api.sendMessage(chatId, transportPreview.text, {
				parse_mode: "HTML",
				...sendMessageParams
			});
		} catch (err) {
			if (!isTelegramHtmlParseError(err)) throw err;
			return await sendPlain();
		}
	};
	const sendMessageTransportPreview = async ({ preview, sendGeneration }) => {
		if (typeof streamMessageId === "number") {
			streamVisibleSinceMs ??= Date.now();
			if (richMessages) {
				await getTelegramRichRawApi(params.api).editMessageText({
					chat_id: chatId,
					message_id: streamMessageId,
					rich_message: preview.richMessage ?? buildTelegramRichMarkdown(preview.text)
				});
				return true;
			}
			const transportPreview = normalizeTelegramDraftTransportPreview(preview);
			if (transportPreview.parseMode === "HTML") try {
				await params.api.editMessageText(chatId, streamMessageId, transportPreview.text, { parse_mode: "HTML" });
			} catch (err) {
				if (!isTelegramHtmlParseError(err)) throw err;
				await params.api.editMessageText(chatId, streamMessageId, transportPreview.plainText);
			}
			else await params.api.editMessageText(chatId, streamMessageId, transportPreview.text);
			return true;
		}
		messageSendAttempted = true;
		let sent;
		try {
			sent = await sendRenderedMessage(preview);
		} catch (err) {
			if (isSafeToRetrySendError(err) || isTelegramClientRejection(err)) messageSendAttempted = false;
			throw err;
		}
		const sentMessageId = sent?.message_id;
		if (typeof sentMessageId !== "number" || !Number.isFinite(sentMessageId)) {
			streamState.stopped = true;
			params.warn?.("telegram stream preview stopped (missing message id from sendMessage)");
			return false;
		}
		const normalizedMessageId = Math.trunc(sentMessageId);
		const visibleSinceMs = Date.now();
		if (sendGeneration !== generation) {
			params.onSupersededPreview?.({
				messageId: normalizedMessageId,
				textSnapshot: preview.text,
				visibleSinceMs,
				retain: true
			});
			return true;
		}
		streamMessageId = normalizedMessageId;
		streamVisibleSinceMs = visibleSinceMs;
		return true;
	};
	const stopOversizedPreview = (payloadLength) => {
		streamState.stopped = true;
		params.warn?.(`telegram stream preview stopped (text length ${payloadLength} > ${maxChars})`);
		return false;
	};
	const sendOrEditStreamMessage = async (text) => {
		if (streamState.stopped && !streamState.final) return false;
		if (!streamState.final && Date.now() < suspendedUntilMs) return false;
		const trimmed = text.trimEnd();
		if (!trimmed) return false;
		const currentText = trimmed.slice(deliveredTextOffset).trimStart();
		if (!currentText) return false;
		const rendered = deliveredTextOffset === 0 && lastRequestedPreview?.text === trimmed ? lastRequestedPreview : renderTelegramDraftPreview(currentText, params.renderText);
		const renderedText = resolveTelegramDraftRenderedText(rendered, richMessages).trimEnd();
		const renderedPayloadLength = richMessages ? telegramDraftRichPayloadLength(rendered) : renderedText.length;
		const renderedPreviewKey = telegramDraftPreviewKey({
			...rendered,
			text: renderedText
		});
		if (!renderedText) return false;
		if (renderedPayloadLength > maxChars) {
			const chunkLength = findTelegramDraftChunkLength(currentText, maxChars, params.renderText, richMessages);
			if (!streamState.final) {
				if (chunkLength > 0) return await sendOrEditStreamMessage(trimmed.slice(0, deliveredTextOffset) + currentText.slice(0, chunkLength));
				return stopOversizedPreview(renderedPayloadLength);
			}
			if (lastDeliveredText.length > deliveredTextOffset) {
				const supersededMessageId = streamMessageId;
				const supersededTextSnapshot = lastDeliveredText.slice(deliveredTextOffset);
				const supersededVisibleSinceMs = streamVisibleSinceMs;
				deliveredTextOffset = lastDeliveredText.length;
				resetStreamToNewMessage({
					keepFinal: true,
					keepPending: true,
					resetOffset: false
				});
				if (typeof supersededMessageId === "number") params.onSupersededPreview?.({
					messageId: supersededMessageId,
					textSnapshot: supersededTextSnapshot,
					visibleSinceMs: supersededVisibleSinceMs,
					retain: true
				});
				return await sendOrEditStreamMessage(trimmed);
			}
			if (chunkLength > 0) {
				if (!await sendOrEditStreamMessage(trimmed.slice(0, deliveredTextOffset) + currentText.slice(0, chunkLength))) return false;
				return await sendOrEditStreamMessage(trimmed);
			}
			return stopOversizedPreview(renderedPayloadLength);
		}
		if (renderedPreviewKey === lastSentPreviewKey) return true;
		const sendGeneration = generation;
		if (typeof streamMessageId !== "number" && minInitialChars != null && !streamState.final) {
			if (renderedText.length < minInitialChars) return false;
		}
		const previousSentPreviewKey = lastSentPreviewKey;
		lastSentPreviewKey = renderedPreviewKey;
		try {
			const sent = await sendMessageTransportPreview({
				preview: rendered,
				sendGeneration
			});
			if (sent) {
				previewRevision += 1;
				lastDeliveredText = trimmed;
				consecutivePreviewFailures = 0;
				suspendedUntilMs = 0;
			}
			return sent;
		} catch (err) {
			const isEdit = typeof streamMessageId === "number";
			if (isEdit && isTelegramMessageNotModifiedError(err)) {
				consecutivePreviewFailures = 0;
				lastDeliveredText = trimmed;
				return true;
			}
			lastSentPreviewKey = previousSentPreviewKey;
			const retryable = isTelegramRateLimitError(err) || (isEdit ? isRecoverableTelegramNetworkError(err) : isSafeToRetrySendError(err));
			consecutivePreviewFailures += 1;
			if (retryable && consecutivePreviewFailures <= MAX_CONSECUTIVE_PREVIEW_FAILURES) {
				const retryAfterMs = readTelegramRetryAfterMs(err);
				if (retryAfterMs !== void 0) suspendedUntilMs = Date.now() + Math.min(retryAfterMs, MAX_PREVIEW_FLOOD_SUSPEND_MS);
				params.warn?.(`telegram stream preview ${isEdit ? "edit" : "send"} failed (retrying): ${formatErrorMessage(err)}`);
				return false;
			}
			streamState.stopped = true;
			params.warn?.(`telegram stream preview failed: ${formatErrorMessage(err)}`);
			return false;
		}
	};
	const { loop, update: updateDraft, stopForClear } = createFinalizableDraftStreamControlsForState({
		throttleMs,
		state: streamState,
		sendOrEditStreamMessage
	});
	const requestDraftUpdate = (text, preview) => {
		if (streamState.stopped || streamState.final) return;
		lastRequestedPreview = preview;
		lastRequestedText = text;
		updateDraft(text);
	};
	const update = (text) => {
		requestDraftUpdate(text);
	};
	const updatePreview = (preview) => {
		const text = preview.text.trimEnd();
		if (!text) return;
		requestDraftUpdate(text, {
			...preview,
			text
		});
	};
	const stop = async () => {
		streamState.final = true;
		await loop.flush();
		if (streamState.stopped) return;
		const finalText = lastRequestedText.trimEnd();
		if (finalText && finalText !== lastDeliveredText.trimEnd()) await sendOrEditStreamMessage(finalText);
		streamState.final = true;
	};
	const resetStreamToNewMessage = (options) => {
		streamState.stopped = false;
		streamState.final = options?.keepFinal === true;
		generation += 1;
		messageSendAttempted = false;
		streamMessageId = void 0;
		streamVisibleSinceMs = void 0;
		lastSentPreviewKey = "";
		if (options?.resetOffset !== false) {
			deliveredTextOffset = 0;
			lastRequestedText = "";
		}
		if (!options?.keepPending) {
			loop.resetPending();
			lastRequestedPreview = void 0;
		}
		loop.resetThrottleWindow();
	};
	const clear = async () => {
		const messageId = await takeMessageIdAfterStop({
			stopForClear,
			readMessageId: () => streamMessageId,
			clearMessageId: () => {
				streamMessageId = void 0;
			}
		});
		if (typeof messageId === "number" && Number.isFinite(messageId)) try {
			await params.api.deleteMessage(chatId, messageId);
			params.log?.(`telegram stream preview deleted (chat=${chatId}, message=${messageId})`);
		} catch (err) {
			params.warn?.(`telegram stream preview cleanup failed: ${formatErrorMessage(err)}`);
		}
	};
	const discard = async () => {
		await stopForClear();
	};
	const forceNewMessage = () => {
		resetStreamToNewMessage();
	};
	const materialize = async () => {
		await stop();
		return streamMessageId;
	};
	params.log?.(`telegram stream preview ready (maxChars=${maxChars}, throttleMs=${throttleMs})`);
	return {
		update,
		updatePreview,
		flush: loop.flush,
		messageId: () => streamMessageId,
		visibleSinceMs: () => streamVisibleSinceMs,
		previewRevision: () => previewRevision,
		lastDeliveredText: () => lastDeliveredText,
		clear,
		stop,
		discard,
		materialize,
		forceNewMessage,
		sendMayHaveLanded: () => messageSendAttempted && typeof streamMessageId !== "number"
	};
}
//#endregion
//#region extensions/telegram/src/exec-approval-resolver.ts
async function resolveTelegramExecApproval(params) {
	await resolveApprovalOverGateway({
		cfg: params.cfg,
		approvalId: params.approvalId,
		decision: params.decision,
		senderId: params.senderId,
		gatewayUrl: params.gatewayUrl,
		allowPluginFallback: params.allowPluginFallback,
		clientDisplayName: `Telegram approval (${params.senderId?.trim() || "unknown"})`
	});
}
//#endregion
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
	get listSessionEntries() {
		return listSessionEntries;
	},
	get readChannelAllowFromStore() {
		return readChannelAllowFromStore;
	},
	get loadSessionStore() {
		return loadSessionStore;
	},
	get readSessionUpdatedAt() {
		return readSessionUpdatedAt;
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
	get enqueueSystemEvent() {
		return enqueueSystemEvent;
	},
	get dispatchReplyWithBufferedBlockDispatcher() {
		return dispatchReplyWithBufferedBlockDispatcher;
	},
	get loadWebMedia() {
		return loadWebMedia;
	},
	get buildModelsProviderData() {
		return buildModelsProviderData;
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
	get resolveExecApproval() {
		return resolveTelegramExecApproval;
	},
	get createTelegramDraftStream() {
		return createTelegramDraftStream;
	},
	get deliverReplies() {
		return deliverReplies;
	},
	get deliverInboundReplyWithMessageSendContext() {
		return deliverInboundReplyWithMessageSendContext;
	},
	get emitInternalMessageSentHook() {
		return emitInternalMessageSentHook;
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
export { buildPluginTelegramMenuCommands as a, buildCappedTelegramMenuCommands as i, resolveTelegramExecApproval as n, syncTelegramMenuCommands as o, createTelegramDraftStream as r, defaultTelegramBotDeps as t };
