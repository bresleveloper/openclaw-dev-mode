import { t as coerceErrorMessage } from "./error-coercion-C787aVxk.mjs";
import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { a as resolveDefaultPluginExtensionsDir, s as resolveDefaultPluginNpmDir } from "./install-paths-DnOgVB7K.mjs";
import { n as auditOpenClawPeerDependenciesInManagedNpmRoot, o as reconcileRegisteredOpenClawHostLinks, s as relinkOpenClawPeerDependenciesInManagedNpmRoot } from "./plugin-peer-link-C9fwm_tB.mjs";
import { r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-Bwq1gZI1.mjs";
import { u as listManagedPluginNpmRootsSync } from "./managed-npm-retention-dDTeoxiW.mjs";
import "./installed-plugin-index-records-Clh203og.mjs";
import { t as note } from "./note-UlSlsJKw.mjs";
import path from "node:path";
//#region src/commands/doctor-plugin-host-links.ts
function resolveRegisteredPluginExtensionsRoot(params) {
	return params.stateDir ? path.join(params.stateDir, "extensions") : resolveDefaultPluginExtensionsDir(params.env);
}
/** Resolves all managed npm roots from the doctor state override or environment. */
function resolveDoctorPluginNpmRoots(params) {
	const npmRoot = params.stateDir ? path.join(params.stateDir, "npm") : resolveDefaultPluginNpmDir(params.env);
	return listManagedPluginNpmRootsSync(npmRoot);
}
/** Audits managed npm and registered plugin host links without mutating either root. */
async function listPluginOpenClawHostLinkIssues(params) {
	const packageReadFailures = [];
	const registeredPackageReadFailures = [];
	const audits = await Promise.all(resolveDoctorPluginNpmRoots(params).map((npmRoot) => auditOpenClawPeerDependenciesInManagedNpmRoot({
		npmRoot,
		onPackageReadError: (error, packageDir) => {
			packageReadFailures.push({
				packageDir,
				reason: coerceErrorMessage(error)
			});
		}
	})));
	const registeredAudit = await reconcileRegisteredOpenClawHostLinks({
		installRecords: await loadInstalledPluginIndexInstallRecords(params),
		extensionsDir: resolveRegisteredPluginExtensionsRoot(params),
		env: params.env,
		mode: "audit",
		onPackageReadError: (error, packageDir) => {
			registeredPackageReadFailures.push({
				packageDir,
				reason: coerceErrorMessage(error)
			});
		}
	});
	return {
		peerLinkIssues: audits.flatMap((audit) => audit.issues),
		packageReadFailures,
		registeredPeerLinkIssues: registeredAudit.issues,
		registeredPackageReadFailures
	};
}
/** Relinks registry-owned plugin packages to the current OpenClaw host package. */
async function maybeRepairPluginOpenClawHostLinks(params) {
	const npmRoots = resolveDoctorPluginNpmRoots(params);
	if (!params.prompter.shouldRepair) {
		const audit = await listPluginOpenClawHostLinkIssues(params);
		if (audit.peerLinkIssues.length > 0) note([
			"Managed npm OpenClaw host peer links need repair:",
			...audit.peerLinkIssues.map((issue) => `- ${issue.packageName}: ${issue.reason}`),
			`Repair with ${formatCliCommand("openclaw doctor --fix")} to relink managed npm plugin packages.`
		].join("\n"), "Plugin registry");
		if (audit.packageReadFailures.length > 0) note(["Managed npm plugin packages could not be inspected:", ...audit.packageReadFailures.map((failure) => `- ${shortenHomePath(failure.packageDir)}: ${failure.reason}`)].join("\n"), "Plugin registry");
		if (audit.registeredPackageReadFailures.length > 0) note(["Registered plugin packages could not be inspected:", ...audit.registeredPackageReadFailures.map((failure) => `- ${shortenHomePath(failure.packageDir)}: ${failure.reason}`)].join("\n"), "Plugin registry");
		if (audit.registeredPeerLinkIssues.length > 0) note([
			"Registered plugin OpenClaw host links need repair:",
			...audit.registeredPeerLinkIssues.map((issue) => `- ${issue.packageName}: ${issue.reason}`),
			`Repair with ${formatCliCommand("openclaw doctor --fix")} to relink registered plugin packages.`
		].join("\n"), "Plugin registry");
		return false;
	}
	const messages = [];
	const logger = {
		info: (message) => messages.push({
			level: "info",
			message
		}),
		warn: (message) => messages.push({
			level: "warn",
			message
		})
	};
	const repaired = (await Promise.all(npmRoots.map((npmRoot) => relinkOpenClawPeerDependenciesInManagedNpmRoot({
		npmRoot,
		logger,
		onPackageReadError: (error, packageDir) => {
			logger.warn(`Could not inspect managed npm package ${shortenHomePath(packageDir)}: ${coerceErrorMessage(error)}`);
		}
	})))).reduce((total, result) => total + result.repaired, 0);
	const registeredRepair = await reconcileRegisteredOpenClawHostLinks({
		installRecords: await loadInstalledPluginIndexInstallRecords(params),
		extensionsDir: resolveRegisteredPluginExtensionsRoot(params),
		env: params.env,
		mode: "repair",
		logger,
		onPackageReadError: (error, packageDir) => {
			logger.warn(`Could not inspect registered package ${shortenHomePath(packageDir)}: ${coerceErrorMessage(error)}`);
		}
	});
	if (repaired > 0) note(`Repaired OpenClaw host peer link(s) for ${repaired} managed npm plugin package(s).`, "Plugin registry");
	if (registeredRepair.repaired > 0) note(`Repaired OpenClaw host peer link(s) for ${registeredRepair.repaired} registered plugin package(s).`, "Plugin registry");
	const warnings = messages.filter((message) => message.level === "warn").map((message) => `- ${message.message}`);
	if (warnings.length > 0) note(["Could not repair all managed OpenClaw host peer links:", ...warnings].join("\n"), "Plugin registry");
	return repaired > 0 || registeredRepair.repaired > 0;
}
//#endregion
export { maybeRepairPluginOpenClawHostLinks as n, resolveDoctorPluginNpmRoots as r, listPluginOpenClawHostLinkIssues as t };
