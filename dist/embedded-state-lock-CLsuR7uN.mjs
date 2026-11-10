import { i as createAbortError } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { setTimeout } from "node:timers/promises";
//#region src/infra/embedded-state-lock.ts
const EMBEDDED_STATE_SIGNALS = ["SIGINT", "SIGTERM"];
/** Bridges process signals into embedded-run cancellation so lock cleanup can unwind. */
function createEmbeddedStateSignalBridge(processLike = process) {
	const controller = new AbortController();
	let receivedSignal;
	const handlers = /* @__PURE__ */ new Map();
	const dispose = () => {
		for (const [signal, handler] of handlers) processLike.off(signal, handler);
		handlers.clear();
	};
	for (const signal of EMBEDDED_STATE_SIGNALS) {
		const handler = () => {
			receivedSignal = signal;
			if (!controller.signal.aborted) {
				controller.abort();
				dispose();
			}
		};
		handlers.set(signal, handler);
		processLike.on(signal, handler);
	}
	return {
		signal: controller.signal,
		getReceivedSignal: () => receivedSignal,
		dispose
	};
}
/** Probe the Gateway owner first, then acquire the shared embedded-writer role. */
async function acquireEmbeddedStateLock(params) {
	const { acquireGatewayLock, GatewayLockError, readActiveGatewayLockIdentity } = await import("./gateway-lock-BLFQD0F1.mjs");
	const env = params.options?.env ?? process.env;
	if (params.options?.allowInTests !== true && (env.VITEST !== void 0 || env.NODE_ENV === "test")) return null;
	const activeGateway = await readActiveGatewayLockIdentity(params.options);
	if (activeGateway) throw new GatewayLockError(params.formatActiveGatewayRefusal(activeGateway));
	try {
		return await acquireGatewayLock({
			...params.options,
			role: "agent-embedded",
			sleep: params.options?.sleep ?? ((ms) => setTimeout(ms, void 0, { signal: params.signal }).catch(() => {
				throw createAbortError("embedded state lock acquisition aborted");
			}))
		});
	} catch (error) {
		if (!(error instanceof GatewayLockError)) throw error;
		const racedGateway = await readActiveGatewayLockIdentity(params.options);
		if (racedGateway) throw new GatewayLockError(params.formatActiveGatewayRefusal(racedGateway), error);
		throw error;
	}
}
//#endregion
export { createEmbeddedStateSignalBridge as n, acquireEmbeddedStateLock as t };
