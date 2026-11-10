import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-iJNKNMuJ.mjs";
import { r as MAX_IMAGE_BYTES } from "./constants-GzjKtFvA.mjs";
import { t as ASSISTANT_DISPLAY_CONTENT_FIELD } from "./assistant-display-content-mzartsGP.mjs";
import { r as jsonUtf8Bytes } from "./json-utf8-bytes-C0-PtdPX.mjs";
import { o as resolveSessionPublicShare } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { i as withReadySessionRows } from "./session-row-prepared-read-CSzLs_ad.mjs";
import { c as publicSessionMessageText, s as publicSessionMessageEntry, t as projectPublicSessionItems } from "./control-ui-public-session-project-BdcQ5aRP.mjs";
import { l as sanitizeChatHistoryContentBlock } from "./chat-display-projection.core-DdRZ3VIg.mjs";
import { d as readSessionMessagesPageWithStatsAsync, o as readSessionMessageByIdAsync } from "./session-transcript-readers-ChK_-oGN.mjs";
//#region src/gateway/control-ui-public-session-read.ts
const PUBLIC_SESSION_PAGE_ITEMS = 50;
const PUBLIC_SESSION_SCAN_ROWS = 2e3;
const PUBLIC_SESSION_READ_BYTES = 1048576;
const PUBLIC_SESSION_MEDIA_ENTRY_BYTES = Math.ceil(MAX_IMAGE_BYTES * 4 / 3) + PUBLIC_SESSION_READ_BYTES;
const PUBLIC_SESSION_MAX_MESSAGES = 100;
async function readPublicSessionOpening(scope) {
	let remainingBytes = PUBLIC_SESSION_READ_BYTES;
	let history = await readSessionMessagesPageWithStatsAsync(scope, {
		offset: 0,
		beforeSeq: 2,
		maxMessages: 1,
		maxBytes: remainingBytes,
		allowResetArchiveFallback: false
	});
	let omittedOversized = history.omittedOversized;
	for (let position = 0; position < PUBLIC_SESSION_MAX_MESSAGES; position++) {
		if (position > 0) {
			history = await readSessionMessagesPageWithStatsAsync(scope, {
				offset: 0,
				beforeSeq: position + 2,
				maxMessages: 1,
				maxBytes: remainingBytes,
				allowResetArchiveFallback: false
			});
			omittedOversized ||= history.omittedOversized;
		}
		const message = history.messages[0];
		const entry = publicSessionMessageEntry(message);
		if (entry?.role === "user" && publicSessionMessageText(entry)) return {
			...history,
			messages: [message],
			olderOffset: void 0,
			omittedOversized
		};
		if (message !== void 0) remainingBytes -= Buffer.byteLength(JSON.stringify(message));
		if (position + 1 >= history.totalMessages || remainingBytes < 1024) break;
	}
	return {
		...history,
		messages: [],
		olderOffset: void 0,
		omittedOversized
	};
}
function compactInlineImagePayloads(message) {
	const entry = asOptionalRecord(message);
	if (!entry) return;
	const compacted = { ...entry };
	let hasInlineImage = false;
	for (const field of ["content", ASSISTANT_DISPLAY_CONTENT_FIELD]) {
		const content = entry[field];
		if (!Array.isArray(content)) continue;
		compacted[field] = content.map((value) => {
			const block = asOptionalRecord(value);
			const source = asOptionalRecord(block?.source);
			const imageUrl = asOptionalRecord(block?.image_url);
			if (!block || ![
				"image",
				"image_url",
				"input_image"
			].includes(String(block.type)) || ![
				block.data,
				block.blob,
				source?.data,
				source?.blob
			].some((data) => typeof data === "string" && data.length > 0) && ![
				block.url,
				block.image_url,
				imageUrl?.url,
				source?.url
			].some((url) => typeof url === "string" && url.startsWith("data:image/"))) return value;
			hasInlineImage = true;
			const projected = asOptionalRecord(sanitizeChatHistoryContentBlock(Object.assign({}, block, { type: "image" }), { maxChars: Number.MAX_SAFE_INTEGER }).block);
			return Object.assign(projected ?? {}, { type: block.type });
		});
	}
	return hasInlineImage && jsonUtf8Bytes([compacted]) <= PUBLIC_SESSION_READ_BYTES ? compacted : void 0;
}
async function readVisiblePage(scope, offset) {
	let messages = [];
	let bytes = 2;
	let nextOffset = offset;
	let totalMessages = 0;
	let truncated = false;
	let olderOffset;
	let readWindow;
	while (messages.length < PUBLIC_SESSION_SCAN_ROWS && bytes <= 1047552) {
		const page = await readSessionMessagesPageWithStatsAsync(scope, {
			offset: nextOffset,
			maxMessages: Math.min(100, PUBLIC_SESSION_SCAN_ROWS - messages.length),
			maxBytes: PUBLIC_SESSION_READ_BYTES - bytes,
			allowResetArchiveFallback: false,
			...readWindow ? {
				beforeSeq: totalMessages + 1,
				expectedReadWindow: readWindow
			} : { captureReadWindow: true }
		});
		if (page.windowReset) return null;
		if (!readWindow) {
			totalMessages = page.totalMessages;
			readWindow = page.readWindow;
		}
		if (page.omittedOversized && messages.length > 0) {
			olderOffset = nextOffset;
			break;
		}
		if (page.omittedOversized) {
			const mediaPage = await readSessionMessagesPageWithStatsAsync(scope, {
				offset: nextOffset,
				beforeSeq: totalMessages + 1,
				expectedReadWindow: readWindow,
				maxMessages: 1,
				maxBytes: PUBLIC_SESSION_MEDIA_ENTRY_BYTES,
				allowResetArchiveFallback: false
			});
			if (mediaPage.windowReset) return null;
			const compacted = mediaPage.messages.length === 1 ? compactInlineImagePayloads(mediaPage.messages[0]) : void 0;
			if (compacted) {
				messages = [compacted];
				olderOffset = page.olderOffset;
				break;
			}
		}
		messages = [...page.messages, ...messages];
		bytes += jsonUtf8Bytes(page.messages);
		olderOffset = page.olderOffset;
		truncated ||= page.omittedOversized === true;
		const items = projectPublicSessionItems(messages);
		if (items.length > PUBLIC_SESSION_PAGE_ITEMS) {
			const start = items[items.length - PUBLIC_SESSION_PAGE_ITEMS].sourceIndex;
			messages = messages.slice(start);
			olderOffset = offset + messages.length;
			break;
		}
		if (olderOffset === void 0 || page.messages.length < 100) break;
		nextOffset = olderOffset;
	}
	truncated ||= olderOffset !== void 0 && projectPublicSessionItems(messages).length < PUBLIC_SESSION_PAGE_ITEMS;
	return {
		messages,
		totalMessages,
		truncated,
		olderOffset
	};
}
function readAuthorizedTarget(cfg, locator, projection) {
	const parsed = parseAgentSessionKey(locator.sessionKey);
	const fixedOwner = resolvePersistedSessionStoreOwnerForKey(cfg, locator.sessionKey);
	if (locator.sessionKey !== "global" && (!parsed || parsed.agentId !== locator.agentId || locator.sessionKey !== `agent:${parsed.agentId}:${parsed.rest}`) || fixedOwner.kind === "retired" || fixedOwner.kind === "configured" && fixedOwner.agentId !== locator.agentId || !listAgentIds(cfg).includes(locator.agentId) || isIncognitoSessionKey(locator.sessionKey) || projection.sharingRevision === void 0 || projection.state.cfg !== cfg) return;
	const query = {
		key: locator.sessionKey,
		agentId: locator.agentId
	};
	const state = projection.sharingTargetState(query);
	if (state.status !== "ready") return;
	const target = state.target;
	const share = resolveSessionPublicShare(target.entry);
	if (target.canonicalKey !== locator.sessionKey || target.agentId !== locator.agentId || share?.id !== locator.shareId || share.sessionId !== locator.sessionId) return;
	const source = projection.readSource({
		...query,
		storePath: target.storePath
	});
	if (!source || typeof source.databaseIdentity !== "string") return;
	assertExistingDatabaseIdentity(source.path, `file:${source.databaseIdentity}`, source.databaseBirthtime);
	return {
		target,
		source
	};
}
/** The resident owner installs committed sharing facts before a response can consume them. */
function isPublicSessionShareActive(cfg, locator, projection) {
	return Boolean(readAuthorizedTarget(cfg, locator, projection));
}
/** Only the exact published generation is readable; this grants no Gateway session authority. */
async function readPublicSessionShare(cfg, locator, options) {
	const { projection } = options;
	if (isIncognitoSessionKey(locator.sessionKey) || !listAgentIds(cfg).includes(locator.agentId)) return null;
	const queries = () => [{
		key: locator.sessionKey,
		agentId: locator.agentId
	}];
	const initial = await withReadySessionRows(projection, queries, () => readAuthorizedTarget(cfg, locator, projection));
	if (!initial) return null;
	const scope = {
		agentId: initial.source.agentId,
		sessionKey: locator.sessionKey,
		sessionId: locator.sessionId,
		storePath: initial.source.path,
		sessionEntry: initial.target.entry
	};
	const history = options.card ? await readPublicSessionOpening(scope) : await readVisiblePage(scope, options.offset ?? 0);
	if (!history) return null;
	const resolveCardFacts = options.card ? (await import("./control-ui-public-session-card-facts-rrUsjvTh.mjs")).resolvePublicSessionCardFacts : void 0;
	return withReadySessionRows(projection, queries, (read) => {
		const current = readAuthorizedTarget(cfg, locator, projection);
		if (!current || current.source.path !== initial.source.path || current.source.databaseIdentity !== initial.source.databaseIdentity || current.source.databaseBirthtime !== initial.source.databaseBirthtime) return null;
		const title = (current.target.entry.label || current.target.entry.displayName || "Shared session").trim();
		const record = options.card ? read.describe(queries()[0]) : void 0;
		return {
			title: title || "Shared session",
			messages: history.messages,
			totalMessages: history.totalMessages,
			truncated: "truncated" in history ? history.truncated : history.omittedOversized === true,
			...record && resolveCardFacts ? { cardFacts: resolveCardFacts({
				cfg,
				record,
				rowContext: read.state.rowContext,
				pullRequests: options.pullRequests
			}) } : {},
			...history.olderOffset !== void 0 ? { olderOffset: history.olderOffset } : {}
		};
	});
}
/** Media reads share the page's exact publication and physical-store authority. */
async function readPublicSessionMessage(cfg, locator, options) {
	const { projection } = options;
	if (isIncognitoSessionKey(locator.sessionKey) || !listAgentIds(cfg).includes(locator.agentId)) return null;
	const queries = () => [{
		key: locator.sessionKey,
		agentId: locator.agentId
	}];
	const initial = await withReadySessionRows(projection, queries, () => readAuthorizedTarget(cfg, locator, projection));
	if (!initial) return null;
	const selected = await readSessionMessageByIdAsync({
		agentId: initial.source.agentId,
		sessionKey: locator.sessionKey,
		sessionId: locator.sessionId,
		storePath: initial.source.path,
		sessionEntry: initial.target.entry
	}, options.entryId, {
		currentOnly: true,
		maxBytes: PUBLIC_SESSION_MEDIA_ENTRY_BYTES,
		allowResetArchiveFallback: false
	});
	return withReadySessionRows(projection, queries, () => {
		const current = readAuthorizedTarget(cfg, locator, projection);
		return current && current.source.path === initial.source.path && current.source.databaseIdentity === initial.source.databaseIdentity && current.source.databaseBirthtime === initial.source.databaseBirthtime && selected.found && !selected.oversized ? asOptionalRecord(selected.message) ?? null : null;
	});
}
//#endregion
export { readPublicSessionMessage as n, readPublicSessionShare as r, isPublicSessionShareActive as t };
