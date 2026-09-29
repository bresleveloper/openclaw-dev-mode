import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CUi_tcgF.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-CBvmC8zz.mjs";
import { s as withSystemEventOwner } from "./system-event-ownership-CHVGbaAW.mjs";
import { t as resolveCanonicalMainSessionKey } from "./main-session-key-BE52ybIt.mjs";
import { i as enqueueSystemEvent } from "./system-events-ANKIkU0W.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-Xwd1VHk2.mjs";
import { d as SESSION_CREATED_NOTICE_CONTEXT_PREFIX } from "./session-upstream-links.kernel-Cpo11-aI.mjs";
import { f as recordSessionStateEvent } from "./session-state-events-CMg59EpB.mjs";
import { i as wrapUntrustedPromptDataBlock, n as sanitizeForPromptLiteral } from "./sanitize-for-prompt-bzCyHFCH.mjs";
//#region src/sessions/session-created.ts
/** Notify Home of a new logical session and record its trusted creation attribution. */
function recordSessionCreated(cfg, params) {
	const agentId = params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey);
	enqueueSessionCreatedNotice({
		...params,
		cfg,
		agentId
	});
	const actor = params.entry.createdActor;
	if (!actor) return;
	recordSessionStateEvent({
		sessionKey: params.sessionKey,
		sessionId: params.entry.sessionId,
		agentId,
		kind: "created",
		actorType: actor.type,
		...actor.id ? { actorId: actor.id } : {},
		dedupeKey: `created:${agentId}:${params.sessionKey}:${params.entry.sessionId}`,
		summary: "session created"
	});
}
function noticeLabel(value) {
	const text = value && sanitizeForPromptLiteral(value).trim();
	return text ? truncateUtf16Safe(text, 200) : void 0;
}
/** Creation awareness is one ambient notice, not a subscription to future session activity. */
function enqueueSessionCreatedNotice(params) {
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
	enqueueSystemEvent(wrapUntrustedPromptDataBlock({
		label: "New session created",
		text: JSON.stringify(details)
	}), withSystemEventOwner({
		sessionKey: mainSessionKey,
		contextKey: `${SESSION_CREATED_NOTICE_CONTEXT_PREFIX}${sessionKey}:${entry.sessionId}`
	}, agentId));
}
//#endregion
export { recordSessionCreated as t };
