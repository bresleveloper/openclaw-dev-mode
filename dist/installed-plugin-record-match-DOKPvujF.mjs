import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { s as redactSensitiveText } from "./redact-BcXJu5HP.mjs";
import "./utils-gjJ-tD2q.mjs";
import { n as isPathInside } from "./path-safety-n0YlfCVt.mjs";
import { a as pluginCacheRealpathSync } from "./plugin-cache-files-VxWaav6j.mjs";
import { g as isPluginCandidateInstallOwnerAmbiguous, y as resolvePluginCandidateInstallOwner } from "./discovery-B5pUUvVG.mjs";
import { i as isTrustedOfficialPluginInstallRecord, n as isThirdPartyNpmInstallRecord } from "./official-external-install-records-DU-ANq4S.mjs";
//#region src/plugins/installed-plugin-record-match.ts
function resolveCandidateInstallOwner(params) {
	if (isPluginCandidateInstallOwnerAmbiguous(params.candidate)) return;
	const owner = resolvePluginCandidateInstallOwner(params.candidate);
	return owner && Object.hasOwn(params.installRecords, owner) ? owner : void 0;
}
function matchesInstalledPluginRecord(params) {
	if (params.candidate.origin !== "global" && params.candidate.origin !== "config") return false;
	const installOwner = resolveCandidateInstallOwner(params);
	const record = installOwner ? params.installRecords[installOwner] : void 0;
	if (!record) return false;
	const candidatePaths = [
		params.candidate.rootDir,
		params.candidate.packageDir,
		params.candidate.source,
		params.candidate.setupSource
	].filter((entry) => typeof entry === "string" && entry.trim().length > 0).map((entry) => {
		const resolved = resolveUserPath(entry, params.env);
		return pluginCacheRealpathSync(resolved) ?? resolved;
	});
	const trackedPaths = (params.installPathOnly ? [record.installPath] : [record.installPath, record.sourcePath]).filter((entry) => typeof entry === "string" && entry.trim().length > 0).map((entry) => {
		const resolved = resolveUserPath(entry, params.env);
		return pluginCacheRealpathSync(resolved) ?? resolved;
	});
	if (candidatePaths.length === 0 || trackedPaths.length === 0) return false;
	return trackedPaths.some((trackedPath) => candidatePaths.some((candidatePath) => candidatePath === trackedPath || isPathInside(trackedPath, candidatePath) || isPathInside(candidatePath, trackedPath)));
}
function resolvePluginTrust(params) {
	const installOwner = resolveCandidateInstallOwner(params);
	const record = installOwner ? params.installRecords[installOwner] : void 0;
	const origin = params.candidate.origin;
	let reason;
	if (origin === "bundled") reason = "bundled";
	else if (isPluginCandidateInstallOwnerAmbiguous(params.candidate)) reason = "owner-ambiguous";
	else if (origin === "workspace" || record?.source === "path" || record?.source === "npm" && (record.artifactKind !== void 0 || record.sourcePath !== void 0)) reason = "origin-path";
	else if (!record || !installOwner) reason = "record-missing";
	else if (!matchesInstalledPluginRecord({
		...params,
		installPathOnly: true
	})) reason = "install-path-mismatch";
	else if (isTrustedOfficialPluginInstallRecord({
		pluginId: installOwner,
		packageName: params.candidate.packageName,
		record
	})) reason = "trusted-official";
	else if (record.source === "npm" && record.spec === void 0 && record.resolvedName === void 0 && record.resolvedSpec === void 0 || record.source === "clawhub" && record.clawhubUrl === void 0 && record.clawhubChannel === void 0) reason = "provenance-missing";
	else if (isThirdPartyNpmInstallRecord(installOwner, params.candidate.packageName, record)) reason = "third-party-npm";
	else reason = "provenance-invalid";
	return {
		reason,
		registryPath: params.registryPath,
		origin,
		installSource: record?.source,
		installSpec: record?.spec === void 0 ? void 0 : redactSensitiveText(record.spec, { mode: "tools" })
	};
}
//#endregion
export { resolvePluginTrust as n, matchesInstalledPluginRecord as t };
