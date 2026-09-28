import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { w as root } from "./fs-safe-BAPek8At.mjs";
import { n as sha256Hex } from "./node-crypto-Df3MIs6V.mjs";
import "./crypto-digest-D9Nqq3c7.mjs";
import { c as sha256File } from "./directory-durability-BKe2aOQN.mjs";
import { t as getGlobalHookRunner } from "./hook-runner-global-tOGjxVvH.mjs";
import { t as parseSkillFrontmatter } from "./frontmatter-2H_F0IFB.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/skills/lifecycle/skill-change-hook.ts
const SKILL_FILE_CANDIDATES = [
	"SKILL.md",
	"skill.md",
	"skills.md",
	"SKILL.MD"
];
const EXCLUDED_ROOT_DIRS = /* @__PURE__ */ new Set([
	".clawhub",
	".clawdhub",
	".openclaw"
]);
async function collectSkillTreeFiles(skillDir, skillRoot, relativeDir = "") {
	const entries = await fs.readdir(path.join(skillDir, relativeDir), { withFileTypes: true });
	const selectedSkillPath = relativeDir ? void 0 : SKILL_FILE_CANDIDATES.find((candidate) => entries.some((entry) => entry.name === candidate && entry.isFile()));
	const files = [];
	let selectedSkillFile;
	for (const entry of entries.toSorted((left, right) => left.name < right.name ? -1 : left.name > right.name ? 1 : 0)) {
		if (!relativeDir && EXCLUDED_ROOT_DIRS.has(entry.name)) continue;
		const relativePath = path.join(relativeDir, entry.name);
		const portablePath = relativePath.split(path.sep).join("/");
		const absolutePath = path.join(skillDir, relativePath);
		const stat = await fs.lstat(absolutePath);
		if (stat.isSymbolicLink() || !stat.isDirectory() && !stat.isFile()) throw new Error(`Skill tree contains unsupported entry ${JSON.stringify(portablePath)}.`);
		if (stat.isDirectory()) {
			files.push(...(await collectSkillTreeFiles(skillDir, skillRoot, relativePath)).files);
			continue;
		}
		if (stat.nlink > 1) throw new Error(`Skill tree contains hard-linked file ${JSON.stringify(portablePath)}.`);
		const opened = await skillRoot.open(path.join(skillRoot.rootReal, relativePath));
		try {
			if (relativePath === selectedSkillPath) {
				const content = await opened.handle.readFile();
				const file = {
					path: portablePath,
					sha256: sha256Hex(content),
					sizeBytes: content.byteLength
				};
				files.push(file);
				selectedSkillFile = {
					file,
					content
				};
			} else {
				const { digest, bytes } = await sha256File(opened.handle);
				files.push({
					path: portablePath,
					sha256: digest,
					sizeBytes: bytes
				});
			}
		} finally {
			await opened.handle.close();
		}
	}
	return {
		files,
		selectedSkillFile
	};
}
function parseSkillArtifactMetadata(content) {
	const text = content.toString("utf8");
	if (text.includes("\0") || !Buffer.from(text, "utf8").equals(content)) return {};
	try {
		const frontmatter = parseSkillFrontmatter(text);
		return {
			name: normalizeOptionalString(frontmatter.name),
			description: normalizeOptionalString(frontmatter.description),
			declaredVersion: normalizeOptionalString(frontmatter.version)
		};
	} catch {
		return {};
	}
}
function hasCommittedSkillChangeHooks() {
	return getGlobalHookRunner()?.hasHooks("skill_changed") ?? false;
}
function resolveCommittedSkillChangeSource(originType) {
	if (originType === "clawhub") return "clawhub";
	if (originType === "upload") return "upload";
	return "source-install";
}
async function snapshotCommittedSkillArtifact(params) {
	const skillDir = path.resolve(params.skillDir);
	const { files, selectedSkillFile } = await collectSkillTreeFiles(skillDir, await root(skillDir));
	if (!selectedSkillFile) throw new Error(`Skill tree is missing SKILL.md: ${skillDir}`);
	const skillFile = path.join(skillDir, selectedSkillFile.file.path);
	const frontmatter = parseSkillArtifactMetadata(selectedSkillFile.content);
	const treeSha256 = sha256Hex(JSON.stringify(files));
	return {
		name: frontmatter.name ?? params.skillKey,
		skillKey: params.skillKey,
		...frontmatter.description ? { description: frontmatter.description } : {},
		skillFile,
		skillDir,
		source: params.source,
		revision: {
			...frontmatter.declaredVersion ? { declaredVersion: frontmatter.declaredVersion } : {},
			contentSha256: `sha256:${selectedSkillFile.file.sha256}`,
			treeSha256: `sha256:${treeSha256}`,
			...params.sourceVersion ? { sourceVersion: params.sourceVersion } : {}
		}
	};
}
async function snapshotCommittedSkillArtifactBestEffort(params) {
	try {
		return await snapshotCommittedSkillArtifact(params);
	} catch (error) {
		params.logger?.warn?.(`Could not snapshot committed skill change: ${String(error)}`);
		return;
	}
}
async function dispatchCommittedSkillChangeBestEffort(params) {
	const runner = getGlobalHookRunner();
	if (!runner?.hasHooks("skill_changed")) return;
	try {
		await runner.runSkillChanged({
			action: params.action,
			source: params.source,
			occurredAt: (/* @__PURE__ */ new Date()).toISOString(),
			...params.before ? { before: params.before } : {},
			...params.after ? { after: params.after } : {},
			...params.proposal ? { proposal: params.proposal } : {}
		}, { workspaceDir: params.workspaceDir });
	} catch (error) {
		params.logger?.warn?.(`Committed skill change hook failed: ${String(error)}`);
	}
}
//#endregion
export { snapshotCommittedSkillArtifactBestEffort as i, hasCommittedSkillChangeHooks as n, resolveCommittedSkillChangeSource as r, dispatchCommittedSkillChangeBestEffort as t };
