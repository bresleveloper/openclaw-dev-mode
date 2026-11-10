import { r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { i as sqlPublicationAnchor } from "./sql-connection-DmQzXTVz.mjs";
import { a as resolveExistingSqliteFileUri, r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { a as executeSqliteQueryTakeFirstSync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { f as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { _ as selectStoredGitHubIdentities, i as readUserProfileEmailBindings, l as selectUserProfileIdentityInDatabase } from "./user-profile-identity.read-DXpuvx74.mjs";
import { n as parseSessionEntryJson } from "./session-accessor.sqlite-status-B58ALiNV.mjs";
import { _ as validateCanonicalSessionRowEntry } from "./session-canonical-key-B7chVWi3.mjs";
import { d as projectUserGitHubConnectionAuthority, s as readUserGitHubConnectionInDatabase } from "./user-github-connections.kernel-BAl3kDQK.mjs";
import { r as getRegistryWorktreeInDatabase, t as findLiveRegistryWorktreeByOwnerInDatabase } from "./registry-read.kernel-D89C5gDY.mjs";
import { n as listSessionMembersInDatabase } from "./session-sharing-store.kernel-DHH7VvHM.mjs";
import { o as readSessionRepositoryWorkspaceInDatabase } from "./session-repository-workspaces.kernel-C8Kf32oF.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/state/github-publication-source.kernel.ts
function worktreeFacts(row) {
	return row && {
		id: row.id,
		ownerKind: row.ownerKind,
		ownerId: row.ownerId,
		repoRoot: row.repoRoot,
		repoFingerprint: row.repoFingerprint,
		path: row.path,
		branch: row.branch,
		removedAt: row.removedAt
	};
}
function isGitHubPublicationSourceCurrent(selector, { entry, repositoryWorkspace }) {
	return entry?.sessionId === selector.sessionId && (entry.lifecycleRevision ?? null) === selector.lifecycleRevision && entry.archivedAt === void 0 && (selector.repositoryWorkspaceId === void 0 || entry.repositoryWorkspaceId === selector.repositoryWorkspaceId && repositoryWorkspace?.workspaceId === selector.repositoryWorkspaceId && repositoryWorkspace.agentId === selector.agentId && repositoryWorkspace.sessionKey === selector.sessionKey && (selector.repositoryBranch === void 0 || repositoryWorkspace.branch === selector.repositoryBranch));
}
function readSessionFacts(sourceDb, selector) {
	const row = executeSqliteQueryTakeFirstSync(sourceDb, getNodeSqliteKysely(sourceDb).selectFrom("session_nodes").leftJoin("session_windows", (join) => join.onRef("session_windows.session_id", "=", "session_nodes.current_session_id").onRef("session_windows.session_key", "=", "session_nodes.session_key")).selectAll("session_nodes").select("session_windows.session_id as retained_window_id").where("session_nodes.session_key", "=", selector.sessionKey));
	const entry = row ? validateCanonicalSessionRowEntry(row, parseSessionEntryJson(row, "list"), "read") : void 0;
	const members = listSessionMembersInDatabase({ db: sourceDb }, selector.sessionKey);
	return {
		entry: entry && {
			sessionId: entry.sessionId,
			lifecycleRevision: entry.lifecycleRevision,
			archivedAt: entry.archivedAt,
			visibility: entry.visibility,
			incognito: entry.incognito,
			createdActor: entry.createdActor,
			owner: entry.owner,
			worktree: entry.worktree,
			repositoryWorkspaceId: entry.repositoryWorkspaceId
		},
		members
	};
}
/** Shared-state facts remain transaction-held for both durable and memory session sources. */
function readGitHubPublicationSourceFacts(source, stateDb, selector) {
	const facts = "members" in source ? structuredClone(source) : readSessionFacts(source, selector);
	if (selector.repositoryWorkspaceId) facts.repositoryWorkspace = readSessionRepositoryWorkspaceInDatabase(stateDb, selector.repositoryWorkspaceId);
	if (!isGitHubPublicationSourceCurrent(selector, facts)) throw new Error("GitHub publication session changed.");
	if (selector.profileId) {
		const identity = selectUserProfileIdentityInDatabase(stateDb, selector.profileId);
		if (!identity) throw new Error("GitHub publication requester changed.");
		const github = selectStoredGitHubIdentities(stateDb, [identity.profileId]).get(identity.profileId);
		const emailBindings = readUserProfileEmailBindings(stateDb, identity.profileId);
		if (selector.aliasBindingIds?.some((bindingId) => !emailBindings.some((binding) => binding.bindingId === bindingId))) throw new Error("GitHub publication requester binding changed.");
		facts.profile = {
			profileId: identity.profileId,
			role: identity.role,
			aliases: [...identity.aliases].toSorted(),
			githubLogin: github?.primary?.login ?? null,
			githubAccountIds: github?.accounts.map((account) => account.accountId) ?? [],
			emailBindings
		};
	}
	if (selector.worktreeId) {
		facts.worktree = worktreeFacts(getRegistryWorktreeInDatabase(stateDb, selector.worktreeId));
		facts.ownerWorktree = worktreeFacts(findLiveRegistryWorktreeByOwnerInDatabase(stateDb, "session", selector.sessionKey));
	}
	const placement = executeSqliteQueryTakeFirstSync(stateDb, getNodeSqliteKysely(stateDb).selectFrom("worker_session_placements").select([
		"session_id",
		"agent_id",
		"session_key",
		"state",
		"execution_mode",
		"environment_id",
		"transition_generation",
		"active_owner_epoch",
		"turn_claim_owner",
		"turn_claim_id",
		"turn_claim_run_id",
		"turn_claim_generation",
		"turn_claim_owner_epoch"
	]).where("session_id", "=", selector.sessionId));
	facts.placement = placement && { ...placement };
	if (selector.personalOwnerProfileId) {
		const connection = readUserGitHubConnectionInDatabase(stateDb, selector.personalOwnerProfileId);
		facts.connection = projectUserGitHubConnectionAuthority(connection) ?? void 0;
	}
	return facts;
}
/** Equality is a source predicate, never a replacement for the requester's live capability. */
function assertGitHubPublicationSourceFacts(sourceDb, stateDb, selector, expected) {
	if (!isDeepStrictEqual(readGitHubPublicationSourceFacts(sourceDb, stateDb, selector), expected)) throw new Error("GitHub publication source authority changed.");
}
function assertGitHubPublicationWorktreeSource(source, worktree) {
	const { entry, worktree: current, ownerWorktree } = source.expected;
	if (source.selector.worktreeId !== worktree.id || current?.id !== worktree.id || ownerWorktree?.id !== worktree.id || current.removedAt !== void 0 || current.ownerKind !== "session" || current.ownerId !== source.selector.sessionKey || current.repoFingerprint !== worktree.repoFingerprint || current.branch !== worktree.branch || entry?.worktree?.id !== worktree.id || entry.worktree.branch !== current.branch || entry.worktree.repoRoot !== current.repoRoot) throw new Error("GitHub publication requested worktree changed.");
}
function assertGitHubPublicationConnectionAdmissionSource(source, row) {
	const connection = source.expected.connection;
	const selected = connection?.selection;
	if (source.selector.personalOwnerProfileId !== row.owner_profile_id || connection?.generation !== row.connection_generation || selected?.kind !== "connected" || row.identity_profile_id !== selected.profileId || row.identity_source !== "personal" || selected.accountId !== row.identity_account_id) throw new Error("GitHub publication requested connection changed.");
	return selected;
}
function assertGitHubPublicationConnectionSource(source, row) {
	if (assertGitHubPublicationConnectionAdmissionSource(source, row).login.toLowerCase() !== row.identity_login.toLowerCase()) throw new Error("GitHub publication requested connection changed.");
}
//#endregion
//#region src/state/github-publication-source.worker.ts
const reservations = /* @__PURE__ */ new WeakMap();
/** The command's durable predicates have been checked while every source is reserved. */
function assertGitHubPublicationWorkerSourceCurrent(db) {
	const assertCurrent = reservations.get(db);
	if (!assertCurrent) throw new Error("GitHub publication requires its reserved source authority.");
	assertCurrent();
}
/** Source handles belong to one command and close only after its reservations settle. */
function createGitHubPublicationSourceWorker() {
	let source;
	let current;
	let destination;
	let validated = false;
	const close = () => {
		if (destination) reservations.delete(destination);
		if (source?.isOpen) {
			if (source.isTransaction) throw new Error("GitHub publication source remains reserved.");
			source.close();
		}
		source = void 0;
		current = void 0;
		destination = void 0;
		validated = false;
	};
	const assertPrepared = (input) => {
		if (current !== input || !input.memory && !source?.isOpen || !destination?.isOpen) throw new Error("GitHub publication source was not prepared.");
		return {
			source: input.memory ?? source,
			destination
		};
	};
	return {
		prepare(input, db) {
			close();
			if (input.source) {
				const { physical } = input.source;
				assertExistingDatabaseIdentity(physical.canonicalPath, physical.key, physical.birthtime);
				source = openNodeSqliteDatabase(resolveExistingSqliteFileUri(physical.canonicalPath));
			}
			current = input;
			destination = db;
		},
		read(input) {
			const handles = assertPrepared(input);
			return readGitHubPublicationSourceFacts(handles.source, handles.destination, input.selector);
		},
		fence(input) {
			if (input.memory) return;
			const handles = assertPrepared(input);
			if (!source) throw new Error("GitHub publication source was not prepared.");
			let reservedSource;
			const destinationBinding = {
				database: sqlPublicationAnchor(handles.destination),
				identity: input.destination
			};
			const sourceBinding = {
				database: source,
				identity: input.source
			};
			reservations.set(handles.destination, () => {
				if (!validated || !reservedSource?.isTransaction || !handles.destination.isTransaction) throw new Error("GitHub publication source reservation is no longer current.");
			});
			return {
				destination: destinationBinding,
				sources: [sourceBinding],
				validate(resolve) {
					reservedSource = resolve(sourceBinding);
					assertGitHubPublicationSourceFacts(reservedSource, handles.destination, input.selector, input.expected);
					validated = true;
				}
			};
		},
		close
	};
}
/** Policy callbacks run before the destination transaction because they may write SQLite. */
function withGitHubPublicationSourceTransaction(database, source, run) {
	const memory = source.memory;
	if (!memory) return run();
	requestSqliteWorkerOperationAdmission({
		stage: "prepare",
		facts: void 0
	});
	return runOpenClawStateWriteTransaction(({ db }) => {
		assertGitHubPublicationSourceFacts(memory, db, source.selector, source.expected);
		reservations.set(db, () => {
			if (!db.isTransaction) throw new Error("GitHub publication destination transaction is no longer current.");
		});
		try {
			return run();
		} finally {
			reservations.delete(db);
		}
	}, { database });
}
//#endregion
export { assertGitHubPublicationConnectionSource as a, assertGitHubPublicationConnectionAdmissionSource as i, createGitHubPublicationSourceWorker as n, assertGitHubPublicationWorktreeSource as o, withGitHubPublicationSourceTransaction as r, assertGitHubPublicationWorkerSourceCurrent as t };
