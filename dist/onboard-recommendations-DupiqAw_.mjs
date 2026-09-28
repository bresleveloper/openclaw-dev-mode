import { a as writeRuntimeJson } from "./runtime-BC29JSZp.mjs";
import { f as resolveConfiguredAgentId, l as resolveAgentWorkspaceDir, m as resolveDefaultAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { t as createOnboardingRecommendationsStore } from "./onboarding-recommendations-BpRDqgRM.mjs";
//#region src/commands/onboard-recommendations.ts
const SAFE_INSTALL_ID_RE = /^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/iu;
function createDefaultOnboardingRecommendationsStore(requestedAgentId) {
	const requested = requestedAgentId?.trim();
	if (requestedAgentId !== void 0 && !requested) throw new Error("--agent must not be blank");
	const cfg = getRuntimeConfig();
	const agentId = requested ? resolveConfiguredAgentId(cfg, requested) : resolveDefaultAgentId(cfg);
	const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
	return createOnboardingRecommendationsStore({ workspaceDir });
}
function createDefaultStoreAccessor(agentId) {
	let store;
	return () => store ??= createDefaultOnboardingRecommendationsStore(agentId);
}
function isLegacyBareClawHubId(match) {
	return match.candidate.source === "clawhub-skill" && SAFE_INSTALL_ID_RE.test(match.candidate.id) && !match.candidate.id.startsWith("@");
}
function bootstrapRecommendations(record) {
	if (record?.acceptedAt != null) return [];
	const byInstall = /* @__PURE__ */ new Map();
	for (const match of record?.matches ?? []) {
		const id = match.candidate.id;
		if (!SAFE_INSTALL_ID_RE.test(id) || match.candidate.source === "clawhub-skill" && !id.startsWith("@")) continue;
		const source = match.candidate.source === "clawhub-skill" ? "clawhub-skill" : "official-plugin";
		const key = `${source}:${id.toLocaleLowerCase("en-US")}`;
		const existing = byInstall.get(key);
		if (!existing || existing.tier === "optional" && match.tier === "recommended") byInstall.set(key, {
			id,
			source,
			tier: match.tier
		});
	}
	return [...byInstall.values()];
}
async function onboardRecommendationsCommand(opts, runtime, deps = {}) {
	const defaultStore = createDefaultStoreAccessor(opts.agent);
	const stored = await (deps.read ?? defaultStore().read)();
	const hasLegacyClawHubId = stored?.matches.some(isLegacyBareClawHubId);
	if (hasLegacyClawHubId && stored && stored.acceptedAt == null) {
		if (!await (deps.clearPending ?? defaultStore().clearPending)({ expected: stored })) {
			runtime.error("Stored recommendations changed; read them again.");
			runtime.exit(1);
			return;
		}
	}
	const matches = bootstrapRecommendations(hasLegacyClawHubId ? null : stored);
	if (opts.json) {
		writeRuntimeJson(runtime, matches);
		return;
	}
	if (matches.length === 0) {
		runtime.log("No stored onboarding recommendations.");
		return;
	}
	runtime.log(matches.map((match) => {
		const source = match.source === "clawhub-skill" ? "ClawHub skill" : "official plugin";
		return `- ${match.id} [${source}; ${match.tier}]`;
	}).join("\n"));
}
async function acknowledgeOnboardRecommendationsCommand(opts, runtime, deps = {}) {
	const defaultStore = createDefaultStoreAccessor(opts.agent);
	const retryIds = [...new Set(opts.retry ?? [])];
	if (retryIds.length > 0) {
		const record = await (deps.read ?? defaultStore().read)();
		if (!record || record.acceptedAt != null) {
			runtime.error("No pending onboarding recommendations to retry.");
			runtime.exit(1);
			return;
		}
		const pending = bootstrapRecommendations(record);
		const pendingIds = new Set(pending.map((match) => match.id));
		const unknownIds = retryIds.filter((id) => !pendingIds.has(id));
		if (unknownIds.length > 0) {
			runtime.error(`Unknown pending recommendation id: ${unknownIds.join(", ")}`);
			runtime.exit(1);
			return;
		}
		const retryIdSet = new Set(retryIds);
		const retryMatches = record?.matches.filter((match) => retryIdSet.has(match.candidate.id)) ?? [];
		if (!await (deps.updatePending ?? defaultStore().updatePending)({
			matches: retryMatches,
			expected: record
		})) {
			runtime.error("Stored recommendations changed; read them again before recording retries.");
			runtime.exit(1);
			return;
		}
		runtime.log(`Onboarding recommendations updated; ${retryIds.length} left pending for retry.`);
		return;
	}
	const record = await (deps.acknowledge ?? defaultStore().acknowledge)();
	runtime.log(record ? "Onboarding recommendations acknowledged." : "No stored recommendations.");
}
async function refreshOnboardRecommendationsCommand(opts, runtime, deps = {}) {
	const defaultStore = createDefaultStoreAccessor(opts.agent);
	const cleared = await (deps.clear ?? defaultStore().clear)();
	runtime.log(cleared ? "Onboarding recommendations cleared. The next onboarding run will rescan." : "No stored recommendations.");
}
//#endregion
export { acknowledgeOnboardRecommendationsCommand, onboardRecommendationsCommand, refreshOnboardRecommendationsCommand };
