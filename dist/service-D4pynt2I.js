import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { a as walkDirectory } from "./fs-safe-RNq3oO57.js";
import { a as root, i as readLocalFileSafely } from "./secure-temp-dir-DMUMnweR.js";
import { t as extractFrontmatterBlock } from "./frontmatter-WnMmgZSx.js";
import { A as writeSkillProposalRollback, C as readSkillProposalRecord, D as updateSkillProposalRecord, E as resolveSkillProposalTarget, F as normalizeWorkspaceSkillSupportPath, H as normalizeSkillIndexName, I as readWorkspaceSkillFile, L as readWorkspaceSupportFile, M as MAX_WORKSPACE_SKILL_SUPPORT_FILE_BYTES, N as assertInsideWorkspace, O as withSkillProposalTargetLock, P as assertWorkspaceSkillWriteTarget, R as writeWorkspaceSkill, S as readSkillProposalManifest, T as replaceSkillProposalDraft, _ as createSkillProposalRollback, b as readProposalSupportFiles, g as createSkillProposalId, j as SKILL_WORKSHOP_SCHEMA, k as writeSkillProposal, v as hashSkillProposalContent, w as refreshSkillProposalManifest, x as readSkillProposal, y as prepareSkillProposalSupportFiles } from "./curator-D9VAGN7J.js";
import { t as parseFrontmatter } from "./frontmatter-Co_01Uxb.js";
import { n as resolveAllowedSkillSymlinkTargetRealPaths } from "./symlink-targets-x5j6Oxf6.js";
import { t as bumpSkillsSnapshotVersion } from "./refresh-state-DHnXO3IV.js";
import { t as resolveSkillWorkshopConfig } from "./config-XlfFMqhc.js";
import { n as resolveSkillStatusEntry, t as buildWorkspaceSkillStatus } from "./status-DS0ZepJw.js";
import { a as scanSource, i as scanSkillContent } from "./scanner-CpExscpK.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/skills/workshop/frontmatter.ts
function yamlScalar(value) {
	return JSON.stringify(value);
}
/** Renders proposal markdown while preserving allowed original frontmatter fields. */
function renderProposalMarkdown(params) {
	const originalFrontmatter = extractFrontmatterBlock(params.content)?.block ?? (params.fallbackFrontmatterContent ? extractFrontmatterBlock(params.fallbackFrontmatterContent)?.block : void 0);
	const keptFrontmatter = originalFrontmatter ? filterFrontmatterBlock(originalFrontmatter, [
		"name",
		"description",
		"status",
		"version",
		"date"
	]) : "";
	const body = (extractFrontmatterBlock(params.content)?.body ?? normalizeNewlines(params.content)).trimStart();
	const version = params.version ?? "v1";
	const date = params.date ?? (/* @__PURE__ */ new Date()).toISOString();
	const markdown = `---\n${[
		`name: ${yamlScalar(params.name)}`,
		`description: ${yamlScalar(params.description)}`,
		"status: proposal",
		`version: ${yamlScalar(version)}`,
		`date: ${yamlScalar(date)}`,
		keptFrontmatter
	].filter(Boolean).join("\n")}\n---\n\n${body}`;
	return markdown.endsWith("\n") ? markdown : `${markdown}\n`;
}
function readProposalFrontmatter(content) {
	const frontmatter = parseFrontmatter(content);
	const name = frontmatter.name?.trim();
	const description = frontmatter.description?.trim();
	const status = frontmatter.status?.trim().toLowerCase();
	if (!name || !description || status !== "proposal") return null;
	return {
		name,
		description
	};
}
function stripProposalFrontmatterForSkill(content) {
	const normalized = normalizeNewlines(content);
	const extracted = extractFrontmatterBlock(normalized);
	if (!extracted) return normalized.endsWith("\n") ? normalized : `${normalized}\n`;
	const body = extracted.body.replace(/^\n+/, "");
	const keptLines = extracted.block.split("\n").filter((line) => {
		const key = line.match(/^([\w-]+):/)?.[1]?.toLowerCase();
		return key !== "status" && key !== "version" && key !== "date";
	}).join("\n").trim();
	const result = keptLines ? `---\n${keptLines}\n---\n\n${body}` : body;
	return result.endsWith("\n") ? result : `${result}\n`;
}
function filterFrontmatterBlock(block, keysToDrop) {
	const drop = new Set(keysToDrop.map((key) => key.toLowerCase()));
	const lines = block.split("\n");
	const kept = [];
	let dropping = false;
	for (const line of lines) {
		const key = line.match(/^([\w-]+):/)?.[1]?.toLowerCase();
		if (key) dropping = drop.has(key);
		if (!dropping) kept.push(line);
	}
	return kept.join("\n").trim();
}
function normalizeNewlines(content) {
	return content.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}
