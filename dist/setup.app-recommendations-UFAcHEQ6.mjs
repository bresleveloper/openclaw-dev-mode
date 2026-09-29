import { i as extractBalancedJsonPrefix } from "./src-CZ2wJvNB.mjs";
import { t as safeParseJson } from "./json-coercion-C7YSvZ9t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { Et as _enum, Fn as object, Jn as string, Nt as array } from "./schemas-BOYIvvln.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { h as resolveOfficialExternalPluginLabel, l as listOfficialExternalPluginCatalogEntries, p as resolveOfficialExternalPluginInstall, s as listOfficialExternalChannelCatalogEntries, u as listOfficialExternalProviderCatalogEntries } from "./official-external-plugin-catalog-CzZljLFK.mjs";
import { h as resolveOfficialExternalPluginId, o as getOfficialExternalPluginCatalogManifest } from "./official-external-plugin-catalog-source-CkmJlLAW.mjs";
import "./workspace-bootstrap-policy-DSEIbIS8.mjs";
import "./workspace-mlzi3k1x.mjs";
import { c as fetchClawHubSkillVerification, u as searchClawHubSkills } from "./clawhub-skills-DTZJRHzC.mjs";
import { i as resolveClawHubSkillVerificationTarget } from "./clawhub-status-BFZGoWwh.mjs";
import { n as t } from "./i18n-BaFR7Cao.mjs";
import "./setup-inference-I6oCjU9u.mjs";
import { t as completeSetupInference } from "./setup-inference-turn-vxZT-cCw.mjs";
import { t as scanInstalledApps } from "./installed-apps-DbSmu5qP.mjs";
import { t as ensureOnboardingPluginInstalled } from "./onboarding-plugin-install-DsmMMG74.mjs";
import { t as installSkillFromClawHub } from "./clawhub-8PK5eW27.mjs";
import { t as createOnboardingRecommendationsStore } from "./onboarding-recommendations-BpRDqgRM.mjs";
import { existsSync } from "node:fs";
import path from "node:path";
import pLimit from "p-limit";
//#region src/system-agent/setup-app-recommendations.ts
const CLAWHUB_SEARCH_CONCURRENCY = 4;
const CLAWHUB_SEARCH_LIMIT = 3;
const CLAWHUB_SEARCH_TIMEOUT_MS = 5e3;
const CLAWHUB_SEARCH_TOTAL_BUDGET_MS = 2e4;
const CANDIDATE_SOURCE_ORDER = {
	"official-plugin": 0,
	"official-channel": 1,
	"official-provider": 2,
	"clawhub-skill": 3
};
const MatcherOutputSchema = object({ matches: array(object({
	appLabel: string().trim().min(1),
	candidateId: string().trim().min(1),
	tier: _enum(["recommended", "optional"]),
	reason: string().trim().min(1).transform((value) => value.length > 120 ? `${truncateUtf16Safe(value, 119)}…` : value)
})) });
function compareInventory(left, right) {
	return left.label.localeCompare(right.label, "en", { sensitivity: "base" }) || (left.bundleId ?? "").localeCompare(right.bundleId ?? "");
}
function normalizeInventory(apps) {
	const byLabel = /* @__PURE__ */ new Map();
	for (const app of apps.toSorted(compareInventory)) {
		const label = app.label.trim();
		if (!label) continue;
		const bundleId = app.bundleId?.trim();
		const key = label.toLocaleLowerCase("en-US");
		const existing = byLabel.get(key);
		if (!existing || !existing.bundleId && bundleId) byLabel.set(key, {
			label,
			...bundleId ? { bundleId } : {}
		});
	}
	return [...byLabel.values()].toSorted(compareInventory);
}
function inventoryTokens(label) {
	return label.toLocaleLowerCase("en-US").split(/[^\p{L}\p{N}]+/u).filter((token) => token.length >= 3).toSorted();
}
function providerSearchTokens(manifest) {
	const tokens = [];
	for (const provider of manifest?.providers ?? []) {
		tokens.push(provider.id, provider.name);
		for (const alias of provider.aliases ?? []) tokens.push(alias);
	}
	return tokens;
}
function entrySearchText(entry) {
	const manifest = getOfficialExternalPluginCatalogManifest(entry);
	return [
		entry.id,
		entry.name,
		entry.title,
		entry.description,
		manifest?.plugin?.id,
		manifest?.plugin?.label,
		manifest?.channel?.id,
		manifest?.channel?.label,
		...providerSearchTokens(manifest)
	].filter((value) => typeof value === "string" && value.trim().length > 0).join(" ").toLocaleLowerCase("en-US");
}
function entryMatchesApp(entry, appLabel) {
	const appTokens = inventoryTokens(appLabel);
	const searchText = entrySearchText(entry);
	const entryTokens = inventoryTokens(searchText);
	return appTokens.some((appToken) => searchText.includes(appToken) || entryTokens.some((entryToken) => appToken.includes(entryToken)));
}
function officialCandidate(entry, source) {
	const id = resolveOfficialExternalPluginId(entry);
	if (!id) return null;
	return {
		id,
		displayName: resolveOfficialExternalPluginLabel(entry),
		summary: entry.description?.trim() || "Official OpenClaw plugin",
		source
	};
}
function compareCandidates(left, right) {
	return CANDIDATE_SOURCE_ORDER[left.source] - CANDIDATE_SOURCE_ORDER[right.source] || left.displayName.localeCompare(right.displayName, "en", { sensitivity: "base" }) || left.id.localeCompare(right.id);
}
function dedupeCandidates(candidates) {
	const seen = /* @__PURE__ */ new Set();
	return candidates.toSorted(compareCandidates).filter((candidate) => {
		const key = candidate.id.toLocaleLowerCase("en-US");
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}
async function gatherSetupAppCandidates(params) {
	const deps = params.deps ?? {};
	const channels = deps.listChannels?.() ?? listOfficialExternalChannelCatalogEntries();
	const providers = deps.listProviders?.() ?? listOfficialExternalProviderCatalogEntries();
	const allEntries = deps.listPlugins?.() ?? listOfficialExternalPluginCatalogEntries();
	const entryKey = (entry) => resolveOfficialExternalPluginId(entry) ?? entry.name;
	const channelIds = new Set(channels.map(entryKey));
	const providerIds = new Set(providers.map(entryKey));
	const officialEntries = [...new Map([
		...allEntries,
		...channels,
		...providers
	].flatMap((entry) => {
		const key = entryKey(entry);
		return key ? [[key, entry]] : [];
	})).entries()].map(([key, entry]) => ({
		entry,
		source: channelIds.has(key) ? "official-channel" : providerIds.has(key) ? "official-provider" : "official-plugin"
	}));
	const searchSkills = deps.searchSkills ?? searchClawHubSkills;
	const searchLimit = pLimit(CLAWHUB_SEARCH_CONCURRENCY);
	const searchDeadline = Date.now() + CLAWHUB_SEARCH_TOTAL_BUDGET_MS;
	return (await Promise.all(normalizeInventory(params.apps).map(async (app) => {
		const official = officialEntries.flatMap(({ entry, source }) => {
			if (!entryMatchesApp(entry, app.label)) return [];
			const candidate = officialCandidate(entry, source);
			return candidate ? [candidate] : [];
		});
		const skills = await searchLimit(async () => {
			if (Date.now() >= searchDeadline) return [];
			try {
				return (await searchSkills({
					query: app.label.normalize("NFKC").trim(),
					limit: CLAWHUB_SEARCH_LIMIT,
					timeoutMs: CLAWHUB_SEARCH_TIMEOUT_MS
				})).slice(0, CLAWHUB_SEARCH_LIMIT).flatMap((result) => {
					const ownerHandle = normalizeOptionalString(result.ownerHandle);
					return ownerHandle ? [{
						id: `@${ownerHandle}/${result.slug}`,
						displayName: result.displayName,
						summary: result.summary?.trim() || "ClawHub skill",
						source: "clawhub-skill"
					}] : [];
				});
			} catch {
				return [];
			}
		});
		return {
			app,
			candidates: dedupeCandidates([...official, ...skills])
		};
	}))).toSorted((left, right) => compareInventory(left.app, right.app));
}
function parseMatcherJson(text) {
	const json = extractBalancedJsonPrefix(text, { openers: ["{"] })?.json;
	return json ? safeParseJson(json) ?? null : null;
}
function buildMatcherPrompt(groups) {
	const payload = groups.map((group) => ({
		app: group.app,
		candidates: group.candidates
	}));
	return [
		"Match installed applications to genuinely related OpenClaw plugins or skills.",
		"Reject coincidental substring, brand, or name overlaps.",
		"Use tier recommended for messaging-channel integrations; otherwise choose recommended or optional by usefulness.",
		"Give a reason of at most 12 words.",
		"Return strict JSON only: {\"matches\":[{\"appLabel\":\"...\",\"candidateId\":\"...\",\"tier\":\"recommended|optional\",\"reason\":\"...\"}]}.",
		JSON.stringify(payload)
	].join("\n");
}
async function getSetupAppRecommendations(params) {
	const inventory = await params.inventorySource();
	if (!Array.isArray(inventory) && inventory.status === "unsupported") return {
		status: "skipped",
		reason: "unsupported"
	};
	const apps = normalizeInventory(Array.isArray(inventory) ? inventory : inventory.apps.map((app) => ({
		label: app.label,
		bundleId: app.bundleId
	})));
	if (apps.length === 0) return {
		status: "skipped",
		reason: "no-apps"
	};
	params.onPhase?.({
		kind: "candidates",
		appCount: apps.length,
		sampleLabels: apps.slice(0, 3).map((app) => app.label)
	});
	const groups = await gatherSetupAppCandidates({
		apps,
		deps: params.deps
	});
	if (groups.every((group) => group.candidates.length === 0)) return {
		status: "skipped",
		reason: "no-candidates"
	};
	const complete = params.deps?.complete ?? (async (prompt) => await completeSetupInference({
		prompt,
		runtime: params.runtime
	}));
	let completion;
	try {
		params.onPhase?.({
			kind: "matching",
			appCount: apps.length
		});
		completion = await complete(buildMatcherPrompt(groups));
	} catch {
		return {
			status: "skipped",
			reason: "model-failed"
		};
	}
	if (!completion.ok) return {
		status: "skipped",
		reason: "model-failed"
	};
	const parsed = MatcherOutputSchema.safeParse(parseMatcherJson(completion.text));
	if (!parsed.success) return {
		status: "skipped",
		reason: "model-failed"
	};
	const matches = parsed.data.matches.flatMap((match) => {
		const appKey = match.appLabel.toLocaleLowerCase("en-US");
		const candidateKey = match.candidateId.toLocaleLowerCase("en-US");
		const group = groups.find((candidate) => candidate.app.label.toLocaleLowerCase("en-US") === appKey);
		const candidate = group?.candidates.find((entry) => entry.id.toLocaleLowerCase("en-US") === candidateKey);
		return candidate ? [{
			...match,
			appLabel: group?.app.label ?? match.appLabel,
			candidate
		}] : [];
	});
	if (matches.length === 0) return {
		status: "skipped",
		reason: "no-matches"
	};
	return {
		status: "ok",
		apps,
		groups,
		matches: matches.toSorted((left, right) => (left.tier === right.tier ? 0 : left.tier === "recommended" ? -1 : 1) || left.candidate.displayName.localeCompare(right.candidate.displayName, "en", { sensitivity: "base" }) || left.appLabel.localeCompare(right.appLabel, "en", { sensitivity: "base" }))
	};
}
//#endregion
//#region src/wizard/setup.app-recommendations.ts
const SKIP_VALUE = "__skip__";
async function isClawHubSkillInstalled(params) {
	const target = await resolveClawHubSkillVerificationTarget({
		workspaceDir: params.workspaceDir,
		slug: params.skillRef
	});
	if (!target.ok || target.resolution.source !== "installed") return false;
	const verification = await fetchClawHubSkillVerification({
		slug: target.slug,
		...target.ownerHandle ? { ownerHandle: target.ownerHandle } : {},
		version: target.version,
		baseUrl: target.baseUrl
	});
	return verification.ok && verification.decision === "pass";
}
function unchangedOutcome(config) {
	return {
		config,
		commitResult: async () => void 0
	};
}
function resolveOfficialEntry(pluginId) {
	const catalogEntry = listOfficialExternalPluginCatalogEntries().find((entry) => resolveOfficialExternalPluginId(entry) === pluginId);
	const install = catalogEntry ? resolveOfficialExternalPluginInstall(catalogEntry) : void 0;
	if (!catalogEntry || !install) return;
	return {
		pluginId,
		label: resolveOfficialExternalPluginLabel(catalogEntry),
		install,
		trustedSourceLinkedOfficialInstall: true
	};
}
function selectionValue(index) {
	return `recommendation:${index}`;
}
function uniqueSelectedMatches(matches, selected) {
	const selectedValues = new Set(selected);
	const seen = /* @__PURE__ */ new Set();
	return matches.filter((match, index) => {
		const key = `${match.candidate.source}:${match.candidate.id}`;
		if (!selectedValues.has(selectionValue(index)) || seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}
async function setupAppRecommendations(params) {
	const platform = params.platform ?? process.platform;
	if (params.config.wizard?.appRecommendations === false || platform !== "darwin" || !params.modelRouteVerified) return unchangedOutcome(params.config);
	const store = createOnboardingRecommendationsStore({ workspaceDir: params.workspaceDir });
	const storedRecord = await (params.deps?.readStored ?? store.read)();
	if (typeof storedRecord?.acceptedAt === "number") return unchangedOutcome(params.config);
	const clearPendingStored = params.deps?.clearPendingStored ?? store.clearPending;
	const hasLegacyClawHubId = storedRecord?.matches.some((match) => match.candidate.source === "clawhub-skill" && !match.candidate.id.startsWith("@"));
	if (hasLegacyClawHubId && storedRecord) {
		if (!await clearPendingStored({ expected: storedRecord })) return unchangedOutcome(params.config);
	}
	const stored = hasLegacyClawHubId ? null : storedRecord;
	const writeOffer = params.deps?.writeOffer ?? store.writeOffer;
	const acknowledgeStored = params.deps?.acknowledgeStored ?? store.acknowledge;
	const updatePendingStored = params.deps?.updatePendingStored ?? store.updatePending;
	const deferOfferToBootstrap = params.deps?.deferOfferToBootstrap ?? (() => existsSync(path.join(params.workspaceDir, "BOOTSTRAP.md")));
	let matches;
	let appLabels;
	let pendingRecord = stored;
	let recordResult;
	const commitStoredResult = async (retryMatches) => {
		if (!pendingRecord) throw new Error("Stored onboarding recommendations changed while setup was running.");
		const expected = pendingRecord;
		const updated = retryMatches.length === 0 ? await acknowledgeStored({ expected }) : await updatePendingStored({
			matches: retryMatches,
			expected
		});
		if (!updated) throw new Error("Stored onboarding recommendations changed while setup was running.");
		pendingRecord = updated;
	};
	if (stored) {
		if (deferOfferToBootstrap()) return unchangedOutcome(params.config);
		matches = stored.matches;
		appLabels = [...new Set(stored.matches.map((match) => match.appLabel))];
		recordResult = commitStoredResult;
	} else {
		const scanDisclosure = t("wizard.appRecommendations.scanDisclosure");
		if (params.prompter.plain) await params.prompter.plain(scanDisclosure);
		else params.runtime.log(scanDisclosure);
		const progress = params.prompter.progress(t("wizard.appRecommendations.scanning"));
		const scanPhaseMessage = (phase) => {
			if (phase.kind === "candidates") return t(phase.appCount === 1 ? "wizard.appRecommendations.scanningCandidate" : "wizard.appRecommendations.scanningCandidates", {
				count: phase.appCount,
				sample: phase.sampleLabels.join(", ")
			});
			return t("wizard.appRecommendations.scanningMatch");
		};
		const onPhase = (phase) => progress.update(scanPhaseMessage(phase));
		let result;
		try {
			result = params.deps?.recommend ? await params.deps.recommend(onPhase) : await getSetupAppRecommendations({
				inventorySource: async () => await scanInstalledApps({ platform }),
				runtime: params.runtime,
				onPhase
			});
		} catch (error) {
			progress.stop();
			params.runtime.log(t("wizard.appRecommendations.skipped", { reason: formatErrorMessage(error) }));
			return unchangedOutcome(params.config);
		}
		progress.stop();
		if (result.status !== "ok") {
			params.runtime.log(t("wizard.appRecommendations.noneFound"));
			return unchangedOutcome(params.config);
		}
		if (deferOfferToBootstrap()) {
			await writeOffer({
				inventory: result.apps,
				matches: result.matches,
				answered: false
			});
			return unchangedOutcome(params.config);
		}
		const scanned = result;
		matches = scanned.matches;
		appLabels = scanned.apps.map((app) => app.label);
		recordResult = async (retryMatches) => {
			if (!pendingRecord) {
				pendingRecord = await writeOffer({
					inventory: scanned.apps,
					matches: retryMatches.length > 0 ? retryMatches : scanned.matches,
					answered: retryMatches.length === 0
				});
				return;
			}
			await commitStoredResult(retryMatches);
		};
	}
	await params.prompter.note([t("wizard.appRecommendations.detected", { apps: appLabels.join(", ") }), t("wizard.appRecommendations.disclosure")].join("\n"), t("wizard.appRecommendations.title"));
	const selected = await params.prompter.multiselect({
		message: t("wizard.appRecommendations.select"),
		options: [{
			value: SKIP_VALUE,
			label: t("common.skipForNow")
		}, ...matches.map((match, index) => ({
			value: selectionValue(index),
			label: match.candidate.source === "clawhub-skill" ? t("wizard.appRecommendations.optionThirdParty", {
				name: match.candidate.displayName,
				reason: match.reason,
				app: match.appLabel
			}) : t("wizard.appRecommendations.option", {
				name: match.candidate.displayName,
				reason: match.reason,
				app: match.appLabel
			})
		}))],
		initialValues: matches.flatMap((match, index) => match.tier === "recommended" && match.candidate.source !== "clawhub-skill" ? [selectionValue(index)] : [])
	});
	if (selected.includes(SKIP_VALUE)) {
		await recordResult([]);
		return unchangedOutcome(params.config);
	}
	let next = params.config;
	const selectedMatches = uniqueSelectedMatches(matches, selected);
	if (selectedMatches.length === 0) {
		await recordResult([]);
		return unchangedOutcome(params.config);
	}
	await recordResult(selectedMatches);
	let pendingMatches = selectedMatches;
	const retryMatches = [];
	const ensurePlugin = params.deps?.ensurePlugin ?? ensureOnboardingPluginInstalled;
	const installSkill = params.deps?.installSkill ?? installSkillFromClawHub;
	const isSkillInstalled = params.deps?.isSkillInstalled ?? isClawHubSkillInstalled;
	for (const match of selectedMatches) {
		let installed = false;
		try {
			if (match.candidate.source === "clawhub-skill") {
				if (!await isSkillInstalled({
					workspaceDir: params.workspaceDir,
					skillRef: match.candidate.id
				})) {
					const result = await installSkill({
						workspaceDir: params.workspaceDir,
						slug: match.candidate.id,
						config: next,
						logger: { warn: (message) => params.runtime.error(message) }
					});
					if (!result.ok) throw new Error(result.error);
				}
			} else {
				const entry = (params.deps?.resolveOfficialEntry ?? resolveOfficialEntry)(match.candidate.id);
				if (!entry) throw new Error(t("wizard.appRecommendations.catalogEntryMissing"));
				const pluginResult = await ensurePlugin({
					cfg: next,
					entry,
					prompter: params.prompter,
					runtime: params.runtime,
					workspaceDir: params.workspaceDir,
					promptInstall: false
				});
				next = pluginResult.cfg;
				if (!pluginResult.installed) throw new Error(pluginResult.error ?? pluginResult.status);
			}
			installed = true;
		} catch (error) {
			retryMatches.push(match);
			params.runtime.error(t("wizard.appRecommendations.installFailed", {
				name: match.candidate.displayName,
				reason: formatErrorMessage(error)
			}));
		}
		if (installed && match.candidate.source === "clawhub-skill") {
			pendingMatches = pendingMatches.filter((candidate) => candidate !== match);
			await recordResult(pendingMatches);
		}
	}
	const hasDeferredOfficialResult = selectedMatches.some((match) => match.candidate.source !== "clawhub-skill");
	return {
		config: next,
		commitResult: hasDeferredOfficialResult ? () => recordResult(retryMatches) : async () => void 0
	};
}
//#endregion
export { setupAppRecommendations };
