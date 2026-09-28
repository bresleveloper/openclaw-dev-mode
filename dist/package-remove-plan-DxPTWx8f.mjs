import { t as coerceErrorMessage } from "./error-coercion-C787aVxk.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { t as FsSafeError, w as root } from "./fs-safe-BAPek8At.mjs";
import { i as isPathRelativeEscape } from "./path-safety-0BfxAYBQ.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { E as listAgentEntries } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync, t as compileSqliteQueryBindings } from "./kysely-sync-Bn6Qrpbz.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DM1AypRG.mjs";
import { t as parseClawHubPluginSpec } from "./clawhub-spec-r-Sm6wpn.mjs";
import { M as normalizeClawHubSha256Integrity } from "./official-external-plugin-catalog-CzZljLFK.mjs";
import { r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-Bwq1gZI1.mjs";
import { r as normalizeConfiguredMcpServers } from "./mcp-config-normalize-Cl4qyvGH.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { s as readAgentDeletionJournalInDatabase } from "./agent-deletion-journal-CZw0kGMX.mjs";
import "./installed-plugin-index-records-Clh203og.mjs";
import { s as withAgentDeletion } from "./agent-lifecycle-registry-D47RUurT.mjs";
import { _ as withAgentExecApprovalsRemoved } from "./exec-approvals-store-CTT-ox-I.mjs";
import "./exec-approvals-BgZlQ2Qp.mjs";
import { r as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DDl4WhIa.mjs";
import { n as inspectBundlePluginArtifact, r as inspectNativePluginArtifact, t as PLUGIN_ARTIFACT_ADAPTER_IDENTITY } from "./install-artifact-inspection-X2JhMF_r.mjs";
import { n as maintainClawPackageLifecycleLease, t as acquireClawPackageLifecycleLease } from "./claw-package-lifecycle-lease-YnpLFoM-.mjs";
import { t as digestClawAgentConfig } from "./agent-config-digest-C49Q5-61.mjs";
import { f as CLAW_OUTPUT_STABILITY, t as parseClawMarkdown } from "./reader-C5RYMxIl.mjs";
import { t as listConfiguredMcpServers } from "./mcp-config-DtT0ID4w.mjs";
import { a as resolvePluginInstallRequestContext } from "./install-config-DMkIs76A.mjs";
import { n as PluginRuntimeApplicationError } from "./lifecycle-BeHJ-l7R.mjs";
import { i as prepareAgentDeleteDatabases, n as assertAgentSessionStoreDeletionSafe } from "./agent-delete-databases-CY5IIYgH.mjs";
import { T as readClawCronRefs, a as ClawRemoveError, c as deletionEffects, h as synthesizeOrphanInstall, l as inspectClawBootstrap, u as inspectClawWorkspaceFile } from "./monitor-cleanup-contract-C4piGt7E.mjs";
import { r as deleteAgentConfigEntry, t as AgentConfigPreconditionError } from "./agents-config-mutations-Bdz8UoCT.mjs";
import { c as readClawPackageRefs, d as updateClawPackageRefStatus, o as readClawInstallRecordFromDatabase, s as readClawInstallRecords, u as updateClawInstallRecordStatus } from "./provenance-CFChXfcP.mjs";
import { a as digestClawMcpServer, c as readClawMcpServerRefs, u as reconcileClawMcpServerRefs } from "./mcp-zslg_4Pc.mjs";
import { r as planClawHubSkillUninstall, t as applyClawHubSkillUninstall } from "./clawhub-uninstall-hXdHC-uh.mjs";
import { isDeepStrictEqual } from "node:util";
import { relative, resolve, sep } from "node:path";
import { realpath } from "node:fs/promises";
import { createHash } from "node:crypto";
//#region src/claws/lifecycle-config-removal.ts
function digestClawAgentRemovalSurface(config, agentId) {
	const normalizedId = normalizeAgentId(agentId);
	const surface = {
		bindings: (config.bindings ?? []).filter((binding) => normalizeAgentId(binding.agentId) === normalizedId),
		agentToAgentAllow: (config.tools?.agentToAgent?.allow ?? []).filter((entry) => entry === normalizedId)
	};
	return `sha256:${createHash("sha256").update(stableStringify(surface)).digest("hex")}`;
}
async function commitClawAgentConfigRemoval(params, assertCurrent) {
	const configBeforeDelete = params.config ?? getRuntimeConfig();
	try {
		const committed = await deleteAgentConfigEntry({
			agentId: params.agentId,
			assertCurrent,
			allowConfigSizeDrop: true,
			allowMissing: params.expectedState === "missing",
			fallbackWorkspace: params.fallbackWorkspace,
			validateConfig: (config) => {
				assertCurrent();
				assertAgentSessionStoreDeletionSafe(config, params.agentId, params.stateDatabase);
				if (digestClawAgentRemovalSurface(config, params.agentId) !== params.expectedRemovalSurfaceDigest) throw params.onModified();
			},
			validate: (agent) => {
				if (params.expectedState === "missing") throw params.onModified();
				if (digestClawAgentConfig(agent) !== params.expectedDigest) throw params.onModified();
			}
		});
		const fallbackEffects = deletionEffects(configBeforeDelete, params.agentId, params.fallbackWorkspace, params.stateDatabase?.env);
		return {
			agentRemoved: Boolean(committed.result),
			cleanupTargets: committed.result ?? {
				workspaceDir: fallbackEffects.workspace,
				agentDir: fallbackEffects.agentDir,
				sessionsDir: fallbackEffects.sessionsDir
			},
			configBeforeDelete,
			nextConfig: committed.nextConfig
		};
	} catch (error) {
		if (!(error instanceof AgentConfigPreconditionError)) throw error;
		const latestConfig = getRuntimeConfig();
		if (listAgentEntries(latestConfig).some((agent) => agent.id === params.agentId)) throw params.onModified();
		const effects = deletionEffects(latestConfig, params.agentId, params.fallbackWorkspace, params.stateDatabase?.env);
		return {
			agentRemoved: false,
			cleanupTargets: {
				workspaceDir: effects.workspace,
				agentDir: effects.agentDir,
				sessionsDir: effects.sessionsDir
			},
			configBeforeDelete,
			nextConfig: latestConfig
		};
	}
}
async function withClawAgentConfigRemoval(params, apply) {
	const expectedInstall = structuredClone(params.expectedInstall);
	const stateOptions = {
		...params.stateDatabase,
		path: openOpenClawStateDatabase(params.stateDatabase).path
	};
	return await withAgentDeletion(params.agentId, async (begin) => {
		const config = params.config ?? getRuntimeConfig();
		assertAgentSessionStoreDeletionSafe(config, params.agentId, stateOptions);
		const effects = deletionEffects(config, params.agentId, params.fallbackWorkspace, stateOptions.env);
		const matchesInstall = (database) => expectedInstall === void 0 || isDeepStrictEqual(readClawInstallRecordFromDatabase(database.db, params.agentId) ?? null, expectedInstall);
		const { existingJournal, deletion } = runOpenClawStateWriteTransaction((database) => {
			if (!matchesInstall(database)) throw params.onModified();
			const previousJournal = readAgentDeletionJournalInDatabase(database, params.agentId);
			return {
				existingJournal: previousJournal,
				deletion: begin({
					agentId: params.agentId,
					workspaceDir: effects.workspace,
					agentDir: effects.agentDir,
					sessionsDir: effects.sessionsDir,
					deleteFiles: previousJournal?.deleteFiles ?? false
				})
			};
		}, stateOptions);
		let committed = false;
		let monitorEffectsStarted = false;
		const assertCurrent = (database) => {
			const check = (current) => {
				deletion.assertCurrent(current);
				if (!matchesInstall(current)) throw new Error(`Claw removal no longer owns agent ${params.agentId}.`);
			};
			if (database) check(database);
			else runOpenClawStateWriteTransaction(check, stateOptions);
		};
		try {
			if (params.quiesceMonitors) {
				monitorEffectsStarted = true;
				await params.quiesceMonitors(deletion.entry.operationId);
			}
			assertCurrent();
			await prepareAgentDeleteDatabases(config, params.agentId, effects.agentDir, stateOptions);
			assertCurrent();
			return await apply(async () => {
				assertCurrent();
				const result = await withAgentExecApprovalsRemoved(params.agentId, async () => commitClawAgentConfigRemoval({
					...params,
					config,
					stateDatabase: stateOptions
				}, assertCurrent), stateOptions);
				committed = true;
				assertCurrent();
				return {
					...result,
					operationId: deletion.entry.operationId,
					assertCurrent,
					drainMonitors: async () => {
						assertCurrent();
						await params.drainMonitors?.(deletion.entry.operationId);
						assertCurrent();
					},
					runDatabaseCleanup: deletion.runDatabaseCleanup,
					completeDeletion: deletion.completeInTransaction
				};
			}, assertCurrent);
		} finally {
			if (!committed && !monitorEffectsStarted && !existingJournal) deletion.rollback();
			if (expectedInstall) runOpenClawStateWriteTransaction((database) => {
				try {
					assertCurrent(database);
				} catch {
					return;
				}
				updateClawInstallRecordStatus(params.agentId, "partial", {
					...stateOptions,
					database
				});
			}, stateOptions);
		}
	}, stateOptions);
}
//#endregion
//#region src/plugins/plugin-install-preflight.ts
/** Resolves one installed plugin by its stable ClawHub package identity. */
async function resolveInstalledClawHubPlugin(params) {
	const records = await (params.loadInstallRecords ?? loadInstalledPluginIndexInstallRecords)();
	const matches = Object.entries(records).filter(([, record]) => (record.clawhubPackage ?? parseClawHubPluginSpec(record.spec ?? "")?.name ?? parseClawHubPluginSpec(record.resolvedSpec ?? "")?.name) === params.clawhubPackage);
	if (matches.length === 0) return { status: "missing" };
	if (matches.length > 1) return {
		status: "ambiguous",
		pluginIds: matches.map(([pluginId]) => pluginId).toSorted()
	};
	const match = matches[0];
	if (!match) return { status: "missing" };
	const [pluginId, record] = match;
	return {
		status: "found",
		pluginId,
		record,
		installedVersion: record.resolvedVersion ?? record.version
	};
}
async function preflightPluginInstall(params) {
	const resolved = resolvePluginInstallRequestContext({
		rawSpec: params.rawSpec,
		...params.marketplace ? { marketplace: params.marketplace } : {},
		installKind: "plugin"
	});
	if (!resolved.ok) return {
		ok: false,
		code: "invalid_plugin_spec",
		error: resolved.error
	};
	const records = await (params.loadInstallRecords ?? loadInstalledPluginIndexInstallRecords)();
	const installedEntry = Object.entries(records).find(([, record]) => (record.clawhubPackage ?? parseClawHubPluginSpec(record.spec ?? "")?.name) === params.clawhubPackage);
	const installedId = installedEntry?.[0];
	const installed = installedEntry?.[1];
	const installedVersion = installed?.resolvedVersion ?? installed?.version;
	if (!installedVersion || !installedId) return {
		ok: true,
		action: "install",
		request: resolved.request
	};
	if (installedVersion === params.expectedVersion) return {
		ok: true,
		action: "reuse",
		request: resolved.request,
		installedId,
		installedVersion,
		...installed?.integrity ? { installedIntegrity: installed.integrity } : {},
		...installed?.installedAt ? { installedAt: installed.installedAt } : {}
	};
	return {
		ok: false,
		code: "plugin_version_conflict",
		request: resolved.request,
		installedVersion,
		expectedVersion: params.expectedVersion
	};
}
//#endregion
//#region src/claws/package-remove.ts
function sameArtifact(left, right) {
	return left.kind === right.kind && left.source === right.source && left.ref === right.ref;
}
function sameVersionedArtifact(left, right) {
	return sameArtifact(left, right) && left.version === right.version;
}
function clawPackageRemovalSelector(packageRef) {
	return `${packageRef.kind}:${packageRef.ref}@${packageRef.version}`;
}
function sameRecordedState(left, right) {
	return left.status === right.status && left.relationship === right.relationship && left.origin === right.origin && (left.independentOwner === right.independentOwner || right.independentOwner && !left.independentOwner);
}
function otherClawAgentIds(params) {
	return params.refs.filter((candidate) => {
		if (candidate.agentId === params.packageRef.agentId || !sameArtifact(candidate, params.packageRef) || params.statuses && !params.statuses.has(candidate.status)) return false;
		if (params.packageRef.kind === "plugin") return true;
		return params.installs.some((install) => install.agentId === candidate.agentId && install.workspace === params.workspace);
	}).map((candidate) => candidate.agentId).toSorted();
}
function hasAnotherClawOwner(params) {
	return otherClawAgentIds(params).length > 0;
}
function ownerInstallIsNewer(installedAt, packageRef) {
	const timestamp = typeof installedAt === "number" ? installedAt : Date.parse(installedAt ?? "");
	return Number.isFinite(timestamp) && timestamp > packageRef.updatedAtMs;
}
function pluginIntegrityMatches(actual, expected) {
	if (!actual) return false;
	const normalizedActual = normalizeClawHubSha256Integrity(actual);
	const normalizedExpected = normalizeClawHubSha256Integrity(expected);
	return normalizedActual && normalizedExpected ? normalizedActual === normalizedExpected : actual === expected;
}
async function inspectClawPackage(install, packageRef, deps = {}) {
	if (packageRef.status !== "complete") return {
		...packageRef,
		state: "incomplete",
		message: "Package installation is incomplete."
	};
	if (packageRef.kind === "plugin") {
		const resolution = await (deps.resolvePlugin ?? resolveInstalledClawHubPlugin)({ clawhubPackage: packageRef.ref });
		if (resolution.status !== "found") return {
			...packageRef,
			state: resolution.status,
			message: resolution.status === "ambiguous" ? "Installed plugin identity is ambiguous." : "Installed plugin is missing."
		};
		if (resolution.installedVersion !== packageRef.version || !pluginIntegrityMatches(resolution.record.integrity, packageRef.integrity)) return {
			...packageRef,
			state: "modified",
			message: "Installed plugin version changed after the Claw was added."
		};
		return {
			...packageRef,
			independentOwner: packageRef.independentOwner || ownerInstallIsNewer(resolution.record.installedAt, packageRef),
			state: "present"
		};
	}
	if (!install.workspace) return {
		...packageRef,
		state: "ambiguous",
		message: "Skill workspace provenance is missing."
	};
	const skill = await (deps.planSkill ?? planClawHubSkillUninstall)({
		workspaceDir: install.workspace,
		slug: packageRef.ref,
		expectedVersion: packageRef.version
	});
	return skill.ok ? {
		...packageRef,
		independentOwner: packageRef.independentOwner || ownerInstallIsNewer(skill.plan.installedAt, packageRef),
		state: "present"
	} : {
		...packageRef,
		state: skill.code,
		message: skill.error
	};
}
async function planClawPackageRemovals(install, packages, options = {}) {
	const deps = options.deps ?? {};
	const cleanup = options.referencedCleanup ?? { mode: "retain" };
	const selected = new Set(cleanup.selected ?? []);
	const allRefs = (deps.readPackageRefs ?? readClawPackageRefs)(options);
	let cachedInstalls;
	const allInstalls = () => cachedInstalls ??= (deps.readInstallRecords ?? readClawInstallRecords)(options);
	const decisions = [];
	for (const packageRef of packages) {
		const affectedClawAgentIds = otherClawAgentIds({
			packageRef,
			workspace: install.workspace,
			refs: allRefs,
			installs: packageRef.kind === "plugin" || !install.workspace ? [] : allInstalls(),
			statuses: /* @__PURE__ */ new Set(["pending", "complete"])
		});
		const retain = (reason) => {
			decisions.push({
				packageRef,
				workspace: install.workspace,
				action: "retain",
				reason,
				affectedClawAgentIds
			});
		};
		if (packageRef.status !== "complete") {
			retain("Package installation is incomplete.");
			continue;
		}
		const selector = clawPackageRemovalSelector(packageRef);
		const explicitlySelected = cleanup.mode === "remove-selected" && selected.has(selector);
		const managedCleanup = packageRef.relationship === "managed";
		if (explicitlySelected && managedCleanup) {
			decisions.push({
				packageRef,
				workspace: install.workspace,
				action: "retain",
				blocked: true,
				reason: "--remove-referenced only accepts resources with a referenced relationship.",
				affectedClawAgentIds
			});
			continue;
		}
		if (!managedCleanup && !explicitlySelected && cleanup.mode !== "remove-if-unused") {
			retain(packageRef.origin === "claw-introduced" ? "Claw add introduced this shared requirement; removal releases its dependency edge and retains the artifact. Use its canonical owner separately to uninstall it." : "Referenced resources are retained unless a separate cleanup mode selects them.");
			continue;
		}
		if (!explicitlySelected && affectedClawAgentIds.length > 0) {
			retain("Another Claw still references this package.");
			continue;
		}
		if (!explicitlySelected && (packageRef.independentOwner || packageRef.origin === "pre-existing")) {
			retain("Package has a current non-Claw owner or pre-existing origin.");
			continue;
		}
		if (packageRef.kind === "plugin" && !explicitlySelected && cleanup.mode === "remove-if-unused") {
			retain("Global plugins are excluded from generic remove-if-unused cleanup; select the plugin explicitly to invoke its canonical owner.");
			continue;
		}
		let pluginId;
		let ownerIsNewer;
		let skillPlan;
		if (packageRef.kind === "plugin") {
			const resolution = await (deps.resolvePlugin ?? resolveInstalledClawHubPlugin)({ clawhubPackage: packageRef.ref });
			if (resolution.status !== "found") {
				retain(resolution.status === "ambiguous" ? "Installed plugin identity is ambiguous." : "Installed plugin is missing.");
				continue;
			}
			if (resolution.installedVersion !== packageRef.version || !pluginIntegrityMatches(resolution.record.integrity, packageRef.integrity)) {
				retain("Installed plugin changed after the Claw was added.");
				continue;
			}
			pluginId = resolution.pluginId;
			ownerIsNewer = ownerInstallIsNewer(resolution.record.installedAt, packageRef);
		} else {
			if (!install.workspace) {
				retain("Skill workspace provenance is missing.");
				continue;
			}
			const skill = await (deps.planSkill ?? planClawHubSkillUninstall)({
				workspaceDir: install.workspace,
				slug: packageRef.ref,
				expectedVersion: packageRef.version
			});
			if (!skill.ok) {
				retain(skill.error);
				continue;
			}
			skillPlan = skill.plan;
			ownerIsNewer = ownerInstallIsNewer(skill.plan.installedAt, packageRef);
		}
		const independentlyOwned = packageRef.independentOwner || ownerIsNewer;
		const hasConflicts = affectedClawAgentIds.length > 0 || independentlyOwned || packageRef.origin === "pre-existing";
		if (!explicitlySelected && hasConflicts) {
			retain(affectedClawAgentIds.length > 0 ? "Another Claw still references this package." : "Package has a current non-Claw owner or pre-existing origin.");
			continue;
		}
		if (!explicitlySelected && packageRef.origin !== "claw-introduced") {
			retain("Only Claw-introduced referenced resources qualify for remove-if-unused.");
			continue;
		}
		if (explicitlySelected && hasConflicts && !cleanup.allowConflicts) {
			decisions.push({
				packageRef,
				workspace: install.workspace,
				action: "retain",
				blocked: true,
				reason: "Selected resource has other Claw dependents, a non-Claw owner, or pre-existing origin; explicit conflict override is required.",
				affectedClawAgentIds,
				...pluginId ? { pluginId } : {},
				...skillPlan ? { skillPlan } : {}
			});
			continue;
		}
		decisions.push({
			packageRef,
			workspace: install.workspace,
			action: "uninstall",
			...explicitlySelected && cleanup.allowConflicts ? { allowConflicts: true } : {},
			affectedClawAgentIds,
			...pluginId ? { pluginId } : {},
			...skillPlan ? { skillPlan } : {}
		});
	}
	return decisions;
}
async function applyClawPackageRemovals(decisions, options = {}) {
	if (!decisions.some((decision) => decision.packageRef.kind === "plugin")) return await applyClawPackageRemovalsUnlocked(decisions, options);
	return await withPluginLifecycleLease({
		...options.env ? { env: options.env } : {},
		...options.path ? { path: options.path } : {},
		...options.database ? { database: options.database } : {}
	}, async () => await applyClawPackageRemovalsUnlocked(decisions, options));
}
async function applyClawPackageRemovalsUnlocked(decisions, options) {
	const deps = options.deps ?? {};
	const claimPackageRef = (ref, status) => {
		options.assertCurrent?.();
		return (deps.claimPackageRef ?? updateClawPackageRefStatus)(ref, status, options);
	};
	const results = [];
	const warnings = /* @__PURE__ */ new Set();
	let runtimeFailure;
	for (const decision of decisions) {
		const base = {
			kind: decision.packageRef.kind,
			ref: decision.packageRef.ref,
			version: decision.packageRef.version
		};
		if (runtimeFailure) {
			results.push({
				...base,
				action: "retained",
				reason: "Package cleanup stopped after a Gateway runtime replacement failed."
			});
			continue;
		}
		let packageLease = null;
		let claimed = false;
		let externalMutationStarted = false;
		const assertCurrent = () => {
			options.assertCurrent?.();
			packageLease?.assertCurrent();
		};
		try {
			assertCurrent();
			const leaseArtifact = decision.packageRef.kind === "skill" ? {
				kind: decision.packageRef.kind,
				source: decision.packageRef.source,
				ref: decision.packageRef.ref,
				workspace: decision.workspace
			} : {
				kind: decision.packageRef.kind,
				source: decision.packageRef.source,
				ref: decision.packageRef.ref
			};
			const acquiredLease = (deps.acquirePackageLease ?? acquireClawPackageLifecycleLease)(leaseArtifact, {
				env: options.env,
				path: options.path,
				required: true
			});
			if (!acquiredLease) throw new Error(`Could not acquire package lifecycle lease for ${decision.packageRef.ref}.`);
			packageLease = maintainClawPackageLifecycleLease(acquiredLease);
			const currentRefs = (deps.readPackageRefs ?? readClawPackageRefs)(options);
			const currentInstalls = decision.packageRef.kind === "plugin" ? [] : (deps.readInstallRecords ?? readClawInstallRecords)(options);
			const currentRef = currentRefs.find((candidate) => candidate.agentId === decision.packageRef.agentId && sameVersionedArtifact(candidate, decision.packageRef));
			if (decision.blocked) throw new Error(decision.reason ?? "Package cleanup is blocked.");
			if (decision.action === "retain") {
				if (!currentRef || !sameRecordedState(currentRef, decision.packageRef)) throw new Error(`Package ${decision.packageRef.ref}@${decision.packageRef.version} ownership changed after removal planning.`);
				if (currentRef.status === "complete") {
					claimPackageRef(currentRef, "pending");
					claimed = true;
				}
				if (decision.reason === "Another Claw still references this package.") {
					const postClaimRefs = (deps.readPackageRefs ?? readClawPackageRefs)(options);
					const postClaimInstalls = decision.packageRef.kind === "plugin" ? [] : (deps.readInstallRecords ?? readClawInstallRecords)(options);
					if (!hasAnotherClawOwner({
						packageRef: decision.packageRef,
						workspace: decision.workspace,
						refs: postClaimRefs,
						installs: postClaimInstalls,
						statuses: /* @__PURE__ */ new Set(["complete"])
					})) throw new Error(`Package ${decision.packageRef.ref}@${decision.packageRef.version} no longer has another surviving Claw owner.`);
				}
				results.push({
					...base,
					action: "retained",
					reason: decision.reason
				});
				continue;
			}
			const sharedPackage = hasAnotherClawOwner({
				packageRef: decision.packageRef,
				workspace: decision.workspace,
				refs: currentRefs,
				installs: currentInstalls,
				statuses: /* @__PURE__ */ new Set(["complete"])
			});
			if (!currentRef || currentRef.status !== "complete" || !sameRecordedState(currentRef, decision.packageRef) || sharedPackage && !decision.allowConflicts) throw new Error(`Package ${decision.packageRef.ref}@${decision.packageRef.version} ownership changed after removal planning.`);
			claimPackageRef(currentRef, "pending");
			claimed = true;
			const postClaimRefs = (deps.readPackageRefs ?? readClawPackageRefs)(options);
			const postClaimInstalls = decision.packageRef.kind === "plugin" ? [] : (deps.readInstallRecords ?? readClawInstallRecords)(options);
			const postClaimRef = postClaimRefs.find((candidate) => candidate.agentId === decision.packageRef.agentId && sameVersionedArtifact(candidate, decision.packageRef));
			const postClaimShared = hasAnotherClawOwner({
				packageRef: decision.packageRef,
				workspace: decision.workspace,
				refs: postClaimRefs,
				installs: postClaimInstalls,
				statuses: /* @__PURE__ */ new Set(["complete"])
			});
			if (!postClaimRef || postClaimRef.status !== "pending" || postClaimRef.relationship !== decision.packageRef.relationship || postClaimRef.origin !== decision.packageRef.origin || postClaimRef.independentOwner !== decision.packageRef.independentOwner && !decision.packageRef.independentOwner || postClaimShared && !decision.allowConflicts) throw new Error(`Package ${decision.packageRef.ref}@${decision.packageRef.version} ownership changed while claiming removal.`);
			if (decision.packageRef.kind === "plugin") {
				if (!decision.pluginId) throw new Error("Plugin removal plan is missing canonical install identity.");
				const resolution = await (deps.resolvePlugin ?? resolveInstalledClawHubPlugin)({ clawhubPackage: decision.packageRef.ref });
				if (resolution.status !== "found" || resolution.pluginId !== decision.pluginId || resolution.installedVersion !== decision.packageRef.version || !pluginIntegrityMatches(resolution.record.integrity, decision.packageRef.integrity) || ownerInstallIsNewer(resolution.record.installedAt, decision.packageRef)) throw new Error(`Plugin ${decision.packageRef.ref}@${decision.packageRef.version} changed after removal planning.`);
				assertCurrent();
				const uninstallPlugin = deps.uninstallPlugin ?? (await import("./management-uninstall-BI3C_SSZ.mjs")).uninstallPluginWithPolicy;
				assertCurrent();
				externalMutationStarted = true;
				const removed = await uninstallPlugin({
					pluginId: decision.pluginId,
					caller: "cli",
					invalidateRuntimeCache: false,
					clawManaged: true,
					applyRuntime: options.applyRuntime,
					beforePersistentApply: assertCurrent,
					onWarning: (warning) => {
						warnings.add(warning);
					}
				});
				if (!removed.ok) throw new Error(removed.error);
				for (const warning of removed.value.warnings) warnings.add(warning);
			} else {
				if (!decision.skillPlan) throw new Error("Skill removal plan is missing canonical uninstall state.");
				assertCurrent();
				externalMutationStarted = true;
				const cleanupOwner = packageLease;
				const removed = await (deps.uninstallSkill ?? applyClawHubSkillUninstall)(decision.skillPlan, {
					beforePersistentApply: assertCurrent,
					beforeRollback: () => cleanupOwner.assertCurrent()
				});
				if (!removed.ok) throw new Error(removed.error);
			}
			assertCurrent();
			claimPackageRef(decision.packageRef, "complete");
			results.push({
				...base,
				action: "uninstalled"
			});
		} catch (error) {
			if (error instanceof PluginRuntimeApplicationError) runtimeFailure = error;
			if (claimed) try {
				assertCurrent();
				claimPackageRef(decision.packageRef, externalMutationStarted ? "failed" : "complete");
			} catch {}
			results.push({
				...base,
				action: "error",
				reason: coerceErrorMessage(error)
			});
		} finally {
			try {
				packageLease?.release();
			} catch {}
		}
	}
	return {
		packages: results,
		...warnings.size ? { warnings: [...warnings] } : {},
		...runtimeFailure ? { runtimeFailure } : {}
	};
}
//#endregion
//#region src/claws/path-containment.ts
function clawContainedRelativePath(root, target) {
	const child = relative(root, target);
	return child !== "" && !isPathRelativeEscape(child) ? child : void 0;
}
//#endregion
//#region src/claws/workspace.ts
const CLAW_WORKSPACE_FILE_RECORD_SCHEMA_VERSION = "openclaw.clawWorkspaceFileRecord.v1";
const MAX_CLAW_WORKSPACE_FILE_BYTES = 1048576;
var ClawWorkspaceWriteError = class extends Error {
	constructor(diagnostics, createdFiles) {
		super("Claw workspace file creation failed");
		this.diagnostics = diagnostics;
		this.createdFiles = createdFiles;
		this.name = "ClawWorkspaceWriteError";
	}
};
var ClawWorkspaceSourceAliasError = class extends Error {};
function selectWorkspaceFiles(db) {
	return getNodeSqliteKysely(db).selectFrom("claw_workspace_files").select([
		"schema_version",
		"agent_id",
		"workspace",
		"target_path",
		"source_path",
		"content_digest",
		"status",
		"created_at_ms",
		"updated_at_ms"
	]);
}
function rowToWorkspaceFile(row, schemaVersion = CLAW_WORKSPACE_FILE_RECORD_SCHEMA_VERSION) {
	return {
		schemaVersion,
		agentId: row.agent_id,
		workspace: row.workspace,
		path: row.target_path,
		sourcePath: row.source_path,
		contentDigest: row.content_digest,
		status: row.status,
		createdAtMs: coerceRequiredSqliteNumber(row.created_at_ms),
		updatedAtMs: coerceRequiredSqliteNumber(row.updated_at_ms)
	};
}
function workspaceFileToRow(record) {
	return {
		agent_id: record.agentId,
		target_path: record.path,
		schema_version: record.schemaVersion,
		workspace: record.workspace,
		source_path: record.sourcePath,
		content_digest: record.contentDigest,
		status: record.status,
		created_at_ms: record.createdAtMs,
		updated_at_ms: record.updatedAtMs
	};
}
function diagnostic(action, code, message) {
	return {
		level: "error",
		code,
		phase: "mutation",
		path: `$.workspace[${JSON.stringify(action.id)}]`,
		message
	};
}
function contentDigest(content) {
	return `sha256:${createHash("sha256").update(content).digest("hex")}`;
}
async function readClawWorkspaceActionSource(params) {
	if (!params.action.source) throw new Error("Workspace file action lacks a source.");
	const sourcePath = resolve(params.action.source);
	const sourceRelative = clawContainedRelativePath(params.packageRoot, sourcePath);
	if (!sourceRelative) throw new Error("Workspace file source must remain inside the Claw package.");
	const read = await params.sourceRoot.read(sourceRelative, {
		hardlinks: "reject",
		maxBytes: MAX_CLAW_WORKSPACE_FILE_BYTES,
		symlinks: "reject"
	});
	if (resolve(read.realPath) !== sourcePath) throw new ClawWorkspaceSourceAliasError("Workspace source no longer resolves to the consented file.");
	if (params.action.sourceKind !== "clawMarkdownBody") return {
		content: read.buffer,
		sourcePath,
		sourceRelative
	};
	const parsed = parseClawMarkdown(read.buffer, sourcePath);
	if (!parsed.ok) throw new Error(parsed.diagnostics.map((item) => item.message).join("; "));
	return {
		content: parsed.body,
		sourcePath,
		sourceRelative
	};
}
function persistWorkspaceFile(record, options) {
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("claw_workspace_files").values(workspaceFileToRow(record)));
	}, options);
}
function readWorkspaceFile(agentId, targetPath, options) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const row = executeSqliteQueryTakeFirstSync(db, selectWorkspaceFiles(db).where("agent_id", "=", agentId).where("target_path", "=", targetPath).limit(1));
		if (!row) return;
		if (row.schema_version !== "openclaw.clawWorkspaceFileRecord.v1" || row.status !== "pending" && row.status !== "complete" && row.status !== "failed") throw new Error(`Claw workspace file ${JSON.stringify(targetPath)} has unsupported provenance state.`);
		return rowToWorkspaceFile(row);
	}, options);
}
function sameWorkspaceFileOwner(existing, expected) {
	return existing.schemaVersion === expected.schemaVersion && existing.agentId === expected.agentId && existing.workspace === expected.workspace && existing.path === expected.path && existing.sourcePath === expected.sourcePath && existing.contentDigest === expected.contentDigest;
}
function updateWorkspaceFileStatus(record, expectedStatuses, options) {
	runOpenClawStateWriteTransaction(({ db }) => {
		if (executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("claw_workspace_files").set({
			status: record.status,
			updated_at_ms: record.updatedAtMs
		}).where("agent_id", "=", record.agentId).where("target_path", "=", record.path).where("status", "in", expectedStatuses)).numAffectedRows !== 1n) throw new Error(`Claw workspace file ${JSON.stringify(record.path)} changed ownership state concurrently.`);
	}, options);
}
function upsertClawWorkspaceFile(record, options = {}) {
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("claw_workspace_files").values(workspaceFileToRow(record)).onConflict((conflict) => conflict.columns(["agent_id", "target_path"]).doUpdateSet((eb) => ({
			schema_version: eb.ref("excluded.schema_version"),
			workspace: eb.ref("excluded.workspace"),
			source_path: eb.ref("excluded.source_path"),
			content_digest: eb.ref("excluded.content_digest"),
			status: eb.ref("excluded.status"),
			created_at_ms: eb.ref("excluded.created_at_ms"),
			updated_at_ms: eb.ref("excluded.updated_at_ms")
		}))));
	}, options);
}
function deleteClawWorkspaceFileRecord(agentId, path, options = {}) {
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("claw_workspace_files").where("agent_id", "=", agentId).where("target_path", "=", path));
	}, options);
}
function workspaceFileActions(plan) {
	return plan.actions.filter((action) => action.kind === "workspaceFile");
}
function readClawWorkspaceFiles(agentId, options = {}) {
	const { db } = openOpenClawStateDatabase(options);
	if (options.readOnly && !tableExists(db, "claw_workspace_files")) return [];
	const { compiled, bind } = compileSqliteQueryBindings((parameter) => selectWorkspaceFiles(db).where("agent_id", "=", parameter((value) => value)).orderBy("target_path"));
	return db.prepare(compiled.sql).all(...bind(agentId)).map((row) => rowToWorkspaceFile(row));
}
function readAllClawWorkspaceFiles(options) {
	const { db } = openOpenClawStateDatabase(options);
	if (!tableExists(db, "claw_workspace_files")) return [];
	const compiled = selectWorkspaceFiles(db).orderBy("agent_id").orderBy("target_path").compile();
	return db.prepare(compiled.sql).all().map((row) => rowToWorkspaceFile(row, row.schema_version));
}
async function createClawWorkspaceFiles(plan, options = {}) {
	const actions = workspaceFileActions(plan);
	if (actions.length === 0) return [];
	const workspaceRoot = await realpath(resolve(plan.agent.workspace));
	const packageRoot = await realpath(resolve(plan.claw.packageRoot));
	const source = await root(packageRoot, {
		hardlinks: "reject",
		maxBytes: MAX_CLAW_WORKSPACE_FILE_BYTES,
		symlinks: "reject"
	});
	const workspace = await root(workspaceRoot, {
		hardlinks: "reject",
		maxBytes: MAX_CLAW_WORKSPACE_FILE_BYTES,
		symlinks: "reject"
	});
	const createdFiles = [];
	const nowMs = options.nowMs ?? Date.now();
	for (const action of actions) try {
		if (!action.source || !action.digest) throw new ClawWorkspaceWriteError([diagnostic(action, "workspace_file_plan_invalid", "File action lacks source or digest.")], createdFiles);
		const targetRelative = clawContainedRelativePath(workspaceRoot, resolve(action.target));
		if (!targetRelative) throw new ClawWorkspaceWriteError([diagnostic(action, "workspace_file_path_escape", "Workspace file source and destination must remain inside their owned roots.")], createdFiles);
		const resolvedSource = await readClawWorkspaceActionSource({
			action,
			packageRoot,
			sourceRoot: source
		});
		const digest = contentDigest(resolvedSource.content);
		if (digest !== action.digest) throw new ClawWorkspaceWriteError([diagnostic(action, "workspace_source_changed", `Workspace source for ${JSON.stringify(action.id)} changed after planning.`)], createdFiles);
		const expectedRecord = {
			schemaVersion: CLAW_WORKSPACE_FILE_RECORD_SCHEMA_VERSION,
			agentId: plan.agent.finalId,
			workspace: workspace.rootReal,
			path: targetRelative.replaceAll(sep, "/"),
			sourcePath: resolvedSource.sourceRelative.replaceAll(sep, "/"),
			contentDigest: digest,
			status: "pending",
			createdAtMs: nowMs,
			updatedAtMs: nowMs
		};
		const existingRecord = readWorkspaceFile(expectedRecord.agentId, expectedRecord.path, options);
		if (existingRecord && !sameWorkspaceFileOwner(existingRecord, expectedRecord)) throw new ClawWorkspaceWriteError([diagnostic(action, "workspace_file_ownership_conflict", `Workspace destination ${JSON.stringify(targetRelative)} is already claimed by different Claw provenance.`)], createdFiles);
		if (await workspace.exists(targetRelative)) {
			if (!existingRecord || existingRecord.status === "failed") throw new ClawWorkspaceWriteError([diagnostic(action, "workspace_file_collision", `Workspace destination ${JSON.stringify(targetRelative)} already exists.`)], createdFiles);
			if (contentDigest((await workspace.read(targetRelative, {
				hardlinks: "reject",
				maxBytes: MAX_CLAW_WORKSPACE_FILE_BYTES,
				symlinks: "reject"
			})).buffer) !== expectedRecord.contentDigest) throw new ClawWorkspaceWriteError([diagnostic(action, "workspace_file_drift", `Claw-owned workspace destination ${JSON.stringify(targetRelative)} no longer matches its recorded content.`)], createdFiles);
			const previousStatus = existingRecord.status;
			existingRecord.status = "complete";
			existingRecord.updatedAtMs = nowMs;
			updateWorkspaceFileStatus(existingRecord, [previousStatus], options);
			createdFiles.push(existingRecord);
			continue;
		}
		const record = existingRecord ?? expectedRecord;
		if (existingRecord) {
			const previousStatus = record.status;
			record.status = "pending";
			record.updatedAtMs = nowMs;
			updateWorkspaceFileStatus(record, [previousStatus], options);
		} else persistWorkspaceFile(record, options);
		try {
			await workspace.write(targetRelative, resolvedSource.content, {
				mkdir: true,
				overwrite: false
			});
			record.status = "complete";
			updateWorkspaceFileStatus(record, ["pending"], options);
			createdFiles.push(record);
		} catch (error) {
			record.status = "failed";
			try {
				updateWorkspaceFileStatus(record, ["pending"], options);
			} catch {
				record.status = "pending";
			}
			createdFiles.push(record);
			throw error;
		}
	} catch (error) {
		if (error instanceof ClawWorkspaceWriteError) throw error;
		throw new ClawWorkspaceWriteError([diagnostic(action, error instanceof ClawWorkspaceSourceAliasError ? "workspace_file_path_alias" : error instanceof FsSafeError ? `workspace_file_${error.code}` : "workspace_file_io_error", coerceErrorMessage(error))], createdFiles);
	}
	return createdFiles;
}
//#endregion
//#region src/claws/lifecycle-status.ts
const CLAW_STATUS_SCHEMA_VERSION = "openclaw.clawStatus.v1";
async function inspectClawPackageCompatibility(params) {
	const inspected = await inspectClawPackage(params.install, params.packageRef, params.packageDeps);
	if (!params.packageRef.extension || inspected.state !== "present") return inspected;
	let current;
	if (params.packagePreflight) {
		const preflight = await params.packagePreflight(params.packageRef, params.install.workspace);
		if (!preflight.ok) {
			inspected.extensionCompatibility = {
				state: "unavailable",
				mapped: [],
				unavailable: [],
				message: preflight.message ?? "Canonical extension inspection is unavailable."
			};
			return inspected;
		}
		current = {
			detectedFormat: preflight.detectedFormat,
			mapped: preflight.mapped ?? [],
			unavailable: preflight.unavailable ?? [],
			adapterIdentity: preflight.adapterIdentity
		};
	} else {
		const recorded = params.packageRef.extension;
		const artifact = recorded.detectedFormat === "openclaw" ? inspectNativePluginArtifact() : inspectBundlePluginArtifact({
			format: recorded.detectedFormat,
			capabilities: [...recorded.mapped, ...recorded.unavailable]
		});
		current = {
			detectedFormat: recorded.detectedFormat,
			mapped: artifact.mapped,
			unavailable: artifact.unavailable,
			adapterIdentity: PLUGIN_ARTIFACT_ADAPTER_IDENTITY
		};
	}
	const recorded = {
		detectedFormat: params.packageRef.extension.detectedFormat,
		mapped: params.packageRef.extension.mapped,
		unavailable: params.packageRef.extension.unavailable,
		adapterIdentity: params.packageRef.extension.adapterIdentity
	};
	inspected.extensionCompatibility = {
		state: stableStringify(current) === stableStringify(recorded) ? "compatible" : "drifted",
		detectedFormat: current.detectedFormat,
		mapped: current.mapped,
		unavailable: current.unavailable,
		adapterIdentity: current.adapterIdentity
	};
	return inspected;
}
function inspectMcpServer(ref, configuredServers) {
	if (ref.status === "pending" || ref.status === "failed") return {
		...ref,
		state: ref.status
	};
	const server = configuredServers[ref.name];
	if (!server) return {
		...ref,
		state: "missing"
	};
	return {
		...ref,
		state: digestClawMcpServer(server) === ref.configDigest ? "present" : "modified"
	};
}
async function readClawStatus(target, options = {}) {
	const config = options.config ?? getRuntimeConfig();
	const listedMcp = options.sourceMcpServers ? void 0 : options.listMcpServers ? await options.listMcpServers() : options.config ? void 0 : await listConfiguredMcpServers();
	if (listedMcp && !listedMcp.ok) throw new ClawRemoveError("mcp_config_unavailable", listedMcp.error);
	const sourceConfig = listedMcp?.ok ? listedMcp.config : config;
	const configuredMcpServers = normalizeConfiguredMcpServers(options.sourceMcpServers ?? sourceConfig.mcp?.servers);
	const allInstalls = readClawInstallRecords(options);
	const installAgentIds = new Set(allInstalls.map((install) => install.agentId));
	const allPackageRefs = readClawPackageRefs(options);
	const allWorkspaceFiles = readAllClawWorkspaceFiles(options);
	const orphanAgentIds = /* @__PURE__ */ new Set();
	for (const packageRef of allPackageRefs) if (!installAgentIds.has(packageRef.agentId)) orphanAgentIds.add(packageRef.agentId);
	for (const file of allWorkspaceFiles) if (!installAgentIds.has(file.agentId)) orphanAgentIds.add(file.agentId);
	const orphanInstalls = [...orphanAgentIds].map((agentId) => {
		const packageRef = allPackageRefs.find((candidate) => candidate.agentId === agentId);
		const file = allWorkspaceFiles.find((candidate) => candidate.agentId === agentId);
		return synthesizeOrphanInstall({
			agentId,
			clawName: packageRef?.clawName,
			workspace: file?.workspace,
			updatedAtMs: Math.max(packageRef?.updatedAtMs ?? 0, file?.updatedAtMs ?? 0)
		});
	});
	const installs = [...allInstalls, ...orphanInstalls].filter((install) => !target || install.agentId === target || install.claw.name === target);
	const records = [];
	const packagePreflight = options.packagePreflight;
	for (const install of installs) {
		const agent = listAgentEntries(config).find((candidate) => candidate.id === install.agentId);
		const packageRefs = allPackageRefs.filter((packageRef) => packageRef.agentId === install.agentId);
		const workspaceFiles = installAgentIds.has(install.agentId) ? readClawWorkspaceFiles(install.agentId, options) : allWorkspaceFiles.filter((file) => file.agentId === install.agentId);
		const bootstrap = installAgentIds.has(install.agentId) ? await inspectClawBootstrap(install, options) : {
			state: "unknown",
			workspace: install.workspace,
			path: "BOOTSTRAP.md"
		};
		records.push({
			install,
			...installAgentIds.has(install.agentId) ? {} : { orphaned: true },
			agentState: !agent ? "missing" : digestClawAgentConfig(agent) === install.agentConfigDigest ? "present" : "modified",
			bootstrapState: bootstrap.state,
			bootstrap,
			workspaceFiles: await Promise.all(workspaceFiles.map(inspectClawWorkspaceFile)),
			packages: await Promise.all(packageRefs.map(async (packageRef) => await inspectClawPackageCompatibility({
				install,
				packageRef,
				packageDeps: options.packageDeps,
				packagePreflight
			}))),
			mcpServers: (options.readOnly ? readClawMcpServerRefs(install.agentId, options) : reconcileClawMcpServerRefs(install.agentId, configuredMcpServers, options)).map((ref) => inspectMcpServer(ref, configuredMcpServers)),
			cronJobs: readClawCronRefs(install.agentId, options)
		});
	}
	return {
		schemaVersion: CLAW_STATUS_SCHEMA_VERSION,
		stability: CLAW_OUTPUT_STABILITY,
		...target ? { target } : {},
		records,
		summary: {
			claws: records.length,
			partial: records.filter((record) => record.install.status !== "complete").length,
			pendingBootstrap: records.filter((record) => record.bootstrapState === "pending").length,
			missingAgents: records.filter((record) => record.agentState === "missing").length,
			driftedFiles: records.flatMap((record) => record.workspaceFiles).filter((file) => file.state !== "unchanged").length,
			packageRefs: records.flatMap((record) => record.packages).length,
			missingPackages: records.flatMap((record) => record.packages).filter((pkg) => pkg.state === "missing").length,
			driftedPackages: records.flatMap((record) => record.packages).filter((pkg) => pkg.state === "modified" || pkg.state === "ambiguous" || pkg.extensionCompatibility?.state === "drifted").length,
			unavailableExtensions: records.flatMap((record) => record.packages).filter((pkg) => pkg.extensionCompatibility?.state === "unavailable").length,
			incompletePackages: records.flatMap((record) => record.packages).filter((pkg) => pkg.state === "incomplete").length,
			mcpServerRefs: records.flatMap((record) => record.mcpServers).length,
			driftedMcpServers: records.flatMap((record) => record.mcpServers).filter((server) => server.state === "modified" || server.state === "missing").length,
			unresolvedMcpServerRefs: records.flatMap((record) => record.mcpServers).filter((server) => server.state === "pending" || server.state === "failed").length,
			cronRefs: records.flatMap((record) => record.cronJobs).length,
			unresolvedCronRefs: records.flatMap((record) => record.cronJobs).filter((cron) => cron.status !== "complete" || !cron.schedulerJobId).length
		}
	};
}
//#endregion
//#region src/claws/package-remove-plan.ts
function orderClawPackageRemovals(decisions) {
	return decisions.toSorted((left, right) => Number(left.packageRef.relationship === "referenced") - Number(right.packageRef.relationship === "referenced"));
}
/** Comparison facts only; removers must still validate their current journal and leases. */
function digestClawRemovalState(value) {
	return `sha256:${createHash("sha256").update(stableStringify(value)).digest("hex")}`;
}
/** Omitted cleanup options and their defaults must have the same identity across JSON RPC. */
function normalizeClawPackageCleanup(cleanup) {
	return {
		mode: cleanup?.mode ?? "retain",
		selected: [...cleanup?.selected ?? []],
		allowConflicts: cleanup?.allowConflicts === true
	};
}
function digestClawPackageRemovalPlan(decisions, cleanup) {
	return digestClawRemovalState({
		decisions: orderClawPackageRemovals(decisions),
		cleanup: normalizeClawPackageCleanup(cleanup)
	});
}
function digestClawRemovalInstall(install) {
	return digestClawRemovalState(install ?? null);
}
function filterReferencedCleanup(cleanup, kind) {
	return cleanup ? {
		...cleanup,
		selected: (cleanup.selected ?? []).filter((selector) => selector.startsWith("mcp:") === (kind === "mcp"))
	} : void 0;
}
function projectClawPackageRemovePlan(params) {
	const selected = new Set(params.cleanup?.selected ?? []);
	const blockers = [];
	const actions = params.decisions.map((decision) => {
		const pkg = decision.packageRef;
		const selector = clawPackageRemovalSelector(pkg);
		selected.delete(selector);
		if (decision.blocked) blockers.push({
			code: "referenced_cleanup_requires_override",
			message: `${selector}: ${decision.reason ?? "explicit conflict override is required"}`
		});
		const inspected = params.inspections.find((candidate) => candidate.kind === pkg.kind && candidate.source === pkg.source && candidate.ref === pkg.ref && candidate.version === pkg.version);
		return {
			kind: "packageRef",
			id: selector,
			action: decision.action === "uninstall" ? "uninstall" : "release",
			target: `${pkg.source}:${pkg.ref}@${pkg.version}`,
			blocked: Boolean(decision.blocked),
			details: {
				expectedState: inspected?.state ?? "incomplete",
				status: pkg.status,
				relationship: pkg.relationship,
				origin: pkg.origin,
				introducedByClawAdd: pkg.origin === "claw-introduced",
				independentOwner: pkg.independentOwner,
				affectedClawAgentIds: decision.affectedClawAgentIds,
				cleanupMode: params.cleanup?.mode ?? "retain",
				availableCleanupModes: pkg.relationship === "referenced" ? [
					"retain",
					"remove-if-unused",
					"remove-selected"
				] : ["remove"]
			},
			...decision.reason ? { reason: decision.reason } : {}
		};
	});
	for (const selector of selected) blockers.push({
		code: "referenced_cleanup_not_found",
		message: `Selected referenced resource ${JSON.stringify(selector)} is not owned by this Claw.`
	});
	return {
		actions,
		blockers
	};
}
//#endregion
export { withClawAgentConfigRemoval as S, applyClawPackageRemovals as _, normalizeClawPackageCleanup as a, resolveInstalledClawHubPlugin as b, readClawStatus as c, createClawWorkspaceFiles as d, deleteClawWorkspaceFileRecord as f, clawContainedRelativePath as g, upsertClawWorkspaceFile as h, filterReferencedCleanup as i, CLAW_WORKSPACE_FILE_RECORD_SCHEMA_VERSION as l, readClawWorkspaceFiles as m, digestClawRemovalInstall as n, orderClawPackageRemovals as o, readClawWorkspaceActionSource as p, digestClawRemovalState as r, projectClawPackageRemovePlan as s, digestClawPackageRemovalPlan as t, ClawWorkspaceWriteError as u, planClawPackageRemovals as v, digestClawAgentRemovalSurface as x, preflightPluginInstall as y };
