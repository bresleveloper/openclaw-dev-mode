import { n as sha256Hex } from "./node-crypto-Df3MIs6V.mjs";
import "./crypto-digest-D9Nqq3c7.mjs";
import { u as extractFrontmatterBlock } from "./frontmatter-BdjKgRi1.mjs";
import { n as createSyntheticSourceInfo } from "./source-info-CcFiWAof.mjs";
import { n as resolveSkillInvocationPolicy } from "./frontmatter-2H_F0IFB.mjs";
//#region src/skills/loading/skill-materializer.ts
const SKILL_TITLE_HEADING = /^#\s+(.+?)\s*#*\s*$/mu;
function humanizeSkillIdentifier(value) {
	return value.trim().split(/[-_]+/u).filter(Boolean).map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`).join(" ");
}
function resolveSkillDisplayName(content, fallbackName) {
	const displayName = (extractFrontmatterBlock(content)?.body ?? content).match(SKILL_TITLE_HEADING)?.[1]?.trim() || humanizeSkillIdentifier(fallbackName) || fallbackName;
	return Buffer.from(displayName, "utf16le").toString("utf16le");
}
function materializeSkill(params) {
	return {
		name: params.name,
		displayName: resolveSkillDisplayName(params.content, params.frontmatter.name || params.name),
		description: params.description,
		contentHash: sha256Hex(params.content),
		filePath: params.filePath,
		baseDir: params.baseDir,
		source: params.source,
		sourceInfo: createSyntheticSourceInfo(params.filePath, {
			...params.sourceOptions,
			baseDir: params.baseDir
		}),
		disableModelInvocation: resolveSkillInvocationPolicy(params.frontmatter).disableModelInvocation
	};
}
//#endregion
export { materializeSkill as t };
