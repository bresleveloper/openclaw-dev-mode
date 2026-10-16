import "./src-CdRlGRnW.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { t as redactConfigObject } from "./redact-snapshot-Ds6C-7Ba.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import "./session-key-C09ow4h0.mjs";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-C9pW4xqI.mjs";
import { a as normalizeSkillFilter, n as resolveEffectiveAgentSkillFilter, t as isSessionSkillEnabled } from "./agent-filter-KIvrTe_y.mjs";
import { i as getAgentWorkspaceAccess } from "./workspace-access-CeRsYrid.mjs";
import { t as resolveSkillSource } from "./source-DbWOnpPI.mjs";
import { r as recordSkillFileHost } from "./skill-file-host-CJXc2mOP.mjs";
import { t as canonicalizePath } from "./paths-DqLuHi-X.mjs";
import { r as resolveSkillKey } from "./frontmatter-CrckYGsg.mjs";
import { a as prepareSkillLibrarySelection, i as loadSkillLibrarySelection, n as captureSkillLibrarySelection } from "./selection-Cr4O9thc.mjs";
import { m as assertUnambiguousManagedSkillNames } from "./store-BeSK43aH.mjs";
import { t as normalizeWorkspaceSkillRoots } from "./workspace-skill-roots-CL28VeX5.mjs";
import { i as getSkillsSourceVersion, s as observeSkillsSnapshotSource } from "./refresh-state-CRa-OKC_.mjs";
import { t as resolveBundledSkillsDir } from "./bundled-dir-mhSRaiLk.mjs";
import { n as hasBinary } from "./config-eval-DAVG8wM7.mjs";
import { o as prepareSkillBinaryProbe, s as resolveBundledAllowlist, u as shouldIncludeSkill } from "./config-EAfnzCK1.mjs";
import { f as readClawHubSkillsLockfileStatusSync } from "./clawhub-store-CKsiNVqc.mjs";
import { a as resolveLocalSkillCardStatusSync, n as readLocalSkillCardContentSync, r as resolveClawHubSkillStatusLinkSync } from "./clawhub-status-Cf275ONq.mjs";
import { t as mergeRemoteNodeSkillEntries } from "./remote-skills-CVJsA9ab.mjs";
import { c as loadSingleSkillDirectory, i as resolveSkillsUserHomeDir, r as resolvePluginSkillsDir, s as tryRealpath } from "./skill-paths-BxFt63--.mjs";
import { d as appendLowerPrecedenceSkillRecords, f as mergeSkillRecords, l as loadWorkspaceSkillSourceEntries, m as createSkillEntry, p as reportSkillPrecedenceCollisions, s as loadExecutionSkillEntries, u as warnInvalidSkill } from "./plugin-skills-BVTLcXRM.mjs";
import { a as resolveSkillDiscoveryLimits } from "./skill-root-discovery-Br--9LSl.mjs";
import { n as resolveWorkspaceSkillSourcePlan, r as splitSkillSourcePlan, t as resolveCustodianSkillAgentId } from "./workspace-skill-sources-C_PbN8z1.mjs";
import path from "node:path";
//#region src/skills/discovery/status-files.ts
/** Read beside the skill files; Gateway configuration still determines eligibility. */
function readWorkspaceSkillStatusFacts(params) {
	const workspaceLock = readClawHubSkillsLockfileStatusSync(params.workspaceDir);
	const managedParent = path.dirname(path.resolve(params.managedSkillsDir));
	const managedLock = managedParent === path.resolve(params.workspaceDir) ? workspaceLock : readClawHubSkillsLockfileStatusSync(managedParent);
	return {
		workspaceDir: params.workspaceDir,
		managedSkillsDir: params.managedSkillsDir,
		files: params.entries.map((entry) => {
			const source = resolveSkillSource(entry.skill);
			const bundled = source === "openclaw-bundled" || source === "openclaw-custodian";
			const managed = source === "openclaw-managed";
			const skillKey = resolveSkillKey(entry.skill, entry);
			const clawhub = params.workspaceDir && !bundled ? resolveClawHubSkillStatusLinkSync({
				workspaceDir: managed ? managedParent : params.workspaceDir,
				skillDir: entry.skill.baseDir,
				skillKey,
				lockRead: managed ? managedLock : workspaceLock,
				lockfileScope: managed ? "managed" : "workspace"
			}) : void 0;
			const card = resolveLocalSkillCardStatusSync(entry.skill.baseDir);
			const content = card && params.skillCardKey === skillKey ? readLocalSkillCardContentSync(entry.skill.baseDir) : void 0;
			return {
				name: entry.skill.name,
				filePath: entry.skill.filePath,
				...clawhub ? { clawhub } : {},
				...card ? { skillCard: {
					...card,
					...content !== void 0 ? { content } : {}
				} } : {}
			};
		})
	};
}
//#endregion
//#region src/skills/runtime/snapshot-config-fingerprint.ts
let configFingerprints = /* @__PURE__ */ new WeakMap();
function fingerprintSkillSnapshotConfig(config) {
	const cached = configFingerprints.get(config);
	if (cached) return cached;
	const fingerprint = sha256Hex(stableStringify(redactConfigObject(config)));
	configFingerprints.set(config, fingerprint);
	return fingerprint;
}
function resetSkillSnapshotConfigFingerprintCache() {
	configFingerprints = /* @__PURE__ */ new WeakMap();
}
//#endregion
//#region src/skills/loading/workspace-skill-filter.ts
const skillsLogger = createSubsystemLogger("skills");
function filterSkillEntries(entries, opts) {
	const { config, skillFilter, skillOverrides, eligibility, hasBin, platform } = opts ?? {};
	const bundledAllowlist = resolveBundledAllowlist(config);
	assertUnambiguousManagedSkillNames(entries);
	const normalized = normalizeSkillFilter(skillFilter);
	const filtered = entries.filter((entry) => isSessionSkillEnabled(entry.skill.name, normalized, skillOverrides, resolveSkillKey(entry.skill, entry)) && shouldIncludeSkill({
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
/** Run on the workspace host using an admitted source plan and native discovery limits. */
function readWorkspaceSkillSources(request) {
	const config = { skills: {
		limits: request.limits,
		load: { allowSymlinkTargets: request.sourcePlan.allowSymlinkTargets }
	} };
	const entries = request.bundledSkillName !== void 0 ? readBundledSkillEntries(request.bundledSkillName, {
		config,
		bundledSkillsDir: request.sourcePlan.bundledSkillsDir
	}) : loadWorkspaceSkillSourceEntries(request.sourcePlan, config);
	const executionEntries = request.executionWorkspaceDir ? loadExecutionSkillEntries(request.executionWorkspaceDir, config) : [];
	const bins = [.../* @__PURE__ */ new Set([
		"brew",
		"npm",
		"pnpm",
		"yarn",
		"bun",
		"uv",
		"go",
		...request.additionalBins,
		...entries.concat(executionEntries).flatMap((entry) => (entry.metadata?.requires?.bins ?? []).concat(entry.metadata?.requires?.anyBins ?? []))
	])].filter(hasBinary).toSorted();
	return {
		entries,
		executionEntries,
		runtime: {
			platform: process.platform,
			bins
		},
		...request.status ? { status: readWorkspaceSkillStatusFacts({
			entries,
			workspaceDir: request.sourcePlan.workspaceDir,
			managedSkillsDir: request.sourcePlan.managedSkillsDir,
			skillCardKey: request.status.skillCardKey
		}) } : {}
	};
}
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
		const collisions = [];
		agentTier = {
			agent: loadWorkspaceSkillSourceEntries(opts?.gatewayOnly ? splitSkillSourcePlan(plan).gatewayPlan : plan, opts?.config, collisions),
			collisions
		};
		agentSkillEntryCache.set(agentCacheKey, agentTier);
		pruneMapToMaxSize(agentSkillEntryCache, MAX_SKILL_ENTRY_CACHE_SIZE);
	}
	const collisions = [...agentTier.collisions];
	const entries = {
		sourceKey,
		collisions,
		agent: agentTier.agent,
		execution: executionWorkspaceDir && !workspaceOnly && !opts?.gatewayOnly ? loadExecutionSkillEntries(executionWorkspaceDir, opts?.config, collisions) : []
	};
	skillEntryCache.set(cacheKey, entries);
	pruneMapToMaxSize(skillEntryCache, MAX_SKILL_ENTRY_CACHE_SIZE);
	const winners = appendLowerPrecedenceSkillRecords([...entries.agent], entries.execution, (winner, loser) => {
		if (canonicalizePath(winner.skill.filePath) !== canonicalizePath(loser.skill.filePath)) collisions.push({
			winner: winner.skill,
			loser: loser.skill
		});
	});
	const sourceOptions = {
		executionWorkspaceDir,
		executionWorkspaceFileHost: opts?.executionWorkspaceFileHost,
		workspaceOnly,
		gatewayOnly: opts?.gatewayOnly,
		agentId: opts?.agentId,
		config: opts?.config,
		managedSkillsDir: opts?.managedSkillsDir,
		bundledSkillsDir: opts?.bundledSkillsDir,
		pluginSkillsDir: opts?.pluginSkillsDir,
		pluginMetadataSnapshot: opts?.pluginMetadataSnapshot
	};
	observeSkillsSnapshotSource({
		workspaceDir,
		sourceKey,
		sourceScope: sourceOptions,
		entries: winners.toSorted((a, b) => a.skill.name.localeCompare(b.skill.name, "en")).map((entry) => ({
			skill: entry.skill,
			skillKey: resolveSkillKey(entry.skill, entry)
		})),
		reconcile: (inputs) => {
			if (inputs) {
				sourceOptions.config = inputs.config;
				sourceOptions.pluginMetadataSnapshot = inputs.pluginMetadataSnapshot;
			}
			return loadLocalSkillTiers(workspaceDir, sourceOptions).sourceKey;
		},
		suspend: () => {
			sourceOptions.config = void 0;
			sourceOptions.pluginMetadataSnapshot = void 0;
		}
	});
	return entries;
}
function mergeSkillTiers(tiers, opts, libraryEntries = opts?.librarySelections?.length ? loadSkillLibrarySelection(opts.librarySelections) : []) {
	const entries = mergeRemoteNodeSkillEntries(tiers.agent, opts?.eligibility?.nodeSkills);
	const collisions = [...tiers.collisions];
	if (tiers.execution.length > 0) {
		const localNames = new Set(tiers.agent.map((entry) => entry.skill.name));
		appendLowerPrecedenceSkillRecords(entries, tiers.execution, (winner, loser) => {
			if (!localNames.has(loser.skill.name)) collisions.push({
				winner: winner.skill,
				loser: loser.skill
			});
		});
	}
	reportSkillPrecedenceCollisions(collisions, tiers.sourceKey);
	entries.push(...libraryEntries);
	return entries;
}
/** Keep Library pins and physical read authority fixed across workspace discovery retries. */
function captureWorkspaceSkillPreparation(workspaceDir, opts, assertCurrent) {
	assertCurrent?.();
	const needsLibrary = opts?.bundledSkillName === void 0 && (opts?.entries === void 0 || Boolean(getAgentWorkspaceAccess(workspaceDir, "loadSkills")?.loadSkills));
	const librarySelections = captureSkillLibrarySelection(needsLibrary ? opts?.librarySelections ?? [] : []);
	const libraryContext = librarySelections.length ? captureOpenClawStateWorkerContext() : void 0;
	return {
		librarySelections,
		libraryContext,
		assertCurrent: () => {
			assertCurrent?.();
			libraryContext?.maintenanceScope?.assertAdmission();
			libraryContext?.admission.assertCurrent();
		}
	};
}
async function prepareCapturedWorkspaceSkillEntries(workspaceDir, opts, preparation) {
	const { assertCurrent, libraryContext, librarySelections } = preparation;
	assertCurrent();
	const access = getAgentWorkspaceAccess(workspaceDir, "loadSkills");
	if (!access?.loadSkills && opts?.bundledSkillName !== void 0) return { entries: readBundledSkillEntries(opts.bundledSkillName, opts) };
	if (!access?.loadSkills && opts?.entries !== void 0) return { entries: opts.entries };
	const libraryEntries = libraryContext ? await prepareSkillLibrarySelection(librarySelections, { env: libraryContext.environment }, assertCurrent) : [];
	assertCurrent();
	if (!access?.loadSkills) return { entries: mergeSkillTiers(loadLocalSkillTiers(workspaceDir, opts), opts, libraryEntries) };
	const bundledOnly = opts?.bundledSkillName !== void 0;
	const { agentWorkspaceDir, executionWorkspaceDir } = normalizeWorkspaceSkillRoots({
		agentWorkspaceDir: workspaceDir,
		executionWorkspaceDir: opts?.executionWorkspaceDir,
		executionWorkspaceFileHost: opts?.executionWorkspaceFileHost
	});
	const { gatewayPlan, workspacePlan, gatewayExecutionWorkspaceDir, workspaceExecutionWorkspaceDir } = splitSkillSourcePlan(resolveWorkspaceSkillSourcePlan(agentWorkspaceDir, opts), {
		executionWorkspaceDir,
		executionWorkspaceFileHost: opts?.executionWorkspaceFileHost
	});
	const gatewaySourceEntries = bundledOnly ? readBundledSkillEntries(opts.bundledSkillName, opts) : loadWorkspaceSkillSourceEntries(gatewayPlan, opts?.config);
	const onGateway = (entry) => ({
		...entry,
		skill: recordSkillFileHost({ ...entry.skill }, "gateway")
	});
	const gatewayEntries = gatewaySourceEntries.map(onGateway);
	const gatewayExecutionEntries = gatewayExecutionWorkspaceDir && !opts?.workspaceOnly && !bundledOnly ? loadExecutionSkillEntries(gatewayExecutionWorkspaceDir, opts?.config).map(onGateway) : [];
	const sources = await access.loadSkills({
		sourcePlan: bundledOnly ? {
			...workspacePlan,
			roots: []
		} : workspacePlan,
		executionWorkspaceDir: opts?.workspaceOnly || bundledOnly ? void 0 : workspaceExecutionWorkspaceDir,
		limits: resolveSkillDiscoveryLimits(opts?.config),
		additionalBins: [...new Set(libraryEntries.concat(gatewayEntries, gatewayExecutionEntries).concat(opts?.entries ?? []).flatMap((entry) => (entry.metadata?.requires?.bins ?? []).concat(entry.metadata?.requires?.anyBins ?? [])))],
		status: opts?.status
	});
	assertCurrent();
	const onWorkspace = (entry) => ({
		...entry,
		skill: recordSkillFileHost({ ...entry.skill }, "workspace")
	});
	const hostEntries = sources.entries.map(onWorkspace);
	const agentEntries = mergeSkillRecords([...gatewayEntries, ...hostEntries].toSorted((left, right) => {
		const order = (entry) => entry.sourceOrder ?? Math.max(-1, ...workspacePlan.roots.filter((root) => root.source === entry.skill.source).map((root) => root.order ?? -1));
		return order(left) - order(right);
	}), JSON.stringify(["remote-agent", agentWorkspaceDir]));
	return {
		entries: bundledOnly ? gatewayEntries : opts?.entries ?? mergeSkillTiers({
			sourceKey: JSON.stringify([
				"remote",
				agentWorkspaceDir,
				executionWorkspaceDir
			]),
			agent: agentEntries,
			execution: gatewayExecutionWorkspaceDir ? gatewayExecutionEntries : sources.executionEntries.map(onWorkspace),
			collisions: []
		}, opts, libraryEntries),
		runtime: sources.runtime,
		status: sources.status
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
		}, preparation.assertCurrent, sources.runtime);
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
/** Read a single bundle with the same boundary and file limits as local discovery. */
function readBundledSkillEntries(skillName, opts) {
	const normalizedName = skillName.trim().toLowerCase();
	if (!/^[a-z0-9][a-z0-9-]*$/u.test(normalizedName)) return [];
	const bundledSkillsDir = opts?.bundledSkillsDir ?? resolveBundledSkillsDir();
	const rootRealPath = bundledSkillsDir ? tryRealpath(bundledSkillsDir) : void 0;
	if (!rootRealPath) return [];
	const limits = resolveSkillDiscoveryLimits(opts?.config);
	const loaded = loadSingleSkillDirectory({
		skillDir: path.join(rootRealPath, normalizedName),
		source: "openclaw-bundled",
		rootRealPath,
		maxBytes: limits.maxSkillFileBytes,
		rejectHardlinks: shouldRejectHardlinkedPluginFiles({
			origin: "bundled",
			rootDir: rootRealPath
		}),
		onDiagnostic: (diagnostic) => warnInvalidSkill("openclaw-bundled", diagnostic)
	});
	if (!loaded || loaded.skill.name.trim().toLowerCase() !== normalizedName) return [];
	return [createSkillEntry(loaded)];
}
//#endregion
export { readWorkspaceSkillSources as a, fingerprintSkillSnapshotConfig as c, prepareWorkspaceSkills as i, resetSkillSnapshotConfigFingerprintCache as l, loadWorkspaceSkills as n, resolveWorkspaceSkillPromptEntries as o, prepareWorkspaceSkillEntries as r, filterSkillEntries as s, loadVisibleSkills as t, readWorkspaceSkillStatusFacts as u };
