import { t as coerceErrorMessage } from "./error-coercion-CvJK4lmH.mjs";
import "./src-CdRlGRnW.mjs";
import { o as asRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { h as sleep } from "./utils-DgZn2dLu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { l as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-C51cJHzg.mjs";
import { n as openExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-D1jWDzK3.mjs";
import { a as readPluginMetadataStateRow } from "./bundled-discovery-state-C2EXzdGy.mjs";
import { n as hashStableJson } from "./installed-plugin-index-hash-N3AVaUCF.mjs";
import { r as resolveInstalledPluginIndexInstallOwner } from "./installed-plugin-index-install-owner-CQJv99I6.mjs";
import { N as normalizeClawHubSha256Integrity } from "./official-external-plugin-catalog-DWheKC4x.mjs";
import { t as parseInstalledPluginIndex } from "./installed-plugin-index-store-Dcdr8x8f.mjs";
import { t as createInstalledPluginOwnershipResolver } from "./installed-plugin-package-ownership-EjDH4q5b.mjs";
import { n as callGatewayFromCli } from "./gateway-rpc-Cl_Z2Z7Q.mjs";
import { i as withPluginLifecycleLease, t as hasPluginLifecycleLease } from "./plugin-lifecycle-lease-DHQMWweY.mjs";
import { i as resolveLocalProviderAuthEvidence } from "./model-auth-env-CI3qSPg4.mjs";
import { t as PLUGIN_ARTIFACT_ADAPTER_IDENTITY } from "./install-artifact-inspection-X2JhMF_r.mjs";
import { t as installPluginFromClawHub } from "./clawhub-D0sdqz9J.mjs";
import { n as withClawPackageLifecycleLease } from "./claw-package-lifecycle-lease-v-fevrKC.mjs";
import { n as resolvePluginCapabilityConsentCliOptions } from "./plugin-capability-consent-C9XqXUw9.mjs";
import { n as createPluginInstallLogger } from "./plugins-command-helpers-DJLU9f2x.mjs";
import { t as installManagedPlugin } from "./management-mutations-BAK2pvjN.mjs";
import { N as preflightPluginInstall, P as resolveInstalledClawHubPlugin, S as persistClawPackageRef, T as readClawPackageRefs, k as updateClawPackageRefStatus } from "./package-remove-plan-BJkvcHDT.mjs";
import { t as readClawInstallRecordFromDatabase } from "./provenance-read.kernel-B_3aRsEz.mjs";
import { t as resolveClawHubInstallConfirmation } from "./clawhub-install-confirmation-BEkRyZ5D.mjs";
import { t as withPluginSourceCleanup } from "./source-cleanup-PVYL0Hqp.mjs";
import { r as uninstallPluginWithPolicy } from "./management-uninstall-2GlKsqJz.mjs";
import { n as preflightSkillFromClawHub, t as installSkillFromClawHub } from "./clawhub-BHIpTBF4.mjs";
import { t as inspectPluginGenerationSources } from "./plugin-generation-source-inspection-6bc05bYz.mjs";
import fs from "node:fs";
import { tempWorkspace } from "@openclaw/fs-safe/temp";
//#region src/claws/package-resume.ts
function ownerInstallIsNewerThanRefs(installedAt, refs) {
	const timestamp = Date.parse(installedAt ?? "");
	return Number.isFinite(timestamp) && refs.length > 0 && refs.every((ref) => timestamp > ref.updatedAtMs);
}
function persistedExtensionMatchesPreflight(ref, preflight) {
	if (!ref.extension) return true;
	if (!preflight.ok) return false;
	return stableStringify({
		detectedFormat: ref.extension.detectedFormat,
		mapped: ref.extension.mapped,
		unavailable: ref.extension.unavailable,
		adapterIdentity: ref.extension.adapterIdentity
	}) === stableStringify({
		detectedFormat: preflight.detectedFormat,
		mapped: preflight.mapped ?? [],
		unavailable: preflight.unavailable ?? [],
		adapterIdentity: preflight.adapterIdentity
	});
}
function findResumableIntroducedPluginRequirement(params) {
	if (params.pkg.kind !== "plugin" || !params.preflight.ok || params.preflight.action !== "reuse") return;
	const expectedRawIntegrity = params.expectedIntegrity ?? params.preflight.integrity;
	if (!expectedRawIntegrity || !params.preflight.installedIntegrity) return;
	const expectedIntegrity = normalizeClawHubSha256Integrity(expectedRawIntegrity);
	const installedIntegrity = normalizeClawHubSha256Integrity(params.preflight.installedIntegrity);
	if (!expectedIntegrity || installedIntegrity !== expectedIntegrity) return;
	const ref = params.refs.find((candidate) => candidate.agentId === params.agentId && candidate.kind === params.pkg.kind && candidate.source === params.pkg.source && candidate.ref === params.pkg.ref && candidate.version === params.pkg.version && normalizeClawHubSha256Integrity(candidate.integrity) === expectedIntegrity && candidate.status === "complete" && candidate.relationship === "referenced" && candidate.origin === "claw-introduced" && !candidate.independentOwner && persistedExtensionMatchesPreflight(candidate, params.preflight));
	return ref && !ownerInstallIsNewerThanRefs(params.preflight.installedAt, [ref]) ? ref : void 0;
}
async function readClawResumeStateReadOnly(agentId, options = {}) {
	const database = await openExistingOpenClawStateDatabaseReadOnly({
		...options,
		requireCanonicalSchema: true
	});
	if (!database) return;
	try {
		const record = readClawInstallRecordFromDatabase(database.db, agentId);
		if (!record) return;
		return {
			record,
			packageRefs: readClawPackageRefs({
				...options,
				database,
				readOnly: true,
				agentId
			})
		};
	} finally {
		database.walMaintenance.close();
	}
}
//#endregion
//#region src/claws/package-setup-requirements.ts
function resolveClawPluginSetupRequirements(params) {
	const providers = params.setup?.providers ?? [];
	if (providers.some((provider) => (provider.envVars ?? []).some((name) => Boolean(params.env[name]?.trim())) || resolveLocalProviderAuthEvidence(provider.authEvidence, params.env))) return [];
	return providers.flatMap((provider) => {
		const envVars = provider.envVars ?? [];
		const authEvidence = provider.authEvidence ?? [];
		if (envVars.length === 0 && authEvidence.length === 0) return [];
		return [{
			kind: "plugin-setup",
			plugin: params.pluginId,
			provider: provider.id,
			envVars,
			authMethods: provider.authMethods ?? []
		}];
	});
}
//#endregion
//#region src/plugins/install-runtime-batch.ts
function indexFromRow(value) {
	if (value === void 0) return;
	const index = parseInstalledPluginIndex(asRecord(safeParseJson(value))?.index);
	if (!index) throw new Error("Plugin batch has an invalid installed-index receipt");
	return index;
}
/** Owns ephemeral committed facts and cleanup across the CLI-to-Gateway lease gap. */
var PluginInstallRuntimeBatch = class {
	constructor(options, reload) {
		this.options = options;
		this.reload = reload;
		this.installs = [];
		this.targets = [];
		this.retained = /* @__PURE__ */ new Set();
		this.sourceChecks = /* @__PURE__ */ new Map();
		this.phase = "collecting";
	}
	get hasCommitted() {
		return this.installs.some((entry) => entry.commit !== void 0);
	}
	close() {
		this.phase = "closed";
		for (const entry of this.installs.splice(0)) {
			entry.commit = void 0;
			entry.cleanups.length = 0;
		}
		this.targets = [];
		this.retained.clear();
		this.sourceChecks.clear();
	}
	assertOpen() {
		if (this.phase === "closed") throw new Error("Plugin installation batch is closed");
	}
	assertCollecting() {
		if (this.phase !== "collecting") throw new Error("Plugin installation batch no longer accepts mutations");
	}
	install() {
		this.assertCollecting();
		const entry = { cleanups: [] };
		this.installs.push(entry);
		return {
			record: (commit, assertSourceCurrent) => {
				this.assertCollecting();
				if (entry.commit) throw new Error("Plugin install already committed in this batch");
				entry.commit = commit;
				if (assertSourceCurrent) this.sourceChecks.set(commit.pluginId, assertSourceCurrent);
				else this.sourceChecks.delete(commit.pluginId);
			},
			deferCleanup: (cleanup, sourcePath) => {
				this.assertCollecting();
				if (!entry.commit) throw new Error("Cannot transfer cleanup before plugin installation commits");
				const configPath = entry.commit.write.configWrite.path;
				const original = fs.lstatSync(sourcePath, {
					bigint: true,
					throwIfNoEntry: false
				});
				entry.cleanups.push(async (index, assertOwned, warn) => {
					const assertUnclaimed = () => {
						assertOwned();
						const current = fs.lstatSync(sourcePath, {
							bigint: true,
							throwIfNoEntry: false
						});
						if (current && (!original || current.dev !== original.dev || current.ino !== original.ino)) throw new Error(`Retired plugin source changed before cleanup: ${sourcePath}`);
						if (createInstalledPluginOwnershipResolver(index, this.options.env).isSourceInUse(sourcePath, [])) throw new Error(`Retired plugin source acquired a current owner: ${sourcePath}`);
						assertOwned();
					};
					await withPluginSourceCleanup(sourcePath, {
						configPath,
						env: this.options.env,
						assertCurrent: assertUnclaimed
					}, (assertCurrent) => cleanup(assertCurrent, warn));
				});
			}
		};
	}
	retain(pluginId) {
		this.assertCollecting();
		this.retained.add(pluginId);
	}
	/** Called before the original batch lease exits, after its compensation has settled. */
	async prepare(lease) {
		this.assertCollecting();
		this.phase = "preparing";
		const databasePath = lease.databasePath;
		lease.assertOwned();
		this.assertOpen();
		this.databasePath = databasePath;
		if (!this.hasCommitted && this.retained.size === 0) {
			this.phase = "prepared";
			return;
		}
		const row = await readPluginMetadataStateRow("installed-index", { path: databasePath });
		lease.assertOwned();
		this.assertOpen();
		const index = indexFromRow(row?.value_json);
		const current = index?.installRecords ?? {};
		const targets = /* @__PURE__ */ new Map();
		for (const pluginId of this.retained) {
			if (!current[pluginId]) throw new Error(`Resumable plugin ${pluginId} is no longer installed`);
			const source = inspectPluginGenerationSources((index?.plugins ?? []).filter((entry) => resolveInstalledPluginIndexInstallOwner(entry) === pluginId && entry.enabled && entry.origin !== "bundled").map((entry) => ({
				pluginId: entry.pluginId,
				rootDir: entry.rootDir,
				entryFile: entry.source === entry.manifestPath ? entry.source : void 0
			})));
			this.sourceChecks.set(pluginId, source.assertSourceCurrent);
			targets.set(pluginId, {
				pluginId,
				installHash: hashStableJson(current[pluginId]),
				sourceDigests: source.sourceDigests
			});
		}
		const finalCommits = /* @__PURE__ */ new Map();
		for (const { commit } of this.installs) {
			if (!commit) continue;
			finalCommits.set(commit.pluginId, commit);
		}
		for (const commit of finalCommits.values()) {
			const { pluginId, write } = commit;
			if (write.mutation.databasePath !== databasePath) throw new Error("Plugin batch commit belongs to a different state database");
			const installed = indexFromRow(write.mutation.after.value_json)?.installRecords[pluginId];
			if (commit.operation === "uninstall") {
				if (installed || current[pluginId]) throw new Error(`Plugin ${pluginId} compensation did not remove its installed record`);
				targets.delete(pluginId);
				continue;
			}
			if (!installed) throw new Error(`Plugin ${pluginId} is missing from its committed index receipt`);
			const installHash = hashStableJson(installed);
			if (!current[pluginId] || hashStableJson(current[pluginId]) !== installHash) throw new Error(`Plugin ${pluginId} changed during batch settlement`);
			targets.set(pluginId, {
				pluginId,
				installHash,
				sourceDigests: commit.sourceDigests
			});
		}
		lease.assertOwned();
		this.assertOpen();
		this.targets = [...targets.values()].toSorted((a, b) => a.pluginId.localeCompare(b.pluginId));
		this.phase = "prepared";
	}
	/** The caller must leave every batch lease before invoking the captured runtime client. */
	async finish(warn) {
		if (this.phase !== "prepared" || !this.databasePath || hasPluginLifecycleLease()) throw new Error("Plugin batch was not prepared or its handoff already started");
		this.phase = "applying";
		const targets = this.targets;
		let application;
		try {
			if (targets.length === 0) return;
			application = await this.reload(targets);
			this.assertOpen();
			for (const warning of application.warnings ?? []) warn(warning);
			await withPluginLifecycleLease(this.options, async (lease) => {
				const assertOwned = () => {
					this.assertOpen();
					lease.assertOwned();
					if (lease.databasePath !== this.databasePath) throw new Error("Plugin cleanup belongs to a different state database");
				};
				assertOwned();
				const sourceCleanups = this.installs.flatMap(({ commit, cleanups }) => commit && targets.some((target) => target.pluginId === commit.pluginId) ? cleanups : []);
				if (sourceCleanups.length === 0) return;
				const row = await readPluginMetadataStateRow("installed-index", { path: lease.databasePath });
				assertOwned();
				const index = indexFromRow(row?.value_json);
				if (!index) throw new Error("Plugin index disappeared before source cleanup");
				const records = index.installRecords;
				const assertCurrent = () => {
					assertOwned();
					for (const target of targets) {
						this.sourceChecks.get(target.pluginId)?.();
						if (!records[target.pluginId] || hashStableJson(records[target.pluginId]) !== target.installHash) throw new Error(`Plugin ${target.pluginId} changed before committed source cleanup`);
					}
				};
				for (const cleanup of sourceCleanups) {
					assertCurrent();
					await cleanup(index, assertCurrent, warn);
					assertCurrent();
				}
			});
			return application;
		} catch (error) {
			throw new Error(`Plugin installations are saved: ${targets.map((target) => target.pluginId).join(", ")}. ` + (application ? `Gateway generation ${application.generation} was applied, but source cleanup failed. ` : "Runtime activation was not confirmed. ") + `Fix the reported issue, then run openclaw plugins reload <plugin-id> for each affected plugin. ${formatErrorMessage(error)}`, { cause: error });
		} finally {
			this.close();
		}
	}
};
//#endregion
//#region src/claws/plugin-runtime.ts
async function runClawPluginBatch(options, pluginCount, run, runtimeFailure) {
	if (!options.reloadPlugins || options.runtimeBatch) return await withPluginLifecycleLease(options, () => run(options.runtimeBatch));
	if (pluginCount > 64) throw new Error(`A live Claw requirement batch supports at most 64 plugin packages. Split the requirement batch before installing.`);
	const batch = new PluginInstallRuntimeBatch(options, options.reloadPlugins);
	let completed;
	const operation = await withPluginLifecycleLease(options, async (lease) => {
		let result;
		try {
			result = ok(await run(batch));
		} catch (error) {
			result = err(error);
		}
		completed = result;
		await batch.prepare(lease);
		return result;
	}).catch((error) => {
		const committed = batch.hasCommitted;
		batch.close();
		if (!committed && !completed) throw error;
		throw runtimeFailure(error, completed ?? err(error));
	});
	try {
		const runtime = options.runtime ?? defaultRuntime;
		const application = await batch.finish((message) => runtime.log(message));
		if (application) runtime.log(`Plugin requirements applied in Gateway generation ${application.generation}.`);
	} catch (error) {
		throw runtimeFailure(error, operation);
	}
	if (!operation.ok) throw operation.error;
	return operation.value;
}
//#endregion
//#region src/claws/packages.ts
var ClawPackageInstallError = class extends Error {
	constructor(code, message, installedPackages, options) {
		super(message, options);
		this.code = code;
		this.installedPackages = installedPackages;
		this.name = "ClawPackageInstallError";
	}
};
function packageFromAction(action) {
	const details = action.details;
	if (details?.kind !== "skill" && details?.kind !== "plugin") throw new Error(`Package action ${JSON.stringify(action.id)} has no valid package kind.`);
	if (details.source !== "clawhub" || !details.ref || !details.version || !details.integrity || !normalizeClawHubSha256Integrity(details.integrity)) throw new Error(`Package action ${JSON.stringify(action.id)} is not a pinned ClawHub package with integrity.`);
	if (details.ownerAction !== "install" && details.ownerAction !== "reuse") throw new Error(`Package action ${JSON.stringify(action.id)} has no planned owner state.`);
	if (details.kind === "plugin" && !details.installId) throw new Error(`Package action ${JSON.stringify(action.id)} has no resolved plugin id.`);
	return {
		kind: details.kind,
		source: details.source,
		ref: details.ref,
		version: details.version,
		integrity: details.integrity,
		ownerAction: details.ownerAction,
		...details.extension ? { extension: details.extension } : {},
		...details.installId ? { installId: details.installId } : {},
		...details.riskWarning ? { riskWarning: details.riskWarning } : {}
	};
}
async function probeClawPluginArtifact(pkg, isolateFromLiveExtensions, deps) {
	const probePlugin = deps.probePlugin ?? installPluginFromClawHub;
	const request = {
		spec: `clawhub:${pkg.ref}@${pkg.version}`,
		dryRun: true
	};
	if (!isolateFromLiveExtensions) return await probePlugin(request);
	const workspace = await tempWorkspace({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "openclaw-claw-plugin-probe-"
	});
	try {
		return await probePlugin({
			...request,
			extensionsDir: workspace.dir
		});
	} finally {
		await workspace.cleanup().catch(() => void 0);
	}
}
async function preflightClawPackage(pkg, workspaceDir, options = {}) {
	if (pkg.kind === "skill") {
		const result = await preflightSkillFromClawHub({
			workspaceDir,
			slug: pkg.ref,
			version: pkg.version
		});
		return result.ok ? result : {
			ok: false,
			code: result.code,
			message: result.error
		};
	}
	const result = await (options.deps?.preflightPlugin ?? preflightPluginInstall)({
		clawhubPackage: pkg.ref,
		rawSpec: `clawhub:${pkg.ref}@${pkg.version}`,
		expectedVersion: pkg.version
	});
	if (!result.ok && result.code !== "plugin_version_conflict") return {
		ok: false,
		code: result.code,
		message: result.error
	};
	const probe = await probeClawPluginArtifact(pkg, !(result.ok && result.action === "install"), options.deps ?? {});
	if (!probe.ok) return {
		ok: false,
		code: probe.code ?? "plugin_preflight_failed",
		message: probe.error
	};
	if (!probe.artifactInspection) return {
		ok: false,
		code: "plugin_artifact_inspection_unavailable",
		message: `Plugin ${pkg.ref}@${pkg.version} did not return canonical artifact inspection.`
	};
	if (probe.artifactInspection.format === "agent") return {
		ok: false,
		code: "plugin_artifact_format_unsupported",
		message: `Plugin ${pkg.ref}@${pkg.version} uses unsupported Claw extension format agent.`
	};
	const integrity = probe.clawhub.integrity ? normalizeClawHubSha256Integrity(probe.clawhub.integrity) : null;
	if (!integrity) return {
		ok: false,
		code: "plugin_integrity_unavailable",
		message: `Plugin ${pkg.ref}@${pkg.version} did not resolve an artifact integrity.`
	};
	const requirements = resolveClawPluginSetupRequirements({
		pluginId: probe.pluginId,
		setup: probe.setup,
		env: options.env ?? process.env
	});
	const artifact = {
		integrity,
		installId: probe.pluginId,
		...requirements.length > 0 ? { requirements } : {},
		detectedFormat: probe.artifactInspection.format,
		mapped: probe.artifactInspection.mapped,
		unavailable: probe.artifactInspection.unavailable,
		adapterIdentity: PLUGIN_ARTIFACT_ADAPTER_IDENTITY,
		...probe.warning ? { warning: probe.warning } : {}
	};
	if (!result.ok) return {
		ok: false,
		code: result.code,
		installedVersion: result.installedVersion,
		...artifact,
		message: `Plugin ${pkg.ref}@${pkg.version} conflicts with installed version ${result.installedVersion}.`
	};
	if (result.action === "reuse" && (result.installedId !== probe.pluginId || !result.installedIntegrity || normalizeClawHubSha256Integrity(result.installedIntegrity) !== integrity)) return {
		ok: false,
		code: "plugin_integrity_conflict",
		message: `Plugin ${pkg.ref}@${pkg.version} is installed as ${result.installedId} with integrity ${result.installedIntegrity ?? "unknown"}, expected ${probe.pluginId} with ${integrity}.`
	};
	return {
		ok: true,
		action: result.action,
		...artifact,
		...result.action === "reuse" && result.installedIntegrity ? { installedIntegrity: result.installedIntegrity } : {},
		...result.action === "reuse" && result.installedAt ? { installedAt: result.installedAt } : {}
	};
}
async function installClawPackages(plan, options = {}) {
	const pluginCount = plan.actions.filter((action) => action.kind === "package" && action.details?.kind === "plugin").length;
	if (!pluginCount) return await installClawPackagesUnlocked(plan, options);
	return await runClawPluginBatch(options, pluginCount, (runtimeBatch) => installClawPackagesUnlocked(plan, {
		...options,
		runtimeBatch
	}), (failure, operation) => {
		const original = !operation.ok && operation.error instanceof ClawPackageInstallError ? operation.error : void 0;
		return new ClawPackageInstallError(original?.code ?? "package_runtime_failed", [original?.message, coerceErrorMessage(failure)].filter(Boolean).join("\n"), original?.installedPackages ?? (operation.ok ? operation.value : []), { cause: !operation.ok ? new AggregateError([operation.error, failure]) : failure });
	});
}
async function installClawPackagesUnlocked(plan, options) {
	const deps = options.deps ?? {};
	const runtime = options.runtime ?? defaultRuntime;
	const installPlugin = deps.installPlugin ?? (async (params) => {
		const result = await installManagedPlugin(params);
		for (const warning of result.warnings ?? []) runtime.log(warning);
		runtime.log(`Installed plugin requirement: ${result.plugin.id}`);
		if (!params.deferRuntime && !params.applyRuntime) runtime.log("Restart the gateway to load plugins.");
	});
	const uninstallPlugin = deps.uninstallPlugin ?? (async (params) => {
		const result = await uninstallPluginWithPolicy(params);
		if (!result.ok) throw new Error(result.error);
		runtime.log(`Rolled back plugin requirement: ${result.value.pluginId}`);
	});
	const installSkill = deps.installSkill ?? installSkillFromClawHub;
	const preflightPlugin = deps.preflightPlugin ?? preflightPluginInstall;
	const preflightSkill = deps.preflightSkill ?? preflightSkillFromClawHub;
	const persistPackageRef = deps.persistPackageRef ?? persistClawPackageRef;
	const completePackageRef = deps.completePackageRef ?? updateClawPackageRefStatus;
	const readPackageRefs = deps.readPackageRefs ?? readClawPackageRefs;
	const withPackageLease = deps.withPackageLease ?? withClawPackageLifecycleLease;
	const resolvePlugin = deps.resolvePlugin ?? resolveInstalledClawHubPlugin;
	const installedPackages = [];
	const installedPlugins = [];
	for (const action of plan.actions.filter((candidate) => candidate.kind === "package")) try {
		const pkg = packageFromAction(action);
		await withPackageLease(pkg.kind === "plugin" ? {
			kind: pkg.kind,
			source: pkg.source,
			ref: pkg.ref
		} : {
			kind: pkg.kind,
			source: pkg.source,
			ref: pkg.ref,
			workspace: plan.agent.workspace
		}, async (packageLease) => {
			if (pkg.kind === "skill") {
				const preflight = await preflightSkill({
					workspaceDir: plan.agent.workspace,
					slug: pkg.ref,
					version: pkg.version,
					expectedIntegrity: pkg.integrity
				});
				packageLease.assertOwned();
				if (!preflight.ok) throw new Error(preflight.error);
				if (preflight.action !== pkg.ownerAction || preflight.warning !== pkg.riskWarning || normalizeClawHubSha256Integrity(preflight.integrity) !== normalizeClawHubSha256Integrity(pkg.integrity)) throw new ClawPackageInstallError("package_owner_state_changed", `Skill ${pkg.ref}@${pkg.version} changed after planning; run add --dry-run again.`, installedPackages);
				if (preflight.action === "reuse") {
					installedPackages.push(persistPackageRef(plan, pkg, {
						...options,
						status: "complete",
						relationship: "managed",
						origin: "pre-existing",
						independentOwner: true
					}));
					return;
				}
				let packageRef = persistPackageRef(plan, pkg, {
					...options,
					status: "pending",
					relationship: "managed",
					origin: "claw-introduced",
					independentOwner: false
				});
				installedPackages.push(packageRef);
				options.onExternalMutation?.(pkg);
				const installed = await installSkill({
					workspaceDir: plan.agent.workspace,
					slug: pkg.ref,
					version: pkg.version,
					expectedIntegrity: pkg.integrity,
					clawManaged: true
				});
				packageLease.assertOwned();
				if (!installed.ok) throw new Error(installed.error);
				packageRef = completePackageRef(packageRef, "complete", options);
				installedPackages[installedPackages.length - 1] = packageRef;
				return;
			}
			const preflight = await preflightPlugin({
				clawhubPackage: pkg.ref,
				rawSpec: `clawhub:${pkg.ref}@${pkg.version}`,
				expectedVersion: pkg.version
			});
			packageLease.assertOwned();
			if (!preflight.ok) throw new Error(preflight.code === "plugin_version_conflict" ? `Plugin ${pkg.ref}@${pkg.version} conflicts with installed version ${preflight.installedVersion}.` : preflight.error);
			const resumableRequirement = pkg.ownerAction === "install" && preflight.action === "reuse" ? findResumableIntroducedPluginRequirement({
				agentId: plan.agent.finalId,
				pkg,
				preflight,
				expectedIntegrity: pkg.integrity,
				refs: readPackageRefs({
					...options,
					agentId: plan.agent.finalId,
					kind: pkg.kind,
					source: pkg.source,
					ref: pkg.ref,
					version: pkg.version
				})
			}) : void 0;
			if (preflight.action !== pkg.ownerAction && !resumableRequirement) throw new ClawPackageInstallError("package_owner_state_changed", `Plugin ${pkg.ref}@${pkg.version} owner state changed from ${pkg.ownerAction} to ${preflight.action}; run add --dry-run again.`, installedPackages);
			const probe = await probeClawPluginArtifact(pkg, true, { probePlugin: deps.probePlugin });
			packageLease.assertOwned();
			if (!probe.ok) throw new Error(probe.error);
			const probeIntegrity = probe.clawhub.integrity ? normalizeClawHubSha256Integrity(probe.clawhub.integrity) : null;
			const plannedExtensionInspection = pkg.extension ? {
				detectedFormat: pkg.extension.detectedFormat,
				mapped: pkg.extension.mapped,
				unavailable: pkg.extension.unavailable,
				adapterIdentity: pkg.extension.adapterIdentity
			} : void 0;
			const probedExtensionInspection = probe.artifactInspection ? {
				detectedFormat: probe.artifactInspection.format,
				mapped: probe.artifactInspection.mapped,
				unavailable: probe.artifactInspection.unavailable,
				adapterIdentity: PLUGIN_ARTIFACT_ADAPTER_IDENTITY
			} : void 0;
			if (probe.pluginId !== pkg.installId || probeIntegrity !== normalizeClawHubSha256Integrity(pkg.integrity) || probe.warning !== pkg.riskWarning || plannedExtensionInspection && stableStringify(probedExtensionInspection) !== stableStringify(plannedExtensionInspection)) throw new ClawPackageInstallError("package_owner_state_changed", `Plugin ${pkg.ref}@${pkg.version} identity or trust state changed after planning; run add --dry-run again.`, installedPackages);
			if (preflight.action === "reuse") {
				if (preflight.installedId !== pkg.installId || !preflight.installedIntegrity || normalizeClawHubSha256Integrity(preflight.installedIntegrity) !== normalizeClawHubSha256Integrity(pkg.integrity)) throw new ClawPackageInstallError("package_owner_state_changed", `Plugin ${pkg.ref}@${pkg.version} identity changed after planning; run add --dry-run again.`, installedPackages);
				if (resumableRequirement) {
					options.runtimeBatch?.retain(probe.pluginId);
					installedPackages.push(persistPackageRef(plan, pkg, {
						...options,
						status: "complete",
						relationship: resumableRequirement.relationship,
						origin: resumableRequirement.origin,
						independentOwner: resumableRequirement.independentOwner
					}));
					return;
				}
				const existingRefs = readPackageRefs({
					...options,
					kind: pkg.kind,
					source: pkg.source,
					ref: pkg.ref,
					version: pkg.version
				});
				const inheritsClawOrigin = existingRefs.length > 0 && existingRefs.every((candidate) => candidate.origin === "claw-introduced" && !candidate.independentOwner) && !ownerInstallIsNewerThanRefs(preflight.installedAt, existingRefs);
				installedPackages.push(persistPackageRef(plan, pkg, {
					...options,
					status: "complete",
					relationship: "referenced",
					origin: inheritsClawOrigin ? "claw-introduced" : "pre-existing",
					independentOwner: !inheritsClawOrigin
				}));
				return;
			}
			let packageRef = persistPackageRef(plan, pkg, {
				...options,
				status: "pending",
				relationship: "referenced",
				origin: "claw-introduced",
				independentOwner: false
			});
			installedPackages.push(packageRef);
			options.onExternalMutation?.(pkg);
			await installPlugin({
				request: {
					source: "clawhub",
					packageName: pkg.ref,
					version: pkg.version,
					mode: options.pluginInstallMode ?? "install",
					expectedIntegrity: pkg.integrity,
					expectedPluginId: probe.pluginId
				},
				env: options.env,
				beforePersistentApply: () => packageLease.assertOwned(),
				logger: createPluginInstallLogger(runtime),
				confirmInstall: resolveClawHubInstallConfirmation(),
				...resolvePluginCapabilityConsentCliOptions({
					action: "install",
					runtime
				}),
				invalidateRuntimeCache: false,
				clawManaged: true,
				deferRuntime: options.runtimeBatch?.install()
			});
			if (options.pluginInstallMode !== "update") installedPlugins.push({
				installId: probe.pluginId,
				packageIndex: installedPackages.length - 1
			});
			packageLease.assertOwned();
			packageRef = completePackageRef(packageRef, "complete", options);
			installedPackages[installedPackages.length - 1] = packageRef;
		}, options);
	} catch (error) {
		if (hasSqliteWorkerOutcomeUnknown(error)) throw error;
		const pending = installedPackages.at(-1);
		if (pending?.status === "pending") try {
			installedPackages[installedPackages.length - 1] = completePackageRef(pending, "failed", options);
		} catch {}
		const rollbackErrors = [];
		for (const installedPlugin of installedPlugins.toReversed()) {
			const packageRef = installedPackages[installedPlugin.packageIndex];
			if (!packageRef) continue;
			try {
				await withPackageLease({
					kind: "plugin",
					source: "clawhub",
					ref: packageRef.ref
				}, async (rollbackLease) => {
					if (readPackageRefs({
						...options,
						kind: "plugin",
						source: "clawhub",
						ref: packageRef.ref,
						version: packageRef.version,
						integrity: packageRef.integrity
					}).filter((ref) => ref.agentId !== plan.agent.finalId && (ref.status === "pending" || ref.status === "complete")).length > 0) {
						rollbackErrors.push(`kept plugin ${installedPlugin.installId} because another Claw now references it`);
						return;
					}
					const currentRefs = readPackageRefs({
						...options,
						kind: "plugin",
						source: "clawhub",
						ref: packageRef.ref,
						version: packageRef.version
					});
					if (currentRefs.some((candidate) => candidate.independentOwner)) {
						rollbackErrors.push(`kept plugin ${installedPlugin.installId} because it now has a direct owner`);
						return;
					}
					const installed = await resolvePlugin({ clawhubPackage: packageRef.ref });
					const installedIntegrity = installed.status === "found" && installed.record.integrity ? normalizeClawHubSha256Integrity(installed.record.integrity) : null;
					if (installed.status !== "found" || installed.pluginId !== installedPlugin.installId || installed.installedVersion !== packageRef.version || installedIntegrity !== normalizeClawHubSha256Integrity(packageRef.integrity) || ownerInstallIsNewerThanRefs(installed.record.installedAt, currentRefs)) {
						rollbackErrors.push(`kept plugin ${installedPlugin.installId} because its installed identity changed after Claw installation`);
						return;
					}
					await uninstallPlugin({
						pluginId: installedPlugin.installId,
						caller: "cli",
						invalidateRuntimeCache: false,
						clawManaged: true,
						beforePersistentApply: () => rollbackLease.assertOwned(),
						onWarning: (warning) => runtime.log(warning),
						deferRuntime: options.runtimeBatch?.install()
					});
					rollbackLease.assertOwned();
					installedPackages[installedPlugin.packageIndex] = completePackageRef(installedPackages[installedPlugin.packageIndex] ?? packageRef, "rolled_back", options);
				}, options);
			} catch (rollbackError) {
				if (hasSqliteWorkerOutcomeUnknown(rollbackError)) throw rollbackError;
				rollbackErrors.push(`could not remove plugin ${installedPlugin.installId}: ${coerceErrorMessage(rollbackError)}`);
			}
		}
		const message = coerceErrorMessage(error);
		if (rollbackErrors.length > 0) throw new ClawPackageInstallError("package_rollback_failed", `${message} Rollback incomplete: ${rollbackErrors.join("; ")}.`, installedPackages, { cause: error });
		throw new ClawPackageInstallError(error instanceof ClawPackageInstallError ? error.code : "package_install_failed", message, installedPackages, { cause: error });
	}
	return installedPackages;
}
//#endregion
//#region src/cli/claws-cli.gateway-readiness.ts
const CLAW_AGENT_RELOAD_TIMEOUT_MS = 15e3;
const CLAW_AGENT_RELOAD_POLL_MS = 100;
async function waitUntilGatewayAgentAvailable(agentId) {
	const deadline = Date.now() + CLAW_AGENT_RELOAD_TIMEOUT_MS;
	let lastError;
	while (Date.now() < deadline) {
		try {
			const response = await callGatewayFromCli("config.get", { timeout: "5000" }, {});
			if (Object.hasOwn(response.config?.agents?.entries ?? {}, agentId) && typeof response.configRevisionHash === "string" && response.configRevisionHash === response.appliedConfigHash) return;
			lastError = void 0;
		} catch (error) {
			lastError = error;
		}
		await sleep(CLAW_AGENT_RELOAD_POLL_MS);
	}
	const suffix = lastError instanceof Error ? `: ${lastError.message}` : "";
	throw new Error(`Gateway did not apply the Claw agent configuration in time${suffix}`);
}
//#endregion
export { runClawPluginBatch as a, preflightClawPackage as i, ClawPackageInstallError as n, findResumableIntroducedPluginRequirement as o, installClawPackages as r, readClawResumeStateReadOnly as s, waitUntilGatewayAgentAvailable as t };
