import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { i as normalizeMainKey, r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey, b as isAcpSessionKey } from "./session-key-C09ow4h0.mjs";
import { n as GATEWAY_CLIENT_IDS, o as normalizeGatewayClientId } from "./client-info-C8RatpKO.mjs";
import "./client-CrrkVIh8.mjs";
import { t as GatewayClientRequestError } from "./request-error-Clu0Uyey.mjs";
import { a as lookupFailedOperationMessage, i as lookupFailedDenialMessage, l as sessionOwnershipLookupFailure, n as listSpawnedSessionKeysWithResult, r as logSessionOwnershipLookupFailure } from "./session-visibility-internal-D2EfOhU9.mjs";
import { n as callAgentToolGatewayRequest } from "./in-process-gateway-5-3wumVL.mjs";
//#region src/sessions/session-id.ts
const SESSION_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function looksLikeSessionId(value) {
	return SESSION_ID_RE.test(value.trim());
}
//#endregion
//#region src/agents/tools/sessions-resolution.ts
const CURRENT_SESSION_CLIENT_ALIAS_IDS = /* @__PURE__ */ new Set([
	GATEWAY_CLIENT_IDS.TUI,
	GATEWAY_CLIENT_IDS.CLI,
	GATEWAY_CLIENT_IDS.WEBCHAT_UI,
	GATEWAY_CLIENT_IDS.CONTROL_UI,
	GATEWAY_CLIENT_IDS.MACOS_APP,
	GATEWAY_CLIENT_IDS.IOS_APP,
	GATEWAY_CLIENT_IDS.ANDROID_APP
]);
function resolveMainSessionAlias(cfg) {
	const mainKey = normalizeMainKey(cfg.session?.mainKey);
	const scope = cfg.session?.scope ?? "per-sender";
	return {
		mainKey,
		alias: scope === "global" ? "global" : mainKey,
		scope
	};
}
function resolveDisplaySessionKey(params) {
	return params.key === params.alias || params.key === params.mainKey ? "main" : params.key;
}
function resolveInternalSessionKey(params) {
	if (params.key === "current") return params.requesterInternalKey ?? params.key;
	if (params.key === "main") return params.alias;
	return params.key;
}
function resolveCurrentSessionClientAlias(params) {
	const requesterKey = normalizeOptionalString(params.requesterInternalKey);
	if (!requesterKey) return;
	const clientId = normalizeGatewayClientId(params.key);
	if (!clientId || !CURRENT_SESSION_CLIENT_ALIAS_IDS.has(clientId)) return;
	return requesterKey;
}
function isExpectedSessionLookupMiss(error) {
	return error instanceof Error && error.message.includes("No session found") && (!(error instanceof GatewayClientRequestError) || error.gatewayCode === "INVALID_REQUEST");
}
function isUnsupportedSpawnedSessionResolve(error) {
	return error instanceof GatewayClientRequestError && error.gatewayCode === "INVALID_REQUEST" && error.message === "unknown method: sessions.resolve";
}
async function lookupRequesterSessionOwnership(params) {
	if (params.requesterSessionKey === params.targetSessionKey && params.targetAgentId === params.requesterAgentId) return ok(true);
	const gatewayCall = params.callGateway ?? callAgentToolGatewayRequest;
	try {
		const resolved = await requestResolvedSession({
			key: params.targetSessionKey,
			agentId: params.targetAgentId,
			spawnedBy: params.requesterSessionKey,
			allowMissing: true
		}, gatewayCall);
		return ok(resolved?.key === params.targetSessionKey);
	} catch (error) {
		if (isExpectedSessionLookupMiss(error)) return ok(false);
		if (isUnsupportedSpawnedSessionResolve(error)) {
			const listed = await listSpawnedSessionKeysWithResult({
				requesterSessionKey: params.requesterSessionKey,
				callGateway: gatewayCall
			});
			return listed.ok ? ok(params.targetAgentId === params.requesterAgentId && listed.value.has(params.targetSessionKey)) : err(listed.error);
		}
		return err(sessionOwnershipLookupFailure(error));
	}
}
function looksLikeSessionKey(value) {
	const raw = normalizeOptionalString(value) ?? "";
	return raw === "main" || raw === "global" || raw === "unknown" || raw === "current" || isAcpSessionKey(raw) || raw.startsWith("agent:") || raw.startsWith("cron:") || raw.startsWith("hook:") || raw.startsWith("node-") || raw.startsWith("node:") || raw.includes(":group:") || raw.includes(":channel:");
}
function shouldResolveSessionIdInput(value) {
	return looksLikeSessionId(value) || !looksLikeSessionKey(value);
}
async function requestResolvedSession(params, callGateway) {
	let result;
	try {
		result = await callGateway({
			method: "sessions.resolve",
			params
		});
	} catch (error) {
		if (!(params.allowMissing === true && error instanceof GatewayClientRequestError && error.gatewayCode === "INVALID_REQUEST" && error.message.includes("invalid sessions.resolve params") && error.message.includes("unexpected property 'allowMissing'"))) throw error;
		const legacyParams = { ...params };
		delete legacyParams.allowMissing;
		result = await callGateway({
			method: "sessions.resolve",
			params: legacyParams
		});
	}
	const key = normalizeOptionalString(result?.key);
	if (!key) return;
	const agentId = normalizeOptionalString(result?.agentId);
	return {
		key,
		...agentId ? { agentId } : {}
	};
}
function buildSessionResolveQuery(params) {
	return {
		[params.kind]: params.input,
		agentId: params.agentId,
		spawnedBy: params.restrictToSpawned ? params.requesterInternalKey : void 0,
		...params.kind === "sessionId" ? {
			includeGlobal: !params.restrictToSpawned,
			includeUnknown: !params.restrictToSpawned
		} : {},
		...params.allowMissing ? { allowMissing: true } : {}
	};
}
async function resolveSessionReference(params) {
	const gatewayCall = params.callGateway ?? callAgentToolGatewayRequest;
	const failedLookup = (failure) => {
		logSessionOwnershipLookupFailure({
			requesterSessionKey: params.requesterInternalKey ?? "unknown",
			failure
		});
		return {
			ok: false,
			status: params.restrictToSpawned ? "forbidden" : "error",
			error: params.restrictToSpawned ? lookupFailedDenialMessage(params.action, failure.kind) : lookupFailedOperationMessage(params.action, failure.kind)
		};
	};
	const rawInput = resolveCurrentSessionClientAlias({
		key: params.sessionKey,
		requesterInternalKey: params.requesterInternalKey
	}) ?? params.sessionKey.trim();
	const raw = rawInput === "current" && params.requesterInternalKey ? params.requesterInternalKey : rawInput;
	if (shouldResolveSessionIdInput(raw)) {
		for (const kind of ["key", "sessionId"]) try {
			const resolved = await requestResolvedSession(buildSessionResolveQuery({
				input: raw,
				kind,
				agentId: kind === "key" ? parseAgentSessionKey(raw)?.agentId ?? params.keyAgentId ?? params.agentId : params.agentId,
				requesterInternalKey: params.requesterInternalKey,
				restrictToSpawned: params.restrictToSpawned
			}), gatewayCall);
			if (resolved) return {
				ok: true,
				...resolved,
				displayKey: resolveDisplaySessionKey({
					key: resolved.key,
					alias: params.alias,
					mainKey: params.mainKey
				}),
				resolvedViaSessionId: kind === "sessionId",
				requesterOwned: params.restrictToSpawned
			};
		} catch (error) {
			if (!isExpectedSessionLookupMiss(error)) return failedLookup(sessionOwnershipLookupFailure(error));
		}
		return {
			ok: false,
			status: params.restrictToSpawned ? "forbidden" : "error",
			notFound: true,
			error: params.restrictToSpawned ? `Session not visible from this sandboxed agent session: ${raw}` : `Session not found: ${raw} (use the full sessionKey from sessions_list)`
		};
	}
	const resolvedKey = resolveInternalSessionKey({
		key: raw,
		alias: params.alias,
		requesterInternalKey: params.requesterInternalKey
	});
	const semanticAliasAgentId = params.agentId ?? (rawInput === "current" ? parseAgentSessionKey(resolvedKey)?.agentId ?? params.keyAgentId : rawInput === "main" || rawInput === params.mainKey ? params.keyAgentId : void 0);
	const displayKey = resolveDisplaySessionKey({
		key: resolvedKey,
		alias: params.alias,
		mainKey: params.mainKey
	});
	return {
		ok: true,
		...semanticAliasAgentId ? { agentId: semanticAliasAgentId } : {},
		key: resolvedKey,
		displayKey,
		resolvedViaSessionId: false,
		requesterOwned: resolvedKey === params.requesterInternalKey && (!semanticAliasAgentId || semanticAliasAgentId === (parseAgentSessionKey(params.requesterInternalKey ?? "")?.agentId ?? params.keyAgentId))
	};
}
async function resolveVisibleSessionReference(params) {
	let resolvedKey = params.resolvedSession.key;
	let resolvedAgentId = params.resolvedSession.agentId ?? parseAgentSessionKey(resolvedKey)?.agentId;
	let displayKey = params.resolvedSession.displayKey;
	let missing = false;
	const requesterOwnedByResolution = params.resolvedSession.requesterOwned;
	if (isIncognitoSessionKey(resolvedKey)) return {
		ok: false,
		status: "forbidden",
		error: `Session not visible from session tools: ${params.visibilitySessionKey}`,
		displayKey
	};
	const input = params.visibilitySessionKey.trim();
	if (!params.resolvedSession.resolvedViaSessionId && input !== "current" && input !== "main" && input !== "global" && input !== "unknown" && !shouldResolveSessionIdInput(input) && !params.restrictToSpawned && (params.action === "history" || params.action === "send")) try {
		const resolved = await requestResolvedSession(buildSessionResolveQuery({
			input: resolvedKey,
			kind: "key",
			agentId: resolvedAgentId,
			requesterInternalKey: params.requesterSessionKey,
			restrictToSpawned: params.restrictToSpawned,
			allowMissing: params.allowMissingKey
		}), params.callGateway ?? callAgentToolGatewayRequest);
		if (resolved) {
			resolvedKey = resolved.key;
			resolvedAgentId = resolved.agentId ?? parseAgentSessionKey(resolved.key)?.agentId;
			displayKey = resolved.key;
		} else if (params.allowMissingKey) missing = true;
	} catch (error) {
		if (params.concealResolutionError) return {
			ok: false,
			status: "forbidden",
			error: params.concealResolutionError,
			displayKey
		};
		return {
			ok: false,
			status: "error",
			error: formatErrorMessage(error) || `Session not found: ${params.visibilitySessionKey} (use the full sessionKey from sessions_list)`,
			displayKey
		};
	}
	if (isIncognitoSessionKey(resolvedKey)) return {
		ok: false,
		status: "forbidden",
		error: `Session not visible from session tools: ${params.visibilitySessionKey}`,
		displayKey
	};
	return {
		ok: true,
		...resolvedAgentId ? { agentId: resolvedAgentId } : {},
		key: resolvedKey,
		displayKey,
		requesterOwned: requesterOwnedByResolution || params.requesterSessionKey === resolvedKey && resolvedAgentId === params.requesterAgentId,
		...missing ? { missing: true } : {}
	};
}
//#endregion
export { resolveInternalSessionKey as a, resolveVisibleSessionReference as c, resolveDisplaySessionKey as i, shouldResolveSessionIdInput as l, lookupRequesterSessionOwnership as n, resolveMainSessionAlias as o, resolveCurrentSessionClientAlias as r, resolveSessionReference as s, isExpectedSessionLookupMiss as t, SESSION_ID_RE as u };
