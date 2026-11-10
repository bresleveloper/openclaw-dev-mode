import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { m as resolveAmbientOwnerAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { a as hasAvailableAuthForProvider } from "./model-auth-CMoPmop7.mjs";
import { r as resolveSystemAgentConfiguredRouteFromConfig } from "./inference-route-BKUtNPSd.mjs";
import { s as verifySetupInference } from "./setup-inference-turn-BC8jnZkF.mjs";
import "./setup-inference-D_w8k23R.mjs";
//#region src/system-agent/inference-fallback.ts
const RETRYABLE_INFERENCE_STATUSES = /* @__PURE__ */ new Set([
	"auth",
	"rate_limit",
	"billing",
	"timeout",
	"format",
	"unavailable"
]);
const PROVIDER_WIDE_FAILURE_STATUSES = /* @__PURE__ */ new Set(["timeout", "unavailable"]);
/** Requester first. Other configured, authenticated providers: provider-id order. */
async function verifySystemAgentInferenceWithFallback(params) {
	const deps = params.deps ?? {};
	const routePolicy = params.routePolicy;
	const snapshot = deps.readConfig ? void 0 : await (await import("./config/config.js")).readConfigFileSnapshot();
	const config = deps.readConfig ? await deps.readConfig() : snapshot?.exists && snapshot.valid ? snapshot.runtimeConfig ?? snapshot.config : {};
	const requestedAgentId = resolveAmbientOwnerAgentId(config, params.requestingAgentId);
	const candidateAgentIds = /* @__PURE__ */ new Set([requestedAgentId, ...listAgentIds(config)]);
	const resolveRoute = deps.resolveRoute ?? ((candidateConfig, agentId) => resolveSystemAgentConfiguredRouteFromConfig(candidateConfig, agentId, {}, snapshot));
	const routes = [];
	for (const agentId of candidateAgentIds) {
		const route = await resolveRoute(config, agentId);
		if (!route) continue;
		const provider = normalizeProviderId(route.provider);
		if (!provider) continue;
		routes.push({
			agentId,
			provider,
			route
		});
	}
	const first = routes.find((candidate) => candidate.agentId === requestedAgentId);
	const orderedOwners = [...first ? [first] : [], ...routes.filter((candidate) => candidate !== first).toSorted((left, right) => left.provider.localeCompare(right.provider) || left.agentId.localeCompare(right.agentId))];
	const ordered = routePolicy ? (await Promise.all(orderedOwners.map(async ({ route }) => (await routePolicy.expand(route)).map((expanded) => ({
		agentId: expanded.agentId,
		provider: normalizeProviderId(expanded.provider),
		route: expanded
	}))))).flat() : orderedOwners;
	const hasAuth = deps.hasAuth ?? hasAvailableAuthForProvider;
	const verify = deps.verify ?? verifySetupInference;
	let lastFailure;
	const failedProviders = /* @__PURE__ */ new Set();
	const attemptedOwners = /* @__PURE__ */ new Set();
	for (const candidate of ordered) {
		if (failedProviders.has(candidate.provider)) continue;
		const ownerKey = JSON.stringify([
			candidate.provider,
			candidate.route.authProfileId ?? null,
			candidate.route.agentDir ?? null,
			...routePolicy ? [candidate.route.model] : []
		]);
		if (attemptedOwners.has(ownerKey)) continue;
		if (routePolicy && !await routePolicy.accept(candidate.route)) continue;
		if (!routePolicy && candidate !== first && !await hasAuth({
			provider: candidate.provider,
			cfg: candidate.route.runConfig,
			preferredProfile: candidate.route.authProfileId,
			agentDir: candidate.route.agentDir,
			modelId: candidate.route.model
		})) continue;
		attemptedOwners.add(ownerKey);
		if (routePolicy) {
			const result = await routePolicy.verify(candidate.route);
			if (result.ok) return {
				ok: true,
				route: candidate.route
			};
			lastFailure = result;
		} else {
			const result = await verify({
				runtime: params.runtime,
				bindSession: true,
				agentId: candidate.agentId
			});
			if (result.ok) return result;
			lastFailure = result;
		}
		if (!RETRYABLE_INFERENCE_STATUSES.has(lastFailure.status)) return lastFailure;
		if (!routePolicy && PROVIDER_WIDE_FAILURE_STATUSES.has(lastFailure.status)) failedProviders.add(candidate.provider);
	}
	return lastFailure ?? {
		ok: false,
		status: "unknown",
		error: "OpenClaw could not verify a usable inference route. Check model setup and try again."
	};
}
//#endregion
export { verifySystemAgentInferenceWithFallback as t };
