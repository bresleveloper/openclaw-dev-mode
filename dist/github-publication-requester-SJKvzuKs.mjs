import { n as isErrno, t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { c as gitNullConfigPath } from "./git-exec-rH66305f.mjs";
import "./user-profile-constants-DfyZS95p.mjs";
import { M as UserProfileMutationUnsettledError } from "./user-profiles-internal-DlO1LBbo.mjs";
import { a as roleScopesAllow } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { o as prepareUserProfileIdentity } from "./user-profile-list-CtETKur7.mjs";
import { f as resolveOperatorRolePolicyForAssignment, u as resolveGatewayOperatorRoleActor } from "./operator-role-policy-BqPaarjx.mjs";
import { n as captureGatewayOperatorRunAuthority } from "./operator-run-authority-BT0kzSVu.mjs";
import { c as resumeGatewayOperatorAccessGrant, n as GatewayOperatorAccessDeniedError } from "./operator-access-policy-DIBw5efa.mjs";
import { t as createSyntheticPluginRuntimeClient } from "./server-plugin-runtime-client-0NHGAu9Q.mjs";
import { i as authorizePreparedSessionMutation, n as authorizeIncognitoSessionTarget, x as prepareSessionCreatorProfile } from "./session-sharing-policy-BVt5saXn.mjs";
import { r as prepareSessionMutationFacts } from "./session-sharing-preparation-BwpUabTn.mjs";
import { g as decodeGitHubPublicationRequester } from "./github-publication-availability-haOm1sSo.mjs";
import { i as GitHubPublicationRequesterUnavailableError, s as GitHubPublicationWorkspaceChangedError } from "./github-publication-failure-3qOmYAmh.mjs";
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
		const code = isErrno(error) ? error.code : void 0;
		if (process.platform !== "win32" || code !== "EINVAL" && code !== "EPERM") throw error;
	} finally {
		await handle?.close().catch(() => void 0);
	}
}
async function sameFile(left, right) {
	try {
		const [leftStat, rightStat] = await Promise.all([fs.stat(left), fs.stat(right)]);
		return leftStat.nlink >= 2 && rightStat.nlink >= 2 && leftStat.dev === rightStat.dev && leftStat.ino === rightStat.ino;
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return false;
		throw error;
	}
}
async function pathExists(file) {
	try {
		await fs.stat(file);
		return true;
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return false;
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
			if (!hasErrnoCode(error, "ENOENT")) throw error;
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
		const role = profile ? resolveOperatorRolePolicyForAssignment(profile.profileId, profile.assignedRole, config, profile.githubLogin ?? null) : void 0;
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
	const source = await captureGatewayOperatorRunAuthority(options);
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
