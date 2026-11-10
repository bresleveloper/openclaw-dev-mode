import { r as resolveGlobalMap } from "./global-singleton-DrXvEBww.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { b as registerOpenClawStateDatabaseLifecycleListener } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { d as pathExists, w as root } from "./fs-safe-6Z4UiMS4.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { n as executeOpenClawStateWorker } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { t as parseSkillFrontmatter } from "./frontmatter-siV6LZij.mjs";
import { t as resolveWorkshopSkillsDir } from "./skills-root-D4CgBm6V.mjs";
import { r as removePathWithinRoot } from "./fs-safe-remove-DYWyr3qX.mjs";
import { t as resolveSkillWorkshopConfig } from "./config-BJIyIMth.mjs";
import { i as snapshotCommittedSkillArtifactBestEffort, n as hasCommittedSkillChangeHooks, t as dispatchCommittedSkillChangeBestEffort } from "./skill-change-hook-CBGJbIIJ.mjs";
import { a as readWorkspaceSkillFile, n as assertInsideSkillsRoot, o as readWorkspaceSupportFile, r as normalizeWorkspaceSkillSupportPath, t as MAX_WORKSPACE_SKILL_SUPPORT_FILE_BYTES } from "./workspace-skill-write-C9CcQa0e.mjs";
import { i as scanSupportFilePath, r as scanSkillFile } from "./skill-bundle-scan-hOTbz-O6.mjs";
import { i as snapshotSkill, n as listVersions, r as pruneVersions } from "./skill-versions-CLrCbrwy.mjs";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
//#region src/skills/workshop/changes.ts
const MAX_CHANGES_LIMIT = 500;
const stores = resolveGlobalMap(Symbol.for("openclaw.skillWorkshopChanges"), "close-and-restart");
registerOpenClawStateDatabaseLifecycleListener((event) => {
	if (event.kind !== "opened") {
		for (const [key, store] of stores) if (store.path === (event.identity?.canonicalPath ?? event.path)) stores.delete(key);
	}
});
function captureStore() {
	const context = captureOpenClawStateWorkerContext();
	const key = context.admission.coordinationKey;
	let store = stores.get(key);
	if (!store) {
		store = {
			path: context.admission.identity.canonicalPath,
			agents: /* @__PURE__ */ new Map()
		};
		stores.set(key, store);
	}
	return {
		context,
		store
	};
}
async function recordWorkshopChange(change) {
	const { context, store } = captureStore();
	store.agents.delete(change.agentId);
	try {
		await executeOpenClawStateWorker(context, {
			type: "skills.workshop.changes.record",
			input: change
		});
	} finally {
		store.agents.delete(change.agentId);
	}
}
async function listWorkshopChanges(agentId, options = {}) {
	const { context, store } = captureStore();
	let rows = store.agents.get(agentId);
	if (!rows) {
		if (store.agents.size >= 128) store.agents.delete(store.agents.keys().next().value);
		rows = executeOpenClawStateWorker(context, {
			type: "skills.workshop.changes.list",
			input: {
				agentId,
				limit: MAX_CHANGES_LIMIT
			}
		});
		store.agents.set(agentId, rows);
	}
	let changes;
	try {
		changes = await rows;
	} catch (error) {
		if (store.agents.get(agentId) === rows) store.agents.delete(agentId);
		throw error;
	}
	return structuredClone(changes.filter((change) => (options.beforeMs === void 0 || change.createdAtMs < options.beforeMs) && (!options.runId || change.runId === options.runId)).slice(0, Math.min(Math.max(Math.trunc(options.limit ?? 50), 1), MAX_CHANGES_LIMIT)));
}
//#endregion
//#region src/skills/workshop/library.ts
/** Refusal the model (or operator) can act on; the message says what to change. */
var WorkshopWriteError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "WorkshopWriteError";
	}
};
const SKILL_FILE = "SKILL.md";
const ARCHIVE_DIR = ".archive";
const MAX_DESCRIPTION_BYTES = 1024;
const NEW_SKILL_NAME_PATTERN = /^[a-z0-9][a-z0-9-]{0,62}$/;
const EXISTING_SKILL_NAME_PATTERN = /^[a-z0-9][a-z0-9-]{0,254}$/;
const skillLocks = new KeyedAsyncQueue();
const log = createSubsystemLogger("skills/workshop");
function emptyForMissingDirectory(error) {
	if (hasErrnoCode(error, "ENOENT")) return [];
	throw error;
}
function resolveSkillPaths(config, agentId, name) {
	if (!EXISTING_SKILL_NAME_PATTERN.test(name)) throw new WorkshopWriteError(`Invalid skill name "${name}": use lowercase letters, digits, or hyphens, starting with a letter or digit (e.g. "deploy-staging").`);
	const skillsRoot = resolveWorkshopSkillsDir(config, agentId);
	return {
		root: skillsRoot,
		skillDir: path.join(skillsRoot, name),
		versionsDir: path.join(skillsRoot, ARCHIVE_DIR, name)
	};
}
function normalizeSkillFilePath(filePath) {
	const trimmed = filePath?.trim();
	if (!trimmed || trimmed === SKILL_FILE) return SKILL_FILE;
	try {
		return normalizeWorkspaceSkillSupportPath(trimmed);
	} catch (error) {
		throw new WorkshopWriteError(`Invalid file_path "${trimmed}": ${formatErrorMessage(error)} Use "SKILL.md" or a file like "references/notes.md".`);
	}
}
async function readSkillFile(skillDir, filePath) {
	return filePath === SKILL_FILE ? await readWorkspaceSkillFile(path.join(skillDir, SKILL_FILE)) : await readWorkspaceSupportFile({
		skillDir,
		relativePath: filePath
	});
}
/** Regular files below one skill directory, SKILL.md first; links and dot entries are skipped. */
async function listSkillFiles(skillDir) {
	const entries = await fs.readdir(skillDir, {
		recursive: true,
		withFileTypes: true
	});
	const files = [];
	let sizeBytes = 0;
	let updatedAtMs = 0;
	for (const entry of entries) {
		if (!entry.isFile()) continue;
		const relative = path.relative(skillDir, path.join(entry.parentPath, entry.name));
		const segments = relative.split(path.sep);
		if (segments.some((segment) => segment.startsWith("."))) continue;
		const stat = await fs.stat(path.join(skillDir, relative));
		sizeBytes += stat.size;
		updatedAtMs = Math.max(updatedAtMs, stat.mtimeMs);
		files.push(segments.join("/"));
	}
	files.sort((a, b) => a === SKILL_FILE ? -1 : b === SKILL_FILE ? 1 : a.localeCompare(b));
	return {
		files,
		sizeBytes,
		updatedAtMs: Math.trunc(updatedAtMs)
	};
}
function validateSkillMarkdown(name, content, maxSkillBytes) {
	const sizeBytes = Buffer.byteLength(content);
	if (sizeBytes > maxSkillBytes) throw new WorkshopWriteError(`SKILL.md is ${sizeBytes} bytes; the limit is ${maxSkillBytes}. Keep SKILL.md to the procedure and move detail into references/<topic>.md with action=write_file.`);
	let frontmatter;
	try {
		frontmatter = parseSkillFrontmatter(content);
	} catch (error) {
		throw new WorkshopWriteError(`SKILL.md frontmatter is invalid (${formatErrorMessage(error)}). Start the file with:\n---\nname: ${name}\ndescription: <when to use this skill>\n---`);
	}
	if (frontmatter.name?.trim() !== name) throw new WorkshopWriteError(`SKILL.md frontmatter must contain "name: ${name}" (the skill directory name); found ${frontmatter.name ? `"${frontmatter.name}"` : "no name"}.`);
	const description = frontmatter.description?.trim() ?? "";
	const descriptionBytes = Buffer.byteLength(description);
	if (descriptionBytes === 0 || descriptionBytes > MAX_DESCRIPTION_BYTES) throw new WorkshopWriteError(`SKILL.md frontmatter "description" must be 1-${MAX_DESCRIPTION_BYTES} bytes (found ${descriptionBytes}). Lead with the situations that should trigger the skill.`);
	return description;
}
function assertSafeContent(name, filePath, content) {
	const label = `${name}/${filePath}`;
	const finding = scanSkillFile(content, label).find((entry) => entry.severity === "critical");
	if (!finding) return;
	const fix = finding.ruleId === "literal-secret" ? "Replace the credential with a placeholder such as <API_KEY>; never store real secrets in skills." : "Remove or rewrite that line, then retry.";
	throw new WorkshopWriteError(`Refused: ${label} line ${finding.line} matches security rule "${finding.ruleId}" (${finding.message}). ${fix}`);
}
/** Validates one file's next content: path, SKILL.md shape or support size, then the security scan. */
function validateSkillFile(config, name, filePath, content) {
	if (filePath !== SKILL_FILE && scanSupportFilePath(filePath).length > 0) throw new WorkshopWriteError(`Refused: a file path in "${name}" looks like it contains a credential. Name the file after its topic (e.g. "references/api.md"); never store real secrets in skills.`);
	const description = filePath === SKILL_FILE ? validateSkillMarkdown(name, content, resolveSkillWorkshopConfig(config).maxSkillBytes) : void 0;
	if (filePath !== SKILL_FILE && Buffer.byteLength(content) > 262144) throw new WorkshopWriteError(`${filePath} exceeds ${MAX_WORKSPACE_SKILL_SUPPORT_FILE_BYTES} bytes; split it into smaller files.`);
	assertSafeContent(name, filePath, content);
	return description;
}
/** Reads a saved version only when a normal write could have produced every file in it. */
async function readRestorableVersion(config, name, versionId, versionDir) {
	const refuse = (problem) => new WorkshopWriteError(`Cannot restore "${name}" version ${versionId}: ${problem} The live skill is unchanged; restore a different version instead.`);
	if (!(await fs.lstat(versionDir)).isDirectory()) throw refuse("the saved version is not a directory.");
	const versionRoot = await root(versionDir);
	const files = [];
	for (const entry of await fs.readdir(versionDir, {
		recursive: true,
		withFileTypes: true
	})) {
		const filePath = path.relative(versionDir, path.join(entry.parentPath, entry.name)).split(path.sep).join("/");
		if (entry.isDirectory() || filePath.split("/").some((segment) => segment.startsWith("."))) continue;
		if (!entry.isFile()) throw refuse(`${filePath} is a symlink or special file.`);
		if (filePath !== SKILL_FILE) {
			let canonical;
			try {
				canonical = normalizeWorkspaceSkillSupportPath(filePath);
			} catch (error) {
				throw refuse(`${filePath} is not an allowed skill file (${formatErrorMessage(error)})`);
			}
			if (canonical !== filePath) throw refuse(`${filePath} is not a valid skill file path.`);
		}
		let content;
		try {
			content = (await versionRoot.read(filePath, {
				hardlinks: "reject",
				maxBytes: filePath === SKILL_FILE ? resolveSkillWorkshopConfig(config).maxSkillBytes : MAX_WORKSPACE_SKILL_SUPPORT_FILE_BYTES,
				symlinks: "reject"
			})).buffer;
		} catch (error) {
			throw refuse(`${filePath} could not be read safely (${formatErrorMessage(error)}).`);
		}
		try {
			validateSkillFile(config, name, filePath, content.toString("utf8"));
		} catch (error) {
			throw refuse(formatErrorMessage(error));
		}
		files.push([filePath, content]);
	}
	if (!files.some(([filePath]) => filePath === SKILL_FILE)) throw refuse("SKILL.md is missing.");
	return files;
}
async function writeSkillFile(paths, filePath, content) {
	await fs.mkdir(paths.root, { recursive: true });
	assertInsideSkillsRoot(paths.root, paths.skillDir, "skill directory");
	await fs.mkdir(paths.skillDir, { recursive: true });
	await (await root(paths.skillDir)).write(filePath, content, {
		encoding: "utf8",
		mkdir: true,
		overwrite: true,
		assertBeforeMutation: paths.assertLive
	});
}
async function requireLiveSkill(paths, name) {
	if (await pathExists(path.join(paths.skillDir, SKILL_FILE))) return;
	throw new WorkshopWriteError((await listVersions(paths.versionsDir)).length > 0 ? `Skill "${name}" is archived. Restore it first with action=restore name=${name}.` : `No workshop skill named "${name}". Call action=list to see skills, or action=create to add one.`);
}
/** Sorted acquisition keeps overlapping multi-skill mutations from deadlocking. */
async function withSkillLocks(keys, run) {
	const [first, ...rest] = [...new Set(keys)].toSorted((a, b) => a.localeCompare(b));
	return first === void 0 ? await run() : await skillLocks.enqueue(first, () => withSkillLocks(rest, run));
}
/** Serializes one skill's mutation, then refreshes discovery and records the change. */
async function mutateSkill(ctx, name, action, apply, alsoLock = []) {
	const paths = resolveSkillPaths(ctx.config, ctx.agentId, name);
	return await withSkillLocks([paths.skillDir, ...alsoLock.map((other) => other.skillDir)], async () => {
		ctx.assertLive?.();
		const hooked = hasCommittedSkillChangeHooks();
		const snapshotArtifact = async () => hooked && await pathExists(path.join(paths.skillDir, SKILL_FILE)) ? await snapshotCommittedSkillArtifactBestEffort({
			skillDir: paths.skillDir,
			skillKey: name,
			source: "workshop"
		}) : void 0;
		const before = await snapshotArtifact();
		const { summary, versionId } = await apply({
			...paths,
			assertLive: () => ctx.assertLive?.()
		});
		const after = await snapshotArtifact();
		await pruneVersions(paths.versionsDir);
		try {
			const { refreshSkillsDiscovery } = await import("./refresh-C3a1Ipyv.mjs");
			await refreshSkillsDiscovery({
				config: ctx.config,
				reason: "workshop"
			});
		} catch (error) {
			log.warn(`Skill changed, but discovery refresh failed: ${formatErrorMessage(error)}`);
		}
		const change = {
			id: randomUUID(),
			agentId: ctx.agentId,
			skillName: name,
			action,
			actor: ctx.actor,
			summary,
			...versionId ? { versionId } : {},
			...ctx.sessionKey ? { sessionKey: ctx.sessionKey } : {},
			...ctx.runId ? { runId: ctx.runId } : {},
			createdAtMs: Date.now()
		};
		await recordWorkshopChange(change);
		if (before || after) await dispatchCommittedSkillChangeBestEffort({
			action: !before ? "created" : after ? "updated" : "removed",
			source: "workshop",
			workspaceDir: resolveAgentWorkspaceDir(ctx.config, ctx.agentId),
			...before ? { before } : {},
			...after ? { after } : {}
		});
		return change;
	});
}
async function listWorkshopSkills(config, agentId) {
	const skillsRoot = resolveWorkshopSkillsDir(config, agentId);
	const entries = await fs.readdir(skillsRoot, { withFileTypes: true }).catch(emptyForMissingDirectory);
	const skills = [];
	for (const entry of entries) {
		if (!entry.isDirectory() || !EXISTING_SKILL_NAME_PATTERN.test(entry.name)) continue;
		const skillDir = path.join(skillsRoot, entry.name);
		const content = await readWorkspaceSkillFile(path.join(skillDir, SKILL_FILE)).catch(() => null);
		if (content === null) continue;
		let description = "";
		try {
			description = parseSkillFrontmatter(content).description?.trim() ?? "";
		} catch {}
		skills.push({
			name: entry.name,
			description,
			...await listSkillFiles(skillDir)
		});
	}
	return skills.toSorted((a, b) => a.name.localeCompare(b.name));
}
async function listWorkshopArchive(config, agentId) {
	const skillsRoot = resolveWorkshopSkillsDir(config, agentId);
	const names = await fs.readdir(path.join(skillsRoot, ARCHIVE_DIR)).catch(emptyForMissingDirectory);
	const archived = [];
	for (const name of names.toSorted()) {
		if (!EXISTING_SKILL_NAME_PATTERN.test(name)) continue;
		const versions = await listVersions(path.join(skillsRoot, ARCHIVE_DIR, name));
		if (versions.length > 0) {
			const live = await pathExists(path.join(skillsRoot, name, SKILL_FILE));
			archived.push({
				name,
				live,
				versions
			});
		}
	}
	return archived;
}
async function viewWorkshopSkill(config, agentId, name, filePath, versionId) {
	const paths = resolveSkillPaths(config, agentId, name);
	const file = normalizeSkillFilePath(filePath);
	let baseDir = paths.skillDir;
	if (versionId) {
		const versions = await listVersions(paths.versionsDir);
		if (!versions.some((version) => version.id === versionId)) throw new WorkshopWriteError(`Skill "${name}" has no version "${versionId}". Versions: ${versions.map((version) => version.id).join(", ") || "none"}.`);
		baseDir = path.join(paths.versionsDir, versionId);
	} else await requireLiveSkill(paths, name);
	const { files } = await listSkillFiles(baseDir);
	const content = await readSkillFile(baseDir, file);
	if (content === null) throw new WorkshopWriteError(`${file} does not exist in "${name}". Files: ${files.join(", ")}.`);
	return {
		name,
		filePath: file,
		content,
		files
	};
}
async function createWorkshopSkill(ctx, params) {
	if (!NEW_SKILL_NAME_PATTERN.test(params.name)) throw new WorkshopWriteError(`Invalid skill name "${params.name}": use 1-63 lowercase letters, digits, or hyphens, starting with a letter or digit (e.g. "deploy-staging").`);
	return await mutateSkill(ctx, params.name, "create", async (paths) => {
		if (await pathExists(paths.skillDir)) throw new WorkshopWriteError(`Skill "${params.name}" already exists. View it and use action=patch, or choose another name.`);
		const description = validateSkillFile(ctx.config, params.name, SKILL_FILE, params.content);
		try {
			await writeSkillFile(paths, SKILL_FILE, params.content);
		} catch (error) {
			await fs.rm(paths.skillDir, {
				recursive: true,
				force: true
			});
			throw error;
		}
		return { summary: params.summary ?? `created: ${description}` };
	});
}
async function patchWorkshopSkill(ctx, params) {
	const file = normalizeSkillFilePath(params.filePath);
	return await mutateSkill(ctx, params.name, "patch", async (paths) => {
		await requireLiveSkill(paths, params.name);
		if (!params.oldText) throw new WorkshopWriteError("old_text is required: copy the exact text to replace from view.");
		if (params.oldText === params.newText) throw new WorkshopWriteError("old_text and new_text are identical; nothing to change.");
		const current = await readSkillFile(paths.skillDir, file);
		if (current === null) throw new WorkshopWriteError(`${file} does not exist in "${params.name}". Use action=write_file to add it.`);
		const { oldText } = params;
		let matches = 0;
		for (let at = current.indexOf(oldText); at !== -1; at = current.indexOf(oldText, at + 1)) matches++;
		if (matches !== 1) throw new WorkshopWriteError(matches === 0 ? `old_text was not found in ${params.name}/${file}. View the file again and copy the exact text, including whitespace.` : `old_text matches ${matches} places in ${params.name}/${file}. Include more surrounding text so it matches once.`);
		const next = current.replace(params.oldText, () => params.newText);
		validateSkillFile(ctx.config, params.name, file, next);
		const versionId = await snapshotSkill(paths, "patch");
		await writeSkillFile(paths, file, next);
		return {
			summary: params.summary ?? `patched ${file}`,
			versionId
		};
	});
}
async function writeWorkshopSkillFile(ctx, params) {
	const file = normalizeSkillFilePath(params.filePath);
	return await mutateSkill(ctx, params.name, "write_file", async (paths) => {
		await requireLiveSkill(paths, params.name);
		if (await readSkillFile(paths.skillDir, file) === params.content) throw new WorkshopWriteError(`${params.name}/${file} already has this content; nothing changed.`);
		validateSkillFile(ctx.config, params.name, file, params.content);
		const versionId = await snapshotSkill(paths, "write_file");
		await writeSkillFile(paths, file, params.content);
		return {
			summary: params.summary ?? (file === SKILL_FILE ? "rewrote SKILL.md" : `wrote ${file}`),
			versionId
		};
	});
}
/** Deletes one support file; SKILL.md goes only with the whole skill, through archive. */
async function removeWorkshopSkillFile(ctx, params) {
	const file = normalizeSkillFilePath(params.filePath);
	if (file === SKILL_FILE) throw new WorkshopWriteError(`SKILL.md cannot be removed. Archive the skill with action=archive name=${params.name} instead.`);
	return await mutateSkill(ctx, params.name, "remove_file", async (paths) => {
		await requireLiveSkill(paths, params.name);
		const { files } = await listSkillFiles(paths.skillDir);
		if (!files.includes(file)) throw new WorkshopWriteError(`${file} does not exist in "${params.name}". Files: ${files.join(", ")}.`);
		const versionId = await snapshotSkill(paths, "remove_file");
		await removePathWithinRoot({
			rootDir: paths.skillDir,
			relativePath: file,
			force: false,
			assertBeforeMutation: paths.assertLive
		});
		return {
			summary: params.summary ?? `removed ${file}`,
			versionId
		};
	});
}
async function archiveWorkshopSkill(ctx, params) {
	const absorbedInto = params.absorbedInto === void 0 ? void 0 : resolveSkillPaths(ctx.config, ctx.agentId, params.absorbedInto);
	return await mutateSkill(ctx, params.name, "archive", async (paths) => {
		await requireLiveSkill(paths, params.name);
		if (absorbedInto && (params.absorbedInto === params.name || !await pathExists(path.join(absorbedInto.skillDir, SKILL_FILE)))) throw new WorkshopWriteError(`absorbed_into must name another live workshop skill; "${params.absorbedInto}" is not one.`);
		const versionId = await snapshotSkill(paths, "archive");
		const detached = path.join(paths.root, ARCHIVE_DIR, `.archiving-${randomUUID()}`);
		paths.assertLive();
		await fs.rename(paths.skillDir, detached);
		await fs.rm(detached, {
			recursive: true,
			force: true
		});
		const detail = [params.absorbedInto ? `merged into ${params.absorbedInto}` : void 0, params.reason?.trim() || void 0].filter(Boolean);
		return {
			summary: detail.length > 0 ? `archived: ${detail.join("; ")}` : "archived",
			versionId
		};
	}, absorbedInto ? [absorbedInto] : []);
}
/** Restores a saved version (default: newest); the live copy is versioned first, so undo is undoable. */
async function restoreWorkshopSkill(ctx, params) {
	return await mutateSkill(ctx, params.name, "restore", async (paths) => {
		const versions = await listVersions(paths.versionsDir);
		const target = params.versionId ? versions.find((version) => version.id === params.versionId) : versions[0];
		if (!target) throw new WorkshopWriteError(versions.length === 0 ? `Skill "${params.name}" has no saved versions to restore.` : `Skill "${params.name}" has no version "${params.versionId}". Versions: ${versions.map((version) => version.id).join(", ")}.`);
		const files = await readRestorableVersion(ctx.config, params.name, target.id, path.join(paths.versionsDir, target.id));
		const staging = path.join(paths.root, ARCHIVE_DIR, `.restore-${randomUUID()}`);
		const previous = path.join(paths.root, ARCHIVE_DIR, `.restore-previous-${randomUUID()}`);
		try {
			for (const [filePath, content] of files) {
				const destination = path.join(staging, ...filePath.split("/"));
				await fs.mkdir(path.dirname(destination), { recursive: true });
				await fs.writeFile(destination, content, { flag: "wx" });
			}
			const versionId = await snapshotSkill(paths, "restore");
			const hadLive = await pathExists(paths.skillDir);
			if (hadLive) {
				paths.assertLive();
				await fs.rename(paths.skillDir, previous);
			}
			try {
				paths.assertLive();
				await fs.rename(staging, paths.skillDir);
			} catch (error) {
				if (hadLive) await fs.rename(previous, paths.skillDir);
				throw error;
			}
			await fs.rm(previous, {
				recursive: true,
				force: true
			});
			return {
				summary: params.summary ?? (target.action === "archive" ? "restored from archive" : params.versionId ? `restored version ${target.id}` : `undid ${target.action.replace("_", " ")}`),
				versionId
			};
		} finally {
			await fs.rm(staging, {
				recursive: true,
				force: true
			});
		}
	});
}
//#endregion
export { listWorkshopSkills as a, restoreWorkshopSkill as c, listWorkshopChanges as d, listWorkshopArchive as i, viewWorkshopSkill as l, archiveWorkshopSkill as n, patchWorkshopSkill as o, createWorkshopSkill as r, removeWorkshopSkillFile as s, WorkshopWriteError as t, writeWorkshopSkillFile as u };