//#endregion
//#region src/skills/workshop/service.ts
const WRITABLE_WORKSPACE_SOURCES = /* @__PURE__ */ new Set(["openclaw-workspace", "agents-skills-project"]);
const MAX_PROPOSAL_DRAFT_BYTES = 1024 * 1024;
const MAX_PROPOSAL_DIRECTORY_ENTRIES = 256;
const MAX_SKILL_PROPOSAL_DESCRIPTION_BYTES = 160;
/** Lists skill workshop proposals, optionally scoped to a workspace. */
async function listSkillProposals(options = {}) {
	const manifest = await readSkillProposalManifest();
	if (!options.workspaceDir) return manifest;
	const proposals = [];
	for (const proposal of manifest.proposals) {
		const record = await readSkillProposalRecord(proposal.id);
		if (record && isProposalInWorkspace(record, options.workspaceDir)) proposals.push(proposal);
	}
	return {
		...manifest,
		proposals
	};
}
async function readSkillProposalDraftFile(filePath) {
	return decodeProposalTextFile((await readLocalFileSafely({
		filePath,
		maxBytes: MAX_PROPOSAL_DRAFT_BYTES
	})).buffer, filePath);
}
async function readSkillProposalDraftDirectory(dirPath) {
	const absoluteDir = path.resolve(dirPath);
	const draftRoot = await root(absoluteDir);
	const proposal = await draftRoot.read("PROPOSAL.md", {
		hardlinks: "reject",
		maxBytes: MAX_PROPOSAL_DRAFT_BYTES,
		symlinks: "reject"
	});
	const scanned = await walkDirectory(absoluteDir, {
		maxDepth: 8,
		maxEntries: MAX_PROPOSAL_DIRECTORY_ENTRIES,
		symlinks: "include"
	});
	if (scanned.truncated) throw new Error("Proposal directory has too many entries.");
	const supportFiles = [];
	for (const entry of scanned.entries.toSorted((a, b) => a.relativePath.localeCompare(b.relativePath))) {
		const relativePath = toPortableRelativePath(entry.relativePath);
		if (!relativePath || relativePath === "PROPOSAL.md") continue;
		if (entry.kind === "directory") continue;
		if (entry.kind !== "file") throw new Error(`Proposal support file must be a regular file: ${relativePath}`);
		const supportPath = normalizeWorkspaceSkillSupportPath(relativePath);
		if (((await fs.stat(entry.path)).mode & 73) !== 0) throw new Error(`Proposal support files must not be executable: ${relativePath}`);
		const read = await draftRoot.read(relativePath, {
			hardlinks: "reject",
			maxBytes: MAX_WORKSPACE_SKILL_SUPPORT_FILE_BYTES,
			symlinks: "reject"
		});
		supportFiles.push({
			path: supportPath,
			content: decodeProposalTextFile(read.buffer, relativePath)
		});
	}
	return {
		content: decodeProposalTextFile(proposal.buffer, "PROPOSAL.md"),
		supportFiles
	};
}
function decodeProposalTextFile(buffer, label) {
	const content = buffer.toString("utf8");
	if (!Buffer.from(content, "utf8").equals(buffer) || content.includes("\0")) throw new Error(`Proposal files must be UTF-8 text: ${label}`);
	return content;
}
function normalizeProposalOrigin(origin) {
	const agentId = normalizeOptionalString(origin?.agentId);
	const sessionKey = normalizeOptionalString(origin?.sessionKey);
	const runId = normalizeOptionalString(origin?.runId);
	const messageId = normalizeOptionalString(origin?.messageId);
	if (!agentId && !sessionKey && !runId && !messageId) return;
	return {
		...agentId ? { agentId } : {},
		...sessionKey ? { sessionKey } : {},
		...runId ? { runId } : {},
		...messageId ? { messageId } : {}
	};
}
async function inspectSkillProposal(proposalId, options = {}) {
	const read = await readSkillProposal(proposalId);
	if (!read) return null;
	if (options.workspaceDir && !isProposalInWorkspace(read.record, options.workspaceDir)) return null;
	return await hydrateProposalSupportFiles(read);
}
async function resolvePendingSkillProposal(input) {
	const proposalId = normalizeOptionalString(input.proposalId);
	if (proposalId) {
		const direct = await readRequiredProposal(proposalId, input.workspaceDir);
		if (direct.record.status !== "pending") throw new Error(`Only pending proposals can be revised. Current status: ${direct.record.status}.`);
		return direct;
	}
	const name = normalizeOptionalString(input.name);
	if (!name) throw new Error("proposal_id or name required.");
	const matches = (await listSkillProposals({ workspaceDir: input.workspaceDir })).proposals.filter((proposal) => proposal.status === "pending" && proposalMatchesName(proposal, name));
	if (matches.length === 0) throw new Error(`No pending skill proposal matched: ${name}`);
	if (matches.length > 1) {
		const candidates = matches.slice(0, 8).map((proposal) => `${proposal.id} (${proposal.skillKey})`).join(", ");
		throw new Error(`Multiple pending skill proposals matched ${name}: ${candidates}`);
	}
	const matched = await readRequiredProposal(matches[0].id, input.workspaceDir);
	if (matched.record.status !== "pending") throw new Error(`Only pending proposals can be revised. Current status: ${matched.record.status}.`);
	return matched;
}
async function proposeCreateSkill(input) {
	const name = normalizeRequired(input.name, "Skill name");
	const description = normalizeRequired(input.description, "Skill description");
	const config = resolveSkillWorkshopConfig(input.config);
	assertProposalDescriptionWithinLimit(description);
	assertProposalContentWithinLimit(input.content, config.maxSkillBytes);
	const target = resolveSkillProposalTarget({
		workspaceDir: input.workspaceDir,
		skillName: name
	});
	if (await readWorkspaceSkillFile(target.skillFile) !== null) throw new Error(`Skill already exists at ${target.skillFile}.`);
	const supportFiles = prepareSkillProposalSupportFiles(input.supportFiles);
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const proposalContent = renderProposalMarkdown({
		name: target.skillKey,
		description,
		content: input.content,
		date: now
	});
	const id = createSkillProposalId(name);
	const goal = normalizeOptionalString(input.goal);
	const evidence = normalizeOptionalString(input.evidence);
	const origin = normalizeProposalOrigin(input.origin);
	const record = {
		schema: SKILL_WORKSHOP_SCHEMA,
		id,
		kind: "create",
		status: "pending",
		title: `Create ${name}`,
		description,
		createdAt: now,
		updatedAt: now,
		createdBy: input.createdBy ?? "skill-workshop",
		...origin ? { origin } : {},
		proposedVersion: "v1",
		draftFile: "PROPOSAL.md",
		draftHash: hashSkillProposalContent(proposalContent),
		target: {
			skillName: name,
			skillKey: target.skillKey,
			skillDir: target.skillDir,
			skillFile: target.skillFile,
			source: "openclaw-workspace"
		},
		scan: scanProposalBundle(proposalContent, supportFiles),
		...supportFiles.length > 0 ? { supportFiles: await buildSupportFileMetadata(supportFiles) } : {},
		...goal ? { goal } : {},
		...evidence ? { evidence } : {}
	};
	await writeSkillProposal({
		record,
		content: proposalContent,
		supportFiles,
		beforeWrite: async (manifest) => {
			await assertCanCreatePendingProposal(input.workspaceDir, config, manifest);
		}
	});
	return {
		record,
		content: proposalContent
	};
}
/**
* Lists the workspace skills the workshop can target with update proposals, using the same
* status discovery as `proposeUpdateSkill` so callers that route corrections to existing
* skills stay in lockstep with what an update can actually write.
*/
function listWritableWorkspaceSkillSummaries(workspaceDir, opts) {
	const status = buildWorkspaceSkillStatus(workspaceDir, {
		config: opts?.config,
		agentId: opts?.agentId
	});
	const summaries = [];
	for (const skill of status.skills) {
		if (!WRITABLE_WORKSPACE_SOURCES.has(skill.source)) continue;
		summaries.push(skill.description ? {
			name: skill.skillKey,
			description: skill.description,
			filePath: skill.filePath
		} : {
			name: skill.skillKey,
			filePath: skill.filePath
		});
	}
	return summaries;
}
async function proposeUpdateSkill(input) {
	const skillName = normalizeRequired(input.skillName, "Skill name");
	const config = resolveSkillWorkshopConfig(input.config);
	const targetSkill = resolveSkillStatusEntry(buildWorkspaceSkillStatus(input.workspaceDir, {
		config: input.config,
		agentId: input.agentId
	}).skills, skillName);
	if (!targetSkill) throw new Error(`Skill not found: ${skillName}`);
	assertWritableSkillTarget(input.workspaceDir, targetSkill);
	const currentContent = await readWorkspaceSkillFile(targetSkill.filePath);
	if (currentContent === null) throw new Error(`Skill file is missing: ${targetSkill.filePath}`);
	const description = resolveUpdateProposalDescription(input.description, targetSkill.description);
	assertProposalContentWithinLimit(input.content, config.maxSkillBytes);
	const supportFiles = prepareSkillProposalSupportFiles(input.supportFiles);
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const proposalContent = renderProposalMarkdown({
		name: targetSkill.skillKey,
		description,
		content: input.content,
		fallbackFrontmatterContent: currentContent,
		date: now
	});
	const id = createSkillProposalId(targetSkill.skillKey || targetSkill.name);
	const goal = normalizeOptionalString(input.goal);
	const evidence = normalizeOptionalString(input.evidence);
	const origin = normalizeProposalOrigin(input.origin);
	const record = {
		schema: SKILL_WORKSHOP_SCHEMA,
		id,
		kind: "update",
		status: "pending",
		title: `Update ${targetSkill.name}`,
		description,
		createdAt: now,
		updatedAt: now,
		createdBy: input.createdBy ?? "skill-workshop",
		...origin ? { origin } : {},
		proposedVersion: "v1",
		draftFile: "PROPOSAL.md",
		draftHash: hashSkillProposalContent(proposalContent),
		target: {
			skillName: targetSkill.name,
			skillKey: targetSkill.skillKey,
			skillDir: targetSkill.baseDir,
			skillFile: targetSkill.filePath,
			source: targetSkill.source,
			currentContentHash: hashSkillProposalContent(currentContent)
		},
		scan: scanProposalBundle(proposalContent, supportFiles),
		...supportFiles.length > 0 ? { supportFiles: await buildSupportFileMetadata(supportFiles, targetSkill.baseDir) } : {},
		...goal ? { goal } : {},
		...evidence ? { evidence } : {}
	};
	await writeSkillProposal({
		record,
		content: proposalContent,
		supportFiles,
		beforeWrite: async (manifest) => {
			await assertCanCreatePendingProposal(input.workspaceDir, config, manifest);
		}
	});
	return {
		record,
		content: proposalContent
	};
}
async function reviseSkillProposal(input) {
	const config = resolveSkillWorkshopConfig(input.config);
	return await withPendingSkillProposalMutation(input, "revised", async (read) => {
		const { record } = read;
		assertInsideWorkspace(input.workspaceDir, record.target.skillFile, "skill file");
		assertInsideWorkspace(input.workspaceDir, record.target.skillDir, "skill directory");
		if (record.kind === "create") {
			if (await readWorkspaceSkillFile(record.target.skillFile) !== null) {
				await markProposalStale(record, "Target skill was created after proposal creation.");
				throw new Error("Target skill was created after proposal creation; proposal marked stale.");
			}
		} else {
			const currentContent = await readWorkspaceSkillFile(record.target.skillFile);
			if (currentContent === null) throw new Error(`Target skill is missing: ${record.target.skillFile}`);
			if (record.target.currentContentHash && hashSkillProposalContent(currentContent) !== record.target.currentContentHash) {
				await markProposalStale(record, "Target skill changed after proposal creation.");
				throw new Error("Target skill changed after proposal creation; proposal marked stale.");
			}
			await assertSupportTargetsUnchanged(record);
		}
		const supportFiles = input.supportFiles === void 0 ? await readProposalSupportFiles(record) : prepareSkillProposalSupportFiles(input.supportFiles);
		assertProposalContentWithinLimit(input.content, config.maxSkillBytes);
		const supportFileMetadata = supportFiles.length > 0 ? await buildSupportFileMetadata(supportFiles, record.kind === "update" ? record.target.skillDir : void 0) : [];
		const nextVersion = nextProposalVersion(record.proposedVersion);
		const description = normalizeOptionalString(input.description) ?? record.description;
		assertProposalDescriptionWithinLimit(description);
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const proposalContent = renderProposalMarkdown({
			name: record.target.skillKey,
			description,
			content: input.content,
			fallbackFrontmatterContent: read.content,
			version: nextVersion,
			date: now
		});
		const goal = input.goal === void 0 ? normalizeOptionalString(record.goal) : normalizeOptionalString(input.goal);
		const evidence = input.evidence === void 0 ? normalizeOptionalString(record.evidence) : normalizeOptionalString(input.evidence);
		const previousSupportFiles = record.supportFiles;
		const revised = {
			...record,
			description,
			updatedAt: now,
			proposedVersion: nextVersion,
			draftHash: hashSkillProposalContent(proposalContent),
			scan: scanProposalBundle(proposalContent, supportFiles)
		};
		if (supportFiles.length > 0) revised.supportFiles = supportFileMetadata;
		else delete revised.supportFiles;
		if (goal) revised.goal = goal;
		else delete revised.goal;
		if (evidence) revised.evidence = evidence;
		else delete revised.evidence;
		await replaceSkillProposalDraft({
			record: revised,
			previousSupportFiles,
			content: proposalContent,
			supportFiles
		});
		return {
			record: revised,
			content: proposalContent
		};
	});
}
async function rejectSkillProposal(input) {
	return await markProposal(input, "rejected");
}
async function quarantineSkillProposal(input) {
	return await withPendingSkillProposalMutation(input, "quarantined", async (read) => {
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const record = {
			...read.record,
			status: "quarantined",
			updatedAt: now,
			quarantinedAt: now,
			statusReason: normalizeOptionalString(input.reason),
			scan: {
				...read.record.scan,
				state: "quarantined"
			}
		};
		await updateSkillProposalRecord({ record });
		return record;
	});
}
async function applySkillProposal(input) {
	return await withPendingSkillProposalMutation(input, "applied", async (read) => {
		const { record, content } = read;
		if (hashSkillProposalContent(content) !== record.draftHash) throw new Error("Proposal draft changed without updating proposal metadata.");
		const supportFiles = await readProposalSupportFiles(record);
		if (!readProposalFrontmatter(content)) throw new Error("Proposal draft must include proposal frontmatter.");
		const scan = scanProposalBundle(content, supportFiles);
		if (scan.state !== "clean") {
			await updateSkillProposalRecord({ record: {
				...record,
				status: "quarantined",
				updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
				quarantinedAt: (/* @__PURE__ */ new Date()).toISOString(),
				scan: {
					...scan,
					state: "quarantined"
				},
				statusReason: "Proposal scan failed."
			} });
			throw new Error("Proposal scan failed; proposal was quarantined.");
		}
		assertInsideWorkspace(input.workspaceDir, record.target.skillFile, "skill file");
		assertInsideWorkspace(input.workspaceDir, record.target.skillDir, "skill directory");
		const workshopConfig = resolveSkillWorkshopConfig(input.config);
		const symlinkPolicy = {
			allowWrites: workshopConfig.allowSymlinkTargetWrites,
			allowedTargetRealPaths: workshopConfig.allowSymlinkTargetWrites ? resolveAllowedSkillSymlinkTargetRealPaths(input.config) : []
		};
		await assertWorkspaceSkillWriteTarget({
			workspaceDir: input.workspaceDir,
			filePath: record.target.skillFile,
			symlinkPolicy
		});
		const targetState = await readApplyTargetState(record, supportFiles);
		const rollback = createSkillProposalRollback({
			proposalId: record.id,
			targetSkillFile: record.target.skillFile,
			action: record.kind,
			...targetState.previousContent !== null ? { previousContent: targetState.previousContent } : {},
			...targetState.previousSupportFiles.length > 0 ? { supportFiles: targetState.previousSupportFiles } : {}
		});
		await writeSkillProposalRollback({
			proposalId: record.id,
			rollback
		});
		const skillContent = stripProposalFrontmatterForSkill(content);
		await writeWorkspaceSkill({
			workspaceDir: input.workspaceDir,
			skillDir: record.target.skillDir,
			skillFile: record.target.skillFile,
			content: skillContent,
			supportFiles,
			mode: record.kind,
			symlinkPolicy
		});
		bumpSkillsSnapshotVersion({
			workspaceDir: input.workspaceDir,
			reason: "workshop",
			changedPath: record.target.skillFile
		});
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const applied = {
			...record,
			status: "applied",
			updatedAt: now,
			appliedAt: now,
			scan
		};
		await updateSkillProposalRecord({ record: applied });
		await refreshSkillProposalManifest();
		return {
			record: applied,
			targetSkillFile: record.target.skillFile
		};
	});
}
async function readApplyTargetState(record, supportFiles) {
	const previousContent = await readWorkspaceSkillFile(record.target.skillFile);
	if (record.kind === "create" && previousContent !== null) throw new Error(`Target skill already exists: ${record.target.skillFile}`);
	const previousSupportFiles = [];
	for (const file of supportFiles) {
		const supportRecord = record.supportFiles?.find((entry) => entry.path === file.path);
		const previousSupportContent = await readWorkspaceSupportFile({
			skillDir: record.target.skillDir,
			relativePath: file.path
		});
		if (record.kind === "create" && previousSupportContent !== null) throw new Error(`Target support file already exists: ${path.join(record.target.skillDir, file.path)}`);
		if (record.kind === "update" && supportRecord) await assertSupportTargetUnchanged({
			record,
			file: supportRecord,
			currentContent: previousSupportContent
		});
		previousSupportFiles.push(previousSupportContent === null ? {
			path: file.path,
			existed: false
		} : {
			path: file.path,
			existed: true,
			previousContent: previousSupportContent,
			previousContentHash: hashSkillProposalContent(previousSupportContent)
		});
	}
	if (record.kind === "update") {
		if (previousContent === null) throw new Error(`Target skill is missing: ${record.target.skillFile}`);
		if (record.target.currentContentHash && hashSkillProposalContent(previousContent) !== record.target.currentContentHash) {
			await updateSkillProposalRecord({ record: {
				...record,
				status: "stale",
				updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
				staleAt: (/* @__PURE__ */ new Date()).toISOString(),
				statusReason: "Target skill changed after proposal creation."
			} });
			throw new Error("Target skill changed after proposal creation; proposal marked stale.");
		}
	}
	return {
		previousContent,
		previousSupportFiles
	};
}
function scanProposalBundle(content, supportFiles = []) {
	const scannedAt = (/* @__PURE__ */ new Date()).toISOString();
	const findings = [
		...scanSkillContent(content, "PROPOSAL.md"),
		...scanSource(content, "PROPOSAL.md"),
		...supportFiles.flatMap((file) => [...scanSkillContent(file.content, file.path), ...scanSource(file.content, file.path)])
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
async function assertCanCreatePendingProposal(workspaceDir, config, manifest) {
	if (!manifest) {
		const proposals = (await listSkillProposals({ workspaceDir })).proposals;
		assertPendingProposalCountWithinLimit(proposals.filter((entry) => entry.status === "pending" || entry.status === "quarantined").length, config);
		return;
	}
	let activeProposalCount = 0;
	for (const entry of manifest.proposals) {
		if (entry.status !== "pending" && entry.status !== "quarantined") continue;
		const record = await readSkillProposalRecord(entry.id);
		if (record && isProposalInWorkspace(record, workspaceDir)) activeProposalCount += 1;
	}
	assertPendingProposalCountWithinLimit(activeProposalCount, config);
}
function assertPendingProposalCountWithinLimit(activeProposalCount, config) {
	if (activeProposalCount >= config.maxPending) throw new Error(`Skill Workshop pending proposal limit reached (${config.maxPending}).`);
}
function assertProposalDescriptionWithinLimit(description) {
	const sizeBytes = Buffer.byteLength(description, "utf8");
	if (sizeBytes > MAX_SKILL_PROPOSAL_DESCRIPTION_BYTES) throw new Error(`Skill proposal description is too large (${sizeBytes} bytes, max ${MAX_SKILL_PROPOSAL_DESCRIPTION_BYTES}).`);
}
function resolveUpdateProposalDescription(inputDescription, currentDescription) {
	const supplied = normalizeOptionalString(inputDescription);
	if (supplied) {
		assertProposalDescriptionWithinLimit(supplied);
		return supplied;
	}
	return truncateUtf8(currentDescription.trim(), MAX_SKILL_PROPOSAL_DESCRIPTION_BYTES);
}
function truncateUtf8(value, maxBytes) {
	let out = "";
	let sizeBytes = 0;
	for (const char of value) {
		const charBytes = Buffer.byteLength(char, "utf8");
		if (sizeBytes + charBytes > maxBytes) break;
		out += char;
		sizeBytes += charBytes;
	}
	return out.trimEnd();
}
function assertProposalContentWithinLimit(content, maxSkillBytes) {
	const sizeBytes = Buffer.byteLength(content, "utf8");
	if (sizeBytes > maxSkillBytes) throw new Error(`Skill proposal content is too large (${sizeBytes} bytes, max ${maxSkillBytes}).`);
}
async function buildSupportFileMetadata(files, targetSkillDir) {
	const out = [];
	for (const file of files) {
		const metadata = {
			path: file.path,
			sizeBytes: file.sizeBytes,
			hash: file.hash
		};
		if (targetSkillDir) {
			const targetContent = await readWorkspaceSupportFile({
				skillDir: targetSkillDir,
				relativePath: file.path
			});
			metadata.targetExisted = targetContent !== null;
			if (targetContent !== null) metadata.targetContentHash = hashSkillProposalContent(targetContent);
		}
		out.push(metadata);
	}
	return out;
}
function nextProposalVersion(version) {
	const match = /^v(\d+)$/.exec(version.trim());
	if (!match) return "v2";
	const current = Number.parseInt(match[1] ?? "1", 10);
	return `v${Number.isSafeInteger(current) && current > 0 ? current + 1 : 2}`;
}
async function markProposal(input, status) {
	return await withPendingSkillProposalMutation(input, status, async (read) => {
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const record = {
			...read.record,
			status,
			updatedAt: now,
			rejectedAt: now,
			statusReason: normalizeOptionalString(input.reason)
		};
		await updateSkillProposalRecord({ record });
		return record;
	});
}
async function withPendingSkillProposalMutation(input, action, fn) {
	return await withSkillProposalTargetLock((await readRequiredProposal(input.proposalId, input.workspaceDir)).record, async () => {
		const read = await readRequiredProposal(input.proposalId, input.workspaceDir);
		if (read.record.status !== "pending") throw new Error(`Only pending proposals can be ${action}. Current status: ${read.record.status}.`);
		return await fn(read);
	});
}
async function assertSupportTargetUnchanged(params) {
	const { record, file, currentContent } = params;
	if (file.targetExisted === false && currentContent !== null) {
		await markProposalStale(record, `Target support file changed after proposal creation: ${file.path}`);
		throw new Error("Target support file changed after proposal creation; proposal marked stale.");
	}
	if (file.targetExisted === true) {
		if ((currentContent === null ? void 0 : hashSkillProposalContent(currentContent)) !== file.targetContentHash) {
			await markProposalStale(record, `Target support file changed after proposal creation: ${file.path}`);
			throw new Error("Target support file changed after proposal creation; proposal marked stale.");
		}
	}
}
async function assertSupportTargetsUnchanged(record) {
	if (record.kind !== "update" || !record.supportFiles) return;
	for (const file of record.supportFiles) {
		if (file.targetExisted === void 0) continue;
		await assertSupportTargetUnchanged({
			record,
			file,
			currentContent: await readWorkspaceSupportFile({
				skillDir: record.target.skillDir,
				relativePath: file.path
			})
		});
	}
}
async function readRequiredProposal(proposalId, workspaceDir) {
	const read = await readSkillProposal(proposalId);
	if (!read || workspaceDir && !isProposalInWorkspace(read.record, workspaceDir)) throw new Error(`Skill proposal not found: ${proposalId}`);
	return read;
}
async function hydrateProposalSupportFiles(read) {
	const supportFiles = await readProposalSupportFiles(read.record);
	if (supportFiles.length === 0) return read;
	return {
		...read,
		supportFiles: supportFiles.map((file) => ({
			path: file.path,
			content: file.content
		}))
	};
}
function isProposalInWorkspace(record, workspaceDir) {
	try {
		assertInsideWorkspace(workspaceDir, record.target.skillFile, "skill file");
		assertInsideWorkspace(workspaceDir, record.target.skillDir, "skill directory");
		return true;
	} catch {
		return false;
	}
}
async function markProposalStale(record, reason) {
	await updateSkillProposalRecord({ record: {
		...record,
		status: "stale",
		updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		staleAt: (/* @__PURE__ */ new Date()).toISOString(),
		statusReason: reason
	} });
}
function proposalMatchesName(proposal, name) {
	const normalizedName = normalizeSkillIndexName(name);
	return [
		proposal.id,
		proposal.skillName,
		proposal.skillKey,
		proposal.title,
		proposal.description
	].some((candidate) => {
		if (!candidate) return false;
		if (candidate === name || candidate.toLowerCase() === name.toLowerCase()) return true;
		const normalizedCandidate = normalizeSkillIndexName(candidate);
		return Boolean(normalizedName) && Boolean(normalizedCandidate) && (normalizedCandidate === normalizedName || normalizedCandidate.includes(normalizedName) || normalizedName.includes(normalizedCandidate));
	});
}
function assertWritableSkillTarget(workspaceDir, skill) {
	if (!WRITABLE_WORKSPACE_SOURCES.has(skill.source)) throw new Error(`Skill source is not writable by Skill Workshop: ${skill.source}`);
	assertInsideWorkspace(workspaceDir, skill.filePath, "skill file");
	assertInsideWorkspace(workspaceDir, skill.baseDir, "skill directory");
	if (path.basename(skill.filePath) !== "SKILL.md") throw new Error("Skill Workshop can only update SKILL.md targets.");
}
function normalizeRequired(value, label) {
	const normalized = normalizeOptionalString(value);
	if (!normalized) throw new Error(`${label} is required.`);
	return normalized;
}
function toPortableRelativePath(relativePath) {
	return relativePath.split(path.sep).join("/");
}
//#endregion
export { proposeCreateSkill as a, readSkillProposalDraftDirectory as c, resolvePendingSkillProposal as d, reviseSkillProposal as f, listWritableWorkspaceSkillSummaries as i, readSkillProposalDraftFile as l, inspectSkillProposal as n, proposeUpdateSkill as o, stripProposalFrontmatterForSkill as p, listSkillProposals as r, quarantineSkillProposal as s, applySkillProposal as t, rejectSkillProposal as u };
