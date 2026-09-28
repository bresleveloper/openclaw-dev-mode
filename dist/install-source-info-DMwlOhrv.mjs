import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { o as parseRegistryNpmSpec, r as isExactSemverVersion } from "./npm-registry-spec-CjcsDXUg.mjs";
import { t as parseClawHubPluginSpec } from "./clawhub-spec-r-Sm6wpn.mjs";
import { N as normalizePluginInstallDefaultChoice } from "./official-external-plugin-catalog-CzZljLFK.mjs";
//#region src/plugins/install-source-info.ts
/** Describes package-authored plugin install source metadata and pinning warnings. */
function resolveNpmPinState(params) {
	if (params.exactVersion) return params.hasIntegrity ? "exact-with-integrity" : "exact-without-integrity";
	return params.hasIntegrity ? "floating-with-integrity" : "floating-without-integrity";
}
function normalizeExpectedPackageName(value) {
	const expected = normalizeOptionalString(value);
	if (!expected) return;
	return parseRegistryNpmSpec(expected)?.name ?? expected;
}
/** Describes plugin install source metadata and warnings without mutating manifests. */
function describePluginInstallSource(install, options) {
	const clawhubSpec = normalizeOptionalString(install.clawhubSpec);
	const npmSpec = normalizeOptionalString(install.npmSpec);
	const localPath = normalizeOptionalString(install.localPath);
	const defaultChoice = normalizePluginInstallDefaultChoice(install.defaultChoice);
	const expectedIntegrity = normalizeOptionalString(install.expectedIntegrity);
	const expectedPackageName = normalizeExpectedPackageName(options?.expectedPackageName);
	const warnings = [];
	let clawhub;
	let npm;
	if (install.defaultChoice !== void 0 && !defaultChoice) warnings.push("invalid-default-choice");
	if (clawhubSpec) {
		const parsed = parseClawHubPluginSpec(clawhubSpec);
		if (parsed) {
			const exactVersion = parsed.version ? isExactSemverVersion(parsed.version) : false;
			if (!exactVersion) warnings.push("clawhub-spec-floating");
			clawhub = {
				spec: clawhubSpec,
				packageName: parsed.name,
				...parsed.version ? { version: parsed.version } : {},
				exactVersion
			};
		} else warnings.push("invalid-clawhub-spec");
	}
	if (npmSpec) {
		const parsed = parseRegistryNpmSpec(npmSpec);
		if (parsed) {
			const exactVersion = parsed.selectorKind === "exact-version";
			const hasIntegrity = Boolean(expectedIntegrity);
			if (!exactVersion) warnings.push("npm-spec-floating");
			if (!hasIntegrity) warnings.push("npm-spec-missing-integrity");
			if (expectedPackageName && parsed.name !== expectedPackageName) warnings.push("npm-spec-package-name-mismatch");
			npm = {
				spec: parsed.raw,
				packageName: parsed.name,
				...expectedPackageName && parsed.name !== expectedPackageName ? { expectedPackageName } : {},
				selectorKind: parsed.selectorKind,
				exactVersion,
				pinState: resolveNpmPinState({
					exactVersion,
					hasIntegrity
				}),
				...parsed.selector ? { selector: parsed.selector } : {},
				...expectedIntegrity ? { expectedIntegrity } : {}
			};
		} else warnings.push("invalid-npm-spec");
	}
	if (defaultChoice === "clawhub" && !clawhub) warnings.push("default-choice-missing-source");
	if (defaultChoice === "npm" && !npm) warnings.push("default-choice-missing-source");
	if (defaultChoice === "local" && !localPath) warnings.push("default-choice-missing-source");
	if (expectedIntegrity && !npm) warnings.push("npm-integrity-without-source");
	return {
		...defaultChoice ? { defaultChoice } : {},
		...clawhub ? { clawhub } : {},
		...npm ? { npm } : {},
		...localPath ? { local: { path: localPath } } : {},
		warnings
	};
}
//#endregion
export { describePluginInstallSource as t };
