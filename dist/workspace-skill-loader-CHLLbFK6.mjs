import "./src-CZ2wJvNB.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import "./session-key-CBvmC8zz.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { n as sha256Hex } from "./node-crypto-Df3MIs6V.mjs";
import "./crypto-digest-D9Nqq3c7.mjs";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-DhqUNG6g.mjs";
import { u as readRootJsonObjectSync } from "./json-files-C0HSMh2Z.mjs";
import { a as normalizeSkillFilter, n as resolveEffectiveAgentSkillFilter, t as isSessionSkillEnabled } from "./agent-filter-Cseetb4e.mjs";
import { t as redactConfigObject } from "./redact-snapshot-uX3ICFnt.mjs";
import { i as getAgentWorkspaceAccess } from "./workspace-access-BNUXOhfF.mjs";
import { t as resolveSkillSource } from "./source-BwY_Vy9W.mjs";
import { t as canonicalizePath } from "./paths-CIwQeLl6.mjs";
import { n as hasBinary } from "./config-eval-BOec6g4L.mjs";
import { i as resolveSkillManifestMetadata, n as resolveSkillInvocationPolicy, r as resolveSkillKey } from "./frontmatter-2H_F0IFB.mjs";
import { o as prepareSkillBinaryProbe, s as resolveBundledAllowlist, u as shouldIncludeSkill } from "./config-oZlvXJO6.mjs";
import { a as resolvePluginSkillsDir, i as compactSkillPath, o as resolveSkillsUserHomeDir, t as loadSingleSkillDirectory, u as tryRealpath } from "./local-loader-DP-Jr6_I.mjs";
import { f as readClawHubSkillsLockfileStatusSync } from "./clawhub-store-CLSS382v.mjs";
import { a as resolveLocalSkillCardStatusSync, n as readLocalSkillCardContentSync, r as resolveClawHubSkillStatusLinkSync } from "./clawhub-status-DVwv_3mo.mjs";
import { T as assertUnambiguousManagedSkillNames, i as loadSkillLibrarySelection } from "./selection-DRWWbX7-.mjs";
import { f as normalizeWorkspaceSkillRoots, i as getSkillsSourceVersion, o as observeSkillsSnapshotSource, p as resolveWorkspaceSkillDirectories } from "./refresh-state-NJJr9z6k.mjs";
import { t as mergeRemoteNodeSkillEntries } from "./remote-skills-CZuGGEXx.mjs";
import { t as resolveBundledSkillsDir } from "./bundled-dir-BA8EutwF.mjs";
import { a as SKILL_SOURCE_ORIGIN_RELATIVE_PATH, n as resolveWorkspaceSkillSourcePlan, r as splitSkillSourcePlan, t as resolveCustodianSkillAgentId } from "./workspace-skill-sources-nBU_kpUU.mjs";
import { a as resolveSkillDiscoveryLimits } from "./skill-root-discovery-DZF8sfp6.mjs";
import { c as loadSkillRootRecords, l as warnInvalidSkill, s as loadGeneratedPluginSkillRecords } from "./plugin-skills-CnAdRDnb.mjs";
import path from "node:path";
import crypto from "node:crypto";
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
	const fingerprint = crypto.createHash("sha256").update(stableStringify(redactConfigObject(config))).digest("hex");
	configFingerprints.set(config, fingerprint);
	return fingerprint;
}
function resetSkillSnapshotConfigFingerprintCache() {
	configFingerprints = /* @__PURE__ */ new WeakMap();
}
//#endregion
//#region src/skills/loading/skill-entry-metadata.ts
const MAX_SKILL_SOURCE_ORIGIN_BYTES = 16384;
function readSourceInstallSkillKey(skillDir) {
	try {
		const sourceOriginPath = path.join(skillDir, SKILL_SOURCE_ORIGIN_RELATIVE_PATH);
		const parentRealPath = tryRealpath(path.dirname(sourceOriginPath));
		if (!parentRealPath) return;
		const skillDirRealPath = tryRealpath(skillDir);
		if (!skillDirRealPath) return;
		const result = readRootJsonObjectSync({
			rootDir: skillDirRealPath,
			rootRealPath: skillDirRealPath,
			relativePath: path.relative(skillDirRealPath, path.join(parentRealPath, path.basename(sourceOriginPath))),
			boundaryLabel: "skill directory",
			rejectHardlinks: false,
			maxBytes: MAX_SKILL_SOURCE_ORIGIN_BYTES
		});
		return result.ok ? normalizeOptionalString(result.value.slug) : void 0;
	} catch {
		return;
	}
}
function resolveSkillEntryMetadata(params) {
	const metadata = resolveSkillManifestMetadata(params.frontmatter);
	if (metadata?.skillKey) return metadata;
	const sourceInstallSkillKey = readSourceInstallSkillKey(params.skillDir);
	if (!sourceInstallSkillKey) return metadata;
	return {
		...metadata,
		skillKey: sourceInstallSkillKey
	};
}
//#endregion
//#region src/skills/loading/skill-precedence.ts
const skillsLogger$1 = createSubsystemLogger("skills");
const reportedSkillCollisions = /* @__PURE__ */ new Set();
function warnSkillPrecedenceCollisions(collisions) {
	for (const { winner, loser } of collisions) {
		if (winner.contentHash && winner.contentHash === loser.contentHash && winner.name === loser.name && winner.description === loser.description && winner.disableModelInvocation === loser.disableModelInvocation) continue;
		const fingerprint = sha256Hex(JSON.stringify([winner, loser].map((skill) => [
			skill.name,
			skill.contentHash ?? skill.filePath,
			skill.description,
			skill.disableModelInvocation
		])));
		if (reportedSkillCollisions.has(fingerprint)) continue;
		reportedSkillCollisions.add(fingerprint);
		warnSkillPrecedenceCollision(winner, loser);
	}
}
function warnSkillPrecedenceCollision(winner, loser) {
	const collisionName = winner.name.slice(0, 128);
	skillsLogger$1.warn("Skill precedence collision resolved.", {
		skill: collisionName,
		winnerSource: winner.source,
		loserSource: loser.source,
		winnerPath: winner.filePath,
		loserPath: loser.filePath,
		consoleMessage: `Skill precedence collision: skill="${collisionName}" winner=${winner.source}:${compactSkillPath(winner.filePath)} loser=${loser.source}:${compactSkillPath(loser.filePath)}`
	});
}
function mergeSkillRecords(records, collisions) {
	const discoveredCollisions = collisions ?? [];
	const merged = /* @__PURE__ */ new Map();
	for (const record of records) {
		const replaced = merged.get(record.skill.name);
		if (replaced && canonicalizePath(record.skill.filePath) !== canonicalizePath(replaced.skill.filePath)) discoveredCollisions.push({
			winner: record.skill,
			loser: replaced.skill
		});
		merged.set(record.skill.name, record);
	}
	if (!collisions) warnSkillPrecedenceCollisions(discoveredCollisions);
	return [...merged.values()].toSorted((a, b) => a.skill.name.localeCompare(b.skill.name, "en"));
}
//#endregion
//#region src/skills/loading/workspace-skill-loader.ts
const skillsLogger = createSubsystemLogger("skills");
const MAX_SKILL_ENTRY_CACHE_SIZE = 64;
const skillEntryCache = /* @__PURE__ */ new Map();
function filterSkillEntries(entries, config, skillFilter, skillOverrides, eligibility, hasBin, platform) {
	const bundledAllowlist = resolveBundledAllowlist(config);
	assertUnambiguousManagedSkillNames(entries);
	let filtered = entries.filter((entry) => shouldIncludeSkill({
		entry,
		config,
		bundledAllowlist,
		eligibility,
		hasBin,
		platform
	}));
	if (skillFilter !== void 0 || skillOverrides !== void 0) {
		const normalized = normalizeSkillFilter(skillFilter) ?? [];
		const label = normalized.length > 0 ? normalized.join(", ") : "(none)";
		skillsLogger.debug(`Applying skill filter: ${label}`);
		const resolvedFilter = skillFilter === void 0 ? void 0 : normalized;
		filtered = filtered.filter((entry) => isSessionSkillEnabled(entry.skill.name, resolvedFilter, skillOverrides, resolveSkillKey(entry.skill, entry)));
		skillsLogger.debug(`After skill filter: ${filtered.map((entry) => entry.skill.name).join(", ") || "(none)"}`);
	}
	return filtered;
}
function createSkillEntry(record) {
	const { skill, frontmatter } = record;
	const invocation = resolveSkillInvocationPolicy(frontmatter);
	const entry = {
		...record.sourceOrder !== void 0 ? { sourceOrder: record.sourceOrder } : {},
		skill,
		frontmatter,
		metadata: resolveSkillEntryMetadata({
			frontmatter,
			skillDir: skill.baseDir
		}),
		invocation,
		exposure: {
			includeInRuntimeRegistry: true,
			includeInAvailableSkillsPrompt: !invocation.disableModelInvocation,
			userInvocable: invocation.userInvocable ?? true
		}
	};
	if (record.syncSourceDir !== void 0) entry.syncSourceDir = record.syncSourceDir;
	if (record.syncDirName !== void 0) entry.syncDirName = record.syncDirName;
	return entry;
}
/** Scan selected roots on their owning host, retaining native precedence and file rules. */
function loadWorkspaceSkillSourceEntries(plan, config, collisions) {
	const grouped = /* @__PURE__ */ new Map();
	for (const root of plan.roots) {
		const records = grouped.get(root.tier) ?? [];
		for (const record of loadSkillRootRecords({
			...root,
			config
		})) records.push(Object.assign({}, record, { sourceOrder: root.order }));
		grouped.set(root.tier, records);
	}
	const extra = grouped.get("extra") ?? [];
	if (plan.pluginSkillsDir) for (const record of loadGeneratedPluginSkillRecords({
		pluginSkillsDir: plan.pluginSkillsDir,
		pluginSkillRoots: plan.pluginSkillRoots,
		source: "openclaw-extra",
		limits: resolveSkillDiscoveryLimits(config)
	})) extra.push(Object.assign({}, record, { sourceOrder: (plan.roots.find((root) => root.tier !== "extra")?.order ?? Math.max(-1, ...plan.roots.map((root) => root.order ?? -1)) + 1) - .5 }));
	grouped.set("extra", extra);
	grouped.get("bundled")?.sort((left, right) => left.skill.name.localeCompare(right.skill.name, "en") || left.skill.source.localeCompare(right.skill.source, "en"));
	return mergeSkillRecords([
		"extra",
		"bundled",
		"workshop",
		"managed",
		"personal",
		"workspace"
	].flatMap((tier) => grouped.get(tier) ?? []), collisions).map(createSkillEntry);
}
function loadExecutionSkillEntries(executionWorkspaceDir, config, collisions) {
	return mergeSkillRecords(resolveWorkspaceSkillDirectories(executionWorkspaceDir).flatMap((root) => loadSkillRootRecords({
		...root,
		config
	})), collisions).map(createSkillEntry);
}
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
		executionWorkspaceDir: opts?.executionWorkspaceDir
	});
	const custodianAgentId = resolveCustodianSkillAgentId(opts?.config, opts?.agentId, workspaceOnly);
	const osHomeDir = resolveSkillsUserHomeDir();
	const pluginSkillsDir = opts?.pluginSkillsDir ?? resolvePluginSkillsDir();
	const sourceKey = JSON.stringify([
		workspaceDir,
		executionWorkspaceDir,
		workspaceOnly,
		opts?.gatewayOnly,
		opts?.agentId ? normalizeAgentId(opts.agentId) : void 0,
		custodianAgentId,
		opts?.managedSkillsDir,
		opts?.bundledSkillsDir,
		pluginSkillsDir,
		osHomeDir,
		process.env.OPENCLAW_STATE_DIR
	]);
	const cacheKey = JSON.stringify([
		sourceKey,
		opts?.config ? fingerprintSkillSnapshotConfig(opts.config) : void 0,
		getSkillsSourceVersion(workspaceDir, opts)
	]);
	const cachedEntries = skillEntryCache.get(cacheKey);
	if (cachedEntries) return cachedEntries;
	const plan = resolveWorkspaceSkillSourcePlan(workspaceDir, opts);
	const collisions = [];
	const entries = {
		sourceKey,
		collisions,
		agent: loadWorkspaceSkillSourceEntries(opts?.gatewayOnly ? splitSkillSourcePlan(plan).gatewayPlan : plan, opts?.config, collisions),
		execution: executionWorkspaceDir && !workspaceOnly && !opts?.gatewayOnly ? loadExecutionSkillEntries(executionWorkspaceDir, opts?.config, collisions) : []
	};
	skillEntryCache.set(cacheKey, entries);
	pruneMapToMaxSize(skillEntryCache, MAX_SKILL_ENTRY_CACHE_SIZE);
	const winners = new Map(entries.agent.map((entry) => [entry.skill.name, entry]));
	for (const entry of entries.execution) {
		const winner = winners.get(entry.skill.name);
		if (!winner) winners.set(entry.skill.name, entry);
		else if (canonicalizePath(winner.skill.filePath) !== canonicalizePath(entry.skill.filePath)) collisions.push({
			winner: winner.skill,
			loser: entry.skill
		});
	}
	const sourceOptions = {
		executionWorkspaceDir,
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
		entries: Array.from(winners.values()).toSorted((a, b) => a.skill.name.localeCompare(b.skill.name, "en")).map((entry) => ({
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
function loadSkillEntries(workspaceDir, opts) {
	return mergeSkillTiers(loadLocalSkillTiers(workspaceDir, opts), opts);
}
function mergeSkillTiers(tiers, opts, libraryEntries = opts?.librarySelections?.length ? loadSkillLibrarySelection(opts.librarySelections) : []) {
	const entries = mergeRemoteNodeSkillEntries(tiers.agent, opts?.eligibility?.nodeSkills);
	const collisions = [...tiers.collisions];
	if (tiers.execution.length > 0) {
		const agentByName = new Map(entries.map((entry) => [entry.skill.name, entry]));
		const localNames = new Set(tiers.agent.map((entry) => entry.skill.name));
		for (const entry of tiers.execution) {
			const agentEntry = agentByName.get(entry.skill.name);
			if (agentEntry) {
				if (!localNames.has(entry.skill.name)) collisions.push({
					winner: agentEntry.skill,
					loser: entry.skill
				});
			} else entries.push(entry);
		}
	}
	warnSkillPrecedenceCollisions(collisions);
	entries.push(...libraryEntries);
	return entries;
}
/** Acquire host source tiers before the native node/execution/Library merge. */
async function prepareWorkspaceSkillEntries(workspaceDir, opts, assertCurrent) {
	assertCurrent?.();
	const access = getAgentWorkspaceAccess(workspaceDir, "loadSkills");
	if (!access?.loadSkills) return { entries: opts?.bundledSkillName !== void 0 ? readBundledSkillEntries(opts.bundledSkillName, opts) : opts?.entries ?? loadSkillEntries(workspaceDir, opts) };
	const bundledOnly = opts?.bundledSkillName !== void 0;
	const libraryEntries = !bundledOnly && opts?.librarySelections?.length ? loadSkillLibrarySelection(opts.librarySelections) : [];
	const { agentWorkspaceDir, executionWorkspaceDir } = normalizeWorkspaceSkillRoots({
		agentWorkspaceDir: workspaceDir,
		executionWorkspaceDir: opts?.executionWorkspaceDir
	});
	const { gatewayPlan, workspacePlan } = splitSkillSourcePlan(resolveWorkspaceSkillSourcePlan(agentWorkspaceDir, opts));
	const gatewaySourceEntries = bundledOnly ? readBundledSkillEntries(opts.bundledSkillName, opts) : loadWorkspaceSkillSourceEntries(gatewayPlan, opts?.config);
	const gatewayEntries = [];
	for (const entry of gatewaySourceEntries) gatewayEntries.push({
		...entry,
		skill: {
			...entry.skill,
			fileHost: "gateway"
		}
	});
	const sources = await access.loadSkills({
		sourcePlan: bundledOnly ? {
			...workspacePlan,
			roots: []
		} : workspacePlan,
		executionWorkspaceDir: opts?.workspaceOnly || bundledOnly ? void 0 : executionWorkspaceDir,
		limits: resolveSkillDiscoveryLimits(opts?.config),
		additionalBins: [...new Set(libraryEntries.concat(gatewayEntries).concat(opts?.entries ?? []).flatMap((entry) => (entry.metadata?.requires?.bins ?? []).concat(entry.metadata?.requires?.anyBins ?? [])))],
		status: opts?.status
	});
	assertCurrent?.();
	const onWorkspace = (entry) => ({
		...entry,
		skill: {
			...entry.skill,
			fileHost: "workspace"
		}
	});
	const hostEntries = sources.entries.map(onWorkspace);
	const agentEntries = mergeSkillRecords([...gatewayEntries, ...hostEntries].toSorted((left, right) => {
		const order = (entry) => entry.sourceOrder ?? Math.max(-1, ...workspacePlan.roots.filter((root) => root.source === entry.skill.source).map((root) => root.order ?? -1));
		return order(left) - order(right);
	}));
	return {
		entries: bundledOnly ? gatewayEntries : opts?.entries ?? mergeSkillTiers({
			agent: agentEntries,
			execution: sources.executionEntries.map(onWorkspace),
			collisions: []
		}, opts, libraryEntries),
		runtime: sources.runtime,
		status: sources.status
	};
}
function resolveEffectiveWorkspaceSkillFilter(opts) {
	if (opts?.skillFilter !== void 0) return normalizeSkillFilter(opts.skillFilter);
	if (opts?.agentSkillFilter === "ignore" || !opts?.config || !opts.agentId) return;
	return resolveEffectiveAgentSkillFilter(opts.config, opts.agentId);
}
async function resolveWorkspaceSkillPromptEntries(workspaceDir, opts) {
	for (;;) {
		opts?.assertCurrent?.();
		const sourceVersion = getSkillsSourceVersion(workspaceDir, opts);
		const skillFilter = resolveEffectiveWorkspaceSkillFilter(opts);
		const sources = await prepareWorkspaceSkillEntries(workspaceDir, opts, opts?.assertCurrent);
		const skillEntries = sources.entries;
		const probe = await prepareSkillBinaryProbe(skillEntries, opts, opts?.assertCurrent, sources.runtime);
		if (probe.needsRetry() || !opts?.entries && getSkillsSourceVersion(workspaceDir, opts) !== sourceVersion) continue;
		const eligible = filterSkillEntries(skillEntries, opts?.config, skillFilter, opts?.skillOverrides, opts?.eligibility, probe.hasBin, sources.runtime?.platform);
		opts?.assertCurrent?.();
		if (probe.needsRetry()) continue;
		return {
			eligible,
			skillFilter
		};
	}
}
function resolveWorkspaceSkillLoad(workspaceDir, opts, preparedEntries) {
	const roots = normalizeWorkspaceSkillRoots({
		agentWorkspaceDir: workspaceDir,
		executionWorkspaceDir: opts?.executionWorkspaceDir
	});
	const entries = preparedEntries ?? loadSkillEntries(roots.agentWorkspaceDir, opts);
	const effectiveSkillFilter = resolveEffectiveWorkspaceSkillFilter(opts);
	return {
		entries,
		effectiveSkillFilter,
		shouldFilter: Boolean(roots.executionWorkspaceDir) || effectiveSkillFilter !== void 0 || opts?.skillOverrides !== void 0 || opts?.eligibility !== void 0
	};
}
/** Runtime preparation shares discovery and filtering with synchronous SDK inventory reads. */
async function prepareWorkspaceSkills(workspaceDir, opts, assertCurrent) {
	for (;;) {
		assertCurrent?.();
		const sourceVersion = getSkillsSourceVersion(workspaceDir, opts);
		const sources = await prepareWorkspaceSkillEntries(workspaceDir, opts, assertCurrent);
		const { entries, effectiveSkillFilter, shouldFilter } = resolveWorkspaceSkillLoad(workspaceDir, opts, sources.entries);
		if (!shouldFilter) return entries;
		const probe = await prepareSkillBinaryProbe(entries, opts, assertCurrent, sources.runtime);
		if (probe.needsRetry() || getSkillsSourceVersion(workspaceDir, opts) !== sourceVersion) continue;
		const eligible = filterSkillEntries(entries, opts?.config, effectiveSkillFilter, opts?.skillOverrides, opts?.eligibility, probe.hasBin, sources.runtime?.platform);
		assertCurrent?.();
		if (probe.needsRetry()) continue;
		return eligible;
	}
}
function loadWorkspaceSkills(workspaceDir, opts) {
	const { entries, effectiveSkillFilter, shouldFilter } = resolveWorkspaceSkillLoad(workspaceDir, opts);
	if (!shouldFilter) return entries;
	return filterSkillEntries(entries, opts?.config, effectiveSkillFilter, opts?.skillOverrides, opts?.eligibility);
}
function loadVisibleSkills(workspaceDir, opts) {
	const entries = loadSkillEntries(workspaceDir, opts);
	const effectiveSkillFilter = resolveEffectiveWorkspaceSkillFilter(opts);
	return filterSkillEntries(entries, opts?.config, effectiveSkillFilter, opts?.skillOverrides, opts?.eligibility);
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
function filterWorkspaceSkills(entries, opts) {
	return filterSkillEntries(entries, opts?.config, opts?.skillFilter, opts?.skillOverrides, opts?.eligibility);
}
//#endregion
export { prepareWorkspaceSkills as a, fingerprintSkillSnapshotConfig as c, prepareWorkspaceSkillEntries as i, resetSkillSnapshotConfigFingerprintCache as l, loadVisibleSkills as n, readWorkspaceSkillSources as o, loadWorkspaceSkills as r, resolveWorkspaceSkillPromptEntries as s, filterWorkspaceSkills as t, readWorkspaceSkillStatusFacts as u };
