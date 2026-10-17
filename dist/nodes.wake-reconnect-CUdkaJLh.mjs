import { F as resolveTimerTimeoutMs } from "./number-coercion-CuVhdCBs.mjs";
import { h as sleep } from "./utils-DgZn2dLu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as awaitWithinDeadline, t as ABSOLUTE_DEADLINE_EXPIRED } from "./absolute-deadline-DoGHpXtD.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { n as clearApnsRegistrationIfCurrent, o as loadApnsRegistration } from "./push-apns-store-BNQPyh4x.mjs";
import { n as sendApnsBackgroundWake, s as shouldClearStoredApnsRegistration, t as sendApnsAlert } from "./push-apns-DWV7vQst.mjs";
import { c as runNodeWakeAttempt, l as runNodeWakeNudgeAttempt, n as NODE_WAKE_RECONNECT_WAIT_MS, o as isNodeWakeLifecycleCurrent, r as captureNodeWakeLifecycle, s as releaseNodeWakeLifecycle, t as NODE_WAKE_RECONNECT_RETRY_WAIT_MS } from "./node-wake-state-CWVR-GCk.mjs";
import { i as isNodePairingGenerationCurrent } from "./device-pairing-node-state-BWkfmloU.mjs";
import { t as resolveNodePushTransport } from "./node-push-transport-bvZFqpXK.mjs";
import { t as nodeInvokePolicy } from "./nodes-policy-fOzIq_sI.mjs";
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
					const transport = await resolveNodePushTransport(registration, opts?.cfg);
					if (!transport.ok) return withDuration({
						available: false,
						throttled: false,
						path: "no-auth",
						apnsReason: transport.error
					});
					if (!await isAttemptCurrent()) return withDuration({
						available: false,
						throttled: false,
						path: "invalidated"
					});
					markWakeAttempted();
					const wakeResult = await sendApnsBackgroundWake({
						...transport.transport,
						nodeId,
						wakeReason: opts?.wakeReason ?? "node.invoke",
						signal: lifecycle,
						isCurrent: isAttemptCurrent
					});
					if (!await isAttemptCurrent()) return withDuration({
						available: false,
						throttled: false,
						path: "invalidated"
					});
					await clearStaleApnsRegistrationIfNeeded(registration, nodeId, wakeResult);
					return withDuration({
						available: true,
						throttled: false,
						path: wakeResult.ok ? "sent" : "send-error",
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
					const transport = await resolveNodePushTransport(registration, opts?.cfg);
					if (!transport.ok) return withDuration({
						sent: false,
						throttled: false,
						reason: "no-auth",
						apnsReason: transport.error
					});
					if (!await isAttemptCurrent()) return withDuration({
						sent: false,
						throttled: false,
						reason: "invalidated"
					});
					const result = await sendApnsAlert({
						...transport.transport,
						nodeId,
						title: "OpenClaw needs a quick reopen",
						body: "Tap to reopen OpenClaw and restore the node connection.",
						signal: lifecycle,
						isCurrent: isAttemptCurrent
					});
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
					return withDuration({
						sent: result.ok,
						throttled: false,
						reason: result.ok ? "sent" : "apns-not-ok",
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
	for (;;) {
		const beforeDeadline = performance.now() < deadline;
		if (params.lifecycle && !isNodeWakeLifecycleCurrent(params.nodeId, params.lifecycle, params.pairingGeneration)) return false;
		if (resolveDispatchableNodeSession(params.pairingGeneration ? params.context.nodeRegistry.getForPairingGeneration(params.nodeId, params.pairingGeneration) : params.context.nodeRegistry.get(params.nodeId))) return true;
		if (!beforeDeadline) return false;
		await sleep(Math.min(pollMs, Math.max(0, deadline - performance.now())));
	}
}
//#endregion
//#region src/gateway/server-methods/nodes.wake-reconnect.ts
/** One wake stage owns its push deadline and bounded reconnect wait; callers retain pairing custody. */
async function wakeNodeForReconnect(params) {
	const { nodeId, context, cfg, generation, lifecycle, force, deadlineAtMs } = params;
	const wake = await awaitWithinDeadline(() => maybeWakeNodeWithApns(nodeId, {
		...force ? { force: true } : {},
		...params.source === "pending" ? { wakeReason: "node.pending" } : {},
		cfg,
		lifecycle,
		generation
	}), deadlineAtMs, () => performance.now());
	if (wake === ABSOLUTE_DEADLINE_EXPIRED) return wake;
	const prefix = params.source === "invoke" ? "node wake" : "node pending wake";
	const stage = force ? 2 : 1;
	context.logGateway.info(`${prefix} stage=wake${stage} node=${nodeId} req=${params.requestId}${force ? " force=true" : ""} available=${wake.available} throttled=${wake.throttled} path=${wake.path} durationMs=${wake.durationMs} apnsStatus=${wake.apnsStatus ?? -1} apnsReason=${wake.apnsReason ?? "-"}`);
	if (deadlineAtMs !== void 0 && performance.now() >= deadlineAtMs) return ABSOLUTE_DEADLINE_EXPIRED;
	if (wake.available) {
		const waitStartedAtMs = Date.now();
		const reconnectWaitMs = force ? NODE_WAKE_RECONNECT_RETRY_WAIT_MS : NODE_WAKE_RECONNECT_WAIT_MS;
		const timeoutMs = deadlineAtMs === void 0 ? reconnectWaitMs : Math.min(reconnectWaitMs, Math.max(0, deadlineAtMs - performance.now()));
		const reconnected = await waitForNodeReconnect({
			nodeId,
			context,
			timeoutMs,
			lifecycle,
			pairingGeneration: generation.key
		});
		const duration = params.source === "invoke" ? ` durationMs=${Math.max(0, Date.now() - waitStartedAtMs)}` : "";
		context.logGateway.info(`${prefix} stage=wait${stage} node=${nodeId} req=${params.requestId} reconnected=${reconnected} timeoutMs=${timeoutMs}${duration}`);
	}
	return wake;
}
//#endregion
export { isNodePairingWorkCurrent as a, waitForNodeReconnect as i, maybeSendNodeWakeNudge as n, resolveDispatchableNodeSession as o, maybeWakeNodeWithApns as r, respondPairingChanged as s, wakeNodeForReconnect as t };
