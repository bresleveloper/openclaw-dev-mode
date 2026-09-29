import { a as asOptionalRecord, c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { m as readNonBlankString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { Jn as string, Pn as number, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import "./session-key-CBvmC8zz.mjs";
import { b as redactToolPayloadText } from "./redact-B5EGyLvV.mjs";
import { i as isSqliteCorruptionError } from "./sqlite-error-diagnostics-C8UyxYRx.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { x as UserProfileNotFoundError } from "./user-profiles-internal-BxQLnWfo.mjs";
import { S as selectStoredGitHubIdentities, n as getUserProfileDisplays, t as getUserProfileDisplay } from "./user-profile-list-B5pNqyXa.mjs";
import "./user-profiles-BA6bh7Le.mjs";
import { o as sessionCreatorProfileId } from "./session-entry-provenance-C-JyMH54.mjs";
import { t as SessionTranscriptColdError } from "./session-cold-storage-state-BcO2Rrog.mjs";
import { r as isSessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-CuzwVnKb.mjs";
import { f as withTranscriptWriteLock, i as appendTranscriptMessage } from "./session-accessor.sqlite-transcript-write-Bk_2EeDT.mjs";
import { I as selectVisibleTranscriptEventEntries, L as selectVisibleTranscriptEvents, c as loadTranscriptEvents, o as loadLatestAssistantText } from "./session-accessor.sqlite-read-BzN7WYll.mjs";
import { t as extractAssistantPhaseText } from "./chat-message-content-D14VlZZc.mjs";
import { t as redactTranscriptMessage } from "./transcript-redact-CcOcbRyc.mjs";
import { T as resolveSessionStorePathForScope, l as loadSessionEntryReadOnly, s as loadSessionEntry } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import { g as publishTranscriptUpdate } from "./session-accessor.sqlite-lifecycle-state-DdmXgBkg.mjs";
import { A as readTranscriptRawDelta, f as appendTranscriptMessages, p as persistSessionTranscriptTurn, s as appendSessionTranscriptReport } from "./session-accessor-l-4ZHvKn.mjs";
import { i as resolveSessionTranscriptRuntimeTarget, t as bindSessionTranscriptStoreScope } from "./session-accessor.transcript-target-w5-iuMeM.mjs";
import { n as readLatestSessionTranscriptMessageEvent, u as readSessionTranscriptVisibleMessageDeltaCore } from "./session-accessor.sqlite-active-events-Cnt-hBim.mjs";
import "./prompt-image-input-BFUTWwQi.mjs";
import { a as resolveMirroredTranscriptText } from "./transcript-DgtCkbrJ.mjs";
import { l as readTranscriptSenderIdentity } from "./user-turn-transcript.metadata-BY4PdwgQ.mjs";
import { n as isSuppressedControlReplyText } from "./control-reply-text-CDvIm13S.mjs";
import { l as isAssistantTextContentType } from "./chat-display-projection.helpers-BloZC0RQ.mjs";
import { n as projectTranscriptEntryMessage } from "./session-transcript-entry-message-COJ0koI7.mjs";
import { n as deriveSessionTitle } from "./session-utils-core-CcjzbK1i.mjs";
import { n as projectSessionDisplayMessage } from "./session-display-projection-bZOY074i.mjs";
import { i as projectSessionActor, o as projectSessionParticipant } from "./session-identity-projection-Bz5hvxHJ.mjs";
import { r as readSessionTranscriptHistoryEventPage } from "./session-accessor.sqlite-history-events-CxKlqhz3.mjs";
import { t as buildSessionsYieldContextMessage } from "./sessions-yield-context-Dz12h_Az.mjs";
import { t as formatSessionTranscriptMemoryHitKey } from "./session-transcript-memory-hit-vbgnM699.mjs";
import { t as withProjectedSessionTranscriptWriteLock } from "./session-transcript-lock-runtime-XjKtcDhv.mjs";
import { a as projectChatDisplayMessages } from "./chat-display-projection.core-x-JzVWZh.mjs";
import "./chat-display-projection-BuAz8rxu.mjs";
import { createHash } from "node:crypto";
//#region src/gateway/session-catalog-identity.ts
function sourceLabel(value) {
	const text = value?.trim();
	return text ? truncateUtf16Safe(redactToolPayloadText(text), 200) : void 0;
}
function verifiedGitHubIdentities(profileIds) {
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => tableExists(db, "user_profile_identities") ? selectStoredGitHubIdentities(db, profileIds) : void 0);
}
function readSourceProfileFacts(id) {
	let profile;
	try {
		profile = getUserProfileDisplay(id);
	} catch (error) {
		if (!(error instanceof UserProfileNotFoundError)) throw error;
	}
	const profileId = profile?.id ?? id;
	const github = verifiedGitHubIdentities([profileId])?.get(profileId)?.primary;
	return {
		profileId,
		profile,
		github
	};
}
function projectSourceParticipant(params, resolveProfile) {
	const { identity } = params;
	if (identity.type !== "profile") {
		const label = sourceLabel(params.label);
		return {
			identity,
			...label ? { label } : {}
		};
	}
	const { profileId, profile, github } = resolveProfile(identity.id);
	const label = sourceLabel(profile?.displayName ?? github?.login ?? params.label);
	return {
		identity: {
			type: "remote",
			pluginId: params.pluginId,
			domain: params.sourceDomain,
			idKind: github ? "github-account" : "profile",
			id: github ? String(github.accountId) : profileId
		},
		...label ? { label } : {}
	};
}
/** A synchronous page reuses first-read display facts; later pages read fresh state. */
function createSessionCatalogSourceParticipantProjector() {
	const profiles = /* @__PURE__ */ new Map();
	return (params) => projectSourceParticipant(params, (id) => {
		let facts = profiles.get(id);
		if (!facts) {
			facts = readSourceProfileFacts(id);
			profiles.set(id, facts);
		}
		return facts;
	});
}
function projectSourceActor(params, resolveProfile) {
	const { actor } = params;
	if (!actor) return;
	const profileId = sessionCreatorProfileId(actor);
	const participant = profileId ? projectSourceParticipant({
		...params,
		identity: {
			type: "profile",
			id: profileId
		},
		label: actor.label
	}, resolveProfile) : void 0;
	const label = sourceLabel(actor.label);
	return {
		type: actor.type,
		...actor.id ? { id: participant?.identity.id ?? actor.id } : {},
		...label ? { label } : {},
		...participant
	};
}
/** Prepare portable creator claims for one synchronous page; claims never grant access. */
function createSessionCatalogSourceActorProjector(params) {
	const ids = [...new Set(params.actors.flatMap((actor) => {
		const id = sessionCreatorProfileId(actor);
		return id ? [id] : [];
	}))];
	let facts;
	let attempted = false;
	return (actor) => projectSourceActor({
		...params,
		actor
	}, (requestedId) => {
		if (!attempted) {
			attempted = true;
			try {
				const profiles = getUserProfileDisplays(ids);
				const identities = verifiedGitHubIdentities([...new Set(ids.map((id) => profiles.get(id)?.id ?? id))]);
				facts = new Map(ids.map((id) => {
					const profile = profiles.get(id);
					const profileId = profile?.id ?? id;
					return [id, {
						profileId,
						profile,
						github: identities?.get(profileId)?.primary
					}];
				}));
			} catch (error) {
				if (isSqliteCorruptionError(error)) throw error;
			}
		}
		return facts?.get(requestedId) ?? readSourceProfileFacts(requestedId);
	});
}
/** Snapshot attribution links once per catalog page; claims never grant access. */
function createSessionCatalogGitHubLinker() {
	const profilesByAccountId = /* @__PURE__ */ new Map();
	const profilesByLogin = /* @__PURE__ */ new Map();
	const profiles = /* @__PURE__ */ new Map();
	for (const [profileId, { accounts }] of verifiedGitHubIdentities() ?? []) for (const github of accounts) {
		const accountId = String(github.accountId);
		const login = github.login.toLowerCase();
		if (!profilesByAccountId.has(accountId)) profilesByAccountId.set(accountId, profileId);
		if (!profilesByLogin.has(login)) profilesByLogin.set(login, profileId);
	}
	return {
		linkParticipant(participant) {
			const { identity } = participant;
			if (identity.type !== "remote" || identity.idKind !== "github-account") return participant;
			const profileId = profilesByAccountId.get(identity.id);
			return profileId ? projectSessionParticipant({
				type: "profile",
				id: profileId
			}, profiles) : participant;
		},
		resolveOwner(owner) {
			const profileId = owner.startsWith("profile:") ? owner.slice(8) : owner.startsWith("github:") ? profilesByLogin.get(owner.slice(7).toLowerCase()) : void 0;
			if (!profileId) return;
			try {
				const profile = getUserProfileDisplay(profileId);
				return projectSessionActor({
					type: "human",
					id: profile.id
				}, profiles);
			} catch (error) {
				if (!(error instanceof UserProfileNotFoundError)) throw error;
				return;
			}
		}
	};
}
//#endregion
//#region src/gateway/session-transcript-catalog.ts
const MAX_CATALOG_ITEMS = 200;
const MAX_CATALOG_TEXT_CHARS = 6e3;
const MAX_CATALOG_READ_BYTES = 8388608;
const MAX_CATALOG_SCAN_MESSAGES = 1e3;
const CursorSchema = strictObject({
	version: literal(1),
	scope: string().length(43),
	source: string().max(512).optional(),
	anchor: strictObject({
		seq: number().int().positive().safe(),
		eventSeq: number().int().nonnegative().safe()
	}),
	before: number().int().nonnegative().safe(),
	skip: number().int().nonnegative().max(1e5)
});
function readCatalogHistoryPage(scope, options) {
	const page = readSessionTranscriptHistoryEventPage(scope, {
		...options,
		maxBytes: MAX_CATALOG_READ_BYTES,
		readOnly: true
	});
	if (page.omittedOversized) throw new Error("A transcript entry is too large to share. Open the session on the source Gateway to inspect it.");
	return page;
}
function decodeCursor(cursor) {
	if (cursor === void 0) return;
	try {
		if (cursor.length > 1200 || !/^[A-Za-z0-9_-]+$/.test(cursor)) throw new Error("invalid encoding");
		const decoded = Buffer.from(cursor, "base64url");
		if (decoded.toString("base64url") !== cursor) throw new Error("noncanonical encoding");
		return CursorSchema.parse(JSON.parse(decoded.toString("utf8")));
	} catch {
		throw new Error("Invalid session transcript cursor; reload the session.");
	}
}
function boundedText(text) {
	const redacted = redactToolPayloadText(text);
	return redacted.length > MAX_CATALOG_TEXT_CHARS ? {
		text: truncateUtf16Safe(redacted, MAX_CATALOG_TEXT_CHARS),
		truncated: true
	} : { text: redacted };
}
function projectContentItem(role, value) {
	if (role !== "user" && role !== "assistant") return;
	const block = asOptionalRecord(value);
	if (typeof value !== "string" && !isAssistantTextContentType(block?.type)) return;
	const text = typeof value === "string" ? value : block?.text;
	if (typeof text !== "string" || !text.trim() || role === "assistant" && isSuppressedControlReplyText(text)) return;
	return {
		type: role === "user" ? "userMessage" : "agentMessage",
		...boundedText(text)
	};
}
function projectMessageItems(message, params, projectSender) {
	const metadata = asOptionalRecord(message["__openclaw"]);
	const identity = message.role === "user" ? readTranscriptSenderIdentity(metadata?.senderIdentity) : void 0;
	const senderName = metadata?.senderName ?? message.senderLabel;
	const sender = identity ? projectSender({
		...params,
		identity,
		label: typeof senderName === "string" ? senderName : void 0
	}) : void 0;
	const timestamp = message.timestamp ?? metadata?.recordTimestampMs;
	const milliseconds = typeof timestamp === "number" ? timestamp : typeof timestamp === "string" ? Date.parse(timestamp) : NaN;
	const date = Number.isFinite(milliseconds) ? new Date(milliseconds) : void 0;
	const timestampText = date && Number.isFinite(date.getTime()) ? date.toISOString() : void 0;
	return (Array.isArray(message.content) ? message.content : [message.content ?? message.text]).flatMap((block, index) => {
		const item = projectContentItem(message.role, block);
		if (!item) return [];
		return [Object.assign(item, {
			...metadata?.truncated === true ? { truncated: true } : {},
			...typeof metadata?.id === "string" ? { id: `${metadata.id}:${index}` } : {},
			...timestampText ? { timestamp: timestampText } : {},
			...typeof message.model === "string" ? { model: redactToolPayloadText(message.model).slice(0, 200) } : {},
			...sender ? { sender } : {}
		})];
	}).toReversed();
}
/** Reads conversation text without joining the source Gateway's writer lifecycle. */
async function readSessionTranscriptCatalogPage(params) {
	const cursor = decodeCursor(params.cursor);
	if (!Number.isSafeInteger(params.limit) || params.limit < 1 || params.limit > MAX_CATALOG_ITEMS) throw new Error(`Session transcript limit must be an integer from 1 to ${MAX_CATALOG_ITEMS}.`);
	const storePath = resolveSessionStorePathForScope(params);
	const entry = loadSessionEntryReadOnly({
		...params,
		storePath
	});
	if (!entry) throw new Error("Session not found; refresh the session catalog.");
	const scope = {
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		sessionId: entry.sessionId,
		sessionEntry: entry,
		storePath
	};
	const scopeHash = createHash("sha256").update(JSON.stringify([
		"conversation",
		params.agentId,
		params.sessionKey,
		entry.sessionId,
		storePath
	])).digest("base64url");
	const snapshot = readCatalogHistoryPage(scope, {
		offset: 0,
		maxMessages: 1
	});
	if (cursor && (cursor.scope !== scopeHash || cursor.source !== snapshot.displaySource || cursor.anchor.seq > snapshot.totalMessages || cursor.before > snapshot.totalMessages)) throw new Error("Session transcript cursor no longer matches this session; reload the session.");
	const tail = snapshot.events.at(-1);
	const anchor = cursor?.anchor ?? (tail ? {
		seq: tail.seq,
		eventSeq: tail.eventSeq
	} : void 0);
	if (cursor) {
		if (readCatalogHistoryPage(scope, {
			offset: snapshot.totalMessages - cursor.anchor.seq,
			maxMessages: 1
		}).events[0]?.eventSeq !== cursor.anchor.eventSeq) throw new Error("Session transcript cursor no longer matches this session; reload the session.");
	}
	const limit = params.limit;
	let before = cursor?.before ?? snapshot.totalMessages;
	let skip = cursor?.skip ?? 0;
	let scanned = 0;
	const items = [];
	const projectSender = createSessionCatalogSourceParticipantProjector();
	while (before > 0 && items.length < limit && scanned < MAX_CATALOG_SCAN_MESSAGES) {
		const page = readCatalogHistoryPage(scope, {
			offset: snapshot.totalMessages - before,
			maxMessages: Math.min(before, limit + 1)
		});
		if (page.displaySource !== snapshot.displaySource || page.activeLeafEntryId !== snapshot.activeLeafEntryId || page.totalMessages !== snapshot.totalMessages) throw new Error("Session transcript changed during this read; retry the page.");
		const projected = projectChatDisplayMessages(page.events.map(({ event, seq, displayPosition }) => projectTranscriptEntryMessage(event, seq, displayPosition)), { maxChars: MAX_CATALOG_TEXT_CHARS });
		const bySequence = /* @__PURE__ */ new Map();
		for (const message of projected.toReversed()) {
			const seq = asOptionalRecord(message["__openclaw"])?.seq;
			const previous = bySequence.get(seq) ?? [];
			previous.push(...projectMessageItems(message, params, projectSender));
			bySequence.set(seq, previous);
		}
		for (const event of page.events.toReversed()) {
			const messageItems = bySequence.get(event.seq) ?? [];
			if (skip > messageItems.length) throw new Error("Invalid session transcript cursor; reload the session.");
			const selected = messageItems.slice(skip, skip + limit - items.length);
			items.push(...selected);
			skip += selected.length;
			before = event.seq;
			if (skip === messageItems.length) {
				before -= 1;
				skip = 0;
			}
			scanned += 1;
			if (items.length === limit || scanned === MAX_CATALOG_SCAN_MESSAGES) break;
		}
		if (page.events.length === 0) break;
	}
	const nextCursor = before > 0 && anchor ? Buffer.from(JSON.stringify({
		version: 1,
		scope: scopeHash,
		source: snapshot.displaySource,
		anchor,
		before,
		skip
	})).toString("base64url") : void 0;
	return {
		items,
		...nextCursor ? { nextCursor } : {}
	};
}
/** Matches local session-title precedence, with a bounded read-only first-message probe. */
function readSessionTranscriptCatalogTitle(params) {
	const title = deriveSessionTitle(params.entry);
	if (title) return boundedText(title).text;
	const scope = {
		...params,
		storePath: resolveSessionStorePathForScope(params),
		sessionId: params.entry.sessionId,
		sessionEntry: params.entry
	};
	try {
		const snapshot = readCatalogHistoryPage(scope, {
			offset: 0,
			maxMessages: 0
		});
		const page = readSessionTranscriptHistoryEventPage(scope, {
			offset: Math.max(0, snapshot.totalMessages - 100),
			maxMessages: 100,
			maxBytes: MAX_CATALOG_READ_BYTES,
			readOnly: true
		});
		if (page.olderOffset !== void 0 || page.omittedOversized) return;
		for (const { event, seq, displayPosition } of page.events) {
			const message = projectSessionDisplayMessage(projectTranscriptEntryMessage(event, seq, displayPosition));
			if (message?.role === "user") {
				const derived = deriveSessionTitle(params.entry, message.text);
				return derived ? boundedText(derived).text : void 0;
			}
		}
	} catch (error) {
		if (!(error instanceof SessionTranscriptColdError)) throw error;
	}
}
//#endregion
//#region src/plugin-sdk/session-transcript-runtime.ts
/** Persists a successful yield's private context through the admitted session writer. */
async function appendSessionYieldContext(params) {
	const { message, assertCurrent, config, ...scope } = params;
	assertCurrent();
	const result = await appendSessionTranscriptReport(bindSessionTranscriptStoreScope(scope, config), {
		kind: "custom",
		customTypes: [],
		selectReport: () => {
			assertCurrent();
			return buildSessionsYieldContextMessage(message);
		}
	});
	if (!result.ok) throw new Error(`Could not persist sessions_yield context: ${result.error.code}`);
}
/**
* Resolves the public identity for a transcript without returning its file path.
*/
async function resolveSessionTranscriptIdentity(params) {
	const target = await resolveSessionTranscriptRuntimeTarget(params);
	const agentId = normalizeAgentId(target.agentId);
	return {
		agentId,
		memoryKey: formatSessionTranscriptMemoryHitKey({
			agentId,
			sessionId: target.sessionId
		}),
		sessionId: target.sessionId,
		sessionKey: target.sessionKey
	};
}
/**
* Resolves the public target for transcript operations without exposing the
* current storage path as identity.
*/
async function resolveSessionTranscriptTarget(params) {
	return projectPublicTarget({
		...await resolveSessionTranscriptRuntimeTarget(params),
		targetKind: "runtime-session"
	});
}
/**
* Reads transcript events by public session identity instead of file path.
*/
async function readSessionTranscriptEvents(params) {
	return await loadTranscriptEvents(bindSessionTranscriptStoreScope(params));
}
/** Reads one bounded raw page; the opaque cursor survives append and resets after replacement. */
async function readSessionTranscriptRawDelta(params) {
	const { cursor, maxBytes, maxEvents, ...target } = params;
	const scope = bindSessionTranscriptStoreScope(target);
	const { readRestoredSessionTranscript } = await import("./session-cold-storage-read-CGWPlbiu.mjs");
	return readRestoredSessionTranscript(scope, () => readTranscriptRawDelta(scope, {
		...cursor !== void 0 ? { cursor } : {},
		...maxBytes !== void 0 ? { maxBytes } : {},
		...maxEvents !== void 0 ? { maxEvents } : {}
	}));
}
/** Reads one bounded active-path page that resumes appends and resets after discontinuities. */
async function readSessionTranscriptVisibleMessageDelta(params) {
	const { cursor, maxBytes, maxMessages, ...target } = params;
	const scope = bindSessionTranscriptStoreScope(target);
	const { readRestoredSessionTranscript } = await import("./session-cold-storage-read-CGWPlbiu.mjs");
	let result;
	try {
		result = await readRestoredSessionTranscript(scope, () => readSessionTranscriptVisibleMessageDeltaCore(scope, {
			...cursor !== void 0 ? { cursor } : {},
			...maxBytes !== void 0 ? { maxBytes } : {},
			...maxMessages !== void 0 ? { maxMessages } : {}
		}));
	} catch (error) {
		if (isSessionTranscriptProjectionUnavailableError(error)) return {
			kind: "unavailable",
			reason: "projection_rebuilding"
		};
		throw error;
	}
	if (result.kind !== "page") return result;
	const { events, ...page } = result;
	return {
		...page,
		entries: events.flatMap((entry) => projectVisibleMessageEntry({
			event: entry.event,
			parentId: entry.parentId,
			seq: entry.seq
		}))
	};
}
/**
* Reads visible transcript message entries by scoped identity.
*
* This is a branch-safe message projection over the current full transcript
* read. `seq` is ordered read metadata, not a resumable cursor.
*/
async function readVisibleSessionTranscriptMessageEntries(params) {
	return selectVisibleTranscriptEventEntries(await readSessionTranscriptEvents(params)).flatMap(projectVisibleMessageEntry);
}
/**
* Reads the latest visible assistant text by scoped identity.
*/
async function readLatestAssistantTextByIdentity(params) {
	const scope = bindSessionTranscriptStoreScope(params);
	const { readRestoredSessionTranscript } = await import("./session-cold-storage-read-CGWPlbiu.mjs");
	return readRestoredSessionTranscript(scope, () => loadLatestAssistantText(scope));
}
/**
* Appends a delivery-mirror assistant message through the SQLite transcript accessor.
*/
async function appendAssistantMirrorMessageByIdentity(params) {
	params.signal?.throwIfAborted();
	const text = resolveMirroredTranscriptText({
		...params.mediaUrls !== void 0 ? { mediaUrls: params.mediaUrls } : {},
		...params.text !== void 0 ? { text: params.text } : {}
	});
	if (!text) return {
		ok: false,
		reason: "empty message"
	};
	let message = createAssistantMirrorMessage({
		...params.deliveryMirror !== void 0 ? { deliveryMirror: params.deliveryMirror } : {},
		...params.idempotencyKey !== void 0 ? { idempotencyKey: params.idempotencyKey } : {},
		text
	});
	const scope = bindSessionTranscriptStoreScope(params, params.config);
	return await withTranscriptWriteLock(scope, async (locked) => {
		params.signal?.throwIfAborted();
		const currentEntry = loadSessionEntry(scope);
		if (!currentEntry?.sessionId) return {
			ok: false,
			reason: "missing active session",
			code: "blocked"
		};
		if (params.sessionId && currentEntry.sessionId !== params.sessionId) return {
			ok: false,
			reason: "session changed",
			code: "session-rebound"
		};
		const latestEquivalentAssistantId = !params.idempotencyKey && isDeliveryMirrorAssistantMessage(message) ? findLatestEquivalentAssistantMessageId(selectVisibleTranscriptEvents(await locked.readEvents()), message, params.config) : void 0;
		if (latestEquivalentAssistantId) return {
			ok: true,
			messageId: latestEquivalentAssistantId
		};
		if (params.deliveryMirror?.kind === "channel-final" && params.idempotencyKey) {
			const key = params.idempotencyKey.trim();
			const facts = await locked.readMessageFacts({ idempotencyKeys: [key] });
			let sourceAssistantMessageId;
			if (facts.existingIdempotencyKeys.has(key)) {
				const stored = facts.messagesByIdempotencyKey.get(key);
				const marker = isRecord(stored) ? stored.openclawDeliveryMirror : void 0;
				if (isRecord(marker) && typeof marker.sourceAssistantMessageId === "string") sourceAssistantMessageId = marker.sourceAssistantMessageId;
			} else {
				let events;
				try {
					const latest = readLatestSessionTranscriptMessageEvent({
						...scope,
						sessionId: currentEntry.sessionId
					});
					events = latest ? [latest.event] : [];
				} catch (error) {
					if (!isSessionTranscriptProjectionUnavailableError(error)) throw error;
					events = selectVisibleTranscriptEvents(await locked.readEvents());
				}
				sourceAssistantMessageId = findLatestEquivalentAssistantMessageId(events, message, params.config, true);
			}
			message = {
				...message,
				openclawDeliveryMirror: {
					kind: "channel-final",
					...params.deliveryMirror.sourceMessageId !== void 0 ? { sourceMessageId: params.deliveryMirror.sourceMessageId } : {},
					...sourceAssistantMessageId !== void 0 ? { sourceAssistantMessageId } : {}
				}
			};
		}
		params.signal?.throwIfAborted();
		const appendResult = await locked.appendMessage({
			...params.config !== void 0 ? { config: params.config } : {},
			...params.idempotencyKey ? { idempotencyLookup: "scan" } : {},
			message
		});
		if (!appendResult) return {
			ok: false,
			reason: "message skipped",
			code: "blocked"
		};
		if (params.updateMode !== "none" && appendResult.appended) {
			params.signal?.throwIfAborted();
			await publishTranscriptUpdate(scope, { messageId: appendResult.messageId });
		}
		return {
			ok: true,
			messageId: appendResult.messageId
		};
	});
}
/**
* Appends an already-canonical transcript message by scoped transcript target.
* Media-bearing user turns use ordered `message.__openclaw.media` facts; this
* low-level API does not infer deprecated top-level Media* projections.
*/
async function appendSessionTranscriptMessageByIdentity(params) {
	return await appendTranscriptMessage(bindSessionTranscriptStoreScope(params, params.config), params);
}
/** Appends one message while preserving distinct suppression and session-rebind outcomes. */
async function appendSessionTranscriptMessageByIdentityStrict(params) {
	const expectedSessionId = params.sessionId?.trim();
	if (!expectedSessionId) throw new Error("Cannot strictly append a transcript message without an exact session id");
	const turn = await persistSessionTranscriptTurn(params, {
		...params.config ? { config: params.config } : {},
		...params.cwd ? { cwd: params.cwd } : {},
		expectedSessionId,
		runId: params.runId,
		messages: [{
			...params.eventId !== void 0 ? { eventId: params.eventId } : {},
			...params.idempotencyLookup !== void 0 ? { idempotencyLookup: params.idempotencyLookup } : {},
			message: params.message,
			...params.now !== void 0 ? { now: params.now } : {},
			...params.parentId !== void 0 ? { parentId: params.parentId } : {},
			...params.prepareMessageAfterIdempotencyCheck ? { prepareMessageAfterIdempotencyCheck: (message) => params.prepareMessageAfterIdempotencyCheck?.(message) } : {},
			...params.useRawWhenLinear !== void 0 ? { useRawWhenLinear: params.useRawWhenLinear } : {}
		}],
		updateMode: params.updateMode ?? "none"
	});
	if (turn.rejectedReason) return {
		kind: "rejected",
		reason: turn.rejectedReason
	};
	const result = turn.messages[0];
	return result ? {
		kind: "result",
		result
	} : { kind: "suppressed" };
}
/**
* Atomically appends one ordered, already-hooked message group. Preparation and
* redaction finish before SQLite begins; this is the canonical future harness seam.
*/
async function appendSessionTranscriptMessagesByIdentity(params) {
	return await appendTranscriptMessages(params, params);
}
/**
* Publishes a transcript update by scoped transcript target.
*/
async function publishSessionTranscriptUpdateByIdentity(params) {
	const target = await resolveSessionTranscriptRuntimeTarget(params);
	await publishTranscriptUpdate({
		...params,
		...target
	}, params.update);
}
/**
* Runs transcript work under the write lock for the resolved scoped target.
*/
async function withSessionTranscriptWriteLock(params, run) {
	return await withProjectedSessionTranscriptWriteLock(params, run, (context) => context);
}
function createAssistantMirrorMessage(params) {
	return {
		role: "assistant",
		content: [{
			type: "text",
			text: params.text
		}],
		api: "openai-responses",
		provider: "openclaw",
		model: "delivery-mirror",
		usage: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0,
			totalTokens: 0,
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0,
				total: 0
			}
		},
		stopReason: "stop",
		timestamp: Date.now(),
		...params.idempotencyKey ? { idempotencyKey: params.idempotencyKey } : {},
		...params.deliveryMirror ? { openclawDeliveryMirror: {
			kind: params.deliveryMirror.kind,
			...params.deliveryMirror.sourceMessageId !== void 0 ? { sourceMessageId: params.deliveryMirror.sourceMessageId } : {},
			...params.deliveryMirror.kind === "channel-final-suppressed" ? { reason: params.deliveryMirror.reason } : {}
		} } : {}
	};
}
function findLatestEquivalentAssistantMessageId(events, message, config, excludeDeliveryMirrors = false) {
	const expectedText = extractAssistantMirrorComparableText(message, config);
	if (!expectedText) return;
	for (let index = events.length - 1; index >= 0; index -= 1) {
		const event = events[index];
		if (!event || typeof event !== "object") continue;
		const record = event;
		const candidate = record.message;
		if (!candidate) continue;
		if (candidate.role !== "assistant" || excludeDeliveryMirrors && isDeliveryMirrorAssistantMessage(candidate)) return;
		return extractAssistantMirrorComparableText(candidate, config) === expectedText && typeof record.id === "string" && record.id ? record.id : void 0;
	}
}
function extractAssistantMirrorComparableText(message, config) {
	const redacted = redactTranscriptMessage(message, config);
	return extractAssistantPhaseText(redacted)?.trim() || void 0;
}
function isDeliveryMirrorAssistantMessage(message) {
	return message.provider === "openclaw" && message.model === "delivery-mirror";
}
function isAgentMessageRecord(value) {
	return isRecord(value) && readNonBlankString(value.role) !== void 0;
}
function projectVisibleMessageEntry(entry) {
	const event = entry.event;
	if (!isRecord(event) || event.type !== "message") return [];
	const entryId = readNonBlankString(event.id);
	const message = event.message;
	if (!entryId || !isAgentMessageRecord(message)) return [];
	const createdAt = readNonBlankString(event.timestamp);
	const idempotencyKey = readNonBlankString(message.idempotencyKey);
	return [{
		entryId,
		parentId: entry.parentId,
		seq: entry.seq,
		message,
		role: message.role,
		...createdAt ? { createdAt } : {},
		...idempotencyKey ? { idempotencyKey } : {}
	}];
}
function projectPublicTarget(target) {
	const agentId = normalizeAgentId(target.agentId);
	return {
		agentId,
		memoryKey: formatSessionTranscriptMemoryHitKey({
			agentId,
			sessionId: target.sessionId
		}),
		sessionId: target.sessionId,
		sessionKey: target.sessionKey,
		targetKind: target.targetKind
	};
}
//#endregion
export { createSessionCatalogGitHubLinker as _, appendSessionYieldContext as a, readSessionTranscriptEvents as c, readVisibleSessionTranscriptMessageEntries as d, resolveSessionTranscriptIdentity as f, readSessionTranscriptCatalogTitle as g, readSessionTranscriptCatalogPage as h, appendSessionTranscriptMessagesByIdentity as i, readSessionTranscriptRawDelta as l, withSessionTranscriptWriteLock as m, appendSessionTranscriptMessageByIdentity as n, publishSessionTranscriptUpdateByIdentity as o, resolveSessionTranscriptTarget as p, appendSessionTranscriptMessageByIdentityStrict as r, readLatestAssistantTextByIdentity as s, appendAssistantMirrorMessageByIdentity as t, readSessionTranscriptVisibleMessageDelta as u, createSessionCatalogSourceActorProjector as v };
