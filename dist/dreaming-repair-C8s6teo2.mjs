import { i as extractErrorCode } from "./error-coercion-CvJK4lmH.mjs";
import "./error-runtime-BmospGvZ.mjs";
import { c as readWorkspaceText, i as listWorkspaceDirectory, l as renameWorkspacePath, o as makeWorkspaceDirectory, r as inspectWorkspaceFile, t as accessWorkspacePath } from "./memory-workspace-files-DDGPpIfb.mjs";
import { d as clearMemoryCoreWorkspaceNamespace, i as DREAMING_SESSION_INGESTION_SEEN_NAMESPACE, r as DREAMING_SESSION_INGESTION_FILES_NAMESPACE, v as readMemoryCoreWorkspaceEntries } from "./dreaming-state-BHlTqX1G.mjs";
import path from "node:path";
import { randomUUID } from "node:crypto";
//#region extensions/memory-core/src/dreaming-repair.ts
const DREAMS_FILENAMES = ["DREAMS.md", "dreams.md"];
const SESSION_CORPUS_RELATIVE_DIR = path.join("memory", ".dreams", "session-corpus");
const SESSION_INGESTION_RELATIVE_PATH = path.join("memory", ".dreams", "session-ingestion.json");
const REPAIR_ARCHIVE_RELATIVE_DIR = path.join(".openclaw-repair", "dreaming");
const DREAMING_NARRATIVE_RUN_PREFIX = "dreaming-narrative-";
const DREAMING_NARRATIVE_PROMPT_PREFIX = "Write a dream diary entry from these memory fragments";
const SESSION_INGESTION_NAMESPACES = [DREAMING_SESSION_INGESTION_FILES_NAMESPACE, DREAMING_SESSION_INGESTION_SEEN_NAMESPACE];
function requireAbsoluteWorkspaceDir(rawWorkspaceDir) {
	const trimmed = rawWorkspaceDir.trim();
	if (!trimmed) throw new Error("workspaceDir is required");
	if (!path.isAbsolute(trimmed)) throw new Error("workspaceDir must be an absolute path");
	return path.resolve(trimmed);
}
async function resolveExistingDreamsPath(workspaceDir) {
	for (const fileName of DREAMS_FILENAMES) {
		const candidate = path.join(workspaceDir, fileName);
		try {
			await accessWorkspacePath(workspaceDir, candidate);
			return candidate;
		} catch (err) {
			if (extractErrorCode(err) !== "ENOENT") throw err;
		}
	}
}
async function listSessionCorpusFiles(workspaceDir, sessionCorpusDir) {
	return (await listWorkspaceDirectory(workspaceDir, sessionCorpusDir)).filter((entry) => entry.isFile() && entry.name.endsWith(".txt")).map((entry) => path.join(sessionCorpusDir, entry.name)).toSorted();
}
function isSuspiciousSessionCorpusLine(line) {
	return line.includes(DREAMING_NARRATIVE_PROMPT_PREFIX) && line.includes(DREAMING_NARRATIVE_RUN_PREFIX);
}
async function ensureArchivablePath(workspaceDir, targetPath) {
	const stat = await inspectWorkspaceFile(workspaceDir, targetPath, false).catch((err) => {
		if (extractErrorCode(err) === "ENOENT") return null;
		throw err;
	});
	if (!stat) return false;
	if (stat.isSymbolicLink()) throw new Error(`Refusing to archive symlinked path: ${targetPath}`);
	if (stat.isDirectory() || stat.isFile()) return true;
	throw new Error(`Refusing to archive non-file artifact: ${targetPath}`);
}
async function auditDreamingArtifacts(params) {
	const workspaceDir = requireAbsoluteWorkspaceDir(params.workspaceDir);
	const dreamsPath = await resolveExistingDreamsPath(workspaceDir);
	const sessionCorpusDir = path.join(workspaceDir, SESSION_CORPUS_RELATIVE_DIR);
	const sessionIngestionPath = path.join(workspaceDir, SESSION_INGESTION_RELATIVE_PATH);
	const issues = [];
	let sessionCorpusFileCount = 0;
	let suspiciousSessionCorpusFileCount = 0;
	let suspiciousSessionCorpusLineCount = 0;
	let sessionIngestionExists = false;
	if (dreamsPath) try {
		await accessWorkspacePath(workspaceDir, dreamsPath);
	} catch (err) {
		issues.push({
			severity: "error",
			code: "dreaming-diary-unreadable",
			message: `Dream diary could not be inspected: ${extractErrorCode(err) ?? "error"}.`,
			fixable: false
		});
	}
	try {
		const corpusFiles = await listSessionCorpusFiles(workspaceDir, sessionCorpusDir);
		sessionCorpusFileCount = corpusFiles.length;
		for (const corpusFile of corpusFiles) {
			const suspiciousLines = (await readWorkspaceText(workspaceDir, corpusFile)).split(/\r?\n/).map((line) => line.trim()).filter((line) => line.length > 0 && isSuspiciousSessionCorpusLine(line));
			if (suspiciousLines.length > 0) {
				suspiciousSessionCorpusFileCount += 1;
				suspiciousSessionCorpusLineCount += suspiciousLines.length;
			}
		}
	} catch (err) {
		if (extractErrorCode(err) !== "ENOENT") issues.push({
			severity: "error",
			code: "dreaming-session-corpus-unreadable",
			message: `Dreaming session corpus could not be inspected: ${extractErrorCode(err) ?? "error"}.`,
			fixable: false
		});
	}
	try {
		await accessWorkspacePath(workspaceDir, sessionIngestionPath);
		sessionIngestionExists = true;
	} catch (err) {
		if (extractErrorCode(err) !== "ENOENT") issues.push({
			severity: "error",
			code: "dreaming-session-ingestion-unreadable",
			message: `Dreaming session-ingestion state could not be inspected: ${extractErrorCode(err) ?? "error"}.`,
			fixable: false
		});
	}
	if (!sessionIngestionExists) try {
		for (const namespace of SESSION_INGESTION_NAMESPACES) if ((await readMemoryCoreWorkspaceEntries({
			namespace,
			workspaceDir
		})).length > 0) {
			sessionIngestionExists = true;
			break;
		}
	} catch {}
	if (suspiciousSessionCorpusLineCount > 0) issues.push({
		severity: "warn",
		code: "dreaming-session-corpus-self-ingested",
		message: `Dreaming session corpus appears to contain self-ingested narrative content (${suspiciousSessionCorpusLineCount} suspicious line${suspiciousSessionCorpusLineCount === 1 ? "" : "s"}).`,
		fixable: true
	});
	return {
		...dreamsPath ? { dreamsPath } : {},
		sessionCorpusDir,
		sessionCorpusFileCount,
		suspiciousSessionCorpusFileCount,
		suspiciousSessionCorpusLineCount,
		sessionIngestionPath,
		sessionIngestionExists,
		issues
	};
}
async function repairDreamingArtifacts(params) {
	const workspaceDir = requireAbsoluteWorkspaceDir(params.workspaceDir);
	const warnings = [];
	const archivedPaths = [];
	let archiveDir;
	let archivedDreamsDiary = false;
	const archivePathIfPresent = async (targetPath) => {
		try {
			archiveDir ??= path.join(workspaceDir, REPAIR_ARCHIVE_RELATIVE_DIR, (params.now ?? /* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-"));
			if (!await ensureArchivablePath(workspaceDir, targetPath)) return false;
			await makeWorkspaceDirectory(workspaceDir, archiveDir);
			const destination = path.join(archiveDir, `${path.basename(targetPath)}.${randomUUID()}`);
			await renameWorkspacePath(workspaceDir, targetPath, destination);
			archivedPaths.push(destination);
			return true;
		} catch (err) {
			warnings.push(err instanceof Error ? err.message : String(err));
			return false;
		}
	};
	const archivedSessionCorpus = await archivePathIfPresent(path.join(workspaceDir, SESSION_CORPUS_RELATIVE_DIR));
	const archivedSessionIngestion = await archivePathIfPresent(path.join(workspaceDir, SESSION_INGESTION_RELATIVE_PATH));
	if (archivedSessionCorpus || archivedSessionIngestion) try {
		await Promise.all(SESSION_INGESTION_NAMESPACES.map((namespace) => clearMemoryCoreWorkspaceNamespace({
			namespace,
			workspaceDir
		})));
	} catch (err) {
		warnings.push(`Failed clearing dreaming session-ingestion SQLite state: ${err instanceof Error ? err.message : String(err)}`);
	}
	if (params.archiveDiary) {
		const dreamsPath = await resolveExistingDreamsPath(workspaceDir);
		if (dreamsPath) archivedDreamsDiary = await archivePathIfPresent(dreamsPath);
	}
	return {
		changed: archivedDreamsDiary || archivedSessionCorpus || archivedSessionIngestion,
		...archiveDir ? { archiveDir } : {},
		archivedDreamsDiary,
		archivedSessionCorpus,
		archivedSessionIngestion,
		archivedPaths,
		warnings
	};
}
//#endregion
export { repairDreamingArtifacts as n, auditDreamingArtifacts as t };
