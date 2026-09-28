import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { n as registerPluginMetadataProcessMemoLifecycleClear } from "./plugin-metadata-lifecycle-DtesR9-z.mjs";
import { l as normalizePluginsConfig, u as resolveEffectiveEnableState } from "./config-state-BEAL5gWH.mjs";
import { r as resolveInstalledPluginIndexInstallOwner, t as isInstalledPluginIndexInstallOwnerAmbiguous } from "./installed-plugin-index-install-owner-Bd-Byre8.mjs";
import { r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-Bwq1gZI1.mjs";
import { i as isTrustedOfficialPluginInstallRecord } from "./official-external-install-records-CwKXyAFm.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-pEXzzTbU.mjs";
import { n as resolvePluginControlPlaneWorkspace } from "./control-plane-workspace-KhFe5dXK.mjs";
import { t as createInstalledPluginOwnershipResolver } from "./installed-plugin-package-ownership-BnGMmE02.mjs";
import { r as assertConfigWriteAllowedInCurrentMode } from "./config-write-guard-DALlcipW.mjs";
import { t as ManagedPluginLifecycleError } from "./management-lifecycle-error-ySeX1uI2.mjs";
import { o as writePersistedInstalledPluginIndexInstallRecordsWithLease } from "./installed-plugin-index-records-Clh203og.mjs";
import { r as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DDl4WhIa.mjs";
import { c as resolvePluginInstallRecordIntegrity, i as diffDeclaredSurfaceWidening, r as computeDeclaredSurfaceHash, s as resolveAcceptedSurfaceCurrent, t as buildPluginCapabilityConsentReview, u as resolvePluginPackageDeclaredSurface } from "./capability-summary-CDNMLrkL.mjs";
import { n as resolvePluginArtifactDeclaredSurface, t as inspectPluginCapabilityArtifact } from "./capability-artifact-a-k2hGx7.mjs";
import path from "node:path";
//#region src/plugins/capability-consent.ts
/** Preserve caller control-flow failures across installers that normalize exceptions. */
function capturePluginCapabilityConsentHandlerErrors(handler) {
	let failure;
	return {
		onCapabilityConsent: handler ? async (review) => {
			try {
				return await handler(review);
			} catch (error) {
				failure = { error };
				throw error;
			}
		} : void 0,
		rethrowCallbackError: () => {
			if (failure) throw failure.error;
		}
	};
}
const pendingPluginCapabilityReviews = /* @__PURE__ */ new Map();
registerPluginMetadataProcessMemoLifecycleClear(() => {
	pendingPluginCapabilityReviews.clear();
});
function resolvePendingPluginCapabilityReview(pluginId) {
	return pendingPluginCapabilityReviews.get(pluginId);
}
function acceptManagedPluginDeclaredSurface(record, declared) {
	const integrity = resolvePluginInstallRecordIntegrity(record)?.integrity;
	const accepted = {
		...record,
		acceptedSurface: declared,
		acceptedSurfaceHash: computeDeclaredSurfaceHash(declared),
		acceptedSurfaceAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	delete accepted.acceptedSurfaceIntegrity;
	if (integrity) accepted.acceptedSurfaceIntegrity = integrity;
	return accepted;
}
function throwManagedPluginCapabilityConsentRequired(review, recovery = "Rerun the openclaw plugins install, enable, update, or reload command with --accept-capabilities after reviewing the plugin.") {
	pendingPluginCapabilityReviews.delete(review.pluginId);
	pendingPluginCapabilityReviews.set(review.pluginId, review);
	if (pendingPluginCapabilityReviews.size > 32) {
		const oldest = pendingPluginCapabilityReviews.keys().next().value;
		if (oldest !== void 0) pendingPluginCapabilityReviews.delete(oldest);
	}
	throw new ManagedPluginLifecycleError(`Plugin "${review.pluginId}" requires capability consent. ${recovery}`, { capabilityConsent: {
		pluginId: review.pluginId,
		reviewToken: review.reviewToken,
		...review.widened ? { widened: review.widened } : {},
		...review.acceptedAt ? { acceptedAt: review.acceptedAt } : {}
	} });
}
/** Enforce and durably acknowledge consent before an installed plugin is enabled. */
async function resolvePluginCapabilityConsent(params) {
	const env = params.env ?? process.env;
	return await withPluginLifecycleLease({ env }, async (lease) => {
		const workspace = resolvePluginControlPlaneWorkspace({
			config: params.config,
			env
		});
		const metadata = params.metadata ?? resolvePluginMetadataSnapshot({
			allowCurrent: false,
			config: params.config,
			env,
			...workspace.workspaceDir !== void 0 ? { workspaceDir: workspace.workspaceDir } : {}
		});
		const pluginId = metadata.normalizePluginId(params.pluginId);
		const plugin = metadata.index.plugins.find((candidate) => candidate.pluginId === pluginId);
		if (!plugin || plugin.origin === "bundled") return;
		if (!resolveInstalledPluginIndexInstallOwner(plugin) && !isInstalledPluginIndexInstallOwnerAmbiguous(plugin) && !Object.hasOwn(metadata.index.installRecords, pluginId)) return;
		const ownership = createInstalledPluginOwnershipResolver(metadata.index, env).resolvePackage(pluginId);
		if (!ownership.ok) throw new ManagedPluginLifecycleError(ownership.error);
		const { installOwner, installRecord } = ownership.value;
		const manifest = metadata.byPluginId.get(pluginId);
		if (!manifest) throw new ManagedPluginLifecycleError(`Plugin "${pluginId}" has no installed manifest.`);
		if (manifest.trustedOfficialInstall) {
			pendingPluginCapabilityReviews.delete(pluginId);
			return;
		}
		const declared = resolvePluginPackageDeclaredSurface(ownership.value, metadata.byPluginId);
		if (!declared) throw new ManagedPluginLifecycleError(`Plugin package "${installOwner}" has incomplete manifest metadata.`);
		const review = buildPluginCapabilityConsentReview({
			pluginId,
			manifest,
			record: installRecord,
			config: params.config,
			declared
		});
		if (resolveAcceptedSurfaceCurrent(installRecord, declared)) {
			pendingPluginCapabilityReviews.delete(pluginId);
			return;
		}
		assertConfigWriteAllowedInCurrentMode({ env });
		const acknowledgment = params.acknowledge ?? await params.onCapabilityConsent?.(review);
		if (!acknowledgment) throwManagedPluginCapabilityConsentRequired(review);
		await params.beforePersistentEffect?.();
		const records = await loadInstalledPluginIndexInstallRecords({ env });
		const persistedRecord = records[installOwner];
		if (!persistedRecord?.installPath) throw new ManagedPluginLifecycleError(`Plugin "${pluginId}" no longer has a verifiable installed package record.`);
		const currentDeclared = resolvePluginArtifactDeclaredSurface(persistedRecord.installPath, env, { config: params.config });
		const currentReview = buildPluginCapabilityConsentReview({
			pluginId,
			manifest,
			record: persistedRecord,
			config: params.config,
			declared: currentDeclared
		});
		if (acknowledgment.reviewToken !== currentReview.reviewToken) throwManagedPluginCapabilityConsentRequired(currentReview);
		params.beforePersistentApply?.();
		await writePersistedInstalledPluginIndexInstallRecordsWithLease({
			...records,
			[installOwner]: acceptManagedPluginDeclaredSurface(persistedRecord, currentDeclared)
		}, {
			env,
			config: params.config,
			lease
		});
		pendingPluginCapabilityReviews.delete(pluginId);
	});
}
async function resolvePluginArtifactCapabilityConsent(params) {
	const artifactContext = {
		config: params.config,
		currentArtifactDir: params.currentArtifactDir
	};
	const { declared, manifest } = inspectPluginCapabilityArtifact(params.artifactDir, params.env, artifactContext);
	const isOfficialArtifact = (artifactManifest) => params.sourceRecord !== void 0 && isTrustedOfficialPluginInstallRecord({
		pluginId: params.pluginId,
		packageName: artifactManifest?.packageName,
		record: params.sourceRecord
	});
	const official = isOfficialArtifact(manifest);
	const review = buildPluginCapabilityConsentReview({
		pluginId: params.pluginId,
		manifest: manifest ?? { name: params.pluginId },
		record: params.sourceRecord ?? params.record,
		config: params.config,
		declared,
		...params.previousDeclared ? { previousDeclared: params.previousDeclared } : {}
	});
	let acceptanceCurrent = false;
	if (params.mode === "update" && params.previousDeclared) {
		const { hasWidening } = diffDeclaredSurfaceWidening(params.previousDeclared, declared);
		const priorAcceptanceCurrent = params.previousRecord !== void 0 && resolveAcceptedSurfaceCurrent(params.previousRecord, params.previousDeclared) && resolvePluginInstallRecordIntegrity(params.previousRecord) !== void 0;
		acceptanceCurrent = !hasWidening && priorAcceptanceCurrent;
	}
	const acknowledgment = official || !params.enabled || acceptanceCurrent ? { reviewToken: review.reviewToken } : params.acknowledgeCapabilities ?? await params.onCapabilityConsent?.(review);
	if (acknowledgment) await params.beforePersistentEffect?.();
	const { declared: finalDeclared, manifest: finalManifest } = inspectPluginCapabilityArtifact(params.artifactDir, params.env, artifactContext);
	const finalToken = computeDeclaredSurfaceHash(finalDeclared);
	if (!acknowledgment || acknowledgment.reviewToken !== finalToken || official && !isOfficialArtifact(finalManifest)) return throwManagedPluginCapabilityConsentRequired(finalToken === review.reviewToken ? review : buildPluginCapabilityConsentReview({
		pluginId: params.pluginId,
		manifest: finalManifest ?? { name: params.pluginId },
		record: params.sourceRecord ?? params.record,
		config: params.config,
		declared: finalDeclared,
		...params.previousDeclared ? { previousDeclared: params.previousDeclared } : {}
	}), `The plugin was not ${params.currentArtifactDir ? "updated" : "installed"}. Re-run the same "openclaw plugins install" or "openclaw plugins update" command with --accept-capabilities, keeping its source and other options. For Doctor or setup, complete the plugin command first, then retry Doctor or setup.`);
	pendingPluginCapabilityReviews.delete(params.pluginId);
	return !official && (params.enabled || acceptanceCurrent) ? finalDeclared : void 0;
}
/** Bind artifact consent to verified staged bytes and carry acceptance into the record commit. */
function createManagedPluginArtifactConsentHandler(params) {
	const previousDeclaredByOwner = /* @__PURE__ */ new Map();
	for (const [installOwner, record] of Object.entries(params.previousRecords ?? {})) if (record.installPath) try {
		previousDeclaredByOwner.set(installOwner, resolvePluginArtifactDeclaredSurface(record.installPath, params.env, { config: params.config }));
	} catch {}
	const pendingAcceptedSurfaces = /* @__PURE__ */ new Map();
	return {
		onBeforePluginArtifactCommit: async (artifact) => {
			pendingAcceptedSurfaces.clear();
			const matchingOwners = Object.entries(params.previousRecords ?? {}).filter(([installOwner, record]) => installOwner === artifact.pluginId || installOwner === params.previousPluginOwners?.get(artifact.pluginId) || Boolean(artifact.currentArtifactDir && record.installPath && path.resolve(resolveUserPath(artifact.currentArtifactDir, params.env)) === path.resolve(resolveUserPath(record.installPath, params.env))));
			if (matchingOwners.length > 1) throw new ManagedPluginLifecycleError(`Plugin "${artifact.pluginId}" matches multiple installed package owners.`);
			const [installOwner, previousRecord] = matchingOwners[0] ?? [];
			const previousDeclared = installOwner ? previousDeclaredByOwner.get(installOwner) : void 0;
			const declared = await resolvePluginArtifactCapabilityConsent({
				config: params.config,
				env: params.env,
				pluginId: artifact.pluginId,
				artifactDir: artifact.stagedArtifactDir,
				currentArtifactDir: previousRecord?.installPath ?? artifact.currentArtifactDir,
				record: {
					source: params.source,
					installPath: artifact.stagedArtifactDir,
					...params.spec ? { spec: params.spec } : {},
					...params.expectedIntegrity ? { integrity: params.expectedIntegrity } : {}
				},
				sourceRecord: artifact.sourceRecord,
				acknowledgeCapabilities: params.acknowledgeCapabilities,
				onCapabilityConsent: params.onCapabilityConsent,
				beforePersistentEffect: params.beforePersistentEffect,
				...previousRecord ? { previousRecord } : {},
				...previousDeclared ? { previousDeclared } : {},
				mode: artifact.mode,
				enabled: !params.updatingPluginIds?.length || params.updatingPluginIds.some((id) => resolveEffectiveEnableState({
					id,
					origin: "global",
					config: normalizePluginsConfig(params.config.plugins),
					rootConfig: params.config
				}).enabled)
			});
			pendingAcceptedSurfaces.set(artifact.pluginId, declared);
		},
		applyAcceptedSurface: (pluginId, record) => {
			const declared = pendingAcceptedSurfaces.get(pluginId);
			if (!pendingAcceptedSurfaces.has(pluginId)) throw new ManagedPluginLifecycleError(`Plugin "${pluginId}" did not expose its verified artifact for capability review.`);
			return declared ? acceptManagedPluginDeclaredSurface(record, declared) : record;
		}
	};
}
/** Prepare the same package-owned consent history for every managed installer. */
async function prepareManagedPluginArtifactConsentHandler(params) {
	const env = params.env ?? process.env;
	const previousRecords = params.previousRecords ?? await loadInstalledPluginIndexInstallRecords({ env });
	const workspace = resolvePluginControlPlaneWorkspace({
		config: params.config,
		env
	});
	const metadata = Object.keys(previousRecords).length > 0 ? resolvePluginMetadataSnapshot({
		allowCurrent: false,
		config: params.config,
		env,
		...workspace.workspaceDir !== void 0 ? { workspaceDir: workspace.workspaceDir } : {}
	}) : void 0;
	const previousPluginOwners = /* @__PURE__ */ new Map();
	for (const plugin of metadata?.index.plugins ?? []) {
		const owner = resolveInstalledPluginIndexInstallOwner(plugin);
		if (owner) previousPluginOwners.set(plugin.pluginId, owner);
	}
	return createManagedPluginArtifactConsentHandler({
		...params,
		env,
		previousRecords,
		previousPluginOwners
	});
}
//#endregion
export { resolvePluginCapabilityConsent as a, resolvePendingPluginCapabilityReview as i, createManagedPluginArtifactConsentHandler as n, prepareManagedPluginArtifactConsentHandler as r, capturePluginCapabilityConsentHandlerErrors as t };
