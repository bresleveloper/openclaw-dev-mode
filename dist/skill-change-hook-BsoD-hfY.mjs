import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { c as sha256File } from "./directory-durability-CqSvP1tc.mjs";
import { t as getGlobalHookRunner } from "./hook-runner-global-eJIIEpha.mjs";
import { t as parseSkillFrontmatter } from "./frontmatter-CrckYGsg.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { FsSafeError } from "@openclaw/fs-safe/errors";
import { root } from "@openclaw/fs-safe/root";
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
async function snapshotCommittedSkillArtifact(params) {
	const skillDir = path.resolve(params.skillDir);
	const skillRoot = await root(skillDir);
	const entries = await fs.readdir(skillDir, { withFileTypes: true });
	const selectedSkillPath = SKILL_FILE_CANDIDATES.find((candidate) => entries.some((entry) => entry.name === candidate && entry.isFile()));
	const files = [];
	let selectedSkillFile;
	for await (const entry of skillRoot.walk("", {
		symlinkPolicy: "include",
		entryFilter: ({ relativePath }) => EXCLUDED_ROOT_DIRS.has(relativePath) ? "skip-subtree" : "include"
	})) {
		if (entry.kind === "directory") continue;
		const portablePath = entry.relativePath;
		if (entry.kind !== "file") throw new Error(`Skill tree contains unsupported entry ${JSON.stringify(portablePath)}.`);
		const opened = await skillRoot.open(`./${portablePath}`).catch((error) => {
			if (error instanceof FsSafeError && error.code === "hardlink") throw new Error(`Skill tree contains hard-linked file ${JSON.stringify(portablePath)}.`, { cause: error });
			throw error;
		});
		try {
			const content = portablePath === selectedSkillPath ? await opened.handle.readFile() : void 0;
			const { digest, bytes } = content ? {
				digest: sha256Hex(content),
				bytes: content.byteLength
			} : await sha256File(opened.handle);
			const file = {
				path: portablePath,
				sha256: digest,
				sizeBytes: bytes
			};
			files.push(file);
			if (content) selectedSkillFile = {
				file,
				content
			};
		} finally {
			await opened.handle.close();
		}
	}
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
