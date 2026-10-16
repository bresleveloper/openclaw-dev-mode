import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as pathExists } from "./fs-safe-BUXBSN-4.mjs";
import "./utils-DgZn2dLu.mjs";
import { i as resolvePackageExtensionEntries } from "./package-manifest-CEbdS_C4.mjs";
import { f as resolveEffectiveEnableState, u as normalizePluginsConfig } from "./config-state-DY_WJYue.mjs";
import "./manifest-BXjFCp0F.mjs";
import { a as detectBundleManifestFormat, o as loadBundleManifest } from "./bundle-manifest-BiKYAnae.mjs";
import { i as validatePackageExtensionEntriesForInstall } from "./package-entry-resolution-xOVI0l9q.mjs";
import { c as resolveOpenClawHostDependency, r as auditOpenClawPeerDependencyLink } from "./plugin-peer-link-B8_Vs9lb.mjs";
import { a as resolveTrustedSourceLinkedOfficialClawHubInstall, o as resolveTrustedSourceLinkedOfficialNpmInstall } from "./official-external-install-records-DRa6WG1g.mjs";
import { existsSync } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region src/plugins/payload-verification.ts
const TRACKED_SOURCES = /* @__PURE__ */ new Set([
	"npm",
	"clawhub",
	"git",
	"marketplace"
]);
function isPayloadMissing(env, rawInstallPath) {
	const installPath = normalizeOptionalString(rawInstallPath);
	if (!installPath) return true;
	const resolved = resolveUserPath(installPath, env);
	const bundleFormat = detectBundleManifestFormat(resolved);
	return !existsSync(path.join(resolved, "package.json")) && (!bundleFormat || !loadBundleManifest({
		rootDir: resolved,
		bundleFormat
	}).ok);
}
/** Finds tracked install records whose package payload is absent on disk. */
async function collectMissingPluginInstallPayloads(params) {
	const env = params.env ?? process.env;
	const normalizedPluginConfig = params.skipDisabledPlugins && params.config ? normalizePluginsConfig(params.config.plugins) : void 0;
	const missing = [];
	for (const [pluginId, record] of Object.entries(params.records).toSorted(([left], [right]) => left.localeCompare(right))) {
		if (!TRACKED_SOURCES.has(record.source)) continue;
		const officialNpmSpec = params.syncOfficialPluginInstalls ? resolveTrustedSourceLinkedOfficialNpmInstall({
			pluginId,
			record
		})?.npmSpec : void 0;
		const officialClawHubSpec = params.syncOfficialPluginInstalls ? resolveTrustedSourceLinkedOfficialClawHubInstall({
			pluginId,
			record
		})?.clawhubSpec : void 0;
		if (normalizedPluginConfig && params.config) {
			if (!resolveEffectiveEnableState({
				id: pluginId,
				origin: "global",
				config: normalizedPluginConfig,
				rootConfig: params.config
			}).enabled && !officialNpmSpec && !officialClawHubSpec) continue;
		}
		const rawInstallPath = normalizeOptionalString(record.installPath);
		if (!rawInstallPath) {
			missing.push({
				pluginId,
				reason: "missing-install-path"
			});
			continue;
		}
		const installPath = resolveUserPath(rawInstallPath, env);
		if (!await pathExists(installPath)) {
			missing.push({
				pluginId,
				installPath,
				reason: "missing-package-dir"
			});
			continue;
		}
		const bundlePayload = resolveBundleInstallRecordPayload({
			record,
			installPath
		});
		if (bundlePayload.isBundlePayload) {
			if (await hasNativePackageInstallPayload(installPath)) continue;
			if (validateBundleInstallRecordPayload({
				pluginId,
				installPath,
				bundleFormat: bundlePayload.bundleFormat
			})) missing.push({
				pluginId,
				installPath,
				reason: "missing-package-json"
			});
			continue;
		}
		if (isPayloadMissing(env, record.installPath)) missing.push({
			pluginId,
			installPath,
			reason: "missing-package-json"
		});
	}
	return missing;
}
/** Check package entries and bundle manifests without executing plugins before Gateway restart. */
async function runPluginPayloadSmokeCheck(params) {
	const checked = [];
	const failures = [];
	for (const [pluginId, record] of Object.entries(params.records).toSorted(([a], [b]) => a.localeCompare(b))) {
		if (!record || typeof record !== "object" || !TRACKED_SOURCES.has(record.source)) continue;
		const rawInstallPath = normalizeOptionalString(record.installPath);
		checked.push(pluginId);
		if (!rawInstallPath) {
			failures.push({
				pluginId,
				reason: "missing-install-path",
				detail: "Install path is missing from the plugin install record."
			});
			continue;
		}
		const installPath = resolveUserPath(rawInstallPath, params.env);
		if (!(await safeStat(installPath))?.isDirectory()) {
			failures.push({
				pluginId,
				installPath,
				reason: "missing-package-dir",
				detail: `Install dir is missing: ${installPath}`
			});
			continue;
		}
		const bundlePayload = resolveBundleInstallRecordPayload({
			record,
			installPath
		});
		const packagePayload = await readPackagePayloadManifest(installPath);
		if (packagePayload.status === "present") {
			if (!bundlePayload.isBundlePayload || hasNativePackageMetadata(packagePayload.manifest)) {
				failures.push(...await validatePackagePayload({
					pluginId,
					installPath,
					manifest: packagePayload.manifest,
					installSource: record.source,
					installSourceIsAuthoritative: params.installSourceProvenance !== "manifest-only"
				}));
				continue;
			}
		} else if (!bundlePayload.isBundlePayload) {
			failures.push(formatPackagePayloadReadFailure({
				pluginId,
				installPath,
				packagePayload
			}));
			continue;
		}
		const bundleFailure = validateBundleInstallRecordPayload({
			pluginId,
			installPath,
			bundleFormat: bundlePayload.bundleFormat
		});
		if (bundleFailure) failures.push(bundleFailure);
	}
	return {
		checked,
		failures
	};
}
/** Verifies the exact manifest records selected for this process. */
async function runPluginPayloadSmokeCheckForManifestRecords(params) {
	return await runPluginPayloadSmokeCheck({
		records: Object.fromEntries(params.plugins.map((plugin) => [plugin.id, {
			source: plugin.format === "bundle" ? "marketplace" : "npm",
			installPath: plugin.rootDir,
			...plugin.format === "bundle" ? { clawhubFamily: "bundle-plugin" } : {}
		}])),
		env: params.env,
		installSourceProvenance: "manifest-only"
	});
}
async function readPackagePayloadManifest(installPath) {
	const packageJsonPath = path.join(installPath, "package.json");
	if (!(await safeStat(packageJsonPath))?.isFile()) return { status: "missing" };
	let packageJson;
	try {
		packageJson = await fs$1.readFile(packageJsonPath, "utf8");
	} catch (err) {
		return {
			status: "unreadable",
			error: err instanceof Error ? err.message : String(err)
		};
	}
	try {
		const manifest = JSON.parse(packageJson);
		if (!isRecord(manifest)) return {
			status: "invalid",
			error: "package.json must be an object"
		};
		return {
			status: "present",
			manifest
		};
	} catch (err) {
		return {
			status: "invalid",
			error: err instanceof Error ? err.message : String(err)
		};
	}
}
function formatPackagePayloadReadFailure(params) {
	if (params.packagePayload.status === "unreadable") {
		const packageJsonPath = path.join(params.installPath, "package.json");
		return {
			pluginId: params.pluginId,
			installPath: params.installPath,
			reason: "unreadable-package-json",
			detail: `Could not read package.json at ${packageJsonPath}: ${params.packagePayload.error}`
		};
	}
	if (params.packagePayload.status === "invalid") return {
		pluginId: params.pluginId,
		installPath: params.installPath,
		reason: "invalid-package-json",
		detail: `Could not parse package.json: ${params.packagePayload.error}`
	};
	return {
		pluginId: params.pluginId,
		installPath: params.installPath,
		reason: "missing-package-json",
		detail: `package.json is missing under ${params.installPath}`
	};
}
function hasNativePackageMetadata(manifest) {
	return resolvePackageExtensionEntries(manifest).status !== "missing";
}
async function hasNativePackageInstallPayload(installPath) {
	const packagePayload = await readPackagePayloadManifest(installPath);
	return packagePayload.status === "present" && hasNativePackageMetadata(packagePayload.manifest);
}
async function validatePackagePayload(params) {
	const failures = [];
	const hostDependency = resolveOpenClawHostDependency(params.manifest);
	if (hostDependency && (hostDependency.declaration === "peerDependencies" || params.installSourceIsAuthoritative && params.installSource === "npm")) {
		const peerIssue = await auditOpenClawPeerDependencyLink({
			packageDir: params.installPath,
			packageName: params.manifest.name ?? params.pluginId
		});
		if (peerIssue) failures.push({
			pluginId: params.pluginId,
			installPath: params.installPath,
			reason: "missing-openclaw-peer-link",
			detail: `Plugin declares ${hostDependency.declaration === "peerDependencies" ? "peerDependency" : "dependency"} "openclaw" but ${hostDependency.declaration === "peerDependencies" ? "peer" : "host"} link audit failed: ${peerIssue.reason}.`
		});
	}
	const extensionResolution = resolvePackageExtensionEntries(params.manifest);
	if (extensionResolution.status === "invalid" || extensionResolution.status === "empty") {
		failures.push({
			pluginId: params.pluginId,
			installPath: params.installPath,
			reason: "missing-extension-entry",
			detail: `Plugin extension entry validation failed: ${extensionResolution.status === "invalid" ? extensionResolution.error : "package.json openclaw.extensions is empty"}`
		});
		return failures;
	}
	if (extensionResolution.status === "ok") {
		const extensionValidation = await validatePackageExtensionEntriesForInstall({
			packageDir: params.installPath,
			extensions: extensionResolution.entries,
			manifest: params.manifest
		});
		if (!extensionValidation.ok) failures.push({
			pluginId: params.pluginId,
			installPath: params.installPath,
			reason: "missing-extension-entry",
			detail: `Plugin extension entry validation failed: ${extensionValidation.error}`
		});
		return failures;
	}
	if (typeof params.manifest.main !== "string" || !params.manifest.main.trim()) return failures;
	const mainRel = params.manifest.main.trim();
	const mainPath = path.join(params.installPath, mainRel);
	if (!(await safeStat(mainPath))?.isFile()) failures.push({
		pluginId: params.pluginId,
		installPath: params.installPath,
		reason: "missing-main-entry",
		detail: `Plugin main entry "${mainRel}" not found at ${mainPath}`
	});
	return failures;
}
function isBundleInstallRecord(record) {
	return record.format === "bundle" || record.clawhubFamily === "bundle-plugin";
}
function resolveBundleInstallRecordPayload(params) {
	const hasBundleRecordMetadata = isBundleInstallRecord(params.record);
	if (!hasBundleRecordMetadata && params.record.source !== "marketplace") return {
		isBundlePayload: false,
		bundleFormat: null
	};
	const bundleFormat = detectBundleManifestFormat(params.installPath);
	return {
		isBundlePayload: hasBundleRecordMetadata || bundleFormat !== null,
		bundleFormat
	};
}
function validateBundleInstallRecordPayload(params) {
	if (!params.bundleFormat) return {
		pluginId: params.pluginId,
		installPath: params.installPath,
		reason: "missing-bundle-manifest",
		detail: `No supported bundle manifest or bundle marker found under ${params.installPath}`
	};
	const bundleManifest = loadBundleManifest({
		rootDir: params.installPath,
		bundleFormat: params.bundleFormat
	});
	if (bundleManifest.ok) return null;
	return {
		pluginId: params.pluginId,
		installPath: params.installPath,
		reason: bundleManifest.error.startsWith("plugin manifest not found") ? "missing-bundle-manifest" : "invalid-bundle-manifest",
		detail: `Bundle manifest validation failed: ${bundleManifest.error}`
	};
}
async function safeStat(target) {
	return await fs$1.stat(target).catch(() => null);
}
//#endregion
export { runPluginPayloadSmokeCheckForManifestRecords as i, isPayloadMissing as n, runPluginPayloadSmokeCheck as r, collectMissingPluginInstallPayloads as t };
