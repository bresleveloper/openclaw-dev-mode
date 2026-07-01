import { Y as resolveMemoryDreamingWorkspaces } from "../../dreaming-DFdUxl07.js";
import "../../memory-core-host-status-BIxXfkMp.js";
import { _ as writeMemoryCoreWorkspaceEntry, c as SHORT_TERM_RECALL_NAMESPACE, g as writeMemoryCoreWorkspaceEntries, h as readMemoryCoreWorkspaceEntries, n as DREAMING_SESSION_INGESTION_FILES_NAMESPACE, o as SHORT_TERM_META_NAMESPACE, r as DREAMING_SESSION_INGESTION_SEEN_NAMESPACE, s as SHORT_TERM_PHASE_SIGNAL_NAMESPACE, t as DREAMING_DAILY_INGESTION_NAMESPACE, u as configureMemoryCoreDreamingState } from "../../dreaming-state-DWd_V39L.js";
import { a as SHORT_TERM_STORE_RELATIVE_PATH, d as normalizeShortTermPhaseSignalStore, f as normalizeShortTermRecallStore, i as SHORT_TERM_PHASE_SIGNAL_RELATIVE_PATH } from "../../short-term-promotion-B-Lvx_wV.js";
import { a as normalizeSessionIngestionState, i as normalizeDailyIngestionState, n as SESSION_INGESTION_STATE_RELATIVE_PATH, t as DAILY_INGESTION_STATE_RELATIVE_PATH } from "../../dreaming-phases-BS24nTNu.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/memory-core/doctor-contract-api.ts
function resolveConfiguredWorkspaces(config, env) {
	return resolveMemoryDreamingWorkspaces(config, { env }).map((entry) => entry.workspaceDir);
}
async function fileExists(filePath) {
	try {
		return (await fs.stat(filePath)).isFile();
	} catch {
		return false;
	}
}
async function readJsonFile(filePath) {
	return JSON.parse(await fs.readFile(filePath, "utf8"));
}
async function archiveLegacySource(params) {
	const archivedPath = `${params.filePath}.migrated`;
	if (await fileExists(archivedPath)) {
		params.warnings.push(`Left migrated Memory Core ${params.label} source in place because ${archivedPath} already exists`);
		return;
	}
	try {
		await fs.rename(params.filePath, archivedPath);
		params.changes.push(`Archived Memory Core ${params.label} legacy source -> ${archivedPath}`);
	} catch (err) {
		params.warnings.push(`Failed archiving Memory Core ${params.label} legacy source: ${String(err)}`);
	}
}
async function collectLegacySources(config, env) {
	const sources = [];
	for (const workspaceDir of resolveConfiguredWorkspaces(config, env)) {
		const candidates = [
			{
				label: "daily ingestion",
				relativePath: DAILY_INGESTION_STATE_RELATIVE_PATH
			},
			{
				label: "session ingestion",
				relativePath: SESSION_INGESTION_STATE_RELATIVE_PATH
			},
			{
				label: "short-term recall",
				relativePath: SHORT_TERM_STORE_RELATIVE_PATH
			},
			{
				label: "phase signals",
				relativePath: SHORT_TERM_PHASE_SIGNAL_RELATIVE_PATH
			}
		];
		for (const candidate of candidates) {
			const filePath = path.join(workspaceDir, candidate.relativePath);
			if (await fileExists(filePath)) sources.push({
				workspaceDir,
				label: candidate.label,
				filePath
			});
		}
	}
	return sources;
}
async function workspaceHasRows(namespace, workspaceDir) {
	return (await readMemoryCoreWorkspaceEntries({
		namespace,
		workspaceDir
	})).length > 0;
}
async function migrateDailyIngestion(source) {
	const state = normalizeDailyIngestionState(await readJsonFile(source.filePath));
	await writeMemoryCoreWorkspaceEntries({
		namespace: DREAMING_DAILY_INGESTION_NAMESPACE,
		workspaceDir: source.workspaceDir,
		entries: Object.entries(state.files).map(([key, value]) => ({
			key,
			value
		}))
	});
	return Object.keys(state.files).length;
}
async function migrateSessionIngestion(source) {
	const state = normalizeSessionIngestionState(await readJsonFile(source.filePath));
	const seenEntries = Object.entries(state.seenMessages).flatMap(([scope, hashes]) => Array.from({ length: Math.ceil(hashes.length / 512) }, (_, index) => ({
		key: `${scope}:${index}`,
		value: {
			scope,
			index,
			hashes: hashes.slice(index * 512, (index + 1) * 512)
		}
	})));
	await Promise.all([writeMemoryCoreWorkspaceEntries({
		namespace: DREAMING_SESSION_INGESTION_FILES_NAMESPACE,
		workspaceDir: source.workspaceDir,
		entries: Object.entries(state.files).map(([key, value]) => ({
			key,
			value
		}))
	}), writeMemoryCoreWorkspaceEntries({
		namespace: DREAMING_SESSION_INGESTION_SEEN_NAMESPACE,
		workspaceDir: source.workspaceDir,
		entries: seenEntries
	})]);
	return Object.keys(state.files).length + Object.keys(state.seenMessages).length;
}
async function migrateShortTermRecall(source) {
	const nowIso = (/* @__PURE__ */ new Date()).toISOString();
	const state = normalizeShortTermRecallStore(await readJsonFile(source.filePath), nowIso);
	await Promise.all([writeMemoryCoreWorkspaceEntries({
		namespace: SHORT_TERM_RECALL_NAMESPACE,
		workspaceDir: source.workspaceDir,
		entries: Object.entries(state.entries).map(([key, value]) => ({
			key,
			value
		}))
	}), writeMemoryCoreWorkspaceEntry({
		namespace: SHORT_TERM_META_NAMESPACE,
		workspaceDir: source.workspaceDir,
		key: "recall",
		value: { updatedAt: state.updatedAt }
	})]);
	return Object.keys(state.entries).length;
}
async function migratePhaseSignals(source) {
	const nowIso = (/* @__PURE__ */ new Date()).toISOString();
	const state = normalizeShortTermPhaseSignalStore(await readJsonFile(source.filePath), nowIso);
	await Promise.all([writeMemoryCoreWorkspaceEntries({
		namespace: SHORT_TERM_PHASE_SIGNAL_NAMESPACE,
		workspaceDir: source.workspaceDir,
		entries: Object.entries(state.entries).map(([key, value]) => ({
			key,
			value
		}))
	}), writeMemoryCoreWorkspaceEntry({
		namespace: SHORT_TERM_META_NAMESPACE,
		workspaceDir: source.workspaceDir,
		key: "phase",
		value: { updatedAt: state.updatedAt }
	})]);
	return Object.keys(state.entries).length;
}
function targetNamespacesForSource(label) {
	if (label === "daily ingestion") return [DREAMING_DAILY_INGESTION_NAMESPACE];
	if (label === "session ingestion") return [DREAMING_SESSION_INGESTION_FILES_NAMESPACE, DREAMING_SESSION_INGESTION_SEEN_NAMESPACE];
	if (label === "short-term recall") return [SHORT_TERM_RECALL_NAMESPACE];
	return [SHORT_TERM_PHASE_SIGNAL_NAMESPACE];
}
async function migrateSource(source) {
	if (source.label === "daily ingestion") return await migrateDailyIngestion(source);
	if (source.label === "session ingestion") return await migrateSessionIngestion(source);
	if (source.label === "short-term recall") return await migrateShortTermRecall(source);
	return await migratePhaseSignals(source);
}
const stateMigrations = [{
	id: "memory-core-dreams-json-to-sqlite",
	label: "Memory Core dreaming state",
	async detectLegacyState(params) {
		configureMemoryCoreDreamingState(params.context.openPluginStateKeyedStore);
		const sources = await collectLegacySources(params.config, params.env);
		if (sources.length === 0) return null;
		return { preview: sources.map((source) => `- Memory Core ${source.label}: ${source.filePath} -> SQLite plugin state`) };
	},
	async migrateLegacyState(params) {
		configureMemoryCoreDreamingState(params.context.openPluginStateKeyedStore);
		const changes = [];
		const warnings = [];
		for (const source of await collectLegacySources(params.config, params.env)) {
			if ((await Promise.all(targetNamespacesForSource(source.label).map((namespace) => workspaceHasRows(namespace, source.workspaceDir)))).some(Boolean)) {
				warnings.push(`Skipped Memory Core ${source.label} import for ${source.workspaceDir} because SQLite rows already exist; left legacy source in place`);
				continue;
			}
			let imported;
			try {
				imported = await migrateSource(source);
			} catch (err) {
				warnings.push(`Skipped Memory Core ${source.label} import for ${source.workspaceDir} because the legacy source could not be imported: ${String(err)}`);
				continue;
			}
			changes.push(`Migrated Memory Core ${source.label} -> SQLite plugin state (${imported} row(s))`);
			await archiveLegacySource({
				filePath: source.filePath,
				label: source.label,
				changes,
				warnings
			});
		}
		return {
			changes,
			warnings
		};
	}
}];
//#endregion
export { stateMigrations };
