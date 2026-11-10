import { g as readStringValue, h as readNonEmptyStringPreservingWhitespace, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as normalizeCsvOrLooseStringList } from "./string-normalization-D6DKCpwE.mjs";
import { l as validateRegistryNpmSpec } from "./npm-registry-spec-B_IER0ZB.mjs";
import { a as applyOpenClawManifestInstallCommonFields, c as parseOpenClawManifestInstallBase, d as resolveOpenClawManifestOs, f as resolveOpenClawManifestRequires, l as resolveOpenClawManifestBlock, o as getFrontmatterString, r as parseFrontmatterBlockResult, s as parseFrontmatterBool, u as resolveOpenClawManifestInstall } from "./frontmatter-yV_HVb74.mjs";
//#region src/skills/loading/frontmatter.ts
function parseSkillFrontmatter(content) {
	const parsed = parseFrontmatterBlockResult(content);
	const issue = parsed.issues[0];
	if (issue) throw new Error(`invalid frontmatter: ${issue.code}: ${issue.message}`);
	return structuredClone(parsed.frontmatter);
}
const BREW_FORMULA_PATTERN = /^[A-Za-z0-9][A-Za-z0-9@+._/-]*$/;
const GO_MODULE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._~+\-/]*(?:@[A-Za-z0-9][A-Za-z0-9._~+\-/]*)?$/;
const UV_PACKAGE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._\-[\]=<>!~+,]*$/;
function normalizeSafeBrewFormula(raw) {
	const formula = normalizeOptionalString(raw);
	return formula && BREW_FORMULA_PATTERN.test(formula) && !formula.includes("..") ? formula : void 0;
}
function normalizeSafeNpmSpec(raw) {
	const spec = normalizeOptionalString(raw);
	if (!spec || spec.startsWith("-")) return;
	if (validateRegistryNpmSpec(spec) !== null) return;
	return spec;
}
function normalizeSafePackageSpec(raw, pattern) {
	const value = normalizeOptionalString(raw);
	return value && pattern.test(value) ? value : void 0;
}
function normalizeSafeDownloadUrl(raw) {
	const value = normalizeOptionalString(raw);
	if (!value || /\s/.test(value)) return;
	const parsed = URL.parse(value);
	return parsed?.protocol === "http:" || parsed?.protocol === "https:" ? parsed.toString() : void 0;
}
function parseInstallSpec(input) {
	const parsed = parseOpenClawManifestInstallBase(input, [
		"brew",
		"node",
		"go",
		"uv",
		"download"
	]);
	if (!parsed) return;
	const { raw } = parsed;
	const common = applyOpenClawManifestInstallCommonFields({ kind: parsed.kind }, parsed);
	const osList = normalizeCsvOrLooseStringList(raw.os);
	const formula = normalizeSafeBrewFormula(raw.formula) ?? normalizeSafeBrewFormula(raw.cask);
	const pkg = common.kind === "node" ? normalizeSafeNpmSpec(raw.package) : common.kind === "uv" ? normalizeSafePackageSpec(raw.package, UV_PACKAGE_PATTERN) : void 0;
	const moduleSpec = normalizeSafePackageSpec(raw.module, GO_MODULE_PATTERN);
	const downloadUrl = normalizeSafeDownloadUrl(raw.url);
	let sha256;
	if (common.kind === "download" && raw.sha256 !== void 0) {
		if (typeof raw.sha256 !== "string") return;
		sha256 = raw.sha256.trim().toLowerCase();
		if (!/^[a-f0-9]{64}$/u.test(sha256)) return;
	}
	const spec = {
		...common,
		...osList.length > 0 ? { os: osList } : {},
		...formula ? { formula } : {},
		...pkg ? { package: pkg } : {},
		...moduleSpec ? { module: moduleSpec } : {},
		...downloadUrl ? { url: downloadUrl } : {},
		...sha256 ? { sha256 } : {},
		...typeof raw.archive === "string" ? { archive: raw.archive } : {},
		...typeof raw.extract === "boolean" ? { extract: raw.extract } : {},
		...typeof raw.stripComponents === "number" ? { stripComponents: raw.stripComponents } : {},
		...typeof raw.targetDir === "string" ? { targetDir: raw.targetDir } : {}
	};
	return {
		brew: spec.formula,
		node: spec.package,
		go: spec.module,
		uv: spec.package,
		download: spec.url
	}[spec.kind] ? spec : void 0;
}
function resolveSkillManifestMetadata(frontmatter) {
	const metadataObj = resolveOpenClawManifestBlock({ frontmatter });
	if (!metadataObj) return;
	const requires = resolveOpenClawManifestRequires(metadataObj);
	const install = resolveOpenClawManifestInstall(metadataObj, parseInstallSpec);
	const osRaw = resolveOpenClawManifestOs(metadataObj);
	return {
		always: typeof metadataObj.always === "boolean" ? metadataObj.always : void 0,
		emoji: readStringValue(metadataObj.emoji),
		homepage: readStringValue(metadataObj.homepage),
		skillKey: readNonEmptyStringPreservingWhitespace(metadataObj.skillKey),
		primaryEnv: readStringValue(metadataObj.primaryEnv),
		os: osRaw.length > 0 ? osRaw : void 0,
		requires,
		install: install.length > 0 ? install : void 0
	};
}
function resolveSkillInvocationPolicy(frontmatter) {
	return {
		userInvocable: parseFrontmatterBool(getFrontmatterString(frontmatter, "user-invocable"), true),
		disableModelInvocation: parseFrontmatterBool(getFrontmatterString(frontmatter, "disable-model-invocation"), false)
	};
}
function resolveSkillKey(entry) {
	return entry.metadata?.skillKey ?? entry.skill.name;
}
//#endregion
export { resolveSkillManifestMetadata as i, resolveSkillInvocationPolicy as n, resolveSkillKey as r, parseSkillFrontmatter as t };
