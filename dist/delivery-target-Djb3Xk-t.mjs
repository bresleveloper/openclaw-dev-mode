import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { n as normalizeAccountId } from "./account-id-ifCOO7_9.mjs";
import { i as getLoadedChannelPluginForRead } from "./registry-loaded-B-WQB-l0.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import "./message-channel-constants-B3vfipkP.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { l as normalizeSessionDeliveryState } from "./delivery-context.shared-I8-iaaj1.mjs";
import { r as resolveAgentMainSessionKey } from "./main-session-CHYPkxYr.mjs";
import { n as stripOutboundTargetKindPrefix, r as stripTargetProviderPrefix } from "./channel-target-prefix-D9KEia-0.mjs";
import { n as foldedSessionKeyAliasCandidates } from "./store-entry-CUxN9KZj.mjs";
import { n as readSessionEntriesFromStoreInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { n as extractDeliveryInfoBatch } from "./delivery-info-BlWXIzDQ.mjs";
import { i as resolveChannelAllowFrom } from "./account-resolution-akTcFkRf.mjs";
import { t as resolveCronAgentSessionKey } from "./session-key-CWEGpfa5.mjs";
import { r as isReservedTargetLiteralError } from "./target-errors-MHPko63s.mjs";
import { t as resolveOutboundTargetWithPlugin } from "./targets-resolve-shared-zsZ_U_FD.mjs";
import { t as resolveSessionDeliveryTarget } from "./targets-session-Cc-Q1k0G.mjs";
import { n as hasExplicitCronDeliveryTarget } from "./delivery-target-validation-DmeSlZGT.mjs";
//#region src/infra/outbound/targets-loaded.ts
/** Resolves targets through an already-loaded channel plugin without bootstrap discovery. */
async function tryResolveLoadedOutboundTarget(params) {
	return resolveOutboundTargetWithPlugin({
		plugin: getLoadedChannelPluginForRead(params.channel),
		target: params
	});
}
//#endregion
//#region src/cron/isolated-agent/delivery-route-session-key.ts
/** Only a matching conversation may supply provider-specific routing context. */
function selectCronRouteCurrentSessionKey(sessionKey, agentId, deliveryProvider, deliveryTarget) {
	const parsed = parseAgentSessionKey(sessionKey);
	if (!parsed || parsed.agentId !== agentId) return;
	const conversation = /^([^:]+):(direct|group|channel):([^:]+)(?::(?:thread|topic):.+)?$/i.exec(parsed.rest);
	const peerId = stripOutboundTargetKindPrefix(stripTargetProviderPrefix(deliveryTarget, deliveryProvider));
	return conversation?.[1]?.toLowerCase() === deliveryProvider.toLowerCase() && conversation[3] === peerId ? sessionKey : void 0;
}
//#endregion
//#region src/cron/isolated-agent/delivery-target-context.ts
/** Prepare owned delivery facts through the session worker; no borrowed view survives the read. */
async function readCronDeliveryTargetContexts(cfg, requests) {
	const planned = requests.map(({ agentId, sessionKey }) => {
		try {
			const rawSessionKey = sessionKey?.trim();
			return ok({
				agentId,
				rawSessionKey,
				mainSessionKey: resolveAgentMainSessionKey({
					cfg,
					agentId
				}),
				storePath: resolveSessionStorePathCore(cfg.session?.store, { agentId }),
				threadSessionKey: rawSessionKey ? resolveCronAgentSessionKey({
					sessionKey: rawSessionKey,
					agentId,
					mainKey: cfg.session?.mainKey,
					cfg
				}) : void 0
			});
		} catch (error) {
			return err(error);
		}
	});
	const recovered = await extractDeliveryInfoBatch(planned.map((item) => item.ok ? item.value.threadSessionKey : void 0), { cfg });
	const targets = [];
	for (const [index, item] of planned.entries()) if (item.ok && !recovered[index]?.deliveryContext) targets.push({
		index,
		plan: item.value
	});
	const rows = await Promise.all(targets.map(async ({ plan: { agentId, storePath, threadSessionKey, mainSessionKey } }) => {
		try {
			const result = await readSessionEntriesFromStoreInWorker({
				agentId,
				storePath,
				projection: "list",
				snapshotFields: [],
				sessionKeys: [threadSessionKey, mainSessionKey].flatMap((key) => key ? [key].concat(foldedSessionKeyAliasCandidates(key)) : [])
			});
			return ok(result.entries);
		} catch (error) {
			return err(error);
		}
	}));
	const entries = new Map(targets.map(({ index }, offset) => [index, rows[offset]]));
	return planned.map((item, index) => {
		if (!item.ok) return item;
		const { mainSessionKey, rawSessionKey, threadSessionKey } = item.value;
		const recoveredInfo = recovered[index];
		const recoveredContext = recoveredInfo?.deliveryContext;
		const context = recoveredContext && recoveredInfo?.threadId ? {
			...recoveredContext,
			threadId: recoveredInfo.threadId
		} : recoveredContext;
		const result = entries.get(index);
		if (result && !result.ok) return result;
		const threadEntry = result?.value.find((row) => row.sessionKey === threadSessionKey)?.entry;
		const mainEntry = result?.value.find((row) => row.sessionKey === mainSessionKey)?.entry;
		const selected = threadEntry ?? mainEntry;
		return ok({
			mainSessionKey,
			rawSessionKey,
			threadSessionKey,
			main: context || selected ? {
				sessionId: context ? threadSessionKey ?? mainSessionKey : selected.sessionId,
				updatedAt: context ? 0 : selected.updatedAt,
				delivery: context ? normalizeSessionDeliveryState({ context }) : structuredClone(selected?.delivery)
			} : void 0,
			usedSharedMainFallback: !context && !threadEntry && mainEntry !== void 0
		});
	});
}
//#endregion
//#region src/cron/isolated-agent/delivery-target.ts
/** Resolves isolated cron delivery requests into concrete outbound targets. */
function requiresExternalCronDelivery(plan, resolution) {
	return hasExplicitCronDeliveryTarget(plan) || resolution.channel !== void 0 && resolution.channel !== "webchat";
}
const targetsRuntimeLoader = createLazyImportLoader(() => import("./targets.runtime.js"));
async function resolveOutboundTargetWithRuntime(params) {
	try {
		const loaded = await tryResolveLoadedOutboundTarget(params);
		if (loaded) return loaded;
		const { resolveOutboundTarget } = await targetsRuntimeLoader.load();
		return await resolveOutboundTarget({
			...params,
			allowBootstrap: true
		});
	} catch (err) {
		return {
			ok: false,
			error: /* @__PURE__ */ new Error(`Invalid delivery target: ${formatErrorMessage(err)}`)
		};
	}
}
const channelSelectionRuntimeLoader = createLazyImportLoader(() => import("./channel-selection.runtime.js"));
const deliveryTargetRuntimeLoader = createLazyImportLoader(() => import("./delivery-target.runtime.js"));
const sessionGenerationRuntimeLoader = createLazyImportLoader(() => import("./session-delivery-generation-CvdW_1dk.mjs"));
/** Read one preview batch after runtime loading, then release all source read ownership. */
async function prepareCronDeliveryTargetContexts(cfg, requests) {
	if (requests.length === 0) return [];
	await deliveryTargetRuntimeLoader.load();
	return readCronDeliveryTargetContexts(cfg, requests);
}
function isNonEmptyThreadId(value) {
	return value != null && value !== "";
}
function routesSharePeer(left, right) {
	return Boolean(left && right && left.baseSessionKey === right.baseSessionKey && left.peer.kind === right.peer.kind && left.peer.id === right.peer.id);
}
function shouldCarrySessionThread(params) {
	if (!isNonEmptyThreadId(params.resolved.threadId)) return false;
	if (!params.explicitTo) return params.resolved.channel === params.resolved.lastChannel && params.resolved.to === params.resolved.lastTo;
	return routesSharePeer(params.route, params.lastRoute);
}
function stripSelectedProviderPrefix(params) {
	const trimmed = params.to?.trim();
	if (!trimmed) return;
	return stripTargetProviderPrefix(trimmed, params.channel).trim() || void 0;
}
/** Resolves cron delivery config into a concrete channel target and optional thread/account. */
async function resolveDeliveryTarget(cfg, agentId, jobPayload, options) {
	const requestedChannel = typeof jobPayload.channel === "string" ? jobPayload.channel : "last";
	const explicitTo = typeof jobPayload.to === "string" ? jobPayload.to : void 0;
	const allowMismatchedLastTo = requestedChannel === "last";
	const deliveryTargetRuntime = await deliveryTargetRuntimeLoader.load();
	const source = jobPayload.sourceConversation;
	if (source && !hasExplicitCronDeliveryTarget(jobPayload)) try {
		const { prepareSessionGenerationFacts } = await sessionGenerationRuntimeLoader.load();
		const generation = await prepareSessionGenerationFacts({
			agentId,
			storePath: resolveSessionStorePathCore(cfg.session?.store, { agentId }),
			...source,
			lifecycleRevision: source.lifecycleRevision ?? null
		});
		try {
			generation.assertCurrent();
		} finally {
			generation.release();
		}
	} catch (error) {
		return {
			ok: false,
			mode: "implicit",
			sourceConversationUnavailable: true,
			error: /* @__PURE__ */ new Error(`Creating conversation unavailable: ${formatErrorMessage(error)}`)
		};
	}
	const sessionContext = options?.sessionContext ?? await (async () => {
		const result = (await readCronDeliveryTargetContexts(cfg, [{
			agentId,
			sessionKey: jobPayload.sessionKey
		}]))[0];
		if (!result.ok) throw result.error;
		return result.value;
	})();
	const { rawSessionKey, usedSharedMainFallback } = sessionContext;
	const hasConversationCompletion = jobPayload.sessionTarget === "current" || jobPayload.sourceConversation !== void 0;
	const main = hasConversationCompletion && usedSharedMainFallback ? void 0 : sessionContext.main;
	const preliminary = resolveSessionDeliveryTarget({
		entry: main,
		requestedChannel,
		explicitTo,
		explicitThreadId: jobPayload.threadId,
		allowMismatchedLastTo
	});
	let fallbackChannel;
	let channelResolutionError;
	if (!preliminary.channel) {
		if (preliminary.lastChannel) fallbackChannel = preliminary.lastChannel;
		else if (!hasConversationCompletion || hasExplicitCronDeliveryTarget(jobPayload)) try {
			const { resolveMessageChannelSelection } = await channelSelectionRuntimeLoader.load();
			fallbackChannel = (await resolveMessageChannelSelection({ cfg })).channel;
		} catch (err) {
			const detail = formatErrorMessage(err);
			channelResolutionError = /* @__PURE__ */ new Error(`${detail} Set delivery.channel explicitly or use a main session with a previous channel.`);
		}
	}
	const resolved = fallbackChannel ? resolveSessionDeliveryTarget({
		entry: main,
		requestedChannel,
		explicitTo,
		explicitThreadId: jobPayload.threadId,
		fallbackChannel,
		allowMismatchedLastTo,
		mode: preliminary.mode
	}) : preliminary;
	const channel = resolved.channel ?? fallbackChannel;
	const mode = resolved.mode;
	let toCandidate = resolved.to;
	let accountId = (typeof jobPayload.accountId === "string" ? jobPayload.accountId.trim() || void 0 : void 0) ?? resolved.accountId;
	if (!accountId && channel) accountId = deliveryTargetRuntime.resolveFirstBoundAccountId({
		cfg,
		channelId: channel,
		agentId
	}) ?? deliveryTargetRuntime.resolveChannelDefaultAccountIdForDelivery({
		cfg,
		channel,
		agentId
	});
	if (!channel) return {
		ok: false,
		channel: void 0,
		to: void 0,
		accountId,
		threadId: void 0,
		mode,
		error: channelResolutionError ?? /* @__PURE__ */ new Error("Channel is required when delivery.channel=last has no previous channel.")
	};
	const explicitThreadId = isNonEmptyThreadId(jobPayload.threadId) ? jobPayload.threadId : void 0;
	const failTarget = (error) => ({
		ok: false,
		channel,
		to: void 0,
		accountId,
		threadId: explicitThreadId,
		mode,
		error
	});
	let effectiveAllowFrom;
	if (mode === "implicit") {
		const { getLoadedChannelPluginForRead, mapAllowFromEntries } = deliveryTargetRuntime;
		const channelPlugin = getLoadedChannelPluginForRead(channel);
		const resolvedAccountId = normalizeAccountId(accountId);
		const configuredAllowFromRaw = channelPlugin ? await resolveChannelAllowFrom({
			plugin: channelPlugin,
			cfg,
			accountId: resolvedAccountId
		}) : void 0;
		const configuredAllowFrom = configuredAllowFromRaw ? mapAllowFromEntries(configuredAllowFromRaw) : [];
		const allowFromOverride = uniqueStrings(configuredAllowFrom);
		effectiveAllowFrom = allowFromOverride;
		if (toCandidate && allowFromOverride.length > 0) {
			if (!(await resolveOutboundTargetWithRuntime({
				channel,
				to: toCandidate,
				cfg,
				accountId,
				mode,
				allowFrom: effectiveAllowFrom
			})).ok) toCandidate = allowFromOverride[0];
		}
	}
	if (!rawSessionKey && mode === "implicit" && !explicitTo && usedSharedMainFallback && toCandidate != null && toCandidate === resolved.lastTo) return failTarget(/* @__PURE__ */ new Error("Refusing implicit isolated cron delivery: the target would be inherited from the shared agent-main session bucket's last recipient, which is ambiguous across conversations and can deliver to the wrong room (and replay there after a restart). Set delivery.channel and delivery.to explicitly, or run the cron from a session that carries its own delivery context."));
	const preResolvedRouteTargetCandidate = toCandidate;
	const docked = await resolveOutboundTargetWithRuntime({
		channel,
		to: toCandidate,
		cfg,
		accountId,
		mode,
		allowFrom: effectiveAllowFrom
	});
	if (!docked.ok) {
		if (!toCandidate || !isReservedTargetLiteralError(docked.error)) return failTarget(docked.error);
	} else toCandidate = docked.to;
	const targetResolution = await deliveryTargetRuntime.resolveChannelTargetForDelivery({
		cfg,
		channel,
		agentId,
		input: toCandidate,
		accountId
	});
	if (!targetResolution.ok) return failTarget(targetResolution.error);
	const resolvedTarget = targetResolution.target;
	const routeTargetCandidate = resolvedTarget.source === "directory" ? resolvedTarget.to : preResolvedRouteTargetCandidate ?? toCandidate;
	const selectedTarget = resolvedTarget.resolutionSource === "normalized" ? stripSelectedProviderPrefix({
		channel,
		to: resolvedTarget.to
	}) : resolvedTarget.to.trim();
	if (!selectedTarget) return failTarget(/* @__PURE__ */ new Error("Target is required"));
	toCandidate = selectedTarget;
	const resolveRoute = async (targetParams) => {
		try {
			return await deliveryTargetRuntime.resolveOutboundSessionRouteForDelivery({
				cfg,
				channel,
				agentId,
				...targetParams,
				currentSessionKey: selectCronRouteCurrentSessionKey(rawSessionKey, agentId, channel, targetParams.target)
			});
		} catch {
			return null;
		}
	};
	const route = await resolveRoute({
		accountId,
		target: routeTargetCandidate,
		resolvedTarget,
		threadId: explicitThreadId
	});
	const routeCanCanonicalizeTarget = deliveryTargetRuntime.channelCanResolveOutboundSessionRoute({
		cfg,
		channel,
		agentId
	});
	const routeShouldCanonicalizeTarget = route && (route.threadId !== void 0 || route.to !== routeTargetCandidate);
	if (route && routeCanCanonicalizeTarget && routeShouldCanonicalizeTarget) {
		const routeTo = stripSelectedProviderPrefix({
			channel,
			to: route.to
		});
		if (!routeTo) return failTarget(/* @__PURE__ */ new Error("Target is required"));
		toCandidate = routeTo;
	}
	const lastTo = resolved.lastTo;
	const lastRoute = lastTo && resolved.lastChannel === channel ? await resolveRoute({
		accountId: resolved.lastAccountId ?? accountId,
		target: lastTo,
		threadId: resolved.lastThreadId
	}) : null;
	const canUseSessionThread = options?.inheritSessionThread !== false && shouldCarrySessionThread({
		resolved,
		explicitTo,
		route,
		lastRoute
	});
	const threadId = explicitThreadId ?? route?.threadId ?? (canUseSessionThread ? resolved.threadId : void 0);
	const sessionRoute = route && route.threadId === threadId ? route : await resolveRoute({
		accountId,
		target: toCandidate,
		resolvedTarget,
		threadId
	});
	return {
		ok: true,
		channel,
		to: toCandidate,
		accountId,
		threadId,
		mode,
		...sessionRoute ? { sessionRoute } : {}
	};
}
//#endregion
export { requiresExternalCronDelivery as n, resolveDeliveryTarget as r, prepareCronDeliveryTargetContexts as t };
