import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-CO5zyEkR.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-CSDERtm3.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { t as getChannelPlugin } from "./registry-B91r5qN6.mjs";
import { o as resolveSessionStorePathForScope } from "./session-store-path-BQkYPc4_.mjs";
import "./plugins-CCVkYF8m.mjs";
import { n as stripOutboundTargetKindPrefix, r as stripTargetProviderPrefix } from "./channel-target-prefix-D9KEia-0.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { c as buildInboundSessionCreationStamp, u as inheritSessionCreationPolicy } from "./session-entry-lineage-B7Mubzwj.mjs";
import { r as mergeSessionEntry } from "./types-BGDhC4_W.mjs";
import { n as resolveSqliteReadScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { s as isNativeSessionEntryRead } from "./session-entry-read-ordered-ygEz3W0N.mjs";
import { o as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import { i as readSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { m as updateSessionLastRouteInScope, p as updateSessionLastRoute, t as applySessionEntryOperation } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { o as resolveAgentRoute } from "./resolve-route-DvaXhzgP.mjs";
import { t as buildOutboundBaseSessionKey } from "./base-session-key-oWJUcWDU.mjs";
import "./inbound.runtime-CT0GZxAH.mjs";
//#region src/infra/outbound/outbound-session.ts
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
	if (resolvedKind === "user" || resolvedKind === "channel") return resolvedKind === "user" ? "direct" : "channel";
	if (resolvedKind === "group") {
		const chatTypes = (params.plugin ?? getChannelPlugin(params.channel))?.capabilities?.chatTypes ?? [];
		return chatTypes.includes("channel") && !chatTypes.includes("group") ? "channel" : "group";
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
	const peerKind = inferPeerKind(params);
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
	if (bindingScope === globalScope) return namedRoute;
	if (namedRoute.sessionKey !== namedRoute.baseSessionKey && !namedRoute.sessionKey.startsWith(`${namedRoute.baseSessionKey}:`)) return null;
	return {
		...namedRoute,
		sessionKey: `${bindingRoute.sessionKey}${namedRoute.sessionKey.slice(namedRoute.baseSessionKey.length)}`,
		baseSessionKey: bindingRoute.sessionKey
	};
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
async function persistOutboundSessionEntry(params, prepared) {
	const storePath = prepared?.destination.storePath ?? resolveSessionStorePathCore(params.cfg.session?.store, { agentId: resolveAgentIdFromSessionKey(params.route.sessionKey) });
	let creation = params.creation;
	if (!creation && params.sourceSessionKey) {
		const sourceScope = prepared?.source;
		const source = sourceScope && !isNativeSessionEntryRead(sourceScope, sourceScope.agentId) ? await withSessionHistoryWorkerDatabase({
			agentId: sourceScope.databaseAgentId,
			path: sourceScope.storePath,
			env: sourceScope.env
		}, async (reader) => (await reader.readExactEntries({
			sessionKeys: [sourceScope.sessionKey],
			projection: "exact",
			snapshotFields: [],
			env: sourceScope.env ?? process.env
		})).entries[0]?.entry) : await readSessionEntryReadOnlyInWorker(sourceScope ?? {
			sessionKey: params.sourceSessionKey,
			storePath: resolveSessionStorePathCore(params.cfg.session?.store, { agentId: resolveAgentIdFromSessionKey(params.sourceSessionKey) })
		});
		if (source?.sandbox === "required") creation = {
			via: source.createdVia ?? "channel",
			...inheritSessionCreationPolicy(source)
		};
	}
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
		SessionCreation: creation
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
		...params.workerGuard ? { workerGuard: params.workerGuard } : {}
	};
	const entry = prepared ? await updateSessionLastRouteInScope({
		...prepared.destination,
		sessionKey: params.route.sessionKey
	}, update) : await updateSessionLastRoute(update);
	if (entry && params.mirrorSessionKey && params.mirrorSessionKey !== params.route.sessionKey) {
		const fallbackEntry = mergeSessionEntry(void 0, {});
		await applySessionEntryOperation({
			sessionKey: params.mirrorSessionKey,
			storePath: resolveSessionStorePathCore(params.cfg.session?.store, { agentId: resolveAgentIdFromSessionKey(params.mirrorSessionKey) })
		}, {
			kind: "ensure-identity",
			sessionId: fallbackEntry.sessionId,
			creation: buildInboundSessionCreationStamp({ SessionCreation: creation })
		}, {
			fallbackEntry,
			preserveActivity: true,
			workerGuard: params.workerGuard ?? {}
		});
	}
	return entry;
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
