import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { s as trackAsyncWork } from "./async-work-scope-BH2yUdBz.mjs";
import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import "./utils-gjJ-tD2q.mjs";
import { d as sleepWithAbort, o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import "./errors-DPfGDWk1.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { s as retainCurrentWorkerNativeSection } from "./worker-task-native-sections-DVlyZQtL.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { i as isSafeOAuthPostClaimSettlement, r as isSafeOAuthOwnerRefreshResult } from "./oauth-shared-CiaJlx_D.mjs";
import { i as isPendingOAuthRefreshFence, n as createOAuthRefreshFence, r as isOAuthRefreshFence, t as createFailedOAuthRefreshFence } from "./oauth-refresh-marker-Dio1lCzm.mjs";
import { r as hasUsableOAuthCredential } from "./credential-state-NmgqOc1o.mjs";
import { p as withSqliteWorkerCleanupFailure } from "./sqlite-worker-store-Bzw_c0pA.mjs";
import { _ as resolveAuthProfileDatabaseOwnerId, a as inspectPersistedAuthProfileStoreRaw, z as prepareSharedAuthStoreOwnershipForNative } from "./sqlite-BlFpr2YD.mjs";
import { d as resolveSharedAuthStorePath, u as resolveSharedAuthStoreOwnershipAsync } from "./path-resolve-21Orzn6B.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import "./backoff-N5Hi0doU.mjs";
import { n as prepareAgentAuthProfileRowsRead } from "./sqlite-read-BnaiPHv1.mjs";
import "./worker-DKr4WoBi.mjs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/auth-profiles/paths.ts
/**
* Public path barrel for auth-profile stores.
* Import through this file for canonical SQLite display and lock paths.
*/
function selectLocalDisplayPath(localPath, status) {
	return status !== void 0 && status !== "missing" ? localPath : void 0;
}
function normalizeDisplayPath(pathname, env = process.env) {
	return pathname.startsWith("~") ? pathname : resolveUserPath(pathname, env);
}
/**
* @deprecated Display provider/profile identifiers instead. Public database-path displays are retired;
* there is no public async path replacement. Bundled callers use AuthStorage.resolvePathForDisplayAsync.
* Supported through 2026-12-31; removal ships in the first January 2027 stable release.
*/
function resolveAuthStorePathForDisplay(agentDir) {
	warnPluginSdkDeprecation({
		family: "auth-profile-sync-operations",
		method: "resolveAuthStorePathForDisplay",
		replacement: "provider/profile identifiers for displays (there is no public async database-path replacement)"
	});
	prepareSharedAuthStoreOwnershipForNative();
	return normalizeDisplayPath(selectLocalDisplayPath(agentDir ? path.join(resolveUserPath(agentDir), "openclaw-agent.sqlite") : void 0, agentDir ? inspectPersistedAuthProfileStoreRaw(agentDir).status : void 0) ?? resolveSharedAuthStorePath());
}
/** Resolve the selected auth store's display path without host-thread SQLite. */
async function resolveAuthStorePathForDisplayAsync(agentDir, env = process.env) {
	const capturedEnv = cloneEnvWithPlatformSemantics(env);
	capturedEnv.OPENCLAW_STATE_DIR = resolveStateDir(capturedEnv);
	const localPath = agentDir ? path.join(resolveUserPath(agentDir, capturedEnv), "openclaw-agent.sqlite") : void 0;
	const local = localPath ? prepareAgentAuthProfileRowsRead({
		databasePath: localPath,
		agentId: resolveAuthProfileDatabaseOwnerId(path.dirname(localPath)),
		env: capturedEnv
	}) : void 0;
	let result;
	try {
		let selected;
		if (local) selected = selectLocalDisplayPath(localPath, (await local.read()).store.status);
		if (selected === void 0) {
			await resolveSharedAuthStoreOwnershipAsync(captureOpenClawStateWorkerContext({ env: capturedEnv }));
			selected = resolveSharedAuthStorePath(capturedEnv);
		}
		result = {
			ok: true,
			value: normalizeDisplayPath(selected, capturedEnv)
		};
	} catch (error) {
		result = {
			ok: false,
			error
		};
	}
	try {
		await local?.dispose();
	} catch (error) {
		throw result.ok ? error : withSqliteWorkerCleanupFailure(toErrorObject(result.error, "Auth display path read failed"), error);
	}
	if (!result.ok) throw result.error;
	return result.value;
}
/** Private model preparation checks its caller authority once before consuming the label. */
async function withPreparedAuthStorePathForDisplay(agentDir, env, assertCurrent, consume) {
	const pathname = await resolveAuthStorePathForDisplayAsync(agentDir, env);
	assertCurrent();
	return consume(pathname);
}
/** @deprecated Use resolveAuthStatePathForDisplayAsync in runtime callers. */
function resolveAuthStatePathForDisplay(agentDir) {
	return resolveAuthStorePathForDisplay(agentDir);
}
/** Retained terminology for the selected auth store's async display path. */
const resolveAuthStatePathForDisplayAsync = resolveAuthStorePathForDisplayAsync;
//#endregion
//#region src/agents/auth-profiles/oauth-refresh-fence.ts
/** Full structural equality for compare-and-swap of persisted OAuth credentials. */
function isExactOAuthCredential(current, expected) {
	return current?.type === "oauth" && isDeepStrictEqual(current, expected);
}
function hasUnexpiredOAuthCredential(credential) {
	return hasUsableOAuthCredential(credential, { refreshMarginMs: 0 });
}
function createOAuthRefreshTimeoutError(label, timeoutMs) {
	return /* @__PURE__ */ new Error(`OAuth refresh call "${label}" exceeded hard timeout (${timeoutMs}ms)`);
}
/**
* Observe one durable refresh claim without retaining a process-local owner.
* Reads happen between bounded sleeps, so no store lock spans the wait.
*/
async function observeOAuthRefreshFenceSettlement(params) {
	const deadline = performance.now() + params.timeoutMs;
	while (true) {
		params.signal?.throwIfAborted();
		const snapshot = await observeOAuthRefreshSettlementBeforeDeadline(params.label, params.timeoutMs, deadline, Promise.resolve().then(() => params.read()), params.signal);
		params.signal?.throwIfAborted();
		if (!params.isPending(snapshot)) return await params.resolve(snapshot);
		const remainingMs = deadline - performance.now();
		if (remainingMs <= 0) throw createOAuthRefreshTimeoutError(params.label, params.timeoutMs);
		await sleepWithAbort(Math.min(25, Math.ceil(remainingMs)), params.signal);
	}
}
/** Normalize provider-default serialized OAuth data into an owned profile credential. */
function normalizeOAuthRefreshCredential(credential, fallbackProvider) {
	if (!credential) return;
	return {
		...credential,
		type: "oauth",
		provider: typeof credential.provider === "string" && credential.provider.trim() ? credential.provider : fallbackProvider
	};
}
/**
* Run the durable fence protocol for provider-keyed serialized stores.
* Backend locks cover only exact-CAS reads and writes; provider callbacks run outside them.
*/
function refreshSerializedOAuthCredential(params) {
	return trackAsyncWork(() => runSerializedOAuthRefresh(params));
}
async function runSerializedOAuthRefresh(params) {
	const selectCandidate = (data, credential) => {
		if (!credential || credential.provider !== params.provider) return { kind: "unavailable" };
		if (isOAuthRefreshFence(credential)) return isPendingOAuthRefreshFence(credential) ? {
			kind: "observe",
			generation: credential
		} : { kind: "unavailable" };
		return hasUnexpiredOAuthCredential(credential) ? {
			kind: "use",
			credential,
			data
		} : {
			kind: "claimable",
			credential
		};
	};
	const observeFence = async (generation) => await observeOAuthRefreshFenceSettlement({
		label: params.label,
		timeoutMs: params.timeoutMs,
		read: () => params.backend.withLock((current) => {
			const data = params.parse(current);
			return { result: {
				credential: params.readCredential(data),
				data
			} };
		}),
		isPending: ({ credential }) => credential?.provider === generation.provider && isPendingOAuthRefreshFence(credential),
		resolve: async ({ credential, data }) => {
			if (!isSafeOAuthPostClaimSettlement(generation, credential)) return null;
			await params.commit(data);
			return await params.resolve(credential);
		}
	});
	const candidate = await params.backend.withLock((current) => {
		const data = params.parse(current);
		return { result: selectCandidate(data, params.readCredential(data)) };
	});
	if (candidate.kind === "unavailable") return null;
	if (candidate.kind === "observe") return await observeFence(candidate.generation);
	if (candidate.kind === "use") {
		await params.commit(candidate.data);
		return await params.resolve(candidate.credential);
	}
	if (!await params.canRefresh(candidate.credential)) return null;
	let releaseNativeSection;
	let settlement;
	try {
		const claim = await params.backend.withLock((current) => {
			const data = params.parse(current);
			const credential = params.readCredential(data);
			if (!credential || credential.provider !== params.provider) return { result: { kind: "unavailable" } };
			if (!isExactOAuthCredential(credential, candidate.credential)) {
				const currentCandidate = selectCandidate(data, credential);
				return { result: currentCandidate.kind === "claimable" ? { kind: "unavailable" } : currentCandidate };
			}
			const fence = createOAuthRefreshFence({
				profileId: params.profileId,
				credential
			});
			releaseNativeSection = retainCurrentWorkerNativeSection();
			const nextData = params.writeCredential(data, fence);
			return {
				result: {
					kind: "claimed",
					credential,
					fence,
					data,
					nextData
				},
				next: params.serialize(nextData)
			};
		});
		if (claim.kind === "unavailable") return null;
		if (claim.kind === "observe") return await observeFence(claim.generation);
		if (claim.kind === "use") {
			await params.commit(claim.data);
			return await params.resolve(claim.credential);
		}
		const markFailed = async () => {
			const failed = await params.backend.withLock((current) => {
				const data = params.parse(current);
				if (!isExactOAuthCredential(params.readCredential(data), claim.fence)) return { result: null };
				const nextData = params.writeCredential(data, createFailedOAuthRefreshFence(claim.fence));
				return {
					result: nextData,
					next: params.serialize(nextData)
				};
			});
			if (failed) await params.commit(failed);
		};
		const settleFailure = async (failure) => {
			const normalizedInitiatingError = failure ? toErrorObject(failure.error, "OAuth refresh failed") : void 0;
			try {
				await markFailed();
			} catch (cleanupError) {
				const normalizedCleanupError = toErrorObject(cleanupError, "OAuth refresh terminal fencing failed");
				if (!normalizedInitiatingError) throw normalizedCleanupError;
				throw new AggregateError([normalizedInitiatingError, normalizedCleanupError], "OAuth refresh failed and terminal fencing could not be completed.", { cause: normalizedInitiatingError });
			}
			if (normalizedInitiatingError) throw normalizedInitiatingError;
			return null;
		};
		try {
			await params.commit(claim.nextData);
		} catch (error) {
			return await settleFailure({ error });
		}
		settlement = trackAsyncWork(async () => {
			let refreshed;
			try {
				refreshed = await params.refresh(claim.credential, claim.data);
			} catch (error) {
				return settleFailure({ error });
			}
			if (!refreshed) return settleFailure();
			try {
				if (!hasUnexpiredOAuthCredential(refreshed.credential)) throw new Error("OAuth refresh returned an unusable credential");
				if (!isSafeOAuthOwnerRefreshResult(claim.credential, refreshed.credential)) throw new Error("OAuth refresh returned credentials for a different OAuth account");
				const settled = await params.backend.withLock((current) => {
					const data = params.parse(current);
					const authoritative = params.readCredential(data);
					if (isExactOAuthCredential(authoritative, claim.fence)) {
						const nextData = params.writeCredential(data, refreshed.credential);
						return {
							result: {
								credential: refreshed.credential,
								data: nextData,
								persisted: true
							},
							next: params.serialize(nextData)
						};
					}
					return { result: isSafeOAuthPostClaimSettlement(claim.credential, authoritative) ? {
						credential: authoritative,
						data,
						persisted: false
					} : null };
				});
				if (!settled) throw new Error("OAuth credential owner changed before refresh completed");
				await params.commit(settled.data);
				return settled.persisted ? refreshed : await params.resolve(settled.credential);
			} catch (error) {
				return settleFailure({ error });
			}
		});
		const finish = () => releaseNativeSection?.();
		settlement.then(finish, finish);
		return await observeOAuthRefreshSettlement(params.label, params.timeoutMs, settlement);
	} finally {
		if (!settlement) releaseNativeSection?.();
	}
}
/** Observe a refresh owner without canceling its durable settlement after timeout. */
async function observeOAuthRefreshSettlement(label, timeoutMs, settlement, signal) {
	return await observeOAuthRefreshSettlementBeforeDeadline(label, timeoutMs, performance.now() + timeoutMs, settlement, signal);
}
async function observeOAuthRefreshSettlementBeforeDeadline(label, timeoutMs, deadline, settlement, signal) {
	let timeoutHandle;
	try {
		return await racePromiseWithAbortSignal(new Promise((resolve, reject) => {
			timeoutHandle = setTimeout(() => {
				reject(createOAuthRefreshTimeoutError(label, timeoutMs));
			}, Math.max(0, Math.ceil(deadline - performance.now())));
			settlement.finally(() => {
				if (performance.now() >= deadline) throw createOAuthRefreshTimeoutError(label, timeoutMs);
			}).then(resolve, reject);
		}), signal);
	} finally {
		if (timeoutHandle) clearTimeout(timeoutHandle);
	}
}
//#endregion
export { refreshSerializedOAuthCredential as a, resolveAuthStorePathForDisplay as c, observeOAuthRefreshSettlement as i, resolveAuthStorePathForDisplayAsync as l, normalizeOAuthRefreshCredential as n, resolveAuthStatePathForDisplay as o, observeOAuthRefreshFenceSettlement as r, resolveAuthStatePathForDisplayAsync as s, isExactOAuthCredential as t, withPreparedAuthStorePathForDisplay as u };
