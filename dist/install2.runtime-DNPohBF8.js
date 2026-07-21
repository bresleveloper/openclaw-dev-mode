import { i as isPathInside } from "./path-DILYn_gk.js";
import { v as pathExists } from "./fs-safe-RNq3oO57.js";
import { a as root } from "./secure-temp-dir-DMUMnweR.js";
import { s as resolveArchiveKind } from "./archive-CR1500gV.js";
import { o as resolveCompatibilityHostVersion, s as resolveRuntimeServiceVersion } from "./version-CeFj_iGk.js";
import { c as validateRegistryNpmSpec } from "./npm-registry-spec-C1h-FQFT.js";
import { n as readJson } from "./json-files-Ce1pXdh3.js";
import { i as loadPluginManifest, r as getPackageManifestMetadata, s as resolvePackageExtensionEntries } from "./manifest-D7Lv7P8W.js";
import { a as loadBundleManifest, i as detectBundleManifestFormat } from "./bundle-manifest-CGssMTvR.js";
import "./path-safety-4zNHq1Ot.js";
import { t as checkMinHostVersion } from "./min-host-version-iM63aFCL.js";
import "./archive-CBe_wA_B.js";
import { i as resolveArchiveSourcePath } from "./install-source-utils-FY9jQPuP.js";
import { i as withExtractedArchiveRoot, r as resolveExistingInstallPath, t as installPackageDir } from "./install-package-dir-DkvAlrgI.js";
import { a as scanFileInstallSource, i as scanBundleInstallSource, o as scanInstalledPackageDependencyTree, s as scanPackageInstallSource } from "./install-security-scan-1Vls-rdd.js";
import { a as finalizeNpmSpecArchiveInstall, i as resolveTimedInstallModeOptions, n as resolveCanonicalInstallTarget, o as installFromNpmSpecArchiveWithInstaller, r as resolveInstallModeOptions, t as ensureInstallTargetAvailable } from "./install-target-CJigP0gp.js";
//#region src/plugins/install.runtime.ts
/** Lazy runtime barrel for plugin installation helpers used by install flows. */
//#endregion
export { checkMinHostVersion, detectBundleManifestFormat, ensureInstallTargetAvailable, pathExists as fileExists, finalizeNpmSpecArchiveInstall, getPackageManifestMetadata, installFromNpmSpecArchiveWithInstaller, installPackageDir, isPathInside, loadBundleManifest, loadPluginManifest, readJson as readJsonFile, resolveArchiveKind, resolveArchiveSourcePath, resolveCanonicalInstallTarget, resolveCompatibilityHostVersion, resolveExistingInstallPath, resolveInstallModeOptions, resolvePackageExtensionEntries, resolveRuntimeServiceVersion, resolveTimedInstallModeOptions, root, scanBundleInstallSource, scanFileInstallSource, scanInstalledPackageDependencyTree, scanPackageInstallSource, validateRegistryNpmSpec, withExtractedArchiveRoot };
