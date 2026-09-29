import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-dG8swyHC.mjs";
import { a as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { g as toDatabaseOptions, l as resolveSqliteReadScope } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { r as inheritSessionCreationPolicy } from "./session-entry-provenance-C-JyMH54.mjs";
import { t as getChannelPlugin } from "./registry-D3wOWFDo.mjs";
import "./plugins-BEpDh--e.mjs";
import { T as resolveSessionStorePathForScope, l as loadSessionEntryReadOnly, u as loadSessionEntryReadOnlyInScope, v as updateSessionLastRoute, y as updateSessionLastRouteInScope } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { o as resolveAgentRoute } from "./resolve-route-zfKT6ZcU.mjs";
import { t as buildOutboundBaseSessionKey } from "./base-session-key-DYnhwAuL.mjs";
import "./inbound.runtime-8-aChnQE.mjs";
//#region src/infra/outbound/outbound-session.ts
function resolveOutboundChannelPlugin(channel) {
	return getChannelPlugin(channel);
}
function rebaseOutboundSessionRoute(route, baseSessionKey) {
	if (route.sessionKey !== route.baseSessionKey && !route.sessionKey.startsWith(`${route.baseSessionKey}:`)) return null;
	return {
		...route,
		sessionKey: `${baseSessionKey}${route.sessionKey.slice(route.baseSessionKey.length)}`,
		baseSessionKey
	};
}
function stripProviderPrefix(raw, channel) {
	const trimmed = raw.trim();
	const lower = normalizeLowercaseStringOrEmpty(trimmed);
	const prefix = `${normalizeLowercaseStringOrEmpty(channel)}:`;
	if (lower.startsWith(prefix)) return trimmed.slice(prefix.length).trim();
	return trimmed;
}
function stripKindPrefix(raw) {
	return raw.replace(/^(user|channel|group|conversation|room|dm|thread):/i, "").trim();
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
function normalizeInferredPeerKind(value) {
	return value === "direct" || value === "group" || value === "channel" ? value : void 0;
}
function inferPeerKindFromPlugin(params) {
	for (const target of params.targets) {
		const inferred = normalizeInferredPeerKind(params.plugin?.messaging?.inferTargetChatType?.({ to: target }));
		if (inferred) return inferred;
	}
}
function inferPeerKindFromFallbackPrefixes(targets) {
	for (const target of targets) for (const fallback of FALLBACK_TARGET_KIND_PREFIXES) if (fallback.pattern.test(target)) return fallback.kind;
}
function inferPeerKindFromCapabilities(plugin) {
	const chatTypes = [];
	for (const chatType of plugin?.capabilities?.chatTypes ?? []) if ((chatType === "direct" || chatType === "group" || chatType === "channel") && !chatTypes.includes(chatType)) chatTypes.push(chatType);
	return chatTypes.length === 1 ? chatTypes[0] : void 0;
}
function inferPeerKind(params) {
	const resolvedKind = params.resolvedTarget?.kind;
	if (resolvedKind === "user") return "direct";
	if (resolvedKind === "channel") return "channel";
	if (resolvedKind === "group") {
		const chatTypes = (params.plugin ?? resolveOutboundChannelPlugin(params.channel))?.capabilities?.chatTypes ?? [];
		const supportsChannel = chatTypes.includes("channel");
		const supportsGroup = chatTypes.includes("group");
		if (supportsChannel && !supportsGroup) return "channel";
		return "group";
	}
	const plugin = params.plugin ?? resolveOutboundChannelPlugin(params.channel);
	const strippedTarget = stripProviderPrefix(params.target, params.channel).trim();
	const targets = uniqueStrings([params.target, strippedTarget].filter(Boolean));
	return inferPeerKindFromPlugin({
		plugin,
		targets
	}) ?? inferPeerKindFromFallbackPrefixes(targets) ?? inferPeerKindFromCapabilities(plugin) ?? "direct";
}
function resolveFallbackSession(params) {
	const trimmed = stripProviderPrefix(params.target, params.channel).trim();
	if (!trimmed) return null;
	const peerKind = inferPeerKind({
		channel: params.channel,
		plugin: params.plugin,
		target: params.target,
		resolvedTarget: params.resolvedTarget
	});
	if (!peerKind) return null;
	const peerId = stripKindPrefix(trimmed);
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
		chatType: peerKind === "direct" ? "direct" : peerKind === "channel" ? "channel" : "group",
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
	const target = stripProviderPrefix(resolvedTarget.to, params.channel).trim();
	const identifier = stripKindPrefix(target);
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
	const resolver = (params.plugin ?? resolveOutboundChannelPlugin(params.channel))?.messaging?.resolveOutboundSessionRoute;
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
