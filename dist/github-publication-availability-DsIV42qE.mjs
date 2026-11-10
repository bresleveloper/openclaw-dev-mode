import { n as SessionWorktreeSourceChangedError } from "./errors-WYf-uyBk.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { r as captureOpenClawStateWorkerContext, t as captureOpenClawStateReadContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { a as getActiveSecretsRuntimeConfigSnapshot } from "./runtime-state-DDDhACod.mjs";
import { g as retainPreparedSessionEntryPredicate } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { a as readCapturedSessionActorEntry, n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { l as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { D as getSessionRepositoryWorkspaceStore } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { t as captureGitHubPublicationLifecycle } from "./github-publication-receipts-WUg6AvYk.mjs";
import { a as resolveSessionStoreIdentity } from "./session-store-key-DKpto8R6.mjs";
import "./config-B3oiWDlr.mjs";
import { t as findCanonicalStoreMatch } from "./session-utils-store-selection-DIMLgaMc.mjs";
import { t as loadGatewaySessionEntryReadOnlyInWorker } from "./session-utils-store-worker-u3lCvEEg.mjs";
import { t as createStaleWhileRevalidateCache } from "./stale-while-revalidate-cache-DAV-95y_.mjs";
import { a as prepareGitHubPublicationIdentity, i as matchesPreparedGitHubPublicationIdentity, o as prepareGitHubPublicationOptionsIdentity } from "./github-tool-identity-BEdbceu6.mjs";
import { r as requestCurrentGitHubOAuthRefresh } from "./github-oauth-lifecycle-BAlR2l66.mjs";
import { s as readLiveRegistryWorktreeByOwner, t as captureWorktreeRegistryReadGuard } from "./registry-read-Do2Ks9un.mjs";
import { a as managedWorktrees } from "./service-BPAgan76.mjs";
import { a as GitHubPublicationSessionChangedError, c as rejectGitHubPublicationSelection, s as GitHubPublicationWorkspaceChangedError } from "./github-publication-failure-ByPq2Muc.mjs";
import { t as GitHubPublicationRecoveryPendingError } from "./github-publication-git-index-4ApBmbV1.mjs";
import { t as parseGitHubRemoteUrl } from "./github-remote-rTdEnJZN.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/state/github-publication-session-lifecycles.ts
/** Retain the immutable binding separately from request status and other authority owners. */
async function prepareGitHubPublicationSessionLifecycle(input) {
	const authority = captureGitHubPublicationLifecycle(captureOpenClawStateReadContext(), input);
	if (!authority.loaded) authority.observe(await readGitHubPublicationSessionLifecycleInWorker(input));
	return { readCurrent: authority.readCurrent };
}
async function readGitHubPublicationSessionLifecycleInWorker(input) {
	const { publicationKind, requestId } = input;
	const result = await executeExistingOpenClawStateRead({}, {
		type: "githubPublication.lifecycle",
		publicationKind,
		requestId
	}, { current: true });
	if (!result) throw new Error("GitHub publication requester metadata is unavailable.");
	return result.lifecycle;
}
//#endregion
//#region src/gateway/github-publication-availability.ts
const worktreeTargets = createStaleWhileRevalidateCache({
	maxEntries: 256,
	maxPending: Number.POSITIVE_INFINITY,
	ttlMs: 15e3,
	cacheable: (target) => target.supported
});
function publicationConfigSnapshot() {
	const active = getActiveSecretsRuntimeConfigSnapshot();
	if (active) return active;
	const config = readRuntimeConfig();
	return {
		config,
		sourceConfig: config
	};
}
function assertExpectedSharedGitHubPublisher(expected, actual, preparation) {
	if (actual.source === "personal" || expected && (expected.source !== actual.source || expected.accountId !== actual.accountId || expected.login.toLowerCase() !== actual.login.toLowerCase())) rejectGitHubPublicationSelection("GitHub publication identity changed; review the current shared account and try again.", preparation);
}
function currentGitHubPublicationConfig() {
	return publicationConfigSnapshot().config;
}
async function prepareCurrentGitHubPublicationIdentity(agentId) {
	await requestCurrentGitHubOAuthRefresh(agentId);
	const snapshot = publicationConfigSnapshot();
	return await prepareGitHubPublicationIdentity({
		config: snapshot.config,
		sourceConfig: snapshot.sourceConfig,
		agentId
	});
}
async function prepareCurrentGitHubPublicationOptionsIdentity(agentId, assertCurrent) {
	assertCurrent?.();
	await requestCurrentGitHubOAuthRefresh(agentId);
	assertCurrent?.();
	const snapshot = publicationConfigSnapshot();
	return await prepareGitHubPublicationOptionsIdentity({
		config: snapshot.config,
		sourceConfig: snapshot.sourceConfig,
		agentId,
		assertCurrent
	});
}
function matchesCurrentGitHubPublicationIdentity(params) {
	return matchesPreparedGitHubPublicationIdentity({
		config: currentGitHubPublicationConfig(),
		...params
	});
}
/** The selected publication metadata is invalidated by the session writer's receipts. */
async function prepareGitHubPublicationSession(sessionKey, options = {}) {
	const fields = options.fields ?? [
		"sessionId",
		"lifecycleRevision",
		"archivedAt",
		"repositoryWorkspaceId",
		"worktree",
		"owner",
		"createdActor",
		"visibility",
		"incognito"
	];
	let retained;
	let active = true;
	const scope = {
		sessionKey,
		agentId: options.agentId,
		storePath: options.target?.storePath
	};
	const assertCurrent = () => options.assertCurrent?.();
	const memory = captureSessionActorStorageOwner(scope, {
		assertCurrent,
		authorize: assertCurrent
	});
	const readMemory = memory && (() => ({
		canonicalKey: sessionKey,
		agentId: memory.agentId,
		storePath: memory.path,
		entry: readCapturedSessionActorEntry(memory, sessionKey)
	}));
	const retain = (databaseIdentity, key, entry) => {
		retained = retainPreparedSessionEntryPredicate({
			databaseIdentity,
			sessionKey: key,
			entry,
			matches: (before, after) => fields.every((field) => isDeepStrictEqual(before?.[field], after?.[field]))
		});
	};
	let loaded;
	try {
		if (readMemory) loaded = readMemory();
		else if (options.target?.storePath && options.target.agentId) {
			const storePath = options.target.storePath;
			const agentId = options.target.agentId;
			const storedKey = options.target.sessionKey ?? sessionKey;
			loaded = await withSessionEntryReadOnlyInWorker({
				agentId,
				sessionKey: storedKey,
				storePath,
				projection: []
			}, () => options.assertCurrent?.(), async (read, owner) => {
				if (!read.ok) throw read.error;
				if (typeof owner.source?.databaseIdentity === "string") retain(`file:${owner.source.databaseIdentity}`, storedKey, read.value);
				return {
					agentId,
					canonicalKey: sessionKey,
					storePath,
					entry: read.value
				};
			});
		} else loaded = await loadGatewaySessionEntryReadOnlyInWorker({
			cfg: options.cfg ?? readRuntimeConfig(),
			key: sessionKey,
			agentId: options.agentId,
			projection: [],
			assertActive: options.assertCurrent,
			onSelected(target) {
				const source = target.capturedReadSource;
				if (source && typeof source.databaseIdentity === "string") retain(`file:${source.databaseIdentity}`, target.canonicalKey, findCanonicalStoreMatch(target.store, target.storeKeys)?.entry);
			}
		});
	} catch (error) {
		retained?.release();
		throw error;
	}
	const release = () => {
		active = false;
		retained?.release();
	};
	return {
		loaded,
		readCurrent() {
			options.assertCurrent?.();
			if (!active || retained && !retained.isCurrent()) throw new GitHubPublicationSessionChangedError();
			return readMemory ? readMemory() : {
				...loaded,
				entry: retained ? retained.readRetainedEntry() : loaded.entry
			};
		},
		release,
		[Symbol.dispose]: release
	};
}
function requirePublicationSessionOwner(params, loaded, allowArchived = false) {
	const entry = loaded.entry;
	if (loaded.agentId !== params.agentId || loaded.canonicalKey !== params.sessionKey || entry?.sessionId !== params.sessionId || !allowArchived && entry.archivedAt !== void 0 || params.lifecycleRevision !== void 0 && (entry.lifecycleRevision ?? null) !== params.lifecycleRevision) throw new GitHubPublicationSessionChangedError();
	return {
		...loaded,
		entry
	};
}
function requirePublicationWorktreeOwner(loaded, worktree, expected) {
	const entry = loaded.entry;
	if (!entry.worktree?.id || !worktree || worktree.removedAt !== void 0 || worktree.id !== entry.worktree.id || worktree.ownerKind !== "session" || worktree.ownerId !== loaded.canonicalKey || worktree.branch !== entry.worktree.branch || worktree.repoRoot !== entry.worktree.repoRoot) throw new GitHubPublicationSessionChangedError();
	if (expected && (worktree.id !== expected.worktreeId || worktree.repoFingerprint !== expected.repositoryFingerprint || worktree.branch !== expected.branch)) throw new GitHubPublicationWorkspaceChangedError("GitHub publication workspace authority changed.");
	return {
		loaded,
		worktree
	};
}
function rejectChangedPublicationWorktree(error) {
	if (error instanceof SessionWorktreeSourceChangedError) throw new GitHubPublicationWorkspaceChangedError(error.message);
	throw error;
}
function preparePublicationWorktreeRead(loaded, context, session, expected) {
	const identity = {
		sessionId: loaded.entry.sessionId,
		sessionKey: loaded.canonicalKey,
		agentId: loaded.agentId,
		lifecycleRevision: loaded.entry.lifecycleRevision ?? null
	};
	const workspaceId = loaded.entry.repositoryWorkspaceId;
	const selection = expected ? { ...expected } : void 0;
	return async () => {
		const acceptRead = captureWorktreeRegistryReadGuard(context, "publication");
		const worktree = await readLiveRegistryWorktreeByOwner(context, "session", identity.sessionKey);
		let assertRow;
		try {
			assertRow = acceptRead(worktree);
		} catch (error) {
			rejectChangedPublicationWorktree(error);
		}
		context.admission.assertCurrent();
		if (!worktree) throw new GitHubPublicationSessionChangedError();
		const current = requirePublicationSessionOwner(identity, session.readCurrent());
		if (current.entry.repositoryWorkspaceId !== workspaceId) throw new GitHubPublicationSessionChangedError();
		const assertCurrent = () => {
			context.admission.assertCurrent();
			const latest = requirePublicationSessionOwner(identity, session.readCurrent());
			if (latest.entry.repositoryWorkspaceId !== workspaceId) throw new GitHubPublicationSessionChangedError();
			try {
				assertRow();
			} catch (error) {
				rejectChangedPublicationWorktree(error);
			}
			return requirePublicationWorktreeOwner(latest, worktree, selection);
		};
		return {
			...requirePublicationWorktreeOwner(current, worktree, selection),
			assertCurrent,
			assertRegistryCurrent: assertRow
		};
	};
}
async function readGitHubPublicationWorktreeOwner(params) {
	const context = captureOpenClawStateWorkerContext();
	const session = await prepareGitHubPublicationSession(params.sessionKey, {
		agentId: params.agentId,
		assertCurrent: () => context.admission.assertCurrent()
	});
	try {
		return {
			...await preparePublicationWorktreeRead(requirePublicationSessionOwner(params, session.readCurrent()), context, session, params.expected)(),
			release: session.release,
			[Symbol.dispose]: session.release
		};
	} catch (error) {
		session.release();
		throw error;
	}
}
function resolveGitHubPublicationWorkspaceOwner(params, prepared, session) {
	const loaded = requirePublicationSessionOwner(params, session.readCurrent());
	const workspaceId = loaded.entry.repositoryWorkspaceId;
	if (!workspaceId) throw new GitHubPublicationSessionChangedError();
	const workspace = prepared?.current();
	if (!workspace || workspace.workspaceId !== workspaceId || workspace.agentId !== params.agentId || workspace.sessionKey !== params.sessionKey) throw new Error("GitHub publication session repository owner changed.");
	return {
		kind: "repository",
		loaded,
		workspace
	};
}
async function prepareGitHubPublicationWorkspaceOwner(params, options = {}) {
	const context = captureOpenClawStateWorkerContext();
	const assertCurrent = () => {
		context.admission.assertCurrent();
		options.assertCurrent?.();
	};
	assertCurrent();
	const target = options.sessionTarget;
	if (target) {
		const logical = target.sessionKey && resolveSessionStoreIdentity({
			cfg: readRuntimeConfig(),
			sessionKey: target.sessionKey,
			agentId: target.agentId
		});
		if (!target.storePath || !logical || logical.agentId !== params.agentId || logical.canonicalKey !== params.sessionKey) throw new GitHubPublicationSessionChangedError();
	}
	const session = await prepareGitHubPublicationSession(params.sessionKey, {
		agentId: params.agentId,
		assertCurrent,
		target
	});
	try {
		const snapshot = session.readCurrent();
		if (target && (target.agentId !== params.agentId || target.sessionId !== params.sessionId || target.expectedLifecycleRevision !== void 0 && snapshot.entry?.lifecycleRevision !== target.expectedLifecycleRevision || target.expectedWriterRunId !== void 0 && snapshot.entry?.activeWriterRunId !== target.expectedWriterRunId)) throw new GitHubPublicationSessionChangedError();
		const loaded = requirePublicationSessionOwner(params, snapshot);
		const workspaceId = loaded.entry.repositoryWorkspaceId;
		if (!workspaceId && !loaded.entry.worktree?.id) throw new GitHubPublicationSessionChangedError();
		const identity = {
			...params,
			lifecycleRevision: loaded.entry.lifecycleRevision ?? null
		};
		const readWorktree = preparePublicationWorktreeRead(loaded, context, session);
		const prepared = workspaceId ? await getSessionRepositoryWorkspaceStore().prepare(workspaceId) : void 0;
		const validate = (owner) => {
			assertCurrent();
			if (owner.loaded.entry.repositoryWorkspaceId !== workspaceId) throw new GitHubPublicationSessionChangedError();
			return owner;
		};
		const read = async () => validate(workspaceId ? resolveGitHubPublicationWorkspaceOwner(identity, prepared, session) : {
			kind: "worktree",
			...await readWorktree()
		});
		return {
			initial: await read(),
			read,
			currentRepository: () => validate(resolveGitHubPublicationWorkspaceOwner(identity, prepared, session)),
			release: session.release,
			[Symbol.dispose]: session.release
		};
	} catch (error) {
		session.release();
		throw error;
	}
}
async function hasGitHubPublicationRepositoryWorkspace(params) {
	try {
		var _usingCtx$1 = _usingCtx();
		const prepared = await prepareGitHubPublicationWorkspaceOwner(params);
		_usingCtx$1.u({ [Symbol.dispose]: () => prepared.release() });
		return prepared.initial.kind === "repository";
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
	}
}
function sameGitHubPublicationWorkspace(first, current) {
	if (first.loaded.entry?.lifecycleRevision !== current.loaded.entry?.lifecycleRevision) return false;
	return first.kind === "repository" ? current.kind === "repository" && current.workspace.workspaceId === first.workspace.workspaceId && current.workspace.url === first.workspace.url && current.workspace.branch === first.workspace.branch : current.kind === "worktree" && current.worktree.id === first.worktree.id && current.worktree.repoFingerprint === first.worktree.repoFingerprint && current.worktree.branch === first.worktree.branch;
}
async function localGitHubPublicationSessionIdentity(row) {
	const authority = await prepareGitHubPublicationSessionLifecycle({
		publicationKind: row.identity_source === "personal" ? "personal" : "shared",
		requestId: row.request_id
	}).catch((cause) => {
		throw new GitHubPublicationRecoveryPendingError("GitHub publication lifecycle authority is unavailable; retry recovery.", { cause });
	});
	const readLifecycle = () => {
		try {
			return authority.readCurrent();
		} catch (cause) {
			throw new GitHubPublicationRecoveryPendingError("GitHub publication lifecycle authority is unavailable; retry recovery.", { cause });
		}
	};
	const lifecycle = readLifecycle();
	if (!lifecycle) throw new GitHubPublicationSessionChangedError();
	return {
		sessionId: row.session_id,
		sessionKey: row.session_key,
		agentId: row.agent_id,
		lifecycleRevision: lifecycle.lifecycle_revision,
		assertLifecycleCurrent: readLifecycle,
		expected: {
			worktreeId: row.worktree_id,
			repositoryFingerprint: row.repository_fingerprint,
			branch: row.branch
		}
	};
}
async function readLocalGitHubPublicationWorktreeOwner(row) {
	const identity = await localGitHubPublicationSessionIdentity(row);
	const owner = await readGitHubPublicationWorktreeOwner(identity);
	return {
		...owner,
		assertCurrent: () => {
			identity.assertLifecycleCurrent();
			return owner.assertCurrent();
		}
	};
}
/** Discovery validates the same registered repository identity as publication, without GitHub I/O. */
async function prepareGitHubPublicationRepositoryIdentity(params) {
	const { worktree, assertCurrent } = params;
	assertCurrent();
	const repositoryIdentity = await managedWorktrees.resolveRepositoryIdentity(worktree.path);
	assertCurrent();
	if (repositoryIdentity.checkoutRoot !== worktree.path || repositoryIdentity.repoRoot !== worktree.repoRoot || repositoryIdentity.fingerprint !== worktree.repoFingerprint) throw new GitHubPublicationWorkspaceChangedError("GitHub publication workspace repository changed.");
	return repositoryIdentity;
}
function isSupportedGitHubOrigin(originUrl) {
	const remote = parseGitHubRemoteUrl(originUrl);
	return Boolean(remote && /^[A-Za-z0-9_.-]+$/u.test(remote.owner) && /^[A-Za-z0-9_.-]+$/u.test(remote.repo));
}
/** Qualify only the target; execution still owns branch, permission and publication checks. */
async function hasSupportedGitHubPublicationTarget(session, assertCurrent) {
	try {
		var _usingCtx3 = _usingCtx();
		assertCurrent();
		const context = captureOpenClawStateWorkerContext();
		const sessionRead = await prepareGitHubPublicationSession(session.sessionKey, {
			agentId: session.agentId,
			assertCurrent
		});
		_usingCtx3.u({ [Symbol.dispose]: () => sessionRead.release() });
		const initial = requirePublicationSessionOwner(session, sessionRead.readCurrent(), true);
		context.admission.assertCurrent();
		if (initial.entry.archivedAt !== void 0) return false;
		const workspaceId = initial.entry.repositoryWorkspaceId;
		if (workspaceId) {
			const prepared = await getSessionRepositoryWorkspaceStore().prepare(workspaceId);
			assertCurrent();
			return isSupportedGitHubOrigin(resolveGitHubPublicationWorkspaceOwner(session, prepared, sessionRead).workspace.url);
		}
		if (!initial.entry.worktree?.id) return false;
		const owner = await preparePublicationWorktreeRead(initial, context, sessionRead)();
		const assertWorktreeCurrent = () => {
			assertCurrent();
			owner.assertCurrent();
		};
		assertWorktreeCurrent();
		const key = `${context.admission.databasePath}\0${owner.worktree.id}`;
		const load = async () => {
			return {
				supported: isSupportedGitHubOrigin((await prepareGitHubPublicationRepositoryIdentity({
					worktree: owner.worktree,
					assertCurrent: owner.assertRegistryCurrent
				})).originUrl),
				assertCurrent: owner.assertRegistryCurrent
			};
		};
		let target = await worktreeTargets.read(key, load, { allowStale: false });
		try {
			target.value.assertCurrent();
		} catch {
			worktreeTargets.deleteValue(target.value);
			target = await worktreeTargets.read(key, load, { allowStale: false });
		}
		assertWorktreeCurrent();
		return target.value.supported;
	} catch (_) {
		_usingCtx3.e = _;
	} finally {
		_usingCtx3.d();
	}
}
//#endregion
export { matchesCurrentGitHubPublicationIdentity as a, prepareGitHubPublicationRepositoryIdentity as c, readGitHubPublicationWorktreeOwner as d, readLocalGitHubPublicationWorktreeOwner as f, readGitHubPublicationSessionLifecycleInWorker as h, hasSupportedGitHubPublicationTarget as i, prepareGitHubPublicationSession as l, prepareGitHubPublicationSessionLifecycle as m, currentGitHubPublicationConfig as n, prepareCurrentGitHubPublicationIdentity as o, sameGitHubPublicationWorkspace as p, hasGitHubPublicationRepositoryWorkspace as r, prepareCurrentGitHubPublicationOptionsIdentity as s, assertExpectedSharedGitHubPublisher as t, prepareGitHubPublicationWorkspaceOwner as u };
