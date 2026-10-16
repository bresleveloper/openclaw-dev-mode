import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { r as sha256File } from "./crypto-digest-y6oZN-_F.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { root } from "@openclaw/fs-safe/root";
//#region src/skills/lifecycle/skill-tree-digest.ts
const EXCLUDED_METADATA_DIRS = /* @__PURE__ */ new Set([".clawhub", ".clawdhub"]);
/** Digests every installed skill file except OpenClaw's own provenance metadata. */
async function digestClawHubSkillTree(skillDir) {
	const scoped = await root(skillDir);
	const collected = [];
	for await (const entry of scoped.walk("", {
		symlinkPolicy: "include",
		entryFilter: ({ relativePath }) => EXCLUDED_METADATA_DIRS.has(relativePath) ? "skip-subtree" : "include"
	})) {
		const portablePath = entry.relativePath;
		const stat = await fs.lstat(path.join(skillDir, portablePath));
		if (stat.isSymbolicLink() || !stat.isDirectory() && !stat.isFile()) throw new Error(`Skill tree contains unsupported entry ${JSON.stringify(portablePath)}.`);
		if (stat.isDirectory()) {
			collected.push({
				path: portablePath,
				type: "directory"
			});
			continue;
		}
		if (stat.nlink > 1) throw new Error(`Skill tree contains hard-linked file ${JSON.stringify(portablePath)}.`);
		const end = stat.size > 0 ? stat.size - 1 : void 0;
		collected.push({
			path: portablePath,
			type: "file",
			sha256: await sha256File(path.join(skillDir, portablePath), end)
		});
	}
	return `sha256:${sha256Hex(JSON.stringify(collected))}`;
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
