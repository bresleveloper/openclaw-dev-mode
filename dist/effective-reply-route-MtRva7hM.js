import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { i as formatErrorMessage } from "./errors-DCRXIYSQ.js";
import { t as isDiagnosticFlagEnabled } from "./diagnostic-flags-MzBWZWSC.js";
import { i as logVerbose } from "./globals-BWmHKFNH.js";
import { l as mimeTypeFromFilePath } from "./mime-C8mVE2Bw.js";
import { h as stringifyRouteThreadId } from "./channel-route-BhPKCG_0.js";
import "./message-channel-constants-Z0pS5ykd.js";
import { t as normalizeChatType } from "./chat-type-BARlA53h.js";
import { i as normalizeMessageChannel } from "./message-channel-normalize-DleKV4yQ.js";
import "./message-channel-B4LS2Kcc.js";
import { n as resolveAgentTurnAttachments } from "./agent-turn-attachments-DSSJmbqu.js";
//#region src/shared/silent-reply-policy.ts
const DEFAULT_SILENT_REPLY_POLICY = {
	direct: "disallow",
	group: "allow",
	internal: "allow"
};
/** Classifies a reply context for silent-reply policy from explicit type, session key, or surface. */
function classifySilentReplyConversationType(params) {
	if (params.conversationType) return params.conversationType;
	const normalizedSessionKey = normalizeLowercaseStringOrEmpty(params.sessionKey);
	if (normalizedSessionKey.includes(":group:") || normalizedSessionKey.includes(":channel:")) return "group";
	if (normalizedSessionKey.includes(":direct:") || normalizedSessionKey.includes(":dm:")) return "direct";
	if (normalizeLowercaseStringOrEmpty(params.surface) === "webchat") return "direct";
	return "internal";
}
/** Resolves silent-reply policy with surface overrides while keeping direct replies audible. */
function resolveSilentReplyPolicyFromPolicies(params) {
	if (params.conversationType === "direct") return "disallow";
	return params.surfacePolicy?.[params.conversationType] ?? params.defaultPolicy?.[params.conversationType] ?? DEFAULT_SILENT_REPLY_POLICY[params.conversationType];
}
//#endregion
//#region src/config/silent-reply.ts
function resolveSilentReplyConversationContext(params) {
	const conversationType = classifySilentReplyConversationType({
		sessionKey: params.sessionKey,
		surface: params.surface,
		conversationType: params.conversationType
	});
	const normalizedSurface = normalizeLowercaseStringOrEmpty(params.surface);
	const surface = normalizedSurface ? params.cfg?.surfaces?.[normalizedSurface] : void 0;
	return {
		conversationType,
		defaultPolicy: params.cfg?.agents?.defaults?.silentReply,
		surfacePolicy: surface?.silentReply
	};
}
/** Resolves the effective silent-reply settings for a routed conversation. */
function resolveSilentReplySettings(params) {
	return { policy: resolveSilentReplyPolicyFromPolicies(resolveSilentReplyConversationContext(params)) };
}
/** Returns just the effective silent-reply policy for callers that do not need metadata. */
function resolveSilentReplyPolicy(params) {
	return resolveSilentReplySettings(params).policy;
}
//#endregion
//#region src/auto-reply/reply/current-turn-images.ts
function isGenericMediaType(mediaType) {
	if (!mediaType) return true;
	const normalized = mediaType.split(";")[0]?.trim().toLowerCase();
	return normalized === "application/octet-stream" || normalized === "binary/octet-stream";
}
/** Resolves image media types from current-turn attachment metadata or filenames. */
function resolveCurrentImageMediaType(pathValue, mediaType) {
	const mediaPath = normalizeOptionalString(pathValue);
	if (!mediaPath) return;
	const normalizedMediaType = normalizeOptionalString(mediaType);
	if (normalizedMediaType?.startsWith("image/")) return normalizedMediaType;
	if (!isGenericMediaType(normalizedMediaType)) return;
	const inferredType = mimeTypeFromFilePath(mediaPath);
	return inferredType?.startsWith("image/") ? inferredType : void 0;
}
function collectCurrentImageAttachments(ctx) {
	const pathsFromArray = Array.isArray(ctx.MediaPaths) ? ctx.MediaPaths : void 0;
	const paths = pathsFromArray && pathsFromArray.length > 0 ? pathsFromArray : normalizeOptionalString(ctx.MediaPath) ? [ctx.MediaPath] : [];
	if (paths.length === 0) return [];
	const types = Array.isArray(ctx.MediaTypes) && ctx.MediaTypes.length === paths.length ? ctx.MediaTypes : void 0;
	const attachments = [];
	for (const [index, pathValue] of paths.entries()) {
		const mediaPath = normalizeOptionalString(pathValue);
		const mediaType = resolveCurrentImageMediaType(pathValue, types?.[index] ?? ctx.MediaType);
		if (mediaPath && mediaType) attachments.push({
			index,
			path: mediaPath,
			mediaType
		});
	}
	return attachments;
}
function collectDescribedImageAttachmentIndexes(ctx) {
	return new Set(ctx.MediaUnderstanding?.filter((output) => output.kind === "image.description").map((output) => output.attachmentIndex) ?? []);
}
function createUndescribedImageContext(ctx, undescribedAttachments) {
	const first = undescribedAttachments[0];
	return {
		...ctx,
		MediaPath: first?.path,
		MediaType: first?.mediaType,
		MediaPaths: undescribedAttachments.map((attachment) => attachment.path),
		MediaTypes: undescribedAttachments.map((attachment) => attachment.mediaType)
	};
}
/** Resolves current-turn image attachments that were not already described by media understanding. */
async function resolveCurrentTurnImages(params) {
	if (Array.isArray(params.images) && params.images.length > 0) return {
		images: params.images,
		imageOrder: params.imageOrder
	};
	const currentImageAttachments = collectCurrentImageAttachments(params.ctx);
	if (currentImageAttachments.length === 0) return {
		images: params.images,
		imageOrder: params.imageOrder
	};
	const describedImageIndexes = collectDescribedImageAttachmentIndexes(params.ctx);
	const undescribedImageAttachments = currentImageAttachments.filter((attachment) => !describedImageIndexes.has(attachment.index));
	if (undescribedImageAttachments.length === 0) return {
		images: params.images,
		imageOrder: params.imageOrder
	};
	try {
		const images = (await resolveAgentTurnAttachments({
			ctx: createUndescribedImageContext(params.ctx, undescribedImageAttachments),
			cfg: params.cfg,
			includeRecentHistoryImages: false
		})).attachments.map((attachment) => ({
			type: "image",
			data: attachment.data,
			mimeType: attachment.mediaType
		}));
		if (images.length < undescribedImageAttachments.length) {
			logVerbose(`agent-runner: native OpenClaw media resolution produced ${images.length}/${undescribedImageAttachments.length} current image attachment(s); falling back to prompt image refs`);
			return {
				images: params.images,
				imageOrder: params.imageOrder
			};
		}
		return images.length > 0 ? {
			images,
			imageOrder: images.map(() => "inline")
		} : {
			images: params.images,
			imageOrder: params.imageOrder
		};
	} catch (error) {
		logVerbose(`agent-runner: media attachment image resolution failed, proceeding without native images: ${formatErrorMessage(error)}`);
		return {
			images: params.images,
			imageOrder: params.imageOrder
		};
	}
}
//#endregion
//#region src/auto-reply/reply/reply-timing-tracker.ts
const DEFAULT_TIMING_WARN_TOTAL_MS = 1e3;
const DEFAULT_TIMING_WARN_STAGE_MS = 500;
/** Checks config/env diagnostic flags for reply profiling. */
function isReplyProfilerEnabled(params) {
	const cfg = params?.config;
	const env = params?.env ?? process.env;
	return isDiagnosticFlagEnabled("profiler", cfg, env) || isDiagnosticFlagEnabled("reply.profiler", cfg, env);
}
/** Creates a lightweight timing tracker for slow reply-stage diagnostics. */
function createReplyTimingTracker(params) {
	if (!(params.enabled ?? isReplyProfilerEnabled({
		config: params.config,
		env: params.env
	}))) return {
		async measure(_name, run) {
			return await run();
		},
		measureSync(_name, run) {
			return run();
		},
		logIfSlow() {}
	};
	const startedAt = Date.now();
	const spans = [];
	let didLog = false;
	const totalWarnMs = params.totalWarnMs ?? DEFAULT_TIMING_WARN_TOTAL_MS;
	const stageWarnMs = params.stageWarnMs ?? DEFAULT_TIMING_WARN_STAGE_MS;
	const toMs = (value) => Math.max(0, Math.round(value));
	const record = (name, spanStartedAt) => {
		spans.push({
			name,
			durationMs: toMs(Date.now() - spanStartedAt),
			elapsedMs: toMs(Date.now() - startedAt)
		});
	};
	const snapshot = () => ({
		totalMs: toMs(Date.now() - startedAt),
		spans: spans.slice()
	});
	const shouldLog = (summary) => summary.totalMs >= totalWarnMs || summary.spans.some((span) => span.durationMs >= stageWarnMs);
	const formatSpans = (summary) => summary.spans.length > 0 ? summary.spans.map((span) => `${span.name}:${span.durationMs}ms@${span.elapsedMs}ms`).join(",") : "none";
	return {
		async measure(name, run) {
			const spanStartedAt = Date.now();
			try {
				return await run();
			} finally {
				record(name, spanStartedAt);
			}
		},
		measureSync(name, run) {
			const spanStartedAt = Date.now();
			try {
				return run();
			} finally {
				record(name, spanStartedAt);
			}
		},
		logIfSlow(logParams) {
			if (didLog) return;
			const summary = snapshot();
			if (!shouldLog(summary)) return;
			didLog = true;
			const suffix = [
				`totalMs=${summary.totalMs}`,
				`stages=${formatSpans(summary)}`,
				logParams.outcome ? `outcome=${logParams.outcome}` : void 0,
				logParams.reason ? `reason=${logParams.reason}` : void 0,
				logParams.error ? `error="${logParams.error}"` : void 0
			].filter(Boolean).join(" ");
			params.log.warn(`${logParams.message} ${suffix}`, {
				...logParams.details,
				outcome: logParams.outcome,
				reason: logParams.reason,
				error: logParams.error,
				totalMs: summary.totalMs,
				spans: summary.spans
			});
		}
	};
}
//#endregion
//#region src/auto-reply/reply/effective-reply-route.ts
/** Resolves the effective reply route from current context and persisted session route. */
/** Returns true for synthetic providers that should not define a user channel route. */
function isSystemEventProvider(provider) {
	return provider === "heartbeat" || provider === "cron-event" || provider === "exec-event";
}
function isSessionsSendInterSessionHandoff(inputProvenance) {
	return inputProvenance?.kind === "inter_session" && inputProvenance.sourceTool?.toLowerCase() === "sessions_send";
}
function resolveTrustedInheritedThreadId(entry) {
	const deliveryThreadId = entry?.deliveryContext?.threadId;
	if (deliveryThreadId == null) return;
	const routeThread = entry?.route?.thread;
	if (routeThread?.id != null && (routeThread.source === "explicit" || routeThread.source === "target" || routeThread.source === "turn") && stringifyRouteThreadId(routeThread.id) === stringifyRouteThreadId(deliveryThreadId)) return deliveryThreadId;
}
/** Resolves current, inherited, or persisted reply route for a session turn. */
function resolveEffectiveReplyRoute(params) {
	const currentSurface = normalizeMessageChannel(params.ctx.Provider) ?? normalizeMessageChannel(params.ctx.Surface) ?? normalizeMessageChannel(params.ctx.OriginatingChannel);
	const persistedDeliveryContext = params.entry?.deliveryContext;
	const persistedDeliveryChannel = normalizeMessageChannel(persistedDeliveryContext?.channel);
	const liveChatType = normalizeChatType(params.ctx.ChatType);
	const persistedChatType = params.entry?.route?.target?.chatType ?? params.entry?.chatType ?? normalizeChatType(params.entry?.origin?.chatType);
	if (isSessionsSendInterSessionHandoff(params.ctx.InputProvenance) && currentSurface === "webchat" && persistedDeliveryChannel && persistedDeliveryChannel !== "webchat" && persistedDeliveryContext?.to) {
		const inheritedThreadId = resolveTrustedInheritedThreadId(params.entry);
		return {
			channel: persistedDeliveryChannel,
			to: persistedDeliveryContext.to,
			accountId: persistedDeliveryContext.accountId,
			...inheritedThreadId !== void 0 ? { threadId: inheritedThreadId } : {},
			...persistedChatType ? { chatType: persistedChatType } : {},
			inheritedExternalRoute: true
		};
	}
	if (!isSystemEventProvider(params.ctx.Provider)) return {
		channel: params.ctx.OriginatingChannel,
		to: params.ctx.OriginatingTo,
		accountId: params.ctx.AccountId,
		...liveChatType ? { chatType: liveChatType } : {}
	};
	const persistedChannel = persistedDeliveryContext?.channel ?? params.entry?.lastChannel;
	const liveChannel = params.ctx.OriginatingChannel;
	const canInheritPersistedTuple = !liveChannel || normalizeMessageChannel(liveChannel) === normalizeMessageChannel(persistedChannel);
	const chatType = liveChatType ?? (canInheritPersistedTuple ? persistedChatType : void 0);
	return {
		channel: liveChannel ?? persistedChannel,
		to: params.ctx.OriginatingTo ?? (canInheritPersistedTuple ? persistedDeliveryContext?.to ?? params.entry?.lastTo : void 0),
		accountId: params.ctx.AccountId ?? (canInheritPersistedTuple ? persistedDeliveryContext?.accountId ?? params.entry?.lastAccountId : void 0),
		...chatType ? { chatType } : {}
	};
}
//#endregion
export { resolveCurrentTurnImages as a, resolveSilentReplyPolicyFromPolicies as c, isReplyProfilerEnabled as i, resolveEffectiveReplyRoute as n, resolveSilentReplyPolicy as o, createReplyTimingTracker as r, resolveSilentReplySettings as s, isSystemEventProvider as t };
