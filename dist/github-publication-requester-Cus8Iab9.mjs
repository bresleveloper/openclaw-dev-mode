import { n as ok } from "./result-BQGgYouL.mjs";
import { O as listAgentIds } from "./agent-scope-config-IQKOEtZ4.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CUi_tcgF.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { i as readDatabasePathIdentitySync } from "./sqlite-worker-identity-CR_ZuhW6.mjs";
import { i as resolveIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { t as sessionChanges } from "./session-row-changes-xuu0eHng.mjs";
import { a as roleScopesAllow } from "./operator-scope-compat-Ci6GBcmU.mjs";
import "./user-profile-constants-DfyZS95p.mjs";
import { a as registerOpenClawAgentDatabaseAsyncResource, i as matchesAgentDatabaseReadCandidatePath, o as registerOpenClawAgentDatabaseReadCandidateResource } from "./openclaw-agent-db-resources-o9110hVL.mjs";
import { l as getOpenIncognitoAgentDatabase } from "./openclaw-agent-db-lifecycle-D7S9DdJC.mjs";
import { a as prepareOpenClawAgentDatabaseRegistrySnapshotRead } from "./openclaw-agent-db-registry-listing-CHFiKgU_.mjs";
import { O as UserProfileMutationUnsettledError } from "./user-profiles-internal-BxQLnWfo.mjs";
import { r as prepareUserProfileIdentity } from "./user-profile-list-B5pNqyXa.mjs";
import { f as resolveOperatorRolePolicyForAssignment, u as resolveGatewayOperatorRoleActor } from "./operator-role-policy-Bt6aG_wj.mjs";
import { c as resumeGatewayOperatorAccessGrant, n as GatewayOperatorAccessDeniedError } from "./operator-access-policy-D8OrWXWF.mjs";
import { l as assertSessionStoreReadCandidate } from "./session-sqlite-target-Dcog4O-M.mjs";
import { r as onSessionIdentityMutation } from "./session-lifecycle-events-DiXxneBV.mjs";
import { c as readCommittedIncognitoSessionSharing, f as retainPreparedSessionSharingFacts, n as isPreparedSessionSharingChange, r as projectSessionSharingEntry } from "./session-accessor.sqlite-entry-cache-CtMz7hDz.mjs";
import { s as gitNullConfigPath } from "./git-exec-B6ZpVpQV.mjs";
import { i as readSessionEntriesFromStoreInWorker } from "./session-accessor-C05KQ5A3.mjs";
import { r as resolveSessionStoreIdentity } from "./session-store-key-BoleEY7N.mjs";
import { n as prepareSessionStoreTargetInventory } from "./session-store-target-inventory-DlNs585E.mjs";
import { o as withSessionHistoryWorkerReadCandidates } from "./session-transcript-worker-runtime-C8IP_HKT.mjs";
import { t as createSyntheticPluginRuntimeClient } from "./server-plugin-runtime-client-evzAFJT4.mjs";
import { t as captureGatewayOperatorRunAuthority } from "./operator-run-authority-siPNmoXo.mjs";
import { n as prepareGatewaySessionStoreTargetReadOnly } from "./session-utils-store-lookup-CVR56ULk.mjs";
import { c as resolveCanonicalSessionStoreMatchFromStoreKeys } from "./session-utils-store-DqGvpsY3.mjs";
import { N as authorizePreparedSessionMutation, X as prepareSessionCreatorProfile, j as authorizeIncognitoSessionTarget } from "./session-sharing-C_5FkkwM.mjs";
import { m as decodeGitHubPublicationRequester } from "./github-publication-availability-miwhWx-m.mjs";
import { o as GitHubPublicationWorkspaceChangedError, r as GitHubPublicationRequesterUnavailableError } from "./github-publication-failure-B1jd4XaP.mjs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import { createHash } from "node:crypto";
//#region src/gateway/github-publication-git-index.ts
const HARDENED_GIT = [
	"git",
	"-c",
	`core.hooksPath=${os.devNull}`,
	"-c",
	"core.fsmonitor=false"
];
var GitHubPublicationRefCasRejectedError = class extends GitHubPublicationWorkspaceChangedError {};
var GitHubPublicationRecoveryPendingError = class extends Error {};
function assertGitHubPublicationRefCasCompleted(result) {
	if (result.code === 0) return;
	if (result.signal === null && !result.killed) throw new GitHubPublicationRefCasRejectedError("GitHub publication workspace branch changed before commit.");
	throw new Error("GitHub publication workspace branch update outcome is unknown.");
}
async function syncDirectory(directory) {
	let handle;
	try {
		handle = await fs.open(directory, "r");
		await handle.sync();
	} catch (error) {
		const code = typeof error === "object" && error !== null && "code" in error ? error.code : void 0;
		if (process.platform !== "win32" || code !== "EINVAL" && code !== "EPERM") throw error;
	} finally {
		await handle?.close().catch(() => void 0);
	}
}
function errorCode(error) {
	return typeof error === "object" && error !== null && "code" in error ? error.code : void 0;
}
async function sameFile(left, right) {
	try {
		const [leftStat, rightStat] = await Promise.all([fs.stat(left), fs.stat(right)]);
		return leftStat.nlink >= 2 && rightStat.nlink >= 2 && leftStat.dev === rightStat.dev && leftStat.ino === rightStat.ino;
	} catch (error) {
		if (errorCode(error) === "ENOENT") return false;
		throw error;
	}
}
async function pathExists(file) {
	try {
		await fs.stat(file);
		return true;
	} catch (error) {
		if (errorCode(error) === "ENOENT") return false;
		throw error;
	}
}
async function writeDurableFile(file, contents) {
	await fs.writeFile(file, contents, {
		flag: "w",
		mode: 384
	});
	const handle = await fs.open(file, "r+");
	try {
		await handle.sync();
	} finally {
		await handle.close();
	}
}
function publicationRecoveryPath(indexPath, requestId) {
	return `${indexPath}.openclaw-${createHash("sha256").update(requestId).digest("hex")}`;
}
async function recoverGitHubPublicationBranchAndIndex(params) {
	params.assertCustody();
	const mutate = async (operation) => {
		params.assertCustody();
		return await operation();
	};
	const rawIndexPath = await params.run([
		"git",
		"rev-parse",
		"--git-path",
		"index"
	], { cwd: params.cwd });
	const indexPath = path.resolve(params.cwd, rawIndexPath);
	const lockPath = `${indexPath}.lock`;
	const recoveryPath = publicationRecoveryPath(indexPath, params.requestId);
	if (!await pathExists(recoveryPath)) return;
	if (!await sameFile(recoveryPath, lockPath)) {
		if (await pathExists(lockPath)) throw new GitHubPublicationRecoveryPendingError("GitHub publication workspace recovery is waiting for another Git operation.");
		const branchHead = await params.run([
			"git",
			"rev-parse",
			"--verify",
			`refs/heads/${params.branch}`
		], { cwd: params.cwd });
		const indexTree = await params.run([...HARDENED_GIT, "write-tree"], { cwd: params.cwd });
		if (branchHead === params.sourceHeadCommit || indexTree === params.workspaceTree && await publicationCommitMatches(params, branchHead)) {
			await mutate(async () => await fs.rm(recoveryPath, { force: true }));
			return;
		}
		throw new GitHubPublicationRecoveryPendingError("GitHub publication workspace recovery is pending.");
	}
	const branchHead = await params.run([
		"git",
		"rev-parse",
		"--verify",
		`refs/heads/${params.branch}`
	], { cwd: params.cwd });
	if (branchHead === params.sourceHeadCommit) {
		await mutate(async () => await fs.rm(lockPath, { force: true }));
		await mutate(async () => await fs.rm(recoveryPath, { force: true }));
		await mutate(async () => await syncDirectory(path.dirname(indexPath)));
		return;
	}
	if (!await publicationCommitMatches(params, branchHead)) throw new GitHubPublicationRecoveryPendingError("GitHub publication workspace branch recovery is pending.");
	await mutate(async () => await fs.rename(lockPath, indexPath));
	await mutate(async () => await syncDirectory(path.dirname(indexPath)));
	await mutate(async () => await fs.rm(recoveryPath, { force: true }));
}
async function publicationCommitMatches(params, headCommit) {
	const [message, parent, tree] = await Promise.all([
		params.run([
			"git",
			"show",
			"-s",
			"--format=%B",
			headCommit
		], { cwd: params.cwd }),
		params.run([
			"git",
			"rev-parse",
			`${headCommit}^`
		], { cwd: params.cwd }),
		params.run([
			"git",
			"rev-parse",
			`${headCommit}^{tree}`
		], { cwd: params.cwd })
	]);
	return message.split(/\r?\n/u).includes(`OpenClaw-Publication: ${params.requestId}`) && parent === params.sourceHeadCommit && tree === params.workspaceTree;
}
/** Moves the branch and accepted index together while honoring Git's standard index lock. */
async function updateGitHubPublicationBranchAndIndex(params) {
	params.assertCurrent();
	const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-github-index-"));
	const replacementIndex = path.join(tempDir, "replacement-index");
	const observedIndex = path.join(tempDir, "observed-index");
	let lockPath;
	let recoveryPath;
	let ownsLock = false;
	let ownsRecovery = false;
	let refMayHaveMoved = false;
	let installed = false;
	try {
		const rawIndexPath = await params.run([
			"git",
			"rev-parse",
			"--git-path",
			"index"
		], { cwd: params.cwd });
		const indexPath = path.resolve(params.cwd, rawIndexPath);
		lockPath = `${indexPath}.lock`;
		recoveryPath = publicationRecoveryPath(indexPath, params.requestId);
		const gitEnv = {
			...params.env,
			GIT_CONFIG_GLOBAL: gitNullConfigPath(),
			GIT_CONFIG_SYSTEM: gitNullConfigPath()
		};
		await params.run([
			...HARDENED_GIT,
			"read-tree",
			params.headCommit
		], {
			cwd: params.cwd,
			env: {
				...gitEnv,
				GIT_INDEX_FILE: replacementIndex
			}
		});
		const replacement = await fs.readFile(replacementIndex);
		let recoveryIndex;
		try {
			recoveryIndex = await fs.readFile(recoveryPath);
		} catch (error) {
			if (errorCode(error) !== "ENOENT") throw error;
		}
		if (recoveryIndex && !recoveryIndex.equals(replacement)) {
			const branchHead = await params.run([
				"git",
				"rev-parse",
				"--verify",
				`refs/heads/${params.branch}`
			], { cwd: params.cwd });
			if (await sameFile(recoveryPath, lockPath) || branchHead !== params.previousHead) throw new GitHubPublicationRecoveryPendingError("GitHub publication workspace recovery data changed.");
			recoveryIndex = void 0;
		}
		if (!recoveryIndex) {
			params.assertCurrent();
			ownsRecovery = true;
			await writeDurableFile(recoveryPath, replacement);
			await syncDirectory(path.dirname(indexPath));
		}
		if (await sameFile(recoveryPath, lockPath)) {
			const branchHead = await params.run([
				"git",
				"rev-parse",
				"--verify",
				`refs/heads/${params.branch}`
			], { cwd: params.cwd });
			if (branchHead === params.headCommit) {
				refMayHaveMoved = true;
				ownsLock = true;
				try {
					params.assertCustody();
					await fs.rename(lockPath, indexPath);
					ownsLock = false;
					installed = true;
					params.assertCustody();
					await syncDirectory(path.dirname(indexPath));
					params.assertCustody();
					await fs.rm(recoveryPath, { force: true });
					return;
				} catch (error) {
					throw new GitHubPublicationRecoveryPendingError("GitHub publication workspace index recovery is pending.", { cause: error });
				}
			}
			if (branchHead !== params.previousHead) throw new GitHubPublicationRecoveryPendingError("GitHub publication workspace branch recovery is pending.");
			params.assertCustody();
			ownsRecovery = true;
			await fs.rm(lockPath);
			params.assertCustody();
			await syncDirectory(path.dirname(indexPath));
		} else if (await pathExists(lockPath)) throw new Error("GitHub publication workspace index is locked by another operation.");
		params.assertCurrent();
		try {
			await fs.link(recoveryPath, lockPath);
			ownsLock = true;
			ownsRecovery = true;
		} catch (error) {
			throw new Error("GitHub publication workspace index changed before commit.", { cause: error });
		}
		await fs.copyFile(indexPath, observedIndex);
		const currentIndexTree = await params.run([...HARDENED_GIT, "write-tree"], {
			cwd: params.cwd,
			env: {
				...gitEnv,
				GIT_INDEX_FILE: observedIndex
			}
		});
		if (currentIndexTree !== params.sourceIndexTree && currentIndexTree !== params.workspaceTree) throw new GitHubPublicationWorkspaceChangedError("GitHub publication workspace index changed after its accepted snapshot.");
		params.assertCurrent();
		await syncDirectory(path.dirname(indexPath));
		params.assertCurrent();
		if (params.updateRef) {
			refMayHaveMoved = true;
			try {
				await params.updateRef();
			} catch (error) {
				if (error instanceof GitHubPublicationRefCasRejectedError) refMayHaveMoved = false;
				throw error;
			}
		}
		if (params.updateRef) params.assertCustody();
		else params.assertCurrent();
		await fs.rename(lockPath, indexPath);
		ownsLock = false;
		installed = true;
		params.assertCustody();
		await syncDirectory(path.dirname(indexPath));
		params.assertCustody();
		await fs.rm(recoveryPath, { force: true });
	} catch (error) {
		if (!installed && refMayHaveMoved && ownsLock) throw new GitHubPublicationRecoveryPendingError("GitHub publication workspace recovery is pending.", { cause: error });
		throw error;
	} finally {
		try {
			const hasCustody = () => {
				try {
					params.assertCustody();
					return true;
				} catch {
					return false;
				}
			};
			if (!installed && !refMayHaveMoved && ownsLock && lockPath && recoveryPath && hasCustody() && await sameFile(recoveryPath, lockPath) && hasCustody()) await fs.rm(lockPath, { force: true });
			if ((installed || !refMayHaveMoved && ownsRecovery) && recoveryPath && hasCustody()) await fs.rm(recoveryPath, { force: true });
		} finally {
			await fs.rm(tempDir, {
				recursive: true,
				force: true
			});
		}
	}
}
//#endregion
//#region src/gateway/session-sharing-preparation.ts
var SessionMutationFactsUnavailableError = class extends Error {
	constructor(options) {
		super("Session access facts are unavailable; retry after session storage is ready.", options);
		this.name = "SessionMutationFactsUnavailableError";
	}
};
function routeFacts(cfg) {
	return {
		agents: listAgentIds(cfg),
		store: cfg.session?.store,
		mainKey: cfg.session?.mainKey,
		scope: cfg.session?.scope
	};
}
/** Retain an existing session generation; committed writers keep its access facts current. */
async function prepareSessionMutationFacts(params) {
	const route = routeFacts(params.cfg);
	const { canonicalKey, agentId } = resolveSessionStoreIdentity(params);
	const releases = [];
	let active = true;
	let invalidated = false;
	let facts;
	const selectedPaths = /* @__PURE__ */ new Set();
	const release = () => {
		if (active) {
			active = false;
			for (const stop of releases.splice(0).toReversed()) stop();
		}
	};
	const assertActive = () => {
		if (!active || invalidated) throw new SessionMutationFactsUnavailableError();
	};
	const invalidate = () => {
		invalidated = true;
	};
	const changed = (change) => {
		if ("all" in change) {
			if (typeof change.scope === "string" && [
				"profiles",
				"catalog",
				"acp",
				"agent-runs",
				"worker-placements",
				"worker-environments",
				"config"
			].includes(change.scope)) return;
			if (typeof change.scope === "object" && change.scope.agentId && change.scope.agentId !== agentId) return;
			invalidate();
			return;
		}
		if (change.scope === "automation" || change.agentId && change.agentId !== agentId && !change.storePath || ![
			params.sessionKey,
			canonicalKey,
			...facts?.target.storeKeys ?? []
		].includes(change.sessionKey)) return;
		if (!change.storePath) return;
		if (!change.factsInvalidated && (change.facts?.kind === "unchanged" || change.facts?.kind === "participants" || change.facts?.kind === "category")) return;
		if (!facts || !selectedPaths.has(path.resolve(change.storePath)) || !isPreparedSessionSharingChange(change)) invalidate();
	};
	releases.push(sessionChanges.subscribeFacts(changed), onSessionIdentityMutation((change) => {
		if (change.agentId === agentId && change.previous.sessionKeys.includes(canonicalKey)) invalidate();
	}));
	try {
		let assertSource;
		let readFacts = () => facts;
		if (isIncognitoSessionKey(canonicalKey)) {
			const storePath = resolveIncognitoOpenClawAgentSqlitePath({ agentId });
			const database = getOpenIncognitoAgentDatabase(agentId, storePath);
			if (!database) throw new SessionMutationFactsUnavailableError();
			const initial = readCommittedIncognitoSessionSharing(database.db, canonicalKey);
			if (!initial) throw new SessionMutationFactsUnavailableError();
			const { sessionId, lifecycleRevision } = initial.entry;
			selectedPaths.add(path.resolve(storePath));
			releases.push(registerOpenClawAgentDatabaseAsyncResource({
				agentId,
				path: storePath,
				revoke: release,
				close: async () => release()
			}));
			assertSource = () => {
				if (getOpenIncognitoAgentDatabase(agentId, storePath) !== database) throw new SessionMutationFactsUnavailableError();
			};
			readFacts = () => {
				const current = readCommittedIncognitoSessionSharing(database.db, canonicalKey);
				if (!current || current.entry.sessionId !== sessionId || current.entry.lifecycleRevision !== lifecycleRevision) {
					invalidate();
					throw new SessionMutationFactsUnavailableError();
				}
				return {
					target: {
						agentId,
						canonicalKey,
						storeKey: canonicalKey,
						storeKeys: [canonicalKey],
						storePath,
						entry: current.entry
					},
					membership: current.membership
				};
			};
			facts = readFacts();
		} else {
			const parsedAgent = parseAgentSessionKey(params.sessionKey)?.agentId;
			const inventory = prepareSessionStoreTargetInventory(params.cfg, [agentId, ...parsedAgent ? [parsedAgent] : []]);
			const candidates = inventory.candidates.flatMap((candidate) => [candidate, {
				...candidate,
				path: candidate.physicalPath
			}]);
			const candidateIdentities = inventory.candidates.map((candidate) => ({
				candidate,
				identity: readDatabasePathIdentitySync(candidate.path).key
			}));
			for (const candidate of candidates) releases.push(registerOpenClawAgentDatabaseReadCandidateResource({
				...candidate,
				revoke: release,
				close: async () => release()
			}));
			const registry = prepareOpenClawAgentDatabaseRegistrySnapshotRead({ env: inventory.env });
			let assertRegistry;
			const members = /* @__PURE__ */ new Map();
			const retainedReads = /* @__PURE__ */ new Map();
			const selected = await withSessionHistoryWorkerReadCandidates(inventory.candidates, async (discovery) => {
				let sources = await discovery.readTargetInventory({
					...inventory,
					registeredDatabases: { status: "deferred" }
				});
				if (sources.kind === "session-target-registry-required") {
					const current = await registry.read();
					assertRegistry = current.assertCurrent;
					current.assertCurrent();
					sources = await discovery.readTargetInventory({
						...inventory,
						registeredDatabases: current.result.status === "available" ? current.result.entries : { status: "unavailable" }
					});
				}
				if (sources.kind !== "session-target-inventory") throw new SessionMutationFactsUnavailableError();
				const targetDiscoveryCache = /* @__PURE__ */ new Map();
				for (const source of sources.agents) {
					if (!source.result.available && source.result.reason !== "database-missing") throw new SessionMutationFactsUnavailableError();
					targetDiscoveryCache.set(source.agentId, {
						existing: source.result.available ? source.result.targets : [],
						fallback: {
							agentId: source.agentId,
							storePath: inventory.paths.get(source.agentId).configured
						}
					});
				}
				const target = await prepareGatewaySessionStoreTargetReadOnly({
					cfg: inventory.config,
					key: params.sessionKey,
					agentId,
					env: inventory.env,
					targetDiscoveryCache
				}, async (reads) => {
					for (const read of reads) {
						assertActive();
						const loaded = await readSessionEntriesFromStoreInWorker({
							agentId: read.agentId ?? agentId,
							storePath: read.storePath,
							sessionKeys: read.options.exactKeys,
							projection: "sharing",
							env: inventory.env
						});
						const store = Object.fromEntries(loaded.entries.map(({ sessionKey, entry }) => [sessionKey, entry]));
						read.result = ok(store);
						if (loaded.sharing) {
							read.readSource = loaded.sharing.source;
							members.set(read.storePath, loaded.sharing);
							for (const sessionKey of read.options.exactKeys) {
								const key = `${loaded.sharing.databaseIdentity}\0${sessionKey}`;
								if (retainedReads.has(key)) continue;
								const entry = store[sessionKey];
								const retained = retainPreparedSessionSharingFacts({
									databaseIdentity: loaded.sharing.databaseIdentity,
									sessionKey,
									entry: entry ? projectSessionSharingEntry(entry) : void 0,
									membership: new Set(loaded.sharing.members.find((row) => row.sessionKey === sessionKey)?.identityIds)
								});
								retainedReads.set(key, retained);
								releases.push(retained.release);
							}
						}
					}
				});
				discovery.assertCurrent();
				assertRegistry?.();
				return target;
			});
			assertActive();
			const match = resolveCanonicalSessionStoreMatchFromStoreKeys(selected.store, selected.storeKeys);
			const sharing = members.get(selected.storePath);
			if (!match || !sharing) throw new SessionMutationFactsUnavailableError();
			facts = {
				target: {
					agentId: selected.agentId,
					canonicalKey: selected.canonicalKey,
					storePath: selected.storePath,
					storeKeys: selected.storeKeys,
					entry: projectSessionSharingEntry(match.entry),
					storeKey: match.key
				},
				membership: new Set(sharing.members.find((member) => member.sessionKey === match.key)?.identityIds)
			};
			selectedPaths.add(path.resolve(selected.storePath));
			selectedPaths.add(path.resolve(sharing.source.path));
			const sourceCandidates = inventory.candidates.filter((candidate) => matchesAgentDatabaseReadCandidatePath({
				...candidate,
				path: candidate.physicalPath
			}, sharing.source.path));
			if (sourceCandidates.length === 0) throw new SessionMutationFactsUnavailableError();
			for (const candidate of sourceCandidates) selectedPaths.add(path.resolve(candidate.path));
			const target = facts.target;
			const retained = retainedReads.get(`${sharing.databaseIdentity}\0${target.storeKey}`);
			if (!retained) throw new SessionMutationFactsUnavailableError();
			readFacts = () => {
				for (const read of retainedReads.values()) if (!read.readCurrent()) throw new SessionMutationFactsUnavailableError();
				const current = retained.readCurrent();
				if (!current?.entry) throw new SessionMutationFactsUnavailableError();
				return {
					target: {
						...target,
						entry: current.entry
					},
					membership: current.membership
				};
			};
			assertSource = () => {
				assertRegistry?.();
				for (const { candidate, identity } of candidateIdentities) {
					assertSessionStoreReadCandidate(candidate.path, [candidate]);
					if (readDatabasePathIdentitySync(candidate.path).key !== identity) throw new SessionMutationFactsUnavailableError();
				}
				for (const read of members.values()) if (readDatabasePathIdentitySync(read.source.path).key !== read.databaseIdentity) throw new SessionMutationFactsUnavailableError();
			};
		}
		const readCurrent = (cfg) => {
			try {
				assertActive();
				if (!isDeepStrictEqual(routeFacts(cfg), route)) throw new SessionMutationFactsUnavailableError();
				assertSource();
				return readFacts();
			} catch (error) {
				throw error instanceof SessionMutationFactsUnavailableError ? error : new SessionMutationFactsUnavailableError({ cause: error });
			}
		};
		readCurrent(params.cfg);
		return {
			readCurrent,
			release
		};
	} catch (error) {
		release();
		throw error instanceof SessionMutationFactsUnavailableError ? error : new SessionMutationFactsUnavailableError({ cause: error });
	}
}
//#endregion
//#region src/gateway/github-publication-requester.ts
function assertPublicationIncognitoAccess(profileId, scopes, sessionKey) {
	const client = createSyntheticPluginRuntimeClient({
		operatorRoleActor: {
			kind: "operator",
			profileId
		},
		scopes: [...scopes]
	});
	if (authorizeIncognitoSessionTarget({
		client,
		sessionKey,
		target: null
	})) throw new GitHubPublicationRequesterUnavailableError();
}
async function preparePublicationSession(session, config) {
	try {
		return await prepareSessionMutationFacts({
			cfg: config,
			...session
		});
	} catch (error) {
		throw new GitHubPublicationRecoveryPendingError("GitHub publication session authorization is unavailable; retry after session storage is ready.", { cause: error });
	}
}
function prepareRequesterPolicy(snapshot, session, getCommittedRuntimeConfig, identity, sessionFacts) {
	const client = createSyntheticPluginRuntimeClient({
		operatorRoleActor: snapshot.actor,
		scopes: [...snapshot.scopes]
	});
	const assertIdentity = () => {
		if (snapshot.actor.kind !== "operator") return;
		try {
			if (!identity) throw new GitHubPublicationRequesterUnavailableError();
			return identity.readCurrentFacts(snapshot.grant?.aliasBindingIds);
		} catch (error) {
			if (error instanceof UserProfileMutationUnsettledError) throw new GitHubPublicationRecoveryPendingError("GitHub publication identity authorization is unavailable; retry after the profile mutation settles.", { cause: error });
			throw new GitHubPublicationRequesterUnavailableError();
		}
	};
	const assertRole = (profile, config) => {
		const role = profile ? resolveOperatorRolePolicyForAssignment(profile.profileId, profile.assignedRole, config) : void 0;
		if (!roleScopesAllow({
			role: "operator",
			requestedScopes: ["operator.sessions.write"],
			allowedScopes: snapshot.scopes
		}) || role && (!roleScopesAllow({
			role: "operator",
			requestedScopes: snapshot.scopes,
			allowedScopes: role.scopes
		}) || role.accessPolicyPlugin && role.accessPolicyPlugin !== snapshot.grant?.pluginId)) throw new GitHubPublicationRequesterUnavailableError();
		return role;
	};
	const assertPrepared = (config) => {
		const current = assertIdentity();
		const role = assertRole(current?.profile, config);
		if (current) {
			let facts;
			try {
				if (!sessionFacts) throw new Error("Prepared publication session is missing");
				facts = sessionFacts.readCurrent(config);
			} catch (error) {
				throw new GitHubPublicationRecoveryPendingError("GitHub publication session authorization is unavailable; retry after session storage is ready.", { cause: error });
			}
			if (snapshot.actor.kind === "operator" && !roleScopesAllow({
				role: "operator",
				requestedScopes: ["operator.write"],
				allowedScopes: snapshot.scopes
			}) && !prepareSessionCreatorProfile(snapshot.actor.profileId, current.aliases)(facts.target.entry.createdActor)) throw new GitHubPublicationRequesterUnavailableError();
			if (authorizePreparedSessionMutation({
				cfg: config,
				client,
				...session
			}, facts, {
				policy: role,
				aliases: current.aliases
			})) throw new GitHubPublicationRequesterUnavailableError();
		}
		return current?.profile;
	};
	return () => {
		const config = getCommittedRuntimeConfig();
		const profile = assertPrepared(config);
		if (profile) {
			try {
				resumeGatewayOperatorAccessGrant(profile, config, snapshot.grant);
			} catch (error) {
				if (error instanceof GatewayOperatorAccessDeniedError) throw new GitHubPublicationRequesterUnavailableError();
				throw error;
			}
			assertPrepared(getCommittedRuntimeConfig());
		}
	};
}
/** Capture from the admitted caller, never request arguments, publisher, or session attribution. */
async function captureGitHubPublicationRequester(options, session) {
	options.signal?.throwIfAborted();
	options.sessionMutationAuthorization?.assertCurrent();
	const source = captureGatewayOperatorRunAuthority(options);
	let identity;
	let sessionFacts;
	const release = () => {
		sessionFacts?.release();
		identity?.release();
		source?.release();
	};
	try {
		const system = (source ? {
			kind: "operator",
			profileId: source.authority.profileId
		} : resolveGatewayOperatorRoleActor(options.client))?.kind === "system" || options.client?.authenticatedUserProfile?.profileId === "gateway-owner";
		if (!source && !system || options.client?.connect.role !== "operator" || source && source.authority.gatewayAccessGrant === void 0) throw new GitHubPublicationRequesterUnavailableError();
		let grant = null;
		if (source) {
			assertPublicationIncognitoAccess(source.authority.profileId, source.authority.scopes, session.sessionKey);
			identity = await prepareUserProfileIdentity(source.authority.profileId);
			sessionFacts = await preparePublicationSession(session, (options.context.getCommittedRuntimeConfig ?? options.context.getRuntimeConfig)());
			if (source.authority.gatewayAccessGrant) grant = Object.freeze({
				...source.authority.gatewayAccessGrant,
				aliasBindingIds: identity.emailBindingIds
			});
		}
		const snapshot = Object.freeze({
			version: 1,
			actor: Object.freeze(source ? {
				kind: "operator",
				profileId: source.authority.profileId
			} : { kind: "system" }),
			scopes: Object.freeze([...source?.authority.scopes ?? options.client.connect.scopes ?? []]),
			grant
		});
		const assertPolicy = prepareRequesterPolicy(snapshot, session, options.context.getCommittedRuntimeConfig ?? options.context.getRuntimeConfig, identity, sessionFacts);
		const assertInvocationCurrent = () => {
			try {
				options.signal?.throwIfAborted();
				if (options.hasCurrentClientAuthority?.() === false) throw new GitHubPublicationRequesterUnavailableError();
				options.sessionMutationAuthorization?.assertCurrent();
				source?.authority.assertCurrent();
			} catch {
				throw new GitHubPublicationRequesterUnavailableError();
			}
		};
		const requester = Object.freeze({
			snapshot,
			assertInvocationCurrent,
			assertCurrent: () => {
				assertInvocationCurrent();
				assertPolicy();
				assertInvocationCurrent();
			}
		});
		requester.assertCurrent();
		return {
			requester,
			release
		};
	} catch (error) {
		release();
		throw error;
	}
}
/** Restoration rechecks the original immutable basis; a new role or invitation cannot replace it. */
async function restoreGitHubPublicationRequester(json, session, getCommittedRuntimeConfig) {
	const snapshot = decodeGitHubPublicationRequester(json);
	if (!snapshot) throw new GitHubPublicationRequesterUnavailableError();
	let identity;
	let sessionFacts;
	if (snapshot.actor.kind === "operator") {
		assertPublicationIncognitoAccess(snapshot.actor.profileId, snapshot.scopes, session.sessionKey);
		try {
			identity = await prepareUserProfileIdentity(snapshot.actor.profileId);
			sessionFacts = await preparePublicationSession(session, getCommittedRuntimeConfig());
		} catch (error) {
			identity?.release();
			if (error instanceof GitHubPublicationRecoveryPendingError) throw error;
			throw new GitHubPublicationRecoveryPendingError("GitHub publication requester identity is unavailable; retry recovery after profile storage is ready.", { cause: error });
		}
	}
	const release = () => {
		sessionFacts?.release();
		identity?.release();
	};
	try {
		const requester = Object.freeze({
			snapshot,
			assertCurrent: prepareRequesterPolicy(snapshot, session, getCommittedRuntimeConfig, identity, sessionFacts),
			release
		});
		requester.assertCurrent();
		return requester;
	} catch (error) {
		release();
		throw error;
	}
}
//#endregion
export { recoverGitHubPublicationBranchAndIndex as a, assertGitHubPublicationRefCasCompleted as i, restoreGitHubPublicationRequester as n, updateGitHubPublicationBranchAndIndex as o, GitHubPublicationRecoveryPendingError as r, captureGitHubPublicationRequester as t };
