import { n as sanitizeTerminalText } from "./safe-text-SY_CvCi3.mjs";
import { o as parseRegistryNpmSpec } from "./npm-registry-spec-Dw2vyAJw.mjs";
import { O as resolveDefaultNpmSpec, i as getOfficialExternalPluginCatalogEntryForPackage, m as resolveOfficialExternalPluginInstallSources, r as getOfficialExternalPluginCatalogEntry } from "./official-external-plugin-catalog-DWheKC4x.mjs";
import { t as parseClawHubPluginSpec } from "./clawhub-spec-DczkVvPu.mjs";
import { g as resolveOfficialExternalPluginId } from "./official-external-plugin-catalog-source-B7ojvzQW.mjs";
import { n as findBundledPluginSourceInMap, r as getProcessBundledPluginSources } from "./bundled-sources-fjtOrSJ6.mjs";
//#region src/plugins/official-external-install-trust.ts
function resolveCatalogOfficialExternalInstallPlan(rawSpec) {
	const parsed = resolveDefaultNpmSpec(rawSpec);
	if (!parsed) return null;
	const entry = getOfficialExternalPluginCatalogEntry(parsed.name) ?? getOfficialExternalPluginCatalogEntryForPackage(parsed.name);
	const pluginId = entry && resolveOfficialExternalPluginId(entry);
	const installSources = entry ? resolveOfficialInstallSources(entry, parsed.selector) : [];
	const primary = installSources[0];
	return pluginId && primary ? {
		pluginId,
		spec: primary.spec,
		installSources
	} : null;
}
function resolveCatalogOfficialExternalNpmPackageTrust(npmSpec) {
	const parsed = parseRegistryNpmSpec(npmSpec);
	const entry = parsed && getOfficialExternalPluginCatalogEntryForPackage(parsed.name);
	const pluginId = entry && resolveOfficialExternalPluginId(entry);
	const source = entry && resolveOfficialExternalPluginInstallSources(entry).find((candidate) => candidate.source === "npm");
	if (!parsed || !pluginId || !source || parseRegistryNpmSpec(source.spec)?.name !== parsed.name) return null;
	return {
		pluginId,
		...source.expectedIntegrity && source.spec === npmSpec.trim() ? { expectedIntegrity: source.expectedIntegrity } : {},
		trustedSourceLinkedOfficialInstall: true
	};
}
function resolveOfficialInstallSources(entry, selector) {
	return resolveOfficialExternalPluginInstallSources(entry).map((source) => {
		if (!selector) return source;
		const name = source.source === "npm" ? parseRegistryNpmSpec(source.spec)?.name : parseClawHubPluginSpec(source.spec)?.name;
		if (!name) return source;
		const spec = `${source.source === "clawhub" ? "clawhub:" : ""}${name}@${selector}`;
		return spec === source.spec ? source : {
			source: source.source,
			spec
		};
	});
}
//#endregion
//#region src/plugins/install-provenance.ts
const NON_CLAWHUB_INSTALL_FORCE_FLAG = "--force";
function resolveOpenClawTrustedNpmPackageInstall(npmSpec, bundledSources = getProcessBundledPluginSources()) {
	const packageName = parseRegistryNpmSpec(npmSpec)?.name;
	if (!packageName) return null;
	const bundled = findBundledPluginSourceInMap({
		bundled: bundledSources,
		lookup: {
			kind: "npmSpec",
			value: packageName
		}
	});
	if (bundled) return { pluginId: bundled.pluginId };
	return resolveCatalogOfficialExternalNpmPackageTrust(npmSpec);
}
function isOpenClawTrustedPluginInstallSpec(spec, bundledSources = getProcessBundledPluginSources()) {
	const trimmed = spec.trim();
	if (trimmed.toLowerCase().startsWith("clawhub:")) return true;
	const explicitNpm = trimmed.toLowerCase().startsWith("npm:");
	const npmSpec = explicitNpm ? trimmed.slice(4) : trimmed;
	if (explicitNpm) return resolveOpenClawTrustedNpmPackageInstall(npmSpec, bundledSources) !== null;
	const bundled = findBundledPluginSourceInMap({
		bundled: bundledSources,
		lookup: {
			kind: "pluginId",
			value: npmSpec
		}
	}) ?? findBundledPluginSourceInMap({
		bundled: bundledSources,
		lookup: {
			kind: "localPath",
			value: npmSpec
		}
	});
	return Boolean(bundled ?? resolveOpenClawTrustedNpmPackageInstall(npmSpec, bundledSources) ?? resolveCatalogOfficialExternalInstallPlan(npmSpec));
}
const sourceClassLabels = {
	git: "Git repository",
	"local-archive": "local archive",
	"local-path": "local path",
	marketplace: "marketplace source",
	npm: "npm registry",
	"npm-pack": "local npm-pack archive"
};
function formatNonClawHubInstallWarning(params) {
	return [`WARNING - Installing plugin from ${sourceClassLabels[params.sourceClass]}: ${sanitizeTerminalText(params.spec)}`, "This source is outside ClawHub review and trust metadata. Only continue if you trust the publisher, package contents, and install source."].join("\n");
}
//#endregion
export { resolveCatalogOfficialExternalInstallPlan as a, resolveOpenClawTrustedNpmPackageInstall as i, formatNonClawHubInstallWarning as n, resolveOfficialInstallSources as o, isOpenClawTrustedPluginInstallSpec as r, NON_CLAWHUB_INSTALL_FORCE_FLAG as t };
