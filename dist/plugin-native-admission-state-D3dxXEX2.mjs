import { o as getPluginCache } from "./plugin-cache-BABafcXD.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { r as isArtifactPreservingStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { n as isDeeplyFrozenPlainData } from "./immutable-data-MyNs7ITg.mjs";
import { r as resolveActivePluginInstallRoots } from "./install-root-context-DhumTK8D.mjs";
import { r as resolvePluginSourceCaptureStorage } from "./plugin-source-capture-context-B9nV7ZEy.mjs";
import { o as retainPluginNativeCapturePath } from "./plugin-source-capture-directory-suikpgfR.mjs";
import { a as safeRealpathSync } from "./path-safety-6KJ2Rbnw.mjs";
import { r as resolveInstalledPluginIndexInstallOwner } from "./installed-plugin-index-install-owner-CQJv99I6.mjs";
import { o as resolveRetainedManagedNpmInstallPackageInfo } from "./managed-npm-retention-BPamOGs_.mjs";
import { t as resolvePluginMetadataEnvFingerprint } from "./plugin-metadata-env-BPH6mLZF.mjs";
import path from "node:path";
//#region src/plugins/plugin-native-admission-state.ts
const admissions = /* @__PURE__ */ new WeakMap();
const admissionScopes = /* @__PURE__ */ new WeakMap();
const snapshotOwners = /* @__PURE__ */ new WeakMap();
function resolveAdmissionViewKey(readOnly = isArtifactPreservingStateRead(), storage = resolvePluginSourceCaptureStorage(), publicationStateDir = resolveActivePluginInstallRoots().stateDir) {
	return JSON.stringify([
		readOnly ? "readonly" : "writable",
		resolvePluginMetadataEnvFingerprint(),
		storage.stateDir,
		storage.placement,
		publicationStateDir
	]);
}
function retainNativePath(state, filename) {
	if (!state.pins.has(filename)) state.pins.set(filename, retainPluginNativeCapturePath(filename));
}
async function settlePluginNativeAdmissions(cache = getPluginCache()) {
	for (const state of admissions.get(cache)?.values() ?? []) await settleAdmissionState(state);
}
async function settleAdmissionState(state) {
	await Promise.all(state.pending);
	for (const key of state.publications.keys()) startNativeAdmissionPublication(state, key);
	await Promise.all(state.pending);
}
function startNativeAdmissionPublication(state, key) {
	const publish = state.publications.get(key);
	if (!publish || state.publishing.has(key)) return;
	state.publishing.add(key);
	const pending = publish().finally(() => {
		state.publishing.delete(key);
		state.pending.delete(pending);
	});
	state.pending.add(pending);
}
function bindAdmissionState(cache, state) {
	let scope = admissionScopes.get(cache);
	if (!scope) {
		scope = /* @__PURE__ */ new Set();
		admissionScopes.set(cache, scope);
		const held = scope;
		cache.sourceAdmissions = {
			invalidate() {
				admissions.delete(cache);
			},
			async dispose() {
				for (const owned of held) {
					await Promise.all(owned.pending);
					owned.borrowers.delete(held);
					if (owned.borrowers.size > 0) continue;
					await settleAdmissionState(owned);
					for (const release of owned.pins.values()) release();
					owned.pins.clear();
					const released = [...owned.roots].filter((root) => {
						const owners = snapshotOwners.get(root);
						owners.delete(owned);
						return owners.size === 0;
					});
					await Promise.all(released.map((root) => root.disposeAsync()));
					owned.roots.clear();
				}
				held.clear();
				admissions.delete(cache);
				admissionScopes.delete(cache);
			}
		};
	}
	scope.add(state);
	state.borrowers.add(scope);
	let views = admissions.get(cache);
	if (!views) {
		views = /* @__PURE__ */ new Map();
		admissions.set(cache, views);
	}
	views.set(state.viewKey, state);
	return state;
}
function nativeAdmissionStateFor(cache = getPluginCache()) {
	const artifactPreservingReadOnly = isArtifactPreservingStateRead();
	const captureStorage = resolvePluginSourceCaptureStorage();
	const publicationStateDir = resolveActivePluginInstallRoots().stateDir;
	const viewKey = resolveAdmissionViewKey(artifactPreservingReadOnly, captureStorage, publicationStateDir);
	return admissions.get(cache)?.get(viewKey) ?? bindAdmissionState(cache, {
		viewKey,
		captureStorage,
		publicationStateDir,
		artifactPreservingReadOnly,
		preparedIndexes: /* @__PURE__ */ new WeakSet(),
		owners: /* @__PURE__ */ new Map(),
		managedRoots: /* @__PURE__ */ new Map(),
		receipts: /* @__PURE__ */ new Map(),
		files: /* @__PURE__ */ new Map(),
		namespaces: /* @__PURE__ */ new Map(),
		pins: /* @__PURE__ */ new Map(),
		roots: /* @__PURE__ */ new Set(),
		pending: /* @__PURE__ */ new Set(),
		publications: /* @__PURE__ */ new Map(),
		publishing: /* @__PURE__ */ new Set(),
		borrowers: /* @__PURE__ */ new Set()
	});
}
/** Inspections in the same state view share payload custody, never registration authority. */
function inheritPluginNativeAdmissions(sourceCache, targetCache) {
	if (sourceCache !== targetCache) bindAdmissionState(targetCache, nativeAdmissionStateFor(sourceCache));
}
/** Carry prepared receipts to workers without mutating the published metadata snapshot. */
function overlayPluginNativeAdmissions(index, cache) {
	const state = admissions.get(cache)?.get(resolveAdmissionViewKey());
	if (!state || state.receipts.size === 0) return index;
	return {
		...index,
		plugins: index.plugins.map((record) => {
			const prefix = `${path.resolve(record.rootDir)}\0`;
			const receipts = [...state.receipts].filter(([key]) => key.startsWith(prefix));
			return receipts.length ? {
				...record,
				sourceAdmissions: {
					...record.sourceAdmissions,
					...structuredClone(Object.fromEntries(receipts))
				}
			} : record;
		})
	};
}
/** Seed the existing cache generation once from its admitted installed-index payload. */
function preparePluginNativeAdmissions(index, cache = getPluginCache()) {
	const state = nativeAdmissionStateFor(cache);
	if (state.preparedIndexes.has(index)) return;
	for (const record of index.plugins) {
		const root = path.resolve(record.rootDir);
		if (state.owners.has(root)) continue;
		state.owners.set(root, record);
		const installOwner = resolveInstalledPluginIndexInstallOwner(record);
		const install = installOwner ? index.installRecords[installOwner] : void 0;
		const installRoot = install?.installPath ? safeRealpathSync(install.installPath) ?? path.resolve(install.installPath) : void 0;
		if (install && installRoot !== void 0 && isPathInside(installRoot, safeRealpathSync(root) ?? root)) {
			if (install.source === "npm") {
				const project = resolveRetainedManagedNpmInstallPackageInfo(installRoot);
				state.managedRoots.set(project?.projectRoot ?? installRoot, project ? "retained-npm" : "installed");
			} else if ([
				"archive",
				"clawhub",
				"marketplace",
				"git"
			].includes(install.source) || install.source === "path" && install.sourcePath && (safeRealpathSync(install.sourcePath) ?? path.resolve(install.sourcePath)) !== installRoot) state.managedRoots.set(installRoot, "installed");
		}
		for (const [key, receipt] of Object.entries(record.sourceAdmissions ?? {})) {
			state.receipts.set(key, structuredClone(receipt));
			for (const [id, namespace] of Object.entries(receipt.nativeNamespaces)) state.namespaces.set(id, structuredClone(namespace));
			for (const [source, fact] of Object.entries(receipt.nativeArtifacts)) state.files.set(source, { ...fact });
		}
	}
	if (isDeeplyFrozenPlainData(index)) state.preparedIndexes.add(index);
}
//#endregion
export { retainNativePath as a, startNativeAdmissionPublication as c, preparePluginNativeAdmissions as i, nativeAdmissionStateFor as n, settlePluginNativeAdmissions as o, overlayPluginNativeAdmissions as r, snapshotOwners as s, inheritPluginNativeAdmissions as t };
