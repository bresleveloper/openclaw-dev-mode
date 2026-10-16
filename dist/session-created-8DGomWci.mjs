import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-C09ow4h0.mjs";
import { i as prepareSystemEventStorePath, l as withSystemEventOwner, t as captureSystemEventStoreCurrentCheck } from "./system-event-ownership-BkQcgSZJ.mjs";
import { n as resolveCanonicalMainSessionKey } from "./main-session-key-DrfSAS1s.mjs";
import { i as enqueueSystemEvent, l as peekSystemEventEntries } from "./system-events-BD0JkU8V.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-CPayZwJR.mjs";
import { p as recordSessionStateEventAsync } from "./session-state-events-B7wdeeGU.mjs";
import { f as SESSION_CREATED_NOTICE_CONTEXT_PREFIX } from "./session-state-events.kernel-CXzdFJ4D.mjs";
import { i as wrapUntrustedPromptDataBlock, n as sanitizeForPromptLiteral } from "./sanitize-for-prompt-bzCyHFCH.mjs";
//#region src/sessions/session-created.ts
const log = createSubsystemLogger("sessions/state-events");
const CREATION_SUMMARY_MAX_CHARS = 8192;
const CREATION_SUMMARY_HEADER = "Recent session creations (bounded summary; older entries may be omitted):";
function reportCreationSignalFailure(error) {
	try {
		log.warn(`failed to record session creation: ${String(error)}`);
	} catch {}
}
/** Notify Home of a new logical session and record its trusted creation attribution. */
async function recordSessionCreated(cfg, params) {
	const agentId = params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey);
	const actor = params.entry.createdActor;
	const event = actor ? {
		sessionKey: params.sessionKey,
		sessionId: params.entry.sessionId,
		agentId,
		kind: "created",
		actorType: actor.type,
		...actor.id ? { actorId: actor.id } : {},
		dedupeKey: `created:${agentId}:${params.sessionKey}:${params.entry.sessionId}`,
		summary: "session created"
	} : void 0;
	let context;
	if (event) try {
		context = captureOpenClawStateWorkerContext();
	} catch (error) {
		reportCreationSignalFailure(error);
	}
	try {
		await enqueueSessionCreatedNotice({
			...params,
			cfg,
			agentId
		});
	} catch (error) {
		reportCreationSignalFailure(error);
	}
	if (event && context) await recordSessionStateEventAsync(event, { context });
}
function noticeLabel(value) {
	const text = value && sanitizeForPromptLiteral(value).trim();
	return text ? truncateUtf16Safe(text, 200) : void 0;
}
/** Creation awareness is one ambient notice, not a subscription to future session activity. */
async function enqueueSessionCreatedNotice(params) {
	const { cfg, sessionKey, agentId, entry } = params;
	if (cfg.session?.notifyOnCreate === false || entry.incognito || isIncognitoSessionKey(sessionKey) || entry.visibility === "draft" || entry.createdVia === "internal" || entry.createdVia === "cron" || isInternalSessionEffectsKey(sessionKey)) return;
	const mainSessionKey = resolveCanonicalMainSessionKey({
		agentId,
		sessionScope: cfg.session?.scope,
		mainKey: cfg.session?.mainKey
	});
	if (sessionKey === mainSessionKey) return;
	const actor = entry.createdActor;
	const details = {
		sessionKey,
		title: noticeLabel(entry.label ?? entry.displayName ?? entry.subject),
		createdVia: entry.createdVia,
		creator: actor ? {
			type: actor.type,
			...actor.type === "human" ? { source: actor.source } : {},
			id: noticeLabel(actor.id),
			label: noticeLabel(actor.label)
		} : void 0
	};
	const isStoreCurrent = captureSystemEventStoreCurrentCheck(mainSessionKey, agentId);
	const sessionStorePath = await prepareSystemEventStorePath(mainSessionKey, agentId);
	if (!isStoreCurrent(sessionStorePath)) return;
	const options = withSystemEventOwner({
		sessionKey: mainSessionKey,
		sessionStorePath,
		contextKey: SESSION_CREATED_NOTICE_CONTEXT_PREFIX,
		replace: true
	}, agentId);
	const notices = peekSystemEventEntries(options.sessionKey).find((event) => event.contextKey === options.contextKey)?.text.split("\n\n").slice(1) ?? [];
	const notice = wrapUntrustedPromptDataBlock({
		label: "New session created",
		text: JSON.stringify(details),
		maxEscapedChars: 2048,
		truncationMarker: "…"
	});
	if (notices.includes(notice)) return;
	notices.push(notice);
	let text = [CREATION_SUMMARY_HEADER, ...notices].join("\n\n");
	while (text.length > CREATION_SUMMARY_MAX_CHARS) {
		notices.shift();
		text = [CREATION_SUMMARY_HEADER, ...notices].join("\n\n");
	}
	enqueueSystemEvent(text, options);
}
//#endregion
export { recordSessionCreated as t };
