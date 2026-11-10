import { n as coerceErrorMessage } from "./error-coercion-BwMr25F8.mjs";
import { p as shortenHomePath } from "./utils-gjJ-tD2q.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { a as resolveDefaultPluginExtensionsDir, s as resolveDefaultPluginNpmDir } from "./install-paths-CulPgmRu.mjs";
import { n as auditOpenClawPeerDependenciesInManagedNpmRoot, o as reconcileRegisteredOpenClawHostLinks, s as relinkOpenClawPeerDependenciesInManagedNpmRoot } from "./plugin-peer-link-U6n90-r7.mjs";
import { d as listManagedPluginNpmRootsSync } from "./managed-npm-retention-DL_TwTTS.mjs";
import { r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-CE166Xp8.mjs";
import "./installed-plugin-index-records-DTzp62mN.mjs";
import { t as note } from "./note-CmoIRLec.mjs";
import path from "node:path";
//#region src/commands/doctor-plugin-host-links.ts
function resolveRegisteredPluginExtensionsRoot(params) {
	return params.stateDir ? path.join(params.stateDir, "extensions") : resolveDefaultPluginExtensionsDir(params.env);
}
function resolveDoctorPluginNpmRoots(params) {
	const npmRoot = params.stateDir ? path.join(params.stateDir, "npm") : resolveDefaultPluginNpmDir(params.env);
	return listManagedPluginNpmRootsSync(npmRoot);
}
/** Audits managed npm and registered plugin host links without mutating either root. */
async function listPluginOpenClawHostLinkIssues(params) {
	const packageReadFailures = [];
	const registeredPackageReadFailures = [];
	const recordReadFailure = (failures) => (error, packageDir) => {
		failures.push({
			packageDir,
			reason: coerceErrorMessage(error)
		});
	};
	const audits = await Promise.all(resolveDoctorPluginNpmRoots(params).map((npmRoot) => auditOpenClawPeerDependenciesInManagedNpmRoot({
		npmRoot,
		onPackageReadError: recordReadFailure(packageReadFailures)
	})));
	const registeredAudit = await reconcileRegisteredOpenClawHostLinks({
		installRecords: await loadInstalledPluginIndexInstallRecords(params),
		extensionsDir: resolveRegisteredPluginExtensionsRoot(params),
		env: params.env,
		mode: "audit",
		onPackageReadError: recordReadFailure(registeredPackageReadFailures)
	});
	return {
		peerLinkIssues: audits.flatMap((audit) => audit.issues),
		packageReadFailures,
		registeredPeerLinkIssues: registeredAudit.issues,
		registeredPackageReadFailures
	};
}
async function maybeRepairPluginOpenClawHostLinks(params) {
	const npmRoots = resolveDoctorPluginNpmRoots(params);
	if (!params.prompter.shouldRepair) {
		const audit = await listPluginOpenClawHostLinkIssues(params);
		const reportLinks = (issues, label, packages) => {
			if (issues.length > 0) note([
				`${label} need repair:`,
				...issues.map((issue) => `- ${issue.packageName}: ${issue.reason}`),
				`Repair with ${formatCliCommand("openclaw doctor --fix")} to relink ${packages} plugin packages.`
			].join("\n"), "Plugin registry");
		};
		reportLinks(audit.peerLinkIssues, "Managed npm OpenClaw host peer links", "managed npm");
		for (const [label, failures] of [["Managed npm plugin", audit.packageReadFailures], ["Registered plugin", audit.registeredPackageReadFailures]]) if (failures.length > 0) note([`${label} packages could not be inspected:`, ...failures.map((failure) => `- ${shortenHomePath(failure.packageDir)}: ${failure.reason}`)].join("\n"), "Plugin registry");
		reportLinks(audit.registeredPeerLinkIssues, "Registered plugin OpenClaw host links", "registered");
		return false;
	}
	const installRecords = params.installRecords ?? await loadInstalledPluginIndexInstallRecords(params);
	const warnings = [];
	const logger = {
		info() {},
		warn: (message) => warnings.push(`- ${message}`)
	};
	const warnReadFailure = (kind) => (error, packageDir) => {
		logger.warn(`Could not inspect ${kind} package ${shortenHomePath(packageDir)}: ${coerceErrorMessage(error)}`);
	};
	const results = await Promise.allSettled(npmRoots.map((npmRoot) => relinkOpenClawPeerDependenciesInManagedNpmRoot({
		npmRoot,
		logger,
		onPackageReadError: warnReadFailure("managed npm"),
		beforePersistentEffect: params.beforePersistentEffect
	})));
	let repaired = 0;
	for (const result of results) {
		if (result.status === "rejected") throw result.reason;
		repaired += result.value.repaired;
	}
	const registeredRepair = await reconcileRegisteredOpenClawHostLinks({
		installRecords,
		extensionsDir: resolveRegisteredPluginExtensionsRoot(params),
		env: params.env,
		mode: "repair",
		logger,
		onPackageReadError: warnReadFailure("registered"),
		beforePersistentEffect: params.beforePersistentEffect
	});
	for (const [count, kind] of [[repaired, "managed npm"], [registeredRepair.repaired, "registered"]]) if (count > 0) note(`Repaired OpenClaw host peer link(s) for ${count} ${kind} plugin package(s).`, "Plugin registry");
	if (warnings.length > 0) note(["OpenClaw host peer link warnings:", ...warnings].join("\n"), "Plugin registry");
	return repaired > 0 || registeredRepair.repaired > 0;
}
//#endregion
export { maybeRepairPluginOpenClawHostLinks as n, resolveDoctorPluginNpmRoots as r, listPluginOpenClawHostLinkIssues as t };
