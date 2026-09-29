import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { T as statRegularFile, d as pathExists } from "./fs-safe-BAPek8At.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as sha256Hex } from "./node-crypto-Df3MIs6V.mjs";
import "./crypto-digest-D9Nqq3c7.mjs";
import { r as replaceFileAtomicSync } from "./replace-file-DJtj9VLX.mjs";
import { c as readJsonIfExists, h as writeJson, i as readJson, p as tryReadJson, t as JsonFileReadError } from "./json-files-C0HSMh2Z.mjs";
import { i as getAgentWorkspaceAccess, t as WorkspaceAccessUnavailableError } from "./workspace-access-BNUXOhfF.mjs";
import { r as CLAWHUB_SKILLS_SH_TRUST_STATE, t as CLAWHUB_SKILLS_SH_REF_PREFIX } from "./clawhub-skills-DTZJRHzC.mjs";
import { n as resolveWorkspaceSkillInstallDir, r as validateRequestedSkillSlug, t as normalizeTrackedSkillSlug } from "./install-paths-DBBNLgEr.mjs";
import { n as digestClawHubSkillTree } from "./skill-tree-digest-DQM6dl_F.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region src/skills/lifecycle/clawhub-store.ts
const DOT_DIR = ".clawhub";
const LEGACY_DOT_DIR = ".clawdhub";
const CLAWHUB_OWNER_HANDLE_PATTERN = /^[a-z0-9](?:[a-z0-9._-]{0,38}[a-z0-9])?$/;
const GITHUB_OWNER_PATTERN = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/;
const GITHUB_REPO_PATTERN = /^[A-Za-z0-9._-]{1,100}$/;
function metadataPaths(rootDir, filename) {
	return [path.join(rootDir, DOT_DIR, filename), path.join(rootDir, LEGACY_DOT_DIR, filename)];
}
function normalizeClawHubOwnerHandle(raw) {
	const ownerHandle = raw.trim().toLowerCase();
	if (!CLAWHUB_OWNER_HANDLE_PATTERN.test(ownerHandle)) throw new Error(`Invalid ClawHub owner handle: ${raw}`);
	return ownerHandle;
}
function parseRequestedClawHubSkillRef(raw) {
	const value = raw.trim();
	if (value.startsWith("skills-sh/")) throw new Error(`Invalid skills.sh skill reference: ${raw}`);
	if (value.startsWith("skills-sh:")) {
		const parts = value.slice(CLAWHUB_SKILLS_SH_REF_PREFIX.length).split("/");
		if (parts.length !== 3) throw new Error(`Invalid skills.sh skill reference: ${raw}`);
		const [owner, repo, slug] = parts;
		if (!owner || !repo || !slug || !GITHUB_OWNER_PATTERN.test(owner) || !GITHUB_REPO_PATTERN.test(repo) || repo === "." || repo === "..") throw new Error(`Invalid skills.sh skill reference: ${raw}`);
		return {
			slug: validateRequestedSkillSlug(slug),
			requestedReference: value,
			trustState: CLAWHUB_SKILLS_SH_TRUST_STATE
		};
	}
	if (!value.startsWith("@")) return { slug: validateRequestedSkillSlug(value) };
	const parts = value.slice(1).split("/");
	if (parts.length !== 2) throw new Error(`Invalid ClawHub skill reference: ${raw}`);
	const [owner, slug] = parts;
	if (!owner || !slug) throw new Error(`Invalid ClawHub skill reference: ${raw}`);
	return {
		ownerHandle: normalizeClawHubOwnerHandle(owner),
		slug: validateRequestedSkillSlug(slug)
	};
}
function formatClawHubSkillRef(ref) {
	return ref.ownerHandle ? `@${ref.ownerHandle}/${ref.slug}` : ref.slug;
}
function normalizeStoredRegistry(registry) {
	const trimmed = registry.trim();
	return trimmed.replace(/\/+$/, "") || trimmed;
}
function normalizeGitHubCommitSegment(raw) {
	const commit = normalizeOptionalString(raw);
	return commit && /^[0-9a-f]{40}$/i.test(commit) ? commit : void 0;
}
function isNonEmptyString(value) {
	return typeof value === "string" && value.trim().length > 0;
}
function normalizeDownloadedArtifactLock(raw) {
	if (!raw || typeof raw !== "object") return;
	const candidate = raw;
	if ((candidate.kind === "archive" || candidate.kind === "clawpack") && isNonEmptyString(candidate.sha256) && isNonEmptyString(candidate.integrity)) return {
		kind: candidate.kind,
		sha256: candidate.sha256,
		integrity: candidate.integrity
	};
}
function normalizeSkillFileLock(raw) {
	if (!raw || typeof raw !== "object") return;
	const candidate = raw;
	return isNonEmptyString(candidate.path) && isNonEmptyString(candidate.sha256) ? {
		path: candidate.path,
		sha256: candidate.sha256
	} : void 0;
}
function normalizeClawHubSkillOrigin(raw) {
	if (raw?.version !== 1 || !isNonEmptyString(raw.registry) || !isNonEmptyString(raw.slug) || !isNonEmptyString(raw.installedVersion) || typeof raw.installedAt !== "number") return null;
	const sourceUrl = normalizeOptionalString(raw.sourceUrl);
	const ownerHandleRaw = normalizeOptionalString(raw.ownerHandle);
	let ownerHandle;
	if (ownerHandleRaw) try {
		ownerHandle = normalizeClawHubOwnerHandle(ownerHandleRaw);
	} catch {
		return null;
	}
	const requestedReferenceRaw = normalizeOptionalString(raw.requestedReference);
	let requestedReference;
	let trustState;
	if (requestedReferenceRaw) try {
		const parsed = parseRequestedClawHubSkillRef(requestedReferenceRaw);
		if (!parsed.requestedReference || parsed.slug !== raw.slug) return null;
		requestedReference = parsed.requestedReference;
		if (normalizeOptionalString(raw.trustState) !== "not-scanned-by-clawhub") return null;
		trustState = CLAWHUB_SKILLS_SH_TRUST_STATE;
	} catch {
		return null;
	}
	else if (raw.trustState !== void 0) return null;
	const artifact = normalizeDownloadedArtifactLock(raw.artifact);
	const skillFile = normalizeSkillFileLock(raw.skillFile);
	const fileTreeSha256 = normalizeOptionalString(raw.fileTreeSha256);
	return {
		version: 1,
		registry: normalizeStoredRegistry(raw.registry),
		slug: raw.slug,
		...ownerHandle ? { ownerHandle } : {},
		...requestedReference ? { requestedReference } : {},
		...trustState ? { trustState } : {},
		installedVersion: raw.installedVersion,
		installedAt: raw.installedAt,
		...sourceUrl ? { sourceUrl } : {},
		...artifact ? { artifact } : {},
		...skillFile ? { skillFile } : {},
		...fileTreeSha256 ? { fileTreeSha256 } : {}
	};
}
function parseClawHubSkillsLockfile(raw) {
	if (raw?.version !== 1 || !raw.skills || typeof raw.skills !== "object") throw new Error("expected version 1 lockfile with skills");
	return {
		version: 1,
		skills: raw.skills
	};
}
async function readClawHubSkillsLockfile(workspaceDir) {
	for (const candidate of metadataPaths(workspaceDir, "lock.json")) try {
		if ((await statRegularFile(candidate).catch(() => void 0))?.missing) continue;
		return parseClawHubSkillsLockfile(await readJson(candidate));
	} catch (err) {
		if (err instanceof JsonFileReadError && hasErrnoCode(err.cause, "ENOENT")) continue;
		throw new Error(`Malformed workspace ClawHub lockfile at ${candidate}: ${formatErrorMessage(err)}. Repair or restore it before retrying.`, { cause: err });
	}
	return {
		version: 1,
		skills: {}
	};
}
async function writeClawHubSkillsLockfile(workspaceDir, lockfile) {
	await writeJson(path.join(workspaceDir, DOT_DIR, "lock.json"), lockfile, { trailingNewline: true });
}
function readJsonIfExistsSync(candidate) {
	try {
		return {
			exists: true,
			value: JSON.parse(fs.readFileSync(candidate, "utf8"))
		};
	} catch (err) {
		if (err && typeof err === "object" && "code" in err && err.code === "ENOENT") return { exists: false };
		throw err;
	}
}
function readClawHubSkillsLockfileStatusSync(workspaceDir) {
	for (const candidate of metadataPaths(workspaceDir, "lock.json")) try {
		const read = readJsonIfExistsSync(candidate);
		if (!read.exists) continue;
		return {
			kind: "found",
			path: candidate,
			lock: parseClawHubSkillsLockfile(read.value)
		};
	} catch (err) {
		return {
			kind: "malformed",
			path: candidate,
			error: formatErrorMessage(err)
		};
	}
	return { kind: "missing" };
}
function originResult(raw, candidate) {
	const origin = normalizeClawHubSkillOrigin(raw);
	return origin ? {
		kind: "found",
		origin,
		path: candidate
	} : {
		kind: "malformed",
		path: candidate,
		error: "expected version 1 origin with registry, slug, installedVersion, and installedAt"
	};
}
async function readClawHubSkillOrigin(skillDir) {
	for (const candidate of metadataPaths(skillDir, "origin.json")) try {
		const origin = normalizeClawHubSkillOrigin(await tryReadJson(candidate));
		if (origin) return origin;
	} catch {}
	return null;
}
function readClawHubSkillOriginStatusSync(skillDir) {
	for (const candidate of metadataPaths(skillDir, "origin.json")) try {
		const read = readJsonIfExistsSync(candidate);
		if (read.exists) return originResult(read.value, candidate);
	} catch (err) {
		return {
			kind: "malformed",
			path: candidate,
			error: formatErrorMessage(err)
		};
	}
	return { kind: "missing" };
}
async function readClawHubSkillOriginStrict(skillDir) {
	for (const candidate of metadataPaths(skillDir, "origin.json")) try {
		const raw = await readJsonIfExists(candidate);
		if (raw) return originResult(raw, candidate);
	} catch (err) {
		return {
			kind: "malformed",
			path: candidate,
			error: formatErrorMessage(err)
		};
	}
	return { kind: "missing" };
}
async function writeClawHubSkillOrigin(skillDir, origin) {
	await writeJson(path.join(skillDir, DOT_DIR, "origin.json"), origin, { trailingNewline: true });
}
async function readInstalledSkillFileLock(skillDir) {
	const { CLAWHUB_SKILL_ARCHIVE_ROOT_MARKERS } = await import("./archive-install-BBXUzC-w.mjs");
	for (const marker of CLAWHUB_SKILL_ARCHIVE_ROOT_MARKERS) try {
		return {
			path: marker,
			sha256: sha256Hex(await fs$1.readFile(path.join(skillDir, marker)))
		};
	} catch {
		continue;
	}
}
/** Finalize native tracking beside the installed files, preserving other tracked skills. */
async function recordClawHubSkillInstall(params) {
	const { origin, verification } = params;
	await writeClawHubSkillOrigin(params.skillDir, origin);
	const lock = await readClawHubSkillsLockfile(params.workspaceDir);
	lock.skills[origin.slug] = {
		version: origin.installedVersion,
		registry: origin.registry,
		installedAt: origin.installedAt,
		...origin.ownerHandle ? { ownerHandle: origin.ownerHandle } : {},
		...origin.requestedReference ? { requestedReference: origin.requestedReference } : {},
		...origin.trustState ? { trustState: origin.trustState } : {},
		...origin.sourceUrl ? { sourceUrl: origin.sourceUrl } : {},
		...origin.artifact ? { artifact: origin.artifact } : {},
		...origin.skillFile ? { skillFile: origin.skillFile } : {},
		...origin.fileTreeSha256 ? { fileTreeSha256: origin.fileTreeSha256 } : {},
		...verification ? { verification } : {}
	};
	await writeClawHubSkillsLockfile(params.workspaceDir, lock);
}
async function readTrackedClawHubSkillSlugs(workspaceDir) {
	const workspaceAccess = getAgentWorkspaceAccess(workspaceDir, "loadSkills");
	const access = workspaceAccess?.loadSkills ? workspaceAccess : void 0;
	if (access && !access.clawHubSkills) throw new WorkspaceAccessUnavailableError("Remote workspace ClawHub tracking is unavailable");
	const lock = await (access?.clawHubSkills?.readClawHubSkillsLockfile ?? readClawHubSkillsLockfile)(workspaceDir);
	return Object.keys(lock.skills).toSorted();
}
async function untrackClawHubSkill(workspaceDir, slug, beforePersistentApply, beforeRollback = beforePersistentApply, authorizeMutation) {
	const trackedSlug = normalizeTrackedSkillSlug(slug);
	if (authorizeMutation) await authorizeMutation("apply");
	const lock = await readClawHubSkillsLockfile(workspaceDir);
	const previous = lock.skills[trackedSlug];
	if (!previous) return async () => void 0;
	const writeLock = (value, assertCurrent = beforePersistentApply) => {
		assertCurrent?.();
		return replaceFileAtomicSync({
			filePath: path.join(workspaceDir, DOT_DIR, "lock.json"),
			content: `${JSON.stringify(value, null, 2)}\n`,
			mode: 384,
			dirMode: 511 & ~process.umask(),
			copyFallbackOnPermissionError: true,
			syncTempFile: true,
			syncParentDir: true,
			beforeRename: assertCurrent
		});
	};
	delete lock.skills[trackedSlug];
	writeLock(lock);
	return async () => {
		if (authorizeMutation) await authorizeMutation("rollback");
		const current = await readClawHubSkillsLockfile(workspaceDir);
		if (current.skills[trackedSlug]) throw new Error(`Skill ${JSON.stringify(trackedSlug)} was retracked during rollback.`);
		current.skills[trackedSlug] = previous;
		writeLock(current, beforeRollback);
	};
}
/** Check the native target and tracking before acquiring an archive. */
async function assertClawHubSkillInstallState(params) {
	const targetDir = resolveWorkspaceSkillInstallDir(params.workspaceDir, params.slug);
	if (!params.force && await pathExists(targetDir)) throw new Error(`Skill already exists at ${targetDir}. Re-run with force/update.`);
	await readClawHubSkillsLockfile(params.workspaceDir);
}
async function readInstalledClawHubSkillFiles(params) {
	const fileTreeSha256 = await digestClawHubSkillTree(params.skillDir);
	const skillFile = await readInstalledSkillFileLock(params.skillDir);
	return {
		fileTreeSha256,
		...skillFile ? { skillFile } : {}
	};
}
//#endregion
export { normalizeSkillFileLock as a, readClawHubSkillOrigin as c, readClawHubSkillsLockfile as d, readClawHubSkillsLockfileStatusSync as f, untrackClawHubSkill as g, recordClawHubSkillInstall as h, normalizeGitHubCommitSegment as i, readClawHubSkillOriginStatusSync as l, readTrackedClawHubSkillSlugs as m, formatClawHubSkillRef as n, normalizeStoredRegistry as o, readInstalledClawHubSkillFiles as p, normalizeDownloadedArtifactLock as r, parseRequestedClawHubSkillRef as s, assertClawHubSkillInstallState as t, readClawHubSkillOriginStrict as u };
