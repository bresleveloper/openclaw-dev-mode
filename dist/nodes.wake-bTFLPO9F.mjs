import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./io-DuIKUcsW.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { g as resolveApnsRelayConfigFromEnv, n as clearApnsRegistrationIfCurrent, o as loadApnsRegistration } from "./push-apns-store-9CGb-HCs.mjs";
import { c as resolveApnsAuthConfigFromEnv, n as sendApnsBackgroundWake, s as shouldClearStoredApnsRegistration, t as sendApnsAlert } from "./push-apns-DC8TvSr9.mjs";
import { c as runNodeWakeAttempt, l as runNodeWakeNudgeAttempt, n as NODE_WAKE_RECONNECT_WAIT_MS, o as isNodeWakeLifecycleCurrent, r as captureNodeWakeLifecycle, s as releaseNodeWakeLifecycle } from "./node-wake-state-CWVR-GCk.mjs";
import { i as isNodePairingGenerationCurrent } from "./device-pairing-node-state-BxpHZHxS.mjs";
import { t as nodeInvokePolicy } from "./nodes-policy-CTo9Dpfh.mjs";
//#region src/gateway/server-methods/nodes.shared.ts
function respondPairingChanged(respond) {
	respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "node pairing changed while invocation was active", {
		retryable: true,
		details: { code: "PAIRING_CHANGED" }
	}));
}
async function isNodePairingWorkCurrent(params) {
	if (!isNodeWakeLifecycleCurrent(params.nodeId, params.lifecycle, params.generation.key)) return false;
	if (!await isNodePairingGenerationCurrent(params.generation)) return false;
	return isNodeWakeLifecycleCurrent(params.nodeId, params.lifecycle, params.generation.key);
}
async function isNodePushAttemptCurrent(params) {
	return params.generation ? isNodePairingWorkCurrent({
		nodeId: params.nodeId,
		generation: params.generation,
		lifecycle: params.lifecycle
	}) : isNodeWakeLifecycleCurrent(params.nodeId, params.lifecycle);
}
function resolveDispatchableNodeSession(session) {
	return session?.client?.invalidated === true ? void 0 : session;
}
//#endregion
//#region src/gateway/server-methods/nodes.wake.ts
async function resolveDirectNodePushConfig() {
	const auth = await resolveApnsAuthConfigFromEnv(process.env);
	return auth.ok ? {
		ok: true,
		auth: auth.value
	} : {
		ok: false,
		error: auth.error
	};
}
function resolveRelayNodePushConfig(cfg, registration) {
	const relay = resolveApnsRelayConfigFromEnv(process.env, cfg.gateway, { registrationRelayOrigin: registration.relayOrigin });
	return relay.ok ? {
		ok: true,
		relayConfig: relay.value
	} : {
		ok: false,
		error: relay.error
	};
}
async function clearStaleApnsRegistrationIfNeeded(registration, nodeId, params) {
	if (!shouldClearStoredApnsRegistration({
		registration,
		result: params
	})) return;
	await clearApnsRegistrationIfCurrent({
		nodeId,
		registration
	});
}
async function delayMs(ms) {
	await new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}
