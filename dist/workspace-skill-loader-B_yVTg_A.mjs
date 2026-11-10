import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { t as normalizeWorkspaceSkillRoots } from "./workspace-skill-roots-CL28VeX5.mjs";
import { i as getSkillsSourceVersion } from "./refresh-state-DoFid57J.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
import { a as normalizeSkillFilter, n as resolveEffectiveAgentSkillFilter } from "./agent-filter-B-HgchuV.mjs";
import { i as getAgentWorkspaceAccess } from "./workspace-access-sFz3TNTx.mjs";
import { t as mergeRemoteNodeSkillEntries } from "./remote-skills-oCdwUx69.mjs";
import { a as resolveSkillsUserHomeDir, i as resolvePluginSkillsDir } from "./local-loader-DuDhVnOL.mjs";
import { n as recordSkillFileHost } from "./skill-file-host-d_CtoZp0.mjs";
import { r as loadWorkspaceSkillSourceEntries, t as loadExecutionSkillEntries } from "./skill-root-loader-BM6lBNhg.mjs";
import { a as resolveSkillDiscoveryLimits } from "./skill-root-discovery-FGRFW_77.mjs";
import { c as resolveBundledAllowlist, f as shouldIncludeSkill, i as isSkillEntrySelected, s as prepareSkillBinaryProbe, u as resolveSkillRequiredBins } from "./config-D7Jc5w1r.mjs";
import { t as canonicalizePath } from "./paths-C-gBEpJw.mjs";
import { n as mergeSkillRecords, r as reportSkillPrecedenceCollisions, t as appendLowerPrecedenceSkillRecords } from "./skill-precedence-aiuaCdaS.mjs";
import { n as resolveWorkspaceSkillSourcePlan, r as splitSkillSourcePlan, t as resolveCustodianSkillAgentId } from "./workspace-skill-sources-BzN5yi4g.mjs";
import { a as prepareSkillLibrarySelection, i as loadSkillLibrarySelection, n as captureSkillLibraryPreparation } from "./selection-B3qUGv_G.mjs";
import { g as assertUnambiguousManagedSkillNames } from "./store-DmveTVM5.mjs";
import { a as prepareSkillSourcePlan, i as prepareLocalSkillSources } from "./refresh-CFj73Q4x.mjs";
import { t as fingerprintSkillSnapshotConfig } from "./snapshot-config-fingerprint-YDKQvmyT.mjs";
//#region src/skills/loading/workspace-skill-filter.ts
const skillsLogger = createSubsystemLogger("skills");
function filterSkillEntries(entries, opts) {
	const { config, skillFilter, skillOverrides, eligibility, hasBin, platform } = opts ?? {};
	const bundledAllowlist = resolveBundledAllowlist(config);
	assertUnambiguousManagedSkillNames(entries);
	const normalized = normalizeSkillFilter(skillFilter);
	const filtered = entries.filter((entry) => isSkillEntrySelected(entry, normalized, skillOverrides) && shouldIncludeSkill({
		entry,
		config,
		bundledAllowlist,
		eligibility,
		hasBin,
		platform
	}));
	if (skillFilter !== void 0 || skillOverrides !== void 0) {
		const label = normalized?.length ? normalized.join(", ") : "(none)";
		skillsLogger.debug(`Applying skill filter: ${label}`);
		skillsLogger.debug(`After skill filter: ${filtered.map((entry) => entry.skill.name).join(", ") || "(none)"}`);
	}
	return filtered;
}
function resolveEffectiveWorkspaceSkillFilter(opts) {
	if (opts?.skillFilter !== void 0) return normalizeSkillFilter(opts.skillFilter);
	if (opts?.agentSkillFilter === "ignore" || !opts?.config || !opts.agentId) return;
	return resolveEffectiveAgentSkillFilter(opts.config, opts.agentId);
}
//#endregion
//#region src/skills/loading/workspace-skill-loader.ts
const MAX_SKILL_ENTRY_CACHE_SIZE = 64;
const skillEntryCache = /* @__PURE__ */ new Map();
const agentSkillEntryCache = /* @__PURE__ */ new Map();
const pluginMetadataIds = /* @__PURE__ */ new WeakMap();
let nextPluginMetadataId = 0;
function loadLocalSkillTiers(workspaceDir, opts) {
	const workspaceOnly = opts?.workspaceOnly === true;
	const { executionWorkspaceDir } = normalizeWorkspaceSkillRoots({
		agentWorkspaceDir: workspaceDir,
		executionWorkspaceDir: opts?.executionWorkspaceDir,
		executionWorkspaceFileHost: opts?.executionWorkspaceFileHost
	});
	const custodianAgentId = resolveCustodianSkillAgentId(opts?.config, opts?.agentId, workspaceOnly);
	const metadata = opts?.pluginMetadataSnapshot;
	let metadataId = metadata && pluginMetadataIds.get(metadata);
	if (metadata && metadataId === void 0) {
		metadataId = ++nextPluginMetadataId;
		pluginMetadataIds.set(metadata, metadataId);
	}
	const agentSourceKey = JSON.stringify([
		workspaceDir,
		workspaceOnly,
		opts?.gatewayOnly,
		opts?.agentId ? normalizeAgentId(opts.agentId) : void 0,
		custodianAgentId,
		opts?.managedSkillsDir,
		opts?.bundledSkillsDir,
		opts?.pluginSkillsDir ?? resolvePluginSkillsDir(),
		resolveSkillsUserHomeDir(),
		process.env.OPENCLAW_STATE_DIR
	]);
	const agentCacheKey = JSON.stringify([
		agentSourceKey,
		opts?.config ? fingerprintSkillSnapshotConfig(opts.config) : void 0,
		metadataId,
		getSkillsSourceVersion(workspaceDir)
	]);
	const sourceKey = JSON.stringify([
		agentSourceKey,
		executionWorkspaceDir,
		opts?.executionWorkspaceFileHost
	]);
	const cacheKey = JSON.stringify([
		agentCacheKey,
		executionWorkspaceDir,
		opts?.executionWorkspaceFileHost,
		getSkillsSourceVersion(workspaceDir, opts)
	]);
	const cachedEntries = skillEntryCache.get(cacheKey);
	if (cachedEntries) return cachedEntries;
	let agentTier = agentSkillEntryCache.get(agentCacheKey);
	if (!agentTier) {
		const plan = resolveWorkspaceSkillSourcePlan(workspaceDir, opts);
		agentTier = loadWorkspaceSkillSourceEntries(opts?.gatewayOnly ? splitSkillSourcePlan(plan).gatewayPlan : plan, opts?.config);
		agentSkillEntryCache.set(agentCacheKey, agentTier);
		pruneMapToMaxSize(agentSkillEntryCache, MAX_SKILL_ENTRY_CACHE_SIZE);
	}
	const entries = {
		sourceKey,
		agent: agentTier,
		execution: executionWorkspaceDir && !workspaceOnly && !opts?.gatewayOnly ? loadExecutionSkillEntries(executionWorkspaceDir, opts?.config) : []
	};
	skillEntryCache.set(cacheKey, entries);
	pruneMapToMaxSize(skillEntryCache, MAX_SKILL_ENTRY_CACHE_SIZE);
	return entries;
}
function mergeSkillTiers(tiers, opts, libraryEntries = opts?.librarySelections?.length ? loadSkillLibrarySelection(opts.librarySelections) : []) {
	const select = (entries) => entries.filter((entry) => !opts?.matchesSnapshotSkill || opts.matchesSnapshotSkill(entry.skill));
	const collisions = [];
	const entries = mergeSkillRecords(mergeRemoteNodeSkillEntries(select(tiers.agent), opts?.eligibility?.nodeSkills, opts?.matchesSnapshotSkill), tiers.sourceKey, collisions);
	if (tiers.execution.length > 0) appendLowerPrecedenceSkillRecords(entries, mergeSkillRecords(select(tiers.execution), tiers.sourceKey, collisions), (winner, loser) => {
		if (canonicalizePath(winner.skill.filePath) !== canonicalizePath(loser.skill.filePath)) collisions.push({
			winner: winner.skill,
			loser: loser.skill
		});
	});
	if (!opts?.matchesSnapshotSkill) reportSkillPrecedenceCollisions(collisions, tiers.sourceKey);
	entries.push(...select(libraryEntries));
	return entries;
}
/** Keep Library pins and physical read authority fixed across workspace discovery retries. */
function captureWorkspaceSkillPreparation(workspaceDir, opts, assertCurrent) {
	assertCurrent?.();
	const needsLibrary = opts?.bundledSkillName === void 0 && (opts?.entries === void 0 || Boolean(getAgentWorkspaceAccess(workspaceDir, "loadSkills")?.loadSkills));
	return captureSkillLibraryPreparation(needsLibrary ? opts?.librarySelections ?? [] : [], assertCurrent);
}
async function prepareCapturedWorkspaceSkillEntries(workspaceDir, opts, preparation) {
	const { assertCurrent, libraryContext, librarySelections } = preparation;
	assertCurrent();
	const access = getAgentWorkspaceAccess(workspaceDir, "loadSkills");
	const bundledOnly = opts?.bundledSkillName !== void 0;
	if (!access?.loadSkills && !bundledOnly && opts?.entries !== void 0) return { entries: opts.entries };
	const libraryEntries = libraryContext ? await prepareSkillLibrarySelection(librarySelections, { env: libraryContext.environment }, assertCurrent) : [];
	assertCurrent();
	if (!access?.loadSkills) {
		const preparedPlan = await prepareSkillSourcePlan(workspaceDir, opts);
		const sourcePlan = preparedPlan.plan;
		const sources = await prepareLocalSkillSources({
			sourcePlan: opts?.gatewayOnly ? splitSkillSourcePlan(sourcePlan).gatewayPlan : sourcePlan,
			bundledSkillName: opts?.bundledSkillName,
			executionWorkspaceDir: opts?.workspaceOnly || opts?.gatewayOnly || bundledOnly ? void 0 : opts?.executionWorkspaceDir,
			limits: resolveSkillDiscoveryLimits(opts?.config),
			additionalBins: libraryEntries.flatMap(resolveSkillRequiredBins),
			status: opts?.status
		}, {
			watch: opts?.watch !== false && opts?.config?.skills?.load?.watch !== false,
			plan: {
				input: preparedPlan.input,
				...opts?.gatewayOnly ? { scope: "gateway" } : {}
			}
		});
		assertCurrent();
		return {
			entries: bundledOnly ? sources.entries : mergeSkillTiers({
				sourceKey: JSON.stringify(sourcePlan),
				agent: sources.entries,
				execution: sources.executionEntries
			}, opts, libraryEntries),
			runtime: sources.runtime,
			status: sources.status
		};
	}
	const { agentWorkspaceDir, executionWorkspaceDir } = normalizeWorkspaceSkillRoots({
		agentWorkspaceDir: workspaceDir,
		executionWorkspaceDir: opts?.executionWorkspaceDir,
		executionWorkspaceFileHost: opts?.executionWorkspaceFileHost
	});
	const preparedPlan = await prepareSkillSourcePlan(agentWorkspaceDir, opts);
	const { gatewayPlan, workspacePlan, gatewayExecutionWorkspaceDir, workspaceExecutionWorkspaceDir } = splitSkillSourcePlan(preparedPlan.plan, {
		executionWorkspaceDir,
		executionWorkspaceFileHost: opts?.executionWorkspaceFileHost
	});
	const gatewaySources = await prepareLocalSkillSources({
		sourcePlan: gatewayPlan,
		bundledSkillName: opts?.bundledSkillName,
		executionWorkspaceDir: opts?.workspaceOnly || bundledOnly ? void 0 : gatewayExecutionWorkspaceDir,
		limits: resolveSkillDiscoveryLimits(opts?.config),
		additionalBins: libraryEntries.flatMap(resolveSkillRequiredBins),
		status: opts?.status
	}, {
		watch: opts?.watch !== false && opts?.config?.skills?.load?.watch !== false,
		plan: {
			input: preparedPlan.input,
			scope: "gateway"
		}
	});
	assertCurrent();
	const onGateway = (entry) => ({
		...entry,
		skill: recordSkillFileHost({ ...entry.skill }, "gateway")
	});
	const gatewayEntries = gatewaySources.entries.map(onGateway);
	const gatewayExecutionEntries = gatewaySources.executionEntries.map(onGateway);
	const sources = await access.loadSkills({
		sourcePlan: bundledOnly ? {
			...workspacePlan,
			roots: []
		} : workspacePlan,
		executionWorkspaceDir: opts?.workspaceOnly || bundledOnly ? void 0 : workspaceExecutionWorkspaceDir,
		limits: resolveSkillDiscoveryLimits(opts?.config),
		additionalBins: [...new Set(libraryEntries.concat(gatewayEntries, gatewayExecutionEntries).concat(opts?.entries ?? []).flatMap(resolveSkillRequiredBins))],
		status: opts?.status
	});
	assertCurrent();
	const onWorkspace = (entry) => ({
		...entry,
		skill: recordSkillFileHost({ ...entry.skill }, "workspace")
	});
	const hostEntries = sources.entries.map(onWorkspace);
	const agentEntries = [...gatewayEntries, ...hostEntries].toSorted((left, right) => {
		const order = (entry) => entry.sourceOrder ?? Math.max(-1, ...workspacePlan.roots.filter((root) => root.source === entry.skill.source).map((root) => root.order ?? -1));
		return order(left) - order(right);
	});
	return {
		entries: bundledOnly ? gatewayEntries : opts?.entries ?? mergeSkillTiers({
			sourceKey: JSON.stringify([
				"remote",
				agentWorkspaceDir,
				executionWorkspaceDir
			]),
			agent: agentEntries,
			execution: gatewayExecutionWorkspaceDir ? gatewayExecutionEntries : sources.executionEntries.map(onWorkspace)
		}, opts, libraryEntries),
		runtime: sources.runtime,
		status: sources.status ? {
			...sources.status,
			files: [...gatewaySources.status?.files ?? [], ...sources.status.files]
		} : void 0
	};
}
/** Acquire host source tiers before the native node/execution/Library merge. */
async function prepareWorkspaceSkillEntries(workspaceDir, opts, assertCurrent) {
	const preparation = captureWorkspaceSkillPreparation(workspaceDir, opts, assertCurrent);
	const sources = await prepareCapturedWorkspaceSkillEntries(workspaceDir, opts, preparation);
	preparation.assertCurrent();
	return sources;
}
async function resolveWorkspaceSkillPromptEntries(workspaceDir, opts) {
	const { entries, skillFilter } = await prepareWorkspaceSkillSelection(workspaceDir, opts, "prompt", opts?.assertCurrent);
	return {
		eligible: entries,
		skillFilter
	};
}
async function prepareWorkspaceSkillSelection(workspaceDir, opts, mode, assertCurrent) {
	const preparation = captureWorkspaceSkillPreparation(workspaceDir, opts, assertCurrent);
	for (;;) {
		preparation.assertCurrent();
		const sourceVersion = getSkillsSourceVersion(workspaceDir, opts);
		let skillFilter = mode === "prompt" ? resolveEffectiveWorkspaceSkillFilter(opts) : void 0;
		const sources = await prepareCapturedWorkspaceSkillEntries(workspaceDir, opts, preparation);
		preparation.assertCurrent();
		const entries = sources.entries;
		if (mode === "runtime") {
			const selection = resolveWorkspaceSkillLoad(workspaceDir, opts, entries);
			skillFilter = selection.effectiveSkillFilter;
			if (!selection.shouldFilter) return {
				entries,
				skillFilter
			};
		}
		const probe = await prepareSkillBinaryProbe(entries, {
			...opts,
			skillFilter
		}, preparation.assertCurrent, getAgentWorkspaceAccess(workspaceDir, "loadSkills")?.loadSkills ? sources.runtime : void 0);
		preparation.assertCurrent();
		if (probe.needsRetry() || (mode === "runtime" || !opts?.entries) && getSkillsSourceVersion(workspaceDir, opts) !== sourceVersion) continue;
		const eligible = filterSkillEntries(entries, {
			...opts,
			skillFilter,
			hasBin: probe.hasBin,
			platform: sources.runtime?.platform
		});
		preparation.assertCurrent();
		if (probe.needsRetry()) continue;
		return {
			entries: eligible,
			skillFilter
		};
	}
}
function resolveWorkspaceSkillLoad(workspaceDir, opts, preparedEntries) {
	const roots = normalizeWorkspaceSkillRoots({
		agentWorkspaceDir: workspaceDir,
		executionWorkspaceDir: opts?.executionWorkspaceDir,
		executionWorkspaceFileHost: opts?.executionWorkspaceFileHost
	});
	const entries = preparedEntries ?? mergeSkillTiers(loadLocalSkillTiers(roots.agentWorkspaceDir, opts), opts);
	const effectiveSkillFilter = resolveEffectiveWorkspaceSkillFilter(opts);
	return {
		entries,
		effectiveSkillFilter,
		shouldFilter: Boolean(roots.executionWorkspaceDir) || effectiveSkillFilter !== void 0 || opts?.skillOverrides !== void 0 || opts?.eligibility !== void 0
	};
}
/** Runtime preparation shares discovery and filtering with synchronous SDK inventory reads. */
async function prepareWorkspaceSkills(workspaceDir, opts, assertCurrent) {
	return (await prepareWorkspaceSkillSelection(workspaceDir, opts, "runtime", assertCurrent)).entries;
}
function loadWorkspaceSkills(workspaceDir, opts) {
	const { entries, effectiveSkillFilter, shouldFilter } = resolveWorkspaceSkillLoad(workspaceDir, opts);
	if (!shouldFilter) return entries;
	return filterSkillEntries(entries, {
		...opts,
		skillFilter: effectiveSkillFilter
	});
}
function loadVisibleSkills(workspaceDir, opts) {
	const entries = mergeSkillTiers(loadLocalSkillTiers(workspaceDir, opts), opts);
	const effectiveSkillFilter = resolveEffectiveWorkspaceSkillFilter(opts);
	return filterSkillEntries(entries, {
		...opts,
		skillFilter: effectiveSkillFilter
	});
}
//#endregion
export { resolveWorkspaceSkillPromptEntries as a, prepareWorkspaceSkills as i, loadWorkspaceSkills as n, filterSkillEntries as o, prepareWorkspaceSkillEntries as r, loadVisibleSkills as t };
