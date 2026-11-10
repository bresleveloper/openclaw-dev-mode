import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { _ as normalizeUniqueTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { l as sessionMutationTargetFields, n as isApprovalSessionTargetMethod } from "./session-method-policy-B7o-3I76.mjs";
import { r as resolveRequestedSessionAgentId, t as resolveChatSendSessionKey } from "./session-request-agent-ByGzV8Af.mjs";
import { t as canonicalizeSessionKeyForAgent } from "./session-store-key-DKpto8R6.mjs";
import { i as gatewayClientSessionCreator } from "./gateway-client-identity-DXWhtQve.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-BUm5f-cY.mjs";
import { s as resolveAuthorizedBoardViewTicketClaims } from "./board-view-ticket-DPSfmGZg.mjs";
import { r as readSessionGroupCatalog } from "./session-group-catalog-DqTqmjvM.mjs";
import { c as resolveUnifiedTalkSessionTarget } from "./session-registry-nF17nW_H.mjs";
//#region src/gateway/session-sharing-target-input.ts
function resolveChatSendAuthorizationTarget(cfg, target) {
	const agent = resolveRequestedSessionAgentId(cfg, target.sessionKey, target.agentId);
	return agent.ok ? ok({
		...target,
		agentId: agent.agentId,
		sessionKey: resolveChatSendSessionKey(cfg, target.sessionKey, agent.agentId)
	}) : err(agent.error);
}
/** Match mutation guards with the normalized identity captured at admission. */
function resolveSessionMutationGuardTarget(method, cfg, targetRef, targets) {
	let target = {
		sessionKey: normalizeOptionalString(targetRef.sessionKey) ?? targetRef.sessionKey,
		agentId: normalizeOptionalString(targetRef.agentId)
	};
	if (method === "chat.send") {
		const normalized = resolveChatSendAuthorizationTarget(cfg, target);
		if (!normalized.ok) throw new SessionMutationAuthorizationChangedError(normalized.error);
		target = normalized.value;
	}
	return {
		target,
		expected: targets.find((candidate) => candidate.sessionKey === target.sessionKey && candidate.agentId === target.agentId)
	};
}
/** Authorization selects the same chat target without rewriting the raw request's replay aliases. */
function resolveChatSendAuthorizationParams(cfg, params) {
	const record = asOptionalRecord(params);
	if (typeof record?.sessionKey !== "string") return ok(params);
	const target = resolveChatSendAuthorizationTarget(cfg, {
		sessionKey: record.sessionKey,
		agentId: normalizeOptionalString(record.agentId)
	});
	return target.ok ? ok({
		...record,
		sessionKey: target.value.sessionKey,
		agentId: target.value.agentId
	}) : err(target.error);
}
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
/** Share the core's non-disclosing read boundary with worker preparation. */
function resolveProtectedSessionTargets(params) {
	const directTargets = params.talkTargets ?? resolveDirectSessionTargets(params.method, params.requestParams);
	const hidesForeignSessions = !params.adminBypass && directTargets.length > 0 && Boolean(gatewayClientSessionCreator(params.client)) && params.sessionCap() === "none";
	return {
		hidesForeignSessions,
		protectedTargets: hidesForeignSessions ? directTargets : params.talkTargets?.filter((target) => isIncognitoSessionKey(target.sessionKey)) ?? resolveDirectIncognitoTargets(params.method, params.requestParams)
	};
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
export { resolveProtectedSessionTargets as a, resolveTalkSessionTargetInput as c, resolveDirectSessionTargets as i, resolveChatSendAuthorizationParams as n, resolveSessionMutationGuardTarget as o, resolveDirectIncognitoTargets as r, resolveSessionMutationTargets as s, readSessionSharingStringParam as t };
