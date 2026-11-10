import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as sleepWithAbort } from "./src-Bzfi3cQM.mjs";
import { o as registerSignalExitGate } from "./signal-exit-barrier-DtR3X_NN.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-BgcoFakQ.mjs";
import "./backoff-N5Hi0doU.mjs";
import { r as readCapabilityConsentErrorDetails } from "./capability-consent-error-details-DqbomXex.mjs";
import { o as readActiveGatewayLockIdentity } from "./gateway-lock-OT1e72lx.mjs";
//#region src/cli/plugins-lifecycle-client.ts
/** Capture the local client before a Claw batch takes any package or plugin lease. */
async function resolvePluginBatchReload() {
	const gateway = await resolvePluginLifecycleGateway();
	return gateway ? async (plugins) => {
		const result = await gateway("plugins.reload", { plugins });
		if (!result.runtime) throw new Error("Gateway did not confirm the plugin batch runtime generation. Inspect plugin status before retrying.");
		return {
			...result.runtime,
			...result.restartRequired ? { restartRequired: true } : {},
			...result.warnings?.length ? { warnings: result.warnings } : {}
		};
	} : void 0;
}
/** Select the local runtime owner before acquiring a lease the Gateway also needs. */
async function resolvePluginLifecycleGateway() {
	const owner = await readActiveGatewayLockIdentity({ requireInspection: true });
	if (!owner) return null;
	const { callGateway } = await import("./call-BvbeEASg.mjs");
	const { isGatewayProtocolResponseError } = await import("./client-DfiUYQkV.mjs");
	const request = async (method, params) => {
		const deadline = Date.now() + 6e5;
		const waitForDrain = method === "plugins.reload" && params.waitForDrain === true;
		const controller = new AbortController();
		const finished = createDeferredCore();
		const releaseExitGate = registerSignalExitGate(finished.promise, () => controller.abort());
		try {
			for (;;) try {
				controller.signal.throwIfAborted();
				return await callGateway({
					method,
					params,
					localPortOverride: owner.port,
					ignoreEnvUrlOverride: true,
					requiredMethods: [.../* @__PURE__ */ new Set([method, "plugins.reload"])],
					timeoutMs: waitForDrain ? null : Math.max(1, deadline - Date.now()),
					signal: controller.signal,
					scopes: ["operator.admin"],
					clientName: GATEWAY_CLIENT_NAMES.CLI,
					mode: GATEWAY_CLIENT_MODES.CLI
				});
			} catch (error) {
				if (!isGatewayProtocolResponseError(error) || error.gatewayCode !== "UNAVAILABLE" || !error.retryable || !isRecord(error.details) || error.details.mutationAccepted !== false || error.retryAfterMs === void 0 || error.retryAfterMs <= 0 || error.retryAfterMs >= deadline - Date.now()) throw error;
				await sleepWithAbort(error.retryAfterMs, controller.signal);
				if (Date.now() >= deadline) throw error;
			}
		} finally {
			finished.resolve();
			releaseExitGate();
		}
	};
	return async (method, params, onCapabilityConsent) => {
		const reviewedPluginIds = /* @__PURE__ */ new Set();
		let requestParams = params;
		for (;;) try {
			return await request(method, requestParams);
		} catch (error) {
			const consent = readCapabilityConsentErrorDetails(error instanceof Error && "details" in error ? error.details : void 0);
			if (!consent || !onCapabilityConsent || reviewedPluginIds.has(consent.pluginId)) throw error;
			const { plugin, ...inspection } = await request("plugins.inspect", { pluginId: consent.pluginId });
			if (!inspection.reviewToken) throw new Error(`Gateway did not return a capability-consent token for "${plugin.id}".`, { cause: error });
			const acknowledgeCapabilities = await onCapabilityConsent({
				...inspection,
				reviewToken: inspection.reviewToken,
				pluginId: plugin.id,
				name: plugin.name,
				...plugin.version ? { version: plugin.version } : {},
				...consent.widened ? { widened: consent.widened } : {},
				...consent.acceptedAt ? { acceptedAt: consent.acceptedAt } : {}
			});
			if (!acknowledgeCapabilities) throw error;
			reviewedPluginIds.add(consent.pluginId);
			requestParams = {
				...params,
				acknowledgeCapabilities
			};
		}
	};
}
//#endregion
export { resolvePluginLifecycleGateway as n, resolvePluginBatchReload as t };
