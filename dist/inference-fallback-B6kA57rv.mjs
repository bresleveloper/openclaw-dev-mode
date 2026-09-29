import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { O as listAgentIds, d as resolveAmbientOwnerAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { a as hasAvailableAuthForProvider } from "./model-auth-CCIBdEPk.mjs";
import { i as resolveSystemAgentConfiguredRouteFromConfig } from "./inference-route-BPA-rq9w.mjs";
import "./setup-inference-I6oCjU9u.mjs";
import { s as verifySetupInference } from "./setup-inference-turn-vxZT-cCw.mjs";
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
async function readCurrentSnapshot() {
	const { readConfigFileSnapshot } = await import("./config/config.js");
	return await readConfigFileSnapshot();
}
/** Requester first. Other configured, authenticated providers: provider-id order. */
async function verifySystemAgentInferenceWithFallback(params) {
	const deps = params.deps ?? {};
	const routePolicy = params.routePolicy;
	const snapshot = deps.readConfig ? void 0 : await readCurrentSnapshot();
	const config = deps.readConfig ? await deps.readConfig() : snapshot?.exists && snapshot.valid ? snapshot.runtimeConfig ?? snapshot.config : {};
	const requestedAgentId = resolveAmbientOwnerAgentId(config, params.requestingAgentId);
	const candidateAgentIds = /* @__PURE__ */ new Set([requestedAgentId, ...listAgentIds(config).map((agentId) => normalizeAgentId(agentId))]);
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
