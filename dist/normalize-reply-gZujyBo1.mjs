import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { c as stripLeadingSilentToken, i as isSilentReplyPayloadText, l as stripSilentToken, o as isSilentReplyText, r as isInternalFormattingArtifact, s as startsWithSilentToken } from "./tokens-BTKQYTUd.mjs";
import { o as hasReplyPayloadContent } from "./payload-COvcWceu.mjs";
import { T as setReplyPayloadMetadata, a as copyReplyPayloadMetadata, l as hasReplyPayloadSpeechContent, s as getReplyPayloadMetadata } from "./reply-payload-B2ZQhznY.mjs";
import { u as stripHeartbeatToken } from "./heartbeat-vWflpIwS.mjs";
import { i as sanitizeUserFacingText, n as renderUserFacingText } from "./user-facing-text-D8c_iKUB.mjs";
//#region src/auto-reply/reply/response-prefix-template.ts
const TEMPLATE_VAR_PATTERN = /\{([a-zA-Z][a-zA-Z0-9.]*)\}/g;
/**
* Interpolate template variables in a response prefix string.
*
* @param template - The template string with `{variable}` placeholders
* @param context - Context object with values for interpolation
* @returns The interpolated string, or undefined if template is undefined
*
* @example
* resolveResponsePrefixTemplate("[{model} | think:{thinkingLevel}]", {
*   model: "gpt-5.4",
*   thinkingLevel: "high"
* })
* // Returns: "[gpt-5.4 | think:high]"
*/
function resolveResponsePrefixTemplate(template, context) {
	if (!template) return;
	return template.replace(TEMPLATE_VAR_PATTERN, (match, varName) => {
		switch (normalizeLowercaseStringOrEmpty(varName)) {
			case "model": return context.model ?? match;
			case "modelfull": return context.modelFull ?? match;
			case "provider": return context.provider ?? match;
			case "thinkinglevel":
			case "think": return context.thinkingLevel ?? match;
			case "identity.name":
			case "identityname": return context.identityName ?? match;
			default: return match;
		}
	});
}
/**
* Extract short model name from a full model string.
*
* Strips:
* - Provider prefix (e.g., "openai/" from "openai/gpt-5.4")
* - Date suffixes (e.g., "-20260205" from "claude-opus-4-6-20260205")
* - Common version suffixes (e.g., "-latest")
*
* @example
* extractShortModelName("openai/gpt-6-astra") // "gpt-6-astra"
* extractShortModelName("claude-opus-4-6-20260205") // "claude-opus-4-6"
* extractShortModelName("gpt-5.4-latest") // "gpt-5.4"
*/
function extractShortModelName(fullModel) {
	const slash = fullModel.lastIndexOf("/");
	return (slash >= 0 ? fullModel.slice(slash + 1) : fullModel).replace(/-\d{8}$/, "").replace(/-latest$/, "");
}
//#endregion
//#region src/auto-reply/reply/normalize-reply.ts
const channelReplyTransformOwners = /* @__PURE__ */ new WeakMap();
function bindNormalizeReplyTransformOwner(transform, owner) {
	channelReplyTransformOwners.set(transform, owner);
	return transform;
}
function resolveNormalizeReplyTransformOwner(transform) {
	return transform ? channelReplyTransformOwners.get(transform) ?? transform : void 0;
}
function normalizeReplyPayloadOutcome(payload, opts = {}) {
	const suppress = (reason) => {
		opts.onSkip?.(reason);
		return {
			kind: "suppress",
			reason
		};
	};
	const applyChannelTransforms = opts.applyChannelTransforms ?? true;
	const hasContent = (text) => hasReplyPayloadContent({
		...payload,
		text
	}, { trimText: true });
	const trimmed = normalizeOptionalString(payload.text) ?? "";
	const hasSpeechContent = hasReplyPayloadSpeechContent(payload);
	if (!hasContent(trimmed) && !hasSpeechContent) return suppress("empty");
	let text = payload.text ?? void 0;
	if (!getReplyPayloadMetadata(payload)?.heartbeatReply) {
		const silentToken = opts.silentToken ?? "NO_REPLY";
		if (text && isSilentReplyPayloadText(text, silentToken)) {
			if (!hasContent("")) return suppress("silent");
			text = "";
		}
		if (text && !isSilentReplyText(text, silentToken)) {
			const hasLeadingSilentToken = startsWithSilentToken(text, silentToken);
			if (hasLeadingSilentToken) text = stripLeadingSilentToken(text, silentToken);
			if (hasLeadingSilentToken || text.toLowerCase().includes(silentToken.toLowerCase())) {
				text = stripSilentToken(text, silentToken);
				if (!hasContent(text)) return suppress("silent");
			}
		}
		if (text && !trimmed) text = "";
		if (text?.includes("HEARTBEAT_OK")) {
			const stripped = stripHeartbeatToken(text, { mode: "message" });
			if (stripped.didStrip) opts.onHeartbeatStrip?.();
			if (stripped.shouldSkip && !hasContent(stripped.text)) return suppress("heartbeat");
			text = stripped.text;
		}
		if (text && isInternalFormattingArtifact(text) && !hasContent("")) return suppress("silent");
		if (text) text = payload.isError ? renderUserFacingText(text, {
			errorContext: true,
			conversationContext: opts.conversationContext
		}) : sanitizeUserFacingText(text, { conversationContext: opts.conversationContext });
		if (!hasContent(text) && !hasSpeechContent) return suppress("empty");
	}
	let enrichedPayload = copyReplyPayloadMetadata(payload, {
		...payload,
		text
	});
	const channelTransformOwner = resolveNormalizeReplyTransformOwner(opts.transformReplyPayload);
	const transformAlreadyApplied = channelTransformOwner != null && getReplyPayloadMetadata(enrichedPayload)?.channelReplyTransformOwner === channelTransformOwner;
	if (applyChannelTransforms && opts.transformReplyPayload && !transformAlreadyApplied) {
		const transformedPayload = opts.transformReplyPayload(enrichedPayload);
		if (transformedPayload === null) return suppress("channel_transform");
		const copiedPayload = transformedPayload ? copyReplyPayloadMetadata(enrichedPayload, transformedPayload) : enrichedPayload;
		const appliedOwner = resolveNormalizeReplyTransformOwner(opts.transformReplyPayload);
		enrichedPayload = appliedOwner ? setReplyPayloadMetadata(copiedPayload, { channelReplyTransformOwner: appliedOwner }) : copiedPayload;
		text = enrichedPayload.text;
	}
	const effectivePrefix = opts.responsePrefixContext ? resolveResponsePrefixTemplate(opts.responsePrefix, opts.responsePrefixContext) : opts.responsePrefix;
	if (effectivePrefix && text && text.trim() !== "HEARTBEAT_OK" && !text.startsWith(effectivePrefix)) text = `${effectivePrefix} ${text}`;
	enrichedPayload = copyReplyPayloadMetadata(enrichedPayload, {
		...enrichedPayload,
		text
	});
	return {
		kind: "deliver",
		payload: enrichedPayload
	};
}
function normalizeReplyPayload(payload, opts = {}) {
	const outcome = normalizeReplyPayloadOutcome(payload, opts);
	return outcome.kind === "deliver" ? outcome.payload : null;
}
//#endregion
export { resolveResponsePrefixTemplate as a, extractShortModelName as i, normalizeReplyPayload as n, normalizeReplyPayloadOutcome as r, bindNormalizeReplyTransformOwner as t };
