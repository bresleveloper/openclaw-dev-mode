import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { a as isSilentReplyPayloadText, c as startsWithSilentToken, i as isInternalFormattingArtifact, l as stripLeadingSilentToken, s as isSilentReplyText, u as stripSilentToken } from "./tokens-D4ghQG_g.mjs";
import { o as hasReplyPayloadContent } from "./payload-DfZ7JVGs.mjs";
import { E as setReplyPayloadMetadata, c as getReplyPayloadMetadata, o as copyReplyPayloadMetadata, u as hasReplyPayloadSpeechContent } from "./reply-payload-NzglYOOT.mjs";
import { u as stripHeartbeatToken } from "./heartbeat-BjLIgeQc.mjs";
import { A as sanitizeUserFacingText, n as renderUserFacingText } from "./user-facing-text-DC1sCo4O.mjs";
//#region src/auto-reply/reply/response-prefix-template.ts
const TEMPLATE_VAR_PATTERN = /\{([a-zA-Z][a-zA-Z0-9.]*)\}/g;
/** Variable names are case-insensitive; unresolved placeholders remain literal. */
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
/** Strips the provider prefix, date suffix, and trailing -latest tag for display. */
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
