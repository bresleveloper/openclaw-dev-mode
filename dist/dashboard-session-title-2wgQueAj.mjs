import { r as getAsyncWorkSignal, s as trackAsyncWork } from "./async-work-scope-BH2yUdBz.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { A as withTimeout } from "./fs-safe-6Z4UiMS4.mjs";
import { f as sessionEntryCommitGuardOptions, o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { b as resolveNativeModelPrimary } from "./agent-scope-config-fjA2T9Gz.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { o as stripInboundMetadata } from "./strip-inbound-meta-D65t0FgP.mjs";
import { n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { i as readSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { i as isValidBase64 } from "./base64-CU53EX1R.mjs";
import { s as resolveStoredSessionKeyForAgentStore } from "./session-store-key-DKpto8R6.mjs";
import { o as patchSessionEntryCore } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { i as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-BQN27lQg.mjs";
import { r as resolveSessionModelRef } from "./session-model-ref-BTkDCi12.mjs";
import { t as createCrustaceanSlug } from "./session-slug-mrhmi8jZ.mjs";
import { a as resolveUtilityModelRefForAgent } from "./utility-model-nsnbR10X.mjs";
import { t as runWithAsyncWorkResources } from "./async-work-resources-DmPouonj.mjs";
import { n as resolveExplicitSessionName, r as sessionTitleRequests, t as hasExplicitSessionName } from "./session-title-state-BQCPqYS_.mjs";
import { t as readSessionTitleFieldsFromTranscriptAsync } from "./session-transcript-title-reader-CjTuM3RM.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/gateway/dashboard-session-title.ts
const DASHBOARD_SESSION_TITLE_MAX_CHARS = 60;
const DASHBOARD_SESSION_TITLE_SOURCE_MAX_CHARS = 1e3;
const WORKTREE_SESSION_TITLE_WAIT_MS = 3e4;
const DASHBOARD_SESSION_TITLE_PROMPT = "Generate a concise session title (3-6 words, max 60 characters) from the supplied source message. Use the language the message is written in, not the language of quoted literals, in sentence case: capitalize only the first word and words that language always capitalizes. No emoji. Return only the title.";
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
	const configuredRef = resolveNativeModelPrimary(params.cfg, params.agentId)?.trim();
	const configuredProfile = configuredRef ? splitTrailingAuthProfile(configuredRef).profile : void 0;
	if (!configuredProfile) return;
	return resolveSessionModelRef(params.cfg, void 0, params.agentId).provider === params.regularProvider ? configuredProfile : void 0;
}
const TITLE_LEAD_IN = /^(?:(?:concise|short|suggested|proposed|final|correct|session|chat|conversation|kurzer|kürzester|passender|richtiger|vorgeschlagener)\s+)?(?:(?:sitzungs|session-?|chat-?)?(?:title|titel)|label)(?:\s+(?:for|für)\s[^:]*)?\s*:\s*/iu;
function stripTitleLeadIn(line) {
	const collapsed = line.replace(/\s+/g, " ").trim();
	const title = collapsed.replace(TITLE_LEAD_IN, "");
	return {
		text: (/^\*\*([^*]+)\*\*$/u.exec(title)?.[1] ?? title).trim(),
		introduced: title !== collapsed
	};
}
const TITLE_QUOTE_PAIRS = {
	"\"": "\"",
	"'": "'",
	"`": "`",
	"„": "“",
	"“": "”",
	"«": "»",
	"»": "«",
	"‘": "’"
};
function quotesExactly(line, text) {
	return Object.entries(TITLE_QUOTE_PAIRS).some(([open, close]) => line.includes(`${open}${text}${close}`));
}
function normalizeDashboardSessionTitle(raw) {
	const lines = raw.replace(/\r/g, "").split("\n").map((line) => stripTitleLeadIn(line)).filter(({ text }) => text && !text.startsWith("```"));
	const candidates = lines.filter(({ text }) => !text.endsWith(":"));
	const [first] = candidates;
	const chosen = (candidates.find(({ introduced }) => introduced) ?? (first && first.text.length > DASHBOARD_SESSION_TITLE_MAX_CHARS ? candidates.slice(1).find(({ text }) => quotesExactly(first.text, text)) : void 0) ?? first ?? lines[0])?.text;
	if (!chosen || chosen.endsWith(":")) return null;
	const title = truncateUtf16Safe(chosen, DASHBOARD_SESSION_TITLE_MAX_CHARS);
	const quotes = /["'`„“”«»‘’]/gu;
	const pending = [];
	const removed = /* @__PURE__ */ new Set();
	for (const match of title.matchAll(quotes)) {
		const character = match[0];
		const index = match.index;
		const opening = pending.at(-1);
		const before = title.slice(0, index);
		const after = title.slice(index + 1);
		if (/['’]/u.test(character) && /[\p{L}\p{M}\p{N}]$/u.test(before)) {
			if (/^[\p{L}\p{M}\p{N}]/u.test(after)) continue;
			if (after || /s$/iu.test(before)) {
				const nextDelimiter = /‘|(?<![\p{L}\p{M}\p{N}])['’]|['’](?![\p{L}\p{M}\p{N}])/u.exec(after);
				if (opening?.close !== character || nextDelimiter?.[0] === character && !/^[\p{L}\p{M}\p{N}]/u.test(after.slice(nextDelimiter.index + 1))) continue;
			}
		}
		if (opening?.close === character) {
			pending.pop();
			removed.delete(opening.index);
			if (/^[\s"'`„“”«»‘’]*$/u.test(title.slice(0, opening.index) + title.slice(index + 1))) {
				removed.add(opening.index);
				removed.add(index);
			}
		} else if (TITLE_QUOTE_PAIRS[character]) {
			pending.push({
				index,
				close: TITLE_QUOTE_PAIRS[character]
			});
			removed.add(index);
		} else if (/[”’]/u.test(character)) removed.add(index);
	}
	const normalized = title.replace(quotes, (quote, index) => removed.has(index) ? "" : quote).trim();
	return /[^\s"'`„“”«»‘’]/u.test(normalized) ? normalized : null;
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
	const generateLabel = async () => {
		try {
			const { generateConversationLabelWithFallback } = await import("./conversation-label-generator-DLRTg591.mjs");
			params.assertCurrent?.();
			params.abortSignal?.throwIfAborted();
			return await generateConversationLabelWithFallback({
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
				operatorAuthority: params.operatorAuthority,
				...params.utilityOnly ? { utilityOnly: true } : {}
			});
		} catch {
			params.assertCurrent?.();
			params.abortSignal?.throwIfAborted();
		}
		return null;
	};
	let title = await generateLabel();
	if (!title && params.retryAfter) {
		await params.retryAfter;
		params.assertCurrent?.();
		params.abortSignal?.throwIfAborted();
		title = await generateLabel();
	}
	if (title) return title;
	if (params.utilityOnly) return null;
	params.onFallback?.();
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
	const scope = {
		agentId: params.agentId,
		sessionKey: resolveStoredSessionKeyForAgentStore(params),
		storePath: params.storePath
	};
	const request = maybeGenerateSessionTitle(params).then((persisted) => {
		if (persisted) params.onPersisted();
	});
	try {
		await withTimeout(request, WORKTREE_SESSION_TITLE_WAIT_MS, "worktree title generation");
	} catch (error) {
		params.onError(error);
	}
	const readCurrent = async (assertSourceCurrent) => {
		params.commitGuard?.();
		assertSourceCurrent?.();
		const current = await readSessionEntryReadOnlyInWorker(scope, () => {
			params.commitGuard?.();
			assertSourceCurrent?.();
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
	const assertCurrent = () => params.commitGuard?.();
	const memory = captureSessionActorStorageOwner(scope, {
		assertCurrent,
		authorize: assertCurrent
	});
	if (memory && !memory.owner?.readSession(sessionKey, memory.authority)?.entry) return false;
	const assertMemorySessionCurrent = memory?.owner?.captureSessionReadGuard(sessionKey);
	const assertMemoryCurrent = () => {
		assertMemorySessionCurrent?.();
		memory?.binding?.actor.assertReadable();
		memory?.authority.assertCurrent();
	};
	const requestTarget = {
		...scope,
		sessionId: params.sessionId
	};
	const existing = sessionTitleRequests.get(requestTarget);
	if (existing) {
		const persisted = await (params.retryFailedJoin ? existing.catch(() => false) : existing);
		assertMemoryCurrent();
		return !persisted && params.retryFailedJoin ? await maybeGenerateSessionTitle({
			...params,
			retryFailedJoin: false
		}) : false;
	}
	const finish = async (generation) => {
		const displayName = await generation;
		if (!displayName) return false;
		const persist = async (assertSourceCurrent) => {
			const assertCommitAllowed = composeSessionSourceAssertion([
				params.commitGuard,
				assertSourceCurrent,
				...memory ? [assertMemoryCurrent] : []
			]);
			if (assertSourceCurrent) assertCommitAllowed?.();
			let persisted = false;
			await patchSessionEntryCore(scope, (current) => {
				if (current.sessionId !== params.sessionId || hasExplicitSessionName(current)) return null;
				persisted = true;
				return { displayName };
			}, {
				requireWriteSuccess: true,
				...sessionEntryCommitGuardOptions(assertCommitAllowed)
			});
			return persisted;
		};
		return params.withSource ? await params.withSource((source) => persist(source.assertCurrent)) : await persist();
	};
	const run = async () => {
		const entry = await readSessionEntryReadOnlyInWorker(scope, assertMemoryCurrent);
		if (hasExplicitSessionName(entry) || entry?.sessionId !== params.sessionId) return false;
		const transcriptScope = {
			agentId: params.agentId,
			sessionEntry: entry,
			sessionId: params.sessionId,
			sessionKey,
			storePath: params.storePath
		};
		const transcriptSource = (await readSessionTitleFieldsFromTranscriptAsync(transcriptScope)).firstUserMessage;
		assertMemoryCurrent();
		const transcriptText = transcriptSource ? stripInboundMetadata(transcriptSource).trim() : "";
		const currentText = params.currentUserMessage?.trim() ?? "";
		const sourceText = entry.pendingWorktree?.titleSource?.trim() ?? (!transcriptText || currentText && currentText === transcriptText ? params.userMessage.trim() : transcriptText);
		if (!sourceText) return false;
		const generate = (abortSignal) => generateDashboardSessionTitle({
			cfg: params.cfg,
			agentId: params.agentId,
			entry: params.entry ?? entry,
			userMessage: sourceText,
			operatorAuthority: params.operatorAuthority,
			...abortSignal ? { abortSignal } : {},
			...params.retryAfter ? { retryAfter: params.retryAfter } : {},
			onFallback: params.onFallback,
			...memory ? { assertCurrent: assertMemoryCurrent } : {}
		});
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
	};
	return await sessionTitleRequests.run(requestTarget, run);
}
//#endregion
export { maybeGenerateSessionTitle as a, maybeGenerateDashboardSessionTitle as i, generateWorktreeSessionTitle as n, prepareDashboardSessionTitle as o, isDashboardSessionTitleCandidate as r, buildDashboardSessionTitleSource as t };
