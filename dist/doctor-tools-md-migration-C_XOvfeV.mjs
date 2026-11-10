import { p as shortenHomePath } from "./utils-gjJ-tD2q.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { f as syncDirectoryIfSupported, o as publishFileNoClobber } from "./directory-durability-B2RKADOj.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { o as DEFAULT_TOOLS_FILENAME, t as DEFAULT_AGENTS_FILENAME } from "./workspace-bootstrap-policy-wM0DWL3B.mjs";
import "./workspace-3xrXOvoY.mjs";
import { t as note } from "./note-CmoIRLec.mjs";
import { i as resolveBootstrapMaxChars } from "./bootstrap-DLZ2qr_T.mjs";
import "./embedded-agent-helpers-CRUmVsjM.mjs";
import { t as noteDoctorMigrationResult } from "./doctor-migration-notes-BeR2Nugl.mjs";
import fs from "node:fs";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { readRegularFile } from "@openclaw/fs-safe/advanced";
import { isUtf8 } from "node:buffer";
//#region src/commands/doctor-tools-md-migration-budget.ts
function resolveToolsMdMigrationWorkspaceTargets(cfg) {
	const targets = /* @__PURE__ */ new Map();
	for (const agentId of listAgentIds(cfg)) {
		const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
		const key = path.resolve(workspaceDir);
		const target = targets.get(key) ?? {
			primaryAgentId: agentId,
			agentIds: [],
			workspaceDir
		};
		target.agentIds.push(agentId);
		targets.set(key, target);
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
const MIGRATED_SUBSECTION_HEADING = "### Local notes (migrated from TOOLS.md)";
const NO_CLOBBER_PUBLICATION = {
	strategy: "link-or-copy",
	durability: "degrade"
};
function sameFileIdentity$1(left, right) {
	return left?.dev === right?.dev && left?.ino === right?.ino;
}
function samePosixPermissions(left, right) {
	return left.uid === right.uid && left.gid === right.gid && (left.mode & 4095) === (right.mode & 4095);
}
function addsPosixReaders(source, destination) {
	for (const uid of /* @__PURE__ */ new Set([
		source.uid,
		destination.uid,
		void 0
	])) for (const sourceGroup of [false, true]) for (const destinationGroup of [false, true]) {
		if (source.gid === destination.gid && sourceGroup !== destinationGroup) continue;
		const sourceBit = uid === source.uid ? 256 : sourceGroup ? 32 : 4;
		const destinationBit = uid === destination.uid ? 256 : destinationGroup ? 32 : 4;
		if ((destination.mode & destinationBit) !== 0 && (source.mode & sourceBit) === 0) return true;
	}
	return false;
}
async function assertSourceReadersPreserved(source, destination) {
	const current = await readMigrationFileSnapshot(source.path);
	if (current.content !== source.content || !current.stat || !sameFileIdentity$1(current.stat, source.stat) || !samePosixPermissions(current.stat, source.stat)) throw new Error("TOOLS.md changed during migration");
	if (addsPosixReaders(current.stat, destination)) throw new Error("Merging TOOLS.md would grant additional POSIX readers. Review both files' owners, groups, and read permissions before rerunning doctor.");
}
async function readMigrationFileSnapshot(filePath, allowMissing = false) {
	let stat;
	try {
		stat = await fs$1.lstat(filePath);
	} catch (error) {
		if (allowMissing && error.code === "ENOENT") return { content: "" };
		throw error;
	}
	if (!stat.isFile() || stat.nlink > 1) throw new Error(`${path.basename(filePath)} must be an unlinked regular file for automatic migration`);
	const file = await readRegularFile({ filePath });
	const currentStat = await fs$1.lstat(filePath);
	if (file.stat.nlink !== 1 || !sameFileIdentity$1(file.stat, stat) || !sameFileIdentity$1(currentStat, file.stat)) throw new Error(`${path.basename(filePath)} changed while opening it for migration`);
	if (!isUtf8(file.buffer)) throw new Error(`File is not valid UTF-8: ${filePath}; preserve its bytes and convert a copy to UTF-8 before retrying`);
	return {
		content: file.buffer.toString("utf8"),
		stat: currentStat
	};
}
async function readToolsMd(workspaceDir) {
	const betaArtifacts = (await fs$1.readdir(workspaceDir).catch(() => [])).filter((entry) => entry.startsWith(`TOOLS.md.doctor-importing-`) || entry.startsWith(`AGENTS.md.doctor-backup-`));
	if (betaArtifacts.length > 0) throw new Error(`Interrupted v2026.7.2-beta.5 migration artifact(s) left untouched: ${betaArtifacts.join(", ")}. Restore the desired file manually before rerunning doctor.`);
	const toolsPath = path.join(workspaceDir, DEFAULT_TOOLS_FILENAME);
	const snapshot = await readMigrationFileSnapshot(toolsPath, true);
	if (!snapshot.stat) return;
	return {
		path: toolsPath,
		content: snapshot.content,
		sha256: sha256Hex(snapshot.content),
		stat: snapshot.stat
	};
}
function appendWithSpacing(before, addition, after = "") {
	const spacing = (text) => text.endsWith("\n\n") ? "" : text.endsWith("\n") ? "\n" : "\n\n";
	return `${before}${before.length === 0 ? "" : spacing(before)}${addition}${after.length === 0 ? "" : spacing(addition)}${after}`;
}
function mergeToolsMdIntoAgentsMd(agentsContent, toolsContent) {
	const mergedAgentsContent = rewriteLegacyAgentsToolsGuidance(agentsContent);
	const headingIndex = mergedAgentsContent.indexOf(MIGRATED_SUBSECTION_HEADING);
	if (headingIndex >= 0 && mergedAgentsContent.includes(toolsContent)) return mergedAgentsContent;
	const block = headingIndex >= 0 ? toolsContent : `${MIGRATED_SUBSECTION_HEADING}\n\n${toolsContent}`;
	const insertAt = headingIndex >= 0 ? headingIndex + 40 : findToolsSection(mergedAgentsContent)?.insertAt;
	if (insertAt === void 0) return appendWithSpacing(mergedAgentsContent, `## Tools\n\n${block}`);
	return appendWithSpacing(mergedAgentsContent.slice(0, insertAt), block, mergedAgentsContent.slice(insertAt));
}
function rewriteLegacyAgentsToolsGuidance(content) {
	const rewritten = rewriteLegacyAgentsToolsGuidance$1(content);
	return rewritten === content ? content : ensureLocalNotesHeading(rewritten);
}
function findToolsSection(content) {
	let offset = 0;
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
				if (headingEnd > 0 && depth <= 2) return {
					headingEnd,
					insertAt: offset
				};
				if (depth === 2 && heading[2].trim().toLowerCase() === "tools") headingEnd = offset + lineWithEnding.length;
			}
		}
		offset += lineWithEnding.length;
	}
	return headingEnd > 0 ? {
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
	const snapshot = await readMigrationFileSnapshot(params.agentsPath, true);
	if (snapshot.content !== params.expected) throw new Error("AGENTS.md changed during TOOLS.md migration");
	const stat = snapshot.stat;
	const mode = stat?.mode ?? 384;
	const tempPath = `${params.agentsPath}.doctor-writing-${process.pid}-${Date.now()}`;
	try {
		let prepared;
		try {
			var _usingCtx$1 = _usingCtx();
			const handle = _usingCtx$1.a(await fs$1.open(tempPath, "wx", 384));
			await handle.writeFile(params.content, "utf8");
			if (process.platform !== "win32" && stat) {
				await handle.chmod(0);
				await handle.chown(stat.uid, stat.gid);
			}
			if (process.platform !== "win32" && params.importedSource) await assertSourceReadersPreserved(params.importedSource, stat ?? await handle.stat());
			if (stat) await handle.chmod(mode);
			prepared = await handle.stat();
			if (process.platform !== "win32" && stat && !samePosixPermissions(prepared, stat)) throw new Error("AGENTS.md ownership or permissions could not be preserved");
			await handle.sync();
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			await _usingCtx$1.d();
		}
		const current = await readMigrationFileSnapshot(params.agentsPath, true);
		if (current.content !== params.expected || !sameFileIdentity$1(current.stat, stat) || process.platform !== "win32" && current.stat && stat && !samePosixPermissions(current.stat, stat)) throw new Error("AGENTS.md changed during TOOLS.md migration");
		if (process.platform !== "win32" && params.importedSource) await assertSourceReadersPreserved(params.importedSource, prepared);
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
	const entries = (await fs$1.readdir(dir).catch(() => [])).filter((entry) => entry.startsWith(prefix));
	for (const entry of entries) {
		const tempPath = path.join(dir, entry);
		const stat = await fs$1.lstat(tempPath);
		if (!stat.isFile() || stat.nlink !== 1) throw new Error(`interrupted AGENTS.md write must be an unlinked regular file: ${tempPath}`);
		await fs$1.rm(tempPath);
	}
	if (entries.length > 0) await syncDirectoryIfSupported(dir);
}
async function removeToolsSource(source, workspaceDir) {
	const current = await readMigrationFileSnapshot(source.path);
	if (sha256Hex(current.content) !== source.sha256) throw new Error("TOOLS.md changed during migration");
	const currentStat = fs.lstatSync(source.path);
	if (!current.stat || !sameFileIdentity$1(currentStat, current.stat) || !sameFileIdentity$1(currentStat, source.stat)) throw new Error("TOOLS.md changed during migration");
	fs.unlinkSync(source.path);
	await syncDirectoryIfSupported(workspaceDir);
}
async function archiveSource(params) {
	const safeAgentId = params.agentId.replace(/[^A-Za-z0-9._-]+/g, "-");
	const archivePath = path.join(resolveStateDir(params.env), "backups", "tools-md-migration", `${safeAgentId}-${params.source.sha256}.md`);
	const archiveDir = path.dirname(archivePath);
	await fs$1.mkdir(archiveDir, {
		recursive: true,
		mode: 448
	});
	const tempPath = `${archivePath}.doctor-writing-${process.pid}-${Date.now()}`;
	try {
		try {
			var _usingCtx3 = _usingCtx();
			const handle = _usingCtx3.a(await fs$1.open(tempPath, "wx", 384));
			await handle.writeFile(params.source.content, "utf8");
			await handle.sync();
		} catch (_) {
			_usingCtx3.e = _;
		} finally {
			await _usingCtx3.d();
		}
		await publishFileNoClobber(tempPath, archivePath, NO_CLOBBER_PUBLICATION);
		await fs$1.rm(tempPath);
		await syncDirectoryIfSupported(archiveDir);
	} catch (error) {
		await fs$1.rm(tempPath, { force: true });
		if (error.code !== "EEXIST") throw error;
		if (sha256Hex(await fs$1.readFile(archivePath, "utf8")) !== params.source.sha256) throw new Error(`TOOLS.md migration archive collision at ${archivePath}`, { cause: error });
	}
}
async function collectToolsMdMigrationFindings(cfg) {
	const MIGRATION_FINDING_DEFAULTS = {
		checkId: "core/doctor/tools-md-migration",
		severity: "warning",
		fixHint: `Run ${formatCliCommand("openclaw doctor --fix")} to merge TOOLS.md into AGENTS.md.`
	};
	const findings = [];
	for (const target of resolveToolsMdMigrationWorkspaceTargets(cfg)) try {
		const source = await readToolsMd(target.workspaceDir);
		if (source) {
			findings.push({
				...MIGRATION_FINDING_DEFAULTS,
				target: target.primaryAgentId,
				path: source.path,
				message: `Agent "${target.primaryAgentId}" still stores local tool notes in TOOLS.md.`,
				requirement: "legacy-tools-md"
			});
			if (shouldMergeToolsMd(source.content)) {
				const agentsPath = path.join(target.workspaceDir, DEFAULT_AGENTS_FILENAME);
				const agentsContent = (await readMigrationFileSnapshot(agentsPath, true)).content;
				const mergedChars = mergeToolsMdIntoAgentsMd(agentsContent, source.content).length;
				for (const budget of describeToolsMdMergedBootstrapLimits({
					cfg,
					agentIds: target.agentIds,
					mergedChars
				})) findings.push({
					...MIGRATION_FINDING_DEFAULTS,
					target: budget.agentId,
					path: agentsPath,
					message: budget.message,
					requirement: "tools-md-merged-bootstrap-limit"
				});
			}
		}
	} catch (error) {
		findings.push({
			...MIGRATION_FINDING_DEFAULTS,
			target: target.primaryAgentId,
			path: path.join(target.workspaceDir, DEFAULT_TOOLS_FILENAME),
			message: `Agent "${target.primaryAgentId}" TOOLS.md cannot be migrated: ${formatErrorMessage(error)}`,
			severity: "error",
			requirement: "tools-md-migration-blocked"
		});
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
		const agentsContent = (await readMigrationFileSnapshot(agentsPath, true)).content;
		const merged = shouldMerge ? mergeToolsMdIntoAgentsMd(agentsContent, source.content) : rewriteLegacyAgentsToolsGuidance(agentsContent);
		if (merged !== agentsContent) {
			await writeAgentsAtomically({
				agentsPath,
				expected: agentsContent,
				content: merged,
				importedSource: shouldMerge && !agentsContent.includes(source.content) ? source : void 0
			});
			if ((await readMigrationFileSnapshot(agentsPath)).content !== merged) throw new Error("AGENTS.md changed after TOOLS.md migration was written");
		}
		await syncDirectoryIfSupported(target.workspaceDir);
		await removeToolsSource(source, target.workspaceDir);
		changes.push(shouldMerge ? `Merged ${shortenHomePath(source.path)} into AGENTS.md and archived the original.` : `Removed untouched ${shortenHomePath(source.path)} after archiving it.`);
	} catch (error) {
		warnings.push(`Agent "${target.primaryAgentId}" TOOLS.md was not migrated: ${formatErrorMessage(error)}`);
	}
	noteDoctorMigrationResult({
		changes,
		warnings
	}, { changesTitle: "TOOLS.md migration" });
	return {
		changes,
		warnings
	};
}
//#endregion
export { collectToolsMdMigrationFindings, maybeMigrateToolsMd };
