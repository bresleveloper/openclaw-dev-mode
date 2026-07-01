import { _ as uniqueStrings, l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import "./string-coerce-runtime-BiZzULo_.js";
import { t as createClaimableDedupe } from "./persistent-dedupe-Ck7XvmNX.js";
import path from "node:path";
//#region extensions/telegram/src/message-dispatch-dedupe.ts
const TELEGRAM_MESSAGE_DISPATCH_DEDUPE_TTL_MS = 10080 * 60 * 1e3;
const TELEGRAM_MESSAGE_DISPATCH_DEDUPE_NAMESPACE = "global";
const TELEGRAM_MESSAGE_DISPATCH_DEDUPE_NAMESPACE_PREFIX = "telegram.message-dispatch-dedupe";
const TELEGRAM_MESSAGE_DISPATCH_DEDUPE_STATE_PLUGIN_ID = "telegram-message-dispatch-dedupe";
const TELEGRAM_MESSAGE_DISPATCH_DEDUPE_MEMORY_MAX_ENTRIES = 5e4;
const TELEGRAM_MESSAGE_DISPATCH_DEDUPE_STATE_MAX_ENTRIES = 5e4;
var TelegramMessageDispatchReplayForgetError = class extends Error {
	constructor(failures) {
		const count = failures.length;
		super(`telegram message dispatch dedupe rollback failed for ${count} key(s)`, { cause: failures.find((failure) => failure.error !== void 0)?.error });
		this.name = "TelegramMessageDispatchReplayForgetError";
		this.failures = [...failures];
		this.cause = failures.find((failure) => failure.error !== void 0)?.error;
	}
};
function isTelegramMessageDispatchReplayForgetError(error) {
	return error instanceof TelegramMessageDispatchReplayForgetError;
}
function sanitizeFileSegment(value) {
	const trimmed = value.trim();
	if (!trimmed) return "default";
	return trimmed.replace(/[^a-zA-Z0-9_-]/g, "_");
}
function resolveTelegramMessageDispatchLegacyPath(params) {
	return path.join(path.dirname(params.storePath), `${path.basename(params.storePath)}.telegram-message-dispatch-${sanitizeFileSegment(params.namespace)}.json`);
}
function buildTelegramMessageDispatchReplayKey(msg) {
	const chatId = msg.chat?.id;
	const messageId = msg.message_id;
	if (chatId == null || typeof messageId !== "number" || messageId <= 0) return null;
	return JSON.stringify([
		"message",
		String(chatId),
		messageId
	]);
}
function buildTelegramMessageDispatchAccountReplayKey(params) {
	return JSON.stringify([
		"account",
		params.accountId,
		params.key
	]);
}
function buildTelegramMessageDispatchStoredReplayKey(params) {
	const key = buildTelegramMessageDispatchReplayKey(params.msg);
	return key ? buildTelegramMessageDispatchAccountReplayKey({
		accountId: params.accountId,
		key
	}) : null;
}
function createTelegramMessageDispatchReplayGuard(params = {}) {
	return createClaimableDedupe({
		ttlMs: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_TTL_MS,
		memoryMaxSize: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_MEMORY_MAX_ENTRIES,
		pluginId: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_STATE_PLUGIN_ID,
		namespacePrefix: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_NAMESPACE_PREFIX,
		stateMaxEntries: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_STATE_MAX_ENTRIES,
		...params.onDiskError ? { onDiskError: params.onDiskError } : {}
	});
}
async function claimTelegramMessageDispatchReplay(params) {
	const key = buildTelegramMessageDispatchStoredReplayKey({
		accountId: params.accountId,
		msg: params.msg
	});
	if (!key) return { kind: "invalid" };
	let releaseRetries = 0;
	while (true) {
		const claim = await params.guard.claim(key, { namespace: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_NAMESPACE });
		if (claim.kind === "claimed") return {
			kind: "claimed",
			key
		};
		if (claim.kind === "duplicate") return { kind: "duplicate" };
		try {
			await claim.pending;
			return { kind: "duplicate" };
		} catch {
			releaseRetries += 1;
			if (releaseRetries > 1) return { kind: "duplicate" };
		}
	}
}
function normalizeReplayKeys(keys) {
	return uniqueStrings(normalizeStringEntries(keys ?? []));
}
async function commitTelegramMessageDispatchReplay(params) {
	const keys = normalizeReplayKeys(params.keys);
	await Promise.all(keys.map((key) => params.guard.commit(key, { namespace: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_NAMESPACE })));
}
async function forgetTelegramMessageDispatchReplay(params) {
	const keys = normalizeReplayKeys(params.keys);
	const failures = (await Promise.all(keys.map(async (key) => {
		try {
			return await params.guard.forget(key, { namespace: "global" }) ? null : { key };
		} catch (error) {
			return {
				key,
				error
			};
		}
	}))).filter((failure) => Boolean(failure));
	if (failures.length > 0) throw new TelegramMessageDispatchReplayForgetError(failures);
}
function releaseTelegramMessageDispatchReplay(params) {
	const keys = normalizeReplayKeys(params.keys);
	for (const key of keys) params.guard.release(key, {
		namespace: TELEGRAM_MESSAGE_DISPATCH_DEDUPE_NAMESPACE,
		error: params.error
	});
}
//#endregion
export { TELEGRAM_MESSAGE_DISPATCH_DEDUPE_TTL_MS as a, commitTelegramMessageDispatchReplay as c, isTelegramMessageDispatchReplayForgetError as d, releaseTelegramMessageDispatchReplay as f, TELEGRAM_MESSAGE_DISPATCH_DEDUPE_STATE_PLUGIN_ID as i, createTelegramMessageDispatchReplayGuard as l, TELEGRAM_MESSAGE_DISPATCH_DEDUPE_NAMESPACE_PREFIX as n, buildTelegramMessageDispatchAccountReplayKey as o, resolveTelegramMessageDispatchLegacyPath as p, TELEGRAM_MESSAGE_DISPATCH_DEDUPE_STATE_MAX_ENTRIES as r, claimTelegramMessageDispatchReplay as s, TELEGRAM_MESSAGE_DISPATCH_DEDUPE_NAMESPACE as t, forgetTelegramMessageDispatchReplay as u };
