import { c as trackAsyncWork, r as getAsyncWorkSignal } from "./async-work-scope-CWk2dk1h.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { k as withTimeout } from "./fs-safe-BAPek8At.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { i as stripInboundMetadata } from "./strip-inbound-meta-Cqak81y4.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.mjs";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-CTuYDtny.mjs";
import { i as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-DmCrQjUt.mjs";
import { r as isValidBase64 } from "./base64-B5EyWEOm.mjs";
import { d as patchSessionEntryCore, s as loadSessionEntry } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { a as resolveStoredSessionKeyForAgentStore } from "./session-store-key-BoleEY7N.mjs";
import { n as resolveSessionModelRef } from "./session-model-ref-Z1HiwFXK.mjs";
import { t as createCrustaceanSlug } from "./session-slug-CfIG4XbR.mjs";
import { i as resolveUtilityModelRefForAgent } from "./utility-model-DZ4XRwmc.mjs";
import { t as readSessionTitleFieldsFromTranscript } from "./session-transcript-title-reader-Kt2tmG67.mjs";
import { t as runWithAsyncWorkResources } from "./async-work-resources-CUDFzL8J.mjs";
import { n as resolveExplicitSessionName, r as sessionTitleRequests, t as hasExplicitSessionName } from "./session-title-state-BQCPqYS_.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/gateway/dashboard-session-title.ts
const DASHBOARD_SESSION_TITLE_MAX_CHARS = 60;
const DASHBOARD_SESSION_TITLE_SOURCE_MAX_CHARS = 1e3;
const WORKTREE_SESSION_TITLE_WAIT_MS = 3e4;
const DASHBOARD_SESSION_TITLE_PROMPT = "Generate a concise session title (3-6 words, max 60 characters) from the user's first message. Use the same language as the message, in sentence case: capitalize only the first word and words that language always capitalizes. No emoji. Return only the title.";
function decodeTextAttachmentPrefix(attachment, maxChars) {
	const mimeType = attachment.mimeType?.trim().toLowerCase();
	const content = attachment.content;
	if (!mimeType?.startsWith("text/") || typeof content !== "string" || !content) return null;
	if (!isValidBase64(content)) return null;
	const maxBase64Chars = Math.ceil((maxChars * 3 + 3) / 3) * 4;
	const truncated = content.length > maxBase64Chars;
	const prefixLength = truncated ? maxBase64Chars : content.length;
	const prefix = content.slice(0, prefixLength);
	const bytes = Buffer.from(prefix, "base64");
	try {
		return new TextDecoder("utf-8", { fatal: true }).decode(bytes, { stream: truncated });
	} catch {
		return null;
	}
}
/** Builds the bounded model source shared by dashboard and worktree titles. */
function buildDashboardSessionTitleSource(params) {
	const visibleMessage = params.message.trim();
	const slashCommand = visibleMessage.startsWith("/");
	let source = slashCommand ? "" : visibleMessage;
	for (const attachment of params.attachments ?? []) {
		const separatorLength = source ? 1 : 0;
		const remaining = DASHBOARD_SESSION_TITLE_SOURCE_MAX_CHARS - source.length - separatorLength;
		if (remaining <= 0) break;
		const text = decodeTextAttachmentPrefix(attachment, remaining)?.trim();
		if (!text) continue;
		source += `${source ? "\n" : ""}${truncateUtf16Safe(text, remaining)}`;
	}
	if (!source && slashCommand) return truncateUtf16Safe(visibleMessage, DASHBOARD_SESSION_TITLE_SOURCE_MAX_CHARS);
	return truncateUtf16Safe(source.trim(), DASHBOARD_SESSION_TITLE_SOURCE_MAX_CHARS);
}
function isAutoTitleSessionKey(sessionKey) {
	const rest = parseAgentSessionKey(sessionKey)?.rest ?? "";
	return rest.startsWith("dashboard:") || rest.startsWith("ios-") || rest.startsWith("node-");
}
/** True when this interactive chat key should receive an automatic topic title. */
function isDashboardSessionTitleCandidate(params) {
	const sourceText = params.userMessage.trim();
	return Boolean(sourceText && !sourceText.startsWith("/") && isAutoTitleSessionKey(params.sessionKey));
}
function resolveDashboardTitleAuthProfile(params) {
	const sessionProfile = params.entry?.authProfileOverride?.trim();
	if (sessionProfile) return sessionProfile;
	const configuredRef = resolveAgentEffectiveModelPrimary(params.cfg, params.agentId)?.trim();
	const configuredProfile = configuredRef ? splitTrailingAuthProfile(configuredRef).profile : void 0;
	if (!configuredProfile) return;
	return resolveSessionModelRef(params.cfg, void 0, params.agentId).provider === params.regularProvider ? configuredProfile : void 0;
}
function normalizeDashboardSessionTitle(raw) {
	const firstLine = raw.replace(/\r/g, "").split("\n").map((line) => line.trim()).find((line) => line && !line.startsWith("```"));
	if (!firstLine) return null;
	const normalized = firstLine.replace(/^\s*(?:title\s*:\s*)?/i, "").replace(/^["'`]+|["'`]+$/g, "").replace(/\s+/g, " ").trim();
	return normalized ? truncateUtf16Safe(normalized, DASHBOARD_SESSION_TITLE_MAX_CHARS) : null;
}
async function generateDashboardSessionTitle(params) {
	const sourceText = buildDashboardSessionTitleSource({ message: params.userMessage });
	if (!sourceText || sourceText.startsWith("/")) return null;
	const regularModel = resolveSessionModelRef(params.cfg, params.entry, params.agentId);
	const agentHarnessRuntimeOverride = resolveSessionRuntimeOverrideForProvider({
		provider: regularModel.provider,
		entry: params.entry,
		cfg: params.cfg
	});
	const preferredProfile = resolveDashboardTitleAuthProfile({
		cfg: params.cfg,
		agentId: params.agentId,
		entry: params.entry,
		regularProvider: regularModel.provider
	});
	const regularModelRef = `${regularModel.provider}/${regularModel.model}${preferredProfile ? `@${preferredProfile}` : ""}`;
	const utilityModelRef = resolveUtilityModelRefForAgent({
		cfg: params.cfg,
		agentId: params.agentId,
		primaryProvider: regularModel.provider,
		primaryModelRef: regularModelRef
	});
	try {
		const { generateConversationLabelWithFallback } = await import("./conversation-label-generator-2aGizIKL.mjs");
		params.assertCurrent?.();
		params.abortSignal?.throwIfAborted();
		const generated = await generateConversationLabelWithFallback({
			userMessage: sourceText,
			prompt: DASHBOARD_SESSION_TITLE_PROMPT,
			cfg: params.cfg,
			agentId: params.agentId,
			...agentHarnessRuntimeOverride ? { agentHarnessRuntimeOverride } : {},
			...utilityModelRef ? { utilityModelRef } : {},
			regularModelRef,
			...preferredProfile ? { preferredProfile } : {},
			normalizeLabel: normalizeDashboardSessionTitle,
			maxLength: DASHBOARD_SESSION_TITLE_MAX_CHARS,
			abortSignal: params.abortSignal,
			assertCurrent: params.assertCurrent,
			...params.utilityOnly ? { utilityOnly: true } : {}
		});
		if (generated) return normalizeDashboardSessionTitle(generated);
	} catch {
		params.assertCurrent?.();
		params.abortSignal?.throwIfAborted();
	}
	if (params.utilityOnly) return null;
	return createCrustaceanSlug();
}
/** Prepares a creation draft's title without creating or updating a session. */
async function prepareDashboardSessionTitle(params) {
	try {
		return await generateDashboardSessionTitle({
			...params,
			utilityOnly: true
		});
	} catch {
		params.assertCurrent?.();
		params.abortSignal?.throwIfAborted();
		return null;
	}
}
/** Worktree callers bound their own wait without cancelling another naming owner's request. */
async function generateWorktreeSessionTitle(params) {
	const request = maybeGenerateSessionTitle(params).then((persisted) => {
		if (persisted) params.onPersisted();
	});
	try {
		await withTimeout(request, WORKTREE_SESSION_TITLE_WAIT_MS, "worktree title generation");
	} catch (error) {
		params.onError(error);
	}
	const readCurrent = (assertSourceCurrent) => {
		params.commitGuard?.();
		assertSourceCurrent?.();
		const current = loadSessionEntry({
			agentId: params.agentId,
			sessionKey: resolveStoredSessionKeyForAgentStore(params),
			storePath: params.storePath
		});
		if (current?.sessionId !== params.sessionId) throw new Error("Session changed while naming its worktree; retry from the current session.");
		return resolveExplicitSessionName(current);
	};
	return params.withSource ? await params.withSource((source) => readCurrent(source.assertCurrent)) : readCurrent();
}
async function maybeGenerateDashboardSessionTitle(params) {
	return isDashboardSessionTitleCandidate(params) && await maybeGenerateSessionTitle({
		...params,
		retryFailedJoin: true
	});
}
/** Joins existing work; only the caller that persists a title returns true. */
async function maybeGenerateSessionTitle(params) {
	const sessionKey = resolveStoredSessionKeyForAgentStore(params);
	const scope = {
		agentId: params.agentId,
		sessionKey,
		storePath: params.storePath
	};
	const entry = loadSessionEntry(scope);
	if (hasExplicitSessionName(entry) || entry?.sessionId !== params.sessionId) return false;
	const requestTarget = {
		...scope,
		sessionId: params.sessionId
	};
	const existing = sessionTitleRequests.get(requestTarget);
	if (existing) return !await (params.retryFailedJoin ? existing.catch(() => false) : existing) && params.retryFailedJoin ? await maybeGenerateSessionTitle({
		...params,
		retryFailedJoin: false
	}) : false;
	const transcriptSource = readSessionTitleFieldsFromTranscript({
		agentId: params.agentId,
		sessionEntry: entry,
		sessionId: params.sessionId,
		sessionKey,
		storePath: params.storePath
	}).firstUserMessage;
	const transcriptText = transcriptSource ? stripInboundMetadata(transcriptSource).trim() : "";
	const currentText = params.currentUserMessage?.trim() ?? "";
	const sourceText = entry.pendingWorktree?.titleSource?.trim() ?? (!transcriptText || currentText && currentText === transcriptText ? params.userMessage.trim() : transcriptText);
	if (!sourceText) return false;
	const generate = (abortSignal) => generateDashboardSessionTitle({
		cfg: params.cfg,
		agentId: params.agentId,
		entry: params.entry ?? entry,
		userMessage: sourceText,
		...abortSignal ? { abortSignal } : {}
	});
	const finish = async (generation) => {
		const displayName = await generation;
		if (!displayName) return false;
		const persist = async (assertSourceCurrent) => {
			const assertCommitAllowed = assertSourceCurrent ? () => {
				params.commitGuard?.();
				assertSourceCurrent();
			} : params.commitGuard;
			if (assertSourceCurrent) assertCommitAllowed?.();
			let persisted = false;
			await patchSessionEntryCore(scope, (current) => {
				if (current.sessionId !== params.sessionId || hasExplicitSessionName(current)) return null;
				persisted = true;
				return { displayName };
			}, {
				requireWriteSuccess: true,
				...assertCommitAllowed ? { assertCommitAllowed } : {}
			});
			return persisted;
		};
		return params.withSource ? await params.withSource((source) => persist(source.assertCurrent)) : await persist();
	};
	return await sessionTitleRequests.run(requestTarget, () => Promise.resolve().then(async () => {
		const withSource = params.withSource;
		if (!withSource) {
			params.commitGuard?.();
			return await finish(generate());
		}
		return await runWithAsyncWorkResources(async () => {
			const runInGenerationContext = AsyncLocalStorage.snapshot();
			const pending = await withSource((source) => {
				params.commitGuard?.();
				source.assertCurrent();
				const completion = runInGenerationContext(() => trackAsyncWork(() => generate(getAsyncWorkSignal())));
				completion.catch(() => void 0);
				return { completion };
			});
			return await finish(pending.completion);
		}, { cancelOnError: true });
	}));
}
//#endregion
export { maybeGenerateSessionTitle as a, maybeGenerateDashboardSessionTitle as i, generateWorktreeSessionTitle as n, prepareDashboardSessionTitle as o, isDashboardSessionTitleCandidate as r, buildDashboardSessionTitleSource as t };