async function maybeWakeNodeWithApns(nodeId, opts) {
	const lifecycleProvided = opts?.lifecycle !== void 0;
	const pairingGeneration = opts?.generation?.key;
	const lifecycle = opts?.lifecycle ?? captureNodeWakeLifecycle(nodeId, pairingGeneration);
	const isAttemptCurrent = () => isNodePushAttemptCurrent({
		nodeId,
		lifecycle,
		generation: opts?.generation
	});
	try {
		if (!await isAttemptCurrent()) return {
			available: false,
			throttled: false,
			path: "invalidated",
			durationMs: 0
		};
		const result = await runNodeWakeAttempt({
			nodeId,
			pairingGeneration,
			force: opts?.force === true,
			throttleMs: nodeInvokePolicy.wakeThrottleMs,
			attempt: async (markAttempted) => {
				const startedAtMs = performance.now();
				let attempted = false;
				const withDuration = (attempt) => ({
					...attempt,
					durationMs: Math.round(performance.now() - startedAtMs)
				});
				const markWakeAttempted = () => {
					attempted = true;
					markAttempted();
				};
				try {
					if (!await isAttemptCurrent()) return withDuration({
						available: false,
						throttled: false,
						path: "invalidated"
					});
					const registration = await loadApnsRegistration(nodeId);
					if (!await isAttemptCurrent()) return withDuration({
						available: false,
						throttled: false,
						path: "invalidated"
					});
					if (!registration) return withDuration({
						available: false,
						throttled: false,
						path: "no-registration"
					});
					let wakeResult;
					if (registration.transport === "relay") {
						const relay = resolveRelayNodePushConfig(opts?.cfg ?? getRuntimeConfig(), registration);
						if (!relay.ok) return withDuration({
							available: false,
							throttled: false,
							path: "no-auth",
							apnsReason: relay.error
						});
						if (!await isAttemptCurrent()) return withDuration({
							available: false,
							throttled: false,
							path: "invalidated"
						});
						markWakeAttempted();
						wakeResult = await sendApnsBackgroundWake({
							registration,
							nodeId,
							wakeReason: opts?.wakeReason ?? "node.invoke",
							relayConfig: relay.relayConfig,
							signal: lifecycle,
							isCurrent: isAttemptCurrent
						});
					} else {
						const auth = await resolveDirectNodePushConfig();
						if (!auth.ok) return withDuration({
							available: false,
							throttled: false,
							path: "no-auth",
							apnsReason: auth.error
						});
						if (!await isAttemptCurrent()) return withDuration({
							available: false,
							throttled: false,
							path: "invalidated"
						});
						markWakeAttempted();
						wakeResult = await sendApnsBackgroundWake({
							registration,
							nodeId,
							wakeReason: opts?.wakeReason ?? "node.invoke",
							auth: auth.auth,
							signal: lifecycle,
							isCurrent: isAttemptCurrent
						});
					}
					if (!await isAttemptCurrent()) return withDuration({
						available: false,
						throttled: false,
						path: "invalidated"
					});
					await clearStaleApnsRegistrationIfNeeded(registration, nodeId, wakeResult);
					if (!wakeResult.ok) return withDuration({
						available: true,
						throttled: false,
						path: "send-error",
						apnsStatus: wakeResult.status,
						apnsReason: wakeResult.reason
					});
					return withDuration({
						available: true,
						throttled: false,
						path: "sent",
						apnsStatus: wakeResult.status,
						apnsReason: wakeResult.reason
					});
				} catch (err) {
					if (!await isAttemptCurrent()) return withDuration({
						available: false,
						throttled: false,
						path: "invalidated"
					});
					return withDuration({
						available: attempted,
						throttled: false,
						path: "send-error",
						apnsReason: formatErrorMessage(err)
					});
				}
			}
		});
		return await isAttemptCurrent() ? result : {
			available: false,
			throttled: false,
			path: "invalidated",
			durationMs: 0
		};
	} finally {
		if (!lifecycleProvided) releaseNodeWakeLifecycle(nodeId, lifecycle);
	}
}
async function maybeSendNodeWakeNudge(nodeId, opts) {
	const startedAtMs = performance.now();
	const withDuration = (attempt) => ({
		...attempt,
		durationMs: Math.round(performance.now() - startedAtMs)
	});
	const lifecycleProvided = opts?.lifecycle !== void 0;
	const pairingGeneration = opts?.generation?.key;
	const lifecycle = opts?.lifecycle ?? captureNodeWakeLifecycle(nodeId, pairingGeneration);
	const isAttemptCurrent = () => isNodePushAttemptCurrent({
		nodeId,
		lifecycle,
		generation: opts?.generation
	});
	try {
		if (!await isAttemptCurrent()) return withDuration({
			sent: false,
			throttled: false,
			reason: "invalidated"
		});
		return await runNodeWakeNudgeAttempt({
			nodeId,
			pairingGeneration,
			throttleMs: nodeInvokePolicy.wakeNudgeThrottleMs,
			throttled: () => withDuration({
				sent: false,
				throttled: true,
				reason: "throttled"
			}),
			attempt: async () => {
				const registration = await loadApnsRegistration(nodeId);
				if (!await isAttemptCurrent()) return withDuration({
					sent: false,
					throttled: false,
					reason: "invalidated"
				});
				if (!registration) return withDuration({
					sent: false,
					throttled: false,
					reason: "no-registration"
				});
				try {
					let result;
					if (registration.transport === "relay") {
						const relay = resolveRelayNodePushConfig(opts?.cfg ?? getRuntimeConfig(), registration);
						if (!relay.ok) return withDuration({
							sent: false,
							throttled: false,
							reason: "no-auth",
							apnsReason: relay.error
						});
						if (!await isAttemptCurrent()) return withDuration({
							sent: false,
							throttled: false,
							reason: "invalidated"
						});
						result = await sendApnsAlert({
							registration,
							nodeId,
							title: "OpenClaw needs a quick reopen",
							body: "Tap to reopen OpenClaw and restore the node connection.",
							relayConfig: relay.relayConfig,
							signal: lifecycle,
							isCurrent: isAttemptCurrent
						});
					} else {
						const auth = await resolveDirectNodePushConfig();
						if (!auth.ok) return withDuration({
							sent: false,
							throttled: false,
							reason: "no-auth",
							apnsReason: auth.error
						});
						if (!await isAttemptCurrent()) return withDuration({
							sent: false,
							throttled: false,
							reason: "invalidated"
						});
						result = await sendApnsAlert({
							registration,
							nodeId,
							title: "OpenClaw needs a quick reopen",
							body: "Tap to reopen OpenClaw and restore the node connection.",
							auth: auth.auth,
							signal: lifecycle,
							isCurrent: isAttemptCurrent
						});
					}
					if (!await isAttemptCurrent()) return withDuration({
						sent: result.ok,
						throttled: false,
						reason: "invalidated"
					});
					await clearStaleApnsRegistrationIfNeeded(registration, nodeId, result);
					if (!await isAttemptCurrent()) return withDuration({
						sent: result.ok,
						throttled: false,
						reason: "invalidated"
					});
					return result.ok ? withDuration({
						sent: true,
						throttled: false,
						reason: "sent",
						apnsStatus: result.status,
						apnsReason: result.reason
					}) : withDuration({
						sent: false,
						throttled: false,
						reason: "apns-not-ok",
						apnsStatus: result.status,
						apnsReason: result.reason
					});
				} catch (err) {
					if (!await isAttemptCurrent()) return withDuration({
						sent: false,
						throttled: false,
						reason: "invalidated"
					});
					return withDuration({
						sent: false,
						throttled: false,
						reason: "send-error",
						apnsReason: formatErrorMessage(err)
					});
				}
			}
		});
	} finally {
		if (!lifecycleProvided) releaseNodeWakeLifecycle(nodeId, lifecycle);
	}
}
async function waitForNodeReconnect(params) {
	const timeoutMs = resolveTimerTimeoutMs(params.timeoutMs, NODE_WAKE_RECONNECT_WAIT_MS, 1);
	const pollMs = resolveTimerTimeoutMs(params.pollMs, 150, 50);
	const deadline = performance.now() + timeoutMs;
	while (performance.now() < deadline) {
		if (params.lifecycle && !isNodeWakeLifecycleCurrent(params.nodeId, params.lifecycle, params.pairingGeneration)) return false;
		if (resolveDispatchableNodeSession(params.pairingGeneration ? params.context.nodeRegistry.getForPairingGeneration(params.nodeId, params.pairingGeneration) : params.context.nodeRegistry.get(params.nodeId))) return true;
		await delayMs(Math.min(pollMs, Math.max(0, deadline - performance.now())));
	}
	if (params.lifecycle && !isNodeWakeLifecycleCurrent(params.nodeId, params.lifecycle, params.pairingGeneration)) return false;
	const session = params.pairingGeneration ? params.context.nodeRegistry.getForPairingGeneration(params.nodeId, params.pairingGeneration) : params.context.nodeRegistry.get(params.nodeId);
	return Boolean(resolveDispatchableNodeSession(session));
}
//#endregion
export { resolveDispatchableNodeSession as a, isNodePairingWorkCurrent as i, maybeWakeNodeWithApns as n, respondPairingChanged as o, waitForNodeReconnect as r, maybeSendNodeWakeNudge as t };
