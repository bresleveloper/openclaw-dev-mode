import { p as resolveLocalIMessageChatDbPath } from "./accounts-CUxZrTcY.mjs";
import { _ as chatContextFromIMessageTarget, m as resolveIMessageMessageId, p as resolveIMessageCachedResourceBinding, v as isIMessageEmailChatIdentifier } from "./sanitize-outbound-sJPF2DVM.mjs";
import path from "node:path";
import { normalizeScpRemoteHost } from "openclaw/plugin-sdk/host-runtime";
import { createActionGate } from "openclaw/plugin-sdk/channel-actions";
import { createSubsystemLogger } from "openclaw/plugin-sdk/runtime-env";
import { randomUUID } from "node:crypto";
import { runCommandWithTimeout } from "openclaw/plugin-sdk/process-runtime";
import { openNodeSqliteDatabase } from "openclaw/plugin-sdk/sqlite-runtime";
import { sanitizeTempFileName } from "openclaw/plugin-sdk/temp-path";
//#region extensions/imessage/src/message-resource-db.ts
function normalizeIMessageMessageGuidForLookup(messageId) {
	const trimmed = messageId.trim();
	const slash = trimmed.lastIndexOf("/");
	return slash >= 0 && slash + 1 < trimmed.length ? trimmed.slice(slash + 1) : trimmed;
}
function chatGuidCandidates(raw) {
	const trimmed = raw?.trim();
	if (!trimmed) return [];
	const ordered = [trimmed];
	const parts = trimmed.split(";");
	const service = parts[0]?.toLowerCase();
	const kind = parts[1];
	const identifier = parts[2];
	if (parts.length === 3 && (kind === "+" || kind === "-") && identifier) {
		if (service === "any") ordered.push(`iMessage;${kind};${identifier}`, `SMS;${kind};${identifier}`);
		else if (service === "imessage") ordered.push(`iMessage;${kind};${identifier}`, `any;${kind};${identifier}`);
		else if (service === "sms") ordered.push(`SMS;${kind};${identifier}`, `any;${kind};${identifier}`);
	}
	return [...new Set(ordered)];
}
function chatIdentifierCandidates(raw) {
	const trimmed = raw?.trim();
	if (!trimmed) return [];
	const parts = trimmed.split(";");
	const service = parts[0]?.toLowerCase();
	const hasKnownPrefix = service === "imessage" || service === "sms" || service === "any";
	const hasKnownKind = parts[1] === "+" || parts[1] === "-";
	const bareIdentifier = parts.length === 3 && hasKnownPrefix && hasKnownKind ? parts[2] : void 0;
	return [.../* @__PURE__ */ new Set([trimmed, ...bareIdentifier ? [bareIdentifier] : []])];
}
function isKnownChatGuid(raw) {
	const parts = raw?.trim().split(";");
	if (!parts || parts.length !== 3 || parts[1] !== "+" && parts[1] !== "-" || !parts[2]) return false;
	const service = parts[0]?.toLowerCase();
	return service === "imessage" || service === "sms" || service === "any";
}
function matchesChatCandidate(stored, candidate) {
	if (stored === candidate) return true;
	return isIMessageEmailChatIdentifier(stored) && isIMessageEmailChatIdentifier(candidate) && stored.toLowerCase() === candidate.toLowerCase();
}
function matchesAnyChatCandidate(stored, candidates) {
	if (typeof stored !== "string") return false;
	return candidates.some((candidate) => matchesChatCandidate(stored, candidate));
}
function checkIMessageResourceBinding(params) {
	const dbPath = resolveLocalIMessageChatDbPath(params);
	if (!dbPath) return "unavailable";
	const messageGuid = normalizeIMessageMessageGuidForLookup(params.messageId);
	if (!messageGuid) return "mismatch";
	const expectedChatGuids = chatGuidCandidates(params.chatContext.chatGuid);
	const expectedChatIdentifiers = chatIdentifierCandidates(params.chatContext.chatIdentifier);
	const identifierChatGuids = isKnownChatGuid(params.chatContext.chatIdentifier) ? chatGuidCandidates(params.chatContext.chatIdentifier) : [];
	const chatId = params.chatContext.chatId;
	const hasChatId = typeof chatId === "number" && Number.isSafeInteger(chatId) && chatId > 0;
	if (!hasChatId && expectedChatGuids.length === 0 && expectedChatIdentifiers.length === 0 && identifierChatGuids.length === 0) return "unavailable";
	let db;
	try {
		db = openNodeSqliteDatabase(dbPath, { readOnly: true });
		return db.prepare(`SELECT cmj.chat_id AS chatId,
                c.guid AS chatGuid,
                c.chat_identifier AS chatIdentifier
         FROM message m
         JOIN chat_message_join cmj ON cmj.message_id = m.ROWID
         JOIN chat c ON c.ROWID = cmj.chat_id
         WHERE m.guid = ?`).all(messageGuid).map((row) => ({
			chatId: row.chatId,
			chatGuid: row.chatGuid,
			chatIdentifier: row.chatIdentifier
		})).some((row) => (!hasChatId || row.chatId === chatId) && (expectedChatGuids.length === 0 || matchesAnyChatCandidate(row.chatGuid, expectedChatGuids)) && (expectedChatIdentifiers.length === 0 || matchesAnyChatCandidate(row.chatIdentifier, expectedChatIdentifiers)) && (identifierChatGuids.length === 0 || matchesAnyChatCandidate(row.chatGuid, identifierChatGuids))) ? "match" : "mismatch";
	} catch {
		return "unavailable";
	} finally {
		try {
			db?.close();
		} catch {}
	}
}
//#endregion
//#region extensions/imessage/src/message-resource.ts
const MAX_REPLY_TO_ID_LENGTH = 256;
function sanitizeReplyToId(rawReplyToId) {
	const trimmed = rawReplyToId?.trim();
	if (!trimmed) return;
	let sanitized = "";
	for (const ch of trimmed) {
		const code = ch.charCodeAt(0);
		if (code >= 0 && code <= 31 || code === 127 || ch === "[" || ch === "]") continue;
		sanitized += ch;
	}
	return sanitized.trim().slice(0, MAX_REPLY_TO_ID_LENGTH) || void 0;
}
async function resolveAuthorizedIMessageReplyReference(params) {
	if (!createActionGate(params.account.config.actions)("reply")) return;
	const rawReplyToId = sanitizeReplyToId(params.replyToId);
	if (!rawReplyToId) return;
	const chatContext = chatContextFromIMessageTarget(params.target, params.service);
	const messageId = await resolveIMessageMessageId(rawReplyToId, {
		requireKnownShortId: true,
		chatContext
	});
	await authorizeIMessageResourceReference({
		accountId: params.account.accountId,
		chatContext,
		cliPath: params.cliPath,
		dbPath: params.dbPath,
		hasExclusiveLocalDatabase: params.hasExclusiveLocalDatabase,
		remoteHost: params.remoteHost ?? params.account.config.remoteHost,
		messageId,
		conversationReadOrigin: params.conversationReadOrigin
	});
	return messageId;
}
async function authorizeIMessageResourceReference(params) {
	const cacheContext = {
		...params.chatContext,
		accountId: params.accountId
	};
	let cacheBinding = await resolveIMessageCachedResourceBinding(params.messageId, cacheContext);
	const normalizedMessageId = normalizeIMessageMessageGuidForLookup(params.messageId);
	if (cacheBinding === "unknown" && normalizedMessageId !== params.messageId.trim()) cacheBinding = await resolveIMessageCachedResourceBinding(normalizedMessageId, cacheContext);
	if (cacheBinding === "match") return;
	if (cacheBinding === "mismatch") throw new Error("iMessage message reference belongs to a different account or conversation.");
	const providerBinding = params.hasExclusiveLocalDatabase ? checkIMessageResourceBinding(params) : "unavailable";
	if (providerBinding === "match") return;
	if (providerBinding === "mismatch") throw new Error("iMessage message reference does not belong to the selected conversation.");
	if (params.conversationReadOrigin === "direct-operator") return;
	throw new Error("Delegated iMessage message references require a current same-account conversation binding when the Messages database is unavailable.");
}
//#endregion
//#region extensions/imessage/src/remote-file.ts
const TOKEN_PATTERN = /^[a-f0-9]{32}$/u;
const SSH_OPTIONS = [
	"-o",
	"BatchMode=yes",
	"-o",
	"StrictHostKeyChecking=yes",
	"-o",
	"ConnectTimeout=10",
	"-o",
	"ClearAllForwardings=yes",
	"-o",
	"ForwardAgent=no",
	"-o",
	"ForwardX11=no"
];
const CLEANUP_TIMEOUT_MS = 1e4;
const log = createSubsystemLogger("channels/imessage");
function commandError(label, result) {
	if (result.code === 0 && result.termination === "exit") return;
	const detail = result.stderr.trim() || result.stdout.trim();
	return /* @__PURE__ */ new Error(`${label} failed (${result.termination}${result.code === null ? "" : `, code ${result.code}`})${detail ? `: ${detail}` : ""}`);
}
async function runChecked(run, label, argv, options) {
	const result = await run(argv, {
		killProcessTree: true,
		maxOutputBytes: {
			stdout: 4096,
			stderr: 65536
		},
		outputCapture: {
			stdout: "head",
			stderr: "tail"
		},
		...options
	});
	const error = commandError(label, result);
	if (error) throw error;
	return result;
}
function requireToken(createToken) {
	const token = createToken().replaceAll("-", "").toLowerCase();
	if (!TOKEN_PATTERN.test(token)) throw new Error("iMessage remote staging generated an invalid temporary token");
	return token;
}
async function withIMessageRemoteFile(params) {
	const remoteHost = normalizeScpRemoteHost(params.remoteHost);
	if (!remoteHost) throw new Error("invalid iMessage remoteHost for SSH/SCP staging");
	const run = params.deps?.runCommand ?? runCommandWithTimeout;
	const remoteDir = `/tmp/openclaw-imessage-${requireToken(params.deps?.createToken ?? randomUUID)}`;
	const remotePath = `${remoteDir}/${sanitizeTempFileName(path.basename(params.localPath))}`;
	const createScript = `set -eu
umask 077
directory=${remoteDir}
trap 'rm -rf -- "$directory"' EXIT HUP INT TERM
mkdir -m 700 -- "$directory"
trap - EXIT HUP INT TERM
`;
	const cleanupScript = `set -eu
rm -rf -- ${remoteDir}
`;
	params.assertDirectAdapterHandoff?.();
	try {
		await runChecked(run, "iMessage remote temporary directory allocation", [
			"ssh",
			...SSH_OPTIONS,
			"-T",
			"--",
			remoteHost,
			"sh -s"
		], {
			input: createScript,
			timeoutMs: params.timeoutMs,
			signal: params.signal
		});
		params.assertDirectAdapterHandoff?.();
		await runChecked(run, "iMessage remote file upload", [
			"scp",
			...SSH_OPTIONS,
			"--",
			params.localPath,
			`${remoteHost}:${remotePath}`
		], {
			timeoutMs: params.timeoutMs,
			signal: params.signal
		});
		params.assertDirectAdapterHandoff?.();
		return await params.use(remotePath);
	} finally {
		try {
			await runChecked(run, "iMessage remote file cleanup", [
				"ssh",
				...SSH_OPTIONS,
				"-T",
				"--",
				remoteHost,
				"sh -s"
			], {
				input: cleanupScript,
				timeoutMs: CLEANUP_TIMEOUT_MS
			});
		} catch (cleanupError) {
			(params.deps?.onCleanupError ?? ((error) => log.warn(`remote attachment cleanup failed: ${error.message}`)))(cleanupError instanceof Error ? cleanupError : new Error(String(cleanupError)));
		}
	}
}
//#endregion
export { authorizeIMessageResourceReference as n, resolveAuthorizedIMessageReplyReference as r, withIMessageRemoteFile as t };
