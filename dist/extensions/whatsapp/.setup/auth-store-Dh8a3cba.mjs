import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { a as readWebCredsJsonRaw, c as resolveWebCredsPath, i as isWhatsAppBaileysAuthFileName, l as statWebCredsFileSync, o as readWebCredsJsonRawSync, r as hasWebCredsSync, s as resolveWebCredsBackupPath, t as assertWebCredsPathRegularFileOrMissing } from "./creds-files-Drg3usj1.mjs";
import { r as jidToE164 } from "./targets-runtime-RBjx3pg_.mjs";
import { n as resolveUserPath, t as normalizeE164 } from "./text-runtime-CHl0iPYe.mjs";
import path from "node:path";
import { resolveOAuthDir as resolveOAuthDir$1 } from "openclaw/plugin-sdk/state-paths";
import { isPathStrictlyInside } from "openclaw/plugin-sdk/file-access-runtime";
import { formatCliCommand } from "openclaw/plugin-sdk/cli-runtime";
import { defaultRuntime, getChildLogger, info, success } from "openclaw/plugin-sdk/runtime-env";
import fs from "node:fs/promises";
import { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/routing";
import { enqueueKeyedTask } from "openclaw/plugin-sdk/keyed-async-queue";
import { resolveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
import { replaceFileAtomic } from "openclaw/plugin-sdk/security-runtime";
//#region extensions/whatsapp/src/creds-persistence.ts
const CREDS_FILE_MODE = 384;
const CREDS_SAVE_FLUSH_TIMEOUT_MS = 15e3;
const credsSaveQueues = /* @__PURE__ */ new Map();
async function stringifyCreds(creds) {
	const { BufferJSON } = await import("./session.runtime-DcJuO42v.mjs").then((n) => n.o);
	return JSON.stringify(creds, BufferJSON.replacer);
}
async function writeWebCredsRawAtomically(params) {
	await assertWebCredsPathRegularFileOrMissing(params.filePath);
	await replaceFileAtomic({
		filePath: params.filePath,
		content: params.content,
		dirMode: 448,
		mode: CREDS_FILE_MODE,
		tempPrefix: params.tempPrefix,
		syncTempFile: true,
		syncParentDir: true,
		beforeRename: async ({ filePath }) => {
			await assertWebCredsPathRegularFileOrMissing(filePath);
		}
	});
}
async function writeCredsJsonAtomically(authDir, creds) {
	await writeWebCredsRawAtomically({
		filePath: resolveWebCredsPath(authDir),
		content: await stringifyCreds(creds),
		tempPrefix: ".creds"
	});
}
function enqueueCredsSave(authDir, saveCreds, onError) {
	enqueueKeyedTask({
		tails: credsSaveQueues,
		key: authDir,
		task: async () => {
			try {
				await saveCreds();
			} catch (error) {
				onError(error);
			}
		}
	});
}
function waitForCredsSaveQueue(authDir) {
	if (authDir) return credsSaveQueues.get(authDir) ?? Promise.resolve();
	return Promise.all(credsSaveQueues.values()).then(() => {});
}
async function waitForCredsSaveQueueWithTimeout(authDir, timeoutMs = CREDS_SAVE_FLUSH_TIMEOUT_MS) {
	const boundedTimeoutMs = resolveTimerTimeoutMs(timeoutMs, CREDS_SAVE_FLUSH_TIMEOUT_MS, 0);
	let flushTimeout;
	return await Promise.race([waitForCredsSaveQueue(authDir).then(() => "drained"), new Promise((resolve) => {
		flushTimeout = setTimeout(() => resolve("timed_out"), boundedTimeoutMs);
	})]).finally(() => {
		if (flushTimeout) clearTimeout(flushTimeout);
	});
}
//#endregion
//#region extensions/whatsapp/src/identity.ts
const WHATSAPP_LID_RE = /@(lid|hosted\.lid)$/i;
function normalizeDeviceScopedJid(jid) {
	return jid ? jid.replace(/:\d+/, "") : null;
}
function isLidJid(jid) {
	return Boolean(jid && WHATSAPP_LID_RE.test(jid));
}
function resolveComparableIdentity(identity, authDir) {
	const rawJid = normalizeDeviceScopedJid(identity?.jid);
	const lid = normalizeDeviceScopedJid(identity?.lid) ?? (isLidJid(rawJid) ? rawJid : null);
	const jid = rawJid && !isLidJid(rawJid) ? rawJid : null;
	const e164 = identity?.e164 != null ? normalizeE164(identity.e164) : (jid ? jidToE164(jid, authDir ? { authDir } : void 0) : null) ?? (lid ? jidToE164(lid, authDir ? { authDir } : void 0) : null);
	return {
		...identity,
		jid,
		lid,
		e164
	};
}
function getComparableIdentityValues(identity) {
	const resolved = resolveComparableIdentity(identity);
	return [
		resolved.e164,
		resolved.jid,
		resolved.lid
	].filter((value) => Boolean(value));
}
function identitiesOverlap(left, right) {
	const leftValues = new Set(getComparableIdentityValues(left));
	if (leftValues.size === 0) return false;
	return getComparableIdentityValues(right).some((value) => leftValues.has(value));
}
function getSenderIdentity(msg, authDir) {
	return resolveComparableIdentity(msg.platform.sender ?? {
		jid: msg.platform.senderJid ?? null,
		e164: msg.platform.senderE164 ?? null,
		name: msg.platform.senderName ?? null
	}, authDir);
}
function getSelfIdentity(msg, authDir) {
	return resolveComparableIdentity(msg.platform.self ?? {
		jid: msg.platform.selfJid ?? null,
		lid: msg.platform.selfLid ?? null,
		e164: msg.platform.selfE164 ?? null
	}, authDir);
}
function getReplyContext(msg, authDir) {
	if (msg.quote?.context) return {
		...msg.quote.context,
		sender: resolveComparableIdentity(msg.quote.context.sender, authDir)
	};
	if (!msg.quote?.body) return null;
	return {
		id: msg.quote.id,
		body: msg.quote.body,
		sender: resolveComparableIdentity({
			jid: msg.quote.sender?.jid ?? null,
			e164: msg.quote.sender?.e164 ?? null,
			label: msg.quote.sender?.displayName ?? null
		}, authDir)
	};
}
function getMentionJids(msg) {
	return msg.group?.mentions?.jids ?? [];
}
function getMentionIdentities(msg, authDir) {
	return getMentionJids(msg).map((jid) => resolveComparableIdentity({ jid }, authDir));
}
function getPrimaryIdentityId(identity) {
	return identity?.e164 || identity?.jid?.trim() || identity?.lid || null;
}
//#endregion
//#region extensions/whatsapp/src/auth-store.ts
var auth_store_exports = /* @__PURE__ */ __exportAll({
	WA_WEB_AUTH_DIR: () => WA_WEB_AUTH_DIR,
	WHATSAPP_AUTH_UNSTABLE_CODE: () => WHATSAPP_AUTH_UNSTABLE_CODE,
	WhatsAppAuthUnstableError: () => WhatsAppAuthUnstableError,
	formatWhatsAppWebAuthStatusState: () => formatWhatsAppWebAuthStatusState,
	getWebAuthAgeMs: () => getWebAuthAgeMs,
	hasWebCredsSync: () => hasWebCredsSync,
	logWebSelfId: () => logWebSelfId,
	logoutWeb: () => logoutWeb,
	pickWebChannel: () => pickWebChannel,
	readCredsJsonRaw: () => readCredsJsonRaw,
	readWebAuthExistsBestEffort: () => readWebAuthExistsBestEffort,
	readWebAuthExistsForDecision: () => readWebAuthExistsForDecision,
	readWebAuthSnapshot: () => readWebAuthSnapshot,
	readWebAuthSnapshotBestEffort: () => readWebAuthSnapshotBestEffort,
	readWebAuthState: () => readWebAuthState,
	readWebSelfId: () => readWebSelfId,
	readWebSelfIdentity: () => readWebSelfIdentity,
	readWebSelfIdentityForDecision: () => readWebSelfIdentityForDecision,
	resolveDefaultWebAuthDir: () => resolveDefaultWebAuthDir,
	resolveWebCredsBackupPath: () => resolveWebCredsBackupPath,
	resolveWebCredsPath: () => resolveWebCredsPath,
	restoreCredsFromBackupIfNeeded: () => restoreCredsFromBackupIfNeeded,
	webAuthExists: () => webAuthExists
});
const WHATSAPP_AUTH_UNSTABLE_CODE = "whatsapp-auth-unstable";
const authStoreLogger = getChildLogger({ module: "web-auth-store" });
const emptyWebSelfId = () => ({
	e164: null,
	jid: null,
	lid: null
});
var WhatsAppAuthUnstableError = class extends Error {
	constructor(message = "WhatsApp auth state is still stabilizing; retry shortly.") {
		super(message);
		this.code = WHATSAPP_AUTH_UNSTABLE_CODE;
		this.name = "WhatsAppAuthUnstableError";
	}
};
function resolveDefaultWebAuthDir() {
	return path.join(resolveOAuthDir$1(), "whatsapp", DEFAULT_ACCOUNT_ID);
}
const WA_WEB_AUTH_DIR = resolveDefaultWebAuthDir();
function readCredsJsonRaw(filePath) {
	return readWebCredsJsonRawSync(filePath);
}
async function waitForWebAuthBarrier(authDir, context) {
	const result = await waitForCredsSaveQueueWithTimeout(authDir);
	if (result === "timed_out") authStoreLogger.warn({
		authDir,
		context
	}, "timed out waiting for queued WhatsApp creds save before auth read");
	return result;
}
function isValidJson(raw) {
	try {
		JSON.parse(raw);
		return true;
	} catch {
		return false;
	}
}
async function restoreCredsFromBackupIfNeeded(authDir, options) {
	const logger = getChildLogger({ module: "web-session" });
	let restore;
	try {
		const credsPath = resolveWebCredsPath(authDir);
		const backupPath = resolveWebCredsBackupPath(authDir);
		try {
			await assertWebCredsPathRegularFileOrMissing(credsPath);
		} catch {
			return false;
		}
		const raw = readCredsJsonRaw(credsPath);
		if (raw && isValidJson(raw)) return false;
		const backupRaw = readCredsJsonRaw(backupPath);
		if (!backupRaw || !isValidJson(backupRaw)) return false;
		restore = {
			content: backupRaw,
			credsPath
		};
	} catch {
		return false;
	}
	await options?.beforeCredentialPersistence?.();
	try {
		await writeWebCredsRawAtomically({
			filePath: restore.credsPath,
			content: restore.content,
			tempPrefix: ".creds.restore"
		});
		logger.warn({ credsPath: restore.credsPath }, "restored corrupted WhatsApp creds.json from backup");
		return true;
	} catch {}
	return false;
}
async function webAuthExists(authDir = resolveDefaultWebAuthDir()) {
	const resolvedAuthDir = resolveUserPath(authDir);
	const credsPath = resolveWebCredsPath(resolvedAuthDir);
	const raw = await readWebCredsJsonRaw(credsPath);
	if (!raw) return false;
	try {
		JSON.parse(raw);
		return true;
	} catch {
		return false;
	}
}
function resolveWebAuthState(params) {
	if (params.barrierResult === "timed_out") return "unstable";
	return params.linked ? "linked" : "not-linked";
}
async function readWebAuthStateCore(authDir, context) {
	const resolvedAuthDir = resolveUserPath(authDir);
	const barrierResult = await waitForWebAuthBarrier(resolvedAuthDir, context);
	const linked = await webAuthExists(resolvedAuthDir);
	return {
		authDir: resolvedAuthDir,
		linked,
		state: resolveWebAuthState({
			linked,
			barrierResult
		})
	};
}
function formatWhatsAppWebAuthStatusState(state) {
	switch (state) {
		case "linked": return "linked";
		case "not-linked": return "not linked";
		case "unstable": return "auth stabilizing";
	}
	return state;
}
async function readWebAuthState(authDir = resolveDefaultWebAuthDir()) {
	return (await readWebAuthStateCore(authDir, "readWebAuthState")).state;
}
async function readWebAuthSnapshot(authDir = resolveDefaultWebAuthDir()) {
	const auth = await readWebAuthStateCore(authDir, "readWebAuthSnapshot");
	return {
		state: auth.state,
		authAgeMs: auth.state === "linked" ? getWebAuthAgeMs(auth.authDir) : null,
		selfId: auth.state === "linked" ? readWebSelfId(auth.authDir) : emptyWebSelfId()
	};
}
async function readWebAuthExistsBestEffort(authDir = resolveDefaultWebAuthDir()) {
	const state = await readWebAuthState(authDir);
	return {
		exists: state === "linked",
		timedOut: state === "unstable"
	};
}
async function readWebAuthExistsForDecision(authDir = resolveDefaultWebAuthDir()) {
	const state = await readWebAuthState(authDir);
	if (state === "unstable") return { outcome: "unstable" };
	return {
		outcome: "stable",
		exists: state === "linked"
	};
}
async function readWebAuthSnapshotBestEffort(authDir = resolveDefaultWebAuthDir()) {
	const snapshot = await readWebAuthSnapshot(authDir);
	return {
		linked: snapshot.state === "linked",
		timedOut: snapshot.state === "unstable",
		authAgeMs: snapshot.authAgeMs,
		selfId: snapshot.selfId
	};
}
async function clearBaileysAuthFiles(authDir, beforeCredentialPersistence) {
	const rootStats = await fs.lstat(authDir).catch(() => null);
	if (!rootStats?.isDirectory() || rootStats.isSymbolicLink()) return;
	const credentialFiles = (await fs.readdir(authDir, { withFileTypes: true })).filter((entry) => entry.isFile() && isWhatsAppBaileysAuthFileName(entry.name));
	if (credentialFiles.length === 0) return;
	await beforeCredentialPersistence?.();
	await Promise.all(credentialFiles.map(async (entry) => {
		await fs.rm(path.join(authDir, entry.name), { force: true });
	}));
}
async function shouldClearOnLogout(authDir, isLegacyAuthDir) {
	try {
		const stats = await fs.lstat(authDir);
		if (!stats.isDirectory() || stats.isSymbolicLink()) return false;
		if (isLegacyAuthDir) return (await fs.readdir(authDir, { withFileTypes: true })).some((entry) => {
			if (!entry.isFile()) return false;
			return isWhatsAppBaileysAuthFileName(entry.name);
		});
		if ((await fs.lstat(resolveWebCredsPath(authDir)).catch(() => null))?.isFile()) return true;
		return (await fs.lstat(resolveWebCredsBackupPath(authDir)).catch(() => null))?.isFile() === true;
	} catch (error) {
		const codeValue = error && typeof error === "object" && "code" in error ? error.code : void 0;
		return (typeof codeValue === "string" ? codeValue : "") !== "ENOENT";
	}
}
async function pathHasSymlinkComponent(baseDir, targetPath) {
	const relativePath = path.relative(baseDir, targetPath);
	let currentPath = baseDir;
	for (const segment of relativePath.split(path.sep)) {
		currentPath = path.join(currentPath, segment);
		const stats = await fs.lstat(currentPath).catch(() => null);
		if (!stats || stats.isSymbolicLink()) return true;
	}
	return false;
}
async function isLegacyWebAuthDir(authDir) {
	const legacyAuthDir = path.resolve(resolveOAuthDir$1());
	const resolvedAuthDir = path.resolve(authDir);
	if (resolvedAuthDir !== legacyAuthDir) return false;
	const stats = await fs.lstat(resolvedAuthDir).catch(() => null);
	return stats?.isDirectory() === true && !stats.isSymbolicLink();
}
async function classifyWebAuthDirOwnership(authDir) {
	const whatsappAuthBase = path.resolve(resolveOAuthDir$1(), "whatsapp");
	const resolvedAuthDir = path.resolve(authDir);
	if (!isPathStrictlyInside(whatsappAuthBase, resolvedAuthDir)) return { kind: "external" };
	const [baseRealPath, authDirRealPath] = await Promise.all([fs.realpath(whatsappAuthBase).catch(() => null), fs.realpath(resolvedAuthDir).catch(() => null)]);
	if (!baseRealPath || !authDirRealPath) return { kind: "unsafe-owned" };
	if (!isPathStrictlyInside(baseRealPath, authDirRealPath)) return { kind: "unsafe-owned" };
	if (await pathHasSymlinkComponent(whatsappAuthBase, resolvedAuthDir)) return { kind: "unsafe-owned" };
	return {
		kind: "owned",
		authDir: resolvedAuthDir
	};
}
async function logoutWeb(params) {
	const runtime = params.runtime ?? defaultRuntime;
	const resolvedAuthDir = resolveUserPath(params.authDir ?? resolveDefaultWebAuthDir());
	if (await waitForWebAuthBarrier(resolvedAuthDir, "logoutWeb") === "timed_out") runtime.log(info("WhatsApp auth state is still stabilizing; clearing cached credentials anyway."));
	if (!await shouldClearOnLogout(resolvedAuthDir, Boolean(params.isLegacyAuthDir))) {
		runtime.log(info("No WhatsApp Web session found; nothing to delete."));
		return false;
	}
	if (params.isLegacyAuthDir) {
		if (!await isLegacyWebAuthDir(resolvedAuthDir)) {
			runtime.log(info("Skipped WhatsApp Web credential cleanup outside the managed legacy auth directory."));
			return false;
		}
		await clearBaileysAuthFiles(resolvedAuthDir, params.beforeCredentialPersistence);
	} else {
		const ownership = await classifyWebAuthDirOwnership(resolvedAuthDir);
		if (ownership.kind === "owned") {
			await params.beforeCredentialPersistence?.();
			await fs.rm(ownership.authDir, {
				recursive: true,
				force: true
			});
		} else if (ownership.kind === "unsafe-owned") {
			runtime.log(info("Skipped WhatsApp Web credential cleanup because the auth directory crosses a symlink boundary."));
			return false;
		} else {
			runtime.log(info("Skipped WhatsApp Web credential cleanup outside the managed auth directory."));
			return false;
		}
	}
	runtime.log(success("Cleared WhatsApp Web credentials."));
	return true;
}
function readWebSelfId(authDir = resolveDefaultWebAuthDir()) {
	try {
		const raw = readCredsJsonRaw(resolveWebCredsPath(resolveUserPath(authDir)));
		if (!raw) return emptyWebSelfId();
		const parsed = JSON.parse(raw);
		const identity = resolveComparableIdentity({
			jid: parsed?.me?.id ?? null,
			lid: parsed?.me?.lid ?? null
		}, authDir);
		return {
			e164: identity.e164 ?? null,
			jid: identity.jid ?? null,
			lid: identity.lid ?? null
		};
	} catch {
		return emptyWebSelfId();
	}
}
async function readWebSelfIdentity(authDir = resolveDefaultWebAuthDir(), fallback) {
	const resolvedAuthDir = resolveUserPath(authDir);
	const raw = await readWebCredsJsonRaw(resolveWebCredsPath(resolvedAuthDir));
	if (raw) try {
		const parsed = JSON.parse(raw);
		return resolveComparableIdentity({
			jid: parsed?.me?.id ?? null,
			lid: parsed?.me?.lid ?? null
		}, resolvedAuthDir);
	} catch {}
	return resolveComparableIdentity({
		jid: fallback?.id ?? null,
		lid: fallback?.lid ?? null
	}, resolvedAuthDir);
}
async function readWebSelfIdentityForDecision(authDir = resolveDefaultWebAuthDir(), fallback) {
	const resolvedAuthDir = resolveUserPath(authDir);
	if (await waitForWebAuthBarrier(resolvedAuthDir, "readWebSelfIdentityForDecision") === "timed_out") return { outcome: "unstable" };
	return {
		outcome: "stable",
		identity: await readWebSelfIdentity(resolvedAuthDir, fallback)
	};
}
/**
* Return the age (in milliseconds) of the cached WhatsApp web auth state, or null when missing.
* Helpful for heartbeats/observability to spot stale credentials.
*/
function getWebAuthAgeMs(authDir = resolveDefaultWebAuthDir()) {
	const stats = statWebCredsFileSync(resolveWebCredsPath(resolveUserPath(authDir)));
	return stats ? Math.max(0, Date.now() - stats.mtimeMs) : null;
}
function logWebSelfId(authDir = resolveDefaultWebAuthDir(), runtime = defaultRuntime, includeChannelPrefix = false) {
	const { e164, jid, lid } = readWebSelfId(authDir);
	const parts = [jid ? `jid ${jid}` : null, lid ? `lid ${lid}` : null].filter((value) => Boolean(value));
	const details = e164 || parts.length > 0 ? `${e164 ?? "unknown"}${parts.length > 0 ? ` (${parts.join(", ")})` : ""}` : "unknown";
	const prefix = includeChannelPrefix ? "Web Channel: " : "";
	runtime.log(info(`${prefix}${details}`));
}
async function pickWebChannel(pref, authDir = resolveDefaultWebAuthDir()) {
	const choice = pref === "auto" ? "web" : pref;
	const auth = await readWebAuthExistsForDecision(authDir);
	if (auth.outcome === "unstable") throw new WhatsAppAuthUnstableError();
	if (!auth.exists) throw new Error(`No WhatsApp Web session found. Run \`${formatCliCommand("openclaw channels login --channel whatsapp --verbose")}\` to link.`);
	return choice;
}
//#endregion
export { enqueueCredsSave as A, getMentionIdentities as C, getSenderIdentity as D, getSelfIdentity as E, waitForCredsSaveQueueWithTimeout as M, writeCredsJsonAtomically as N, identitiesOverlap as O, writeWebCredsRawAtomically as P, getComparableIdentityValues as S, getReplyContext as T, readWebSelfIdentity as _, formatWhatsAppWebAuthStatusState as a, restoreCredsFromBackupIfNeeded as b, logoutWeb as c, readWebAuthExistsBestEffort as d, readWebAuthExistsForDecision as f, readWebSelfId as g, readWebAuthState as h, auth_store_exports as i, waitForCredsSaveQueue as j, resolveComparableIdentity as k, pickWebChannel as l, readWebAuthSnapshotBestEffort as m, WHATSAPP_AUTH_UNSTABLE_CODE as n, getWebAuthAgeMs as o, readWebAuthSnapshot as p, WhatsAppAuthUnstableError as r, logWebSelfId as s, WA_WEB_AUTH_DIR as t, readCredsJsonRaw as u, readWebSelfIdentityForDecision as v, getPrimaryIdentityId as w, webAuthExists as x, resolveDefaultWebAuthDir as y };
