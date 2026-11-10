import { o as writeRuntimeJson } from "./runtime-BazLsT0s.mjs";
import { _ as resolveDefaultAgentId, f as resolveAgentWorkspaceDir, h as resolveConfiguredAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { t as captureRuntimeConfigAsyncReader } from "./io.runtime-Ds5uC0Bf.mjs";
import "./config-B3oiWDlr.mjs";
import { t as createOnboardingRecommendationsStore } from "./onboarding-recommendations-BJepgZSG.mjs";
//#region src/commands/onboard-recommendations.ts
const SAFE_INSTALL_ID_RE = /^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/iu;
async function createDefaultOnboardingRecommendationsStore(requestedAgentId) {
	const requested = requestedAgentId?.trim();
	if (requestedAgentId !== void 0 && !requested) throw new Error("--agent must not be blank");
	const cfg = await captureRuntimeConfigAsyncReader()();
	const agentId = requested ? resolveConfiguredAgentId(cfg, requested) : resolveDefaultAgentId(cfg);
	const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
	return createOnboardingRecommendationsStore({ workspaceDir });
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
async function onboardRecommendationsCommand(opts, runtime) {
	const store = await createDefaultOnboardingRecommendationsStore(opts.agent);
	const stored = await store.read();
	const hasLegacyClawHubId = stored?.matches.some(isLegacyBareClawHubId);
	if (hasLegacyClawHubId && stored && stored.acceptedAt == null) {
		if (!await store.clearPending({ expected: stored })) {
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
async function acknowledgeOnboardRecommendationsCommand(opts, runtime) {
	const store = await createDefaultOnboardingRecommendationsStore(opts.agent);
	const retryIds = [...new Set(opts.retry ?? [])];
	if (retryIds.length > 0) {
		const record = await store.read();
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
		const retryMatches = record.matches.filter((match) => retryIdSet.has(match.candidate.id));
		if (!await store.updatePending({
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
	const record = await store.acknowledge();
	runtime.log(record ? "Onboarding recommendations acknowledged." : "No stored recommendations.");
}
async function refreshOnboardRecommendationsCommand(opts, runtime) {
	const cleared = await (await createDefaultOnboardingRecommendationsStore(opts.agent)).clear();
	runtime.log(cleared ? "Onboarding recommendations cleared. The next onboarding run will rescan." : "No stored recommendations.");
}
//#endregion
export { acknowledgeOnboardRecommendationsCommand, onboardRecommendationsCommand, refreshOnboardRecommendationsCommand };
