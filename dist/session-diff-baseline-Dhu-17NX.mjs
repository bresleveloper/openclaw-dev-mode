import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { r as resolveGlobalMap } from "./global-singleton-0m-JziJW.mjs";
import { i as getOrCreatePromise, t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { i as normalizeChatChannelId } from "./ids-BFfFS5ep.mjs";
import { a as findChatChannelMeta } from "./registry-B3Y-vjit.mjs";
import { i as getLoadedChannelPluginForRead } from "./registry-loaded-BugfxX6l.mjs";
import { a as isInternalMessageChannel } from "./message-channel-j-k-Nup3.mjs";
import { i as logVerbose } from "./globals-BXbZ1A_g.mjs";
import { a as SessionWorkStartChangedError, c as isSessionWorkStartInvalidatedError, o as SessionWorkStartInvalidatedError } from "./work-start-error-Dh9d0ImY.mjs";
import { o as loadSessionEntryReadOnly, s as patchSessionEntryCore } from "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import "./session-accessor-CQ-g9yb2.mjs";
import { o as resolveSessionWorkStartError } from "./lifecycle-DdaXH8bC.mjs";
import { n as resolveChannelGroupRequireMention } from "./group-policy-BJ7vM7Bm.mjs";
import { t as normalizeGroupActivation } from "./group-activation-C9UsJ0Nq.mjs";
import { t as createSessionDiffBaselineCaptureClaim } from "./session-diff-baseline-capture-6ejBT0Am.mjs";
//#region src/auto-reply/reply/groups.ts
/** Group/direct chat prompt context, activation, and silent-reply helpers. */
const groupsRuntimeLoader = createLazyImportLoader(() => import("./groups.runtime.js"));
async function resolveRuntimeChannelId(raw) {
	const normalized = normalizeOptionalLowercaseString(raw);
	if (!normalized) return null;
	const { getChannelPlugin, normalizeChannelId } = await groupsRuntimeLoader.load();
	try {
		if (getChannelPlugin(normalized)) return normalized;
	} catch {}
	try {
		return normalizeChannelId(raw) ?? normalized;
	} catch {
		return normalized;
	}
}
/** Resolves whether a group/channel turn requires an explicit mention. */
async function resolveGroupRequireMention(params) {
	const { cfg, group } = params;
	const channel = await resolveRuntimeChannelId(group.channel);
	if (!channel) return true;
	const { groupId, groupChannel, groupSpace, accountId } = group;
	let requireMention;
	const runtime = await groupsRuntimeLoader.load();
	try {
		requireMention = runtime.getChannelPlugin(channel)?.groups?.resolveRequireMention?.({
			cfg,
			groupId,
			groupChannel,
			groupSpace,
			accountId
		});
	} catch {
		requireMention = void 0;
	}
	if (typeof requireMention === "boolean") return requireMention;
	return resolveChannelGroupRequireMention({
		cfg,
		channel,
		groupId,
		accountId
	});
}
/** Converts requireMention into the default prompt activation label. */
function defaultGroupActivation(requireMention) {
	return !requireMention ? "always" : "mention";
}
function resolveProviderLabel(rawProvider) {
	const providerKey = normalizeOptionalLowercaseString(rawProvider) ?? "";
	if (!providerKey) return "chat";
	if (isInternalMessageChannel(providerKey)) return "WebChat";
	const channelId = normalizeChatChannelId(providerKey);
	const label = channelId ? findChatChannelMeta(channelId)?.label : void 0;
	if (label) return label;
	return `${providerKey.at(0)?.toUpperCase() ?? ""}${providerKey.slice(1)}`;
}
function resolveSharedChatNoun(chatType) {
	return normalizeOptionalLowercaseString(chatType) === "channel" ? "channel" : "group chat";
}
/**
* Builds trusted group/channel delivery guidance.
*
* Room names, members, and history are rendered separately as untrusted inbound
* context. Legacy automatic delivery posts text final replies directly, but
* files/images/attachments still need message(action=send).
*/
function buildGroupChatContext(params) {
	const providerLabel = resolveProviderLabel(params.sessionCtx.Provider);
	const provider = normalizeOptionalLowercaseString(params.sessionCtx.Provider);
	const messageToolOnly = params.sourceReplyDeliveryMode === "message_tool_only";
	const sharedChatNoun = resolveSharedChatNoun(params.sessionCtx.ChatType);
	const destinationLabel = sharedChatNoun === "channel" ? "this channel" : "this group chat";
	const lines = [];
	lines.push(`You are in a ${providerLabel} ${sharedChatNoun}.`);
	if (messageToolOnly) lines.push(`Normal final replies are private and are not automatically sent to ${destinationLabel}. To post visible output here, use the message tool with action=send; the target defaults to ${destinationLabel}.`);
	else lines.push(`Your text replies are automatically sent to ${destinationLabel} unless the current-turn context says final replies stay private. For ordinary text, do not use the message tool to send to this same destination unless the current-turn context asks for visible output via message(action=send). Use message(action=send) only when you need to send files, images, or other attachments to this same ${sharedChatNoun === "channel" ? "channel/thread" : "group/topic"}.`);
	lines.push("Be a good group participant: mostly lurk and follow the conversation; reply only when directly addressed or you can add clear value. Emoji reactions are welcome when available.");
	const channelId = normalizeChatChannelId(provider) ?? provider ?? "";
	const tableMode = getLoadedChannelPluginForRead(channelId)?.messaging?.defaultMarkdownTableMode;
	const tableGuidance = tableMode === "block" || tableMode === "off" ? "" : " Avoid Markdown tables.";
	lines.push(`Write like a human.${tableGuidance} Minimize empty lines and use normal chat conventions, not document-style spacing. Don't type literal \\n sequences; use real line breaks sparingly.`);
	lines.push("If addressed to someone else, stay silent unless invited or correcting key facts.");
	if (provider === "discord") lines.push("Discord: wrap bare URLs like <https://example.com> to suppress embeds.");
	lines.push("When subagent or session-spawn tools are available and a directly requested group-chat task will require several tool calls, prefer delegating bounded side investigations early so the channel gets a responsive path forward. Keep the critical path local, avoid subagents for simple one-step work, and only surface concise group-visible updates when they add value.");
	const canUseSilentReply = !messageToolOnly && params.silentToken && params.silentReplyPolicy !== "disallow";
	if (messageToolOnly) lines.push(`If no visible ${sharedChatNoun === "channel" ? "channel" : "group"} response is needed, do not call message(action=send).`);
	if (canUseSilentReply) lines.push(`If no text reply is needed, including after a reaction or other action, reply with exactly "${params.silentToken}" as the entire final answer, without commentary, punctuation, or formatting.`);
	return lines.join(" ");
}
/** Builds system prompt context for direct conversations. */
function buildDirectChatContext(params) {
	const providerLabel = resolveProviderLabel(params.sessionCtx.Provider);
	const messageToolOnly = params.sourceReplyDeliveryMode === "message_tool_only";
	const lines = [];
	lines.push(`You are in a ${providerLabel} direct conversation.`);
	if (messageToolOnly) {
		lines.push("Normal final replies are private and are not automatically sent to this conversation. To post visible output here, use the message tool with action=send; the target defaults to this conversation.");
		lines.push("If no visible direct response is needed, do not call message(action=send). Your normal final answer stays private and will not be posted to the conversation.");
		return lines.join(" ");
	}
	lines.push("Your replies are automatically sent to this conversation unless the current-turn context says final replies stay private.");
	return lines.join(" ");
}
/** Selects the conversation guidance shared by incoming and continuation turns. */
function buildSourceConversationContext(params) {
	const chatType = normalizeOptionalLowercaseString(params.sessionCtx.ChatType);
	return chatType === "direct" || chatType === "dm" ? buildDirectChatContext(params) : chatType === "group" || chatType === "channel" ? buildGroupChatContext(params) : "";
}
/** Builds the channel-specific group intro injected into the system prompt. */
function buildGroupIntro(params) {
	if ((normalizeGroupActivation(params.activation) ?? params.defaultActivation) === "always") return "Activation: always-on (you receive every group message). You see every message; most need no response. When you do reply, address the specific sender noted in the message context.";
	return "Activation: trigger-only (you are invoked only when explicitly mentioned; recent context may be included). Address the specific sender noted in the message context.";
}
//#endregion
//#region src/sessions/session-diff-baseline.ts
const captureInFlight = resolveGlobalMap(Symbol.for("openclaw.sessionDiffBaselineCaptureInFlight"), async (captures) => {
	await Promise.allSettled(captures.values());
	captures.clear();
});
function matchingCapture(entry) {
	const capture = entry.sessionDiffBaselineCapture;
	return capture?.version === 1 ? capture : void 0;
}
function invalidatedSessionWork(params) {
	return new SessionWorkStartChangedError(resolveSessionWorkStartError(params.sessionKey, params.entry, { expectedSessionId: params.expectedSessionId }) ?? `Session "${params.sessionKey}" changed while starting work. Retry.`);
}
function requireAuthoritativeGeneration(params) {
	if (!params.entry || params.entry.sessionId !== params.expectedSessionId || params.entry.lifecycleRevision !== params.expectedLifecycleRevision) throw invalidatedSessionWork(params);
	return params.entry;
}
function loadAuthoritativeGeneration(params) {
	let entry;
	try {
		entry = loadSessionEntryReadOnly({
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		});
	} catch (error) {
		logVerbose(`session diff baseline generation read failed for ${params.sessionKey}: ${formatErrorMessage(error)}`);
		throw new SessionWorkStartInvalidatedError(`Session "${params.sessionKey}" could not verify its diff baseline before starting work. Retry.`);
	}
	return requireAuthoritativeGeneration({
		entry,
		...params
	});
}
async function persistCaptureResult(params) {
	const authoritative = requireAuthoritativeGeneration({
		entry: await patchSessionEntryCore({
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		}, (current) => {
			const currentCapture = matchingCapture(current);
			if (current.sessionId !== params.sessionId || current.lifecycleRevision !== params.expectedLifecycleRevision || currentCapture?.captureId !== params.capture.captureId || currentCapture.status !== "pending") return null;
			return params.baseline ? {
				sessionDiffBaseline: params.baseline,
				sessionDiffBaselineCapture: void 0
			} : { sessionDiffBaselineCapture: {
				...params.capture,
				status: "unavailable"
			} };
		}, {
			preserveActivity: true,
			skipMaintenance: true
		}).catch((error) => {
			if (isSessionWorkStartInvalidatedError(error)) throw error;
			logVerbose(`session diff baseline settlement failed for ${params.sessionKey}: ${formatErrorMessage(error)}`);
			throw new SessionWorkStartInvalidatedError(`Session "${params.sessionKey}" could not persist its diff baseline before starting work. Retry.`);
		}),
		expectedLifecycleRevision: params.expectedLifecycleRevision,
		expectedSessionId: params.sessionId,
		sessionKey: params.sessionKey
	});
	if (authoritative.sessionDiffBaseline?.sessionId === params.sessionId) return authoritative;
	const authoritativeCapture = matchingCapture(authoritative);
	if (authoritativeCapture?.captureId === params.capture.captureId && authoritativeCapture.status === "unavailable") return authoritative;
	throw invalidatedSessionWork({
		entry: authoritative,
		expectedSessionId: params.sessionId,
		sessionKey: params.sessionKey
	});
}
async function settleCapture(params) {
	let baseline;
	try {
		const { captureSessionDiffBaseline } = await import("./session-diff-BsFMeMIt.mjs");
		baseline = await captureSessionDiffBaseline({
			cwd: params.cwd,
			sessionId: params.sessionId
		});
	} catch (error) {
		if (isSessionWorkStartInvalidatedError(error)) throw error;
		const entry = await persistCaptureResult(params);
		logVerbose(`session diff baseline capture failed; continuing without attribution filtering: ${formatErrorMessage(error)}`);
		return entry;
	}
	return await persistCaptureResult({
		...params,
		baseline
	});
}
async function ensureSessionDiffBaseline(params) {
	if (params.entry.execNode) return params.entry;
	let entry = loadAuthoritativeGeneration({
		agentId: params.agentId,
		expectedLifecycleRevision: params.entry.lifecycleRevision,
		expectedSessionId: params.entry.sessionId,
		sessionKey: params.sessionKey,
		storePath: params.storePath
	});
	if (entry.sessionDiffBaseline?.sessionId === entry.sessionId || matchingCapture(entry)?.status === "unavailable") return entry;
	let capture = matchingCapture(entry);
	if (!capture) {
		if (!params.isNewSession || entry.createdVia !== "operator") return entry;
		const expectedSessionId = entry.sessionId;
		const expectedLifecycleRevision = entry.lifecycleRevision;
		const pending = createSessionDiffBaselineCaptureClaim();
		entry = requireAuthoritativeGeneration({
			entry: await patchSessionEntryCore({
				agentId: params.agentId,
				sessionKey: params.sessionKey,
				storePath: params.storePath
			}, (current) => {
				if (current.sessionId !== expectedSessionId || current.lifecycleRevision !== expectedLifecycleRevision || current.sessionDiffBaseline?.sessionId === current.sessionId || matchingCapture(current)) return null;
				return { sessionDiffBaselineCapture: pending };
			}, {
				preserveActivity: true,
				skipMaintenance: true
			}),
			expectedLifecycleRevision,
			expectedSessionId,
			sessionKey: params.sessionKey
		});
		if (entry.sessionDiffBaseline?.sessionId === entry.sessionId) return entry;
		capture = matchingCapture(entry);
	}
	if (!capture || capture.status === "unavailable") return entry;
	return await getOrCreatePromise(captureInFlight, capture.captureId, () => settleCapture({
		...params,
		capture,
		expectedLifecycleRevision: entry.lifecycleRevision,
		sessionId: entry.sessionId
	}), { evictOnSettled: true });
}
//#endregion
export { resolveGroupRequireMention as a, defaultGroupActivation as i, buildGroupIntro as n, buildSourceConversationContext as r, ensureSessionDiffBaseline as t };
