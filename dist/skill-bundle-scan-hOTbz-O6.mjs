import { i as scanSource, r as scanSkillContent } from "./scanner-DqFvmBwd.mjs";
//#region src/skills/security/skill-bundle-scan.ts
/** Scans one skill file's content with the skill-instruction and embedded-source rules. */
function scanSkillFile(content, label) {
	return [...scanSkillContent(content, label), ...scanSource(content, label)];
}
/** Support-file paths are checked for literal secrets only. */
function scanSupportFilePath(path) {
	return scanSkillContent(path, "support-file-path").filter((finding) => finding.ruleId === "literal-secret");
}
/** Scans SKILL.md plus support files and their paths. */
function scanSkillBundle(content, supportFiles = []) {
	const findings = [...scanSkillFile(content, "SKILL.md"), ...supportFiles.flatMap((file) => [...scanSupportFilePath(file.path), ...scanSkillFile(file.content, file.path)])];
	return {
		critical: findings.filter((finding) => finding.severity === "critical").length,
		findings
	};
}
function assertSkillBundleHasNoLiteralSecrets(scan) {
	const finding = scan.findings.find((entry) => entry.ruleId === "literal-secret");
	if (!finding) return;
	throw new Error(`Skill contains a recognized literal credential in ${finding.file}; replace it with a SecretRef or placeholder.`);
}
//#endregion
export { scanSupportFilePath as i, scanSkillBundle as n, scanSkillFile as r, assertSkillBundleHasNoLiteralSecrets as t };
