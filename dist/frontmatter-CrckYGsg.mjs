import { g as readStringValue, h as readNonEmptyStringPreservingWhitespace, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as normalizeCsvOrLooseStringList } from "./string-normalization-CECOqf64.mjs";
import { l as validateRegistryNpmSpec } from "./npm-registry-spec-Dw2vyAJw.mjs";
import { a as resolveOpenClawManifestBlock, c as resolveOpenClawManifestRequires, d as parseFrontmatterBlockResult, i as parseOpenClawManifestInstallBase, n as getFrontmatterString, o as resolveOpenClawManifestInstall, r as parseFrontmatterBool, s as resolveOpenClawManifestOs, t as applyOpenClawManifestInstallCommonFields } from "./frontmatter-ByhFzIgC.mjs";
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
	try {
		const parsed = new URL(value);
		if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return;
		return parsed.toString();
	} catch {
		return;
	}
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
	const spec = applyOpenClawManifestInstallCommonFields({ kind: parsed.kind }, parsed);
	const osList = normalizeCsvOrLooseStringList(raw.os);
	if (osList.length > 0) spec.os = osList;
	const formula = normalizeSafeBrewFormula(raw.formula) ?? normalizeSafeBrewFormula(raw.cask);
	if (formula) spec.formula = formula;
	if (spec.kind === "node" || spec.kind === "uv") {
		const pkg = spec.kind === "node" ? normalizeSafeNpmSpec(raw.package) : normalizeSafePackageSpec(raw.package, UV_PACKAGE_PATTERN);
		if (pkg) spec.package = pkg;
	}
	const moduleSpec = normalizeSafePackageSpec(raw.module, GO_MODULE_PATTERN);
	if (moduleSpec) spec.module = moduleSpec;
	const downloadUrl = normalizeSafeDownloadUrl(raw.url);
	if (downloadUrl) spec.url = downloadUrl;
	if (spec.kind === "download" && raw.sha256 !== void 0) {
		if (typeof raw.sha256 !== "string") return;
		const sha256 = raw.sha256.trim().toLowerCase();
		if (!/^[a-f0-9]{64}$/u.test(sha256)) return;
		spec.sha256 = sha256;
	}
	if (typeof raw.archive === "string") spec.archive = raw.archive;
	if (typeof raw.extract === "boolean") spec.extract = raw.extract;
	if (typeof raw.stripComponents === "number") spec.stripComponents = raw.stripComponents;
	if (typeof raw.targetDir === "string") spec.targetDir = raw.targetDir;
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
function resolveSkillKey(skill, entry) {
	return entry?.metadata?.skillKey ?? skill.name;
}
//#endregion
export { resolveSkillManifestMetadata as i, resolveSkillInvocationPolicy as n, resolveSkillKey as r, parseSkillFrontmatter as t };
