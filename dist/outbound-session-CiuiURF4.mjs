import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-CUdBruRD.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-C09ow4h0.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { o as resolveSqliteReadScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { _ as resolveSessionStorePathForScope } from "./session-transcript-worker-runtime-CTwaPfeT.mjs";
import { c as loadSessionEntryReadOnlyInScope } from "./session-accessor.sqlite-exact-read-JW6IveXD.mjs";
import { r as inheritSessionCreationPolicy } from "./session-entry-provenance-Bfs2J1E7.mjs";
import { t as getChannelPlugin } from "./registry-DOE8N7Jo.mjs";
import "./plugins-Z9_SzFi0.mjs";
import { h as updateSessionLastRouteInScope, m as updateSessionLastRoute, o as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import "./session-accessor-CQ-g9yb2.mjs";
import { o as resolveAgentRoute } from "./resolve-route-Bzb6opva.mjs";
import { n as stripOutboundTargetKindPrefix, r as stripTargetProviderPrefix } from "./channel-target-prefix-DIR59G50.mjs";
import { t as buildOutboundBaseSessionKey } from "./base-session-key-DjXKFR-f.mjs";
import "./inbound.runtime-BJ_bigcm.mjs";
//#region src/infra/outbound/outbound-session.ts
function rebaseOutboundSessionRoute(route, baseSessionKey) {
	if (route.sessionKey !== route.baseSessionKey && !route.sessionKey.startsWith(`${route.baseSessionKey}:`)) return null;
	return {
		...route,
		sessionKey: `${baseSessionKey}${route.sessionKey.slice(route.baseSessionKey.length)}`,
		baseSessionKey
	};
}
const FALLBACK_TARGET_KIND_PREFIXES = [
	{
		kind: "direct",
		pattern: /^(user:|dm:)/i
	},
	{
		kind: "channel",
		pattern: /^(channel:|conversation:|thread:)/i
	},
	{
		kind: "group",
		pattern: /^(group:|room:)/i
	}
];
function inferPeerKind(params) {
	const resolvedKind = params.resolvedTarget?.kind;
	if (resolvedKind === "user") return "direct";
	if (resolvedKind === "channel") return "channel";
	if (resolvedKind === "group") {
		const chatTypes = (params.plugin ?? getChannelPlugin(params.channel))?.capabilities?.chatTypes ?? [];
		const supportsChannel = chatTypes.includes("channel");
		const supportsGroup = chatTypes.includes("group");
		if (supportsChannel && !supportsGroup) return "channel";
		return "group";
	}
	const plugin = params.plugin ?? getChannelPlugin(params.channel);
	const strippedTarget = stripTargetProviderPrefix(params.target, params.channel);
	const targets = uniqueStrings([params.target, strippedTarget].filter(Boolean));
	for (const target of targets) {
		const inferred = plugin?.messaging?.inferTargetChatType?.({ to: target });
		if (inferred === "direct" || inferred === "group" || inferred === "channel") return inferred;
	}
	for (const target of targets) {
		const fallback = FALLBACK_TARGET_KIND_PREFIXES.find(({ pattern }) => pattern.test(target));
		if (fallback) return fallback.kind;
	}
	const chatTypes = new Set(plugin?.capabilities?.chatTypes?.filter((kind) => kind === "direct" || kind === "group" || kind === "channel"));
	return chatTypes.size === 1 ? chatTypes.values().next().value ?? "direct" : "direct";
}
function resolveFallbackSession(params) {
	const trimmed = stripTargetProviderPrefix(params.target, params.channel);
	if (!trimmed) return null;
	const peerKind = inferPeerKind({
		channel: params.channel,
		plugin: params.plugin,
		target: params.target,
		resolvedTarget: params.resolvedTarget
	});
	const peerId = stripOutboundTargetKindPrefix(trimmed);
	if (!peerId) return null;
	const peer = {
		kind: peerKind,
		id: peerId
	};
	const baseSessionKey = buildOutboundBaseSessionKey({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: params.channel,
		accountId: params.accountId,
		peer
	});
	return {
		sessionKey: baseSessionKey,
		baseSessionKey,
		recipientSessionExact: false,
		peer,
		chatType: peerKind,
		from: peerKind === "direct" ? `${params.channel}:${peerId}` : `${params.channel}:${peerKind}:${peerId}`,
		to: `${peerKind === "direct" ? "user" : "channel"}:${peerId}`
	};
}
function resolveOutboundSessionDisplayName(params) {
	const resolvedTarget = params.resolvedTarget;
	const displayName = normalizeOptionalString(resolvedTarget?.display);
	if (!displayName) return;
	if (params.channel === "imessage" && resolvedTarget?.resolutionSource === "plugin") return displayName;
	if (resolvedTarget?.resolutionSource !== "directory") return;
	const target = stripTargetProviderPrefix(resolvedTarget.to, params.channel);
	const identifier = stripOutboundTargetKindPrefix(target);
	const normalizedDisplay = normalizeLowercaseStringOrEmpty(displayName);
	return uniqueStrings([
		resolvedTarget.to,
		target,
		identifier
	]).map(normalizeLowercaseStringOrEmpty).filter(Boolean).includes(normalizedDisplay) ? void 0 : displayName;
}
/** Resolves the session route used to mirror outbound delivery into conversation state. */
async function resolveOutboundSessionRoute(params) {
	const target = params.target.trim();
	if (!target) return null;
	const nextParams = {
		...params,
		target
	};
	const resolver = (params.plugin ?? getChannelPlugin(params.channel))?.messaging?.resolveOutboundSessionRoute;
	const route = resolver ? await resolver(nextParams) : resolveFallbackSession(nextParams);
	const displayName = resolveOutboundSessionDisplayName(params);
	const namedRoute = route && displayName ? {
		...route,
		displayName
	} : route;
	if (!namedRoute || namedRoute.recipientSessionExact !== true) return namedRoute;
	const bindingRoute = resolveAgentRoute({
		cfg: params.cfg,
		channel: params.channel,
		defaultAgentId: params.agentId,
		accountId: params.accountId,
		peer: namedRoute.peer
	});
	const isDirect = namedRoute.peer.kind === "direct";
	const globalScope = isDirect ? params.cfg.session?.dmScope ?? "main" : params.cfg.session?.groupScope ?? "per-group";
	const bindingScope = isDirect ? bindingRoute.dmScope : bindingRoute.groupScope;
	if (normalizeAgentId(bindingRoute.agentId) !== normalizeAgentId(params.agentId)) return {
		...namedRoute,
		recipientSessionExact: false
	};
	return bindingScope !== globalScope ? rebaseOutboundSessionRoute(namedRoute, bindingRoute.sessionKey) : namedRoute;
}
/** Capture logical locators without opening a source store that a completed retry never needs. */
function captureOutboundSessionBinding(params) {
	const destination = {
		agentId: params.scope.agentId,
		databaseAgentId: params.scope.databaseAgentId,
		storePath: params.scope.storePath,
		env: {
			OPENCLAW_STATE_DIR: resolveStateDir(params.scope.env),
			...isGatewayExternallySupervised(params.scope.env) ? { OPENCLAW_SUPERVISOR_MODE: "external" } : {}
		}
	};
	if (!params.sourceSessionKey) return { destination };
	const source = {
		agentId: resolveAgentIdFromSessionKey(params.sourceSessionKey),
		env: destination.env,
		sessionKey: params.sourceSessionKey
	};
	return {
		destination,
		source: {
			...source,
			storePath: resolveSessionStorePathForScope({
				...source,
				env: params.scope.env
			}, params.cfg)
		}
	};
}
/** Resolve source ownership only when binding is needed, before asynchronous plugin routing. */
function prepareOutboundSessionBinding(captured) {
	const { destination, source } = captured;
	if (!source) return { destination };
	const target = toDatabaseOptions(resolveSqliteReadScope(source));
	return {
		destination,
		source: {
			...source,
			databaseAgentId: target.agentId,
			storePath: resolveOpenClawAgentSqlitePath(target)
		}
	};
}
function resolveOutboundSessionCreation(params, sourceScope) {
	if (params.creation || !params.sourceSessionKey) return params.creation;
	const source = sourceScope ? loadSessionEntryReadOnlyInScope(sourceScope) : loadSessionEntryReadOnly({
		sessionKey: params.sourceSessionKey,
		storePath: resolveSessionStorePathCore(params.cfg.session?.store, { agentId: resolveAgentIdFromSessionKey(params.sourceSessionKey) })
	});
	return source?.sandbox === "required" ? {
		via: source.createdVia ?? "channel",
		...inheritSessionCreationPolicy(source)
	} : void 0;
}
async function persistOutboundSessionEntry(params, prepared) {
	const storePath = prepared?.destination.storePath ?? resolveSessionStorePathCore(params.cfg.session?.store, { agentId: resolveAgentIdFromSessionKey(params.route.sessionKey) });
	const ctx = {
		From: params.route.from,
		To: params.route.to,
		SessionKey: params.route.sessionKey,
		AccountId: params.accountId ?? void 0,
		ChatType: params.route.chatType,
		Provider: params.channel,
		Surface: params.channel,
		MessageThreadId: params.route.threadId,
		OriginatingChannel: params.channel,
		OriginatingTo: params.route.to,
		NativeDirectUserId: params.route.peer.kind === "direct" ? params.route.peer.id : void 0,
		NativeChannelId: params.route.peer.kind === "direct" ? void 0 : params.route.peer.id,
		ConversationLabel: params.route.displayName,
		GroupSubject: params.route.peer.kind === "direct" ? void 0 : params.route.displayName,
		SessionCreation: resolveOutboundSessionCreation(params, prepared?.source)
	};
	const update = {
		storePath,
		sessionKey: params.route.sessionKey,
		createIfMissing: true,
		channel: params.channel,
		to: params.route.to,
		accountId: params.accountId ?? void 0,
		threadId: params.route.threadId,
		ctx,
		...params.assertCommitAllowed ? { assertCommitAllowed: params.assertCommitAllowed } : {}
	};
	return prepared ? await updateSessionLastRouteInScope({
		...prepared.destination,
		sessionKey: params.route.sessionKey
	}, update) : await updateSessionLastRoute(update);
}
/** Persists best-effort session metadata for an outbound-only route. */
async function ensureOutboundSessionEntry(params) {
	try {
		await persistOutboundSessionEntry(params);
	} catch (error) {
		if (params.creation?.sandbox === "required" || params.sourceSessionKey) createSubsystemLogger("outbound/session").warn(`Failed to preserve outbound session creation policy for ${params.route.sessionKey}: ${String(error)}`);
	}
}
/** Persists the route required to bind an exact conversation address to local context. */
async function bindOutboundSessionEntry(params, prepared) {
	if (!await persistOutboundSessionEntry(params, prepared)) throw new Error(`Failed to bind outbound session ${params.route.sessionKey}`);
}
//#endregion
export { resolveOutboundSessionRoute as a, prepareOutboundSessionBinding as i, captureOutboundSessionBinding as n, ensureOutboundSessionEntry as r, bindOutboundSessionEntry as t };
