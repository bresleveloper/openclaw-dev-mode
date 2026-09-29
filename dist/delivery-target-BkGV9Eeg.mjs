import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import "./session-key-CBvmC8zz.mjs";
import { n as normalizeAccountId } from "./account-id-B1bfbA5J.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import "./message-channel-constants-Cd7Eq8Zi.mjs";
import { c as normalizeSessionDeliveryState } from "./delivery-context.shared-CW8dxG7X.mjs";
import "./message-channel-DDcHHhpX.mjs";
import { r as getLoadedChannelPluginForRead } from "./registry-loaded-CYq2sa_C.mjs";
import { r as resolveAgentMainSessionKey } from "./main-session-De-bcoks.mjs";
import { n as foldedSessionKeyAliasCandidates } from "./store-entry-DuM7NmYY.mjs";
import { r as loadExactSessionEntryCandidatesReadOnlyBatch } from "./session-accessor.sqlite-exact-read-Dk6_8wqr.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { r as stripTargetProviderPrefix } from "./channel-target-prefix-BJKXiLk4.mjs";
import { n as extractDeliveryInfoBatch } from "./delivery-info-DQ_vEN9Q.mjs";
import { t as resolveSessionDeliveryTarget } from "./targets-session-C4y3OwUU.mjs";
import { r as isReservedTargetLiteralError } from "./target-errors-BPI2bPFa.mjs";
import { t as resolveCronAgentSessionKey } from "./session-key-Cl5l5Sfo.mjs";
import { t as resolveOutboundTargetWithPlugin } from "./targets-resolve-shared-DC_YXds1.mjs";
import { t as hasExplicitCronDeliveryTarget } from "./delivery-plan-D6XdUIQv.mjs";
//#region src/infra/outbound/targets-loaded.ts
/** Resolves targets through an already-loaded channel plugin without bootstrap discovery. */
function tryResolveLoadedOutboundTarget(params) {
	return resolveOutboundTargetWithPlugin({
		plugin: getLoadedChannelPluginForRead(params.channel),
		target: params
	});
}
//#endregion
//#region src/cron/isolated-agent/delivery-target-context.ts
/** Prepare owned delivery facts synchronously; no database or borrowed view survives the read. */
function readCronDeliveryTargetContexts(cfg, requests) {
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
	const recovered = extractDeliveryInfoBatch(planned.map((item) => item.ok ? item.value.threadSessionKey : void 0), { cfg });
	const targets = planned.flatMap((item, index) => item.ok && !recovered[index]?.deliveryContext ? [{
		index,
		...item.value
	}] : []);
	const rows = loadExactSessionEntryCandidatesReadOnlyBatch(targets.map(({ agentId, storePath, threadSessionKey, mainSessionKey }) => ({
		agentId,
		storePath,
		projection: "list",
		sessionKeys: [threadSessionKey, mainSessionKey].flatMap((key) => key ? [key, ...foldedSessionKeyAliasCandidates(key)].toSorted((left, right) => Buffer.compare(Buffer.from(left), Buffer.from(right))) : [])
	})));
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
		const loaded = tryResolveLoadedOutboundTarget(params);
		if (loaded) return loaded;
		const { resolveOutboundTarget } = await targetsRuntimeLoader.load();
		return resolveOutboundTarget({
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
function shouldStripResolvedTargetProviderPrefix(target) {
	return target.resolutionSource === "normalized";
}
/** Resolves cron delivery config into a concrete channel target and optional thread/account. */
async function resolveDeliveryTarget(cfg, agentId, jobPayload, options) {
	const requestedChannel = typeof jobPayload.channel === "string" ? jobPayload.channel : "last";
	const explicitTo = typeof jobPayload.to === "string" ? jobPayload.to : void 0;
	const allowMismatchedLastTo = requestedChannel === "last";
	const deliveryTargetRuntime = await deliveryTargetRuntimeLoader.load();
	const { mainSessionKey, rawSessionKey, threadSessionKey, main, usedSharedMainFallback } = options?.sessionContext ?? (() => {
		const result = readCronDeliveryTargetContexts(cfg, [{
			agentId,
			sessionKey: jobPayload.sessionKey
		}])[0];
		if (!result.ok) throw result.error;
		return result.value;
	})();
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
		else if (jobPayload.sessionTarget !== "current" || hasExplicitCronDeliveryTarget(jobPayload)) try {
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
	let effectiveAllowFrom;
	if (mode === "implicit") {
		const { getLoadedChannelPluginForRead, mapAllowFromEntries } = deliveryTargetRuntime;
		const channelPlugin = getLoadedChannelPluginForRead(channel);
		const resolvedAccountId = normalizeAccountId(accountId);
		const configuredAllowFromRaw = channelPlugin?.config.resolveAllowFrom?.({
			cfg,
			accountId: resolvedAccountId
		});
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
	if (!rawSessionKey && mode === "implicit" && !explicitTo && usedSharedMainFallback && toCandidate != null && toCandidate === resolved.lastTo) return {
		ok: false,
		channel,
		to: void 0,
		accountId,
		threadId: explicitThreadId,
		mode,
		error: /* @__PURE__ */ new Error("Refusing implicit isolated cron delivery: the target would be inherited from the shared agent-main session bucket's last recipient, which is ambiguous across conversations and can deliver to the wrong room (and replay there after a restart). Set delivery.channel and delivery.to explicitly, or run the cron from a session that carries its own delivery context.")
	};
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
		if (!toCandidate || !isReservedTargetLiteralError(docked.error)) return {
			ok: false,
			channel,
			to: void 0,
			accountId,
			threadId: explicitThreadId,
			mode,
			error: docked.error
		};
	} else toCandidate = docked.to;
	const targetResolution = await deliveryTargetRuntime.resolveChannelTargetForDelivery({
		cfg,
		channel,
		agentId,
		input: toCandidate,
		accountId
	});
	if (!targetResolution.ok) return {
		ok: false,
		channel,
		to: void 0,
		accountId,
		threadId: explicitThreadId,
		mode,
		error: targetResolution.error
	};
	const resolvedTarget = targetResolution.target;
	const routeTargetCandidate = resolvedTarget.source === "directory" ? resolvedTarget.to : preResolvedRouteTargetCandidate ?? toCandidate;
	const selectedTarget = shouldStripResolvedTargetProviderPrefix(resolvedTarget) ? stripSelectedProviderPrefix({
		channel,
		to: resolvedTarget.to
	}) : resolvedTarget.to.trim();
	if (!selectedTarget) return {
		ok: false,
		channel,
		to: void 0,
		accountId,
		threadId: explicitThreadId,
		mode,
		error: /* @__PURE__ */ new Error("Target is required")
	};
	toCandidate = selectedTarget;
	const route = await (async () => {
		try {
			return await deliveryTargetRuntime.resolveOutboundSessionRouteForDelivery({
				cfg,
				channel,
				agentId,
				accountId,
				target: routeTargetCandidate,
				resolvedTarget,
				threadId: explicitThreadId,
				currentSessionKey: threadSessionKey ?? mainSessionKey
			});
		} catch {
			return null;
		}
	})();
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
		if (!routeTo) return {
			ok: false,
			channel,
			to: void 0,
			accountId,
			threadId: explicitThreadId,
			mode,
			error: /* @__PURE__ */ new Error("Target is required")
		};
		toCandidate = routeTo;
	}
	const lastTo = resolved.lastTo;
	const lastRoute = lastTo && resolved.lastChannel === channel ? await (async () => {
		try {
			return await deliveryTargetRuntime.resolveOutboundSessionRouteForDelivery({
				cfg,
				channel,
				agentId,
				accountId: resolved.lastAccountId ?? accountId,
				target: lastTo,
				threadId: resolved.lastThreadId,
				currentSessionKey: threadSessionKey ?? mainSessionKey
			});
		} catch {
			return null;
		}
	})() : null;
	const canUseSessionThread = options?.inheritSessionThread !== false && shouldCarrySessionThread({
		resolved,
		explicitTo,
		route,
		lastRoute
	});
	const threadId = explicitThreadId ?? route?.threadId ?? (canUseSessionThread ? resolved.threadId : void 0);
	return {
		ok: true,
		channel,
		to: toCandidate,
		accountId,
		threadId,
		mode
	};
}
//#endregion
export { requiresExternalCronDelivery as n, resolveDeliveryTarget as r, prepareCronDeliveryTargetContexts as t };
