import { t as coerceErrorMessage } from "./error-coercion-CvJK4lmH.mjs";
import "./src-CdRlGRnW.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { t as FsSafeError, w as root } from "./fs-safe-BUXBSN-4.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync, t as compileSqliteQueryBindings } from "./kysely-sync-K7ftY-g4.mjs";
import { i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { l as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-C51cJHzg.mjs";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { n as listAgentEntries } from "./agent-roster-BXD1uMJD.mjs";
import { l as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-D1jWDzK3.mjs";
import { N as normalizeClawHubSha256Integrity } from "./official-external-plugin-catalog-DWheKC4x.mjs";
import { t as parseClawHubPluginSpec } from "./clawhub-spec-DczkVvPu.mjs";
import { r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-C4Wdbs53.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { r as normalizeConfiguredMcpServers } from "./mcp-config-normalize-DQmvZkAl.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
import { i as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DHQMWweY.mjs";
import "./installed-plugin-index-records-VCj98mZ6.mjs";
import { a as encodeClawAgentOwnership, r as CLAW_INSTALL_RECORD_ADOPTED_SCHEMA_VERSION, t as CLAW_INSTALL_RECORD_SCHEMA_VERSION } from "./provenance-schema-version-CA1gqk1A.mjs";
import { r as deleteCachedClawInstallSchemaVersion, t as cacheClawInstallSchemaVersion } from "./provenance-runtime-read-DLNIVZio.mjs";
import { r as assertAgentDeletionAllowsMutation } from "./agent-lifecycle-registry-kGv3atS9.mjs";
import { n as inspectBundlePluginArtifact, r as inspectNativePluginArtifact, t as PLUGIN_ARTIFACT_ADAPTER_IDENTITY } from "./install-artifact-inspection-X2JhMF_r.mjs";
import { n as withClawPackageLifecycleLease } from "./claw-package-lifecycle-lease-v-fevrKC.mjs";
import { l as digestClawBytes, u as digestClawValue } from "./schema-portability-DPQGHUzw.mjs";
import { i as resolveMigrationAgentSettings, o as withAuthoredAgentRoster, r as normalizeWorkspaceConfig } from "./migrate-validation-DioFMXjJ.mjs";
import { t as parseClawMarkdown } from "./reader-tis62fDs.mjs";
import { t as listConfiguredMcpServers } from "./mcp-config-Cv7bEPf1.mjs";
import { a as resolvePluginInstallRequestContext } from "./install-config-BzMqqnd7.mjs";
import { n as PluginRuntimeApplicationError } from "./lifecycle-CGWepTug.mjs";
import { T as readClawCronRefs, a as ClawRemoveError, h as synthesizeOrphanInstall, l as inspectClawBootstrap, u as inspectClawWorkspaceFile } from "./monitor-cleanup-contract-BKt7Vod1.mjs";
import { d as claimClawPackageRefStatus, i as digestClawMcpServer, l as reconcileClawMcpServerRefs, m as CLAW_OUTPUT_STABILITY, s as readClawMcpServerRefs } from "./mcp-A-4-BIRV.mjs";
import { r as planClawHubSkillUninstall, t as applyClawHubSkillUninstall } from "./clawhub-uninstall-CEtPgilV.mjs";
import { t as readClawPackageOwnership } from "./provenance-async-Cos5k-UB.mjs";
import { a as updateClawPackageRefStatusInDatabase, c as toPackageRefExtensionSqlParams, i as readClawPackageRefsInDatabase, n as readClawInstallRecordsInDatabase, o as CLAW_PACKAGE_REF_SCHEMA_VERSION, s as rowToPackageRef, t as readClawInstallRecordFromDatabase } from "./provenance-read.kernel-B_3aRsEz.mjs";
import { relative, resolve, sep } from "node:path";
import { realpath } from "node:fs/promises";
import { isPathRelativeEscape } from "@openclaw/fs-safe/path";
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
	const [pluginId, record] = matches[0];
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
async function readPackageRemovalOwnership(options, deps, includeInstalls) {
	const persisted = deps.readPackageRefs && (!includeInstalls || deps.readInstallRecords) ? {
		packageRefs: [],
		installs: []
	} : await readClawPackageOwnership(options, includeInstalls);
	return {
		packageRefs: deps.readPackageRefs ? deps.readPackageRefs(options) : persisted.packageRefs,
		installs: !includeInstalls ? [] : deps.readInstallRecords ? deps.readInstallRecords(options) : persisted.installs
	};
}
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
async function inspectInstalledPackage(install, packageRef, deps) {
	if (packageRef.kind === "plugin") {
		const resolution = await (deps.resolvePlugin ?? resolveInstalledClawHubPlugin)({ clawhubPackage: packageRef.ref });
		if (resolution.status !== "found") return {
			state: resolution.status,
			message: resolution.status === "ambiguous" ? "Installed plugin identity is ambiguous." : "Installed plugin is missing."
		};
		if (resolution.installedVersion !== packageRef.version || !pluginIntegrityMatches(resolution.record.integrity, packageRef.integrity)) return {
			state: "modified",
			message: "Installed plugin changed after the Claw was added."
		};
		return {
			state: "present",
			ownerIsNewer: ownerInstallIsNewer(resolution.record.installedAt, packageRef),
			pluginId: resolution.pluginId
		};
	}
	if (!install.workspace) return {
		state: "ambiguous",
		message: "Skill workspace provenance is missing."
	};
	const skill = await (deps.planSkill ?? planClawHubSkillUninstall)({
		workspaceDir: install.workspace,
		slug: packageRef.ref,
		expectedVersion: packageRef.version
	});
	return skill.ok ? {
		state: "present",
		ownerIsNewer: ownerInstallIsNewer(skill.plan.installedAt, packageRef),
		skillPlan: skill.plan
	} : {
		state: skill.code,
		message: skill.error
	};
}
async function inspectClawPackage(install, packageRef, deps = {}) {
	if (packageRef.status !== "complete") return {
		...packageRef,
		state: "incomplete",
		message: "Package installation is incomplete."
	};
	const inspected = await inspectInstalledPackage(install, packageRef, deps);
	return inspected.state === "present" ? {
		...packageRef,
		independentOwner: packageRef.independentOwner || inspected.ownerIsNewer,
		state: "present"
	} : {
		...packageRef,
		state: inspected.state,
		message: packageRef.kind === "plugin" && inspected.state === "modified" ? "Installed plugin version changed after the Claw was added." : inspected.message
	};
}
async function planClawPackageRemovals(install, packages, options = {}) {
	const deps = options.deps ?? {};
	const cleanup = options.referencedCleanup ?? { mode: "retain" };
	const selected = new Set(cleanup.selected ?? []);
	const { packageRefs: allRefs, installs: allInstalls } = await readPackageRemovalOwnership(options, deps, Boolean(install.workspace) && packages.some((ref) => ref.kind === "skill"));
	const decisions = [];
	for (const packageRef of packages) {
		const affectedClawAgentIds = otherClawAgentIds({
			packageRef,
			workspace: install.workspace,
			refs: allRefs,
			installs: allInstalls,
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
		const inspected = await inspectInstalledPackage(install, packageRef, deps);
		if (inspected.state !== "present") {
			retain(inspected.message);
			continue;
		}
		const { pluginId, skillPlan, ownerIsNewer } = inspected;
		const independentlyOwned = packageRef.independentOwner || ownerIsNewer;
		const hasConflicts = affectedClawAgentIds.length > 0 || independentlyOwned || packageRef.origin === "pre-existing";
		if (!explicitlySelected && hasConflicts) {
			retain("Package has a current non-Claw owner or pre-existing origin.");
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
		const leaseArtifact = decision.packageRef.kind === "plugin" ? {
			kind: decision.packageRef.kind,
			source: decision.packageRef.source,
			ref: decision.packageRef.ref
		} : {
			kind: decision.packageRef.kind,
			source: decision.packageRef.source,
			ref: decision.packageRef.ref,
			workspace: decision.workspace
		};
		const run = async (packageLease) => {
			let claimed = false;
			let claimedRef;
			let externalMutationStarted = false;
			const assertCurrent = () => {
				options.assertCurrent?.();
				packageLease.assertOwned();
			};
			const claimPackageRef = async (ref, status) => {
				assertCurrent();
				const result = await (deps.claimPackageRef ?? claimClawPackageRefStatus)(ref, status, {
					...options,
					lease: packageLease,
					assertCurrent: options.assertCurrent
				});
				claimedRef = result;
				assertCurrent();
				return result;
			};
			try {
				assertCurrent();
				const { packageRefs: currentRefs, installs: currentInstalls } = await readPackageRemovalOwnership(options, deps, decision.packageRef.kind === "skill");
				assertCurrent();
				const currentRef = currentRefs.find((candidate) => candidate.agentId === decision.packageRef.agentId && sameVersionedArtifact(candidate, decision.packageRef));
				if (decision.blocked) throw new Error(decision.reason ?? "Package cleanup is blocked.");
				if (decision.action === "retain") {
					if (!currentRef || !sameRecordedState(currentRef, decision.packageRef)) throw new Error(`Package ${decision.packageRef.ref}@${decision.packageRef.version} ownership changed after removal planning.`);
					if (currentRef.status === "complete") {
						await claimPackageRef(currentRef, "pending");
						claimed = true;
					}
					if (decision.reason === "Another Claw still references this package.") {
						const { packageRefs: postClaimRefs, installs: postClaimInstalls } = await readPackageRemovalOwnership(options, deps, decision.packageRef.kind === "skill");
						assertCurrent();
						if (otherClawAgentIds({
							packageRef: decision.packageRef,
							workspace: decision.workspace,
							refs: postClaimRefs,
							installs: postClaimInstalls,
							statuses: /* @__PURE__ */ new Set(["complete"])
						}).length === 0) throw new Error(`Package ${decision.packageRef.ref}@${decision.packageRef.version} no longer has another surviving Claw owner.`);
					}
					results.push({
						...base,
						action: "retained",
						reason: decision.reason
					});
					return;
				}
				const sharedPackage = otherClawAgentIds({
					packageRef: decision.packageRef,
					workspace: decision.workspace,
					refs: currentRefs,
					installs: currentInstalls,
					statuses: /* @__PURE__ */ new Set(["complete"])
				}).length > 0;
				if (!currentRef || currentRef.status !== "complete" || !sameRecordedState(currentRef, decision.packageRef) || sharedPackage && !decision.allowConflicts) throw new Error(`Package ${decision.packageRef.ref}@${decision.packageRef.version} ownership changed after removal planning.`);
				await claimPackageRef(currentRef, "pending");
				claimed = true;
				const { packageRefs: postClaimRefs, installs: postClaimInstalls } = await readPackageRemovalOwnership(options, deps, decision.packageRef.kind === "skill");
				assertCurrent();
				const postClaimRef = postClaimRefs.find((candidate) => candidate.agentId === decision.packageRef.agentId && sameVersionedArtifact(candidate, decision.packageRef));
				const postClaimShared = otherClawAgentIds({
					packageRef: decision.packageRef,
					workspace: decision.workspace,
					refs: postClaimRefs,
					installs: postClaimInstalls,
					statuses: /* @__PURE__ */ new Set(["complete"])
				}).length > 0;
				if (!postClaimRef || postClaimRef.status !== "pending" || postClaimRef.relationship !== decision.packageRef.relationship || postClaimRef.origin !== decision.packageRef.origin || postClaimRef.independentOwner !== decision.packageRef.independentOwner && !decision.packageRef.independentOwner || postClaimShared && !decision.allowConflicts) throw new Error(`Package ${decision.packageRef.ref}@${decision.packageRef.version} ownership changed while claiming removal.`);
				if (decision.packageRef.kind === "plugin") {
					if (!decision.pluginId) throw new Error("Plugin removal plan is missing canonical install identity.");
					const resolution = await (deps.resolvePlugin ?? resolveInstalledClawHubPlugin)({ clawhubPackage: decision.packageRef.ref });
					if (resolution.status !== "found" || resolution.pluginId !== decision.pluginId || resolution.installedVersion !== decision.packageRef.version || !pluginIntegrityMatches(resolution.record.integrity, decision.packageRef.integrity) || ownerInstallIsNewer(resolution.record.installedAt, decision.packageRef)) throw new Error(`Plugin ${decision.packageRef.ref}@${decision.packageRef.version} changed after removal planning.`);
					assertCurrent();
					const uninstallPlugin = deps.uninstallPlugin ?? (await import("./management-uninstall-BDHdh__p.mjs")).uninstallPluginWithPolicy;
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
					const removed = await (deps.uninstallSkill ?? applyClawHubSkillUninstall)(decision.skillPlan, {
						beforePersistentApply: assertCurrent,
						beforeRollback: () => packageLease.assertOwned()
					});
					if (!removed.ok) throw new Error(removed.error);
				}
				assertCurrent();
				await claimPackageRef(claimedRef ?? decision.packageRef, "complete");
				results.push({
					...base,
					action: "uninstalled"
				});
			} catch (error) {
				if (hasSqliteWorkerOutcomeUnknown(error)) throw error;
				if (error instanceof PluginRuntimeApplicationError) runtimeFailure = error;
				if (claimed) try {
					assertCurrent();
					await claimPackageRef(claimedRef ?? decision.packageRef, externalMutationStarted ? "failed" : "complete");
				} catch (claimError) {
					if (hasSqliteWorkerOutcomeUnknown(claimError)) throw new AggregateError([error, claimError], "Package cleanup outcome is unknown", { cause: claimError });
				}
				results.push({
					...base,
					action: "error",
					reason: coerceErrorMessage(error)
				});
			}
		};
		const previousResults = results.length;
		try {
			options.assertCurrent?.();
			await (deps.withPackageLease ?? withClawPackageLifecycleLease)(leaseArtifact, run, options);
		} catch (error) {
			if (hasSqliteWorkerOutcomeUnknown(error)) throw error;
			if (results.length === previousResults) results.push({
				...base,
				action: "error",
				reason: coerceErrorMessage(error)
			});
			else warnings.add(`Package removal lease cleanup failed: ${coerceErrorMessage(error)}`);
		}
	}
	return {
		packages: results,
		...warnings.size ? { warnings: [...warnings] } : {},
		...runtimeFailure ? { runtimeFailure } : {}
	};
}
//#endregion
//#region src/claws/provenance-secondary-references.ts
const CLAW_SECONDARY_REFERENCE_TABLES = [
	"claw_package_refs",
	"claw_mcp_server_refs",
	"claw_cron_refs"
];
function readClawSecondaryReferenceTables(db, agentId) {
	return CLAW_SECONDARY_REFERENCE_TABLES.filter((table) => {
		if (!tableExists(db, table)) return false;
		return Boolean(db.prepare(`SELECT 1 FROM ${table} WHERE agent_id = ? LIMIT 1`).get(agentId));
	});
}
//#endregion
//#region src/claws/provenance-adopted.ts
function agentOwnedPaths$1(plan) {
	return plan.actions.filter((action) => action.kind === "agent").map((action) => action.target);
}
/** Atomically records a migration's adopted agent and already-present workspace files. */
function persistClawMigrationOwnershipWithInstallRecordReader(plan, workspaceFiles, readInstallRecord, options = {}) {
	const nowMs = options.nowMs ?? Date.now();
	const agentConfigDigest = digestClawValue(plan.agent.config);
	const ownedPaths = agentOwnedPaths$1(plan);
	const ownership = encodeClawAgentOwnership(ownedPaths, "adopted");
	const record = runOpenClawStateWriteTransaction((database) => {
		assertAgentDeletionAllowsMutation(database, plan.agent.finalId);
		const { db } = database;
		if (readInstallRecord(db, plan.agent.finalId)) throw new Error(`Agent ${JSON.stringify(plan.agent.finalId)} already has Claw ownership; inspect claws status before migrating.`);
		const secondaryReferences = readClawSecondaryReferenceTables(db, plan.agent.finalId);
		if (secondaryReferences.length > 0) throw new Error(`Agent ${JSON.stringify(plan.agent.finalId)} has unclaimed Claw resource references in ${secondaryReferences.join(", ")}; reconcile them before migration.`);
		const existingWorkspaceOwnership = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("claw_workspace_files").select("target_path").where("agent_id", "=", plan.agent.finalId).limit(1));
		if (existingWorkspaceOwnership) throw new Error(`Agent ${JSON.stringify(plan.agent.finalId)} has an unclaimed Claw workspace-file ownership record for ${JSON.stringify(existingWorkspaceOwnership.target_path)}; reconcile it before migration.`);
		for (const file of workspaceFiles) {
			if (file.agentId !== plan.agent.finalId || file.workspace !== plan.agent.workspace || file.status !== "complete") throw new Error("Migration workspace ownership does not match its consented agent plan.");
			const collision = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("claw_workspace_files").select("agent_id").where("workspace", "=", file.workspace).where("target_path", "=", file.path).limit(1));
			if (collision) throw new Error(`Workspace path ${JSON.stringify(file.path)} is already tracked by Claw agent ${JSON.stringify(collision.agent_id)}.`);
		}
		const state = getNodeSqliteKysely(db);
		executeSqliteQuerySync(db, state.insertInto("claw_installs").values({
			agent_id: plan.agent.finalId,
			schema_version: ownership.schemaVersion,
			source_kind: plan.claw.kind,
			claw_name: plan.claw.name,
			claw_version: plan.claw.version,
			package_root: plan.claw.packageRoot,
			manifest_path: plan.claw.manifestPath,
			integrity_kind: plan.claw.integrityKind,
			integrity: plan.claw.integrity,
			source_byte_length: plan.claw.byteLength,
			manifest_schema_version: plan.manifestSchemaVersion,
			plan_integrity: plan.planIntegrity,
			workspace: plan.agent.workspace,
			agent_config_digest: agentConfigDigest,
			agent_owned_paths_json: ownership.agentOwnedPathsJson,
			bootstrap_source_path: null,
			bootstrap_content_digest: null,
			status: "complete",
			added_at_ms: nowMs,
			updated_at_ms: nowMs
		}));
		for (const file of workspaceFiles) executeSqliteQuerySync(db, state.insertInto("claw_workspace_files").values({
			schema_version: file.schemaVersion,
			agent_id: file.agentId,
			workspace: file.workspace,
			target_path: file.path,
			source_path: file.sourcePath,
			content_digest: file.contentDigest,
			status: file.status,
			created_at_ms: file.createdAtMs,
			updated_at_ms: file.updatedAtMs
		}));
		return {
			schemaVersion: CLAW_INSTALL_RECORD_ADOPTED_SCHEMA_VERSION,
			claw: plan.claw,
			manifestSchemaVersion: plan.manifestSchemaVersion,
			planIntegrity: plan.planIntegrity,
			agentId: plan.agent.finalId,
			workspace: plan.agent.workspace,
			agentConfigDigest,
			agentOrigin: "adopted",
			agentOwnedPaths: ownedPaths,
			status: "complete",
			addedAtMs: nowMs,
			updatedAtMs: nowMs
		};
	}, options);
	cacheClawInstallSchemaVersion(plan.agent.finalId, record.schemaVersion, record.agentConfigDigest, options);
	return record;
}
/** Releases adopted ownership metadata without changing the pre-existing agent or files. */
function releaseAdoptedClawInstallRecordWithInstallRecordReader(agentId, expectedPlanIntegrity, readInstallRecord, options = {}) {
	runOpenClawStateWriteTransaction((database) => {
		assertAgentDeletionAllowsMutation(database, agentId);
		const { db } = database;
		const record = readInstallRecord(db, agentId);
		if (!record) throw new Error(`No Claw install record exists for agent ${JSON.stringify(agentId)}.`);
		if (record.agentOrigin !== "adopted" || record.planIntegrity !== expectedPlanIntegrity || record.status !== "complete") throw new Error(`Adopted Claw ownership changed for agent ${JSON.stringify(agentId)}.`);
		const secondaryReferences = readClawSecondaryReferenceTables(db, agentId);
		if (secondaryReferences.length > 0) throw new Error(`Adopted Claw ownership for agent ${JSON.stringify(agentId)} now includes secondary resources in ${secondaryReferences.join(", ")}; reconcile them before releasing ownership.`);
		const state = getNodeSqliteKysely(db);
		executeSqliteQuerySync(db, state.deleteFrom("claw_workspace_files").where("agent_id", "=", agentId));
		if (executeSqliteQuerySync(db, state.deleteFrom("claw_installs").where("agent_id", "=", agentId).where("schema_version", "=", record.schemaVersion).where("plan_integrity", "=", expectedPlanIntegrity)).numAffectedRows !== 1n) throw new Error(`Adopted Claw ownership changed for agent ${JSON.stringify(agentId)}.`);
	}, options);
	deleteCachedClawInstallSchemaVersion(agentId, options);
}
//#endregion
//#region src/claws/provenance.ts
function agentOwnedPaths(plan) {
	return plan.actions.filter((action) => action.kind === "agent").map((action) => action.target);
}
function bootstrapProvenance(plan) {
	const action = plan.actions.find((candidate) => candidate.kind === "bootstrap");
	const sourcePath = action?.details?.sourcePath;
	return action && typeof sourcePath === "string" && action.digest ? {
		sourcePath,
		contentDigest: action.digest
	} : void 0;
}
function clawInstallRecordMatchesPlan(record, plan) {
	const bootstrap = bootstrapProvenance(plan);
	return record.claw.kind === plan.claw.kind && record.claw.name === plan.claw.name && record.claw.version === plan.claw.version && record.claw.packageRoot === plan.claw.packageRoot && record.claw.manifestPath === plan.claw.manifestPath && record.claw.integrityKind === plan.claw.integrityKind && record.claw.integrity === plan.claw.integrity && record.claw.byteLength === plan.claw.byteLength && record.manifestSchemaVersion === plan.manifestSchemaVersion && record.planIntegrity === plan.planIntegrity && record.workspace === plan.agent.workspace && record.agentConfigDigest === digestClawValue(plan.agent.config) && stableStringify(record.agentOwnedPaths) === stableStringify(agentOwnedPaths(plan)) && record.bootstrap?.sourcePath === bootstrap?.sourcePath && record.bootstrap?.contentDigest === bootstrap?.contentDigest;
}
function persistClawMigrationOwnership(plan, workspaceFiles, options = {}) {
	return persistClawMigrationOwnershipWithInstallRecordReader(plan, workspaceFiles, readClawInstallRecordFromDatabase, options);
}
function releaseAdoptedClawInstallRecord(agentId, expectedPlanIntegrity, options = {}) {
	releaseAdoptedClawInstallRecordWithInstallRecordReader(agentId, expectedPlanIntegrity, readClawInstallRecordFromDatabase, options);
}
function readClawInstallRecord(agentId, options = {}) {
	return readClawInstallRecordFromDatabase(openOpenClawStateDatabase(options).db, agentId);
}
function persistClawInstallRecord(plan, options = {}) {
	const nowMs = options.nowMs ?? Date.now();
	const status = options.status ?? "complete";
	const agentConfigDigest = digestClawValue(plan.agent.config);
	const ownedPaths = agentOwnedPaths(plan);
	const ownership = encodeClawAgentOwnership(ownedPaths, options.agentOrigin ?? "created");
	const bootstrap = bootstrapProvenance(plan);
	const persistedRecord = runOpenClawStateWriteTransaction((database) => {
		assertAgentDeletionAllowsMutation(database, plan.agent.finalId);
		const { db } = database;
		const record = readClawInstallRecordFromDatabase(db, plan.agent.finalId);
		if (record) {
			const expectedPlan = options.expectedExistingPlan ?? plan;
			if (record.status !== "complete" && clawInstallRecordMatchesPlan(record, expectedPlan)) {
				if (record.schemaVersion !== "openclaw.clawInstallRecord.v2") {
					if (options.deferLegacyPlanUpgrade) return record;
					return upgradeClawInstallSchema(database, plan.agent.finalId, record, options.expectedExistingRecord, {
						planIntegrity: plan.planIntegrity,
						agentConfigDigest
					});
				}
				return record;
			}
			throw new Error(`Claw install record for agent ${JSON.stringify(plan.agent.finalId)} already exists.`);
		}
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("claw_installs").values({
			agent_id: plan.agent.finalId,
			schema_version: ownership.schemaVersion,
			source_kind: plan.claw.kind,
			claw_name: plan.claw.name,
			claw_version: plan.claw.version,
			package_root: plan.claw.packageRoot,
			manifest_path: plan.claw.manifestPath,
			integrity_kind: plan.claw.integrityKind,
			integrity: plan.claw.integrity,
			source_byte_length: plan.claw.byteLength,
			manifest_schema_version: plan.manifestSchemaVersion,
			plan_integrity: plan.planIntegrity,
			workspace: plan.agent.workspace,
			agent_config_digest: agentConfigDigest,
			agent_owned_paths_json: ownership.agentOwnedPathsJson,
			bootstrap_source_path: bootstrap?.sourcePath ?? null,
			bootstrap_content_digest: bootstrap?.contentDigest ?? null,
			status,
			added_at_ms: nowMs,
			updated_at_ms: nowMs
		}));
		return {
			schemaVersion: ownership.schemaVersion,
			claw: plan.claw,
			manifestSchemaVersion: plan.manifestSchemaVersion,
			planIntegrity: plan.planIntegrity,
			agentId: plan.agent.finalId,
			workspace: plan.agent.workspace,
			agentConfigDigest,
			agentOrigin: options.agentOrigin ?? "created",
			agentOwnedPaths: ownedPaths,
			...bootstrap ? { bootstrap } : {},
			status,
			addedAtMs: nowMs,
			updatedAtMs: nowMs
		};
	}, options);
	cacheClawInstallSchemaVersion(plan.agent.finalId, persistedRecord.schemaVersion, persistedRecord.agentConfigDigest, options);
	return persistedRecord;
}
function updateClawInstallRecordStatus(agentId, status, options = {}) {
	runOpenClawStateWriteTransaction((database) => {
		assertAgentDeletionAllowsMutation(database, agentId, options.deletionOperation);
		const { db } = database;
		const expectedStatuses = options.expectedStatuses ?? [];
		let query = getNodeSqliteKysely(db).updateTable("claw_installs").set({
			status,
			updated_at_ms: options.nowMs ?? Date.now()
		}).where("agent_id", "=", agentId);
		if (expectedStatuses.length > 0) query = query.where("status", "in", expectedStatuses);
		if (executeSqliteQuerySync(db, query).numAffectedRows !== 1n) throw new Error(`Claw install record for agent ${JSON.stringify(agentId)} did not match the expected phase.`);
		options.deletionOperation?.handoffToRetry(database);
	}, options);
}
function deleteClawInstallRecord(agentId, options = {}) {
	runOpenClawStateWriteTransaction((database) => {
		assertAgentDeletionAllowsMutation(database, agentId);
		const { db } = database;
		const expectedStatuses = options.expectedStatuses ?? [];
		let query = getNodeSqliteKysely(db).deleteFrom("claw_installs").where("agent_id", "=", agentId);
		if (expectedStatuses.length > 0) query = query.where("status", "in", expectedStatuses);
		if (executeSqliteQuerySync(db, query).numAffectedRows !== 1n) throw new Error(`Claw install record for agent ${JSON.stringify(agentId)} did not match the expected phase.`);
	}, options);
	deleteCachedClawInstallSchemaVersion(agentId, options);
}
function readClawInstallRecords(options = {}) {
	return readClawInstallRecordsInDatabase(openOpenClawStateDatabase(options).db);
}
function updateClawInstallRecord(plan, options = {}) {
	const updatedAtMs = options.nowMs ?? Date.now();
	const status = options.status ?? "complete";
	const agentConfigDigest = options.agentConfigDigest ?? digestClawValue(plan.agent.config);
	const ownedAgentPaths = plan.actions.filter((action) => action.kind === "agent").map((action) => action.target);
	const record = runOpenClawStateWriteTransaction((database) => {
		assertAgentDeletionAllowsMutation(database, plan.agent.finalId);
		const { db } = database;
		const current = readClawInstallRecordFromDatabase(db, plan.agent.finalId);
		if (!current) throw new Error(`No Claw install record exists for agent ${JSON.stringify(plan.agent.finalId)}.`);
		const bootstrap = bootstrapProvenance(plan) ?? current.bootstrap;
		const ownership = encodeClawAgentOwnership(ownedAgentPaths, current.agentOrigin);
		if (executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("claw_installs").set({
			schema_version: ownership.schemaVersion,
			source_kind: plan.claw.kind,
			claw_name: plan.claw.name,
			claw_version: plan.claw.version,
			package_root: plan.claw.packageRoot,
			manifest_path: plan.claw.manifestPath,
			integrity_kind: plan.claw.integrityKind,
			integrity: plan.claw.integrity,
			source_byte_length: plan.claw.byteLength,
			manifest_schema_version: plan.manifestSchemaVersion,
			plan_integrity: plan.planIntegrity,
			workspace: plan.agent.workspace,
			agent_config_digest: agentConfigDigest,
			agent_owned_paths_json: ownership.agentOwnedPathsJson,
			bootstrap_source_path: bootstrap?.sourcePath ?? null,
			bootstrap_content_digest: bootstrap?.contentDigest ?? null,
			status,
			updated_at_ms: updatedAtMs
		}).where("agent_id", "=", plan.agent.finalId).where("claw_version", "=", options.expectedClaw?.version ?? current.claw.version).where("integrity", "=", options.expectedClaw?.integrity ?? current.claw.integrity)).numAffectedRows !== 1n) throw new Error(`Claw install record changed for agent ${JSON.stringify(plan.agent.finalId)}.`);
		return {
			schemaVersion: ownership.schemaVersion,
			claw: plan.claw,
			manifestSchemaVersion: plan.manifestSchemaVersion,
			planIntegrity: plan.planIntegrity,
			agentId: plan.agent.finalId,
			workspace: plan.agent.workspace,
			agentConfigDigest,
			agentOrigin: current.agentOrigin,
			agentOwnedPaths: ownedAgentPaths,
			...bootstrap ? { bootstrap } : {},
			status,
			addedAtMs: current.addedAtMs,
			updatedAtMs
		};
	}, options);
	cacheClawInstallSchemaVersion(plan.agent.finalId, record.schemaVersion, record.agentConfigDigest, options);
	return record;
}
function persistClawPackageRef(plan, pkg, options = {}) {
	const nowMs = options.nowMs ?? Date.now();
	let record = {
		schemaVersion: CLAW_PACKAGE_REF_SCHEMA_VERSION,
		agentId: plan.agent.finalId,
		clawName: plan.claw.name,
		kind: pkg.kind,
		source: pkg.source,
		ref: pkg.ref,
		version: pkg.version,
		integrity: pkg.integrity,
		status: options.status ?? "complete",
		relationship: options.relationship ?? (pkg.kind === "skill" ? "managed" : "referenced"),
		origin: options.origin ?? "claw-introduced",
		independentOwner: options.independentOwner ?? false,
		...pkg.extension ? { extension: pkg.extension } : {},
		installedAtMs: nowMs,
		updatedAtMs: nowMs
	};
	runOpenClawStateWriteTransaction(({ db }) => {
		const existing = db.prepare(`SELECT schema_version, agent_id, claw_name, package_kind, package_source,
                package_ref, package_version, package_integrity, package_status, relationship, origin,
                independent_owner, extension_id, extension_format, extension_detected_format,
                extension_mapped_json, extension_unavailable_json, extension_adapter_identity,
                installed_at_ms, updated_at_ms
           FROM claw_package_refs
          WHERE agent_id = @agent_id
            AND package_kind = @package_kind
            AND package_source = @package_source
            AND package_ref = @package_ref
            AND package_version = @package_version`).get({
			agent_id: record.agentId,
			package_kind: record.kind,
			package_source: record.source,
			package_ref: record.ref,
			package_version: record.version
		});
		if (existing) {
			const previous = rowToPackageRef(existing);
			if (previous.integrity !== record.integrity) throw new Error(`Claw package reference ${record.kind}:${record.ref}@${record.version} changed integrity from ${previous.integrity} to ${record.integrity}.`);
			record = {
				...record,
				relationship: previous.relationship,
				origin: previous.origin === "claw-introduced" ? "claw-introduced" : record.origin,
				independentOwner: previous.independentOwner || record.independentOwner,
				installedAtMs: previous.installedAtMs
			};
			executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("claw_package_refs").set({
				schema_version: record.schemaVersion,
				claw_name: record.clawName,
				package_status: record.status,
				relationship: record.relationship,
				origin: record.origin,
				independent_owner: record.independentOwner ? 1 : 0,
				...toPackageRefExtensionSqlParams(record.extension),
				updated_at_ms: record.updatedAtMs
			}).where("agent_id", "=", record.agentId).where("package_kind", "=", record.kind).where("package_source", "=", record.source).where("package_ref", "=", record.ref).where("package_version", "=", record.version).where("package_integrity", "=", record.integrity));
			return;
		}
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("claw_package_refs").values({
			agent_id: record.agentId,
			package_kind: record.kind,
			package_source: record.source,
			package_ref: record.ref,
			package_version: record.version,
			package_integrity: record.integrity,
			schema_version: record.schemaVersion,
			claw_name: record.clawName,
			package_status: record.status,
			relationship: record.relationship,
			origin: record.origin,
			independent_owner: record.independentOwner ? 1 : 0,
			...toPackageRefExtensionSqlParams(record.extension),
			installed_at_ms: record.installedAtMs,
			updated_at_ms: record.updatedAtMs
		}));
	}, options);
	return record;
}
function updateClawPackageRefStatus(ref, status, options = {}) {
	return runOpenClawStateWriteTransaction(({ db }) => updateClawPackageRefStatusInDatabase(db, ref, status, options.nowMs ?? Date.now()), options);
}
function readClawPackageRefs(options = {}) {
	return readClawPackageRefsInDatabase(openOpenClawStateDatabase(options).db, options);
}
function upgradeClawInstallSchema(database, agentId, record, expectedRecord, replacement) {
	assertAgentDeletionAllowsMutation(database, agentId);
	if (!expectedRecord || stableStringify(record) !== stableStringify(expectedRecord)) throw new Error(`Legacy Claw install record for agent ${JSON.stringify(agentId)} is not an exact resumable attempt.`);
	database.db.prepare(`UPDATE claw_installs
          SET schema_version = ?, plan_integrity = ?, agent_config_digest = ?
        WHERE agent_id = ?`).run(CLAW_INSTALL_RECORD_SCHEMA_VERSION, replacement?.planIntegrity ?? record.planIntegrity, replacement?.agentConfigDigest ?? record.agentConfigDigest, agentId);
	return {
		...record,
		...replacement,
		schemaVersion: CLAW_INSTALL_RECORD_SCHEMA_VERSION
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
	const actions = plan.actions.filter((action) => action.kind === "workspaceFile");
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
	for (const action of actions) {
		const writeError = (code, message) => new ClawWorkspaceWriteError([diagnostic(action, code, message)], createdFiles);
		try {
			if (!action.source || !action.digest) throw writeError("workspace_file_plan_invalid", "File action lacks source or digest.");
			const targetRelative = clawContainedRelativePath(workspaceRoot, resolve(action.target));
			if (!targetRelative) throw writeError("workspace_file_path_escape", "Workspace file source and destination must remain inside their owned roots.");
			const resolvedSource = await readClawWorkspaceActionSource({
				action,
				packageRoot,
				sourceRoot: source
			});
			const digest = digestClawBytes(resolvedSource.content);
			if (digest !== action.digest) throw writeError("workspace_source_changed", `Workspace source for ${JSON.stringify(action.id)} changed after planning.`);
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
			if (existingRecord && !sameWorkspaceFileOwner(existingRecord, expectedRecord)) throw writeError("workspace_file_ownership_conflict", `Workspace destination ${JSON.stringify(targetRelative)} is already claimed by different Claw provenance.`);
			if (await workspace.exists(targetRelative)) {
				if (!existingRecord || existingRecord.status === "failed") throw writeError("workspace_file_collision", `Workspace destination ${JSON.stringify(targetRelative)} already exists.`);
				const existingTarget = await workspace.read(targetRelative, {
					hardlinks: "reject",
					maxBytes: MAX_CLAW_WORKSPACE_FILE_BYTES,
					symlinks: "reject"
				});
				if (digestClawBytes(existingTarget.buffer) !== expectedRecord.contentDigest) throw writeError("workspace_file_drift", `Claw-owned workspace destination ${JSON.stringify(targetRelative)} no longer matches its recorded content.`);
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
			throw writeError(error instanceof ClawWorkspaceSourceAliasError ? "workspace_file_path_alias" : error instanceof FsSafeError ? `workspace_file_${error.code}` : "workspace_file_io_error", coerceErrorMessage(error));
		}
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
		...current
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
/** Package cleanup needs ownership and artifact inspections, without unrelated state repairs. */
async function readClawPackageRemovalStatus(agentId, options = {}) {
	const snapshot = await readClawPackageOwnership({
		...options,
		agentId
	});
	if (!snapshot.install && snapshot.packageRefs.length === 0 && !snapshot.orphanWorkspace) return;
	const firstPackage = snapshot.packageRefs[0];
	const install = snapshot.install ?? synthesizeOrphanInstall({
		agentId,
		clawName: firstPackage?.clawName,
		workspace: snapshot.orphanWorkspace?.workspace,
		updatedAtMs: Math.max(firstPackage?.updatedAtMs ?? 0, snapshot.orphanWorkspace?.updatedAtMs ?? 0)
	});
	return {
		install,
		...snapshot.install ? {} : { orphaned: true },
		packages: await Promise.all(snapshot.packageRefs.map((packageRef) => inspectClawPackageCompatibility({
			install,
			packageRef,
			packageDeps: options.packageDeps
		})))
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
		const lifecycleConfig = install.agentOrigin === "adopted" && listedMcp?.ok ? withAuthoredAgentRoster(config, listedMcp.sourceConfigBeforeMigrations) : config;
		const agent = listAgentEntries(lifecycleConfig).find((candidate) => candidate.id === install.agentId);
		let comparableAgent = agent;
		if (agent?.id && install.agentOrigin === "adopted") try {
			comparableAgent = normalizeWorkspaceConfig(resolveMigrationAgentSettings(lifecycleConfig, agent), await realpath(resolveAgentWorkspaceDir(config, install.agentId, options.env)).catch(() => resolve(resolveAgentWorkspaceDir(config, install.agentId, options.env))));
		} catch {
			comparableAgent = void 0;
		}
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
			agentState: !agent ? "missing" : digestClawValue(comparableAgent) === install.agentConfigDigest ? "present" : "modified",
			bootstrapState: bootstrap.state,
			bootstrap,
			workspaceFiles: await Promise.all(workspaceFiles.map(inspectClawWorkspaceFile)),
			packages: await Promise.all(packageRefs.map(async (packageRef) => await inspectClawPackageCompatibility({
				install,
				packageRef,
				packageDeps: options.packageDeps,
				packagePreflight
			}))),
			mcpServers: (options.readOnly ? readClawMcpServerRefs(install.agentId, options) : await reconcileClawMcpServerRefs(install.agentId, configuredMcpServers, options)).map((ref) => inspectMcpServer(ref, configuredMcpServers)),
			cronJobs: readClawCronRefs(install.agentId, options)
		});
	}
	const packages = records.flatMap((record) => record.packages);
	const mcpServers = records.flatMap((record) => record.mcpServers);
	const cronJobs = records.flatMap((record) => record.cronJobs);
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
			packageRefs: packages.length,
			missingPackages: packages.filter((pkg) => pkg.state === "missing").length,
			driftedPackages: packages.filter((pkg) => pkg.state === "modified" || pkg.state === "ambiguous" || pkg.extensionCompatibility?.state === "drifted").length,
			unavailableExtensions: packages.filter((pkg) => pkg.extensionCompatibility?.state === "unavailable").length,
			incompletePackages: packages.filter((pkg) => pkg.state === "incomplete").length,
			mcpServerRefs: mcpServers.length,
			driftedMcpServers: mcpServers.filter((server) => server.state === "modified" || server.state === "missing").length,
			unresolvedMcpServerRefs: mcpServers.filter((server) => server.state === "pending" || server.state === "failed").length,
			cronRefs: cronJobs.length,
			unresolvedCronRefs: cronJobs.filter((cron) => cron.status !== "complete" || !cron.schedulerJobId).length
		}
	};
}
//#endregion
//#region src/claws/package-remove-plan.ts
function orderClawPackageRemovals(decisions) {
	return decisions.toSorted((left, right) => Number(left.packageRef.relationship === "referenced") - Number(right.packageRef.relationship === "referenced"));
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
	return digestClawValue({
		decisions: orderClawPackageRemovals(decisions),
		cleanup: normalizeClawPackageCleanup(cleanup)
	});
}
function digestClawRemovalInstall(install) {
	return digestClawValue(install ?? null);
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
export { readClawSecondaryReferenceTables as A, readClawInstallRecord as C, updateClawInstallRecord as D, releaseAdoptedClawInstallRecord as E, planClawPackageRemovals as M, preflightPluginInstall as N, updateClawInstallRecordStatus as O, resolveInstalledClawHubPlugin as P, persistClawPackageRef as S, readClawPackageRefs as T, clawContainedRelativePath as _, orderClawPackageRemovals as a, persistClawInstallRecord as b, readClawStatus as c, createClawWorkspaceFiles as d, deleteClawWorkspaceFileRecord as f, upsertClawWorkspaceFile as g, readClawWorkspaceFiles as h, normalizeClawPackageCleanup as i, applyClawPackageRemovals as j, updateClawPackageRefStatus as k, CLAW_WORKSPACE_FILE_RECORD_SCHEMA_VERSION as l, readClawWorkspaceActionSource as m, digestClawRemovalInstall as n, projectClawPackageRemovePlan as o, readAllClawWorkspaceFiles as p, filterReferencedCleanup as r, readClawPackageRemovalStatus as s, digestClawPackageRemovalPlan as t, ClawWorkspaceWriteError as u, clawInstallRecordMatchesPlan as v, readClawInstallRecords as w, persistClawMigrationOwnership as x, deleteClawInstallRecord as y };
