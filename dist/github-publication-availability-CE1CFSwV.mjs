import { Jn as string, Nt as array, Yt as discriminatedUnion, lr as uuid, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { r as openOpenClawStateDatabase, y as ensureGitHubPublicationSessionLifecycleSchema } from "./openclaw-state-db-BFK9cMiV.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { o as getActiveSecretsRuntimeConfigSnapshot } from "./runtime-state-CtZtwiOt.mjs";
import { Z as getSessionRepositoryWorkspaceStore } from "./session-accessor.sqlite-entry-store-BU493wVJ.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DDuAGjCc.mjs";
import "./session-utils-CJ7A982R.mjs";
import { a as matchesPreparedGitHubPublicationIdentity, o as prepareGitHubPublicationIdentity, s as prepareGitHubPublicationOptionsIdentity } from "./github-tool-identity-BOF32-1s.mjs";
import { a as managedWorktrees } from "./service-JxB03j7i.mjs";
import { r as requestCurrentGitHubOAuthRefresh } from "./github-oauth-lifecycle-B8jl-6oa.mjs";
import { i as GitHubPublicationSessionChangedError, o as GitHubPublicationWorkspaceChangedError, s as rejectGitHubPublicationSelection } from "./github-publication-failure-B1jd4XaP.mjs";
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
function readPublicationSessionOwner(params) {
	const loaded = loadGatewaySessionEntryReadOnly(params.sessionKey, { agentId: params.agentId });
	const entry = loaded.entry;
	if (loaded.agentId !== params.agentId || loaded.canonicalKey !== params.sessionKey || entry?.sessionId !== params.sessionId || entry.archivedAt !== void 0 || params.lifecycleRevision !== void 0 && (entry.lifecycleRevision ?? null) !== params.lifecycleRevision) throw new GitHubPublicationSessionChangedError();
	return {
		...loaded,
		entry
	};
}
function readPublicationWorktreeOwner(loaded, expected) {
	const entry = loaded.entry;
	const worktree = managedWorktrees.findLiveByOwner("session", loaded.canonicalKey);
	if (!entry.worktree?.id || !worktree || worktree.id !== entry.worktree.id || worktree.ownerKind !== "session" || worktree.ownerId !== loaded.canonicalKey || worktree.branch !== entry.worktree.branch || worktree.repoRoot !== entry.worktree.repoRoot) throw new GitHubPublicationSessionChangedError();
	if (expected && (worktree.id !== expected.worktreeId || worktree.repoFingerprint !== expected.repositoryFingerprint || worktree.branch !== expected.branch)) throw new GitHubPublicationWorkspaceChangedError("GitHub publication workspace authority changed.");
	return {
		loaded,
		worktree
	};
}
function resolveGitHubPublicationWorktreeOwner(params) {
	return readPublicationWorktreeOwner(readPublicationSessionOwner(params), params.expected);
}
function resolveGitHubPublicationWorkspaceOwner(params) {
	const loaded = readPublicationSessionOwner(params);
	const workspaceId = loaded.entry.repositoryWorkspaceId;
	if (!workspaceId) return {
		kind: "worktree",
		...readPublicationWorktreeOwner(loaded)
	};
	const workspace = getSessionRepositoryWorkspaceStore().get(workspaceId);
	if (!workspace || workspace.agentId !== params.agentId || workspace.sessionKey !== params.sessionKey) throw new Error("GitHub publication session repository owner changed.");
	return {
		kind: "repository",
		loaded,
		workspace
	};
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
		const initial = resolveGitHubPublicationWorkspaceOwner(params);
		const identity = await prepareCurrentGitHubPublicationIdentity(params.agentId);
		if (params.assertCurrent?.() === false) return false;
		return sameGitHubPublicationWorkspace(initial, resolveGitHubPublicationWorkspaceOwner(params)) && matchesCurrentGitHubPublicationIdentity({
			agentId: params.agentId,
			identity
		});
	} catch {
		return false;
	}
}
//#endregion
export { prepareCurrentGitHubPublicationOptionsIdentity as a, resolveGitHubPublicationWorktreeOwner as c, insertGitHubPublicationSessionLifecycle as d, readGitHubPublicationSessionLifecycle as f, matchesGitHubPublicationRequester as g, encodeGitHubPublicationRequester as h, prepareCurrentGitHubPublicationIdentity as i, resolveLocalGitHubPublicationWorktreeOwner as l, decodeGitHubPublicationRequester as m, currentGitHubPublicationConfig as n, prepareGitHubPublicationAvailability as o, readGitHubPublicationSessionLifecycleInWorker as p, matchesCurrentGitHubPublicationIdentity as r, resolveGitHubPublicationWorkspaceOwner as s, assertExpectedSharedGitHubPublisher as t, sameGitHubPublicationWorkspace as u };
