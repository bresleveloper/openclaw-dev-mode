import { h as sleep } from "./utils-aKqR_F_U.mjs";
import { r as readCapabilityConsentErrorDetails } from "./capability-consent-error-details-CF5XfV3G.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-B_ICKCYw.mjs";
import { o as readActiveGatewayLockIdentity } from "./gateway-lock-CYjRlApN.mjs";
//#region src/cli/plugins-lifecycle-client.ts
/** Capture the local client before a Claw batch takes any package or plugin lease. */
async function resolvePluginBatchReload() {
	const gateway = await resolvePluginLifecycleGateway();
	return gateway ? async (plugins) => {
		const result = await gateway("plugins.reload", { plugins });
		if (!result.runtime) throw new Error("Gateway did not confirm the plugin batch runtime generation. Inspect plugin status before retrying.");
		return result.warnings?.length ? {
			...result.runtime,
			warnings: result.warnings
		} : result.runtime;
	} : void 0;
}
/** Select the local runtime owner before acquiring a lease the Gateway also needs. */
async function resolvePluginLifecycleGateway() {
	const owner = await readActiveGatewayLockIdentity({ requireInspection: true });
	if (!owner) return null;
	const { callGateway, isGatewayClientRequestError } = await import("./call-bfuNQIMk.mjs");
	const request = async (method, params) => {
		const deadline = Date.now() + 6e5;
		for (;;) try {
			return await callGateway({
				method,
				params,
				localPortOverride: owner.port,
				ignoreEnvUrlOverride: true,
				requiredMethods: [.../* @__PURE__ */ new Set([method, "plugins.reload"])],
				timeoutMs: Math.max(1, deadline - Date.now()),
				scopes: ["operator.admin"],
				clientName: GATEWAY_CLIENT_NAMES.CLI,
				mode: GATEWAY_CLIENT_MODES.CLI
			});
		} catch (error) {
			if (!isGatewayClientRequestError(error) || error.gatewayCode !== "UNAVAILABLE" || !error.retryable || error.retryAfterMs === void 0 || error.retryAfterMs >= deadline - Date.now()) throw error;
			await sleep(error.retryAfterMs);
			if (Date.now() >= deadline) throw error;
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
			const acknowledgeCapabilities = await onCapabilityConsent({
				...inspection,
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
