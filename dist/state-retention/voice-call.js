import { S as asOptionalRecord, _ as resolveGlobalSingleton, u as resolveStateDir, v as hasErrnoCode } from "./utils-B-DHHhI2.js";
import "./fs-safe-CzwmM6_G.js";
import path from "node:path";
import fs from "node:fs/promises";
import "node:util";
import "node:fs";
import "@openclaw/fs-safe/root";
import "@openclaw/fs-safe/advanced";
import "@openclaw/fs-safe/durability";
import "@openclaw/fs-safe/errors";
import "node:crypto";
import "@openclaw/fs-safe/config";
import os from "node:os";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/plugins/plugin-metadata-snapshot-readers.ts
const readerLifetime = resolveGlobalSingleton(Symbol.for("openclaw.pluginMetadataSnapshotReaderCustody"), () => ({ owners: 0 }));
const readerKeys = [
	"adoptCurrentPluginMetadataSnapshotIfAbsent",
	"getCurrentPluginMetadataSnapshot",
	"resolvePluginMetadataSnapshot",
	"loadPluginMetadataSnapshot"
];
resolveGlobalSingleton(Symbol.for("openclaw.pluginMetadataSnapshotReaders"), () => ({}), (readers) => {
	if (!readerLifetime.owners) for (const key of readerKeys) delete readers[key];
}, "close-only");
//#endregion
//#region src/plugins/doctor-retired-state.ts
/** Refuses retired files without parsing, importing, or removing their contents. */
function defineRetiredPluginStateMigration(params) {
	const inspect = async (input, candidates) => {
		const sources = [];
		for (const source of candidates ?? await params.findSources(input)) {
			const sourcePath = typeof source === "string" ? source : source.directory;
			try {
				const stat = await fs.lstat(sourcePath);
				if (typeof source === "string" || !stat.isDirectory()) {
					sources.push(sourcePath);
					continue;
				}
				for (const name of await fs.readdir(sourcePath)) if (name.startsWith(source.prefix ?? "") && name.endsWith(source.suffix)) sources.push(path.join(sourcePath, name));
			} catch (error) {
				if (!hasErrnoCode(error, "ENOENT")) throw error;
			}
		}
		return [...new Set(sources)].toSorted();
	};
	const describe = (sources) => `${params.label} uses a retired pre-July 2026 format: ${sources.join(", ")}. Install OpenClaw ${params.intermediateVersion}. ${params.recoveryInstructions ?? "Run openclaw doctor --fix before upgrading to latest."} Retired files were left untouched. If the intermediate Doctor retains a listed file, verify its migration or recovery needs, back it up, and move it out of the active state directory before retrying.`;
	const warnings = async (input, candidates) => {
		const sources = await inspect(input, candidates);
		return sources.length ? [describe(sources)] : [];
	};
	return {
		id: params.id,
		label: params.label,
		collectBackupResources: async (input) => (await inspect(input)).map((source) => ({
			path: source,
			kind: "file"
		})),
		async detectLegacyState(input) {
			const preview = await warnings(input);
			return preview.length ? { preview } : null;
		},
		async migrateLegacyState(input) {
			return {
				changes: [],
				warnings: await warnings(input)
			};
		},
		async assertSupportedState(input, candidates) {
			const found = await warnings(input, candidates);
			if (found.length) throw new Error(found.join("\n"));
		}
	};
}
resolveGlobalSingleton(Symbol.for("openclaw.pluginInstallRootContext"), () => new AsyncLocalStorage());
//#endregion
//#region extensions/voice-call/src/utils.ts
/** Runtime uses the OS home; Doctor supplies the home from its migration environment. */
function resolveUserPath(input, homedir = os.homedir) {
	const trimmed = input.trim();
	if (!trimmed) return trimmed;
	return path.resolve(trimmed.replace(/^~(?=$|[\\/])/, homedir));
}
//#endregion
//#region extensions/voice-call/src/store-path.ts
/** Resolve the plugin-owned store below OpenClaw's canonical state directory. */
function resolveDefaultVoiceCallStoreDir(env = process.env) {
	return path.join(resolveStateDir(env), "voice-calls");
}
/** Read the configured voice-call store path from either package id. */
function getVoiceCallConfigStore(config) {
	for (const pluginId of ["voice-call", "@openclaw/voice-call"]) {
		const store = asOptionalRecord(config.plugins?.entries?.[pluginId]?.config)?.store;
		if (typeof store === "string" && store.trim()) return store.trim();
	}
	return "";
}
/** Resolve the voice-call store path used by legacy and plugin-state call records. */
function resolveVoiceCallStorePath(params) {
	const configuredStore = getVoiceCallConfigStore(params.config);
	if (configuredStore) return resolveUserPath(configuredStore, () => params.env.HOME?.trim() || os.homedir());
	return resolveDefaultVoiceCallStoreDir(params.env);
}
//#endregion
//#region extensions/voice-call/state-retention-api.ts
const packageName = "@openclaw/voice-call";
const stateMigrations = [defineRetiredPluginStateMigration({
	id: "voice-call-calls-jsonl-to-plugin-state",
	label: "Voice Call JSONL call log",
	intermediateVersion: "2026.9.7",
	findSources: (input) => [path.join(resolveVoiceCallStorePath(input), "calls.jsonl")]
})];
//#endregion
export { packageName, stateMigrations };
