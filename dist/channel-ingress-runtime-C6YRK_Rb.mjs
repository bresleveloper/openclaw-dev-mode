import { i as pluginInstanceInvocation } from "./plugin-instance-invocation-CGmhv_zp.mjs";
import "./session-key-CBvmC8zz.mjs";
import { n as normalizeAccountId } from "./account-id-B1bfbA5J.mjs";
import { i as getPluginValueInstance, n as getPluginInstanceOwner } from "./plugin-instance-scope-C9hxyH_A.mjs";
import { c as getPluginRecordRegistry } from "./registry-lifecycle-xdpzLZzd.mjs";
import { r as resolveChannelAccountEntry } from "./account-lookup-CVHGcV8B.mjs";
import { i as resolveStableChannelIngressPolicy, r as resolveChannelIngressPolicy, t as createChannelIngressPolicyResolver } from "./runtime-DRt6NcU3.mjs";
import "./store-allow-from-CInyZmjP.mjs";
import { n as createChannelIngressMonitor } from "./ingress-monitor-CbbL0sxM.mjs";
//#region src/config/implicit-mentions.ts
const SHIPPED_IMPLICIT_MENTION_DEFAULTS = {
	replyToBot: true,
	quotedBot: true,
	threadParticipation: true
};
/** Resolves each implicit-mention kind using account, channel, defaults, then shipped behavior. */
function resolveChannelImplicitMentions(params) {
	const channelConfig = params.cfg.channels?.[params.channel];
	const accountConfig = resolveChannelAccountEntry(channelConfig?.accounts, normalizeAccountId(params.accountId), params.channel);
	const defaults = params.cfg.channels?.defaults?.implicitMentions;
	return {
		replyToBot: accountConfig?.implicitMentions?.replyToBot ?? channelConfig?.implicitMentions?.replyToBot ?? defaults?.replyToBot ?? SHIPPED_IMPLICIT_MENTION_DEFAULTS.replyToBot,
		quotedBot: accountConfig?.implicitMentions?.quotedBot ?? channelConfig?.implicitMentions?.quotedBot ?? defaults?.quotedBot ?? SHIPPED_IMPLICIT_MENTION_DEFAULTS.quotedBot,
		threadParticipation: accountConfig?.implicitMentions?.threadParticipation ?? channelConfig?.implicitMentions?.threadParticipation ?? defaults?.threadParticipation ?? SHIPPED_IMPLICIT_MENTION_DEFAULTS.threadParticipation
	};
}
//#endregion
//#region src/plugin-sdk/channel-ingress-runtime.ts
/**
* High-level runtime resolver for inbound channel access decisions.
*
* New receive paths use runtime.channel.inbound.ingress. This subpath retains
* released resolver adapters alongside identity, policy, and monitor helpers.
*/
function currentIngressInstance() {
	const instance = pluginInstanceInvocation.getStore()?.instance;
	const owner = instance && getPluginInstanceOwner(instance);
	return owner?.instance?.hasActiveCall && owner.instance === instance && !owner.revoked ? owner.instance : void 0;
}
function registeredIngress(instance, channelId) {
	const owner = instance?.owner;
	if (!instance?.hasActiveCall || instance.lifecycle.signal.aborted || !owner || owner.revoked) return;
	const registration = getPluginRecordRegistry(owner.registry, owner.record).channels.find((entry) => entry.pluginId === owner.record.id && entry.plugin.id === channelId.trim() && getPluginValueInstance(entry.plugin) === instance);
	return registration?.captureReadAuthority?.()?.() ? registration.resolveChannelRuntime?.().inbound.ingress : void 0;
}
/** Retain the creating instance when adapting a released reusable resolver. */
function createChannelIngressResolver(base) {
	const instance = currentIngressInstance();
	const policy = createChannelIngressPolicyResolver(base);
	const resolve = () => registeredIngress(instance, base.channelId)?.createResolver(base) ?? policy;
	return {
		message: (params) => resolve().message(params),
		command: (params) => resolve().command(params),
		event: (params) => resolve().event(params)
	};
}
/** Preserve the released helper's trusted attribution within its managed callback. */
async function resolveChannelMessageIngress(params) {
	const ingress = registeredIngress(currentIngressInstance(), params.channelId);
	return await (ingress ? ingress.resolve(params) : resolveChannelIngressPolicy(params));
}
/** Preserve the released stable-identity helper through the same ingress owner. */
async function resolveStableChannelMessageIngress(params) {
	const ingress = registeredIngress(currentIngressInstance(), params.channelId);
	return await (ingress ? ingress.resolveStable(params) : resolveStableChannelIngressPolicy(params));
}
/** Version-1 raw events, 500 ms polling, eight deliveries, and standard retention. */
function createStandardRawEventIngressMonitor(options) {
	const { classifyAdmissionError, createStoppedError, drain, payload, pollIntervalMs, ...base } = options;
	const stoppedError = createStoppedError ?? (() => /* @__PURE__ */ new Error("Channel ingress monitor is stopped."));
	const monitor = createChannelIngressMonitor({
		...base,
		inspect: options.inspect,
		payload: {
			...payload,
			storage: "raw-event",
			version: 1
		},
		pollIntervalMs: pollIntervalMs ?? 500,
		retention: "standard",
		drain: {
			...drain,
			startLimit: 8
		},
		admissionMode: "while-running",
		createStoppedError: stoppedError
	});
	return {
		receive: async (raw) => {
			if (!monitor.isRunning()) throw stoppedError();
			let facts;
			try {
				facts = options.inspect(raw);
			} catch (error) {
				const message = classifyAdmissionError(error);
				if (message === void 0) throw error;
				return {
					kind: "invalid",
					message
				};
			}
			if (!facts) return { kind: "ignored" };
			await monitor.admit(raw, { facts });
			return { kind: "durable" };
		},
		start: monitor.start,
		stop: monitor.stop,
		waitForIdle: monitor.waitForIdle
	};
}
/** Fan one logical inbound turn's ownership lifecycle across its durable claims. */
function fanInChannelIngressLifecycles(inputs) {
	const lifecycles = inputs.filter((lifecycle) => lifecycle !== void 0);
	const first = lifecycles[0];
	if (!first) return {
		lifecycle: void 0,
		settle: async () => {},
		abandon: async () => {},
		cancel: async () => {}
	};
	let handedOff = false;
	let settledAll = false;
	const settleOnce = async (run) => {
		if (settledAll) return;
		settledAll = true;
		await run();
	};
	const fanOut = async (invoke, targets = lifecycles) => {
		await Promise.all(targets.map(async (lifecycle) => await invoke(lifecycle)));
	};
	const abandonAll = () => settleOnce(() => fanOut((lifecycle) => lifecycle.onAbandoned()));
	const failEach = (targets, error) => fanOut((lifecycle) => lifecycle.onFailed ? lifecycle.onFailed(error) : lifecycle.onAbandoned(), targets);
	const failAll = (error) => settleOnce(() => failEach(lifecycles, error));
	const adoptAll = async () => {
		for (const [index, lifecycle] of lifecycles.entries()) try {
			await lifecycle.onAdopted();
		} catch (error) {
			await Promise.allSettled([settleOnce(() => failEach(lifecycles.slice(index), error))]);
			throw error;
		}
	};
	const supportsCancellation = lifecycles.every((lifecycle) => lifecycle.onCancelled !== void 0);
	const deferredHeartbeatIntervals = lifecycles.map((lifecycle) => lifecycle.deferredHeartbeatIntervalMs).filter((interval) => interval !== void 0 && Number.isFinite(interval) && interval > 0);
	const cancelAll = () => settleOnce(() => fanOut((lifecycle) => lifecycle.onCancelled ? lifecycle.onCancelled() : lifecycle.onAbandoned()));
	return {
		lifecycle: {
			abortSignal: lifecycles.length === 1 ? first.abortSignal : AbortSignal.any(lifecycles.map((lifecycle) => lifecycle.abortSignal)),
			onAdopted: async () => {
				handedOff = true;
				await adoptAll();
			},
			onDeferred: () => {
				handedOff = true;
				for (const lifecycle of lifecycles) lifecycle.onDeferred();
			},
			onDeferredHeartbeat: () => {
				for (const lifecycle of lifecycles) lifecycle.onDeferredHeartbeat?.();
			},
			...deferredHeartbeatIntervals.length > 0 ? { deferredHeartbeatIntervalMs: Math.min(...deferredHeartbeatIntervals) } : {},
			onAdoptionFinalizing: () => {
				for (const lifecycle of lifecycles) lifecycle.onAdoptionFinalizing();
			},
			onFailed: async (error) => {
				handedOff = true;
				await failAll(error);
			},
			...supportsCancellation ? { onCancelled: async () => {
				handedOff = true;
				await cancelAll();
			} } : {},
			onAbandoned: async () => {
				handedOff = true;
				await abandonAll();
			}
		},
		settle: async () => {
			if (!handedOff) {
				handedOff = true;
				await adoptAll();
			}
		},
		abandon: async (error) => {
			if (!handedOff) {
				handedOff = true;
				await (error === void 0 ? abandonAll() : failAll(error));
			}
		},
		cancel: async () => {
			if (!handedOff) {
				handedOff = true;
				await cancelAll();
			}
		}
	};
}
//#endregion
export { resolveStableChannelMessageIngress as a, resolveChannelMessageIngress as i, createStandardRawEventIngressMonitor as n, resolveChannelImplicitMentions as o, fanInChannelIngressLifecycles as r, createChannelIngressResolver as t };
