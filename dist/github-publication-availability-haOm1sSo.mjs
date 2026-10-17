import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { Jn as string, Nt as array, Yt as discriminatedUnion, lr as uuid, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { r as openOpenClawStateDatabase } from "./openclaw-state-db-D1jWDzK3.mjs";
import { u as ensureGitHubPublicationSessionLifecycleSchema } from "./openclaw-state-db-schema-additive-CzAgdzE5.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { o as getActiveSecretsRuntimeConfigSnapshot } from "./runtime-state-D5wZ6Dom.mjs";
import { k as getSessionRepositoryWorkspaceStore } from "./session-accessor.sqlite-entry-store-Ca60AZ39.mjs";
import { a as matchesPreparedGitHubPublicationIdentity, o as prepareGitHubPublicationIdentity, s as prepareGitHubPublicationOptionsIdentity } from "./github-tool-identity-2S4ost1l.mjs";
import { t as parseGitHubRemoteUrl } from "./github-remote-CfQwrdOt.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DrLraxiU.mjs";
import { a as managedWorktrees } from "./service-CeHCpuXV.mjs";
import { a as readRegistryWorktree } from "./registry-read-CqOwdsWM.mjs";
import { r as requestCurrentGitHubOAuthRefresh } from "./github-oauth-lifecycle-CxoSdLOZ.mjs";
import { a as GitHubPublicationSessionChangedError, c as rejectGitHubPublicationSelection, s as GitHubPublicationWorkspaceChangedError } from "./github-publication-failure-3qOmYAmh.mjs";
import "./session-utils-N4Q5NAko.mjs";
//#region src/state/github-publication-requester.ts
const requesterSchema = strictObject({
	version: literal(1),
	actor: discriminatedUnion("kind", [strictObject({
		kind: literal("operator"),
		profileId: string().min(1).max(128)
	}), strictObject({ kind: literal("system") })]),
	scopes: array(string().min(1)),
	grant: strictObject({
		pluginId: string().min(1).max(128),
		grantId: uuid(),
		aliasBindingIds: array(uuid())
	}).nullable()
}).refine((value) => value.actor.kind !== "system" || value.grant === null);
const MAX_REQUESTER_BYTES = 65536;
function immutableRequester(value) {
	return Object.freeze({
		version: 1,
		actor: Object.freeze(value.actor),
		scopes: Object.freeze([...new Set(value.scopes)].toSorted()),
		grant: value.grant ? Object.freeze({
			...value.grant,
			aliasBindingIds: Object.freeze([...new Set(value.grant.aliasBindingIds)].toSorted())
		}) : null
	});
}
/** Only original admission writes this snapshot; its facts never replace current authority. */
function encodeGitHubPublicationRequester(requester) {
	const parsed = requesterSchema.safeParse(requester);
	if (!parsed.success) throw new Error("GitHub publication requester is invalid.");
	const json = JSON.stringify(immutableRequester(parsed.data));
	if (Buffer.byteLength(json, "utf8") > MAX_REQUESTER_BYTES) throw new Error("GitHub publication requester is too large.");
	return json;
}
/** Idempotency names the accepted request; effects still check its original alias bindings. */
function matchesGitHubPublicationRequester(original, current) {
	return encodeGitHubPublicationRequester(original) === encodeGitHubPublicationRequester({
		...current,
		grant: current.grant && original.grant ? {
			...current.grant,
			aliasBindingIds: original.grant.aliasBindingIds
		} : current.grant
	});
}
/** Historical or malformed bindings remain unproven; neither can imply System authority. */
function decodeGitHubPublicationRequester(json) {
	if (!json || Buffer.byteLength(json, "utf8") > MAX_REQUESTER_BYTES) return;
	try {
		const parsed = requesterSchema.safeParse(JSON.parse(json));
		return parsed.success ? immutableRequester(parsed.data) : void 0;
	} catch {
		return;
	}
}
//#endregion
//#region src/state/github-publication-session-lifecycles.ts
const table = "github_publication_session_lifecycles";
const query = (db) => getNodeSqliteKysely(db);
/** The receipt and its captured generation commit together; replay never rebinds it. */
function insertGitHubPublicationSessionLifecycle(db, input) {
	ensureGitHubPublicationSessionLifecycleSchema(db);
	executeSqliteQuerySync(db, query(db).insertInto(table).values({
		publication_kind: input.publicationKind,
		request_id: input.requestId,
		lifecycle_revision: input.lifecycleRevision,
		requester_authority_json: input.requester ? encodeGitHubPublicationRequester(input.requester) : null
	}));
}
/** A missing binding is unproven; a retained NULL records an originally absent revision. */
function readGitHubPublicationSessionLifecycle(input, db = openOpenClawStateDatabase().db) {
	return tableExists(db, table) ? executeSqliteQueryTakeFirstSync(db, query(db).selectFrom(table).select(["lifecycle_revision", "requester_authority_json"]).where("publication_kind", "=", input.publicationKind).where("request_id", "=", input.requestId)) : void 0;
}
async function readGitHubPublicationSessionLifecycleInWorker(input) {
	const { publicationKind, requestId } = input;
	const result = await executeExistingOpenClawStateRead({}, {
		type: "githubPublication.lifecycle",
		publicationKind,
		requestId
	}, { current: true });
	if (!result?.ok || result.type !== "githubPublication.lifecycle") throw new Error("GitHub publication requester metadata is unavailable.");
	return result.lifecycle;
}
//#endregion
//#region src/gateway/github-publication-availability.ts
function publicationConfigSnapshot() {
	const active = getActiveSecretsRuntimeConfigSnapshot();
	if (active) return active;
	const config = getRuntimeConfig();
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
async function prepareCurrentGitHubPublicationOptionsIdentity(agentId) {
	await requestCurrentGitHubOAuthRefresh(agentId);
	const snapshot = publicationConfigSnapshot();
	return await prepareGitHubPublicationOptionsIdentity({
		config: snapshot.config,
		sourceConfig: snapshot.sourceConfig,
		agentId
	});
}
function matchesCurrentGitHubPublicationIdentity(params) {
	return matchesPreparedGitHubPublicationIdentity({
		config: currentGitHubPublicationConfig(),
		...params
	});
}
function readPublicationSessionOwner(params, allowArchived = false) {
	const loaded = loadGatewaySessionEntryReadOnly(params.sessionKey, { agentId: params.agentId });
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
function readPublicationWorktreeOwner(loaded, expected) {
	return requirePublicationWorktreeOwner(loaded, managedWorktrees.findLiveByOwner("session", loaded.canonicalKey), expected);
}
function resolveGitHubPublicationWorktreeOwner(params) {
	return readPublicationWorktreeOwner(readPublicationSessionOwner(params), params.expected);
}
function resolveGitHubPublicationWorkspaceOwner(params, prepared) {
	const loaded = readPublicationSessionOwner(params);
	const workspaceId = loaded.entry.repositoryWorkspaceId;
	if (!workspaceId) return {
		kind: "worktree",
		...readPublicationWorktreeOwner(loaded)
	};
	const workspace = prepared?.current();
	if (!workspace || workspace.workspaceId !== workspaceId || workspace.agentId !== params.agentId || workspace.sessionKey !== params.sessionKey) throw new Error("GitHub publication session repository owner changed.");
	return {
		kind: "repository",
		loaded,
		workspace
	};
}
async function prepareGitHubPublicationWorkspaceOwner(params) {
	const loaded = readPublicationSessionOwner(params);
	const workspaceId = loaded.entry.repositoryWorkspaceId;
	const identity = {
		...params,
		lifecycleRevision: loaded.entry.lifecycleRevision ?? null
	};
	const prepared = workspaceId ? await getSessionRepositoryWorkspaceStore().prepare(workspaceId) : void 0;
	const current = () => {
		const owner = resolveGitHubPublicationWorkspaceOwner(identity, prepared);
		if (owner.loaded.entry.repositoryWorkspaceId !== workspaceId) throw new GitHubPublicationSessionChangedError();
		return owner;
	};
	current();
	return current;
}
function sameGitHubPublicationWorkspace(first, current) {
	if (first.loaded.entry?.lifecycleRevision !== current.loaded.entry?.lifecycleRevision) return false;
	return first.kind === "repository" ? current.kind === "repository" && current.workspace.workspaceId === first.workspace.workspaceId && current.workspace.url === first.workspace.url && current.workspace.branch === first.workspace.branch : current.kind === "worktree" && current.worktree.id === first.worktree.id && current.worktree.repoFingerprint === first.worktree.repoFingerprint && current.worktree.branch === first.worktree.branch;
}
function resolveLocalGitHubPublicationWorktreeOwner(row) {
	const lifecycle = readGitHubPublicationSessionLifecycle({
		publicationKind: row.identity_source === "personal" ? "personal" : "shared",
		requestId: row.request_id
	});
	if (!lifecycle) throw new GitHubPublicationSessionChangedError();
	return resolveGitHubPublicationWorktreeOwner({
		sessionId: row.session_id,
		sessionKey: row.session_key,
		agentId: row.agent_id,
		lifecycleRevision: lifecycle.lifecycle_revision,
		expected: {
			worktreeId: row.worktree_id,
			repositoryFingerprint: row.repository_fingerprint,
			branch: row.branch
		}
	});
}
async function prepareGitHubPublicationAvailability(params) {
	try {
		if (params.assertCurrent?.() === false) return false;
		const current = await prepareGitHubPublicationWorkspaceOwner(params);
		const initial = current();
		if (params.assertCurrent?.() === false) return false;
		const identity = await prepareCurrentGitHubPublicationIdentity(params.agentId);
		if (params.assertCurrent?.() === false) return false;
		return sameGitHubPublicationWorkspace(initial, current()) && matchesCurrentGitHubPublicationIdentity({
			agentId: params.agentId,
			identity
		});
	} catch {
		return false;
	}
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
/** Qualify only the target; execution still owns branch, permission and publication checks. */
async function hasSupportedGitHubPublicationTarget(session, assertCurrent) {
	assertCurrent();
	const initial = readPublicationSessionOwner(session, true);
	if (initial.entry.archivedAt !== void 0) return false;
	const workspaceId = initial.entry.repositoryWorkspaceId;
	const worktreeId = initial.entry.worktree?.id;
	const currentSession = () => {
		assertCurrent();
		const loaded = readPublicationSessionOwner(session);
		if (loaded.entry.repositoryWorkspaceId !== workspaceId || loaded.entry.worktree?.id !== worktreeId) throw new GitHubPublicationSessionChangedError();
		return loaded;
	};
	let originUrl;
	if (workspaceId) {
		const prepared = await getSessionRepositoryWorkspaceStore().prepare(workspaceId);
		currentSession();
		const owner = resolveGitHubPublicationWorkspaceOwner(session, prepared);
		if (owner.kind !== "repository") throw new GitHubPublicationSessionChangedError();
		originUrl = owner.workspace.url;
	} else if (worktreeId) {
		const context = captureOpenClawStateWorkerContext();
		const readWorktree = async (expected) => {
			const record = await readRegistryWorktree(context, worktreeId);
			context.admission.assertCurrent();
			return requirePublicationWorktreeOwner(currentSession(), record, expected).worktree;
		};
		const worktree = await readWorktree();
		const repository = await prepareGitHubPublicationRepositoryIdentity({
			worktree,
			assertCurrent: currentSession
		});
		if ((await readWorktree({
			worktreeId: worktree.id,
			repositoryFingerprint: worktree.repoFingerprint,
			branch: worktree.branch
		})).path !== worktree.path) throw new GitHubPublicationWorkspaceChangedError("GitHub publication workspace repository changed.");
		originUrl = repository.originUrl;
	} else return false;
	const remote = parseGitHubRemoteUrl(originUrl);
	return Boolean(remote && /^[A-Za-z0-9_.-]+$/u.test(remote.owner) && /^[A-Za-z0-9_.-]+$/u.test(remote.repo));
}
//#endregion
export { encodeGitHubPublicationRequester as _, prepareCurrentGitHubPublicationIdentity as a, prepareGitHubPublicationRepositoryIdentity as c, resolveLocalGitHubPublicationWorktreeOwner as d, sameGitHubPublicationWorkspace as f, decodeGitHubPublicationRequester as g, readGitHubPublicationSessionLifecycleInWorker as h, matchesCurrentGitHubPublicationIdentity as i, prepareGitHubPublicationWorkspaceOwner as l, readGitHubPublicationSessionLifecycle as m, currentGitHubPublicationConfig as n, prepareCurrentGitHubPublicationOptionsIdentity as o, insertGitHubPublicationSessionLifecycle as p, hasSupportedGitHubPublicationTarget as r, prepareGitHubPublicationAvailability as s, assertExpectedSharedGitHubPublisher as t, resolveGitHubPublicationWorktreeOwner as u, matchesGitHubPublicationRequester as v };
