import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { _ as normalizeUniqueTrimmedStringList } from "./string-normalization-CECOqf64.mjs";
import { n as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { t as AgentSelectionRequiredError } from "./agent-scope-config-CDYpzA0r.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import "./session-key-C09ow4h0.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { n as operatorScopeSatisfied } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { f as resolveOperatorRolePolicyForAssignment, o as operatorSessionCap, t as authorizeCurrentOperatorRoleScopes, u as resolveGatewayOperatorRoleActor } from "./operator-role-policy-BqPaarjx.mjs";
import { n as isApprovalSessionTargetMethod, s as sessionMutationTargetFields } from "./session-method-policy-B_ndZirn.mjs";
import { n as resolveRequestedSessionAgentId, r as resolveRequestedSessionAgentInput } from "./session-request-agent-Bxi11ET4.mjs";
import { t as canonicalizeSessionKeyForAgent } from "./session-store-key-Ci099tm9.mjs";
import { _ as resolveSessionSharingTarget, b as isSessionCreatorProfile, d as hiddenSessionNotFound, f as isGatewayAdmin, g as resolveSessionSharingRole, l as canManageSessionSharing, s as authorizeSessionSharingTarget, v as resolveSessionVisibility, x as prepareSessionCreatorProfile, y as sharingIdentity } from "./session-sharing-policy-4QkIpHi4.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-C2RDnj28.mjs";
import { r as prepareGatewayRecipientProfile } from "./expected-profile-DP5LiA7Q.mjs";
import { s as resolveAuthorizedBoardViewTicketClaims } from "./board-view-ticket-BF8LDpSe.mjs";
import { r as readSessionGroupCatalog } from "./session-group-catalog-DEO_bQ_M.mjs";
import { s as resolveUnifiedTalkSessionTarget } from "./session-registry-BNDD8Stt.mjs";
//#region src/gateway/session-sharing-snapshot-cache.ts
const SNAPSHOT_CACHE_LIMIT = 2048;
const snapshotCache = /* @__PURE__ */ new Map();
const snapshotAliases = /* @__PURE__ */ new Map();
const snapshotKeysBySessionKey = /* @__PURE__ */ new Map();
const aliasKeysBySessionKey = /* @__PURE__ */ new Map();
const aliasKeysByCanonicalKey = /* @__PURE__ */ new Map();
function snapshotKey(sessionKey, agentId) {
	return `${agentId ?? ""}\0${sessionKey}`;
}
function logicalSessionKey(key) {
	return key.slice(key.lastIndexOf("\0") + 1);
}
function addReverseIndex(index, key, value) {
	const values = index.get(key) ?? /* @__PURE__ */ new Set();
	values.add(value);
	index.set(key, values);
}
function removeReverseIndex(index, key, value) {
	const values = index.get(key);
	values?.delete(value);
	if (values?.size === 0) index.delete(key);
}
function removeSnapshotAlias(alias) {
	const canonical = snapshotAliases.get(alias);
	if (!canonical) return;
	snapshotAliases.delete(alias);
	removeReverseIndex(aliasKeysBySessionKey, logicalSessionKey(alias), alias);
	removeReverseIndex(aliasKeysByCanonicalKey, canonical, alias);
}
function removeSnapshot(key) {
	if (!snapshotCache.delete(key)) return;
	removeReverseIndex(snapshotKeysBySessionKey, logicalSessionKey(key), key);
	for (const alias of aliasKeysByCanonicalKey.get(key) ?? []) removeSnapshotAlias(alias);
}
function rememberSnapshot(key, snapshot) {
	const known = snapshotCache.delete(key);
	snapshotCache.set(key, snapshot);
	if (!known) addReverseIndex(snapshotKeysBySessionKey, logicalSessionKey(key), key);
	if (snapshotCache.size <= SNAPSHOT_CACHE_LIMIT) return;
	const oldest = snapshotCache.keys().next().value;
	if (oldest) removeSnapshot(oldest);
}
function rememberSnapshotAlias(alias, canonical) {
	removeSnapshotAlias(alias);
	snapshotAliases.set(alias, canonical);
	addReverseIndex(aliasKeysBySessionKey, logicalSessionKey(alias), alias);
	addReverseIndex(aliasKeysByCanonicalKey, canonical, alias);
	if (snapshotAliases.size <= SNAPSHOT_CACHE_LIMIT * 2) return;
	const oldest = snapshotAliases.keys().next().value;
	if (oldest) removeSnapshotAlias(oldest);
}
function invalidateSessionSharingSnapshot(sessionKey) {
	if (sessionKey) {
		const matchingCanonicalKeys = new Set(snapshotKeysBySessionKey.get(sessionKey));
		for (const alias of aliasKeysBySessionKey.get(sessionKey) ?? []) {
			const canonical = snapshotAliases.get(alias);
			if (canonical) matchingCanonicalKeys.add(canonical);
		}
		for (const key of matchingCanonicalKeys) removeSnapshot(key);
		return;
	}
	snapshotCache.clear();
	snapshotAliases.clear();
	snapshotKeysBySessionKey.clear();
	aliasKeysBySessionKey.clear();
	aliasKeysByCanonicalKey.clear();
}
function loadCachedSessionSharingSnapshot(params) {
	const requestedKey = snapshotKey(params.sessionKey, params.agentId);
	const aliasedKey = snapshotAliases.get(requestedKey);
	const cached = snapshotCache.get(aliasedKey ?? requestedKey);
	if (cached) return cached;
	const resolved = params.resolve();
	const canonicalKey = snapshotKey(resolved.canonicalKey, resolved.canonicalAgentId);
	const canonicalCached = snapshotCache.get(canonicalKey);
	if (!canonicalCached) rememberSnapshot(canonicalKey, resolved.snapshot);
	if (requestedKey !== canonicalKey) rememberSnapshotAlias(requestedKey, canonicalKey);
	return canonicalCached ?? resolved.snapshot;
}
//#endregion
//#region src/gateway/session-sharing-read.ts
function loadSharingSnapshot(params) {
	const { sessionKey, agentId } = params;
	return loadCachedSessionSharingSnapshot({
		agentId,
		sessionKey,
		resolve: () => {
			const target = resolveSessionSharingTarget(params);
			return {
				canonicalKey: target?.canonicalKey ?? sessionKey,
				canonicalAgentId: target?.agentId ?? agentId,
				snapshot: {
					visibility: target ? resolveSessionVisibility(target.entry) : "draft",
					incognito: target ? target.entry.incognito === true || isIncognitoSessionKey(target.canonicalKey) : isIncognitoSessionKey(sessionKey),
					...target ? { createdActor: target.entry.createdActor } : {}
				}
			};
		}
	});
}
function canReceiveSessionEvent(params) {
	const { cfg, policyConfig = cfg, client, sessionKeys, event } = params;
	const operatorActor = resolveGatewayOperatorRoleActor(client);
	if (operatorActor?.kind === "operator" && authorizeCurrentOperatorRoleScopes(client, policyConfig)) return false;
	if (isGatewayAdmin(client)) return true;
	const identity = sharingIdentity(client, operatorActor);
	if (!identity) return (!operatorScopeSatisfied("operator.sessions.read", client.connect.scopes ?? []) || operatorActor?.kind === "system" || operatorScopeSatisfied("operator.read", client.connect.scopes ?? [])) && (!policyConfig.gateway?.roles || operatorActor?.kind === "system") && event !== "session.suggestion" && event !== "session.typing";
	const sharing = params.prepared?.sharing ?? prepareSessionSharing({
		cfg: policyConfig,
		client
	});
	const hidesForeignSessions = (params.prepared ? sharing.sessionCap : operatorSessionCap(client, policyConfig)) === "none";
	const lookup = params.prepared ? void 0 : {
		agentId: params.agentId,
		exactRead: sessionKeys.length === 1,
		storeCache: /* @__PURE__ */ new Map(),
		targetDiscoveryCache: /* @__PURE__ */ new Map()
	};
	const resolveTarget = (sessionKey) => params.prepared ? params.prepared.target(sessionKey, params.agentId) : resolveSessionSharingTarget({
		cfg,
		...lookup,
		sessionKey
	});
	const visible = sessionKeys.every((sessionKey) => {
		const target = params.prepared ? resolveTarget(sessionKey) : void 0;
		const snapshot = params.prepared ? {
			visibility: target ? resolveSessionVisibility(target.entry) : "draft",
			incognito: target ? target.entry.incognito === true || isIncognitoSessionKey(target.canonicalKey) : isIncognitoSessionKey(sessionKey),
			createdActor: target?.entry.createdActor
		} : loadSharingSnapshot({
			cfg,
			...lookup,
			sessionKey
		});
		const isCreator = sharing.isCreator(snapshot.createdActor);
		if (snapshot.incognito || hidesForeignSessions && !isCreator) return false;
		if (snapshot.visibility !== "draft" || isCreator) return true;
		if (event !== "session.typing") return false;
		const typingTarget = resolveTarget(sessionKey);
		return typingTarget !== null && canManageSessionSharing(sharing.roleForTarget(typingTarget));
	});
	if (!visible || event !== "session.suggestion") return visible;
	if ((params.payload && typeof params.payload === "object" ? params.payload.suggestion?.author?.id : void 0) === identity.id) return true;
	return sessionKeys.every((sessionKey) => {
		const target = resolveTarget(sessionKey);
		return target !== null && sharing.roleForTarget(target) !== "viewer";
	});
}
/** Share caller facts across synchronous selection/role projection, never across an await. */
function prepareSessionSharing(params, prepared) {
	const identity = sharingIdentity(params.client, resolveGatewayOperatorRoleActor(params.client));
	const isCreator = prepareSessionCreatorProfile(identity?.id, prepared?.aliases);
	const roleForTarget = (target, isMember) => resolveSessionSharingRole({
		...params,
		target,
		isMember: isMember ?? (prepared && Boolean(identity && prepared.isMember(target, identity.id)))
	}, prepared && { value: prepared.sessionCap }, isCreator);
	return {
		isCreator,
		sessionCap: prepared?.sessionCap,
		entryFilter: createSessionListEntryFilter(params, isCreator, prepared),
		roleForTarget,
		authorizeTarget: (target) => authorizeSessionSharingTarget({
			...params,
			target
		}, prepared && {
			value: prepared.sessionCap,
			role: roleForTarget(target)
		})
	};
}
function prepareProjectedSessionSharing(params) {
	const { cfg, client, isMember } = params;
	if (client?.internal?.syntheticClient) prepareGatewayRecipientProfile(client);
	const actor = resolveGatewayOperatorRoleActor(client);
	const identity = sharingIdentity(client, actor);
	const retained = client?.preparedSessionProfile;
	const profile = identity && retained?.aliases.has(identity.id) ? retained : void 0;
	const roleProfile = actor?.kind === "operator" && retained?.aliases.has(actor.profileId) ? retained : void 0;
	const policy = actor?.kind === "system" ? void 0 : resolveOperatorRolePolicyForAssignment(roleProfile?.profileId, roleProfile?.role ?? null, cfg, roleProfile?.githubLogin ?? null);
	return {
		...prepareSessionSharing(params, {
			aliases: profile?.aliases ?? /* @__PURE__ */ new Set(),
			sessionCap: policy?.sessions.others,
			isMember
		}),
		policy
	};
}
function createSessionListEntryFilter(params, isCreator, prepared) {
	const operatorActor = resolveGatewayOperatorRoleActor(params.client);
	const identity = sharingIdentity(params.client, operatorActor);
	if (isGatewayAdmin(params.client) || !identity && operatorActor?.kind === "system") return;
	if (!identity) return params.cfg?.gateway?.roles ? () => false : void 0;
	const sessionCap = prepared ? prepared.sessionCap : params.cfg && operatorSessionCap(params.client, params.cfg);
	return createProfileSessionEntryFilter({
		profileId: identity.id,
		sessionCap
	}, isCreator);
}
function createProfileSessionEntryFilter(params, isCreator) {
	const creatorMatches = isCreator ?? ((actor) => isSessionCreatorProfile(actor, params.profileId));
	return (sessionKey, entry) => entry.incognito !== true && !isIncognitoSessionKey(sessionKey) && (creatorMatches(entry.createdActor) || params.sessionCap !== "none" && resolveSessionVisibility(entry) !== "draft");
}
//#endregion
//#region src/gateway/session-sharing-target-input.ts
function resolveDirectSessionTargets(method, params) {
	if (method === "sessions.create" || method === "sessions.list") return [];
	const record = asOptionalRecord(params);
	if (!record) return [];
	const candidates = [record.key, record.sessionKey];
	if (method.startsWith("sessions.") && Array.isArray(record.keys)) candidates.push(...record.keys);
	if (Array.isArray(record.sessionKeys)) candidates.push(...record.sessionKeys);
	const agentId = normalizeOptionalString(record.agentId);
	return candidates.flatMap((candidate) => typeof candidate === "string" ? [{
		sessionKey: candidate,
		...agentId ? { agentId } : {}
	}] : []);
}
function resolveDirectIncognitoTargets(method, params) {
	return resolveDirectSessionTargets(method, params).filter((target) => isIncognitoSessionKey(canonicalizeSessionKeyForAgent(target.agentId ?? "main", target.sessionKey)));
}
function readSessionSharingStringParam(params, key) {
	return normalizeOptionalString(asOptionalRecord(params)?.[key]);
}
function preparedGroupTargets(context) {
	const projection = getSessionRowProjection(context);
	if (!projection) throw new Error("Session group membership is unavailable during Gateway startup");
	return projection.sessionGroupTargets();
}
function resolveSessionGroupsPutMutationTargets(context, requestParams) {
	const names = requestParams && typeof requestParams === "object" && "names" in requestParams ? requestParams.names : void 0;
	if (!Array.isArray(names)) return;
	const requested = new Set(normalizeUniqueTrimmedStringList(names));
	const dropped = readSessionGroupCatalog().groups.map((group) => group.name).filter((name) => !requested.has(name));
	if (dropped.length === 0) return [];
	const byName = preparedGroupTargets(context);
	return dropped.flatMap((name) => byName.get(name) ?? []);
}
function resolveApprovalSessionTarget(method, params, context) {
	const id = readSessionSharingStringParam(params, "id");
	if (!id) return;
	const kind = readSessionSharingStringParam(params, "kind");
	const manager = method === "plugin.approval.resolve" || kind === "plugin" ? context.pluginApprovalManager : method === "approval.resolve" && kind === "system-agent" ? context.systemAgentApprovalManager : context.execApprovalManager;
	const resolvedId = manager?.lookupLocalApprovalId(id, { includeResolved: true });
	const recordId = resolvedId?.kind === "exact" || resolvedId?.kind === "prefix" ? resolvedId.id : id;
	const request = manager?.getLocalSnapshot(recordId)?.request;
	const sessionKey = readSessionSharingStringParam(request, "sessionKey");
	const agentId = readSessionSharingStringParam(request, "agentId");
	return sessionKey ? {
		sessionKey,
		...agentId ? { agentId } : {}
	} : void 0;
}
/** Realtime creates authorize their effective default; transcription stays sessionless. */
function resolveTalkSessionTargetInput(method, params, connId) {
	if (method === "talk.session.steer") {
		const sessionId = readSessionSharingStringParam(params, "sessionId");
		const retained = sessionId ? resolveUnifiedTalkSessionTarget(sessionId, connId) : void 0;
		return retained ? {
			kind: "relay",
			...retained
		} : void 0;
	}
	if (method !== "talk.client.create" && method !== "talk.client.toolCall" && method !== "talk.session.create" && method !== "talk.client.transcript" && method !== "talk.client.close" && method !== "talk.client.steer") return;
	const sessionKey = readSessionSharingStringParam(params, "sessionKey");
	if (sessionKey) return {
		kind: "request",
		sessionKey
	};
	if (method === "talk.client.create") return { kind: "request" };
	if (method === "talk.session.create" && (readSessionSharingStringParam(params, "mode") ?? "realtime") === "realtime" && readSessionSharingStringParam(params, "transport") !== "managed-room") return { kind: "request" };
}
function resolveSessionMutationTargets(params) {
	if (params.method === "sessions.patchMany") {
		const targets = params.requestParams && typeof params.requestParams === "object" && "targets" in params.requestParams ? params.requestParams.targets : void 0;
		return Array.isArray(targets) ? targets.slice(0, 101).flatMap((target) => {
			const sessionKey = readSessionSharingStringParam(target, "key");
			const agentId = readSessionSharingStringParam(target, "agentId");
			return sessionKey ? [{
				sessionKey,
				...agentId ? { agentId } : {}
			}] : [];
		}) : void 0;
	}
	if (params.method === "sessions.groups.rename" || params.method === "sessions.groups.delete" || params.method === "sessions.groups.update") {
		const groupName = readSessionSharingStringParam(params.requestParams, "name");
		return groupName ? [...preparedGroupTargets(params.context).get(groupName) ?? []] : void 0;
	}
	if (params.method === "sessions.groups.put") return resolveSessionGroupsPutMutationTargets(params.context, params.requestParams);
	if (isApprovalSessionTargetMethod(params.method)) {
		const target = resolveApprovalSessionTarget(params.method, params.requestParams, params.context);
		return target ? [target] : void 0;
	}
	const requestedAgentId = readSessionSharingStringParam(params.requestParams, "agentId");
	const directTargets = [];
	for (const field of sessionMutationTargetFields(params.method)) {
		const sessionKey = readSessionSharingStringParam(params.requestParams, field);
		if (!sessionKey) continue;
		const parentUsesRequestedAgent = field !== "parentSessionKey" || ["global", "unknown"].includes(sessionKey.toLowerCase());
		directTargets.push({
			sessionKey,
			...requestedAgentId && parentUsesRequestedAgent ? { agentId: requestedAgentId } : {}
		});
	}
	if (directTargets.length) return directTargets;
	if (params.method === "board.event" || params.method === "board.action") {
		const ticket = readSessionSharingStringParam(params.requestParams, "ticket");
		const claims = ticket ? resolveAuthorizedBoardViewTicketClaims(ticket, { gatewayContext: params.context }) : void 0;
		if (!claims || requestedAgentId && requestedAgentId !== claims.agentId) return;
		return [{
			sessionKey: claims.sessionKey,
			...claims.agentId ? { agentId: claims.agentId } : {}
		}];
	}
	if (params.method !== "sessions.abort") return;
	const runId = readSessionSharingStringParam(params.requestParams, "runId");
	const run = runId ? params.context.chatAbortControllers.get(runId) : void 0;
	return run ? [{
		sessionKey: run.sessionKey,
		...run.agentId ? { agentId: run.agentId } : {}
	}] : void 0;
}
//#endregion
//#region src/gateway/session-sharing-target-read.ts
const readProjectedSessionMutationTarget = (targetRef, cfg, projection) => {
	const agent = resolveRequestedSessionAgentId(cfg, targetRef.sessionKey, targetRef.agentId);
	if (!agent.ok) return { status: "unavailable" };
	const query = {
		key: targetRef.sessionKey,
		agentId: agent.agentId
	};
	const state = projection.sharingTargetState(query);
	if (state.status !== "ready") return { status: state.status === "pending" ? "pending" : "unavailable" };
	const readSource = projection.readSource({
		...query,
		storePath: state.target.storePath
	});
	if (!readSource || readSource.path !== state.target.storePath || typeof readSource.databaseIdentity !== "string") return { status: "unavailable" };
	assertExistingDatabaseIdentity(readSource.path, `file:${readSource.databaseIdentity}`, readSource.databaseBirthtime);
	return {
		status: "ready",
		target: {
			...state.target,
			readSource
		}
	};
};
function readSessionMutationTarget(params) {
	const input = resolveRequestedSessionAgentInput(params.targetRef.sessionKey, params.targetRef.agentId);
	if (!input.ok) return { error: input.error };
	try {
		const projection = getSessionRowProjection(params.context);
		const projected = projection && readProjectedSessionMutationTarget(params.targetRef, params.cfg, projection);
		if (projected?.status === "ready" && (!params.expectedTarget || projected.target.storePath === params.expectedTarget.storePath)) return {
			target: projected.target,
			preparedReadSource: projected.target.readSource,
			projection
		};
		if (params.sessionRowRead && resolveDirectSessionTargets(params.method, params.requestParams).some((direct) => direct.sessionKey === params.targetRef.sessionKey && direct.agentId === params.targetRef.agentId)) {
			const agent = resolveRequestedSessionAgentId(params.sessionRowRead.state.cfg, params.targetRef.sessionKey, params.targetRef.agentId);
			if (!agent.ok) return { error: agent.error };
			const row = params.sessionRowRead.describe({
				key: params.targetRef.sessionKey,
				agentId: agent.agentId
			});
			if (!row && params.sessionScope === "operator.sessions.read") return { error: hiddenSessionNotFound(params.targetRef.sessionKey) };
			const readSource = row && params.sessionRowRead.readSource(row);
			return {
				preparedReadSource: readSource,
				target: row?.storedEntry ? {
					agentId: row.agentId,
					canonicalKey: row.key,
					storeKey: row.key,
					storeKeys: [row.key],
					storePath: row.storeTarget.storePath,
					readSource,
					entry: row.storedEntry
				} : null
			};
		}
		return { target: resolveSessionSharingTarget({
			cfg: params.cfg,
			sessionKey: params.targetRef.sessionKey,
			agentId: input.value,
			...params.lookupCaches(),
			exactRead: params.targetCount === 1
		}) };
	} catch (error) {
		if (error instanceof AgentSelectionRequiredError) return { error: errorShape(ErrorCodes.INVALID_REQUEST, error.message) };
		throw error;
	}
}
//#endregion
export { resolveSessionMutationTargets as a, createProfileSessionEntryFilter as c, prepareSessionSharing as d, invalidateSessionSharingSnapshot as f, resolveDirectSessionTargets as i, createSessionListEntryFilter as l, readSessionMutationTarget as n, resolveTalkSessionTargetInput as o, resolveDirectIncognitoTargets as r, canReceiveSessionEvent as s, readProjectedSessionMutationTarget as t, prepareProjectedSessionSharing as u };
