import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { m as readUserProfileAliasRevision } from "./user-profile-events-CXjmX5Qy.mjs";
import "./operator-scopes-BO7_XQCg.mjs";
import { a as roleScopesAllow } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { p as readResidentUserProfileId } from "./user-profile-list-BdNJnrJe.mjs";
import { t as authorizeCurrentOperatorRoleScopes, u as resolveGatewayOperatorRoleActor } from "./operator-role-policy-Coro3qc5.mjs";
import { r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { i as resolveConfiguredGitHubHost } from "./github-host-N2fYlLEb.mjs";
import { a as isGatewayClientProfilePending } from "./gateway-client-identity-DXWhtQve.mjs";
import { _ as resolveSessionVisibility } from "./session-sharing-policy-vx7GWqzs.mjs";
import { r as createSessionListEntryFilter } from "./session-sharing-read-B9_xLej9.mjs";
import "./session-sharing-DuL10izq.mjs";
import { t as parseGitHubRemoteUrl } from "./github-remote-rTdEnJZN.mjs";
import { i as hasCurrentGatewayOperatorAccess } from "./operator-access-policy-D9L4Y9uO.mjs";
import { i as withReadySessionRows } from "./session-row-prepared-read-CSzLs_ad.mjs";
import { t as resolveSessionWorkspaceRoots } from "./session-workspace-roots-OPzI_0T6.mjs";
//#region src/gateway/control-ui-session-pr-read.ts
/** Git facts and cached snapshots belong to the recorded session and workspace source. */
function resolveControlUiSessionPrTarget(selected, preparedRepository) {
	const { cfg, agentId, canonicalKey, storePath, readSource, entry } = selected;
	if (!entry?.sessionId || !storePath || !readSource) return;
	let source;
	const githubHost = resolveConfiguredGitHubHost(cfg);
	if (entry.repositoryWorkspaceId) {
		const repository = preparedRepository;
		const publicRemote = repository ? parseGitHubRemoteUrl(repository.url) : null;
		const remote = publicRemote ?? (repository ? parseGitHubRemoteUrl(repository.url, githubHost) : null);
		source = remote && repository ? {
			...remote,
			...!publicRemote ? { host: githubHost } : {},
			branch: repository.branch
		} : null;
	} else source = resolveSessionWorkspaceRoots(cfg, agentId, entry).diffCwd ?? null;
	return {
		params: {
			sessionKey: canonicalKey,
			agentId
		},
		githubHost,
		readSource,
		identity: JSON.stringify([
			agentId,
			canonicalKey,
			storePath,
			readSource?.agentId,
			readSource?.path,
			entry.sessionId,
			entry.lifecycleRevision,
			entry.repositoryWorkspaceId,
			entry.worktree?.id,
			source,
			githubHost
		]),
		source,
		refreshIndex: Boolean(entry.worktree && !entry.repositoryWorkspaceId)
	};
}
function resolveProjectedControlUiSessionPrTarget(cfg, record) {
	const { storePath, agentId } = record.storeTarget;
	return resolveControlUiSessionPrTarget({
		cfg,
		agentId: record.agentId,
		canonicalKey: record.key,
		storePath,
		readSource: {
			agentId,
			path: storePath
		},
		entry: record.entry
	}, record.materialized.row.repository ?? null);
}
/** Background facts use the Gateway's current row owner, never a completed caller's grant. */
async function prepareControlUiSessionPrServiceTarget(getProjection, query) {
	const projection = getProjection();
	if (!projection || isIncognitoSessionKey(query.sessionKey)) return;
	const lookup = {
		key: query.sessionKey,
		agentId: query.agentId
	};
	return await withReadySessionRows(projection, () => [lookup], (read) => {
		const record = read.describe(lookup);
		if (getProjection() !== projection || !record || record.entry.incognito || resolveSessionVisibility(record.entry) === "draft") return;
		const target = resolveProjectedControlUiSessionPrTarget(read.state.cfg, record);
		return target ? {
			...target,
			assertCurrent: () => {
				if (getProjection() !== projection || projection.capture(lookup) !== record || !projection.isCurrent(record)) throw new Error("Session pull-request target changed");
			}
		} : void 0;
	});
}
/** A watcher may follow a replaced target, but never a replacement person or access grant. */
async function prepareControlUiSessionPrRead(params) {
	const { client, sessionKey, agentId, getRuntimeConfig, getSessionRowProjection, isCurrentClient } = params;
	const actor = resolveGatewayOperatorRoleActor(client);
	const actorKind = actor?.kind;
	const actorProfile = actor?.kind === "operator" ? actor.profileId : void 0;
	const profileInput = client.authenticatedUserProfile?.profileId;
	const userInput = client.authenticatedUserId;
	const scopes = [...client.connect.scopes ?? []].toSorted().join("\0");
	const access = client.internal?.operatorAccessAuthority;
	const connectionSignal = client.connectionSignal;
	const projection = getSessionRowProjection();
	if (!projection) return;
	let aliasRevision = -1;
	const captureCurrent = () => {
		try {
			const currentActor = resolveGatewayOperatorRoleActor(client);
			if (!isCurrentClient() || client.invalidated || (client.connect.role ?? "operator") !== "operator" || client.connectionSignal !== connectionSignal || connectionSignal?.aborted || isGatewayClientProfilePending(client) || client.authenticatedUserProfile?.profileId !== profileInput || client.authenticatedUserId !== userInput || currentActor?.kind !== actorKind || (currentActor?.kind === "operator" ? currentActor.profileId : void 0) !== actorProfile || [...client.connect.scopes ?? []].toSorted().join("\0") !== scopes || client.internal?.operatorAccessAuthority !== access || !hasCurrentGatewayOperatorAccess(access)) return;
			const currentAliasRevision = readUserProfileAliasRevision();
			if (currentAliasRevision !== aliasRevision) {
				if (actorProfile && readResidentUserProfileId(actorProfile) !== actorProfile) return;
				aliasRevision = currentAliasRevision;
			}
			const cfg = getRuntimeConfig();
			if (authorizeCurrentOperatorRoleScopes(client, cfg) || !roleScopesAllow({
				role: "operator",
				requestedScopes: ["operator.read"],
				allowedScopes: client.connect.scopes ?? []
			})) return;
			const requested = resolveRequestedSessionAgentId(cfg, sessionKey, agentId);
			if (!requested.ok) return;
			if (getSessionRowProjection() !== projection) return;
			const query = {
				key: sessionKey,
				agentId: requested.agentId
			};
			const selected = projection.capture(query);
			if (!selected?.entry || !projection.isCurrent(selected) || (isIncognitoSessionKey(selected.key) ? projection.needsMembershipPreparation() : projection.sharingTargetState(query).status !== "ready") || createSessionListEntryFilter({
				cfg,
				client
			})?.(selected.key, selected.entry) === false) return;
			return {
				cfg,
				query,
				selected
			};
		} catch {
			return;
		}
	};
	const readPreparedCurrent = (read, captured) => {
		try {
			const current = read.describe(captured.query, captured.selected);
			const storePath = current?.storeTarget.storePath;
			if (!current || !storePath) return;
			const repository = current.materialized.row.repository ?? null;
			const target = resolveProjectedControlUiSessionPrTarget(captured.cfg, current);
			return target ? {
				target,
				repository
			} : void 0;
		} catch {
			return;
		}
	};
	const readCurrent = async () => {
		try {
			if (getSessionRowProjection() !== projection) return;
			const target = await withReadySessionRows(projection, (cfg) => {
				const requested = resolveRequestedSessionAgentId(cfg, sessionKey, agentId);
				return requested.ok ? [{
					key: sessionKey,
					agentId: requested.agentId
				}] : [];
			}, (read) => {
				const captured = captureCurrent();
				if (!captured) return;
				const prepared = readPreparedCurrent(read, captured);
				if (!prepared) return;
				const privateRow = isIncognitoSessionKey(captured.selected.key);
				const rowContext = projection.readPreparedRowContext();
				if (privateRow && captured.selected.entry?.repositoryWorkspaceId && !rowContext) return;
				return {
					...prepared,
					captured: privateRow ? void 0 : captured.selected,
					privateSource: privateRow ? {
						generation: captured.selected.generation,
						sessionId: captured.selected.entry?.sessionId,
						lifecycleRevision: captured.selected.entry?.lifecycleRevision,
						rowContext
					} : void 0
				};
			});
			return target ? {
				...target.target,
				assertCurrent: () => {
					const current = captureCurrent();
					const original = target.privateSource;
					if (!current) throw new Error("Session pull-request target changed");
					if (!original) {
						if (current.selected !== target.captured || !target.captured || !projection.isCurrent(target.captured)) throw new Error("Session pull-request target changed");
						return;
					}
					const { selected } = current;
					if (selected.generation !== original.generation || selected.entry?.sessionId !== original.sessionId || selected.entry?.lifecycleRevision !== original.lifecycleRevision || selected.entry?.repositoryWorkspaceId && (!original.rowContext || projection.readPreparedRowContext() !== original.rowContext) || resolveControlUiSessionPrTarget({
						cfg: current.cfg,
						agentId: selected.agentId,
						canonicalKey: selected.key,
						storePath: selected.storeTarget.storePath,
						readSource: {
							agentId: selected.storeTarget.agentId,
							path: selected.storeTarget.storePath
						},
						entry: selected.entry
					}, target.repository)?.identity !== target.target.identity) throw new Error("Session pull-request target changed");
				}
			} : void 0;
		} catch {
			return;
		}
	};
	return await readCurrent() ? readCurrent : void 0;
}
//#endregion
export { resolveProjectedControlUiSessionPrTarget as i, prepareControlUiSessionPrServiceTarget as n, resolveControlUiSessionPrTarget as r, prepareControlUiSessionPrRead as t };
