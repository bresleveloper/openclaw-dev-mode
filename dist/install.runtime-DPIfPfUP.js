import { i as isPathInside } from "./path-BlG8lhgR.js";
import { w as pathExists } from "./fs-safe-aqmM_n6V.js";
import { a as root } from "./secure-temp-dir-XAWcZnE2.js";
import { o as resolveCompatibilityHostVersion, s as resolveRuntimeServiceVersion } from "./version-CeFj_iGk.js";
import { n as readJson } from "./json-files-2umMHm0W.js";
import { i as loadPluginManifest, r as getPackageManifestMetadata, s as resolvePackageExtensionEntries } from "./manifest-CQAVFF7Q.js";
import { a as loadBundleManifest, i as detectBundleManifestFormat } from "./bundle-manifest-DqzbkN_S.js";
import "./path-safety-4zNHq1Ot.js";
import { c as validateRegistryNpmSpec } from "./npm-registry-spec-C1h-FQFT.js";
import { t as checkMinHostVersion } from "./min-host-version-BdF7I7O6.js";
import { s as resolveArchiveKind } from "./archive-Dcpo6Wva.js";
import "./archive-CBe_wA_B.js";
import { i as resolveArchiveSourcePath } from "./install-source-utils-3l_kmjSm.js";
import { i as withExtractedArchiveRoot, r as resolveExistingInstallPath, t as installPackageDir } from "./install-package-dir-C5gnqebz.js";
import { a as scanFileInstallSource, i as scanBundleInstallSource, o as scanInstalledPackageDependencyTree, s as scanPackageInstallSource } from "./install-security-scan-DkWFgDHy.js";
import { a as finalizeNpmSpecArchiveInstall, i as resolveTimedInstallModeOptions, n as resolveCanonicalInstallTarget, o as installFromNpmSpecArchiveWithInstaller, r as resolveInstallModeOptions, t as ensureInstallTargetAvailable } from "./install-target-DEsx7rFB.js";
//#region src/plugins/install.runtime.ts
/** Lazy runtime barrel for plugin installation helpers used by install flows. */
//#endregion
export { checkMinHostVersion, detectBundleManifestFormat, ensureInstallTargetAvailable, pathExists as fileExists, finalizeNpmSpecArchiveInstall, getPackageManifestMetadata, installFromNpmSpecArchiveWithInstaller, installPackageDir, isPathInside, loadBundleManifest, loadPluginManifest, readJson as readJsonFile, resolveArchiveKind, resolveArchiveSourcePath, resolveCanonicalInstallTarget, resolveCompatibilityHostVersion, resolveExistingInstallPath, resolveInstallModeOptions, resolvePackageExtensionEntries, resolveRuntimeServiceVersion, resolveTimedInstallModeOptions, root, scanBundleInstallSource, scanFileInstallSource, scanInstalledPackageDependencyTree, scanPackageInstallSource, validateRegistryNpmSpec, withExtractedArchiveRoot };
