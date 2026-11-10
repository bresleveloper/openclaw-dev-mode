import { m as readNonBlankString } from "./string-coerce-1VuiLaaR.mjs";
import { R as timestampMsToIsoString, v as parseDateFirstTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { Jn as string, Pn as number, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { n as captureOpenClawStateReadWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as executeExistingOpenClawStateRead, u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { a as captureExternalSessionCommitGuard, o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-CSDERtm3.mjs";
import { s as readSessionTranscriptRunId } from "./transcript-events-D3brcRJS.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { o as resolveSessionStorePathForScope } from "./session-store-path-BQkYPc4_.mjs";
import { l as makeZeroUsageSnapshot } from "./usage-BqbJmOEZ.mjs";
import { _ as selectStoredGitHubIdentities } from "./user-profile-identity.read-DXpuvx74.mjs";
import { m as sessionCreatorProfileId } from "./session-entry-lineage-B7Mubzwj.mjs";
import { S as isSuppressedControlReplyText, l as isAssistantTextContentType } from "./chat-display-projection.helpers-DvBIoDrj.mjs";
import { n as projectSessionDisplayMessage } from "./session-display-projection-DDhSj356.mjs";
import { l as readTranscriptSenderIdentity } from "./user-turn-transcript.metadata-CtXLmxDa.mjs";
import { s as normalizeVisibleDeltaLimits } from "./session-accessor.sqlite-visible-cursor-CwElG0zY.mjs";
import { n as projectAssistantTranscriptText } from "./transcript-assistant-delivery-read-Bhw3HBCv.mjs";
import { i as sqliteMessageEventWithSeq } from "./session-transcript-entry-message-Q75Efb-t.mjs";
import { r as isSessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { i as normalizeRawDeltaLimits } from "./session-transcript-raw-cursor-fGQxJVDh.mjs";
import { n as selectVisibleTranscriptEvents, t as selectVisibleTranscriptEventEntries } from "./transcript-visible-events-Ct6pwJvk.mjs";
import { r as getSessionActorStorageBinding } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { t as SessionTranscriptColdError } from "./session-cold-storage-state-CWFSrppd.mjs";
import { g as targetDiscoveryLane } from "./session-transcript-worker-resources-D1956Oac.mjs";
import { i as readSessionEntryReadOnlyInWorker, l as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { a as persistSessionTranscriptTurn, i as appendTranscriptMessages, n as appendSessionTranscriptReport } from "./session-accessor-Czw4l8kI.mjs";
import { f as sanitizeTranscriptMessage } from "./session-accessor.sqlite-transcript-store-Dp-yP34B.mjs";
import { y as withSessionTranscriptWriteAssertion } from "./transcript-write-context-C02sC3zd.mjs";
import { n as publishTranscriptUpdate } from "./session-accessor.sqlite-events-B20eyHIG.mjs";
import { t as loadSessionTranscriptEvents } from "./session-transcript-events-BFcYGLfY.mjs";
import { t as prepareSessionTranscriptHydration } from "./session-transcript-hydration-OIv_abWd.mjs";
import { l as withTranscriptWriteSequence, r as appendTranscriptMessage } from "./session-accessor.sqlite-transcript-write-B1_nzUQQ.mjs";
import { t as assertLegacyTranscriptPreparation } from "./session-transcript-preparation-HBORI9r1.mjs";
import { o as resolveSessionTranscriptRuntimeTarget, t as bindSessionTranscriptStoreScope } from "./session-accessor.transcript-target-DDngfM5X.mjs";
import { t as withCurrentProjectionSnapshot } from "./session-accessor.sqlite-active-projection-BECHzdvs.mjs";
import { n as recordAssistantManagedMediaUrls } from "./transcript-assistant-delivery-CHjQRvEC.mjs";
import { a as resolveMirroredTranscriptText, o as readLatestTranscriptAssistantTextAsync } from "./transcript-BSOdHT4f.mjs";
import { t as deriveSessionTitle } from "./session-utils-core-DYhQWF9T.mjs";
import { t as resolveCurrentUserProfileDisplay } from "./current-user-profile-display-84IsFWS2.mjs";
import { i as projectSessionActor, o as projectSessionParticipant } from "./session-identity-projection-sgwF_hD_.mjs";
import "./prompt-image-input-Urne2gUL.mjs";
import { t as getUserProfileDisplaysNative } from "./user-profile-list.native-CFnyItI2.mjs";
import "./command-transcript-BC0eYRaf.mjs";
import { s as projectChatDisplayMessages } from "./chat-display-projection.core-DdRZ3VIg.mjs";
import { a as readSessionTranscriptHistoryEventPageFromProjection } from "./session-accessor.sqlite-history-query-CeElVTvK.mjs";
import { t as buildSessionsYieldContextMessage } from "./sessions-yield-context-Dz12h_Az.mjs";
import { t as withSessionTranscriptDeltaReader } from "./session-transcript-delta-read-sYs0Hdkh.mjs";
import { t as readSessionHistoryPageInWorker } from "./session-history-worker-runtime-UlzjKIVK.mjs";
import "./chat-display-projection-CHqVAi8U.mjs";
import { t as formatSessionTranscriptMemoryHitKey } from "./session-transcript-memory-hit-DQ5oaXTM.mjs";
import { t as withProjectedSessionTranscriptWriteLock } from "./session-transcript-lock-runtime-TDv7B3qm.mjs";
import { createHash } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/session-accessor.sqlite-history-events.ts
function readSessionTranscriptHistoryEventPage(scope, options) {
	return withCurrentProjectionSnapshot(scope, (projection) => readSessionTranscriptHistoryEventPageFromProjection(projection, options), options);
}
//#endregion
//#region src/gateway/session-catalog-identity.ts
async function prepareIdentityFacts(input) {
	const context = captureOpenClawStateReadWorkerContext();
	const reply = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, {
		type: "userProfiles.catalogIdentity",
		input
	}, {
		context,
		current: true
	});
	context.admission.assertCurrent();
	if (reply && (!reply.ok || reply.type !== "userProfiles.catalogIdentity")) throw new Error("Session catalog identity reader returned an unexpected result");
	const result = reply?.result ?? {
		profiles: /* @__PURE__ */ new Map(),
		accounts: /* @__PURE__ */ new Map(),
		owners: /* @__PURE__ */ new Map()
	};
	return {
		...result,
		assertCurrent: context.admission.assertCurrent,
		readProfile(id) {
			return result.profiles.get(id)?.facts ?? {
				profileId: id,
				profile: void 0,
				github: void 0
			};
		}
	};
}
function sourceLabel(value) {
	const text = value?.trim();
	return text ? truncateUtf16Safe(text, 200) : void 0;
}
function verifiedGitHubIdentities(profileIds) {
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => tableExists(db, "user_profile_identities") ? selectStoredGitHubIdentities(db, profileIds) : void 0);
}
function readSourceProfileFacts(id) {
	const profile = getUserProfileDisplaysNative([id]).get(id);
	const profileId = profile?.id ?? id;
	return {
		profileId,
		profile,
		github: verifiedGitHubIdentities([profileId])?.get(profileId)?.primary
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
/** Prepare one sender cohort off-thread; synchronous projection never opens profile storage. */
async function prepareSessionCatalogSourceParticipantProjector(identities) {
	const ids = [...new Set(identities.flatMap((identity) => identity.type === "profile" ? [identity.id] : []))];
	const prepared = ids.length ? await prepareIdentityFacts({
		kind: "source",
		profileIds: ids
	}) : void 0;
	return { project: (params) => projectSourceParticipant(params, (id) => {
		if (!prepared) throw new Error("Session catalog sender was not prepared");
		return prepared.readProfile(id);
	}) };
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
/**
* Prepare portable creator claims for one synchronous page; claims never grant access.
* @deprecated Use prepareSessionCatalogSourceActorProjector before rendering the page. Final compatibility day: 2026-12-31.
*/
function createSessionCatalogSourceActorProjector(params) {
	warnPluginSdkDeprecation({
		family: "session-catalog-identity",
		method: "createSessionCatalogSourceActorProjector",
		replacement: "await prepareSessionCatalogSourceActorProjector before rendering the page"
	});
	const ids = [...new Set(params.actors.flatMap((actor) => {
		const id = sessionCreatorProfileId(actor);
		return id ? [id] : [];
	}))];
	let facts;
	return (actor) => {
		const requestedId = actor && sessionCreatorProfileId(actor);
		let requestedProfile;
		if (requestedId) {
			if (!facts) {
				const profiles = getUserProfileDisplaysNative(ids);
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
			}
			requestedProfile = facts.get(requestedId) ?? readSourceProfileFacts(requestedId);
		}
		return projectSourceActor({
			...params,
			actor
		}, (id) => requestedProfile ?? {
			profileId: id,
			profile: void 0,
			github: void 0
		});
	};
}
/** Prepare portable creator claims at the profile reader before synchronous page disclosure. */
async function prepareSessionCatalogSourceActorProjector(params) {
	const ids = [...new Set(params.actors.flatMap((actor) => {
		const id = sessionCreatorProfileId(actor);
		return id ? [id] : [];
	}))];
	const prepared = ids.length ? await prepareIdentityFacts({
		kind: "source",
		profileIds: ids
	}) : void 0;
	return (actor) => projectSourceActor({
		...params,
		actor
	}, (id) => {
		if (!prepared) throw new Error("Session catalog creator was not prepared");
		return prepared.readProfile(id);
	});
}
/** Link only the selected page's portable claims; these display facts never grant access. */
async function prepareSessionCatalogGitHubLinker(params) {
	const accountIds = [...new Set(params.participants.flatMap(({ identity }) => identity.type === "remote" && identity.idKind === "github-account" ? [identity.id] : []))];
	if (accountIds.length === 0 && !params.owners?.length) return {
		assertCurrent() {},
		linkParticipant(participant) {
			return participant;
		},
		resolveOwner(_owner) {}
	};
	const prepared = await prepareIdentityFacts({
		kind: "link",
		accountIds,
		owners: params.owners ?? []
	});
	const profiles = /* @__PURE__ */ new Map();
	const prepareDisplay = (id) => {
		if (!profiles.has(id)) {
			const display = resolveCurrentUserProfileDisplay(id, () => prepared.readProfile(id).profile);
			profiles.set(id, display.kind === "resolved" ? display : void 0);
		}
	};
	return {
		assertCurrent: prepared.assertCurrent,
		linkParticipant(participant) {
			const { identity } = participant;
			const id = identity.type === "remote" && identity.idKind === "github-account" ? prepared.accounts.get(identity.id) : void 0;
			if (!id) return participant;
			prepareDisplay(id);
			return projectSessionParticipant({
				type: "profile",
				id
			}, profiles);
		},
		resolveOwner(owner) {
			const id = prepared.owners.get(owner);
			const profile = id ? prepared.readProfile(id).profile : void 0;
			if (!profile) return;
			prepareDisplay(id);
			profiles.set(profile.id, profiles.get(id));
			return projectSessionActor({
				type: "human",
				id: profile.id
			}, profiles);
		}
	};
}
/**
* Snapshot attribution links once per catalog page; claims never grant access.
* @deprecated Use prepareSessionCatalogGitHubLinker before rendering the page. Final compatibility day: 2026-12-31.
*/
function createSessionCatalogGitHubLinker() {
	warnPluginSdkDeprecation({
		family: "session-catalog-identity",
		method: "createSessionCatalogGitHubLinker",
		replacement: "await prepareSessionCatalogGitHubLinker before rendering the page"
	});
	const profilesByAccountId = /* @__PURE__ */ new Map();
	const profilesByLogin = /* @__PURE__ */ new Map();
	const profiles = /* @__PURE__ */ new Map();
	const prepareDisplay = (id) => {
		if (!profiles.has(id)) {
			const profile = getUserProfileDisplaysNative([id]).get(id);
			const display = resolveCurrentUserProfileDisplay(id, () => profile);
			profiles.set(id, display.kind === "resolved" ? display : void 0);
			if (display.kind === "resolved") profiles.set(display.profileId, display);
		}
	};
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
			if (profileId) prepareDisplay(profileId);
			return profileId ? projectSessionParticipant({
				type: "profile",
				id: profileId
			}, profiles) : participant;
		},
		resolveOwner(owner) {
			const profileId = owner.startsWith("profile:") ? owner.slice(8) : owner.startsWith("github:") ? profilesByLogin.get(owner.slice(7).toLowerCase()) : void 0;
			if (!profileId) return;
			prepareDisplay(profileId);
			const profile = profiles.get(profileId);
			return profile ? projectSessionActor({
				type: "human",
				id: profile.profileId
			}, profiles) : void 0;
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
async function readCatalogHistoryPage(scope, options) {
	const page = await readSessionHistoryPageInWorker({
		kind: "history-event-page",
		params: {
			target: scope,
			options: {
				...options,
				maxBytes: MAX_CATALOG_READ_BYTES
			}
		}
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
	const redacted = text;
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
	const timestampText = timestampMsToIsoString(parseDateFirstTimestampMs(message.timestamp ?? metadata?.recordTimestampMs));
	return (Array.isArray(message.content) ? message.content : [message.content ?? message.text]).flatMap((block, index) => {
		const item = projectContentItem(message.role, block);
		if (!item) return [];
		return [Object.assign(item, {
			...metadata?.truncated === true ? { truncated: true } : {},
			...typeof metadata?.id === "string" ? { id: `${metadata.id}:${index}` } : {},
			...timestampText ? { timestamp: timestampText } : {},
			...typeof message.model === "string" ? { model: message.model.slice(0, 200) } : {},
			...sender ? { sender } : {}
		})];
	}).toReversed();
}
/** Reads conversation text without joining the source Gateway's writer lifecycle. */
async function readSessionTranscriptCatalogPage(params) {
	const cursor = decodeCursor(params.cursor);
	if (!Number.isSafeInteger(params.limit) || params.limit < 1 || params.limit > MAX_CATALOG_ITEMS) throw new Error(`Session transcript limit must be an integer from 1 to ${MAX_CATALOG_ITEMS}.`);
	const storePath = resolveSessionStorePathForScope(params);
	return withSessionEntryReadOnlyInWorker({
		...params,
		storePath
	}, () => {}, async (read, owner) => {
		if (!read.ok) throw read.error;
		if (!read.value) throw new Error("Session not found; refresh the session catalog.");
		return readCatalogPageFromEntry({
			...params,
			storePath
		}, read.value, cursor, owner.assertCurrent);
	});
}
async function readCatalogPageFromEntry(params, entry, cursor, assertSourceCurrent) {
	const storePath = params.storePath;
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
	const snapshot = await readCatalogHistoryPage(scope, {
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
		if ((await readCatalogHistoryPage(scope, {
			offset: snapshot.totalMessages - cursor.anchor.seq,
			maxMessages: 1
		})).events[0]?.eventSeq !== cursor.anchor.eventSeq) throw new Error("Session transcript cursor no longer matches this session; reload the session.");
	}
	const limit = params.limit;
	let before = cursor?.before ?? snapshot.totalMessages;
	let skip = cursor?.skip ?? 0;
	let scanned = 0;
	const items = [];
	const senderProjectors = /* @__PURE__ */ new Map();
	while (before > 0 && items.length < limit && scanned < MAX_CATALOG_SCAN_MESSAGES) {
		const page = await readCatalogHistoryPage(scope, {
			offset: snapshot.totalMessages - before,
			maxMessages: Math.min(before, limit + 1)
		});
		const projected = projectChatDisplayMessages(page.events.map(sqliteMessageEventWithSeq), {
			maxChars: MAX_CATALOG_TEXT_CHARS,
			resolveCronJobName: () => void 0
		});
		const identities = projected.flatMap((message) => {
			const metadata = asOptionalRecord(message["__openclaw"]);
			const identity = message.role === "user" ? readTranscriptSenderIdentity(metadata?.senderIdentity) : void 0;
			return identity && (identity.type !== "profile" || !senderProjectors.has(identity.id)) ? [identity] : [];
		});
		const preparedSender = await prepareSessionCatalogSourceParticipantProjector(identities);
		for (const identity of identities) if (identity.type === "profile") senderProjectors.set(identity.id, preparedSender);
		const projectSender = (sender) => sender.identity.type === "profile" ? senderProjectors.get(sender.identity.id).project(sender) : preparedSender.project(sender);
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
	assertSourceCurrent();
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
/** @deprecated Use readSessionTranscriptCatalogTitleAsync. */
function readLegacySessionTranscriptCatalogTitle(params) {
	const title = deriveSessionTitle(params.entry);
	if (title) return boundedText(title).text;
	const scope = {
		...params,
		storePath: resolveSessionStorePathForScope(params),
		sessionId: params.entry.sessionId,
		sessionEntry: params.entry
	};
	try {
		const snapshot = readSessionTranscriptHistoryEventPage(scope, {
			offset: 0,
			maxMessages: 0,
			readOnly: true
		});
		const page = readSessionTranscriptHistoryEventPage(scope, {
			offset: Math.max(0, snapshot.totalMessages - 100),
			maxMessages: 100,
			maxBytes: MAX_CATALOG_READ_BYTES,
			readOnly: true
		});
		return deriveCatalogHistoryTitle(params.entry, page);
	} catch (error) {
		if (!(error instanceof SessionTranscriptColdError)) throw error;
	}
}
/** Matches title precedence without opening SQLite on the Gateway thread. */
async function readSessionTranscriptCatalogTitleAsync(params) {
	const title = deriveSessionTitle(params.entry);
	if (title) return boundedText(title).text;
	const scope = {
		...params,
		storePath: resolveSessionStorePathForScope(params),
		sessionId: params.entry.sessionId,
		sessionEntry: params.entry
	};
	try {
		const page = await readSessionHistoryPageInWorker({
			kind: "history-event-page",
			params: {
				target: scope,
				options: {
					offset: 0,
					beforeSeq: 101,
					maxMessages: 100,
					maxBytes: MAX_CATALOG_READ_BYTES
				}
			}
		});
		return deriveCatalogHistoryTitle(params.entry, page);
	} catch (error) {
		if (!(error instanceof SessionTranscriptColdError)) throw error;
	}
}
function deriveCatalogHistoryTitle(entry, page) {
	if (page.olderOffset !== void 0 || page.omittedOversized) return;
	for (const event of page.events) {
		const message = projectSessionDisplayMessage(sqliteMessageEventWithSeq(event));
		if (message?.role === "user") {
			const derived = deriveSessionTitle(entry, message.text);
			return derived ? boundedText(derived).text : void 0;
		}
	}
}
//#endregion
//#region src/plugin-sdk/session-transcript-mirror-correlation.ts
function findLatestEquivalentAssistantMessageId(events, message, excludeDeliveryMirrors = false) {
	const expected = projectAssistantMirrorComparable(message);
	if (!expected) return;
	for (let index = events.length - 1; index >= 0; index -= 1) {
		const event = events[index];
		if (!isRecord(event)) continue;
		const candidate = event.message;
		if (!candidate) continue;
		if (!isAgentMessageRecord(candidate)) return;
		if (candidate.role !== "assistant" || excludeDeliveryMirrors && isDeliveryMirrorAssistantMessage(candidate)) return;
		const actual = projectAssistantMirrorComparable(candidate);
		return (excludeDeliveryMirrors ? actual?.text === expected.text : isDeepStrictEqual(actual, expected)) && typeof event.id === "string" && event.id ? event.id : void 0;
	}
}
function findEquivalentAssistantMessageInRun(events, message, runId) {
	const expected = projectAssistantMirrorComparable(message);
	if (!expected) return;
	const correlatedIds = /* @__PURE__ */ new Set();
	for (const event of events) {
		if (!isRecord(event) || !isRecord(event.message)) continue;
		const marker = event.message.openclawDeliveryMirror;
		if (isRecord(marker) && typeof marker.sourceAssistantMessageId === "string") correlatedIds.add(marker.sourceAssistantMessageId);
	}
	for (const event of events) {
		if (!isRecord(event) || !isAgentMessageRecord(event.message) || typeof event.id !== "string") continue;
		const candidate = event.message;
		if (candidate.role === "assistant" && !isDeliveryMirrorAssistantMessage(candidate) && readSessionTranscriptRunId(candidate) === runId && !correlatedIds.has(event.id) && projectAssistantMirrorComparable(candidate)?.text === expected.text) return event.id;
	}
}
function projectAssistantMirrorComparable(message) {
	const normalized = sanitizeTranscriptMessage(message);
	const projected = projectAssistantTranscriptText(normalized);
	return projected ? {
		text: projected.text.trim(),
		mediaUrls: projected.openclawDelivery?.mediaUrls ?? []
	} : void 0;
}
function isDeliveryMirrorAssistantMessage(message) {
	return message.provider === "openclaw" && message.model === "delivery-mirror";
}
function isAgentMessageRecord(value) {
	return isRecord(value) && readNonBlankString(value.role) !== void 0;
}
//#endregion
//#region src/plugin-sdk/session-transcript-runtime.ts
/** @deprecated Await readSessionTranscriptCatalogTitleAsync. Final compatibility day: 2026-12-31. */
function readSessionTranscriptCatalogTitle(params) {
	warnPluginSdkDeprecation({
		family: "session-catalog-title",
		method: "readSessionTranscriptCatalogTitle",
		replacement: "readSessionTranscriptCatalogTitleAsync"
	});
	return readLegacySessionTranscriptCatalogTitle(params);
}
/** Compose prepared owner assertions; unprepared SDK callbacks retain native transaction visibility. */
function composeSessionTranscriptWriteAssertion(sources, check) {
	return composeSessionSourceAssertion(sources.map(captureExternalSessionCommitGuard), check, {
		hasOpaqueCheck: check !== void 0,
		preparedCheck: (assertSources) => assertSources()
	});
}
/** Persists a successful yield's private context through the admitted session writer. */
async function appendSessionYieldContext(params) {
	const { message, assertCurrent, config, ...scope } = params;
	assertCurrent();
	const target = bindSessionTranscriptStoreScope(scope, config);
	const result = await withSessionTranscriptWriteAssertion(target, assertCurrent, () => appendSessionTranscriptReport(target, {
		kind: "custom",
		customTypes: [],
		selectReport: () => buildSessionsYieldContextMessage(message)
	}));
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
	return {
		...await resolveSessionTranscriptIdentity(params),
		targetKind: "runtime-session"
	};
}
/**
* Reads transcript events by public session identity instead of file path.
*/
async function readSessionTranscriptEvents(params) {
	return await loadSessionTranscriptEvents(bindSessionTranscriptStoreScope(params));
}
/** Reads one bounded raw page; the opaque cursor survives append and resets after replacement. */
async function readSessionTranscriptRawDelta(params) {
	const { cursor, maxBytes, maxEvents, ...target } = params;
	const scope = bindSessionTranscriptStoreScope(target);
	normalizeRawDeltaLimits({
		maxBytes,
		maxEvents
	});
	return withSessionTranscriptDeltaReader(scope, (reader) => reader.raw({
		...cursor !== void 0 ? { cursor } : {},
		...maxBytes !== void 0 ? { maxBytes } : {},
		...maxEvents !== void 0 ? { maxEvents } : {}
	}));
}
/** Reads one bounded active-path page that resumes appends and resets after discontinuities. */
async function readSessionTranscriptVisibleMessageDelta(params) {
	const { cursor, maxBytes, maxMessages, ...target } = params;
	const scope = bindSessionTranscriptStoreScope(target);
	normalizeVisibleDeltaLimits({
		maxBytes,
		maxMessages
	});
	let result;
	try {
		result = await withSessionTranscriptDeltaReader(scope, (reader) => reader.visible({
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
		entries: events.flatMap(projectVisibleMessageEntry)
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
* Reads the latest persisted assistant text by scoped identity.
*/
async function readLatestAssistantTextByIdentity(params) {
	const scope = bindSessionTranscriptStoreScope(params);
	return readLatestTranscriptAssistantTextAsync(scope);
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
		mediaUrls: params.mediaUrls,
		text
	});
	const sourceRunId = params.sourceRunId;
	const scope = bindSessionTranscriptStoreScope(params, params.config);
	return await withTranscriptWriteSequence(scope, async (locked) => {
		const memory = getSessionActorStorageBinding(scope);
		params.signal?.throwIfAborted();
		const currentEntry = memory ? memory.actor.snapshot(memory.authority)?.entry : await readSessionEntryReadOnlyInWorker(scope, () => {
			params.signal?.throwIfAborted();
		}, void 0, targetDiscoveryLane);
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
		const latestEquivalentAssistantId = !params.idempotencyKey && isDeliveryMirrorAssistantMessage(message) ? findLatestEquivalentAssistantMessageId(selectVisibleTranscriptEvents(await locked.readEvents()), message) : void 0;
		if (latestEquivalentAssistantId) return {
			ok: true,
			messageId: latestEquivalentAssistantId
		};
		if (params.deliveryMirror?.kind === "channel-final" && params.idempotencyKey) {
			const key = params.idempotencyKey.trim();
			const facts = await locked.readMessageFacts({
				idempotencyKeys: [key],
				sourceRunId
			});
			const authored = createAssistantMirrorMessage({ text: params.text ?? "" });
			let sourceAssistantMessageId;
			if (facts.existingIdempotencyKeys.has(key)) {
				const stored = facts.messagesByIdempotencyKey.get(key);
				const marker = isRecord(stored) ? stored.openclawDeliveryMirror : void 0;
				if (isRecord(marker) && typeof marker.sourceAssistantMessageId === "string") sourceAssistantMessageId = marker.sourceAssistantMessageId;
			} else if (sourceRunId) sourceAssistantMessageId = findEquivalentAssistantMessageInRun(facts.sourceEvents ?? [], authored, sourceRunId);
			else {
				let events;
				if (memory) events = selectVisibleTranscriptEvents(await locked.readEvents());
				else try {
					const latest = await prepareSessionTranscriptHydration({
						...scope,
						agentId: scope.agentId ?? resolveAgentIdFromSessionKey(scope.sessionKey),
						sessionId: currentEntry.sessionId
					}, void 0, params.signal, targetDiscoveryLane).readLatestActiveMessage();
					events = latest ? [latest.event] : [];
				} catch (error) {
					if (!isSessionTranscriptProjectionUnavailableError(error)) throw error;
					events = selectVisibleTranscriptEvents(await locked.readEvents());
				}
				sourceAssistantMessageId = findLatestEquivalentAssistantMessageId(events, authored, true);
			}
			message = {
				...message,
				...sourceRunId ? { __openclaw: { runId: sourceRunId } } : {},
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
			await locked.publishUpdate({ messageId: appendResult.messageId });
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
	assertLegacyTranscriptPreparation(params, params);
	const turn = await persistSessionTranscriptTurn(params, {
		...params.config ? { config: params.config } : {},
		...params.cwd ? { cwd: params.cwd } : {},
		expectedSessionId,
		runId: params.runId,
		messages: [{
			...params.eventId !== void 0 ? { eventId: params.eventId } : {},
			...params.expectedTranscript !== void 0 ? { expectedTranscript: params.expectedTranscript } : {},
			...params.expectedMutationAt !== void 0 ? { expectedMutationAt: params.expectedMutationAt } : {},
			...params.appendIntent !== void 0 ? { appendIntent: params.appendIntent } : {},
			...params.idempotencyLookup !== void 0 ? { idempotencyLookup: params.idempotencyLookup } : {},
			message: params.message,
			...params.now !== void 0 ? { now: params.now } : {},
			...params.parentId !== void 0 ? { parentId: params.parentId } : {},
			...params.prepareMessageAfterIdempotencyCheck ? { prepareMessageAfterIdempotencyCheck: (message) => params.prepareMessageAfterIdempotencyCheck?.(message) } : {},
			...params.preparation ? { preparation: {
				...params.preparation.prepareMessage ? { prepareMessage: (message) => params.preparation.prepareMessage(message) } : {},
				source: params.preparation.source
			} } : {},
			...params.prepareMessageAfterIdempotencyCheckAsync || params.beforeFreshMessageCommit ? { workerPreparation: {
				...params.prepareMessageAfterIdempotencyCheckAsync ? { prepareMessageAfterIdempotencyCheckAsync: (message) => params.prepareMessageAfterIdempotencyCheckAsync(message) } : {},
				beforeFreshMessageCommit: captureExternalSessionCommitGuard(params.beforeFreshMessageCommit)
			} } : {},
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
* normalization finish before SQLite begins; this is the canonical future harness seam.
*/
async function appendSessionTranscriptMessagesByIdentity(params) {
	return await appendTranscriptMessages(params, params);
}
/**
* Publishes a transcript update by scoped transcript target.
* `update.assistantItemIds` retires exact native display occurrences only after
* their row commits. It is internal provenance, not terminal/run authorization,
* and must be omitted for independently owned commentary and async rows.
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
* @deprecated Use withSessionTranscriptWrite and preparation options. Final compatibility day: 2026-12-31.
*/
async function withSessionTranscriptWriteLock(params, run) {
	return await withProjectedSessionTranscriptWriteLock(params, run, (context) => context);
}
/** Runs ordered optimistic writes; captured transcript versions fence later mutations. */
async function withSessionTranscriptWrite(params, run) {
	return await withProjectedSessionTranscriptWriteLock(params, run, (context) => context, "sequence");
}
function createAssistantMirrorMessage(params) {
	const message = {
		role: "assistant",
		openclawDelivery: { mediaUrls: [] },
		content: [{
			type: "text",
			text: params.text
		}],
		api: "openai-responses",
		provider: "openclaw",
		model: "delivery-mirror",
		usage: makeZeroUsageSnapshot(),
		stopReason: "stop",
		timestamp: Date.now(),
		...params.idempotencyKey ? { idempotencyKey: params.idempotencyKey } : {},
		...params.deliveryMirror ? { openclawDeliveryMirror: {
			kind: params.deliveryMirror.kind,
			...params.deliveryMirror.sourceMessageId !== void 0 ? { sourceMessageId: params.deliveryMirror.sourceMessageId } : {},
			...params.deliveryMirror.kind === "channel-final-suppressed" ? { reason: params.deliveryMirror.reason } : {}
		} } : {}
	};
	return recordAssistantManagedMediaUrls(message, params.mediaUrls);
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
//#endregion
export { prepareSessionCatalogSourceActorProjector as C, prepareSessionCatalogGitHubLinker as S, withSessionTranscriptWriteLock as _, appendSessionYieldContext as a, createSessionCatalogGitHubLinker as b, readLatestAssistantTextByIdentity as c, readSessionTranscriptRawDelta as d, readSessionTranscriptVisibleMessageDelta as f, withSessionTranscriptWrite as g, resolveSessionTranscriptTarget as h, appendSessionTranscriptMessagesByIdentity as i, readSessionTranscriptCatalogTitle as l, resolveSessionTranscriptIdentity as m, appendSessionTranscriptMessageByIdentity as n, composeSessionTranscriptWriteAssertion as o, readVisibleSessionTranscriptMessageEntries as p, appendSessionTranscriptMessageByIdentityStrict as r, publishSessionTranscriptUpdateByIdentity as s, appendAssistantMirrorMessageByIdentity as t, readSessionTranscriptEvents as u, readSessionTranscriptCatalogPage as v, createSessionCatalogSourceActorProjector as x, readSessionTranscriptCatalogTitleAsync as y };
