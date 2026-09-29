import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { O as listAgentIds, l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { f as syncDirectoryIfSupported, o as publishFileNoClobber } from "./directory-durability-BKe2aOQN.mjs";
import { o as DEFAULT_TOOLS_FILENAME, t as DEFAULT_AGENTS_FILENAME } from "./workspace-bootstrap-policy-DSEIbIS8.mjs";
import "./workspace-mlzi3k1x.mjs";
import { t as note } from "./note-UlSlsJKw.mjs";
import { r as resolveBootstrapMaxChars } from "./bootstrap-Dvw1-bo8.mjs";
import "./embedded-agent-helpers-DGdaNc6w.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { createHash } from "node:crypto";
//#region src/commands/doctor-tools-md-migration-budget.ts
function resolveToolsMdMigrationWorkspaceTargets(cfg) {
	const targets = /* @__PURE__ */ new Map();
	for (const agentId of listAgentIds(cfg)) {
		const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
		const key = path.resolve(workspaceDir);
		const existing = targets.get(key);
		if (existing !== void 0) existing.agentIds.push(agentId);
		else targets.set(key, {
			primaryAgentId: agentId,
			agentIds: [agentId],
			workspaceDir
		});
	}
	return [...targets.values()];
}
/** One finding per agent whose own bootstrap budget cannot hold the merged file. */
function describeToolsMdMergedBootstrapLimits(params) {
	return params.agentIds.flatMap((agentId) => {
		const bootstrapMaxChars = resolveBootstrapMaxChars(params.cfg, agentId);
		if (params.mergedChars <= bootstrapMaxChars) return [];
		return [{
			agentId,
			message: `Agent "${agentId}" TOOLS.md migration will produce a ${params.mergedChars}-character AGENTS.md, exceeding its configured bootstrapMaxChars limit of ${bootstrapMaxChars}. Raise \`agents.entries.*.bootstrapMaxChars\` for this agent, or \`agents.defaults.bootstrapMaxChars\` as fallback, to preserve all migrated instructions.`
		}];
	});
}
//#endregion
//#region src/commands/doctor-tools-md-migration-content.ts
const LEGACY_TOOLS_MD_TEMPLATE = "# TOOLS.md - Local Notes\n\nSkills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup: camera names and locations, SSH hosts and aliases, preferred TTS voices, speaker/room names, device nicknames, anything environment-specific.\n\n## Examples\n\n```markdown\n### Cameras\n\n- living-room → Main area, 180° wide angle\n- front-door → Entrance, motion-triggered\n\n### SSH\n\n- home-server → 192.168.1.100, user: admin\n\n### TTS\n\n- Preferred voice: \"Nova\" (warm, slightly British)\n- Default speaker: Kitchen HomePod\n```\n\n## Why Separate?\n\nSkills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.\n\n---\n\nAdd whatever helps you do your job. This is your cheat sheet.\n\n## Related\n\n- [Agent workspace](/concepts/agent-workspace)\n";
const LEGACY_TOOLS_DEV_MD_TEMPLATE = "# TOOLS.md - User Tool Notes (editable)\n\nThis file is for _your_ notes about external tools and conventions. It does not define which tools exist; OpenClaw provides built-in tools internally, and skills add the rest.\n\n## Examples\n\n### imsg\n\n- Send an iMessage/SMS: describe who/what, confirm before sending.\n- Prefer short messages; avoid sending secrets.\n\n### sag\n\n- Text-to-speech: specify voice, target speaker/room, and whether to stream.\n\nAdd whatever else you want the assistant to know about your local toolchain.\n\n## Related\n\n- [TOOLS.md template](/reference/templates/TOOLS)\n";
const LEGACY_TOOLS_DEV_FALLBACK = "# TOOLS.md - User Tool Notes (editable)\n\nAdd your local tool notes here.\n";
function shouldMergeToolsMd(content) {
	return content.trim().length > 0 && content !== LEGACY_TOOLS_MD_TEMPLATE && content !== LEGACY_TOOLS_DEV_MD_TEMPLATE && content !== LEGACY_TOOLS_DEV_FALLBACK;
}
//#endregion
//#region src/commands/doctor-tools-md-migration-guidance.ts
const LEGACY_AGENTS_TOOLS_GUIDANCE_REWRITES = [
	["Skills provide your tools. When you need one, check its `SKILL.md`. Keep local notes (camera names, SSH details, voice preferences) in `TOOLS.md`.", "Skills define how tools work. Keep environment-specific local notes in this section."],
	["- Keep environment-specific notes in `TOOLS.md` (notes for skills).", "- Keep environment-specific notes in this file's `## Tools` section."],
	["- Keep environment-specific notes in `TOOLS.md` (Notes for Skills).", "- Keep environment-specific notes in this file's `## Tools` section."],
	["- You learn a lesson -> update `AGENTS.md`, `TOOLS.md`, or the relevant skill.", "- You learn a lesson -> update `AGENTS.md` or the relevant skill."],
	["- When you learn a lesson → update AGENTS.md, TOOLS.md, or the relevant skill", "- When you learn a lesson → update AGENTS.md or the relevant skill"],
	["Skills 提供你的工具。当你需要某个工具时，查看它的 `SKILL.md`。在 `TOOLS.md` 中保存本地笔记（摄像头名称、SSH 详情、语音偏好等）。", "Skills 定义工具的使用方式。请将环境特定的本地笔记保存在本节中。"],
	["技能提供你的工具。当你需要某个工具时，查看它的 `SKILL.md`。在 `TOOLS.md` 中保存本地笔记（摄像头名称、SSH 详情、语音偏好等）。", "技能定义工具的使用方式。请将环境特定的本地笔记保存在本节中。"],
	["- 在 `TOOLS.md` 中保存环境特定的笔记（Skills 注意事项）。", "- 将环境特定的笔记保存在本文件的 `## Tools` 部分。"],
	["- 将环境相关的备注保存在 `TOOLS.md`（Skills 备注）中。", "- 将环境相关的备注保存在本文件的 `## Tools` 部分。"],
	["- 将环境相关的备注保存在 `TOOLS.md`（技能备注）中。", "- 将环境相关的备注保存在本文件的 `## Tools` 部分。"],
	["- 当你学到教训 → 更新 AGENTS.md、TOOLS.md 或相关 Skills 文件", "- 当你学到教训 → 更新 AGENTS.md 或相关 Skills 文件"],
	["- 当你学到教训 → 更新 AGENTS.md、TOOLS.md 或相关技能文件", "- 当你学到教训 → 更新 AGENTS.md 或相关技能文件"]
];
function rewriteLegacyAgentsToolsGuidance$1(content) {
	let rewritten = content;
	for (const [legacy, current] of LEGACY_AGENTS_TOOLS_GUIDANCE_REWRITES) rewritten = rewritten.replaceAll(legacy, current);
	return rewritten;
}
//#endregion
//#region src/commands/doctor-tools-md-migration.ts
/** Doctor-owned migration from workspace TOOLS.md into the AGENTS.md Tools section. */
const TOOLS_MD_MIGRATION_CHECK_ID = "core/doctor/tools-md-migration";
const MIGRATED_SUBSECTION_HEADING = "### Local notes (migrated from TOOLS.md)";
const NO_CLOBBER_PUBLICATION = {
	strategy: "link-or-copy",
	durability: "degrade"
};
function sha256(content) {
	return createHash("sha256").update(content).digest("hex");
}
async function readMigrationFileSnapshot(params) {
	let stat;
	try {
		stat = await fs$1.lstat(params.filePath);
	} catch (error) {
		if (params.allowMissing && error.code === "ENOENT") return { content: "" };
		throw error;
	}
	if (!stat.isFile() || stat.nlink > 1) throw new Error(`${params.label} must be an unlinked regular file for automatic migration`);
	const noFollow = fs.constants.O_NOFOLLOW ?? 0;
	const handle = await fs$1.open(params.filePath, fs.constants.O_RDONLY | noFollow);
	try {
		const openedStat = await handle.stat();
		if (!openedStat.isFile() || openedStat.nlink !== 1 || openedStat.dev !== stat.dev || openedStat.ino !== stat.ino) throw new Error(`${params.label} changed while opening it for migration`);
		const content = await handle.readFile("utf8");
		const currentStat = await fs$1.lstat(params.filePath);
		if (currentStat.dev !== openedStat.dev || currentStat.ino !== openedStat.ino) throw new Error(`${params.label} changed while opening it for migration`);
		return {
			content,
			stat: openedStat
		};
	} finally {
		await handle.close();
	}
}
async function readToolsMd(workspaceDir) {
	const betaArtifacts = (await fs$1.readdir(workspaceDir).catch(() => [])).filter((entry) => entry.startsWith(`TOOLS.md.doctor-importing-`) || entry.startsWith(`AGENTS.md.doctor-backup-`));
	if (betaArtifacts.length > 0) throw new Error(`Interrupted v2026.7.2-beta.5 migration artifact(s) left untouched: ${betaArtifacts.join(", ")}. Restore the desired file manually before rerunning doctor.`);
	const toolsPath = path.join(workspaceDir, DEFAULT_TOOLS_FILENAME);
	const snapshot = await readMigrationFileSnapshot({
		filePath: toolsPath,
		label: "TOOLS.md",
		allowMissing: true
	});
	if (!snapshot.stat) return;
	return {
		path: toolsPath,
		content: snapshot.content,
		sha256: sha256(snapshot.content),
		stat: snapshot.stat
	};
}
function migratedBlock(content) {
	return `${MIGRATED_SUBSECTION_HEADING}\n\n${content}`;
}
function appendWithSpacing(before, addition, after = "") {
	return `${before}${before.length === 0 ? "" : before.endsWith("\n\n") ? "" : before.endsWith("\n") ? "\n" : "\n\n"}${addition}${after.length === 0 ? "" : addition.endsWith("\n\n") ? "" : addition.endsWith("\n") ? "\n" : "\n\n"}${after}`;
}
function mergeToolsMdIntoAgentsMd(agentsContent, toolsContent) {
	const mergedAgentsContent = rewriteLegacyAgentsToolsGuidance(agentsContent);
	if (mergedAgentsContent.includes(MIGRATED_SUBSECTION_HEADING)) {
		if (mergedAgentsContent.includes(toolsContent)) return mergedAgentsContent;
		const insertAt = mergedAgentsContent.indexOf(MIGRATED_SUBSECTION_HEADING) + 40;
		return appendWithSpacing(mergedAgentsContent.slice(0, insertAt), toolsContent, mergedAgentsContent.slice(insertAt));
	}
	const block = migratedBlock(toolsContent);
	const toolsSection = findToolsSection(mergedAgentsContent);
	if (!toolsSection) return appendWithSpacing(mergedAgentsContent, `## Tools\n\n${block}`);
	const insertAt = toolsSection.insertAt;
	return appendWithSpacing(mergedAgentsContent.slice(0, insertAt), block, mergedAgentsContent.slice(insertAt));
}
function rewriteLegacyAgentsToolsGuidance(content) {
	const rewritten = rewriteLegacyAgentsToolsGuidance$1(content);
	return rewritten === content ? content : ensureLocalNotesHeading(rewritten);
}
function findToolsSection(content) {
	let offset = 0;
	let insideTools = false;
	let headingEnd = 0;
	let fence;
	for (const lineWithEnding of content.match(/.*(?:\n|$)/gu) ?? []) {
		if (lineWithEnding === "") continue;
		const line = lineWithEnding.replace(/\n$/u, "");
		const fenceRun = /^\s*(`{3,}|~{3,})/u.exec(line)?.[1];
		const closingFenceRun = /^\s*(`{3,}|~{3,})\s*$/u.exec(line)?.[1];
		const marker = fenceRun?.[0];
		if (marker && !fence) fence = {
			marker,
			length: fenceRun.length
		};
		else if (closingFenceRun && fence && closingFenceRun[0] === fence.marker && closingFenceRun.length >= fence.length) fence = void 0;
		else if (!fence) {
			const heading = /^(#{1,6})\s+(.+?)\s*#*\s*$/u.exec(line);
			if (heading) {
				const depth = heading[1].length;
				if (insideTools && depth <= 2) return {
					headingEnd,
					insertAt: offset
				};
				if (depth === 2 && heading[2].trim().toLowerCase() === "tools") {
					insideTools = true;
					headingEnd = offset + lineWithEnding.length;
				}
			}
		}
		offset += lineWithEnding.length;
	}
	return insideTools ? {
		headingEnd,
		insertAt: content.length
	} : void 0;
}
function ensureLocalNotesHeading(content) {
	const section = findToolsSection(content);
	if (!section) return content;
	const body = content.slice(section.headingEnd, section.insertAt);
	if (/^###\s+Local notes(?:\s|$)/imu.test(body)) return content;
	return `${content.slice(0, section.headingEnd)}\n### Local notes\n${content.slice(section.headingEnd)}`;
}
async function writeAgentsAtomically(params) {
	const snapshot = await readMigrationFileSnapshot({
		filePath: params.agentsPath,
		label: "AGENTS.md",
		allowMissing: true
	});
	if (snapshot.content !== params.expected) throw new Error("AGENTS.md changed during TOOLS.md migration");
	const stat = snapshot.stat;
	const mode = stat?.mode ?? 384;
	const tempPath = `${params.agentsPath}.doctor-writing-${process.pid}-${Date.now()}`;
	try {
		const handle = await fs$1.open(tempPath, "wx", mode);
		try {
			await handle.writeFile(params.content, "utf8");
			await handle.sync();
		} finally {
			await handle.close();
		}
		const current = await readMigrationFileSnapshot({
			filePath: params.agentsPath,
			label: "AGENTS.md",
			allowMissing: true
		});
		if (current.content !== params.expected || current.stat?.dev !== stat?.dev || current.stat?.ino !== stat?.ino) throw new Error("AGENTS.md changed during TOOLS.md migration");
		await fs$1.rename(tempPath, params.agentsPath);
		await syncDirectoryIfSupported(path.dirname(params.agentsPath));
	} catch (error) {
		await fs$1.rm(tempPath, { force: true });
		throw error;
	}
}
async function recoverInterruptedAgentsWrite(agentsPath) {
	const dir = path.dirname(agentsPath);
	const prefix = `${path.basename(agentsPath)}.doctor-writing-`;
	const entries = await fs$1.readdir(dir).catch(() => []);
	let removed = false;
	for (const entry of entries) {
		if (!entry.startsWith(prefix)) continue;
		const tempPath = path.join(dir, entry);
		const stat = await fs$1.lstat(tempPath);
		if (!stat.isFile() || stat.nlink !== 1) throw new Error(`interrupted AGENTS.md write must be an unlinked regular file: ${tempPath}`);
		await fs$1.rm(tempPath);
		removed = true;
	}
	if (removed) await syncDirectoryIfSupported(dir);
}
async function removeToolsSource(source, workspaceDir) {
	const current = await readMigrationFileSnapshot({
		filePath: source.path,
		label: "TOOLS.md"
	});
	if (sha256(current.content) !== source.sha256) throw new Error("TOOLS.md changed during migration");
	const currentStat = fs.lstatSync(source.path);
	if (!current.stat || currentStat.dev !== current.stat.dev || currentStat.ino !== current.stat.ino || currentStat.dev !== source.stat.dev || currentStat.ino !== source.stat.ino) throw new Error("TOOLS.md changed during migration");
	fs.unlinkSync(source.path);
	await syncDirectoryIfSupported(workspaceDir);
}
function archivePathForSource(agentId, source, env) {
	const safeAgentId = agentId.replace(/[^A-Za-z0-9._-]+/g, "-");
	return path.join(resolveStateDir(env), "backups", "tools-md-migration", `${safeAgentId}-${source.sha256}.md`);
}
async function archiveSource(params) {
	const archivePath = archivePathForSource(params.agentId, params.source, params.env);
	const archiveDir = path.dirname(archivePath);
	await fs$1.mkdir(archiveDir, {
		recursive: true,
		mode: 448
	});
	const tempPath = `${archivePath}.doctor-writing-${process.pid}-${Date.now()}`;
	try {
		const handle = await fs$1.open(tempPath, "wx", 384);
		try {
			await handle.writeFile(params.source.content, "utf8");
			await handle.sync();
		} finally {
			await handle.close();
		}
		await publishFileNoClobber(tempPath, archivePath, NO_CLOBBER_PUBLICATION);
		await fs$1.rm(tempPath);
		await syncDirectoryIfSupported(archiveDir);
	} catch (error) {
		await fs$1.rm(tempPath, { force: true });
		if (error.code !== "EEXIST") throw error;
		if (sha256(await fs$1.readFile(archivePath, "utf8")) !== params.source.sha256) throw new Error(`TOOLS.md migration archive collision at ${archivePath}`, { cause: error });
	}
	return archivePath;
}
function migrationFinding(params) {
	return {
		checkId: TOOLS_MD_MIGRATION_CHECK_ID,
		severity: params.severity ?? "warning",
		message: params.message,
		path: params.path,
		target: params.agentId,
		requirement: params.requirement,
		fixHint: `Run ${formatCliCommand("openclaw doctor --fix")} to merge TOOLS.md into AGENTS.md.`
	};
}
async function collectToolsMdMigrationFindings(cfg) {
	const findings = [];
	for (const target of resolveToolsMdMigrationWorkspaceTargets(cfg)) try {
		const source = await readToolsMd(target.workspaceDir);
		if (source) {
			findings.push(migrationFinding({
				agentId: target.primaryAgentId,
				path: source.path,
				message: `Agent "${target.primaryAgentId}" still stores local tool notes in TOOLS.md.`,
				requirement: "legacy-tools-md"
			}));
			if (shouldMergeToolsMd(source.content)) {
				const agentsPath = path.join(target.workspaceDir, DEFAULT_AGENTS_FILENAME);
				const agentsContent = (await readMigrationFileSnapshot({
					filePath: agentsPath,
					label: "AGENTS.md",
					allowMissing: true
				})).content;
				const mergedChars = mergeToolsMdIntoAgentsMd(agentsContent, source.content).length;
				for (const budget of describeToolsMdMergedBootstrapLimits({
					cfg,
					agentIds: target.agentIds,
					mergedChars
				})) findings.push(migrationFinding({
					agentId: budget.agentId,
					path: agentsPath,
					message: budget.message,
					requirement: "tools-md-merged-bootstrap-limit"
				}));
			}
		}
	} catch (error) {
		findings.push(migrationFinding({
			agentId: target.primaryAgentId,
			path: path.join(target.workspaceDir, DEFAULT_TOOLS_FILENAME),
			message: `Agent "${target.primaryAgentId}" TOOLS.md cannot be migrated: ${formatErrorMessage(error)}`,
			severity: "error",
			requirement: "tools-md-migration-blocked"
		}));
	}
	return findings;
}
async function maybeMigrateToolsMd(params) {
	const env = params.env ?? process.env;
	const changes = [];
	const warnings = [];
	for (const target of resolveToolsMdMigrationWorkspaceTargets(params.cfg)) try {
		const source = await readToolsMd(target.workspaceDir);
		if (!source) continue;
		if (!params.shouldRepair) {
			note(`${shortenHomePath(source.path)} will be archived and merged into AGENTS.md when customized.`, "TOOLS.md migration preview");
			continue;
		}
		const shouldMerge = shouldMergeToolsMd(source.content);
		await archiveSource({
			agentId: target.primaryAgentId,
			source,
			env
		});
		const agentsPath = path.join(target.workspaceDir, DEFAULT_AGENTS_FILENAME);
		await recoverInterruptedAgentsWrite(agentsPath);
		const agentsContent = (await readMigrationFileSnapshot({
			filePath: agentsPath,
			label: "AGENTS.md",
			allowMissing: true
		})).content;
		const merged = shouldMerge ? mergeToolsMdIntoAgentsMd(agentsContent, source.content) : rewriteLegacyAgentsToolsGuidance(agentsContent);
		if (merged !== agentsContent) {
			await writeAgentsAtomically({
				agentsPath,
				expected: agentsContent,
				content: merged
			});
			if ((await readMigrationFileSnapshot({
				filePath: agentsPath,
				label: "AGENTS.md"
			})).content !== merged) throw new Error("AGENTS.md changed after TOOLS.md migration was written");
		}
		await syncDirectoryIfSupported(target.workspaceDir);
		await removeToolsSource(source, target.workspaceDir);
		changes.push(shouldMerge ? `Merged ${shortenHomePath(source.path)} into AGENTS.md and archived the original.` : `Removed untouched ${shortenHomePath(source.path)} after archiving it.`);
	} catch (error) {
		warnings.push(`Agent "${target.primaryAgentId}" TOOLS.md was not migrated: ${formatErrorMessage(error)}`);
	}
	if (changes.length > 0) note(changes.join("\n"), "TOOLS.md migration");
	if (warnings.length > 0) note(warnings.join("\n"), "Doctor warnings");
	return {
		changes,
		warnings
	};
}
//#endregion
export { collectToolsMdMigrationFindings, maybeMigrateToolsMd };
