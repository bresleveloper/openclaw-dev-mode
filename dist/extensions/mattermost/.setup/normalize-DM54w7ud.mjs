import { h as normalizeMattermostBaseUrl } from "./client-BSSVve1x.mjs";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolveChannelPreviewStreamMode, resolveChannelStreamingBlockCoalesce, resolveChannelStreamingBlockEnabled, resolveChannelStreamingChunkMode } from "openclaw/plugin-sdk/channel-outbound";
import { createAccountListHelpers, hasConfiguredAccountValue } from "openclaw/plugin-sdk/account-helpers";
import { normalizeMessagePresentation, renderMessagePresentationFallbackText, resolveMessagePresentationControlValue } from "openclaw/plugin-sdk/interactive-runtime";
import { resolveAskUserQuestionOptionIndex, resolveAskUserQuestionOptionIndices } from "openclaw/plugin-sdk/reply-payload";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { buildSecretInputSchema, hasConfiguredSecretInput, resolveSecretInputString } from "openclaw/plugin-sdk/secret-input";
//#region extensions/mattermost/src/mattermost/accounts.ts
const { listAccountIds: listMattermostAccountIds, resolveDefaultAccountId: resolveDefaultMattermostAccountId, resolveAccountConfig: mergeMattermostAccountConfig } = createAccountListHelpers("mattermost", {
	omitKeys: ["defaultAccount"],
	nestedObjectKeys: ["commands"],
	hasImplicitDefaultAccount: (cfg) => {
		const mattermost = cfg.channels?.mattermost;
		return Boolean(mattermost?.baseUrl?.trim() && (hasConfiguredAccountValue(mattermost.botToken) || process.env.MATTERMOST_BOT_TOKEN?.trim()));
	}
});
function resolveMattermostRequireMention(config) {
	if (config.chatmode === "oncall") return true;
	if (config.chatmode === "onmessage") return false;
	if (config.chatmode === "onchar") return true;
	return config.requireMention;
}
function resolveMattermostAccountWithMode(params) {
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultMattermostAccountId(params.cfg));
	const baseEnabled = params.cfg.channels?.mattermost?.enabled !== false;
	const merged = mergeMattermostAccountConfig(params.cfg, accountId);
	const accountEnabled = merged.enabled !== false;
	const enabled = baseEnabled && accountEnabled;
	const allowEnv = accountId === DEFAULT_ACCOUNT_ID;
	const envToken = allowEnv ? process.env.MATTERMOST_BOT_TOKEN?.trim() : void 0;
	const envUrl = allowEnv ? process.env.MATTERMOST_URL?.trim() : void 0;
	const configToken = resolveSecretInputString({
		value: merged.botToken,
		path: `channels.mattermost.accounts.${accountId}.botToken`,
		mode: params.mode
	});
	const configUrl = merged.baseUrl?.trim();
	const botToken = configToken.status === "available" ? configToken.value : configToken.status === "missing" ? envToken : void 0;
	const baseUrl = normalizeMattermostBaseUrl(configUrl || envUrl);
	const requireMention = resolveMattermostRequireMention(merged);
	const botTokenSource = configToken.status !== "missing" ? "config" : envToken ? "env" : "none";
	const botTokenStatus = configToken.status !== "missing" ? configToken.status : envToken ? "available" : "missing";
	const baseUrlSource = configUrl ? "config" : envUrl ? "env" : "none";
	return {
		accountId,
		enabled,
		name: normalizeOptionalString(merged.name),
		botToken,
		baseUrl,
		botTokenSource,
		botTokenStatus,
		baseUrlSource,
		config: merged,
		chatmode: merged.chatmode,
		oncharPrefixes: merged.oncharPrefixes,
		requireMention,
		textChunkLimit: merged.textChunkLimit,
		chunkMode: resolveChannelStreamingChunkMode(merged),
		streamingMode: resolveChannelPreviewStreamMode(merged, "partial"),
		blockStreaming: resolveChannelStreamingBlockEnabled(merged),
		blockStreamingCoalesce: resolveChannelStreamingBlockCoalesce(merged)
	};
}
function resolveMattermostAccount(params) {
	return resolveMattermostAccountWithMode({
		...params,
		mode: "strict"
	});
}
function inspectMattermostAccount(params) {
	const account = resolveMattermostAccountWithMode({
		...params,
		mode: "inspect"
	});
	return {
		...account,
		configured: isMattermostConfigured(account),
		dmPolicy: account.config.dmPolicy ?? "pairing"
	};
}
function isMattermostConfigured(account) {
	return (account.botTokenStatus ? account.botTokenStatus !== "missing" : Boolean(account.botToken)) && Boolean(account.baseUrl);
}
/**
* Resolve the effective replyToMode for a given chat type.
* Direct messages stay flat unless explicitly opted into a per-chat-type mode.
*/
function resolveMattermostReplyToMode(account, kind) {
	const scopedMode = account.config.replyToModeByChatType?.[kind];
	if (scopedMode !== void 0) return scopedMode;
	if (kind === "direct") return "off";
	return account.config.replyToMode ?? "off";
}
//#endregion
//#region extensions/mattermost/src/normalize.ts
/** Marks a button context as one this plugin answers through the question Gateway. */
const MATTERMOST_QUESTION_CONTEXT_KEY = "oc_question";
/**
* Read a question selection back out of a verified interaction context.
*
* The context is HMAC-signed on the way out and verified before this runs, so
* the ids here are the ones this Gateway wrote, not the clicker's input.
*/
function parseMattermostQuestionContext(context) {
	if (context[MATTERMOST_QUESTION_CONTEXT_KEY] !== true) return null;
	const questionId = context.question_id;
	const optionIndex = context.option_index;
	if (typeof questionId !== "string" || !questionId || typeof optionIndex !== "number") return null;
	return Number.isInteger(optionIndex) && optionIndex >= 0 ? {
		questionId,
		optionIndex
	} : null;
}
function resolveMattermostPresentation(params) {
	const presentation = normalizeMessagePresentation(params.presentation);
	const text = !presentation || params.presentationTextMode === "fallback" && params.text !== void 0 ? params.text ?? "" : renderMessagePresentationFallbackText({
		text: params.text,
		presentation
	});
	const questionOptionIndices = resolveAskUserQuestionOptionIndices({ channelData: params.channelData });
	return {
		text,
		buttons: presentation ? presentation.blocks.filter((block) => block.type === "buttons").map((block) => block.buttons.flatMap((button) => {
			const action = button.action;
			if (action?.type === "question") {
				if ("intent" in action) return [];
				const optionIndex = resolveAskUserQuestionOptionIndex({
					questionOptionIndices,
					questionId: action.questionId,
					optionValue: action.optionValue
				});
				return optionIndex === void 0 ? [] : [{
					id: `question-${optionIndex}`,
					text: button.label,
					context: {
						[MATTERMOST_QUESTION_CONTEXT_KEY]: true,
						question_id: action.questionId,
						option_index: optionIndex
					},
					style: button.style
				}];
			}
			if (action) return [];
			const value = resolveMessagePresentationControlValue(button);
			return value ? [{
				id: value,
				text: button.label,
				callback_data: value,
				context: { callback_data: value },
				style: button.style
			}] : [];
		})).filter((row) => row.length > 0) : []
	};
}
function normalizeMattermostMessagingTarget(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return;
	const lower = normalizeLowercaseStringOrEmpty(trimmed);
	if (lower.startsWith("channel:")) {
		const id = trimmed.slice(8).trim();
		return id ? `channel:${id}` : void 0;
	}
	if (lower.startsWith("group:")) {
		const id = trimmed.slice(6).trim();
		return id ? `channel:${id}` : void 0;
	}
	if (lower.startsWith("user:")) {
		const id = trimmed.slice(5).trim();
		return id ? `user:${id}` : void 0;
	}
	if (lower.startsWith("mattermost:")) {
		const id = trimmed.slice(11).trim();
		return id ? `user:${id}` : void 0;
	}
	if (trimmed.startsWith("@")) {
		const id = trimmed.slice(1).trim();
		return id ? `@${id}` : void 0;
	}
	if (trimmed.startsWith("#")) return;
}
/**
* True when media must be uploaded as a file: any non-empty, non-http(s) value
* (e.g. a local workspace path) has no address the server can fetch, so the
* send must require a successful upload rather than degrade to caption text.
*/
function requiresMattermostMediaUpload(mediaUrl) {
	const trimmed = mediaUrl?.trim();
	return Boolean(trimmed && !/^https?:\/\//i.test(trimmed));
}
function looksLikeMattermostTargetId(raw, _normalized) {
	const trimmed = raw.trim();
	if (!trimmed) return false;
	if (/^(user|channel|group|mattermost):/i.test(trimmed)) return true;
	if (trimmed.startsWith("@")) return true;
	return /^[a-z0-9]{26}$/i.test(trimmed) || /^[a-z0-9]{26}__[a-z0-9]{26}$/i.test(trimmed);
}
//#endregion
export { resolveMattermostPresentation as a, listMattermostAccountIds as c, resolveMattermostReplyToMode as d, buildSecretInputSchema as f, requiresMattermostMediaUpload as i, resolveDefaultMattermostAccountId as l, normalizeMattermostMessagingTarget as n, inspectMattermostAccount as o, hasConfiguredSecretInput as p, parseMattermostQuestionContext as r, isMattermostConfigured as s, looksLikeMattermostTargetId as t, resolveMattermostAccount as u };
