import { n as sha256Hex } from "./node-crypto-Df3MIs6V.mjs";
import { i as sha256File } from "./crypto-digest-D9Nqq3c7.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/skills/lifecycle/skill-tree-digest.ts
const EXCLUDED_METADATA_DIRS = /* @__PURE__ */ new Set([".clawhub", ".clawdhub"]);
async function collectEntries(root, relativeDir = "") {
	const absoluteDir = path.join(root, relativeDir);
	const entries = await fs.readdir(absoluteDir, { withFileTypes: true });
	const collected = [];
	for (const entry of entries.toSorted((left, right) => left.name < right.name ? -1 : left.name > right.name ? 1 : 0)) {
		if (!relativeDir && EXCLUDED_METADATA_DIRS.has(entry.name)) continue;
		const relativePath = path.join(relativeDir, entry.name);
		const portablePath = relativePath.split(path.sep).join("/");
		const stat = await fs.lstat(path.join(root, relativePath));
		if (stat.isSymbolicLink() || !stat.isDirectory() && !stat.isFile()) throw new Error(`Skill tree contains unsupported entry ${JSON.stringify(portablePath)}.`);
		if (stat.isDirectory()) {
			collected.push({
				path: portablePath,
				type: "directory"
			});
			collected.push(...await collectEntries(root, relativePath));
			continue;
		}
		if (stat.nlink > 1) throw new Error(`Skill tree contains hard-linked file ${JSON.stringify(portablePath)}.`);
		const end = stat.size > 0 ? stat.size - 1 : void 0;
		collected.push({
			path: portablePath,
			type: "file",
			sha256: await sha256File(path.join(root, relativePath), end)
		});
	}
	return collected;
}
/** Digests every installed skill file except OpenClaw's own provenance metadata. */
async function digestClawHubSkillTree(skillDir) {
	const entries = await collectEntries(skillDir);
	return `sha256:${sha256Hex(JSON.stringify(entries))}`;
}
async function checkClawHubSkillPlanAtPath(plan, skillDir, readFile = fs.readFile) {
	try {
		const stat = await fs.lstat(skillDir);
		if (!stat.isDirectory() || stat.isSymbolicLink()) return {
			ok: false,
			error: `Skill ${JSON.stringify(plan.slug)} changed during update.`
		};
		const content = await readFile(path.join(skillDir, plan.skillFilePath));
		if (sha256Hex(content) !== plan.skillFileSha256 || await digestClawHubSkillTree(skillDir) !== plan.fileTreeSha256) return {
			ok: false,
			error: `Skill ${JSON.stringify(plan.slug)} changed during update.`
		};
		return { ok: true };
	} catch (error) {
		return {
			ok: false,
			error: String(error)
		};
	}
}
//#endregion
export { digestClawHubSkillTree as n, checkClawHubSkillPlanAtPath as t };
