import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { t as parseClawHubPluginSpec } from "./clawhub-spec-r-Sm6wpn.mjs";
import { M as normalizeClawHubSha256Integrity, O as resolveDefaultNpmSpec, l as listOfficialExternalPluginCatalogEntries, m as resolveOfficialExternalPluginInstallSources, p as resolveOfficialExternalPluginInstall } from "./official-external-plugin-catalog-CzZljLFK.mjs";
import { t as PLUGIN_INSTALL_ERROR_CODE } from "./install-types-auyGAGw8.mjs";
import { h as resolveOfficialExternalPluginId, o as getOfficialExternalPluginCatalogManifest } from "./official-external-plugin-catalog-source-CkmJlLAW.mjs";
import { t as ManagedPluginLifecycleError } from "./management-lifecycle-error-ySeX1uI2.mjs";
import { p as resolveArchiveKind } from "./archive-BVJWOqLD.mjs";
import "./install-Bt8Oq4jr.mjs";
import { t as findBundledPluginSource } from "./bundled-sources-Bi9l5Ik4.mjs";
import { r as parseGitPluginSpec } from "./git-install-DOI9Y3PV.mjs";
import { a as resolveCatalogOfficialExternalInstallPlan, i as resolveOpenClawTrustedNpmPackageInstall, o as resolveOfficialInstallSources } from "./install-provenance-B846o7JY.mjs";
import { a as resolveBundledInstallPlanBeforeNpm, i as parseNpmPrefixSpec, n as isSourceCheckoutBundledPath, o as resolveFileNpmSpecToLocalPath, r as parseNpmPackPrefixPath, t as isBareNpmPackageName } from "./install-source-spec-CwVOmH1V.mjs";
import { h as resolveOfficialEntryById } from "./management-catalog-HkZv11Ak.mjs";
import fs from "node:fs";
import { pathToFileURL } from "node:url";
import path from "node:path";
//#region src/infra/install-spec.ts
/** Detect specs that should be interpreted as local file/path installs. */
function looksLikeLocalInstallSpec(spec, knownSuffixes) {
	return spec.startsWith(".") || spec.startsWith("~") || path.isAbsolute(spec) || knownSuffixes.some((suffix) => spec.endsWith(suffix));
}
//#endregion
//#region src/plugins/install-source-plan.ts
function isLocalGitUrl(url) {
	return path.isAbsolute(url) || url.startsWith("file:") || !URL.canParse(url) && !/^[^@\s]+@[^:\s]+:.+/.test(url);
}
/** Local artifacts belong to the connecting host, not a remote Gateway's filesystem. */
function pluginInstallRequiresLocalHost(request) {
	if (request.source === "local" || request.source === "npm-pack" || request.source === "marketplace") return true;
	if (request.source === "git") {
		const parsed = parseGitPluginSpec(request.spec);
		return parsed !== null && isLocalGitUrl(parsed.url);
	}
	return false;
}
function sourcePlan(request, raw, sourceClass, metadata = {}) {
	return {
		ok: true,
		request,
		...metadata,
		...sourceClass ? { acknowledgement: {
			sourceClass,
			spec: raw
		} } : {}
	};
}
function resolvePluginInstallSourcePlan(params) {
	const fileSpec = resolveFileNpmSpecToLocalPath(params.raw);
	if (fileSpec && !fileSpec.ok) return fileSpec;
	const normalized = fileSpec?.ok ? fileSpec.path : params.raw;
	const resolved = resolveUserPath(normalized);
	if (fs.existsSync(resolved)) {
		const recordSource = resolveArchiveKind(resolved) ? "archive" : "path";
		const bundled = recordSource === "path" ? findBundledPluginSource({ lookup: {
			kind: "localPath",
			value: resolved
		} }) : void 0;
		return sourcePlan({
			source: "local",
			path: resolved,
			mode: params.mode,
			...params.link ? { link: true } : {}
		}, params.raw, bundled ? void 0 : recordSource === "archive" ? "local-archive" : "local-path");
	}
	const npmPackPath = parseNpmPackPrefixPath(params.raw);
	if (npmPackPath !== null) return npmPackPath ? sourcePlan({
		source: "npm-pack",
		archivePath: resolveUserPath(npmPackPath),
		mode: params.mode
	}, params.raw, "npm-pack") : {
		ok: false,
		error: "Unsupported npm-pack plugin spec: missing archive path."
	};
	const gitPrefix = params.raw.trim().toLowerCase().startsWith("git:");
	const git = parseGitPluginSpec(params.raw);
	if (gitPrefix) return git ? sourcePlan({
		source: "git",
		spec: isLocalGitUrl(git.url) && !git.url.startsWith("file:") ? `git:${pathToFileURL(resolveUserPath(git.url)).href}${git.ref ? `@${git.ref}` : ""}` : params.raw,
		mode: params.mode
	}, params.raw, "git") : {
		ok: false,
		error: `unsupported git: plugin spec: ${params.raw}`
	};
	const clawhubPrefix = params.raw.trim().toLowerCase().startsWith("clawhub:");
	const clawhub = parseClawHubPluginSpec(params.raw);
	if (clawhubPrefix) return clawhub ? sourcePlan({
		source: "clawhub",
		packageName: clawhub.name,
		version: clawhub.version,
		mode: params.mode
	}, params.raw) : {
		ok: false,
		error: `Unsupported ClawHub plugin spec: ${params.raw}`
	};
	const explicitNpm = parseNpmPrefixSpec(params.raw);
	if (explicitNpm !== null && !explicitNpm) return {
		ok: false,
		error: "Unsupported npm plugin spec: missing package."
	};
	if (explicitNpm === null && looksLikeLocalInstallSpec(params.raw, [
		".ts",
		".js",
		".mjs",
		".cjs",
		".tgz",
		".tar.gz",
		".tar",
		".zip"
	])) return {
		ok: false,
		error: `Plugin path not found: ${resolved}`
	};
	const npmSpec = explicitNpm ?? params.raw;
	const bundledPlan = resolveBundledInstallPlanBeforeNpm({
		rawSpec: params.raw,
		findBundledSource: (lookup) => findBundledPluginSource({ lookup })
	});
	if (bundledPlan) return sourcePlan({
		source: "bundled",
		pluginId: bundledPlan.bundledSource.pluginId,
		spec: params.raw
	}, params.raw, void 0, {
		warning: bundledPlan.warning,
		localPath: bundledPlan.bundledSource.localPath
	});
	const official = explicitNpm === null ? resolveCatalogOfficialExternalInstallPlan(params.raw) : null;
	if (official) return sourcePlan({
		source: "official",
		pluginId: official.pluginId,
		...resolveDefaultNpmSpec(params.raw)?.selector ? { version: "latest" } : {},
		mode: params.mode,
		...params.pin ? { pin: true } : {}
	}, params.raw);
	const trusted = resolveOpenClawTrustedNpmPackageInstall(npmSpec);
	return sourcePlan({
		source: "npm",
		spec: npmSpec,
		mode: params.mode,
		...params.pin ? { pin: true } : {}
	}, params.raw, trusted ? void 0 : "npm", { allowBundledFallback: explicitNpm === null });
}
function resolveBundledInstallPlanForCatalogEntry(params) {
	const pluginId = params.pluginId.trim();
	const npmSpec = params.npmSpec.trim();
	if (!pluginId || !npmSpec) return null;
	const bundledBySpec = params.findBundledSource({
		kind: "npmSpec",
		value: npmSpec
	});
	if (bundledBySpec?.pluginId === pluginId) return { bundledSource: bundledBySpec };
	const bundledById = params.findBundledSource({
		kind: "pluginId",
		value: pluginId
	});
	if (bundledById?.pluginId !== pluginId) return null;
	if (bundledById.npmSpec && bundledById.npmSpec !== npmSpec) return null;
	return { bundledSource: bundledById };
}
function resolveBundledInstallPlanForNpmFailure(params) {
	if (params.code !== PLUGIN_INSTALL_ERROR_CODE.NPM_PACKAGE_NOT_FOUND) return null;
	const bundledSource = params.findBundledSource({
		kind: "npmSpec",
		value: params.rawSpec
	});
	if (!bundledSource) return null;
	if (!isBareNpmPackageName(params.rawSpec) && isSourceCheckoutBundledPath(bundledSource.localPath)) return null;
	return {
		bundledSource,
		warning: `npm package unavailable for ${params.rawSpec}; using bundled plugin at ${shortenHomePath(bundledSource.localPath)}.`
	};
}
/** Explicitly declared runtime id, ignoring the entry-id fallback used for display. */
function resolveDeclaredOfficialPluginId(entry) {
	const manifest = getOfficialExternalPluginCatalogManifest(entry);
	return normalizeOptionalString(manifest?.plugin?.id) ?? normalizeOptionalString(manifest?.channel?.id) ?? normalizeOptionalString(manifest?.providers?.[0]?.id);
}
function resolveOfficialEntryByClawHubPackage(entries, packageName) {
	return entries.find((entry) => {
		return resolveOfficialExternalPluginInstallSources(entry).some((source) => source.source === "clawhub" && parseClawHubPluginSpec(source.spec)?.name === packageName);
	});
}
/** Public requests carry intent and constraints; catalog provenance is resolved by this owner. */
function resolveManagedPluginInstallRequest(request, officialEntries) {
	const mode = request.mode ?? "install";
	switch (request.source) {
		case "official": {
			const entry = resolveOfficialEntryById(officialEntries, request.pluginId) ?? resolveOfficialEntryById(listOfficialExternalPluginCatalogEntries(), request.pluginId);
			if (!entry) throw new ManagedPluginLifecycleError(`unknown official plugin catalog entry: ${request.pluginId}`);
			const pluginId = resolveOfficialExternalPluginId(entry);
			const install = resolveOfficialExternalPluginInstall(entry);
			if (!pluginId || !install) throw new ManagedPluginLifecycleError(`official plugin catalog entry is not installable: ${request.pluginId}`);
			const installSources = resolveOfficialInstallSources(entry, request.version);
			const primary = installSources[0];
			if (!primary) throw new ManagedPluginLifecycleError(`official plugin catalog entry has no supported install source: ${request.pluginId}`);
			return {
				source: "official",
				spec: primary.spec,
				installSources,
				pluginId,
				expectedPluginId: resolveDeclaredOfficialPluginId(entry),
				mode,
				...request.pin ? { pin: true } : {}
			};
		}
		case "clawhub": {
			const packageName = request.packageName.trim();
			const official = resolveOfficialEntryByClawHubPackage([...listOfficialExternalPluginCatalogEntries(), ...officialEntries], packageName);
			const expectedPluginId = official ? resolveDeclaredOfficialPluginId(official) : void 0;
			const hostedOfficial = resolveOfficialEntryByClawHubPackage(officialEntries, packageName);
			const hostedSource = hostedOfficial ? resolveOfficialExternalPluginInstallSources(hostedOfficial).find((source) => source.source === "clawhub") : void 0;
			const hostedClawHub = parseClawHubPluginSpec(hostedSource?.spec ?? "");
			const requestMatchesHostedCandidate = !request.version || request.version === hostedClawHub?.version;
			const version = request.version ?? (requestMatchesHostedCandidate ? hostedClawHub?.version : void 0);
			const expectedIntegrity = requestMatchesHostedCandidate ? hostedSource?.expectedIntegrity : void 0;
			const parsed = parseClawHubPluginSpec(`clawhub:${packageName}`);
			if (!parsed || parsed.version) throw new ManagedPluginLifecycleError(`invalid ClawHub package name: ${packageName}`);
			if (expectedPluginId && request.expectedPluginId && expectedPluginId !== request.expectedPluginId) throw new ManagedPluginLifecycleError("Requested plugin identity differs from the official catalog.");
			if (expectedIntegrity && request.expectedIntegrity && expectedIntegrity !== normalizeClawHubSha256Integrity(request.expectedIntegrity)) throw new ManagedPluginLifecycleError("Requested artifact integrity differs from the official catalog.");
			return {
				source: "clawhub",
				spec: `clawhub:${packageName}${version ? `@${version}` : ""}`,
				mode,
				...official ? { trustedSourceLinkedOfficialInstall: true } : {},
				expectedPluginId: expectedPluginId ?? request.expectedPluginId,
				expectedIntegrity: expectedIntegrity ?? request.expectedIntegrity
			};
		}
		case "bundled": {
			const bundledSource = findBundledPluginSource({ lookup: {
				kind: "pluginId",
				value: request.pluginId
			} });
			if (!bundledSource) throw new ManagedPluginLifecycleError(`Unknown bundled plugin: ${request.pluginId}`);
			return {
				source: "bundled",
				rawSpec: request.spec ?? request.pluginId,
				bundledSource
			};
		}
		case "local": {
			const resolved = resolveUserPath(request.path);
			const bundled = findBundledPluginSource({ lookup: {
				kind: "localPath",
				value: resolved
			} });
			return {
				source: "local",
				path: resolved,
				mode,
				recordSource: resolveArchiveKind(resolved) ? "archive" : "path",
				...request.link ? { link: true } : {},
				...bundled ? { bundledOrigin: true } : {}
			};
		}
		case "npm": {
			const trusted = resolveOpenClawTrustedNpmPackageInstall(request.spec);
			if (trusted && request.expectedPluginId && trusted.pluginId !== request.expectedPluginId) throw new ManagedPluginLifecycleError("Requested plugin identity differs from the official npm identity.");
			if (trusted?.expectedIntegrity && request.expectedIntegrity && trusted.expectedIntegrity !== request.expectedIntegrity.trim()) throw new ManagedPluginLifecycleError("Requested artifact integrity differs from the official npm artifact.");
			return {
				...request,
				mode,
				...trusted ? { trustedSourceLinkedOfficialInstall: true } : {},
				expectedPluginId: trusted?.pluginId ?? request.expectedPluginId,
				expectedIntegrity: trusted?.expectedIntegrity ?? request.expectedIntegrity
			};
		}
		case "npm-pack":
		case "git":
		case "marketplace": return {
			...request,
			mode
		};
		default: throw new ManagedPluginLifecycleError("Unsupported plugin install source.");
	}
}
//#endregion
export { resolvePluginInstallSourcePlan as a, resolveManagedPluginInstallRequest as i, resolveBundledInstallPlanForCatalogEntry as n, resolveBundledInstallPlanForNpmFailure as r, pluginInstallRequiresLocalHost as t };
