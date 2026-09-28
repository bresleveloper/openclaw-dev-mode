import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { c as resolveMergedWhatsAppAccountConfig, o as resolveWhatsAppAuthDir } from "./accounts-D_NGDjCx.mjs";
import { c as normalizeWhatsAppTarget, t as isWhatsAppGroupJid } from "./normalize-target-BGra1ZnM.mjs";
import { i as hasPendingWhatsAppConnectionOwner, r as getWhatsAppConnectionController } from "./connection-controller-runtime-context-hgLJoRc8.mjs";
import "./normalize-DdsROMMa.mjs";
import { M as waitForCredsSaveQueueWithTimeout, f as readWebAuthExistsForDecision } from "./auth-store-Dh8a3cba.mjs";
import { n as resolveWebAccountId } from "./active-listener-CDjoX9QR.mjs";
import { a as waitForWaConnection, h as acquireWhatsAppStandaloneConnectionOwner, n as createWaDirectorySocket, p as WhatsAppConnectionOwnerBusyError, t as closeWhatsAppSocketAndWait } from "./socket-close-YDZcXb67.mjs";
import { listResolvedDirectoryGroupEntriesFromMapKeys, listResolvedDirectoryUserEntriesFromAllowFrom } from "openclaw/plugin-sdk/directory-config-runtime";
//#region extensions/whatsapp/src/directory-config.ts
var directory_config_exports = /* @__PURE__ */ __exportAll({
	WHATSAPP_DIRECTORY_UNAVAILABLE_CODE: () => WHATSAPP_DIRECTORY_UNAVAILABLE_CODE,
	WhatsAppDirectoryUnavailableError: () => WhatsAppDirectoryUnavailableError,
	listWhatsAppDirectoryGroupsFromConfig: () => listWhatsAppDirectoryGroupsFromConfig,
	listWhatsAppDirectoryGroupsLive: () => listWhatsAppDirectoryGroupsLive,
	listWhatsAppDirectoryPeersFromConfig: () => listWhatsAppDirectoryPeersFromConfig
});
function resolveWhatsAppDirectoryAccount(cfg, accountId) {
	return resolveMergedWhatsAppAccountConfig({
		cfg,
		accountId
	});
}
async function listWhatsAppDirectoryPeersFromConfig(params) {
	return listResolvedDirectoryUserEntriesFromAllowFrom({
		...params,
		resolveAccount: resolveWhatsAppDirectoryAccount,
		resolveAllowFrom: (account) => account.allowFrom,
		normalizeId: (entry) => {
			const normalized = normalizeWhatsAppTarget(entry);
			if (!normalized || isWhatsAppGroupJid(normalized)) return null;
			return normalized;
		}
	});
}
async function listWhatsAppDirectoryGroupsFromConfig(params) {
	return listResolvedDirectoryGroupEntriesFromMapKeys({
		...params,
		resolveAccount: resolveWhatsAppDirectoryAccount,
		resolveGroups: (account) => account.groups
	});
}
const WHATSAPP_DIRECTORY_UNAVAILABLE_CODE = "whatsapp_directory_unavailable";
var WhatsAppDirectoryUnavailableError = class extends Error {
	constructor(reason, message, options) {
		super(message, options);
		this.reason = reason;
		this.code = WHATSAPP_DIRECTORY_UNAVAILABLE_CODE;
		this.name = "WhatsAppDirectoryUnavailableError";
	}
};
async function fetchLiveGroups(sock, params) {
	const groups = await sock.groupFetchAllParticipating();
	const query = params.query?.trim().toLowerCase() ?? "";
	const limit = typeof params.limit === "number" && params.limit > 0 ? params.limit : void 0;
	const entries = Object.entries(groups).map(([jid, metadata]) => ({
		kind: "group",
		id: jid,
		name: metadata?.subject?.trim() || void 0
	})).filter((entry) => {
		if (!query) return true;
		return entry.id.toLowerCase().includes(query) || entry.name?.toLowerCase().includes(query);
	}).toSorted((left, right) => left.id.localeCompare(right.id));
	return limit ? entries.slice(0, limit) : entries;
}
function unavailable(reason, message, cause) {
	return new WhatsAppDirectoryUnavailableError(reason, message, cause ? { cause } : void 0);
}
const pendingStandaloneCleanups = /* @__PURE__ */ new Map();
const STANDALONE_CLEANUP_RETRY_MS = 1e3;
async function completeStandaloneCleanup(cleanup) {
	if (cleanup.sock && !cleanup.socketClosed) {
		await closeWhatsAppSocketAndWait(cleanup.sock, "OpenClaw WhatsApp standalone directory socket close");
		cleanup.socketClosed = true;
	}
	if (cleanup.sock) {
		if (await waitForCredsSaveQueueWithTimeout(cleanup.authDir) === "timed_out") throw new Error("WhatsApp credential persistence did not drain before socket release");
	}
	await cleanup.ownerLease.release();
	if (pendingStandaloneCleanups.get(cleanup.authDir) === cleanup) pendingStandaloneCleanups.delete(cleanup.authDir);
	if (cleanup.retryTimer) {
		clearTimeout(cleanup.retryTimer);
		cleanup.retryTimer = null;
	}
}
function runStandaloneCleanup(cleanup) {
	if (cleanup.inFlight) return cleanup.inFlight;
	const task = completeStandaloneCleanup(cleanup).finally(() => {
		if (cleanup.inFlight === task) cleanup.inFlight = null;
	});
	cleanup.inFlight = task;
	return task;
}
function scheduleStandaloneCleanupRetry(cleanup) {
	if (cleanup.retryTimer) return;
	cleanup.retryTimer = setTimeout(() => {
		cleanup.retryTimer = null;
		runStandaloneCleanup(cleanup).catch(() => {
			scheduleStandaloneCleanupRetry(cleanup);
		});
	}, STANDALONE_CLEANUP_RETRY_MS);
	cleanup.retryTimer.unref?.();
}
function retainStandaloneCleanup(cleanup) {
	pendingStandaloneCleanups.set(cleanup.authDir, cleanup);
	scheduleStandaloneCleanupRetry(cleanup);
}
async function finishStandaloneCleanupOrThrow(cleanup, operationError) {
	try {
		await runStandaloneCleanup(cleanup);
	} catch (cleanupError) {
		retainStandaloneCleanup(cleanup);
		throw cleanupUnavailable(operationError === void 0 ? cleanupError : new AggregateError([operationError, cleanupError], "WhatsApp live group lookup and cleanup failed", { cause: operationError }));
	}
}
function cleanupUnavailable(error) {
	return unavailable("cleanup_failed", "WhatsApp live group lookup could not safely close its standalone connection.", error);
}
async function finishPriorStandaloneCleanup(authDir) {
	const cleanup = pendingStandaloneCleanups.get(authDir);
	if (!cleanup) return;
	try {
		await runStandaloneCleanup(cleanup);
	} catch (error) {
		scheduleStandaloneCleanupRetry(cleanup);
		throw cleanupUnavailable(error);
	}
}
async function listGroupsThroughStandaloneOwner(params) {
	const account = resolveWhatsAppDirectoryAccount(params.cfg, params.accountId);
	const authDir = resolveWhatsAppAuthDir({
		cfg: params.cfg,
		accountId: account.accountId
	}).authDir;
	await finishPriorStandaloneCleanup(authDir);
	let ownerLease;
	try {
		ownerLease = await acquireWhatsAppStandaloneConnectionOwner(authDir);
	} catch (error) {
		if (error instanceof WhatsAppConnectionOwnerBusyError) throw unavailable("connection_owner_busy", "WhatsApp live groups are unavailable because the account is owned by another process.", error);
		throw unavailable("connection_failed", "WhatsApp live groups are unavailable because connection ownership failed.", error);
	}
	const cleanup = {
		authDir,
		inFlight: null,
		ownerLease,
		retryTimer: null,
		sock: null,
		socketClosed: true
	};
	let groups;
	try {
		let authState;
		try {
			authState = await readWebAuthExistsForDecision(authDir);
		} catch (error) {
			throw unavailable("auth_unstable", "WhatsApp live groups are unavailable because linked credentials could not be read.", error);
		}
		if (authState.outcome === "unstable") throw unavailable("auth_unstable", "WhatsApp live groups are unavailable while linked credentials are changing.");
		if (!authState.exists) throw unavailable("not_linked", "WhatsApp live groups are unavailable because this account is not linked.");
		try {
			cleanup.sock = await createWaDirectorySocket(authDir);
			cleanup.socketClosed = false;
			await waitForWaConnection(cleanup.sock, { timeoutMs: 3e4 });
		} catch (error) {
			throw unavailable("connection_failed", "WhatsApp live groups are unavailable because the standalone connection failed.", error);
		}
		try {
			groups = await fetchLiveGroups(cleanup.sock, params);
		} catch (error) {
			throw unavailable("lookup_failed", "WhatsApp live group lookup failed.", error);
		}
	} catch (error) {
		await finishStandaloneCleanupOrThrow(cleanup, error);
		throw error;
	}
	await finishStandaloneCleanupOrThrow(cleanup);
	return groups;
}
async function listWhatsAppDirectoryGroupsLive(params) {
	const accountId = resolveWebAccountId({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const controller = getWhatsAppConnectionController(accountId);
	if (!controller && !hasPendingWhatsAppConnectionOwner(accountId)) return await listGroupsThroughStandaloneOwner(params);
	const sock = controller?.getCurrentSock();
	if (!sock) throw unavailable("active_owner_unavailable", "WhatsApp live groups are unavailable while the gateway connection is offline.");
	try {
		return await fetchLiveGroups(sock, params);
	} catch (error) {
		throw unavailable("lookup_failed", "WhatsApp live group lookup failed.", error);
	}
}
//#endregion
export { listWhatsAppDirectoryGroupsFromConfig as n, listWhatsAppDirectoryPeersFromConfig as r, directory_config_exports as t };
