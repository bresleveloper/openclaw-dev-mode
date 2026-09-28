import { i as scanSource, r as scanSkillContent } from "./scanner-CHmA4Xs0.mjs";
//#region src/skills/workshop/proposal-scan.ts
function scanProposalBundle(content, supportFiles = [], metadata = []) {
	const scannedAt = (/* @__PURE__ */ new Date()).toISOString();
	const findings = [
		...scanSkillContent(content, "PROPOSAL.md"),
		...scanSource(content, "PROPOSAL.md"),
		...supportFiles.flatMap((file) => [
			...scanSkillContent(file.path, "support-file-path").filter((finding) => finding.ruleId === "literal-secret"),
			...scanSkillContent(file.content, file.path),
			...scanSource(file.content, file.path)
		]),
		...metadata.flatMap((entry) => entry.content ? scanSkillContent(entry.content, entry.file).filter((finding) => finding.ruleId === "literal-secret") : [])
	];
	const critical = findings.filter((finding) => finding.severity === "critical").length;
	const warn = findings.filter((finding) => finding.severity === "warn").length;
	const info = findings.filter((finding) => finding.severity === "info").length;
	return {
		state: critical > 0 ? "failed" : "clean",
		scannedAt,
		critical,
		warn,
		info,
		findings
	};
}
function assertProposalContainsNoLiteralSecrets(scan) {
	const finding = scan.findings.find((entry) => entry.ruleId === "literal-secret");
	if (!finding) return;
	throw new Error(`Skill proposal contains a recognized literal credential in ${finding.file}; replace it with a SecretRef or placeholder.`);
}
//#endregion
export { scanProposalBundle as n, assertProposalContainsNoLiteralSecrets as t };
